/*******************************************
* Copyright (c) Peter Maggio               *
* (protex.boards.net)                      *
* 2013 all rights reserved                 *
* Not to be redistributed                  *
* http://support.proboards.com/user/173855 *
********************************************/

var vitals = vitals || {};
var goldShop = pb.plugin.get('gold_shop');
vitals.shop = {
    data: {

            version: "",

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
                packages: {},

                images: {
                    dollar: (goldShop.settings.dollar_image_replacement_black !== "")? goldShop.settings.dollar_image_replacement_black: goldShop.images.DollarSmall,
                    information: goldShop.images.InformationSmall,
                    dollarLarge: (goldShop.settings.dollar_image_replacement_gold !== "")? goldShop.settings.dollar_image_replacement_gold: goldShop.images.DollarLarge,
                    yootilBar: goldShop.images.shop_20x20,
                    infoLarge: goldShop.images.InformationLarge,
                    shopLarge: goldShop.images.ShopLarge,
                    package: goldShop.images.package
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

                    returnImageBox: {
                        "width": "225px",
                        "height": "225px",
                    },

                    catBar: {
                        "width": "100%",
                        "height": "20px",
                    },

                    catSelected: {
                        "background-color": "#" + goldShop.settings.category_selected_color,
                    },

                    catBarItem: {
                        "background-color": "#" + goldShop.settings.category_bar_color,
                    },

                },

            },

        },
};

