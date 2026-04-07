// ==UserScript==
// @name         Expanding Land - IO Games Mod | Free Bots, Macros, Auto-Respawn
// @namespace    https://expanding.land/
// @version      2.1
// @description  The ultimate IO games toolkit. Auto-fill nicknames, rapid eject, quad split, freeze cell, auto-respawn, FPS counter — works on Agar.io, MooMoo.io, Diep.io, Surviv.io, and more. Includes FREE 50 bots for Expanding Land (1024 real players limit per area). Custom skin uploader & auto coin collector for Agar.io. Best agario mod alternative.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://expanding.land/*
// @match        https://www.expanding.land/*
// @match        *://agar.io/*
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://surviv.io/*
// @match        *://diep.io/*
// @match        *://zombs.io/*
// @match        *://agma.io/*
// @match        *://agar.pro/*
// @match        *://germs.io/*
// @match        *://senpa.io/*
// @connect      expanding.land
// @connect      legendmod.ml
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @supportURL   https://discord.com/invite/JUfpR9k
// @homepageURL  https://expanding.land/
// @run-at       document-start
//
// @tag          agario
// @tag          agar.io
// @tag          bots
// @tag          agario bots
// @tag          agario mod
// @tag          agario extension
// @tag          io game
// @tag          multiplayer
// @tag          agario hack
// @tag          agario skins
// @tag          agario macro
// @tag          agario private server
// @tag          legend mod
// @tag          expanding land
// @tag          free bots
// @tag          tricksplit
// @tag          doublesplit
// @tag          popsplit
// @tag          zoom hack
// @tag          auto respawn
// @tag          agario cheat
// @tag          mass overlay
// @tag          moomoo.io
// @tag          diep.io
// @tag          surviv.io
// @tag          custom skin
// @tag          coin collector
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════
    //  IO GAMES TOOLKIT v2.0 — by Expanding Land
    //  Works on: Agar.io, MooMoo.io, Slither.io, Diep.io,
    //  Surviv.io, Zombs.io, Skribbl.io, and 20+ more
    //
    //  FEATURES (all IO games):
    //  [E]  Rapid Eject / Feed
    //  [T]  Quad Split (4x split)
    //  [R]  Auto-Respawn
    //  [S]  Freeze Cell / Stop Movement
    //  [F]  FPS Counter
    //  [Ctrl+`]       Auto-fill saved nickname
    //  [Ctrl+Shift+`] Set new nickname
    //  [H]  Hide/Show Panel
    //
    //  EXPANDING LAND FEATURES:
    //  [X]  Freeze Cell (EL specific)
    //  [Z]  Extended Zoom
    //  🤖  FREE 50 Bots download
    //
    //  Play: https://expanding.land/
    //  Bots: https://www.legendmod.ml/
    //  Discord: https://discord.com/invite/JUfpR9k
    // ═══════════════════════════════════════════════════════

    const host = window.location.hostname;
    const IS_EL = host.includes('expanding.land');

    // ── Saved Nickname (works across all IO games) ──
    let savedName = '';
    (async function loadName() {
        try {
            if (typeof GM_getValue !== 'undefined') {
                savedName = GM_getValue('io_nickname', '');
            } else if (typeof GM !== 'undefined' && GM.getValue) {
                savedName = await GM.getValue('io_nickname', '');
            } else {
                savedName = localStorage.getItem('io_nickname') || '';
            }
        } catch(e) {
            savedName = localStorage.getItem('io_nickname') || '';
        }
    })();

    async function saveName(name) {
        savedName = name;
        try {
            if (typeof GM_setValue !== 'undefined') GM_setValue('io_nickname', name);
            else if (typeof GM !== 'undefined' && GM.setValue) await GM.setValue('io_nickname', name);
            else localStorage.setItem('io_nickname', name);
        } catch(e) {
            localStorage.setItem('io_nickname', name);
        }
    }

    // ── Auto-fill nickname for each game ──
    function fillNickname() {
        if (!savedName) return;
        const selectors = {
            'agar.io':          '#nick',
            'moomoo.io':        '#nameInput',
            'sandbox.moomoo.io':'#nameInput',
            'dev.moomoo.io':    '#nameInput',
            'surviv.io':        '#player-name-input-solo',
            'diep.io':          '#textInput',
            'zombs.io':         '.hud-intro-name',
        };
        // Try exact host match
        let sel = selectors[host];
        if (!sel) {
            // Try partial match
            for (const [h, s] of Object.entries(selectors)) {
                if (host.includes(h.replace('www.', ''))) { sel = s; break; }
            }
        }
        if (sel) {
            const el = document.querySelector(sel);
            if (el) {
                el.value = savedName;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    // ── Canvas detection ──
    function getCanvas() {
        return document.querySelector('canvas') || document.getElementById('canvas');
    }

    // ── Rapid Eject (key E) ──
    let ejectorLoop = null;
    function startRapidEject() {
        if (ejectorLoop) return;
        ejectorLoop = setInterval(function() {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 87, key: 'w', which: 87 }));
            window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 87, key: 'w', which: 87 }));
            // Also try onkeydown for games that use it
            if (window.onkeydown) window.onkeydown({ keyCode: 87 });
            if (window.onkeyup) window.onkeyup({ keyCode: 87 });
        }, 25);
    }
    function stopRapidEject() {
        if (ejectorLoop) { clearInterval(ejectorLoop); ejectorLoop = null; }
    }

    // ── Quad Split (key T) — 4 rapid splits ──
    function quadSplit() {
        let count = 0;
        const id = setInterval(function() {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32, key: ' ', which: 32 }));
            window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32, key: ' ', which: 32 }));
            if (window.onkeydown) window.onkeydown({ keyCode: 32 });
            if (window.onkeyup) window.onkeyup({ keyCode: 32 });
            if (++count >= 4) clearInterval(id);
        }, 50);
    }

    // ── Freeze Cell (key S) — send mouse to center ──
    let frozen = false;
    let freezeLoop = null;
    function toggleFreeze() {
        frozen = !frozen;
        if (frozen) {
            freezeLoop = setInterval(function() {
                const canvas = getCanvas();
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    canvas.dispatchEvent(new MouseEvent('mousemove', {
                        clientX: rect.left + rect.width / 2,
                        clientY: rect.top + rect.height / 2
                    }));
                }
            }, 30);
        } else {
            clearInterval(freezeLoop);
            freezeLoop = null;
        }
        updatePanel();
    }

    // ── Auto Respawn (key R) ──
    let autoRespawn = false;
    let respawnLoop = null;
    function toggleAutoRespawn() {
        autoRespawn = !autoRespawn;
        if (autoRespawn) {
            respawnLoop = setInterval(function() {
                // Try clicking play buttons
                const btns = document.querySelectorAll(
                    '[data-btn="play"], .btn-play, .play-btn, #play-btn, ' +
                    '.btn-play-again, #playBtn, .startButton, #startButton, ' +
                    'button[onclick*="play"], .overlay .btn'
                );
                btns.forEach(btn => {
                    if (btn && btn.offsetParent !== null) btn.click();
                });
                // Also try Enter key
                window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: 'Enter', which: 13 }));
            }, 1500);
        } else {
            clearInterval(respawnLoop);
            respawnLoop = null;
        }
        updatePanel();
    }

    // ── FPS Counter ──
    let showFPS = true;
    let frames = 0, fps = 0, lastFpsTime = performance.now();
    function createFPSOverlay() {
        const el = document.createElement('div');
        el.id = 'io-fps';
        el.style.cssText = `
            position: fixed; top: 8px; left: 8px; z-index: 999999;
            background: rgba(0,0,0,0.65); color: #22c55e;
            font-family: Consolas, monospace; font-size: 13px; font-weight: bold;
            padding: 4px 10px; border-radius: 6px; pointer-events: none;
        `;
        document.body.appendChild(el);
    }
    function tickFPS() {
        frames++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
            fps = frames; frames = 0; lastFpsTime = now;
            const el = document.getElementById('io-fps');
            if (el) {
                el.textContent = fps + ' FPS';
                el.style.display = showFPS ? 'block' : 'none';
            }
        }
        requestAnimationFrame(tickFPS);
    }

    // ── Control Panel ──
    let panelVisible = true;
    let panelClosed = false;

    // Find the best container for each game to dock the panel into
    function findGameContainer() {
        const containers = {
            'agar.io':       ['#mainPanel', '#overlays', '#helloContainer'],
            'moomoo.io':     ['#menuCardHolder', '#gameUI', '#menuContainer'],
            'diep.io':       ['#textInputContainer'],
            'surviv.io':     ['.play-loading-outer', '#ui-game', '#start-main'],
            'zombs.io':      ['.hud-intro-form', '.hud-intro', '.hud'],
            'agma.io':       ['.panel.panel-default.bg-transparent'],
            'senpa.io':      ['.Home_content__2fqOz'],
            'germs.io':      ['.card'],
        };
        for (const [gameHost, selectors] of Object.entries(containers)) {
            if (host.includes(gameHost.replace('www.', ''))) {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el) return el;
                }
            }
        }
        return null; // fallback to body with fixed positioning
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'io-panel';

        const container = findGameContainer();
        if (container) {
            // Docked mode: absolute inside the game container
            container.style.position = container.style.position || 'relative';
            panel.style.cssText = `
                position: absolute; top: 8px; right: 8px; z-index: 999998;
                background: rgba(10,14,23,0.92); border: 1px solid #1e293b;
                border-radius: 12px; padding: 12px 16px;
                font-family: 'Segoe UI', Arial, sans-serif; color: #94a3b8; font-size: 11px;
                line-height: 1.9; min-width: 210px; backdrop-filter: blur(8px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5); pointer-events: auto;
            `;
            container.appendChild(panel);
        } else {
            // Fallback: fixed on body
            panel.style.cssText = `
                position: fixed; top: 8px; right: 8px; z-index: 999998;
                background: rgba(10,14,23,0.92); border: 1px solid #1e293b;
                border-radius: 12px; padding: 12px 16px;
                font-family: 'Segoe UI', Arial, sans-serif; color: #94a3b8; font-size: 11px;
                line-height: 1.9; min-width: 210px; backdrop-filter: blur(8px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            `;
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div style="color:#a855f7; font-weight:700; font-size:13px;">
                    ⚡ IO Toolkit v2.0
                    <span style="color:#475569; font-weight:400; font-size:10px;"> by Expanding Land</span>
                </div>
                <button id="io-panel-close" style="
                    background:none; border:none; color:#ef4444; font-size:16px;
                    cursor:pointer; padding:0 0 0 8px; line-height:1;
                " title="Close panel">✕</button>
            </div>
            <div style="color:#475569; margin-bottom:4px;">── Macros ──</div>
            <div><span style="color:#6366f1">[E]</span> Rapid Eject: <span id="io-re" style="color:#94a3b8">hold</span></div>
            <div><span style="color:#6366f1">[T]</span> Quad Split (4×)</div>
            <div><span style="color:#6366f1">[S]</span> Freeze Cell: <span id="io-fc" style="color:#ef4444">OFF</span></div>
            <div><span style="color:#6366f1">[R]</span> Auto-Respawn: <span id="io-ar" style="color:#ef4444">OFF</span></div>
            <div><span style="color:#6366f1">[F]</span> FPS Counter: <span id="io-fp" style="color:#22c55e">ON</span></div>
            <div style="color:#475569; margin:4px 0;">── Nickname ──</div>
            <div><span style="color:#6366f1">[Ctrl+\`]</span> Fill name</div>
            <div><span style="color:#6366f1">[Ctrl+Shift+\`]</span> Set name</div>
            <div style="color:#475569; margin:4px 0;">── Other ──</div>
            <div><span style="color:#6366f1">[H]</span> Hide/Show Panel</div>
            <div style="margin-top:8px;">
                <a href="https://www.mediafire.com/file/gc6nuy6jbz1o8ou/ExpandingLand-Bots.exe/file" target="_blank" style="
                    display:block; text-align:center; padding:6px 0; border-radius:8px;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color:#fff; text-decoration:none; font-weight:700; font-size:11px;
                    margin-bottom:6px;
                ">🤖 Download 50 FREE Bots</a>
                <a href="https://expanding.land/" target="_blank" style="
                    display:block; text-align:center; padding:6px 0; border-radius:8px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    color:#fff; text-decoration:none; font-weight:700; font-size:11px;
                    margin-bottom:6px;
                ">🎮 Play Expanding Land</a>
            </div>
            <div style="display:flex; gap:6px; justify-content:center;">
                <a href="https://www.legendmod.ml/" target="_blank" style="color:#a855f7; font-size:10px;">⚙️ Legend Mod</a>
                <span style="color:#334155;">|</span>
                <a href="https://discord.com/invite/JUfpR9k" target="_blank" style="color:#6366f1; font-size:10px;">💬 Discord</a>
                <span style="color:#334155;">|</span>
                <a href="https://help.expanding.land/guide.html" target="_blank" style="color:#22c55e; font-size:10px;">📖 Guide</a>
            </div>
        `;

        // Close button handler
        document.getElementById('io-panel-close').addEventListener('click', function() {
            panel.style.display = 'none';
            panelVisible = false;
            panelClosed = true;
        });
    }

    function updatePanel() {
        const u = (id, on) => {
            const el = document.getElementById(id);
            if (el) { el.textContent = on ? 'ON' : 'OFF'; el.style.color = on ? '#22c55e' : '#ef4444'; }
        };
        u('io-fc', frozen);
        u('io-ar', autoRespawn);
        u('io-fp', showFPS);
    }

    // ── Keyboard Handler ──
    let keysHeld = {};
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        const code = e.keyCode || e.which;
        const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

        // Ctrl + ` = fill nickname
        if (e.ctrlKey && e.code === 'Backquote' && !e.shiftKey) {
            e.preventDefault();
            fillNickname();
            return;
        }
        // Ctrl + Shift + ` = set nickname
        if (e.ctrlKey && e.shiftKey && e.code === 'Backquote') {
            e.preventDefault();
            const newName = prompt('Set IO nickname (saved across all games):');
            if (newName !== null) {
                saveName(newName);
                fillNickname();
            }
            return;
        }

        if (inInput) return; // Don't hijack typing

        if (!keysHeld[code]) {
            switch(key) {
                case 'e': // Rapid eject
                    startRapidEject();
                    break;
                case 't': // Quad split
                    quadSplit();
                    break;
                case 's': // Freeze
                    toggleFreeze();
                    break;
                case 'r': // Auto-respawn
                    toggleAutoRespawn();
                    break;
                case 'f': // FPS
                    showFPS = !showFPS;
                    updatePanel();
                    break;
                case 'h': // Hide/show panel (also reopens if closed)
                    panelClosed = false;
                    panelVisible = !panelVisible;
                    const p = document.getElementById('io-panel');
                    if (p) p.style.display = panelVisible ? 'block' : 'none';
                    break;
            }
        }
        keysHeld[code] = true;
    });

    document.addEventListener('keyup', function(e) {
        const code = e.keyCode || e.which;
        keysHeld[code] = false;
        if (e.key.toLowerCase() === 'e') stopRapidEject();
    });

    // ── Quit protection ──
    window.onbeforeunload = function() { return 'Leave game?'; };

    // ── Agar.io Free Coin Collector ──
    function startCoinCollector() {
        const collectCoins = () => {
            if (window.agarApp && window.agarApp.API) {
                try {
                    window.agarApp.API.getFreeCoins();
                    window.agarApp.API.closeTopView();
                    console.log('[IO Toolkit] 🪙 Free coins collected');
                } catch(e) {}
            }
        };
        window.addEventListener('login', collectCoins);
        window.addEventListener('free_coins_timer', collectCoins);
        setInterval(collectCoins, 60000);
        // Try immediately in case already logged in
        setTimeout(collectCoins, 5000);
    }

    // ── Init ──
    window.addEventListener('DOMContentLoaded', function() {
        createFPSOverlay();
        // Delay panel creation slightly so game containers exist
        setTimeout(createPanel, 800);
        requestAnimationFrame(tickFPS);

        // Auto-fill nickname after a short delay (wait for game UI to load)
        setTimeout(fillNickname, 2000);

        // Agar.io specific features
        if (host.includes('agar.io')) {
            startSkinObserver();
            startCoinCollector();
        }

        console.log('[IO Toolkit v2.0] Loaded — by Expanding Land');
        console.log('[IO Toolkit] Press H to toggle panel, Ctrl+` to fill name');
    });

    // ═══════════════════════════════════════════════════════
    //  CUSTOM SKIN IMAGE UPLOADER (agar.io only)
    //  Detects skin editor canvas, injects image upload UI.
    //  Supports: URL input, file upload, drag & drop.
    //  Original concept by New Jack 🕹️
    // ═══════════════════════════════════════════════════════

    const skinCfg = {
        containerWidth: '400px',
        maxPreviewSize: 180,
        dropZoneHeight: '120px',
        colors: {
            green: '#54c800', blue: '#0078fa',
            yellow: '#ffcc00', background: 'rgb(255,255,255)', text: '#000'
        }
    };

    function startSkinObserver() {
        const obs = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.id === 'skin-editor-canvas' ||
                         (node.querySelector && node.querySelector('#skin-editor-canvas')))) {
                        setTimeout(initSkinUploader, 500);
                        return;
                    }
                }
                for (const node of m.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if ((node.querySelector && node.querySelector('#skin-editor-canvas')) ||
                            node.id === 'skin-editor-canvas' ||
                            (node.classList && (node.classList.contains('skin-editor') ||
                             node.classList.contains('skin-editor-dialog')))) {
                            removeSkinUploader();
                            return;
                        }
                        const indicators = ['.sk-app', '.editor-app', '.skin-editor', '[data-v-skin-editor]', '#skin-editor'];
                        for (const sel of indicators) {
                            if (node.matches && node.matches(sel)) {
                                setTimeout(() => {
                                    if (!document.getElementById('skin-editor-canvas')) removeSkinUploader();
                                }, 100);
                                return;
                            }
                        }
                    }
                }
            }
        });
        if (document.body) {
            obs.observe(document.body, { childList: true, subtree: true });
        }
    }

    function initSkinUploader() {
        if (document.getElementById('lm-skin-uploader')) return;
        const container = buildSkinUI();
        document.body.appendChild(container);
        const canvas = document.getElementById('skin-editor-canvas');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            container.style.top = rect.top + 'px';
            container.style.right = '20px';
            container.style.left = 'auto';
        }
        console.log('[IO Toolkit] ✓ Skin image uploader injected');
    }

    function removeSkinUploader() {
        const el = document.getElementById('lm-skin-uploader');
        if (el) el.remove();
    }

    function buildSkinUI() {
        const C = skinCfg.colors;
        const container = document.createElement('div');
        container.id = 'lm-skin-uploader';
        Object.assign(container.style, {
            position: 'absolute', right: '50px', top: '70px',
            width: skinCfg.containerWidth, padding: '15px',
            backgroundColor: C.background, color: C.text,
            borderRadius: '8px', boxSizing: 'border-box', zIndex: '9999',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            fontFamily: 'Ubuntu, Arial, sans-serif',
            border: '2px solid ' + C.green
        });

        // Header
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '15px', borderBottom: '1px solid ' + C.green, paddingBottom: '8px'
        });
        const title = document.createElement('h3');
        title.textContent = '🎨 Skin Image Upload';
        Object.assign(title.style, { margin: '0', color: C.blue, fontSize: '20px', fontWeight: 'bold' });

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '−';
        Object.assign(toggleBtn.style, {
            backgroundColor: C.green, border: 'none', color: '#fff', fontSize: '18px',
            cursor: 'pointer', width: '24px', height: '24px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', borderRadius: '4px'
        });

        const content = document.createElement('div');
        content.id = 'lm-skin-content';
        toggleBtn.addEventListener('click', () => {
            const hidden = content.style.display === 'none';
            content.style.display = hidden ? 'block' : 'none';
            toggleBtn.textContent = hidden ? '−' : '+';
        });

        header.appendChild(title);
        header.appendChild(toggleBtn);
        container.appendChild(header);
        container.appendChild(content);

        // URL input row
        const urlRow = document.createElement('div');
        Object.assign(urlRow.style, { marginBottom: '12px', display: 'flex' });
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter image URL... (ibb.co works best)';
        Object.assign(urlInput.style, {
            flex: '1', padding: '10px', border: '1px solid #444',
            backgroundColor: 'rgba(135,135,135,0.3)', color: '#000',
            borderRadius: '4px', marginRight: '5px', fontSize: '14px'
        });
        const urlBtn = document.createElement('button');
        urlBtn.textContent = 'Load';
        Object.assign(urlBtn.style, {
            padding: '10px', backgroundColor: C.green, color: '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        });
        urlRow.appendChild(urlInput);
        urlRow.appendChild(urlBtn);
        content.appendChild(urlRow);

        // File upload button
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        const fileBtn = document.createElement('button');
        fileBtn.textContent = '📁 Upload From Computer';
        Object.assign(fileBtn.style, {
            width: '100%', padding: '10px', backgroundColor: C.blue,
            color: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px'
        });
        content.appendChild(fileInput);
        content.appendChild(fileBtn);

        // Drop zone
        const dropZone = document.createElement('div');
        Object.assign(dropZone.style, {
            height: skinCfg.dropZoneHeight, border: '2px dashed ' + C.yellow,
            borderRadius: '4px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#999',
            marginBottom: '12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.5)'
        });
        dropZone.innerHTML = '<div style="font-size:24px;margin-bottom:6px;">⬇️</div>Drag & Drop Image Here';
        content.appendChild(dropZone);

        // Preview
        const previewWrap = document.createElement('div');
        Object.assign(previewWrap.style, {
            textAlign: 'center', marginTop: '12px', display: 'none',
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px'
        });
        const previewLabel = document.createElement('div');
        previewLabel.textContent = 'Preview:';
        Object.assign(previewLabel.style, { marginBottom: '8px', color: C.yellow, fontSize: '14px', fontWeight: 'bold' });
        const previewImg = document.createElement('img');
        previewImg.id = 'lm-skin-preview';
        Object.assign(previewImg.style, {
            maxWidth: '100%', maxHeight: skinCfg.maxPreviewSize + 'px',
            border: '1px solid #444', borderRadius: '50%'
        });
        previewWrap.appendChild(previewLabel);
        previewWrap.appendChild(previewImg);
        content.appendChild(previewWrap);

        // Tips
        const tips = document.createElement('div');
        Object.assign(tips.style, {
            fontSize: '12px', color: '#555', marginTop: '12px', lineHeight: '1.5',
            padding: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px',
            borderLeft: '3px solid ' + C.yellow
        });
        tips.innerHTML = `
            <b style="color:${C.blue}">Tips:</b><br>
            • If image doesn't appear clearly, try <a href="https://picwish.com/unblur-image-portrait" target="_blank" style="color:${C.blue};">unblurring it on PicWish</a><br>
            • Use <a href="https://crop-circle.imageonline.co/" target="_blank" style="color:${C.blue};">Crop Circle Tool</a> for best results<br>
            • Simple designs with few colors work best<br>
            • The image will be centered and scaled to fit
        `;
        content.appendChild(tips);

        // ── Events ──
        urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') loadSkinUrl(urlInput.value); });
        urlBtn.addEventListener('click', () => loadSkinUrl(urlInput.value));
        fileBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) handleSkinFile(fileInput.files[0]);
        });
        dropZone.addEventListener('dragover', e => {
            e.preventDefault();
            dropZone.style.borderColor = C.green;
            dropZone.style.backgroundColor = 'rgba(84,200,0,0.1)';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = C.yellow;
            dropZone.style.backgroundColor = 'rgba(255,255,255,0.5)';
        });
        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            dropZone.style.borderColor = C.yellow;
            dropZone.style.backgroundColor = 'rgba(255,255,255,0.5)';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSkinFile(e.dataTransfer.files[0]);
        });

        // Hover effects
        [fileBtn, urlBtn].forEach(btn => {
            const orig = btn.style.backgroundColor;
            btn.addEventListener('mouseover', () => btn.style.opacity = '0.85');
            btn.addEventListener('mouseout', () => btn.style.opacity = '1');
        });

        // Draggable
        makeSkinDraggable(container, header);
        return container;
    }

    function loadSkinUrl(url) {
        if (!url || !/^https?:\/\/.+\..+/i.test(url)) { alert('Please enter a valid URL'); return; }
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => { showSkinPreview(img.src); drawSkinToCanvas(img); };
        img.onerror = () => alert('Error loading image. URL may be invalid or CORS-blocked.');
        img.src = url;
    }

    function handleSkinFile(file) {
        if (!file || !file.type.startsWith('image/')) { alert('Please select a valid image file'); return; }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => { showSkinPreview(e.target.result); drawSkinToCanvas(img); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showSkinPreview(src) {
        const preview = document.getElementById('lm-skin-preview');
        if (!preview) return;
        preview.src = src;
        preview.parentElement.style.display = 'block';
    }

    function drawSkinToCanvas(img) {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) { console.error('[IO Toolkit] Skin editor canvas not found'); return; }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale, h = img.height * scale;
        const x = (canvas.width - w) / 2, y = (canvas.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        canvas.dispatchEvent(new Event('change', { bubbles: true }));
        try { if (window.drawApp && typeof window.drawApp.render === 'function') window.drawApp.render(true); } catch(e) {}
    }

    function makeSkinDraggable(el, handle) {
        let x2 = 0, y2 = 0;
        handle.style.cursor = 'move';
        handle.onmousedown = e => {
            e.preventDefault();
            x2 = e.clientX; y2 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = ev => {
                ev.preventDefault();
                el.style.top = (el.offsetTop - (y2 - ev.clientY)) + 'px';
                el.style.left = (el.offsetLeft - (x2 - ev.clientX)) + 'px';
                el.style.right = 'auto';
                x2 = ev.clientX; y2 = ev.clientY;
            };
        };
    }

})();
