//OLD DEALS
//v2.23

//for agarioUID, agarioID, look at the case 102: on this file https://jimboy3100.github.io/ogario/ogario.v4.js?v=32

/* you will need this
	var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/languages/LanguagePackEnglish.js";
        $("body").append(s);



//		$("#OpenuserScripts").after('<button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" onclick="BeforeSpecialDeals(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>' + Languageletter351 + '</button>');		

if (window.agarioUID != undefined) {
	localStorage.setItem("agarioUID", window.agarioUID);
	localStorage.setItem("agarioID", window.agarioID);
}
else{
	window.agarioUID=localStorage.getItem("agarioUID");
	window.agarioID=localStorage.getItem("agarioID");	
}
*/
window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/v15/10913/GameConfiguration.json";
window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/v15/10913/";

if (window.agarversion != null) {
    window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json";
    window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion;
}

/**
 * Theme helper — reads defaultSettings at call time so it picks up theme changes.
 * Used by functions outside the SpecialDeals() scope (populateDealsGrid, updateEquippedSkinUI, etc.)
 */
function getShopTheme() {
    var ds = window.defaultSettings || {};
    return {
        mc:  ds.menuMainColor   || '#01d9cc',
        pc:  ds.menuPanelColor  || '#00243e',
        pc2: ds.menuPanelColor2 || '#002f52',
        tc:  ds.menuTextColor   || '#ffffff',
        tc2: ds.menuTextColor2  || '#8096a7',
        b1:  ds.btn1Color       || '#018cf6',
        b1h: ds.btn1Color2      || '#0176ce',
        b2:  ds.btn2Color       || '#00b9e8',
        b3:  ds.btn3Color       || '#8d5fe6',
        b4:  ds.btn4Color       || '#bf00aa',
        b4h: ds.btn4Color2      || '#a80096',
        btc: ds.menuBtnTextColor|| '#ffffff'
    };
}
window.getShopTheme = getShopTheme;

SpecialDeals();
AgarVersionDestinations();

