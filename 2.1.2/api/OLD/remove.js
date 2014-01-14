        
        remove: function( user , return_item , amount , given , inif ){

            remove_item = function(arr,value){

                for(b in arr ){

                    if(arr[b] == value){

                        arr.splice(b,1);

                        break;

                    }

                }

                return arr;

            }
            // http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array

            var data = $.parseJSON( vitals.shop.data.get(user) );
            var items = vitals.shop.data.items;
            var possessions = ( given )? data.r : data.b;  

            if( vitals.shop.find_amount( possessions , return_item ).length >= amount ){

                for( i=0; i<possessions.length; i++ ){

                    if( possessions[i]['#'] == return_item ){  

                        if( inif != true ){

                            possessions.splice(i , 1); 

                            proboards.plugin.key('gold_shop').set( user , JSON.stringify( data ) );

                            amount = amount - 1;

                            if( amount == 0 ){

                                return true;

                                break;

                            }

                        }

                        if( inif == true ){

                            return true

                        }

                    }

                } 
                
            }else{

                return false;

            }  
            
        },