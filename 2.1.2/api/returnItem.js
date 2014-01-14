

        /*
        * function: returnItem
        * purpose: return an item already bought and refund the person who bought it
        * variables:
        * id = the id of the item to be returned
        */
        returnItem: function ( id ) {

            // Create a dialog
            proboards.dialog('return_item_box',

                {

                    // give the dialog a title
                    title:'Return Item',

                    // give the dialog html
                    html:'How Many items would you like to return?<br /><br /><input id="return-amount" />',

                    // Add buttons
                    buttons: {

                        // Create a button named 'Confirm'
                        'Confirm': function () {

                            // Get the number that the user would like to return 
                            var returnAmount = $( '#return-amount' ).val();

                            // Check to make sure that they gave a real item id
                            if ( vitals.shop.isItem( id ) ) {

                                // Check to make sure the ite mis returnable
                                if ( isReturnable( id ) ){

                                    // Check to make sure the user has the amount he would like to return
                                    if ( vitals.shop.hasAmount( id, returnAmount ) ) {

                                        // Remove the items from his data
                                        vitals.shop.removeItems( id, returnAmount );

                                        // Refund the money back to hsi wallet
                                        addMoney( id, returnAmount ); 

                                        $( document ).trigger( 'returnComplete' );

                                        // close the dialog
                                        $( this ).dialog( 'close' );
                                        
                                        // If the user doesn't have the ammount he wants to return
                                    } else {

                                        // Create error 202
                                        pb.window.error( '<i>Gold Shop Error: 202</i><br /><br />You do not have that many of this item!' );

                                    }

                                // if the item id the user supplied belongs to an item that is not returnable
                                } else {
                                    
                                    // Create error 201
                                    pb.window.error( '<i>Gold Shop Error: 201</i><br /><br />That item is not returnable!' );

                                }
                            
                            // If the item id that the user supplied is not a real item
                            } else {

                                // Create internal error 1
                                pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                            }
            
                        },

                        // Create a button named cancel
                        'Cancel': function () {

                            // Close the dialog
                            $( this ).dialog( 'close' );

                        },

                    }

                }

            ); 

            /*
            * local function: isReturnable
            * purpose: Check if an item can be returned
            * variabls: 
            * item = the id of the item in question
            */
            function isReturnable( item ) {

                // shortcut to shop items stored in vitals.shop.data
                var items = vitals.shop.data.items;

                // Loop through the items
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the current item id matches the item supplied in the funtion variable
                    if ( items[i].item_id == item ) {

                        // Check if the item is returnable
                        if ( items[i].returnable == "true" ) {

                            // Return true
                            return true;

                        // if the item is not returnable
                        } else {

                            // Return false
                            return false;

                        }

                    }

                }

            }

            /*
            * local function: addMoney
            * purpose: return the money to the wallet in a return
            * variables:
            * item = the id of the item being returned
            * amount = the amount being returned
            */
            function addMoney ( item, amount ) {

                var retail = ( proboards.plugin.get( 'gold_shop' ).settings.retail == "" )? 1:proboards.plugin.get( 'gold_shop' ).settings.retail;

                // Shortcut to shop items stored in vitals.shop.data
                var items = vitals.shop.data.items;

                // Loop through the items
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the item id matches the item in the function variable
                    if ( items[i].item_id == item ) {

                        // Add the cost of the item, multiplied by the amount, multiplied by the retail value, back to the wallet
                        pixeldepth.monetary.add( items[i].cost_of_item * amount * retail );

                    }

                }

            }

        },