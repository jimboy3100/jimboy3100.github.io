// ==UserScript==
// @name         Expanding Land - IO Games Mod | Free Bots, Macros, Auto-Respawn
// @namespace    https://expanding.land/
// @version      2.0
// @description  The ultimate IO games toolkit. Auto-fill nicknames, rapid eject, quad split, freeze cell, auto-respawn, FPS counter — works on Agar.io, MooMoo.io, Slither.io, Diep.io, Surviv.io, and 20+ IO games. Includes FREE 50 bots for Expanding Land (1024 real players limit per area). Best agario mod alternative.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://expanding.land/*
// @match        https://www.expanding.land/*
// @match        *://agar.io/*
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://surviv.io/*
// @match        *://slither.io/*
// @match        *://diep.io/*
// @match        *://zombs.io/*
// @match        *://krunker.io/*
// @match        *://shellshock.io/*
// @match        *://paper-io.com/*
// @match        *://hole-io.com/*
// @match        *://skribbl.io/*
// @match        *://ev.io/*
// @match        *://deeeep.io/*
// @match        *://florr.io/*
// @match        *://starve.io/*
// @match        *://sploop.io/*
// @match        *://yohoho.io/*
// @match        *://cellcraft.io/*
// @match        *://agma.io/*
// @match        *://agar.pro/*
// @match        *://germs.io/*
// @match        *://senpa.io/*
// @match        *://generals.io/*
// @match        *://evowars.io/*
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
// @tag          slither.io
// @tag          diep.io
// @tag          surviv.io
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
            'slither.io':       '#nick',
            'moomoo.io':        '#nameInput',
            'sandbox.moomoo.io':'#nameInput',
            'dev.moomoo.io':    '#nameInput',
            'surviv.io':        '#player-name-input-solo',
            'diep.io':          '#textInput',
            'starve.io':        '#nickname_input',
            'zombs.io':         '.hud-intro-name',
            'paper-io.com':     '#paperio_p1',
            'skribbl.io':       '#inputName',
            'sploop.io':        '#nickname',
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
        // For deeeep.io (class-based)
        if (host.includes('deeeep.io')) {
            const el = document.querySelector('.name input, input.name');
            if (el) el.value = savedName;
        }
        // For evowars.io (first input)
        if (host.includes('evowars.io')) {
            const el = document.querySelector('input');
            if (el) el.value = savedName;
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
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'io-panel';
        panel.style.cssText = `
            position: fixed; top: 8px; right: 8px; z-index: 999998;
            background: rgba(10,14,23,0.9); border: 1px solid #1e293b;
            border-radius: 12px; padding: 12px 16px;
            font-family: 'Segoe UI', Arial, sans-serif; color: #94a3b8; font-size: 11px;
            line-height: 1.9; min-width: 210px; backdrop-filter: blur(8px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        `;
        panel.innerHTML = `
            <div style="color:#a855f7; font-weight:700; font-size:13px; margin-bottom:6px;">
                ⚡ IO Toolkit v2.0
                <span style="color:#475569; font-weight:400; font-size:10px;"> by Expanding Land</span>
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
            <div><span style="color:#6366f1">[H]</span> Hide Panel</div>
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
        document.body.appendChild(panel);
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
                case 'h': // Hide panel
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

    // ── Init ──
    window.addEventListener('DOMContentLoaded', function() {
        createFPSOverlay();
        createPanel();
        requestAnimationFrame(tickFPS);

        // Auto-fill nickname after a short delay (wait for game UI to load)
        setTimeout(fillNickname, 2000);

        console.log('[IO Toolkit v2.0] Loaded — by Expanding Land');
        console.log('[IO Toolkit] Press H to toggle panel, Ctrl+` to fill name');
    });

})();
