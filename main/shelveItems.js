

        /*
        * function: shelveItems
        * purpose: to display a users bought items in their profile
        * variables: none
        */
        shelveItems: function () {

            /*
            * Variables:
            * user: the id of the user who's profile we're viewing
            * data: the data of the user who's profile we're viewing
            * items: a shortcut to the items stored in vitals.shop.data
            */
            var user = ( pb.data( 'route' ).name == "current_user" ) ? pb.data( 'user' ).id : location.href.split( '/user/' )[1],
                data = vitals.shop.data.get( user ),
                items = vitals.shop.data.items;

            // Check if the user has data
            if ( data == undefined ) {

                // Give the user a blank data object
                data = { "b":[], "r":[], "s":[], "lb":"" };

            }

            // Loop through the users recieved items
            for ( i = 0; i < data.r.length; i++ ) {

                // Loop through the items in the shop
                for ( x = 0; x < items.length; x++ ) {

                    /*
                    * Variables:
                    * description: the description of the current item
                    * sliced: an empty string
                    * name: the name of the item
                    */
                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    // Check if the description of the current item is greator then 100
                    if( description.length > 100 ){

                        // If it does, slice it at the one hundredth character
                        sliced = description.slice(0 , 100);

                        // Then slice it again at the last index of a space, and add '... (Click to view more)' so the user knows to click
                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    // Check if the current recieved item, matches the id of the current item
                    if ( data.r[i] == items[x].item_id ) {
                        // Add the item to the shelf

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.r[i] + '" src="' + items[x].image_of_item + '" />' );

                        // Create a function
                        func = function (){

                            // A shortcut back to the attributes assigned to this function
                            var ac = arguments.callee;

                            // Alert the name and description of the item (name and description are stored in the function attibutes
                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );

                        }

                        //Assign the name and description to the function attributes
                        func.dname = name;
                        func.description = description;

                        // Assign the function we just click to be called when the current item is clicked on
                        $( '.' + items[x].item_id ).click(func);

                        // Give the item a whole bunch of stuff that I don't want to write down
                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            // do the same thing for the users bought items
            for ( i = 0; i < data.b.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {

                    
                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    if( description.length > 20 ){

                        sliced = description.slice(0 , 100);

                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    if ( data.b[i] == items[x].item_id ) {

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.b[i] + '" src="' + items[x].image_of_item + '"></img>' )

                        func = function (){
                            var ac = arguments.callee;
                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );
                        }
                        func.dname = name;
                        func.description = description;
                        $( '.' + items[x].item_id ).click(func);

                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            // loop through the items
            for( i=0; i<items.length; i++){

                // Check if there are any items on the shelf that match the current item
                if( $('.'+items[i].item_id).length > 1 ){

                    // loop through for each item, and remove all but one
                    for( x=$('#shelf > .'+items[i].item_id).length; x > 1; x-- ){

                        // Remove the item
                        $('#shelf > .'+items[i].item_id+':first').remove();

                    }

                }

            }

        },
