//v12.71

var consoleMsgLMMaster = "[Master] ";

window.EnvConfig = {};
window.EnvConfig.fb_app_id = self.localStorage.getItem("EnvConfig.fb_app_id");
window.EnvConfig.google_client_id = self.localStorage.getItem("EnvConfig.google_client_id");
window.EnvConfig.master_url = self.localStorage.getItem("EnvConfig.master_url");
window.EnvConfig.configVersion = self.localStorage.getItem("EnvConfig.configVersion");

var window = this;
window.loggedIn=false;
if (!(document.URL && document.URL.includes('legendmod.ml'))){
$.ajax("//agar.io/index.html", {
    error() {},
    success(sketchContents) {
        var parsed = $.parseHTML(sketchContents);
        window.EnvConfig = sketchContents.match(/EnvConfig = \{[^}]+}/);
        var runEnvConfig = new Function(window.EnvConfig);

        runEnvConfig();
        localStorage.setItem("EnvConfig.fb_app_id", window.EnvConfig.fb_app_id);
        localStorage.setItem("EnvConfig.google_client_id", window.EnvConfig.google_client_id);
        localStorage.setItem("EnvConfig.master_url", window.EnvConfig.master_url);
        localStorage.setItem("EnvConfig.configVersion", window.EnvConfig.configVersion);
        //legendmaster(window);	
    },
    dataType: "text",
    method: "GET",
    cache: false,
    crossDomain: true
});
}	
if (window.EnvConfig.master_url != null) {
    $.ajax(window.EnvConfig.master_url + "/getLatestID", {
        error() {},
        success(sketchContents) {
            var getLatestIDtemp = $.parseHTML(sketchContents);
            window.getLatestID = getLatestIDtemp[0].textContent;
            localStorage.setItem("getLatestID", window.getLatestID);
        },
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
                if (f < 3) {
                    f++;
                    self.facebookRelogin();
                    self.logout();
					window.loggedIn=false;
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
        regionNames: {},
        context: "",
        accessToken: null,
        clientVersion: headers.client_version,
        clientVersionString: headers.client_version_string,
		xsupportprotoversion: headers.proto_version,
		protocolVersion: headers.protocolVersion,
		master_url_http: "https://" + headers.master_url,
        getClientVersion() {
            if (null !== self.localStorage.getItem("ogarioClientVersionString")) {
                this.clientVersionString = self.localStorage.getItem("ogarioClientVersionString");
                this.clientVersion = this.parseClientVersion(this.clientVersionString);
            }
            if (null !== self.localStorage.getItem("ogarioXProtoVersion")) {
                this.xsupportprotoversion = self.localStorage.getItem("ogarioXProtoVersion");
            }	
            if (null !== self.localStorage.getItem("ogarioProtocolVersion")) {
                this.protocolVersion = self.localStorage.getItem("ogarioProtocolVersion");
            }					
            var window = this;
			if (!(document.URL && document.URL.includes('legendmod.ml'))){			
            $.ajax("//agar.io/mc/agario.js", {
                error() {},
                success(sketchContents) {
                    var optionMatch = sketchContents.match(/versionString="(\d+\.\d+\.\d+)"/);
					var optionMatch2 = sketchContents.match(/x-support-proto-version\","(\d+\.\d+\.\d+)"/);
                    if (optionMatch) {
                        var pluginName = optionMatch[1];
						var pluginName2 = optionMatch2[1];
                        var data = window.parseClientVersion(pluginName);
                        //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current client version:", data, pluginName);
						//console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Current x-proto version:", pluginName2);
                        window.setClientVersion(data, pluginName);
						window.setxsupportprotoversion(pluginName2);
                    }
                },
                dataType: "text",
                method: "GET",
                cache: false,
                crossDomain: true
            });
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
            return 10000 * parseInt(styleValue.split(".")[0]) + 100 * parseInt(styleValue.split(".")[1]) + parseInt(styleValue.split(".")[2]);
        },
        getRegionCode() {
            var nextNodeLoc = window.localStorage.getItem('location');
            if (nextNodeLoc) {
                this.setRegion(nextNodeLoc, ![]);
                if (!this.checkPartyHash()) {
                    //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " getRegionCode called, reconnecting");
                    this.reconnect();
                }
                return;
            }
            var canvasLayersManager = this;
            window.userData = $.ajax(master.master_url_http + "/getCountry", {
                beforeSend(xhr) {
                    return xhr.setRequestHeader("Accept", "text/plain"), xhr.setRequestHeader("Accept", "*/*"), xhr.setRequestHeader("Accept", "q=0.01"), xhr.setRequestHeader("Content-Type", "application/octet-stream"), xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion), xhr.setRequestHeader("x-client-version", master.clientVersion), true;
                },
                error() {
                    /*if (timeout_callback) {
                        timeout_callback();
                    }*/
                },
                success(playlistCopy) {
                $("#response").html(JSON.stringify(playlistCopy, null, 4));
                if (userData != null) {
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
				//if (userData && userData.responseJSON){		
				if (playlistCopy){			
				console.log(playlistCopy.country)
                canvasLayersManager.setRegionCode(playlistCopy.country);
				}
				else if (userData){
					setTimeout(function() {
						canvasLayersManager.setRegionCode(userData.responseJSON.country);
					}, 2000);						
				}
                },
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
                    //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " setRegion called, left=null, reconnecting");
                    this.reconnect();
                }
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
						else if (that.regionNames[i] == "Russia"){
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
						$('#region option[value="' + i + '').text(tempRegion + " (" + regions[i].numPlayers + ")");
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
            this.applyGameMode(val);
            this.gameMode = val;
            if (opt_validate) {
                //console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " setGameMode called, opt_validate!=null, reconnecting");
                this.reconnect();
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
        findServer(id, params) {
            var e = Date.now();
            if (!(e - this.findingServer < 500)) {
                if (self.core) {
                    self.core.disconnect();
                }
                var picKey = "findServer";
				//
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
				var source2;
				/*if (master && master.context && master.context == "facebook" && params === ":ffa" && window.friends){
					picKey = "findServerWithFriends";	
					params = params;
					source2 = window.friends;
				}*/				
                var options = this;
				//console.log("id", id, "params", params);
                var container;
				container= this.setRequestMsg(id, params, null, source2);
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
                }, 
				function() {
                    options.backoffPeriod *= 2;
                    setTimeout(function() {
                        options.findServer(id, params);
                    }, options.backoffPeriod);
                });
            }
        },
        setRequestMsg(args, object, source, source2) {
            var output;
			var output2 = 0;
			if (source2){
				output2= "" + friends;
			}
			if (!output2.length){
				output2a=0;
			}
			else{
				output2a=output2.length
			}
			output = [10, 4 + args.length + object.length + output2a, 10];
			var getOwnPropertyNames = function(data) {
                output.push(data.length);
                var value = 0;
                for (; value < data.length; value++) {
                    output.push(data.charCodeAt(value));
                }
            };
            var getOwnPropertyNames2 = function(data) {
					output.push(18);
					output.push(184);
					output.push(4);
					data.forEach(function(element) {
					output.push(18);	
					getOwnPropertyNames(element);
					});					
            };			          
            return getOwnPropertyNames(args), output.push(18), getOwnPropertyNames(object), source2 && getOwnPropertyNames2(source2), source && (output.push(26, 8, 10), getOwnPropertyNames(source)), new Uint8Array(output);
        },
        makeMasterRequest(_wid_attr, data, callback, timeout_callback, type) {
            var header = this;
            if (null == type) {
                type = "application/octet-stream";
            }
            $.ajax("https://" + headers.master_url + "/" + _wid_attr, {
                beforeSend(xhr) {
                    //return xhr.setRequestHeader("Accept", "text/plain"), xhr.setRequestHeader("Accept", "*/*"), xhr.setRequestHeader("Accept", "q=0.01"), xhr.setRequestHeader("Content-Type", type), xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion), xhr.setRequestHeader("x-client-version", master.clientVersion), true;
                    return xhr.setRequestHeader("Accept", "text/plain"), xhr.setRequestHeader("Accept", "*/*"), xhr.setRequestHeader("Accept", "text/plain, */*, q=0.01"), xhr.setRequestHeader("Content-Type", type), xhr.setRequestHeader("x-support-proto-version", master.xsupportprotoversion), xhr.setRequestHeader("x-client-version", master.clientVersion), true;

                },
                error() {
                    if (timeout_callback) {
                        timeout_callback();
                    }
                },
                success(playlistCopy) {
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
        setPartyState(value) {
            if ("9" === value) {
                this.updatePartyToken();
                this.setGameMode(":party", false);
                this.connect(this.endpoint);
                value = "5";
            }
            $("#helloContainer").attr("data-party-state", value);
        },
        connect(body) {
            //            console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " Connect to:", body);
            this.ws = "wss://" + body;
            if (":party" === this.gameMode && this.partyToken) {
                this.ws += "?party_id=" + self.encodeURIComponent(this.partyToken);
            }
            if (self.core) {
                self.core.connect(this.ws);
            }
        },
        reconnect(table) {
            if (this.region) {
                if (table && this.serverIP) {
                    this.connect(this.serverIP);
                } else {
					if (!(document.URL && document.URL.includes('legendmod.ml'))){
						this.findServer(this.region, this.gameMode);
					}
                }
            }
        },
        onConnect() {
            if (this.gameMode === ":party") {
                this.updatePartyToken();
            }
        },
        onDisconnect() {
            console.log("\x1b[31m%s\x1b[34m%s\x1b[0m", consoleMsgLMMaster, " onDisconnect called, reconnecting");
            this.reconnect();
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
			if (!(document.URL && document.URL.includes('legendmod.ml'))){
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
        if (options.context === "google" && api) {
            api.signOut();
        }
        delete self.localStorage.storeObjectInfo;
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
	
	if (!(document.URL && document.URL.includes('legendmod.ml'))){
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
	}
	
};
function continuelogout(){
        $("#UserProfileName1").text("Guest");
		
        $("#UserProfileUID1").val("");
		$("#replayuid").val("")
		
		$("#UserProfileUUID1").val("");	
        $(".agario-profile-picture").attr('src', 'https://legendmod.ml/banners/profilepic_guest.png');
		$("#stats-content").html("");
		$("#user-info").html("");	
		$(".vanilla-skin-preview").attr('src', 'https://legendmod.ml/banners/profilepic_guest.png');
		$('.progress-bar-star').text("");
		$(".agario-profile-name-container").html('<div class="agario-profile-name"></div>'+
                                        '<div id="coins" style="display: inline-block;">💰000</div>'+
                                        '<div id="dna" style="display: inline-block;">💊000</div>'+
                                        '<div id="trophy" style="display: inline-block;">🏆000</div>')
		$("#quest-active").html('')
		$("#player-skins").html('');
		
}
function doFB() {

    FB.api('/me', {
        fields: 'first_name, last_name, gender, id'
    }, function(fbresponse) {
        $(".agario-profile-picture").attr('src', 'https://graph.facebook.com/' + fbresponse.id + '/picture?type=large');

        $("#UserProfileName1").text(fbresponse[Object.keys(fbresponse)[0]]);
        $("#UserProfileUID1").val(fbresponse[Object.keys(fbresponse)[2]]);
		$("#replayuid").val(fbresponse[Object.keys(fbresponse)[2]])
		
		if (userid == fbresponse[Object.keys(fbresponse)[2]]){
			setLevelProgressBar();
		}		
        userfirstname = fbresponse[Object.keys(fbresponse)[0]];
        if (userfirstname != null) {
            localStorage.setItem("userfirstname", userfirstname);
        }
        userlastname = fbresponse[Object.keys(fbresponse)[1]];
        if (userlastname != null) {
            localStorage.setItem("userlastname", userlastname);
        }
        userid = fbresponse[Object.keys(fbresponse)[2]];
        if (userid != null) {
            localStorage.setItem("userid", userid);
        }
        usergender = fbresponse[Object.keys(fbresponse)[3]];
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
    userlastname = GgProfileName;
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

window.LMGameConfiguration = $.ajax({
    type: "GET",
    url: "https://legendmod.ml/agario/live/" + Lmagarversion + "GameConfiguration.json",
    async: false,
    datatype: "jsonp",
    success: function(info) {
        //var GameConfiguration = info;
    }
}).responseJSON;
//weird but it works....

setTimeout(function() {
    if (window.LMGameConfiguration == undefined) {
        window.LMGameConfiguration = $.ajax({
            type: "GET",
            url: "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json",
            async: false,
            datatype: "jsonp",
            success: function(info) {
                //var GameConfiguration = info;
            }
        }).responseJSON;
    }
}, 3000);

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
                                        '<img src="https://legendmod.ml/banners/potion_empty.png" />'+
                                        '<div>empty</div>'+
                                    '</div>'+
                                    '<div id="potion2" class="potion">'+
                                        '<img src="https://legendmod.ml/banners/potion_empty.png" />'+
                                        '<div>empty</div>'+
                                    '</div>'+
                                   '<div id="potion3" class="potion">'+
                                        '<img src="https://legendmod.ml/banners/potion_empty.png" />'+
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
