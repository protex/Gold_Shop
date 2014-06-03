var vitals = vitals || {};

vitals.shop = (function () {

    var goldShop = pb.plugin.get('gold_shop');

    return {

        data: {

            userData: {

                b: {},

                r: {},

            },

            user: {

                username: pb.data('user').username,
                displayname: pb.data('user').name,
                id: pb.data('user').id,

            },

            shopVariables: {

                shopName: goldShop.settings.shopName,
                shopMessage: goldShop.settings.welcome_message,
                categories: goldShop.settings.categories,
                items: goldShop.settings.items,

                images: {
                    dollar: goldShop.images.DollarSmall,
                    information: goldShop.images.InformationSmall,
                    dollarLarge: goldShop.images.DollarLarge,
                    yootilBar: goldShop.images.shop_20x20,
                    infoLarge: goldShop.images.InformationLarge,
                    shopLarge: goldShop.images.ShopLarge,
                },

                styles: {

                    shopItem: {
                        "border-width": goldShop.settings.item_border_width + 'px',
                        "border-style": goldShop.settings.item_border_style,
                        "border-color": goldShop.settings.item_border_color,
                        "width": goldShop.settings.item_total_width,
                        "height": goldShop.settings.item_total_height,
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                        "padding": "0px",
                        "margin": "5px",
                        "float": "left",
                    },

                    shopItemName: {
                        "width": "100%",
                        "font-weight": "bolder",
                        "text-align": "center",
                    },

                    shopContent: {
                        "padding": "auto",
                    },

                    shopItemInner: {
                        "position": "relative",
                        "width": "100%",
                        "height": "100%",
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                    },

                    shopItemInfo: {
                        "margin-left": "10px"
                    },

                    shopItemOverlay: {
                        "position": "absolute",
                        "z-index": "50000",
                        "left": "0",
                        "top": "0",
                        "background-color": "grey",
                        "opacity": "0.5",
                        "filter": "Alpha(opacity=50)",
                        "width": "100%",
                        "height": "100%",
                        "display": "none",
                        "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                        "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                        "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                        "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                    },

                    shopItemIcon: {
                        "margin-top": "15px",
                        "cursor": "pointer",
                    },

                    shopItemIconLeft: {
                        "float": "left",
                        "margin-left": "10px",
                    },

                    shopItemIconRight: {
                        "float": "right",
                        "margin-right": "10px",
                    },

                    contentBottom: {
                        "display": (goldShop.settings.autohide == "true") ? "none" : "",
                    },

                    returnImageBox: {
                        "width": "225px",
                        "height": "225px",
                    },

                },

            },

        },

        createShopPage: function () {

            yootil.create.page(/\/\?shop/);

            $('#content').append('<div id="shop-container"></div>');

            console.log( pixeldepth.monetary.get() );

            yootil.create.container(this.data.shopVariables.shopName + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get(true) + ')', this.data.shopVariables.shopMessage).addClass('shop-welcome').appendTo('#shop-container');

            yootil.create.nav_branch('/?shop', this.data.shopVariables.shopName);

            yootil.create.container("Return an item").attr('id', 'return-container').appendTo('#shop-container');

            $('title').text(this.data.shopVariables.shopName + " | Forum");

        },

        createReturn: function () {

            var html = "",
                option = $("<select>"),
                items = this.data.shopVariables.items,
                userData = vitals.shop.data.userData,
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples(Object.keys(userBought).concat(Object.keys(userReceived)), JSON.stringify);

            for (var i = 0; i < keys.length; i++) {

                if (items[keys[i]].returnable == 'true' && ( parseInt( userData.b[keys[i]] ) != 0 )) {
                    option.append('<option value="' + keys[i] + '">' + items[keys[i]].item_name + '</option>');

                }

            }

            if( option.children().length === 0 ) {

                option.append('<option value="no-returnables">No Returnables</option>');

            }

            html += '<div id="return-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + this.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $(html).appendTo('#return-container > .content');

            option.attr('id', 'return-item').appendTo('#return-content').before("Would you like to return an item?").after('<br />Amount: <input id="return-amount" /><br /><input type="button" style="margin-top: 3px" onclick="vitals.shop.sReturn()" value="Return"/>');

        },

        createCategories: function () {

            var categories = pb.plugin.get('gold_shop').settings.categories;

            for (var i in categories) {

                this.createStoreShelf(i);

            }

        },

        createStoreShelf: function (index) {

            console.log('category');

            var categories = this.data.shopVariables.categories,
                category = categories[index].categoryName,
                cClass = category.replace(/\s|'|"|&|\./g, '');


            yootil.create.container(category + '<span style="float: right">(Click to Show/Hide)</span>').attr('id', cClass).addClass('shopCategory').appendTo('#shop-container');

            $( '#' + cClass + ' > .title-bar' ).click(function () {
                $(this).next().slideToggle();
            });

        },

        addShopItems: function () {

            var items = this.data.shopVariables.items;

            for (var i in items) {

                this.createShopItem(i);

            }

        },

        createShopItem: function (index) {

            var items = this.data.shopVariables.items,
                category = items[index].item_category,
                cClass = category.replace(/\s|'|"|&|\./g, ''),
                itemData = vitals.shop.data.shopVariables.items[index],                
                userItems = vitals.shop.data.userData,
                userBought = ( userItems.b[index] != undefined ) ? userItems.b[index] : 0,
                userReceived = ( userItems.r[index] != undefined ) ? userItems.r[index] : 0,
                userTotal = parseInt( userBought + userReceived ),
                inStock = itemData.amount - userTotal;

            if ( inStock < 0 )
                inStock = 0;

            if ( itemData.amount === "" )
                inStock = "&infin;";                

            var html = '';
            html += '<div class="shopItem ' + cClass + '" id="' + items[index].item_id + '" onmouseover="vitals.shop.showOverlay( this )" onmouseout="vitals.shop.hideOverlay(this)">';
            html += '<div class="itemInner">';
            html += '<div class="itemTitle">';
            html += items[index].item_name;
            html += '</div>';
            html += '<img src="' + items[index].image_of_item + '" style="max-width: 150px; max-height: 150px; display: block; margin-right: auto; margin-left: auto;" />';
            html += '<div class="itemInfo">';
            html += 'Cost: ' + pixeldepth.monetary.settings.money_symbol + yootil.number_format(parseFloat(items[index].cost_of_item));
            html += '<br />';
            html += 'In Stock: ' + inStock;
            html += '</div>';
            html += '<div class="itemOverlay">';
            html += '<span class="shopItemIcon left"><a href="/?shop/info&id=' + items[index].item_id + '"><img src="' + this.data.shopVariables.images.information + '" /></a></span>';
            html += '<span class="shopItemIcon right"><a href="/?shop/buy&id=' + items[index].item_id + '"><img src="' + this.data.shopVariables.images.dollar + '" /></a></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            $(html).appendTo('#' + cClass + ' > .content');


        },

        addShopCss: function () {

            $('.shopItem').css(this.data.shopVariables.styles.shopItem);

            $('.itemTitle').css(this.data.shopVariables.styles.shopItemName);

            $('.shopCategory > .content').removeClass('pad-all').css(this.data.shopVariables.styles.shopContent);

            $('.itemInner').css(this.data.shopVariables.styles.shopItemInner);

            $('.itemInfo').css(this.data.shopVariables.styles.shopItemInfo);

            $('.itemOverlay').css(this.data.shopVariables.styles.shopItemOverlay);

            $('.shopItemIcon').css(this.data.shopVariables.styles.shopItemIcon);

            $('.itemOverlay > .left').css(this.data.shopVariables.styles.shopItemIconLeft);

            $('.itemOverlay > .right').css(this.data.shopVariables.styles.shopItemIconRight);

            $('.shopCategory > .content').css(this.data.shopVariables.styles.contentBottom);

            $('.returnImage').css(this.data.shopVariables.styles.returnImageBox);

        },

        showOverlay: function (obj) {

            if ($(obj).find('.itemOverlay').css('display') == "none") {

                $(obj).find('.itemOverlay').show();
            }

        },

        hideOverlay: function (obj) {

            if ($(obj).find('.itemOverlay').css('display') != "none") {

                $(obj).find('.itemOverlay').hide();

            }

        },

        sReturn: function () {

            var item = $("#return-item").val(),
                amount = $("#return-amount").val(),
                userBought = vitals.shop.data.userData.b,
                userReceived = vitals.shop.data.userData.r,
                userBoughtT,
                userReceivedT;

            if ( userBought[item] != undefined )
                userBoughtT = parseInt( userBought[item] );
            else
                userBoughtT = 0;

            if ( userReceived[item] != undefined )
                userReceivedT = parseInt( userReceived[item] );
            else
                userReceivedT = 0;

            if (vitals.shop.data.shopVariables.items[item] == undefined) {

                pb.window.error('Sorry, but you have selected an invalid item.');

                return false;

            }

            if (amount == "") {

                pb.window.error('Please enter an amount.');

                return false;

            }

            if (amount == undefined) {

                pb.window.error('The amount you entered is undefiend.');

            }

            if (amount.match(/[^0-9]/)) {

                pb.window.error('Sorry, but you have added a non-numeric character to the amount box, please remove it.');

                return false;

            }

            if ( userBoughtT == 0 && userReceivedT == 0 ) {

                pb.window.error('Sorry, but you do not have any of the item you selected.');

                return false;

            }

            if ( ( userBoughtT + userReceivedT ) < parseInt(amount)) {

                pb.window.error('Sorry, but you cannot return that amount.');

                return false;

            }

            vitals.shop.api.subtract( parseInt( amount ), item, false, null )

            pixeldepth.monetary.add(vitals.shop.data.shopVariables.items[item].cost_of_item * amount * ( ( !isNaN( goldShop.settings.retail ) )? goldShop.settings.retail: 1 ) );

            $(document).ajaxComplete(function(){

                location.href = "/?shop";

            });

        },

    };

})();