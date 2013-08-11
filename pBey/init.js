
		init: function(){
			if( proboards.plugin.get('gold_shop').settings.data_holder == "" ){
				if( proboards.data('user').is_staff == 1 ){
					proboards.alert('You have not set the Data Holder, please go to the user interface of the Gold Shop and follow the directions for the Data Holder under the pBey tab.'); 
				}
			}else if( location.href.split('?')[1] == "pbey" && ( location.href.split('?').length - 1 ) < 2 && location.href.match("user/" + proboards.plugin.get('gold_shop').settings.data_holder)  ){
				this.setup();
				this.create_main();
			}else if( location.href.split('?').length - 1 == "2" ){
				if( location.href.split('?')[2] == "list" ){
					this.create_items();
					this.setup();
				}
			}
			if( $.inArray( proboards.data('user').id.toString(), proboards.plugin.get('gold_shop').settings.data_holder ) > -1 ){
				proboards.dialog('acceptData',
					{
						title:'Data Holder Alert',
						html:'<strong>This forum would like to make you the data holder. If you don\'t know what this means, or if you think this is an error, please contact an administrator immediatly.',
						buttons: {
							'Confirm': function(){
								vitals.shop.data.set( JSON.stringify( vitals.pBey.data ) );
								$(this).dialog('close');
							},
							'Cancel': function(){
								$(this).dialog('close');
							},
						}
					}
				)
			}	
			if( proboards.data('route').name.match(/user/) ){
				this.init_profileView();
			}
		},