setTimeout(function (){ 
var legbgpic = $("#menuBg").val();
var datasent2;

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];

//fzogar Upload / Download Settings
$("#import-settings-btn").attr('class', 'btn btn-success');
$("#close-exp-imp").before('<button id="fzogarOgarBtn" onclick="fzogarOgarIframe(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">Upload / Download</button>');


var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
eventer(messageEvent, function (e) {
	   if (~e.data.indexOf("PostedOgarSettings1")){ 
		datasent2=e.data;
		datasent2=datasent2.replace("PostedOgarSettings1?datasent=", "");
		fzogarOgarSettings(datasent2);   
	   }
		return datasent2;
}, false);
}, 5000);

function fzogarOgarSettings(datasent2){
        setTimeout(function() {
            $("#import-settings-btn").attr('class', 'btn btn-success');
            document.getElementById("import-settings").value = datasent2;
            window.history.pushState(null, null, window.location.pathname);
            $('#import-settings-btn').click();
        }, 100);
}		
function fzogarOgarIframe() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/AjaxData/fzogarOgarIframe.js";
    $("body").append(s);
}
