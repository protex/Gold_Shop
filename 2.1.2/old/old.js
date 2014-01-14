if( typeof vitals == "undefined" ){
    vitals = {};
}

(function( $ ) {
  $.fn.rightClick = function(method) {
      
    $(this).mousedown(function(e) {
        if (e.which === 3) {
            e.preventDefault();
            method();
        }
    });

  };
})( jQuery );

if( proboards.plugin.get('gold_shop').settings.items_json != '' && proboards.plugin.get('gold_shop').settings.items_json != "undefined" ){
    if( JSON.stringify(proboards.plugin.get('gold_shop').settings.items) == "[]" ){
    	proboards.plugin.get('gold_shop').settings.items = $.parseJSON( proboards.plugin.get('gold_shop').settings.items_json );
    }else{
        var old = $.parseJSON( proboards.plugin.get('gold_shop').settings.items_json );
        var nw = proboards.plugin.get('gold_shop').settings.items;
     	proboards.plugin.get('gold_shop').settings.items = old.concat(nw);
    }
}

vitals.shop = (function(){
   
    return{   
        
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
        
        subtract: function(value , bank){
            pixeldepth.monetary.subtract( value , bank );
        },
        
        add: function( value , bank ){
          	pixeldepth.monetary.add( value , bank );  
        },
        
        init: function(){
            yootil.create.page("?shop?items", "Shop");
			vitals.shop.data.shop_items = ( yootil.is_json( vitals.shop.data.get() ) )? $.parseJSON( vitals.shop.data.get() ) : vitals.shop.data.object;
            vitals.shop.init_shop();
            if( proboards.data('route').name == 'user' || proboards.data('route').name == 'current_user' || proboards.data('route').name == 'edit_user_personal' ){
             	vitals.shop.init_profile_view();   
            }
        }, 
        
        content_remove: function(new_content){
            $('#content').html(new_content);  
        },
        
        init_shop: function(){
            if( location.href.match(/\?shop\?/i) ){
                yootil.create.nav_branch("/user\?shop\?", "Shop");
                $('.state-active:first').attr('class','');
                $('[href="/user\?shop\?items"]').attr('class','state-active');
                $('title:first').text('Shop | Items & Costs');
                var html = "";
                html += '<div class="container shop-welcome">';
                html += '<div class="title-bar"><h1>The Shop</h1><a style="float: right" class="button" href="javascript:void(0)" role="button" id="return-item">Return Item</a></div>';
                html += '<div id="welcome-message" class="content cap-bottom"><center>' + vitals.shop.data.welcome_message + '</center></div>';
                vitals.shop.content_remove(html);
                vitals.shop.init_items();
                vitals.shop.init_return();
            }
        },
        
        init_return: function(){
            $("#return-item").click(function(){
                if( yootil.is_json( vitals.shop.data.get() ) ){
                    proboards.dialog('return_item_box',
                        {
                            title:'Give Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api._return( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , true ) ){
                                        if( vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , true ) ){                                            
                                            vitals.shop.api._return( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() );
                                            $(this).dialog('close');
                                        }else{
                                            proboards.alert('Error: You do not have enought of that item.');
                                        }
                                    }else{
                                        proboards.alert('Error: That item is not returnable.'); 
                                    }
                                    
                                },
                                'Cancel': function(){
                                    $(this).dialog('close');
                                },
                            }
                        }
                    )                    
                }else{
                    proboards.alert('Error: You do not have any items to return');   
                }
            });
        },
        
        init_items: function(){
          	if( location.href.match(/\?shop\?items/) ){
                yootil.create.nav_branch('/\?shop?items/','Items & Costs');
                shop_catagories = [];
                var items = vitals.shop.data.items;
                var table_html = '<table class="list" role="grid">' +
                                    '<thead>' +
                                        '<tr>' +
                                            '<th class="icon" style="width: 50%">Item</th>' +
                                            '<th class="main" style="width: 300px">Description</th>' +
                                            '<th class="latest last" style="width: 200px;">Cost | Amount | ID</th>' +
                                        '</tr>' +
                                    '</thead>' +
                                '<tbody>' +
                    			'</tbody>' +
                                '</table>';
				var cats = proboards.plugin.get('gold_shop').settings.catagories;
                for( i=0; i<cats.length; i++){
                 	shop_catagories.push( cats[i].catagory );  
                }
                for( i=0; i<shop_catagories.length; i++ ){
                	if( $('.shop-catagory').length < 1 ){
                        $('.shop-welcome').after('<div class="container"><div onclick="$(this).siblings().first().toggle()" style="cursor: pointer" class="shop-catagory-first shop-catagory title-bar"><h1 class="catagory-title">' + shop_catagories[i] +'</h1></div><div style="display: none" class="content cap-bottom">' + table_html + '</div></div>');
                    } 
                    else{
                        $('.shop-catagory:last').parent().after('<div class="container"><div onclick="$(this).siblings().first().toggle()" style="cursor: pointer" class="shop-catagory title-bar"><h1 class="catagory-title">' + shop_catagories[i] +'</h1></div><div style="display: none" class="content cap-bottom">' + table_html + '</div></div>');	   
                    }
                }
                for( i=0; i<items.length; i++){
                    var item_ = items[i].item_id;
                    $('.shop-catagory').each(function(){
                     	if( $(this).text() == items[i].item_catagory ){
                            $(this).parent().children().last().children().first().children().last().append('<tr class="shelf board item"><td class="icon"></td><td class="main"></td><td class="latest last"></td></tr>');
                            $(this).parent().children().last().children().first().children().last().children().last().children().first().next().attr('item-number', items[i].item_id ).click(function(){
                                var cost = $(this).parent().children().last().text().split('|')[0].replace( /[^0-9]/ , '' );
                                var item_number = $(this).attr('item-number');
                            	proboards.confirm('<h4>Are you sure you would like to make this purchace?</h4>',
                          			function(){  
                                        if( pixeldepth.monetary.get() >= cost ){
                                            var object = vitals.shop.data.object;
            								vitals.shop.subtract( cost );
                                            if( yootil.is_json( proboards.plugin.key('gold_shop').get() ) ){
                                            	object = $.parseJSON( proboards.plugin.key('gold_shop').get() ); 	   
                                            }
                                            object.b.push( {'#' : item_number} );
                                            object.lb = item_number;
                                           	vitals.shop.data.set( JSON.stringify(object) );
                                            vitals.shop.check_amount( item_number );
                                            vitals.shop.data.current_item = item_number;
                                        }
                                        else{
                                         	proboards.alert('<h4>Sorry, insufficient funds.</h4>');   
                                        }
                                    }
                                ); 
                            });
                         	$(this).parent().children().last().children().first().children().last().children().last().children().first().html('<img src=' + items[i].image_of_item +'></img>'); 
                            $(this).parent().children().last().children().first().children().last().children().last().children().first().next().html( items[i].description );
                            $(this).parent().children().last().children().first().children().last().children().last().children().last().html( '<center>' + pixeldepth.monetary.settings.money_symbol + items[i].cost_of_item + ' | ' + ((items[i].amount == '')? '&infin;' : items[i].amount) + ' | ' + items[i].item_id + '</center>' );
                        }
                    });
                }
                vitals.shop.check_amount('');
            }
        },
        
        init_profile_view: function(){
            var text_size = (proboards.plugin.get('gold_shop').settings.profile_page_text_size == "")? 6 : proboards.plugin.get('gold_shop').settings.profile_page_text_size;
            var html = '<div class="content-box center-col">'
                html += '<table>';
            	html += '<tr><td width="100%"><center><font size="' + text_size + '">Shop Items</font></center></td></tr>';
                html += '<tr><td id="display"></td></tr>';
            	html += '</table>';
                html += '</div>';
            var items = vitals.shop.data.items;
            var user_id = location.href.split('/user/')[1];
            vitals.shop.data.shop_items = ( yootil.is_json( proboards.plugin.key('gold_shop').get(user_id) ) )? $.parseJSON( proboards.plugin.key('gold_shop').get(user_id) ) : vitals.shop.data.object;
            var display_items = vitals.shop.data.shop_items.b;
            var display_recieved = vitals.shop.data.shop_items.r; 
            ($('.status-input').length > 0 )? $('#center-column').children().first().next().after(html) : $('#center-column').children().first().after(html);
            for( i=0; i<display_items.length; i++){
                for( x=0; x<items.length; x++){
                    var description = items[x].description;
                    if( display_items[i]['#'] == items[x].item_id ){
                     	$('#display').append('<img title="' + description + '" style="max-height: 100px; max-width: 100px" class="' + items[x].item_id + '" src=' + items[x].image_of_item + '></img>');
                    }
                }
            }
            for( i=0; i<display_recieved.length; i++){
                for( x=0; x<items.length; x++){
                    var description = items[x].description;
                    if( display_recieved[i]['#'] == items[x].item_id ){
                     	$('#display').append('<img title="' + description + '" style="max-height: 100px; max-width: 100px" class="' + items[x].item_id + '" src=' + items[x].image_of_item + '></img>');
                    }
                }
            }
            for( i=0; i<items.length; i++){
                $('.' + items[i].item_id + ':last').attr('title', "Description: " + $('.' + items[i].item_id + ':last').prop('title') + "\n" + "Amount: " + $('.' + items[i].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( display_items , items[i].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( display_recieved , items[i].item_id ).length );
                if( $('.'+items[i].item_id).length > 1 ){
                    for( x=$('.'+items[i].item_id).length; x > 1; x-- ){
                        $('.'+items[i].item_id+':first').remove();
                    }
                }
            }
			if( !location.href.match(proboards.data('user').url) ){
                $("[href='/conversation/new/" + location.href.split('/user/')[1] +"']").before('<a class="button" href="javascript:void(0)" role="button" id="give_item">Give Item</a>');
                $('#give_item').click(function(){
                    proboards.dialog('give_item_box',
                        {
                            title:'Give Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api.give( user_id , $('#item_id').val() , $('#item_amount').val() , true ) ){
                                    	if( vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , true ) ){
                                            vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , false);
                                            vitals.shop.api.give( user_id , $('#item_id').val() , $('#item_amount').val() );
                                            $(this).dialog('close');
                                        }else{
                                            proboards.alert('Error: You do not have enought of that item.');
                                        }
                                    }else{ 
                                        proboards.alert('Error: That item is not givable.'); 
                                    }
                                    
                                },
                                'Cancel': function(){
                                    $(this).dialog('close');
                                },
                            }
                        }
                    )  
                });
            } 
            this.init_moderation();
        },
        
        
        init_moderation: function(){
            if( proboards.data('route').name == "user" && !location.href.match(proboards.data('user').url) && $.inArray( proboards.data('user').id.toString(), proboards.plugin.get('gold_shop').settings.removers ) > -1 ){
				$("[href='/conversation/new/" + location.href.split('/user/')[1] +"']").before('<a class="button" href="javascript:void(0)" role="button" id="remove_item">Remove Item</a>');
                $('#remove_item').click(function(){
                    proboards.dialog('give_item_box',
                        {
                            title:'Remove Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input><br /><select id="given"><option value="true">Yes</option><option value="false">No</option></select>Given?',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api.remove( location.href.split('/user/')[1] , $('#item_id').val() , $('#item_amount').val() , ( ($('#given').val() == "true")? true : false ) , true ) ){
                                        vitals.shop.api.remove( location.href.split('/user/')[1] , $('#item_id').val() , $('#item_amount').val() , ( ($('#given').val() == "true")? true : false ) );                                        
                                        $(this).dialog('close');
                                    }else{
                                        proboards.alert('Error: This user does not have enought of that item.');
                                    }
                                    
                                },
                                'Cancel': function(){
                                    $(this).dialog('close');
                                },
                            }
                        }
                    )
                });
            }                
        },
        
        check_amount: function( current_item ){
          if( yootil.is_json( proboards.plugin.key('gold_shop').get() ) ){
                var items = vitals.shop.data.items;             
                var parse = $.parseJSON( proboards.plugin.key('gold_shop').get() );
                var possessions = parse.b;
                for( x=0; x<items.length; x++ ){
                    if(vitals.shop.find_amount(possessions , items[x].item_id).length > parseInt(items[x].amount) - 1){
                        $('.main').each(function(){
                            if( $(this).attr('item-number') == items[x].item_id ){
                                $(this).parent().remove();   
                            }
                        });
                    }
                    if( current_item == '' || current_item == 'undefined' ){
                        $('.last').each(function(){
                            if( $(this).siblings().first().next().attr('item-number') == items[x].item_id ){
                                if( !isNaN( (parseInt( $(this).text().split('|')[1] ) - parseInt( vitals.shop.find_amount( possessions , items[x].item_id ).length ) ) ) ){
                                	$(this).html( '<center>' + $(this).text().split('|')[0] + '| ' + (parseInt( $(this).text().split('|')[1] ) - parseInt( vitals.shop.find_amount( possessions , items[x].item_id ).length ) ) + ' | ' + items[x].item_id + '</center>' ); 
                                }
                            }
                        });
                    }
                    else{
                        $('.last').each(function(){
                            if( $(this).siblings().first().next().attr('item-number') == items[x].item_id && $(this).siblings().first().next().attr('item-number') == current_item ){
                            	if( !isNaN( (parseInt( $(this).text().split('|')[1] ) - 1 ) ) ){
                                	$(this).html( '<center>' + $(this).text().split('|')[0] + '| ' + (parseInt( $(this).text().split('|')[1] ) - 1 ) + ' | ' + items[x].item_id + '</center>' );   
                                }
                            }
                        });                        
                    }
                }
            }  
        },
        
        
            
        
    }
    
})();

