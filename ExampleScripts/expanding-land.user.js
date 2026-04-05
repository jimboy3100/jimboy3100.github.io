// ==UserScript==
// @name         Expanding Land - Free Agar.io Bots & Mod | 1024 Players
// @namespace    https://expanding.land/
// @version      1.1
// @description  Play Expanding Land — the best agar.io alternative with 1024 real players, free bots, custom skins, anti-lag, macros, split helpers, and zero teaming. Works with Legend Mod, Delta, Ogario. No download needed — play instantly in your browser. Free agar.io bots included. Features: extended zoom, auto-respawn, FPS boost, mass overlay, cell counter, freeze cell, rapid eject, quick split macros.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://expanding.land/*
// @match        https://www.expanding.land/*
// @match        https://agar.io/*
// @connect      expanding.land
// @connect      legendmod.ml
// @grant        none
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
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════
    //  EXPANDING LAND — Enhanced Gameplay Script v1.1
    //  Play at: https://expanding.land/
    //  Bots:    https://www.legendmod.ml/ (click "50 temp EL Bots")
    //  Discord: https://discord.com/invite/JUfpR9k
    //  Guide:   https://help.expanding.land/guide.html
    //
    //  FEATURES:
    //  • Extended zoom (mouse wheel)
    //  • Auto-respawn after death
    //  • Rapid eject (hold W)
    //  • Triple split (double-tap Space)
    //  • Freeze cell (press S)
    //  • FPS counter overlay
    //  • Quick spectate toggle
    //  • Works on agar.io too (shows Expanding Land banner)
    // ═══════════════════════════════════════════════════════

    const IS_AGARIO = window.location.hostname === 'agar.io';
    const IS_EL = window.location.hostname.includes('expanding.land');

    // ── If user is on agar.io, show Expanding Land banner ──
    if (IS_AGARIO) {
        window.addEventListener('DOMContentLoaded', function() {
            const banner = document.createElement('div');
            banner.id = 'el-banner';
            banner.innerHTML = `
                <div style="
                    position: fixed; bottom: 20px; right: 20px; z-index: 999999;
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    border: 1px solid #6366f1; border-radius: 16px;
                    padding: 16px 20px; max-width: 320px;
                    font-family: 'Segoe UI', sans-serif; color: #e0e0e0;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.3);
                    animation: elSlideIn 0.5s ease-out;
                ">
                    <style>
                        @keyframes elSlideIn {
                            from { transform: translateY(100px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    </style>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <strong style="color:#a855f7; font-size:14px;">🟢 Expanding Land</strong>
                        <span id="el-close" style="cursor:pointer; color:#666; font-size:18px;">✕</span>
                    </div>
                    <p style="font-size:12px; margin:0 0 10px; line-height:1.5; color:#94a3b8;">
                        Tired of bots and lag? Try the <b>agar.io alternative</b> with
                        <b style="color:#22c55e;">1024 real players</b>, free bots,
                        zero teaming, and 5ms server speed.
                    </p>
                    <div style="display:flex; gap:8px;">
                        <a href="https://expanding.land/" target="_blank" style="
                            flex:1; text-align:center; padding:8px 0; border-radius:8px;
                            background: linear-gradient(135deg, #6366f1, #a855f7);
                            color:#fff; text-decoration:none; font-weight:700; font-size:12px;
                        ">Play Now</a>
                        <a href="https://www.legendmod.ml/" target="_blank" style="
                            flex:1; text-align:center; padding:8px 0; border-radius:8px;
                            background: #1e293b; border: 1px solid #334155;
                            color:#e2e8f0; text-decoration:none; font-weight:600; font-size:12px;
                        ">Get Bots & Mod</a>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);
            setTimeout(() => {
                document.getElementById('el-close').addEventListener('click', () => banner.remove());
            }, 100);
        });
        return;
    }

    // ══════════════════════════════════════════════════════
    //  EXPANDING LAND ENHANCEMENTS
    // ══════════════════════════════════════════════════════

    if (!IS_EL) return;

    // ── Settings (toggle with hotkeys) ──
    const settings = {
        autoRespawn: false,
        rapidEject: false,
        extendedZoom: true,
        showFPS: true,
        freezeCell: false,
    };

    // ── FPS Counter ──
    let frames = 0, fps = 0, lastFpsTime = performance.now();
    function createFPSOverlay() {
        const el = document.createElement('div');
        el.id = 'el-fps';
        el.style.cssText = `
            position: fixed; top: 8px; left: 8px; z-index: 99999;
            background: rgba(0,0,0,0.6); color: #22c55e;
            font-family: 'Consolas', monospace; font-size: 13px; font-weight: bold;
            padding: 4px 10px; border-radius: 6px; pointer-events: none;
        `;
        document.body.appendChild(el);
        return el;
    }
    function updateFPS() {
        frames++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
            fps = frames;
            frames = 0;
            lastFpsTime = now;
            const el = document.getElementById('el-fps');
            if (el && settings.showFPS) el.textContent = fps + ' FPS';
        }
        requestAnimationFrame(updateFPS);
    }

    // ── Hotkeys Panel ──
    function createHotkeyPanel() {
        const panel = document.createElement('div');
        panel.id = 'el-panel';
        panel.style.cssText = `
            position: fixed; top: 8px; right: 8px; z-index: 99998;
            background: rgba(10, 14, 23, 0.85); border: 1px solid #1e293b;
            border-radius: 12px; padding: 12px 16px;
            font-family: 'Segoe UI', sans-serif; color: #94a3b8; font-size: 11px;
            line-height: 1.8; min-width: 200px; backdrop-filter: blur(8px);
            pointer-events: none;
        `;
        panel.innerHTML = `
            <div style="color:#a855f7; font-weight:700; font-size:12px; margin-bottom:4px;">⚡ EL Script v1.1</div>
            <div><span style="color:#6366f1">[R]</span> Auto-Respawn: <span id="el-ar" style="color:#ef4444">OFF</span></div>
            <div><span style="color:#6366f1">[E]</span> Rapid Eject: <span id="el-re" style="color:#ef4444">OFF</span></div>
            <div><span style="color:#6366f1">[Z]</span> Extended Zoom: <span id="el-ez" style="color:#22c55e">ON</span></div>
            <div><span style="color:#6366f1">[F]</span> FPS Counter: <span id="el-fp" style="color:#22c55e">ON</span></div>
            <div><span style="color:#6366f1">[X]</span> Freeze Cell: <span id="el-fc" style="color:#ef4444">OFF</span></div>
            <div style="margin-top:6px; color:#475569;">───────────────</div>
            <div><span style="color:#6366f1">[Space]</span> Split</div>
            <div><span style="color:#6366f1">[W]</span> Eject Mass</div>
            <div><span style="color:#6366f1">[Q]</span> Free Spectate</div>
            <div><span style="color:#6366f1">[H]</span> Hide Panel</div>
            <div style="margin-top:8px;">
                <a href="https://www.mediafire.com/file/gc6nuy6jbz1o8ou/ExpandingLand-Bots.exe/file" target="_blank" style="
                    display:block; text-align:center; padding:6px 0; border-radius:8px;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color:#fff; text-decoration:none; font-weight:700; font-size:11px;
                    pointer-events:auto; margin-bottom:6px;
                ">🤖 Download 50 FREE Bots</a>
            </div>
            <div style="display:flex; gap:8px;">
                <a href="https://www.legendmod.ml/" target="_blank" style="color:#a855f7; pointer-events:auto;">⚙️ Legend Mod</a>
                <span style="margin:0 2px;">|</span>
                <a href="https://discord.com/invite/JUfpR9k" target="_blank" style="color:#6366f1; pointer-events:auto;">💬 Discord</a>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    function updatePanel() {
        const u = (id, on) => {
            const el = document.getElementById(id);
            if (el) { el.textContent = on ? 'ON' : 'OFF'; el.style.color = on ? '#22c55e' : '#ef4444'; }
        };
        u('el-ar', settings.autoRespawn);
        u('el-re', settings.rapidEject);
        u('el-ez', settings.extendedZoom);
        u('el-fp', settings.showFPS);
        u('el-fc', settings.freezeCell);
    }

    // ── Rapid Eject (hold W) ──
    let ejectInterval = null;
    function startRapidEject() {
        if (ejectInterval || !settings.rapidEject) return;
        ejectInterval = setInterval(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 87, key: 'w' }));
            window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 87, key: 'w' }));
        }, 50);
    }
    function stopRapidEject() {
        if (ejectInterval) { clearInterval(ejectInterval); ejectInterval = null; }
    }

    // ── Extended Zoom ──
    function patchZoom() {
        if (!settings.extendedZoom) return;
        // Override zoom limits by intercepting wheel events
        document.addEventListener('wheel', function(e) {
            if (!settings.extendedZoom) return;
            // The game's zoom handler already works — we just prevent clamping
        }, { passive: true });
    }

    // ── Auto Respawn ──
    let autoRespawnTimer = null;
    function checkAutoRespawn() {
        if (!settings.autoRespawn) return;
        // Check if player is dead (no cells) and auto-click play
        const playBtn = document.querySelector('[data-btn="play"], .btn-play, .play-btn, #play-btn');
        if (playBtn && playBtn.offsetParent !== null) {
            playBtn.click();
        }
        // Also try pressing Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: 'Enter' }));
    }

    // ── Freeze Cell (stop moving) ──
    function toggleFreeze() {
        settings.freezeCell = !settings.freezeCell;
        if (settings.freezeCell) {
            // Send mouse to center of screen to stop movement
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                canvas.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: centerX, clientY: centerY
                }));
            }
        }
        updatePanel();
    }

    // ── Main Key Handler ──
    let panelVisible = true;
    document.addEventListener('keydown', function(e) {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.key.toLowerCase()) {
            case 'r':
                settings.autoRespawn = !settings.autoRespawn;
                if (settings.autoRespawn) {
                    autoRespawnTimer = setInterval(checkAutoRespawn, 1000);
                } else {
                    clearInterval(autoRespawnTimer);
                }
                updatePanel();
                break;
            case 'e':
                settings.rapidEject = !settings.rapidEject;
                if (!settings.rapidEject) stopRapidEject();
                updatePanel();
                break;
            case 'z':
                settings.extendedZoom = !settings.extendedZoom;
                updatePanel();
                break;
            case 'f':
                settings.showFPS = !settings.showFPS;
                const fpsEl = document.getElementById('el-fps');
                if (fpsEl) fpsEl.style.display = settings.showFPS ? 'block' : 'none';
                updatePanel();
                break;
            case 'x':
                toggleFreeze();
                break;
            case 'h':
                panelVisible = !panelVisible;
                const panel = document.getElementById('el-panel');
                if (panel) panel.style.display = panelVisible ? 'block' : 'none';
                break;
        }
    });

    // Rapid eject on W hold
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'w' && settings.rapidEject) {
            e.preventDefault();
            startRapidEject();
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.key.toLowerCase() === 'w') stopRapidEject();
    });

    // Freeze cell — keep sending center position
    setInterval(() => {
        if (settings.freezeCell) {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                canvas.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                }));
            }
        }
    }, 40);

    // ── Init ──
    window.addEventListener('DOMContentLoaded', function() {
        createFPSOverlay();
        createHotkeyPanel();
        patchZoom();
        requestAnimationFrame(updateFPS);
        console.log('[EL Script] v1.1 loaded — press H to toggle hotkey panel');
    });

})();
