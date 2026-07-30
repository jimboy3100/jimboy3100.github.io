//OLD DEALS
//v2.23

//for agarioUID, agarioID, look at the case 102: on this file https://jimboy3100.github.io/ogario/ogario.v4.js?v=32

/* you will need this
	var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://jimboy3100.github.io/LanguagePackEnglish.js";
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
window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/v15/2230/GameConfiguration.json";
window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/v15/2230/";

if (window.agarversion != null) {
    window.MiniclipConfigDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json";
    window.MiniclipDestination = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion;
}

SpecialDeals();
AgarVersionDestinations();

function SpecialDeals() {

    // Remove any existing modal + backdrop first (prevents duplicates from re-loading the script)
    $('#specialShopModal').remove();

    // Auto-restore encoded UID from memory/localStorage
    if (!window.agarioEncodedUID) {
        window.agarioEncodedUID = localStorage.getItem("agarioEncodedUID") || localStorage.getItem("agarioUID") || "";
    }
    if (window.agarioEncodedUID) {
        localStorage.setItem("agarioEncodedUID", window.agarioEncodedUID);
    }

    // --- Inject skin shop CSS ---
        if (!document.getElementById('skinShopStyles')) {
            var styleEl = document.createElement('style');
            styleEl.id = 'skinShopStyles';
            styleEl.textContent = [
                '#specialShopModal .shop-tabs { display: flex; border-bottom: 2px solid #444; margin: 0 -15px; padding: 0 15px; }',
                '#specialShopModal .shop-tab { flex: 1; text-align: center; padding: 10px 0; cursor: pointer; font-family: "Roboto Condensed", sans-serif; font-size: 14px; font-weight: 700; color: #aaa; border-bottom: 3px solid transparent; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px; }',
                '#specialShopModal .shop-tab:hover { color: #fff; background: rgba(255,255,255,0.05); }',
                '#specialShopModal .shop-tab.active { color: #4fc3f7; border-bottom-color: #4fc3f7; }',
                '#specialShopModal .tab-pane { display: none; }',
                '#specialShopModal .tab-pane.active { display: block; }',
                '.active-skin-banner { display: flex; align-items: center; background: rgba(79, 195, 247, 0.12); border: 1px solid rgba(79, 195, 247, 0.4); border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; }',
                '.active-skin-banner img { width: 44px; height: 44px; border-radius: 50%; margin-right: 12px; border: 2px solid #4fc3f7; object-fit: cover; background: #222; }',
                '.active-skin-banner .info { flex: 1; }',
                '.active-skin-banner .info .title { font-size: 10px; color: #4fc3f7; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }',
                '.active-skin-banner .info .name { font-size: 14px; font-weight: 700; color: #fff; font-family: "Roboto Condensed", sans-serif; }',
                '.active-skin-banner .unequip-btn { background: rgba(255,87,34,0.2); border: 1px solid #ff5722; color: #ff5722; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer; }',
                '.active-skin-banner .unequip-btn:hover { background: #ff5722; color: #fff; }',
                '#skinSearchBar { width: 100%; padding: 8px 12px; margin-bottom: 10px; border: 1px solid #555; border-radius: 4px; background: rgba(0,0,0,0.3); color: #fff; font-size: 14px; outline: none; box-sizing: border-box; }',
                '#skinSearchBar:focus { border-color: #4fc3f7; box-shadow: 0 0 5px rgba(79,195,247,0.3); }',
                '#skinSearchBar::placeholder { color: #888; }',
                '.skin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-height: 320px; overflow-y: auto; padding: 4px; }',
                '.skin-grid::-webkit-scrollbar { width: 6px; }',
                '.skin-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }',
                '.skin-grid::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }',
                '.skin-grid::-webkit-scrollbar-thumb:hover { background: #777; }',
                '.skin-card { position: relative; background: rgba(0,0,0,0.25); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px; text-align: center; cursor: pointer; transition: all 0.2s; overflow: hidden; height: 115px; box-sizing: border-box; }',
                '.skin-card:hover { border-color: #4fc3f7; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79,195,247,0.2); }',
                '.skin-card.equipped { border-color: #00e676 !important; background: rgba(0, 230, 118, 0.12) !important; box-shadow: 0 0 10px rgba(0,230,118,0.3) !important; }',
                '.skin-card .equipped-badge { position: absolute; top: 3px; left: 3px; background: #00e676; color: #000; font-size: 9px; font-weight: 800; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; z-index: 2; }',
                '.skin-card img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; display: block; margin: 2px auto; }',
                '.skin-card .skin-name { font-size: 10px; color: #ccc; font-family: "Roboto Condensed", sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }',
                '.skin-card .skin-color { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 4px; right: 4px; border: 1px solid rgba(255,255,255,0.3); }',
                '.skin-card-actions { position: absolute; bottom: 0; left: 0; right: 0; display: flex; opacity: 0; transition: opacity 0.2s; }',
                '.skin-card:hover .skin-card-actions, .skin-card.equipped .skin-card-actions { opacity: 1; }',
                '.skin-btn-equip { flex: 1; background: #4fc3f7; color: #000; border: none; padding: 4px 0; font-size: 10px; font-weight: 700; font-family: "Roboto Condensed", sans-serif; cursor: pointer; text-transform: uppercase; }',
                '.skin-card.equipped .skin-btn-equip { background: #00e676; color: #000; }',
                '.skin-btn-buy { flex: 1; background: #ffb74d; color: #000; border: none; padding: 4px 0; font-size: 10px; font-weight: 700; font-family: "Roboto Condensed", sans-serif; cursor: pointer; text-transform: uppercase; }',
                '.skin-btn-buy:hover { background: #ffa726; }',
                '.skin-stats { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #888; font-family: "Roboto Condensed", sans-serif; }',
                '.skin-stats span { color: #4fc3f7; font-weight: 700; }',
                '.skin-load-more { width: 100%; padding: 8px; margin-top: 8px; background: rgba(79,195,247,0.15); border: 1px solid rgba(79,195,247,0.3); border-radius: 4px; color: #4fc3f7; font-family: "Roboto Condensed", sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }',
                '.skin-load-more:hover { background: rgba(79,195,247,0.25); }',
            ].join('\n');
            document.head.appendChild(styleEl);
        }

        // --- Build modal HTML with tabs ---
        $('#helloContainer').after(
            '<div class="modal fade in" id="specialShopModal" aria-hidden="false" style="display: block;">' +
            '<div class="modal-backdrop fade in"></div>' +
            '<div class="modal-dialog" style="top: calc(50vh - 280px); width: 560px;">' +
            '<div class="modal-content">' +

            // Header
            '<div id="CloseSpecialDeals2" class="modal-header">' +
            '<button id="CloseSpecialDeals" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">' + Premadeletter113 + '</span></button> ' +
            '<button id="FAQSpecialDeals" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">?</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
            '<h4 class="modal-title" style="font-family: Roboto Condensed, sans-serif; font-weight: 700; color: #4fc3f7;"><i class="fa fa-paint-brush"></i> Agar.io Skins & Deals</h4>' +
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
            '<button class="btn btn-xs skin-filter-btn active" data-filter="all" style="flex: 1; background: #0288d1; color: #fff; font-weight: 700; border: none; padding: 6px 0; border-radius: 4px;">All Skins (955+)</button>' +
            '<button class="btn btn-xs skin-filter-btn" data-filter="owned" style="flex: 1; background: rgba(255,255,255,0.1); color: #aaa; font-weight: 700; border: 1px solid #444; padding: 6px 0; border-radius: 4px;">&#x2B50; My Owned Skins</button>' +
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
            '<h5 style="color: #4fc3f7; font-weight: 700; margin-top: 0;">Upload Custom Skin (90 DNA)</h5>' +
            '<p style="color: #aaa; font-size: 11px; margin-bottom: 12px;">Select an image file. It will be formatted into a 512x512 PNG and submitted directly to Agar.io via Protobuf.</p>' +
            '<div style="display: flex; gap: 8px; margin-bottom: 12px; max-width: 360px; margin-left: auto; margin-right: auto;">' +
            '<input id="legendSkinNameModal" class="form-control" placeholder="Skin Name" style="width: 70%;" maxlength="15">' +
            '<input id="legendSkinColorModal" type="color" value="#FFFF00" style="width: 30%; height: 34px; padding: 2px; border: 1px solid #555; background: #222; border-radius: 4px; cursor: pointer;">' +
            '</div>' +
            '<div style="text-align: center; margin-bottom: 12px;">' +
            '<canvas id="legendCanvasModal" width="512" height="512" style="width: 140px; height: 140px; border-radius: 50%; border: 3px solid #01d9cc; background-color: #000; box-shadow: 0 0 12px rgba(1,217,204,0.3);"></canvas>' +
            '</div>' +
            '<label for="legendUploadInputModal" class="btn btn-primary" style="margin-bottom: 8px; width: 220px; font-weight: 700; background: #0288d1; border: none; cursor: pointer;">&#x1F4C2; Choose Image File</label>' +
            '<input type="file" id="legendUploadInputModal" accept="image/*" style="display:none;" />' +
            '<br>' +
            '<button id="legendSaveBtnModal" class="btn btn-success" disabled style="width: 220px; font-weight: 700;">Upload & Buy (90 DNA)</button>' +
            '<div id="legendStatusModal" style="font-size: 11px; margin-top: 6px; color: #888;">Select an image to process</div>' +
            '</div>' +
            '</div>' +

            // === 3. Deals tab ===
            '<div class="tab-pane" id="tab-deals">' +
            '<div class="modal-body">' +
            '<input type="text" class="form-control" id="agario_uid_input" placeholder="Encoded UID" style="width: 85%; display: inline-block">' +
            '<div class="custom-checkbox" style="display: inline-block; margin-left: 10px; vertical-align: sub;"> Friend Encoded uid <input id="checkBoxLockUID" type="checkbox" disabled="disabled" style="width: 20px; height: 20px"><label for="cb1"></label></div>' +
            '<div class="bs-callout bs-callout-buy bs-callout-clickable" id="buy_starterpack">' +
            '<h4 id="dealtype" class="pull-left">purchase 125000 coins</h4><h5 class="pull-left"> <i> (' + Premadeletter111 + ')</i></h5>' +
            '<h4 id="dealcost" class="text-right">99.99 $</h4>' +
            '<div class="xpmt-buy-content" style="font-size: 13px; margin-top: -30px; float: left;font-weight: 700; background-color: rgba(0, 0, 0, 0.2); background-image: url(https://jimboy3100.github.io/banners/icondeal2.png);padding: 3px; align: middle; border-radius: 4px;width: 100%;height: 150px;z-index: 15;margin: auto;">' +
            '<div class="xpmt-money-stack" style="display: inline-block; margin-left: 70px; margin-top: 115px;"><span class="coins" style=""><b>125000 C</b></span></div>' +
            '<div class="xpmt-skins" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: -120px 310px; background-image: url(\'\'); background-size: cover; border-color: #7c0001"></div>' +
            '<div class="xpmt-skins2" style="width: 110px;height: 110px;background: no-repeat 50% 50%;background-size: 106px;border-radius: 50%; border: 3px solid #708090;margin: 35px 350px; background-image: url(\'\'); background-size: cover; border-color: #7c0001"></div>' +
            '</div>' +
            '</div>' +
            '<select id="ss-select-purchases" class="form-control" required="" style="margin-bottom: 30px"></select>' +
            '<select id="BuyDealCurrency" class="form-control" required="" style="display:inline-block; width: 20%; margin-top: -30px;"><option value="USD" data-itr="">USD</option><option value="EU" data-itr="">EU</option></select>' +
            '<color="red" style="display:inline"> ' + Premadeletter112 + '</color>' +
            '<select id="ss-select-agarVersionDestinations" class="form-control" required="" style="display:inline; width: 25%; margin-top: -30px;"></select>' +
            '<color="red" style="display:inline">' + Premadeletter117 + '</color>' +
            '<input type="text" class="form-control" id="GameConfigurationUrl" value = ' + window.MiniclipConfigDestination + ' placeholder="*Search any GameConfiguration.json destination" style="width: 95%; display: inline-block">' +
            '<p class="alert-warning text-center">' + Premadeletter116 + '<br>Encoded UID:<span class="alert-success" id="exp-uid" style="font-size: 2px;">' + window.agarioEncodedUID + '</span> <font color="red" onclick=copy(window.agarioEncodedUID);><b><u>' + Premadeletter114 + '</u></b></font>.<br>Encoded UID ' + Premadeletter115 + '</p>' +
            '</div>' +
            '</div>' +

            '</div></div></div>'
        );

        $("#agario_uid_input").val(window.agarioEncodedUID);
        LoadGameConfiguration();

        //populateSD();
        $(".modal-dialog").draggable()
        setTimeout(function() {
            populateLibConfig();
        }, 2500);

        // --- Auto-populate Skins tab on open since it is default active ---
        if (window.GameConfiguration && window.GameConfiguration.gameConfig) {
            populateSkins();
        } else {
            setTimeout(populateSkins, 1500);
        }

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
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 512, 512);
                ctx.drawImage(img, 0, 0, 512, 512);

                canvas.toBlob(function(blob) {
                    if (!blob) return;
                    var reader = new FileReader();
                    reader.onload = function() {
                        processedBufferModal = new Uint8Array(reader.result);
                        var kb = (processedBufferModal.length / 1024).toFixed(1);
                        if (processedBufferModal.length > 102400) {
                            $('#legendStatusModal').text("Too Big: " + kb + "KB (Limit 100KB)").css('color', '#ff5252');
                            $('#legendSaveBtnModal').prop('disabled', true).css('opacity', 0.5);
                        } else {
                            $('#legendStatusModal').text("PNG Ready: " + kb + "KB").css('color', '#00e676');
                            $('#legendSaveBtnModal').prop('disabled', false).css({ opacity: 1, cursor: 'pointer' });
                        }
                    };
                    reader.readAsArrayBuffer(blob);
                }, 'image/png');
            };
            img.onerror = function() {
                $('#legendStatusModal').text("Error loading image").css('color', '#ff5252');
            };
            img.src = src;
        }

        $('#legendUploadInputModal').off('change').on('change', function(e) {
            var file = e.target.files && e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    processAndFormatModal(evt.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        $('#legendSaveBtnModal').off('click').on('click', function() {
            var name = $('#legendSkinNameModal').val() || "test";
            var color = $('#legendSkinColorModal').val() || "#FFFF00";
            if (processedBufferModal && window.application && typeof window.application.uploadCustomSkin === 'function') {
                window.application.uploadCustomSkin(processedBufferModal, name, color);
            } else {
                toastr.warning("<b>[SERVER]:</b> Skin processing not ready or play game first.");
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
        $("#CloseSpecialDeals").click(function() {

            $("#specialShopModal").remove();
        });
        $("#FAQSpecialDeals").click(function() {
            window.open('https://jimboy3100.github.io/LMexpress/olddeals.html', '_blank');
        });
        $(".xpmt-buy-content").click(function() {
            buydeals();
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
    $.ajax({
        type: "GET",
        url: "https://payments.agario.miniclippt.com/pay/" + $("#exp-uid").text() + "/" + $("#ss-select-purchases option:selected").val() + "/" + $("#BuyDealCurrency").val(),
        datatype: "json",
        success: function(info) {
            return buytoken = info.iframe_url;
        }
    });
    setTimeout(function() {
        window.open(buytoken, "PopupWindow", "width=600,height=600,scrollbars=yes,resizable=no");
    }, 3000);
}

// --- Skin Shop Functions ---
var skinShopPage = 0;
var skinShopPerPage = 60;
var skinShopFiltered = [];

function populateSkins() {
    if (!window.GameConfiguration || !window.GameConfiguration.gameConfig || !window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"]) {
        setTimeout(populateSkins, 1500);
        return;
    }

    var skins = window.GameConfiguration.gameConfig["Gameplay - Equippable Skins"];
    var currentFilter = 'all';

    function applySkinFilters() {
        var uid = window.agarioEncodedUID || window.agarioUID || localStorage.getItem("agarioEncodedUID") || localStorage.getItem("agarioUID");
        if (!uid) {
            skinShopFiltered = [];
            $('#skinGrid').html('<div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #fff;">' +
                '<div style="font-size: 36px; margin-bottom: 10px;">🔒</div>' +
                '<div style="font-size: 16px; font-weight: 700; color: #ffca28; margin-bottom: 6px;">Login Required</div>' +
                '<div style="font-size: 13px; color: #aaa;">Please log in with <b>Google</b> or <b>Facebook</b> to access Agar.io Skins & Deals.</div>' +
                '</div>');
            $('#skinCount').text(0);
            $('#skinTotal').text(0);
            $('#skinLoadMore').hide();
            return;
        }

        var query = $('#skinSearchBar').val().toLowerCase().trim();
        var userSkins = (window.application && window.application.user && window.application.user.skins) || {};

        if (currentFilter === 'owned') {
            var ownedList = [];
            var seenIds = {};

            for (var k in userSkins) {
                if (!userSkins.hasOwnProperty(k)) continue;
                var item = userSkins[k];
                var pid = item.productId || k;
                if (seenIds[pid]) continue;
                seenIds[pid] = true;

                var imgUrl = item.url || '';
                if (window.application && typeof window.application.getLink === 'function') {
                    var linkRes = window.application.getLink(pid);
                    if (linkRes && linkRes[0]) imgUrl = linkRes[0];
                }

                var matchedCatalog = null;
                for (var ci = 0; ci < skins.length; ci++) {
                    if (skins[ci].productId === pid) {
                        matchedCatalog = skins[ci];
                        break;
                    }
                }

                if (matchedCatalog) {
                    ownedList.push(matchedCatalog);
                } else {
                    ownedList.push({
                        productId: pid,
                        gameplayId: pid,
                        image: '',
                        url: imgUrl,
                        isCustom: true
                    });
                }
            }

            skinShopFiltered = ownedList.filter(function(s) {
                if (query !== '') {
                    var name = s.productId.replace('skin_', '').replace(/_/g, ' ');
                    return name.indexOf(query) > -1;
                }
                return true;
            });
        } else {
            skinShopFiltered = skins.filter(function(s) {
                if (s.productId === 'skin_empty') return false;

                // Exclude skins the user already owns from All Skins
                var rawId = s.productId;
                var modId = s.productId.replace('skin_', '%');
                var isOwned = userSkins.hasOwnProperty(rawId) || userSkins.hasOwnProperty(modId);
                if (isOwned) return false;

                if (query !== '') {
                    var name = s.productId.replace('skin_', '').replace(/_/g, ' ');
                    if (name.indexOf(query) === -1) return false;
                }

                return true;
            });
        }

        skinShopPage = 0;
        $('#skinGrid').empty();

        if (currentFilter === 'owned' && skinShopFiltered.length === 0) {
            $('#skinGrid').html('<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #aaa; font-size: 13px;">No owned skins detected on this account.<br><span style="font-size: 11px; color: #666;">Log in with Google/Facebook or switch to <b>All Skins (955+)</b> to equip or buy any skin.</span></div>');
            $('#skinCount').text(0);
            $('#skinTotal').text(0);
            $('#skinLoadMore').hide();
        } else {
            renderSkinPage();
        }
    }

    // Filter button handler
    $('.skin-filter-btn').off('click').on('click', function() {
        $('.skin-filter-btn').removeClass('active').css({ background: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #444' });
        $(this).addClass('active').css({ background: '#0288d1', color: '#fff', border: 'none' });
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

function equipSkin(productId, imageName) {
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/2230/');
    localStorage.setItem('equippedSkinId', productId);
    if (imageName) localStorage.setItem('equippedSkinImage', imageName);

    // Call official Agar.io/LegendMod skin change function if available
    if (typeof window.changeSkin === 'function') {
        try {
            window.changeSkin(productId);
        } catch (e) {
            console.warn('[Skin Shop] changeSkin call exception:', e);
        }
    }

    // Backup custom skin URL setters
    if (window.ogario && imageName) {
        window.ogario.customSkinUrl = cdnBase + imageName;
    }

    var displayName = productId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    updateEquippedSkinUI();
}

function unequipSkin() {
    localStorage.removeItem('equippedSkinId');
    localStorage.removeItem('equippedSkinImage');

    if (typeof window.changeSkin === 'function') {
        try {
            window.changeSkin('skin_empty');
        } catch (e) {}
    }
    if (window.ogario) {
        window.ogario.customSkinUrl = '';
    }

    updateEquippedSkinUI();
}

function updateEquippedSkinUI() {
    var equippedId = localStorage.getItem('equippedSkinId');
    var equippedImg = localStorage.getItem('equippedSkinImage');
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/2230/');

    var bannerName = $('#activeSkinName');
    var bannerImg = $('#activeSkinImg');
    var unequipBtn = $('#unequipSkinBtn');

    if (equippedId && equippedId !== 'skin_empty') {
        var displayName = equippedId.replace('skin_', '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        bannerName.text(displayName);
        if (equippedImg) {
            bannerImg.attr('src', cdnBase + equippedImg);
        } else {
            bannerImg.attr('src', 'https://jimboy3100.github.io/banners/icondeal2.png');
        }
        unequipBtn.show();
    } else {
        bannerName.text('None (Default Skin)');
        bannerImg.attr('src', 'https://jimboy3100.github.io/banners/icondeal2.png');
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

function renderSkinPage() {
    var start = skinShopPage * skinShopPerPage;
    var end = Math.min(start + skinShopPerPage, skinShopFiltered.length);
    var cdnBase = 'https://configs-web.agario.miniclippt.com/live/' + (window.agarversion || 'v15/2230/');
    var grid = document.getElementById('skinGrid');
    var currentEquippedId = localStorage.getItem('equippedSkinId');

    for (var i = start; i < end; i++) {
        var skin = skinShopFiltered[i];
        var name = skin.productId.replace('skin_', '').replace(/_/g, ' ');
        var displayName = name.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        var colorHex = skin.cellColor || '0x88888800';
        var r = parseInt(colorHex.substring(2, 4), 16);
        var g = parseInt(colorHex.substring(4, 6), 16);
        var b = parseInt(colorHex.substring(6, 8), 16);
        var cssColor = 'rgb(' + r + ',' + g + ',' + b + ')';

        var isEquipped = (currentEquippedId === skin.productId);

        var card = document.createElement('div');
        card.className = 'skin-card' + (isEquipped ? ' equipped' : '');
        card.setAttribute('data-product-id', skin.productId);
        card.setAttribute('data-gameplay-id', skin.gameplayId);
        card.setAttribute('data-image', skin.image);

        var badgeHtml = isEquipped ? '<div class="equipped-badge">&#x2714; Equipped</div>' : '';
        var equipBtnText = isEquipped ? 'Equipped' : 'Equip';

        var imgSrc = skin.url ? skin.url : (cdnBase + skin.image);

        card.innerHTML = badgeHtml +
            '<div class="skin-color" style="background:' + cssColor + '"></div>' +
            '<img src="' + imgSrc + '" alt="' + displayName + '" loading="lazy" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;" onerror="this.src=\'https://jimboy3100.github.io/banners/icondeal2.png\'">' +
            '<div class="skin-name" title="' + displayName + '">' + displayName + '</div>' +
            '<div class="skin-card-actions">' +
            '<button class="skin-btn-equip" onclick="equipSkin(\'' + skin.productId + '\', \'' + skin.image + '\');event.stopPropagation();">' + equipBtnText + '</button>' +
            '<button class="skin-btn-buy" onclick="buySkin(\'' + skin.productId + '\');event.stopPropagation();">Buy</button>' +
            '</div>';

        // Click card body to equip skin
        card.addEventListener('click', (function(skinData) {
            return function() {
                equipSkin(skinData.productId, skinData.image);
            };
        })(skin));

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
}

function buySkin(productId) {
    var uid = $('#exp-uid').text() || window.agarioEncodedUID;
    if (!uid) {
        toastr && toastr.warning('<b>[SHOP]:</b> You must be logged in to buy skins');
        return;
    }
    var currency = $('#BuyDealCurrency').val() || 'USD';
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

function populateSDlines(select,i){
	    
        if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "2") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 1.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "5") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 4.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "10") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 9.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "20") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 19.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "50") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 49.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else if (GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].priceTier == "60") {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId + " = 99.99 $",GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        } else {
            select.options[select.options.length] = new Option(GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].bundleId,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id,GameConfiguration.gameConfig["Wallet - In-App Purchases"][i].id);
        }
    
}
function populateSD() {
    var agarVersionSelect = document.getElementById("ss-select-agarVersionDestinations");

    var select = document.getElementById("ss-select-purchases");
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
    var findSDiconlocationString2 = $("#ss-select-purchases option:selected").text().split('=').pop();
    findSDiconlocationString2 = $("#ss-select-purchases option:selected").text().replace(findSDiconlocationString2, '');
    findSDiconlocationString2 = findSDiconlocationString2.replace(' =', '');
    var select = document.getElementById("ss-select-purchases");
    for (i = 0; i < GameConfiguration.gameConfig["Visual - Bundles"].length; i++) {

        if (GameConfiguration.gameConfig["Visual - Bundles"][i].bundleId == findSDiconlocationString2) {
            console.log("bundleId found");
            var findSDicondescriptionString = GameConfiguration.gameConfig["Visual - Bundles"][i].description;
            if (typeof findSDicondescriptionString === 'string' || findSDicondescriptionString instanceof String) {
                // it's a string

                console.log(findSDicondescriptionString);
                if (findSDicondescriptionString != "na") {
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace('_', ' ');
                    findSDicondescriptionString = findSDicondescriptionString.replace(' name', '');
                    $("#dealtype").text(findSDicondescriptionString);
                } else {
                    console.log("no description");
                    var findSDicondescriptionString = $('#ss-select-purchases').val();
                    findSDicondescriptionString = findSDicondescriptionString.replace('com.miniclip.agar.io.', '');
                    findSDicondescriptionString = findSDicondescriptionString.charAt(0).toUpperCase() + findSDicondescriptionString.slice(1);
                    $("#dealtype").text(findSDicondescriptionString);
                }
            } else {
                console.log("description is not a String");
                $("#dealtype").text("Unknown");
            }
        }
    }
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
    for (var i = document.getElementById("ss-select-purchases").options.length; i-- > 0; ){
		document.getElementById("ss-select-purchases").options[i] = null;}
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

