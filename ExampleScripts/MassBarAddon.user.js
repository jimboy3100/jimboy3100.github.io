// ==UserScript==
// @name         Legend mod - Mass Bar Addon
// @namespace    Legend mod - Mass Bar Addon
// @version      0.1
// @description  Legend mod - Mass Bar Addon
// @author       DAVI すべての最強!
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// ==/UserScript==

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
          clearInterval(tamp);
          var elem = document.body;
          var script = document.createElement('script');
          script.src = 'https://jimboy3100.github.io/ExampleScripts/legendmodAddonDAVI.js';
          document.head.appendChild(script);
          elem.appendChild(script);
  }, 100);


  
