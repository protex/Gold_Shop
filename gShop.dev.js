/*******************************************
* Copyright (c) Peter Maggio               *
* (protex.boards.net)                      *
* 2013 all rights reserved                 *
* Not to be redistributed                  *
* http://support.proboards.com/user/173855 *
********************************************/


var vitals = vitals || {};

var start = setInterval(function() {
    if (!$.isReady) return;
    clearInterval(start);

vitals.shop.setup();

}, 100);

vitals.shop = (function(){

	return{

		plugin: proboards.plugin._plugins.gold_shop,

		key: proboards.plugin.keys.data.gold_shop,

		settings: {
			// user
			user_is_admin: false,
			user_is_item_creator: false,
			user_is_disabled: false,
			user_can_submit_items: false,
			user_can_approve_items: false,
			user_has_data: false,

			// Shop
			shop_name: "The Shop",
			shop_welcome_message: "Welcome to the Shop!",
			shop_user_submissions_open: false,
			shop_logo: '',
			shop_items: {},
			shop_categories: {}

		},

		setup: function () {

			var items = {},
				categories = [];

			// Setup variables
			this.settings.user_is_admin = ( yootil.user.id() === 1 )? true: false;
			this.settings.user_is_item_creator = false;
			this.settings.user_is_disabled = false;
			this.settings.user_can_submit_items = false;
			this.settings.user_can_approve_items = false;
			this.settings.user_has_data = false;

			this.settings.shop_name = ( this.plugin.settings.shopName.length > 0 )? this.plugin.settings.shopName: this.settings.shop_name;
			this.settings.shop_welcome_message = ( this.plugin.settings.welcome_message )? this.plugin.settings.welcome_message: this.settings.shop_name;
			this.settings.user_submissions_open = false;
			this.settings.shop_logo = this.plugin.images.ShopLarge;
			this.settings.shop_items = this.plugin.settings.items
			this.settings.shop_categories = this.plugin.settings.categories

			// Create item and category hash
			for ( var i in this.settings.shop_items ) {

				items[this.settings.shop_items[i].item_id] = this.settings.shop_items[i];

			}
			this.settings.shop_items = items;

			for ( var i in this.settings.shop_categories ) {

				categories.push(this.settings.shop_categories[i].categoryName);

			}
			this.settings.shop_categories = categories;

			// Create Pages
			if( location.search.match(/^\?shop$/) ) {

				this.createShop();

			}

			if( location.search.match(/^\?shop\/info\&id=(.+?)$/) ) {

				vitals.shop.infoPage.init();

			}			

		},

		createShop: function () {

			// Add the basics
			var welcomehtml = '',
				shopHTML = '',
				catHTML = '';

            yootil.create.page(/\/\?shop/);
            yootil.create.nav_branch('/?shop', this.settings.shop_name);            

			welcomehtml += '<div id="shop-container">';
			welcomehtml += '<div class="shop-logo"><img class="shop-logo-image" max-width="150px" max-height="150px" src="'+ this.settings.shop_logo + '" /></div>';
			welcomehtml += '<div class="shop-welcomeMessage"><p>' + this.settings.shop_welcome_message + '</p></div>';
			welcomehtml += '<div id="shop-buttons">';			
			welcomehtml += '<a id="shop-help-button" class="button" style="margin-left: 33%" href="/?shop/help" title="Shop Help">Help</a>';	
			welcomehtml += '<div id="swap-view-button" class="left-selected" title="Change Shop View"><div class="side" onclick="$(\'#shop-shelf-icon\').hide();$(\'#shop-shelf-details\').show();$(this).parent().css(\'background\',\'url(' + vitals.shop.plugin.images.leftselectedbutton + ')\')"></div><div class="side" onclick="$(\'#shop-shelf-icon\').show();$(\'#shop-shelf-details\').hide();$(this).parent().css(\'background\',\'url(' + vitals.shop.plugin.images.rightselectedbutton + ')\')"></div></div>';		
			welcomehtml += '</div>';
			welcomehtml += '</div>';

            yootil.create.container(this.settings.shop_name + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get(true) + ')', welcomehtml).appendTo('#content');            

            // Add the icon view
            shopHTML += '<div id="shop-shelf-icon">';
            shopHTML += '<div class="item-shelf"></div>';
            shopHTML += '</div>';
            // Add the detailed view
            shopHTML += '<div id="shop-shelf-details">';
            shopHTML += '<div class="item-shelf"></div>';
            shopHTML += '</div>';
            yootil.create.container("Items", shopHTML).attr('id', 'shop-item-container').appendTo('#content'); 
            $('#shop-item-container > .content.pad-all').removeClass('pad-all');

            // Create cat bars
            catHTML += '<div class="cat-bar">';
            catHTML += '<table>';
            catHTML += '<tbody>';
            catHTML += '<tr>';
            catHTML += '<td><a href="javascript:coid(0)" onclick="$(\'.shop-item\').show();" class="button">All</a></td>';
            for ( var i in this.settings.shop_categories ) {
            	var cClass = this.settings.shop_categories[i].replace(/\s|'|"|&|\./g, '');
            	catHTML += '<td><a href="javascript:void(0)" onclick="$(\'.shop-item\').hide();$(\'.' + cClass + '\').show();" class="button">' + this.settings.shop_categories[i] + '</a></td>';
            }
            catHTML += '</tr>';
            catHTML += '</tbody>';
            catHTML += '</table';
            catHTML += '</div>';
            $('#shop-shelf-icon').before(catHTML);            

            // Item constructor
            function item_constructor(item_data) {
            	this.amount = item_data.amount;
            	this.cost = item_data.cost_of_item;
            	this.description = item_data.description;
            	this.is_givable = item_data.givable;
            	this.image = item_data.image_of_item;
            	this.category = item_data.item_category;
            	this.id = item_data.item_id;
            	this.name = item_data.item_name;
            	this.is_returnable = item_data.returnable; 
            }    
            // Icon constructor
            item_constructor.prototype.icon = function () {
            	var item = this,
            		cClass = this.category.replace(/\s|'|"|&|\./g, ''),
					html = '';

				html += '<div class="shopItemIcon ' + cClass + ' oHidden shop-item" id="' + item.id + '-icon" onmouseover="$(this).removeClass(\'oHidden\')" onmouseout="$(this).addClass(\'oHidden\')">';
				html += '<div class="itemInner">';
				html += '<div class="itemTitle">';
				html += item.name;
				html += '</div>';
				html += '<img src="' + item.image + '" style="max-width: 150px; max-height: 150px; display: block; margin-right: auto; margin-left: auto;" />';
				html += '<div class="itemInfo">';
				html += 'Cost: ' + pixeldepth.monetary.settings.money_symbol + yootil.number_format(parseFloat(item.cost));
				html += '<br />';
				html += 'In Stock: &infin;';
				html += '</div>';
				html += '<div class="itemOverlay">';
				html += '<span class="shopItemIcon left"><a href="/?shop/info&id=' + item.id + '"><img src="' + vitals.shop.plugin.images.InformationSmall + '" /></a></span>';
				html += '<span class="shopItemIcon right"><a href="#" onclick="vitals.shop.addToCart(\'' + item.id + '\')"><img src="' + vitals.shop.plugin.images.DollarSmall + '" /></a></span>';
				html += '</div>';
				html += '</div>';
				html += '</div>';

				return $(html);
            }  

            // Details constructor
            item_constructor.prototype.detailed = function () {
            	var item = this;
            		cClass = this.category.replace(/\s|'|&|\./g, '');
            		html = '';

            	html += '<div class="shopItemDetailed ' + cClass + ' shop-item" id="' + item.id + '-detailed">';
            	html += '<div class="detailedImage">';
            	html += '<img src="' + item.image + '" style="max-width: 150px; max-height: 150px;" />';
            	html += '<div>';
            	html += '<div class="add-to-cart"><a href="javascript:void(0)" class="button">Add To Cart</a></div>';
            	html += '</div>';
            	html += '</div>';
            	html += '<div class="detailedDetails">';
            	html += '<div class="head">';
            	html += '<h3><a href="/?shop/info&id=' + item.id + '">' + item.name + '</a></h3>';
            	html += '<div class="stock">&infin; in stock</div>';
            	html += '</div>';
            	html += '<p class="item-description">' + item.description + '</p>';
            	html += '<div class="item-info">';
            	html += '<span class="attribute">' + this.category + '</span>';
            	html += '<span class="attribute">' + ((this.is_givable == "true")? "Givable": "Non-Givable") + '</span>';
            	html += '<span class="attribute">' + ((this.is_returnable == "true")? "Returnable": "Non-Returnable") + '</span>';            	            	
            	html += '<span class="attribute">' + this.id + '</span>';
            	html += '</div>';
            	html += '</div>';
            	html += '</div>';

            	return $(html);
            }

            // Add icon items
            for ( var i in vitals.shop.settings.shop_items ) {
            	var x = new item_constructor(vitals.shop.settings.shop_items[i]);
            	var y = x.icon();
            	y.appendTo('#shop-shelf-icon > .item-shelf');
            }    

            // Add detailed items
            for ( var i in vitals.shop.settings.shop_items ) {
            	var x = new item_constructor(vitals.shop.settings.shop_items[i]);
            	var y = x.detailed();
            	y.appendTo('#shop-shelf-details > .item-shelf');
            }           


		},

	}

})();





vitals.shop.infoPage = (function(){ 

	var goldShop = pb.plugin.get( 'gold_shop');

	return {

		name: 'infoPage',

		init: function () {
			this.createPage();
			this.addItemInfo();
			this.addCss();
		},

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

	    createPage: function () {

	        var itemId = getURLParams().id,
	            item = vitals.shop.settings.shop_items[itemId];

	        this.data.currentItem = itemId;

	        yootil.create.page( /\/\?shop\/info/ );

	        yootil.create.nav_branch( "/?shop", vitals.shop.settings.shop_name );

	        yootil.create.nav_branch( "/?shop/info&id=" + itemId, "Info: " + item.item_name );

	        $( 'title' ).text( vitals.shop.settings.shop_name + " | Info" );

	        $( '#content' ).append( '<div id="shop-container"></div>' );

	        yootil.create.container( 'Info Item: ' + item.item_name + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'info-container' ).appendTo( '#shop-container' );

	    },

	    addItemInfo: function () {

	        var itemData = vitals.shop.settings.shop_items[this.data.currentItem],
	            html = '';

	        html += '<div class="item-image"><img src="' + itemData.image_of_item + '" /></div>';
	        html += '<div class="money-image"><img src="' + vitals.shop.plugin.images.InformationLarge + '" /></div>';
	        html += '<div class="item-info">';
	        html += '<span class="nameholder">Item: </span><span class="item-attr">' + itemData.item_name + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Description: </span><span class="item-attr">' + ( ( itemData.description.length >= 50 ) ? "<span style='cursor: pointer' onclick='vitals.shop.infoPage.alertInfo()'>(Click to view description)</span>" : itemData.description ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Cost: </span><span class="item-attr">' + pixeldepth.monetary.settings.money_symbol + yootil.number_format( parseFloat( itemData.cost_of_item ) ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">In Stock: </span><span id="item-amount" class="item-attr">&infin;</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Category: </span><span class="item-attr">' + itemData.item_category + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Returnable: </span><span class="item-attr">' + ( ( itemData.returnable == "true" )? "Yes": "No" ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">Giveable: </span><span class="item-attr">' + ( ( itemData.givable == "true" )? "Yes": "No" ) + '</span>';
	        html += '<br />';
	        html += '<br />';
	        html += '<span class="nameholder">ID: </span><span class="item-attr">' + itemData.item_id + '</span>';
	        html += '</div>';

	        $( html ).appendTo( '#info-container > .content' );

	    },

	    alertInfo: function () {

	        var itemData = vitals.shop.settings.shop_items[this.data.currentItem],
	            description = itemData.description;

	        pb.window.alert( description );

	    },

	    addCss: function () {

	        $( '#info-container .item-image' ).css( this.data.styles.itemImage );

	        $( '#info-container .money-image' ).css( this.data.styles.dollarImage );

	        $( '#info-container .item-info' ).css( this.data.styles.itemInfo );

	        $( '.item-info > .nameholder' ).css( this.data.styles.nameHolder );

	        $( '.item-info > .item-attr' ).css( this.data.styles.itemAttr );

	    },

    }

} )();



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
