

		checkUpdate: function(){
			var time = new Date();
			var minute = 1000;
			var hour = minute * 60;
			var day = hour * 60;
			var week = day * 7;
			var month = day * 30;
			var month3 = month * 3;
			var month6 = month * 6; 
			if( localStorage.checkUpdate == "undefined" || localStorage.checkUpdate == "null" ){
				var localStorage.setItem('checkUpdate', time );
			}else{
				
			}
		},