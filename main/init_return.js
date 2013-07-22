
        init_return: function(){
            $("#return-item").click(function(){
                if( yootil.is_json( vitals.shop.data.get() ) ){
                    proboards.dialog('return_item_box',
                        {
                            title:'Give Item',
                            html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',
                            buttons: {
                                'Confirm': function(){
                                    if( vitals.shop.api._return( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , true ) ){
                                        if( vitals.shop.api.remove( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() , false , true ) ){                                            
                                            vitals.shop.api._return( proboards.data('user').id , $('#item_id').val() , $('#item_amount').val() );
                                            $(this).dialog('close');
                                        }else{
                                            proboards.alert('Error: You do not have enought of that item.');
                                        }
                                    }else{
                                        proboards.alert('Error: That item is not returnable.'); 
                                    }
                                    
                                },
                                'Cancel': function(){
                                    $(this).dialog('close');
                                },
                            }
                        }
                    )                    
                }else{
                    proboards.alert('Error: You do not have any items to return');   
                }
            });
        },