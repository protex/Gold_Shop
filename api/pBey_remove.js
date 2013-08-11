
		pBey_remove: function( user , pBey_id , shop_only ){
			object = $.parseJSON( vitals.shop.data.get( vitals.pBey.data_holder ) );
			pObject = $.parseJSON( vitals.shop.data.get( user ) );
			if( user == proboards.data('user').id || shop_only ){
				for( i=0; i<object['i'].length; i++ ){
					if( object['i'][i]['user'][2] == pBey_id ){
						object['i'].splice( i , 1 );
						break;
					}
				}
			}
			if( !shop_only ){
				for( i=0; i<pObject['s'].length; i++ ){
					if( pObject['s'][i]['user'][2] == pBey_id ){
						pObject['s'].splice( i , 1 )
						break;
					}
				}
			}
			vitals.shop.data.set( vitals.pBey.data_holder , JSON.stringify( object ) );
			vitals.shop.data.set( user , JSON.stringify( pObject ) );
		},