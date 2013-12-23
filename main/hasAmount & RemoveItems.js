

        /*
        * function: hasAmount
        * purpose: check if we can remove a certain amount of items from the users bought or received items
        * Variables:
        * item = the item in question
        * amount = a the amount we are checking
        * received = are we checking received or bought items?
        */
        hasAmount: function ( item, amount, received, user ) {

            var items,
                count = 0;

            // Check if the recieved variable was set to tru
            if ( received ) {

                // Check if the user function variable wasn't defined
                if ( user == undefined || user == "" ) {

                    // Set items to be the current users received items
                    items = vitals.shop.data.object.r;

                    // if the user function variable was defined
                } else {

                    // Set items to be the users received
                    items = vitals.shop.data.get( user ).r;

                }

                // If recieved is not set to true
            } else {

                // check if the user function variable wasn't defined
                if ( user == undefined || user == "" ) {

                    //console.log('correct');
                    // Set items to be the current users bought items
                    items = vitals.shop.data.object.b;

                // if the user function variable was defined
                } else {
                    
                    // Set the items to be the users bought items
                    items = vitals.shop.data.get( user ).b;

                }

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
        removeItems: function ( item, amount, received, user ) {

            var items,
                count = 0;

            if ( received ) {

                // Check if the user function variable wasn't defined
                if ( user == undefined || user == "" ) {

                    // Set items to be the current users received items
                    items = vitals.shop.data.object.r;

                    // if the user function variable was defined
                } else {

                    // Set items to be the users received
                    items = vitals.shop.data.get( user ).r;

                }

                // If recieved is not set to true
            } else {

                // check if the user function variable wasn't defined
                if ( user == undefined || user == "" ) {

                    // Set items to be the current users bought items
                    items = vitals.shop.data.object.b;

                // if the user function variable was defined
                } else {
                    
                    // Set the items to be the users bought items
                    items = vitals.shop.data.get( user ).b;

                }

            }

            var loops = items.length;

            // Loop through the items
            for( i = 0; i < loops; i++ ) {

                // Make sure we havent subtracted the correct amount
                if ( count != amount ) {

                    // Check if the current item is the item we wish to remove
                    if( items[i - count] == item ) {

                        // Splice the array at "i" (i.e the current item
                        items.splice( i - count, 1 );

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