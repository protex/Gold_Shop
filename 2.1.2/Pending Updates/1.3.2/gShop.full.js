if( typeof vitals == "undefined" ){
    vitals = {};
}

(function( $ ) {
  $.fn.rightClick = function( method ) {
      
    $(this).mousedown(function( e ) {
        if( e.which === 3 ) {
            e.preventDefault();
            method();
        }
    });

  };
})( jQuery );

if( yootil.is_json( proboards.plugin.get('gold_shop').settings.json ) ){
	if( JSON.stringify( proboards.plugin.get('gold_shop').settings.items ) == "[]" ){
		proboards.plugin.get('gold_shop').settings.items = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
	}else{
		var old = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
		var nw = proboards.plugin.get('gold_shop').settings.items;
		proboards.plugin.get('gold_shop').settings.items = old.concat(nw);
	}
}

$(document).ready(function(){
	vitals.shop.init();
});

vitals.shop = (function(){
   
    return{

        addItems: function () {

            Variables:
            items: Shortcut to items stored in vitals.shop.data
            categories: shorctut to categories stored in vitals.shop.data
            data: users data stored in vitals.shop.data
            var items = vitals.shop.data.items,
                categories = vitals.shop.data.categories,
                data = vitals.shop.data.object;

            for ( i = 0; i < categories.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {

                    if ( categories[i].catagory == items[x].item_catagory ) {  
                        
                        var html = '';
                            html += '<tr class="item">';
                            html += '<td title="' + items[x].item_name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + items[x].image_of_item + '" /></td>';
                            html += '<td class="description">' + items[x].description + '</td>';
                            html += '<td style="text-align: center;" class="cost">' + items[x].cost_of_item + '</td>';
                            html += '<td style="text-align: center;" class="available" id="available-' + items[x].item_id +'">' + vitals.shop.recount( items[x].item_id ) + '</td>';
                            html += '<td style="text-align: center;" class="id">' + items[x].item_id + '</td>';
                            html += '<td><a href="javascript:vitals.shop.buyItem(' + items[x].item_id + ')" role="button" class="button">Buy</a></td>';
                            html += ( items[x].returnable == "true" )? '<td><a href="javascript:vitals.shop.returnItem(' + items[x].item_id + ')" role="button" class="button">Return</a></td>' : '<td><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></td>';
                            html += '</tr>';

                        $( '#' + i ).append( html );

                    }

                }

            }

        },


                buyItem: function ( id, amount ) {

                    if( amount == undefined ) {

                        amount = 1;

                    }

                    proboards.dialog('buy_item_box',

                        {

                            title:'Buy Item',

                            html:'Are you sure you would like to buy this item?<br /><br /><b>Optional: How many?</b><br /><input id="buy-amount" />',

                            buttons: {

                                'Confirm': function () {

                                    if ( !$( '#buy-amount' ).val().match(/[^0-9]/gi) ) {

                                        amount = parseInt( $( '#buy-amount' ).val() );

                                    } else { 
                                        pb.window.error( '<i>Gold Shop Error: 103</i><br /><br />The amount you entered is not a valid number!' );

                                        $( this ).dialog( 'close' );

                                        return false;

                                    }

                                    if ( vitals.shop.isItem( id ) ) {

                                        if ( canSubtract( id, amount ) ) {

                                            if ( canBuyAmount( id, amount) ) {

                                                buy( id, amount );

                                                subtractMoney( id, amount );

                                                $( this ).dialog( 'close' );

                                            } else {

                                                pb.window.error( '<i>Gold Shop Error: 102</i><br /><br />You can\'t buy that amount!' );

                                            }

                                        } else {

                                            pb.window.error( '<i>Gold Shop Error: 101</i><br /><br />You do not have enough money to buy that item!' );

                                            $( this ).dialog( 'close' );

                                        }

                                    } else {

                                        pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                                    }
            
                                },

                                'Cancel': function () {

                                    $( this ).dialog( 'close' );

                                },

                            }

                        }

                    );

                    function canSubtract ( item, number ) {

                        var items = vitals.shop.data.items;

                        for ( i = 0; i < items.length; i++ ) {

                            if ( items[i].item_id == item ) {

                                var money = pixeldepth.monetary.get();

                                var cost = items[i].cost_of_item * number;

                                if ( money - cost >= 0 ) {

                                    return true;

                                } else {

                                    return false;

                                }

                            }

                        }

                    }

                    function subtractMoney ( item, number) {

                        var items = vitals.shop.data.items;

                        for ( i = 0; i < items.length; i++ ) {

                            if ( items[i].item_id == id ) {

                                pixeldepth.monetary.subtract( items[i].cost_of_item * number );

                            }

                        }

                    }

                    function canBuyAmount ( item, number ) {

                        var items = vitals.shop.data.items;

                        for ( i = 0; i < items.length; i++ ) {

                            if ( items[i].item_id == item ) {

                                if ( ( items[i].amount - number ) - vitals.shop.find_amount( vitals.shop.data.object.b.concat( vitals.shop.data.object.r ), item ).length >= 0  || items[i].amount == "" ) {

                                    return true;

                                } else {

                                    return false;

                                }

                            }

                        }

                    }

                    function buy( item, number ) {

                        for ( i = 0; i < number; i++ ) {

                            vitals.shop.data.object.b.push( id );

                        }

                        proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

                    }

                },


        createShelf: function ( title, id ) {

            var html = "";
            html += '<div class="container category-' + title +'">';
            html += '<div class="title-bar"><h1>' + title + '</h1></div>';
            html += '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="width: 200px;">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 5%">Buy</th><th style="width: 8%">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            return $( html );

        },

        find_amount: function(obj, val) {

            var objects = [];

            for (var i in obj) {

                if (!obj.hasOwnProperty(i)) continue;

                if (typeof obj[i] == 'object') {

                    objects = objects.concat(vitals.shop.find_amount(obj[i], val));

                } else if (obj[i] == val && i != '') {

                    objects.push(i);

                }

            }

            return objects;

        },

        give: function ( user ) {

            var currUserObject = vitals.shop.data.object,
                bought = currUserObject.b,
                received = currUserObject.r,
                boughtArr = [],
                receivedArr = [],
                items = vitals.shop.data.items,
                benificiaryItems = proboards.plugin.key('gold_shop').get( user ),
                counter = 0,
                alreadyAddedB = [],
                alreadyAddedR = [];

            if ( benificiaryItems == undefined || benificiaryItems == "" ) {

                benificiaryItems = { "b":[], "r":[], "s":[], "lb":"" };

            }

            for ( x = 0; x < bought.length; x++ ) {

                for ( i = 0; i < items.length; i++ ) {

                    if ( items[i].item_id == bought[x] ) {

                        if ( items[i].givable == "true" ) {

                            if ( vitals.shop.find_amount( alreadyAddedB, bought[x] ).length < 1 ) {

                                alreadyAddedB.push( bought[x] );

                                boughtArr.push( {"id":bought[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            for ( x = 0; x < received.length; x++ ) {

                for ( i = 0;  i < items.length;  i++) {

                    if ( items[i].item_id == received[x] ) {

                        if ( items[i].givable == "true" ) {

                            if ( vitals.shop.find_amount( alreadyAddedR, received[x] ).length < 1 ) {

                                alreadyAddedR.push( received[x] );

                                receivedArr.push( {"id":received[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            if ( boughtArr.length > 0 ) {

                var boughtOptions = "";

                for ( i = 0; i < boughtArr.length; i++ ) {
                    boughtOptions += '<option value="' + boughtArr[i].id + '">' + boughtArr[i].name + '</option>';

                }

            }

            if ( receivedArr.length > 0 ) {

                var receivedOptions = "";

                for ( i = 0; i < receivedArr.length; i++ ) {

                    receivedOptions += '<option value="' + receivedArr[i].id + '">' + receivedArr[i].name + '</option>';

                }

            }

            proboards.dialog('give_item_box',

                {

                    title:'Bought or Given',

                    html:'Would you like to give this user a bought or given item?',

                    buttons: {

                        'Bought': function () {

                            $( this ).dialog( 'close' );

                            proboards.dialog('bought_item_box',

                                {

                                    title: 'Give a bought item',

                                    html: 'Which item would you like to give?<br /><select id="bought-items-select">' + boughtOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    buttons: {

                                        'Give' : function () {

                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val() ) ) {

                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val() );

                                                var amount = parseInt( $( '#bought-items-amount' ).val() );

                                                for ( i = 0; i < amount; i++ ) {

                                                    benificiaryItems.r.push( $( '#bought-items-select' ).val() );

                                                }

                                                proboards.plugin.key('gold_shop').set( user, benificiaryItems );

                                                $( this ).dialog( 'close' );

                                            } else {

                                                $( this ).dialog( 'close' );

                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, you do not have that many of that item' );

                                            }


                                        },

                                        'Cancel' : function () {

                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        'Received': function () {

                            $( this ).dialog( 'close' );

                            proboards.dialog('received_item_box',

                                {

                                    title: 'Give a received item',

                                    html: 'Which item would you like to give?<br /><select id="bought-items-select">' + receivedOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    buttons: {

                                        'Give' : function () {

                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true ) ) {

                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true );

                                                var amount = parseInt( $( '#bought-items-amount' ).val() );

                                                for ( i = 0; i < amount; i++ ) {

                                                    benificiaryItems.r.push( $( '#bought-items-select' ).val() );

                                                }

                                                proboards.plugin.key('gold_shop').set( user, benificiaryItems );

                                                $( this ).dialog( 'close' );

                                            } else {

                                                $( this ).dialog( 'close' );

                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, you do not have that many of that item' );

                                            }


                                        },

                                        'Cancel' : function () {

                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        'Cancel': function () {

                            $( this ).dialog( 'close' );

                        },

                    }

                }

            );

        },

        hasAmount: function ( item, amount, received ) {

            var items,
                count = 0;

            if ( received ) {

                items = vitals.shop.data.object.r;

            } else {

                items = vitals.shop.data.object.b;

            }

            for( i = 0; i < items.length; i++ ) {

                if( items[i] == item ) count++;
                
            }

            if ( count >= amount ) {

                return true

            } else {

                return false;

            }

        },

        removeItems: function ( item, amount, received ) {

            var items,
                count = 0;

            if ( received ) {

                items = vitals.shop.data.object.r;

            } else {

                items = vitals.shop.data.object.b;

            }

            for( i = 0; i < items.length; i++ ) {

                if ( count != amount ) {

                    if( items[i] == item ) {

                        items.splice( i, 1 );

                        count++;

                    }

                } else {

                    break;

                }
                
            }

            proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

        },

        init: function () {

            yootil.bar.add("/user?shop", pb.plugin.get('gold_shop').images.shop_20x20, "Shop", "vGoldShop");

            if ( pb.plugin.key( 'gold_shop' ).get() !== "" && pb.plugin.key( 'gold_shop' ).get() != undefined ) {

                if( !yootil.is_json( pb.plugin.key( 'gold_shop' ).get() ) ) {

                    vitals.shop.data.object = pb.plugin.key( 'gold_shop' ).get();

                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                } else {

                    var data = $.parseJSON( pb.plugin.key( 'gold_shop' ).get() ),
                        bought = [],
                        recieved = [];

                    for( i = 0; i < data.b.length; i++ ){

                        bought.push( data.b[i]['#'] );

                    }

                    data.b = bought;

                    for( i = 0; i < data.r.length; i++ ) {

                        recieved.push( data.b[i]['#'] );

                    }

                    data.r = recieved;

                    vitals.shop.data.object = data;

                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                }

            } 

            if ( pb.data('route').name == "current_user" && location.href.match(/\?shop/) ) {

                this.initShopPage();

            }

            if ( pb.data( 'route' ).name == "current_user" || pb.data( 'route' ).name == "user" ) {

                if ( !location.href.match(/\?shop/) ) {

                    this.initProfile();

                    if ( pb.data('route') != "current_user" ) {

                        this.initProfileGive();

                    }

                }

            }

        },


        initProfile: function () {

            var html = '';
                html += '<div class="content-box center-col">';
                html += '<table id="shop-items">';
                html += '<tbody>';
                html += '<tr>';
                html += '<td style="text-align: center"><font size="6">Items</font></td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td id="shelf"></td>';
                html += '</tr>';
                html += '</tbody>';
                html += '</table>';
                html += '</div>';

            $( '.content-box:last' ).prev().after( html );

            this.shelveItems();

        },

        initProfileGive: function () {

            var user = location.href.split( "/user/" )[1];

            if ( user != pb.data('user').id ) {

                $( '[href="/conversation/new/' + user + '"]' ).before( '<a href="javascript:vitals.shop.give('+ user +')" class="button">Give</a>' );

            }

        },

        initShelves: function () {

            var categories = vitals.shop.data.categories;

            for( i = 0; i < categories.length; i++ ) {

                this.createShelf( categories[i].catagory, i ).appendTo( '#content' );

            }

        },

        initShopPage: function () {

            yootil.create.page(/\?shop/, "Shop");

            yootil.create.nav_branch("/user\?shop", "Shop");

            $('.state-active:first').attr('class','');

            $('title:first').text('Shop | Items & Costs');

            var html = "";
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom"><center>' + vitals.shop.data.welcome_message + '</center></div>';
            html += '</div>';

            $( '#content' ).append( html );

            this.initShelves();

            this.addItems();

        },

        isItem: function ( item ) {

            var items = vitals.shop.data.items;

            for ( i = 0; i < items.length; i++ ) {

                if ( items[i].item_id == item ) {

                    return true;

                }

            }

            return false;

        },

        
        recount: function ( item ) {

            var items = vitals.shop.data.items,
                data = vitals.shop.data.object;

            for ( i = 0; i < items.length; i++ ) {

                if ( items[i].item_id == item ) {

                    if ( items[i].amount != "" ) {

                        var recalculate = items[i].amount - find_amount( data.b, item ) - find_amount( data.r, item );

                        if( parseInt( recalculate ) > 0 ) {

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

        returnItem: function ( id ) {

            proboards.dialog('return_item_box',

                {

                    title:'Return Item',

                    html:'How Many items would you like to return?<br /><br /><input id="return-amount" />',

                    buttons: {

                        'Confirm': function () {

                            var returnAmount = $( '#retern-amount' ).val();

                            if ( vitals.shop.isItem( id ) ) {

                                if ( isReturnable( id ) ){

                                    if ( vitals.shop.hasAmount( id, returnAmount ) ) {

                                        vitals.shop.removeItems( id, returnAmount );

                                        addMoney( id, returnAmount ); 
                                        
                                    } else {

                                        pb.window.error( '<i>Gold Shop Error: 202</i><br /><br />You do not have that many of this item!' );

                                    }

                                } else {
                                    
                                    pb.window.error( '<i>Gold Shop Error: 201</i><br /><br />That item is not returnable!' );

                                }
                            
                            } else {

                                pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                            }
            
                        },

                        'Cancel': function () {

                            $( this ).dialog( 'close' );

                        },

                    }

                }

            ); 

            local function: isReturnable
            purpose: Check if an item can be returned
            variabls: 
            item = the id of the item in question
            function isReturnable( item ) {

                var items = vitals.shop.data.items;

                for ( i = 0; i < items.length; i++ ) {

                    if ( items[i].item_id == item ) {

                        if ( items[i].returnable == "true" ) {

                            return true;

                        } else {

                            return false;

                        }

                    }

                }

            }

            function addMoney ( item, amount ) {

                var items = vitals.shop.data.items;

                for ( i = 0; i < items.length; i++ ) {

                    if ( items[i].item_id == item ) {

                        pixeldepth.monetary.add( items[i].cost_of_item * amount * retail );

                    }

                }

            }

        },

        shelveItems: function () {

            var user = ( pb.data( 'route' ).name == "current_user" ) ? pb.data( 'user' ).id : location.href.split( '/user/' )[1],
                data = proboards.plugin.key( 'gold_shop' ).get( user ),
                items = vitals.shop.data.items;

            if ( data == undefined ) {

                data = { "b":[], "r":[], "s":[], "lb":"" };

            }

            for ( i = 0; i < data.r.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {

                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    if( description.length > 100 ){

                        sliced = description.slice(0 , 100);

                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    if ( data.r[i] == items[x].item_id ) {

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.r[i] + '" src="' + items[x].image_of_item + '" />' );

                        func = function (){

                            var ac = arguments.callee;

                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );

                        }

                        func.dname = name;
                        func.description = description;

                        $( '.' + items[x].item_id ).click(func);

                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            for ( i = 0; i < data.b.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {

                    
                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    if( description.length > 20 ){

                        sliced = description.slice(0 , 100);

                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    if ( data.b[i] == items[x].item_id ) {

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.b[i] + '" src="' + items[x].image_of_item + '"></img>' )

                        func = function (){
                            var ac = arguments.callee;
                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );
                        }
                        func.dname = name;
                        func.description = description;
                        $( '.' + items[x].item_id ).click(func);

                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            for( i=0; i<items.length; i++){

                if( $('.'+items[i].item_id).length > 1 ){

                    for( x=$('#shelf > .'+items[i].item_id).length; x > 1; x-- ){

                        $('#shelf > .'+items[i].item_id+':first').remove();

                    }

                }

            }

        },

    }
    
})();

vitals.shop.data = {
            
    items: proboards.plugin.get('gold_shop').settings.items,

    categories: proboards.plugin.get('gold_shop').settings.catagories,
    
    set: function( x , y ){
        if(x == ""){
            x = y;
            y = undefined;
        }
        proboards.plugin.key('gold_shop').set( x , y );
    },
    
    get: function( x ){
        return proboards.plugin.key('gold_shop').get( x );   
    },
    
    welcome_message: (proboards.plugin.get('gold_shop').settings.welcome_message != '')? proboards.plugin.get('gold_shop').settings.welcome_message : "<font size='5'>Welcome to The Shop!</font>",
    
    object: {
        b: [],
        s: [],
        r: [],
        lb: '',
    },
    
    shopItems: [],
    
    clear: function(){
        proboards.plugin.key('gold_shop').set('');
    },
    
    current_item: '',
        	
},

vitals.shop.api = (function(){
	
    return{        
    }
    
})();