function SpecialDeals() {

    // Clear any leaked interval from a previous SpecialDeals() run
    if (window._shopLoginCheckInterval) {
        clearInterval(window._shopLoginCheckInterval);
        window._shopLoginCheckInterval = null;
    }

    // Remove any existing modal + backdrop first (prevents duplicates from re-loading the script)
    $('#specialShopModal').remove();

    // Auto-restore encoded UID from memory/localStorage
    if (!window.agarioEncodedUID) {
        window.agarioEncodedUID = localStorage.getItem("agarioEncodedUID") || localStorage.getItem("agarioUID") || "";
    }
    if (window.agarioEncodedUID) {
        localStorage.setItem("agarioEncodedUID", window.agarioEncodedUID);
    }

    // Require UID to open — user must be logged in and have played
    if (!window.agarioEncodedUID) {
        if (window.toastr) {
            toastr.warning('<b>[SHOP]:</b> Log in with Google/Facebook and play a game first to access skins.');
        }
        return;
    }

    // --- Inject skin shop CSS (theme-aware) ---
        // Read the user's current theme settings so the modal matches
        var ds = window.defaultSettings || {};
        var mc  = ds.menuMainColor   || '#01d9cc'; // accent color (title, active tabs, borders)
        var pc  = ds.menuPanelColor  || '#00243e'; // panel background
        var pc2 = ds.menuPanelColor2 || '#002f52'; // panel secondary (inputs, hover rows)
        var tc  = ds.menuTextColor   || '#ffffff'; // main text
        var tc2 = ds.menuTextColor2  || '#8096a7'; // muted / secondary text
        var b1  = ds.btn1Color       || '#018cf6'; // primary button
        var b1h = ds.btn1Color2      || '#0176ce'; // primary button hover
        var b2  = ds.btn2Color       || '#00b9e8'; // success / secondary button
        var b3  = ds.btn3Color       || '#8d5fe6'; // warning button
        var b4  = ds.btn4Color       || '#bf00aa'; // danger button
        var b4h = ds.btn4Color2      || '#a80096'; // danger button hover
        var btc = ds.menuBtnTextColor|| '#ffffff'; // button text

        // Remove any previous injection so theme changes take effect when re-opened
        var prev = document.getElementById('skinShopStyles');
        if (prev) prev.remove();

        var styleEl = document.createElement('style');
        styleEl.id = 'skinShopStyles';
        styleEl.textContent = [
            '#specialShopModal .modal-content { background: ' + pc + ' !important; color: ' + tc + ' !important; border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 10px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important; }',
            '#specialShopModal .modal-header { border-bottom: 1px solid ' + pc2 + '; padding: 12px 15px; position: relative; }',
            '#CloseSpecialDeals { float: right; position: relative; z-index: 1050; opacity: 0.85; color: ' + tc + ' !important; font-size: 22px; line-height: 1; margin-left: 12px; cursor: pointer; padding: 2px 8px; border: none; background: transparent; transition: all 0.2s; outline: none; }',
            '#CloseSpecialDeals:hover { opacity: 1; color: ' + b4 + ' !important; transform: scale(1.15); }',
            '#FAQSpecialDeals { float: right; position: relative; z-index: 1050; opacity: 0.85; color: ' + mc + ' !important; font-size: 18px; line-height: 1; margin-right: 6px; cursor: pointer; padding: 2px 8px; border: none; background: transparent; transition: all 0.2s; outline: none; }',
            '#FAQSpecialDeals:hover { opacity: 1; color: ' + mc + ' !important; transform: scale(1.15); filter: brightness(1.3); }',
            '#specialShopModal .shop-tabs { display: flex; border-bottom: 2px solid ' + pc2 + '; margin: 0 -15px; padding: 0 15px; background: rgba(0,0,0,0.2); }',
            '#specialShopModal .shop-tab { flex: 1; text-align: center; padding: 10px 0; cursor: pointer; font-family: "Roboto Condensed", sans-serif; font-size: 14px; font-weight: 700; color: ' + tc2 + ' !important; border-bottom: 3px solid transparent; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }',
            '#specialShopModal .shop-tab:hover { color: ' + mc + ' !important; background: rgba(0,0,0,0.15); }',
            '#specialShopModal .shop-tab.active { color: ' + mc + ' !important; border-bottom-color: ' + mc + ' !important; background: rgba(0,0,0,0.1); }',
            '#specialShopModal .tab-pane { display: none; }',
            '#specialShopModal .tab-pane.active { display: block; }',
            '.active-skin-banner { display: flex; align-items: center; background: ' + pc2 + '; border: 1px solid ' + mc + '; border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; }',
            '.active-skin-banner img { width: 44px; height: 44px; border-radius: 50%; margin-right: 12px; border: 2px solid ' + mc + '; object-fit: cover; background: ' + pc + '; }',
            '.active-skin-banner .info { flex: 1; }',
            '.active-skin-banner .info .title { font-size: 10px; color: ' + mc + '; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }',
            '.active-skin-banner .info .name { font-size: 14px; font-weight: 700; color: ' + tc + '; font-family: "Roboto Condensed", sans-serif; }',
            '.active-skin-banner .unequip-btn { background: rgba(255,87,34,0.2); border: 1px solid ' + b4 + '; color: ' + b4 + '; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer; }',
            '.active-skin-banner .unequip-btn:hover { background: ' + b4 + '; color: ' + btc + '; }',
            '#skinSearchBar { width: 100%; padding: 8px 12px; margin-bottom: 10px; border: 1px solid ' + pc2 + '; border-radius: 4px; background: rgba(0,0,0,0.4); color: ' + tc + '; font-size: 14px; outline: none; box-sizing: border-box; }',
            '#skinSearchBar:focus { border-color: ' + mc + '; box-shadow: 0 0 5px ' + mc + '44; }',
            '#skinSearchBar::placeholder { color: ' + tc2 + '; }',
            '.skin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-height: 320px; overflow-y: auto; padding: 4px; }',
            '.skin-grid::-webkit-scrollbar { width: 6px; }',
            '.skin-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }',
            '.skin-grid::-webkit-scrollbar-thumb { background: ' + pc2 + '; border-radius: 3px; }',
            '.skin-grid::-webkit-scrollbar-thumb:hover { background: ' + tc2 + '; }',
            '.skin-card { position: relative; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px; text-align: center; cursor: pointer; transition: all 0.2s; overflow: hidden; height: 115px; box-sizing: border-box; }',
            '.skin-card:hover { border-color: ' + mc + '; transform: translateY(-2px); box-shadow: 0 4px 12px ' + mc + '33; }',
            '.skin-card.equipped { border-color: ' + b2 + ' !important; background: ' + b2 + '1e !important; box-shadow: 0 0 10px ' + b2 + '4d !important; }',
            '.skin-card.owned-card { border-color: ' + b3 + '66; background: ' + b3 + '0f; }',
            '.skin-card .equipped-badge { position: absolute; top: 4px; left: 4px; background: ' + b2 + '; color: #000; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; z-index: 3; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }',
            '.skin-card .owned-badge { position: absolute; top: 4px; left: 4px; background: ' + b3 + '; color: #000; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; z-index: 3; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }',
            '.skin-card .skin-cell-wrap { position: relative; width: 64px; height: 64px; margin: 2px auto; }',
            '.skin-card .skin-color { width: 64px; height: 64px; border-radius: 50%; position: absolute; top: 0; left: 0; border: 2px solid rgba(255,255,255,0.15); box-shadow: inset 0 0 10px rgba(0,0,0,0.3); }',
            '.skin-card img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; display: block; position: absolute; top: 2px; left: 2px; z-index: 1; }',
            '.skin-card .skin-name { font-size: 10px; color: ' + tc2 + '; font-family: "Roboto Condensed", sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }',
            '.skin-card:hover .skin-name { color: ' + tc + '; }',
            '.skin-card-actions { position: absolute; bottom: 0; left: 0; right: 0; display: flex; opacity: 0; transition: opacity 0.2s; }',
            '.skin-card:hover .skin-card-actions, .skin-card.equipped .skin-card-actions { opacity: 1; }',
            '.skin-btn-equip { flex: 1; background: ' + b1 + '; color: ' + btc + '; border: none; padding: 4px 0; font-size: 10px; font-weight: 700; font-family: "Roboto Condensed", sans-serif; cursor: pointer; text-transform: uppercase; }',
            '.skin-card.equipped .skin-btn-equip { background: ' + b2 + '; color: #000; }',
            '.skin-btn-buy { flex: 1; background: ' + b3 + '; color: ' + btc + '; border: none; padding: 4px 0; font-size: 10px; font-weight: 700; font-family: "Roboto Condensed", sans-serif; cursor: pointer; text-transform: uppercase; }',
            '.skin-btn-buy:hover { background: ' + b3 + '; filter: brightness(1.2); }',
            '.skin-btn-owned { flex: 1; background: ' + b3 + '33; color: ' + b3 + '; border: none; padding: 4px 0; font-size: 10px; font-weight: 700; font-family: "Roboto Condensed", sans-serif; cursor: default; text-transform: uppercase; }',
            '.skin-stats { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding: 6px 0; border-top: 1px solid ' + pc2 + '; font-size: 12px; color: ' + tc2 + '; font-family: "Roboto Condensed", sans-serif; }',
            '.skin-stats span { color: ' + mc + '; font-weight: 700; }',
            '.skin-load-more { width: 100%; padding: 8px; margin-top: 8px; background: ' + b1 + '26; border: 1px solid ' + b1 + '4d; border-radius: 4px; color: ' + b1 + '; font-family: "Roboto Condensed", sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }',
            '.skin-load-more:hover { background: ' + b1 + '40; color: ' + mc + '; }',
            '#specialShopModal input.form-control, #specialShopModal select.form-control { background: ' + pc2 + ' !important; color: ' + tc + ' !important; border: 1px solid ' + pc2 + ' !important; }',
            '#specialShopModal #buy_starterpack { background: rgba(0,0,0,0.3); border: 1px solid ' + pc2 + '; border-left: 4px solid ' + mc + '; padding: 10px; border-radius: 4px; color: ' + tc + '; }',
            '#specialShopModal #buy_starterpack:hover { background: ' + mc + '26; border-color: ' + mc + '; }',
            '#specialShopModal #buy_starterpack h4, #specialShopModal #buy_starterpack h5 { color: ' + mc + '; }',
            '#specialShopModal #buy_starterpack:hover h4 { color: ' + mc + '; filter: brightness(1.3); }',
            // Loading spinner
            '.skin-grid-loading { grid-column: 1/-1; text-align: center; padding: 40px; color: ' + tc2 + '; font-size: 13px; }',
            '.skin-grid-loading .spinner { display: inline-block; width: 28px; height: 28px; border: 3px solid ' + mc + '4d; border-top-color: ' + mc + '; border-radius: 50%; animation: skinSpin 0.8s linear infinite; margin-bottom: 8px; }',
            '@keyframes skinSpin { to { transform: rotate(360deg); } }',
            // Drag-and-drop zone
            '.upload-drop-zone { border: 2px dashed ' + pc2 + '; border-radius: 8px; padding: 8px; margin-bottom: 8px; transition: all 0.2s; background: rgba(0,0,0,0.2); }',
            '.upload-drop-zone.drag-over { border-color: ' + mc + '; background: ' + mc + '14; }',
            '.upload-clear-btn { background: ' + b4 + '33; border: 1px solid ' + b4 + '; color: ' + b4 + '; padding: 3px 12px; font-size: 10px; font-weight: 700; border-radius: 4px; cursor: pointer; margin-top: 6px; }',
            '.upload-clear-btn:hover { background: ' + b4 + '; color: ' + btc + '; }',
            // Deal cards
            '.deal-card:hover { border-color: ' + mc + ' !important; background: ' + mc + '14 !important; }',
            '.deal-buy-btn:hover { background: ' + b1h + ' !important; transform: scale(1.05); }',
            '#dealsGrid::-webkit-scrollbar { width: 6px; }',
            '#dealsGrid::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }',
            '#dealsGrid::-webkit-scrollbar-thumb { background: ' + pc2 + '; border-radius: 3px; }',
            '#dealsGrid::-webkit-scrollbar-thumb:hover { background: ' + tc2 + '; }',
            '#claimFreeCoinsBtn:hover { background: ' + b2 + ' !important; transform: scale(1.05); }',
        ].join('\n');
        document.head.appendChild(styleEl);

        // --- Build modal HTML with tabs ---
        $('#helloContainer').after(
            '<div class="modal fade in" id="specialShopModal" aria-hidden="false" style="display: block;">' +
            '<div class="modal-backdrop fade in"></div>' +
            '<div class="modal-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 560px; margin: 0;">' +
            '<div class="modal-content">' +

            // Header
            '<div id="CloseSpecialDeals2" class="modal-header">' +
            '<button id="CloseSpecialDeals" type="button" class="close" data-dismiss="modal" title="Close"><span aria-hidden="true">&times;</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
            '<button id="FAQSpecialDeals" type="button" class="close" title="Help & FAQ"><span aria-hidden="true">&#x2753;</span><span class="sr-only">Help</span></button>' +
            '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif; font-weight: 700; color: ' + mc + ';"><i class="fa fa-paint-brush"></i> Agar.io Skins & Deals</h4>' +
            '</div>' +

            // Tab bar (Skins active by default)
            '<div class="shop-tabs">' +
            '<div class="shop-tab active" data-tab="skins"><i class="fa fa-paint-brush"></i> Agar.io Skins</div>' +
            '<div class="shop-tab" data-tab="upload"><i class="fa fa-upload"></i> Custom Skin Uploader</div>' +
            '<div class="shop-tab" data-tab="deals"><i class="fa fa-briefcase"></i> Special Deals</div>' +
            '</div>' +

            // === 1. Skins tab (Default active) ===
            '<div class="tab-pane active" id="tab-skins">' +
            '<div class="modal-body">' +

            // Active Skin Banner
            '<div class="active-skin-banner" id="activeSkinBanner">' +
            '<img id="activeSkinImg" src="" alt="Active Skin" onerror="this.src=\'https://jimboy3100.github.io/banners/icondeal2.png\'">' +
            '<div class="info">' +
            '<div class="title">&#x2714; Currently Equipped Skin</div>' +
            '<div class="name" id="activeSkinName">None (Default)</div>' +
            '</div>' +
            '<button class="unequip-btn" id="unequipSkinBtn" onclick="unequipSkin();">Unequip</button>' +
            '</div>' +

            '<div class="skin-filter-bar" style="display: flex; gap: 6px; margin-bottom: 10px;">' +
            '<button class="btn btn-xs skin-filter-btn active" data-filter="all" style="flex: 1; background: ' + b1 + '; color: ' + btc + '; font-weight: 700; border: none; padding: 6px 0; border-radius: 4px;">All Skins (955+)</button>' +
            '<button class="btn btn-xs skin-filter-btn" data-filter="owned" style="flex: 1; background: rgba(255,255,255,0.1); color: ' + tc2 + '; font-weight: 700; border: 1px solid ' + pc2 + '; padding: 6px 0; border-radius: 4px;">&#x2B50; My Owned Skins</button>' +
            '</div>' +
            '<input type="text" id="skinSearchBar" placeholder="&#x1F50D; Search skins by name...">' +
            '<div class="skin-grid" id="skinGrid"></div>' +
            '<div class="skin-stats"><span id="skinCount">0</span> skins shown <span id="skinTotal">0</span> total</div>' +
            '<button class="skin-load-more" id="skinLoadMore" style="display:none;">Load More Skins</button>' +
            '</div>' +
            '</div>' +

            // === 2. Custom Skin Uploader tab ===
            '<div class="tab-pane" id="tab-upload">' +
            '<div class="modal-body" style="text-align: center;">' +
            '<h5 style="color: ' + mc + '; font-weight: 700; margin-top: 0;">Upload Custom Skin (90 DNA)</h5>' +
            '<div id="userDnaBalanceDisplay" style="font-size: 12px; color: ' + mc + '; font-weight: 700; margin-bottom: 8px; background: rgba(0,0,0,0.3); display: inline-block; padding: 3px 10px; border-radius: 12px; border: 1px solid ' + mc + '4d;">🧬 DNA: <span id="dnaCountModal">0</span> &nbsp;|&nbsp; 💰 Coins: <span id="coinsCountModal">0</span></div>' +
            '<div class="upload-drop-zone" id="uploadDropZone">' +

            '<p style="color: ' + tc2 + '; font-size: 11px; margin-bottom: 12px;">Select an image file. It will be formatted into a 512x512 PNG and submitted directly to Agar.io via Protobuf.</p>' +
            '<div style="display: flex; gap: 8px; margin-bottom: 12px; max-width: 360px; margin-left: auto; margin-right: auto;">' +
            '<input id="legendSkinNameModal" class="form-control" placeholder="Skin Name" style="width: 70%;" maxlength="15">' +
            '<input id="legendSkinColorModal" type="color" value="#FFFF00" style="width: 30%; height: 34px; padding: 2px; border: 1px solid ' + pc2 + '; background: ' + pc + '; border-radius: 4px; cursor: pointer;">' +
            '</div>' +
            '<div style="text-align: center; margin-bottom: 12px;">' +
            '<canvas id="legendCanvasModal" width="512" height="512" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid ' + mc + '; background-color: #000; box-shadow: 0 0 12px ' + mc + '4d;"></canvas>' +
            '</div>' +
            '<label for="legendUploadInputModal" class="btn btn-primary" id="legendChooseFileBtn" style="background: ' + b1 + '; margin-bottom: 8px; width: 220px; font-weight: 700; border: none; cursor: pointer;">&#x1F4C2; Choose Image File</label>' +
            '<input type="file" id="legendUploadInputModal" accept="image/*" style="display:none;" />' +
            '<br>' +
            '<button id="legendSaveBtnModal" class="btn btn-success" disabled style="background: ' + b2 + '; width: 220px; font-weight: 700;">Upload & Buy (90 DNA)</button>' +
            '<br><button id="legendClearBtn" class="upload-clear-btn" style="display:none;">&#x2716; Clear Image</button>' +
            '<div id="legendStatusModal" style="font-size: 11px; margin-top: 6px; color: ' + tc2 + ';">Select an image or drag &amp; drop</div>' +
            '</div>' + // close drop zone
            '</div>' +
            '</div>' +

            // === 3. Deals tab ===
            '<div class="tab-pane" id="tab-deals">' +
            '<div class="modal-body">' +

            // Balance display
            '<div id="dealsBalanceBar" style="font-size: 12px; color: ' + mc + '; font-weight: 700; margin-bottom: 10px; background: rgba(0,0,0,0.3); text-align: center; padding: 5px 12px; border-radius: 12px; border: 1px solid ' + mc + '4d;">' +
            '🧬 DNA: <span id="dealsDnaCount">0</span> &nbsp;|&nbsp; 💰 Coins: <span id="dealsCoinsCount">0</span></div>' +

            // Deal cards container
            '<div id="dealsGrid" style="max-height: 260px; overflow-y: auto; margin-bottom: 10px;"></div>' +

            // Reward Link section
            '<div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid ' + b3 + '44;">' +
            '<span style="font-size: 18px;">🎟️</span>' +
            '<input type="text" id="rewardLinkInput" class="form-control" placeholder="Paste reward link token..." style="flex: 1; height: 30px; font-size: 12px; border: 1px solid ' + b3 + '44; background: rgba(0,0,0,0.3); color: ' + tc + ';">' +
            '<button id="activateRewardLinkBtn" class="btn btn-sm" onclick="(function(){ var inp=document.getElementById(\'rewardLinkInput\'); var token=inp.value.trim(); if(!token){toastr.error(\'<b>[SHOP]:</b> Enter a reward token\');return;} var btn=document.getElementById(\'activateRewardLinkBtn\'); btn.disabled=true; btn.textContent=\'...\'; btn.style.opacity=\'0.4\'; btn.style.pointerEvents=\'none\'; window.activateRewardLink(token); window._rewardLinkTimeout=setTimeout(function(){btn.disabled=false;btn.textContent=\'Activate\';btn.style.opacity=\'1\';btn.style.pointerEvents=\'auto\';toastr.warning(\'<b>[SHOP]:</b> Reward link timed out\');},10000); })()" style="background: ' + b3 + '; color: ' + btc + '; font-weight: 700; border: none; border-radius: 6px; padding: 4px 14px; font-size: 12px; cursor: pointer; white-space: nowrap;">Activate</button>' +
            '</div>' +

            // Ad Reward + Potions row
            '<div style="display: flex; gap: 8px; margin-bottom: 10px;">' +
            // Ad Reward button
            '<button id="adRewardBtn" class="btn btn-sm" onclick="(function(){ var btn=document.getElementById(\'adRewardBtn\'); btn.disabled=true; btn.innerHTML=\'📺 Requesting...\'; btn.style.opacity=\'0.4\'; btn.style.pointerEvents=\'none\'; window.requestAdRewardToken(); window._adRewardTimeout=setTimeout(function(){btn.disabled=false;btn.innerHTML=\'📺 Ad Reward\';btn.style.opacity=\'1\';btn.style.pointerEvents=\'auto\';toastr.warning(\'<b>[SHOP]:</b> Ad reward timed out\');},10000); })()" style="background: ' + b2 + '; color: ' + btc + '; font-weight: 700; border: none; border-radius: 6px; padding: 6px 14px; font-size: 12px; cursor: pointer; flex: 1;">📺 Ad Reward</button>' +
            // Potion buttons
            '<button class="btn btn-sm" onclick="window.brewPotion(1)" style="background: ' + pc2 + '; color: ' + tc + '; font-weight: 700; border: 1px solid ' + mc + '44; border-radius: 6px; padding: 6px 10px; font-size: 11px; cursor: pointer;">🧪 Brew</button>' +
            '<button class="btn btn-sm" onclick="window.openPotion(1)" style="background: ' + pc2 + '; color: ' + tc + '; font-weight: 700; border: 1px solid ' + mc + '44; border-radius: 6px; padding: 6px 10px; font-size: 11px; cursor: pointer;">🧫 Open</button>' +
            '<button class="btn btn-sm" onclick="if(window.application)window.application.openPotionForProduct(prompt(\'Product ID:\'))" style="background: ' + pc2 + '; color: ' + tc + '; font-weight: 700; border: 1px solid ' + mc + '44; border-radius: 6px; padding: 6px 10px; font-size: 11px; cursor: pointer;" title="Open potion for a specific product ID">🧬 Potion→Prod</button>' +
            '</div>' +

            // Encoded UID & Config section (collapsible)
            '<details style="margin-top: 8px; border-top: 1px solid ' + pc2 + '; padding-top: 8px;">' +
            '<summary style="cursor: pointer; color: ' + tc2 + '; font-size: 12px; font-weight: 700;">⚙️ Advanced — UID &amp; Config</summary>' +
            '<div style="margin-top: 8px;">' +
            '<input type="text" class="form-control" id="agario_uid_input" placeholder="Encoded UID" style="width: 85%; display: inline-block; margin-bottom: 6px;">' +
            '<div class="custom-checkbox" style="display: inline-block; margin-left: 10px; vertical-align: sub;"> Friend UID <input id="checkBoxLockUID" type="checkbox" disabled="disabled" style="width: 20px; height: 20px"><label for="cb1"></label></div>' +
            '<div style="display: flex; gap: 6px; margin-bottom: 6px;">' +
            '<select id="BuyDealCurrency" class="form-control" style="width: 25%;"><option value="USD">USD</option><option value="EU">EU</option></select>' +
            '<select id="ss-select-agarVersionDestinations" class="form-control" style="width: 35%;"></select>' +
            '<span style="color: ' + tc2 + '; font-size: 11px; line-height: 34px;">' + Premadeletter117 + '</span>' +
            '</div>' +
            '<input type="text" class="form-control" id="GameConfigurationUrl" value="' + window.MiniclipConfigDestination + '" placeholder="GameConfiguration.json URL" style="width: 100%; margin-bottom: 6px;">' +
            '<p class="alert-warning text-center" style="font-size: 11px; padding: 6px; border-radius: 4px;">' + Premadeletter116 + '<br>UID: <span class="alert-success" id="exp-uid" style="font-size: 2px;">' + window.agarioEncodedUID + '</span> <font color="red" onclick=copy(window.agarioEncodedUID);><b><u>' + Premadeletter114 + '</u></b></font></p>' +
            '</div>' +
            '</details>' +

            '</div>' +
            '</div>' +

            '</div></div></div>'
        );

        $("#agario_uid_input").val(window.agarioEncodedUID);
        LoadGameConfiguration();

        // Make modal draggable. The modal uses transform: translate(-50%,-50%) for centering.
        // jQuery UI draggable sets top/left pixel values which conflicts with the transform.
        // We remove the transform on first interaction and convert to pixel coordinates.
        var $dlg = $("#specialShopModal .modal-dialog");
        $dlg.draggable({
            handle: ".modal-header",
            cancel: ".close, button, a",
            containment: "window",
            start: function(event, ui) {
                var el = $(this);
                // On first drag, the element is centered via transform.
                // Convert its current visual position to pixel top/left and remove transform.
                if (el.css('transform') && el.css('transform') !== 'none') {
                    var rect = el[0].getBoundingClientRect();
                    el.css({
                        top: rect.top + 'px',
                        left: rect.left + 'px',
                        transform: 'none'
                    });
                    // Update jQuery UI's internal position so it doesn't jump
                    ui.position.top = rect.top;
                    ui.position.left = rect.left;
                }
            }
        });
        setTimeout(function() {
            populateLibConfig();
        }, 2500);

        // --- Auto-populate Skins tab on open since it is default active ---
        if (window.GameConfiguration && window.GameConfiguration.gameConfig) {
            populateSkins();
        } else {
            setTimeout(populateSkins, 1500);
        }

        // --- Login & UID status checker (shared across tabs) ---
        window.updateShopLoginState = function updateShopLoginState() {
            var uploadBtn = $('#legendSaveBtnModal');
            var chooseLabel = $('#legendChooseFileBtn');
            var fileInput = $('#legendUploadInputModal');
            var skinNameInput = $('#legendSkinNameModal');
            var skinColorInput = $('#legendSkinColorModal');
            var isLoggedIn = !!(window.loggedIn);
            var hasUID = !!(window.agarioEncodedUID);
            var hasConnection = !!(window.core && window.core.proxyMobileData);
            var allReady = isLoggedIn && hasUID && hasConnection;

            // Live DNA & Coins sync (check multiple sources for accuracy when logged in)
            var dna = 0, coins = 0;
            if (isLoggedIn) {
                if (window.application && window.application.user) {
                    dna = window.application.user.dna || 0;
                    coins = window.application.user.coins || 0;
                }
                if (!dna && $('#dna').length) {
                    var dText = $('#dna').text().replace(/[^0-9]/g, '');
                    if (dText) dna = parseInt(dText, 10);
                }
                if (!coins && $('#coins').length) {
                    var cText = $('#coins').text().replace(/[^0-9]/g, '');
                    if (cText) coins = parseInt(cText, 10);
                }
                if (!dna && window.legendmod && window.legendmod.user) {
                    dna = window.legendmod.user.dna || 0;
                    coins = window.legendmod.user.coins || 0;
                }
            }
            $('#dnaCountModal').text(dna.toLocaleString());
            $('#coinsCountModal').text(coins.toLocaleString());

            // Upload tab elements
            if (allReady) {
                chooseLabel.css({ opacity: 1, pointerEvents: 'auto' });
                fileInput.prop('disabled', false);
                skinNameInput.prop('disabled', false).css('opacity', 1);
                skinColorInput.prop('disabled', false).css('opacity', 1);
                if (processedBufferModal) {
                    uploadBtn.prop('disabled', false).css({ opacity: 1, cursor: 'pointer' });
                }
            } else {
                uploadBtn.prop('disabled', true).css({ opacity: 0.4, cursor: 'not-allowed' });
                chooseLabel.css({ opacity: 0.4, pointerEvents: 'none' });
                fileInput.prop('disabled', true);
                skinNameInput.prop('disabled', true).css('opacity', 0.4);
                skinColorInput.prop('disabled', true).css('opacity', 0.4);
            }

            // Skins tab equip/buy/search
            if (!allReady) {
                $('.skin-btn-equip, .skin-btn-buy').css({ opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' });
                $('#unequipSkinBtn').css({ opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' });
            } else {
                $('.skin-btn-equip, .skin-btn-buy').css({ opacity: 1, cursor: 'pointer', pointerEvents: 'auto' });
                $('#unequipSkinBtn').css({ opacity: 1, cursor: 'pointer', pointerEvents: 'auto' });
            }

            // Deals tab buy button + inputs
            if (!allReady) {
                $('.xpmt-buy-content').css({ opacity: 0.5, pointerEvents: 'none' });
                $('#ss-select-purchases, #BuyDealCurrency, #ss-select-agarVersionDestinations').prop('disabled', true).css('opacity', 0.5);
            } else {
                $('.xpmt-buy-content').css({ opacity: 1, pointerEvents: 'auto' });
                $('#ss-select-purchases, #BuyDealCurrency, #ss-select-agarVersionDestinations').prop('disabled', false).css('opacity', 1);
            }
        }

        // Check login state immediately and every 3 seconds
        updateShopLoginState();
        if (window._shopLoginCheckInterval) clearInterval(window._shopLoginCheckInterval);
        window._shopLoginCheckInterval = setInterval(updateShopLoginState, 3000);
        // Clean up when modal closes (bootstrap event)
        $('#specialShopModal').on('hidden.bs.modal', function() {
            if (window._shopLoginCheckInterval) {
                clearInterval(window._shopLoginCheckInterval);
                window._shopLoginCheckInterval = null;
            }
        });

        // --- Embedded Custom Skin Uploader Handlers ---
        var processedBufferModal = null;
        function processAndFormatModal(src) {
            var img = new Image();
            if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
                img.crossOrigin = "Anonymous";
            }
            img.onload = function() {
                var canvas = document.getElementById("legendCanvasModal");
                if (!canvas) return;
                // Try progressively smaller sizes until under 100KB
                var sizes = [512, 384, 256, 192, 128];
                var attempt = 0;

                function trySize() {
                    var size = sizes[attempt] || 128;
                    var ctx = canvas.getContext("2d");
                    canvas.width = 512; canvas.height = 512; // keep canvas display size
                    ctx.clearRect(0, 0, 512, 512);

                    // Draw at target resolution then scale up for display
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = size; tmpCanvas.height = size;
                    var tmpCtx = tmpCanvas.getContext('2d');
                    tmpCtx.drawImage(img, 0, 0, size, size);

                    // Show on modal canvas at 512x512
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(tmpCanvas, 0, 0, 512, 512);

                    // Export PNG at actual reduced size
                    tmpCanvas.toBlob(function(blob) {
                        if (!blob) return;
                        var reader = new FileReader();
                        reader.onload = function() {
                            processedBufferModal = new Uint8Array(reader.result);
                            var kb = (processedBufferModal.length / 1024).toFixed(1);
                            if (processedBufferModal.length > 102400 && attempt < sizes.length - 1) {
                                attempt++;
                                $('#legendStatusModal').text("Compressing... " + kb + "KB → trying " + sizes[attempt] + "px").css('color', getShopTheme().b3);
                                trySize();
                            } else if (processedBufferModal.length > 102400) {
                                $('#legendStatusModal').text("Too Big: " + kb + "KB even at " + size + "px").css('color', getShopTheme().b4);
                                $('#legendSaveBtnModal').prop('disabled', true).css('opacity', 0.5);
                            } else {
                                $('#legendStatusModal').text("PNG Ready: " + kb + "KB (" + size + "x" + size + ")").css('color', getShopTheme().b2);
                                // Only enable if logged in
                                updateShopLoginState();
                            }
                        };
                        reader.readAsArrayBuffer(blob);
                    }, 'image/png');
                }
                trySize();
            };
            img.onerror = function() {
                $('#legendStatusModal').text("Error loading image").css('color', getShopTheme().b4);
            };
            img.src = src;
        }

        $('#legendUploadInputModal').off('change').on('change', function(e) {
            var file = e.target.files && e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    processAndFormatModal(evt.target.result);
                    $('#legendClearBtn').show();
                };
                reader.readAsDataURL(file);
            }
        });

        // --- Drag & Drop ---
        var dropZone = document.getElementById('uploadDropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('drag-over');
            });
            dropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
            });
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-over');
                var file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        processAndFormatModal(evt.target.result);
                        $('#legendClearBtn').show();
                    };
                    reader.readAsDataURL(file);
                } else {
                    toastr && toastr.warning('<b>[UPLOAD]:</b> Please drop an image file.');
                }
            });
        }

        // --- Clear Image Button ---
        $('#legendClearBtn').off('click').on('click', function() {
            processedBufferModal = null;
            var canvas = document.getElementById('legendCanvasModal');
            if (canvas) {
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 512, 512);
            }
            $('#legendUploadInputModal').val('');
            $('#legendSaveBtnModal').prop('disabled', true).css({ opacity: 0.5, cursor: 'not-allowed' });
            $('#legendStatusModal').text('Select an image or drag & drop').css('color', getShopTheme().tc2);
            $(this).hide();
        });

        $('#legendSaveBtnModal').off('click').on('click', function() {
            var btn = $(this);
            var name = $('#legendSkinNameModal').val() || "test";
            var color = $('#legendSkinColorModal').val() || "#FFFF00";

            // Login + UID gate
            if (!window.loggedIn) {
                toastr.error("<b>[ERROR]:</b> You must be logged in to upload skins.");
                return;
            }
            if (!window.agarioEncodedUID) {
                toastr.error("<b>[ERROR]:</b> No UID found. Play a game first to get your UID!");
                return;
            }
            if (!(window.core && window.core.proxyMobileData)) {
                toastr.error("<b>[ERROR]:</b> No server connection. Join a game first!");
                return;
            }

            if (!processedBufferModal) {
                toastr.warning("<b>[SERVER]:</b> Select an image first.");
                return;
            }

            // Disable button immediately to prevent double-click
            btn.prop('disabled', true).css('opacity', 0.5);
            var cooldown = 30;
            var origText = btn.text();
            btn.text("Please wait... " + cooldown + "s");
            var timer = setInterval(function() {
                cooldown--;
                if (cooldown <= 0) {
                    clearInterval(timer);
                    btn.text(origText);
                    updateShopLoginState(); // re-check login before re-enabling
                } else {
                    btn.text("Please wait... " + cooldown + "s");
                }
            }, 1000);

            // Method 1: Inject into official skin-editor-canvas (most reliable)
            var skinEditorCanvas = document.getElementById('skin-editor-canvas');
            if (skinEditorCanvas) {
                var legendCanvas = document.getElementById("legendCanvasModal");
                if (legendCanvas) {
                    var ctx = skinEditorCanvas.getContext('2d');
                    ctx.clearRect(0, 0, skinEditorCanvas.width, skinEditorCanvas.height);
                    ctx.drawImage(legendCanvas, 0, 0, skinEditorCanvas.width, skinEditorCanvas.height);
                    skinEditorCanvas.dispatchEvent(new Event('change', { bubbles: true }));
                    skinEditorCanvas.dispatchEvent(new Event('input', { bubbles: true }));
                    toastr.success("<b>[SERVER]:</b> Image injected into skin editor! Click the Save button in the editor to upload.");
                    console.log("[LM] Injected image into skin-editor-canvas (" + skinEditorCanvas.width + "x" + skinEditorCanvas.height + ")");
                    return;
                }
            }

            // Method 2: Protocol upload via uploadCustomSkin (uses protobuf encoder)
            if (window.application && typeof window.application.uploadCustomSkin === 'function') {
                window.application.uploadCustomSkin(processedBufferModal, name, color);
            } else {
                toastr.warning("<b>[SERVER]:</b> Not connected. Play a game first.");
            }
        });

        // --- Tab switching ---
        $('.shop-tab').on('click', function() {
            var tab = $(this).data('tab');
            $('.shop-tab').removeClass('active');
            $(this).addClass('active');
            $('.tab-pane').removeClass('active');
            $('#tab-' + tab).addClass('active');

            if (tab === 'skins' && $('#skinGrid').children().length === 0 && window.GameConfiguration && window.GameConfiguration.gameConfig) {
                populateSkins();
            }
            if (tab === 'skins') {
                updateEquippedSkinUI();
            }
            if (tab === 'deals') {
                populateDealsGrid();
                updateDealsBalance();
            }
            // Re-apply login state when switching tabs
            updateShopLoginState();
        });

        $("#ss-select-agarVersionDestinations").change(function() {

            $("#GameConfigurationUrl").val("https://configs-web.agario.miniclippt.com/live/" + $("#ss-select-agarVersionDestinations").val() + "GameConfiguration.json");
            $("#GameConfigurationUrl").blur();
        });
        $("#GameConfigurationUrl").blur(function() {
            //toastr["warning"]('<b>[SERVER]:</b> Do not change this unless you know what it is');
            window.MiniclipConfigDestination = $("#GameConfigurationUrl").val();
            LoadGameConfiguration();
            //setTimeout(function() {
                //populateSD();
            //}, 1500);
        });
        $("#CloseSpecialDeals").off('click').on('click', function(e) {
            if (e) e.stopPropagation();
            if (window._shopLoginCheckInterval) {
                clearInterval(window._shopLoginCheckInterval);
                window._shopLoginCheckInterval = null;
            }
            $("#specialShopModal").remove();
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");
        });
        $("#FAQSpecialDeals").off('click').on('click', function(e) {
            if (e) e.stopPropagation();
            window.open('https://jimboy3100.github.io/LMexpress/olddeals.html', '_blank');
        });
        $(".xpmt-buy-content").click(function() {
            toastr["warning"]('<div id="tutorial" style="background-image: url(https://jimboy3100.github.io/banners/v25toastricon.jpg); color:#018cf6; font-size:16px; text-align:center">' + Premadeletter90 + ' v0.5<br>' + 'This is a BETA function, it may not work and you may loose your money' + '<br><font color="red">' + Premadeletter91a + '</font>' + '</br> <button class="btn btn-sm btn-primary" style="width: 100%; margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button></div>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            $(".btn.btn-sm.btn-primary").click(function() {
                buydeals();
            });
        });
        $('#agario_uid_input').blur(function() {
            //if (letterCount($('#agario_uid_input').val(), '-', true) == 4) {
            if ($('#agario_uid_input').val().length > 50) {

                document.getElementById("checkBoxLockUID").checked = true;
                toastr["info"](Premadeletter92).css("width", "250px");
                $("#exp-uid").text($('#agario_uid_input').val());
            } else {
                document.getElementById("checkBoxLockUID").checked = false;
                toastr["info"](Premadeletter93).css("width", "210px");
                $("#exp-uid").text(window.agarioEncodedUID);
            }
        });
        $('#ss-select-purchases').on('change', function() {
            $(".xpmt-skins2").css('background-image', '');
            $(".xpmt-skins").css('background-image', '');
            console.log(this.value);
            findSDescription();
            //$(".xpmt-skins2").remove();
            if ($("#ss-select-purchases option:selected").text().includes('dna') && !$("#ss-select-purchases option:selected").text().includes('coins')) {
                $(".xpmt-money-stack").text($("#ss-select-purchases option:selected").text().substr(0, $("#ss-select-purchases option:selected").text().indexOf('_')) + " DNA");
            } else {
                $(".xpmt-money-stack").text($("#ss-select-purchases option:selected").text().substr(0, $("#ss-select-purchases option:selected").text().indexOf('_')) + " C");
            }
            $("#dealcost").text($("#ss-select-purchases option:selected").text().split('=').pop());

            var textcropped1 = $("#ss-select-purchases option:selected").text().split('1_skin_').pop();
            textcropped2 = $("#ss-select-purchases option:selected").text();
            if (textcropped2.split('1_skin_', 2)[1]) {
                textcropped2 = "skin_" + textcropped2.split('1_skin_', 2)[1].slice(0, -1);
            }
            textcropped1 = "skin_" + textcropped1.substr(0, textcropped1.indexOf(' ')).replace(' ', '');
            //textcropped1 = textcropped1.charAt(0).toUpperCase() + textcropped1.slice(1);
            textcropped1 = textcropped1.charAt(0) + textcropped1.slice(1);
            //if (textcropped1=="jade_dragon"){
            //textcropped1="Journey_JadeDragon";
            //}
            for (i = 0; i < GameConfiguration.gameConfig["Gameplay - Equippable Skins"].length; i++) {
                if (GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].productId == textcropped1) {
                    textcropped1 = GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].image;
                    //textcropped1 = textcropped1.substring(0, textcropped1.indexOf('.'));
                }
            }
            for (i = 0; i < GameConfiguration.gameConfig["Gameplay - Equippable Skins"].length; i++) {
                if (GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].productId == textcropped2) {
                    textcropped2 = GameConfiguration.gameConfig["Gameplay - Equippable Skins"][i].image;
                    //textcropped1 = textcropped1.substring(0, textcropped1.indexOf('.'));
                }
            }
            //$(".xpmt-skins").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/v15/2230/' + textcropped1 + '.png")');
            setTimeout(function() {
                /*
                 if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal7") {
                     $(".xpmt-skins").css('background-image', 'url(' + window.MiniclipDestination + 'Blueberry_Face.png ")');
                 } 
				 */
                $(".xpmt-skins").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/' + window.agarversion + textcropped2 + '")');
                $(".xpmt-skins2").css('background-image', 'url("https://configs-web.agario.miniclippt.com/live/' + window.agarversion + textcropped1 + '")');
            }, 500);
        });
}

