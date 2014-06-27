

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
