$("#main-menu").hide();
$("#skins-panel").hide();
$("#quick-menu").hide();
$("#exp-bar").hide();
$("#close-exp-imp").click();
$("#menu-footer").after('<div id="legendformIframe" style="background-image: url('+legbgpic+'); background-color: '+legbgcolor+'; border: 1px solid black; position:absolute;  height: 600px; width: 640px; margin-top: 0px;margin-left: -240px; ">'+
	'<div id="legendformIframe2" style="display:block; margin-left: 10px; margin-right: 10px;">'+ //margin-left: 10px"
	'<br><div id="legendformIframe3"><iframe id="legendformIframe4" src="http://ext.fzogar.xyz/ogs/" width="620" height="530" >'+
    '<p>Your browser does not support iframes.</p>'+
	'</iframe>'	+
											'</div></div>'+
											    '<button id= "Backtomenu" onclick="closefzogarIframe(); return false" style="margin-left: 10px;" class="btn btn-danger"  data-original-title="" title="">CLOSE</button>'+
												'<button id= "CopyExportedFromAgario" onclick="CopyExportedFromAgario(); return false" style="margin-left: 10px;" class="btn btn-success"  data-original-title="" title="">COPY FROM AGARIO</button></div>');


									
function closefzogarIframe(){
$("#main-menu").show();	
$("#skins-panel").show();
$("#quick-menu").show();
$("#exp-bar").show();
$("#legendformIframe").remove();
}
function CopyExportedFromAgario(){
	copy($("#export-settings").val());
	toastr["info"]("JSON Code Copied. Click Paste Button, replace the Code and click Save Settings Button", "", { timeOut: 8000, extendedTimeOut: 8000 }).css("width", "350px");
}	
