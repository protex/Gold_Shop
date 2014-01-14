
        init_profile_view: function(){
            var text_size = (proboards.plugin.get('gold_shop').settings.profile_page_text_size == "")? 6 : proboards.plugin.get('gold_shop').settings.profile_page_text_size;
            var html = '<div class="content-box center-col" id="shelf">'
                html += '<table>';
            	html += '<tr><td width="100%"><center><font size="' + text_size + '">Shop Items</font></center></td></tr>';
                html += '<tr><td id="display"></td></tr>';
            	html += '</table>';
                html += '</div>';
            var items = vitals.shop.data.items;
            var user_id = location.href.split('/user/')[1];
            vitals.shop.data.shop_items = ( yootil.is_json( proboards.plugin.key('gold_shop').get(user_id) ) )? $.parseJSON( proboards.plugin.key('gold_shop').get(user_id) ) : vitals.shop.data.object;
            var display_items = vitals.shop.data.shop_items.b;
            var display_recieved = vitals.shop.data.shop_items.r; 
            ($('.status-input').length > 0 )? $('#center-column').children().first().next().after(html) : $('#center-column').children().first().after(html);
            for( i=0; i<display_items.length; i++){
                for( x=0; x<items.length; x++){
					var sliced = '';
                    var description = items[x].description;
					if( description.length > 20 ){
						sliced = description.slice(0 , 100);
						sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Right click to view more)';
					}
                    if( display_items[i]['#'] == items[x].item_id ){
                     	$('#display').append('<img title="' + ( ( sliced == "" )? description : sliced ) + '" style="max-height: 100px; max-width: 100px" class="' + items[x].item_id + '" src=' + items[x].image_of_item + '></img>');
						var id = items[x].item_id;
						var name =  ( items[x].item_name != 'undefined' )? items[x].item_name : '';
						$('.' + items[x].item_id).rightClick(function(){
							proboards.alert( 'Name: ' + name + '<br /><br />' + 'Description: ' + description + '<br /><br />' + 'ID: ' + id );
						});	
                    }
                }
            }
            for( i=0; i<display_recieved.length; i++){
                for( x=0; x<items.length; x++){
					var sliced = '';
                    var description = items[x].description;
					if( description.length > 20 ){
						sliced = description.slice(0 , 100);
						sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '...';
					}
                    if( display_recieved[i]['#'] == items[x].item_id ){
                     	$('#display').append('<img title="' + ( ( sliced == "" )? description : sliced ) + '" style="max-height: 100px; max-width: 100px" class="' + items[x].item_id + '" src=' + items[x].image_of_item + '></img>');
						$('.' + items[x].item_id).rightClick(function(){
							alert('works');
						});
                    }
                }
            }
            for( i=0; i<items.length; i++){
                $('.' + items[i].item_id + ':last').attr('title', "Name: " + items[i].item_name + '\n' + "Description: " + $('.' + items[i].item_id + ':last').prop('title') + "\n" + "Amount: " + $('.' + items[i].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( display_items , items[i].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( display_recieved , items[i].item_id ).length + "\n" + "ID: " + items[i].item_id );
                if( $('.'+items[i].item_id).length > 1 ){
                    for( x=$('#shelf .'+items[i].item_id).length; x > 1; x-- ){
                        $('#shelf .'+items[i].item_id+':first').remove();
                    }
                }
            }
			if( proboards.data('route').name == "user" ){
                $("[href='/conversation/new/" + location.href.split('/user/')[1] +"']").before('<a class="button" href="javascript:void(0)" role="button" id="give_item">Give Item</a>');
                $('#give_item').click(function(){
                    proboards.dialog('give_item_box',
                        {
                            title:'Give Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api.give( user_id , $('#item_id').val() , $('#item_amount').val() , true ) ){
                                    	if( vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , true ) ){
                                            vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , false);
                                            vitals.shop.api.give( user_id , $('#item_id').val() , $('#item_amount').val() );
                                            $(this).dialog('close');
                                        }else{
                                            proboards.alert('Error: You do not have enought of that item.');
                                        }
                                    }else{ 
                                        proboards.alert('Error: That item is not givable.'); 
                                    }
                                    
                                },
                                'Cancel': function(){
                                    $(this).dialog('close');
                                },
                            }
                        }
                    )  
                });
            } 
            this.init_moderation();
        },
        