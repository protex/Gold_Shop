

        officialBuyItem: function ( id ) {

            vitals.shop.api.buyItem( id );

            $( document ).on( 'buyComplete', function () {

                $( '.item' ).remove();

                vitals.shop.addItems();

            } );

        },
