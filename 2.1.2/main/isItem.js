

        /*
        * function: isItem
        * purpose: to check if an item is real
        * variables: item = the item in question
        */
        isItem: function ( item ) {

            // Shortcut to the items stored in vitals.shop.data
            var items = vitals.shop.data.items;

            // Loop through the items
            for ( i = 0; i < items.length; i++ ) {

                // Check if the current item matches the one passed in the function variable
                if ( items[i].item_id == item ) {

                    // return true
                    return true;

                }

            }

            // return false
            // NOTE: This will only be called if the loop finishes without returning true
            return false;

        },
