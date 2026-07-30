// ==UserScript==
// @name         Agar.io Skin Sniffer + Uploader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Sniff skin upload protocol bytes + inject custom skin images. Non-invasive: only patches WebSocket.prototype.send.
// @author       jimboy3100
// @match        *://*.agar.io/*
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ─── State ───
    var bufferCount = 0;
    var logEntries = [];
    var savedImage = null;
    var savedFooter = null;

    // ─── PNG helpers ───
    function findPNG(buf) {
        for (var i = 0; i < buf.length - 8; i++) {
            if (buf[i] === 137 && buf[i+1] === 80 && buf[i+2] === 78 && buf[i+3] === 71) return i;
        }
        return -1;
    }

    function findIEND(buf) {
        for (var i = 0; i < buf.length - 8; i++) {
            if (buf[i] === 73 && buf[i+1] === 69 && buf[i+2] === 78 && buf[i+3] === 68) return i + 8;
        }
        return -1;
    }

    function bytesPreview(buf, max) {
        max = max || 40;
        var parts = [];
        for (var i = 0; i < Math.min(buf.length, max); i++) parts.push(buf[i]);
        var s = parts.join(', ');
        if (buf.length > max) s += ' ... (' + buf.length + ' total)';
        return s;
    }

    // ─── PART 1: WebSocket.prototype.send patch (ONLY thing we touch) ───
    var _send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        try {
            var buf = new Uint8Array(data);
            bufferCount++;

            // Console log ALL packets like original sniffer
            if (buf[0] === 255) {
                console.log('Buffer sent: ', buf);
                console.log('Buffer count:', bufferCount, '(client key 255)');
            } else if (buf[0] === 254) {
                console.log('Buffer sent: ', buf);
                console.log('Buffer count:', bufferCount, '(protocol version:', buf[1], ')');
            } else {
                console.log('Buffer sent: ', buf);
                console.log('Buffer count:', bufferCount);
                if (buf.length > 3) {
                    try { console.log(String.fromCharCode.apply(String, buf)); } catch(e) {}
                }
            }

            // Skin upload detection
            if (buf.length > 3 && buf[0] !== 255 && buf[0] !== 254) {
                var png = findPNG(buf);
                if (png !== -1) {
                    savedImage = new Uint8Array(buf);
                    var iend = findIEND(buf);
                    savedFooter = iend !== -1 ? new Uint8Array(buf.slice(iend)) : null;
                    log('🎨 SKIN UPLOAD! ' + buf.length + 'B, PNG@' + png, 'green');
                    log('Header: [' + bytesPreview(buf.slice(0, png), 30) + ']', 'lime');
                    if (savedFooter && savedFooter.length > 0) {
                        log('Footer: [' + bytesPreview(savedFooter, 30) + ']', 'lime');
                    }
                    console.log('%c[SKIN SNIFFER] Packet captured!', 'color:#0f0;font-weight:bold');
                    console.log('Full:', Array.from(buf).join(','));
                    console.log('Header:', Array.from(buf.slice(0, png)).join(','));
                    if (savedFooter) console.log('Footer:', Array.from(savedFooter).join(','));
                }
            }
        } catch (e) { /* silent */ }
        return _send.call(this, data);
    };

    // ─── PART 1b: Hook proxyMobileData to get UNENCRYPTED protocol bytes ───
    // WebSocket.send only sees encrypted data. proxyMobileData is the clean protobuf.
    function hookProxyMobileData() {
        if (window.core && window.core.proxyMobileData && !window.core._origProxyMobileData) {
            window.core._origProxyMobileData = window.core.proxyMobileData;
            window.core.proxyMobileData = function (data) {
                try {
                    var buf = (data instanceof Uint8Array) ? data : new Uint8Array(data);
                    console.log('%c[PROTO] proxyMobileData (' + buf.length + 'B):', 'color:#0ad;font-weight:bold', Array.from(buf));
                    log('📤 PROTO (' + buf.length + 'B): [' + bytesPreview(buf, 30) + ']', '#0ad');

                    // Detect skin upload in clean protobuf
                    var png = findPNG(buf);
                    if (png !== -1) {
                        savedImage = new Uint8Array(buf);
                        var iend = findIEND(buf);
                        savedFooter = iend !== -1 ? new Uint8Array(buf.slice(iend)) : null;
                        log('🎨 SKIN UPLOAD (clean)! ' + buf.length + 'B, PNG@' + png, '#0f0');
                        log('Proto header: [' + bytesPreview(buf.slice(0, png), 30) + ']', 'lime');
                        if (savedFooter && savedFooter.length > 0) {
                            log('Proto footer: [' + bytesPreview(savedFooter, 30) + ']', 'lime');
                        }
                        console.log('%c[SKIN SNIFFER] CLEAN packet captured!', 'color:#0f0;font-weight:bold');
                        console.log('Header (before PNG):', Array.from(buf.slice(0, png)).join(', '));
                        console.log('Full:', Array.from(buf).join(', '));
                        if (savedFooter) console.log('Footer (after IEND):', Array.from(savedFooter).join(', '));
                    }
                } catch (e) { console.warn('[Sniffer] proxyMobileData hook error:', e); }
                return window.core._origProxyMobileData(data);
            };
            log('✅ proxyMobileData hooked — clean protocol bytes will be captured!', '#0f0');
            return true;
        }
        return false;
    }

    // Keep trying until core is available
    var _hookInterval = setInterval(function () {
        if (hookProxyMobileData()) clearInterval(_hookInterval);
    }, 2000);

    // ─── Logging ───
    function log(msg, color) {
        color = color || '#aaa';
        logEntries.push({ msg: msg, color: color });
        console.log('[Sniffer] ' + msg);
        var el = document.getElementById('sniff-log');
        if (el) {
            var d = document.createElement('div');
            d.style.color = color;
            d.style.padding = '1px 0';
            d.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            d.style.wordBreak = 'break-all';
            d.textContent = msg;
            el.appendChild(d);
            while (el.children.length > 150) el.removeChild(el.firstChild);
            el.scrollTop = el.scrollHeight;
        }
    }

    // ─── PART 2: UI Panel ───
    function createUI() {
        if (document.getElementById('sniff-panel')) return;

        var css = document.createElement('style');
        css.textContent = [
            '#sniff-panel{position:fixed;bottom:10px;right:10px;width:380px;background:rgba(0,15,30,0.94);border:1px solid #0ad;border-radius:8px;font:11px Consolas,monospace;color:#ccc;z-index:99999;display:flex;flex-direction:column;box-shadow:0 0 15px rgba(0,170,221,0.3)}',
            '#sniff-panel .sh{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;background:rgba(0,170,221,0.12);border-radius:7px 7px 0 0;cursor:move;user-select:none}',
            '#sniff-panel .sh b{color:#0ad;font-size:12px}',
            '#sniff-panel .sb{display:flex;gap:3px;padding:4px 8px;border-bottom:1px solid #222;flex-wrap:wrap}',
            '#sniff-panel .sb button{padding:3px 8px;border:1px solid #0ad;border-radius:3px;background:rgba(0,170,221,0.15);color:#0ad;cursor:pointer;font:10px Consolas,monospace;font-weight:bold}',
            '#sniff-panel .sb button:hover{background:#0ad;color:#000}',
            '#sniff-panel .sb button.w{border-color:#f80;color:#f80}',
            '#sniff-panel .sb button.w:hover{background:#f80;color:#000}',
            '#sniff-log{flex:1;overflow-y:auto;padding:4px 8px;max-height:180px;scrollbar-width:thin;font-size:10px}'
        ].join('\n');
        document.head.appendChild(css);

        var p = document.createElement('div');
        p.id = 'sniff-panel';
        p.innerHTML =
            '<div class="sh" id="sniff-hdr"><b>🔍 Skin Sniffer</b><span style="display:flex;gap:6px">' +
            '<span id="sniff-min" style="cursor:pointer;color:#0ad;font-size:14px" title="Minimize">−</span>' +
            '<span id="sniff-close" style="cursor:pointer;color:#f44;font-size:14px" title="Close">✕</span></span></div>' +
            '<div class="sb" id="sniff-btns">' +
            '<button id="sniff-inject">📂 Inject Image</button>' +
            '<button id="sniff-copy">📋 Copy Packet</button>' +
            '<button id="sniff-footer">📋 Copy Footer</button>' +
            '<button class="w" id="sniff-clear">🗑️ Clear</button></div>' +
            '<div id="sniff-log"></div>';
        document.body.appendChild(p);

        // Draggable
        var hdr = document.getElementById('sniff-hdr');
        var dragging = false, dx = 0, dy = 0;
        hdr.onmousedown = function (e) { dragging = true; dx = e.clientX - p.offsetLeft; dy = e.clientY - p.offsetTop; };
        document.onmousemove = function (e) { if (!dragging) return; p.style.left = (e.clientX - dx) + 'px'; p.style.top = (e.clientY - dy) + 'px'; p.style.right = 'auto'; p.style.bottom = 'auto'; };
        document.onmouseup = function () { dragging = false; };

        // Close/minimize
        document.getElementById('sniff-close').onclick = function () { p.style.display = 'none'; };
        document.getElementById('sniff-min').onclick = function () {
            var l = document.getElementById('sniff-log');
            var b = document.getElementById('sniff-btns');
            if (l.style.display === 'none') { l.style.display = ''; b.style.display = ''; this.textContent = '−'; }
            else { l.style.display = 'none'; b.style.display = 'none'; this.textContent = '+'; }
        };

        // Buttons
        document.getElementById('sniff-inject').onclick = function () {
            var canvas = document.getElementById('skin-editor-canvas');
            if (!canvas) {
                log('⚠ Open the agar.io skin editor first (click your skin icon in game)', '#f80');
                return;
            }
            var input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
            input.onchange = function (e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (ev) {
                    var img = new Image();
                    img.onload = function () {
                        var c = document.createElement('canvas');
                        c.width = 512; c.height = 512;
                        c.getContext('2d').drawImage(img, 0, 0, 512, 512);
                        var resized = c.toDataURL('image/png');
                        var targetCanvas = document.getElementById('skin-editor-canvas');
                        if (!targetCanvas) { log('⚠ skin-editor-canvas gone!', '#f44'); return; }
                        var ctx = targetCanvas.getContext('2d');
                        var img2 = new Image();
                        img2.onload = function () {
                            ctx.clearRect(0, 0, 512, 512);
                            ctx.drawImage(img2, 0, 0, 512, 512);
                            log('✅ Image injected into skin-editor-canvas (512x512)', 'lime');
                            // Dispatch events so agar.io client detects the change
                            targetCanvas.dispatchEvent(new Event('change', { bubbles: true }));
                            targetCanvas.dispatchEvent(new Event('input', { bubbles: true }));
                        };
                        img2.src = resized;
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
            document.body.appendChild(input); input.click(); document.body.removeChild(input);
        };

        document.getElementById('sniff-copy').onclick = function () {
            if (!savedImage) { log('⚠ No skin packet captured yet', '#f80'); return; }
            navigator.clipboard.writeText(Array.from(savedImage).join(', ')).then(function () {
                log('📋 Packet copied (' + savedImage.length + ' bytes)', '#0f0');
            });
        };

        document.getElementById('sniff-footer').onclick = function () {
            if (!savedFooter || savedFooter.length === 0) { log('⚠ No footer captured', '#f80'); return; }
            navigator.clipboard.writeText(Array.from(savedFooter).join(', ')).then(function () {
                log('📋 Footer copied (' + savedFooter.length + ' bytes)', '#0f0');
            });
        };

        document.getElementById('sniff-clear').onclick = function () {
            document.getElementById('sniff-log').innerHTML = '';
            logEntries = [];
        };

        // Replay any log entries that happened before panel was ready
        var el = document.getElementById('sniff-log');
        logEntries.forEach(function (e) {
            var d = document.createElement('div');
            d.style.color = e.color;
            d.textContent = e.msg;
            el.appendChild(d);
        });

        log('🔍 Ready. Packets are being logged.', '#0ad');
        log('To sniff a skin upload: open skin editor in agar.io → upload/save a skin → bytes appear here.', '#888');
    }

    // ─── Init ───
    function init() {
        if (document.getElementById('sniff-panel')) return;
        if (document.body) {
            createUI();
        } else {
            setTimeout(init, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 1000); });
    } else {
        setTimeout(init, 1000);
    }
})();
