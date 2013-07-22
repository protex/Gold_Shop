
        init_shop: function(){
            if( location.href.match(/\?shop\?/i) ){
                yootil.create.nav_branch("/user\?shop\?", "Shop");
                $('.state-active:first').attr('class','');
                $('[href="/user\?shop\?items"]').attr('class','state-active');
                $('title:first').text('Shop | Items & Costs');
                var html = "";
                html += '<div class="container shop-welcome">';
                html += '<div class="title-bar"><h1>The Shop</h1><a style="float: right" class="button" href="javascript:void(0)" role="button" id="return-item">Return Item</a></div>';
                html += '<div id="welcome-message" class="content cap-bottom"><center>' + vitals.shop.data.welcome_message + '</center></div>';
                vitals.shop.content_remove(html);
                vitals.shop.init_items();
                vitals.shop.init_return();
            }
        },