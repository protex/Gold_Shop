

var givePage = (function(){
 
    return {

        name: 'givePage',

        module: 'shop',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'givePage' ) {

                vitals.shop.givePage.createPage();

                vitals.shop.givePage.addDefaultContent();

                vitals.shop.givePage.addCss(); 

            }           

        },

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?giveItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Give" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Give Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'give-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<select>" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.data.userData,
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            for ( var i = 0; i < keys.length; i++ ) {

            	if ( items[keys[i]].givable == 'true' ) {

	                option.append( '<option value="' + keys[i] + '">' + items[keys[i]].item_name + '</option>' );

	            }

            }
            
            html += '<div id="give-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'give-item' ).appendTo( '#give-content' ).before( "Would you like to give this member an item?" ).after( '<br />Amount: <input id="give-amount" /><br /><input type="button" onclick="vitals.shop.givePage.sGive()" value="Give"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sGive: function ( ) {

            var item = $("#give-item").val(),
                amount = $("#give-amount").val(),
                userBought = vitals.shop.data.userData.b,
                userReceived = vitals.shop.data.userData.r,
                userBoughtT,
                userReceivedT;

            if ( userBought[item] != undefined )
                userBoughtT = parseInt( userBought[item] );
            else
                userBoughtT = 0;

            if ( userReceived[item] != undefined )
                userReceivedT = parseInt( userReceived[item] );
            else
                userReceivedT = 0;

            if (vitals.shop.data.shopVariables.items[item] == undefined ) {

                pb.window.error('Sorry, but you have selected an invalid item.');

                return false;

            }

            if (amount == "") {

                pb.window.error('Please enter an amount.');

                return false;

            }

            if (amount == undefined) {

                pb.window.error('The amount you entered is undefiend.');

            }

            if (amount.match(/[^0-9]/)) {

                pb.window.error('Sorry, but you have added a non-numeric character to the amount box, please remove it.');

                return false;

            }

            if ( userBoughtT == 0 && userReceivedT == 0 ) {

                pb.window.error('Sorry, but you do not have any of the item you selected.');

                return false;

            }

            if ( ( userBoughtT + userReceivedT ) < parseInt(amount)) {

                pb.window.error('Sorry, but you cannot give that amount.');

                return false;

            }

            if ( vitals.shop.data.shopVariables.items[item].givable != "true" ) {

                pb.window.error( 'Sorry, but that item is not givable.');

                return false;

            }

            vitals.shop.api.subtract( amount, item, false, null );

            vitals.shop.api.add( amount, item, true, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },

        register: function () {
            vitals.shop.mainFrame.register(this);
        },

     };

} )().register();