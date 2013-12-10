if( typeof vitals == "undefined" ){
    vitals = {};
}

(function( $ ) {
  $.fn.rightClick = function( method ) {
      
    $(this).mousedown(function( e ) {
        if( e.which === 3 ) {
            e.preventDefault();
            method();
        }
    });

  };
})( jQuery );

if( yootil.is_json( proboards.plugin.get('gold_shop').settings.json ) ){
	if( JSON.stringify( proboards.plugin.get('gold_shop').settings.items ) == "[]" ){
		proboards.plugin.get('gold_shop').settings.items = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
	}else{
		var old = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
		var nw = proboards.plugin.get('gold_shop').settings.items;
		proboards.plugin.get('gold_shop').settings.items = old.concat(nw);
	}
}

$(document).ready(function(){
	vitals.shop.init();
});

vitals.shop = (function(){
   
    return{

        addItems: function () {

            /*
            Variables:
            items: Shortcut to items stored in vitals.shop.data
            categories: shorctut to categories stored in vitals.shop.data
            data: users data stored in vitals.shop.data
            */
            var items = vitals.shop.data.items,
                categories = vitals.shop.data.categories,
                data = vitals.shop.data.object;

            // loop through the categories
            for ( i = 0; i < categories.length; i++ ) {

                // loop through the items
                for ( x = 0; x < items.length; x++ ) {

                    // check if the current category and the category that the item belongs to match
                    if ( categories[i].catagory == items[x].item_catagory ) {  
                        
                        // create a row with all the information added
                        /*
                        * Row layout nodes:
                        *
                        * table row
                        * -table column (title = item name, class = picture, content = an image of the current item)
                        * --image
                        * -table column (class = description, content = description of the item)
                        * -table column (class = cost, content = cost of item)
                        * -table column (class = available, id = "available-" + the id of the item, content = function that will return amount of item that user can buy)
                        * -table column (id = id, content = id of item)
                        * -table colmun (no attributes, content = buy button)
                        * --anchor (href = buy function, class = button, role = button)
                        * -table column (no attributes, content = return button)
                        * --ancor (color = default or red if item not returnable, href = return function, class = button, role = button)
                        */
                        var html = '';
                            html += '<tr class="item">';
                            html += '<td title="' + items[x].item_name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + items[x].image_of_item + '" /></td>';
                            html += '<td class="description">' + items[x].description + '</td>';
                            html += '<td style="text-align: center;" class="cost">' + items[x].cost_of_item + '</td>';
                            html += '<td style="text-align: center;" class="available" id="available-' + items[x].item_id +'">' + vitals.shop.recount( items[x].item_id ) + '</td>';
                            html += '<td style="text-align: center;" class="id">' + items[x].item_id + '</td>';
                            html += '<td><a href="javascript:vitals.shop.buyItem(' + items[x].item_id + ')" role="button" class="button">Buy</a></td>';
                            html += ( items[x].returnable == "true" )? '<td><a href="javascript:vitals.shop.returnItem(' + items[x].item_id + ')" role="button" class="button">Return</a></td>' : '<td><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></td>';
                            html += '</tr>';

                        // Append the html to the correct category
                        /*
                        * Note: because we looped through the categories
                        * and gave each category the id of the number
                        * of loops, by simply looping through the categories
                        * again (which is what we're doing) we find the table id
                        * of the category
                        */
                        $( '#' + i ).append( html );

                    }

                }

            }

        },


                buyItem: function ( id, amount ) {

                    // check if amount is undefined
                    if( amount == undefined ) {

                        // if amount is undefined, we assume the user only wanted to buy one
                        amount = 1;

                    }

                    // create a dialog
                    /*
                    * Dialoge nodes:
                    *
                    * title
                    * html
                    * buttons
                    * -confirm
                    * -cancel
                    */
                    proboards.dialog('buy_item_box',

                        {

                            // Set the title of the dialog
                            title:'Buy Item',

                            // Set the html of the dialog
                            html:'Are you sure you would like to buy this item?<br /><br /><b>Optional: How many?</b><br /><input id="buy-amount" />',

                            // Add buttons to the dialog
                            buttons: {

                                // Add a button named "confirm"
                                'Confirm': function () {

                                    // make sure the value of the optional amount override isn't anything but numbers
                                    if ( !$( '#buy-amount' ).val().match(/[^0-9]/gi) ) {

                                        // Set the user provided amount to the "amount" vairable
                                        amount = parseInt( $( '#buy-amount' ).val() );

                                        // If there are characters that are not numbers
                                    } else { 
                                        // Create error 103
                                        pb.window.error( '<i>Gold Shop Error: 103</i><br /><br />The amount you entered is not a valid number!' );

                                        // Close the dialog
                                        $( this ).dialog( 'close' );

                                        // return fals
                                        return false;

                                    }

                                    // console.log( amount );
                                    // check if the item supplied is actually an item
                                    if ( vitals.shop.isItem( id ) ) {

                                        // check if we can subtract enough money from the users wallet 
                                        // i.e does the user have enough money to buy the amount specified
                                        if ( canSubtract( id, amount ) ) {

                                            // Check if the user is allowed to buy that many of the item
                                            if ( canBuyAmount( id, amount) ) {

                                                // run buy function
                                                buy( id, amount );

                                                // run subtract function
                                                subtractMoney( id, amount );

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // if the user is not allowed to buy the amount specified
                                            } else {

                                                // create error 102
                                                pb.window.error( '<i>Gold Shop Error: 102</i><br /><br />You can\'t buy that amount!' );

                                            }

                                            // if the user does not have enough money to buy the amount specified
                                        } else {

                                            // create error 101
                                            pb.window.error( '<i>Gold Shop Error: 101</i><br /><br />You do not have enough money to buy that item!' );

                                            // close dialog
                                            $( this ).dialog( 'close' );

                                        }

                                        // if the item is not real
                                    } else {

                                        // create internal error 1
                                        pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                                    }
            
                                },

                                // create cancel button
                                'Cancel': function () {

                                    // all this button does is clos the dialog
                                    $( this ).dialog( 'close' );

                                },

                            }

                        }

                    );

                    // function to check if we can subtract the correct amount of money from the users wallet
                    /*
                    * variables:
                    * item = id of the item being bough
                    * number = the number of items the user is trying to buy
                    */
                    function canSubtract ( item, number ) {

                        // shortcut to items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if item id matches the item supplied in the function variable
                            if ( items[i].item_id == item ) {

                                // shortcut to getting the users money
                                var money = pixeldepth.monetary.get();

                                // calculating the cost
                                var cost = items[i].cost_of_item * number;

                                // if the money minus the cost is greater than or equal to 0
                                if ( money - cost >= 0 ) {

                                    // the user has enough money, return true
                                    return true;

                                    // if it's not greater than or equal to 0
                                } else {

                                    // the user does not have enough money, return false
                                    return false;

                                }

                            }

                        }

                    }

                    // subtract the money from the wallet
                    /*
                    * variables:
                    * item = id of the item being bought
                    * number = the amount the user is buying
                    */
                    function subtractMoney ( item, number) {

                        // console.log( 'subtract ' + number );
                        // shortcut to items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if the current item matches the item in the function variable
                            if ( items[i].item_id == id ) {

                                // console.log( items[i].item_id + ' , ' + (items[i].cost_of_item * number) )
                                // subtract the amount of the item times the amount that the user is buying from the wallet
                                pixeldepth.monetary.subtract( items[i].cost_of_item * number );

                            }

                        }

                    }

                    // check if the user is allowed to buy the amount specified
                    /*
                    * variables:
                    * item = id of the item being bought
                    * number = the amount the user is wanting to buy
                    */
                    function canBuyAmount ( item, number ) {

                        // shortcut to the items stored in vitals.shop.data
                        var items = vitals.shop.data.items;

                        // loop through items
                        for ( i = 0; i < items.length; i++ ) {

                            // check if item id matches the item wanting to be bought
                            if ( items[i].item_id == item ) {

                                // check if the amount that the user is allowed to buy, minus the amount that user wants to buy, minus the user has already bought, is creater >= zero.
                                // If the amount the user is allowed to buy is "" then the user is allowed to buy infinity, and we can continue
                                if ( ( items[i].amount - number ) - vitals.shop.find_amount( vitals.shop.data.object.b.concat( vitals.shop.data.object.r ), item ).length >= 0  || items[i].amount == "" ) {

                                    // return true
                                    return true;

                                    // if it's not >= then zero
                                } else {

                                    // return false
                                    return false;

                                }

                            }

                        }

                    }

                    // the buy function
                    /*
                    * item = the item being bought
                    * number = the amount that the user is buying
                    */
                    function buy( item, number ) {

                        // create a loop that will loop through once for each item being bought
                        for ( i = 0; i < number; i++ ) {

                            // push the id of the item to the global user object
                            vitals.shop.data.object.b.push( id );

                        }

                        // set the key so data will be saved
                        proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

                    }

                },


        createShelf: function ( title, id ) {

            // Create the html of the shelve
            // The html consists of:
            /*
            * container with a class of category plus the supplied title
            * -title bar with the title of the category
            * -the main area
            * --the table with all the items in it
            * ---the head
            * ----item head
            * ----description head
            * ----cost head
            * ----available head
            * ----id head
            * ----buy head
            * ----return head
            * ---the body (id of the body is the id supplied)
            */
            var html = "";
            html += '<div class="container category-' + title +'">';
            html += '<div class="title-bar"><h1>' + title + '</h1></div>';
            html += '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="width: 200px;">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 5%">Buy</th><th style="width: 8%">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            // Return the created element
            return $( html );

        },

        /*
        * Function find_amount
        * purpose: to find the amount of a certain item in an array
        * variables:
        * obj: the array to check
        * val: the value you wish to find
        */
        find_amount: function(obj, val) {

            // An emty array
            var objects = [];

            // loop through the array passed in the function variable obj
            for (var i in obj) {

                // Check if the current loop is actually on an array property
                if (!obj.hasOwnProperty(i)) continue;

                // Check if the current loop points to an object
                if (typeof obj[i] == 'object') {

                    // If it does, we we check and see if the inner object contains our value using this function, then join the two functions together
                    objects = objects.concat(vitals.shop.find_amount(obj[i], val));

                    // If it's not an object, check if the current loop points to a value that matches the value were looking for, also make sure i isn't blank
                } else if (obj[i] == val && i != '') {

                    // Push the key to the object
                    objects.push(i);

                }

            }

            // Return objects for later use
            return objects;

        },

        give: function ( user ) {

            /*
            * Variables:
            * currUserObject = shortcut to the current users data stored in vitals.shop.data
            * bought = shortcut to current users bought items, stored in currUserObject 
            * received = shortcut to current users received items, stored in currUserObject
            * boughtArr = an emty array
            * receivedArr = an emty array
            * items = shortcut to the list of items stored in vitals.shop.data
            * benificiaryItems = the benificiaries data
            * counter = a counter set to 0
            * alreadyAddedB = an empty array
            * alreadyAddedR = an empty array
            */
            var currUserObject = vitals.shop.data.object,
                bought = currUserObject.b,
                received = currUserObject.r,
                boughtArr = [],
                receivedArr = [],
                items = vitals.shop.data.items,
                benificiaryItems = proboards.plugin.key('gold_shop').get( user ),
                counter = 0,
                alreadyAddedB = [],
                alreadyAddedR = [];

            // check if the benificiary actually has data
            if ( benificiaryItems == undefined || benificiaryItems == "" ) {

                // Give the benificiary data formatted correctly
                benificiaryItems = { "b":[], "r":[], "s":[], "lb":"" };

            }

            // Looped through the current users bought items
            for ( x = 0; x < bought.length; x++ ) {

                // Loop through the items array
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the current item id matches the bought item
                    if ( items[i].item_id == bought[x] ) {

                        // Check if the current item is givable
                        if ( items[i].givable == "true" ) {

                            // Check if the item has already been added
                            if ( vitals.shop.find_amount( alreadyAddedB, bought[x] ).length < 1 ) {

                                // Add the id to alreadyAddedB so we know which items have been added
                                // ReceivedArr is formatted differently and it's hard to figure out which items have been added and which have not
                                alreadyAddedB.push( bought[x] );

                                // Add the id and name to boughtArr for later use
                                boughtArr.push( {"id":bought[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            // Loop through recieved items
            for ( x = 0; x < received.length; x++ ) {

                // Loop through items array
                for ( i = 0;  i < items.length;  i++) {

                    // Check if the current item id matches the received item
                    if ( items[i].item_id == received[x] ) {

                        // Check if the item is givable
                        if ( items[i].givable == "true" ) {

                            // Check if the item has already been added
                            if ( vitals.shop.find_amount( alreadyAddedR, received[x] ).length < 1 ) {

                                // Add the id to alreadyAddedR so we knowh which items have been added
                                // ReceivedArr is formatted differently and it's hard to figure out which items have been added and which have not
                                alreadyAddedR.push( received[x] );

                                // Add the id and name to receivedArr for later use
                                receivedArr.push( {"id":received[x], "name":items[i].item_name} );

                            }

                        }

                    }

                }

            }

            // Check if boughtArr's length is greater than zero (i.e is it empty)
            if ( boughtArr.length > 0 ) {

                // console.log( boughtArr.length );
                // Blank string variable
                var boughtOptions = "";

                // Loop through the bought array
                for ( i = 0; i < boughtArr.length; i++ ) {
                    // create an option object with a value of the id of the item, and the text as the name
                    boughtOptions += '<option value="' + boughtArr[i].id + '">' + boughtArr[i].name + '</option>';

                }

            }

            // repeat for the items stored in the receivedArr
            if ( receivedArr.length > 0 ) {

                var receivedOptions = "";

                for ( i = 0; i < receivedArr.length; i++ ) {

                    receivedOptions += '<option value="' + receivedArr[i].id + '">' + receivedArr[i].name + '</option>';

                }

            }

            // Create a dialog
            /*
            * Dialog nodes:
            *
            * title
            * html
            * buttons
            * -bought
            * --dialog
            * ---title
            * ---html
            * ---buttons
            * ----give
            * ----cancel
            * ---recieved
            * -recieved
            * --dialog
            * ---title
            * ---html
            * ---buttons
            * ---give
            * ---cancel
            * -cancel
            */
            proboards.dialog('give_item_box',

                {

                    // give the dialog a title
                    title:'Bought or Given',

                    // give the dialog html
                    html:'Would you like to give this user a bought or given item?',

                    // create buttons
                    buttons: {

                        // Create a button named 'bought'
                        'Bought': function () {

                            // close the current dialog
                            $( this ).dialog( 'close' );

                            // create a second dialog
                            proboards.dialog('bought_item_box',

                                {

                                    // give the second dialog a title
                                    title: 'Give a bought item',

                                    // Give the second dialog html
                                    html: 'Which item would you like to give?<br /><select id="bought-items-select">' + boughtOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    // create buttons
                                    buttons: {

                                        // Create a button named 'give'
                                        'Give' : function () {

                                            // Check if the user has the amount of bought items he would like to give
                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val() ) ) {

                                                // Remove the amount of items the user would like to give
                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val() );

                                                // Parse the amount the user would like to give into a number
                                                var amount = parseInt( $( '#bought-items-amount' ).val() );

                                                // Loop through once for each item
                                                for ( i = 0; i < amount; i++ ) {

                                                    // push the item into the benificiaries data
                                                    benificiaryItems.r.push( $( '#bought-items-select' ).val() );

                                                }

                                                // Set the key for the benificiary
                                                proboards.plugin.key('gold_shop').set( user, benificiaryItems );

                                                // Close the dialog
                                                $( this ).dialog( 'close' );

                                                // if the user does not have the amount he wishes to give2
                                            } else {

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // Create error 301
                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, you do not have that many of that item' );

                                            }


                                        },

                                        // Create a button named cancel
                                        'Cancel' : function () {

                                            // Close the dialog
                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        // Create a button named received
                        'Received': function () {

                            // close the first dialog
                            $( this ).dialog( 'close' );

                            // create a second dialog
                            proboards.dialog('received_item_box',

                                {

                                    // Give the second dialog a title
                                    title: 'Give a received item',

                                    // Give the second dialog html
                                    html: 'Which item would you like to give?<br /><select id="bought-items-select">' + receivedOptions + '</select><br /><br />How many?<br /><input id="bought-items-amount" />',

                                    // Create buttons
                                    buttons: {

                                        // Create a button named 'give'
                                        'Give' : function () {

                                            // Check if the user has enough recieved items to give the amount he wants  to
                                            if ( vitals.shop.hasAmount( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true ) ) {

                                                // Remove the recieved items fron the user
                                                vitals.shop.removeItems( $( '#bought-items-select' ).val(), $( '#bought-items-amount' ).val(), true );

                                                // Parse the amount into a number and stor it in a variable
                                                var amount = parseInt( $( '#bought-items-amount' ).val() );

                                                // Create a loop for the amount
                                                for ( i = 0; i < amount; i++ ) {

                                                    // push the item into the benificiaries data
                                                    benificiaryItems.r.push( $( '#bought-items-select' ).val() );

                                                }

                                                // Set the key for the benificiary
                                                proboards.plugin.key('gold_shop').set( user, benificiaryItems );

                                                // close the dialog
                                                $( this ).dialog( 'close' );

                                                // If the current user doesn't have enough items to give the amout ne wants
                                            } else {

                                                // Close the dialog
                                                $( this ).dialog( 'close' );

                                                // Create error 301
                                                pb.window.error( '<i>Gold Shop Error 301:</i> <br /><br />Sorry, you do not have that many of that item' );

                                            }


                                        },

                                        // Create a button named cancel
                                        'Cancel' : function () {

                                            // Close the dialog
                                            $( this ).dialog( 'close' );

                                        },
   
                                    },

                                }

                            );

                        },

                        // Create a button named cancel
                        'Cancel': function () {

                            // Close the dialog
                            $( this ).dialog( 'close' );

                        },

                    }

                }

            );

        },

        /*
        * function: hasAmount
        * purpose: check if we can remove a certain amount of items from the users bought or received items
        * Variables:
        * item = the item in question
        * amount = a the amount we are checking
        * received = are we checking received or bought items?
        */
        hasAmount: function ( item, amount, received ) {

            var items,
                count = 0;

            // Check if the recieved variable was set to tru
            if ( received ) {

                // Set items to be the users recieved items
                items = vitals.shop.data.object.r;

                // If recieved is not set to true
            } else {

                // Set items to be the users bought items
                items = vitals.shop.data.object.b;

            }

            // Loop through the items
            for( i = 0; i < items.length; i++ ) {

                // Check if the looped item is the same as the item in the function variable
                // If it is, add on to the count
                if( items[i] == item ) count++;
                
            }

            // Check if the count is greater >= the amount the user wishes to give
            if ( count >= amount ) {

                // return true
                return true

                // If it's not >= the amount
            } else {

                // return false
                return false;

            }

        },

        /*
        * function: removeItems
        * purpose: remove items from the users reveived or bought items
        * Variables:
        * item = the item in question
        * amount = a cthe amount we are remove
        * received = are we removing received or bought items?
        */
        removeItems: function ( item, amount, received ) {

            var items,
                count = 0;

            // Check if the received variable was passed as true
            if ( received ) {

                // Set the items to be the users received items
                items = vitals.shop.data.object.r;

                // If the received variable wasn't passed as true, or wasn't passed at all
            } else {

                // Set the items as the users bought items
                items = vitals.shop.data.object.b;

            }

            // Loop through the items
            for( i = 0; i < items.length; i++ ) {

                // Make sure we havent subtracted the correct amount
                if ( count != amount ) {

                    // Check if the current item is the item we wish to remove
                    if( items[i] == item ) {

                        // Splice the array at "i" (i.e the current item
                        items.splice( i, 1 );

                        // Add one to the counter
                        count++;

                    }

                    // If we've subtracted the correct amount
                } else {

                    // Break the loop and continue
                    break;

                }
                
            }

            // Save the new object in our data
            proboards.plugin.key( 'gold_shop' ).set( vitals.shop.data.object );

        },

        /*
        * Function: init
        * purpose: do some preliminary stuff and then call the first functions that create the shop etc.
        * variabls: none
        */
        init: function () {

            // add plugin image to yootil bar
            yootil.bar.add("/user?shop", pb.plugin.get('gold_shop').images.shop_20x20, "Shop", "vGoldShop");

            // check if there is existing data
            if ( pb.plugin.key( 'gold_shop' ).get() !== "" && pb.plugin.key( 'gold_shop' ).get() != undefined ) {

                // check if the existing data can be stringified
                if( !yootil.is_json( pb.plugin.key( 'gold_shop' ).get() ) ) {

                    // Set the local variable for easy access to user data
                    vitals.shop.data.object = pb.plugin.key( 'gold_shop' ).get();

                    // Set the local variable for items so the current users bought items are easily accessable
                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                    // if the existing data can be stringified, that means we had an old version installed, so we need to re-format the data
                } else {

                    // parse the data and create two empty arrays
                    var data = $.parseJSON( pb.plugin.key( 'gold_shop' ).get() ),
                        bought = [],
                        recieved = [];

                    for( i = 0; i < data.b.length; i++ ){

                        // Push all the old "bought" data into the bought variable
                        bought.push( data.b[i]['#'] );

                    }

                    // overwrite the old bought data with the re-formated version
                    data.b = bought;

                    for( i = 0; i < data.r.length; i++ ) {

                        // push all the old recieved data into the "recieved" array
                        recieved.push( data.b[i]['#'] );

                    }

                    // overwrite the old recieved data with the re-formated version
                    data.r = recieved;

                    // set loval variable fore easy access to user data
                    vitals.shop.data.object = data;

                    // Set the local variable for items so the current users bought items are easily accessable
                    vitals.shop.data.shopItems = vitals.shop.data.object.b;

                }

            } 

            // Check if were viewing the shop page
            if ( pb.data('route').name == "current_user" && location.href.match(/\?shop/) ) {

                // initiate the shop
                this.initShopPage();

            }

            // Check if were viewing a profile page
            if ( pb.data( 'route' ).name == "current_user" || pb.data( 'route' ).name == "user" ) {

                // Make sure we're not viewing the shop page
                if ( !location.href.match(/\?shop/) ) {

                    // Initiate profile gui
                    this.initProfile();

                    // Make sure we're not viewing our own profile
                    if ( pb.data('route') != "current_user" ) {

                        // Initiate give gui
                        this.initProfileGive();

                    }

                }

            }

        },


        /*
        * function initProfile
        * purpose: create the box for the profile that items will be displayed on, and add it to the page
        * variabls: None
        */
        initProfile: function () {

            // Create the html for the display
            /*
            * html node list
            * div: class = [content-box, center-col]
            * -table: id = shop-items
            * --table body
            * ---table row
            * ----table column
            * -----font: size = 6 (can be changed by user) contents: the words "items"
            * ---table row
            * ----table column: id = "shelf"
            */
            var html = '';
                html += '<div class="content-box center-col">';
                html += '<table id="shop-items">';
                html += '<tbody>';
                html += '<tr>';
                html += '<td style="text-align: center"><font size="6">Items</font></td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td id="shelf"></td>';
                html += '</tr>';
                html += '</tbody>';
                html += '</table>';
                html += '</div>';

            // Append it to the correct spot
            $( '.content-box:last' ).prev().after( html );

            // Call the shelveItems function so the items will be added
            this.shelveItems();

        },

        /*
        * function initProfileGive
        * purpose: add the "give" button that calls the "give" function
        * variablse: none
        */
        initProfileGive: function () {

            // Get the user id of the profile we're viewing
            var user = location.href.split( "/user/" )[1];

            // Make sure that we're not viwing our own profile
            if ( user != pb.data('user').id ) {

                // Create an element and append it before the new conversation button
                /*
                * element nodes:
                * anchor: href = calls the give function, class = "button"
                */
                $( '[href="/conversation/new/' + user + '"]' ).before( '<a href="javascript:vitals.shop.give('+ user +')" class="button">Give</a>' );

            }

        },

        initShelves: function () {

            // console.log( 'ran' );
            // Shortcut to categories stored in vitals.shop.data
            var categories = vitals.shop.data.categories;

            for( i = 0; i < categories.length; i++ ) {

                // Create a shelf for each catagory and append it to the page, there is no specific container holding the shelves
                this.createShelf( categories[i].catagory, i ).appendTo( '#content' );

            }

        },

        initShopPage: function () {

            // Create a page named shop (this basically just removes the content of the page)
            yootil.create.page(/\?shop/, "Shop");

            // Add a navigation tree link
            yootil.create.nav_branch("/user\?shop", "Shop");

            // We don't want the menu to say we're viewing the profile page, so we remove the class of "state-active" so the "profile" button isn't highlighted on the menu
            $('.state-active:first').attr('class','');

            // Set the title of the page, we're not viewing the profile anymore
            $('title:first').text('Shop | Items & Costs');

            // Create the welcome message html
            var html = "";
            html += '<div class="container shop-welcome">';
            html += '<div class="title-bar"><h1>The Shop</h1></div>';
            html += '<div id="welcome-message" class="content cap-bottom"><center>' + vitals.shop.data.welcome_message + '</center></div>';
            html += '</div>';

            // Append the html to the page
            $( '#content' ).append( html );

            // Initiate the categories or "shelves"
            this.initShelves();

            // Then add the items to the shelves
            this.addItems();

        },

        /*
        * function: isItem
        * purpose: to check if an item is real
        * variables: item = the item in question
        */
        isItem: function ( item ) {

            // Shortcut to the items stored in vitals.shop.data
            var items = vitals.shop.data.items;

            // Loop through the items
            for ( i = 0; i < items.length; i++ ) {

                // Check if the current item matches the one passed in the function variable
                if ( items[i].item_id == item ) {

                    // return true
                    return true;

                }

            }

            // return false
            // NOTE: This will only be called if the loop finishes without returning true
            return false;

        },

        
        /*
        * Function *Recount*
        * Purpose: Recount the number of items a user is allowed to buy
        * Variables: 1
        * Variables:
        * item: the item we would like to recount
        */
        recount: function ( item ) {

            /* 
            * Variables:
            * items: shortcut to the items stored in vitals.shop.data
            * data: shorctut to the users data stored in vitals.shop.data
            */
            var items = vitals.shop.data.items,
                data = vitals.shop.data.object;

            // Lop through the items
            for ( i = 0; i < items.length; i++ ) {

                // Check if current item id matches the item passed in the function variable
                if ( items[i].item_id == item ) {

                    // Make sure the items amount is not set to nothing
                    if ( items[i].amount != "" ) {

                        // Recalculate the items amount, minus the amount that the user has in his bought items, minus the amount he has in his received items
                        var recalculate = items[i].amount - find_amount( data.b, item ) - find_amount( data.r, item );

                        // Make sure the recalculated amount is not less then zero
                        if( parseInt( recalculate ) > 0 ) {

                            // Return the recalculated amount
                            return recalculate;

                            // break the loop and continue
                            break;

                            // If the recalculated amount is less then zero
                        } else {

                            // Return zero
                            return 0

                        }

                        // If the items amount is set to ""
                    } else {

                        // The amount is supposed to be infinity, so return the infinity symbole
                        return "&infin;";

                        // break the loop and continue 
                        break;

                    }

                }

            }

        },

        /*
        * function: returnItem
        * purpose: return an item already bought and refund the person who bought it
        * variables:
        * id = the id of the item to be returned
        */
        returnItem: function ( id ) {

            // Create a dialog
            proboards.dialog('return_item_box',

                {

                    // give the dialog a title
                    title:'Return Item',

                    // give the dialog html
                    html:'How Many items would you like to return?<br /><br /><input id="return-amount" />',

                    // Add buttons
                    buttons: {

                        // Create a button named 'Confirm'
                        'Confirm': function () {

                            // Get the number that the user would like to return 
                            var returnAmount = $( '#retern-amount' ).val();

                            // Check to make sure that they gave a real item id
                            if ( vitals.shop.isItem( id ) ) {

                                // Check to make sure the ite mis returnable
                                if ( isReturnable( id ) ){

                                    // Check to make sure the user has the amount he would like to return
                                    if ( vitals.shop.hasAmount( id, returnAmount ) ) {

                                        // Remove the items from his data
                                        vitals.shop.removeItems( id, returnAmount );

                                        // Refund the money back to hsi wallet
                                        addMoney( id, returnAmount ); 
                                        
                                        // If the user doesn't have the ammount he wants to return
                                    } else {

                                        // Create error 202
                                        pb.window.error( '<i>Gold Shop Error: 202</i><br /><br />You do not have that many of this item!' );

                                    }

                                // if the item id the user supplied belongs to an item that is not returnable
                                } else {
                                    
                                    // Create error 201
                                    pb.window.error( '<i>Gold Shop Error: 201</i><br /><br />That item is not returnable!' );

                                }
                            
                            // If the item id that the user supplied is not a real item
                            } else {

                                // Create internal error 1
                                pb.window.error( '<i>Gold Shop Internal Error: 1</i><br /><br />That is not an item!' );

                            }
            
                        },

                        // Create a button named cancel
                        'Cancel': function () {

                            // Close the dialog
                            $( this ).dialog( 'close' );

                        },

                    }

                }

            ); 

            /*
            local function: isReturnable
            purpose: Check if an item can be returned
            variabls: 
            item = the id of the item in question
            */
            function isReturnable( item ) {

                // shortcut to shop items stored in vitals.shop.data
                var items = vitals.shop.data.items;

                // Loop through the items
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the current item id matches the item supplied in the funtion variable
                    if ( items[i].item_id == item ) {

                        // Check if the item is returnable
                        if ( items[i].returnable == "true" ) {

                            // Return true
                            return true;

                        // if the item is not returnable
                        } else {

                            // Return false
                            return false;

                        }

                    }

                }

            }

            /*
            * local function: addMoney
            * purpose: return the money to the wallet in a return
            * variables:
            * item = the id of the item being returned
            * amount = the amount being returned
            */
            function addMoney ( item, amount ) {

                // Shortcut to shop items stored in vitals.shop.data
                var items = vitals.shop.data.items;

                // Loop through the items
                for ( i = 0; i < items.length; i++ ) {

                    // Check if the item id matches the item in the function variable
                    if ( items[i].item_id == item ) {

                        // Add the cost of the item, multiplied by the amount, multiplied by the retail value, back to the wallet
                        pixeldepth.monetary.add( items[i].cost_of_item * amount * retail );

                    }

                }

            }

        },

        /*
        * function: shelveItems
        * purpose: to display a users bought items in their profile
        * variables: none
        */
        shelveItems: function () {

            /*
            * Variables:
            * user: the id of the user who's profile we're viewing
            * data: the data of the user who's profile we're viewing
            * items: a shortcut to the items stored in vitals.shop.data
            */
            var user = ( pb.data( 'route' ).name == "current_user" ) ? pb.data( 'user' ).id : location.href.split( '/user/' )[1],
                data = proboards.plugin.key( 'gold_shop' ).get( user ),
                items = vitals.shop.data.items;

            // Check if the user has data
            if ( data == undefined ) {

                // Give the user a blank data object
                data = { "b":[], "r":[], "s":[], "lb":"" };

            }

            // Loop through the users recieved items
            for ( i = 0; i < data.r.length; i++ ) {

                // Loop through the items in the shop
                for ( x = 0; x < items.length; x++ ) {

                    /*
                    * Variables:
                    * description: the description of the current item
                    * sliced: an empty string
                    * name: the name of the item
                    */
                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    // Check if the description of the current item is greator then 100
                    if( description.length > 100 ){

                        // If it does, slice it at the one hundredth character
                        sliced = description.slice(0 , 100);

                        // Then slice it again at the last index of a space, and add '... (Click to view more)' so the user knows to click
                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    // Check if the current recieved item, matches the id of the current item
                    if ( data.r[i] == items[x].item_id ) {
                        // Add the item to the shelf

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.r[i] + '" src="' + items[x].image_of_item + '" />' );

                        // Create a function
                        func = function (){

                            // A shortcut back to the attributes assigned to this function
                            var ac = arguments.callee;

                            // Alert the name and description of the item (name and description are stored in the function attibutes
                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );

                        }

                        //Assign the name and description to the function attributes
                        func.dname = name;
                        func.description = description;

                        // Assign the function we just click to be called when the current item is clicked on
                        $( '.' + items[x].item_id ).click(func);

                        // Give the item a whole bunch of stuff that I don't want to write down
                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            // do the same thing for the users bought items
            for ( i = 0; i < data.b.length; i++ ) {

                for ( x = 0; x < items.length; x++ ) {

                    
                    var description = items[x].description,
                        sliced = "",
                        name = items[x].item_name;

                    if( description.length > 20 ){

                        sliced = description.slice(0 , 100);

                        sliced = sliced.slice(0 , sliced.lastIndexOf(' ') ) + '... (Click to view more)';

                    }

                    if ( data.b[i] == items[x].item_id ) {

                        $( '#shelf' ).append( '<img style="max-width: 70px; max-hieght: 70px;" class="' + data.b[i] + '" src="' + items[x].image_of_item + '"></img>' )

                        func = function (){
                            var ac = arguments.callee;
                            proboards.alert( 'Name: ' + ac.dname + '<br /><br />Description: ' + ac.description );
                        }
                        func.dname = name;
                        func.description = description;
                        $( '.' + items[x].item_id ).click(func);

                        $('.' + items[x].item_id + ':last').attr('title', "Name: " + items[x].item_name + '\n' + "Description: " + ( ( sliced != "" )? sliced: description ) + "\n" + "Amount: " + $('.' + items[x].item_id).length + "\n" + "Bought: " + vitals.shop.find_amount( data.b , items[x].item_id ).length + "\n" + "Given: " + vitals.shop.find_amount( data.r , items[x].item_id ).length + "\n" + "ID: " + items[x].item_id );

                    }

                }

            }

            // loop through the items
            for( i=0; i<items.length; i++){

                // Check if there are any items on the shelf that match the current item
                if( $('.'+items[i].item_id).length > 1 ){

                    // loop through for each item, and remove all but one
                    for( x=$('#shelf > .'+items[i].item_id).length; x > 1; x-- ){

                        // Remove the item
                        $('#shelf > .'+items[i].item_id+':first').remove();

                    }

                }

            }

        },

    }
    
})();

vitals.shop.data = {
            
    items: proboards.plugin.get('gold_shop').settings.items,

    categories: proboards.plugin.get('gold_shop').settings.catagories,
    
    set: function( x , y ){
        if(x == ""){
            x = y;
            y = undefined;
        }
        proboards.plugin.key('gold_shop').set( x , y );
    },
    
    get: function( x ){
        return proboards.plugin.key('gold_shop').get( x );   
    },
    
    welcome_message: (proboards.plugin.get('gold_shop').settings.welcome_message != '')? proboards.plugin.get('gold_shop').settings.welcome_message : "<font size='5'>Welcome to The Shop!</font>",
    
    object: {
        // items bought
        b: [],
        // Items for sale
        s: [],
        // Items recieved
        r: [],
        // Last item bought
        lb: '',
    },
    
    shopItems: [],
    
    clear: function(){
        proboards.plugin.key('gold_shop').set('');
    },
    
    current_item: '',
        	
},

vitals.shop.api = (function(){
	
    return{        
    }
    
})();