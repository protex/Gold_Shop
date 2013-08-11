        
        give: function( user , give_item , amount , inif ){
            if( yootil.is_json( vitals.shop.data.get( user ) ) ){
                var data = $.parseJSON( vitals.shop.data.get(user) );
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