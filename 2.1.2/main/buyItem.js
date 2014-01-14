

                buyItem: function ( id, amount ) {

                    // check if amount is undefined
                    if( amount == undefined ) {

                        // if amount is undefined, we assume the user only wanted to buy one
                        amount = 1;

                    }

                    // create a dialog
                    /*
                    * Dialoge nodes:
                    *
                    * title
                    * html
                    * buttons
                    * -confirm
                    * -cancel
                    */
                    proboards.dialog('buy_item_box',

                        {

                            // Set the title of the dialog
                            title:'Buy Item',

                            // Set the html of the dialog
                            html:'Are you sure you would like to buy this item?<br /><br /><b>Optional: How many?</b><br /><input id="buy-amount" />',

                            // Add buttons to the dialog
                            buttons: {

                                // Add a button named "confirm"
                                'Confirm': function () {

                                    // make sure the value of the optional amount override isn't anything but numbers
                                    if ( !$( '#buy-amount' ).val().match(/[^0-9]/gi) ) {

                                        // Set the user provided amount to the "amount" vairable
                                        amount = parseInt( $( '#buy-amount' ).val() );

                                        // If there are characters that are not numbers
                                    } else { 
                                        // Create error 103
                                        pb.window.error( '<i>Gold Shop Error: 103</i><br /><br />The amount you entered is not a valid number!' );

                                        // Close the dialog
                                        $( this ).dialog( 'close' );

                                        // return fals
                                        return false;

                                    }

                                    // console.log( amount );
                                    // check if the item supplied is actually an item
                                    if ( vitals.shop.isItem( id ) ) {

                                        // check if we can subtract enough money from the users wallet 
                                        // i.e does the user have enough money to buy the amount specified
                                        if ( canSubtract( id, amount ) ) {

                                            // Check if the user is allowed to buy that many of the item
                                            if ( canBuyAmount( id, amount) ) {

                                                // run buy function
                                                buy( id, amount );

                                                // run subtract function
                                                subtractMoney( id, amount );

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // if the user is not allowed to buy the amount specified
                                            } else {

                                                // create error 102
                                                pb.window.error( '<i>Gold Shop Error: 102</i><br /><br />You can\'t buy that amount!' );

                                            }

                                            // if the user does not have enough money to buy the amount specified
                                        } else {

                                            // create error 101
                                            pb.window.error( '<i>Gold Shop Error: 101</i><br /><br />You do not have enough money to buy that item!' );

                                            // close dialog
                                            $( this ).dialog( 'close' );

                                        }

                                        // if the item is not real
                                    } else {

                                        // create internal error 1
                                        pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                                    }
            
                                },

                                // create cancel button
                                'Cancel': function () {

                                    // all this button does is clos the dialog
                                    $( this ).dialog( 'close' );

                                },

                            }

                        }

                    );

                    // function to check if we can subtract the correct amount of money from the users wallet
                    /*
                    * variables:
                    * item = id of the item being bough
                    * number = the number of items the user is trying to buy
                    */
                    function canSubtract ( item, number ) {

                        // shortcut to items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if item id matches the item supplied in the function variable
                            if ( items[i].item_id == item ) {

                                // shortcut to getting the users money
                                var money = pixeldepth.monetary.get();

                                // calculating the cost
                                var cost = items[i].cost_of_item * number;

                                // if the money minus the cost is greater than or equal to 0
                                if ( money - cost >= 0 ) {

                                    // the user has enough money, return true
                                    return true;

                                    // if it's not greater than or equal to 0
                                } else {

                                    // the user does not have enough money, return false
                                    return false;

                                }

                            }

                        }

                    }

                    // subtract the money from the wallet
                    /*
                    * variables:
                    * item = id of the item being bought
                    * number = the amount the user is buying
                    */
                    function subtractMoney ( item, number) {

                        // console.log( 'subtract ' + number );
                        // shortcut to items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if the current item matches the item in the function variable
                            if ( items[i].item_id == id ) {

                                // console.log( items[i].item_id + ' , ' + (items[i].cost_of_item * number) )
                                // subtract the amount of the item times the amount that the user is buying from the wallet
                                pixeldepth.monetary.subtract( items[i].cost_of_item * number );

                            }

                        }

                    }

                    // check if the user is allowed to buy the amount specified
                    /*
                    * variables:
                    * item = id of the item being bought
                    * number = the amount the user is wanting to buy
                    */
                    function canBuyAmount ( item, number ) {

                        // shortcut to the items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if item id matches the item wanting to be bought
                            if ( items[i].item_id == item ) {

                                // check if the amount that the user is allowed to buy, minus the amount that user wants to buy, minus the user has already bought, is creater >= zero.
                                // If the amount the user is allowed to buy is "" then the user is allowed to buy infinity, and we can continue
                                if ( ( items[i].amount - number ) - vitals.shop.find_amount( vitals.shop.data.object.b.concat( vitals.shop.data.object.r ), item ).length >= 0  || items[i].amount == "" ) {

                                    // return true
                                    return true;

                                    // if it's not >= then zero
                                } else {

                                    // return false
                                    return false;

                                }

                            }

                        }

                    }

                    // the buy function
                    /*
                    * item = the item being bought
                    * number = the amount that the user is buying
                    */
                    function buy( item, number ) {

                        // create a loop that will loop through once for each item being bought
                        for ( i = 0; i < number; i++ ) {

                            // push the id of the item to the global user object
                            vitals.shop.data.object.b.push( id );

                        }

                        // set the key so data will be saved
                        proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

                    }

                },
