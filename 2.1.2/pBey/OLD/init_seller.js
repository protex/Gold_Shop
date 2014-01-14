
		init_seller: function(){
			$('#initSeller').click(function(){
				proboards.dialog('return_item_box',
					{
						title:'Sell an Item',
						html:'<input id="item_id">Item ID</input><br /><input id="charge_amount">Charge Amount</inpug>',
						buttons: {
							'Confirm': function(){
								vitals.shop.api.sell( proboards.data('user').id , $('#item_id').val() , $('#charge_amount').val() );
								$(this).dialog('close');
							},
							'Cancel': function(){
								$(this).dialog('close');
							},
						}
					}
				) 
			});
		},