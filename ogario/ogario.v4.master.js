//v5
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
                        self.logout();
                    }
                });
            }
            self.facebookRelogin = clear;
            self.facebookLogin = clear;
        }
    }

    function clear(nbToClear) {
        if (null !== self.FB) {
            return options.loginIntent = "1", options.context = "facebook", self.updateStorage(), self.FB.login(function(requestTokenResult) {
                init(requestTokenResult);
            }, {
                scope: "public_profile, email"
            }), true;
        }
        alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
    }

    function init(response) {
        if (response.status === "connected") {
            var accessToken = response.authResponse.accessToken;
            if (accessToken) {
                master.doLoginWithFB(accessToken);
                self.FB.api("/me/picture?width=180&height=180", function(images) {
                    if (images.data && images.data.url) {
                        options.userInfo.picture = images.data.url;
                        $(".agario-profile-picture").attr("src", images.data.url);
                        self.updateStorage();
                    }
                });
                $("#helloContainer").attr("data-logged-in", "1");
                $(".progress-bar-striped").width("100%");
                $("#login-google").attr("class", "menu-bar-button");
                $("#login-facebook").attr("class", "menu-bar-button barf");
                toastr.info("Logged in to Facebook!");
            } else {
                if (f < 3) {
                    f++;
                    self.facebookRelogin();
                    self.logout();
                }
            }
        }
    }

    function setup() {
        self.gapi.load("auth2", function() {
            api = self.gapi.auth2.init({
                client_id: headers.gplus_client_id,
                cookie_policy: "single_host_origin",
                scope: "profile",
                app_package_name: "com.miniclip.agar.io"
            });
            var contextMenu = document.getElementById("gplusLogin");
            contextMenu.addEventListener("click", function() {
                options.loginIntent = "1";
                options.context = "google";
                self.updateStorage();
            });
            api.attachClickHandler(contextMenu);
            api.currentUser.listen(transform);
            api.then(get);
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
            var idToken = event.getAuthResponse().id_token;
            var attrVal = event.getBasicProfile().getImageUrl();
            master.doLoginWithGPlus(idToken);
            if (attrVal) {
                options.userInfo.picture = attrVal;
                self.updateStorage();
                $(".agario-profile-picture").attr("src", attrVal);
            }
            $("#helloContainer").attr("data-logged-in", "1");
            $(".progress-bar-striped").width("100%");
            $("#login-facebook").attr("class", "menu-bar-button");
            $("#login-google").attr("class", "menu-bar-button barf");
            toastr.info("Logged in to Google!");
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
    var headers = {
        fb_app_id: 677505792353827,
        gplus_client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
        master_url: "webbouncer-live-v7-0.agario.miniclippt.com",
        endpoint_version: "v4",
        proto_version: "12.0.1",
        client_version: 30406,
        client_version_string: "3.4.6"
    };
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
        regionNames: {},
        context: "",
        accessToken: null,
        clientVersion: headers.client_version,
        clientVersionString: headers.client_version_string,
        getClientVersion: function() {
            if (null !== self.localStorage.getItem("ogarioClientVersionString")) {
                this.clientVersionString = self.localStorage.getItem("ogarioClientVersionString");
                this.clientVersion = this.parseClientVersion(this.clientVersionString);
            }
            var window = this;
            $.ajax("//agar.io/mc/agario.js", {
                error: function() {},
                success: function(sketchContents) {
                    var optionMatch = sketchContents.match(/versionString="(\d+\.\d+\.\d+)"/);
                    if (optionMatch) {
                        var pluginName = optionMatch[1];
                        var data = window.parseClientVersion(pluginName);
                        console.log("[Master] Current client version:", data, pluginName);
                        window.setClientVersion(data, pluginName);
                    }
                },
                dataType: "text",
                method: "GET",
                cache: false,
                crossDomain: true
            });
        },
        setClientVersion: function(clientVersion, serverVersion) {
            console.log("[Master] Your client version:", this.clientVersion, this.clientVersionString);
            if (this.clientVersion != clientVersion) {
                console.log("[Master] Changing client version...");
                this.clientVersion = clientVersion;
                this.clientVersionString = serverVersion;
                if (self.core) {
                    self.core.setClientVersion(clientVersion, serverVersion);
                }
                self.localStorage.setItem("ogarioClientVersionString", serverVersion);
				console.log("[Master] setClientVersiont called, reconnecting");
                this.reconnect(true);
            }
        },
        parseClientVersion: function(styleValue) {
            return 1e4 * parseInt(styleValue.split(".")[0]) + 100 * parseInt(styleValue.split(".")[1]) + parseInt(styleValue.split(".")[2]);
        },
/*        getRegionCode: function() {
            var nextNodeLoc = self.localStorage.getItem("location");
            if (nextNodeLoc) {
                return this.setRegion(nextNodeLoc, false), void(this.checkPartyHash() || this.reconnect());
            }
            var canvasLayersManager = this;
            $.get("//gc.agar.io", function(layoutSets) {
                var j = layoutSets.split(" ")[0];
                canvasLayersManager.setRegionCode(j);
            }, "text");
        },*/
		'getRegionCode': function() {
			var nextNodeLoc = window.localStorage.getItem('location');
			if(nextNodeLoc) {
				this.setRegion(nextNodeLoc, ![]);
				if(!this.checkPartyHash()) {
					console.log("[Master] getRegionCode called, reconnecting");
					this.reconnect();
				}
				return;
			}
			var canvasLayersManager = this;
			/*$.get('//gc.agar.io', function(_0x4a6f91) {
				var _0x4f6506 = _0x4a6f91.split(' ');
				var _0x102283 = _0x4f6506[0x0];
				canvasLayersManager.setRegionCode(_0x102283);
			}, 'text'); */
			userData=$.get("https://extreme-ip-lookup.com/json/", function (response) { $("#response").html(JSON.stringify(response, null, 4));
				if (userData!=null) {localStorage.setItem("userData", JSON.stringify(userData));}
				canvasLayersManager.setRegionCode(userData.responseJSON.countryCode);
			}, "jsonp");
		},			
        setRegionCode: function(segment) {
            if (regionobj.hasOwnProperty(segment)) {
                this.setRegion(regionobj[segment], false);
                if (!this.checkPartyHash()) {
					console.log("[Master] setRegionCode called, reconnecting");
                    this.reconnect();
                }
            }
        },
        setRegion: function(items, left) {
            if (null == left) {
                /** @type {boolean} */
                left = true;
            }
            if (items) {
                this.region = items;
                self.localStorage.setItem("location", items);
                if ($("#region").val() !== items) {
                    $("#region").val(items);
                }
                if (left) {
					console.log("[Master] setRegion called, left=null, reconnecting");
                    this.reconnect();
                }
            }
        },
        checkRegion: function() {
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
        refreshRegionInfo: function() {
            var that = this;
            this.makeMasterSimpleRequest("info", "text", function(data) {
                var regions = (data = JSON.parse(data)).regions;
                var i;
                for (i in regions) {
                    if (regions.hasOwnProperty(i)) {
                        $('#region option[value="' + i + '').text(that.regionNames[i] + " (" + regions[i].numPlayers + ")");
                    }
                }
            });
        },
        getRegionNames: function() {
            var PL$5 = this;
            $("#region option").each(function() {
                var bigg_id = $(this).val();
                var this_gene_data = $(this).text();
                if (!PL$5.regionNames.hasOwnProperty(bigg_id)) {
                    PL$5.regionNames[bigg_id] = this_gene_data;
                }
            });
        },
        setGameMode: function(val, opt_validate) {
            if (null == opt_validate) {
                opt_validate = true;
            }
            this.applyGameMode(val);
            this.gameMode = val;
            if (opt_validate) {
				console.log("[Master] setGameMode called, opt_validate!=null, reconnecting");
                this.reconnect();
            }
        },
        applyGameMode: function(value) {
            $("#helloContainer, #overlays-hud").attr("data-gamemode", value);
            $("#gamemode").val(value);
            if (value !== ":party") {
                this.replaceHistoryState("/#" + self.encodeURIComponent(value.replace(":", "")));
            }
        },
        handleChangeMode: function() {
            var n = $("#gamemode").val();
            this.setGameMode(n);
        },
        findServer: function(id, params) {
            var e = Date.now();
            if (!(e - this.findingServer < 500)) {
                if (self.core) {
                    self.core.disconnect();
                }
                var picKey = "findServer";
                if (null == id) {
                    id = "";
                }
                if (null == params) {
                    /** @type {string} */
                    params = ":ffa";
                } else {
                    //if (params === ":battleroyale") {
                        //picKey = "findBattleRoyaleServer";
                    //}
                }
                var options = this;
                var container = this.setRequestMsg(id, params);
                var defaultWarningTime = ++this.curValidFindServer;
                this.findingServer = e;
                this.makeMasterRequest(headers.endpoint_version + "/" + picKey, container, function(response) {
                    if (defaultWarningTime == options.curValidFindServer) {
                        var key = response.endpoints;
                        if (null !== key && "0.0.0.0:0" !== key.https) {
                            options.serverIP = key.https;
                            if (null !== response.token) {
                                options.partyToken = response.token;
                            }
                            options.backoffPeriod = 500;
                            options.connect(options.serverIP);
                        } else {
                            options.findServer(id, params);
                        }
                    }
                }, function() {
                    options.backoffPeriod *= 2;
                    setTimeout(function() {
                        options.findServer(id, params);
                    }, options.backoffPeriod);
                });
            }
        },
        setRequestMsg: function(args, object, source) {
            var getOwnPropertyNames = function(data) {
                output.push(data.length);
                var value = 0;
                for (; value < data.length; value++) {
                    output.push(data.charCodeAt(value));
                }
            };
            var output = [10, 4 + args.length + object.length, 10];
            return getOwnPropertyNames(args), output.push(18), getOwnPropertyNames(object), source && (output.push(26, 8, 10), getOwnPropertyNames(source)), new Uint8Array(output);
        },
        makeMasterRequest: function(_wid_attr, data, callback, timeout_callback, type) {
            var header = this;
            if (null == type) {
                type = "application/octet-stream";
            }
            $.ajax("https://" + headers.master_url + "/" + _wid_attr, {
                beforeSend: function(xhr) {
                    return xhr.setRequestHeader("Accept", "text/plain"), xhr.setRequestHeader("Accept", "*/*"), xhr.setRequestHeader("Accept", "q=0.01"), xhr.setRequestHeader("Content-Type", type), xhr.setRequestHeader("x-support-proto-version", headers.proto_version), xhr.setRequestHeader("x-client-version", header.clientVersion), true;
                },
                error: function() {
                    if (timeout_callback) {
                        timeout_callback();
                    }
                },
                success: function(playlistCopy) {
                    callback(playlistCopy);
                },
                dataType: "json",
                method: "POST",
                data: data,
                processData: false,
                cache: false,
                crossDomain: true
            });
        },
        makeMasterSimpleRequest: function(key, dataType, success, error) {
            var obj = this;
            $.ajax("https://" + headers.master_url + "/" + key, {
                beforeSend: function(xhr) {
                    return xhr.setRequestHeader("x-support-proto-version", headers.proto_version), xhr.setRequestHeader("x-client-version", obj.clientVersion), true;
                },
                error: function() {
                    if (error) {
                        error();
                    }
                },
                success: function(nextModel) {
                    success(nextModel);
                },
                dataType: dataType,
                method: "GET",
                cache: false,
                crossDomain: true
            });
        },
        createParty: function() {
            this.setPartyState("3");
            this.setGameMode(":party");
        },
        joinParty: function(d) {
            var scopeHeaderOverrides = this;
            if (-1 != d.indexOf("#")) {
                d = d.split("#")[1];
            }
            this.setGameMode(":party", false);
            this.partyToken = d;
            this.replaceHistoryState("/#" + self.encodeURIComponent(d));
            var label = this.setRequestMsg(this.region, "", d);
            this.makeMasterRequest(headers.endpoint_version + "/getToken", label, function(moduleParams) {
                scopeHeaderOverrides.endpoint = moduleParams.endpoints.https;
                scopeHeaderOverrides.setPartyState("9");
            }, function() {
                scopeHeaderOverrides.setPartyState("6");
            });
        },
        setPartyState: function(value) {
            if ("9" === value) {
                this.updatePartyToken();
                this.setGameMode(":party", false);
                this.connect(this.endpoint);
                value = "5";
            }
            $("#helloContainer").attr("data-party-state", value);
        },
        connect: function(body) {
            console.log("[Master] Connect to:", body);
            this.ws = "wss://" + body;
            if (":party" === this.gameMode && this.partyToken) {
                this.ws += "?party_id=" + self.encodeURIComponent(this.partyToken);
            }
            if (self.core) {
                self.core.connect(this.ws);
            }
        },
        reconnect: function(table) {
            if (this.region) {
                if (table && this.serverIP) {
                    this.connect(this.serverIP);
                } else {
                    this.findServer(this.region, this.gameMode);
                }
            }
        },
        onConnect: function() {
            if (this.gameMode === ":party") {
                this.updatePartyToken();
            }
        },
        onDisconnect: function() {
			console.log("[Master] onDisconnect called, reconnecting");
            this.reconnect();
        },
        recaptchaRequested: function() {
            requestCaptcha(true);
        },
        sendRecaptchaResponse: function(mmCoreSplitViewBlock) {
            if (self.core) {
                self.core.recaptchaResponse(mmCoreSplitViewBlock);
            }
        },
        notifyToken: function(n) {
            this.sendRecaptchaResponse(n);
        },
        setNick: function() {
            this.login();
            var result = $("#nick").val();
            if (result && result.length > 15) {
                result = result.substring(0, 15);
            }
            if (self.core) {
                self.core.sendNick(result);
            }
        },
        spectate: function() {
            if (self.core) {
                self.core.sendSpectate();
            }
        },
        updatePartyToken: function() {
            $("#party-token, .party-token").val(this.partyToken);
        },
        checkHash: function() {
            if (this.checkPartyHash()) {
                this.joinParty(self.location.hash);
            } else {
                var fm = ["#ffa", "#battleroyale", "#teams", "#experimental"];
                if (self.location.hash && -1 != fm.indexOf(self.location.hash)) {
                    this.setGameMode(self.location.hash.replace("#", ":"));
                }
            }
        },
        checkPartyHash: function() {
            return self.location.hash && 7 == self.location.hash.length;
        },
        replaceHistoryState: function(name) {
            if (self.history && self.history.replaceState) {
                self.history.replaceState({}, self.document.title, name);
            }
        },
        facebookLogin: function() {
            self.facebookLogin();
        },
        doLoginWithFB: function(session) {
            this.context = "facebook";
            this.accessToken = session;
        },
        doLoginWithGPlus: function(value) {
            this.context = "google";
            this.accessToken = value;
        },
        login: function() {
            if (this.accessToken) {
                if (this.context === "facebook" && self.core && self.core.sendFbToken) {
                    self.core.sendFbToken(this.accessToken);
                }
                if (this.context === "google" && self.core && self.core.sendGplusToken) {
                    self.core.sendGplusToken(this.accessToken);
                }
            }
        },
        logout: function() {
              this.accessToken = null;
			  console.log("[Master] logout called, not reconnecting");
//            this.reconnect();
        },
        setUI: function() {
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
        init: function() {
            var n = this;
            this.setUI();
            this.getRegionNames();
            this.refreshRegionInfo();
            this.checkHash();
            this.getRegionCode();
            this.checkRegion();
            setInterval(function() {
                n.refreshRegionInfo();
            }, 18e4);
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
        if (options.context === "google" && api) {
            api.signOut();
        }
        delete self.localStorage.storeObjectInfo;
        $("#helloContainer").attr("data-logged-in", "0");
        $(".progress-bar-striped").width("0%");
        $("#login-facebook").attr("class", "menu-bar-button");
        $("#login-google").attr("class", "menu-bar-button");
        toastr.warning("Logged out!");
        master.logout();
    };
    self.facebookLogin = function() {
        alert("[Master] You seem to have something blocking Facebook on your browser, please check for any extensions");
    };
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
};
