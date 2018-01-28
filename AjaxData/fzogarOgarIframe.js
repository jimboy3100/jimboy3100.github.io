$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
$("#menu-footer").after('<div id="legendformIframe" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 560px; width: 840px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="legendformIframe2" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><div id="legendformIframe3"><iframe id="legendformIframe4" src="http://ext.fzogar.xyz/ogs/" width="820" height="640" >'+
    '<p>Your browser does not support iframes.</p>'+
	'</iframe>'	+
											'</div></div>'+
											    '<button id= "Backtomenu" onclick="closecustomskinsIframe(); return false" style="margin-left: 10px;" class="btn btn-danger"  data-original-title="" title="">CLOSE</button>'+
												'<button id= "SendAFileform" onclick="SendAFileform(); return false" style="margin-left: 10px;" class="btn btn-success"  data-original-title="" title="">SEND CODE TO DEVELOPERS</button></div>');


									
function closecustomskinsIframe(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#legendformIframe").remove();
}
function SendAFileform(){

window.open('https://docs.google.com/forms/d/e/1FAIpQLSckM3CTsmly0Ugw_kLQuiXS5AoSzwTfc5sj1czmo4bbzrDdBA/viewform');
}
