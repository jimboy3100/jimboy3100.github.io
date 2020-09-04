$('#helloContainer').after('<div class="modal fade in" id="replayModal" aria-hidden="false" style="display: block;">' +
    '<div class="modal-backdrop fade in"></div>' +
    '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' +
    '<div class="modal-content">' +
    '<div id="CloseReplay2" class="modal-header"><button id="CloseReplay" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">' + Premadeletter113 + '</span></button> <button id="FAQReplay type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
    '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif">' + 'Game Replay' + '</h4>' +
    '</div>' +
    '<div class="modal-body">' +
    '<select id="savedArenas" class="form-control" required="" style="margin-bottom: 30px"></select><color="red" style="display:inline">' +
    '<input type="text" class="form-control" id="arenaReplaySpecifications" value = "Predicted values" placeholder="*Search any GameConfiguration.json destination" style="width: 95%; display: inline-block">' +
    '<br>' +
    '<br>' +
    '<color="red" style="display:inline"> Speed: </color><input id="arenaReplaySpeed" value="15" type="number" min="1" max="100" step="1" class="form-control" required="" style="display:inline; width: 20%; margin-top: -30px;">' +	
	'<color="red"> PPS: </color><div id="arenaReplayPPS"  style="display:inline;width: 20%;"></div>' +
    '<button id="watchReplaybtn" style="display:inline; margin-left: 80px;" type="button" data-dismiss="modal">Watch Replay</button>' +	
    '<br>' +
	'<br>' +
`<table>

    <tr>
        <td>Save As:</td>
        <td><input id="inputFileNameToSaveAs"></input></td>
        <td><button onclick="saveTextAsFile()">Save</button></td>
    </tr>
    <tr>
        <td>Load:</td>
        <td><input type="file" id="fileToLoad"></td>
        <td><button onclick="loadFileAsText()">Load</button><td>
    </tr>
</table>`+	
	'</div>' +
    '</div>' +
    '</div>' +
    '</div>');



$("#CloseReplay").click(function() {

    $("#replayModal").remove();
});
$("#FAQReplay").click(function() {
    window.open('https://legendmod.ml/', '_blank');
});
$("#arenaReplaySpeed").val(window.replayTiming)
$("#arenaReplayPPS").text((1000/window.replayTiming).toFixed(2))
PopulateArenas();
fillArenasSpecifications()
$("#savedArenas").change(function() {
    fillArenasSpecifications()
});
$("#arenaReplaySpeed").change(function() {
    window.replayTiming = $("#arenaReplaySpeed").val()
	$("#arenaReplayPPS").text((1000/window.replayTiming).toFixed(2))
});
/*
$(document).on('click', '#watchReplaybtn', function() { 
    $("#server-token").val("replay^" + $("#savedArenas").val())
    $("#server-join").click()
});
*/
$("#watchReplaybtn").click(function() {
    $("#server-token").val("replay^" + $("#savedArenas").val())
    $("#server-join").click()
});

function PopulateArenas() {
    var select = document.getElementById("savedArenas");
    if (window.RecordedProtocolArenas && window.RecordedProtocolArenas.length) {
        for (var i = 0; i < window.RecordedProtocolArenas.length; i++) {
            select.options[select.options.length] = new Option(window.RecordedProtocolArenas[i]);
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
		var dateThen2 = dateThen.getDate() + "/" + monthErrorFix + "/" + dateThen.getFullYear() + " " + dateThen.getHours() + ":" + dateThen.getMinutes() + ":" + dateThen.getSeconds() + tempRegion + tempGameMode
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
var tempo = JSON.stringify(savedBuffedReplayProtocol);
	
    var textToSave = tempo;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
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
 
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
	console.log(fileToLoad.name)
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
for (var i=0; i<tempo2.length;i++){
	window.RecordedProtocol[fileToLoad.name][i]=[]
	//window.RecordedProtocol['saved'][i] = new DataView(tempo2[i])
	//window.RecordedProtocol['saved'][i]=str2ab(tempo2[i])
	window.RecordedProtocol[fileToLoad.name][i]=new DataView(str2ab(tempo2[i]));
	
}		
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



