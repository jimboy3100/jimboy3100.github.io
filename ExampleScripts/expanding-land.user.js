// ==UserScript==
// @name         Expanding Land - Free Agar.io Bots & Mod | 1024 Players
// @namespace    https://expanding.land/
// @version      1.0
// @description  Play Expanding Land — the best agar.io alternative with 1024 real players, free bots, custom skins, anti-lag, macros, split helpers, and zero teaming. Works with Legend Mod, Delta, Ogario. No download needed — play instantly in your browser. Free agar.io bots included.
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
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════
    //  EXPANDING LAND — Enhanced Gameplay Script
    //  Play at: https://expanding.land/
    //  Bots:    https://www.legendmod.ml/ (click "50 temp EL Bots")
    //  Discord: https://discord.com/invite/JUfpR9k
    //  Guide:   https://help.expanding.land/guide.html
    // ═══════════════════════════════════════════════════════

    const IS_AGARIO = window.location.hostname === 'agar.io';
    const IS_EL = window.location.hostname.includes('expanding.land');

    // ── If user is on agar.io, show them the Expanding Land option ──
    if (IS_AGARIO) {
        // Wait for page to load
        window.addEventListener('DOMContentLoaded', function() {
            // Create a non-intrusive banner
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
                        ">Get Bots</a>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);

            // Close button
            setTimeout(() => {
                document.getElementById('el-close').addEventListener('click', function() {
                    banner.remove();
                });
            }, 100);
        });
        return; // Don't run EL enhancements on agar.io
    }

    // ── Expanding Land enhancements ──
    if (IS_EL) {
        console.log('[Expanding Land Script] Loaded v1.0');
        console.log('[Expanding Land] Play: https://expanding.land/');
        console.log('[Expanding Land] Bots: https://www.legendmod.ml/');
        console.log('[Expanding Land] Discord: https://discord.com/invite/JUfpR9k');

        // Quick keyboard shortcuts info
        window.addEventListener('DOMContentLoaded', function() {
            console.log('[Expanding Land] Controls:');
            console.log('  Space = Split | W = Eject | Q = Free Spectate | S = Spectate');
            console.log('  For advanced macros, install Legend Mod:');
            console.log('  https://chromewebstore.google.com/detail/legend-express-agario-ext/nmkhchnpjlcnicfchpkhckidmmmondja');
        });
    }
})();
