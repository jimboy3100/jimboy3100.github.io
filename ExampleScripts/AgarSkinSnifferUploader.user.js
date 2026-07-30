// ==UserScript==
// @name         Agar.io Skin Sniffer + Uploader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sniff skin upload protocol bytes + upload custom skin images on agar.io. Click your skin to open editor, then inject your image.
// @author       jimboy3100 (merged from StrikerJS sniffer + Dhal uploader + createSkinsSniffer)
// @match        *://*.agar.io/*
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════
     *  PART 1: PACKET SNIFFER (WebSocket Intercept)
     *  Captures all sent/received packets and logs them.
     *  When a skin upload packet is detected (contains PNG data),
     *  it saves the full image+footer to window.SAVED_IMAGE.
     * ══════════════════════════════════════════════════════════ */

    var _WebSocket = window.WebSocket;
    window.key255 = null;
    window.key254 = null;
    window.encryptionKey = 0;
    window.decryptionKey = 0;
    window.gotKey = false;
    window.SAVED_IMAGE = null;
    window.SAVED_FOOTER = null;
    window._snifferBufferCount = 0;
    window._snifferLog = [];

    // XOR decrypt helpers
    window.rotateKey = function (key) {
        key = Math.imul(key, 1540483477) >> 0;
        key = Math.imul(key >>> 24 ^ key, 1540483477) >> 0 ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, 1540483477) >> 0;
        return key >>> 15 ^ key;
    };
    window.decryptPacket = function (data) {
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i] ^ window.encryptionKey >>> i % 4 * 8 & 255;
        }
        window.encryptionKey = window.rotateKey(window.encryptionKey);
        return data;
    };
    window.xorBuf = function (data, key) {
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i] ^ key >>> i % 4 * 8 & 255;
        }
        return data;
    };

    // PNG detection: look for PNG header (137 80 78 71) in a buffer
    function containsPNG(buf) {
        for (var i = 0; i < buf.length - 8; i++) {
            if (buf[i] === 137 && buf[i + 1] === 80 && buf[i + 2] === 78 && buf[i + 3] === 71) {
                return i;
            }
        }
        return -1;
    }

    // Extract footer after PNG IEND marker
    function extractFooter(data) {
        for (var i = 0; i < data.length - 8; i++) {
            if (data[i] === 73 && data[i + 1] === 69 && data[i + 2] === 78 && data[i + 3] === 68) {
                return data.slice(i + 8); // 4 bytes IEND + 4 bytes CRC
            }
        }
        return null;
    }

    // Helper to format bytes for logging
    function formatBytes(buf, maxLen) {
        maxLen = maxLen || 60;
        var str = '';
        var len = Math.min(buf.length, maxLen);
        for (var i = 0; i < len; i++) {
            str += buf[i];
            if (i < len - 1) str += ', ';
        }
        if (buf.length > maxLen) str += '... (' + buf.length + ' total)';
        return str;
    }

    // WebSocket proxy — patch send() on each new instance
    // We override the constructor to return a real WebSocket with send() hooked.
    var _origWS = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        var ws;
        if (protocols !== undefined) {
            ws = new _origWS(url, protocols);
        } else {
            ws = new _origWS(url);
        }

        // Patch send to intercept outgoing packets
        var _origSend = ws.send.bind(ws);
        ws.send = function (data) {
            try {
                var buf = new Uint8Array(data);
                window._snifferBufferCount++;

                if (buf[0] === 255) {
                    window.key255 = buf;
                    logToPanel('🔑 Client key sent (op 255)', 'key');
                } else if (buf[0] === 254) {
                    logToPanel('📡 Protocol version: ' + buf[1], 'info');
                } else if (buf.length > 3) {
                    // Log raw bytes (don't decrypt — key sync is fragile)
                    var pngOffset = containsPNG(buf);
                    if (pngOffset !== -1) {
                        window.SAVED_IMAGE = new Uint8Array(buf);
                        window.SAVED_FOOTER = extractFooter(buf);
                        logToPanel('🎨 SKIN UPLOAD DETECTED! (' + buf.length + ' bytes, PNG at offset ' + pngOffset + ')', 'skin');
                        logToPanel('📋 Header bytes: [' + formatBytes(buf, 30) + ']', 'skin');
                        if (window.SAVED_FOOTER && window.SAVED_FOOTER.length > 0) {
                            logToPanel('📋 Footer (' + window.SAVED_FOOTER.length + ' bytes): [' + formatBytes(window.SAVED_FOOTER, 40) + ']', 'skin');
                        }
                        console.log('%c[SKIN SNIFFER] Full skin upload packet:', 'color: #00ff00; font-weight: bold;');
                        console.log('Raw bytes:', Array.from(buf).join(', '));
                        console.log('Header (before PNG):', Array.from(buf.slice(0, pngOffset)).join(', '));
                        if (window.SAVED_FOOTER) {
                            console.log('Footer (after IEND):', Array.from(window.SAVED_FOOTER).join(', '));
                        }
                    } else {
                        logToPanel('#' + window._snifferBufferCount + ' SEND (' + buf.length + 'B): [' + formatBytes(buf, 20) + ']', 'send');
                    }
                }
            } catch (e) {
                console.warn('[Sniffer] send hook error:', e);
            }
            return _origSend(data);
        };

        // Log connection
        ws.addEventListener('open', function () {
            logToPanel('🟢 Connected: ' + url.substring(0, 60), 'info');
        });
        ws.addEventListener('close', function () {
            logToPanel('🔴 Disconnected', 'info');
        });

        return ws;
    };
    // Preserve static properties and prototype so instanceof checks work
    window.WebSocket.prototype = _origWS.prototype;
    window.WebSocket.CONNECTING = _origWS.CONNECTING;
    window.WebSocket.OPEN = _origWS.OPEN;
    window.WebSocket.CLOSING = _origWS.CLOSING;
    window.WebSocket.CLOSED = _origWS.CLOSED;

    /* ══════════════════════════════════════════════════════════
     *  PART 2: MAKE CUSTOM SKINS CLICKABLE
     *  Watches for the agar.io skin inventory and makes custom
     *  skin thumbnails clickable to open the skin editor.
     * ══════════════════════════════════════════════════════════ */

    function makeSkinClickable() {
        // Try to find custom skin elements and make them clickable
        var skinItems = document.querySelectorAll(
            '.inventory-skin, .skin-item, [data-skin-id], .custom-skin, ' +
            '.agario-skin, .skin-thumb, .owned-skin, .profile-skin'
        );

        skinItems.forEach(function (item) {
            if (item._clickPatched) return;
            item._clickPatched = true;
            item.style.cursor = 'pointer';
            item.addEventListener('click', function (e) {
                // Try to trigger the native skin editor
                var skinId = item.getAttribute('data-skin-id') || item.getAttribute('data-product-id') || '';
                if (skinId.includes('custom')) {
                    // Try to open skin editor by clicking the official edit button
                    var editBtn = document.querySelector('.edit-skin-btn, .skin-edit, [data-action="edit-skin"]');
                    if (editBtn) {
                        editBtn.click();
                    } else {
                        // Dispatch a custom event that skin editor might listen to
                        item.dispatchEvent(new CustomEvent('skin-edit-request', { bubbles: true, detail: { skinId: skinId } }));
                    }
                }
            });
        });

        // Also try to make profile picture clickable
        var profilePics = document.querySelectorAll('.agario-profile-picture, .profile-picture, #profilePicture');
        profilePics.forEach(function (pic) {
            if (pic._clickPatched) return;
            pic._clickPatched = true;
            pic.style.cursor = 'pointer';
            pic.title = 'Click to open skin editor';
        });
    }

    /* ══════════════════════════════════════════════════════════
     *  PART 3: IMAGE UPLOADER / INJECTOR UI
     *  Floating button that lets you pick an image and inject
     *  it into skin-editor-canvas. Auto-resizes to 512x512.
     * ══════════════════════════════════════════════════════════ */

    function injectBase64(base64) {
        var canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) {
            logToPanel('⚠️ skin-editor-canvas not found! Open the skin editor first.', 'error');
            return false;
        }
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, 512, 512);
            ctx.save();
            logToPanel('✅ Image injected into skin-editor-canvas!', 'skin');

            // Trigger canvas change event so the client detects the change
            canvas.dispatchEvent(new Event('change', { bubbles: true }));
            canvas.dispatchEvent(new Event('input', { bubbles: true }));

            // Try to trigger save/apply
            var saveBtn = document.querySelector(
                '.save-skin, .apply-skin, [data-action="save"], ' +
                'button[class*="save"], button[class*="apply"], ' +
                '.skin-editor-save, .btn-save'
            );
            if (saveBtn) {
                logToPanel('💾 Found save button — click it to upload!', 'info');
            }
        };
        image.onerror = function () {
            logToPanel('❌ Error loading image', 'error');
        };
        image.src = base64;
        return true;
    }

    function pickAndInjectImage() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.addEventListener('change', function (event) {
            var file = event.target.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function (e) {
                var base64 = e.target.result;
                var img = new Image();
                img.onload = function () {
                    // Always resize to 512x512
                    var canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 512, 512);
                    var resized = canvas.toDataURL('image/png');

                    injectBase64(resized);
                    logToPanel('📐 Resized to 512x512 and injected', 'info');
                };
                img.src = base64;
            };
            reader.readAsDataURL(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    /* ══════════════════════════════════════════════════════════
     *  PART 4: UI PANEL (Sniffer Log + Buttons)
     * ══════════════════════════════════════════════════════════ */

    var panelReady = false;

    function createPanel() {
        if (document.getElementById('lm-sniffer-panel')) return;

        var panel = document.createElement('div');
        panel.id = 'lm-sniffer-panel';
        panel.innerHTML = `
            <style>
                #lm-sniffer-panel {
                    position: fixed; bottom: 10px; right: 10px; width: 420px;
                    max-height: 350px; background: rgba(0,20,40,0.92);
                    border: 2px solid #01d9cc; border-radius: 10px;
                    font-family: 'Consolas', 'Monaco', monospace; font-size: 11px;
                    color: #ccc; z-index: 99999; display: flex; flex-direction: column;
                    box-shadow: 0 0 20px rgba(1,217,204,0.3);
                }
                #lm-sniffer-panel .sn-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 6px 10px; border-bottom: 1px solid #01d9cc;
                    background: rgba(1,217,204,0.1); border-radius: 8px 8px 0 0; cursor: move;
                }
                #lm-sniffer-panel .sn-header span { color: #01d9cc; font-weight: bold; font-size: 12px; }
                #lm-sniffer-panel .sn-btns { display: flex; gap: 4px; padding: 5px 8px; border-bottom: 1px solid #333; flex-wrap: wrap; }
                #lm-sniffer-panel .sn-btn {
                    padding: 4px 10px; border: 1px solid #01d9cc; border-radius: 4px;
                    background: rgba(1,217,204,0.15); color: #01d9cc; cursor: pointer;
                    font-size: 10px; font-weight: bold; transition: all 0.2s;
                }
                #lm-sniffer-panel .sn-btn:hover { background: #01d9cc; color: #000; }
                #lm-sniffer-panel .sn-btn.warn { border-color: #ffb74d; color: #ffb74d; }
                #lm-sniffer-panel .sn-btn.warn:hover { background: #ffb74d; color: #000; }
                #lm-sniffer-panel .sn-log {
                    flex: 1; overflow-y: auto; padding: 4px 8px; max-height: 200px;
                    scrollbar-width: thin; scrollbar-color: #01d9cc transparent;
                }
                #lm-sniffer-panel .sn-log div { padding: 1px 0; border-bottom: 1px solid rgba(255,255,255,0.03); word-break: break-all; }
                #lm-sniffer-panel .sn-log .skin { color: #00e676; font-weight: bold; }
                #lm-sniffer-panel .sn-log .error { color: #ff5252; }
                #lm-sniffer-panel .sn-log .info { color: #4fc3f7; }
                #lm-sniffer-panel .sn-log .key { color: #ffb74d; }
                #lm-sniffer-panel .sn-log .send { color: #888; }
                #lm-sniffer-panel .sn-close { cursor: pointer; color: #ff5252; font-size: 16px; font-weight: bold; }
                #lm-sniffer-panel .sn-minimize { cursor: pointer; color: #01d9cc; font-size: 16px; margin-right: 6px; }
            </style>
            <div class="sn-header">
                <span>🔍 Skin Sniffer + Uploader</span>
                <div>
                    <span class="sn-minimize" title="Minimize">−</span>
                    <span class="sn-close" title="Close">✕</span>
                </div>
            </div>
            <div class="sn-btns" id="sn-btns">
                <div class="sn-btn" id="sn-btn-inject" title="Pick an image file and inject into skin-editor-canvas">📂 Inject Image</div>
                <div class="sn-btn" id="sn-btn-copy" title="Copy last sniffed skin packet bytes to clipboard">📋 Copy Packet</div>
                <div class="sn-btn" id="sn-btn-footer" title="Copy sniffed footer bytes">📋 Copy Footer</div>
                <div class="sn-btn sn-btn warn" id="sn-btn-clear">🗑️ Clear Log</div>
            </div>
            <div class="sn-log" id="sn-log"></div>
        `;
        document.body.appendChild(panel);

        // Make draggable
        var header = panel.querySelector('.sn-header');
        var isDragging = false, dragX = 0, dragY = 0;
        header.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragX = e.clientX - panel.offsetLeft;
            dragY = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragX) + 'px';
            panel.style.top = (e.clientY - dragY) + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', function () { isDragging = false; });

        // Close / minimize
        panel.querySelector('.sn-close').addEventListener('click', function () { panel.style.display = 'none'; });
        panel.querySelector('.sn-minimize').addEventListener('click', function () {
            var log = document.getElementById('sn-log');
            var btns = document.getElementById('sn-btns');
            if (log.style.display === 'none') {
                log.style.display = '';
                btns.style.display = '';
                this.textContent = '−';
            } else {
                log.style.display = 'none';
                btns.style.display = 'none';
                this.textContent = '+';
            }
        });

        // Button handlers
        document.getElementById('sn-btn-inject').addEventListener('click', pickAndInjectImage);
        document.getElementById('sn-btn-copy').addEventListener('click', function () {
            if (window.SAVED_IMAGE) {
                var text = Array.from(window.SAVED_IMAGE).join(', ');
                navigator.clipboard.writeText(text).then(function () {
                    logToPanel('📋 Full packet copied to clipboard! (' + window.SAVED_IMAGE.length + ' bytes)', 'skin');
                });
            } else {
                logToPanel('⚠️ No skin packet captured yet. Upload a skin first.', 'error');
            }
        });
        document.getElementById('sn-btn-footer').addEventListener('click', function () {
            if (window.SAVED_FOOTER && window.SAVED_FOOTER.length > 0) {
                var text = Array.from(window.SAVED_FOOTER).join(', ');
                navigator.clipboard.writeText(text).then(function () {
                    logToPanel('📋 Footer copied! (' + window.SAVED_FOOTER.length + ' bytes)', 'skin');
                });
            } else {
                logToPanel('⚠️ No footer captured. Upload a skin through the official editor first.', 'error');
            }
        });
        document.getElementById('sn-btn-clear').addEventListener('click', function () {
            document.getElementById('sn-log').innerHTML = '';
            window._snifferLog = [];
        });

        panelReady = true;
        logToPanel('🔍 Sniffer ready. Upload a skin through agar.io to capture protocol bytes.', 'info');
        logToPanel('📂 Use "Inject Image" to load a custom image into the skin editor canvas.', 'info');
    }

    function logToPanel(msg, cls) {
        cls = cls || '';
        window._snifferLog.push({ msg: msg, cls: cls });

        // Also log to console
        console.log('[Sniffer] ' + msg);

        var log = document.getElementById('sn-log');
        if (!log) return;

        var div = document.createElement('div');
        div.className = cls;
        div.textContent = msg;
        log.appendChild(div);

        // Keep max 200 entries
        while (log.children.length > 200) {
            log.removeChild(log.firstChild);
        }

        log.scrollTop = log.scrollHeight;
    }

    /* ══════════════════════════════════════════════════════════
     *  PART 5: INIT
     * ══════════════════════════════════════════════════════════ */

    function init() {
        createPanel();

        // Periodically check for skin elements to make clickable
        setInterval(makeSkinClickable, 3000);

        // Watch for skin-editor-canvas appearing
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.addedNodes) {
                    for (var i = 0; i < m.addedNodes.length; i++) {
                        var node = m.addedNodes[i];
                        if (node.nodeType === 1) {
                            if (node.id === 'skin-editor-canvas' || (node.querySelector && node.querySelector('#skin-editor-canvas'))) {
                                logToPanel('🎨 Skin editor opened! Use "Inject Image" to load your custom skin.', 'skin');
                            }
                        }
                    }
                }
            });
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to not interfere with page load
        setTimeout(init, 1500);
    }
})();
