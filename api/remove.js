        
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