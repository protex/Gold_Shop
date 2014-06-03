

vitals.shop.mainFrame = ( function () {

    var goldShop = pb.plugin.get( 'gold_shop' );

    return {

        data: {

            location: '',
            currUser: pb.data( 'user' ).id,
            currHasData: false,
            otherHasData: false,

        },

        locationCheck: function () {

            var location = pb.data( 'route' ).name,
                href = location.href;



            switch ( location ) {

                case "current_user":
                    this.data.location = "current_user";
                    break;

                case "home":
                    this.data.location = "home";
                    break;

                case "user":
                    this.data.location = "user";
                    break;

            }

        },

        createItemDataHash: function () {

            var pluginItems = pb.plugin.get( 'gold_shop' ).settings.items,
                itemsRearranged = {};

            for ( i in pluginItems ) {

                itemsRearranged[pluginItems[i].item_id] = {

                    "image_of_item": pluginItems[i].image_of_item,
                    "item_name": pluginItems[i].item_name,
                    "cost_of_item": pluginItems[i].cost_of_item,
                    "description": pluginItems[i].description,
                    "item_id": pluginItems[i].item_id,
                    "item_category": pluginItems[i].item_category,
                    "amount": pluginItems[i].amount,
                    "givable": pluginItems[i].givable,
                    "returnable": pluginItems[i].returnable,

                };

            }

            vitals.shop.data.shopVariables.items = itemsRearranged;

        },

        locationReact: function () {

            if ( this.data.location === "home" ) {

                if ( location.href.match( /\/\?shop/ ) ) {
                    
                    if( !location.href.match( /\/\?shop\// ) ) 
                        this.createShop();

                    if ( location.href.match( /\/\?shop\/buy/ ) ) 
                        this.createBuy();

                    if ( location.href.match( /\/\?shop\/info/ ) ) 
                        this.createInfo();

                }

            }

            if ( this.data.location === "user" ) {

                this.createProfilePage();

                if ( location.href.match(/\?giveItem/) ) 
                    this.createGivePage();

                if( location.href.match( /\?removeItem/ ) )
                    this.createRemove();

                if( location.href.match( /\?addItem/ ) )
                    this.createAdd();

            }

        },

        checkForData: function () {           

            if ( typeof vitals.shop.api.get( this.data.currUser ) === "object" ) {

                this.data.currHasData = true;

                return true;

            }

        },

        loadData: function () {

            vitals.shop.data.userData = pb.plugin.key( 'gold_shop' ).get( this.data.currUser );

        },

        createShop: function () {

            vitals.shop.createShopPage();

            vitals.shop.createReturn();

            vitals.shop.createCategories();

            vitals.shop.addShopItems();

            vitals.shop.addShopCss();

        },

        createBuy: function () {
            
            vitals.shop.buyPage.createPage();

            vitals.shop.buyPage.addItemInfo();

            vitals.shop.buyPage.addForm();

            vitals.shop.buyPage.addCss();

        },

        createInfo: function () {

            vitals.shop.infoPage.createPage();

            vitals.shop.infoPage.addItemInfo();

            vitals.shop.infoPage.addCss();

        },

        createProfilePage: function () {

            vitals.shop.profilePage.createShelf();

            vitals.shop.profilePage.addItems();

            vitals.shop.profilePage.addCss();

            if ( pb.data('user').id !== pb.data('page').member.id )
                vitals.shop.profilePage.addGiveButton();

            if ( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                vitals.shop.profilePage.addRemoveButton();

            if( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                vitals.shop.profilePage.addAddButton();

        },

        createGivePage: function () {

            vitals.shop.givePage.createPage();

            vitals.shop.givePage.addDefaultContent();

            vitals.shop.givePage.addCss();

        },

        createRemove: function () {

            vitals.shop.removePage.createPage();

            vitals.shop.removePage.addDefaultContent();

            vitals.shop.removePage.addCss();

        },

        createAdd: function () {

            vitals.shop.addPage.createPage();

            vitals.shop.addPage.addDefaultContent();

            vitals.shop.addPage.addCss();

        },

        checkIfUpdate: function () {

            if ( typeof vitals.shop.api.get() === "object" ) {

                if ( vitals.shop.api.get()['lb'] != undefined ) {

                    return true;

                }

            }

            return false;

        },

        addYootilButton: function () {

            yootil.bar.add( "/?shop", vitals.shop.data.shopVariables.images.yootilBar );

        },

    }

} )();