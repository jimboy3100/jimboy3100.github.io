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
    '<color="red" style="display:inline"> Speed: </color><input id="arenaReplaySpeed" value="40" type="number" min="1" max="100" step="1" class="form-control" required="" style="display:inline; width: 25%; margin-top: -30px;">' +
    '<button id="watchReplaybtn" style="margin-left: 180px;" type="button" data-dismiss="modal"><span aria-hidden="true">Watch Replay</span>' +
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
PopulateArenas();
fillArenasSpecifications()


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
        var dateThen = new Date(window.RecordedArenasSpecifications[$("#savedArenas").val()][0])
    var monthErrorFix = dateThen.getMonth() + 1
    var tempRegion = " Region:" + window.RecordedArenasSpecifications[$("#savedArenas").val()][2]
    var tempGameMode = " Mode" + window.RecordedArenasSpecifications[$("#savedArenas").val()][1]
    var dateThen2 = dateThen.getDate() + "/" + monthErrorFix + "/" + dateThen.getFullYear() + " " + dateThen.getHours() + ":" + dateThen.getMinutes() + ":" + dateThen.getSeconds() + tempRegion + tempGameMode
    $("#arenaReplaySpecifications").val(dateThen2)
    $("#arenaReplaySpecifications").blur();

}
$("#savedArenas").change(function() {
    fillArenasSpecifications()
});
$("#arenaReplaySpeed").change(function() {
    window.replayTiming = $("#arenaReplaySpeed").val()
});
$("#watchReplaybtn").click(function() {
    $("#server-token").val("replay^" + $("#savedArenas").val())
    $("#server-join").click()
});
