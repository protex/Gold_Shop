
    
//* This method is copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FindexOf#Polyfill
if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function ( searchElement, fromIndex ) {
        if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if ( Math.abs( fromIndex ) === Infinity ) {
            fromIndex = 0;
        }

        if ( fromIndex < 0 ) {
            fromIndex += length;
            if ( fromIndex < 0 ) {
                fromIndex = 0;
            }
        }

        for ( ; fromIndex < length; fromIndex++ ) {
            if ( this[fromIndex] === searchElement ) {
                return fromIndex;
            }
        }

        return -1;
    };
}

//* I'm not using jQuery's native "ready" function because the
//* the errors in returned in the console are not discriptive
//* enought to find out where the error is occuring
var tid = setInterval( function () {
    if ( document.readyState !== 'interactive' ) return;
    clearInterval( tid );
    
    vitals.shop.mainSetup.checkForUserData();

    vitals.shop.mainSetup.giveUserData();

    vitals.shop.mainSetup.locationCheck();

}, 100 );

