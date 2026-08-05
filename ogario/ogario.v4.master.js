//v12.84

var consoleMsgLMMaster = "[Master] ";

// ── Centralized URL constants (single source of truth) ──
// All other files must use these instead of hardcoding domains.
window.LM_CONFIG_CDN = "https://configs-web.agario.miniclippt.com/live";

/*
 * Normal configuration assets use configs-web.
 * Uploaded user skins use the separate non-web host.
 */
window.LM_CUSTOM_SKINS_CDN =
    "https://configs.agario.miniclippt.com/live/custom_skins";
// Computed after agarversion is known:
window.LM_CDN_BASE = function() {
    var v = window.agarversion || (typeof Lmagarversion !== 'undefined' && Lmagarversion) || "v15/10913/";
    if (!v.endsWith('/')) v += '/';
    return window.LM_CONFIG_CDN + "/" + v;
};
window.LM_CONFIG_URL = function() {
    return window.LM_CDN_BASE() + "GameConfiguration.json";
};

window.EnvConfig = {};
window.EnvConfig.fb_app_id = self.localStorage.getItem("EnvConfig.fb_app_id");
window.EnvConfig.google_client_id = self.localStorage.getItem("EnvConfig.google_client_id");
window.EnvConfig.master_url = self.localStorage.getItem("EnvConfig.master_url");
window.EnvConfig.configVersion = self.localStorage.getItem("EnvConfig.configVersion");

var window = this;
window.loggedIn=false;
if (
    !(
        document.URL &&
        (
            document.URL.includes("jimboy3100.github.io") ||
            document.URL.includes("expanding.land") ||
            document.URL.includes("legendmod.ml")
        )
    )
) {
    $.ajax("//agar.io/index.html", {
        error(xhr, status, errorThrown) {
            console.warn(
                "[Master] Could not refresh EnvConfig:",
                status,
                errorThrown
            );
        },

        success(sketchContents) {
            if (typeof sketchContents !== "string") {
                console.warn(
                    "[Master] Agar.io index returned no text EnvConfig source"
                );
                return;
            }

            var envConfigMatch =
                sketchContents.match(
                    /EnvConfig\s*=\s*\{[^}]+\}/
                );

            if (!envConfigMatch) {
                console.warn(
                    "[Master] EnvConfig declaration was not found in Agar.io index"
                );
                return;
            }

            try {
                new Function(
                    '"use strict";\n' +
                    "window." +
                    envConfigMatch[0] +
                    ";"
                )();
            } catch (envConfigError) {
                console.error(
                    "[Master] Failed to evaluate EnvConfig:",
                    envConfigError
                );
                return;
            }

            if (
                !window.EnvConfig ||
                typeof window.EnvConfig !== "object"
            ) {
                console.warn(
                    "[Master] Evaluated EnvConfig is invalid"
                );
                return;
            }

            if (window.EnvConfig.fb_app_id != null) {
                localStorage.setItem(
                    "EnvConfig.fb_app_id",
                    window.EnvConfig.fb_app_id
                );
            }

            if (window.EnvConfig.google_client_id != null) {
                localStorage.setItem(
                    "EnvConfig.google_client_id",
                    window.EnvConfig.google_client_id
                );
            }

            if (window.EnvConfig.master_url != null) {
                localStorage.setItem(
                    "EnvConfig.master_url",
                    window.EnvConfig.master_url
                );
            }

            if (window.EnvConfig.configVersion != null) {
                localStorage.setItem(
                    "EnvConfig.configVersion",
                    window.EnvConfig.configVersion
                );
            }
        },

        timeout: 10000,
        dataType: "text",
        method: "GET",
        cache: false,
        crossDomain: true
    });
}
if (window.EnvConfig.master_url != null) {
    $.ajax(window.EnvConfig.master_url + "/getLatestID", {
        error(xhr, status, errorThrown) {
            console.warn(
                "[Master] getLatestID request failed:",
                status,
                errorThrown
            );
        },

        success(sketchContents) {
            var latestIdText = "";

            if (typeof sketchContents === "string") {
                var latestIdContainer =
                    document.createElement("div");

                latestIdContainer.innerHTML =
                    sketchContents;

                latestIdText =
                    String(
                        latestIdContainer.textContent || ""
                    ).trim();
            }

            if (!latestIdText) {
                console.warn(
                    "[Master] getLatestID returned an empty response"
                );
                return;
            }

            window.getLatestID =
                latestIdText;

            localStorage.setItem(
                "getLatestID",
                window.getLatestID
            );
        },

        timeout: 10000,
        dataType: "text",
        method: "GET",
        cache: false,
        crossDomain: true
    });
}
legendmaster(window);

