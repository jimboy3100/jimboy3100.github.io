function WatchConflictScriptsFunction(){
		setTimeout(function() {                                
/*var ogario;
if(ogario){
console.log("Ogario variable found, redirecting");
window.location.replace("https://legendmod.joomla.com/en/2-removescripts.html");
}*/
var WatchConflictScripts=document.getElementById('menu-footer').textContent
if (~WatchConflictScripts.indexOf("ogario.ovh")){
console.log("Ogario variable found, redirecting");
window.location.replace("https://legendmod.joomla.com/en/2-removescripts.html");
}
}, 2000);
}
