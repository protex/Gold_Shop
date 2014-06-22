cd C:\Users\Peter\Documents\My_Stuff\PBP\Gold_Shop
if exist gShop.dev.js erase gShop.dev.js
type 3.X.X\shop\shop.js 3.x.x\mainFrame\mainFrame.js 3.X.X\shop\shopPage.js 3.X.X\shop\buyPage.js 3.X.X\shop\infoPage.js 3.X.X\shop\profilePage.js 3.X.X\shop\givePage.js 3.X.X\api\api.js 3.x.x\shop\removePage.js 3.x.x\shop\buyPackagePage.js 3.x.x\shop\addPage.js 3.X.X\pBey\pBey.js 3.X.X\misc\misc.js >> gShop.dev.js
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

