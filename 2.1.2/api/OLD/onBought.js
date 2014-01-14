        
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