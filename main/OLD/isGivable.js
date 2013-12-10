

        isGivable: function ( itemId ) {

            var items = vitals.shop.data.items;
            
            for( i = 0; i < items.length; i ++ ){

                if ( itemId == items[i].item_id ) {

                    return true;

                    break

                }

            }

            return false;

        }, 
