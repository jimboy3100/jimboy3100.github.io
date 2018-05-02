// ==UserScript==
// @name         Legend Mod⇒AgarTool
// @name:ja      Legend Mod⇒AgarTool
// @name:en      Legend Mod⇒AgarTool
// @version      0.12
// @namespace    Legend Mod⇒AgarTool
// @description  Link Legend Mod to Agar tool
// @description:ja   Legend Mod 上から Agar Tool へ情報連携します
// @description:en   Link to Legend Mod on Agar Tool
// @author       tannichi & Jimboy3100
// @match        http://agar.io/*
// @grant        none
// @run-at document-end
// @grant none
// ==/UserScript==

//This  Script is the opposite of the script AgarTool⇒Legend Mod.
//It is already installed on LM Main version.
//It can be installed for LM Express, Kitty mod, Ogario v3&v4,
//so people can communicate with Agar Tool mod users.

//v0.12

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
  var tamp = setInterval(function() {
      if (document.getElementsByClassName('circle bordered skinWrapper').length > 0) {
          clearInterval(tamp);
          var elem = document.body;
          var script = document.createElement('script');
          script.src = 'https://jimboy3100.github.io/ExampleScripts/LMtoAgartool.js';
          document.head.appendChild(script);
          elem.appendChild(script);
      }
  }, 100);
