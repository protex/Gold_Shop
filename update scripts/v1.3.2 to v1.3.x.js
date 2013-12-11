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

                console.log( 'init' );

                var oldData = proboards.plugin.key( 'gold_shop' ).get(),
                    newData = this.data;

                if ( this.version132 ) {

                    newData = oldData;

                    localStorage.setItem( 'goldShopUpdate', JSON.stringify( newData ) );

                } else {

                    oldData = JSON.parse( oldData );
                    var bought = oldData['b'],
                        received = oldData['r'];

                    for ( i in bought ) {

                        newData['b'].push( bought[i]['#'] );

                    }

                    for ( i in received ) {

                        newData['r'].push( received[i]['#'] );

                    }

                    localStorage.setItem( 'goldShopUpdate', JSON.stringify( newData ) );

                }

            },

        }

    } )();

    if ( proboards.plugin.key( 'gold_shop' ).get() != undefined && proboards.plugin.key( 'gold_shop' ).get() != '' ) {

        console.log( 'setup' );

        vitals.shopUpdater.setup();

    }

    if ( location.href.match( /\?shop/i ) ) {

        $( '#content' ).remove();

        alert( 'The shop is under construction, please come back later' );

    }

    if ( location.href.match( /\/user/i ) ) {

        if ( $( '#give_item' ).length > 0 ) {

            $( '#give_item' ).remove();

        }

        if ( $( '#remove_item' ).length > 0 ) {

            $( '#remove_item' ).remove();

        }

    }

} );
