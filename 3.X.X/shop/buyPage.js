

vitals.shop.buyPage = (function() {

    var goldShop = pb.plugin.get('gold_shop');

    return {

        data: {

            currentItem: '',

            styles: {

                itemImage: {
                    "float": "left",
                    "border-width": goldShop.settings.item_border_width + 'px',
                    "border-style": goldShop.settings.item_border_style,
                    "border-color": goldShop.settings.item_border_color,
                    "border-top-left-radius": goldShop.settings.item_border_top_left_radius,
                    "border-top-right-radius": goldShop.settings.item_border_top_right_radius,
                    "border-bottom-right-radius": goldShop.settings.item_border_bottom_left_radius,
                    "border-bottom-left-radius": goldShop.settings.item_border_bottom_right_radius,
                    "padding": "5px",
                },

                dollarImage: {
                    "float": "right",
                },

                itemInfo: {
                    "float": "left",
                    "margin-top": "auto",
                    "margin-bottom": "auto",
                    "margin-left": "15px",
                },

                nameHolder: {
                    "font-weight": "bold",
                },

                itemAttr: {
                    "font-style": "italic",
                },

                form: {
                    "margin-left": "15px",
                    "margin-top": "30px",
                },

            },

        },

        createPage: function() {

            var itemId = getURLParams().id,
                item = vitals.shop.data.shopVariables.items[itemId];

            this.data.currentItem = itemId;

            yootil.create.page(/\/\?shop\/buy/);

            yootil.create.nav_branch("/?shop", vitals.shop.data.shopVariables.shopName);

            yootil.create.nav_branch("/?shop/buy&id=" + itemId, "Buy: " + item.item_name);

            $('title').text(vitals.shop.data.shopVariables.shopName + " | Buy");

            $('#content').append('<div id="shop-container"></div>');

            yootil.create.container('Buy Item: ' + item.item_name + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get(true) + ')').attr('id', 'buy-container').appendTo('#shop-container');

        },

        addItemInfo: function() {

            var itemData = vitals.shop.data.shopVariables.items[this.data.currentItem],
                html = '',
                userItems = vitals.shop.data.userData,
                userBought = ( userItems.b[this.data.currentItem] != undefined ) ? userItems.b[this.data.currentItem] : 0,
                userReceived = ( userItems.r[this.data.currentItem] != undefined ) ? userItems.r[this.data.currentItem] : 0,
                userTotal = parseInt( userBought + userReceived ),
                inStock = itemData.amount - userTotal;

            if ( inStock < 0 )
                inStock = 0;

            if ( itemData.amount === "" )
                inStock = "&infin;"

            html += '<div class="item-image"><img src="' + itemData.image_of_item + '" /></div>';
            html += '<div class="money-image"><img src="' + vitals.shop.data.shopVariables.images.dollarLarge + '" /></div>';
            html += '<div class="item-info">';
            html += '<span class="nameholder">Item: </span><span class="item-attr">' + itemData.item_name + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">Description: </span><span class="item-attr">' + ((itemData.description.length >= 50) ? "<span style='cursor: pointer' onclick='vitals.shop.buyPage.alertInfo()'>(Click to view description)</span>" : itemData.description) + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">Cost: </span><span class="item-attr">' + pixeldepth.monetary.settings.money_symbol + yootil.number_format(parseFloat(itemData.cost_of_item)) + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">In Stock: </span><span id="item-amount" class="item-attr">' + inStock + '</span>';
            html += '<br />';
            html += '<br />';
            html += '</div>';

            $(html).appendTo('#buy-container > .content');

        },

        alertInfo: function() {

            var itemData = vitals.shop.data.shopVariables.items[this.data.currentItem],
                description = itemData.description;

            pb.window.alert(description);

        },

        addForm: function() {

            var itemData = vitals.shop.data.shopVariables.items[this.data.currentItem],
                html = '';

            html += '<div id="buy-form">';
            html += 'Amount: <input id="amount" />';
            html += '<input type="button" onclick="vitals.shop.buyPage.buy()" value="Buy"/>';
            html += '</div>';

            $(html).appendTo('#buy-container .item-info')

        },

        addCss: function() {

            $('#buy-container .item-image').css(this.data.styles.itemImage);

            $('#buy-container .money-image').css(this.data.styles.dollarImage);

            $('#buy-container .item-info').css(this.data.styles.itemInfo);

            $('.item-info > .nameholder').css(this.data.styles.nameHolder);

            $('.item-info > .item-attr').css(this.data.styles.itemAttr);

            $('#buy-container #buy-form').css(this.data.styles.form);

        },

        buy: function() {

            var itemData = vitals.shop.data.shopVariables.items[this.data.currentItem],
                amount = $('#buy-form > #amount').val(),
                userItems = vitals.shop.data.userData,
                userBought = (userItems.b[this.data.currentItem] != undefined) ? userItems.b[this.data.currentItem] : 0,
                userReceived = (userItems.r[this.data.currentItem] != undefined) ? userItems.r[this.data.currentItem] : 0,
                userTotal = parseInt(userBought + userReceived);

            console.log(userTotal == parseInt(amount));

            if (amount.match(/[^0-9]/)) {

                pb.window.error("Sorry, but there are non-numeric characters in the amount input, please remove them and resubmit.");

                return false;

            } else if (amount == "") {

                pb.window.error("Sorry, but you did not supply an amount.");

                return false;

            } else if (userTotal == parseInt(amount) && itemData.amount !== "") {

                pb.window.error("Sorry, but " + vitals.shop.data.shopVariables.shopName + " is out of stock for this item.");

                return false;

            } else if ((userTotal + parseInt(amount)) > itemData.amount && itemData.amount !== "" ) {

                pb.window.error("Sorry, but " + vitals.shop.data.shopVariables.shopName + " does not have that many items in stock.");

                return false;

            } else if ((parseFloat(itemData.cost_of_item) * parseInt(amount)) > pixeldepth.monetary.get()) {

                if ((parseFloat(itemData.cost_of_item) * parseInt(amount)) <= (pixeldepth.monetary.get() + pixeldepth.monetary.get(false, true))) {

                    pb.window.error("Sorry, you do not have enough money in your wallet to buy " + amount + " item" + ((parseInt(amount) > 1) ? "s" : "") + ". However, you do have enough money in the bank to make a withdrawl and then pay for it.");

                } else {

                    pb.window.error("Sorry, you do not have enough money to buy " + amount + " item" + ((parseInt(amount) > 1) ? "s" : ""));

                }

                return false;

            }

            vitals.shop.api.add(parseInt(amount), itemData.item_id, false, null);

            pixeldepth.monetary.subtract(parseFloat(itemData.cost_of_item) * parseFloat(amount));

            $(document).ajaxComplete( function () { location.href = "/?shop" } );

        },

    }

})();