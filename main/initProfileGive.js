

        /*
        * function initProfileGive
        * purpose: add the "give" button that calls the "give" function
        * variablse: none
        */
        initProfileGive: function () {

            // Get the user id of the profile we're viewing
            var user = location.href.split( "/user/" )[1];

            // Make sure that we're not viwing our own profile
            if ( user != pb.data('user').id ) {

                // Create an element and append it before the new conversation button
                /*
                * element nodes:
                * anchor: href = calls the give function, class = "button"
                */
                $( '[href="/conversation/new/' + user + '"]' ).before( '<a href="javascript:vitals.shop.give('+ user +')" class="button">Give</a>' );

            }

        },