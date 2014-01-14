

        officialGive: function ( user ) {

            vitals.shop.api.give( user );

            $( document ).on( 'giveComplete', function () {

                $( '#shelf' ).children().remove();

                vitals.shop.shelveItems();

            } );

        },