vitals.shop.data = {
            
    items: proboards.plugin.get('gold_shop').settings.items, 
    
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
        // items bought
        b: [],
        // Items for sale
        s: [],
        // Items recieved
        r: [],
        // Last item bought
        lb: '',
    },
    
    shop_items: 0,
    
    clear: function(){
        proboards.plugin.key('gold_shop').set('');
    },
    
    current_item: '',
        	
},

vitals.shop.api = (function(){
	
    return{
        
        onBought: function( item , callback ){
            if( yootil.is_json( proboards.plugin.key('gold_shop').get() ) ){
                vitals.shop.data.object = $.parseJSON( proboards.plugin.key('gold_shop').get() );
                var object = vitals.shop.data.object;
                if( object.lb == item ){
                    object.lb = '';
                    vitals.shop.data.set( JSON.stringify(object) );
                    callback(); 
                }
            }
        },
        
        buy: function( item , amount ){
            var items = vitals.shop.data.items;
            vitals.shop.data.object = ( yootil.is_json( vitals.shop.data.get() ) )? $.parseJSON( vitals.shop.data.get() ) : vitals.shop.data.object; 	   
            var data = vitals.shop.data.object;
			for( i=0; i<items.length; i++){ 
             	if( items[i].item_id == item ){
                 	if( pixeldepth.monetary.get() >= (items[i].cost_of_item * amount) ){
                        for( x=0; x<amount; x++){
                        	data.b.push({"#": item});
                        }
                        pixeldepth.monetary.add( items[i].cost_of_item * amount );
                        vitals.shop.data.set( JSON.stringify( data ) );
                    }
                }
            }
        },
        
        _return: function( user , return_item , amount , inif ){
            if( yootil.is_json( vitals.shop.data.get( user ) ) ){
             	vitals.shop.data.object = $.parseJSON( vitals.shop.data.get(user) );
                var data = vitals.shop.data.object;
                var items = vitals.shop.data.items; 
                for( x=0; x<items.length; x++ ){
                    if( return_item == items[x].item_id ){   
                        if( items[x].returnable == "true" ){ 
                            if( inif != true ){
                                vitals.shop.api.remove(user , return_item , amount );
                                pixeldepth.monetary.add( items[x].cost_of_item * parseInt( ( proboards.plugin.get('gold_shop').settings.retail == "" )? 1 : proboards.plugin.get('gold_shop').settings.retail ) * amount );  
                            }
                            return true;
                            break;
                        }else{
                            return false;
                        }	
                    }
                }                
            }else{
                return false;
            }
        },
        
        remove: function( user , return_item , amount , given , inif ){
            vitals.shop.data.object = $.parseJSON( vitals.shop.data.get(user) );
            var data = vitals.shop.data.object;
            var items = vitals.shop.data.items;
            var possessions = ( given )? data.r : data.b;  
            if( vitals.shop.find_amount( possessions , return_item ).length >= amount ){
                    for( x=0; x<items.length; x++ ){
                        for( i=0; i<possessions.length; i++ ){
                            if( possessions[i]['#'] == return_item ){  
                                if( inif != true ){
                                    possessions.splice(i , 1); 
                                    proboards.plugin.key('gold_shop').set( user , JSON.stringify( data ) );
                                    amount = amount - 1;
                                    if( amount == 0 ){
                                        return true;
                                        break;
                                    }
                                }
                                if( inif == true ){
                                    return true
                                }
                            }
                        }
                    }  					
            }else{
                return false;
            }                     
        },
        
        give: function( user , give_item , amount , inif ){
            if( yootil.is_json( vitals.shop.data.get( user ) ) ){
            	vitals.shop.data.object = $.parseJSON( vitals.shop.data.get(user) );
                var data = vitals.shop.data.object;
                var items = vitals.shop.data.items;
                for( i=0; i<items.length; i++ ){
                 	if( items[i].item_id == give_item ){
                        if( items[i].givable == "true" ){
                            if( inif != true ){                
                                for( x=0; x<amount; x++){
                                    data.r.push( { "#" : give_item } ); 
                                }  
                                vitals.shop.data.set( user , JSON.stringify( data ) );
                            }
                            return true;
                            break;
                        }else{
                         	return false;   
                        }
                    }
                }
            }
            else{
             	var data = vitals.shop.data.object;
                var items = vitals.shop.data.items;
                for( i=0; i<items.length; i++ ){
                 	if( items[i].item_id == give_item ){
                        if( items[i].givable == "true" ){
                            if( inif != true ){                               
                                for( i=0; i<amount; i++ ){
                                    data.r.push( { "#" : give_item } );
                                }  
                                vitals.shop.data.set( user , JSON.stringify( data ) );
                            }
                            return true;
                    	}else{
                         	return false;   
                        }                            
                    }
                }
            }
        },
        
    }
    
})();

$(document).ready(function(){
	vitals.shop.init();
});



