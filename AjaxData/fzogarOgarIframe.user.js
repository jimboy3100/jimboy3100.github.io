// ==UserScript==
// @name         Fzogar Upload / Download OGARio Settings
// @namespace    Upload your settings from agario to webpage or apply them on mod easily
// @version      1
// @description  Upload your JSON file settings from agario to webpage or apply them on mod easily
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
// @match        http://ext.fzogar.xyz/ogs/*
// @downloadURL  jimboy3100.github.io/legendmod.user.js
// @updateURL    jimboy3100.github.io/legendmod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      jimboy3100.github.io
// ==/UserScript==


// Website: http://ext.fzogar.xyz/ogs/
// Legend Mod by Jimboy3100 for Fayiz
// Part of the Legend Mod Project Agario http://www.legendmod.ml

/*MIT License
Copyright (c) [The Legend Mod]
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

//runs only for http://ext.fzogar.xyz/ogs settings
if (location.href == "http://ext.fzogar.xyz/ogs/") {
    setTimeout(function() {
    $("#login_form").append('<span style="float: left; font-size: 13px;">Powered by <a target="_blank" href="http://ext.fzogar.xyz/ogs/" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend mod Website" data-placement="left"><u>http://ext.fzogar.xyz/ogs/</u></a></span>');
    $("#upload-button").after('<input type="submit" id="sendInfo" class="btn btn-default " value="Apply Settings to Mod" style="margin-left: 7px;">');
//    $("#sendInfo").after('<input type="submit" id="sendInfo2" class="btn btn-default " value="Upload from Legend Mod" style="margin-left: 7px;">');
    $("#sendInfo").click(function() {
        showpaste();
//        alert($("#jsonupdate").val());
        try{window.parent.postMessage("PostedOgarSettings1?datasent="+$("#jsonupdate").val(), "*");
        } catch (e) {}
    });

        }, 1100);
}
//runs for Agario settings
if (location.host == "agar.io") {
var messageone;
if ($("#clantag").val()!=undefined){ //If Using Ogario, Kitty Mod
if (messageone!="0"||messageone!="1"){	//If Using Legend Mod
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/AjaxData/fzogarOgarIframeSniff.js";
    $("body").append(s);
}
}
}
