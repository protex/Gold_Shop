cd C:\Users\Peter\Documents\My_Stuff\PBP\Gold_Shop
if exist gShop.min.js erase gShop.min.js
CALL concat.bat
java -jar yuicompressor-2.4.7.jar --nomunge --preserve-semi combined.js -o gShop.min.js
type gShop.min.js | clip


