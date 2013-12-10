

        /*
        * function: hasAmount
        * purpose: check if we can remove a certain amount of items from the users bought or received items
        * Variables:
        * item = the item in question
        * amount = a the amount we are checking
        * received = are we checking received or bought items?
        */
        hasAmount: function ( item, amount, received ) {

            var items,
                count = 0;

            // Check if the recieved variable was set to tru
            if ( received ) {

                // Set items to be the users recieved items
                items = vitals.shop.data.object.r;

                // If recieved is not set to true
            } else {

                // Set items to be the users bought items
                items = vitals.shop.data.object.b;

            }

            // Loop through the items
            for( i = 0; i < items.length; i++ ) {

                // Check if the looped item is the same as the item in the function variable
                // If it is, add on to the count
                if( items[i] == item ) count++;
                
            }

            // Check if the count is greater >= the amount the user wishes to give
            if ( count >= amount ) {

                // return true
                return true

                // If it's not >= the amount
            } else {

                // return false
                return false;

            }

        },

        /*
        * function: removeItems
        * purpose: remove items from the users reveived or bought items
        * Variables:
        * item = the item in question
        * amount = a cthe amount we are remove
        * received = are we removing received or bought items?
        */
        removeItems: function ( item, amount, received ) {

            var items,
                count = 0;

            // Check if the received variable was passed as true
            if ( received ) {

                // Set the items to be the users received items
                items = vitals.shop.data.object.r;

                // If the received variable wasn't passed as true, or wasn't passed at all
            } else {

                // Set the items as the users bought items
                items = vitals.shop.data.object.b;

            }

            // Loop through the items
            for( i = 0; i < items.length; i++ ) {

                // Make sure we havent subtracted the correct amount
                if ( count != amount ) {

                    // Check if the current item is the item we wish to remove
                    if( items[i] == item ) {

                        // Splice the array at "i" (i.e the current item
                        items.splice( i, 1 );

                        // Add one to the counter
                        count++;

                    }

                    // If we've subtracted the correct amount
                } else {

                    // Break the loop and continue
                    break;

                }
                
            }

            // Save the new object in our data
            proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

        },