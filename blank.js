
var blank = (function(){

	return{

		name: 'blank',

		initFast: false,

		settings: {},

		init: function (){
			this.setup();
			// init here
		},

		setup: function () {
			// setup here
		}.

		register: function () {
			vitals.mainFrame.createNewModule(this);
		}

	}

})().register()