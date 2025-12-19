// ==UserScript==
// @name         LmAddonForDelta
// @namespace    Jimboy3100 LegendMod
// @version      101.0
// @description  Imperial Overlord Elite: Integrated Flags, SNEZ Broadcaster (DM), Sovereign Join, and Discord "Play" Trigger.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://agar.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================================
    // [1. GLOBAL CONSTANTS & PALETTE]
    // ==========================================================================
    const SNEZ_WS_URL = "wss://agar.snez.org:63051/";
    const FLAG_CSS_LIB = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/css/flag-icon.min.css";
    const LOG_TAG = "[LM-OVERLORD] ";

    const THEME = {
        cyan: "#01d9cc",
        dark: "rgba(0, 10, 18, 0.98)",
        gold: "#f1c40f",
        red: "#ff3e3e",
        discord: "#7289da",
        border: "1px solid #01d9cc"
    };

    // ==========================================================================
    // [2. THE IMMUTABLE VAULT - CAPTURES URL BEFORE DELTA CLEANS IT]
    // ==========================================================================
    const START_URL = window.location.href;
    if (START_URL.includes('sip=')) {
        sessionStorage.setItem('LM_OVERLORD_VAULT_FINAL', START_URL);
    }
    const URL_VAULT = sessionStorage.getItem('LM_OVERLORD_VAULT_FINAL') || START_URL;

    window.originalURL = URL_VAULT;
    try {
        Object.defineProperty(window, 'url', { get: () => URL_VAULT, configurable: false });
        Object.defineProperty(window, 'originalURL', { get: () => URL_VAULT, configurable: false });
    } catch (e) { window.url = URL_VAULT; }

    // ==========================================================================
    // [3. MASTER STATE]
    // ==========================================================================
    const LM_MASTER = {
        socket: null,
        playerCache: [],
        lastBroadcast: "",
        searching: false,
        myCountryCode: "un",
        onlineCount: 0,
        joinInProgress: false,
        discord: {
            webhook1: localStorage.getItem("discwebhook1") || "",
            webhook2: localStorage.getItem("discwebhook2") || "",
            autoSend: localStorage.getItem("lmAutoDiscord") === "true"
        }
    };

    // ==========================================================================
    // [4. DISCORD & FLAG UTILS]
    // ==========================================================================
    function isValidWebhook(url) { return /^(https?):\/\/(discord|discordapp)\.com\/api\/webhooks\/[^\s]+$/.test(url); }

    window.sendServerToDiscord = function(customToken = null, customRegion = null, customMode = null) {
        const sip = customToken || document.querySelector('input[name="serverToken"]')?.value;
        const tag = document.querySelector('input[name="clantag"]')?.value || "None";
        const nick = document.querySelector('input[name="nickA"]')?.value || "Guest";
        const region = customRegion || document.querySelector('select[name="region"]')?.value || "Unknown";
        const mode = customMode || document.querySelector('select[name="gamemode"]')?.value || ":ffa";
        if (!sip) return;
        const lmSip = sip.includes(".") ? sip : `live-arena-${sip}.agar.io`;
        const joinLink = `${window.location.origin}${window.location.pathname}?sip=${lmSip}&pass=${tag}&?r=${region}&?m=${mode}`;

        const payload = {
            embeds: [{
                title: "🎮 Server Invite via Legend Mod",
                description: `**${nick}** is entering the game!`,
                color: 121150,
                fields: [
                    { name: "Server", value: `\`${sip}\``, inline: true },
                    { name: "Region", value: region, inline: true },
                    { name: "Mode", value: mode, inline: true },
                    { name: "Tag/Pass", value: `\`${tag}\``, inline: true },
                    { name: "Link", value: `[👉 Instant Join](${joinLink})` }
                ],
                footer: { text: "LM Imperial Overlord | Delta Mod Addon" },
                timestamp: new Date()
            }]
        };

        [LM_MASTER.discord.webhook1, LM_MASTER.discord.webhook2].forEach(wh => {
            if (isValidWebhook(wh)) {
                fetch(wh, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            }
        });
    };

    function getISO(code) {
        if (!code) return "un";
        let c = code.toLowerCase().trim();
        const map = { "turkey": "tr", "tk-turkey": "tr", "brazil": "br", "br-brazil": "br", "london": "gb", "eu-london": "gb", "atlanta": "us", "us-atlanta": "us", "russia": "ru", "ru-russia": "ru", "tokyo": "jp", "jp-tokyo": "jp", "china": "cn", "cn-china": "cn", "singapore": "sg", "sg-singapore": "sg" };
        if (map[c]) return map[c];
        if (c.length === 2) return c;
        if (c.includes('-')) return c.split('-')[0];
        return "un";
    }

    async function runGeo() {
        let nav = navigator.languages ? navigator.languages[0] : navigator.language;
        LM_MASTER.myCountryCode = (nav.includes('-') ? nav.split('-')[1] : nav).toLowerCase();
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data && data.country_code) LM_MASTER.myCountryCode = data.country_code.toLowerCase();
        } catch (err) { }
    }

    // ==========================================================================
    // [5. SOVEREIGN JOIN PIPELINE]
    // ==========================================================================
    function hijackUI(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return false;
        const isSelect = el instanceof HTMLSelectElement;
        const setter = Object.getOwnPropertyDescriptor(isSelect ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        if (isSelect) { for (let i = 0; i < el.options.length; i++) { if (el.options[i].value === value) { el.selectedIndex = i; break; } } }
        return true;
    }

    async function startSovereignJoin(region, mode, token) {
        if (LM_MASTER.joinInProgress) return;
        LM_MASTER.joinInProgress = true;
        hijackUI('select[name="region"]', region);
        hijackUI('select[name="gamemode"]', mode);
        await new Promise(r => setTimeout(r, 1200));
        hijackUI('input[name="serverToken"]', token);
        await new Promise(r => setTimeout(r, 200));
        hijackUI('input[name="serverToken"]', token);
        setTimeout(() => {
            const btn = document.querySelector('input[name="serverToken"]')?.closest('.flex.items-stretch')?.querySelector('button') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Connect'));
            if (btn) btn.click();
            LM_MASTER.joinInProgress = false;
        }, 500);
    }

    // ==========================================================================
    // [6. THE OVERLORD COMPACT HUD]
    // ==========================================================================
    function injectHUD() {
        if (document.getElementById('lm-over-root')) return;
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FLAG_CSS_LIB; document.head.appendChild(link);

        const css = `
            <style>
                #lm-over-root { font-family: 'Ubuntu', sans-serif; pointer-events: none; font-size: 13px; }
                .lm-win { background: ${THEME.dark}; border: ${THEME.border}; color: #fff; pointer-events: auto; border-radius: 8px; position: fixed; z-index: 10020; box-shadow: 0 0 40px #000; overflow: hidden; width: 600px; }
                .lm-bar { background: rgba(1, 217, 204, 0.1); padding: 10px; cursor: move; text-align: center; font-weight: bold; border-bottom: 1px solid #222; position: relative; }
                .lm-stats { background: #000; font-size: 10px; color: ${THEME.cyan}; padding: 3px; text-align: center; }
                .lm-main { padding: 15px; }
                .lm-search-box { display: flex; gap: 8px; margin-bottom: 12px; }
                .lm-in-pro { flex-grow: 1; background: #000; border: 1px solid #444; color: #fff; padding: 8px; text-align: center; font-size: 14px; border-radius: 4px; outline: none; }
                .lm-in-pro:focus { border-color: ${THEME.cyan}; }
                .lm-btn-s { background: ${THEME.cyan}; color: #000; border: none; font-weight: bold; border-radius: 4px; padding: 0 15px; cursor: pointer; height: 38px; }
                .lm-log { height: 320px; overflow-y: scroll; background: rgba(0,0,0,0.3); border: 1px solid #111; border-radius: 4px; }
                .lm-row { padding: 8px 12px; border-bottom: 1px solid #222; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
                .lm-row:hover { background: rgba(1, 217, 204, 0.1); }
                .lm-ds-icon { color: ${THEME.discord}; font-size: 18px; cursor: pointer; margin-left: 8px; }

                /* Footer Flexbox Fix */
                .lm-footer { padding: 12px 15px; border-top: 1px solid #222; background: #050505; display: flex; flex-direction: column; gap: 8px; }
                .lm-wh-row { display: flex; align-items: center; gap: 10px; width: 100%; }
                .lm-wh-in { flex-grow: 1; background: #000; border: 1px solid #333; color: ${THEME.discord}; padding: 6px; font-size: 11px; border-radius: 3px; outline: none; }
                .lm-wh-in:focus { border-color: ${THEME.discord}; }
                .lm-help-btn { color: ${THEME.gold}; font-weight: bold; font-size: 18px; cursor: pointer; user-select: none; width: 20px; text-align: center; }

                .lm-x { position: absolute; right: 10px; top: 8px; cursor: pointer; color: ${THEME.red}; font-size: 20px; }
                .lm-help-panel { position: absolute; top: 40px; left: 10px; right: 10px; bottom: 10px; background: ${THEME.dark}; border: 1px solid ${THEME.gold}; padding: 15px; z-index: 10025; display: none; overflow-y: auto; text-shadow:none; }
            </style>
        `;

        const html = `
            <div id="lm-over-root">
                <div id="lm-shade" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10019;"></div>
                <div id="lm-main-win" class="lm-win" style="display:none; top: 15%; left: 50%; transform: translateX(-50%);">
                    <div class="lm-bar" id="lm-drag">
                        <span class="lm-x" id="lm-quit">×</span>
                        Legend Mod Empire Overlord
                    </div>
                    <div class="lm-stats" id="lm-st-online">Network Online...</div>
                    <div class="lm-main">
                        <div class="lm-search-box">
                            <input id="lm-search-in" class="lm-in-pro" placeholder="Player, Tag, or Token...">
                            <button id="lm-search-btn" class="lm-btn-s">SEARCH</button>
                        </div>
                        <div id="lm-log" class="lm-log">
                            <div style="text-align:center; color:#333; padding-top:140px;">Network active. Start typing.</div>
                        </div>
                        <div id="lm-h-panel" class="lm-help-panel">
                            <h4 style="color:${THEME.gold}; margin-top:0;">Discord Webhook Guide</h4>
                            <p><b>1.</b> Open Discord, go to <b>Server Settings</b>.</p>
                            <p><b>2.</b> Click <b>Integrations</b> then <b>Webhooks</b>.</p>
                            <p><b>3.</b> Click <b>New Webhook</b> and <b>Copy Webhook URL</b>.</p>
                            <p><b>4.</b> Paste the URL into the boxes below.</p>
                            <p><b>5.</b> Use the Discord icon <i class="fa fa-discord"></i> next to players to share them!</p>
                            <button id="lm-h-close" class="lm-btn-s" style="width:100%;">Got it!</button>
                        </div>
                    </div>
                    <div class="lm-footer">
                        <div class="lm-wh-row">
                            <span class="lm-help-btn" id="lm-help">?</span>
                            <input id="lm-wh1" class="lm-wh-in" placeholder="Discord Webhook URL 1" value="${LM_MASTER.discord.webhook1}">
                        </div>
                        <input id="lm-wh2" class="lm-wh-in" style="margin-left: 30px; width: calc(100% - 30px);" placeholder="Discord Webhook URL 2" value="${LM_MASTER.discord.webhook2}">
                        <label style="font-size:10px; color:#666; margin-left: 30px;"><input type="checkbox" id="lm-auto-d" ${LM_MASTER.discord.autoSend ? 'checked' : ''}> Auto-post to Discord on "Play"</label>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', css + html);

        // Bind events
        document.getElementById('lm-search-in').oninput = () => {
            LM_MASTER.searching = true; refreshHUD();
            if (LM_MASTER.socket?.readyState === 1) LM_MASTER.socket.send(JSON.stringify({ type: "get_players" }));
        };
        document.getElementById('lm-help').onclick = () => document.getElementById('lm-h-panel').style.display = 'block';
        document.getElementById('lm-h-close').onclick = () => document.getElementById('lm-h-panel').style.display = 'none';
        document.getElementById('lm-quit').onclick = hideUI;

        ['lm-wh1', 'lm-wh2'].forEach((id, i) => {
            document.getElementById(id).onblur = (e) => {
                localStorage.setItem(`discwebhook${i+1}`, e.target.value);
                LM_MASTER.discord[`webhook${i+1}`] = e.target.value;
            };
        });
        document.getElementById('lm-auto-d').onchange = (e) => {
            localStorage.setItem("lmAutoDiscord", e.target.checked);
            LM_MASTER.discord.autoSend = e.target.checked;
        };

        setupDragging(document.getElementById('lm-main-win'), document.getElementById('lm-drag'));
    }

    function refreshHUD() {
        const query = document.getElementById('lm-search-in').value.toLowerCase();
        const log = document.getElementById('lm-log');
        if (!query) { log.innerHTML = '<div style="text-align:center; color:#333; padding-top:140px;">Network active. Start typing.</div>'; return; }
        log.innerHTML = "";
        let found = 0;

        LM_MASTER.playerCache.forEach(p => {
            if ((p.nickname || "").toLowerCase().includes(query) || (p.tag || "").toLowerCase().includes(query) || (p.server || "").includes(query)) {
                found++;
                const srv = p.server || "";
                const token = srv.split('live-arena-').pop().split('.agar.io')[0];
                const region = (new RegExp('[\\?&]\\??r=([^&#]*)').exec(srv)?.[1]) || "Unknown";
                const mode = (new RegExp('[\\?&]\\??m=([^&#]*)').exec(srv)?.[1]) || ":ffa";
                const iso = getISO(p.country || p.c || p.loc || "un");

                const row = document.createElement('div');
                row.className = 'lm-row';
                row.innerHTML = `
                    <div style="display:flex; align-items:center;">
                        <span class="flag-icon flag-icon-${iso}" style="font-size:20px; margin-right:12px;"></span>
                        <div><b>${p.nickname}</b><br><small style="color:#666;">${region} • ${mode}</small></div>
                    </div>
                    <div style="text-align:right; display:flex; align-items:center;">
                        <div><b style="color:${THEME.gold}; font-family:monospace;">${token}</b><br><small style="color:#444;">Lvl ${p.agarioLEVEL || '?'}</small></div>
                        <i class="fa fa-discord lm-ds-icon"></i>
                    </div>
                `;
                row.querySelector('.lm-ds-icon').onclick = (e) => { e.stopPropagation(); window.sendServerToDiscord(token, region, mode); };
                row.onclick = () => { hideUI(); startSovereignJoin(region, mode, token); };
                log.appendChild(row);
            }
        });
    }

    function hideUI() { document.getElementById('lm-shade').style.display = 'none'; document.getElementById('lm-main-win').style.display = 'none'; LM_MASTER.searching = false; }
    function setupDragging(el, h) { let x1=0,y1=0,x2=0,y2=0; h.onmousedown=(e)=>{ e.preventDefault(); x2=e.clientX; y2=e.clientY; document.onmouseup=()=>{document.onmouseup=null;document.onmousemove=null;}; document.onmousemove=(e)=>{e.preventDefault(); x1=x2-e.clientX; y1=y2-e.clientY; x2=e.clientX; y2=e.clientY; el.style.top=(el.offsetTop-y1)+"px"; el.style.left=(el.offsetLeft-x1)+"px"; el.style.transform="none";};}; }

    // ==========================================================================
    // [7. NETWORK & BROADCASTER]
    // ==========================================================================
    function initNetwork() {
        if (LM_MASTER.socket?.readyState === 1) return;
        LM_MASTER.socket = new WebSocket(SNEZ_WS_URL);
        LM_MASTER.socket.onopen = () => {
            setInterval(() => {
                const sip = document.querySelector('input[name="serverToken"]')?.value;
                if (!sip) return;
                const payload = { type: "update_details", data: {
                    nickname: (document.querySelector('input[name="nickA"]')?.value || "Unnamed") + " (DM)",
                    server: `live-arena-${sip}.agar.io&?r=${document.querySelector('select[name="region"]')?.value}&?m=${document.querySelector('select[name="gamemode"]')?.value}`,
                    tag: document.querySelector('input[name="clantag"]')?.value || "",
                    agarioLEVEL: window.agarioLEVEL || 0, country: LM_MASTER.myCountryCode.toUpperCase()
                }};
                LM_MASTER.socket.send(JSON.stringify(payload));
            }, 10000);
            LM_MASTER.socket.send(JSON.stringify({ type: "get_players" }));
        };
        LM_MASTER.socket.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (data.type === "players_list") {
                LM_MASTER.playerCache = JSON.parse(data.data);
                const countLabel = document.getElementById('lm-st-online');
                if (countLabel) countLabel.innerText = `Network Online: ${LM_MASTER.playerCache.length} players`;
                if (LM_MASTER.searching) refreshHUD();
            }
        };
        LM_MASTER.socket.onclose = () => setTimeout(initNetwork, 5000);
    }

    // ==========================================================================
    // [8. STARTUP & ADRES SYNC]
    // ==========================================================================
    window.syncAdres = function() {
        const t = document.querySelector('input[name="serverToken"]')?.value;
        const g = document.querySelector('input[name="clantag"]')?.value;
        const r = document.querySelector('select[name="region"]')?.value;
        const m = document.querySelector('select[name="gamemode"]')?.value;
        if (!t || t.length < 3 || LM_MASTER.joinInProgress) return;
        const u = window.location.origin + window.location.pathname + "?sip=live-arena-" + t + ".agar.io" + (g?"&pass="+g:"") + (r?"&?r="+r:"") + (m?"&?m="+m:"");
        if (window.location.href !== u) window.history.replaceState(null, "", u);
    };

    const boot = setInterval(() => {
        if (document.querySelector('select[name="region"]') && document.querySelector('input[name="serverToken"]')) {
            clearInterval(boot); injectHUD(); runGeo().then(() => {
                setTimeout(() => {
                    const sip = (new RegExp('[\\?&]\\??sip=([^&#]*)').exec(URL_VAULT)?.[1]) || "";
                    const reg = (new RegExp('[\\?&]\\??r=([^&#]*)').exec(URL_VAULT)?.[1]) || "";
                    const mod = (new RegExp('[\\?&]\\??m=([^&#]*)').exec(URL_VAULT)?.[1]) || "";
                    const pss = (new RegExp('[\\?&]\\??pass=([^&#]*)').exec(URL_VAULT)?.[1]) || "";
                    if (sip && reg && mod) startSovereignJoin(reg, mod, sip.replace("live-arena-", "").replace(".agar.io", ""));
                    if (pss) hijackUI('input[name="clantag"]', pss);
                    initNetwork();

                    // --- LISTENERS ---
                    document.addEventListener('keydown', (e) => {
                        if (e.keyCode === 8 && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
                            e.preventDefault(); document.getElementById('lm-shade').style.display = 'block'; document.getElementById('lm-main-win').style.display = 'block'; document.getElementById('lm-search-in').focus();
                        }
                    });

                    // THE PLAY BUTTON TRIGGER
                    document.addEventListener('click', (e) => {
                        const target = e.target.closest('.btn-layer');
                        if (target && target.innerText.trim() === "Play") {
                            if (LM_MASTER.discord.autoSend) {
                                console.log(LOG_TAG + "Play clicked. Sending to Discord...");
                                window.sendServerToDiscord();
                            }
                        }
                    }, true);

                    document.addEventListener('change', (e) => { if (['region', 'gamemode', 'clantag', 'serverToken'].includes(e.target.name)) setTimeout(window.syncAdres, 100); }, true);
                    setInterval(window.syncAdres, 3500);
                }, 1200);
            });
        }
    }, 500);
})();
