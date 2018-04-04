$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
$("#menu-footer").after('<div id="legendhelper" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 560px; width: 940px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="Userscriptshud2" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><div id="Userscriptshud3"><iframe id="customskinsIframe2" src="https://jimboy3100.github.io/extras/LcHistory/LcHistory.html" width="920" height="490" >'+
    '<p>Your browser does not support iframes.</p>'+
	'</iframe>'	+
											'</div></div>'+
											    '<button id= "Backtomenu" onclick="closecustomskinsIframe(); return false" style="margin-left: 10px;" class="btn btn-danger"  data-original-title="" title="">'+Premadeletter113+'</button>');


									
function closecustomskinsIframe(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#legendhelper").remove();
}
