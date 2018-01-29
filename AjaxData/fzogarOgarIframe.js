$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
$("#menu-footer").after('<div id="legendformIframe" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 700px; width: 640px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="legendformIframe2" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><div id="legendformIframe3"><iframe id="legendformIframe4" src="http://ext.fzogar.xyz/ogs/" width="620" height="630" >'+
    '<p>Your browser does not support iframes.</p>'+
	'</iframe>'	+
											'</div></div>'+
											    '<button id= "Backtomenu" onclick="closecustomskinsIframe(); return false" style="margin-left: 10px;" class="btn btn-danger"  data-original-title="" title="">CLOSE</button></div>'+
												'<button id= "CopyExportedFromAgario" onclick="CopyExportedFromAgario(); return false" style="margin-left: 10px;" class="btn btn-success"  data-original-title="" title="">COPY FROM AGARIO</button></div>');


									
function closecustomskinsIframe(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#legendformIframe").remove();
}
function closecustomskinsIframe(){
	copy($("#export-settings").val(););
	toastr["info"]("Click Update, Paste the Code and click Update", "", { timeOut: 4000, extendedTimeOut: 2000 }).css("width", "200px");
}	
