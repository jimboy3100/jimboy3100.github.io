// ==UserScript==
// @name         LmAddonForDelta
// @namespace    Jimboy3100 LegendMod
// @version      101.7
// @description  Imperial Overlord Elite: Integrated Flags, SNEZ Broadcaster (DM), Sovereign Join, Discord "Play" Trigger with Custom Skin Thumbnail.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://agar.io/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      lmsettings.snez.org
// @connect      agar.snez.org
// @connect      discord.com
// @connect      discordapp.com
// @connect      ipapi.co
// @run-at       document-start
// ==/UserScript==

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
win.LOG_TAG = "[LM-OVERLORD] ";
win.FALLBACK_ICON = "https://deltav4.gitlab.io/v7/assets/map-logo-old.png";
win.SNEZ_WS_URL = "wss://agar.snez.org:63051/";
win.FLAG_CSS_LIB = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/css/flag-icon.min.css";
// 1. Initializer (Put this near the top of your script)
win
    .LM_Session = {
    current: { nick: "", tag: "", server: "", region: "", mode: "" },
    history: JSON.parse(localStorage.getItem("LM_Server_History") || "[]")
};
// 2. Listener (Put this inside your listeners section)
document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn-layer');
    if (target && target.innerText.trim() === "Play") {
        const sipVal = document.querySelector('input[name="serverToken"]')?.value;
        const tagVal = document.querySelector('input[name="clantag"]')?.value || "";
        const nickVal = document.querySelector('input[name="nickA"]')?.value || "Guest";
        const regVal = document.querySelector('select[name="region"]')?.value || "Unknown";
        const modVal = document.querySelector('select[name="gamemode"]')?.value || ":ffa";

        // Logic: Same server only updates current data. New server pushes old current to history.
        if (win
            .LM_Session.current.server === sipVal) {
            win
                .LM_Session.current.nick = nickVal;
            win
                .LM_Session.current.tag = tagVal;
        } else {
            if (win
                .LM_Session.current.server) {
                win
                    .LM_Session.history.unshift({...win
                        .LM_Session.current});
                if (win
                    .LM_Session.history.length > 10) win
                    .LM_Session.history.pop();
            }
            win
                .LM_Session.current = { nick: nickVal, tag: tagVal, server: sipVal, region: regVal, mode: modVal, time: new Date().toLocaleString() };
        }

        localStorage.setItem("LM_Server_History", JSON.stringify(win
            .LM_Session.history));

        if (typeof LM_MASTER !== 'undefined' && LM_MASTER.discord.autoSend) {
            win
                .sendServerToDiscord();
        }
    }
}, true);

