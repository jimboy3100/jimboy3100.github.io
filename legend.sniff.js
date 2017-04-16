//Legend Mod Sniff by jimboy3100

var url = window.location.href;
localStorage.setItem("url", url);


		// fix party stuff for no SIP
	// ANNOUNCEMENTS
function init(modVersion) {
	if(modVersion!="2.0"){ toastr["error"]('Mod v' + modVersion + ' can be Updated to v2.0, visit <a target="_blank" href="https://github.com/jimboy3100/legend.github.io/raw/master/legendmod.user.js">www.legendmod.ml</a>');}
	//else{toastr["info"]('Hello ' + tag1 +'! </br>Legend Mod v' + modVersion + ' website: <a target="_blank" href="http://www.legendmod.ml/">LINK</a>');
	else{toastr["info"]('Welcome back ' + tag1 + '!');
	toastr["info"]('1. Rejoin with token for communication to activate on FFA/EXP. 2. If bug occurs, chrome://settings/clearBrowserData delete cookies');}
}
//   	$('#gamemode').on('change', function () {
//      if (this.value == ":party") { $("#create-party-btn-2").click(); }
//		console.log( "Party stuff fixed" );})
