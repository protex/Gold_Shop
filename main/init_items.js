
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