function legendmaster(self) {
    function login() {
        if (l) {
            self.getStorage();
            if ("1" === options.loginIntent && "facebook" === options.context) {
                self.FB.getLoginStatus(function(res) {
                    if (res.status === "connected") {
                        init(res);
                    } else {
                        /* FB cookies expired or blocked by browser —
                         * DON'T call self.logout(), that would delete
                         * storeObjectInfo and prevent future auto-login.
                         * Just log a warning and let the user click
                         * the Facebook button to re-authenticate. */
                        console.log("[Master] FB session expired on page load. Click Facebook button to re-login.");
                        /* Restore saved profile picture and name from localStorage
                         * so the UI doesn't reset to Guest while session is stale */
                        if (options.userInfo && options.userInfo.picture) {
                            $(".agario-profile-picture").attr("src", options.userInfo.picture);
                        }
                    }
                });
            }
            self.facebookRelogin = clear;
            self.facebookLogin = clear;
        }
    }

    function clear(nbToClear) {
        if (
            self.FB &&
            typeof self.FB.login === "function"
        ) {
            options.loginIntent = "1";
            options.context = "facebook";
            self.updateStorage();

            self.FB.login(
                function(requestTokenResult) {
                    if (!requestTokenResult) {
                        console.warn(
                            "[Master] Facebook login returned no result"
                        );
                        return;
                    }

                    init(requestTokenResult);
                },
                {
                    scope: "public_profile, email"
                }
            );

            return true;
        }

        alert(
            "Facebook login is unavailable. Check browser extensions and privacy settings."
        );

        return false;
    }

    function init(response) {
        if (
            !response ||
            response.status !== "connected" ||
            !response.authResponse
        ) {
            console.warn(
                "[Master] Invalid Facebook authentication response:",
                response
            );
            return;
        }

        if (response.status === "connected") {
            var accessToken =
                response.authResponse.accessToken;
            if (accessToken) {
				if (window.MultiPending){				
					master.accessTokenFB = accessToken;				
					MultiTokenReady(window.MultiPending);
					window.MultiPending = null;
				}	
				else{
					master.doLoginWithFB(accessToken);
					self.FB.api("/me/picture?width=180&height=180", function(images) {
						if (images.data && images.data.url) {
							options.userInfo.picture = images.data.url;
							$(".agario-profile-picture").attr("src", images.data.url);
							self.updateStorage();
						}
					});
					
					doFB()
					
					$("#helloContainer").attr("data-logged-in", "1");
					//$(".progress-bar-striped").width("100%");
					$("#login-google").attr("class", "menu-bar-button");
					$("#login-facebook").attr("class", "menu-bar-button barf");
					toastr.info("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter126 + " Facebook!");
					window.loggedIn=true;
				}
            } else {
                if (f < 3 && !window.loggedIn && !window._lwReconnecting) {
                    f++;
                    self.facebookRelogin();
                    self.logout();
					window.loggedIn=false;
                }
            }
        }
    }

    function setup() {
        if (
            !self.gapi ||
            typeof self.gapi.load !== "function"
        ) {
            console.warn(
                "[Master] Google API library is unavailable"
            );
            return;
        }

        self.gapi.load("auth2", function() {
            try {
                api = self.gapi.auth2.init({
                    client_id:
                        headers.gplus_client_id,
                    cookie_policy:
                        "single_host_origin",
                    scope:
                        "profile",
                    app_package_name:
                        "com.miniclip.agar.io"
                });
            } catch (googleInitError) {
                console.error(
                    "[Master] Google auth initialization failed:",
                    googleInitError
                );
                return;
            }

            var contextMenu =
                document.getElementById(
                    "gplusLogin"
                );

            if (!contextMenu) {
                console.warn(
                    "[Master] Google login button #gplusLogin was not found"
                );
                return;
            }

            contextMenu.addEventListener(
                "click",
                function() {
                    options.loginIntent = "1";
                    options.context = "google";
                    self.updateStorage();
                }
            );

            api.attachClickHandler(
                contextMenu
            );

            api.currentUser.listen(
                transform
            );

            Promise.resolve(api)
                .then(get)
                .catch(function(error) {
                    console.error(
                        "[Master] Google auth setup failed:",
                        error
                    );
                });
        });
    }

    function get() {
        api.currentUser.get();
        if ("1" === options.loginIntent && options.context === "google" && !api.isSignedIn.get()) {
            api.signIn();
        }
    }

    function transform(event) {
        if (event && api && "1" === options.loginIntent && options.context === "google" && api.isSignedIn.get()) {
			if (window.MultiPending){				
				master.accessTokenGPlus = event.getAuthResponse().id_token;
				MultiTokenReady(window.MultiPending);
				window.MultiPending = null;
			}
			else{
				var idToken = event.getAuthResponse().id_token;
				var attrVal = event.getBasicProfile().getImageUrl();
				master.doLoginWithGPlus(idToken);
				if (attrVal) {
					options.userInfo.picture = attrVal;
					self.updateStorage();
					$(".agario-profile-picture").attr("src", attrVal);
				}
				
				doGl()
				
				$("#helloContainer").attr("data-logged-in", "1");
				//$(".progress-bar-striped").width("100%");
				$("#login-facebook").attr("class", "menu-bar-button");
				$("#login-google").attr("class", "menu-bar-button barf");
				toastr.info("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter126 + " Google!");
				window.loggedIn=true;
			}
        }
    }
    var options = {
        context: null,
        defaultProvider: "facebook",
        loginIntent: "0",
        userInfo: {
            socialToken: null,
            tokenExpires: "",
            level: "",
            xp: "",
            xpNeeded: "",
            name: "",
            picture: "",
            displayName: "",
            loggedIn: "0",
            socialId: ""
        }
    };
    if (window.EnvConfig.fb_app_id && window.EnvConfig.google_client_id && window.EnvConfig.master_url) {
        //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " window.EnvConfig loaded from //agar.io/index.html from the previous time");
        var headers = {
            fb_app_id: window.EnvConfig.fb_app_id,
            gplus_client_id: window.EnvConfig.google_client_id,
            master_url: window.EnvConfig.master_url.replace("https://", ""),
            endpoint_version: "v4",
            proto_version: "15.0.3",
            //client_version: 30706,
			client_version: 31100,
			//3.4.6
            client_version_string: "3.11.0",
			protocolVersion: 23
        };
    } else if (window.EnvConfig.master_url){
        var headers = {
            fb_app_id: 677505792353827,
            gplus_client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
            master_url: window.EnvConfig.master_url.replace("https://", ""),
            endpoint_version: "v4",
            proto_version: "15.0.3",
            client_version: 31100,
            client_version_string: "3.11.0",
			protocolVersion: 23
        };
		} else {
        var headers = {
            fb_app_id: 677505792353827,
            gplus_client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
            master_url: "webbouncer-live-v8-0.agario.miniclippt.com",
            endpoint_version: "v4",
            proto_version: "15.0.3",
            client_version: 31100,
            client_version_string: "3.11.0",
			protocolVersion: 23
        };		
    }
	/* LW: Override Google OAuth client ID on our domains.
	 * agar.io and expanding.land are different websites with different Google projects.
	 * This ID (317663...) is for our master API headers; GIS login uses a separate ID (477064...). */
	if (window.legendModFromWebsite) {
		headers.gplus_client_id = "317663835351-aurr32dabsfaan9b367vmamutq692hcm.apps.googleusercontent.com";
	}
	window.LMagarioheaders=headers;
    var l = false;
    var f = 0;
    var api = null;
    self.master = {
        ws: null,
        serverIP: null,
        endpoint: null,
        region: "",
        gameMode: ":ffa",
        partyToken: "",
        findingServer: 0,
        curValidFindServer: 0,
        backoffPeriod: 500,
        intentionalDisconnect: false,
        connectionActive: false,
        pendingConnection: null,
        findServerTimer: null,
        connectionGeneration: 0,
        regionNames: {},
        context: "",
        accessToken: null,
        clientVersion: headers.client_version,
        clientVersionString: headers.client_version_string,
		xsupportprotoversion: headers.proto_version,
		protocolVersion: headers.protocolVersion,
		master_url_http: "https://" + headers.master_url,
        getClientVersion() {
            if (
                null !==
                self.localStorage.getItem(
                    "ogarioClientVersionString"
                )
            ) {
                var storedVersionString =
                    self.localStorage.getItem(
                        "ogarioClientVersionString"
                    );

                var parsedStoredVersion =
                    this.parseClientVersion(
                        storedVersionString
                    );

                if (parsedStoredVersion != null) {
                    this.clientVersionString =
                        storedVersionString;

                    this.clientVersion =
                        parsedStoredVersion;
                } else {
                    console.warn(
                        "[Master] Invalid saved client version was removed:",
                        storedVersionString
                    );

                    self.localStorage.removeItem(
                        "ogarioClientVersionString"
                    );
                }
            }
            if (null !== self.localStorage.getItem("ogarioXProtoVersion")) {
                this.xsupportprotoversion = self.localStorage.getItem("ogarioXProtoVersion");
            }	
            if (null !== self.localStorage.getItem("ogarioProtocolVersion")) {
                this.protocolVersion = self.localStorage.getItem("ogarioProtocolVersion");
            }					
            var window = this;
			if (!(document.URL && (document.URL.includes('jimboy3100.github.io') || document.URL.includes('expanding.land') || document.URL.includes('legendmod.ml')))){	
			setTimeout(function() {
				ajaxrequestMaster();
			}, 500);	

            $.ajax("//agar.io/agario.core.js", {
                error() {},
                success(sketchContents) {
                    var optionMatch = sketchContents.match(/\w\[\w\+\d+>>\d\]=\w;\w+\(\w,(\d+)\);/);
                    if (optionMatch) {
                        var pluginName = optionMatch[1];
						//console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current protocol version:", pluginName);
						window.setProtocolVersion(pluginName);
                    }
                },
                dataType: "text",
                method: "GET",
                cache: false,
                crossDomain: true
            });	
		}
			
        },
        setClientVersion(clientVersion, serverVersion) {
            var parsedClientVersion =
                Number(clientVersion);

            var parsedServerVersion =
                this.parseClientVersion(
                    serverVersion
                );

            if (
                !Number.isInteger(parsedClientVersion) ||
                parsedClientVersion <= 0 ||
                parsedServerVersion == null ||
                parsedClientVersion !==
                    parsedServerVersion
            ) {
                console.warn(
                    "[Master] Rejected invalid client version:",
                    clientVersion,
                    serverVersion
                );
                return;
            }

            clientVersion =
                parsedClientVersion;

            if (this.clientVersion != clientVersion) {
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Changing client version...");
                this.clientVersion = clientVersion;
                this.clientVersionString = serverVersion;
                if (self.core) {
                    self.core.setClientVersion(clientVersion, serverVersion);
                }
                self.localStorage.setItem("ogarioClientVersionString", serverVersion);
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " setClientVersion called, reconnecting");
                this.reconnect(true);
            }
        },
        setxsupportprotoversion(serverVersion) {			
            if (this.xsupportprotoversion != serverVersion) {
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Changing x-support version...");
                this.xsupportprotoversion = serverVersion;
                self.localStorage.setItem("ogarioXProtoVersion", serverVersion);   
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " setxsupportprotoversion called, reconnecting");
                this.reconnect(true);				
            }
        },		
        setProtocolVersion(serverVersion) {			
            if (this.protocolVersion != serverVersion) {
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Changing protocol version...");
                this.protocolVersion = serverVersion;
                self.localStorage.setItem("ogarioProtocolVersion", serverVersion);   
                console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " ProtocolVersion called, reconnecting");
                this.reconnect(true);				
            }
        },			
        parseClientVersion(styleValue) {
            var parts =
                String(
                    styleValue == null
                        ? ""
                        : styleValue
                ).trim().split(".");

            if (parts.length !== 3) {
                return null;
            }

            var major =
                Number(parts[0]);

            var minor =
                Number(parts[1]);

            var patch =
                Number(parts[2]);

            if (
                !Number.isInteger(major) ||
                !Number.isInteger(minor) ||
                !Number.isInteger(patch) ||
                major < 0 ||
                minor < 0 ||
                patch < 0 ||
                minor > 99 ||
                patch > 99
            ) {
                return null;
            }

            return (
                10000 * major +
                100 * minor +
                patch
            );
        },
        getRegionCode() {
            var nextNodeLoc = window.localStorage.getItem('location');
            if (nextNodeLoc) {
                this.setRegion(nextNodeLoc, false);
                if (!this.checkPartyHash()) {
                    this.reconnect(false, "saved-region");
                }
                return;
            }
            var canvasLayersManager = this;
            window.userData = $.ajax(master.master_url_http + "/getCountry", {
                beforeSend(xhr) {
                    return xhr.setRequestHeader("Accept", "text/plain"), xhr.setRequestHeader("Accept", "*/*"), xhr.setRequestHeader("Accept", "q=0.01"), xhr.setRequestHeader("Content-Type", "application/octet-stream"), xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion), xhr.setRequestHeader("x-client-version", master.clientVersion), true;
                },
                error() {
                    canvasLayersManager.checkRegion();

                    var selectedRegion = $("#region").val();
                    if (selectedRegion) {
                        canvasLayersManager.setRegion(selectedRegion, false);

                        if (!canvasLayersManager.checkPartyHash()) {
                            canvasLayersManager.reconnect(false, "country-request-fallback");
                        }
                    } else if (window.toastr) {
                        toastr.warning('<b>[Master]:</b> Could not determine your region. Select a region manually.');
                    }
                },
                success(playlistCopy) {
                $("#response").html(JSON.stringify(playlistCopy, null, 4));
                if (playlistCopy != null) {
                    localStorage.setItem("userData", JSON.stringify(playlistCopy));
                }
				//if (userData && userData.responseJSON){		
				if (playlistCopy){			
				console.log(playlistCopy.country)
                canvasLayersManager.setRegionCode(playlistCopy.country);
				}
				else if (userData && userData.responseJSON){
					/* userData.responseJSON is already available — set region directly */
					canvasLayersManager.setRegionCode(userData.responseJSON.country);
				}
                },
                timeout: 10000,
                dataType: "json",
                method: "POST",
                processData: false,
                cache: false,
                crossDomain: true
            });
        },
        setRegionCode(segment) {
            if (regionobj.hasOwnProperty(segment)) {
                this.setRegion(regionobj[segment], false);
                if (!this.checkPartyHash()) {
                    //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " setRegionCode called, reconnecting");
                    this.reconnect();
                }
            }
        },
        setRegion(items, left) {
            if (null == left) {
                left = true;
            }

            if (!items) {
                return;
            }

            if (this.region === items && this.connectionActive) {
                return;
            }

            if (typeof LM !== "undefined" && LM) LM.isLegendWorld = false;
            if (typeof ogario !== "undefined" && ogario) ogario.isLegendWorld = false;

            this.region = items;

            self.localStorage.setItem(
                "location",
                items
            );

            if ($("#region").val() !== items) {
                $("#region").val(items);
            }

            if (left) {
                this.reconnect(false, "region-change");
            }
        },
        checkRegion() {
            var x = $("#region");
            var options = x.val();
            if (options) {
                self.localStorage.setItem("location", options);
            } else {
                if (options = self.localStorage.getItem("location")) {
                    $("#region").val(options);
                }
            }
            if (x.val()) {
                $("#locationKnown").append(x);
            } else {
                $("#locationUnknown").append(x);
            }
        },
        refreshRegionInfo() {
            var that = this;
            this.makeMasterSimpleRequest("info", "text", function(data) {
                var regions = (data = JSON.parse(data)).regions;
                var i;
                for (i in regions) {
                    if (regions.hasOwnProperty(i)) {
						var tempRegion=that.regionNames[i];
						if (that.regionNames[i] == "North America"){
							tempRegion = Premadeletter134;
						}						
						else if (that.regionNames[i] == "South America"){
							tempRegion = Premadeletter135;
						}
						else if (that.regionNames[i] == "Europe"){
							tempRegion = Premadeletter136;
						}					
						else if (that.regionNames[i] == "Ukraine"){
							tempRegion = Premadeletter137;
						}	
						else if (that.regionNames[i] == "Turkey"){
							tempRegion = Premadeletter138;
						}	
						else if (that.regionNames[i] == "East Asia"){
							tempRegion = Premadeletter139;
						}							
						else if (that.regionNames[i] == "China"){
							tempRegion = Premadeletter139a;
						}	
						else if (that.regionNames[i] == "Oceania"){
							tempRegion = Premadeletter140;
						}	
						else if (that.regionNames[i] == " -- Select a Region -- "){
							tempRegion = Premadeletter140a;
						}						
						$('#region option').filter(function() { return this.value === i; }).text(tempRegion + " (" + regions[i].numPlayers + ")");
                        //$('#region option[value="' + i + '').text(that.regionNames[i] + " (" + regions[i].numPlayers + ")");
                    }
                }
            });
        },
        getRegionNames() {
            var PL$5 = this;
            $("#region option").each(function() {
                var bigg_id = $(this).val();
                var this_gene_data = $(this).text();
                if (!PL$5.regionNames.hasOwnProperty(bigg_id)) {
                    PL$5.regionNames[bigg_id] = this_gene_data;
                }
            });
        },
        setGameMode(val, opt_validate) {
            if (null == opt_validate) {
                opt_validate = true;
            }

            if (this.gameMode === val && this.connectionActive) {
                this.applyGameMode(val);
                return;
            }

            if (typeof LM !== "undefined" && LM) LM.isLegendWorld = false;
            if (typeof ogario !== "undefined" && ogario) ogario.isLegendWorld = false;

            this.applyGameMode(val);
            this.gameMode = val;

            if (opt_validate) {
                this.reconnect(false, "mode-change");
            }
        },
        applyGameMode(value) {
            $("#helloContainer, #overlays-hud").attr("data-gamemode", value);
            $("#gamemode").val(value);
            if (value !== ":party") {
                this.replaceHistoryState("/#" + self.encodeURIComponent(value.replace(":", "")));
            }
        },
        handleChangeMode() {
            var n = $("#gamemode").val();
            this.setGameMode(n);
        },
        findServer(id, params, generation) {
            if (generation == null) {
                generation = this.connectionGeneration;
            }

            if (generation !== this.connectionGeneration) {
                return;
            }

            if (window.legendModFromWebsite) {
                return;
            }

            if (id == null) {
                id = "";
            }

            if (params == null) {
                params = ":ffa";
            }

            var now = Date.now();
            var elapsed = now - this.findingServer;

            if (elapsed < 500) {
                var options = this;
                var delay = Math.max(1, 500 - elapsed);

                clearTimeout(this.findServerTimer);
                this.findServerTimer = setTimeout(function() {
                    if (generation === options.connectionGeneration) {
                        options.findServer(id, params, generation);
                    }
                }, delay);

                return;
            }

            clearTimeout(this.findServerTimer);
            this.findServerTimer = null;
            this.findingServer = now;

            var picKey = "findServer";
            var source2;
            var container = this.setRequestMsg(id, params, null, source2);
            var options = this;
            var requestNumber = ++this.curValidFindServer;
            var requestGeneration = generation;

            this.makeMasterRequest(
                headers.endpoint_version + "/" + picKey,
                container,
                function(response) {
                    if (
                        requestNumber !== options.curValidFindServer ||
                        requestGeneration !== options.connectionGeneration
                    ) {
                        return;
                    }

                    var endpoint =
                        response &&
                        response.endpoints &&
                        response.endpoints.https;

                    if (endpoint && endpoint !== "0.0.0.0:0") {
                        options.serverIP = endpoint;

                        if (response.token != null) {
                            options.partyToken = response.token;
                        }

                        options.backoffPeriod = 500;
                        options.connect(options.serverIP, requestGeneration);
                        return;
                    }

                    options.backoffPeriod = Math.min(
                        Math.max(options.backoffPeriod, 500) * 2,
                        30000
                    );

                    clearTimeout(options.findServerTimer);
                    options.findServerTimer = setTimeout(function() {
                        options.findServer(id, params, requestGeneration);
                    }, options.backoffPeriod);
                },
                function() {
                    if (requestGeneration !== options.connectionGeneration) {
                        return;
                    }

                    options.backoffPeriod = Math.min(
                        Math.max(options.backoffPeriod, 500) * 2,
                        30000
                    );

                    clearTimeout(options.findServerTimer);
                    options.findServerTimer = setTimeout(function() {
                        options.findServer(id, params, requestGeneration);
                    }, options.backoffPeriod);
                }
            );
        },
        setRequestMsg(args, object, source, source2) {
            var encodeVarint = function(target, value) {
                value = Math.max(0, Number(value) || 0);
                do {
                    var byte = value & 127;
                    value = Math.floor(value / 128);
                    target.push(value ? byte | 128 : byte);
                } while (value);
            };
            var encodeText = function(value) {
                var text = unescape(encodeURIComponent(String(value == null ? '' : value)));
                var bytes = [];
                for (var i = 0; i < text.length; i++) bytes.push(text.charCodeAt(i));
                return bytes;
            };
            var appendBytes = function(target, bytes) {
                for (var i = 0; i < bytes.length; i++) target.push(bytes[i]);
            };
            var appendField = function(target, tag, bytes) {
                target.push(tag);
                encodeVarint(target, bytes.length);
                appendBytes(target, bytes);
            };

            var payload = [];
            appendField(payload, 10, encodeText(args));
            appendField(payload, 18, encodeText(object));

            if (Array.isArray(source2) && source2.length) {
                var friendsPayload = [];
                source2.forEach(function(element) {
                    appendField(friendsPayload, 18, encodeText(element));
                });
                appendField(payload, 18, friendsPayload);
            }
            if (source != null) {
                var sourcePayload = [];
                appendField(sourcePayload, 10, encodeText(source));
                appendField(payload, 26, sourcePayload);
            }

            var output = [10];
            encodeVarint(output, payload.length);
            appendBytes(output, payload);
            return new Uint8Array(output);
        },
        makeMasterRequest(_wid_attr, data, callback, timeout_callback, type) {
            if (type == null) {
                type = "application/octet-stream";
            }

            $.ajax("https://" + headers.master_url + "/" + _wid_attr, {
                beforeSend(xhr) {
                    xhr.setRequestHeader("Accept", "text/plain, */*;q=0.01");
                    xhr.setRequestHeader("Content-Type", type);
                    xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion);
                    xhr.setRequestHeader("x-client-version", master.clientVersion);
                    return true;
                },
                error(xhr, status, errorThrown) {
                    if (timeout_callback) {
                        timeout_callback(xhr, status, errorThrown);
                    }
                },
                success(playlistCopy) {
                    if (callback) {
                        callback(playlistCopy);
                    }
                },
                timeout: 10000,
                dataType: "json",
                method: "POST",
                data: data,
                processData: false,
                cache: false,
                crossDomain: true
            });
        },
        makeMasterSimpleRequest(key, dataType, success, error) {
            //if (key){
				//key = key = + "/";
			//}
			var obj = this;
            $.ajax("https://" + headers.master_url + "/" + key, {
                beforeSend(xhr) {
                    return xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion), xhr.setRequestHeader("x-client-version", master.clientVersion), true;
                },
                error() {
                    if (error) {
                        error();
                    }
                },
                success(nextModel) {
                    success(nextModel);
                },
                dataType: dataType,
                method: "GET",
                cache: false,
                crossDomain: true
            });
        },
        createParty() {
            this.setPartyState("3");
            this.setGameMode(":party");
        },
        joinParty(d) {
            if (window.legendModFromWebsite) {
                return;
            }

            d = String(
                d == null ? "" : d
            ).trim();

            if (d.indexOf("#") !== -1) {
                d =
                    d.substring(
                        d.lastIndexOf("#") + 1
                    );
            }

            d =
                d.replace(/^\s+|\s+$/g, "");

            if (!d) {
                this.setPartyState("6");

                if (window.toastr) {
                    toastr.warning(
                        "<b>[Master]:</b> Enter a valid party token."
                    );
                }

                return;
            }

            var scopeHeaderOverrides =
                this;

            this.setGameMode(
                ":party",
                false
            );

            this.partyToken = d;

            this.replaceHistoryState(
                "/#" +
                self.encodeURIComponent(d)
            );

            var label =
                this.setRequestMsg(
                    this.region,
                    "",
                    d
                );

            this.makeMasterRequest(
                headers.endpoint_version +
                    "/getToken",
                label,
                function(moduleParams) {
                    var endpoint =
                        moduleParams &&
                        moduleParams.endpoints &&
                        moduleParams.endpoints.https;

                    if (
                        !endpoint ||
                        typeof endpoint !== "string"
                    ) {
                        console.warn(
                            "[Master] Party token response has no valid endpoint:",
                            moduleParams
                        );

                        scopeHeaderOverrides
                            .setPartyState("6");

                        return;
                    }

                    scopeHeaderOverrides.endpoint =
                        endpoint;

                    scopeHeaderOverrides
                        .setPartyState("9");
                },
                function() {
                    scopeHeaderOverrides
                        .setPartyState("6");
                }
            );
        },
        setPartyState(value) {
            if ("9" === value) {
                this.updatePartyToken();
                this.setGameMode(":party", false);
                this.connect(this.endpoint);
                value = "5";
            }
            $("#helloContainer").attr("data-party-state", value);
        },
        connect(body, generation) {
            if (generation == null) {
                generation = this.connectionGeneration;
            }

            /*
             * Reject endpoints returned by an older region, gamemode or
             * reconnect request.
             */
            if (generation !== this.connectionGeneration) {
                console.log(
                    "[Master] Ignoring stale connection:",
                    body
                );
                return;
            }

            if (!body || typeof body !== "string") {
                console.error(
                    "[Master] Invalid server endpoint:",
                    body
                );
                return;
            }

            var nextWs;

            if (
                body.indexOf("ws://") === 0 ||
                body.indexOf("wss://") === 0
            ) {
                nextWs = body;
            } else if (
                body.indexOf("localhost") === 0 ||
                body.indexOf("127.0.0.1") === 0
            ) {
                nextWs = "ws://" + body;
            } else {
                nextWs = "wss://" + body;
            }

            if (
                this.gameMode === ":party" &&
                this.partyToken
            ) {
                nextWs +=
                    "?party_id=" +
                    self.encodeURIComponent(
                        this.partyToken
                    );
            }

            this.ws = nextWs;

            /*
             * Do not call core.disconnect() here.
             *
             * core.connect() reaches LM.connect(), and LM.connect() already
             * closes the previous socket before creating the replacement.
             *
             * core.disconnect() reaches LM.closeConnection(), which removes
             * the socket onclose callback before closing. Waiting for
             * master.onDisconnect() after core.disconnect() therefore leaves
             * pendingConnection stuck and prevents region/gamemode changes.
             */
            this.pendingConnection = null;
            this.intentionalDisconnect = true;
            this.connectionActive = false;

            if (!self.core) {
                this.intentionalDisconnect = false;
                return;
            }

            try {
                self.core.connect(this.ws);
            } catch (connectError) {
                this.connectionActive = false;
                this.intentionalDisconnect = false;

                console.error(
                    "[Master] Failed to connect:",
                    connectError
                );
            }
        },
        reconnect(table, reason) {
            if (window.legendModFromWebsite) {
                return;
            }

            if (!this.region) {
                return;
            }

            var generation =
                ++this.connectionGeneration;

            /*
             * Remember why this reconnect began. This value is diagnostic only;
             * compatibility does not depend on callers supplying the second argument.
             */
            this.reconnectReason =
                reason || "unspecified";

            if (table && this.serverIP) {
                this.connect(
                    this.serverIP,
                    generation
                );
            } else {
                this.findServer(
                    this.region,
                    this.gameMode,
                    generation
                );
            }
        },
        onConnect() {
            this.connectionActive = true;
            this.intentionalDisconnect = false;
            this.pendingConnection = null;

            if (this.gameMode === ":party") {
                this.updatePartyToken();
            }
        },
        onDisconnect() {
            var wasIntentional = this.intentionalDisconnect;
            var pending = this.pendingConnection;

            this.connectionActive = false;
            this.intentionalDisconnect = false;
            this.pendingConnection = null;

            if (
                wasIntentional &&
                pending &&
                pending.generation === this.connectionGeneration &&
                self.core
            ) {
                this.ws = pending.ws;
                this.connectionActive = true;

                try {
                    self.core.connect(this.ws);
                } catch (connectError) {
                    this.connectionActive = false;
                    console.error("[Master] Failed to open replacement connection:", connectError);
                }

                return;
            }

            if (wasIntentional) {
                console.log(
                    "[Master] Intended disconnect ignored:",
                    this.reconnectReason || "connection replacement"
                );
                return;
            }

            console.log("[Master] Unexpected disconnect; reconnecting");

            window._lwReconnecting = true;

            var savedToken = this.accessToken;
            var savedContext = this.context;
            var savedLoggedIn = window.loggedIn;

            this.reconnect(false, "unexpected-disconnect");

            if (savedToken && savedContext) {
                this.accessToken = savedToken;
                this.context = savedContext;
                window.loggedIn = savedLoggedIn;
            }

            setTimeout(function() {
                window._lwReconnecting = false;
            }, 3000);
        },
        recaptchaRequested() {
            window.agarCaptcha.requestCaptcha(true);
        },
        sendRecaptchaResponse(mmCoreSplitViewBlock) {
            if (self.core) {
					self.core.recaptchaHandlerResponse(mmCoreSplitViewBlock);				
			}
        },
        notifyToken(n) {
            this.sendRecaptchaResponse(n);
        },
        setNick() {
            this.login();
            var result = $("#nick").val();
            //if (result && result.length > 15) {
			if (result && fancyCount2(result) > 15) {
				while (fancyCount2(result) > 15) {
					result= result.slice(0,-1)
				}
                //result = result.substring(0, 15);
            }
            if (self.core) {
                self.core.sendNick(result);
            }
        },
