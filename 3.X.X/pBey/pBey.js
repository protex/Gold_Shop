

var pBey = (function(){
	
	return{

		name: 'pBey',

		plugin: 'gold_shop',

		key: pb.plugin.key('gold_shop'),

		settings: {

			userData: pb.plugin.key('gold_shop').get(),
			asdf: this.dataHolder,
			dataHolder: goldShop.settings.dataHolder,
			pBeyData: ( this.settings.key.get(this.dataHolder) !== undefined && this.settings.key.get(pb.plugin.key('gold_shop').get()) !== null )? this.settings.key.get(this.dataHolder): {},
			enabled: goldShop.settings.pbey_enabled,
			taxes_enabled: goldShop.settings.taxes_enabled,
			pBeyLocation: '/user/' + dataHolder + '/pBey',

			user_is_dataHolder: false,
			user_can_sell: true,
 
		},

		init: function () {

			this.setup();

		},

		setup: function () {

			var self = this;

			if (this.settings.enabled) {

				if ( key.get() !== undefined ) {

					if ( !this.has_pBey_data() ) {
						if ( location.href.match(this.settings.pBeyLocation) ) {
							pb.window.dialog('pBey_welcome', {
								title: "Welcome to pBey",
								html: "Congradulations, this is your first visit to pBey. Feel free to brows items that are currently for sale, or even sell some of your own items.",
								buttons: {
									"close": function () {
										var data = self.settings.userData;
										data.pBey = {};
										$(this).dialog('close');
									}
								}
							});
						}
					}

				}

			}

			this.addYootilButton();

		},

		has_pBey_data: function () {
			if (key.get().pBey !== undefined)
				return true;
		},

		addYootilButton: function() {
			yootil.bar.add(this.settings.pBeyLocation, goldShop.images.pBey, "pBey", "pBey")
		},

		register: function() {
			vitals.shop.mainFrame.register(this);
		},

	}

})().register();