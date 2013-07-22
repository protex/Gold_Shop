        
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