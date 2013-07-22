
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
        