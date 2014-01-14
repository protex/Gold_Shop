

vitals.shop = ( function () {

    return {

        createShop: function () {

            // Create a page named shop (this basically just removes the content of the page)
            yootil.create.page( /\?shop/, "Shop" );

            // Add a navigation tree link
            yootil.create.nav_branch( "/user\?shop", "Shop" );

            // We don't want the menu to say we're viewing the profile page, so we remove the class of "state-active" so the "profile" button isn't highlighted on the menu
            $( '.state-active:first' ).attr( 'class', '' );

            // Set the title of the page, we're not viewing the profile anymore
            $( 'title:first' ).text( 'Shop | Items & Costs' );

            // Create the welcome message html
            var html = "";
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom" style="padding: 5px"><center>' + vitals.shop.data.welcome_message + '</center></div>';
            html += '</div>';

            // Append the html to the page
            $( '#content' ).append( html );

            // Initiate the catagories or "shelves"
            vitals.shop.addShopShelves();

            // Then add the items to the shelves
            vitals.shop.addShopItems();

        },

        addShopShelves: function () {

            // console.log( 'ran' );
            // Shortcut to catagories stored in vitals.shop.data
            var catagories = vitals.shop.data.catagories;

            for ( i = 0; i < catagories.length; i++ ) {

                // Create a shelf for each catagory and append it to the page, there is no specific container holding the shelves
                this.createShelf( catagories[i].catagory ).appendTo( '#content' );

            }

        },

        createShelf: function ( title ) {

            var id = title.replace( /\s/gi, '' );

            // Create the html of the shelve
            // The html consists of:
            /*
            * container with a class of category plus the supplied title
            * -title bar with the title of the category
            * -the main area
            * --the table with all the items in it
            * ---the head
            * ----item head
            * ----description head
            * ----cost head
            * ----available head
            * ----id head
            * ----buy head
            * ----return head
            * ---the body (id of the body is the id supplied)
            */
            var html = "";
            html += '<div class="container category-' + id + '">';
            html += '<div class="title-bar" onclick="vitals.shop.showHide(\'' + id + '\')"><h1>' + title + '</h1><h1 style="float: right">(Click to Show/Hide)</h1></div>';
            html += ( proboards.plugin.get( 'gold_shop' ).settings.autohide == 'true' ) ? '<div class="content cap-bottom" style="display:none">' : '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="width: 200px;">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 50px">Buy</th><th style="width: 70px">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            // Return the created element
            return $( html );

        },

        addShopItems: function () {

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

                        var id = items[x].item_catagory.replace( /\s/gi, '' );

                        // Append the html to the correct category
                        /*
                        * Note: because we looped through the catagories
                        * and gave each category the id of the number
                        * of loops, by simply looping through the catagories
                        * again (which is what we're doing) we find the table id
                        * of the category
                        */

                        $( vitals.shop.createShopItem( items[x].item_name, items[x].image_of_item, items[x].description, items[x].cost_of_item, items[x].item_id, items[x].returnable, id ) ).appendTo( '#' + id );

                        $( '.item > td' ).css( 'padding', '5px' );

                    }

                }

            }

        },

        createShopItem: function ( name, image, description, cost, id, returnable, catagory ) {

            var html = '';
            html += '<tr class="item ' + catagory + '-item" id="item-' + id + '">';
            html += '<td title="' + name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + image + '" /></td>';
            html += '<td class="description" style="text-align: center">' + description + '</td>';
            html += '<td style="text-align: center;" class="cost">' + cost + '</td>';
            html += '<td style="text-align: center;" class="available" id="available-' + id + '">' + vitals.shop.recount( id ) + '</td>';
            html += '<td style="text-align: center;" class="id">' + id + '</td>';
            html += '<td class="buy-button"><center><a href="javascript:vitals.shop.officialBuyItem(\'' + id + '\')" role="button" class="button">Buy</a></center></td>';
            html += ( returnable == "true" ) ? '<td><center><a href="javascript:vitals.shop.officialReturnItem(\'' + id + '\')" role="button" class="button">Return</a></center></td>' : '<td><center><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></center></td>';
            html += '</tr>';

            return $( html );

        },

    }

} )();