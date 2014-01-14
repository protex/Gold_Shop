

        officialReturnItem: function ( id ) {

            vitals.shop.api.returnItem( id );

            $( document ).on( 'returnComplete', function () {

                $( '.item' ).remove();

                vitals.shop.addItems();

            } );

        },