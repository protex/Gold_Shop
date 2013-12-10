
        
        /*
        * Function *Recount*
        * Purpose: Recount the number of items a user is allowed to buy
        * Variables: 1
        * Variables:
        * item: the item we would like to recount
        */
        recount: function ( item ) {

            /* 
            * Variables:
            * items: shortcut to the items stored in vitals.shop.data
            * data: shorctut to the users data stored in vitals.shop.data
            */
            var items = vitals.shop.data.items,
                data = vitals.shop.data.object;

            // Lop through the items
            for ( i = 0; i < items.length; i++ ) {

                // Check if current item id matches the item passed in the function variable
                if ( items[i].item_id == item ) {

                    // Make sure the items amount is not set to nothing
                    if ( items[i].amount != "" ) {

                        // Recalculate the items amount, minus the amount that the user has in his bought items, minus the amount he has in his received items
                        var recalculate = items[i].amount - find_amount( data.b, item ) - find_amount( data.r, item );

                        // Make sure the recalculated amount is not less then zero
                        if( parseInt( recalculate ) > 0 ) {

                            // Return the recalculated amount
                            return recalculate;

                            // break the loop and continue
                            break;

                            // If the recalculated amount is less then zero
                        } else {

                            // Return zero
                            return 0

                        }

                        // If the items amount is set to ""
                    } else {

                        // The amount is supposed to be infinity, so return the infinity symbole
                        return "&infin;";

                        // break the loop and continue 
                        break;

                    }

                }

            }

        },