var mainFrame = ( function () {

    return {

        name: 'mainFrame',

        data: {

            plugins: {},
            location: '',
            currUser: pb.data( 'user' ).id,
            currHasData: false,
            otherHasData: false,

        },

        initFast: true,

        init: function () {
            //* I'm not using jQuery's native "ready" function because the
            //* the errors in returned in the console are not discriptive
            //* enought to find out where the error is occuring
            var start = setInterval(function() {
                if (!$.isReady) return;
                clearInterval(start);

                if (vitals.shop.mainFrame.checkForData()) {

                    vitals.shop.mainFrame.loadData();

                }

                if (vitals.shop.mainFrame.checkIfUpdate()) {

                    vitals.shop.api.update();

                }

                vitals.shop.mainFrame.createItemDataHash();

                vitals.shop.mainFrame.handlePackageData();

                vitals.shop.mainFrame.addYootilButton();

                vitals.shop.mainFrame.locationCheck();

                vitals.shop.mainFrame.locationReact();

                vitals.shop.mainFrame.initPlugins();

            }, 100);
        },

        locationCheck: function () {

            var location = pb.data( 'route' ).name,
                href = location.href;



            switch ( location ) {

                case "current_user":
                    this.data.location = "current_user";
                    break;

                case "home":
                    this.data.location = "home";
                    break;

                case "user":
                    this.data.location = "user";
                    break;

            }

        },

        createItemDataHash: function () {

            var pluginItems = pb.plugin.get( 'gold_shop' ).settings.items,
                itemsRearranged = {};

            for ( i in pluginItems ) {

                itemsRearranged[pluginItems[i].item_id] = {

                    "image_of_item": pluginItems[i].image_of_item,
                    "item_name": pluginItems[i].item_name,
                    "cost_of_item": pluginItems[i].cost_of_item,
                    "description": pluginItems[i].description,
                    "item_id": pluginItems[i].item_id,
                    "item_category": pluginItems[i].item_category,
                    "amount": pluginItems[i].amount,
                    "givable": pluginItems[i].givable,
                    "returnable": pluginItems[i].returnable,

                };

            }

            vitals.shop.data.shopVariables.items = itemsRearranged;

        },

        handlePackageData: function () {

            var packageInfo = pb.plugin.get('gold_shop').settings.pack_info,
                packagedItems = pb.plugin.get('gold_shop').settings.pack_items,
                dataHash = {};

            if ( packageInfo.length > 0 ) {

                for( i in packageInfo ) {

                    dataHash[packageInfo[i].id] = {"name": packageInfo[i].name, "ID": packageInfo[i].id, "cost": packageInfo[i].cost, "description": packageInfo[i].description, "items": {}}

                }

                for( i in packagedItems ) {

                    dataHash[packagedItems[i].package].items[packagedItems[i].id] = {"amount": packagedItems[i].amount, "ID": packagedItems[i].id, "name": vitals.shop.data.shopVariables.items[packagedItems[i].id].item_name};

                }

                vitals.shop.data.shopVariables.packages = dataHash;

                vitals.shop.data.shopVariables.categories['packages'] = {'categoryName': "Packages"};

            }

        },

        locationReact: function () {

            if ( this.data.location === "home" ) {

                if ( location.href.match( /\/\?shop/ ) ) {
                    
                    if( !location.href.match( /\/\?shop\// ) )
                        this.data.location = "shop"

                    if ( location.href.match( /\/\?shop\/buy/ ) ) 
                        this.data.location = 'buyPage';

                    if ( location.href.match( /\/\?shop\/info/ ) ) 
                        this.data.location = "infoPage";

                    if ( location.href.match( /\/\?shop\/package\/buy/ ) ) 
                        this.data.location = "buyPackage";

                }

            }

            if ( this.data.location === "user" ) {

                this.data.location = "profilePage";

                if ( location.href.match(/\?giveItem/) ) 
                    this.data.location = "givePage";

                if( location.href.match( /\?removeItem/ ) )
                    this.data.location = 'removePage';

                if( location.href.match( /\?addItem/ ) )
                    this.data.location = 'addPage';

            }

        },

        checkForData: function () {           

            if ( typeof vitals.shop.api.get( this.data.currUser ) === "object" ) {

                this.data.currHasData = true;

                return true;

            }

        },

        loadData: function () {

            vitals.shop.data.userData = pb.plugin.key( 'gold_shop' ).get( this.data.currUser );

        },

        checkIfUpdate: function () {

            if ( typeof vitals.shop.api.get() === "object" ) {

                if ( vitals.shop.api.get()['lb'] != undefined ) {

                    return true;

                }

            }

            return false;

        },

        addYootilButton: function () {

            yootil.bar.add( "/?shop", vitals.shop.data.shopVariables.images.yootilBar );

        },

        register: function ( object, initFast ) {

            if ( object === undefined ) {

                throw new Error('Failed atempt to register a plugin with the Gold Shop. Plugin was undefined')

            }

            if ( object.name === null || object.name === undefined ) {

                throw new Error('Failed attempt to register a plugin with the Gold Shop. Plugin did not have a name object.');

                return false;

            }

            if ( object.init === null || object.init === undefined ) {

                throw new Error('Failed attempt to register plugin ' + object.name + ' with the Gold Shop. Plugin did not have an init function.')

                return false;

            }

            if ( this.data.plugins[object.name] !== undefined ) {

                throw new Error('Failed attempt to register plugin ' + object.name + 'with the Gold Shop. A plugin with that name already exists.')

            }

            this.data.plugins[object.name] = object;
            vitals.shop[object.name] = object; 
            
            if (object.initFast === true ) {
                object.init();
            };        

        },

        initPlugins: function () {

            var plugins = this.data.plugins,
                pluginNames = Object.keys( plugins );

            for( i in pluginNames ) {

                if( plugins[pluginNames[i]].initFast === true ){
                    continue;
                }else {
                    plugins[pluginNames[i]].init();
                }

            }

        },

        registerThis: function () {
            this.register(this);
        },

    }

} )().registerThis();

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

var buyPage = (function() {

    return {

        name: 'buyPage',

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

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'buyPage' ) {

                vitals.shop.buyPage.createPage();

                vitals.shop.buyPage.addItemInfo();

                vitals.shop.buyPage.addForm();

                vitals.shop.buyPage.addCss();   

            }         

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

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

    }

})().register();

var infoPackagePage = (function(){ 

	return {

		name: 'infoPackage',

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

	        },

	    },

	    init: function () {

	    	if( location.href.match(/\?shop\/package\/info/) ) {

	            this.createPage();

	            this.addItemInfo();

	            this.addCss();

	        }

	    },

	    createPage: function () {

	        var itemId = getURLParams().id,
	            item = vitals.shop.data.shopVariables.packages[itemId];

	        this.data.currentItem = itemId;

	        yootil.create.page( /\/\?shop\/package\/info/ );

	        yootil.create.nav_branch( "/?shop", vitals.shop.data.shopVariables.shopName );

	        yootil.create.nav_branch( "/?shop/package/info&id=" + itemId, "Info: " + item.name );

	        $( 'title' ).text( vitals.shop.data.shopVariables.shopName + " | Info" );

	        $( '#content' ).append( '<div id="shop-container"></div>' );

	        yootil.create.container( 'Info Item: ' + item.name + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'info-container' ).appendTo( '#shop-container' );

	    },

	    addItemInfo: function () {

	        var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
	            html = '',
	            itemList = '';

	        for ( i in itemData.items ) {
	        	itemList += itemData.items[i].name + ', ';
	        }

	        html += '<div class="item-image"><img src="' + vitals.shop.data.shopVariables.images.package + '" /></div>';
	        html += '<div class="info-image"><img src="' + vitals.shop.data.shopVariables.images.infoLarge + '" /></div>';
	        html += '<div class="item-info">';
	        html += '<span class="nameholder">Package Name: </span><span class="item-attr">' + itemData.name + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Description: </span><span class="item-attr">' + ( ( itemData.description.length >= 50 ) ? "<span style='cursor: pointer' onclick='this.alertInfo()'>(Click to view description)</span>" : itemData.description ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Cost: </span><span class="item-attr">' + pixeldepth.monetary.settings.money_symbol + yootil.number_format( parseFloat( itemData.cost ) ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">In Stock: </span><span id="item-amount" class="item-attr">&infin;</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">ID: </span><span class="item-attr">' + itemData.ID + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Items in Package: </span><span class="item-attr">' + itemList + '</span>';
	        html += '</div>';

	        $( html ).appendTo( '#info-container > .content' );

	    },

	    alertInfo: function () {

	        var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
	            description = itemData.description;

	        pb.window.alert( description );

	    },

	    addCss: function () {

	        $( '#info-container .item-image' ).css( this.data.styles.itemImage );

	        $( '#info-container .info-image' ).css( this.data.styles.dollarImage );

	        $( '#info-container .item-info' ).css( this.data.styles.itemInfo );

	        $( '.item-info > .nameholder' ).css( this.data.styles.nameHolder );

	        $( '.item-info > .item-attr' ).css( this.data.styles.itemAttr );

	    },

	    register: function () {
	    	vitals.shop.mainFrame.register(this);
	    },

    };

} )().register();