win.rejoinLastServer = function() {
    // Check if Delta app exists and get the real connected token, otherwise empty string
    const realConnectedToken = win.app && win.app.server ? win.app.server.serverToken : "";

    // Check against our stored session (Corrected structure to LM_Session.current.server)
    if (realConnectedToken !== win.LM_Session.current.server) {
        const history = win.LM_Session.history;

        if (history && history.length > 0) {
            const last = history[0]; // Get the first element of history

            console.log(win.LOG_TAG + "Restoring Session from History: " + last.server);

            // 1. Make the history item the 'current' session
            win.LM_Session.current = {
                nick: last.nick,
                tag: last.tag,
                server: last.server,
                region: last.region,
                mode: last.mode,
                time: new Date().toLocaleString()
            };

            // 2. Visually update Nickname and Tag inputs (since startSovereignJoin doesn't handle these)
            // We use the hijackUI helper function defined in your script
            if (typeof hijackUI === 'function') {
                hijackUI('input[name="nickA"]', last.nick);
                hijackUI('input[name="clantag"]', last.tag);
            }

            // 3. Connect using the Region, Mode, and Server from history
            if (typeof win.startSovereignJoin === 'function') {
                win.startSovereignJoin(last.region, last.mode, last.server);
            } else if (typeof startSovereignJoin === 'function') {
                startSovereignJoin(last.region, last.mode, last.server);
            }

            if (win.toastr) win.toastr.success("[LM] Session restored from history.");
        } else {
            if (win.toastr) win.toastr.warning("[LM] No history found to restore.");
        }
    } else {
        // Fallback: If tokens match, just rejoin the last history item normally
        const history = win.LM_Session.history;
        if (history && history.length > 0) {
            const last = history[0];
            if (typeof win.startSovereignJoin === 'function') {
                win.startSovereignJoin(last.region, last.mode, last.server);
            }
        }
    }
};
win.injectHistoryButton = function() {
    const serverInput = document.querySelector('input[name="serverToken"]');
    if (!serverInput || document.getElementById('lm-rejoin-btn')) return;

    // Direct path: input -> input-box -> column (w-8/12)
    const inputCol = serverInput.parentElement.parentElement;
    const btnCol = inputCol?.nextElementSibling; // column (w-4/12)

    if (!inputCol || !btnCol) return;

    // Force widths using style.width to stay inside the border
    inputCol.style.setProperty('width', '58%', 'important');
    btnCol.style.setProperty('width', '42%', 'important');
    btnCol.style.display = 'flex';
    btnCol.style.gap = '4px';

    const connectBtn = btnCol.querySelector('button');
    if (connectBtn) {
        connectBtn.style.flex = "2";
        connectBtn.style.width = "auto";
        connectBtn.style.padding = "0px";
    }

    const rejoinBtn = document.createElement('button');
    rejoinBtn.id = 'lm-rejoin-btn';
    rejoinBtn.className = connectBtn ? connectBtn.className : "btn";
    rejoinBtn.style.flex = "1";
    rejoinBtn.style.minWidth = "35px";
    rejoinBtn.style.cursor = "pointer";
    rejoinBtn.style.pointerEvents = "auto"; // Fixes "unclickable" issue
    rejoinBtn.innerHTML = '<i class="fas fa-history"></i>';
    rejoinBtn.title = "Rejoin Last Played Server";

    // Re-linking the click event properly
    rejoinBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        win.rejoinLastServer();
    };

    btnCol.appendChild(rejoinBtn);
};
(function() {
    'use strict';

    // ==========================================================================
    // [1. GLOBAL CONSTANTS & PALETTE]
    // ==========================================================================



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

    win
        .originalURL = URL_VAULT;
    try {
        Object.defineProperty(win
            , 'url', { get: () => URL_VAULT, configurable: false });
        Object.defineProperty(win
            , 'originalURL', { get: () => URL_VAULT, configurable: false });
    } catch (e) { win
        .url = URL_VAULT; }

    // ==========================================================================
    // [3. MASTER STATE]
    // ==========================================================================
    win
        .LM_MASTER = {
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

    win
        .sendServerToDiscord = function(customToken = null, customRegion = null, customMode = null) {
        // If manual skin is empty or too short, use the avatar for the thumbnail too
        const sip = customToken || document.querySelector('input[name="serverToken"]')?.value;
        const tag = document.querySelector('input[name="clantag"]')?.value || "";
        const nick = document.querySelector('input[name="nickA"]')?.value || "Guest";
        const region = customRegion || document.querySelector('select[name="region"]')?.value || "Unknown";
        const mode = customMode || document.querySelector('select[name="gamemode"]')?.value || ":ffa";
        // If manual skin is empty or too short, use the avatar for the thumbnail too

        // 1. Detect Profile Avatar (Left Icon) or use Fallback
        const avatarIcon = document.querySelector('img.avatar')?.src || win.FALLBACK_ICON;

        // 2. Detect Manual Skin URL (Top Right Icon)
        const manualSkin = document.querySelector('input[name="skinA"]')?.value ||
            document.querySelector('input[name="skinB"]')?.value;

        const thumbnailIcon = (manualSkin && manualSkin.length > 10) ? manualSkin : avatarIcon;

        if (!sip) return;
        const lmSip = sip.includes(".") ? sip : `live-arena-${sip}.agar.io`;
        const joinLink = `${win
            .location.origin}${win
            .location.pathname}?sip=${lmSip}&pass=${tag}&?r=${region}&?m=${mode}`;

        const payload = {
            embeds: [{
                author: {
                    name: `${nick} is entering the game!`,
                    icon_url: avatarIcon
                },
                title: "🎮 Server Invite via Legend Mod",
                color: 121150,
                thumbnail: {
                    url: thumbnailIcon
                },
                fields: [
                    { name: "Server", value: `\`${sip}\``, inline: true },
                    { name: "Region", value: region, inline: true },
                    { name: "Mode", value: mode, inline: true },
                    { name: "Tag/Pass", value: tag ? `\`${tag}\`` : "`None`" , inline: true },
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
        const setter = Object.getOwnPropertyDescriptor(isSelect ? win
            .HTMLSelectElement.prototype : win
            .HTMLInputElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        if (isSelect) { for (let i = 0; i < el.options.length; i++) { if (el.options[i].value === value) { el.selectedIndex = i; break; } } }
        return true;
    }

    win
        .startSovereignJoin = async function(region, mode, token) {
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
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = win.FLAG_CSS_LIB; document.head.appendChild(link);

        const css = `
            <style>
                #lm-over-root { font-family: 'Ubuntu', sans-serif; pointer-events: none; font-size: 13px; }
                .lm-win { background: ${THEME.dark}; border: 1px solid ${THEME.border}; color: #fff; pointer-events: auto; border-radius: 8px; position: fixed; z-index: 10020; box-shadow: 0 0 40px #000; overflow: hidden; width: 600px; }
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

                .lm-footer { padding: 12px 15px; border-top: 1px solid #222; background: #050505; display: flex; flex-direction: column; gap: 8px; }
                .lm-wh-row { display: flex; align-items: center; gap: 10px; width: 100%; }
                .lm-wh-in { flex-grow: 1; background: #000; border: 1px solid #333; color: ${THEME.discord}; padding: 6px; font-size: 11px; border-radius: 3px; outline: none; }
                .lm-wh-in:focus { border-color: ${THEME.discord}; }
                .lm-help-btn { color: ${THEME.gold}; font-weight: bold; font-size: 18px; cursor: pointer; user-select: none; width: 20px; text-align: center; }

                .lm-x { position: absolute; right: 10px; top: 8px; cursor: pointer; color: ${THEME.red}; font-size: 20px; }
.lm-h-panel { position: absolute; top: 40px; left: 10px; right: 10px; bottom: 10px; background: ${THEME.dark}; border: 1px solid ${THEME.gold}; padding: 15px; z-index: 10025; display: none; overflow-y: auto; text-shadow:none; font-size: 13px; }
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
                        <div><b style="color:${THEME.gold}; font-family:monospace; font-size:15px;">${token}</b><br><small style="color:#444;">Lvl ${p.agarioLEVEL || '?'}</small></div>
                        <i class="fa fa-discord lm-ds-icon"></i>
                    </div>
                `;
                row.querySelector('.lm-ds-icon').onclick = (e) => { e.stopPropagation(); win
                    .sendServerToDiscord(token, region, mode); };
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
        LM_MASTER.socket = new WebSocket(win.SNEZ_WS_URL);
        LM_MASTER.socket.onopen = () => {
            setInterval(() => {
                const sip = document.querySelector('input[name="serverToken"]')?.value;
                if (!sip) return;
                const payload = { type: "update_details", data: {
                        nickname: (document.querySelector('input[name="nickA"]')?.value || "Unnamed") + " (DM)",
                        server: `live-arena-${sip}.agar.io&?r=${document.querySelector('select[name="region"]')?.value}&?m=${document.querySelector('select[name="gamemode"]')?.value}`,
                        tag: document.querySelector('input[name="clantag"]')?.value || "",
                        agarioLEVEL: win
                            .agarioLEVEL || 0, country: LM_MASTER.myCountryCode.toUpperCase()
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
    win
        .syncAdres = function() {
        const t = document.querySelector('input[name="serverToken"]')?.value;
        const g = document.querySelector('input[name="clantag"]')?.value;
        const r = document.querySelector('select[name="region"]')?.value;
        const m = document.querySelector('select[name="gamemode"]')?.value;
        if (!t || t.length < 3 || LM_MASTER.joinInProgress) return;
        const u = win
            .location.origin + win
            .location.pathname + "?sip=live-arena-" + t + ".agar.io" + (g?"&pass="+g:"") + (r?"&?r="+r:"") + (m?"&?m="+m:"");
        if (win
            .location.href !== u) win
            .history.replaceState(null, "", u);
    };

    const boot = setInterval(() => {

        if (document.querySelector('select[name="region"]') && document.querySelector('input[name="serverToken"]')) {
            clearInterval(boot);
            injectHUD();
            win
                .injectHistoryButton();
            runGeo().then(() => {
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
                    document.addEventListener('mousedown', (e) => {
                        const playBtn = e.target.closest('.btn-layer');
                        if (playBtn && playBtn.innerText.trim() === "Play") {

                            // Helper to find the input that actually has text (handles Delta hidden inputs)
                            const getVal = (name) => {
                                const inputs = Array.from(document.querySelectorAll(`input[name="${name}"]`));
                                const found = inputs.find(i => i.value.length > 0);
                                return found ? found.value : (document.querySelector(`input[name="${name}"]`)?.value || "");
                            };

                            let s = getVal("serverToken");
                            if (!s) s = document.querySelector('.list-style .active')?.innerText.split(' ').pop();
                            if (!s) return;

                            const n = getVal("nickA") || "Guest";
                            const t = getVal("clantag") || "";
                            const r = document.querySelector('select[name="region"]')?.value || "Unknown";
                            const m = document.querySelector('select[name="gamemode"]')?.value || ":ffa";

                            const session = win.LM_Session;

                            // Same server: just update identity. New server: push to history.
                            if (session.current.server === s) {
                                session.current.nick = n;
                                session.current.tag = t;
                            } else {
                                if (session.current.server && session.current.server !== "") {
                                    session.history.unshift({...session.current});
                                    if (session.history.length > 10) session.history.pop();
                                }
                                session.current = { nick: n, tag: t, server: s, region: r, mode: m, time: new Date().toLocaleString() };
                            }

                            localStorage.setItem("LM_Server_History", JSON.stringify(session.history));
                            console.log(win.LOG_TAG + "Session Object Updated.");

                            if (LM_MASTER.discord.autoSend) {
                                console.log(win.LOG_TAG + "Triggering Discord...");
                                win
                                    .sendServerToDiscord();
                            }
                        }
                    }, true);

                    document.addEventListener('change', (e) => { if (['region', 'gamemode', 'clantag', 'serverToken'].includes(e.target.name)) setTimeout(win
                        .syncAdres, 100); }, true);
                    setInterval(win
                        .syncAdres, 3500);
                }, 1200);
            });

        }
    }, 500);
})();
// ==========================================================================
// [SNEZ CLOUD] Delta full bundle Export/Import + UI buttons
// Upload/Download must talk to SNEZ server (NO file pickers)
// Endpoint: https://lmsettings.snez.org/
// Auth headers: username=<uid>, password=LMSettings
// ==========================================================================

(function () {
    'use strict';

    // IMPORTANT: use the same unsafeWindow-backed reference as the rest of your script
    const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    const ENDPOINT = "https://lmsettings.snez.org/";
    const PASS = "LMSettings";

    // -------------------------
    // STRICT helper to verify login and get an ID
    // (your earlier logic: app.accountManager.tokens.all keys)
    // -------------------------
    function checkLoginAndGetID() {
        try {
            const all = win?.app?.accountManager?.tokens?.all;
            if (all && typeof all === "object") {
                const keys = Object.keys(all);
                if (keys.length > 0 && keys[0]) return keys[0] + "DM";
            }
        } catch (e) {
            console.error((win.LOG_TAG || "[LM] ") + "Token check error", e);
        }

        if (win.toastr) win.toastr.error("<b>[LM]:</b> Login Required!<br>Please login with Google/Facebook first.");
        return null;
    }

    // -------------------------
    // Robust "wait for Delta API"
    // -------------------------
    function waitForDeltaApi(timeoutMs = 20000) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const t = setInterval(() => {
                const ok =
                    !!win.keyMaster && typeof win.keyMaster.export === "function" && typeof win.keyMaster.import === "function" &&
                    !!win.profiles  && typeof win.profiles.export  === "function" && typeof win.profiles.import  === "function" &&
                    !!win.settings  && typeof win.settings.export  === "function" && typeof win.settings.import  === "function" &&
                    !!win.theme     && typeof win.theme.export     === "function" && typeof win.theme.import     === "function";

                if (ok) { clearInterval(t); resolve(true); return; }
                if (Date.now() - start > timeoutMs) { clearInterval(t); reject(new Error("Delta API not ready: keyMaster/profiles/settings/theme")); }
            }, 120);
        });
    }

    // -------------------------
    // Build / Apply bundle
    // -------------------------
    function buildDeltaBundle() {
        return {
            version: 1,
            deltaHotkeys: win.keyMaster.export(),
            ogarioPlayerProfiles: win.profiles.export(),
            settings: win.settings.export(),
            ogarioThemeSettings: win.theme.export(),
        };
    }

    function applyDeltaBundle(bundle) {
        if (!bundle || typeof bundle !== "object") throw new Error("Invalid bundle object");
        if (!bundle.deltaHotkeys || !bundle.settings || !bundle.ogarioThemeSettings) {
            throw new Error("Bundle missing required keys: deltaHotkeys/settings/ogarioThemeSettings");
        }

        win.keyMaster.import(bundle.deltaHotkeys);
        win.profiles.import(bundle.ogarioPlayerProfiles || []);
        win.settings.import(bundle.settings);
        win.theme.import(bundle.ogarioThemeSettings);

        // Do NOT invent methods. Best-effort: click APPLY/SAVE/OK if Delta UI provides one.
        try {
            const btns = Array.from(document.querySelectorAll("button"));
            const hit = btns.find(b => {
                const t = (b.innerText || "").trim().toUpperCase();
                return t === "APPLY" || t === "SAVE" || t === "OK";
            });
            if (hit) { try { hit.click(); } catch (_) {} }
        } catch (_) {}
        setTimeout(() => { clickDeltaSaveWithRetry().catch(()=>{}); }, 250);
    }

    // -------------------------
    // SNEZ requests
    // -------------------------
    function snezPost(uid, payloadObj) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: ENDPOINT,
                headers: { username: uid, password: PASS },
                // Keep escape/unescape since your server already uses it
                data: escape(JSON.stringify(payloadObj)),
                onload: (res) => resolve(res),
                onerror: (err) => reject(err),
            });
        });
    }

    function snezGet(uid) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: ENDPOINT,
                headers: { username: uid, password: PASS },
                onload: (res) => resolve(res),
                onerror: (err) => reject(err),
            });
        });
    }

    // -------------------------
    // Exposed functions (your buttons call these)
    // -------------------------
    win.SNEZDeltaUpload = async function () {
        const uid = checkLoginAndGetID();
        if (!uid) return;

        try {
            await waitForDeltaApi();

            const bundle = buildDeltaBundle();

            if (win.toastr) win.toastr.info("<b>[LM]:</b> Uploading full Delta bundle...");
            const res = await snezPost(uid, bundle);

            if (res && res.status === 200) {
                if (win.toastr) win.toastr.success(`<b>[LM]:</b> Bundle saved to cloud!<br>ID: <span style="color:yellow">${uid}</span>`);
                console.log((win.LOG_TAG || "[LM] ") + "Cloud upload OK", uid);
            } else {
                if (win.toastr) win.toastr.error("<b>[LM]:</b> Cloud upload failed (server error).");
                console.error((win.LOG_TAG || "[LM] ") + "Cloud upload failed", res);
            }
        } catch (e) {
            if (win.toastr) win.toastr.error(`<b>[LM]:</b> Upload failed: ${String(e && e.message ? e.message : e)}`);
            console.error((win.LOG_TAG || "[LM] ") + "Upload failed", e);
        }
    };

    win.SNEZDeltaDownload = async function () {
        const uid = checkLoginAndGetID();
        if (!uid) return;

        try {
            await waitForDeltaApi();

            if (win.toastr) win.toastr.info("<b>[LM]:</b> Downloading full Delta bundle...");
            const res = await snezGet(uid);

            if (!res || res.status !== 200 || !res.responseText) {
                if (win.toastr) win.toastr.warning("<b>[LM]:</b> No cloud data found for this ID.");
                console.warn((win.LOG_TAG || "[LM] ") + "Cloud download: empty", res);
                return;
            }

            const raw = unescape(res.responseText);
            const bundle = JSON.parse(raw);

            applyDeltaBundle(bundle);

            if (win.toastr) win.toastr.success("<b>[LM]:</b> Cloud bundle loaded! Save theme/profile/hotkeys... you like to from their own menu tab");
            console.log((win.LOG_TAG || "[LM] ") + "Cloud download+import OK", uid);
        } catch (e) {
            if (win.toastr) win.toastr.error("<b>[LM]:</b> Corrupt cloud data or import failed.");
            console.error((win.LOG_TAG || "[LM] ") + "Cloud data parse/import failed", e);
        }
    };

    // ========================================================================
    // UI injection: add UPLOAD under EXPORT, DOWNLOAD under IMPORT
    // ========================================================================
    function injectSettingsButtons() {
        try {
            const LOG = (win.LOG_TAG || "[LM] ");

            // ------------------------------------------------------------
            // Helper: find & "technical click" the Delta Save button
            // ------------------------------------------------------------
            function findSaveButton(root = document) {
                // Fast: icon-based
                const iconBtn = root.querySelector(".btn-icon.fas.fa-save")?.closest("button");
                if (iconBtn) return iconBtn;

                // Text-based fallback
                const buttons = Array.from(root.querySelectorAll("button"));
                return buttons.find(b => {
                    const info = b.querySelector(".btn-info");
                    if (info && (info.textContent || "").trim().toLowerCase() === "save") return true;
                    const t = (b.innerText || "").trim().toLowerCase();
                    return t === "save";
                }) || null;
            }

            function technicalClick(el) {
                if (!el) return false;

                // Ensure interactable
                try { el.style.pointerEvents = "auto"; } catch (_) {}

                const opts = { bubbles: true, cancelable: true, composed: true };

                // Pointer events (some UIs prefer this)
                try {
                    el.dispatchEvent(new PointerEvent("pointerdown", { ...opts, pointerId: 1, pointerType: "mouse", isPrimary: true }));
                    el.dispatchEvent(new PointerEvent("pointerup",   { ...opts, pointerId: 1, pointerType: "mouse", isPrimary: true }));
                } catch (_) {}

                // Mouse events (React-style delegation)
                el.dispatchEvent(new MouseEvent("mousedown", opts));
                el.dispatchEvent(new MouseEvent("mouseup", opts));
                el.dispatchEvent(new MouseEvent("click", opts));

                return true;
            }

            async function clickSaveAfterDownload(retries = 10, gapMs = 250) {
                for (let i = 0; i < retries; i++) {
                    const saveBtn = findSaveButton(document);
                    if (saveBtn) {
                        const ok = technicalClick(saveBtn);

                        // Extra fallback: submit containing form if they wired it that way
                        try {
                            const form = saveBtn.closest("form");
                            if (form && typeof form.requestSubmit === "function") form.requestSubmit();
                        } catch (_) {}

                        console.log(LOG + "Triggered Save after cloud download.", { ok, attempt: i + 1 });
                        return true;
                    }
                    await new Promise(r => setTimeout(r, gapMs));
                }
                console.warn(LOG + "Save button not found to persist after cloud download.");
                return false;
            }

            // ------------------------------------------------------------
            // Locate the Export/Import settings form + existing buttons
            // ------------------------------------------------------------
            const forms = Array.from(document.querySelectorAll("form"));
            const settingsForm = forms.find(f => (f.textContent || "").includes("Export / import settings"));
            if (!settingsForm) return;

            const buttons = Array.from(settingsForm.querySelectorAll("button"));
            const exportBtn = buttons.find(b => (b.innerText || "").trim() === "EXPORT");
            const importBtn = buttons.find(b => (b.innerText || "").trim() === "IMPORT");
            if (!exportBtn || !importBtn) return;

            const exportCol = exportBtn.closest('div[class*="w-1/3"]') || exportBtn.parentElement;
            const importCol = importBtn.closest('div[class*="w-1/3"]') || importBtn.parentElement;
            if (!exportCol || !importCol) return;

            const alreadyUpload = exportCol.querySelector("#lm-cloud-upload-btn");
            const alreadyDownload = importCol.querySelector("#lm-cloud-download-btn");
            if (alreadyUpload && alreadyDownload) return;

            const makeBtn = (id, iconClass, text, onClick) => {
                const b = document.createElement("button");
                b.id = id;
                b.className = exportBtn.className;

                b.style.width = "100%";
                b.style.marginTop = "6px";
                b.style.height = "28px";
                b.style.padding = "0 10px";
                b.style.opacity = "0.95";
                b.type = "button";

                b.innerHTML = `
                <div class="btn-layer">
                    <div class="btn-logo">
                        <div class="btn-icon fas ${iconClass}"></div>
                    </div>
                    <div class="btn-info">${text}</div>
                </div>
            `;

                b.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Promise.resolve()
                        .then(onClick)
                        .catch(err => console.error(LOG + "Cloud button error:", err));
                });

                return b;
            };

            if (!alreadyUpload) {
                exportCol.appendChild(
                    makeBtn("lm-cloud-upload-btn", "fa-cloud-upload-alt", "UPLOAD", () => win.SNEZDeltaUpload())
                );
            }

            if (!alreadyDownload) {
                importCol.appendChild(
                    makeBtn("lm-cloud-download-btn", "fa-cloud-download-alt", "DOWNLOAD", async () => {
                        await win.SNEZDeltaDownload();      // download + import
                        await clickSaveAfterDownload();     // now persist by clicking Save
                    })
                );
            }

            console.log(LOG + "Cloud buttons injected under EXPORT/IMPORT.");
        } catch (e) {
            console.error((win.LOG_TAG || "[LM] ") + "injectSettingsButtons failed:", e);
        }
    }

    const settingsObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length > 0) { injectSettingsButtons(); break; }
        }
    });
