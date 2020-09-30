//v0.1t
$('#helloContainer').after('<div class="modal fade in" id="replayModal" aria-hidden="false" style="display: block;">' +
    '<div class="modal-backdrop fade in"></div>' +
    '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' +
    '<div class="modal-content">' +
    '<div id="CloseReplay2" class="modal-header"><button id="CloseReplay" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQReplay type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
    '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Replay' + '</h4>' +
    '</div>' +
    '<div class="modal-body">' +
    '<select id="savedArenas" class="form-control" required="" style="display:inline; margin-bottom: 10px; width: 70%"></select>' +	
	'<button id="watchReplaybtn" style="display:inline; margin-left: 12px;" type="button" data-dismiss="modal">Watch</button>' +
	'<button onclick="saveTextAsFile()" "display:inline;">Save</button>' +
    '<input type="text" class="form-control" id="arenaReplaySpecifications" placeholder="Predicted values" style="width: 95%; display: inline-block" disabled>' +
    '<br>' +
    '<br>' +
    '<color="red" style="display:inline"> Speed:</color><input id="arenaReplaySpeed" value="20" type="number" min="1" max="100" step="1" class="form-control" required="" style="display:inline; width: 15%; margin-top: -30px;">' +	
	//'<color="red" style="display:inline;"> PPS:</color><div id="arenaReplayPPS" style="display:inline;width: 10%;"></div><input type="file" id="fileToLoad" style="display:inline;" onchange="loadFileAsText()">' +
    '<color="red" style="display:inline;"> <input type="file" id="fileToLoad" style="display:inline;" onchange="loadFileAsText()">' +	
    '<br>' +
	'<br>' +
	'Start:<input type="number" class="form-control" id="startReplayTime" placeholder="" style="width: 19%; display: inline-block">' +
	' End:<input type="number" class="form-control" id="endReplayTime" placeholder="" style="width: 19%; display: inline-block">' +
	' Current:<input type="text" class="form-control" id="totalReplayPackets" placeholder="" style="width: 19%; display: inline-block" disabled>' +
	'<button id="stopReplaybtn" style="display:inline; margin-left: 12px;" type="button" data-dismiss="modal">Stop</button>' +
	'<br>' +
	'<br>' +
	'Greyscale: <input type="checkbox" id="greyScale">' +
	' Sepia: <input type="checkbox" id="sepia">' +
	' Hue-rotate: <input type="checkbox" id="hueRotate">' +
	
	'<br>' +	
	'</div>' +
    '</div>' +
    '</div>' +
    '</div>');
$("#replayModal").draggable()	
$("#stopReplaybtn").prop('disabled', true);
if (window.replayGreyScale){
	$("#greyScale").click()
}
else if (window.replaySepia){
	$("#sepia").click()
}
else if (window.replayHueRotate){
	$("#hueRotate").click()
}

$("#greyScale").change(function() {
	if (document.getElementById("greyScale").checked){
		document.getElementById("sepia").checked = false
		document.getElementById("hueRotate").checked =false
	}
});
$("#sepia").change(function() {
	if (document.getElementById("sepia").checked){
		document.getElementById("greyScale").checked = false
		document.getElementById("hueRotate").checked =false
	}
});
$("#hueRotate").change(function() {
	if (document.getElementById("hueRotate").checked){
		document.getElementById("greyScale").checked = false
		document.getElementById("sepia").checked =false
	}
});
$("#CloseReplay").click(function() {

    $("#replayModal").remove();
});
$("#FAQReplay").click(function() {
    window.open('https://legendmod.ml/', '_blank');
});






if (localStorage.getItem("replayTiming") && localStorage.getItem("replayTiming")!=""){
	window.replayTiming = localStorage.getItem("replayTiming")
}
$("#arenaReplaySpeed").val(window.replayTiming)
//$("#arenaReplayPPS").text((1000/window.replayTiming).toFixed(0))
PopulateArenas();
fillArenasSpecifications()
revealReplayTotal()

$("#savedArenas").change(function() {
    fillArenasSpecifications()
	revealReplayTotal()
	
});
$("#arenaReplaySpeed").change(function() {
    window.replayTiming = $("#arenaReplaySpeed").val()
	localStorage.setItem("replayTiming", window.replayTiming);
	//$("#arenaReplayPPS").text((1000/window.replayTiming).toFixed(0))
});





/*
$(document).on('click', '#watchReplaybtn', function() { 
    $("#server-token").val("replay^" + $("#savedArenas").val())
    $("#server-join").click()
});
*/
$("#watchReplaybtn").click(function() {
	window.replayGreyScale = document.getElementById("greyScale").checked
	window.replaySepia = document.getElementById("sepia").checked
	window.replayHueRotate = document.getElementById("hueRotate").checked
    $("#server-token").val("replay^" + $("#savedArenas").val())
    $("#server-join").click()
});
$("#stopReplaybtn").click(function() {
	clearTimeout(window.replayTimeOuts)
	$('#pause-hud').text(textLanguage.pause);
	$('#pause-hud').hide()
	$("#stopReplaybtn").prop('disabled', true);
});
function revealReplayTotal(){		
	if ($("#savedArenas").val()!=null && $("#savedArenas").val()!="" && window.RecordedProtocol[$("#savedArenas").val()]){
		window.RecordedProtocolPackets=window.RecordedProtocol[$("#savedArenas").val()].length-2
		$("#totalReplayPackets").val("0/" +window.RecordedProtocolPackets)
		$("#startReplayTime").val(0)
		$("#endReplayTime").val(window.RecordedProtocol[$("#savedArenas").val()].length-2)
	}
}
function PopulateArenas() {
    var select = document.getElementById("savedArenas");
    if (window.RecordedProtocolArenas && window.RecordedProtocolArenas.length) {
        for (var i = 0; i < window.RecordedProtocolArenas.length; i++) {
			if (window.RecordedProtocol[window.RecordedProtocolArenas[i]] && window.RecordedProtocol[window.RecordedProtocolArenas[i]].length>10){
				select.options[select.options.length] = new Option(window.RecordedProtocolArenas[i]);
			}
        }
    }
}

