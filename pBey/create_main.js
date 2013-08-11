		
		create_main: function(){
			var html = '';

			html += '<table id="pbey_main" style="width: 100%">';
			html += '<tr>';
			html += '<td style="width: 30%;">';
			html += '<center>';			
			html += 'You have 0 items for sale';
			html += '<br />';
			html += '<input id="initSeller" type="button" value="Sell an Item"></input>';
			html += '</center>';
			html += '</td>';
			html += '<td style="width: 30%;">';
			html += '<center>';
			html += 'You have 0 bids on your items';
			html += '<br />';
			html += '<input id="viewItems" type="button" value="View items for sale"></input>';
			html += '</center>';
			html += '</td>';
			html += '<td style="width: 30%;">';
			html += '<center>';
			html += 'You have 0 current bids';
			html += '<br />';
			html += '<input type="button" value="View Bids"></input>'; 
			html += '</center>';
			html += '</td>';
			html += '</tr>';
			html += '</table>';
			
			var title = '';
			
			title += '<div style="float: left">pBey</div>';
			
			yootil.create.page( /\?pbey/i , "pBey" ).container( title , html ).appendTo('#content');
			yootil.create.nav_branch( /\?pbey/i , 'pBey' );
			$('title:first').html('pBey | Main');
			this.init_seller();
			this.init_viewItems();
		},