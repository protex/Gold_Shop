cd C:\Users\Peter\Documents\Aptana Studio 3 Workspace\Gold_Shop
if exist gShop.dev.js erase gShop.dev.js
type v4\shop.js v4\infoPage.js v4\data.js v4\misc.js >> gShop.dev.js
findstr /rvc:"^ *// " "gShop.dev.js" >"noComment1.js"
findstr /rvc:"^ *\*/" "noComment1.js" > "noComment2.js"
findstr /rvc:"^ */\*" "noComment2.js" > "noComment3.js"
findstr /rvc:"^ *\*" "noComment3.js" > "gShop.full.js"
type Copyright.txt gShop.full.js > test.js
type test.js > gShop.full.js
type Copyright.txt gShop.dev.js > test.js
type test.js > gShop.dev.js
erase test.js
type gShop.full.js | clip
erase noComment1.js
erase noComment2.js
erase noComment3.js