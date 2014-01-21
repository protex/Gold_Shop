

vitals.shop.mainSetup = ( function () {

    return {

        data: {

            version: { 'main': 3, 'secondary': 0, 'minor': 1 },

            pBey: {},

            userData: {},

            object: {
                // items bought
                b: [],
                // Items for sale
                s: [],
                // Items recieved
                r: [],
                // Last item bought
                lb: '',
            },

            currentLocation: "",

        },

        settings: {

            userHasData: true,
            shoutBoxPresent: false,

        },

        locationCheck: function () {

            switch ( pb.data( 'route' ).name ) {

                case "home":

                    if ( location.href.match( /\/\?shop/ ) ) {

                        this.data.currentLocation = "shop";

                        vitals.shop.createShop();

                    }
                    break;
                default:
                    this.data.currentLocation = "other";               

            }

        },

        checkForUserData: function () {

            if ( vitals.shop.api.get() == undefined ) {

                this.userHasData = false;

                this.giveUserData();

            }

        },

        giveUserData: function () {

            if ( !this.userHasData ) {

                vitals.shop.data.userData = { b: [], s: [], r: [], lb: '' };

            }

        },

        checkForShoutBox: function () {

            if ( $( '.shoutbox' ).length > 0 && $( '.shoutbox_refresh_button' ).length > 0 ) {

                this.settings.shoutBoxPresent = true;

            }

        },

    }

} )();