profilePage = (function() {

    return {

        name: 'profilePage',

        data: {

            profileId: ( ( pb.data( 'route' ).name.match( /user/ ) )? pb.data( 'page' ).member.id: pb.data( 'user' ).id ),
            userData: '',
            shopNameHeight: ( goldShop.settings.profile_page_text_size.match( /[^1-7]/ ) )? 6: goldShop.settings.profile_page_text_size,

            styles: {

                itemInfoBox: {
                    "float": "right",
                    "margin-left": "10px",
                    "width": "200px",
                    "height": "70px",
                },

                itemShelf: {
                    "min-height": "70px",
                },

                item: {
                    "float": "left",
                    "opacity": "0.5",
                    "filter": "Alpha(opacity=50)",
                    "max-width": "50px",
                    "max-height": "50px",
                },

                itemHover: {
                    "opacity": "1",
                    "filter": "Alpha(opacity=100)",
                },

                itemImage: {
                    "max-width": "50px",
                    "max-height": "50px",
                },

                shelfHeader: {
                    "width": "100%",
                    "text-align": "center",
                },

            },

        },

        init: function () {

            if ( vitals.shop.mainFrame.data.location === "profilePage" ) {

                vitals.shop.profilePage.createShelf();

                vitals.shop.profilePage.addItems();

                vitals.shop.profilePage.addCss();

                if ( pb.data('user').id !== pb.data('page').member.id )
                    vitals.shop.profilePage.addGiveButton();

                if ( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                    vitals.shop.profilePage.addRemoveButton();

                if( $.inArray( pb.data( 'user' ).id.toString(), goldShop.settings.removers ) > -1 )
                    vitals.shop.profilePage.addAddButton();

            }


        },

        createShelf: function () {

            this.data.userData = vitals.shop.api.get(( pb.data( 'route' ).name.match( /user/ ) ) ? pb.data( 'page' ).member.id : pb.data( 'user' ).id );

            if ( this.data.userData == "undefined" || this.data.userData == undefined )
                this.data.userData = {b:{},r:{}};

            if ( Object.keys( this.data.userData.b ).length > 0 || Object.keys( this.data.userData.r ).length > 0 ) {

                $( "div.content-box.center-col td.headings:contains(Posts)" ).parentsUntil( 'td' ).last().before( yootil.create.profile_content_box( 'items-container' ).css( this.data.styles.itemShelf ).append( '<h' + this.data.shopNameHeight + ' id="shelf-header">' + vitals.shop.data.shopVariables.shopName + ' Items' + '</h' + this.data.shopNameHeight + '>' ) );

                $( '#items-container' ).before( yootil.create.profile_content_box( 'item-info-box' ).css( this.data.styles.itemInfoBox ) );

            }

        },

        addItems: function (user) {

            var bought = (user === null )? this.data.userData.b: vitals.shop.api.get(user).b,
                received = (user === null )? this.data.userData.r: vitals.shop.api.get(user).r,
                items = vitals.shop.data.shopVariables.items,
                itemKeys = Object.keys( items );

            for ( var i = 0; i < itemKeys.length; i++ ) {

                var total = 0,
                    boughtTotal = 0,
                    receivedTotal = 0;

                if ( received[itemKeys[i]] != undefined || bought[itemKeys[i]] != undefined ) {

                    if ( bought[itemKeys[i]] != undefined ) {

                        total = total + parseInt( bought[itemKeys[i]] );

                        boughtTotal = parseInt( bought[itemKeys[i]] );

                    }

                    if ( received[itemKeys[i]] != undefined ) {

                        total = total + parseInt( received[itemKeys[i]] );

                        receivedTotal = parseInt( received[itemKeys[i]] );

                    }

                    if ( total > 0 ) {

                        vitals.shop.profilePage.createItem( itemKeys[i], total, boughtTotal, receivedTotal );

                    }   

                }

            }

        },

        createItem: function ( itemId, total, boughtTotal, receivedTotal ) {

            var items = vitals.shop.data.shopVariables.items,
                itemData = items[itemId],
                html = '';

            html += '<div class="shop-item" onmouseover="vitals.shop.profilePage.itemHover(this)" onmouseout="vitals.shop.profilePage.itemHoverOut(this)">';
            html += '<a href="/?shop/info&id=' + itemId + '">';
            html += '<img class="item-image" src="' + itemData.image_of_item + '" title="Click to go to information page" />';
            html += '</a>';
            html += '</div>';

            $( html ).data( { id: itemId, name: itemData.item_name, total: total, bought: boughtTotal, received: receivedTotal } ).appendTo( '#items-container' );

        },

        addCss: function () {

            $( '.shop-item' ).css( this.data.styles.item );

            $( '.item-image' ).css( this.data.styles.itemImage );

            $( '#shelf-header' ).css( this.data.styles.shelfHeader );

        },

        itemHover: function ( obj ) {

            $( obj ).css( this.data.styles.itemHover );

            $( '#item-info-box' ).html(
                "Name: " + $( obj ).data().name +
                "<br />" +
                "Total: " + $( obj ).data().total +
                "<br />" +
                "Bought: " + $( obj ).data().bought +
                "<br />" +
                "Received: " + $( obj ).data().received +
                "<br />" +
                "Id: " + $( obj ).data().id
                );

        },

        itemHoverOut: function ( obj ) {

            $( obj ).css( this.data.styles.item );

            $( '#item-info-box' ).html( '' );

        },

        addGiveButton: function ( ) {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?giveItem" }).text('Give Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        },

        addRemoveButton: function () {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?removeItem" }).text('Remove Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        },

        addAddButton: function () {

            var $anchor = $( "<a></a>"),
                $listItem = $( '<li></li>' ),
                $span = $( '<span />' );

            $span.addClass( 'float right' ).append( '<span />')
            $anchor.attr( { "type": "button", "href":"?addItem" }).text('Add Items');
            $listItem.append( $anchor ).append( $span );

            $( '.user-menu' ).append( $listItem );

        }, 

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

    }

} )().register();



var givePage = (function(){
 
    return {

        name: 'givePage',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'givePage' ) {

                vitals.shop.givePage.createPage();

                vitals.shop.givePage.addDefaultContent();

                vitals.shop.givePage.addCss(); 

            }           

        },

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?giveItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Give" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Give Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'give-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<select>" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.data.userData,
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            for ( var i = 0; i < keys.length; i++ ) {

            	if ( items[keys[i]].givable == 'true' ) {

	                option.append( '<option value="' + keys[i] + '">' + items[keys[i]].item_name + '</option>' );

	            }

            }
            
            html += '<div id="give-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'give-item' ).appendTo( '#give-content' ).before( "Would you like to give this member an item?" ).after( '<br />Amount: <input id="give-amount" /><br /><input type="button" onclick="vitals.shop.givePage.sGive()" value="Give"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sGive: function ( ) {

            var item = $("#give-item").val(),
                amount = $("#give-amount").val(),
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

            if (vitals.shop.data.shopVariables.items[item] == undefined ) {

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

                pb.window.error('Sorry, but you cannot give that amount.');

                return false;

            }

            if ( vitals.shop.data.shopVariables.items[item].givable != "true" ) {

                pb.window.error( 'Sorry, but that item is not givable.');

                return false;

            }

            vitals.shop.api.subtract( amount, item, false, null );

            vitals.shop.api.add( amount, item, true, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

     };

} )().register();

var api = (function() {

    return {

        name: 'api',

        initFast: true,

        init: function () {

            var start = setInterval(function() {
                if (!$.isReady) return;
                clearInterval(start);

            var route = pb.data('route').name;
                if ( route == 'thread' || route == 'list_posts' || route == 'conversation' || route == 'list_messages' ){
                    vitals.shop.api.addProfileItems();
                }

            proboards.on('pageChange', function () { vitals.shop.api.addProfileItems() });

            }, 100);            

        },

        addProfileItems: function () {
            $('.mini-profile').each(function(){
                var x = $(this).find('.user-link').attr('class').match(/user-[0-9]/).toString().replace(/user-/, '');
                $(this).append('<span onclick="vitals.shop.api.createItemBox(\'' + x + '\')">Shop Items</span>');
            });
        },

        get: function(user) {

            if (user == null || user == undefined) user = pb.data('user').id;

            return pb.plugin.key('gold_shop').get(user);

        },

        set: function(args) {

            pb.plugin.key('gold_shop').set(args);

        },

        update: function() {

            pb.window.alert('update', {

                title: "Gold Shop Updater",
                html: "The Gold Shop was updated and needs to change some of your data, this will not affect any of your items",
                buttons: {

                    "OK": function() {

                        var data = pb.plugin.key('gold_shop').get(),
                            object = {
                                b: {},
                                r: {}
                            };

                        if (data.b.length > 0) {

                            for ( var i in data.b) {

                                console.log(object.b[data.b[i]] == undefined);

                                if (object.b[data.b[i]] == undefined) {

                                    object.b[data.b[i]] = countInArray(data.b, data.b[i]);

                                }

                            }

                        }

                        if (data.r.length > 0) {

                            for ( var i in data.r) {

                                console.log(object.r[data.r[i]] == undefined);

                                if (object.r[data.r[i]] == undefined) {

                                    object.r[data.r[i]] = countInArray(data.r, data.r[i]);

                                }

                            }

                        }

                        pb.plugin.key('gold_shop').set({
                            object_id: pb.data('user').id,
                            value: object
                        });

                        $(this).dialog('close');                        

                    }



                },

            });

        function countInArray(array, what) {
                var count = 0;
                for (var xyz = 0; xyz < array.length; xyz++) {
                    if (array[xyz] === what) {
                        count++;
                    }
                }
                return count;
            }

        },

        add: function(amount, id, given, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id; 

            if ( given == true )
                type = "r";
            else 
                type = "b";           

            for (var i = 0; i < amount; i++) {

                this.increment(id, type, user);

            }

            this.set({
                object_id: user,
                value: this.get( user )
            });

        },

        increment: function(id, type, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;

            if( typeof this.get( user ) !== "object" )
                this.set( { 
                    object_id: user, 
                    value: { 
                        b:{}, 
                        r:{} 
                    } 
                } );

            if (this.get( user )[type][id] != undefined) {

                this.get( user )[type][id] = ( parseInt(this.get( user )[type][id]) + 1 );

            } else {

                this.get( user )[type][id] = 1;

            }

        },

        subtract: function(amount, id, given, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;;       

            for (var i = 0; i < amount; i++) {

                if ( this.get( user ).b[id] !== undefined && given != true) {
                    this.decrement(id, "b", user);

                }else if ( this.get( user).b[id] === undefined || given === true )
                    this.decrement( id, "r", user );

            }

            this.set({
                object_id: user,
                value: this.get( user )
            });

        },

        decrement: function(id, type, user) {

            if (user == undefined || user == null)
                user = pb.data('user').id;

            if ( typeof this.get( user ) !== "object" )
                this.set( { 
                    object_id: user, 
                    value: { 
                        b:{}, 
                        r:{} 
                    } 
                } );

            if (this.get( user )[type][id] !== undefined) {

                this.get( user )[type][id] = ( parseInt(this.get( user )[type][id]) - 1 );

                if ( parseInt( this.get( user )[type][id] ) == 0 )

                    this.get( user )[type][id] = undefined;      
                                  
                }

        },

        createItemBox: function (user) {

            var data = vitals.shop.api.get( user ),
                html = '';

            pb.window.dialog('user_item_box', {
                title: 'Items',
                html: '<div id="items-container"></div><div style="float: right; min-height: 75px" id="item-info-box">', 
                width: "500px",  
                buttons: {
                    "Close": function(){
                        $(this).dialog('close');
                    },
                },
            });

            vitals.shop.profilePage.addItems(user);

            vitals.shop.profilePage.addCss();

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        }

    };

})().register();

var removePage = (function(){
 
    return {

        name: 'removePage',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'removePage' ) {

                this.createPage();

                this.addDefaultContent();

                this.addCss();

            }

        },

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?removeItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Remove" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Remove Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'remove-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<select>" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.api.get( pb.data('page').member.id ),
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            for ( var i = 0; i < keys.length; i++ ) {

                option.append( '<option value="' + keys[i] + '">' + items[keys[i]].item_name + '</option>' );

            }
            
            html += '<div id="remove-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'remove-item' ).appendTo( '#remove-content' ).before( "Would you like to remove items from this member?" ).after( '<br />Amount: <input id="remove-amount" /><br /><input type="button" onclick="vitals.shop.removePage.sRemove()" value="Remove"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sRemove: function () {

            var item = $("#remove-item").val(),
                amount = $("#remove-amount").val(),
                removerBought = vitals.shop.api.get( pb.data('page').member.id ).b,
                removerReceived = vitals.shop.api.get( pb.data('page').member.id ).r,
                removerBoughtT,
                removerReceivedT;

            if ( $.inArray( pb.data('user').id.toString(), goldShop.settings.removers) < 0 ) {

                pb.window.error('You do not have permission to use this feature.')

                return false;

            }

            if ( removerBought[item] != undefined )
                removerBoughtT = parseInt( removerBought[item] );
            else
                removerBoughtT = 0;

            if ( removerReceived[item] != undefined )
                removerReceivedT = parseInt( removerReceived[item] );
            else
                removerReceivedT = 0;

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

            if ( removerBoughtT == 0 && removerReceivedT == 0 ) {

                pb.window.error('Sorry, this user does not have any of the item you selected.');

                return false;

            }

            if ( ( removerBoughtT + removerReceivedT ) < parseInt(amount)) {

                pb.window.error('Sorry, but you cannot remove that amount.');

                return false;

            }

            vitals.shop.api.subtract( amount, item, false, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },

        register: function() {
            vitals.shop.mainFrame.register(this);
        },
 };

} )().register();

