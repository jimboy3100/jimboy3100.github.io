// ==UserScript==
// @name         Ultimouse Control Script
// @namespace    Ultimouse Control Script
// @version      1.0
// @description  Script for controlling the mouse, for Agario
// @author       Jimboy3100
// @match        http://agar.io/*
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// ==/UserScript==

var i = "https://jimboy3100.github.io/auc/";
function tg(tag, atr) {var d = document, x = d.createElement(tag); for (var a in atr) {x[a] = atr[a];}; (d.head || d.documentElement).appendChild(x);}

tg("link", {rel:"stylesheet", type:"text/css", href:i+"auc.css"});
tg("script", {type:"text/javascript", src:i+"auc.js"});
