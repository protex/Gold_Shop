        
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