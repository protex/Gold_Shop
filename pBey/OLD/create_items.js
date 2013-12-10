

		create_items: function(){
			if( location.href == "http://" + location.hostname + "/user/" + proboards.plugin.get('gold_shop').settings.data_holder.toString() + "?pbey?list" ){
				yootil.create.page(/\?pbey\?list/ , "pBey Items");
		        yootil.create.nav_branch( "/user/" + proboards.plugin.get('gold_shop').settings.data_holder.toString() + "?pbey?list", "pBey Items List");
                $('.state-active:first').attr('class','');
                $('[href="/user\?shop\?items"]').attr('class','state-active');
                $('title:first').text('Shop | Items & Costs');
                var html = "";
                html += '<div class="container shop-welcome">';
                html += '<div class="title-bar"><h1>The Shop</h1><a style="float: right" class="button" href="javascript:void(0)" role="button" id="return-item">Return Item</a></div>';
                html += '<div id="welcome-message" class="content cap-bottom"><center>asdf</center></div>';
                vitals.shop.content_remove(html);
			}
		},