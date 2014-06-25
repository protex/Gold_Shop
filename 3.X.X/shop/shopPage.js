

var shopPage = (function () {

    return {

        name: 'shopPage',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === "shop" ) {

                this.createShopPage();

                this.createReturn();

                this.createCatBar();

                this.createCategories();            

                if ( Object.keys( vitals.shop.data.shopVariables.packages ).length > 0 ) {

                    this.addPackageItems();

                }

                this.addShopItems();

                this.addShopCss();  

            }          

        },

        createShopPage: function () {

            yootil.create.page(/\/\?shop/);

            $('#content').append('<div id="shop-container"></div>');

            console.log( pixeldepth.monetary.get() );

            yootil.create.container(vitals.shop.data.shopVariables.shopName + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get(true) + ')', vitals.shop.data.shopVariables.shopMessage).addClass('shop-welcome').appendTo('#shop-container');

            yootil.create.nav_branch('/?shop', vitals.shop.data.shopVariables.shopName);

            $('title').text(vitals.shop.data.shopVariables.shopName + " | Forum");

        },

        createReturn: function () {

            var html = "",
                option = $("<select>"),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.data.userData,
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples(Object.keys(userBought).concat(Object.keys(userReceived)), JSON.stringify);

            yootil.create.container("Return an item").attr('id', 'return-container').appendTo('#shop-container');            

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
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $(html).appendTo('#return-container > .content');

            option.attr('id', 'return-item').appendTo('#return-content').before("Would you like to return an item?").after('<br />Amount: <input id="return-amount" /><br /><input type="button" style="margin-top: 3px" onclick="vitals.shop.shopPage.sReturn()" value="Return"/>');

        },

        createCatBar: function () {

            var html = '<table id="catBar"></tbody><tr id="catRow"></tr></tbody></table>',
                categories = vitals.shop.data.shopVariables.categories;

            $('#shop-container').append(html);

            for ( i in categories ) {

                if ( i == 0) 
                    $('#catRow').append( '<td class="catSelected" onclick="vitals.shop.shopPage.showCat(\''+ categories[i].categoryName.replace(/\s|'|"|&|\./g, '') + '\', this)"><div align="center">' + categories[i].categoryName + '</div></td>' ); 
                else
                    $('#catRow').append( '<td class="catBarItem" onclick="vitals.shop.shopPage.showCat(\'' + categories[i].categoryName.replace(/\s|'|"|&|\./g, '') + '\', this)"><div align="center">' + categories[i].categoryName + '</div></td>' );

            }

        },

        addPackageItems: function () {

            var packages = vitals.shop.data.shopVariables.packages;

            for ( i in packages ) {

                this.createPackage(i);

            }

        },

        createPackage: function (index) {

            var packages = vitals.shop.data.shopVariables.packages;               

            var html = '';
            html += '<div class="shopItem" onmouseover="vitals.shop.shopPage.showOverlay( this )" onmouseout="vitals.shop.shopPage.hideOverlay(this)">';
            html += '<div class="itemInner">';
            html += '<div class="itemTitle">';
            html += packages[index].name;
            html += '</div>';
            html += '<img src="' + vitals.shop.data.shopVariables.images.package + '" style="max-width: 150px; max-height: 150px; display: block; margin-right: auto; margin-left: auto;" />';
            html += '<div class="itemInfo">';
            html += 'Cost: ' + pixeldepth.monetary.settings.money_symbol + yootil.number_format( parseFloat(packages[index].cost ) );
            html += '<br />';
            html += 'In Stock: &infin;';
            html += '</div>';
            html += '<div class="itemOverlay">';
            html += '<span class="shopItemIcon left"><a href="/?shop/package/info&id=' + packages[index].ID + '"><img src="' + vitals.shop.data.shopVariables.images.information + '" /></a></span>';
            html += '<span class="shopItemIcon right"><a href="/?shop/package/buy&id=' + packages[index].ID + '"><img src="' + vitals.shop.data.shopVariables.images.dollar + '" /></a></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            $(html).appendTo('#Packages > .content');


        },

        createCategories: function () {

            var categories = pb.plugin.get('gold_shop').settings.categories;

            for (var i in categories) {

                if ( i == 0 )
                    this.createStoreShelf(i, false);
                else
                    this.createStoreShelf(i, true)

            }

        },

        createStoreShelf: function (index, hidden) {

            var categories = vitals.shop.data.shopVariables.categories,
                category = categories[index].categoryName,
                cClass = category.replace(/\s|'|"|&|\./g, '');


            yootil.create.container(category).css( ( ( hidden )? {"display":"none"}: {"display":""} ) ).attr('id', cClass).addClass('shopCategory').appendTo('#shop-container');

        },

        addShopItems: function () {

            var items = vitals.shop.data.shopVariables.items;

            for (var i in items) {

                this.createShopItem(i);

            }

        },

        createShopItem: function (index) {

            var items = vitals.shop.data.shopVariables.items,
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
            html += '<div class="shopItem ' + cClass + '" id="' + items[index].item_id + '" onmouseover="vitals.shop.shopPage.showOverlay( this )" onmouseout="vitals.shop.shopPage.hideOverlay(this)">';
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
            html += '<span class="shopItemIcon left"><a href="/?shop/info&id=' + items[index].item_id + '"><img src="' + vitals.shop.data.shopVariables.images.information + '" /></a></span>';
            html += '<span class="shopItemIcon right"><a href="/?shop/buy&id=' + items[index].item_id + '"><img src="' + vitals.shop.data.shopVariables.images.dollar + '" /></a></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            $(html).appendTo('#' + cClass + ' > .content');


        },

        addShopCss: function () {

            $('.shopItem').css(vitals.shop.data.shopVariables.styles.shopItem);

            $('.itemTitle').css(vitals.shop.data.shopVariables.styles.shopItemName);

            $('.shopCategory > .content').removeClass('pad-all').css(vitals.shop.data.shopVariables.styles.shopContent);

            $('.itemInner').css(vitals.shop.data.shopVariables.styles.shopItemInner);

            $('.itemInfo').css(vitals.shop.data.shopVariables.styles.shopItemInfo);

            $('.itemOverlay').css(vitals.shop.data.shopVariables.styles.shopItemOverlay);

            $('.shopItemIcon').css(vitals.shop.data.shopVariables.styles.shopItemIcon);

            $('.itemOverlay > .left').css(vitals.shop.data.shopVariables.styles.shopItemIconLeft);

            $('.itemOverlay > .right').css(vitals.shop.data.shopVariables.styles.shopItemIconRight);

            $('.returnImage').css(vitals.shop.data.shopVariables.styles.returnImageBox);

            $('#catBar').css(vitals.shop.data.shopVariables.styles.catBar);

            $('.catSelected').css(vitals.shop.data.shopVariables.styles.catSelected);

            $('.catBarItem').css(vitals.shop.data.shopVariables.styles.catBarItem);

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

        showCat: function ( id, self ) {
            $('.shopCategory').hide();

            $( '#' + id ).show();

            $( '.catSelected' ).removeClass( 'catSelected' ).addClass('catBarItem');

            $(self).removeClass('catBarItem').addClass('catSelected');

            this.addShopCss();

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

            vitals.shop.api.add( parseInt( amount ), item, false, null )

            pixeldepth.monetary.add(vitals.shop.data.shopVariables.items[item].cost_of_item * amount * ( ( !isNaN( goldShop.settings.retail ) )? goldShop.settings.retail: 1 ) );

            $(document).ajaxComplete(function(){

                location.href = "/?shop";

            });

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

    };

})().register();