
        init_moderation: function(){
            if( proboards.data('route').name == "user" && !location.href.match(proboards.data('user').url) && $.inArray( proboards.data('user').id.toString(), proboards.plugin.get('gold_shop').settings.removers ) > -1 ){
				$("[href='/conversation/new/" + location.href.split('/user/')[1] +"']").before('<a class="button" href="javascript:void(0)" role="button" id="remove_item">Remove Item</a>');
                $('#remove_item').click(function(){
                    proboards.dialog('give_item_box',
                        {
                            title:'Remove Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input><br /><select id="given"><option value="true">Yes</option><option value="false">No</option></select>Given?',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api.remove( location.href.split('/user/')[1] , $('#item_id').val() , $('#item_amount').val() , ( ($('#given').val() == "true")? true : false ) , true ) ){
                                        vitals.shop.api.remove( location.href.split('/user/')[1] , $('#item_id').val() , $('#item_amount').val() , ( ($('#given').val() == "true")? true : false ) );                                        
                                        $(this).dialog('close');
                                    }else{
                                        proboards.alert('Error: This user does not have enought of that item.');
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
        },
        