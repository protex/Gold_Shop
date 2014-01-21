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