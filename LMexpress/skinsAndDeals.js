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
// Early fallback so onclick="window.closeSpecialShopModal()" never throws before the modal opens
window.closeSpecialShopModal = window.closeSpecialShopModal || function() {
    var modal = document.getElementById('specialShopModal');
    if (modal) modal.remove();
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
};

window.MiniclipConfigDestination = window.LM_CONFIG_URL();
window.MiniclipDestination = window.LM_CDN_BASE();

if (window.agarversion) {
    var _av = window.agarversion;
    if (!_av.endsWith('/')) _av += '/';
    window.MiniclipConfigDestination = window.LM_CONFIG_CDN + "/" + _av + "GameConfiguration.json";
    window.MiniclipDestination = window.LM_CONFIG_CDN + "/" + _av;
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
SpecialDeals(window._pendingShopTab || 'skins');
AgarVersionDestinations();

function SpecialDeals(defaultTab) {
    if (
        !defaultTab &&
        window._pendingShopTab
    ) {
        defaultTab =
            window._pendingShopTab;
    }

    window._pendingShopTab = null;
    defaultTab = defaultTab || 'skins';

    var existingShopModal =
        document.getElementById(
            'specialShopModal'
        );

    /*
     * Fast reopen path: preserve built cards, decoded images, search state
     * and tab state. Do not reconstruct the complete modal.
     */
    if (existingShopModal) {
        $('#specialShopModal')
            .show()
            .addClass('in')
            .attr(
                'aria-hidden',
                'false'
            );

        $('body').addClass(
            'modal-open'
        );

        if (
            typeof window.startShopLoginSync ===
            'function'
        ) {
            window.startShopLoginSync();
        } else if (
            typeof window.updateShopLoginState ===
            'function'
        ) {
            window.updateShopLoginState();
        }

        var requestedTab =
            $('#specialShopModal .shop-tab[data-tab="' +
                defaultTab +
                '"]');

        if (requestedTab.length) {
            requestedTab.trigger('click');
        }

        return;
    }

    if (window._shopLoginCheckInterval) {
        clearInterval(
            window._shopLoginCheckInterval
        );

        window._shopLoginCheckInterval =
            null;
    }

    /*
     * These flags belong to the newly created modal instance.
     */
    window._skinShopBuilt = false;
    window._dealsShopBuilt = false;

    /*
     * Restore the two identifiers independently.
     *
     * agarioUID is the normal account UID.
     * agarioEncodedUID is the already encoded Xsolla/payment token.
     *
     * Never substitute the normal UID for the encoded payment UID.
     */
    try {
        if (!window.agarioUID) {
            window.agarioUID =
                localStorage.getItem(
                    "agarioUID"
                ) || "";
        }

        if (!window.agarioEncodedUID) {
            window.agarioEncodedUID =
                localStorage.getItem(
                    "agarioEncodedUID"
                ) || "";
        }
    } catch (error) {
        console.warn(
            "[SHOP] Could not restore Agar.io identity:",
            error
        );
    }

    /*
     * Login itself should now provide the payment UID.
     * Playing or joining an arena is not required.
     */
    if (!window.agarioEncodedUID) {
        if (window.toastr) {
            toastr.warning(
                '<b>[SHOP]:</b> The Agar.io payment UID is not ready. Log out, log in again, and wait for the profile to load.'
            );
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
            '.skin-card .skin-price-tag { font-size: 10px; font-weight: 800; font-family: "Roboto Condensed", sans-serif; margin-top: 1px; text-align: center; }',
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
        var isDeals = (defaultTab === 'deals');
        var isUpload = (defaultTab === 'upload');
        var isSkins = (!isDeals && !isUpload);

        var initialTabTitle = isDeals
            ? '<i class="fa fa-briefcase"></i> Special & Daily Deals'
            : (isUpload ? '<i class="fa fa-upload"></i> Custom Skin Uploader' : '<i class="fa fa-paint-brush"></i> Agar.io Skins');

        var skinsTabClass = isSkins ? 'shop-tab active' : 'shop-tab';
        var uploadTabClass = isUpload ? 'shop-tab active' : 'shop-tab';
        var dealsTabClass = isDeals ? 'shop-tab active' : 'shop-tab';

        var skinsPaneClass = isSkins ? 'tab-pane active' : 'tab-pane';
        var uploadPaneClass = isUpload ? 'tab-pane active' : 'tab-pane';
        var dealsPaneClass = isDeals ? 'tab-pane active' : 'tab-pane';

        $('#helloContainer').after(
            '<div class="modal fade in" id="specialShopModal" aria-hidden="false" style="display: block;">' +
            '<div class="modal-backdrop fade in"></div>' +
            '<div class="modal-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 560px; margin: 0;">' +
            '<div class="modal-content">' +

        // Header
        '<div id="CloseSpecialDeals2" class="modal-header">' +
        '<button id="CloseSpecialDeals" type="button" class="close" title="Close" onclick="window.closeSpecialShopModal(); return false;"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<button id="FAQSpecialDeals" type="button" class="close" title="Help & FAQ"><span aria-hidden="true"><b>?</b></span><span class="sr-only">Help</span></button>' +
        '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif; font-weight: 700; color: ' + mc + ';">' + initialTabTitle + '</h4>' +
        '</div>' +

        // Tab bar
        '<div class="shop-tabs">' +
        '<div class="' + skinsTabClass + '" data-tab="skins"><i class="fa fa-paint-brush"></i> Agar.io Skins</div>' +
        '<div class="' + uploadTabClass + '" data-tab="upload"><i class="fa fa-upload"></i> Custom Skin Uploader</div>' +
        '<div class="' + dealsTabClass + '" data-tab="deals"><i class="fa fa-briefcase"></i> Special Deals</div>' +
        '</div>' +

        // === 1. Skins tab ===
        '<div class="' + skinsPaneClass + '" id="tab-skins">' +
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
            '<button type="button" class="skin-load-more" id="skinLoadMore" style="display:none;">Load More Skins</button>' +
            '</div>' +
            '</div>' +

            // === 2. Custom Skin Uploader tab ===
            '<div class="' + uploadPaneClass + '" id="tab-upload">' +
            '<div class="modal-body" style="text-align: center;">' +
            '<h5 style="color: ' + mc + '; font-weight: 700; margin-top: 0;">Upload Custom Skin (90 DNA)</h5>' +
            '<div id="userDnaBalanceDisplay" style="font-size: 12px; color: ' + mc + '; font-weight: 700; margin-bottom: 8px; background: rgba(0,0,0,0.3); display: inline-block; padding: 3px 10px; border-radius: 12px; border: 1px solid ' + mc + '4d;">🧬 DNA: <span id="dnaCountModal">0</span> &nbsp;|&nbsp; 💰 Coins: <span id="coinsCountModal">0</span></div>' +
            '<div class="upload-drop-zone" id="uploadDropZone">' +

            '<p style="color: ' + tc2 + '; font-size: 11px; margin-bottom: 12px;">Select an image file. It will be formatted into a 512x512 PNG and submitted directly to Agar.io via Protobuf.</p>' +
            '<div style="display: flex; gap: 8px; margin-bottom: 12px; max-width: 360px; margin-left: auto; margin-right: auto;">' +
            '<input id="legendSkinNameModal" class="form-control" placeholder="Skin Name (required)" style="width: 70%;" maxlength="15" required aria-required="true" autocomplete="off">' +
            '<div class="input-group legendSkinColor-picker" style="width: 30%;">' +
            '<input id="legendSkinColorModal" type="hidden" value="#FFFF00">' +
            '<span class="input-group-addon" style="cursor:pointer; background: ' + pc + '; border: 1px solid ' + pc2 + '; border-radius: 4px;"><i style="background-color: #FFFF00;"></i></span>' +
            '</div>' +
            '</div>' +
            '<div style="text-align: center; margin-bottom: 12px;">' +
            '<canvas id="legendCanvasModal" width="512" height="512" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid ' + mc + '; background-color: #000; box-shadow: 0 0 12px ' + mc + '4d;"></canvas>' +
            '</div>' +
            '<label for="legendUploadInputModal" class="btn" id="legendChooseFileBtn" style="background: ' + b2 + '; color: ' + btc + '; margin-bottom: 8px; width: 220px; font-weight: 800; font-size: 12px; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: all 0.2s; display: inline-block;">&#x1F4C2; Choose Image File</label>' +
            '<input type="file" id="legendUploadInputModal" accept="image/*" style="display:none;" />' +
            '<div style="display: flex; gap: 4px; max-width: 320px; margin: 0 auto 8px; align-items: center;">' +
            '<input type="text" id="legendSkinUrlInput" class="form-control" placeholder="...or paste image URL" style="flex: 1; height: 32px; font-size: 11px; border: 1px solid ' + pc2 + '; background: rgba(0,0,0,0.3); color: ' + tc + ';">' +
            '<button id="legendLoadUrlBtn" class="btn" style="background: ' + b2 + '; color: ' + btc + '; font-weight: 800; font-size: 11px; border: none; border-radius: 6px; padding: 6px 14px; white-space: nowrap; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: all 0.2s;">Load</button>' +
            '</div>' +
            '<button id="legendSaveBtnModal" class="btn" disabled style="background: ' + b2 + '; color: ' + btc + '; width: 220px; font-weight: 800; font-size: 12px; border: none; border-radius: 6px; padding: 8px 16px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: all 0.2s;">Upload &amp; Buy (90 DNA)</button>' +
            '<br><button id="legendClearBtn" class="upload-clear-btn" style="display:none;">&#x2716; Clear Image</button>' +
            '<div id="legendStatusModal" style="font-size: 11px; margin-top: 6px; color: ' + tc2 + ';">Select an image, drag &amp; drop, or paste a URL</div>' +
            '</div>' + // close drop zone
            '</div>' +
            '</div>' +

            // === 3. Deals tab ===
            '<div class="' + dealsPaneClass + '" id="tab-deals">' +
            '<div class="modal-body">' +

            // Balance display
            '<div id="dealsBalanceBar" style="font-size: 12px; color: ' + mc + '; font-weight: 700; margin-bottom: 10px; background: rgba(0,0,0,0.3); text-align: center; padding: 5px 12px; border-radius: 12px; border: 1px solid ' + mc + '4d;">' +
            '🧬 DNA: <span id="dealsDnaCount">0</span> &nbsp;|&nbsp; 💰 Coins: <span id="dealsCoinsCount">0</span></div>' +

            // Deal cards container
            '<div id="dealsGrid" style="max-height: 260px; overflow-y: auto; margin-bottom: 10px;"></div>' +



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

        // Initialize Bootstrap Colorpicker for skin color (same library as bordersColor picker)
        $('.legendSkinColor-picker').colorpicker({ format: 'hex' }).on('changeColor.colorpicker', function(e) {
            $('#legendSkinColorModal').val(e.color.toHex());
            $('#legendCanvasModal').css('border-color', e.color.toHex());
        });

        // Use the already-loaded config from master.js if available, otherwise load it
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
        // populateLibConfig runs immediately if config is ready, or waits for it
        if (window.GameConfiguration && window.GameConfiguration.gameConfig) {
            try { populateLibConfig(); } catch(e) { console.warn('[Shop] populateLibConfig error:', e); }
        } else {
            setTimeout(function() { try { populateLibConfig(); } catch(e) { console.warn('[Shop] populateLibConfig error:', e); } }, 800);
        }

        // NOTE: populateSkins is called by LoadGameConfiguration on success.
        // No separate setTimeout needed
        window.checkUserLoggedIn = function checkUserLoggedIn() {
            if (window.loggedIn === true) {
                return true;
            }

            var u =
                (
                    window.application &&
                    window.application.user
                ) ||
                (
                    window.legendmod &&
                    window.legendmod.user
                );

            if (!u) {
                return false;
            }

            if (u.authenticated === true) {
                return true;
            }

            if (
                u.userId !== undefined &&
                u.userId !== null
            ) {
                var userId =
                    String(u.userId).trim();

                if (
                    userId &&
                    userId !== '0' &&
                    userId.toLowerCase() !==
                        'null' &&
                    userId.toLowerCase() !==
                        'undefined'
                ) {
                    return true;
                }
            }

            return false;
        };

        window.checkUserUID = function checkUserUID() {
            if (!window.checkUserLoggedIn()) {
                return false;
            }

            if (
                typeof window.agarioUID !==
                'string'
            ) {
                return false;
            }

            var uid =
                window.agarioUID.trim();

            if (!uid) {
                return false;
            }

            var normalizedUid =
                uid.toLowerCase();

            if (
                normalizedUid === '0' ||
                normalizedUid === 'null' ||
                normalizedUid ===
                    'undefined' ||
                uid.indexOf('$') !== -1
            ) {
                return false;
            }

            return uid.length >= 8;
        };

        window.validateShopIntegrity = function validateShopIntegrity(actionName) {
            var label = actionName || 'this action';

            // 1. Logged In check
            var isLoggedIn = window.checkUserLoggedIn();
            if (!isLoggedIn) {
                if (window.toastr) toastr.error('<b>[SHOP]:</b> You must be logged in with Google/Facebook to ' + label + '.');
                return false;
            }

            // 2. Agar.io UID check
            var hasUID = window.checkUserUID();
            if (!hasUID) {
                if (window.toastr) toastr.error('<b>[SHOP]:</b> No Agar.io payment UID found. Log out and log in again to refresh it.');
                return false;
            }

            // 3. Actual game server connection state.
            // Function existence does not prove that a socket is connected.
            var hasGameConnection = !!(
                window.legendmod &&
                window.legendmod.connectionOpened === true
            );

            if (!hasGameConnection) {
                if (window.toastr) {
                    toastr.error('<b>[SHOP]:</b> No active Agar.io server connection. Join a server before attempting to ' + label + '.');
                }
                return false;
            }

            return true;
        };

        // --- Login & UID status checker (shared across tabs) ---
        window.updateShopLoginState = function updateShopLoginState() {
            var uploadBtn = $('#legendSaveBtnModal');
            var chooseLabel = $('#legendChooseFileBtn');
            var fileInput = $('#legendUploadInputModal');
            var skinNameInput = $('#legendSkinNameModal');
            var skinColorInput = $('#legendSkinColorModal');
            var isLoggedIn = window.checkUserLoggedIn();
            var hasUID = window.checkUserUID();
            var hasConnection = !!(
                window.legendmod &&
                window.legendmod.connectionOpened === true
            );
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
                $('#legendSkinUrlInput').prop('disabled', false).css('opacity', 1);
                $('#legendLoadUrlBtn').prop('disabled', false).css({ opacity: 1, pointerEvents: 'auto' });
                $('#legendClearBtn').css({ opacity: 1, pointerEvents: 'auto' });
                var hasRequiredSkinName =
                    $.trim(
                        skinNameInput.val() ||
                        ''
                    ).length > 0;

                if (
                    processedBufferModal &&
                    hasRequiredSkinName
                ) {
                    uploadBtn
                        .prop(
                            'disabled',
                            false
                        )
                        .removeAttr(
                            'title aria-label'
                        )
                        .css({
                            opacity: 1,
                            cursor: 'pointer'
                        });
                } else {
                    var uploadDisabledReason;

                    if (
                        processedBufferModal &&
                        !hasRequiredSkinName
                    ) {
                        uploadDisabledReason =
                            'Enter a skin name first — the name is required.';
                    } else if (
                        !processedBufferModal &&
                        hasRequiredSkinName
                    ) {
                        uploadDisabledReason =
                            'Choose and process an image first.';
                    } else {
                        uploadDisabledReason =
                            'Choose an image and enter a required skin name first.';
                    }

                    uploadBtn
                        .prop(
                            'disabled',
                            true
                        )
                        .attr({
                            title:
                                uploadDisabledReason,

                            'aria-label':
                                uploadDisabledReason
                        })
                        .css({
                            opacity: 0.5,
                            cursor:
                                'not-allowed'
                        });
                }
            } else {
                uploadBtn.prop('disabled', true).css({ opacity: 0.4, cursor: 'not-allowed' });
                chooseLabel.css({ opacity: 0.4, pointerEvents: 'none' });
                fileInput.prop('disabled', true);
                skinNameInput.prop('disabled', true).css('opacity', 0.4);
                skinColorInput.prop('disabled', true).css('opacity', 0.4);
                $('#legendSkinUrlInput').prop('disabled', true).css('opacity', 0.4);
                $('#legendLoadUrlBtn').prop('disabled', true).css({ opacity: 0.4, pointerEvents: 'none' });
                $('#legendClearBtn').css({ opacity: 0.4, pointerEvents: 'none' });
            }

            // Upload tab login warning banner
            var uploadBanner = document.getElementById('uploadLoginBanner');
            if (!uploadBanner) {
                var dropZone = document.getElementById('uploadDropZone');
                if (dropZone) {
                    uploadBanner = document.createElement('div');
                    uploadBanner.id = 'uploadLoginBanner';
                    uploadBanner.style.cssText = 'display:none; text-align: center; padding: 8px 14px; margin-bottom: 10px; border-radius: 8px; background: rgba(255,152,0,0.15); border: 1px solid rgba(255,152,0,0.4); font-size: 11px; font-weight: 600; color: #ffb74d; font-family: "Roboto Condensed", sans-serif;';
                    dropZone.insertBefore(uploadBanner, dropZone.firstChild);
                }
            }
            if (uploadBanner) {
                if (!allReady) {
                    var ureasons = [];
                    if (!isLoggedIn) ureasons.push('Log in');
                    if (!hasUID) ureasons.push('Play a game to get your UID');
                    if (!hasConnection) ureasons.push('Join a server');
                    uploadBanner.innerHTML = '⚠️ ' + ureasons.join(' &bull; ') + ' — to upload custom skins';
                    uploadBanner.style.display = 'block';
                } else {
                    uploadBanner.style.display = 'none';
                }
            }

            // Skins tab equip/buy/search — show/hide login warning
            var loginBanner = document.getElementById('shopLoginBanner');
            if (!loginBanner) {
                var grid = document.getElementById('skinGrid');
                if (grid) {
                    loginBanner = document.createElement('div');
                    loginBanner.id = 'shopLoginBanner';
                    loginBanner.style.cssText = 'display:none; grid-column: 1/-1; text-align: center; padding: 10px 16px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,152,0,0.15); border: 1px solid rgba(255,152,0,0.4); font-size: 12px; font-weight: 600; color: #ffb74d; font-family: "Roboto Condensed", sans-serif;';
                    grid.parentNode.insertBefore(loginBanner, grid);
                }
            }
            if (loginBanner) {
                if (!allReady) {
                    var reasons = [];
                    if (!isLoggedIn) reasons.push('Log in with Google/Facebook');
                    if (!hasUID) reasons.push('Play a game to get your UID');
                    if (!hasConnection) reasons.push('Join a server first');
                    loginBanner.innerHTML = '⚠️ ' + reasons.join(' &bull; ') + ' — to buy/equip skins';
                    loginBanner.style.display = 'block';
                } else {
                    loginBanner.style.display = 'none';
                }
            }

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

            // Main menu & profile buttons state (Skins, Daily Deals, Leagues, Buy/Use Boosts, Rewards)
            var menuBtnsEnabled = isLoggedIn && hasUID;
            var menuBtns = $('#SpecialDealsBtn, #SpecialDealsQuickBtn, .lm-skins-btn, #lm-daily-deal-btn, .lm-deals-btn, #lm-leagues-btn, .lm-leagues-btn, #buy-boost, #use-boost, #s-boost, #lm-claim-all-btn');
            menuBtns.prop('disabled', !menuBtnsEnabled);
            if (!menuBtnsEnabled) {
                menuBtns.css({ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' })
                        .attr('title', 'Log in with Google/Facebook and play a game session first to access Skins, Deals, Boosts & Leagues');
            } else {
                menuBtns.css({ opacity: 1, cursor: 'pointer', pointerEvents: 'auto' })
                        .removeAttr('title');
            }
        }

        /*
         * Keep exactly one login/balance synchronizer while the retained
         * modal is visible. Stop it whenever the modal is hidden.
         */
        window.startShopLoginSync =
            function startShopLoginSync() {
                if (
                    window._shopLoginCheckInterval
                ) {
                    clearInterval(
                        window._shopLoginCheckInterval
                    );

                    window._shopLoginCheckInterval =
                        null;
                }

                updateShopLoginState();

                window._shopLoginCheckInterval =
                    setInterval(function () {
                        var shop =
                            document.getElementById(
                                'specialShopModal'
                            );

                        if (
                            !shop ||
                            shop.style.display ===
                                'none'
                        ) {
                            clearInterval(
                                window._shopLoginCheckInterval
                            );

                            window._shopLoginCheckInterval =
                                null;

                            return;
                        }

                        updateShopLoginState();
                    }, 3000);
            };

        window.startShopLoginSync();

        $('#specialShopModal').on(
            'hidden.bs.modal',
            function() {
                if (
                    window._shopLoginCheckInterval
                ) {
                    clearInterval(
                        window._shopLoginCheckInterval
                    );

                    window._shopLoginCheckInterval =
                        null;
                }
            }
        );

        // --- Embedded Custom Skin Uploader Handlers ---
        var processedBufferModal = null;

        /*
         * The real Agar.io editor converts the final 512x512 RGBA canvas
         * into a 16-color PNG8 through its bundled UPNG encoder.
         */
        function getOfficialAgarUPNG() {
            if (
                window._lmOfficialAgarUPNG &&
                typeof window
                    ._lmOfficialAgarUPNG
                    .encode === 'function'
            ) {
                return window
                    ._lmOfficialAgarUPNG;
            }

            /*
             * Some builds may expose UPNG globally.
             */
            if (
                window.UPNG &&
                typeof window.UPNG.encode ===
                    'function'
            ) {
                window._lmOfficialAgarUPNG =
                    window.UPNG;

                return window
                    ._lmOfficialAgarUPNG;
            }

            var requireCandidates = [];

            function rememberWebpackRequire(
                webpackRequire
            ) {
                if (
                    !webpackRequire ||
                    typeof webpackRequire !==
                        'function' ||
                    !webpackRequire.m
                ) {
                    return;
                }

                if (
                    requireCandidates.indexOf(
                        webpackRequire
                    ) === -1
                ) {
                    requireCandidates.push(
                        webpackRequire
                    );
                }
            }

            rememberWebpackRequire(
                window._lmAgarWebpackRequire
            );

            /*
             * bundle_commons installs the old webpackJsonp callback.
             *
             * Inject a temporary module. Every webpack runtime in the callback
             * chain executes it with its own __webpack_require__. We retain the
             * runtime containing Agar.io's UPNG module.
             */
            if (
                typeof window.webpackJsonp ===
                    'function'
            ) {
                try {
                    window._lmAgarWebpackBridgeCounter =
                        (
                            window
                                ._lmAgarWebpackBridgeCounter ||
                            0
                        ) + 1;

                    var bridgeId =
                        900000 +
                        window
                            ._lmAgarWebpackBridgeCounter;

                    var bridgeModules = {};

                    bridgeModules[
                        bridgeId
                    ] = function(
                        module,
                        exports,
                        __webpack_require__
                    ) {
                        rememberWebpackRequire(
                            __webpack_require__
                        );
                    };

                    window.webpackJsonp(
                        [],
                        bridgeModules,
                        [bridgeId]
                    );
                } catch (
                    webpackCaptureError
                ) {
                    console.warn(
                        '[LM SKIN] Could not capture Agar.io webpack runtime:',
                        webpackCaptureError
                    );
                }
            }

            for (
                var requireIndex = 0;
                requireIndex <
                    requireCandidates.length;
                requireIndex++
            ) {
                var webpackRequire =
                    requireCandidates[
                        requireIndex
                    ];

                var possibleModuleIds = [
                    647
                ];

                /*
                 * Module 647 is correct for the supplied original bundle.
                 * Also scan module source so this survives a future numeric-ID
                 * change without executing every webpack module.
                 */
                try {
                    var moduleMap =
                        webpackRequire.m;

                    var moduleIds =
                        Object.keys(
                            moduleMap
                        );

                    for (
                        var sourceIndex = 0;
                        sourceIndex <
                            moduleIds.length;
                        sourceIndex++
                    ) {
                        var moduleId =
                            moduleIds[
                                sourceIndex
                            ];

                        var moduleFactory =
                            moduleMap[
                                moduleId
                            ];

                        if (
                            typeof moduleFactory !==
                                'function'
                        ) {
                            continue;
                        }

                        var moduleSource =
                            Function.prototype
                                .toString.call(
                                    moduleFactory
                                );

                        if (
                            moduleSource.indexOf(
                                'UPNG.encode = function'
                            ) !== -1 &&
                            moduleSource.indexOf(
                                'module.exports = UPNG'
                            ) !== -1
                        ) {
                            possibleModuleIds.push(
                                moduleId
                            );
                        }
                    }
                } catch (
                    moduleScanError
                ) {
                    console.warn(
                        '[LM SKIN] Could not scan Agar.io webpack modules:',
                        moduleScanError
                    );
                }

                for (
                    var moduleIndex = 0;
                    moduleIndex <
                        possibleModuleIds.length;
                    moduleIndex++
                ) {
                    var possibleModuleId =
                        possibleModuleIds[
                            moduleIndex
                        ];

                    try {
                        if (
                            !webpackRequire.m[
                                possibleModuleId
                            ]
                        ) {
                            continue;
                        }

                        var exportedModule =
                            webpackRequire(
                                possibleModuleId
                            );

                        var upng =
                            exportedModule &&
                            exportedModule.default
                                ? exportedModule
                                    .default
                                : exportedModule;

                        if (
                            upng &&
                            typeof upng.encode ===
                                'function'
                        ) {
                            window
                                ._lmAgarWebpackRequire =
                                webpackRequire;

                            window
                                ._lmOfficialAgarUPNG =
                                upng;

                            console.log(
                                '[LM SKIN] Official Agar.io UPNG loaded from webpack module:',
                                possibleModuleId
                            );

                            return upng;
                        }
                    } catch (
                        moduleLoadError
                    ) {
                        console.warn(
                            '[LM SKIN] Could not load possible UPNG module ' +
                            possibleModuleId +
                            ':',
                            moduleLoadError
                        );
                    }
                }
            }

            return null;
        }

        function loadAgarEncoderScript(id, src, readyCheck) {
            return new Promise(function(resolve, reject) {
                if (readyCheck()) {
                    resolve();
                    return;
                }

                var existing =
                    document.getElementById(id);

                if (
                    existing &&
                    existing.parentNode
                ) {
                    existing.parentNode.removeChild(
                        existing
                    );
                }

                var script =
                    document.createElement(
                        'script'
                    );

                script.id = id;
                script.src = src;
                script.async = true;
                script.crossOrigin =
                    'anonymous';

                /*
                 * Agar.io's webpack runtime defines global `module` and
                 * `require`.  Libraries like UPNG.js check these and route
                 * their exports through CommonJS instead of setting window
                 * globals.  Temporarily hide both so the scripts fall
                 * through to their browser-global code paths.
                 */
                var savedModule =
                    window.module;
                var savedRequire =
                    window.require;

                window.module =
                    undefined;
                window.require =
                    undefined;

                script.onload = function() {
                    window.module =
                        savedModule;
                    window.require =
                        savedRequire;

                    if (readyCheck()) {
                        resolve();
                    } else {
                        reject(
                            new Error(
                                id +
                                ' loaded without exposing its API'
                            )
                        );
                    }
                };

                script.onerror = function() {
                    window.module =
                        savedModule;
                    window.require =
                        savedRequire;

                    reject(
                        new Error(
                            'Could not load ' +
                            src
                        )
                    );
                };

                document.head.appendChild(
                    script
                );
            });
        }

        function ensureAgarUPNG() {
            /*
             * First use Agar.io's own UPNG module when the current runtime
             * exposes it.
             */
            var existingUPNG =
                getOfficialAgarUPNG();

            if (
                existingUPNG &&
                typeof existingUPNG.encode ===
                    'function'
            ) {
                return Promise.resolve(
                    existingUPNG
                );
            }

            /*
             * Share one loading operation among repeated file selections.
             */
            if (window._lmAgarUPNGLoadPromise) {
                return window
                    ._lmAgarUPNGLoadPromise;
            }

            /*
             * The original Agar.io UPNG module depends on Pako.
             * Load equivalent pinned browser builds only when the private
             * Agar.io webpack module cannot be accessed.
             */
            window._lmAgarUPNGLoadPromise =
                loadAgarEncoderScript(
                    'lm-agar-pako',
                    'https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js',
                    function() {
                        return !!window.pako;
                    }
                )
                .then(function() {
                    return loadAgarEncoderScript(
                        'lm-agar-upng',
                        'https://cdn.jsdelivr.net/npm/upng-js@2.1.0/UPNG.js',
                        function() {
                            return !!(
                                window.UPNG &&
                                typeof window.UPNG.encode ===
                                    'function'
                            );
                        }
                    );
                })
                .then(function() {
                    window._lmOfficialAgarUPNG =
                        window.UPNG;

                    return window
                        ._lmOfficialAgarUPNG;
                })
                .catch(function(error) {
                    /*
                     * Permit a later retry after a temporary network failure.
                     */
                    window._lmAgarUPNGLoadPromise =
                        null;

                    throw error;
                });

            return window
                ._lmAgarUPNGLoadPromise;
        }

        function validateAgarPNG8(pngBytes) {
            if (
                !(pngBytes instanceof Uint8Array) ||
                pngBytes.length < 33
            ) {
                return {
                    valid: false,
                    error:
                        'Encoded PNG is empty or truncated'
                };
            }

            var signature = [
                137, 80, 78, 71,
                13, 10, 26, 10
            ];

            for (
                var signatureIndex = 0;
                signatureIndex <
                    signature.length;
                signatureIndex++
            ) {
                if (
                    pngBytes[signatureIndex] !==
                    signature[signatureIndex]
                ) {
                    return {
                        valid: false,
                        error:
                            'Encoded data is not a PNG file'
                    };
                }
            }

            var view =
                new DataView(
                    pngBytes.buffer,
                    pngBytes.byteOffset,
                    pngBytes.byteLength
                );

            /*
             * PNG IHDR:
             * width     bytes 16-19
             * height    bytes 20-23
             * bit depth byte 24
             * color type byte 25
             */
            var width =
                view.getUint32(
                    16,
                    false
                );

            var height =
                view.getUint32(
                    20,
                    false
                );

            var bitDepth =
                pngBytes[24];

            var colorType =
                pngBytes[25];

            var paletteEntries = 0;
            var offset = 8;

            /*
             * Inspect PNG chunks and locate PLTE.
             */
            while (
                offset + 12 <=
                    pngBytes.length
            ) {
                var chunkLength =
                    view.getUint32(
                        offset,
                        false
                    );

                var chunkType =
                    String.fromCharCode(
                        pngBytes[offset + 4],
                        pngBytes[offset + 5],
                        pngBytes[offset + 6],
                        pngBytes[offset + 7]
                    );

                if (
                    offset +
                        12 +
                        chunkLength >
                    pngBytes.length
                ) {
                    return {
                        valid: false,
                        error:
                            'PNG contains a truncated chunk'
                    };
                }

                if (chunkType === 'PLTE') {
                    paletteEntries =
                        chunkLength / 3;
                }

                offset +=
                    12 +
                    chunkLength;

                if (chunkType === 'IEND') {
                    break;
                }
            }

            if (
                width !== 512 ||
                height !== 512
            ) {
                return {
                    valid: false,
                    error:
                        'PNG dimensions are ' +
                        width +
                        'x' +
                        height +
                        ', not 512x512'
                };
            }

            /*
             * PNG color type 3 is indexed/palette color.
             * Reject ordinary RGBA PNG output.
             */
            if (
                colorType !== 3 ||
                paletteEntries < 1 ||
                paletteEntries > 16
            ) {
                return {
                    valid: false,
                    error:
                        'PNG is not an indexed palette image with 16 colors or fewer'
                };
            }

            if (
                bitDepth !== 1 &&
                bitDepth !== 2 &&
                bitDepth !== 4 &&
                bitDepth !== 8
            ) {
                return {
                    valid: false,
                    error:
                        'PNG has an invalid indexed bit depth'
                };
            }

            return {
                valid: true,
                paletteEntries:
                    paletteEntries
            };
        }

        function processAndFormatModal(src) {
            var img = new Image();

            processedBufferModal =
                null;

            $('#legendSaveBtnModal')
                .prop(
                    'disabled',
                    true
                )
                .css({
                    opacity: 0.5,
                    cursor: 'not-allowed'
                });

            if (
                typeof src === 'string' &&
                (
                    src.startsWith(
                        'http://'
                    ) ||
                    src.startsWith(
                        'https://'
                    )
                )
            ) {
                img.crossOrigin =
                    'Anonymous';
            }

            img.onload = function() {
                var canvas =
                    document.getElementById(
                        'legendCanvasModal'
                    );

                if (!canvas) {
                    return;
                }

                canvas.width = 512;
                canvas.height = 512;

                var ctx =
                    canvas.getContext(
                        '2d',
                        {
                            willReadFrequently:
                                true
                        }
                    );

                if (!ctx) {
                    $('#legendStatusModal')
                        .text(
                            'Canvas image processing is unavailable'
                        )
                        .css(
                            'color',
                            getShopTheme().b4
                        );

                    return;
                }

                ctx.clearRect(
                    0,
                    0,
                    512,
                    512
                );

                /*
                 * The official editor renders a final background before
                 * retrieving its 512x512 RGBA image data.
                 */
                ctx.fillStyle =
                    '#000000';

                ctx.fillRect(
                    0,
                    0,
                    512,
                    512
                );

                ctx.imageSmoothingEnabled =
                    true;

                if (
                    'imageSmoothingQuality' in
                    ctx
                ) {
                    ctx.imageSmoothingQuality =
                        'high';
                }

                ctx.drawImage(
                    img,
                    0,
                    0,
                    512,
                    512
                );

                $('#legendStatusModal')
                    .text(
                        'Image loaded \u2014 preparing Agar.io PNG8...'
                    )
                    .css(
                        'color',
                        getShopTheme().mc
                    );

                /*
                 * Prevent an older asynchronous encode from replacing a
                 * newer selected image.
                 */
                var encodeJobId =
                    (
                        window
                            ._lmSkinEncodeJobId ||
                        0
                    ) + 1;

                window._lmSkinEncodeJobId =
                    encodeJobId;

                ensureAgarUPNG()
                    .then(function(upng) {
                        if (
                            encodeJobId !==
                            window
                                ._lmSkinEncodeJobId
                        ) {
                            return;
                        }

                        var rgba =
                            ctx.getImageData(
                                0,
                                0,
                                512,
                                512
                            );

                        /*
                         * Exact image encoding call used by the original
                         * Agar.io custom-skin editor.
                         */
                        var encodedPng =
                            upng.encode(
                                [
                                    rgba.data
                                        .buffer
                                ],
                                512,
                                512,
                                16
                            );

                        var pngBytes =
                            new Uint8Array(
                                encodedPng
                            );

                        /*
                         * Never enable payment/upload until the output has
                         * been proven to be an indexed 512x512 PNG8 with no
                         * more than 16 palette entries.
                         */
                        var validation =
                            validateAgarPNG8(
                                pngBytes
                            );

                        if (!validation.valid) {
                            throw new Error(
                                validation.error
                            );
                        }

                        var kb =
                            (
                                pngBytes.length /
                                1024
                            ).toFixed(1);

                        if (
                            pngBytes.length >
                            102400
                        ) {
                            throw new Error(
                                'Agar PNG8 is too large: ' +
                                kb +
                                'KB; maximum is 100KB'
                            );
                        }

                        processedBufferModal =
                            pngBytes;

                        $('#legendStatusModal')
                            .text(
                                'Agar PNG8 Ready: ' +
                                kb +
                                'KB (512x512, ' +
                                validation
                                    .paletteEntries +
                                ' colors)'
                            )
                            .css(
                                'color',
                                getShopTheme().b2
                            );

                        updateShopLoginState();
                    })
                    .catch(function(error) {
                        if (
                            encodeJobId !==
                            window
                                ._lmSkinEncodeJobId
                        ) {
                            return;
                        }

                        processedBufferModal =
                            null;

                        console.error(
                            '[LM SKIN] Agar.io PNG8 preparation failed:',
                            error
                        );

                        $('#legendStatusModal')
                            .text(
                                'Agar.io PNG8 encoder failed: ' +
                                error.message
                            )
                            .css(
                                'color',
                                getShopTheme().b4
                            );

                        $('#legendSaveBtnModal')
                            .prop(
                                'disabled',
                                true
                            )
                            .css({
                                opacity: 0.5,
                                cursor:
                                    'not-allowed'
                            });
                    });
            };

            img.onerror = function() {
                processedBufferModal =
                    null;

                $('#legendStatusModal')
                    .text(
                        'Error loading image'
                    )
                    .css(
                        'color',
                        getShopTheme().b4
                    );
            };

            img.src = src;
        }

        $('#legendChooseFileBtn').off('click').on('click', function(e) {
            if (!window.checkUserLoggedIn() || !window.checkUserUID()) {
                if (window.toastr) {
                    toastr.warning('<b>[UPLOAD]:</b> You must be logged in and have a valid UID to upload skins.');
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('choose image file')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        $('#legendUploadInputModal').off('change').on('change', function(e) {
            if (!window.checkUserLoggedIn() || !window.checkUserUID()) {
                $(this).val('');
                if (window.toastr) {
                    toastr.warning('<b>[UPLOAD]:</b> You must be logged in and have a valid UID to upload skins.');
                }
                return;
            }
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('choose image file')) {
                $(this).val('');
                return;
            }
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
                if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('upload custom skin')) {
                    return;
                }
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
            $('#legendStatusModal').text('Select an image, drag & drop, or paste a URL').css('color', getShopTheme().tc2);
            $(this).hide();
        });

        // --- Load from URL ---
        $('#legendLoadUrlBtn').off('click').on('click', function() {
            if (!window.checkUserLoggedIn() || !window.checkUserUID()) {
                if (window.toastr) {
                    toastr.warning('<b>[UPLOAD]:</b> You must be logged in and have a valid UID to load skins.');
                }
                return;
            }
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('load custom skin URL')) {
                return;
            }
            var url = $('#legendSkinUrlInput').val().trim();
            if (!url) {
                toastr && toastr.warning('<b>[UPLOAD]:</b> Paste an image URL first.');
                return;
            }
            // Also accept skin URL field (#skin) if no explicit URL
            $('#legendStatusModal').text('Loading from URL...').css('color', getShopTheme().mc);
            processAndFormatModal(url);
            $('#legendClearBtn').show();
        });

        // Also support pressing Enter in the URL field
        $('#legendSkinUrlInput').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                $('#legendLoadUrlBtn').trigger('click');
            }
        });

        $('#legendSkinNameModal')
            .off(
                'input.skinNameRequired'
            )
            .on(
                'input.skinNameRequired',
                function() {
                    updateShopLoginState();
                }
            );

        $('#legendSaveBtnModal').off('click').on('click', function() {
            var btn = $(this);

            var name =
                $.trim(
                    $(
                        '#legendSkinNameModal'
                    ).val() ||
                    ''
                );

            var color =
                $(
                    '#legendSkinColorModal'
                ).val() ||
                "#FFFF00";

            if (!name) {
                toastr.warning(
                    '<b>[SKIN]:</b> Enter a skin name before uploading.'
                );

                $(
                    '#legendSkinNameModal'
                )
                    .focus()
                    .css(
                        'border-color',
                        '#ff5252'
                    );

                updateShopLoginState();
                return;
            }

            $(
                '#legendSkinNameModal'
            ).css(
                'border-color',
                ''
            );

            // Login + UID gate
            if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('upload and buy custom skin')) {
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

        // --- Tab switching (delegated event for instant reliable switching) ---
        $(document).off('click', '#specialShopModal .shop-tab').on('click', '#specialShopModal .shop-tab', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var tab = $(this).attr('data-tab') || $(this).data('tab');
            $('#specialShopModal .shop-tab').removeClass('active');
            $(this).addClass('active');
            $('#specialShopModal .tab-pane').removeClass('active');
            $('#specialShopModal #tab-' + tab).addClass('active');

            var headerTitle = $('#specialShopModal .modal-title');
            if (tab === 'deals') {
                headerTitle.html('<i class="fa fa-briefcase"></i> Special & Daily Deals');
            } else if (tab === 'upload') {
                headerTitle.html('<i class="fa fa-upload"></i> Custom Skin Uploader');
            } else {
                headerTitle.html('<i class="fa fa-paint-brush"></i> Agar.io Skins');
            }

            if (tab === 'skins') {
                if (
                    !window.GameConfiguration ||
                    !window.GameConfiguration.gameConfig
                ) {
                    LoadGameConfiguration();
                } else if (
                    !window._skinShopBuilt
                ) {
                    populateSkins();
                } else {
                    if (
                        typeof window.resumeSkinGridImages ===
                        'function'
                    ) {
                        window.resumeSkinGridImages();
                    }

                    updateEquippedSkinUI();
                }
            }
            if (tab === 'upload') {
                updateUploadBalance();
                var mainSkinUrl = $('#skin').val();
                if (mainSkinUrl && mainSkinUrl.length > 5 && !$('#legendSkinUrlInput').val()) {
                    $('#legendSkinUrlInput').val(mainSkinUrl);
                }
            }
            if (tab === 'deals') {
                if (!window._dealsShopBuilt) {
                    populateDealsGrid();
                }

                updateDealsBalance();
            }
            updateShopLoginState();
        });

        if (defaultTab) {
            $('#specialShopModal .shop-tab[data-tab="' + defaultTab + '"]').trigger('click');
        }

        $("#ss-select-agarVersionDestinations").change(function() {

            $("#GameConfigurationUrl").val(window.LM_CONFIG_CDN + "/" + $("#ss-select-agarVersionDestinations").val() + "GameConfiguration.json");
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
        window.closeSpecialShopModal =
            function() {
                if (
                    window._shopLoginCheckInterval
                ) {
                    clearInterval(
                        window._shopLoginCheckInterval
                    );

                    window._shopLoginCheckInterval =
                        null;
                }

                if (window._skinSearchTimer) {
                    clearTimeout(
                        window._skinSearchTimer
                    );

                    window._skinSearchTimer =
                        null;
                }

                /*
                 * A focused descendant must not remain inside an element
                 * that is about to become aria-hidden. Chrome blocks
                 * aria-hidden and prints a warning otherwise.
                 */
                var modal =
                    document.getElementById(
                        'specialShopModal'
                    );

                if (modal) {
                    var activeElement =
                        document.activeElement;

                    if (
                        activeElement &&
                        modal.contains(activeElement)
                    ) {
                        activeElement.blur();
                    }
                }

                /*
                 * Retain the built DOM and decoded thumbnails for fast reopen.
                 * The backdrop is inside the modal and hides with its parent.
                 */
                $("#specialShopModal")
                    .hide()
                    .removeClass('in')
                    .attr(
                        'aria-hidden',
                        'true'
                    );

                $("body").removeClass(
                    "modal-open"
                );

                /*
                 * Move focus to a safe external target so screen readers
                 * and keyboard navigation return to a visible element.
                 */
                var focusTarget =
                    document.getElementById(
                        'lm-special-deals-btn'
                    ) ||
                    document.getElementById(
                        'SpecialDealsBtn'
                    ) ||
                    document.body;

                if (
                    focusTarget &&
                    typeof focusTarget.focus ===
                        'function'
                ) {
                    focusTarget.focus({
                        preventScroll: true
                    });
                }
            };

        $(document).off('click', '#CloseSpecialDeals, #specialShopModal .modal-backdrop')
               .on('click', '#CloseSpecialDeals, #specialShopModal .modal-backdrop', function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.closeSpecialShopModal();
        });

        $(document).off('keydown.shopModal').on('keydown.shopModal', function(e) {
            if (e.which === 27 && $('#specialShopModal').length) {
                window.closeSpecialShopModal();
            }
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
            //$(".xpmt-skins").css('background-image', 'url("https://agario-configurations-web.s3.amazonaws.com/live/v15/2230/' + textcropped1 + '.png")');
            setTimeout(function() {
                /*
                 if ($('#ss-select-purchases').val() == "com.miniclip.agar.io.dailydeal7") {
                     $(".xpmt-skins").css('background-image', 'url(' + window.MiniclipDestination + 'Blueberry_Face.png ")');
                 } 
				 */
                $(".xpmt-skins").css('background-image', 'url("' + window.LM_CONFIG_CDN + '/' + window.agarversion + textcropped2 + '")');
                $(".xpmt-skins2").css('background-image', 'url("' + window.LM_CONFIG_CDN + '/' + window.agarversion + textcropped1 + '")');
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
        toastr && toastr.error('<b>[SHOP]:</b> No payment UID. Log out and log in again.');
        return;
    }
    var purchaseId = $("#ss-select-purchases option:selected").val();
    if (!purchaseId) {
        toastr && toastr.warning('<b>[SHOP]:</b> Select a deal first');
        return;
    }
    /* Use the official IPayment service instead of the dead payments.agar.io hostname */
    var started = openOfficialAgarIAP(purchaseId, { description: purchaseId });
    if (!started) {
        toastr && toastr.error('<b>[SHOP]:</b> Could not open the official payment flow');
    }
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
    // Also update upload tab balance
    $('#dnaCountModal').text(dna.toLocaleString());
    $('#coinsCountModal').text(coins.toLocaleString());
}

function updateUploadBalance() {
    var dna = 0, coins = 0;
    var userObj = (window.legendmod && window.legendmod.user) || (window.application && window.application.user);
    if (userObj) {
        dna = userObj.dna || 0;
        coins = userObj.coins || 0;
    }
    if (!dna && $('#dna').length) {
        var dText = $('#dna').text().replace(/[^0-9]/g, '');
        if (dText) dna = parseInt(dText, 10);
    }
    if (!coins && $('#coins').length) {
        var cText = $('#coins').text().replace(/[^0-9]/g, '');
        if (cText) coins = parseInt(cText, 10);
    }
    $('#dnaCountModal').text(dna.toLocaleString());
    $('#coinsCountModal').text(coins.toLocaleString());
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
 * Visual Potion Selector Modal — replaces raw prompt('Product ID:')
 */
function showPotionProductSelector() {
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('open potions')) return;

    var t = getShopTheme();
    var old = document.getElementById('lm-potion-selector-modal');
    if (old) old.remove();

    var modal = document.createElement('div');
    modal.id = 'lm-potion-selector-modal';
    modal.className = 'lm-modal-overlay';
    modal.style.zIndex = '999999';

    // Build options from active user potions or standard potion types
    var activePotions = [];
    if (window.application && window.application.user && window.application.user.potionsStatus) {
        var ps = window.application.user.potionsStatus;
        for (var pKey in ps) {
            if (ps[pKey] && ps[pKey].type) {
                activePotions.push({
                    slot: ps[pKey].slot,
                    type: ps[pKey].type,
                    status: ps[pKey].status === 3 ? 'Ready to Open' : (ps[pKey].status === 2 ? 'Brewing' : 'Ready to Brew')
                });
            }
        }
    }

    var defaultPotions = [
        { type: 'potion_common_1', name: 'Common Potion' },
        { type: 'potion_rare_1', name: 'Rare Potion' },
        { type: 'potion_epic_1', name: 'Epic Potion' },
        { type: 'potion_exotic_1', name: 'Exotic Potion' }
    ];

    var html = `
        <div class="lm-modal-container" style="background: ${t.pc}; border-color: ${t.mc}; width: 440px;">
            <div class="lm-modal-header" style="background: ${t.pc2};">
                <div class="lm-modal-title" style="color: ${t.mc}; font-size: 16px;">
                    🧪 Select Potion to Open
                </div>
                <button class="lm-modal-close" onclick="document.getElementById('lm-potion-selector-modal').remove();">&times;</button>
            </div>
            <div class="lm-modal-body" style="padding: 16px;">
    `;

    if (activePotions.length) {
        html += `<div style="font-weight: 700; margin-bottom: 8px; color: ${t.tc}; font-size: 12px;">Active Account Potions:</div>`;
        activePotions.forEach(function(p) {
            var name = p.type.replace(/_/g, ' ').toUpperCase();
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                    <div>
                        <div style="font-weight: 700; color: ${t.tc}; font-size: 13px;">${name} (Slot ${p.slot})</div>
                        <div style="font-size: 11px; color: ${t.tc2};">${p.status}</div>
                    </div>
                    <button class="btn btn-sm btn-success" style="font-weight: 700; padding: 4px 12px;" onclick="if(window.openPotion) window.openPotion(${p.slot}); document.getElementById('lm-potion-selector-modal').remove();">Open</button>
                </div>
            `;
        });
    }

    html += `<div style="font-weight: 700; margin: 12px 0 8px 0; color: ${t.tc}; font-size: 12px;">Standard Potion Types:</div>`;
    defaultPotions.forEach(function(p) {
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 6px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="font-weight: 600; color: ${t.tc}; font-size: 13px;">${p.name}</div>
                <button class="btn btn-sm btn-primary" style="font-weight: 700; padding: 4px 12px;" onclick="if(window.application && window.application.openPotionForProduct) window.application.openPotionForProduct('${p.type}'); document.getElementById('lm-potion-selector-modal').remove();">Open</button>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    modal.innerHTML = html;
    document.body.appendChild(modal);
}
window.showPotionProductSelector = showPotionProductSelector;

/**
 * Populate the deals grid with cards from GameConfiguration
 */
function populateDealsGrid() {
    var grid = document.getElementById('dealsGrid');
    if (!grid) return;

    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) {
        if (window.master && window.master.GameConfiguration && window.master.GameConfiguration.gameConfig) {
            window.GameConfiguration = window.master.GameConfiguration;
        } else {
            grid.innerHTML = '<div style="text-align: center; color: ' + getShopTheme().tc2 + '; padding: 20px;"><i class="fa fa-spinner fa-spin fa-2x"></i><br><br>Loading deals...</div>';
            if (!window._isLoadingGameConfig) {
                window._isLoadingGameConfig = true;
                LoadGameConfiguration();
            }
            return;
        }
    }

    var iaps = window.GameConfiguration.gameConfig['Wallet - In-App Purchases'] || [];
    var bundles = window.GameConfiguration.gameConfig['Visual - Bundles'] || [];
    var softPurchases = window.GameConfiguration.gameConfig['Wallet - Soft Purchases'] || [];
    var offerableBundles = window.GameConfiguration.gameConfig['Wallet - Offerable Bundles'] || [];
    var bundleProducts = window.GameConfiguration.gameConfig['Wallet - Product Bundles'] || window.GameConfiguration.gameConfig['Wallet - Bundle Products'] || [];

    if (iaps.length === 0 && softPurchases.length === 0 && offerableBundles.length === 0) {
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
        var price = (function(tier) {
            if (window.GameConfiguration && window.GameConfiguration.gameConfig && window.GameConfiguration.gameConfig['Prices - Matrix']) {
                var matrix = window.GameConfiguration.gameConfig['Prices - Matrix'];
                for (var m = 0; m < matrix.length; m++) {
                    if (String(matrix[m].tierId || matrix[m].id) === String(tier)) {
                        return '$' + (matrix[m].amount || matrix[m].price);
                    }
                }
            }
            return priceMap[tier] || ('Tier ' + tier);
        })(deal.priceTier);
        var desc = (bundleInfo.description && bundleInfo.description !== 'na')
            ? bundleInfo.description.replace(/_/g, ' ').replace(' name', '')
            : deal.bundleId.replace(/com\.miniclip\.agar\.io\./g, '').replace(/_/g, ' ');

        // Resolve skins via Gameplay - Equippable Skins for proper names
        var resolvedSkins = getDealSkinEntries(deal.bundleId);
        var resolvedSkinPids = {};
        for (var rs = 0; rs < resolvedSkins.length; rs++) {
            if (resolvedSkins[rs].productId) resolvedSkinPids[resolvedSkins[rs].productId] = true;
            if (resolvedSkins[rs].cleanProductId) resolvedSkinPids[resolvedSkins[rs].cleanProductId] = true;
        }

        // Figure out what's in the bundle
        var contents = productLookup[deal.bundleId] || [];
        var contentText = '';

        // Show resolved skin names first (proper titles from config)
        for (var rs2 = 0; rs2 < resolvedSkins.length; rs2++) {
            contentText += '<span style="font-size: 10px; display: inline-block; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 3px; margin: 1px;">🎨 ' + resolvedSkins[rs2].name + '</span> ';
        }

        // Show non-skin products (coins, DNA, boosts, etc.)
        for (var c = 0; c < contents.length; c++) {
            var pid = contents[c].productId || '';
            var qty = contents[c].quantity || 1;
            // Skip skin products already shown with resolved names above
            var cleanPid = pid.replace(/^(shop_skin_|skin_)/, '');
            if (resolvedSkinPids[pid] || resolvedSkinPids[cleanPid]) continue;
            var label = pid.replace(/_/g, ' ');
            if (pid.indexOf('coins') !== -1) label = '💰 ' + qty.toLocaleString() + ' Coins';
            else if (pid.indexOf('dna') !== -1) label = '🧬 ' + qty.toLocaleString() + ' DNA';
            else if (pid.indexOf('skin') !== -1) label = '🎨 ' + cleanPid.replace(/_/g, ' ');
            else if (pid.indexOf('boost') !== -1) label = '🚀 ' + pid.replace(/_/g, ' ');
            else label = qty + 'x ' + label;
            contentText += '<span style="font-size: 10px; display: inline-block; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 3px; margin: 1px;">' + label + '</span> ';
        }
        if (!contentText) contentText = '<span style="font-size: 10px; color: ' + t.tc2 + ';">Bundle</span>';

        // Resolve all deal skin entries and render small skin icons
        var skinImgs = getDealSkinImages(deal.bundleId);
        var skinMiniIconsHtml = renderDealSkinMiniIcons(deal.bundleId, 6);

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
        html += '<div style="line-height: 1.4; margin-top: 2px;">' + contentText + skinMiniIconsHtml + '</div>';
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

    // --- Offer Bundles (from Wallet - Offerable Bundles, not Visual - Bundles) ---
    //
    // HIDDEN: These are unfiltered catalog definitions, NOT confirmed active offers.
    // The server rejects them with opcode 78 result 2 ("offer not active").
    // LM currently has no way to determine which bundles are genuinely active
    // for the current account/session. Showing Buy buttons is misleading.
    //
    // To re-enable: implement active-offer tracking via server responses and
    // filter offerableBundles against confirmed active IDs before rendering.
    //
    // The data is still loaded above (line ~2385) for future use.

    if (!html) {
        html = '<div style="text-align: center; color: ' + t.tc2 + '; padding: 20px;">No deals found in configuration.</div>';
    }

    grid.innerHTML = html;

    var dealImages =
        grid.querySelectorAll('img');

    for (
        var dealImageIndex = 0;
        dealImageIndex <
            dealImages.length;
        dealImageIndex++
    ) {
        dealImages[
            dealImageIndex
        ].loading = 'lazy';

        dealImages[
            dealImageIndex
        ].decoding = 'async';
    }

    window._dealsShopBuilt = true;
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
    if (window._freeCoinsTimeout) {
        clearTimeout(window._freeCoinsTimeout);
        window._freeCoinsTimeout = null;
    }
    // Reset ad reward button
    var arBtn = document.getElementById('adRewardBtn');
    if (arBtn) { arBtn.disabled = false; arBtn.innerHTML = '📺 Ad Reward'; arBtn.style.opacity = '1'; arBtn.style.pointerEvents = 'auto'; }
    // Reset free coins button
    var fcBtn = document.getElementById('claimFreeCoinsBtn');
    if (fcBtn) { fcBtn.disabled = false; fcBtn.textContent = 'Claim!'; fcBtn.style.opacity = '1'; }
};

/**
 * Get skin image URLs for a deal bundle (optimized with O(1) hash map lookup)
 */
function getDealSkinEntries(bundleId) {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return [];

    if (
        !window._bundleSkinEntriesCache ||
        window._bundleSkinEntriesCacheConfig !== window.GameConfiguration.gameConfig
    ) {
        window._bundleSkinEntriesCacheConfig = window.GameConfiguration.gameConfig;
        window._bundleSkinEntriesCache = {};
        window._bundleSkinImagesCache = {};

        var bundleProducts = window.GameConfiguration.gameConfig['Wallet - Product Bundles'] || window.GameConfiguration.gameConfig['Wallet - Bundle Products'] || [];
        var skins = window.GameConfiguration.gameConfig['Gameplay - Equippable Skins'] || [];
        var cdnBase = window.LM_CDN_BASE();

        // productId/cleanId -> { productId, name, imageUrl }
        var skinMetaMap = {};

        for (var s = 0; s < skins.length; s++) {
            var skinItem = skins[s];
            if (!skinItem || !skinItem.productId) continue;

            var imgFile = skinItem.image || '';
            if (imgFile === 'uses_spine' && window.SpineSkinMap && window.SpineSkinMap[skinItem.productId]) {
                imgFile = window.SpineSkinMap[skinItem.productId] + '.png';
            }

            var imageUrl = '';
            if (imgFile && imgFile !== 'uses_spine') {
                imageUrl = cdnBase + imgFile;
            }

            var cleanPid = skinItem.productId.replace(/^(shop_skin_|skin_)/, '');
            var displayName =
                (skinItem.name && skinItem.name !== 'na' ? skinItem.name : cleanPid)
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });

            var meta = {
                productId: skinItem.productId,
                cleanProductId: cleanPid,
                name: displayName,
                imageUrl: imageUrl
            };

            skinMetaMap[skinItem.productId] = meta;
            skinMetaMap[cleanPid] = meta;
        }

        for (var bp = 0; bp < bundleProducts.length; bp++) {
            var item = bundleProducts[bp];
            if (!item || !item.bundleId || !item.productId) continue;

            var bId = item.bundleId;
            var pId = item.productId;
            var cleanPId = pId.replace(/^(shop_skin_|skin_)/, '');
            var meta = skinMetaMap[pId] || skinMetaMap[cleanPId];

            if (!meta) continue;

            if (!window._bundleSkinEntriesCache[bId]) {
                window._bundleSkinEntriesCache[bId] = [];
            }
            if (!window._bundleSkinImagesCache[bId]) {
                window._bundleSkinImagesCache[bId] = [];
            }

            var alreadyExists = false;
            for (var ex = 0; ex < window._bundleSkinEntriesCache[bId].length; ex++) {
                if (window._bundleSkinEntriesCache[bId][ex].productId === meta.productId) {
                    alreadyExists = true;
                    break;
                }
            }

            if (!alreadyExists) {
                window._bundleSkinEntriesCache[bId].push(meta);
                if (meta.imageUrl) {
                    window._bundleSkinImagesCache[bId].push(meta.imageUrl);
                }
            }
        }
    }

    return window._bundleSkinEntriesCache[bundleId] || [];
}

function getDealSkinImages(bundleId) {
    var entries = getDealSkinEntries(bundleId);
    var imgs = [];
    for (var i = 0; i < entries.length; i++) {
        if (entries[i] && entries[i].imageUrl) {
            imgs.push(entries[i].imageUrl);
        }
    }
    return imgs;
}

function renderDealSkinMiniIcons(bundleId, maxIcons) {
    var entries = getDealSkinEntries(bundleId);
    if (!entries || !entries.length) return '';

    if (!maxIcons) maxIcons = 6;

    var shown = entries.slice(0, maxIcons);
    var html = '<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; align-items:center;">';

    for (var i = 0; i < shown.length; i++) {
        var e = shown[i];
        if (!e || !e.imageUrl) continue;

        html +=
            '<img ' +
                'src="' + e.imageUrl + '" ' +
                'title="' + String(e.name || e.productId).replace(/"/g, '&quot;') + '" ' +
                'style="' +
                    'width:22px;' +
                    'height:22px;' +
                    'border-radius:50%;' +
                    'object-fit:cover;' +
                    'border:1px solid rgba(255,255,255,0.35);' +
                    'background:rgba(0,0,0,0.2);' +
                '" ' +
                'onerror="this.style.display=\'none\'"' +
            '>';
    }

    if (entries.length > maxIcons) {
        html +=
            '<span style="' +
                'display:inline-flex;' +
                'align-items:center;' +
                'justify-content:center;' +
                'height:22px;' +
                'min-width:22px;' +
                'padding:0 6px;' +
                'border-radius:11px;' +
                'font-size:10px;' +
                'font-weight:700;' +
                'background:rgba(255,255,255,0.08);' +
                'color:#ddd;' +
            '">+' + (entries.length - maxIcons) + '</span>';
    }

    html += '</div>';
    return html;
}

// Backwards compat wrapper
function getDealSkinImage(bundleId) {
    var imgs = getDealSkinImages(bundleId);
    return imgs.length > 0 ? imgs[0] : null;
}

/**
 * Buy a deal via IAP payment URL (real money)
 */
function _showDealBuyConfirmationModal(title, priceLabel, onConfirm) {
    var old = document.getElementById('deal-buy-confirm-modal');
    if (old) old.remove();

    var t = getShopTheme();
    var modal = document.createElement('div');
    modal.id = 'deal-buy-confirm-modal';
    modal.className = 'lm-modal-overlay';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 2000000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); animation: lm-fade-in 0.15s ease; pointer-events: auto;';
    modal.innerHTML = 
        '<div class="lm-modal-container" style="background: ' + t.pc + '; border: 1px solid ' + t.pc2 + '; width: 380px; text-align: center; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: \'Roboto Condensed\', sans-serif;">' +
            '<div style="background: ' + t.pc2 + '; padding: 14px 20px; font-size: 16px; font-weight: 900; color: ' + t.mc + '; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.08);">' +
                '🛒 Purchase Confirmation' +
            '</div>' +
            '<div style="padding: 20px 24px;">' +
                '<div style="font-size: 15px; font-weight: 800; color: ' + t.tc + '; margin-bottom: 8px;">' + title + '</div>' +
                (priceLabel ? ('<div style="font-size: 13px; font-weight: 700; color: ' + t.mc + '; margin-bottom: 14px;">Price: ' + priceLabel + '</div>') : '') +
                '<div style="font-size: 11px; color: ' + t.tc2 + ';">Are you sure you want to proceed?</div>' +
            '</div>' +
            '<div style="display: flex; gap: 10px; padding: 12px 20px; background: ' + t.pc2 + '; border-top: 1px solid rgba(255,255,255,0.1);">' +
                '<button id="deal-confirm-cancel" type="button" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; background: rgba(255,255,255,0.08); color: ' + t.tc + '; border: 1px solid rgba(255,255,255,0.15);">Cancel</button>' +
                '<button id="deal-confirm-buy" type="button" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; background: ' + t.b1 + '; color: ' + t.btc + '; border: none;">Confirm</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    function doConfirm(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        modal.remove();
        if (typeof onConfirm === 'function') onConfirm();
    }

    function doCancel(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        modal.remove();
    }

    modal.addEventListener('click', function(e) { if (e.target === modal) doCancel(e); });

    var cancelBtn = document.getElementById('deal-confirm-cancel');
    var buyBtn = document.getElementById('deal-confirm-buy');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', doCancel);
        cancelBtn.addEventListener('touchstart', doCancel, { passive: false });
    }
    if (buyBtn) {
        buyBtn.addEventListener('click', doConfirm);
        buyBtn.addEventListener('touchstart', doConfirm, { passive: false });
    }
}

/**
 * Accept only the Xsolla Pay Station URL returned by Agar.io's payment
 * endpoint. Fail closed if the response redirects anywhere else.
 */
function _getTrustedXsollaPaymentUrl(rawUrl) {
    try {
        var parsed =
            new URL(
                String(
                    rawUrl || ''
                ).trim()
            );

        /*
         * Real-money production payments must use Xsolla's production
         * Pay Station host. Do not permit sandbox, lookalike domains,
         * credentials in the URL, HTTP, or arbitrary ports.
         */
        if (
            parsed.protocol !== 'https:' ||
            parsed.hostname.toLowerCase() !==
                'secure.xsolla.com' ||
            parsed.port !== '' ||
            parsed.username !== '' ||
            parsed.password !== ''
        ) {
            return null;
        }

        /*
         * Accept Xsolla Pay Station versions used by both the historical
         * Agar.io integration and the current Xsolla integration:
         *
         * /paystation3/...
         * /paystation4/...
         *
         * This deliberately rejects unrelated secure.xsolla.com pages.
         */
        if (
            !/^\/paystation\d*(?:\/|$)/i.test(
                parsed.pathname
            )
        ) {
            return null;
        }

        /*
         * Legacy Agar.io/Xsolla URLs use access_token.
         * Current Pay Station 4 URLs use token.
         *
         * Accept either, but require a meaningful token value.
         */
        var paymentToken =
            parsed.searchParams.get(
                'token'
            ) ||
            parsed.searchParams.get(
                'access_token'
            );

        if (
            !paymentToken ||
            paymentToken.length < 16
        ) {
            return null;
        }

        return parsed.href;
    } catch (error) {
        return null;
    }
}

/**
 * Require explicit, per-purchase acceptance before contacting Agar.io's
 * Xsolla endpoint. Consent is never remembered automatically.
 */
function _showIAPBetaRiskModal(
    title,
    purchaseId,
    onAgree
) {
    var old =
        document.getElementById(
            'iap-beta-risk-modal'
        );

    if (old) {
        old.remove();
    }

    var t =
        getShopTheme();

    var modal =
        document.createElement(
            'div'
        );

    modal.id =
        'iap-beta-risk-modal';

    modal.className =
        'lm-modal-overlay';

    modal.setAttribute(
        'role',
        'dialog'
    );

    modal.setAttribute(
        'aria-modal',
        'true'
    );

    modal.setAttribute(
        'aria-labelledby',
        'iap-beta-risk-title'
    );

    modal.style.cssText =
        'position:fixed;' +
        'inset:0;' +
        'z-index:2100000;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'background:rgba(0,0,0,0.82);' +
        'backdrop-filter:blur(5px);' +
        'pointer-events:auto;';

    modal.innerHTML =
        '<div style="' +
            'background:' + t.pc + ';' +
            'border:2px solid #ff5252;' +
            'width:460px;' +
            'max-width:calc(100vw - 30px);' +
            'border-radius:12px;' +
            'overflow:hidden;' +
            'box-shadow:0 14px 40px rgba(0,0,0,0.65);' +
            'font-family:\'Roboto Condensed\',sans-serif;' +
        '">' +

            '<div id="iap-beta-risk-title" style="' +
                'background:#b71c1c;' +
                'color:#fff;' +
                'padding:14px 18px;' +
                'font-size:17px;' +
                'font-weight:900;' +
                'text-align:center;' +
                'letter-spacing:0.5px;' +
            '">' +
                '\u26A0 BETA REAL-MONEY PURCHASE' +
            '</div>' +

            '<div style="' +
                'padding:18px 22px;' +
                'color:' + t.tc + ';' +
                'font-size:13px;' +
                'line-height:1.45;' +
            '">' +

                '<div id="iap-beta-deal-name" style="' +
                    'font-size:15px;' +
                    'font-weight:900;' +
                    'margin-bottom:8px;' +
                '"></div>' +

                '<div id="iap-beta-purchase-id" style="' +
                    'font-size:11px;' +
                    'color:' + t.tc2 + ';' +
                    'margin-bottom:14px;' +
                    'word-break:break-all;' +
                '"></div>' +

                '<div style="' +
                    'background:rgba(255,82,82,0.12);' +
                    'border:1px solid rgba(255,82,82,0.55);' +
                    'border-radius:8px;' +
                    'padding:12px;' +
                    'margin-bottom:14px;' +
                '">' +
                    '<b>This purchase route is experimental.</b><br>' +
                    'You may be charged but not receive the displayed deal, skin, coins, or other items. ' +
                    'Legend Mod cannot guarantee delivery, correction, or a refund. ' +
                    '<b>Proceed only at your own responsibility.</b>' +
                '</div>' +

                '<label style="' +
                    'display:flex;' +
                    'gap:9px;' +
                    'align-items:flex-start;' +
                    'cursor:pointer;' +
                    'font-weight:700;' +
                '">' +
                    '<input id="iap-beta-risk-checkbox" type="checkbox" style="margin-top:3px;">' +
                    '<span>I understand the BETA risk and accept full responsibility for continuing.</span>' +
                '</label>' +

            '</div>' +

            '<div style="' +
                'display:flex;' +
                'gap:10px;' +
                'padding:13px 18px;' +
                'background:' + t.pc2 + ';' +
                'border-top:1px solid rgba(255,255,255,0.1);' +
            '">' +

                '<button id="iap-beta-disagree" type="button" style="' +
                    'flex:1;' +
                    'padding:11px;' +
                    'border-radius:8px;' +
                    'font-weight:900;' +
                    'font-size:13px;' +
                    'cursor:pointer;' +
                    'background:rgba(255,255,255,0.08);' +
                    'color:' + t.tc + ';' +
                    'border:1px solid rgba(255,255,255,0.18);' +
                '">' +
                    'Disagree \u2014 Cancel' +
                '</button>' +

                '<button id="iap-beta-agree" type="button" disabled style="' +
                    'flex:1;' +
                    'padding:11px;' +
                    'border-radius:8px;' +
                    'font-weight:900;' +
                    'font-size:13px;' +
                    'cursor:not-allowed;' +
                    'background:#d32f2f;' +
                    'color:#fff;' +
                    'border:none;' +
                    'opacity:0.45;' +
                '">' +
                    'I Agree \u2014 Open Xsolla' +
                '</button>' +

            '</div>' +

        '</div>';

    document.body.appendChild(
        modal
    );

    document
        .getElementById(
            'iap-beta-deal-name'
        )
        .textContent =
            String(
                title ||
                purchaseId ||
                'Agar.io deal'
            );

    document
        .getElementById(
            'iap-beta-purchase-id'
        )
        .textContent =
            'Purchase ID: ' +
            String(
                purchaseId || ''
            );

    var checkbox =
        document.getElementById(
            'iap-beta-risk-checkbox'
        );

    var agreeBtn =
        document.getElementById(
            'iap-beta-agree'
        );

    var disagreeBtn =
        document.getElementById(
            'iap-beta-disagree'
        );

    function removeModal() {
        document.removeEventListener(
            'keydown',
            onKeyDown,
            true
        );

        if (modal.parentNode) {
            modal.parentNode
                .removeChild(
                    modal
                );
        }
    }

    function disagree(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        removeModal();
    }

    function agree(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (
            !checkbox ||
            !checkbox.checked
        ) {
            return;
        }

        removeModal();

        if (
            typeof onAgree ===
                'function'
        ) {
            onAgree();
        }
    }

    function onKeyDown(event) {
        if (
            event.key ===
            'Escape'
        ) {
            disagree(
                event
            );
        }
    }

    checkbox.addEventListener(
        'change',
        function() {
            var enabled =
                checkbox.checked ===
                true;

            agreeBtn.disabled =
                !enabled;

            agreeBtn.style.opacity =
                enabled
                    ? '1'
                    : '0.45';

            agreeBtn.style.cursor =
                enabled
                    ? 'pointer'
                    : 'not-allowed';
        }
    );

    disagreeBtn.addEventListener(
        'click',
        disagree
    );

    agreeBtn.addEventListener(
        'click',
        agree
    );

    modal.addEventListener(
        'click',
        function(event) {
            if (
                event.target ===
                modal
            ) {
                disagree(
                    event
                );
            }
        }
    );

    document.addEventListener(
        'keydown',
        onKeyDown,
        true
    );

    checkbox.focus();
}

/**
 * Reproduce the payment request used by the supplied original Agar.io client.
 * The Haxe payment service itself is private inside agario.js, so Legend Mod
 * uses the same current endpoint and validates the returned Xsolla URL before
 * opening it.
 *
 * Official flow (agario.js line ~39678-39690):
 *   buyProduct(token, productId, currencyCode)
 *     -> doShowPaymentModal(endpoint + "/pay/" + token + "/" + productId + "/" + currencyCode)
 *     -> agarApp.utils.load(url, callback)
 *     -> callback parses JSON, gets iframe_url
 *     -> sets #modal-payment-link.href = iframe_url
 *     -> .xsolla_container.magnificPopup({ type: "iframe" })
 *     -> modalPaymentLink.click()
 */
function getOfficialAgarPaymentService() {
    /*
     * agarApp.utils.load is defined in bundle_start.js which Legend Mod
     * does not load. Use a plain XMLHttpRequest instead — it is exactly
     * what the original utils.load() wraps internally.
     */

    /*
     * Production Agar.io Xsolla-session endpoint.
     *
     * agario.js contains a compiled development default, but the production
     * environment config uses payments.agario.miniclippt.com.
     */
    var productionPaymentOrigin =
        'https://payments.agario.miniclippt.com';

    var runtimePaymentEndpoint =
        window.EnvConfig &&
        typeof window.EnvConfig
            .xsolla_endpoint ===
            'string'
            ? window.EnvConfig
                .xsolla_endpoint
                .trim()
            : '';

    var paymentEndpoint =
        productionPaymentOrigin;

    if (runtimePaymentEndpoint) {
        try {
            var parsedPaymentEndpoint =
                new URL(
                    runtimePaymentEndpoint
                );

            /*
             * Accept only Agar.io's exact HTTPS production payment origin.
             * Never silently use payments-dev or another hostname.
             */
            if (
                parsedPaymentEndpoint.protocol ===
                    'https:' &&
                parsedPaymentEndpoint.hostname
                    .toLowerCase() ===
                    'payments.agario.miniclippt.com' &&
                parsedPaymentEndpoint.port === '' &&
                (
                    parsedPaymentEndpoint.pathname ===
                        '/' ||
                    parsedPaymentEndpoint.pathname ===
                        ''
                )
            ) {
                paymentEndpoint =
                    parsedPaymentEndpoint.origin;
            } else {
                console.warn(
                    '[SHOP] Ignoring non-production Agar.io payment endpoint:',
                    runtimePaymentEndpoint
                );
            }
        } catch (
            paymentEndpointError
        ) {
            console.warn(
                '[SHOP] Invalid runtime Agar.io payment endpoint; using production:',
                paymentEndpointError
            );
        }
    }

    return {
        payment_endpoint:
            paymentEndpoint,

        getCurrencyCode:
            function() {
                var selected =
                    String(
                        $(
                            '#BuyDealCurrency'
                        ).val() ||
                        'USD'
                    )
                    .trim()
                    .toUpperCase();

                return /^[A-Z]{3}$/
                    .test(
                        selected
                    )
                        ? selected
                        : 'USD';
            },

        buyProduct:
            function(
                token,
                productId,
                currencyCode
            ) {
                token =
                    String(
                        token || ''
                    ).trim();

                productId =
                    String(
                        productId || ''
                    ).trim();

                currencyCode =
                    String(
                        currencyCode ||
                        'USD'
                    )
                    .trim()
                    .toUpperCase();

                if (!token) {
                    throw new Error(
                        'Missing Agar.io Xsolla token.'
                    );
                }

                if (
                    !/^[A-Za-z0-9._-]+$/
                        .test(
                            productId
                        )
                ) {
                    throw new Error(
                        'Invalid purchase ID.'
                    );
                }

                if (
                    !/^[A-Z]{3}$/
                        .test(
                            currencyCode
                        )
                ) {
                    currencyCode =
                        'USD';
                }

                /*
                 * Exact request shape from the original client (agario.js line ~39679):
                 *
                 *   endpoint + "/pay/" + token + "/" + productId + "/" + currencyCode
                 *
                 * The token is already encoded by Agar.io. Do not pass it
                 * through encodeURIComponent().
                 */
                var paymentRequestUrl =
                    paymentEndpoint +
                    '/pay/' +
                    token +
                    '/' +
                    productId +
                    '/' +
                    currencyCode;

                console.log(
                    '[SHOP] Requesting official Agar.io Xsolla session:',
                    {
                        purchaseId:
                            productId,
                        currency:
                            currencyCode
                    }
                );

                var xhr = new XMLHttpRequest();
                xhr.open('GET', paymentRequestUrl, true);
                xhr.timeout = 15000;
                xhr.onload = function() {
                    if (xhr.status < 200 || xhr.status >= 300) {
                        console.error('[SHOP] Agar.io payment endpoint returned HTTP ' + xhr.status);
                        if (window.toastr) {
                            toastr.error('<b>[SHOP]:</b> Agar.io payment endpoint returned HTTP ' + xhr.status + '.');
                        }
                        return;
                    }

                    var data = xhr.responseText;
                    try {
                            var response =
                                typeof data ===
                                    'string'
                                    ? JSON.parse(
                                        data
                                    )
                                    : data;

                            var trustedXsollaUrl =
                                _getTrustedXsollaPaymentUrl(
                                    response &&
                                    response
                                        .iframe_url
                                );

                            if (
                                !trustedXsollaUrl
                            ) {
                                throw new Error(
                                    'Rejected payment URL: expected an HTTPS secure.xsolla.com Pay Station URL with an access token. Got: ' +
                                    String(response && response.iframe_url || '(empty)')
                                );
                            }

                            /* Reproduce exact official flow: #modal-payment-link + .xsolla_container magnificPopup */
                            var modalPaymentLink =
                                document
                                    .querySelector(
                                        '#modal-payment-link'
                                    );

                            var xsollaContainer =
                                window.jQuery
                                    ? window
                                        .jQuery(
                                            '.xsolla_container'
                                        )
                                    : null;

                            if (
                                modalPaymentLink &&
                                xsollaContainer &&
                                xsollaContainer
                                    .length &&
                                typeof xsollaContainer
                                    .magnificPopup ===
                                    'function'
                            ) {
                                modalPaymentLink
                                    .href =
                                    trustedXsollaUrl;

                                modalPaymentLink
                                    .rel =
                                    'noopener noreferrer';

                                xsollaContainer
                                    .magnificPopup({
                                        type:
                                            'iframe',

                                        mainClass:
                                            'mfp-fade',

                                        preloader:
                                            true,

                                        fixedContentPos:
                                            false
                                    });

                                modalPaymentLink
                                    .click();

                                console.log(
                                    '[SHOP] Official Xsolla iframe opened:',
                                    { purchaseId: productId }
                                );

                                return;
                            }

                            /* Secondary Magnific Popup path */
                            if (
                                window.jQuery &&
                                window.jQuery
                                    .magnificPopup &&
                                typeof window
                                    .jQuery
                                    .magnificPopup
                                    .open ===
                                    'function'
                            ) {
                                window.jQuery
                                    .magnificPopup
                                    .open({
                                        items: {
                                            src:
                                                trustedXsollaUrl
                                        },

                                        type:
                                            'iframe',

                                        mainClass:
                                            'mfp-fade',

                                        preloader:
                                            true,

                                        fixedContentPos:
                                            false
                                    });

                                console.log(
                                    '[SHOP] Xsolla iframe opened through Magnific Popup fallback:',
                                    { purchaseId: productId }
                                );

                                return;
                            }

                            /* Last-resort browser tab fallback */
                            var fallbackLink =
                                document
                                    .createElement(
                                        'a'
                                    );

                            fallbackLink.href =
                                trustedXsollaUrl;

                            fallbackLink.target =
                                '_blank';

                            fallbackLink.rel =
                                'noopener noreferrer';

                            document.body
                                .appendChild(
                                    fallbackLink
                                );

                            fallbackLink.click();
                            fallbackLink.remove();
                        } catch (
                            responseError
                        ) {
                            console.error(
                                '[SHOP] Agar.io returned an invalid or untrusted Xsolla response:',
                                responseError
                            );

                            if (
                                window.toastr
                            ) {
                                toastr.error(
                                    '<b>[SHOP]:</b> Payment blocked because Agar.io did not return a trusted Xsolla Pay Station URL.'
                                );
                            }
                        }
                };
                xhr.onerror = function() {
                    console.error('[SHOP] Network error contacting Agar.io payment endpoint');
                    if (window.toastr) {
                        toastr.error('<b>[SHOP]:</b> Network error contacting Agar.io payment endpoint.');
                    }
                };
                xhr.ontimeout = function() {
                    console.error('[SHOP] Agar.io payment endpoint timed out');
                    if (window.toastr) {
                        toastr.error('<b>[SHOP]:</b> Agar.io payment endpoint timed out.');
                    }
                };
                xhr.send();

                return true;
            }
    };
}

/**
 * Open an Agar.io real-money purchase only after explicit BETA-risk consent.
 * Every Xsolla URL is validated before it is opened.
 */
function openOfficialAgarIAP(
    purchaseId,
    options
) {
    options =
        options || {};

    purchaseId =
        String(
            purchaseId || ''
        ).trim();

    if (
        !purchaseId ||
        !/^[A-Za-z0-9._-]+$/
            .test(
                purchaseId
            )
    ) {
        if (
            window.toastr
        ) {
            toastr.error(
                '<b>[SHOP]:</b> Missing or invalid purchase ID.'
            );
        }

        return false;
    }

    var officialUser =
        window.Core &&
        window.Core.user
            ? window.Core.user
            : null;

    /*
     * xsollaToken is already encoded by the official client.
     */
    var xsollaToken =
        (
            officialUser &&
            officialUser
                .xsollaToken
        ) ||
        window.agarioEncodedUID ||
        '';

    if (!xsollaToken) {
        if (
            window.toastr
        ) {
            toastr.error(
                '<b>[SHOP]:</b> The Agar.io payment token is unavailable. Log out, log in again, and wait for the profile to load.'
            );
        }

        return false;
    }


    var paymentService =
        getOfficialAgarPaymentService();

    if (
        !paymentService ||
        !paymentService
            .payment_endpoint
    ) {
        if (
            window.toastr
        ) {
            toastr.error(
                '<b>[SHOP]:</b> Official Agar.io payment service is not ready. Wait for the Agar.io client to load and try again.'
            );
        }

        return false;
    }

    var currency =
        typeof paymentService
            .getCurrencyCode ===
            'function'
            ? paymentService
                .getCurrencyCode()
            : 'USD';

    /*
     * No request is sent to Agar.io and no Xsolla page is opened until the
     * user checks the responsibility box and presses Agree.
     */
    if (
        options.riskAccepted !==
        true
    ) {
        _showIAPBetaRiskModal(
            options.description ||
                purchaseId,

            purchaseId,

            function() {
                var acceptedOptions =
                    {};

                var optionKey;

                for (
                    optionKey in
                    options
                ) {
                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                options,
                                optionKey
                            )
                    ) {
                        acceptedOptions[
                            optionKey
                        ] =
                            options[
                                optionKey
                            ];
                    }
                }

                acceptedOptions
                    .riskAccepted =
                    true;

                var started =
                    openOfficialAgarIAP(
                        purchaseId,
                        acceptedOptions
                    );

                if (
                    started &&
                    window.toastr
                ) {
                    toastr.info(
                        '<b>[SHOP]:</b> Agar.io payment request started. Waiting for Xsolla...'
                    );
                }
            }
        );

        return false;
    }

    console.log(
        '[SHOP] User accepted BETA purchase risk:',
        {
            purchaseId:
                purchaseId,

            currency:
                currency
        }
    );

    /*
     * Current catalogue products must go through Agar.io's own purchase API.
     * It uses the payment model already configured by the live production
     * environment.
     */
    if (
        window.agarApp &&
        window.agarApp.API &&
        typeof window.agarApp.API
            .makePurchase ===
            'function'
    ) {
        try {
            var officialPurchaseResult =
                window.agarApp.API
                    .makePurchase(
                        purchaseId,
                        true,
                        true
                    );

            if (
                officialPurchaseResult !==
                false
            ) {
                console.log(
                    '[SHOP] Purchase accepted by official Agar.io API:',
                    {
                        purchaseId:
                            purchaseId
                    }
                );

                return true;
            }

            console.warn(
                '[SHOP] Product was not accepted by the current Agar.io catalogue; trying production payment fallback:',
                {
                    purchaseId:
                        purchaseId
                }
            );
        } catch (
            officialPurchaseError
        ) {
            console.warn(
                '[SHOP] Official Agar.io API could not open this purchase; trying production payment fallback:',
                officialPurchaseError
            );
        }
    }

    /*
     * This fallback is only for historical IDs not recognized by the current
     * catalogue. It now uses the production payment origin, never payments-dev.
     */
    console.log(
        '[SHOP] Requesting production Agar.io Xsolla session:',
        {
            purchaseId:
                purchaseId,

            currency:
                currency,

            endpoint:
                paymentService
                    .payment_endpoint
        }
    );

    try {
        return paymentService
            .buyProduct(
                xsollaToken,
                purchaseId,
                currency
            ) === true;
    } catch (
        paymentError
    ) {
        console.error(
            '[SHOP] Agar.io payment request failed:',
            paymentError
        );

        if (window.toastr) {
            toastr.error(
                '<b>[SHOP]:</b> Agar.io could not create this payment session.'
            );
        }

        return false;
    }
}

window.openOfficialAgarIAP =
    openOfficialAgarIAP;

/**
 * Start an IAP purchase. openOfficialAgarIAP enforces the mandatory BETA
 * agreement itself, so no caller can bypass the warning accidentally.
 */
function buyDealIAP(
    dealId,
    dealDesc
) {
    if (
        typeof window
            .validateShopIntegrity ===
            'function' &&
        !window
            .validateShopIntegrity(
                'buy deal'
            )
    ) {
        return false;
    }

    return openOfficialAgarIAP(
        dealId,
        {
            description:
                dealDesc ||
                dealId
        }
    );
}

window.buyDealIAP =
    buyDealIAP;

/**
 * Buy a deal via soft purchase (DNA/Coins) — opcode 70
 * Response comes on opcode 71 — ogario.v4.js case 71 calls refreshSkinGrid() & shows toastr.
 */
function buyDealSoft(purchaseId, cost, currencyType) {
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('buy deal')) {
        return;
    }
    if (!window.application || !window.application.softPurchase) {
        toastr && toastr.error('<b>[SHOP]:</b> Protocol not ready. Join a game session first!');
        return;
    }

    var title = purchaseId.replace(/com\.miniclip\.agar\.io\./g, '').replace(/_/g, ' ');
    var currLabel = (currencyType || '').indexOf('dna') !== -1 ? '🧬 DNA' : '💰 Coins';
    var priceText = cost.toLocaleString() + ' ' + currLabel;

    _showDealBuyConfirmationModal(title, priceText, function() {
        // Disable all deal Buy buttons to prevent double-clicks
        var allBtns = document.querySelectorAll('#dealsGrid .btn');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].disabled = true;
            allBtns[i].style.opacity = '0.5';
            allBtns[i].style.pointerEvents = 'none';
        }

        toastr.info('<b>[SHOP]:</b> Sending purchase request...');
        window.application.softPurchase(purchaseId);

        window._dealSoftTimeout = setTimeout(function() {
            var btns = document.querySelectorAll('#dealsGrid .btn');
            for (var j = 0; j < btns.length; j++) {
                btns[j].disabled = false;
                btns[j].style.opacity = '1';
                btns[j].style.pointerEvents = 'auto';
            }
            updateDealsBalance();
        }, 10000);
    });
}
window.buyDealSoft = buyDealSoft;

/**
 * Buy a deal via offer bundle — opcode 77 (Offer_bundle_request)
 * Used for bundles with type "OFFER" in the official client.
 * Response comes on opcode 78 — ogario.v4.js case 78.
 */
function buyDealBundle(bundleId, dealDesc) {
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('purchase deal bundle')) {
        return;
    }

    var gameConfig = window.GameConfiguration && window.GameConfiguration.gameConfig;
    var configuredIaps = gameConfig ? (gameConfig['Wallet - In-App Purchases'] || []) : [];

    /*
     * Some historical configurations expose the same bundle through visual
     * metadata and an IAP entry. In that case, use the IAP purchase ID and
     * the archived payment route — not opcode 77.
     */
    for (var iapIndex = 0; iapIndex < configuredIaps.length; iapIndex++) {
        var historicalIap = configuredIaps[iapIndex];
        if (historicalIap && String(historicalIap.bundleId) === String(bundleId)) {
            return window.buyDealIAP(historicalIap.id, dealDesc || historicalIap.bundleId);
        }
    }

    var offerableBundles = gameConfig ? (gameConfig['Wallet - Offerable Bundles'] || []) : [];
    var isOfferable = offerableBundles.some(function(item) {
        return item && String(item.bundleId) === String(bundleId);
    });

    if (!isOfferable) {
        if (window.toastr) toastr.error('<b>[SHOP]:</b> This bundle is neither an IAP nor an offerable bundle in the selected configuration.');
        return false;
    }

    if (!(window.core && window.core.proxyMobileData) || !window.application || !window.application.sendProto) {
        toastr && toastr.error('<b>[SHOP]:</b> Protocol not ready. Join a game session first!');
        return;
    }

    _showDealBuyConfirmationModal(dealDesc || bundleId, 'Offerable Bundle', function() {
        var allBtns = document.querySelectorAll('#dealsGrid .btn');
        for (var bi = 0; bi < allBtns.length; bi++) {
            allBtns[bi].disabled = true;
            allBtns[bi].style.opacity = '0.5';
            allBtns[bi].style.pointerEvents = 'none';
        }

        try {
            /*
             * The official dispatcher resolves this as type OFFER and sends
             * Offer_bundle_request, opcode 77. No purchase URL is involved.
             */
            window.application.sendProto(77, { offerBundleRequestField: { bundleId: bundleId } });
            toastr.info('<b>[SHOP]:</b> Bundle purchase request sent...');
            console.log('[SHOP] Sent offer bundle request for ' + bundleId);
        } catch (error) {
            console.error('[SHOP] Official offer purchase failed:', error);
            toastr && toastr.error('<b>[SHOP]:</b> Could not send the bundle purchase request');
            for (var ri = 0; ri < allBtns.length; ri++) {
                allBtns[ri].disabled = false;
                allBtns[ri].style.opacity = '1';
                allBtns[ri].style.pointerEvents = 'auto';
            }
            return;
        }

        window._dealBundleTimeout = setTimeout(function() {
            var btns = document.querySelectorAll('#dealsGrid .btn');
            for (var k = 0; k < btns.length; k++) {
                btns[k].disabled = false;
                btns[k].style.opacity = '1';
                btns[k].style.pointerEvents = 'auto';
            }
            updateDealsBalance();
        }, 10000);
    });
}
window.buyDealBundle = buyDealBundle;

/**
 * Activate a boost — opcode 112 (Activate_boost_request)
 * Response comes on opcode 113 — ogario.v4.js case 113.
 */
function activateBoost(productId) {
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('activate boost')) {
        return;
    }
    if (!(window.core && window.core.proxyMobileData) || !window.application || !window.application.activateBoost) {
        toastr && toastr.error('<b>[SHOP]:</b> Protocol not ready. Join a game session first!');
        return;
    }
    var displayName = productId.replace(/_/g, ' ');

    _showDealBuyConfirmationModal('Activate ' + displayName, null, function() {
        // Disable all deal buttons to prevent double-clicks
        var allBtns = document.querySelectorAll('#dealsGrid .btn');
        for (var bi = 0; bi < allBtns.length; bi++) {
            allBtns[bi].disabled = true;
            allBtns[bi].style.opacity = '0.5';
            allBtns[bi].style.pointerEvents = 'none';
        }

        var sent = window.application.activateBoost(productId);
        if (!sent) {
            toastr.error('<b>[SHOP]:</b> Failed to activate boost');
            var btns3 = document.querySelectorAll('#dealsGrid .btn');
            for (var j2 = 0; j2 < btns3.length; j2++) { btns3[j2].disabled = false; btns3[j2].style.opacity = '1'; btns3[j2].style.pointerEvents = 'auto'; }
            return;
        }

        window._boostTimeout = setTimeout(function() {
            var btns = document.querySelectorAll('#dealsGrid .btn');
            for (var k = 0; k < btns.length; k++) {
                btns[k].disabled = false;
                btns[k].style.opacity = '1';
                btns[k].style.pointerEvents = 'auto';
            }
            updateDealsBalance();
        }, 10000);
    });
}
window.activateBoost = activateBoost;


var skinShopPage = 0;
var skinShopPerPage = 60;
var skinShopFiltered = [];
var skinShopLoadedPages = 1;

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
    if (!s || !s.productId) return false;
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

var _populateSkinsRetries = 0;
function populateSkins() {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig || !window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"]) {
        if (_populateSkinsRetries++ < 6) {
            setTimeout(populateSkins, 500);
        } else {
            console.warn('[Shop] populateSkins gave up after 6 retries — config never arrived');
        }
        return;
    }
    _populateSkinsRetries = 0; // reset for next open
    window._skinPriceCache = null; // force price cache rebuild from fresh config

    var skins =
        window.GameConfiguration.gameConfig[
            "Gameplay - Equippable Skins"
        ];

    var currentFilter = 'all';

    /*
     * Rebuild the real filtered skin array independently from rendering.
     * Load More calls this too, so it cannot operate on an empty/stale
     * global skinShopFiltered cache.
     */
    function rebuildSkinShopFiltered() {
        var activeFilter =
            $('.skin-filter-btn.active')
                .attr('data-filter');

        if (
            activeFilter === 'all' ||
            activeFilter === 'owned'
        ) {
            currentFilter = activeFilter;
        }

        var searchEl = $('#skinSearchBar');
        var query =
            searchEl.length && searchEl.val()
                ? String(searchEl.val()).toLowerCase().trim()
                : '';

        var ownedSkinsObj = getOwnedSkinsMap();

        skinShopFiltered = skins.filter(function(skin) {
            if (!skin || !skin.productId || skin.productId === 'skin_empty') return false;
            if (currentFilter === 'owned' && !isSkinOwned(skin, ownedSkinsObj)) return false;
            if (query !== '') {
                var name = (skin.displayName || skin.productId.replace('skin_', '').replace(/_/g, ' ')).toLowerCase();
                var productId = skin.productId.toLowerCase();
                if (name.indexOf(query) === -1 && productId.indexOf(query) === -1) return false;
            }
            return true;
        });

        skinShopFiltered.sort(function(a, b) {
            var aOwned = isSkinOwned(a, ownedSkinsObj) ? 1 : 0;
            var bOwned = isSkinOwned(b, ownedSkinsObj) ? 1 : 0;
            if (bOwned !== aOwned) return bOwned - aOwned;
            return 0;
        });

        return skinShopFiltered;
    }

    function applySkinFilters(resetPagination) {
        if (resetPagination !== false) {
            skinShopLoadedPages = 1;
        }

        rebuildSkinShopFiltered();

        var grid = document.getElementById('skinGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (currentFilter === 'owned' && skinShopFiltered.length === 0) {
            grid.innerHTML =
                '<div style="grid-column:1/-1;text-align:center;padding:30px;color:' +
                getShopTheme().tc2 + ';font-size:13px;">' +
                'No owned skins detected on this session.<br>' +
                '<span style="font-size:11px;color:' + getShopTheme().tc2 +
                ';">Log in with Google/Facebook or switch to <b>All Skins</b> to equip any skin.</span></div>';
            $('#skinCount').text(0);
            $('#skinTotal').text(0);
            $('#skinLoadMore').hide();
            return;
        }

        renderSkinPage(false);
    }

    // Filter button handler
    $('.skin-filter-btn').off('click').on('click', function() {
        var _ds = window.defaultSettings || {};
        $('.skin-filter-btn').removeClass('active').css({ background: 'rgba(255,255,255,0.1)', color: _ds.menuTextColor2 || '#8096a7', border: '1px solid ' + (_ds.menuPanelColor2 || '#002f52') });
        $(this).addClass('active').css({ background: _ds.btn1Color || '#018cf6', color: _ds.menuBtnTextColor || '#ffffff', border: 'none' });
        currentFilter = $(this).data('filter');
        applySkinFilters(true);
    });

    // Search handler — debounce filtering, sorting and DOM rebuilding
    $('#skinSearchBar')
        .off('input.skinShop')
        .on(
            'input.skinShop',
            function() {
                if (window._skinSearchTimer) {
                    clearTimeout(
                        window._skinSearchTimer
                    );
                }

                window._skinSearchTimer =
                    setTimeout(function() {
                        window._skinSearchTimer =
                            null;

                        applySkinFilters(true);
                    }, 140);
            }
        );

    // Load more handler
    $('#skinLoadMore')
        .off('click.skinShop')
        .on('click.skinShop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            var button = this;
            button.disabled = false;
            button.removeAttribute('disabled');
            button.setAttribute('aria-disabled', 'false');

            /*
             * Critical: reconstruct the filtered list from GameConfiguration
             * before pagination. Without this, the stale/empty cache causes
             * updatePaginationUI to hide the button.
             */
            rebuildSkinShopFiltered();

            var grid = document.getElementById('skinGrid');
            if (!grid) return false;

            var renderedCount = grid.querySelectorAll('.skin-card').length;

            if (skinShopFiltered.length === 0) {
                updatePaginationUI();
                return false;
            }

            if (renderedCount === 0) {
                skinShopLoadedPages = 1;
                renderSkinPage(false);
            } else {
                renderSkinPage(true);
            }

            updatePaginationUI();

            return false;
        });

    applySkinFilters(true);
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
    window._skinShopRefresh =
        function() {
            applySkinFilters(false);
        };

    window._skinShopBuilt = true;
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
            toastr && toastr.error('<b>[ERROR]:</b> Failed to encode delete request');
            cardBtn.prop('disabled', false).css({ opacity: 1, pointerEvents: 'auto' }).text('Delete');
            return;
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
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('equip skins')) {
        return;
    }

    var cdnBase = window.LM_CDN_BASE();
    localStorage.setItem('equippedSkinId', productId);
    if (imageName) localStorage.setItem('equippedSkinImage', imageName);

    // Update server tracking so updateEquippedSkinUI stays in sync
    window.serverEquippedSkinId = productId;

    // ─── Send opcode 80 via window.changeSkin() ───
    if (typeof window.changeSkin === 'function') {
        try {
            window.changeSkin(productId);
        } catch (e) {
            console.warn('[SKIN] changeSkin call exception:', e);
        }
    }

    if (window.ogario && imageName) {
        window.ogario.customSkinUrl =
            resolveSkinAssetUrl(
                productId,
                imageName
            );
    }

    var displayName = productId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    console.log('[SKIN]: Equipped ' + displayName);

    updateEquippedSkinUI();
}

function unequipSkin() {
    if (typeof window.validateShopIntegrity === 'function' && !window.validateShopIntegrity('unequip skins')) {
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
    var cdnBase = window.LM_CDN_BASE();

    var bannerName = $('#activeSkinName');
    var bannerImg = $('#activeSkinImg');
    var unequipBtn = $('#unequipSkinBtn');

    if (equippedId && equippedId !== 'skin_empty' && equippedId !== '') {
        var displayName = equippedId.indexOf('skin_custom_') === 0
            ? 'Custom Skin'
            : equippedId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        bannerName.text(displayName);

        // Look up skin data from GameConfiguration for image and cell color
        var skinData = findSkinInConfig(equippedId);
        var imgSrc = '';
        var cellColor = '';

        if (skinData) {
            imgSrc =
                resolveSkinAssetUrl(
                    equippedId,
                    skinData.image
                );

            if (skinData.cellColor) {
                cellColor =
                    skinData.cellColor;
            }
        } else if (
            equippedId.indexOf(
                'skin_custom_'
            ) === 0
        ) {
            imgSrc =
                resolveSkinAssetUrl(
                    equippedId,
                    equippedId + '.png'
                );
        }

        if (!imgSrc && equippedImg) {
            imgSrc =
                resolveSkinAssetUrl(
                    equippedId,
                    equippedImg
                );
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

    // Don't let stale server data overwrite a recent user equip
    var recentEquipAge = (window._lmSkinEquipTime) ? (Date.now() - window._lmSkinEquipTime) : Infinity;
    if (window._lmSkinEquipId && recentEquipAge < 10000) {
        // We recently sent an equip — skip server sync to avoid race condition
        return;
    }

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
    if (!productId) return null;
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig) return null;

    var cleanId = productId.replace(/^(shop_skin_|skin_)/, '');

    // Build the lookup caches on first call
    if (!window._skinPriceCache) {
        window._skinPriceCache = {};

        var shopSkins = window.GameConfiguration.gameConfig["Shop - Skins"] || [];
        var softPurchases = window.GameConfiguration.gameConfig["Wallet - Soft Purchases"] || [];

        // Index soft purchases by all possible purchaseId variations
        var purchaseMap = {};
        for (var p = 0; p < softPurchases.length; p++) {
            var sp = softPurchases[p];
            if (!sp) continue;
            var pKeys = [sp.purchaseId, sp.id, sp.productId].filter(Boolean);
            for (var k = 0; k < pKeys.length; k++) {
                var pk = String(pKeys[k]);
                purchaseMap[pk] = sp;
                purchaseMap[pk.toLowerCase()] = sp;
            }
        }

        // Map skin productId AND productIdToQuantify → price info
        for (var s = 0; s < shopSkins.length; s++) {
            var shopSkin = shopSkins[s];
            if (!shopSkin) continue;
            var pid = shopSkin.productId || '';
            var gameplayPid = shopSkin.productIdToQuantify || '';
            var refVal = shopSkin.referenceValue || '';
            var skinType = shopSkin.type || '';

            var purchase = purchaseMap[refVal] || purchaseMap[refVal.toLowerCase()] ||
                            purchaseMap[pid] || purchaseMap[gameplayPid];

            var priceEntry = null;

            if (skinType === 'REWARD') {
                priceEntry = { amount: 0, currency: 'free', type: 'REWARD' };
            } else if (purchase) {
                priceEntry = {
                    amount: purchase.currencyAmount || 0,
                    currency: (purchase.currencyProductId === 'dna' || purchase.currency === 'dna') ? 'dna' : 'coin',
                    type: 'SOFT'
                };
            } else if (skinType === 'SOFT' && refVal) {
                // Soft purchase with referenceValue
                priceEntry = { amount: 90, currency: 'coin', type: 'SOFT' };
            } else if (skinType === 'INAPP') {
                priceEntry = { amount: 0, currency: 'real', type: 'INAPP' };
            }

            if (priceEntry) {
                var keysToStore = [
                    pid, pid.toLowerCase(),
                    gameplayPid, gameplayPid.toLowerCase(),
                    pid.replace(/^shop_skin_/, 'skin_'),
                    pid.replace(/^shop_skin_/, ''),
                    gameplayPid.replace(/^skin_/, '')
                ].filter(Boolean);

                for (var iKey = 0; iKey < keysToStore.length; iKey++) {
                    window._skinPriceCache[keysToStore[iKey]] = priceEntry;
                }
            }
        }
    }

    return window._skinPriceCache[productId] ||
           window._skinPriceCache[productId.toLowerCase()] ||
           window._skinPriceCache['skin_' + cleanId] ||
           window._skinPriceCache[cleanId] ||
           null;
}
window.getSkinPrice = getSkinPrice;

/**
 * Resolve a skin asset URL correctly:
 * - Custom skins (skin_custom_*) → LM_CUSTOM_SKINS_CDN (not versioned cdnBase)
 * - Standard skins → LM_CDN_BASE() + image
 * - Already absolute URLs → pass through
 * This prevents CORB errors from requesting custom skin PNGs through
 * the versioned configuration directory.
 */
function resolveSkinAssetUrl(productId, imageName) {
    var id =
        typeof productId === 'string'
            ? productId.trim()
            : '';

    var image =
        typeof imageName === 'string'
            ? imageName.trim()
            : '';

    var isCustomSkin =
        id.indexOf('skin_custom_') === 0 ||
        image.indexOf('skin_custom_') !== -1;

    if (isCustomSkin) {
        var fileName = image
            ? image.split('/').pop().replace(/\?.*$/, '')
            : '';

        if (!fileName || fileName === 'uses_spine') {
            fileName = id;
        }

        if (!/\.(?:png|jpe?g|webp)$/i.test(fileName)) {
            fileName += '.png';
        }

        return (
            window.LM_CUSTOM_SKINS_CDN +
            '/' +
            fileName
        );
    }

    if (!image || image === 'uses_spine') {
        return '';
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    return (
        window.LM_CDN_BASE() +
        image.replace(/^\/+/, '')
    );
}

window.resolveSkinAssetUrl =
    resolveSkinAssetUrl;

function loadSkinShopImage(image) {
    if (!image) return;

    var source =
        image.getAttribute(
            'data-src'
        );

    if (!source) return;

    image.removeAttribute(
        'data-src'
    );

    image.src = source;
}

function observeSkinShopImages(grid) {
    if (!grid) return;

    if (
        window._skinShopImageObserver &&
        typeof window._skinShopImageObserver
            .disconnect === 'function'
    ) {
        window._skinShopImageObserver
            .disconnect();
    }

    var pendingImages =
        grid.querySelectorAll(
            'img[data-src]'
        );

    if (
        !('IntersectionObserver' in window)
    ) {
        for (
            var fallbackIndex = 0;
            fallbackIndex <
                pendingImages.length;
            fallbackIndex++
        ) {
            loadSkinShopImage(
                pendingImages[
                    fallbackIndex
                ]
            );
        }

        window._skinShopImageObserver =
            null;

        return;
    }

    window._skinShopImageObserver =
        new IntersectionObserver(
            function(entries, observer) {
                for (
                    var entryIndex = 0;
                    entryIndex <
                        entries.length;
                    entryIndex++
                ) {
                    var entry =
                        entries[entryIndex];

                    if (
                        entry.isIntersecting ||
                        entry.intersectionRatio > 0
                    ) {
                        observer.unobserve(
                            entry.target
                        );

                        loadSkinShopImage(
                            entry.target
                        );
                    }
                }
            },
            {
                root: grid,
                rootMargin:
                    '180px 0px',
                threshold: 0.01
            }
        );

    for (
        var imageIndex = 0;
        imageIndex <
            pendingImages.length;
        imageIndex++
    ) {
        window._skinShopImageObserver
            .observe(
                pendingImages[
                    imageIndex
                ]
            );
    }
}

window.resumeSkinGridImages =
    function resumeSkinGridImages() {
        observeSkinShopImages(
            document.getElementById(
                'skinGrid'
            )
        );
    };

function updatePaginationUI() {
    var grid = document.getElementById('skinGrid');
    var total = skinShopFiltered ? skinShopFiltered.length : 0;
    var renderedCount = grid
        ? grid.querySelectorAll('.skin-card').length
        : Math.min(skinShopLoadedPages * skinShopPerPage, total);
    $('#skinCount').text(renderedCount);
    $('#skinTotal').text(total);

    var loadMoreButton = $('#skinLoadMore');

    console.log('[SKIN SHOP] updatePaginationUI: rendered=' + renderedCount + ' total=' + total + ' buttonLength=' + loadMoreButton.length);

    if (renderedCount < total) {
        loadMoreButton
            .prop('disabled', false)
            .removeAttr('disabled')
            .attr('aria-disabled', 'false')
            .css('display', 'block')
            .show()
            .text(
                'Load More Skins (' +
                (total - renderedCount) +
                ' remaining)'
            );
    } else {
        loadMoreButton.hide();
    }
}

function renderSkinPage(appendNextPage) {
    var grid = document.getElementById('skinGrid');
    if (!grid) return;

    if (!skinShopFiltered) skinShopFiltered = [];
    if (!skinShopLoadedPages || skinShopLoadedPages < 1) skinShopLoadedPages = 1;

    var start = 0;
    var end = 0;

    if (appendNextPage === true) {
        start = grid.querySelectorAll('.skin-card').length;
        if (start >= skinShopFiltered.length) {
            updatePaginationUI();
            return;
        }
        end = Math.min(start + skinShopPerPage, skinShopFiltered.length);
        skinShopLoadedPages = Math.ceil(end / skinShopPerPage);
    } else {
        grid.innerHTML = '';
        start = 0;
        end = Math.min(skinShopLoadedPages * skinShopPerPage, skinShopFiltered.length);
    }

    var cdnBase = window.LM_CDN_BASE();
    var currentEquippedId = localStorage.getItem('equippedSkinId');
    var ownedSkinsObj = (window.application && window.application.user && window.application.user.skins) || {};

    for (var i = start; i < end; i++) {
        var skin = skinShopFiltered[i];
        if (!skin || !skin.productId) continue;
        var name = skin.productId.indexOf('skin_custom_') === 0
            ? 'custom skin'
            : skin.productId.replace('skin_', '').replace(/_/g, ' ');
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
        var imgUrl =
            resolveSkinAssetUrl(
                skin.productId,
                imgFile
            );

        var isEquipped = (currentEquippedId === skin.productId);
        var isOwned = isEquipped || isSkinOwned(skin, ownedSkinsObj);

        var card = document.createElement('div');
        card.className = 'skin-card' + (isEquipped ? ' equipped' : (isOwned ? ' owned-card' : ''));
        card.setAttribute('data-product-id', skin.productId);
        card.setAttribute('data-gameplay-id', skin.gameplayId);
        card.setAttribute('data-image', imgFile);

        // Top-left badge: show "Equipped", "Owned", or the real price tag (Coins/DNA/Free)
        var priceInfo = getSkinPrice(skin.productId);
        var skinType = skin.type || '';
        var topBadgeHtml = '';

        if (isEquipped) {
            topBadgeHtml = '<div class="equipped-badge">&#x2714; Equipped</div>';
        } else if (isOwned) {
            topBadgeHtml = '<div class="owned-badge">&#x2B50; Owned</div>';
        } else if (skinType === 'REWARD' || (priceInfo && priceInfo.amount === 0)) {
            topBadgeHtml = '<div class="owned-badge" style="background: rgba(46,125,50,0.9); color: #fff;">Free</div>';
        } else if (priceInfo && priceInfo.amount > 0) {
            if (priceInfo.currency === 'dna') {
                topBadgeHtml = '<div class="owned-badge" style="background: rgba(150,0,220,0.9); color: #fff;">&#x1F9EC; ' + priceInfo.amount.toLocaleString() + '</div>';
            } else {
                topBadgeHtml = '<div class="owned-badge" style="background: rgba(210,140,0,0.9); color: #fff;">&#x1FA99; ' + priceInfo.amount.toLocaleString() + '</div>';
            }
        }

        var actionBtnHtml;
        if (isOwned) {
            actionBtnHtml = '<button class="skin-btn-equip" onclick="equipSkin(\'' + skin.productId + '\', \'' + imgFile + '\');event.stopPropagation();">' + (isEquipped ? 'Equipped' : 'Equip') + '</button>';
            // Add Delete button for custom skins
            if (skin.productId && skin.productId.indexOf('skin_custom_') === 0) {
                actionBtnHtml += '<button class="skin-btn-buy" onclick="deleteCustomSkin(\'' + skin.productId + '\');event.stopPropagation();" style="flex: 0.6; background: ' + getShopTheme().b4 + ' !important; font-size: 9px;">Delete</button>';
            }
        } else {
            // Buy button with price label
            var btnLabel = 'Buy';
            if (skinType === 'REWARD' || (priceInfo && priceInfo.amount === 0)) {
                btnLabel = 'Get Free';
            } else if (priceInfo && priceInfo.amount > 0) {
                var coinIcon = priceInfo.currency === 'dna' ? '&#x1F9EC;' : '&#x1FA99;';
                btnLabel = priceInfo.amount.toLocaleString() + ' ' + coinIcon;
            }
            actionBtnHtml = '<button class="skin-btn-buy" onclick="buySkin(\'' + skin.productId + '\');event.stopPropagation();">' + btnLabel + '</button>';
        }

        // Build image HTML with cell color circle behind it (like agar.io)
        var imgHtml = imgUrl
            ? '<img data-src="' + imgUrl + '" alt="' + displayName + '" loading="lazy" decoding="async" fetchpriority="low" onerror="this.removeAttribute(\'data-src\');this.style.opacity=\'0\';">'
            : '';

        card.innerHTML = topBadgeHtml +
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

    observeSkinShopImages(grid);
    updatePaginationUI();
    updateEquippedSkinUI();

    if (
        typeof window.updateShopLoginState ===
        'function'
    ) {
        window.updateShopLoginState();
    }
}

function buySkin(productId) {
    if (!window.loggedIn) {
        toastr && toastr.error('<b>[SHOP]:</b> You must be logged in to buy skins');
        return;
    }
    if (!window.agarioEncodedUID) {
        toastr && toastr.error('<b>[SHOP]:</b> No payment UID. Log out and log in again.');
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

    // Resolve skin image for the confirmation modal
    var cdnBase = window.LM_CDN_BASE ? window.LM_CDN_BASE() : 'https://jimboy3000.github.io/vanillaskins/';
    var skinData = findSkinInConfig(productId);
    var skinImgUrl = '';
    if (skinData) {
        var imgF = skinData.image;
        if (imgF === 'uses_spine' && window.SpineSkinMap && window.SpineSkinMap[productId]) {
            imgF = window.SpineSkinMap[productId] + '.png';
        }
        if (imgF && imgF !== 'uses_spine') skinImgUrl = cdnBase + imgF;
    }
    if (!skinImgUrl) skinImgUrl = 'https://jimboy3100.github.io/banners/icondeal2.png';

    // Cell color for visual ring
    var cellColor = (skinData && skinData.cellColor) || '0x88888800';
    var hexC = cellColor.replace('0x', '');
    while (hexC.length < 6) hexC = '0' + hexC;
    var rC = parseInt(hexC.substring(0, 2), 16);
    var gC = parseInt(hexC.substring(2, 4), 16);
    var bC = parseInt(hexC.substring(4, 6), 16);
    var ringColor = 'rgb(' + rC + ',' + gC + ',' + bC + ')';

    // Price info
    var costHtml = '<div style="color: ' + (getShopTheme().mc) + '; font-weight: 800; font-size: 16px;">Price unavailable</div>';
    var balanceWarning = '';
    if (priceInfo && priceInfo.amount > 0) {
        var currencyIcon = priceInfo.currency === 'dna' ? '🧬' : '💰';
        var currencyLabel = priceInfo.currency === 'dna' ? 'DNA' : 'Coins';
        var currentBalance = 0;
        if (window.application && window.application.user) {
            currentBalance = priceInfo.currency === 'dna' ? (window.application.user.dna || 0) : (window.application.user.coins || 0);
        }
        costHtml = '<div style="font-size: 22px; font-weight: 900; color: ' + (getShopTheme().tc) + ';">' + priceInfo.amount.toLocaleString() + ' <span style="font-size: 18px;">' + currencyIcon + '</span></div>' +
            '<div style="font-size: 11px; color: ' + (getShopTheme().tc2) + '; margin-top: 2px;">Your ' + currencyLabel + ': ' + currentBalance.toLocaleString() + '</div>';
        if (currentBalance < priceInfo.amount) {
            balanceWarning = '<div style="color: #ff9800; font-size: 12px; font-weight: 700; margin-top: 8px; padding: 6px 12px; border-radius: 6px; background: rgba(255,152,0,0.12); border: 1px solid rgba(255,152,0,0.3);">⚠️ You may not have enough ' + currencyLabel + '!</div>';
        }
    } else if (priceInfo && priceInfo.type === 'REWARD') {
        costHtml = '<div style="color: #4caf50; font-weight: 800; font-size: 18px;">Free (Level Reward)</div>';
    }

    // Remove old confirm modal if any
    var old = document.getElementById('skin-confirm-modal');
    if (old) old.remove();

    var t = getShopTheme();
    var modal = document.createElement('div');
    modal.id = 'skin-confirm-modal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 2000000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); animation: lm-fade-in 0.15s ease; pointer-events: auto;';
    modal.innerHTML =
        '<div style="background: ' + t.pc + '; border: 2px solid ' + t.mc + '; border-radius: 14px; width: 340px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); overflow: hidden; font-family: \'Roboto Condensed\', sans-serif;">' +
            '<div style="background: ' + t.pc2 + '; padding: 14px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
                '<div style="font-size: 16px; font-weight: 900; color: ' + t.mc + '; text-transform: uppercase; letter-spacing: 1px;">Confirm Purchase</div>' +
            '</div>' +
            '<div style="padding: 20px; text-align: center;">' +
                '<div style="width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 12px; background: ' + ringColor + '; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ' + ringColor + '40; border: 3px solid rgba(255,255,255,0.15);">' +
                    '<img src="' + skinImgUrl + '" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover;" onerror="this.style.opacity=\'0\';">' +
                '</div>' +
                '<div style="font-size: 15px; font-weight: 800; color: ' + t.tc + '; margin-bottom: 14px;">' + displayName + '</div>' +
                '<div style="padding: 10px 16px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); margin-bottom: 8px;">' +
                    costHtml +
                '</div>' +
                balanceWarning +
            '</div>' +
            '<div style="display: flex; gap: 10px; padding: 12px 20px; background: ' + t.pc2 + '; border-top: 1px solid rgba(255,255,255,0.1);">' +
                '<button id="skin-confirm-cancel" type="button" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; background: rgba(255,255,255,0.08); color: ' + t.tc + '; border: 1px solid rgba(255,255,255,0.15); transition: all 0.15s;">Cancel</button>' +
                '<button id="skin-confirm-buy" type="button" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; background: ' + t.b1 + '; color: ' + t.btc + '; border: none; transition: all 0.15s;">Buy Now</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    function doSkinConfirm(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        modal.remove();
        _executeSkinPurchase(productId, purchaseId, displayName);
    }

    function doSkinCancel(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        modal.remove();
    }

    modal.addEventListener('click', function(e) { if (e.target === modal) doSkinCancel(e); });
    var sCancel = document.getElementById('skin-confirm-cancel');
    var sBuy = document.getElementById('skin-confirm-buy');
    if (sCancel) {
        sCancel.addEventListener('click', doSkinCancel);
        sCancel.addEventListener('touchstart', doSkinCancel, { passive: false });
    }
    if (sBuy) {
        sBuy.addEventListener('click', doSkinConfirm);
        sBuy.addEventListener('touchstart', doSkinConfirm, { passive: false });
    }
}

/**
 * Execute the actual skin purchase after confirmation.
 * Separated from buySkin() so the confirmation modal can call it async.
 */
function _executeSkinPurchase(productId, purchaseId, displayName) {
    // Store pending purchase so opcode 71 handler can auto-equip
    window._pendingSkinPurchaseId = productId;

    // Resolve valid purchaseId (e.g. "1_skin_pig" / "1_pig") required by opcode 70
    var validPurchaseId = purchaseId || getSkinPurchaseId(productId);
    if (!validPurchaseId) {
        if (productId.startsWith('1_')) {
            validPurchaseId = productId;
        } else if (productId.startsWith('skin_')) {
            validPurchaseId = '1_' + productId;
        } else {
            validPurchaseId = '1_skin_' + productId;
        }
    }

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
                var ci = pi.currency === 'dna' ? '🧬' : '💰';
                label = pi.amount.toLocaleString() + ' ' + ci;
            }
            btn.html(label);
        }
        window._pendingSkinPurchaseId = null;
    }, 10000);

    // Try protocol-based soft purchase (DNA/coin buy — opcode 70) with verified purchaseId
    if (window.application && typeof window.application.softPurchase === 'function') {
        console.log('[SHOP]: Sending soft purchase for ' + validPurchaseId + ' (skin: ' + productId + ')');
        var sent = window.application.softPurchase(validPurchaseId);
        if (sent) return;
    }

    // Fallback: real-money purchase via official IPayment service
    console.log('[SHOP]: Opening official payment for ' + productId);
    var started = openOfficialAgarIAP(productId, { description: productId });
    if (!started) {
        toastr && toastr.error('<b>[SHOP]:</b> Could not open the official payment flow for this skin');
    }
}

/**
 * Get the correct purchaseId for a skin from the "Shop - Skins" config.
 * The official client uses referenceValue as the purchaseId for soft purchases (e.g. 1_skin_pig).
 */
function getSkinPurchaseId(productId) {
    if (!productId) return null;
    if (window.GameConfiguration && window.GameConfiguration.gameConfig) {
        var shopSkins = window.GameConfiguration.gameConfig["Shop - Skins"] || [];
        var cleanId = productId.replace(/^(shop_skin_|skin_)/, '');

        for (var i = 0; i < shopSkins.length; i++) {
            var item = shopSkins[i];
            if (!item) continue;
            var pId = item.productId || '';
            var pQuantify = item.productIdToQuantify || '';
            var refVal = item.referenceValue || '';

            if (pId === productId || pQuantify === productId ||
                pId.replace(/^(shop_skin_|skin_)/, '') === cleanId ||
                pQuantify.replace(/^(shop_skin_|skin_)/, '') === cleanId) {
                if (refVal) return refVal;
            }
        }
    }

    // Fallback heuristic matching official Agar.io naming: "1_skin_" + cleanId or "1_" + productId
    if (productId.startsWith('1_')) return productId;
    if (productId.startsWith('skin_')) return '1_' + productId;
    return '1_skin_' + productId;
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
        
		var existingIds = {};
		for (var j = 0; j < window.selectVariable.length; j++) { 
			existingIds[window.selectVariable[j].value] = true;
		}
		for (var ik = 0; ik < GameConfiguration.gameConfig["Wallet - In-App Purchases"].length; ik++) {
			var iapItem = GameConfiguration.gameConfig["Wallet - In-App Purchases"][ik];
			if (!existingIds[iapItem.id]) {
				populateSDlines(select, ik);
			}
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
    function _onConfigReady() {
        window._isLoadingGameConfig =
            false;

        /*
         * Legacy select/config metadata remains available, but do not build
         * both large visual tabs when only one is visible.
         */
        populateSD();

        var activeTab =
            $('#specialShopModal .shop-tab.active')
                .attr('data-tab') ||
            'skins';

        if (activeTab === 'deals') {
            if (!window._dealsShopBuilt) {
                populateDealsGrid();
            }

            updateDealsBalance();
        } else if (
            activeTab === 'skins'
        ) {
            if (!window._skinShopBuilt) {
                populateSkins();
            } else {
                if (
                    typeof window.resumeSkinGridImages ===
                    'function'
                ) {
                    window.resumeSkinGridImages();
                }

                updateEquippedSkinUI();
            }
        } else if (
            activeTab === 'upload'
        ) {
            updateUploadBalance();
        }
    }

    if (
        window.GameConfiguration &&
        window.GameConfiguration.gameConfig
    ) {
        _onConfigReady();
        return;
    }

    if (
        window.master &&
        window.master.GameConfiguration &&
        window.master.GameConfiguration
            .gameConfig
    ) {
        window.GameConfiguration =
            window.master
                .GameConfiguration;

        _onConfigReady();
        return;
    }

    if (
        window.LMGameConfiguration &&
        window.LMGameConfiguration
            .gameConfig
    ) {
        window.GameConfiguration =
            window.LMGameConfiguration;

        _onConfigReady();
        return;
    }

    /*
     * Multiple callers may request configuration while the modal initializes.
     * Maintain one in-flight Promise or fallback request.
     */
    if (window._isLoadingGameConfig) {
        return;
    }

    window._isLoadingGameConfig = true;

    var selectEl =
        document.getElementById(
            "ss-select-purchases"
        );

    if (selectEl) {
        for (
            var selectIndex =
                selectEl.options.length;
            selectIndex-- > 0;
        ) {
            selectEl.options[
                selectIndex
            ] = null;
        }
    }

    $(".xpmt-skins2").css(
        'background-image',
        ''
    );

    $(".xpmt-skins").css(
        'background-image',
        ''
    );

    if (
        window.LMGameConfigurationReady &&
        typeof window
            .LMGameConfigurationReady
            .then === 'function'
    ) {
        window.LMGameConfigurationReady
            .then(function(config) {
                if (
                    config &&
                    config.gameConfig
                ) {
                    window.GameConfiguration =
                        config;

                    _onConfigReady();
                } else {
                    _fetchConfigFallback(
                        _onConfigReady
                    );
                }
            })
            .catch(function(error) {
                console.warn(
                    '[Shop] Shared config promise failed:',
                    error
                );

                _fetchConfigFallback(
                    _onConfigReady
                );
            });

        return;
    }

    _fetchConfigFallback(
        _onConfigReady
    );
}

function _fetchConfigFallback(callback) {
    var targetUrl = window.MiniclipConfigDestination || window.LM_CONFIG_URL();
    $.ajax({
        url: targetUrl,
        type: 'GET',
        timeout: 8000,
        success: function(info) {
            if (typeof info === 'string') {
                try { window.GameConfiguration = JSON.parse(info); } catch(e) { window.GameConfiguration = info; }
            } else {
                window.GameConfiguration = info;
            }
            callback();
        },
        error: function(err) {
            window._isLoadingGameConfig = false;
            console.warn('[Shop] Config fetch failed:', err);
        }
    });
}

function populateLibConfig() {
    var x = document.getElementById("ss-select-agarVersionDestinations");
    if (!window.agarversionDestinations || !x) return;
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

