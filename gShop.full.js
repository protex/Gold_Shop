/*******************************************
* Copyright (c) Protex Codes               *
* (protex.boards.net)                      *
* 2013 all rights reserved                 *
* Not to be redistributed                  *
* http://support.proboards.com/user/173855 *
********************************************/

var vitals = vitals || {};

vitals.shop = ( function () {

    return {

        data: {

            shopItems: pb.plugin.get( 'gold_shop' ).settings.items,

            shopCategories: pb.plugin.get( 'gold_shop' ).settings.catagories,

            welcomeMessage: ( pb.plugin.get( 'gold_shop' ).settings.welcome_message != '' ) ? pb.plugin.get( 'gold_shop' ).settings.welcome_message : "<font size='5'>Welcome to The Shop!</font>",

        },

        settings: {

            autoHide: proboards.plugin.get( 'gold_shop' ).settings.autohide,

        },

        setup: function () {

            this.createShop();

        },

        createShop: function () {

            yootil.create.page( /\/\?shop/, "Shop" );

            yootil.create.nav_branch( "/\?shop", "Shop" );

            var html = "";
            
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom" style="padding: 5px"><center>' + this.data.welcomeMessage + '</center></div>';
            html += '</div>';

            $( html ).appendTo( '#content' );

            this.addShopShelves();

        },

        addShopShelves: function () {

            var categories = this.data.shopCategories;

            for ( var i in categories ) {

                this.createShopShelf( categories[i].catagory );

            }

            this.addShopItems();

        },

        createShopShelf: function ( title ) {

            var id = title.replace( /\s|'|"/gi, '' );

            var html = "";
            html += '<div class="container category-' + id + '">';
            html += '<div class="title-bar" onclick="vitals.shop.showHide(\'' + id + '\')"><h1>' + title + '</h1><h1 style="float: right">(Click to Show/Hide)</h1></div>';
            html += ( this.settings.autoHide == 'true' ) ? '<div class="content cap-bottom" style="display:none">' : '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="min-width: 50px; max-width: 200px">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 50px">Buy</th><th style="width: 70px">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#content' );

        },

        addShopItems: function () {

            var items = this.data.shopItems;

            for ( var i in items ) {

                this.createShopItem( items[i]['item_name'], items[i]['image_of_item'], items[i]['description'], items[i]['cost_of_item'], items[i]['item_id'], items[i]['returnable'], items[i]['item_catagory'] );

            }

        },

        createShopItem: function ( name, image, description, cost, id, returnable, category ) {

            category = category.replace( /\s|'|"/gi, '' );

            var html = '';
            html += '<tr class="item ' + category + '-item" id="item-' + id + '">';
            html += '<td title="' + name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + image + '" /></td>';
            html += '<td class="description" style="text-align: center">' + description + '</td>';
            html += '<td style="text-align: center;" class="cost">' + yootil.number_format( cost ) + '</td>';
            html += '<td style="text-align: center;" class="available" id="available-' + id + '">' + vitals.shop.recountShopItem( id ) + '</td>';
            html += '<td style="text-align: center;" class="id">' + id + '</td>';
            html += '<td class="buy-button"><center><a href="javascript:vitals.shop.buy(\'' + id + ', ' + name + '\')" role="button" class="button">Buy</a></center></td>';
            html += ( returnable == "true" )? '<td><center><a href="javascript:vitals.shop.return(\'' + id + ', ' + name + '\')" role="button" class="button">Return</a></center></td>' : '<td><center><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></center></td>';
            html += '</tr>';

            console.log( $( '#' + category ).length + ' , ' + category );

            $( html ).appendTo( '#' + category );

        },

        recountShopItem: function ( item ) {

            var items = this.data.shopItems,
                data = this.data.userData;

            for ( j = 0; j < items.length; j++ ) {

                if ( items[j].item_id == item ) {

                    if ( items[j].amount != "" ) {

                        var recalculate = items[j].amount - vitals.shop.api.find_amount( data.b, item ) - vitals.shop.api.find_amount( data.r, item );

                        if ( parseInt( recalculate ) > 0 ) {

                            return recalculate;

                            break;

                        } else {

                            return 0

                        }

                    } else {

                        return "&infin;";

                        break;

                    }

                }

            }

        },

        buy: function ( item, name ) {

            var amount, html = '';
            
            html += "Are you sure you would like to buy this item?";
            html += "<br /><br />";
            html += "How Many: <input id='buyAmountInput' />";
            html += "<tt>optional</tt>";

            pb.window.dialog( 'shopBuy', {

                title: 'Buy ' + name,
                html: html,
                buttons: {

                    "Yes" : function () {

                        if ( $( '#buyAmountInput' ).val() == "" || isNaN( parseInt( $( '#buyAmountInput' ).val() ) ) ) {  
                            
                            amount = 1

                        } else {  
                            
                            amount = parseInt( $( '#buyAmountInput' ).val() ); 
                        
                        }

                        vitals.shop.api.buy( item, amount );

                        $( this ).dialog( 'close' );

                    },

                    "No" : function () {

                        $( this ).dialog( 'close' );

                    }

                }

            } );

        },

    }

} )();

vitals.shop.mainSetup = ( function () {

    return {

        data: {

            version: { 'main': 3, 'secondary': 0, 'minor': 1 },

            pBey: {},

            userData: {},

            object: {
                b: [],
                s: [],
                r: [],
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

vitals.shop.api = ( function () {

    return {

        settings: {

            maxItemsAllowed: 20,

        },

        data: {

            retail: pb.plugin.get( 'gold_shop' ).settings.retail

        },

        set: function ( args ) {

            pb.plugin.key( 'gold_shop' ).set( args );

            $( document ).trigger( 'setCalled' );

        },

        get: function ( user ) {

            var user = ( user == undefined || user == null ) ? pb.data( 'user' ).id : user;

            return pb.plugin.key( 'gold_shop' ).get(  user );

        },

        getUrlPerameter: function ( perameter ) {

            //* below is copied from http://stackoverflow.com/questions/8460265/get-a-variable-from-url-parameter-using-javascript

            perameter = RegExp( '[?&]' + perameter.replace( /([[\]])/, '\\$1' ) + '=([^&#]*)' );

            return ( window.location.href.match( perameter ) || ['', ''] )[1];

        },


        isMessedUp: function ( object ) {

            if ( object != undefined && object != "" && object != null ) return true;
            else return false;

        },

        find_amount: function ( obj, val ) {

            var objects = [];

            for ( var i in obj ) {

                if ( !obj.hasOwnProperty( i ) ) continue;

                if ( typeof obj[i] == 'object' ) {

                    objects = objects.concat( vitals.shop.find_amount( obj[i], val ) );

                } else if ( obj[i] == val && i != '' ) {

                    objects.push( i );

                }

            }

            return objects;

        },

        buy: function ( item, amount ) {

            var amountUserBought = vitals.shop.api.find_amount( vitals.shop.data.userData.b, item ),
                amountUserReceived = vitals.shop.api.find_amount( vitals.shop.data.userData.r, item ),
                totalAmountOwned = parseInt( amountUserBought ) + parseInt( amountUserReceived ),
                usersMoney = parseFloat( pixeldepth.monetary.get() ),
                costOfTransaction,
                items = vitals.shop.data.shopItems,
                isItemLimited = true,
                itemAmountLimit = this.settings.maxItemsAllowed,
                transactionStatus = true;

            for ( var i in items ) {

                if ( items[i].id == item ) {

                    costOfTransaction = parseFloat( amount * items[i].cost_of_item );

                    if ( item[i].amount == "" ) {

                        isItemLimited == false;

                    } else {

                        if ( item[i].amount <= 20 ) {

                            itemAmountLimit = parseInt( item[i].amount );

                        }

                    }

                    break;

                }

            }

            if ( isItemLimited ) {

                if ( totalAmountOwned == itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you have already bought the max amount alowed for that item.' );

                    return false;

                } else if ( ( totalAmountOwned + amount ) > itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you can only buy ' + ( itemAmountLimit - totalAmountOwned ) + ' more of that item.' );

                    return false;

                }

            } else {

                if ( totalAmountOwned == 20 ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, you have reached the maximum amount of items the shop will let you buy.' );

                    return false;

                } else if ( amount > itemAmountLimit ) {

                    pb.window.alert( 'Gold Shop Error', 'Sorry, that amount is greater than the max amount allowed by the plugin. Please choose an amount less then twenty' );

                    return false;

                } else if ( ( totalAmountOwned + amount ) > itemAmountLimit ) {


                    pb.window.alert( 'Gold Shop Error', 'Sorry, but you cannot buy that amount as it would put you over the amount allowed by the plugin. You may only buy ' + ( itemAmountLimit - totalAmountOwned ) + ' more.' );

                    return false;

                }

            }

            if ( costOfTransaction > usersMoney ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, but you do not have enough money to complete this transaction.' );


                return false;

            }

            this.addItems( item, amount, false );



        },

        _return: function ( item, amount ) {

            var amountUserBought = vitals.shop.api.find_amount( vitals.shop.data.userData.b, item ).length,
            amountUserReceived = vitals.shop.api.find_amount( vitals.shop.data.userData.r, item ).length,
            totalAmountOwned = parseInt( amountUserBought ) + parseInt( amountUserRecieved ),
            usersMoney = parseFloat( pixeldepth.monetary.get() ),
            costOfTransaction,
            nameOfItem,
            items = vitals.shop.data.shopItems,
            isItemLimited = true,
            itemAmountLimit = this.settings.maxItemsAllowed,
            transactionStatus = true;

            for ( var i in items ) {

                if ( items[i].item_id == item ) {

                    costOfTransaction = items[i].cost_of_item * amount * this.data.retail;

                    nameOfItem = items[i].item_name;

                }

            }

            if ( amount > totalAmountOwned ) {

                pb.window.alert( 'Gold Shop Error', 'Sorry, but you do not have ' + amount + ' of ' + nameOfItem + ' to return. You have ' + totalAmountOwned );

            }

        },

        removeItems: function ( item, amount, give, user ) {

            if ( user == undefined || user == "" || user == null ) user = pb.data( 'user' ).id;

            var userData = this.get( user );
            var itemslot;

            if ( give ) itemSlot = userData['r'];
            else itemSlot = userData['b'];

            for ( var i = 0; i < amount; i++ ) {

                itemSlot.splice( itemSlot.indexOf( item ), 1 );

            }

            vitals.shop.api.set( { object_id: user, value: userData } );


        },

        addItems: function ( item, amount, give, user ) {

            if ( user == undefined || user == "" || user == null ) user = pb.data( 'user' ).id;

            var userData = this.get( user );
            var itemSlot;

            if ( give ) itemSlot = userData['r'];
            else itemSlot = userData['b'];

            for ( var i = 0; i < amount; i++ ) {

                itemSlot.push( item );

            }

            vitals.shop.api.set( { object_id: user, value: userData } );

        }

    }

} )();
    
//* This method is copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FindexOf#Polyfill
if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function ( searchElement, fromIndex ) {
        if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if ( Math.abs( fromIndex ) === Infinity ) {
            fromIndex = 0;
        }

        if ( fromIndex < 0 ) {
            fromIndex += length;
            if ( fromIndex < 0 ) {
                fromIndex = 0;
            }
        }

        for ( ; fromIndex < length; fromIndex++ ) {
            if ( this[fromIndex] === searchElement ) {
                return fromIndex;
            }
        }

        return -1;
    };
}

//* I'm not using jQuery's native "ready" function because the
//* the errors in returned in the console are not discriptive
//* enought to find out where the error is occuring
var tid = setInterval( function () {
    if ( document.readyState !== 'interactive' ) return;
    clearInterval( tid );
    
    vitals.shop.mainSetup.checkForUserData();

    vitals.shop.mainSetup.giveUserData();

    vitals.shop.mainSetup.locationCheck();

}, 100 );