var buyPackagePage = (function() {

    return {

        name: 'buyPackagePage',

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

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'buyPackage') {

                vitals.shop.buyPackagePage.createPage();

                vitals.shop.buyPackagePage.addItemInfo();

                vitals.shop.buyPackagePage.addForm();

                vitals.shop.buyPackagePage.addCss();  

            }          

        },

        createPage: function() {

            var itemId = getURLParams().id,
                item = vitals.shop.data.shopVariables.packages[itemId];

            this.data.currentItem = itemId;

            yootil.create.page(/\/\?shop\/package\/buy/);

            yootil.create.nav_branch("/?shop", vitals.shop.data.shopVariables.shopName);

            yootil.create.nav_branch("/?shop/package/buy&id=" + itemId, "Buy: " + item.name);

            $('title').text(vitals.shop.data.shopVariables.shopName + " | Buy");

            $('#content').append('<div id="shop-container"></div>');

            yootil.create.container('Buy Package: ' + item.name + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get(true) + ')').attr('id', 'buy-container').appendTo('#shop-container');

        },

        addItemInfo: function() {

            var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
                html = '';

            html += '<div class="item-image"><img src="' + vitals.shop.data.shopVariables.images.package + '" /></div>';
            html += '<div class="money-image"><img src="' + vitals.shop.data.shopVariables.images.dollarLarge + '" /></div>';
            html += '<div class="item-info">';
            html += '<span class="nameholder">Item: </span><span class="item-attr">' + itemData.name + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">Description: </span><span class="item-attr">' + ((itemData.description.length >= 50) ? "<span style='cursor: pointer' onclick='vitals.shop.buyPackagePage.alertInfo()'>(Click to view description)</span>" : itemData.description) + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">Cost: </span><span class="item-attr">' + pixeldepth.monetary.settings.money_symbol + yootil.number_format(parseFloat(itemData.cost)) + '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="nameholder">In Stock: </span><span id="item-amount" class="item-attr">&infin;</span>';
            html += '<br />';
            html += '<br />';
            html += '</div>';

            $(html).appendTo('#buy-container > .content');

        },

        alertInfo: function() {

            var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
                description = itemData.description;

            pb.window.alert(description);

        },

        addForm: function() {

            var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
                html = '';

            html += '<div id="buy-form">';
            html += 'Amount: <input id="amount" />';
            html += '<input type="button" onclick="vitals.shop.buyPackagePage.buy()" value="Buy"/>';
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

            var itemData = vitals.shop.data.shopVariables.packages[this.data.currentItem],
                amount = $('#buy-form > #amount').val();

            if (amount.match(/[^0-9]/)) {

                pb.window.error("Sorry, but there are non-numeric characters in the amount input, please remove them and resubmit.");

                return false;

            } else if (amount == "") {

                pb.window.error("Sorry, but you did not supply an amount.");

                return false;

            } else if ((parseFloat(itemData.cost) * parseInt(amount)) > pixeldepth.monetary.get()) {

                if ((parseFloat(itemData.cost) * parseInt(amount)) <= (pixeldepth.monetary.get() + pixeldepth.monetary.get(false, true))) {

                    pb.window.error("Sorry, you do not have enough money in your wallet to buy " + amount + " item" + ((parseInt(amount) > 1) ? "s" : "") + ". However, you do have enough money in the bank to make a withdrawl and then pay for it.");

                } else {

                    pb.window.error("Sorry, you do not have enough money to buy " + amount + " item" + ((parseInt(amount) > 1) ? "s" : ""));

                }

                return false;

            }

            for ( i in amount ) {

	            for ( i in itemData.items ) {

	            	if (vitals.shop.data.shopVariables.items[itemData.items[i].ID] !== undefined ) {

			            vitals.shop.api.add(parseInt(itemData.items[i].amount), itemData.items[i].ID, false, null);

		            } else {

		            	pb.window.error('One of the items in this package was added incorrectly please notify an administrator.')

		            }

	            }

            }

            pixeldepth.monetary.subtract(parseFloat(itemData.cost) * parseFloat(amount));

            $(document).ajaxComplete( function () { location.href = "/?shop" } );

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

    };

})().register();

