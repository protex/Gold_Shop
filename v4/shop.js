
var vitals = vitals || {};

vitals.shop = (function(){

	return{

		plugin: proboards.plugin._plugins.gold_shop,

		key: proboards.plugin.key.data.gold_shop,

		settings: {
			// user
			is_admin: (pb.data('user').id === 1 )? true: false,
			is_creator: false,
			is_disabled: false,
			is_admin_disabled: false,
			can_submit_items: false,
			can_approve_items: false,
			has_data: false,
		},

		setup: function () {

			

		}

	}

})();