function fillArenasSpecifications() {

    if (window.RecordedArenasSpecifications && window.RecordedArenasSpecifications[$("#savedArenas").val()] && window.RecordedArenasSpecifications[$("#savedArenas").val()].length)
		try{
        var dateThen = new Date(window.RecordedArenasSpecifications[$("#savedArenas").val()][0])
		var monthErrorFix = dateThen.getMonth() + 1
		var tempRegion = " Region:" + window.RecordedArenasSpecifications[$("#savedArenas").val()][2]
		var tempGameMode = " Mode" + window.RecordedArenasSpecifications[$("#savedArenas").val()][1]
		var tempGameNick = " Nick:" + window.RecordedArenasSpecifications[$("#savedArenas").val()][3]
		var dateThen2 = dateThen.getDate() + "/" + monthErrorFix + "/" + dateThen.getFullYear() + " " + dateThen.getHours() + ":" + dateThen.getMinutes() + ":" + dateThen.getSeconds() + tempRegion + tempGameMode + tempGameNick
		$("#arenaReplaySpecifications").val(dateThen2)
		$("#arenaReplaySpecifications").blur();
		} catch (e) {}
}
function saveTextAsFile()
{
	
//for saving

savedBuffedReplayProtocol=[]
for (var i=0; i<window.RecordedProtocol[$('#savedArenas').val()].length;i++){
	savedBuffedReplayProtocol[i] = ab2str(window.RecordedProtocol[$('#savedArenas').val()][i].buffer)
}
try{
savedBuffedReplayProtocol[savedBuffedReplayProtocol.length]=window.RecordedArenasSpecifications[$("#savedArenas").val()]
}
catch{}
var tempo = JSON.stringify(savedBuffedReplayProtocol);
	
    var textToSave = tempo;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	var savedfileName = $("#savedArenas").val().replace(".lm", "");
    var fileNameToSaveAs = savedfileName+".lm";
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
 
function loadFileAsText(file)
{
	if (!file){
		var fileToLoad = document.getElementById("fileToLoad").files[0];
	}
	else if(file){
		var fileToLoad = file
	}
	//console.log(fileToLoad.name)
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        var tempo = textFromFileLoaded;
//for loading
var tempo2 = JSON.parse(tempo);
window.RecordedProtocol[fileToLoad.name]=[]
window.RecordedProtocolArenas.push(fileToLoad.name)

var x = document.getElementById("savedArenas");
var option = document.createElement("option");
option.text = fileToLoad.name;
x.add(option);
x.options[x.length-1].selected = true;

for (var i=0; i<tempo2.length-1;i++){
	window.RecordedProtocol[fileToLoad.name][i]=[]
	//window.RecordedProtocol['saved'][i] = new DataView(tempo2[i])
	//window.RecordedProtocol['saved'][i]=str2ab(tempo2[i])
	window.RecordedProtocol[fileToLoad.name][i]=new DataView(str2ab(tempo2[i]));
	
}
var temp1=tempo2[tempo2.length-1][0]
var temp2=tempo2[tempo2.length-1][2]
var temp3=tempo2[tempo2.length-1][1]
var temp4=tempo2[tempo2.length-1][3]

		try{
        var dateThen = new Date(temp1)
		var monthErrorFix = dateThen.getMonth() + 1
		var tempRegion = " Region:" + temp2
		var tempGameMode = " Mode" + temp3
		var tempGameNick = " Nick:" + temp4
		var dateThen2 = dateThen.getDate() + "/" + monthErrorFix + "/" + dateThen.getFullYear() + " " + dateThen.getHours() + ":" + dateThen.getMinutes() + ":" + dateThen.getSeconds() + tempRegion + tempGameMode + tempGameNick
		window.RecordedArenasSpecifications[$("#savedArenas").val()]=tempo2[tempo2.length-1]
		$("#arenaReplaySpecifications").val(dateThen2)
		$("#arenaReplaySpecifications").blur();
		revealReplayTotal()
		} catch (e) {}
		
	
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
//ab2str(window.RecordedProtocol['1llnrvk'][0].buffer)

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  //var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  //var bufView = new DataView(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
return buf;
	//return bufView;
}
function loadReplayFromWeb(temp2){
	$.ajax(temp2, {
        error() {},
        success(sketchContents) {
			if (temp2.includes(".lm")){
				temp2 = temp2.split("/").pop();
				var replayWebLoaded = new Blob([sketchContents], {type:"text/plain"});
				replayWebLoaded.name = temp2 
				loadFileAsText(replayWebLoaded)
				setTimeout(function() {

					window.replayStart = parseInt(window.replayStart)
					window.replayEnd = parseInt(window.replayEnd)
					
					if (window.replayStart && window.replayStart <= window.RecordedProtocolPackets && window.replayStart >= 0){
						
						$("#startReplayTime").val(window.replayStart)
					}
					if (window.replayEnd && window.replayEnd <= window.RecordedProtocolPackets && window.replayEnd >= 0){
						$("#endReplayTime").val(window.replayEnd)
					}
					$("#watchReplaybtn").click()
					application.onSpectate()	
				}, 1000);				
			}
			else{
				toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + "Requested file is not .lm");
			}
        },
        method: "GET",
        cache: false,
        crossDomain: true
    });
}
