

//* This method is copied from http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
removeArrDuples = function(ary, key) {
    var seen = {};
    return ary.filter(function(elem) {
        var k = key(elem);
        return (seen[k] === 1) ? 0 : seen[k] = 1;
    });
};

//* Copied from http://stackoverflow.com/questions/13037762/how-to-get-url-variable-using-jquery-javascript
function getURLParams() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

//* I'm not using jQuery's native "ready" function because the
//* the errors in returned in the console are not discriptive
//* enought to find out where the error is occuring
var start = setInterval(function() {
    if (!$.isReady) return;
    clearInterval(start);

    if (vitals.shop.mainFrame.checkForData()) {

        vitals.shop.mainFrame.loadData();

    }

    if (vitals.shop.mainFrame.checkIfUpdate()) {

        vitals.shop.api.update();

    }

    vitals.shop.mainFrame.createItemDataHash();

    vitals.shop.mainFrame.addYootilButton();

    vitals.shop.mainFrame.locationCheck();

    vitals.shop.mainFrame.locationReact();

}, 100);