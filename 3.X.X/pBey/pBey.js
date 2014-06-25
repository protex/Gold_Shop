

var pBey = (function(){
	
	return{

		name: 'pBey',

		plugin: 'gold_shop',

		key: pb.plugin.key('gold_shop'),

		settings: {

			userData: pb.plugin.key('gold_shop').get(),
			dataHolder: goldShop.settings.dataHolder.toString(),
			pBeyData: ( pb.plugin.key('gold_shop').get(goldShop.settings.dataHolder) !== undefined && pb.plugin.key('gold_shop').get(goldShop.settings.dataHolder) !== null )? pb.plugin.key('gold_shop').get(goldShop.settings.dataHolder): {},
			enabled: (goldShop.settings.pbey_enabled === 'true'),
			dataHolderProfileHidden: (goldShop.settings.hide_data_holders_profile === 'true' )? true: false,
			taxes_enabled: (goldShop.settings.taxes_enabled === 'true')? true: false,
			pBeyLocation: '/user/' + goldShop.settings.dataHolder + '/pBey',

			user_is_dataHolder: false,
			user_can_sell: true,
			user_account_disabled: false,

			images: {
				pBeyLogo: goldShop.images.pBey,
				pBeyYootil: goldShop.images.pBeySmall
			}
 
		},

		init: function () {

			this.setup();

		},

		setup: function () {		

			if ( pb.data('user').id.toString() === this.settings.dataHolder ) {

				this.settings.user_is_dataHolder = true;

				if (this.settings.dataHolderProfileHidden === true )
					this.dataHolderDisplay();

			}

			if (this.settings.enabled) {

				this.addYootilButton();					

				if ( !this.settings.user_is_dataHolder ) {				

					if ( !this.has_pBey_data() ) {

						if ( location.href.match(this.settings.pBeyLocation) ) {

							this.createpBey();
							this.setUserData();

						}

					} else {

						var regpBey = new RegExp('^' + this.settings.pBeyLocation + '$'),
							regAccount = new RegExp('^' + this.settings.pBeyLocation + '/account$'),
							regEditAccount = new RegExp('^' + this.settings.pBeyLocation + '/editaccount$'),
							regSell = new RegExp( '^' + this.settings.pBeyLocation + '/sell$')

						if( this.settings.userData.pBey.d === true )
							this.settings.user_account_disabled = true;

						if ( location.pathname.match(regpBey) ) {

							this.createpBey();

						} else if ( location.pathname.match( regAccount ) ) {

							this.accountPage();

						} else if ( location.pathname.match( regEditAccount ) ){

							this.editAccountPage();

						} else if ( location.pathname.match( regSell ) && location.search === '' ) {

							this.sellPageListing();

						} else if ( location.pathname.match(regSell) && location.search.match(/\?sell\=/)) {

							this.sellPage();

						}

					}
				}
			}

		},

		has_pBey_data: function () {
			if (this.key.get().pBey !== undefined)
				return true;
			else
				return false;
		},

		addYootilButton: function () {
			yootil.bar.add(this.settings.pBeyLocation, this.settings.images.pBeyYootil, "pBey", "pBey");
		},

		setUserData: function () {
			var self = this;			
			pb.window.dialog('pBey_welcome', {
				title: "Welcome to pBey",
				html: "Congradulations, this is your first visit to pBey. Feel free to brows items that are currently for sale, or even sell some of your own items.",
				close: function () { 
					if ( self.settings.userData !== undefined && self.settings.userData !== '' ) {
						var data = self.settings.userData;
						data.pBey = {
							fs: {}, 
							co: {},
							uuid: getUUID(),
							tb: 0,
							ts: 0,
							r: 0,
						};
						pb.plugin.key('gold_shop').set({value: data})
					} else {
						self.settings.userData.pBey = {
							fs: {}, 
							co: {},
							uuid: getUUID(),
							tb: 0,
							ts: 0,
							r: 0,
							d: false,
						};
						pb.plugin.key('gold_shop').set({value: data})							
					}
				}
			});	

			function getUUID(){
				  function rand() {
				    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
				  }

				  return rand() + '-' + rand() + '-' + rand();
			}		
		},

		dataHolderDisplay: function () {
			yootil.create.page(/[a-z]/, 'Data Holder').container('Error', 'This is the Data Holder account, please do you use this account.').appendTo('#content');
		},

		createpBey: function () {

			var html = '',
				reg = new RegExp('/user/' + this.settings.dataHolder + '/pBey'),
				title = '';

			html += '<div class="pBey-container">';
			html += '<div class="pBey-logo"><img class="pBey-logo-image" max-width="150px" max-height="150px" src="'+ this.settings.images.pBeyLogo + '" /></div>';
			html += '<div class="pBey-welcomeMessage"></div>';
			html += '<div class="pBey-buy-sell">';			
			html += '<a class="pBey-buy-button button" style="margin-left: 25%" href="' + this.settings.pBeyLocation + '/buy">Buy</a>';			
			html += '<a class="pBey-sell-button button" href="' + this.settings.pBeyLocation + '/sell">Sell</a>'
			html += '</div>';
			html += '</div>';

			title += 'pBey'
			title += '<a class="pBey-account-button button" href="' + this.settings.pBeyLocation + '/account">Account</a>';

			vitals.shop.api.removeNavItem(['/members', '/user/' + pb.data('page').member.id]);

			yootil.create.nav_branch(this.settings.pBeyLocation, 'pBey');
			yootil.create.page( reg, "pBey").container(title, html).appendTo('#content');

		},

		accountPage: function () {

			var html = '',
				reg = new RegExp('/user/' + this.settings.dataHolder + '/pBey/account');
				title = '';

			html += '<div class="pBey-container">';
			html += '<div class="pBey-logo"></div>';
			html += '<div class="pBey-account-info">';
			html += '<div><span class="pBey-namespace">UID:</span><span class="pBey-attribute">' + this.settings.userData.pBey.uuid + '</span></div>';
			html += '<div><span class="pBey-namespace">Total Bought:</span><span class="pBey-attribute">' + this.settings.userData.pBey.tb + '</span></div>';
			html += '<div><span class="pBey-namespace">Total Sold:</span><span class="pBey-attribute">' + this.settings.userData.pBey.ts + '</span></div>';
			html += '<div><span class="pBey-namespace">Rating:</span><span class="pBey-attribute">' + this.settings.userData.pBey.r + '</span></div>';
			html += '<div><span class="pBey-namespace">Disabled:</span><span class="pBey-attribute">' + this.settings.userData.pBey.d.toString() + '</span></div>';
			html += '</div>';
			html += '</div>';

			title += 'pBey - Account';
			title += '<a class="pBey-account-button button" href="' + this.settings.pBeyLocation + '/editaccount">Edit Account Settings</a>';

			vitals.shop.api.removeNavItem(['/members', '/user/' + pb.data('page').member.id]);			

			yootil.create.nav_branch(this.settings.pBeyLocation, 'pBey');
			yootil.create.nav_branch(location.pathname, 'Account');
			yootil.create.page( reg, "pBey - Account" ).container(title, html).appendTo('#content');

		},

		editAccountPage: function () {

			var html = '',
				reg = new RegExp('/user/' + this.settings.dataHolder + '/pBey/editaccount');
				title = '';

			html += '<div class="pBey-container">';
			html += '<div class="pBey-logo"></div>';
			html += '<div class="pBey-account-info">';
			if ( !this.settings.user_account_disabled )
				html += '<div><a href="#" onclick="vitals.shop.pBey.disableAccount(\'' + yootil.user.id() + '\')" class="button">Disable Account</a></div>';
			else
				html += '<div><a href="#" onclick="vitals.shop.pBey.enableAccount(\'' + yootil.user.id() + '\')" class="button">Enable Account</a></div>';

			html += '</div>';
			html += '</div>';

			title += 'pBey - Edit Account Settings';

			vitals.shop.api.removeNavItem(['/members', '/user/' + pb.data('page').member.id]);		

			yootil.create.nav_branch(this.settings.pBeyLocation, 'pBey');
			yootil.create.nav_branch(location.pathname, 'Account');
			yootil.create.page( reg, "pBey - Edit Account Settings" ).container(title, html).appendTo('#content');


		},	

		disableAccount: function () {
			pb.window.dialog('pBey_disable_account',{
				title: "Disable Account",
				html: "Are you sure you wish to disable your account? All of your current item listings will be remporarily taken down until your re-enable your account.",
				buttons: {
					"Yes": function () {
						vitals.shop.pBey.settings.userData.pBey.d = true;
						pb.plugin.key('gold_shop').set({value: vitals.shop.pBey.settings.userData});
						$(document).ajaxComplete(function(){location.href = vitals.shop.pBey.settings.pBeyLocation + '/account'});						
						$(this).dialog('close');
					},
					"Cancel": function () {
						$(this).dialog('close');
					}
				}
			})
		},

		enableAccount: function () {
			pb.window.dialog('pBey_enable_account',{
				title: "Enable Account",
				html: "Are you sure you wish to enable your account?",
				buttons: {
					'Yes': function () {
						vitals.shop.pBey.settings.userData.pBey.d = false;
						pb.plugin.key('gold_shop').set({value: vitals.shop.pBey.settings.userData});	
						$(document).ajaxComplete(function(){location.href = vitals.shop.pBey.settings.pBeyLocation + '/account'});											
						$(this).dialog('close');
					},
					'cancel': function () {
						$(this).dialog('close');
					}
				}
			})
		},

		sellPageListing: function () {

			var html = '',
				reg = new RegExp('/user/' + this.settings.dataHolder + '/pBey/sell');
				title = '';

			html += '<div class="pBey-container">';
			html += '<div class="pBey-logo"></div>';
			html += '<div class="pBey-welcomeMessage"></div>';
			html += '<div id="item-info-box"></div>';
			html += '</div>';

			title += 'pBey - Sell';

			vitals.shop.api.removeNavItem('Members').removeNavItem(pb.data('page').member.name);			

			yootil.create.nav_branch(this.settings.pBeyLocation, 'pBey');
			yootil.create.nav_branch(location.pathname, 'Sell');
			yootil.create.page( reg, "pBey - Sell" ).container(title, html).appendTo('#content');	

			this.addItems(pb.data('page').member.id);		

		},

        addItems: function () {

        	var hash = this.userItemInfoHash();

        	for ( var i in hash ) {

	        	vitals.shop.pBey.createItem( hash[i].id, hash[i].total, hash[i].boughtTotal, hash[i].receivedTotal );

        	}

            $('.shop-item').css(vitals.shop.profilePage.data.styles.item)

        },

        createItem: function ( itemId, total, boughtTotal, receivedTotal ) {

            var items = vitals.shop.data.shopVariables.items,
                itemData = items[itemId],
                html = '';

            html += '<div class="shop-item" onmouseover="vitals.shop.profilePage.itemHover(this)" onmouseout="vitals.shop.profilePage.itemHoverOut(this)">';
            html += '<img onclick="location.href = \''+ this.settings.pBeyLocation + '\' + \'/sell?sell=' + itemId + '\'" class="pBey-item-small" src="' + itemData.image_of_item + '" title="Click to sell" />';
            html += '</div>';

            $( html ).data( { id: itemId, name: itemData.item_name, total: total, bought: boughtTotal, received: receivedTotal } ).appendTo( '.pBey-welcomeMessage' );

        },	

        sellPage: function (user) {

			var hash = this.userItemInfoHash();  	

        },

		register: function() {
			vitals.shop.mainFrame.register(this);
		},

	}

})().register();