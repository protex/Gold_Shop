cd C:\Users\Peter\Documents\My_Stuff\PBP\Gold_Shop
if exist gShop.dev.js erase gShop.dev.js
type main\header.txt main\*.js main\footer.txt >> main.js
type api\header.txt api\*.js api\footer.txt >> api.js
type pBey\header.txt pBey\*.js pBey\footer.txt >> pBey.js
type misc\misc.js main.js data\data.js api.js >> gShop.dev.js
findstr /rvc:"^ *//" "gShop.dev.js" >"noComment1.js"
findstr /rvc:"^ *\*/" "noComment1.js" > "noComment2.js"
findstr /rvc:"^ */\*" "noComment2.js" > "noComment3.js"
findstr /rvc:"^ *\*" "noComment3.js" > "gShop.full.js"
type gShop.full.js | clip
erase main.js 
erase api.js
erase pBey.js
erase noComment1.js
erase noComment2.js
erase noComment3.js

