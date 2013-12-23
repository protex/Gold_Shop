

        /*
        * function: removeItem
        * purpose: remove bought or given items from users data
        * variabls: 
        * user = the user we are removing items from
        */
        removeItem: function ( user ) {

            var removiaryItems = vitals.shop.data.get( user ),
                boughtArr = [],
                receivedArr = [],
                items = vitals.shop.data.items,
                counter = 0,
                alreadyAddedB = [],
                alreadyAddedR = [];

            // check if the removiary actually has data
            if ( removiaryItems == undefined || removiaryItems == "" ) {

                // Give the removiary data formatted correctly
                removiaryItems = { "b":[], "r":[], "s":[], "lb":"" };

            }

            var bought = removiaryItems.b,
                received = removiaryItems.r;

            // Looped through the current users bought items
            for ( x = 0; x < bought.length; x++ ) {

                // Loop through the items array
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the current item id matches the bought item
                    if ( items[i].item_id == bought[x] ) {

                        // Check if the current item is givable
                        if ( items[i].givable == "true" ) {

                            // Check if the item has already been added
                            if ( vitals.shop.find_amount( alreadyAddedB, bought[x] ).length < 1 ) {

                                // Add the id to alreadyAddedB so we know which items have been added
                                // ReceivedArr is formatted differently and it's hard to figure out which items have been added and which have not
                                alreadyAddedB.push( bought[x] );

                                // Add the id and name to boughtArr for later use
                                boughtArr.push( {"id":bought[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            // Loop through recieved items
            for ( x = 0; x < received.length; x++ ) {

                // Loop through items array
                for ( i = 0;  i < items.length;  i++) {

                    // Check if the current item id matches the received item
                    if ( items[i].item_id == received[x] ) {

                        // Check if the item is givable
                        if ( items[i].givable == "true" ) {

                            // Check if the item has already been added
                            if ( vitals.shop.find_amount( alreadyAddedR, received[x] ).length < 1 ) {

                                // Add the id to alreadyAddedR so we knowh which items have been added
                                // ReceivedArr is formatted differently and it's hard to figure out which items have been added and which have not
                                alreadyAddedR.push( received[x] );

                                // Add the id and name to receivedArr for later use
                                receivedArr.push( {"id":received[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            // Check if boughtArr's length is greater than zero (i.e is it empty)
            if ( boughtArr.length > 0 ) {

                // console.log( boughtArr.length );
                // Blank string variable
                var boughtOptions = "";

                // Loop through the bought array
                for ( i = 0; i < boughtArr.length; i++ ) {
                    // create an option object with a value of the id of the item, and the text as the name
                    boughtOptions += '<option value="' + boughtArr[i].id + '">' + boughtArr[i].name + '</option>';

                }

            }

            // repeat for the items stored in the receivedArr
            if ( receivedArr.length > 0 ) {

                var receivedOptions = "";

                for ( i = 0; i < receivedArr.length; i++ ) {

                    receivedOptions += '<option value="' + receivedArr[i].id + '">' + receivedArr[i].name + '</option>';

                }

            }

            // Create a dialog
            /*
            * Dialog nodes:
            *
            * title
            * html
            * buttons
            * -bought
            * --dialog
            * ---title
            * ---html
            * ---buttons
            * ----give
            * ----cancel
            * ---recieved
            * -recieved
            * --dialog
            * ---title
            * ---html
            * ---buttons
            * ---give
            * ---cancel
            * -cancel
            */
            proboards.dialog('remove_item_box',

                {

                    // give the dialog a title
                    title:'Bought or Given',

                    // give the dialog html
                    html:'Would you like to remove a bought or given item?',

                    // create buttons
                    buttons: {

                        // Create a button named 'bought'
                        'Bought': function () {

                            // close the current dialog
                            $( this ).dialog( 'close' );

                            // create a second dialog
                            proboards.dialog('bought_item_box',

                                {

                                    // give the second dialog a title
                                    title: 'Remove a bought item',

                                    // Give the second dialog html
                                    html: 'Which item would you like to remove?<br /><select id="bought-items-select">' + boughtOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    // create buttons
                                    buttons: {

                                        // Create a button named 'give'
                                        'Remove' : function () {

                                            // Check if the user has the amount of bought items he would like to give
                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), false, user ) ) {

                                                // Remove the amount of items the user would like to give
                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), false, user );

                                                // Set the key for the removiary
                                                proboards.plugin.key('gold_shop').set( user, removiaryItems );

                                                // Set the local data object encase we do more stuff on this page
                                                vitals.shop.data.object = removiaryItems;

                                                $( document ).trigger( 'removeComplete' );

                                                // Close the dialog
                                                $( this ).dialog( 'close' );

                                                // if the user does not have the amount he wishes to give2
                                            } else {

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // Create error 301
                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, this user does not have that many of that item' );

                                            }


                                        },

                                        // Create a button named cancel
                                        'Cancel' : function () {

                                            // Close the dialog
                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        // Create a button named received
                        'Received': function () {

                            // close the first dialog
                            $( this ).dialog( 'close' );

                            // create a second dialog
                            proboards.dialog('received_item_box',

                                {

                                    // Give the second dialog a title
                                    title: 'Remove a received item',

                                    // Give the second dialog html
                                    html: 'Which item would you like to remove?<br /><select id="bought-items-select">' + receivedOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    // Create buttons
                                    buttons: {

                                        // Create a button named 'give'
                                        'Remove' : function () {

                                            // Check if the user has enough recieved items to give the amount he wants  to
                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true, user ) ) {

                                                // Remove the recieved items fron the user
                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true, user );

                                                // Set the key for the removiary
                                                proboards.plugin.key('gold_shop').set( user, removiaryItems );

                                                $( document ).trigger( 'removeComplete' );

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // If the current user doesn't have enough items to give the amout ne wants
                                            } else {

                                                // Close the dialog
                                                $( this ).dialog( 'close' );

                                                // Create error 301
                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, this user does not have that many of that item' );

                                            }


                                        },

                                        // Create a button named cancel
                                        'Cancel' : function () {

                                            // Close the dialog
                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        // Create a button named cancel
                        'Cancel': function () {

                            // Close the dialog
                            $( this ).dialog( 'close' );

                        },

                    }

                }

            );

        },