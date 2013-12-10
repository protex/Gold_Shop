        
        _return: function( user , return_item , amount , inif ){
            if( yootil.is_json( vitals.shop.data.get( user ) ) ){
                var data = $.parseJSON( vitals.shop.data.get(user) );
                var items = vitals.shop.data.items; 
                for( x=0; x<items.length; x++ ){
                    if( return_item == items[x].item_id ){  
                        if( items[x].returnable == "true" ){ 
                            if( inif != true ){
                                pixeldepth.monetary.add( items[x].cost_of_item * parseInt( amount ) * ( ( proboards.plugin.get('gold_shop').settings.retail == "" )? 1 : parseInt( proboards.plugin.get('gold_shop').settings.retail ) ) );  							
                                vitals.shop.api.remove(user , return_item , amount );
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