/***** Gold Shop update tool ******/
/*
This is for updating Gold Shop from
Version 1.3.2 to Version 1.3.x
as there are significant changes
in the structure of the code 
so I had to create a plugin that
will backup all the users data
so that when the new code installs
it will just be able to get the data
from the backup (I will be using
localStorage as the backup storage)
*/

$( function () {

    if ( typeof vitals == 'undefined' ) {

        vitals = {};

    }

    if ( proboards.plugin.key( 'gold_shop' ).get() != undefined && proboards.plugin.key( 'gold_shop' ).get() != '' ) {

        vitals.shopUpdater.setup();

    }

    vitals.shopUpdater = ( function () {

        return {

            version132: true,
            alreadySaved: false,

            data: { 'b': [], 'r': [], lb: '', s: [] },

            setup: function () {

                if ( yootil.is_json( proboards.plugin.key( 'gold_shop' ).get() ) ) {

                    this.version132 = false;

                }

                if ( localStorage.getItem( 'goldShopUpdate' ) != undefined ) {

                    if ( yootil.is_json( localStorage.getItem( 'goldShopUpdate' ) ) ) {

                        this.alreadySaved = true;

                    } else {

                        this.init()

                    }

                } else {

                    this.init();

                }

            },

            init: function () {

                var oldData = proboards.plugin.key( 'gold_shop' ).get(),
                    newData = this.data;

                if ( version132 ) {

                    newData = oldData;

                } else {

                    oldData = JSON.parse( oldData );

                    newData = oldData;

                    localStorage.setItem( JSON.stringify( newData ) );

                }

            },

        }

    } );

} );
