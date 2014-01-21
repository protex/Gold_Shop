

vitals.shop.api = ( function () {

    return {

        settings: {

            maxItemsAllowed: 20,

        },

        data: {

            retail: pb.plugin.get( 'gold_shop' ).settings.retail

        },

        set: function ( args ) {

            pb.plugin.key( 'gold_shop' ).set( args );

            $( document ).trigger( 'setCalled' );

        },

        get: function ( user ) {

            var user = ( user == undefined || user == null ) ? pb.data( 'user' ).id : user;

            return pb.plugin.key( 'gold_shop' ).get(  user );

        },

        getUrlPerameter: function ( perameter ) {

            //* below is copied from http://stackoverflow.com/questions/8460265/get-a-variable-from-url-parameter-using-javascript

            perameter = RegExp( '[?&]' + perameter.replace( /([[\]])/, '\\$1' ) + '=([^&#]*)' );

            return ( window.location.href.match( perameter ) || ['', ''] )[1];

        },


        isMessedUp: function ( object ) {

            if ( object != undefined && object != "" && object != null ) return true;
            else return false;

        },

        find_amount: function ( obj, val ) {

            var objects = [];

            for ( var i in obj ) {

                if ( !obj.hasOwnProperty( i ) ) continue;

                if ( typeof obj[i] == 'object' ) {

                    objects = objects.concat( vitals.shop.find_amount( obj[i], val ) );

                } else if ( obj[i] == val && i != '' ) {

                    objects.push( i );

                }

            }

            return objects;

        },

        buy: function ( item, amount ) {

            var amountUserBought = vitals.shop.api.find_amount( vitals.shop.data.userData.b, item ),
                amountUserReceived = vitals.shop.api.find_amount( vitals.shop.data.userData.r, item ),
                totalAmountOwned = parseInt( amountUserBought ) + parseInt( amountUserReceived ),
                usersMoney = parseFloat( pixeldepth.monetary.get() ),
                costOfTransaction,
                nameOfItem,
                items = vitals.shop.data.shopItems,
                isItemLimited = true,
                itemAmountLimit = this.settings.maxItemsAllowed,
                transactionStatus = true;

            for ( var i in items ) {

                if ( items[i].id == item ) {

                    costOfTransaction = parseFloat( amount * items[i].cost_of_item );

                    nameOfItem = items[i].item_name;

                    if ( item[i].amount == "" ) {

                        isItemLimited == false;

                    } else {

                        if ( item[i].amount <= 20 ) {

                            itemAmountLimit = parseInt( item[i].amount );

                        }

                    }

                    break;

                }

            }

            if ( isItemLimited ) {

                if ( totalAmountOwned == itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you have already bought the max amount of ' + nameOfItem + ' allowed.' );

                    return false;

                } else if ( ( totalAmountOwned + amount ) > itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you can only buy ' + ( itemAmountLimit - totalAmountOwned ) + ' more of ' + nameOfItem+ '.' );

                    return false;

                }

            } else {

                if ( totalAmountOwned == 20 ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you have reached the maximum amount of items the shop will let you buy.' );

                    return false;

                } else if ( amount > itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, that amount is greater than the max amount allowed by the shop. Please choose an amount less then twenty' );

                    return false;

                } else if ( ( totalAmountOwned + amount ) > itemAmountLimit ) {


                    pb.window.alert( 'Gold Shop Error', 'Sorry, but you cannot buy that amount as it would put you over the amount allowed by the shop. You may only buy ' + ( itemAmountLimit - totalAmountOwned ) + ' more.' );

                    return false;

                }

            }

            if ( costOfTransaction > usersMoney ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, but you do not have enough money to complete this transaction.' );


                return false;

            }

            this.addItems( item, amount, false );



        },

        _return: function ( item, amount ) {

            var amountUserBought = vitals.shop.api.find_amount( vitals.shop.data.userData.b, item ).length,
            amountUserReceived = vitals.shop.api.find_amount( vitals.shop.data.userData.r, item ).length,
            totalAmountOwned = parseInt( amountUserBought ) + parseInt( amountUserRecieved ),
            usersMoney = parseFloat( pixeldepth.monetary.get() ),
            costOfTransaction,
            nameOfItem,
            items = vitals.shop.data.shopItems,
            isItemLimited = true,
            itemAmountLimit = this.settings.maxItemsAllowed,
            transactionStatus = true;

            for ( var i in items ) {

                if ( items[i].item_id == item ) {

                    costOfTransaction = items[i].cost_of_item * amount * this.data.retail;

                    nameOfItem = items[i].item_name;

                    break;

                }

            }

            if ( amount > totalAmountOwned ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, but you do not have ' + amount + ' of ' + nameOfItem + ' to return. You have ' + totalAmountOwned );

            }

        },

        removeItems: function ( item, amount, give, user ) {

            if ( user == undefined || user == "" || user == null ) user = pb.data( 'user' ).id;

            var userData = this.get( user );
            var itemslot;

            if ( userData === undefined ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, the specified user\'s data could not be located. Try a page that:  <br />A) The user has posted on<br />B) Has been tagged on<br />C) Is their profile page' );

                return false;

            }

            if ( give ) itemSlot = userData['r'];
            else itemSlot = userData['b'];

            for ( var i = 0; i < amount; i++ ) {

                if ( itemSlot.hasOwnProperty( item ) ) {

                    itemSlot.splice( itemSlot.indexOf( item ), 1 );

                } else break;

            }

            vitals.shop.api.set( { object_id: user, value: userData } );

            pb.window.alert( 'Gold Shop Error', 'You tried to remove to many of the specified item, the Gold Shop has removed all of them' );


        },

        addItems: function ( item, amount, give, user ) {

            if ( user == undefined || user == "" || user == null ) user = pb.data( 'user' ).id;

            var userData = this.get( user );
            var itemSlot;

            if ( userData === undefined ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, the specified user\'s data could not be located. Try a page that:  <br />A) The user has posted on<br />B) Has been tagged on<br />C) Is their profile page' );

                return false;

            }

            if ( give ) itemSlot = userData['r'];
            else itemSlot = userData['b'];

            for ( var i = 0; i < amount; i++ ) {

                itemSlot.push( item );

            }

            vitals.shop.api.set( { object_id: user, value: userData } );

        }

    }

} )();