



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