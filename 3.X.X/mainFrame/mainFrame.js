

var mainFrame = ( function () {

    return {

        name: 'mainFrame',

        data: {

            plugins: {},
            location: '',
            currUser: pb.data( 'user' ).id,
            currHasData: false,
            otherHasData: false,

        },

        initFast: true,

        init: function () {
            //* I'm not using jQuery's native "ready" function because the
            //* the errors in returned in the console are not discriptive
            //* enought to find out where the error is occuring
            var start = setInterval(function() {
                if (!$.isReady) return;
                clearInterval(start);

                if (vitals.shop.mainFrame.checkForData()) {

                    vitals.shop.mainFrame.loadData();

                }

                if (vitals.shop.mainFrame.checkIfUpdate()) {

                    vitals.shop.api.update();

                }

                vitals.shop.mainFrame.createItemDataHash();

                vitals.shop.mainFrame.handlePackageData();

                vitals.shop.mainFrame.addYootilButton();

                vitals.shop.mainFrame.locationCheck();

                vitals.shop.mainFrame.locationReact();

                vitals.shop.mainFrame.initPlugins();

            }, 100);
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

        handlePackageData: function () {

            var packageInfo = pb.plugin.get('gold_shop').settings.pack_info,
                packagedItems = pb.plugin.get('gold_shop').settings.pack_items,
                dataHash = {};

            if ( packageInfo.length > 0 ) {

                for( i in packageInfo ) {

                    dataHash[packageInfo[i].id] = {"name": packageInfo[i].name, "ID": packageInfo[i].id, "cost": packageInfo[i].cost, "description": packageInfo[i].description, "items": {}}

                }

                for( i in packagedItems ) {

                    dataHash[packagedItems[i].package].items[packagedItems[i].id] = {"amount": packagedItems[i].amount, "ID": packagedItems[i].id, "name": vitals.shop.data.shopVariables.items[packagedItems[i].id].item_name};

                }

                vitals.shop.data.shopVariables.packages = dataHash;

                vitals.shop.data.shopVariables.categories['packages'] = {'categoryName': "Packages"};

            }

        },

        locationReact: function () {

            if ( this.data.location === "home" ) {

                if ( location.href.match( /\/\?shop/ ) ) {
                    
                    if( !location.href.match( /\/\?shop\// ) )
                        this.data.location = "shop"

                    if ( location.href.match( /\/\?shop\/buy/ ) ) 
                        this.data.location = 'buyPage';

                    if ( location.href.match( /\/\?shop\/info/ ) ) 
                        this.data.location = "infoPage";

                    if ( location.href.match( /\/\?shop\/package\/buy/ ) ) 
                        this.data.location = "buyPackage";

                }

            }

            if ( this.data.location === "user" ) {

                this.data.location = "profilePage";

                if ( location.href.match(/\?giveItem/) ) 
                    this.data.location = "givePage";

                if( location.href.match( /\?removeItem/ ) )
                    this.data.location = 'removePage';

                if( location.href.match( /\?addItem/ ) )
                    this.data.location = 'addPage';

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

        register: function ( object, initFast ) {

            if ( object === undefined ) {

                throw new Error('Failed atempt to register a plugin with the Gold Shop. Plugin was undefined')

            }

            if ( object.name === null || object.name === undefined ) {

                throw new Error('Failed attempt to register a plugin with the Gold Shop. Plugin did not have a name object.');

                return false;

            }

            if ( object.init === null || object.init === undefined ) {

                throw new Error('Failed attempt to register plugin ' + object.name + ' with the Gold Shop. Plugin did not have an init function.')

                return false;

            }

            if ( this.data.plugins[object.name] !== undefined ) {

                throw new Error('Failed attempt to register plugin ' + object.name + 'with the Gold Shop. A plugin with that name already exists.')

            }

            this.data.plugins[object.name] = object;
            vitals.shop[object.name] = object; 
            
            if (object.initFast === true ) {
                object.init();
            };        

        },

        initPlugins: function () {

            var plugins = this.data.plugins,
                pluginNames = Object.keys( plugins );

            for( i in pluginNames ) {

                if( plugins[pluginNames[i]].initFast === true ){
                    continue;
                }else {
                    plugins[pluginNames[i]].init();
                }

            }

        },

        registerThis: function () {
            this.register(this);
        },

    }

} )().registerThis();