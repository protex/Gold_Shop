

vitals.shop.setup = ( function () {

    return {

        locationCheck: function () {

            switch ( proboards.data( 'route' ).name ) {

                case "current_user":

                    if ( location.href.match( /\?shop/ ) ) {

                        vitals.shop.createShop();

                    }

                    break;

                default:
                    break;

            }

        },

    }

} )();