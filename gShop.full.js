/*******************************************
* Copyright (c) Protex Codes               *
* (protex.boards.net)                      *
* 2013 all rights reserved                 *
* Not to be redistributed                  *
* http://support.proboards.com/user/173855 *
********************************************/

var vitals = vitals || {};

window.onload = (function () {

    vitals.shop.locationCheck();

} );

vitals.shop = ( function () {

    return {

        locationCheck: function () {

            switch ( proboards.data( 'route' ).name ) {

                case "current_user":
                    vitals.shop.createShop();

                    break;
                default:
                    break;

            }

        },

        createShop: function () {

            yootil.create.page( /\?shop/, "Shop" );

            yootil.create.nav_branch( "/user\?shop", "Shop" );

            $( '.state-active:first' ).attr( 'class', '' );

            $( 'title:first' ).text( 'Shop | Items & Costs' );

            var html = "";
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom" style="padding: 5px"><center>' + vitals.shop.data.welcome_message + '</center></div>';
            html += '</div>';

            $( '#content' ).append( html );

            vitals.shop.addShopShelves();

            vitals.shop.addShopItems();

        },

        addShopShelves: function () {

            var catagories = vitals.shop.data.catagories;

            for ( i = 0; i < catagories.length; i++ ) {

                this.createShelf( catagories[i].catagory ).appendTo( '#content' );

            }

        },

        createShelf: function ( title ) {

            var id = title.replace( /\s/gi, '' );

            var html = "";
            html += '<div class="container category-' + id + '">';
            html += '<div class="title-bar" onclick="vitals.shop.showHide(\'' + id + '\')"><h1>' + title + '</h1><h1 style="float: right">(Click to Show/Hide)</h1></div>';
            html += ( proboards.plugin.get( 'gold_shop' ).settings.autohide == 'true' ) ? '<div class="content cap-bottom" style="display:none">' : '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="width: 200px;">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 50px">Buy</th><th style="width: 70px">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            return $( html );

        },

        addShopItems: function () {

            var items = vitals.shop.data.items,
                catagories = vitals.shop.data.catagories,
                data = vitals.shop.data.object;

            for ( i = 0; i < catagories.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {



                    if ( catagories[i].catagory == items[x].item_catagory ) {

                        var id = items[x].item_catagory.replace( /\s/gi, '' );


                        $( vitals.shop.createShopItem( items[x].item_name, items[x].image_of_item, items[x].description, items[x].cost_of_item, items[x].item_id, items[x].returnable, id ) ).appendTo( '#' + id );

                        $( '.item > td' ).css( 'padding', '5px' );

                    }

                }

            }

        },

        createShopItem: function ( name, image, description, cost, id, returnable, catagory ) {

            var html = '';
            html += '<tr class="item ' + catagory + '-item" id="item-' + id + '">';
            html += '<td title="' + name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + image + '" /></td>';
            html += '<td class="description" style="text-align: center">' + description + '</td>';
            html += '<td style="text-align: center;" class="cost">' + cost + '</td>';
            html += '<td style="text-align: center;" class="available" id="available-' + id + '">' + vitals.shop.recount( id ) + '</td>';
            html += '<td style="text-align: center;" class="id">' + id + '</td>';
            html += '<td class="buy-button"><center><a href="javascript:vitals.shop.officialBuyItem(\'' + id + '\')" role="button" class="button">Buy</a></center></td>';
            html += ( returnable == "true" ) ? '<td><center><a href="javascript:vitals.shop.officialReturnItem(\'' + id + '\')" role="button" class="button">Return</a></center></td>' : '<td><center><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></center></td>';
            html += '</tr>';

            return $( html );

        },

    }

} )();

vitals.shop.data = {

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
        b: [],
        s: [],
        r: [],
        lb: '',
    },

    shopItems: [],

    clear: function () {
        proboards.plugin.key( 'gold_shop' ).set( '' );
    },

    current_item: '',

};