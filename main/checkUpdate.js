

		checkUpdate: function(){
			var time = new Date();
			var minute = 1000;
			var hour = minute * 60;
			var day = hour * 60;
			var week = day * 7;
			var biweek = week * 2;
			var month = day * 30;
			var month3 = month * 3;
			var month6 = month * 6; 
			if( localStorage.checkUpdate == "undefined" || localStorage.checkUpdate == "null" ){
				var localStorage.setItem('checkUpdate', "[time , this.data.version]" );
			}else{
				var data = $.parseJSON( localStorage.checkUpdate );
				var lastUpdate = data[0];
				var version = data[1];
				var settings = proboards.plugin.get('gold_shop').settings.update_interval;
				switch( settings ){
					case "weekly":
						if( ( parseInt( lastUpdate ) - time ) > 1 ){
							$.ajax({
								url: "https://raw.github.com/protex/Gold_Shop/master/version.js",
								context: this,
								crossDomain: true,
								dataType: "json"				
							}).done(function(Nversion){
								if( Nversion.version != version ){
									proboards.alert('An update to the Gold Shop is in the Library. This message will continue to show up until you either disable the update feature or update the plugin.'); 
								}
							});							
						}
						break;
					case "biweekly":
						if( ( parsInt( lastUpdate ) - time ) > biweek ){
							proboards.alert('
			}
		},