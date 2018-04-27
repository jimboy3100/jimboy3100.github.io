// ==UserScript==
// @name         Legend Mod⇒AgarTool (BETA)
// @name:ja      Legend Mod⇒AgarTool （ベータ）
// @name:en      Legend Mod⇒AgarTool (BETA)
// @version      0.11
// @namespace    http://tampermonkey.net/tannichi-ao2t
// @description   Link Legend Mod to Agar Tool
// @description:ja   Legend Mod 上から Agar Tool へ情報連携します
// @description:en   Link to Agar Tool on Legend Mod
// @author       tannichi & Jimboy3100
// @match        http://agar.io/*
// @grant        unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==


(function() {
    'use strict';
    var global = unsafeWindow;
    var my = {
        "name": "Legend Mod -> Agario Tool",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
        "tool_symbol": "A.T"
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
        "tgar_prefix": "☺",
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
        $.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
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
        local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
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
            '<div id="ao2t-hud">A.T:'+
                 ' <span id="ao2t-capture">🚫</span>'+
                 ' <span id="ao2t-config">⚙</span>'+
                 '<div id="ao2t-top5" style="padding-left: 1em;"></div>'+
            '</div>');
        $("#ao2t-capture").click(function(event){
            my.log("capture_click");
            stat.capture = ! stat.capture;
            if(stat.capture){
                if(global.ogario){
                    $("#ao2t-capture").text('💫');
                }else{
                    $("#ao2t-capture").text('🔙');
                }
                my.capture_start();
            }else{
                $("#ao2t-capture").text('🚫');
                my.capture_end();
            }
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
        $("#message-menu").append('<a href="#" id="ao2t-message" style="float:right;">'+ my.tool_symbol +'</a>');
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
        var msg = $("#message").val();
        if(msg.length){
            my.sendMinimapServerCommand({
                name: "chat",
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
        my.log("config_click2");
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
              my.name+
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
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="chat_alt"/>Alt→T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrlalt"/>Ctrl+Alt→O+T</label>'+
                '&nbsp;<label><input type="checkbox" data-ao2t-config="chat_ctrl"/>Ctrl→Close</label>'+
            '<br/>Other'+
              '<br/>&nbsp;<label><input type="checkbox" data-ao2t-config="skin_toggle_auto"/>skin auto toggle</label>'+
              '&nbsp;&nbsp;&nbsp;Frequency [milliseconds]:<input type="text" data-ao2t-config="skin_toggle_interval" style="width:6em;"/>'+
            '<br/>&nbsp;&nbsp;* Changes will be reflected after restart'+
            '');
        $("#ao2t-cfg-default").click(function(){
            my.cfg_load(cfg_org);
        });
        $("#ao2t-cfg-ok").click(function(){
            cfg = my.cfg_save();
            GM_setValue("config", JSON.stringify(cfg));
            my.config_cancel();
            $("#message-box").css("bottom", stat.messageBoxBottom[cfg.chat_vcenter ? 1: 0]);
            my.skinToggle_start();
         });
        $("#ao2t-cfg-cancel").click(function(){
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
		toastr["warning"]('<b>[SERVER]: </b>Legend Mod and Agar Tool successfully connected on <font color="blue">'+$("#server-token").val()+'</font> server. <br>Use A.T button on chat box to send to Agar.io Tool');
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
                my.log("chat:"+ cmd.playerName +":"+ cmd.message);
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
        var sep = '';
        var keys = Object.keys(stat.minimapBalls).sort();
        if(keys.length === 0){
            user_txt = "no tgar user";
        }
        for(var key; (key = keys.shift()); ){
            var ball = stat.minimapBalls[key];
            user_txt += sep + escapeHtml(ball.name);
            sep = '<br/>';
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


// ==UserScript==
// @name         AgarTool⇒Legend Mod （BETA）
// @name:ja      AgarTool⇒Legend Mod （ベータ）
// @name:en      AgarTool⇒Legend Mod （BETA）
// @version      0.7
// @namespace    http://tampermonkey.net/tannichi-at2o
// @description      Link Legend Mod to Agar Tool
// @description:ja   Agar Tool 上から Legend Mod へ情報連携します
// @description:en   link to Legend Mod on Agar Tool
// @author       tannichi & Jimboy3100
// @match        http://agar.io/*
// @grant        unsafeWindow
// ==/UserScript==
//// @grant GM_setValue
//// @grant GM_getValue

(function() {
    'use strict';
    var global = window.unsafeWindow || window;
    var my = {
        "name": "Agario Tool -> Legend Mod",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
        "tool_symbol": "L.M"
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
		"chatColorNorm": "#FFFF00",
		"chatColorCommand": "#FF4400",
        // -----  for Legend Mod Ver.4  ----
        "mapSize": 14142, // ogario.mapSize,
        "mapOffset": 7071, // ogario.mapOffset,
        // -----  style  -----
		"darkThemeHudCss": {"color": "#C0C0C0"},
		"darkThemeControllerCss": {"color": "#E0E0E0"},
        "messageBoxCss": [{"bottom":"13px"},{"bottom": "40%"}],
		"chatTableSlimCss": [{"border-spacing":"0 8px"},{"border-spacing":"0 2px"}],
        // -----  other  -----
        "pi2": 0x2 * Math.PI,
        "keyCodeEnter": 13, // Enter
        "keyCodeA": 65, // 'A'
        "keyCodeR": 82, // 'R'
        "keyCodeS": 83, // 'S'
    };
    var cfg= {}, cfg_org = {
        "user_show": true,
        "minimap_show": true,
        "ogar_prefix": "L.M",
        "ogar_color": "#8C81C7",
        "update_interval": 1000,
        "tgar_prefix": "☺",
        "tgar_user": true,
        "ogar_skinURL": "",
        "chat_close": false,
        "chat_unpause": true,
        "chat_vcenter": false,
        "chat_alt": true,
        "chat_ctrlalt": true,
        "chat_ctrl": true,
		"chat_slim": false,
		"chat_emoticon": true,
		"chat_image": true,
		"chat_video": false,
    };
    function pre_loop(){
        // At this point jQuery can not be used
        if(! document.getElementById("chatMessagesContainer")
				|| ! document.getElementById("settingsButton")
				|| ! global.AgarTool
				|| ! global.AgarTool.settings
				|| ! global.AgarTool.settings.checkboxes){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for AgarTool load");
            return;
        }
        // Just to be sure, another 1 sec wait
        //setTimeout(initialize, 1000);
		loadScript("http://jimboy3100.github.io/ExampleScripts/libLM.user.js", initialize);
    }
    pre_loop();

    function initialize(){
		//$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
		$.extend(cfg, cfg_org, JSON.parse(my.storage_getValue("config",'{}')));
        global.at2o = {my:my, stat:stat, cfg:cfg};
        var local_style = '';
        local_style += '#at2o-hud {';
        local_style +=     ' font-size: 80%; pointer-events: auto;';
        local_style += '}';
        local_style += '#at2o-hud * {';
        local_style +=     ' user-select: auto!important;';
        local_style += '}';
        local_style += '#at2o-cfg-dlg {';
        //local_style +=     ' border-radius:0; font-size: 80%; padding: 2px 10px; position: fixed;';
        //local_style +=     ' pointer-events: auto; background-color: rgba(32,32,32,0.4); color: #ffffff;';
        //local_style +=     ' overflow: hidden;';
        local_style += '}';
        local_style += '#at2o-cfg-dlg * {';
        local_style +=     ' width: auto; user-select: auto!important; pointer-events: auto;';
		//local_style +=     ' position: relative; float: initial;';
		//local_style +=     ' display: run-in;'; // NG
		local_style += '}';
		local_style += '#at2o-cfg-dlg input {';
		//local_style +=     ' background-color: rgba(0,0,0,0.4); color: #ffffff;';
		local_style += '}';
		local_style += '.at2o-emoticon {';
		local_style +=     ' width: 1.25em; height: auto; vertical-align: middle;';
		local_style += '}';
		$("head").append('<style>\n'+ local_style +'\n</style>');
		$("#messageTempContainer").append(''+
			'<div id="at2o-hud">'+
				'<div id="at2o-top5" style="padding-left: 1em;"></div>'+
			'</div>');
		$("#connect").after(''+
			'<div id="at2o-controller">A.T->L.M:'+
			  '<span id="at2o-capture">🚫</span>'+
			  '<span id="at2o-config">⚙</span>'+
			'</div>');
		// ダークテーマ
		try{
			if(global.AgarTool.settings.checkboxes.darkTheme){
				$("#at2o-hud").css(stat.darkThemeHudCss);
				//$("#at2o-controller").css(stat.darkThemeControllerCss);
			}
		}catch(e){}
		// Prevent mouse click from propagating
		$("#at2o-controller").mousedown(function(event){ return false;});
		$("#at2o-capture").click(function(event){
			my.log("capture_click");
			stat.capture = ! stat.capture;
			if(stat.capture){
				$("#at2o-capture").text('💫');
				my.capture_start();
			}else{
				$("#at2o-capture").text('🚫');
				my.capture_end();
			}
		});
		$("#at2o-config").click(my.config);
		my.config_apply();
		// --- Reconnect ---
		//$("#settingsButton").after(''+	// $("#connect").before
		$("#server").after(''+
			'<button id="at2o-reconnect" class="btn btn-primary"'+
			' style="float:left;">🎲</button>'+
			'').css('width', '50%');
        $("#at2o-reconnect").click(function(event){
			my.log("reconnect_click");
	        if(global.MC && global.MC.reconnect){
				global.MC.reconnect();
			}
		});
		// --- chat close ---
		if(cfg.chat_close){
			$("#message-menu").append('<a href="#" id="at2o-chat-close" style="float:right;">X</a>');
			$("#at2o-chat-close").click(function(){
				my.chatClose();
			});
		}
		//$("#enterChatMsg").keydown(function(event){
		stat.initialized = true;
		//let chatElem = $("#enterChatMsg").get(0);
		//chatElem.addEventListener('keydown', function(event){
		//Element.prototype.addEventListener.call(chatElem, 'keydown', function(event){
		//document.addEventListener('keydown', function(event){
		$(".emojionearea-button").before(''+
			'<div style="position: absolute;right: 30px;top:4px;">'+
				'<span id="at2o-chat-close" title="emergency close">✕</span>'+
				'&nbsp;'+
				'<span id="at2o-chat-send" title="Send to Legend Mod">L.M</span>'+
			'</div>');
		$("#at2o-chat-send").mousedown(function(event){
			my.chatSend({"clear": true});
		});
		$("#at2o-chat-close").mousedown(function(event){
			my.chatClose();
			return my.chatCancel(event);
		});
		// test
		//$(document).mousedown(function(ev){
		//	my.log("test mousedown");
		//	keyDownUp(stat.keyCodeS);
		//});
	}
	my.capture_start = function(){
		// If not, add chat submit button
		if($("#at2o-minimap").length){
			//$("#at2o-message").show(); // .prop('disabled', false);
			$("#at2o-minimap").show();
		}else{
			my.capture_init();
		}
		// Connection
		let tgar_prefix = (cfg.ogar_skinURL ? "" : cfg.tgar_prefix);
		var opt = {
			"tag": $('#tag').val(),
			"nick": tgar_prefix + $('#nick').val(),
			"serverToken": $('#server').val(),
			"skinURL": cfg.ogar_skinURL,
		};
		stat.ogar = global.lib_ogar.create(opt);
		stat.ogar.onchat = function(ev){
			//$('#chat').text(escapeHtml(ev.message));
			//my.log("chat:"+ ev.message);
			my.tgarChatAdd(ev);
		};
        stat.update_timerid = setInterval(my.update, cfg.update_interval);
    };
    my.capture_end = function(){
        //$("#at2o-message").hide(); // .prop('disabled', true);
        $('#at2o-top5').html('');
        $("#at2o-minimap").hide();
		stat.ogar.disconnect();
		stat.ogar = null;
        clearInterval(stat.update_timerid);
        stat.update_timerid = null;
    };
    my.capture_init = function(){
        //$("#message-menu").append('<a href="#" id="at2o-message" style="float:right;">'+ my.tool_symbol +'</a>');
        //$("#at2o-message").click(my.chatSend);
        // minimap
        var minimap = $("#minimap");
        var minimapWidth = minimap.attr('width');
        var minimapHeight = minimap.attr('height');
		minimap.before('<canvas id="at2o-minimap"'+
			' style="position: absolute;bottom: 0px;right: 0px;"'+
			' width="'+ minimapWidth +'" height="'+ minimapHeight +'">');
        //stat.minimapOffsetX = stat.minimapOffsetY + minimapHeight - minimapWidth;
    };
    my.update = function(){
        var tgarAlive = my.tgarIsAlive();
        if(tgarAlive != stat.alive){
            my.ogarAlive(tgarAlive);
        }
        if(stat.alive){
            my.ogarReposition();
        }
        my.tgarMinimapUpdate();
    };

    // -----  Configuration  -----
    my.config = function(){
        my.log("config_click2");
        if(!($('#at2o-cfg-start').length)){
            my.config_init();
        }
        my.cfg_load(cfg);
        //$("#at2o-cfg-dlg").show();
        //$("#overlays").show();
    };
    my.config_init = function(){
        //$("#overlays").append('<div id="at2o-cfg-dlg"'+
        $("#at2o-controller").after(''+
			'<hr id="at2o-cfg-start" />'+ my.name+ '<br/>'+
			''+
            '&nbsp;&nbsp;&nbsp;Update frequency [milliseconds]:<input type="text" data-at2o-config="update_interval" style="width:6em;"/>'+
            '<br/>Legend Mod Obtained from'+
            '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="user_show"/>user list</label>'+
            '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="minimap_show"/>minimap</label>'+
              '&nbsp;Prefix:<input type="text" data-at2o-config="ogar_prefix" style="width:4em;"/>'+
              '&nbsp;&nbsp;color:<input type="text" data-at2o-config="ogar_color" style="width:6em;"/>'+
            //    '<span class="input-group-addon"><i id="tgar_color" style="background-color: rgb(0, 0, 0);"></i></span>'+
            '<br/>Sent to Legend Mod'+
            '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="tgar_user"/>user info</label>'+
              '&nbsp;Prefix:<input type="text" data-at2o-config="tgar_prefix" style="width:4em;"/>'+
              '<br/>&nbsp;skin:<input type="text" data-at2o-config="ogar_skinURL" style="width:20em;"/>'+
            '<br/>Chat option'+
              '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_close"/>close</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_unpause"/>unpause</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_vcenter"/>vcenter</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_slim"/>slim</label>'+
              '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_emoticon"/>emoticon</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_image"/>image</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_video"/>video</label>'+
			  '<br/>&nbsp;<label><input type="checkbox" data-at2o-config="chat_alt"/>Alt→T</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_ctrlalt"/>Ctrl+Alt→O+T</label>'+
                '&nbsp;<label><input type="checkbox" data-at2o-config="chat_ctrl"/>Ctrl→Close</label>'+
            '<br/>&nbsp;&nbsp;* Changes will be reflected after restart'+
			''+
			'<br/>'+
              '&nbsp;<span id="at2o-cfg-default" class="btn btn-primary">DEFAULT</span>'+
              '&nbsp;<span id="at2o-cfg-ok" class="btn btn-success">OK</span>'+
              '&nbsp;<span id="at2o-cfg-cancel" class="btn btn-danger">CANCEL</span>'+
			''+
		    '<hr id="at2o-cfg-end" />');
		//$("#at2o-cfg-dlg").mousedown(function(event){ return false;});
        $("#at2o-cfg-default").click(function(){
            my.cfg_load(cfg_org);
        });
        $("#at2o-cfg-ok").click(function(){
			cfg = my.cfg_save();
			//GM_setValue("config", JSON.stringify(cfg));
			my.storage_setValue("config", JSON.stringify(cfg));
			my.config_cancel();
			my.config_apply();
		});
		$("#at2o-cfg-cancel").click(function(){
			my.config_cancel();
		});
		my.config_cancel = function(){
			//$("#overlays").hide();
			//$("#at2o-cfg-dlg").hide();
			let elem = $("#at2o-cfg-start").get(0);
			let elemParent = elem.parentNode;
			let delList = [elem];
			for(;;){
				elem = elem.nextSibling;
				if(!elem){
					return;
				}
				delList.push(elem);
				if(elem.id == "at2o-cfg-end"){
					delList.forEach(function(elemDel){
						elemParent.removeChild(elemDel);
					});
					return;
				}
			}
		};
		//$("#tgar_color").colorpicker({'format': 'hex'}).on('changeColor.colorpicker', function(event){
		//    var id = event.target.id;
		//    $('[data-at2o-config="'+ id +'"]').val(event.color.toHex());
		//    event.target.style.backgroundColor = event.color.toRGB();
		//});
	};
	my.config_apply = function(){
		$(".enterChatMsg").css(stat.messageBoxCss[cfg.chat_vcenter ? 1: 0]);
		$("#messageTableComplete, #messageTableTemp")
			.css(stat.chatTableSlimCss[cfg.chat_slim ? 1 : 0]);
		if(cfg.chat_slim){
			my.chatObserver_start();
		}else{
			my.chatObserver_stop();
		}
	};

    // -----  chat  -----
	my.document_keydown = function(event){
		if(! stat.initialized){
			return false;
		}
		var modify = (event.altKey ? "a" : "")+
			(event.ctrlKey ? "c" : "")+
			(event.metaKey ? "m" : "")+
			(event.shiftKey ? "s" : "");
		//my.log("keydown which="+ event.which +", modify="+ modify);
		if(event.which != stat.keyCodeEnter || !global.writeChatMessage){
			return;
		}
		if(event.keyCode === stat.keyCodeEnter){
			if(modify === "a" && cfg.chat_alt){
				my.chatSend();
				return my.chatCancel(event);
			}else if(modify === "ac" && cfg.chat_ctrlalt){
				//my.chatSend({"tgar":true});
				//return false;
				my.chatSend({"noClose": true});
				return;
			}else if(modify === "c" && cfg.chat_ctrl){
				my.chatClose();
				return my.chatCancel(event);
			}
		}
		return; // Pass the processing to another handler
	};
	document.addEventListener('keydown', my.document_keydown, true);
	my.chatSend = function(flg_){
		var flg = flg_ || {};
		if(! my.isConnected){
			//global.toastr.error("A.T->L.M: not connected");
			return;
		}
		//var msg = $("#enterChatMsg").val();
		var msg = global.emojiHandler[0].emojioneArea.getText();
		if(msg.length){
			stat.ogar.chatSend(msg);
			//if(flg.tgar){
			//	keyDownUp(stat.keyCodeEnter);
			//}else{
			//$("#enterChatMsg").hide();
			//}
			if(flg.clear){
				global.emojiHandler[0].emojioneArea.setText("");
			}
		}
		if(! flg.noClose){
			$("#chatInputHolder").hide();
		}
	};
	my.chatClose = function(){
		//$("#enterChatMsg").css("display", "none");
		$("#chatInputHolder").hide();
		if(cfg.chat_unpause && global.AgarTool.stopMovement){ // Release during PAUSE
			//keyDownUp(stat.keyCodeS);
			global.AgarTool.stopMovement = false;
		}
	};
	my.chatCancel = function(event){
		global.emojiHandler[0].emojioneArea.setText("");
		event.preventDefault();
		event.stopPropagation(); // Unknown why this is necessary
		return false;
	};
	my.chatObserver_start = function(){
		if(stat.obs_chat){
			return;
		}
		stat.obs_chat = new MutationObserver((mutations) => {
			my.log("hist changed");
			mutations.forEach((mutation) => {
				for(let node of mutation.addedNodes){
					$(node).css('height', '');
				}
				//$(mutation.target).children("tr").css('height', '');
			});
		});
		$("#messageTableComplete, #messageTableTemp")
			.each(function(){
			var table = this;
			stat.obs_chat.observe(table, {"childList": true});
			do_observe();
			function do_observe(){
				if(table.tBodies.length == 0){	// Uninitialized
					setTimeout(do_observe, 5000);
				}else{
					let tbody = table.tBodies[0];
					stat.obs_chat.observe(tbody, {"childList": true});
					$(tbody).children("tr").css('height', '');
				}
			}
		});
	};
	my.chatObserver_stop = function(){
		if(stat.obs_chat){
			stat.obs_chat.disconnect();
			delete stat.obs_chat;
		}
	};
	my.chatParse_imgRe = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
	my.chatParse_videoRe = /\[yt\]([\w-]{11})\[\/yt\]/i;
	my.chatParse_emoticon = {
		':)': "smile.svg",
		';)': "wink.svg",
		'=)': "smirk.svg",
		':D': "grin.svg",
		'X-D': "xgrin.svg",
		'=D': "joy.svg",
		':(': "sad.svg",
		';(': "cry.svg",
		':P': "tongue.svg",
		';P': "tonguew.svg",
		':*': "kiss.svg",
		'$)': 'smileh.svg',
		'<3': "heart.svg",
		'8=)': "cool.svg",
		':o': "astonished.svg",
		'(:|': "sweat.svg",
		':|': "neutral.svg",
		':\\': "unamused.svg",
		':@': "pouting.svg",
		'|-)': "sleep.svg",
		'^_^': "relaxed.svg",
		'-_-': 'expressionless.svg',
		'$_$': "money.svg",
		'O:)': "angel.svg",
		'3:)': 'devil.svg',
		'(poop)': 'poo.svg',
		'(fuck)': "finger.svg",
		'(clap)': 'clap.svg',
		'(ok)': "ok.svg",
		'(victory)': 'victory.svg',
		'(y)': "thumb.svg",
		'(n)': 'thumbd.svg'
	};
	my.chatParse = function(msg){
		var imgRs = my.chatParse_imgRe.exec(msg);
		if(imgRs){
			if(cfg.chat_image){
				return '<img src="' + imgRs[1] + '" style="width:100%;border:none;">';
			}else{
				return "[IMG]";
			}
		}
		var videoRs = my.chatParse_videoRe.exec(msg);
		if(videoRs){
			if(cfg.chat_video){
				return '<iframe type="text/html" width="100%" height="auto" src="http://www.youtube.com/embed/'+
					videoRs[1] + '?autoplay=1&amp;vq=tiny" frameborder="0" />';
			}else{
				return "[VIDEO]";
			}
		}
		msg = escapeHtml(msg);
		if(cfg.chat_emoticon){
			msg = msg.replace(/\&lt\;3/g, '<3')
				.replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g,
					function(match) {
						return '<img src="http://cdn.ogario.ovh/static/emoticons/' + my.chatParse_emoticon[match] + '" alt="' + match + '" class="at2o-emoticon">';
			});
		}
		return msg;
	};

	// =====  Legend Mod communication processing / connection  =====
	my.isConnected = function(){
		return	stat.ogar && stat.ogar.isConnected();
	};
	// =====  Agar Tool communication processing / processing  =====
	my.ogarAlive = function(alive){
		stat.alive = alive;
		if(cfg.tgar_user){
			//my.log("alive -> "+ stat.alive +" name="+ cfg.ogar_prefix + stat.nick);
			if(stat.alive){
			//	stat.alive = my.sendMinimapServerCommand({
			//		name: "alive",
			//		playerName: cfg.ogar_prefix + stat.nick
			//	});
			//	//my.log("alive >>"+ stat.alive);
			}else{
			//	my.sendMinimapServerCommand({
			//		name: "dead"
			//	});
				stat.ogar.sendPlayerPosition(0, 0, 0);
			}
		}
	};
	my.ogarReposition = function(){
		stat.ogar.sendPlayerPosition(AgarTool.realPlayerX, AgarTool.realPlayerY, 1);
	};

    // =====  Legend Mod Processing  ======
    my.tgarChatAdd = function(ev){
		stat.chatIdx = (stat.chatIdx ? stat.chatIdx + 1 : 1);
		let chatID = "at2o-chat-"+ stat.chatIdx;
		let chatBorderColor = (ev.isCommand ? stat.chatColorCommand : stat.chatColorNorm);
		let trStyle = 'color:#FFF;background-color:rgba(0,0,0,0.4);';
		if(! cfg.chat_slim){
			trStyle = 'height:40px;'+ trStyle;
		}
		if (ev.message.includes("Welcome! You are connected to the OGARio")){
		ev.message="[SERVER]: Agar Tool and Legend Mod connected. Use L.M button on chat box to send to Legend Mod";

		}
		let msg = my.chatParse(ev.message);
		let htmlTd = '<td style="padding-left:8px;padding-right:8px">'
			+ '<b><span class="playerNameInMsg">' + escapeHtml(ev.nick)
			+ '</span></b></td>'
			+ '<td style="border-left: solid '+ chatBorderColor
				+';padding-left: 8px;padding-right:8px;'
				+'vertical-align:middle;width:260px;max-width:260px;'
				+'word-wrap: break-word;">'
				+ msg + '</td>';
		let htmlTmp = '<tr id="' + chatID + '" style="'+ trStyle +'">'
			+ htmlTd +'</tr>';
		let htmlCmp = '<tr style="'+ trStyle +'">'
			+ htmlTd +'</tr>';
		$("#messageTableTemp").append(htmlTmp);
		$("#messageTableComplete").append(htmlCmp);
		var scrollTop = $("#messageCompleteContainer")[0].scrollHeight
			- $("#messageCompleteContainer").height();
		$("#messageCompleteContainer")[0].scrollTop = scrollTop;
		$("#messageCompleteContainer").perfectScrollbar("update");
		setTimeout(function(){
			$("#" + chatID).fadeOut(100, function(){
				$("#" + chatID).remove();
			});
		}, 5e3);
    };
    my.tgarMinimapUpdate = function(){
		let ogar = stat.ogar;
		if(! ogar){
			return;
		}
		var minimap_elem = document.getElementById("at2o-minimap");
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
		var sep = '';
		var timeLate = Date.now() - 0x7d0;
		//let players = ogar.teamPlayers.concat()
		//	.filter(function(x){
		//		return x.alive && x.updateTime > timeLate && x.mass > 0;
		//	}).sort(function(x, y){return y.mass - x.mass;});
		let players = ogar.getPlayerList();
		if(players.length === 0){
			user_txt = "no tgar user";
		}
		for(let player; (player = players.shift()); ){
			user_txt += sep + player.mass +" "+ escapeHtml(player.nick);
			sep = '<br/>';
			if(cfg.minimap_show){
				var name = cfg.ogar_prefix + player.nick;
				var mapX = (player.x + mapOffset) * minimapMulti + mapOffsetX;
				var mapY = (player.y + mapOffset) * minimapMulti + mapOffsetY;
				ctx.textAlign = 'center';
				ctx.lineWidth = stat.minimapNickStrokeSize;
				ctx.strokeStyle = stat.minimapNickStrokeColor;
				ctx.strokeText(name, mapX, mapY + mapOffsetT);
				ctx.fillStyle = cfg.tgar_color; // stat.minimapNickColor
				ctx.fillText(name, mapX, mapY + mapOffsetT);
				ctx.beginPath();
				ctx.arc(mapX, mapY, stat.minimapTeammatesSize, 0x0, stat.pi2, !0x1);
				ctx.closePath();
				ctx.fillStyle = player.color;
				ctx.fill();
			}
		}
		if(cfg.user_show){
			$('#at2o-top5').html(user_txt);
		}
	};
	// --- for Agar Tool ----
	my.tgarIsAlive = function(){
		return global.AgarTool ? global.AgarTool.isAlive : false;
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
		$('[data-at2o-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-at2o-config');
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
		$('[data-at2o-config]').each(function(){
			var elem = $(this);
			var type = elem.prop('type');
			var name = elem.attr('data-at2o-config');
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

	function keyDownUp(keyCode){
		$(document).trigger(jQuery.Event('keydown',{ "keyCode": keyCode, "which": keyCode } ));
		$(document).trigger(jQuery.Event('keyup',{ "keyCode": keyCode, "which": keyCode } ));
		//$(document).trigger('keydown',{"keyCode":keyCode, "which":keyCode});
		//$(document).trigger('keyup',{"keyCode":keyCode, "which":keyCode});
	}
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
