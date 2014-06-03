

vitals.shop.addPage = (function(){

    var goldShop = pb.plugin.get('gold_shop');
 
    return {

        createPage: function () {

            var container = $( '<div />').attr( 'id', 'shop-container' );

            yootil.create.page( /\?addItem/ );

            $( 'title' ).text( $( 'title' ).text() + " Add" );

            $( '#content' ).append( '<div id="shop-container"></div>' );
             
            yootil.create.container( 'Add Items' + '<span style="float: right">(' + pixeldepth.monetary.settings.text.wallet + ': ' + pixeldepth.monetary.get( true ) + ')' ).attr( 'id', 'add-container' ).appendTo( '#shop-container' );

        },

        addDefaultContent: function () {

            var html = "",
                option = $( "<input id='add-item' />" ),
                items = vitals.shop.data.shopVariables.items,
                userData = vitals.shop.api.get( pb.data('page').member.id ),
                userBought = userData['b'],
                userReceived = userData['r'],
                keys = removeArrDuples( Object.keys( userBought ).concat( Object.keys( userReceived ) ), JSON.stringify );

            
            html += '<div id="add-content">';
            html += '<div class="shopItem returnImage">';
            html += '<img src="' + vitals.shop.data.shopVariables.images.shopLarge + '" />';
            html += '</div>';
            html += '</div>';

            $( html ).appendTo( '#shop-container .content' );

            option.attr( 'id', 'add-item' ).appendTo( '#add-content' ).before( "Would you like to add items to this members shelf?<br />ID: " ).after( '<br />Amount: <input id="add-amount" /><br /><input type="button" onclick="vitals.shop.addPage.sAdd()" value="Add"/>' );

        },

        addCss: function () {

        	$( '.shopItem' ).css( vitals.shop.data.shopVariables.styles.shopItem );

            $('.returnImage').css( vitals.shop.data.shopVariables.styles.returnImageBox );            

        },

        sAdd: function () {

            var item = $("#add-item").val(),
                amount = $("#add-amount").val();

            if ( !$.inArray( pb.data('user').id.toString(), goldShop.settings.removers) < 0 ) {

                pb.window.error('You do not have permission to use this feature.')

                return false;
                
            }

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

            vitals.shop.api.add( amount, item, true, pb.data( 'page' ).member.id );

            $(document).ajaxComplete(function(){
                location.href = "/user/" + pb.data('page').member.id;
            })

        },
    };

} )();