

vitals.shop.data = (function(){
	
	function data(){
		var data = proboards.plugin.keys.data['gold_shop'];
		this.data = data;
		this.shop = data['shop'];
		this.pBey = data['pBey'];
		
		this.get = {
			
			shop: {
				
				all: function () {
					return this.shop;
				},
				
				user: function (user) {
					
					if ( user === null || user === undefined )
						user = yootil.user.id();
						
					if ( this.shop.users[user] !== undefined )
						return this.shop.users[user];
						
				},
				
				item: function (item) {
					
					if ( item === null || item === undefined )
						return this.shop.i;
					else if ( this.shop.i[item] !== undefined )
						return this.shop.i[item];
					
				},
				
				submit: function (submitted) {
					if ( submitted === null || submitted === undefined ) 
						return this.shop.si;
					else if ( this.shop.si[submitted] !== undefined )
						return this.shop.si[submitted]
				}

			},
			
			pBey: function () {
				return this.pBey;
			},
			
					

		}
		
	}
	
	return data;
	
})();
