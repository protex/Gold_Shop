

var infoPackagePage = (function(){ 

	return {

		name: 'infoPackage',

		module: 'shop',

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