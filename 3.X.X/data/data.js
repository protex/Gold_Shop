

vitals.shop.data = {

    version: { 'main': 3, 'secondary': 0, 'minor': 1 },

    items: proboards.plugin.get( 'gold_shop' ).settings.items,

    catagories: proboards.plugin.get( 'gold_shop' ).settings.catagories,

    set: function ( x, y ) {
        if ( x == "" ) {
            x = y;
            y = undefined;
        }
        proboards.plugin.key( 'gold_shop' ).set( x, y );
    },

    get: function ( x ) {

        if ( x == undefined ) x = pb.data( 'user' ).id;

        return proboards.plugin.key( 'gold_shop' ).get( x );

    },

    welcome_message: ( proboards.plugin.get( 'gold_shop' ).settings.welcome_message != '' ) ? proboards.plugin.get( 'gold_shop' ).settings.welcome_message : "<font size='5'>Welcome to The Shop!</font>",

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

    shopItems: [],

    clear: function () {
        proboards.plugin.key( 'gold_shop' ).set( '' );
    },

    current_item: '',

};