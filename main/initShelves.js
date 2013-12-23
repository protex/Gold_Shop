

        initShelves: function () {

            // console.log( 'ran' );
            // Shortcut to catagories stored in vitals.shop.data
            var catagories = vitals.shop.data.catagories;

            for( i = 0; i < catagories.length; i++ ) {

                // Create a shelf for each catagory and append it to the page, there is no specific container holding the shelves
                this.createShelf( catagories[i].catagory ).appendTo( '#content' );

            }

        },