//EU OR USD
function buydeals() {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to buy deals');
        return;
    }
    if (!window.agarioEncodedUID) {
        toastr && toastr.error('<b>[SHOP]:</b> No UID. Play a game first!');
        return;
    }
    var uid = $("#exp-uid").text() || window.agarioEncodedUID;
    var purchaseId = $("#ss-select-purchases option:selected").val();
    var currency = $("#BuyDealCurrency").val() || 'USD';
    if (!purchaseId) {
        toastr && toastr.warning('<b>[SHOP]:</b> Select a deal first');
        return;
    }
    $.ajax({
        type: "GET",
        url: "https://payments.agario.miniclippt.com/pay/" + uid + "/" + purchaseId + "/" + currency,
        datatype: "json",
        success: function(info) {
            if (info && info.iframe_url) {
                window.open(info.iframe_url, "PopupWindow", "width=600,height=600,scrollbars=yes,resizable=no");
            } else {
                toastr && toastr.error('<b>[SHOP]:</b> Payment not available for this deal');
            }
        },
        error: function() {
            toastr && toastr.error('<b>[SHOP]:</b> Payment endpoint unavailable');
        }
    });
}

// ========================================
// === DEALS TAB — Enhanced Functions ===
// ========================================

/**
 * Update the deals tab balance display
 */
