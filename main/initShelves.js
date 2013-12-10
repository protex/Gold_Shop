

        initShelves: function () {

            // console.log( 'ran' );
            // Shortcut to categories stored in vitals.shop.data
            var categories = vitals.shop.data.categories;

            for( i = 0; i < categories.length; i++ ) {

                // Create a shelf for each catagory and append it to the page, there is no specific container holding the shelves
                this.createShelf( categories[i].catagory, i ).appendTo( '#content' );

            }

        },