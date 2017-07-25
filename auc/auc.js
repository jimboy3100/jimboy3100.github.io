
/*
Copyright (C) 2017 Jimboy3100

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var html = {
    d: document, b: function(){return html.d.getElementsByTagName("body")[0];}, h: function() {return html.d.getElementsByTagName("head")[0];},
    txt: {
        get: function(text) {return html.d.createTextNode(text);},
        add: function(e, text) {e.appendChild(this.get(text));},
        set: function(e, text) {html.tags.rem(e.childNodes); this.add(e, text);}
    },
    tag: {
        ns: ["svg", "use"],
        get: function (tag, atr, stl) {
            if (this.ns.indexOf(tag) < 0) {var e = html.d.createElement(tag);} else {var e = html.d.createElementNS("http://www.w3.org/2000/svg", tag);}
            html.atr.set(e, atr); html.stl.set(e, stl); return e;
        },
        add: function(e, tag, atr, stl) {e.appendChild(this.get(tag, atr, stl));},
        set: function(e, tag, atr, stl) {html.tags.rem(e.children); this.add(e, tag, atr, stl);},
        rem: function(e) {e.parentElement.removeChild(e);},
        test: {
            type: function(e) {return (typeof e === "object" ? String(e.constructor).indexOf("Element") > 0 : false);},
            root: function(e, root) {while (e) {if (e === root) {return true;}; e = e.parentElement;} return false;}
        }
    },
    tags: {
        get: function(tags) {for (var i in tags) {tags[i] = html.tag.get(tags[i].tag || tags[i][0], tags[i].atr || tags[i][1], tags[i].stl || tags[i][2]);}; return tags;},
        add: function(e, tags) {for (var i in tags) {tags[i] = html.tag.get(tags[i].tag || tags[i][0], tags[i].atr || tags[i][1], tags[i].stl || tags[i][2]); e.appendChild(tags[i]);} return tags;},
        set: function(e, tags) {html.tags.rem(e.children); return this.add(e, tags);},
        rem: function(elist) {for (var i = elist.length-1; i >= 0; i--) {html.tag.rem(elist[i]);}}
    },
    atr: {
        ns: ["xlink:href"],
        p: ["className", "innerText", "innerHTML", "outerHTML"],
        set: function(e, atr) {
            for (var a in atr) {
                if (this.p.indexOf(a) >= 0) {e[a] = atr[a];}
                else if (atr[a] === null) {e.removeAttribute(a);}
                else if (this.ns.indexOf(a) >= 0) {e.setAttributeNS("http://www.w3.org/1999/xlink", a, atr[a]);}
                else {e.setAttribute(a, atr[a]);}
            }
        },
        get: function(e, atr) {var r = {}; for (var a in atr) {var ea = e.getAttribute(atr[a] || a); if (ea) {r[a] = ea;}} return r;},
    },
    atrs: {
        set: function(elist, atr) {for (var i = 0; i < elist.length; i++) {html.atr.set(elist[i], atr);}},
    },
    stl: {
        set: function(e, stl) {for (var s in stl) {e.style[s] = stl[s];}},
        get: function(e, stl) {var r = {}; for (var s in stl) {var es =  e.style[stl[s] || s]; if (es) {r[s] = es;}} return r;}
    },
    cookie: {
        set: function(cname, cvalue, exdays) {
            var t = new Date();
            t.setTime(t.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ t.toUTCString();
            html.d.cookie = cname + "=" + cvalue + "; " + expires;
        },
        get: function(cname) {
            var name = cname + "=";
            var ca = html.d.cookie.split(";");
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") {c = c.substring(1);}
                if (c.indexOf(name) === 0) {return c.substring(name.length,c.length);}
            }
            return "";
        }
    },
};

//space = 32; w = 87
var auc = {
    state: function(st) {var c = auc.tab.e.wrap; if (st) {c.className = "auc-" + st;}; return c.className.replace("auc-", "");},
    control:{
        e: [],
        a: [],
        o: [
            {code:"Key32", name:"Space", act:true, count:1, rate:1, edit:0},
            {code:"Key87", name:"KeyW", act:false, count:1, rate:1, edit:0},
            {code:"Mouse1", name:"Mouse left", act:true, count:1, rate:1, edit:1},
            {code:"Mouse2", name:"Mouse middle", act:true, count:0, rate:10, edit:1},
            {code:"Mouse3", name:"Mouse right", act:false, count:0, rate:10, edit:1}
        ],
        t: {
            act:{false:"feed", true:"split"},
            name:{"Mouse1":"Mouse left", "Mouse2":"Mouse middle", "Mouse3":"Mouse right"}
        },
        draw: function(n) {
            var c = auc.control, o = c.o[n];
            c.e[n] = html.tags.get({
                "row":["tr", {"data-auc-row":n}], "act":[(o.edit ? "a" : "span"), {"id":"auc-act"}], "rem":[(o.edit ? "a" : "span"), {"id":"auc-rem"}],
                "count":["input", {"id":"auc-count", "type":"number", "value":o.count, "min":0, "max":100}, {"color":auc.tab.color(o.count, 1, 100)}],
                "rate":["input", {"id":"auc-rate", "type":"number", "value":o.rate, "min":1, "max":20}, {"color":auc.tab.color(o.rate, 1, 20)}],
            });
            var e = c.e[n]; html.txt.add(e.act, c.t.act[o.act]); if (o.edit) {html.txt.add(e.rem, "x");}
            [html.txt.get(o.name), e.act, e.count, e.rate, e.rem].forEach(function(i) {var d = html.tag.get("td"); d.appendChild(i); e.row.appendChild(d);});
            auc.tab.e.optb.appendChild(e.row);
        },
        press: function(k, n, s) {if (n > 0 || auc.control.a[n]) {$("body").trigger($.Event("keydown", {keyCode:k})); $("body").trigger($.Event("keyup", {keyCode:k}));} if (s) {auc.control.blink(n);}},
        blink: function(n) {
            var c = auc.control, s = c.e[n].row.style; s["transition"] = "none"; s["background-color"] = "lightgray"; setTimeout(function () {s["transition"] = (0.5 / c.o[n].rate) + "s"; s["background-color"] = null;}, 10);
        },
        bash: function(n, state) {
            var c = auc.control, o = c.o[n]; if (c.a[n]) {if (!state) {c.a[n].state = 0; if (o.count > 0) {return;}} else if (c.a[n].state) {return;} clearInterval(c.a[n].id); c.a[n] = null;} if (!state) {return;}
            var s = (auc.state() === "open"), k = (o.act?32:87), t = 1000 / o.rate; c.press(k, n, s); c.a[n] = {id:null, rem:o.count, state:1};
            if(o.count > 0) {c.a[n].id = setInterval(function() {if (c.a[n].rem <= 1) {clearInterval(c.a[n].id);} else {c.press(k, n, s); c.a[n].rem--;}}, t);} else {c.a[n].id = setInterval(function() {c.press(k, n, s);}, t);}
        },
        save: function() {html.cookie.set("auc", JSON.stringify(auc.control.o), 365);},
        load: function() {try {auc.control.o = JSON.parse(html.cookie.get("auc"));} catch(e) {};}
    },
    tab: {
        e: html.tags.get({
            "wrap":["div", {"id":"auc", "class":"auc-open"}], "div":["div", {"id":"auc-div"}], "ear":["div", {"id":"auc-ear"}], "box":["a", {"id":"auc-box"}], "ush":["a", {"id":"auc-ush", "href":"https://greasyfork.org/cs/scripts/22115-agar-io-ultimouse", "target":"_blank"}],
            "opt":["table", {"id":"auc-opt", "cellspacing":0, "cellpadding":0}], "opth":["thead"], "optb":["tbody"], "add":["a", {"id":"auc-add"}],
        }),
        color: function(v, min, max) {
            var i = min || 0, x = ((max || 100) - i) / 2, n = 255 / x, v = Number(v) - i;
            return "rgb("+ Math.min(255, Math.round(n * v)) +","+ Math.max(0, Math.round(255 - n * (v - x))) +",0)";
        },
    },
    ini: function () {
        var t = auc.tab.e, c = auc.control;
        html.txt.add(t.ush, "Ultimouse control"); html.txt.add(t.add, "+"); html.txt.add(t.box, "x"); t.ear.appendChild(t.box);
        //Options
        c.load(); for (var i in c.o) {auc.control.draw(i);}
        ["Control", "Action", "Count", "Rate"].forEach(function(i) {var d = html.tag.get("th"); html.txt.set(d, i); t.opth.appendChild(d);});
        [t.opth, t.optb].forEach(function(i) {t.opt.appendChild(i);});
        [t.ush, t.opt, t.add].forEach(function(i) {t.div.appendChild(i);});
        [t.div, t.ear].forEach(function(i) {t.wrap.appendChild(i);});
        ["mousedown", "mouseup", "keydown", "keyup", "contextmenu"].forEach(function(i) {html.d.addEventListener(i, auc.call);});
        ["input", "change"].forEach(function(i) {t.div.addEventListener(i, auc.call);});
        html.b().appendChild(t.wrap);
    },
    call: function(ev) {
        if (!ev) {return;}
        var e = ev.target, t = ev.type, k = ev.which || ev.keyCode, c = auc.control, s = auc.state(), i = 0,
        r = (t.indexOf("up") < 0), d = (t.indexOf("key") >= 0 ? "Key" : (t.indexOf("mouse") >= 0 ? "Mouse" : null)), q = function() {ev.preventDefault();};
        if ((e.tagName === "BODY" || e.id === "canvas" || s === "add") && d) {
            var n = 0; while (n < c.o.length) {if (c.o[n].code === d+k) {c.bash(n, r); q(); break;} n++;}
            if (r && s === "add") {
                if (n === c.o.length) {c.o[n] = {code:d+k, name:c.t.name[d+k] || ev.code || d+" "+k, act:false, count:1, rate:10, edit:1}; c.draw(n);};
                auc.state("open"); c.save();
            }
        }
        else if (t === "contextmenu") {q();}
        else if (r) {
            var id = e.id.replace("auc-", ""), p = e.parentElement, n = (p.tagName === "TD" ? p.parentElement.getAttribute("data-auc-row") : null);
            if (id === "box") {auc.state(s === "open" ? "close" : "open"); html.d.activeElement.blur();}
            else if (id === "add") {auc.state("add");}
            else if (id === "count" || id === "rate") {
                var max = e.getAttribute("max"), min = e.getAttribute("min");
                if (t === "change" || k === 13) {
                    c.o[n][id] = Math.min(max, Math.max(min, Math.round(Number(e.value)))); e.value = c.o[n][id];
                    c.save(); e.blur();
                }
                e.style.color = auc.tab.color(e.value, 1, max);
            }
            else if (n > 1) {
                if (id === "act") {c.o[n][id] = !c.o[n][id]; html.txt.set(e, c.t[id][c.o[n][id]]); c.save();}
                else if (id === "rem") {
                    html.tag.rem(c.e[n].row); c.o.splice(n, 1); c.e.splice(n, 1); c.a.splice(n, 1);
                    for (n; n < c.e.length; n++) {c.e[n].row.setAttribute("data-auc-row", n);}
                    c.save();
                }
            }
        }
    },
};

auc.ini();