function updateDealsBalance() {
    var dna = 0, coins = 0;
    var userObj = (window.legendmod && window.legendmod.user) || (window.application && window.application.user);
    if (userObj) {
        dna = userObj.dna || 0;
        coins = userObj.coins || 0;
    }
    var appObj = (window.legendmod && window.legendmod.userInfo) ? window.legendmod : window.application;
    if (appObj && appObj.userInfo && appObj.userInfo.userWalletItems) {
        var items = appObj.userInfo.userWalletItems || [];
        for (var i = 0; i < items.length; i++) {
            var prod = items[i].productId || '';
            var qty = items[i].quantity || 0;
            if (prod.indexOf('dna') !== -1 && !dna) dna += qty;
            if (prod.indexOf('coins') !== -1 && !coins) coins += qty;
        }
    }
    if (!dna && $('#dna').length) {
        var dText = $('#dna').text().replace(/[^0-9]/g, '');
        if (dText) dna = parseInt(dText, 10);
    }
    if (!coins && $('#coins').length) {
        var cText = $('#coins').text().replace(/[^0-9]/g, '');
        if (cText) coins = parseInt(cText, 10);
    }
    $('#dealsDnaCount').text(dna.toLocaleString());
    $('#dealsCoinsCount').text(coins.toLocaleString());
}

/**
 * Claim free coins via opcode 110 (activateTimedEvent)
 * Response comes back on opcode 111 — ogario.v4.js case 111 calls refreshDealsTab().
 */
function claimFreeCoins() {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in');
        return;
    }
    if (!window.application || !window.application.activateTimedEvent) {
        toastr && toastr.error('<b>[SHOP]:</b> Protocol not ready. Play a game first!');
        return;
    }
    var btn = document.getElementById('claimFreeCoinsBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Claiming...';
        btn.style.opacity = '0.6';
    }
    window.application.activateTimedEvent('hourlyBonus');
    // ogario.v4.js case 111 will call refreshDealsTab() on server response.
    // Safety fallback in case response is delayed or lost:
    window._freeCoinsTimeout = setTimeout(function() {
        if (btn && btn.disabled) {
            btn.disabled = false;
            btn.textContent = 'Claim!';
            btn.style.opacity = '1';
        }
        updateDealsBalance();
    }, 10000);
}
window.claimFreeCoins = claimFreeCoins;

/**
 * Populate the deals grid with cards from GameConfiguration
 */
