// ==UserScript==
// @name         Agario Voice Chat Rooms
// @namespace    Agar.io Voice, Camera, Text Chat Rooms per server (ip/token), per password/clanTag
// @version      1.0
// @description  Agar.io Chat Rooms (Voice, Camera, Text, Share Screen) for Vanilla and mods kitty, ogario, ally, agar infinity, agar tool (Legend mod has it already) 
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
// @match        https://talky.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==
// Agario Voice Chat Rooms by Jimboy3100
//Opens Voice, Camera, Text Chat Rooms per server (ip/token), per password/clanTag for ingame communication

/*MIT License

Copyright (c) [2017] [The Legend Mod]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// Start of script


if (location.host == "agar.io") {
setTimeout(function (){ 
var IP;
var IP2;
var SIP;
var stateObj = { foo: "bar" };
var messageone;
var currentIP;
if (messageone!="0"||messageone!="1"){  //IF NOT using Legend Mod
if (currentIP==null){ //IF NOT using kitty mod
$('head').append('<link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');

	
    var a = WebSocket.prototype.send;
    window.__WS_send = WebSocket.prototype.send, WebSocket.prototype.send = function(b) {
        IP=this.url;
        try {
            var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
                d = c.exec(this.url);
            SIP="http://agar.io/?sip=" + d[1].replace(/-/g, '.') + d[2];
			IP2=d[1].replace(/-/g, '.') + d[2];
        } catch (e) {}
        try {
            a.apply(this, [b]), WebSocket.prototype.send = a
        } catch (e) {
            window.__WS_send.apply(this, [b]), WebSocket.prototype.send = window.__WS_send
        }
    }
$(".btn.btn-warning.btn-spectate.btn-needs-server").after('<button id="VoiceBtn" class="btn btn-warning btn-spectate btn-needs-server" data-itr="Open chat room"><i class="fa fa-microphone"></i>Voice Chat</button>');


			$("#VoiceBtn").click(function () {
			
				if ($('#gamemode').val()==":party"){ //Party 
					if ($("#clantag").val()==undefined) { semiurl2=MC.getPartyToken()  + "?name=" + $("#nick").val() +"&?ip=" + MC.getPartyToken(); }  //If Using Ogario
				else { semiurl2=MC.getPartyToken() + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + MC.getPartyToken(); } //If NOT using Ogario (Vanilla, Agar Tools, Agar Infinity, Ally)
					}
					else{ //Not Party
					var currentIP2=IP2.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(":",""); 
				if ($("#clantag").val()==undefined) { semiurl2=currentIP2 + "?name=" + $("#nick").val() +"&?ip=" + IP2; } //If Using Ogario
				else { semiurl2=currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + IP2; } //If NOT using Ogario (Vanilla, Agar Tools, Agar Infinity, Ally)		 		
				}
				

			
			url2="https://talky.io/"+semiurl2;
			
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 3000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 5000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 8000);
			var win = window.open(url2, '_blank');	
					
		});	
	
	
}



if (currentIP!=null){ //IF Using kitty mod
	
	
    $("#minimap-hud").prepend('<div id="shortcuts-hud2" class="hud" style="width: 20%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: block;">'+
	'<button id="VoiceBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" data-toggle="tooltip" data-original-title="Voice & Camera Chat"><i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i></button>');
	
			$("#VoiceBtn").click(function () {
			
				if ($('#gamemode').val()==":party"){
				semiurl2=MC.getPartyToken() + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + MC.getPartyToken();
					}
					else{
					var currentIP2=currentIP.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(":","");
				semiurl2=currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + currentIP;	
				}
				

			
			url2="https://talky.io/"+semiurl2;
			
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 3000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 5000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 8000);
			var win = window.open(url2, '_blank');	
					
		});
	}	
}
}, 5000);
}
	
// Inject Chat Talky.io Userscript
if (location.host == "talky.io") {
	
	(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://jimboy3100.github.io/banners/icon32croped.ico.gif';
    document.getElementsByTagName('head')[0].appendChild(link);
	})();

	document.title="Legend Mod - Talky";
	
    var url2 = window.location.href;
    var gamename = getParameterByName("name", url2);
    var IPAgario = getParameterByName("ip", url2);

    setTimeout(function() {
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
    }, 4100);

    setTimeout(function() {
        document.getElementById('skip').click();
        document.getElementsByClassName('TalkyButton__text')[0].click();

    }, 3500);
    setTimeout(function() {
        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;
        //<a href="http://legendmod.ml" target="_blank" id="LegendModWebsite" class="title" style=""><u>Legend Mod</u></a> <a href=IPAgario target="_blank" id="IPAgario" class="title" style=""><u>Copy Agar.io Token</u></a> 
        
		if (IPAgario.length==6){
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/#" + IPAgario + " . [PARTY] (Password rooms are different than Public)");}
		else{
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/?sip=" + IPAgario + " . (Password rooms are different than Public)");}	
		
        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;
        document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';
        document.getElementsByClassName('Box _3-HLfCQ5QT5fuKgw4tvBkP')[0].remove();
        document.getElementsByClassName('-ZMXacQm9s80kTx3I-A47')[0].remove();

    }, 4000);


//example: https://talky.io/dddd?name=&?ip=

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
}
//End of Script
