if(typeof vitals=="undefined"){vitals={}}(function(a){a.fn.rightClick=function(b){a(this).mousedown(function(c){if(c.which===3){c.preventDefault();b()}})}})(jQuery);if(yootil.is_json(proboards.plugin.get("gold_shop").settings.json)){if(JSON.stringify(proboards.plugin.get("gold_shop").settings.items)=="[]"){proboards.plugin.get("gold_shop").settings.items=$.parseJSON(proboards.plugin.get("gold_shop").settings.json)}else{var old=$.parseJSON(proboards.plugin.get("gold_shop").settings.json);var nw=proboards.plugin.get("gold_shop").settings.items;proboards.plugin.get("gold_shop").settings.items=old.concat(nw)}}$(document).ready(function(){vitals.shop.init();if(proboards.plugin.get("gold_shop").settings.pbey_enabled=="true"){vitals.pBey.init()}});vitals.shop=(function(){return{add:function(b,a){pixeldepth.monetary.add(b,a)},check_amount:function(b){if(yootil.is_json(proboards.plugin.key("gold_shop").get())){var a=vitals.shop.data.items;var d=$.parseJSON(proboards.plugin.key("gold_shop").get());var c=d.b;for(x=0;x<a.length;x++){if(vitals.shop.find_amount(c,a[x].item_id).length>parseInt(a[x].amount)-1){$(".main").each(function(){if($(this).attr("item-number")==a[x].item_id){$(this).parent().remove()}})}if(b==""||b=="undefined"){$(".last").each(function(){if($(this).siblings().first().next().attr("item-number")==a[x].item_id){if(!isNaN((parseInt($(this).text().split("|")[1])-parseInt(vitals.shop.find_amount(c,a[x].item_id).length)))){$(this).html("<center>"+$(this).text().split("|")[0]+"| "+(parseInt($(this).text().split("|")[1])-parseInt(vitals.shop.find_amount(c,a[x].item_id).length))+" | "+a[x].item_id+"</center>")}}})}else{$(".last").each(function(){if($(this).siblings().first().next().attr("item-number")==a[x].item_id&&$(this).siblings().first().next().attr("item-number")==b){if(!isNaN((parseInt($(this).text().split("|")[1])-1))){$(this).html("<center>"+$(this).text().split("|")[0]+"| "+(parseInt($(this).text().split("|")[1])-1)+" | "+a[x].item_id+"</center>")}}})}}}},content_remove:function(a){$("#content").html(a)},find_amount:function(c,d){var b=[];for(var a in c){if(!c.hasOwnProperty(a)){continue}if(typeof c[a]=="object"){b=b.concat(vitals.shop.find_amount(c[a],d))}else{if(c[a]==d&&a!=""){b.push(a)}}}return b},init:function(){yootil.create.page(/\?shop\?items/,"Shop");vitals.shop.data.shop_items=(yootil.is_json(vitals.shop.data.get()))?$.parseJSON(vitals.shop.data.get()):vitals.shop.data.object;vitals.shop.init_shop();if(proboards.data("route").name=="user"||proboards.data("route").name=="current_user"||proboards.data("route").name=="edit_user_personal"){vitals.shop.init_profile_view()}},init_items:function(){if(location.href.match(/\?shop\?items/)){yootil.create.nav_branch("/?shop?items/","Items & Costs");shop_catagories=[];var c=vitals.shop.data.items;var b='<table class="list" role="grid"><thead><tr><th class="icon" style="width: 50%">Item</th><th class="main" style="width: 300px">Description</th><th class="latest last" style="width: 200px;">Cost | Amount | ID</th></tr></thead><tbody></tbody></table>';var d=proboards.plugin.get("gold_shop").settings.catagories;for(i=0;i<d.length;i++){shop_catagories.push(d[i].catagory)}for(i=0;i<shop_catagories.length;i++){if($(".shop-catagory").length<1){$(".shop-welcome").after('<div class="container"><div onclick="$(this).siblings().first().toggle()" style="cursor: pointer" class="shop-catagory-first shop-catagory title-bar"><h1 class="catagory-title">'+shop_catagories[i]+'</h1></div><div style="display: none" class="content cap-bottom">'+b+"</div></div>")}else{$(".shop-catagory:last").parent().after('<div class="container"><div onclick="$(this).siblings().first().toggle()" style="cursor: pointer" class="shop-catagory title-bar"><h1 class="catagory-title">'+shop_catagories[i]+'</h1></div><div style="display: none" class="content cap-bottom">'+b+"</div></div>")}}for(i=0;i<c.length;i++){var a=c[i].item_id;$(".shop-catagory").each(function(){if($(this).text()==c[i].item_catagory){$(this).parent().children().last().children().first().children().last().append('<tr class="shelf board item"><td class="icon"></td><td class="main"></td><td class="latest last"></td></tr>');$(this).parent().children().last().children().first().children().last().children().last().children().first().next().attr("item-number",c[i].item_id).click(function(){var f=$(this).parent().children().last().text().split("|")[0].replace(/[^0-9]/,"");var e=$(this).attr("item-number");proboards.confirm("<h4>Are you sure you would like to make this purchace?</h4>",function(){if(pixeldepth.monetary.get()>=f){var g=vitals.shop.data.object;vitals.shop.subtract(f);if(yootil.is_json(proboards.plugin.key("gold_shop").get())){g=$.parseJSON(proboards.plugin.key("gold_shop").get())}g.b.push({"#":e});g.lb=e;vitals.shop.data.set(JSON.stringify(g));vitals.shop.check_amount(e);vitals.shop.data.current_item=e}else{proboards.alert("<h4>Sorry, insufficient funds.</h4>")}})});$(this).parent().children().last().children().first().children().last().children().last().children().first().html('<img src="'+c[i].image_of_item+'"></img>').attr("title",(c[i].item_name!="undefined"&&c[i].item_name!="")?c[i].item_name:"");$(this).parent().children().last().children().first().children().last().children().last().children().first().next().html(c[i].description);$(this).parent().children().last().children().first().children().last().children().last().children().last().html("<center>"+pixeldepth.monetary.settings.money_symbol+c[i].cost_of_item+" | "+((c[i].amount=="")?"&infin;":c[i].amount)+" | "+c[i].item_id+"</center>")}})}vitals.shop.check_amount("")}},init_moderation:function(){if(proboards.data("route").name=="user"&&!location.href.match(proboards.data("user").url)&&$.inArray(proboards.data("user").id.toString(),proboards.plugin.get("gold_shop").settings.removers)>-1){$("[href='/conversation/new/"+location.href.split("/user/")[1]+"']").before('<a class="button" href="javascript:void(0)" role="button" id="remove_item">Remove Item</a>');$("#remove_item").click(function(){proboards.dialog("give_item_box",{title:"Remove Item",html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input><br /><select id="given"><option value="true">Yes</option><option value="false">No</option></select>Given?',buttons:{Confirm:function(){if(vitals.shop.api.remove(location.href.split("/user/")[1],$("#item_id").val(),$("#item_amount").val(),(($("#given").val()=="true")?true:false),true)){vitals.shop.api.remove(location.href.split("/user/")[1],$("#item_id").val(),$("#item_amount").val(),(($("#given").val()=="true")?true:false));$(this).dialog("close")}else{proboards.alert("Error: This user does not have enought of that item.")}},Cancel:function(){$(this).dialog("close")},}})})}},init_profile_view:function(){var e=(proboards.plugin.get("gold_shop").settings.profile_page_text_size=="")?6:proboards.plugin.get("gold_shop").settings.profile_page_text_size;var d='<div class="content-box center-col" id="shelf">';d+="<table>";d+='<tr><td width="100%"><center><font size="'+e+'">Shop Items</font></center></td></tr>';d+='<tr><td id="display"></td></tr>';d+="</table>";d+="</div>";var g=vitals.shop.data.items;var k=location.href.split("/user/")[1];vitals.shop.data.shop_items=(yootil.is_json(proboards.plugin.key("gold_shop").get(k)))?$.parseJSON(proboards.plugin.key("gold_shop").get(k)):vitals.shop.data.object;var j=vitals.shop.data.shop_items.b;var c=vitals.shop.data.shop_items.r;($(".status-input").length>0)?$("#center-column").children().first().next().after(d):$("#center-column").children().first().after(d);for(i=0;i<j.length;i++){for(x=0;x<g.length;x++){var f="";var h=g[x].description;if(h.length>20){f=h.slice(0,100);f=f.slice(0,f.lastIndexOf(" "))+"... (Right click to view more)"}if(j[i]["#"]==g[x].item_id){$("#display").append('<img title="'+((f=="")?h:f)+'" style="max-height: 100px; max-width: 100px" class="'+g[x].item_id+'" src='+g[x].image_of_item+"></img>");var b=g[x].item_id;var a=(g[x].item_name!="undefined")?g[x].item_name:"";$("."+g[x].item_id).rightClick(function(){proboards.alert("Name: "+a+"<br /><br />Description: "+h+"<br /><br />ID: "+b)})}}}for(i=0;i<c.length;i++){for(x=0;x<g.length;x++){var f="";var h=g[x].description;if(h.length>20){f=h.slice(0,100);f=f.slice(0,f.lastIndexOf(" "))+"..."}if(c[i]["#"]==g[x].item_id){$("#display").append('<img title="'+((f=="")?h:f)+'" style="max-height: 100px; max-width: 100px" class="'+g[x].item_id+'" src='+g[x].image_of_item+"></img>");$("."+g[x].item_id).rightClick(function(){alert("works")})}}}for(i=0;i<g.length;i++){$("."+g[i].item_id+":last").attr("title","Name: "+g[i].item_name+"\nDescription: "+$("."+g[i].item_id+":last").prop("title")+"\nAmount: "+$("."+g[i].item_id).length+"\nBought: "+vitals.shop.find_amount(j,g[i].item_id).length+"\nGiven: "+vitals.shop.find_amount(c,g[i].item_id).length+"\nID: "+g[i].item_id);if($("."+g[i].item_id).length>1){for(x=$("#shelf ."+g[i].item_id).length;x>1;x--){$("#shelf ."+g[i].item_id+":first").remove()}}}if(proboards.data("route").name=="user"){$("[href='/conversation/new/"+location.href.split("/user/")[1]+"']").before('<a class="button" href="javascript:void(0)" role="button" id="give_item">Give Item</a>');$("#give_item").click(function(){proboards.dialog("give_item_box",{title:"Give Item",html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',buttons:{Confirm:function(){if(vitals.shop.api.give(k,$("#item_id").val(),$("#item_amount").val(),true)){if(vitals.shop.api.remove(proboards.data("user").id,$("#item_id").val(),$("#item_amount").val(),false,true)){vitals.shop.api.remove(proboards.data("user").id,$("#item_id").val(),$("#item_amount").val(),false,false);vitals.shop.api.give(k,$("#item_id").val(),$("#item_amount").val());$(this).dialog("close")}else{proboards.alert("Error: You do not have enought of that item.")}}else{proboards.alert("Error: That item is not givable.")}},Cancel:function(){$(this).dialog("close")},}})})}this.init_moderation()},init_return:function(){$("#return-item").click(function(){if(yootil.is_json(vitals.shop.data.get())){proboards.dialog("return_item_box",{title:"Give Item",html:'<input id="item_id">Item ID</input><br /><input id="item_amount">How Many?</input>',buttons:{Confirm:function(){if(vitals.shop.api._return(proboards.data("user").id,$("#item_id").val(),$("#item_amount").val(),true)){if(vitals.shop.api.remove(proboards.data("user").id,$("#item_id").val(),$("#item_amount").val(),false,true)){vitals.shop.api._return(proboards.data("user").id,$("#item_id").val(),$("#item_amount").val());$(this).dialog("close")}else{proboards.alert("Error: You do not have enought of that item.")}}else{proboards.alert("Error: That item is not returnable.")}},Cancel:function(){$(this).dialog("close")},}})}else{proboards.alert("Error: You do not have any items to return")}})},init_shop:function(){if(location.href.match(/\?shop\?/i)){yootil.create.nav_branch("/user?shop?","Shop");$(".state-active:first").attr("class","");$('[href="/user?shop?items"]').attr("class","state-active");$("title:first").text("Shop | Items & Costs");var a="";a+='<div class="container shop-welcome">';a+='<div class="title-bar"><h1>The Shop</h1><a style="float: right" class="button" href="javascript:void(0)" role="button" id="return-item">Return Item</a></div>';a+='<div id="welcome-message" class="content cap-bottom"><center>'+vitals.shop.data.welcome_message+"</center></div>";vitals.shop.content_remove(a);vitals.shop.init_items();vitals.shop.init_return()}},subtract:function(b,a){pixeldepth.monetary.subtract(b,a)},}})();vitals.shop.data={items:proboards.plugin.get("gold_shop").settings.items,set:function(a,b){if(a==""){a=b;b=undefined}proboards.plugin.key("gold_shop").set(a,b)},get:function(a){return proboards.plugin.key("gold_shop").get(a)},welcome_message:(proboards.plugin.get("gold_shop").settings.welcome_message!="")?proboards.plugin.get("gold_shop").settings.welcome_message:"<font size='5'>Welcome to The Shop!</font>",object:{b:[],s:[],r:[],lb:"",},shop_items:0,clear:function(){proboards.plugin.key("gold_shop").set("")},current_item:"",},vitals.shop.api=(function(){return{buy:function(c,b){var a=vitals.shop.data.items;var d=(yootil.is_json(vitals.shop.data.get()))?$.parseJSON(vitals.shop.data.get()):vitals.shop.data.object;for(i=0;i<a.length;i++){if(a[i].item_id==c){if(pixeldepth.monetary.get()>=(a[i].cost_of_item*b)){for(x=0;x<b;x++){d.b.push({"#":c})}pixeldepth.monetary.add(a[i].cost_of_item*b);vitals.shop.data.set(JSON.stringify(d))}}}},give:function(c,f,d,a){if(yootil.is_json(vitals.shop.data.get(c))){var e=$.parseJSON(vitals.shop.data.get(c));var b=vitals.shop.data.items;for(i=0;i<b.length;i++){if(b[i].item_id==f){if(b[i].givable=="true"){if(a!=true){for(x=0;x<d;x++){e.r.push({"#":f})}vitals.shop.data.set(c,JSON.stringify(e))}return true;break}else{return false}}}}else{var e=vitals.shop.data.object;var b=vitals.shop.data.items;for(i=0;i<b.length;i++){if(b[i].item_id==f){if(b[i].givable=="true"){if(a!=true){for(i=0;i<d;i++){e.r.push({"#":f})}vitals.shop.data.set(c,JSON.stringify(e))}return true}else{return false}}}}},onBought:function(b,c){if(yootil.is_json(proboards.plugin.key("gold_shop").get())){vitals.shop.data.object=$.parseJSON(proboards.plugin.key("gold_shop").get());var a=vitals.shop.data.object;if(a.lb==b){a.lb="";vitals.shop.data.set(JSON.stringify(a));c()}}},pBey_remove:function(b,c,a){object=$.parseJSON(vitals.shop.data.get(vitals.pBey.data_holder));pObject=$.parseJSON(vitals.shop.data.get(b));if(b==proboards.data("user").id||a){for(i=0;i<object.i.length;i++){if(object.i[i]["user"][2]==c){object.i.splice(i,1);break}}}if(!a){for(i=0;i<pObject.s.length;i++){if(pObject.s[i]["user"][2]==c){pObject.s.splice(i,1);break}}}vitals.shop.data.set(vitals.pBey.data_holder,JSON.stringify(object));vitals.shop.data.set(b,JSON.stringify(pObject))},remove:function(c,f,d,h,a){var e=$.parseJSON(vitals.shop.data.get(c));var b=vitals.shop.data.items;var g=(h)?e.r:e.b;if(vitals.shop.find_amount(g,f).length>=d){for(x=0;x<b.length;x++){for(i=0;i<g.length;i++){if(g[i]["#"]==f){if(a!=true){g.splice(i,1);proboards.plugin.key("gold_shop").set(c,JSON.stringify(e));d=d-1;if(d==0){return true;break}}if(a==true){return true}}}}}else{return false}},sell:function(a,c,e){var b=$.parseJSON(vitals.shop.data.get(proboards.plugin.get("gold_shop").settings.data_holder.toString()));var d=$.parseJSON(vitals.shop.data.get());if(vitals.shop.find_amount(d.b,c).length>=1){b.i.push({user:[c,e,b.c]});d.s.push({user:[c,e,b.c]});b.c++;vitals.shop.data.set(proboards.plugin.get("gold_shop").settings.data_holder.toString(),JSON.stringify(b));vitals.shop.data.set(JSON.stringify(d));vitals.shop.api.remove(proboards.data("user").id,c,1)}},_return:function(c,f,d,a){if(yootil.is_json(vitals.shop.data.get(c))){var e=$.parseJSON(vitals.shop.data.get(c));var b=vitals.shop.data.items;for(x=0;x<b.length;x++){if(f==b[x].item_id){if(b[x].returnable=="true"){if(a!=true){pixeldepth.monetary.add(b[x].cost_of_item*parseInt(d)*((proboards.plugin.get("gold_shop").settings.retail=="")?1:parseInt(proboards.plugin.get("gold_shop").settings.retail)));vitals.shop.api.remove(c,f,d)}return true;break}else{return false}}}}else{return false}},}})();