function populateDealsGrid() {
    var grid = document.getElementById('dealsGrid');
    if (!grid) return;

    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) {
        grid.innerHTML = '<div style="text-align: center; color: ' + getShopTheme().tc2 + '; padding: 20px;">Loading deals... Configuration not ready.</div>';
        return;
    }

    var iaps = window.GameConfiguration.gameConfig['Wallet - In-App Purchases'] || [];
    var bundles = window.GameConfiguration.gameConfig['Visual - Bundles'] || [];
    var softPurchases = window.GameConfiguration.gameConfig['Wallet - Soft Purchases'] || [];
    var bundleProducts = window.GameConfiguration.gameConfig['Wallet - Bundle Products'] || [];

    if (iaps.length === 0 && softPurchases.length === 0) {
        grid.innerHTML = '<div style="text-align: center; color: ' + getShopTheme().tc2 + '; padding: 20px;">No deals available.</div>';
        return;
    }

    var html = '';
    var priceMap = { '2': '$1.99', '5': '$4.99', '10': '$9.99', '20': '$19.99', '50': '$49.99', '60': '$99.99' };
    var t = getShopTheme(); // theme-aware colors

    // Build bundle lookup
    var bundleLookup = {};
    for (var b = 0; b < bundles.length; b++) {
        bundleLookup[bundles[b].bundleId] = bundles[b];
    }

    // Build product lookup for bundle contents
    var productLookup = {};
    for (var bp = 0; bp < bundleProducts.length; bp++) {
        var bpId = bundleProducts[bp].bundleId;
        if (!productLookup[bpId]) productLookup[bpId] = [];
        productLookup[bpId].push(bundleProducts[bp]);
    }

    // --- IAP Deals (real money) ---
    for (var i = 0; i < iaps.length; i++) {
        var deal = iaps[i];
        var bundleInfo = bundleLookup[deal.bundleId] || {};
        var price = priceMap[deal.priceTier] || ('Tier ' + deal.priceTier);
        var desc = (bundleInfo.description && bundleInfo.description !== 'na')
            ? bundleInfo.description.replace(/_/g, ' ').replace(' name', '')
            : deal.bundleId.replace(/com\.miniclip\.agar\.io\./g, '').replace(/_/g, ' ');

        // Figure out what's in the bundle
        var contents = productLookup[deal.bundleId] || [];
        var contentText = '';
        for (var c = 0; c < contents.length; c++) {
            var pid = contents[c].productId || '';
            var qty = contents[c].quantity || 1;
            var label = pid.replace(/_/g, ' ');
            if (pid.indexOf('coins') !== -1) label = '💰 ' + qty.toLocaleString() + ' Coins';
            else if (pid.indexOf('dna') !== -1) label = '🧬 ' + qty.toLocaleString() + ' DNA';
            else if (pid.indexOf('skin') !== -1) label = '🎨 ' + pid.replace('skin_', '').replace(/_/g, ' ');
            else if (pid.indexOf('boost') !== -1) label = '🚀 ' + pid.replace(/_/g, ' ');
            else label = qty + 'x ' + label;
            contentText += '<span style="font-size: 10px; display: inline-block; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 3px; margin: 1px;">' + label + '</span> ';
        }
        if (!contentText) contentText = '<span style="font-size: 10px; color: ' + t.tc2 + ';">Bundle</span>';

        // Resolve up to 2 skin images for preview
        var skinImgs = getDealSkinImages(deal.bundleId);

        // Build the icon area — 0, 1, or 2 stacked skin previews
        var iconHtml = '';
        if (skinImgs.length >= 2) {
            // Two skins stacked/overlapping
            iconHtml += '<div style="position: relative; min-width: 56px; width: 56px; height: 56px;">';
            iconHtml += '<img src="' + skinImgs[0] + '" style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid ' + t.mc + '; z-index: 2;" onerror="this.style.display=\'none\'">';
            iconHtml += '<img src="' + skinImgs[1] + '" style="position: absolute; bottom: 0; right: 0; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid ' + t.b3 + '; z-index: 1;" onerror="this.style.display=\'none\'">';
            iconHtml += '</div>';
        } else if (skinImgs.length === 1) {
            // One skin centered
            iconHtml += '<div style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid ' + t.mc + ';">';
            iconHtml += '<img src="' + skinImgs[0] + '" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML=\'💎\'">';
            iconHtml += '</div>';
        } else {
            // No skin — show default gem icon
            iconHtml += '<div style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; background: ' + t.pc2 + '; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid ' + t.mc + ';">💎</div>';
        }

        html += '<div class="deal-card" style="background: rgba(255,255,255,0.04); border: 1px solid ' + t.pc2 + '; border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; transition: border-color 0.2s;">';
        html += iconHtml;
        html += '<div style="flex: 1; min-width: 0;">';
        html += '<div style="font-weight: 700; font-size: 13px; color: ' + t.tc + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + desc + '</div>';
        html += '<div style="line-height: 1.4; margin-top: 2px;">' + contentText + '</div>';
        html += '</div>';
        html += '<div style="text-align: right; min-width: 70px;">';
        html += '<div style="font-size: 14px; font-weight: 700; color: ' + t.mc + ';">' + price + '</div>';
        html += '<button class="btn btn-xs deal-buy-btn" onclick="buyDealIAP(\'' + deal.id + '\', \'' + desc.replace(/'/g, "\\'") + '\')" style="background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 700; border: none; border-radius: 4px; padding: 3px 12px; margin-top: 3px; font-size: 11px; cursor: pointer;">Buy</button>';
        html += '</div>';
        html += '</div>';
    }

    // --- Soft Purchases (DNA/Coins) ---
    for (var s = 0; s < softPurchases.length; s++) {
        var sp = softPurchases[s];
        if (!sp.purchaseId) continue;
        var spDesc = sp.purchaseId.replace(/com\.miniclip\.agar\.io\./g, '').replace(/_/g, ' ');
        var currType = (sp.currencyType || '').toLowerCase();
        var currIcon = currType.indexOf('dna') !== -1 ? '🧬' : '💰';
        var currAmount = sp.currencyAmount || 0;

        // Skip skin and potion purchases (shown in skins tab)
        if (sp.purchaseId.indexOf('skin_') !== -1 || sp.purchaseId.indexOf('potion') !== -1) continue;

        // Boost soft purchases get a special icon and label
        var isBoostPurchase = sp.purchaseId.indexOf('boost') !== -1;
        var dealIcon = isBoostPurchase ? '🚀' : '🛒';
        var dealBorder = isBoostPurchase ? t.mc : t.b3;

        html += '<div class="deal-card" style="background: rgba(255,255,255,0.04); border: 1px solid ' + t.pc2 + '; border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">';
        html += '<div class="deal-icon" style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; background: ' + t.pc2 + '; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid ' + dealBorder + ';">' + dealIcon + '</div>';
        html += '<div style="flex: 1; min-width: 0;">';
        html += '<div style="font-weight: 700; font-size: 13px; color: ' + dealBorder + ';">' + spDesc + '</div>';
        html += '<div style="font-size: 11px; color: ' + t.tc2 + ';">' + currIcon + ' ' + currAmount.toLocaleString() + ' ' + currType + '</div>';
        html += '</div>';
        html += '<button class="btn btn-xs" onclick="buyDealSoft(\'' + sp.purchaseId + '\', ' + currAmount + ', \'' + currType + '\')" style="background: ' + dealBorder + '; color: ' + t.btc + '; font-weight: 700; border: none; border-radius: 4px; padding: 4px 14px; font-size: 11px; cursor: pointer;">Buy</button>';
        html += '</div>';
    }

    // --- Owned Boosts (Activate) ---
    var boostSrc = (window.application && window.application.user && window.application.user.boosts) || {};
    var boostHtml = '';
    for (var pid in boostSrc) {
        if (pid.indexOf('boost') !== -1 && boostSrc[pid] > 0) {
            var bQty = boostSrc[pid];
            var bName = pid.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            boostHtml += '<div class="deal-card" style="background: rgba(255,255,255,0.04); border: 1px solid ' + t.mc + '44; border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">';
            boostHtml += '<div class="deal-icon" style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; background: ' + t.mc + '22; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid ' + t.mc + ';">🚀</div>';
            boostHtml += '<div style="flex: 1; min-width: 0;">';
            boostHtml += '<div style="font-weight: 700; font-size: 13px; color: ' + t.mc + ';">' + bName + '</div>';
            boostHtml += '<div style="font-size: 11px; color: ' + t.tc2 + ';">Owned: ' + bQty + 'x</div>';
            boostHtml += '</div>';
            boostHtml += '<button class="btn btn-xs" onclick="activateBoost(\'' + pid + '\')" style="background: ' + t.mc + '; color: #000; font-weight: 700; border: none; border-radius: 4px; padding: 4px 14px; font-size: 11px; cursor: pointer;">Activate</button>';
            boostHtml += '</div>';
        }
    }
    if (boostHtml) {
        html += '<div style="font-weight: 700; font-size: 12px; color: ' + t.mc + '; margin: 12px 0 6px; padding-top: 8px; border-top: 1px solid ' + t.pc2 + ';">🚀 Your Boosts</div>';
        html += boostHtml;
    }

    // --- Offer Bundles ---
    for (var ob = 0; ob < bundles.length; ob++) {
        var bundle = bundles[ob];
        if (!bundle.bundleId) continue;
        // Skip bundles already shown as IAP deals
        var alreadyShown = false;
        for (var ai = 0; ai < iaps.length; ai++) {
            if (iaps[ai].bundleId === bundle.bundleId) { alreadyShown = true; break; }
        }
        if (alreadyShown) continue;

        var bDesc = (bundle.description && bundle.description !== 'na')
            ? bundle.description.replace(/_/g, ' ').replace(' name', '')
            : bundle.bundleId.replace(/com\.miniclip\.agar\.io\./g, '').replace(/_/g, ' ');

        // Build contents list
        var bContents = productLookup[bundle.bundleId] || [];
        var bContentText = '';
        for (var bc = 0; bc < bContents.length; bc++) {
            var bcPid = bContents[bc].productId || '';
            var bcQty = bContents[bc].quantity || 1;
            var bcLabel = bcPid.replace(/_/g, ' ');
            if (bcPid.indexOf('coins') !== -1) bcLabel = '💰 ' + bcQty.toLocaleString() + ' Coins';
            else if (bcPid.indexOf('dna') !== -1) bcLabel = '🧬 ' + bcQty.toLocaleString() + ' DNA';
            else if (bcPid.indexOf('skin') !== -1) bcLabel = '🎨 ' + bcPid.replace('skin_', '').replace(/_/g, ' ');
            else if (bcPid.indexOf('boost') !== -1) bcLabel = '🚀 ' + bcPid.replace(/_/g, ' ');
            else bcLabel = bcQty + 'x ' + bcLabel;
            bContentText += '<span style="font-size: 10px; display: inline-block; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 3px; margin: 1px;">' + bcLabel + '</span> ';
        }
        if (!bContentText) bContentText = '<span style="font-size: 10px; color: ' + t.tc2 + ';">Bundle</span>';

        // Resolve up to 2 skin images
        var bSkinImgs = getDealSkinImages(bundle.bundleId);

        // Build icon area — same stacked skin logic
        var bIconHtml = '';
        if (bSkinImgs.length >= 2) {
            bIconHtml += '<div style="position: relative; min-width: 56px; width: 56px; height: 56px;">';
            bIconHtml += '<img src="' + bSkinImgs[0] + '" style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid ' + t.b1 + '; z-index: 2;" onerror="this.style.display=\'none\'">';
            bIconHtml += '<img src="' + bSkinImgs[1] + '" style="position: absolute; bottom: 0; right: 0; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid ' + t.b3 + '; z-index: 1;" onerror="this.style.display=\'none\'">';
            bIconHtml += '</div>';
        } else if (bSkinImgs.length === 1) {
            bIconHtml += '<div style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid ' + t.b1 + ';">';
            bIconHtml += '<img src="' + bSkinImgs[0] + '" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML=\'📦\'">';
            bIconHtml += '</div>';
        } else {
            bIconHtml += '<div style="min-width: 50px; width: 50px; height: 50px; border-radius: 50%; background: ' + t.b1 + '22; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid ' + t.b1 + ';">📦</div>';
        }

        html += '<div class="deal-card" style="background: rgba(255,255,255,0.04); border: 1px solid ' + t.b1 + '66; border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">';
        html += bIconHtml;
        html += '<div style="flex: 1; min-width: 0;">';
        html += '<div style="font-weight: 700; font-size: 13px; color: ' + t.tc + '; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + bDesc + '</div>';
        html += '<div style="line-height: 1.4; margin-top: 2px;">' + bContentText + '</div>';
        html += '</div>';
        html += '<button class="btn btn-xs" onclick="buyDealBundle(\'' + bundle.bundleId + '\', \'' + bDesc.replace(/'/g, "\\'") + '\')" style="background: ' + t.b1 + '; color: ' + t.btc + '; font-weight: 700; border: none; border-radius: 4px; padding: 4px 14px; font-size: 11px; cursor: pointer;">Buy</button>';
        html += '</div>';
    }

    if (!html) {
        html = '<div style="text-align: center; color: ' + t.tc2 + '; padding: 20px;">No deals found in configuration.</div>';
    }

    grid.innerHTML = html;
}
window.populateDealsGrid = populateDealsGrid;
window.refreshDealsTab = function() {
    populateDealsGrid();
    updateDealsBalance();
    // Clear safety timeouts if server responded before they fired
    if (window._dealSoftTimeout) {
        clearTimeout(window._dealSoftTimeout);
        window._dealSoftTimeout = null;
    }
    if (window._dealBundleTimeout) {
        clearTimeout(window._dealBundleTimeout);
        window._dealBundleTimeout = null;
    }
    if (window._boostTimeout) {
        clearTimeout(window._boostTimeout);
        window._boostTimeout = null;
    }
    if (window._deleteTimeout) {
        clearTimeout(window._deleteTimeout);
        window._deleteTimeout = null;
    }
    if (window._rewardLinkTimeout) {
        clearTimeout(window._rewardLinkTimeout);
        window._rewardLinkTimeout = null;
    }
    if (window._adRewardTimeout) {
        clearTimeout(window._adRewardTimeout);
        window._adRewardTimeout = null;
    }
    // Reset reward link button
    var rlBtn = document.getElementById('activateRewardLinkBtn');
    if (rlBtn) { rlBtn.disabled = false; rlBtn.textContent = 'Activate'; rlBtn.style.opacity = '1'; rlBtn.style.pointerEvents = 'auto'; }
    // Reset ad reward button
    var arBtn = document.getElementById('adRewardBtn');
    if (arBtn) { arBtn.disabled = false; arBtn.innerHTML = '📺 Ad Reward'; arBtn.style.opacity = '1'; arBtn.style.pointerEvents = 'auto'; }
};

/**
 * Get skin image URL for a deal bundle
 */
function getDealSkinImages(bundleId) {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return [];
    var bundleProducts = window.GameConfiguration.gameConfig['Wallet - Bundle Products'] || [];
    var skins = window.GameConfiguration.gameConfig['Gameplay - Equippable Skins'] || [];
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/10913/');
    var images = [];

    for (var bp = 0; bp < bundleProducts.length; bp++) {
        if (bundleProducts[bp].bundleId === bundleId) {
            var prodId = bundleProducts[bp].productId;
            if (prodId && prodId.indexOf('skin') !== -1) {
                for (var s = 0; s < skins.length; s++) {
                    if (skins[s].productId === prodId && skins[s].image) {
                        images.push(cdnBase + skins[s].image);
                        if (images.length >= 2) return images; // max 2
                        break;
                    }
                }
            }
        }
    }
    return images;
}
// Backwards compat wrapper
function getDealSkinImage(bundleId) {
    var imgs = getDealSkinImages(bundleId);
    return imgs.length > 0 ? imgs[0] : null;
}

/**
 * Buy a deal via IAP payment URL (real money)
 */
function buyDealIAP(dealId, dealDesc) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to buy deals');
        return;
    }
    if (!window.agarioEncodedUID) {
        toastr && toastr.error('<b>[SHOP]:</b> No UID. Play a game first!');
        return;
    }

    if (!confirm('Purchase "' + dealDesc + '"?\n\nThis will open a payment window.\nMake sure you are logged in.')) {
        return;
    }

    var uid = $('#exp-uid').text() || window.agarioEncodedUID;
    var currency = $('#BuyDealCurrency').val() || 'USD';

    $.ajax({
        type: 'GET',
        url: 'https://payments.agario.miniclippt.com/pay/' + uid + '/' + dealId + '/' + currency,
        datatype: 'json',
        success: function(info) {
            if (info && info.iframe_url) {
                window.open(info.iframe_url, 'PopupWindow', 'width=600,height=600,scrollbars=yes,resizable=no');
                toastr.info('<b>[SHOP]:</b> Payment window opened. Complete the purchase there.');
            } else {
                toastr && toastr.error('<b>[SHOP]:</b> Payment not available for this deal');
            }
        },
        error: function() {
            toastr && toastr.error('<b>[SHOP]:</b> Payment endpoint unavailable');
        }
    });
}
window.buyDealIAP = buyDealIAP;

