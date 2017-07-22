$("#menu-footer").after('<div id="customskinsIframe" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 550px; width: 840px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="Userscriptshud" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><iframe id="customskinsIframe2" src="https://jimboy3100.github.io/skins/skins.html" width="820" height="490" >'+
    '<p>Your browser does not support iframes.</p>'+
	'</iframe>'	+
											'</div>'+
											'<button id="Backtomenu" onclick="closecustomskinsIframe(); return false" class="btn btn-danger" style="margin-left: 10px;" data-itr="page_login_and_play" data-original-title="" title="">CLOSE</button></div>'); 
											$("#main-menu").hide();$("#skins-panel").hide();$("#quick-menu").hide();$("#exp-bar").hide();$("#customskinsIframe").show();	
											
										
function closecustomskinsIframe(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#customskinsIframe").hide();
}


