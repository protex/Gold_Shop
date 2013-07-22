
        init: function(){
            yootil.create.page("?shop?items", "Shop");
			vitals.shop.data.shop_items = ( yootil.is_json( vitals.shop.data.get() ) )? $.parseJSON( vitals.shop.data.get() ) : vitals.shop.data.object;
            vitals.shop.init_shop();
            if( proboards.data('route').name == 'user' || proboards.data('route').name == 'current_user' || proboards.data('route').name == 'edit_user_personal' ){
             	vitals.shop.init_profile_view();   
            }
        },