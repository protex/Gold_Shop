

        addItems: function () {

            /*
            Variables:
            items: Shortcut to items stored in vitals.shop.data
            categories: shorctut to categories stored in vitals.shop.data
            data: users data stored in vitals.shop.data
            */
            var items = vitals.shop.data.items,
                categories = vitals.shop.data.categories,
                data = vitals.shop.data.object;

            // loop through the categories
            for ( i = 0; i < categories.length; i++ ) {

                // loop through the items
                for ( x = 0; x < items.length; x++ ) {

                    // check if the current category and the category that the item belongs to match
                    if ( categories[i].catagory == items[x].item_catagory ) {  
                        
                        // create a row with all the information added
                        /*
                        * Row layout nodes:
                        *
                        * table row
                        * -table column (title = item name, class = picture, content = an image of the current item)
                        * --image
                        * -table column (class = description, content = description of the item)
                        * -table column (class = cost, content = cost of item)
                        * -table column (class = available, id = "available-" + the id of the item, content = function that will return amount of item that user can buy)
                        * -table column (id = id, content = id of item)
                        * -table colmun (no attributes, content = buy button)
                        * --anchor (href = buy function, class = button, role = button)
                        * -table column (no attributes, content = return button)
                        * --ancor (color = default or red if item not returnable, href = return function, class = button, role = button)
                        */
                        var html = '';
                            html += '<tr class="item">';
                            html += '<td title="' + items[x].item_name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + items[x].image_of_item + '" /></td>';
                            html += '<td class="description">' + items[x].description + '</td>';
                            html += '<td style="text-align: center;" class="cost">' + items[x].cost_of_item + '</td>';
                            html += '<td style="text-align: center;" class="available" id="available-' + items[x].item_id +'">' + vitals.shop.recount( items[x].item_id ) + '</td>';
                            html += '<td style="text-align: center;" class="id">' + items[x].item_id + '</td>';
                            html += '<td><a href="javascript:vitals.shop.buyItem(' + items[x].item_id + ')" role="button" class="button">Buy</a></td>';
                            html += ( items[x].returnable == "true" )? '<td><a href="javascript:vitals.shop.returnItem(' + items[x].item_id + ')" role="button" class="button">Return</a></td>' : '<td><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></td>';
                            html += '</tr>';

                        // Append the html to the correct category
                        /*
                        * Note: because we looped through the categories
                        * and gave each category the id of the number
                        * of loops, by simply looping through the categories
                        * again (which is what we're doing) we find the table id
                        * of the category
                        */
                        $( '#' + i ).append( html );

                    }

                }

            }

        },
