

profilePage = (function() {

    return {

        name: 'profilePage',

        module: 'shop',

        data: {

            profileId: ( ( pb.data( 'route' ).name.match( /user/ ) )? pb.data( 'page' ).member.id: pb.data( 'user' ).id ),
            userData: '',
            shopNameHeight: ( goldShop.settings.profile_page_text_size.match( /[^1-7]/ ) )? 6: goldShop.settings.profile_page_text_size,

            styles: {

                itemInfoBox: {
                    "float": "right",
                    "margin-left": "10px",
                    "width": "200px",
                    "height": "70px",
                },

                itemShelf: {
                    "min-height": "70px",
                },

                item: {
                    "float": "left",
                    "opacity": "0.5",
                    "filter": "Alpha(opacity=50)",
                    "max-width": "50px",
                    "max-height": "50px",
                },

                itemHover: {
                    "opacity": "1",
                    "filter": "Alpha(opacity=100)",
                },

                itemImage: {
                    "max-width": "50px",
                    "max-height": "50px",
                },

                shelfHeader: {
                    "width": "100%",
                    "text-align": "center",
                },

            },

        },

        init: function () {

            if ( vitals.shop.mainFrame.data.location === "profilePage" ) {

                vitals.shop.profilePage.createShelf();

                vitals.shop.profilePage.addItems();

                vitals.shop.profilePage.addCss();

                if ( pb.data('user').id !== pb.data('page').member.id )
                    vitals.shop.profilePage.addGiveButton();

                if ( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                    vitals.shop.profilePage.addRemoveButton();

                if( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                    vitals.shop.profilePage.addAddButton();

            }


        },

        createShelf: function () {

            this.data.userData = vitals.shop.api.get(( pb.data( 'route' ).name.match( /user/ ) ) ? pb.data( 'page' ).member.id : pb.data( 'user' ).id );

            if ( this.data.userData == "undefined" || this.data.userData == undefined )
                this.data.userData = {b:{},r:{}};

            if ( Object.keys( this.data.userData.b ).length > 0 || Object.keys( this.data.userData.r ).length > 0 ) {

                $( "div.content-box.center-col td.headings:contains(Posts)" ).parentsUntil( 'td' ).last().before( yootil.create.profile_content_box( 'items-container' ).css( this.data.styles.itemShelf ).append( '<h' + this.data.shopNameHeight + ' id="shelf-header">' + vitals.shop.data.shopVariables.shopName + ' Items' + '</h' + this.data.shopNameHeight + '>' ) );

                $( '#items-container' ).before( yootil.create.profile_content_box( 'item-info-box' ).css( this.data.styles.itemInfoBox ) );

            }

        },

        addItems: function (user) {

            var bought = (user === null )? this.data.userData.b: vitals.shop.api.get(user).b,
                received = (user === null )? this.data.userData.r: vitals.shop.api.get(user).r,
                items = vitals.shop.data.shopVariables.items,
                itemKeys = Object.keys( items );

            if ( bought !== undefined && received !== '' ) {                    

                for ( var i = 0; i < itemKeys.length; i++ ) {

                    var total = 0,
                        boughtTotal = 0,
                        receivedTotal = 0;

                    if ( received[itemKeys[i]] != undefined || bought[itemKeys[i]] != undefined ) {

                        if ( bought[itemKeys[i]] != undefined ) {

                            total = total + parseInt( bought[itemKeys[i]] );

                            boughtTotal = parseInt( bought[itemKeys[i]] );

                        }

                        if ( received[itemKeys[i]] != undefined ) {

                            total = total + parseInt( received[itemKeys[i]] );

                            receivedTotal = parseInt( received[itemKeys[i]] );

                        }

                        if ( total > 0 ) {

                            vitals.shop.profilePage.createItem( itemKeys[i], total, boughtTotal, receivedTotal );

                        }   

                    }

                }

            }

        },

        createItem: function ( itemId, total, boughtTotal, receivedTotal ) {

            var items = vitals.shop.data.shopVariables.items,
                itemData = items[itemId],
                html = '';

            html += '<div class="shop-item" onmouseover="vitals.shop.profilePage.itemHover(this)" onmouseout="vitals.shop.profilePage.itemHoverOut(this)">';
            html += '<a href="/?shop/info&id=' + itemId + '">';
            html += '<img class="item-image" src="' + itemData.image_of_item + '" title="Click to go to information page" />';
            html += '</a>';
            html += '</div>';

            $( html ).data( { id: itemId, name: itemData.item_name, total: total, bought: boughtTotal, received: receivedTotal } ).appendTo( '#items-container' );

        },

        addCss: function () {

            $( '.shop-item' ).css( this.data.styles.item );

            $( '.item-image' ).css( this.data.styles.itemImage );

            $( '#shelf-header' ).css( this.data.styles.shelfHeader );

        },

        itemHover: function ( obj ) {

            $( obj ).css( this.data.styles.itemHover );

            $( '#item-info-box' ).html(
                "Name: " + $( obj ).data().name +
                "<br />" +
                "Total: " + $( obj ).data().total +
                "<br />" +
                "Bought: " + $( obj ).data().bought +
                "<br />" +
                "Received: " + $( obj ).data().received +
                "<br />" +
                "Id: " + $( obj ).data().id
                );

        },

        itemHoverOut: function ( obj ) {

            $( obj ).css( this.data.styles.item );

            $( '#item-info-box' ).html( '' );

        },

        addGiveButton: function ( ) {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?giveItem" }).text('Give Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        },

        addRemoveButton: function () {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?removeItem" }).text('Remove Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        },

        addAddButton: function () {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?addItem" }).text('Add Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        }, 

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

    }

} )().register();