/**
 * Buy a deal via soft purchase (DNA/Coins) — opcode 70
 * Response comes on opcode 71 — ogario.v4.js case 71 calls refreshSkinGrid() & shows toastr.
 */
function buyDealSoft(purchaseId, cost, currencyType) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in');
        return;
    }
    if (!window.application || !window.application.softPurchase) {
        toastr && toastr.error('<b>[SHOP]:</b> Protocol not ready. Play a game first!');
        return;
    }

    var currLabel = currencyType.indexOf('dna') !== -1 ? 'DNA' : 'Coins';
    if (!confirm('Buy "' + purchaseId.replace(/_/g, ' ') + '" for ' + cost.toLocaleString() + ' ' + currLabel + '?')) {
        return;
    }

    // Disable all deal Buy buttons to prevent double-clicks
    var allBtns = document.querySelectorAll('#dealsGrid .btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].disabled = true;
        allBtns[i].style.opacity = '0.5';
        allBtns[i].style.pointerEvents = 'none';
    }

    toastr.info('<b>[SHOP]:</b> Sending purchase request...');
    window.application.softPurchase(purchaseId);
    // ogario.v4.js case 71 handles the response (toastr + refreshSkinGrid + refreshDealsTab).
    // refreshDealsTab() repopulates the grid which resets all buttons.
    // Safety fallback to restore buttons if response is delayed:
    window._dealSoftTimeout = setTimeout(function() {
        var btns = document.querySelectorAll('#dealsGrid .btn');
        for (var j = 0; j < btns.length; j++) {
            btns[j].disabled = false;
            btns[j].style.opacity = '1';
            btns[j].style.pointerEvents = 'auto';
        }
        updateDealsBalance();
    }, 10000);
}
window.buyDealSoft = buyDealSoft;

/**
 * Buy a deal via offer bundle — opcode 77 (Offer_bundle_request)
 * Used for bundles with type "OFFER" in the official client.
 * Response comes on opcode 78 — ogario.v4.js case 78.
 */
function buyDealBundle(bundleId, dealDesc) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }
    if (!confirm('Purchase bundle "' + dealDesc + '"?')) return;

    // Disable all deal buttons to prevent double-clicks
    var allBtns = document.querySelectorAll('#dealsGrid .btn');
    for (var bi = 0; bi < allBtns.length; bi++) {
        allBtns[bi].disabled = true;
        allBtns[bi].style.opacity = '0.5';
        allBtns[bi].style.pointerEvents = 'none';
    }

    // Use sendProto to encode Offer_bundle_request { bundleId } via opcode 77
    if (!window.application || !window.application.sendProto) {
        toastr.error('<b>[SHOP]:</b> Protocol not ready. Play a game first!');
        // Re-enable buttons
        var btns2 = document.querySelectorAll('#dealsGrid .btn');
        for (var j = 0; j < btns2.length; j++) { btns2[j].disabled = false; btns2[j].style.opacity = '1'; btns2[j].style.pointerEvents = 'auto'; }
        return;
    }
    var sent = window.application.sendProto(77, { offerBundleRequestField: { bundleId: bundleId } });
    if (sent) {
        toastr.info('<b>[SHOP]:</b> Bundle purchase request sent...');
        console.log('[SHOP] Sent offer bundle request for ' + bundleId);
    } else {
        toastr.error('<b>[SHOP]:</b> Failed to send bundle request');
        var btns3 = document.querySelectorAll('#dealsGrid .btn');
        for (var j2 = 0; j2 < btns3.length; j2++) { btns3[j2].disabled = false; btns3[j2].style.opacity = '1'; btns3[j2].style.pointerEvents = 'auto'; }
        return;
    }
    // ogario.v4.js case 78 handles response → refreshDealsTab repopulates grid.
    // Safety fallback to restore buttons if response is delayed:
    window._dealBundleTimeout = setTimeout(function() {
        var btns = document.querySelectorAll('#dealsGrid .btn');
        for (var k = 0; k < btns.length; k++) {
            btns[k].disabled = false;
            btns[k].style.opacity = '1';
            btns[k].style.pointerEvents = 'auto';
        }
        updateDealsBalance();
    }, 10000);
}
window.buyDealBundle = buyDealBundle;

/**
 * Activate a boost — opcode 112 (Activate_boost_request)
 * Response comes on opcode 113 — ogario.v4.js case 113.
 */
function activateBoost(productId) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }
    var displayName = productId.replace(/_/g, ' ');
    if (!confirm('Activate boost "' + displayName + '"?')) return;

    // Disable all deal buttons to prevent double-clicks
    var allBtns = document.querySelectorAll('#dealsGrid .btn');
    for (var bi = 0; bi < allBtns.length; bi++) {
        allBtns[bi].disabled = true;
        allBtns[bi].style.opacity = '0.5';
        allBtns[bi].style.pointerEvents = 'none';
    }

    // Use sendProto via application object
    if (!window.application || !window.application.activateBoost) {
        toastr.error('<b>[SHOP]:</b> Protocol not ready. Play a game first!');
        var btns2 = document.querySelectorAll('#dealsGrid .btn');
        for (var j = 0; j < btns2.length; j++) { btns2[j].disabled = false; btns2[j].style.opacity = '1'; btns2[j].style.pointerEvents = 'auto'; }
        return;
    }
    var sent = window.application.activateBoost(productId);
    if (!sent) {
        toastr.error('<b>[SHOP]:</b> Failed to activate boost');
        var btns3 = document.querySelectorAll('#dealsGrid .btn');
        for (var j2 = 0; j2 < btns3.length; j2++) { btns3[j2].disabled = false; btns3[j2].style.opacity = '1'; btns3[j2].style.pointerEvents = 'auto'; }
        return;
    }
    // ogario.v4.js case 113 handles response → refreshDealsTab repopulates grid.
    // Safety fallback:
    window._boostTimeout = setTimeout(function() {
        var btns = document.querySelectorAll('#dealsGrid .btn');
        for (var k = 0; k < btns.length; k++) {
            btns[k].disabled = false;
            btns[k].style.opacity = '1';
            btns[k].style.pointerEvents = 'auto';
        }
        updateDealsBalance();
    }, 10000);
}
window.activateBoost = activateBoost;


var skinShopPage = 0;
var skinShopPerPage = 60;
var skinShopFiltered = [];

function getOwnedSkinsMap() {
    if (window.legendmod && window.legendmod.user && window.legendmod.user.skins) {
        return window.legendmod.user.skins;
    }
    if (window.application && window.application.user && window.application.user.skins) {
        return window.application.user.skins;
    }
    return {};
}

function isSkinOwned(s, ownedSkinsObj) {
    if (!ownedSkinsObj) ownedSkinsObj = getOwnedSkinsMap();
    var rawId = s.productId;
    var modId = s.productId ? s.productId.replace('skin_', '%') : '';
    var cleanId = s.productId ? s.productId.replace('skin_', '') : '';

    if (ownedSkinsObj.hasOwnProperty(rawId) || ownedSkinsObj.hasOwnProperty(modId) || ownedSkinsObj.hasOwnProperty(cleanId)) {
        return true;
    }

    for (var k in ownedSkinsObj) {
        if (ownedSkinsObj.hasOwnProperty(k)) {
            var item = ownedSkinsObj[k];
            if (item) {
                if (item.productId === rawId || item.productId === modId || item.productId === cleanId) return true;
                if (typeof k === 'string' && s.image && k.indexOf(s.image) !== -1) return true;
            }
        }
    }
    return false;
}

function populateSkins() {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig || !window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"]) {
        setTimeout(populateSkins, 1500);
        return;
    }

    var skins = window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"];
    var currentFilter = 'all';

    function applySkinFilters() {
        var query = $('#skinSearchBar').val().toLowerCase().trim();
        var ownedSkinsObj = getOwnedSkinsMap();

        skinShopFiltered = skins.filter(function(s) {
            if (s.productId === 'skin_empty') return false;

            if (currentFilter === 'owned') {
                if (!isSkinOwned(s, ownedSkinsObj)) return false;
            }

            if (query !== '') {
                var name = (s.displayName || s.productId.replace('skin_', '').replace(/_/g, ' ')).toLowerCase();
                var pid = s.productId.toLowerCase();
                if (name.indexOf(query) === -1 && pid.indexOf(query) === -1) return false;
            }

            return true;
        });

        skinShopPage = 0;
        $('#skinGrid').empty();

        if (currentFilter === 'owned' && skinShopFiltered.length === 0) {
            $('#skinGrid').html('<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: ' + getShopTheme().tc2 + '; font-size: 13px;">No owned skins detected on this session.<br><span style="font-size: 11px; color: ' + getShopTheme().tc2 + ';">Log in with Google/Facebook or switch to <b>All Skins</b> to equip any skin.</span></div>');
            $('#skinCount').text(0);
            $('#skinTotal').text(0);
            $('#skinLoadMore').hide();
        } else {
            renderSkinPage();
        }
    }

    // Filter button handler
    $('.skin-filter-btn').off('click').on('click', function() {
        var _ds = window.defaultSettings || {};
        $('.skin-filter-btn').removeClass('active').css({ background: 'rgba(255,255,255,0.1)', color: _ds.menuTextColor2 || '#8096a7', border: '1px solid ' + (_ds.menuPanelColor2 || '#002f52') });
        $(this).addClass('active').css({ background: _ds.btn1Color || '#018cf6', color: _ds.menuBtnTextColor || '#ffffff', border: 'none' });
        currentFilter = $(this).data('filter');
        applySkinFilters();
    });

    // Search handler
    $('#skinSearchBar').off('input').on('input', function() {
        applySkinFilters();
    });

    // Load more handler
    $('#skinLoadMore').off('click').on('click', function() {
        renderSkinPage();
    });

    applySkinFilters();
    updateEquippedSkinUI();

    // Update filter button with actual skin count
    $('.skin-filter-btn[data-filter="all"]').text('All Skins (' + skins.length + ')');

    // Update owned skin count
    var ownedSkinsObj = getOwnedSkinsMap();
    var ownedCount = 0;
    skins.forEach(function(s) {
        if (s.productId !== 'skin_empty' && isSkinOwned(s, ownedSkinsObj)) ownedCount++;
    });
    if (ownedCount > 0) {
        $('.skin-filter-btn[data-filter="owned"]').html('&#x2B50; My Owned Skins (' + ownedCount + ')');
    }

    // Expose for external refresh (server wallet updates, purchases, etc.)
    window._skinShopRefresh = applySkinFilters;
}

function openCustomSkinUploader() {
    if (window.application && typeof window.application.setupSkinUploadInterface === 'function') {
        window.application.setupSkinUploadInterface();
    }
    if ($('#custom-skin-uploader').length) {
        $('#custom-skin-uploader').fadeIn(200);
    } else {
        $('.quick-custom-skin').trigger('click');
    }
}

/**
 * Refresh the skin shop grid — call after server confirms a purchase,
 * wallet update, or custom skin creation to update owned/equipped badges.
 */
function refreshSkinGrid() {
    if (typeof window._skinShopRefresh === 'function') {
        window._skinShopRefresh();
        console.log('[SKIN SHOP] Grid refreshed');
    } else {
        // populateSkins hasn't run yet or tab not opened — defer
        console.log('[SKIN SHOP] Grid refresh deferred (shop not initialized)');
    }
    updateEquippedSkinUI();
}
window.refreshSkinGrid = refreshSkinGrid;

/**
 * Delete a custom skin from the server (opcode 152).
 * Custom skins have productId like "skin_custom_<uuid>_<uuid>".
 */
