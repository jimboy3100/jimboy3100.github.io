//Legend Mod Sniff2 by jimboy3100
(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://jimboy3100.github.io/banners/icon32croped.ico.gif';
    document.getElementsByTagName('head')[0].appendChild(link);
})();
document.title = "Legend mod";

setTimeout(function () {
$("#leaderboard-hud > h4").text("Leaderboard");
}, 100);
setTimeout(function () {
$("#movingskins").css( { marginTop : "-15px" } );
$("#movingskins").css( { marginBottom : "-30px" } );
    
//Remove Advertismenets (Step 2) - Needs time
$("#unrulyMsg").remove();
//this iframe already removed because of removing parent div
$( "iframe[id*='rpfl_emily']" ).remove();    
toastr["info"]("Legend mod still needs <b>Fixes</b>", "", { timeOut: 6000, extendedTimeOut: 6000 });
}, 6000);


