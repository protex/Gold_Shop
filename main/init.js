

        /*
        * Function: init
        * purpose: do some preliminary stuff and then call the first functions that create the shop etc.
        * variables: none
        */
        init: function () {

            // add plugin image to yootil bar
            yootil.bar.add("/user?shop", pb.plugin.get('gold_shop').images.shop_20x20, "Shop", "vGoldShop");

            // check if there is existing data
            if ( pb.plugin.key( 'gold_shop' ).get() !== "" && pb.plugin.key( 'gold_shop' ).get() != undefined ) {

                // check if the existing data can be stringified
                if( !yootil.is_json( pb.plugin.key( 'gold_shop' ).get() ) ) {

                    // Set the local variable for easy access to user data
                    vitals.shop.data.object = pb.plugin.key( 'gold_shop' ).get();

                    // Set the local variable for items so the current users bought items are easily accessable
                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                    // if the existing data can be stringified, that means we had an old version installed, so we need to re-format the data
                } else {

                    // parse the data and create two empty arrays
                    var data = $.parseJSON( pb.plugin.key( 'gold_shop' ).get() ),
                        bought = [],
                        recieved = [];

                    for( i = 0; i < data.b.length; i++ ){

                        // Push all the old "bought" data into the bought variable
                        bought.push( data.b[i]['#'] );

                    }

                    // overwrite the old bought data with the re-formated version
                    data.b = bought;

                    for( i = 0; i < data.r.length; i++ ) {

                        // push all the old recieved data into the "recieved" array
                        recieved.push( data.b[i]['#'] );

                    }

                    // overwrite the old recieved data with the re-formated version
                    data.r = recieved;

                    // set loval variable fore easy access to user data
                    vitals.shop.data.object = data;

                    // Set the local variable for items so the current users bought items are easily accessable
                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                }

            } 

            // Check if were viewing the shop page
            if ( pb.data('route').name == "current_user" && location.href.match(/\?shop/) ) {

                // initiate the shop
                this.initShopPage();

            }

            // Check if were viewing a profile page
            if ( pb.data( 'route' ).name == "current_user" || pb.data( 'route' ).name == "user" ) {

                // Make sure we're not viewing the shop page
                if ( !location.href.match(/\?shop/) ) {

                    // Initiate profile gui
                    this.initProfile();

                    // Make sure we're not viewing our own profile
                    if ( pb.data('route') != "current_user" ) {

                        // Initiate give gui
                        this.initProfileGive();

                    }

                }

            }

        },