function deleteCustomSkin(skinId) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to delete skins');
        return;
    }
    if (!skinId || !skinId.includes('custom_')) {
        toastr && toastr.error('<b>[SHOP]:</b> Only custom skins can be deleted');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }

    // Disable the delete button on this skin card to prevent double-clicks
    var cardBtn = $('.skin-card[data-product-id="' + skinId + '"] .skin-btn-delete, .skin-card[data-product-id="' + skinId + '"] .skin-btn-buy');
    cardBtn.prop('disabled', true).css({ opacity: 0.5, pointerEvents: 'none' }).text('Deleting...');

    // Official client flow (agario.js:38643-38644):
    //   createDeleteUserSkinRequestMessage(skinId) → set_skinId(skinId)
    //   sendMessage(152, deleteMsg)
    if (window.mesega) {
        try {
            var buffer = window.mesega.encode({
                contentType: 1,
                uncompressedData: {
                    type: 152,
                    userSkinsDeleteField: {
                        skinId: skinId
                    }
                }
            }).finish();
            window.core.proxyMobileData(buffer);
            console.log('[SKIN] Sent delete request for ' + skinId);
            toastr && toastr.info('<b>[SERVER]:</b> Delete request sent for custom skin...');
        } catch (e) {
            console.error('[SKIN] Delete encode error:', e);
            // Fallback: manual protobuf bytes — field 1 (skinId), wire type 2 (string)
            // Tag = (1 << 3) | 2 = 10, then varint length, then bytes
            var skinIdBytes = [];
            for (var i = 0; i < skinId.length; i++) skinIdBytes.push(skinId.charCodeAt(i));
            var innerMsg = [10, skinId.length].concat(skinIdBytes); // field 1, wire type 2
            var outerField = [194, 9]; // field 152, wire type 2 = (152 << 3 | 2) encoded as varint
            application.writeUint32(outerField, innerMsg.length);
            var wrapper = [8, 1, 18];
            var innerPayload = [8, 152, 1].concat(outerField).concat(innerMsg);
            application.writeUint32(wrapper, innerPayload.length);
            var bytes = wrapper.concat(innerPayload);
            window.core.proxyMobileData(new Uint8Array(bytes));
            toastr && toastr.info('<b>[SERVER]:</b> Delete request sent (fallback)...');
        }
    } else {
        toastr && toastr.error('<b>[ERROR]:</b> Protobuf not loaded');
        cardBtn.prop('disabled', false).css({ opacity: 1, pointerEvents: 'auto' }).text('Delete');
        return;
    }
    // ogario.v4.js case 152 handles response → refreshSkinGrid rebuilds grid.
    // Safety fallback to restore the button if response is lost:
    window._deleteTimeout = setTimeout(function() {
        cardBtn.prop('disabled', false).css({ opacity: 1, pointerEvents: 'auto' }).text('Delete');
    }, 10000);
}
window.deleteCustomSkin = deleteCustomSkin;

function equipSkin(productId, imageName) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to equip skins');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }

    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/10913/');
    localStorage.setItem('equippedSkinId', productId);
    if (imageName) localStorage.setItem('equippedSkinImage', imageName);

    // Update server tracking so updateEquippedSkinUI stays in sync
    window.serverEquippedSkinId = productId;

    // ─── Send opcode 80 via window.changeSkin() ───
    // changeSkin() in ogario.v4.js (line 1410) already:
    //   1. Encodes User_setting { type:1, key:1, valueString: productId }
    //   2. Sends opcode 80 via proxyMobileData
    //   3. Loads the skin URL via application.loadSkin()
    if (typeof window.changeSkin === 'function') {
        try {
            window.changeSkin(productId);
        } catch (e) {
            console.warn('[SKIN] changeSkin call exception:', e);
        }
    }

    // Update ogario custom skin URL
    if (window.ogario && imageName) {
        window.ogario.customSkinUrl = cdnBase + imageName;
    }

    var displayName = productId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    console.log('[SKIN]: Equipped ' + displayName);

    updateEquippedSkinUI();
}

function unequipSkin() {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to unequip skins');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }

    localStorage.removeItem('equippedSkinId');
    localStorage.removeItem('equippedSkinImage');

    // Update server tracking
    window.serverEquippedSkinId = '';

    // ─── Send opcode 80 via window.changeSkin('skin_empty') ───
    // changeSkin() already encodes and sends User_setting { type:1, key:1, valueString: "skin_empty" }
    if (typeof window.changeSkin === 'function') {
        try { window.changeSkin('skin_empty'); } catch (e) {}
    }
    if (window.ogario) {
        window.ogario.customSkinUrl = '';
    }

    console.log('[SKIN]: Unequipped skin');

    updateEquippedSkinUI();
}

function updateEquippedSkinUI() {
    // ─── Sync equipped skin from the server's userSettings (key=1) ───
    // On login (opcode 11), the server sends userSettings with key=1 = skinId.
    // ogario.v4.js updateUserSettings (line 16269) captures this but doesn't
    // sync to localStorage. We do it here so the banner stays in sync.
    syncEquippedSkinFromServer();
    var t = getShopTheme();

    var equippedId = localStorage.getItem('equippedSkinId');
    var equippedImg = localStorage.getItem('equippedSkinImage');
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/10913/');

    var bannerName = $('#activeSkinName');
    var bannerImg = $('#activeSkinImg');
    var unequipBtn = $('#unequipSkinBtn');

    if (equippedId && equippedId !== 'skin_empty' && equippedId !== '') {
        var displayName = equippedId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        bannerName.text(displayName);

        // Look up skin data from GameConfiguration for image and cell color
        var skinData = findSkinInConfig(equippedId);
        var imgSrc = '';
        var cellColor = '';

        if (skinData) {
            // Standard skin from config
            if (skinData.image) {
                imgSrc = cdnBase + skinData.image;
            }
            if (skinData.cellColor) {
                cellColor = skinData.cellColor;
            }
        } else if (equippedId.startsWith('skin_custom_')) {
            // Custom skin — load from custom skins CDN
            imgSrc = 'https://configs.agario.miniclippt.com/live/custom_skins/' + equippedId + '.png';
        }

        // Fallback: use saved image name or placeholder
        if (!imgSrc && equippedImg) {
            imgSrc = cdnBase + equippedImg;
        }
        if (!imgSrc) {
            imgSrc = 'https://jimboy3100.github.io/banners/icondeal2.png';
        }

        bannerImg.attr('src', imgSrc);

        // Show cell color as a circular border around the skin preview
        if (cellColor) {
            var hex = cellColor.replace('0x', '');
            // Pad to 6+ chars (sometimes 8 chars with alpha)
            while (hex.length < 6) hex = '0' + hex;
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            var cssColor = 'rgb(' + r + ',' + g + ',' + b + ')';
            bannerImg.css({
                'border-color': cssColor,
                'background-color': cssColor,
                'box-shadow': '0 0 8px ' + cssColor
            });
        } else {
            bannerImg.css({
                'border-color': t.mc,
                'background-color': t.pc,
                'box-shadow': 'none'
            });
        }

        unequipBtn.show();
    } else {
        bannerName.text('None (Default Skin)');
        bannerImg.attr('src', 'https://jimboy3100.github.io/banners/icondeal2.png');
        bannerImg.css({
            'border-color': t.mc,
            'background-color': t.pc,
            'box-shadow': 'none'
        });
        unequipBtn.hide();
    }

    // Highlight cards in the grid
    $('.skin-card').removeClass('equipped');
    $('.skin-card .equipped-badge').remove();
    $('.skin-card .skin-btn-equip').text('Equip');

    if (equippedId) {
        $('.skin-card[data-product-id="' + equippedId + '"]').each(function() {
            $(this).addClass('equipped');
            $(this).prepend('<div class="equipped-badge">&#x2714; Equipped</div>');
            $(this).find('.skin-btn-equip').text('Equipped');
        });
    }
}

/**
 * Sync the server-side equipped skin (from login response userSettings key=1)
 * to localStorage so our shop UI stays in sync with what Miniclip knows.
 */
function syncEquippedSkinFromServer() {
    if (!window.application || !window.application.user) return;

    // window.serverEquippedSkinId is set by ogario.v4.js updateUserSettings
    // when key=1 (skinId) arrives from the server (opcode 11 login or opcode 81 settings response)
    var serverSkinId = window.serverEquippedSkinId;

    if (serverSkinId === undefined || serverSkinId === null) return;

    // Empty string means no skin equipped (default)
    if (serverSkinId === '' || serverSkinId === 'skin_empty') {
        if (localStorage.getItem('equippedSkinId')) {
            localStorage.removeItem('equippedSkinId');
            localStorage.removeItem('equippedSkinImage');
            console.log('[SKIN] Server says no skin equipped, cleared localStorage');
        }
        return;
    }

    // If we found a server-side skin that differs from localStorage, sync it
    if (serverSkinId !== localStorage.getItem('equippedSkinId')) {
        localStorage.setItem('equippedSkinId', serverSkinId);
        // Try to find the image name from config
        var skinData = findSkinInConfig(serverSkinId);
        if (skinData && skinData.image) {
            localStorage.setItem('equippedSkinImage', skinData.image);
        }
        console.log('[SKIN] Synced server equipped skin to localStorage:', serverSkinId);
    }
}

/**
 * Find a skin's data (image, cellColor, etc.) from the GameConfiguration.
 * Returns the skin object or null if not found.
 */
function findSkinInConfig(productId) {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return null;
    var skins = window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"];
    if (!skins) return null;
    for (var i = 0; i < skins.length; i++) {
        if (skins[i].productId === productId) {
            return skins[i];
        }
    }
    return null;
}
window.findSkinInConfig = findSkinInConfig;

/**
 * Look up the price for a skin from the GameConfiguration.
 * The pricing chain is:
 *   "Shop - Skins" → find entry by productId → get referenceValue (= purchaseId)
 *   "Wallet - Soft Purchases" → find entry by purchaseId → { currencyAmount, currencyProductId }
 * Returns { amount: number, currency: 'coin'|'dna' } or null if not found.
 */
function getSkinPrice(productId) {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return null;

    // Build the lookup caches on first call
    if (!window._skinPriceCache) {
        window._skinPriceCache = {};

        var shopSkins = window.GameConfiguration.gameConfig["Shop - Skins"];
        var softPurchases = window.GameConfiguration.gameConfig["Wallet - Soft Purchases"];

        if (!shopSkins || !softPurchases) return null;

        // Index soft purchases by purchaseId
        var purchaseMap = {};
        for (var p = 0; p < softPurchases.length; p++) {
            var sp = softPurchases[p];
            if (sp.purchaseId) purchaseMap[sp.purchaseId] = sp;
        }

        // Map skin productId → price info
        for (var s = 0; s < shopSkins.length; s++) {
            var shopSkin = shopSkins[s];
            var pid = shopSkin.productId;
            var refVal = shopSkin.referenceValue;
            if (pid && refVal && purchaseMap[refVal]) {
                var purchase = purchaseMap[refVal];
                window._skinPriceCache[pid] = {
                    amount: purchase.currencyAmount || 0,
                    currency: (purchase.currencyProductId === 'dna') ? 'dna' : 'coin'
                };
            }
        }
    }

    return window._skinPriceCache[productId] || null;
}
window.getSkinPrice = getSkinPrice;

