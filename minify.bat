cd C:\Users\Peter\Documents\My_Stuff\PBP\Gold_Shop
if exist minified.js erase minified.js
java -jar yuicompressor-2.4.7.jar combined.js -o minified.js
type minified.js | clip

