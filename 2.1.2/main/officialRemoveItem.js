

        officialRemoveItem: function ( user ) {

            vitals.shop.api.removeItem( user );

            $( document ).on( 'removeComplete', function () {

                $( '#shelf' ).children().remove();

                vitals.shop.shelveItems();

            } );

        },
