
		sell: function( user , item , cost ){
			var object = $.parseJSON( vitals.shop.data.get( proboards.plugin.get('gold_shop').settings.data_holder.toString() ) );
			var pObject = $.parseJSON( vitals.shop.data.get() );
			if( vitals.shop.find_amount( pObject['b'] , item ).length >= 1 ){
				object['i'].push({ user:[ item , cost , object['c'] ] });
				pObject['s'].push({ user:[ item , cost , object['c'] ] });
				object['c']++;
				vitals.shop.data.set( proboards.plugin.get('gold_shop').settings.data_holder.toString() , JSON.stringify( object ) );
				vitals.shop.data.set( JSON.stringify( pObject ) );
				vitals.shop.api.remove( proboards.data('user').id , item , 1 );
			}
		},