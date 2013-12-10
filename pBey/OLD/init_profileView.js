
		init_profileView: function(){
			var text_size = (proboards.plugin.get('gold_shop').settings.profile_page_text_size == "")? 6 : proboards.plugin.get('gold_shop').settings.profile_page_text_size; 
			var html = '<div class="content-box center-col" id="pBeyShelf">'
			html += '<table>';
			html += '<tr><td width="100%"><center><font size="' + text_size + '">Items on pBeye</font></center></td></tr>';
			html += '<tr><td id="pBeyDisplay"></td></tr>';
			html += '</table>';
			html += '</div>';
			$('#shelf').after(html);	
			var user = ( proboards.data('route').name == 'current_user' )? proboards.data('user').id : location.href.split(/\/user\//)[1];
			var pBeyItems = $.parseJSON( vitals.shop.data.get( user ) )['s'];
			var items = vitals.shop.data.items;
			for( i=0; i<pBeyItems.length; i++ ){
				for( x=0; x<items.length; x++ ){
					if( pBeyItems[i]['user'][1] == items[x]['item_id'] ){
						$('#pBeyDisplay').append('<img style="max-height: 100px; max-width: 100px" class="' + pBeyItems[i]['user'][1] + '" id="' + pBeyItems[i]['user'][2] + '" src="' + items[x]['image_of_item'] +'" />').attr('title', ( items[x].item_name != "undefined" && items[x].item_name != "" )? items[x].item_name : '');
					}
				}
			}
		},