var addPage = (function(){
 
    return {

        name: 'addPage',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'addPage' ) {

                vitals.shop.addPage.createPage();

                vitals.shop.addPage.addDefaultContent();

                vitals.shop.addPage.addCss();

            };

        },

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?addItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Add" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Add Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'add-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<input id='add-item' />" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.api.get( pb.data('page').member.id ),
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            
            html += '<div id="add-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'add-item' ).appendTo( '#add-content' ).before( "Would you like to add items to this members shelf?<br />ID: " ).after( '<br />Amount: <input id="add-amount" /><br /><input type="button" onclick="vitals.shop.addPage.sAdd()" value="Add"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sAdd: function () {

            var item = $("#add-item").val(),
                amount = $("#add-amount").val();

            if ( !$.inArray( pb.data('user').id.toString(), goldShop.settings.removers) < 0 ) {

                pb.window.error('You do not have permission to use this feature.')

                return false;
                
            }

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

            vitals.shop.api.add( amount, item, true, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        }
    };

} )().register();

var pBey = (function(){
	
	return{

		name: 'pBey',

		plugin: 'gold_shop',

		key: pb.plugin.key('gold_shop'),

		settings: {

			userData: pb.plugin.key('gold_shop').get(),
			asdf: this.dataHolder,
			dataHolder: goldShop.settings.dataHolder,
			pBeyData: ( this.settings.key.get(this.dataHolder) !== undefined && this.settings.key.get(pb.plugin.key('gold_shop').get()) !== null )? this.settings.key.get(this.dataHolder): {},
			enabled: goldShop.settings.pbey_enabled,
			taxes_enabled: goldShop.settings.taxes_enabled,
			pBeyLocation: '/user/' + dataHolder + '/pBey',

			user_is_dataHolder: false,
			user_can_sell: true,
 
		},

		init: function () {

			this.setup();

		},

		setup: function () {

			var self = this;

			if (this.settings.enabled) {

				if ( key.get() !== undefined ) {

					if ( !this.has_pBey_data() ) {
						if ( location.href.match(this.settings.pBeyLocation) ) {
							pb.window.dialog('pBey_welcome', {
								title: "Welcome to pBey",
								html: "Congradulations, this is your first visit to pBey. Feel free to brows items that are currently for sale, or even sell some of your own items.",
								buttons: {
									"close": function () {
										var data = self.settings.userData;
										data.pBey = {};
										$(this).dialog('close');
									}
								}
							});
						}
					}

				}

			}

			this.addYootilButton();

		},

		has_pBey_data: function () {
			if (key.get().pBey !== undefined)
				return true;
		},

		addYootilButton: function() {
			yootil.bar.add(this.settings.pBeyLocation, goldShop.images.pBey, "pBey", "pBey")
		},

		register: function() {
			vitals.shop.mainFrame.register(this);
		},

	}

})().register();

//* This method is copied from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
removeArrDuples = function(ary, key) {
    var seen = {};
    return ary.filter(function(elem) {
        var k = key(elem);
        return (seen[k] === 1) ? 0 : seen[k] = 1;
    });
};

//* Copied from http://stackoverflow.com/questions/13037762/how-to-get-url-variable-using-jquery-javascript
function getURLParams() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}
