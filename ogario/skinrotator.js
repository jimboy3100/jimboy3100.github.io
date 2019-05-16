window.skinInterval = 10000;
window.morebots.skinRotate = function(){
  if (window.morebots.skinRotator) {
    if(typeof(window.core) == 'undefined'){return;}
    window.core.registerSkin(window.clientname, null, window.skins[Math.floor(Math.random()*window.skins.length)], 2,null);
  }
}
for(i=0;i<window.skinInterval;i++){setTimeout(function(){morebots.skinRotate()},2500*i)}

//window.morebots.skinRotator = false when disabled, window.clientname = playerNick, window.skins = array with all agar.io skins (1k in total)