/*		
        setNick() {
            this.login();
            var result = $("#nick").val();
            if (result && result.length > 15) {	
                result = result.substring(0, 15);
            }
            if (self.core) {
                self.core.sendNick(result);
            }
        },	
*/		
        spectate() {
            if (self.core) {
                self.core.sendSpectate();
            }
        },
        updatePartyToken() {
            $("#party-token, .party-token").val(this.partyToken);
        },
        checkHash() {
            if (this.checkPartyHash()) {
                this.joinParty(self.location.hash);
            } else {
                var fm = ["#ffa", "#battleroyale", "#teams", "#experimental"];
                if (self.location.hash && -1 != fm.indexOf(self.location.hash)) {
                    this.setGameMode(self.location.hash.replace("#", ":"));
                }
            }
        },
        checkPartyHash() {
            return self.location.hash && 7 == self.location.hash.length;
        },
        replaceHistoryState(name) {
            if (self.history && self.history.replaceState) {
                self.history.replaceState({}, self.document.title, name);
            }
        },
        facebookLogin() {
            self.facebookLogin();
        },
        doLoginWithFB(session) {
            this.context = "facebook";
            this.accessToken = session;		
        },
        doLoginWithGPlus(value) {
            this.context = "google";
            this.accessToken = value;	
        },
        login() {
            if (this.accessToken) {
                if (this.context === "facebook" && self.core && self.core.sendFbToken) {
                    self.core.sendFbToken(this.accessToken);
                }
                if (this.context === "google" && self.core && self.core.sendGplusToken) {
                    self.core.sendGplusToken(this.accessToken);
                }
            }
        },
        logout() {
            this.accessToken = null;
			this.context = "";
            console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " logout called, not reconnecting");
			window.loggedIn=false;
            //            this.reconnect();
        },
        setUI() {
            var chat = this;
            $("[data-itr]").each(function() {
                var o = $(this);
                var i = o.attr("data-itr");
                o.html(self.i18n(i));
            });
            $("#gamemode").on("change", function() {
                chat.handleChangeMode();
            });
            $(".btn-play, .btn-play-guest").on("click", function(result) {
                result.preventDefault();
                chat.setNick();
            });
            $(".btn-spectate").on("click", function(result) {
                result.preventDefault();
                chat.spectate();
            });
            $("#create-party-btn-2").on("click", function(event) {
                event.preventDefault();
                chat.createParty();
            });
            $("#join-party-btn-2").on("click", function(result) {
                result.preventDefault();
                chat.joinParty($("#party-token").val());
            });
            self.toggleSocialLogin = function() {
                $("#socialLoginContainer").toggle();
            };
        },
        init() {
            var n = this;
            this.setUI();
            this.getRegionNames();
			if (!window.legendModFromWebsite){ // Skip Agar.io region/hash/geo on private servers
            this.refreshRegionInfo();
			this.checkHash();
			this.getRegionCode()
			this.checkRegion();
            setInterval(function() {
                n.refreshRegionInfo();
            }, 18e4);			
			}
        },
		findFacebookFriends() {
			FB.api("me/friends","GET",{
                    fields: "id, name, picture"
                    }, function(response) {
						if (response != null && response.data != null) {
							window.facebookFriends=response.data;							
                            var _g = 0;
							window.friends=[];
                            while (_g < response.data.length) {
                                window.friends.push(response.data[_g].id);
                                ++_g;
                            }							
                        } else {
                            console.log("Error calling: FP.api");
                        }
			});	
		}		
    };
    self.getStorage = function() {
        if (null !== self.localStorage.getItem("storeObjectInfo")) {
            options = JSON.parse(self.localStorage.getItem("storeObjectInfo"));
        }
    };
    self.updateStorage = function() {
        self.localStorage.setItem("storeObjectInfo", JSON.stringify(options));
    };
    self.logout = function() {
        /* Don't nuke login state during game server reconnect —
         * reconnect() can trigger FB.getLoginStatus which calls logout
         * when FB cookies expire, killing the Google session too. */
        if (window._lwReconnecting) {
            console.log("[Master] logout() blocked — reconnecting");
            return;
        }
        if (options.context === "google" && api) {
            api.signOut();
        }
        self.localStorage.removeItem("storeObjectInfo");
        $("#helloContainer").attr("data-logged-in", "0");
		$('.progress-bar-star3').text(0);
		$('.progress-bar-star2').text(0);
        $(".progress-bar-striped").width("0%");
		$(".progress-bar-striped2").width("0%");
        $("#login-facebook").attr("class", "menu-bar-button");
        $("#login-google").attr("class", "menu-bar-button");
        toastr.info("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter127 + "!");	
		potionsLogout();
        master.logout();
		continuelogout();
    };
    self.facebookLogin = function() {
        alert("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " You seem to have something blocking Facebook on your browser, please check for any extensions");
    };
	
	// FB/Google OAuth init — always run, including on private servers
	// (previously guarded by !legendModFromWebsite, which blocked login)
    self.fbAsyncInit = function() {
        self.FB.init({
            appId: headers.fb_app_id,
            cookie: true,
            xfbml: true,
            status: true,
            version: "v2.8"
        });
        l = true;
        login();
    };
    self.gapiAsyncInit = function() {
        self.getStorage();
        setup();
    };

    /* Early login-state restoration from localStorage.
     * This runs BEFORE FB/Google SDKs load, so the UI immediately shows
     * the user's saved profile picture, name, and login state instead of
     * flashing "Guest" until the SDK callback fires. */
    (function earlyRestore() {
        self.getStorage();
        if (options.loginIntent === "1" && options.context) {
            /* User was logged in last session — restore UI */
            if (options.userInfo && options.userInfo.picture) {
                $(".agario-profile-picture").attr("src", options.userInfo.picture);
            }
            var savedName = self.localStorage.getItem("userfirstname");
            if (savedName) {
                $("#UserProfileName1").text(savedName);
            }
            $("#helloContainer").attr("data-logged-in", "1");

        }
    })();
	
};
function continuelogout(){
        $("#UserProfileName1").text("Guest");
		
        $("#UserProfileUID1").val("");
		$("#replayuid").val("")
		
		$("#UserProfileUUID1").val("");	
        $(".agario-profile-picture").attr('src', 'https://jimboy3100.github.io/banners/profilepic_guest.png');
		$("#stats-content").html("");
		$("#user-info").html("");	
		$(".vanilla-skin-preview").attr('src', 'https://jimboy3100.github.io/banners/profilepic_guest.png');
		$('.progress-bar-star').text("");
		$(".agario-profile-name-container").html('<div class="agario-profile-name"></div>'+
                                        '<div id="coins" style="display: inline-block;">??000</div>'+
                                        '<div id="dna" style="display: inline-block;">??000</div>'+
                                        '<div id="trophy" style="display: inline-block;">??000</div>')
		$("#quest-active").html('')
		$("#player-skins").html('');
		
}
function doFB() {

    FB.api('/me', {
        fields: 'first_name, last_name, gender, id'
    }, function(fbresponse) {
        var firstName = fbresponse && fbresponse.first_name || "";
        var lastName = fbresponse && fbresponse.last_name || "";
        var facebookID = fbresponse && fbresponse.id || "";
        var gender = fbresponse && fbresponse.gender || "";

        $(".agario-profile-picture").attr('src', 'https://graph.facebook.com/' + encodeURIComponent(facebookID) + '/picture?type=large');
        $("#UserProfileName1").text(firstName);
        $("#UserProfileUID1").val(facebookID);
		$("#replayuid").val(facebookID)
		
		if (userid == facebookID){
			setLevelProgressBar();
		}		
		userfirstname = firstName;
        if (userfirstname != null) {
            localStorage.setItem("userfirstname", userfirstname);
        }
        userlastname = lastName;
        if (userlastname != null) {
            localStorage.setItem("userlastname", userlastname);
        }
        userid = facebookID;
        if (userid != null) {
            localStorage.setItem("userid", userid);
        }
        usergender = gender;
        if (usergender != null) {
            localStorage.setItem("usergender", usergender);
        }
        return userfirstname, userlastname, usergender, userid;

    });

	FB.api('/me/friends', function(response){
		window.master.fbUsers = response.data;
	}, {scope: 'user_friends'});	
}
function doGl() {
	var GgImg = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl();
	var GgProfileName = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName(); //First Name
	var GgProfileSurName = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getFamilyName(); //Last Name
	var GgUID = window.gapi.auth2.getAuthInstance().currentUser.get().getId();

	$(".agario-profile-picture").attr('src', GgImg);	
	$("#UserProfileName1").text(GgProfileName);
	
	$("#UserProfileUID1").val(GgUID);
	$("#replayuid").val(GgUID)
	
	if (userid == GgUID){
		setLevelProgressBar();
    }
    userfirstname = GgProfileName;
    userid = GgUID;
    userlastname = GgProfileSurName;
    if (userfirstname != null) {
        localStorage.setItem("userfirstname", userfirstname);
    }
    if (userlastname != null) {
        localStorage.setItem("userlastname", userlastname);
    }
    if (userid != null) {
        localStorage.setItem("userid", userid);
    }
    return userfirstname, userlastname, usergender, userid;

}
window.master.fbUsers=[];

var Lmagarversion = "";

window.LMGameConfiguration = null;
window.LMGameConfigurationReady = new Promise(function(resolve) {
    var version = window.agarversion || (typeof Lmagarversion !== 'undefined' && Lmagarversion) || "v15/10913/";
    if (!version.endsWith('/')) version += '/';
    var primaryUrl = window.LM_CONFIG_CDN + "/" + version + "GameConfiguration.json";
    var fallbackUrl = window.LM_CONFIG_URL();
    var settled = false;

    function finish(configuration) {
        if (settled) return;
        settled = true;
        window.LMGameConfiguration = configuration || null;
        window.dispatchEvent(new CustomEvent("lm-game-configuration-ready", {
            detail: window.LMGameConfiguration
        }));
        resolve(window.LMGameConfiguration);
    }

    $.ajax({ type: "GET", url: primaryUrl, dataType: "json" })
        .done(finish)
        .fail(function() {
            $.ajax({ type: "GET", url: fallbackUrl, dataType: "json" })
                .done(finish)
                .fail(function() { finish(null); });
        });
});

function getInfo() {
    $.ajax({
        type: "GET",
        url: master.master_url_http + "/info",
        datatype: "json",
        success: function(info) {
            //$("#currentRegion").html($('#region').val());
            var regions = info.regions;
            var currentRegion;
            for (var key in regions) {
                if (key == $('#region').val()) {
                    currentRegion = regions[key];
                    break;
                }
            }
            //console.log(info);
            //console.log(currentRegion);
            if (currentRegion != undefined) {
                $("#numPlayers").html(kFormatter(currentRegion.numPlayers));
                $("#numServers").html(currentRegion.numRealms);
                $("#pps").html(Math.round(currentRegion.avgPlayersPerRealm));
            }
            $("#totalPlayers").html(kFormatter(info.totals.numPlayers));
        }
    });
}
function potionsLogout(){
$("#potions").html('<div id="potion1" class="potion">'+
                                        '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />'+
                                        '<div>empty</div>'+
                                    '</div>'+
                                    '<div id="potion2" class="potion">'+
                                        '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />'+
                                        '<div>empty</div>'+
                                    '</div>'+
                                   '<div id="potion3" class="potion">'+
                                        '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />'+
                                        '<div>empty</div>'+
                                    '</div>')
$("#potions").hide()									
}

function fancyCount2(str){
  const joiner = "\u{200D}";
  const split = str.split(joiner);
  let count = 0;

  for(const s of split){
    //removing the variation selectors
    const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join("")).length;
    count += num;
  }

  //assuming the joiners are used appropriately
  return count / split.length;
}
function ajaxrequestMaster(){            
	$.ajax("//agar.io/mc/agario.js", {
                error() {},
                success(sketchContents) {
                    //var optionMatch = sketchContents.match(/versionString = "(\d+\.\d+\.\d+)"/);
					//var optionMatch = sketchContents.match(/{\s\s\svar\s*versionString\s?=\s?"(\d+\.\d+\.\d+)"/g);
					//var optionMatch = sketchContents.match(/versionString\s?=\s?"(\d+\.\d+\.\d+)"/g);
					var optionMatch = sketchContents.match(/versionString\s*=\s*,?"(\d+\.\d+\.\d+)"/);	
					var optionMatch2 = sketchContents.match(/x-support-proto-version\","(\d+\.\d+\.\d+)"/);
                    if (optionMatch) {
						var pluginNameLast = optionMatch[1];
						console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current client version from agario.js:", optionMatch[1]);
						var data = window.master.parseClientVersion(pluginNameLast);
                        window.master.setClientVersion(data, pluginNameLast);
						console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current client version:", data, pluginNameLast);									
                    }
                    if (optionMatch2) {
						var pluginName2 = optionMatch2[1];
						window.master.setxsupportprotoversion(pluginName2);
						console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current x-proto version:", pluginName2);
                    }
                },
                dataType: "text",
                method: "GET",
                cache: false,
                crossDomain: true
            });
}