function renderSkinPage() {
    var start = skinShopPage * skinShopPerPage;
    var end = Math.min(start + skinShopPerPage, skinShopFiltered.length);
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/10913/');
    var grid = document.getElementById('skinGrid');
    var currentEquippedId = localStorage.getItem('equippedSkinId');
    var ownedSkinsObj = (window.application && window.application.user && window.application.user.skins) || {};

    // Show loading spinner on first page if grid is empty
    if (skinShopPage === 0 && grid.children.length === 0 && skinShopFiltered.length > 0) {
        grid.innerHTML = '<div class="skin-grid-loading"><div class="spinner"></div><br>Loading skins...</div>';
        setTimeout(function() {
            var loader = grid.querySelector('.skin-grid-loading');
            if (loader) loader.remove();
            doRender();
        }, 100);
        return;
    }
    doRender();

    function doRender() {
        for (var i = start; i < end; i++) {
            var skin = skinShopFiltered[i];
            var name = skin.productId.replace('skin_', '').replace(/_/g, ' ');
            var displayName = name.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            var colorHex = skin.cellColor || '0x88888800';
            var r = parseInt(colorHex.substring(2, 4), 16);
            var g = parseInt(colorHex.substring(4, 6), 16);
            var b = parseInt(colorHex.substring(6, 8), 16);
            var cssColor = 'rgb(' + r + ',' + g + ',' + b + ')';

            // Resolve image URL: spine skins use SpineSkinMap, others use image directly
            var imgFile = skin.image;
            if (skin.image === 'uses_spine' && window.SpineSkinMap && window.SpineSkinMap[skin.productId]) {
                imgFile = window.SpineSkinMap[skin.productId] + '.png';
            }
            var imgUrl = (imgFile && imgFile !== 'uses_spine') ? (cdnBase + imgFile) : '';

            var isEquipped = (currentEquippedId === skin.productId);
            var isOwned = isEquipped || isSkinOwned(skin, ownedSkinsObj);

            var card = document.createElement('div');
            card.className = 'skin-card' + (isEquipped ? ' equipped' : (isOwned ? ' owned-card' : ''));
            card.setAttribute('data-product-id', skin.productId);
            card.setAttribute('data-gameplay-id', skin.gameplayId);
            card.setAttribute('data-image', imgFile);

            var badgeHtml = isEquipped ? '<div class="equipped-badge">&#x2714; Equipped</div>' : '';
            var ownedBadgeHtml = (isOwned && !isEquipped) ? '<div class="owned-badge">&#x2B50; Owned</div>' : '';

            var actionBtnHtml;
            if (isOwned) {
                actionBtnHtml = '<button class="skin-btn-equip" onclick="equipSkin(\'' + skin.productId + '\', \'' + imgFile + '\');event.stopPropagation();">' + (isEquipped ? 'Equipped' : 'Equip') + '</button>';
                // Add Delete button for custom skins
                if (skin.productId && skin.productId.indexOf('skin_custom_') === 0) {
                    actionBtnHtml += '<button class="skin-btn-buy" onclick="deleteCustomSkin(\'' + skin.productId + '\');event.stopPropagation();" style="flex: 0.6; background: ' + getShopTheme().b4 + ' !important; font-size: 9px;">Delete</button>';
                }
            } else {
                // Look up price for unowned skins
                var priceInfo = getSkinPrice(skin.productId);
                var priceLabel = '';
                if (priceInfo && priceInfo.amount > 0) {
                    var icon = priceInfo.currency === 'dna' ? '🧬' : '💰';
                    priceLabel = ' ' + icon + ' ' + priceInfo.amount;
                }
                actionBtnHtml = '<button class="skin-btn-buy" onclick="buySkin(\'' + skin.productId + '\');event.stopPropagation();">Buy' + priceLabel + '</button>';
            }

            // Build image HTML with cell color circle behind it (like agar.io)
            var imgHtml = imgUrl
                ? '<img src="' + imgUrl + '" alt="' + displayName + '" loading="lazy" onerror="this.style.opacity=\'0\';">'
                : '';

            card.innerHTML = badgeHtml + ownedBadgeHtml +
                '<div class="skin-cell-wrap">' +
                    '<div class="skin-color" style="background:' + cssColor + '"></div>' +
                    imgHtml +
                '</div>' +
                '<div class="skin-name" title="' + displayName + '">' + displayName + '</div>' +
                '<div class="skin-card-actions">' +
                actionBtnHtml +
                '</div>';

            // Click card body to equip (if owned) or buy (if unowned)
            card.addEventListener('click', (function(skinData, owned) {
                return function() {
                    if (owned) {
                        equipSkin(skinData.productId, skinData.image);
                    } else {
                        buySkin(skinData.productId);
                    }
                };
            })(skin, isOwned));

            grid.appendChild(card);
        }

        skinShopPage++;
        var shown = Math.min(skinShopPage * skinShopPerPage, skinShopFiltered.length);
        $('#skinCount').text(shown);
        $('#skinTotal').text(skinShopFiltered.length);

        if (shown < skinShopFiltered.length) {
            $('#skinLoadMore').show().text('Load More (' + (skinShopFiltered.length - shown) + ' remaining)');
        } else {
            $('#skinLoadMore').hide();
        }

        updateEquippedSkinUI();
        if (typeof window.updateShopLoginState === 'function') window.updateShopLoginState(); // re-apply login state to new buttons
    }
}

function buySkin(productId) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to buy skins');
        return;
    }
    if (!window.agarioEncodedUID) {
        toastr && toastr.error('<b>[SHOP]:</b> No UID. Play a game first!');
        return;
    }
    if (!(window.core && window.core.proxyMobileData)) {
        toastr && toastr.error('<b>[SHOP]:</b> No server connection. Join a game first!');
        return;
    }

    // Look up price and purchaseId from config
    var priceInfo = getSkinPrice(productId);
    var purchaseId = getSkinPurchaseId(productId);
    var displayName = productId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });

    // Show confirmation with price
    var confirmMsg = 'Buy "' + displayName + '"?';
    if (priceInfo && priceInfo.amount > 0) {
        var currencyName = priceInfo.currency === 'dna' ? 'DNA 🧬' : 'Coins 💰';
        var currentBalance = 0;
        if (window.application && window.application.user) {
            currentBalance = priceInfo.currency === 'dna' ? (window.application.user.dna || 0) : (window.application.user.coins || 0);
        }
        confirmMsg += '\n\nCost: ' + priceInfo.amount + ' ' + currencyName;
        confirmMsg += '\nYour balance: ' + currentBalance + ' ' + currencyName;
        if (currentBalance < priceInfo.amount) {
            confirmMsg += '\n\n⚠️ You may not have enough ' + currencyName + '!';
        }
    }

    if (!confirm(confirmMsg)) return;

    // Disable the clicked button temporarily (10s cooldown)
    var btn = $('.skin-card[data-product-id="' + productId + '"] .skin-btn-buy');
    if (btn.data('buying')) return; // already in progress
    btn.data('buying', true).css({ opacity: 0.5, pointerEvents: 'none' }).text('Buying...');
    setTimeout(function() {
        btn.data('buying', false).css({ opacity: 1, pointerEvents: 'auto' });
        // Restore original text if still showing "Buying..."
        if (btn.text() === 'Buying...') {
            var pi = getSkinPrice(productId);
            var label = 'Buy';
            if (pi && pi.amount > 0) {
                label += ' ' + (pi.currency === 'dna' ? '🧬' : '💰') + ' ' + pi.amount;
            }
            btn.text(label);
        }
    }, 10000);

    // Try protocol-based soft purchase first (DNA/coin buy — opcode 70)
    // The official client uses referenceValue from "Shop - Skins" as the purchaseId
    if (window.application && typeof window.application.softPurchase === 'function') {
        var pid = purchaseId || productId;
        var sent = window.application.softPurchase(pid);
        if (sent) {
            console.log('[SHOP]: Sent soft purchase for ' + pid + ' (skin: ' + productId + ')');
            return;
        }
    }

    // Fallback: Payment URL (real-money purchase)
    var uid = $('#exp-uid').text() || window.agarioEncodedUID;
    var currency = $('#BuyDealCurrency').val() || 'USD';
    console.log('[SHOP]: Opening payment URL for ' + productId);
    $.ajax({
        type: "GET",
        url: "https://payments.agario.miniclippt.com/pay/" + uid + "/" + productId + "/" + currency,
        datatype: "json",
        success: function(info) {
            if (info && info.iframe_url) {
                window.open(info.iframe_url, "SkinPurchase", "width=600,height=600,scrollbars=yes,resizable=no");
            } else {
                toastr && toastr.error('<b>[SHOP]:</b> Payment not available for this skin');
            }
        },
        error: function() {
            toastr && toastr.error('<b>[SHOP]:</b> Payment endpoint unavailable');
        }
    });
}

/**
 * Get the correct purchaseId for a skin from the "Shop - Skins" config.
 * The official client uses referenceValue as the purchaseId for soft purchases.
 */
function getSkinPurchaseId(productId) {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return null;
    var shopSkins = window.GameConfiguration.gameConfig["Shop - Skins"];
    if (!shopSkins) return null;
    for (var i = 0; i < shopSkins.length; i++) {
        if (shopSkins[i].productId === productId) {
            return shopSkins[i].referenceValue || null;
        }
    }
    return null;
}
window.getSkinPurchaseId = getSkinPurchaseId;

function populateSDlines(select, i) {
    var item = GameConfiguration.gameConfig["Wallet - In-App Purchases"][i];
    var priceMap = { '2': '1.99', '5': '4.99', '10': '9.99', '20': '19.99', '50': '49.99', '60': '99.99' };
    var price = priceMap[item.priceTier];
    var label = price ? item.bundleId + ' = ' + price + ' $' : item.bundleId;
    select.options[select.options.length] = new Option(label, item.id, item.id);
}
function populateSD() {
    var agarVersionSelect = document.getElementById("ss-select-agarVersionDestinations");

    var select = document.getElementById("ss-select-purchases");
    if (!select) return; // Element no longer exists in new deals UI
    if (agarVersionSelect.options && agarVersionSelect.options[0] && agarVersionSelect.value !== agarVersionSelect.options[0].value) {
        // Check if an option with the same text already exists
        
		for (var ik = 0; ik < GameConfiguration.gameConfig["Wallet - In-App Purchases"].length; ik++) {
			var optionExists = false;
			for (var j = 0; j < window.selectVariable.length; j++) { 
				if (window.selectVariable[j].value == GameConfiguration.gameConfig["Wallet - In-App Purchases"][ik].id) {
					optionExists = true;
				}
			}
			if (optionExists == false) {
				populateSDlines(select,ik);
			}
			//else console.log("no " + GameConfiguration.gameConfig["Wallet - In-App Purchases"][ik].bundleId)
			
		}
    }
	else{ //if selected value of #ss-select-agarVersionDestinations is the latest
	if (!window.selectVariable) window.selectVariable = select.options;
	for (var iq = 0; iq < GameConfiguration.gameConfig["Wallet - In-App Purchases"].length; iq++) {
		populateSDlines(select,iq);
	}
	}
	if ($('#ss-select-purchases').children().length==0)
		$('#ss-select-purchases').append('<option value="" selected>Nothing found that is not already on latest version</option>');
}

function findSDescription() {
    var selectedText = $("#ss-select-purchases option:selected").text();
    var findSDiconlocationString2 = selectedText.split('=').pop();
    findSDiconlocationString2 = selectedText.replace(findSDiconlocationString2, '').replace(' =', '');
    for (var i = 0; i < GameConfiguration.gameConfig["Visual - Bundles"].length; i++) {
        if (GameConfiguration.gameConfig["Visual - Bundles"][i].bundleId == findSDiconlocationString2) {
            var desc = GameConfiguration.gameConfig["Visual - Bundles"][i].description;
            if (typeof desc === 'string' && desc !== 'na') {
                $("#dealtype").text(desc.replace(/_/g, ' ').replace(' name', ''));
            } else {
                var fallback = $('#ss-select-purchases').val().replace('com.miniclip.agar.io.', '');
                $("#dealtype").text(fallback.charAt(0).toUpperCase() + fallback.slice(1));
            }
            return;
        }
    }
    $("#dealtype").text("Unknown");
}

function letterCount(string, letter, caseSensitive) {
    var count = 0;
    if (!caseSensitive) {
        string = string.toUpperCase();
        letter = letter.toUpperCase();
    }
    for (var i = 0, l = string.length; i < string.length; i += 1) {
        if (string[i] === letter) {
            count += 1;
        }
    }
    return count;
}

function LoadGameConfiguration() {
    var selectEl = document.getElementById("ss-select-purchases");
    if (selectEl) {
        for (var i = selectEl.options.length; i-- > 0; ){
            selectEl.options[i] = null;
        }
    }
    $(".xpmt-skins2").css('background-image', '');
    $(".xpmt-skins").css('background-image', '');	
    GameConfiguration = {};
    /*     		$.ajax({
			type: "GET",
			url: window.MiniclipConfigDestination,
			async: false,
			datatype: "jsonp",
			success: function(info) {
				window.GameConfiguration = info;
				populateSD();
			}
		}).responseJSON;	
     */
    $.ajax({
        //url: 'https://configs-web.agario.miniclippt.com/live/v12/2204/GameConfiguration.json',
        url: window.MiniclipConfigDestination,
        type: 'GET',
        beforeSend: ((req)=>{
            req.setRequestHeader('Accept', 'text/plain');
           req.setRequestHeader('Accept', '*/*');
            req.setRequestHeader('Accept', 'q=0.01');
            req.setRequestHeader('Content-Type', 'application/octet-stream');
            req.setRequestHeader('x-support-proto-version', window.LMagarioheaders.proto_version);
            req.setRequestHeader('x-client-version', '' + window.LMagarioheaders.client_version);
        }
        ),
        success: ((info)=>{
            if (typeof info === 'string' || info instanceof String){
				window.GameConfiguration = JSON.parse(info);
			}
			else{
				window.GameConfiguration = info;
			}
			populateSD();
			if (typeof populateDealsGrid === 'function') populateDealsGrid();
			}
         ),
		error: ((info)=>{ 
		console.log(info);
		toastr.error('<b>[' + Premadeletter123 + ']:</b> There is no such library anymore');
		})
       
    });		
	
}

function populateLibConfig() {
    var x = document.getElementById("ss-select-agarVersionDestinations");
    //for (i = 0; i < Object.keys(window.agarversionDestinations).length; i++) {
    for (var i = Object.keys(window.agarversionDestinations).length - 1; i > 0; i--) {
        //if (window.agarversionDestinations[i].includes(window.getLatestconfigVersion)) {
            var opt = document.createElement("option");
			opt.text = window.agarversionDestinations[i];
			x.add(opt);
			//x.options[x.options.length] = new Option(window.agarversionDestinations[i])
        //}
    }
}

