

var removePage = (function(){
 
    return {

        name: 'removePage',

        module: 'shop',

        init: function () {

            if ( vitals.shop.mainFrame.data.location === 'removePage' ) {

                this.createPage();

                this.addDefaultContent();

                this.addCss();

            }

        },

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?removeItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Remove" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Remove Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'remove-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<select>" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.api.get( pb.data('page').member.id ),
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            for ( var i = 0; i < keys.length; i++ ) {

                option.append( '<option value="' + keys[i] + '">' + items[keys[i]].item_name + '</option>' );

            }
            
            html += '<div id="remove-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'remove-item' ).appendTo( '#remove-content' ).before( "Would you like to remove items from this member?" ).after( '<br />Amount: <input id="remove-amount" /><br /><input type="button" onclick="vitals.shop.removePage.sRemove()" value="Remove"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sRemove: function () {

            var item = $("#remove-item").val(),
                amount = $("#remove-amount").val(),
                removerBought = vitals.shop.api.get( pb.data('page').member.id ).b,
                removerReceived = vitals.shop.api.get( pb.data('page').member.id ).r,
                removerBoughtT,
                removerReceivedT;

            if ( $.inArray( pb.data('user').id.toString(), goldShop.settings.removers) < 0 ) {

                pb.window.error('You do not have permission to use this feature.')

                return false;

            }

            if ( removerBought[item] != undefined )
                removerBoughtT = parseInt( removerBought[item] );
            else
                removerBoughtT = 0;

            if ( removerReceived[item] != undefined )
                removerReceivedT = parseInt( removerReceived[item] );
            else
                removerReceivedT = 0;

            if (vitals.shop.data.shopVariables.items[item] == undefined) {

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

            if ( removerBoughtT == 0 && removerReceivedT == 0 ) {

                pb.window.error('Sorry, this user does not have any of the item you selected.');

                return false;

            }

            if ( ( removerBoughtT + removerReceivedT ) < parseInt(amount)) {

                pb.window.error('Sorry, but you cannot remove that amount.');

                return false;

            }

            vitals.shop.api.subtract( amount, item, false, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },

        register: function() {
            vitals.shop.mainFrame.register(this);
        },
 };

} )().register();