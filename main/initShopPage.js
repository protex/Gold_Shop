

        initShopPage: function () {

            // Create a page named shop (this basically just removes the content of the page)
            yootil.create.page(/\?shop/, "Shop");

            // Add a navigation tree link
            yootil.create.nav_branch("/user\?shop", "Shop");

            // We don't want the menu to say we're viewing the profile page, so we remove the class of "state-active" so the "profile" button isn't highlighted on the menu
            $('.state-active:first').attr('class','');

            // Set the title of the page, we're not viewing the profile anymore
            $('title:first').text('Shop | Items & Costs');

            // Create the welcome message html
            var html = "";
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom"><center>' + vitals.shop.data.welcome_message + '</center></div>';
            html += '</div>';

            // Append the html to the page
            $( '#content' ).append( html );

            // Initiate the catagories or "shelves"
            vitals.shop.initShelves();

            // Then add the items to the shelves
            vitals.shop.addItems();

        },