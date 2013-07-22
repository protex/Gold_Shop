cd C:\Users\Peter\Documents\My_Stuff\PBP\Testing
if exist combined.js erase combined.js
type main\header.txt main\*.js main\footer.txt >> main.js
type api\header.txt api\*.js api\footer.txt >> api.js
type misc\misc.js main.js data\data.js api.js >> combined.js
type combined.js | clip
erase main.js 
erase api.js