// -------------------------
// Force-click Delta "Save" (the floppy icon) to persist imported settings
// -------------------------
    function findDeltaSaveButton() {
        // 1) Icon-based (best, matches your screenshot DOM)
        const byIcon = document.querySelector('.btn-icon.fas.fa-save')?.closest('button');
        if (byIcon) return byIcon;

        // 2) Text-based fallback: btn-info "Save"
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => {
            const info = b.querySelector('.btn-info');
            if (info && (info.textContent || "").trim().toLowerCase() === "save") return true;
            const t = (b.innerText || "").trim().toLowerCase();
            return t === "save";
        }) || null;
    }

    function technicalClick(el) {
        if (!el) return false;

        // Make sure it can receive input (some Delta elements use pointer-events tricks)
        try { el.style.pointerEvents = "auto"; } catch (_) {}

        const opts = { bubbles: true, cancelable: true, composed: true };

        // Pointer events (some frameworks listen here)
        try {
            el.dispatchEvent(new PointerEvent("pointerdown", { ...opts, pointerId: 1, pointerType: "mouse", isPrimary: true }));
            el.dispatchEvent(new PointerEvent("pointerup",   { ...opts, pointerId: 1, pointerType: "mouse", isPrimary: true }));
        } catch (_) {}

        // Mouse events (React-style delegation)
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));

        return true;
    }

    async function clickDeltaSaveWithRetry(retries = 12, delayMs = 250) {
        for (let i = 0; i < retries; i++) {
            const saveBtn = findDeltaSaveButton();
            if (saveBtn) {
                technicalClick(saveBtn);

                // extra: if Save is wired via form submit, request it too (safe/no-op if not)
                try {
                    const form = saveBtn.closest("form");
                    if (form && typeof form.requestSubmit === "function") form.requestSubmit();
                } catch (_) {}

                return true;
            }
            await new Promise(r => setTimeout(r, delayMs));
        }
        return false;
    }
    settingsObserver.observe(document.body, { childList: true, subtree: true });
    setInterval(injectSettingsButtons, 2500);
    setTimeout(() => { clickDeltaSaveWithRetry().catch(()=>{}); }, 250);

})();
