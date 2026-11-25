/* texts from the language packs (developers/i18n/src), escaped for the HTML below */
function _lmFT(key) {
    var s = window.lmT ? window.lmT(key) : key;
    return '<span data-i18n="' + key + '">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
}

$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
/* i18n-ok: the flagged piece is the style attribute (legbgpic, legbgcolor), not text */
$("#menu-footer").after('<div id="legendformIframe" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 560px; width: 840px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="legendformIframe2" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><div id="legendformIframe3"><iframe id="legendformIframe4" src="https://docs.google.com/forms/d/e/1FAIpQLScD1lE8fLIzp_7UOLTI_0Le-DgEpmTJ9nf1XE8239iowN8CIQ/viewform?embedded=true" width="820" height="490" >'+
    '<p>' + _lmFT('misc.noIframes') + '</p>'+
	'</iframe>'	+
											'</div></div>'+
											    '<button id= "Backtomenu" onclick="closecustomskinsIframe(); return false" style="margin-left: 10px;" class="btn btn-danger"  data-original-title="" title="">' + _lmFT('misc.close') + '</button>'+
												'<button id= "SendAFileform" onclick="SendAFileform(); return false" style="margin-left: 10px;" class="btn btn-success"  data-original-title="" title="">' + _lmFT('pack.sendCodeToDevelopers') + '</button></div>');


									
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
