

        addItems: function () {

            /*
            * Variables:
            * items: Shortcut to items stored in vitals.shop.data
            * catagories: shorctut to catagories stored in vitals.shop.data
            * data: users data stored in vitals.shop.data
            */
            var items = vitals.shop.data.items,
                catagories = vitals.shop.data.catagories,
                data = vitals.shop.data.object;

            // loop through the catagories
            for ( i = 0; i < catagories.length; i++ ) {

                // loop through the items
                for ( x = 0; x < items.length; x++ ) {



                    // check if the current category and the category that the item belongs to match
                    if ( catagories[i].catagory == items[x].item_catagory ) {  

                        var id =  items[x].item_catagory.replace( ' ', '' );

                        // Append the html to the correct category
                        /*
                        * Note: because we looped through the catagories
                        * and gave each category the id of the number
                        * of loops, by simply looping through the catagories
                        * again (which is what we're doing) we find the table id
                        * of the category
                        */

                        console.log ( items[x].item_catagory );

                        $( vitals.shop.createItem( items[x].item_name, items[x].image_of_item, items[x].description, items[x].cost_of_item, items[x].item_id, items[x].returnable ) ).appendTo( '#' + id );

                        console.log( i );

                    }

                }

            }

        },
