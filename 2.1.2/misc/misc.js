if( typeof vitals == "undefined" ){
    vitals = {};
}

(function( $ ) {
  $.fn.rightClick = function( method ) {
      
    $(this).mousedown(function( e ) {
        if( e.which === 3 ) {
            e.preventDefault();
            method();
        }
    });

  };
})( jQuery );

if( yootil.is_json( proboards.plugin.get('gold_shop').settings.json ) ){
	if( JSON.stringify( proboards.plugin.get('gold_shop').settings.items ) == "[]" ){
		proboards.plugin.get('gold_shop').settings.items = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
	}else{
		var old = $.parseJSON( proboards.plugin.get('gold_shop').settings.json );
		var nw = proboards.plugin.get('gold_shop').settings.items;
		proboards.plugin.get('gold_shop').settings.items = old.concat(nw);
	}
}

$(document).ready(function(){
	vitals.shop.init();
});