let _0xdff2,
	favicon_link_html;
(function () {
	function c() {
		$('title').html('MGx One ~ OGARio');
		toastr.info('Welcome to MGx One ~ OGARio');
		toastr.info('Created by Richy (Mingo MGx) | MGx-One.nl');
		$('#leaderboard-hud > h4').text('Leaderboard');
		$('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
		$('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');
		$('.hud-main-color.team-top-menu a:nth-child(2)').click();
		$('.team-top-menu').remove('');
		$('#overlays').append('<div id="panelmgx"></div>');
		$('#panelmgx').append('<div id="panelm"></div>');
		$('#panelm').append('<div id="panelg"></div>');
		$('#overlays').append('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Theme</h4></div><div class="modal-body" id="themepopup"></div></div></div></div>');
		$('#panelg').append('<button class="btnmgx btn-theme" data-toggle="modal" data-target="#myModal"><div class="btncnt" style=" transform: skew(15deg)!important; "><i style=" position: relative; top: 5px; " class="material-icons">&#xE40A;</i><p style=" margin-top: -5px; " class="btnt">Theme</p></div></button>');
		$('#themepopup').append($('#theme'));
		$('#overlays').append('<div class="modal fade" id="mySettings" tabindex="-1" role="dialog" aria-labelledby="mySettingsLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="mySettingsLabel">Settings</h4></div><div class="modal-body" id="settingpopup"></div></div></div></div>');
		$('#overlays').append('<div class="modal fade" id="mySkins" tabindex="-1" role="dialog" aria-labelledby="mySettingsLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="mySkinsLabel">Skins</h4></div><div class="modal-body" id="skinspopup"></div></div></div></div>');
		$('#overlays').append('<div class="menu-bar"> <div class="menu-bar-button" id="login-facebook"> <i class="fa fa-facebook"></i> </div> <div class="menu-bar-button" id="login-google"><i class="fa fa-google-plus"><span data-itr="page_menu_login_google"></span></i></div> <div class="menu-bar-button" id="logout"> <i class="fa fa-sign-out"></i> </div> <div class="menu-bar-ip" id="ip-box">127.1.1.0</div> </div>');
		$('#panelg').append('<button class="btnmgx btn-setting" data-toggle="modal" data-target="#mySettings"><div class="btncnt" style=" transform: skew(15deg)!important; "><i style=" position: relative; top: 5px; " class="material-icons">&#xE429;</i><p style=" margin-top: -5px; " class="btnt">Settings</p></div></button>');
		$('#settingpopup').append($('#og-settings'));
		$('#skinspopup').append($('#skins'));
		// $('#minimap-sectors').replaceWith('<div class="minimap-sectors" style="width: 205px;height: 205px;opacity: .3;"> <div class="minimap-row" style="width: 220px;height: 40px;"> <div class="minimap-sector">A1</div> <div class="minimap-sector">A2</div> <div class="minimap-sector">A3</div> <div class="minimap-sector">A4</div> <div class="minimap-sector">A5</div> </div> <div class="minimap-row" style="width: 220px;height: 40px;"> <div class="minimap-sector">B1</div> <div class="minimap-sector">B2</div> <div class="minimap-sector">B3</div> <div class="minimap-sector">B4</div> <div class="minimap-sector">B5</div> </div> <div class="minimap-row" style="width: 220px;height: 40px;"> <div class="minimap-sector">C1</div> <div class="minimap-sector">C2</div> <div class="minimap-sector">C3</div> <div class="minimap-sector">C4</div> <div class="minimap-sector">C5</div> </div> <div class="minimap-row" style="width: 220px;height: 40px;"> <div class="minimap-sector">D1</div> <div class="minimap-sector">D2</div> <div class="minimap-sector">D3</div> <div class="minimap-sector">D4</div> <div class="minimap-sector">D5</div> </div> <div class="minimap-row" style="width: 220px;height: 40px;"> <div class="minimap-sector">E1</div> <div class="minimap-sector">E2</div> <div class="minimap-sector">E3</div> <div class="minimap-sector">E4</div> <div class="minimap-sector">E5</div> </div> </div>');
		$('#ip-box').text($('#server-ws').val());
		setInterval(() => {
			$('#skin-popover').attr('data-toggle', 'modal');
			$('#skin-popover').attr('data-target', '#mySkins');
			$('#ip-box').text($('#server-ws').val());
		}, 1200);
		$('#panelg').append($('#skin-preview'));
		$('#panelg').append($('#helloContainer[data-logged-in="1"] .btn-play'));
		$('#panelg').append($('#helloContainer[data-logged-in="0"] .btn-play-guest'));
		$('.btn-play-guest').attr('class', 'btnmgx btn-play-guest');
		$('.btn-play-guest').empty();
		$('#panelg').append('<button class="btnmgx btn-pley" type="submit" data-itr="page_play" data-itr="page_play_as_guest" ><div class="btncnt" style=" transform: skew(15deg)!important; "><i style=" position: relative; top: 5px;" class="material-icons">&#xE037;</i><p style=" margin-top: 0px; " >Play</p></div></button>');
		$('#panelg').append($('.btn-spectate'));
		$('.btn-spectate').attr('class', 'btnmgx spectate-btn');
		$('.spectate-btn').empty();
		$('.spectate-btn').append('<div style=" transform: skew(15deg)!important; "><i style=" position: relative; top: 5px;" class="material-icons">&#xE8F4;</i><p style=" margin-top: 0px; " class="btnt">Spectate</p></div>');
		$('#panelg').append('<button class="btnmgx btn-hotkey data-itr="page_spectate"><div class="btncnt" style=" transform: skew(15deg)!important; "><div href="#" class="hotkeys-link" data-toggle="tab-tooltip" title="" data-original-title="Hotkeys"><i style=" position: relative; top: 5px;" class="material-icons">&#xE312;</i><p style=" margin-top: 0px; " class="btnt">Inputs</p></div></div></button>');
		$('#overlays').append('<div id="panelx"></div>');
		$('#panelx').append($('#clantag, #nick, #skin, #gamemode, #region, #party-token, #join-party-btn-2, #create-party-btn-2'));
		$('#clantag').attr('placeholder', 'TAG');
		$('#party-token').attr('placeholder', 'PARTY');
		$('#top5-hud > h5').replaceWith('<h5 class="hud-main-color"><i class="fa fa-bars" aria-hidden="true" style="padding-right: 5px;"></i>Team Players</h5>');
		$('.ogicon-users').replaceWith('<span class="hud-main-color fa fa-play"></span>');
		$('.ogicon-pacman').replaceWith('<span class="hud-main-color fa fa-eercast"></span>');
		$('#og-options').before($('.btn-fb, .btn-gplus, .btn-logout'));
		$('head').append('<style type="text/css" id="HKmm">#minimap{height: 245px!important; width: 223px!important; margin-left: -9px; margin-top: -236px;}#minimap-hud{height: 205px!important;width: 205px!important;border-radius: 0px!important;background-color: rgba(36,36,36,0.63);border: 2px solid #333;}</style>');
		$('#overlays').append('<div id="radio" style=" bottom: 10px; position: fixed; left: 10px; "><audio src="http://frshoutcast.comunicazion.eu:8815/;" controls=""></audio></div>');
		$('#login-facebook').click(() => (master.facebookLogin(), !1));
		$('#login-google').click(() => {
			document.getElementById('gplusLogin').click();
			toastr.info('Logged in to Google+!');
		});
		$('#logout').click(() => (logout(), !1));
		$('.btn-pley').click(() => {
			document.querySelector('.btn-play').click();
			document.querySelector('.btn-play-guest').click();
		});
		$('.spectate-btn').click(() => {
			$('#overlays').attr('style', 'display: none;');
		});
		$('head').append(`<style>
					.close {
						color: #ff006e!important;
					}

					.btn-theme {
						background: #3a0030;
					}

					label:hover,
					.agario-panel input,
					.agario-panel select,
					.agario-side-panel input,
					.agario-side-panel select,
					.input-group-addon,
					.nick .input-group-btn,
					.skin .input-group-btn,
					#stream-mode,
					#hide-url,
					.menu-tabs a:hover,
					.menu-tabs .active,
					.submenu-tabs,
					#exp-bar .progress,
					#quick-menu a:hover,
					.quick,
					.select-wrapper,
					#hotkeys-cfg div.row:hover,
					#hotkeys-cfg .command-in,
					#exp-imp-settings textarea,
					.restore-settings {
						background-color: #1a0d30;
						border-color: #1a0d30;
					}

					.modal-content {
						background-color: #14062B;
						color: #fff;
					}

					.btn-hotkey {
						background: #4f0242;
					}

					.spectate-btn {
						background-color: #6b0036!important;
					}

					.btn-pley {
						background: #aa084e;
					}

					.btn-setting {
						background: #1a0d30;
					}

					#panelm {
						background-color: #14062B;
					}

					#panelmgx {
						background: rgba(26, 13, 48, 0.2);
					}

					#panelx {
						background-color: #14062B;
					}

					.form-control {
						background-color: #1a0d30;
					}

					#create-party-btn-2 {
						background-color: #aa084e!important;
					}

					#join-party-btn-2 {
						background-color: #6b0036!important;
					}

					</style>`);
		$('head').append(`<style>.menu-bar-button active {
						border-bottom: 2px solid #ff006e;
						text-shadow: 0px 0px 6px #fff, 0px 0px 25px #fff, 0px 0px 25px #fff;
					}

					.menu-bar-button:active {
						border-bottom: 2px solid #ff006e;
						text-shadow: 0px 0px 6px #fff, 0px 0px 25px #fff, 0px 0px 25px #fff;
					}

					.menu-bar-button:hover {
						border-bottom: 2px solid #ff006e;
						text-shadow: 0px 0px 6px #fff, 0px 0px 25px #fff, 0px 0px 25px #fff;
					}

					.menu-bar {
						width: 100%;
						height: 35px;
						position: fixed;
						background: rgba(26, 13, 48, 0.6);
						z-index: 1;
						color: #fff;
						font-size: 0px;
					}

					.menu-bar-button {
						display: inline-block;
						width: 63px;
						height: 35px;
						background: #14062b;
						padding-top: 10px;
						text-align: center;
						cursor: pointer;
						transition: text-shadow 0.25s;
						font-size: 16px;
						text-shadow: none;
					}

					.fa {
						display: inline-block;
						font: normal normal normal 14px/1 FontAwesome;
						font-size: inherit;
						text-rendering: auto;
						-webkit-font-smoothing: antialiased;
						-moz-osx-font-smoothing: grayscale;
					}

					#logout {
						border-radius: 0 20px 20px 0;
					}

					#ip-box {
						display: inline-block;
						color: #ffffff;
						float: right;
						font-size: 16px;
						font-family: ubuntu;
						height: 35px;
						padding: 8px;
						background: #14062b;
						box-shadow: 0px -5px 20px #000;
						border-radius: 20px 0 0 20px;
					}

					</style>`);
		$('head').append(`<style>.hud-top {
						top: 95.7%!important;
					}

					#stats-hud {
						left: 50%!important;
						transform: translateX(-50%)!important;
					}

					#skins a,
					#skins img,
					#skins .skin-box {
						width: 140px!important;
						height: 140px!important;
					}

					#skins .skin-box {
						position: relative;
						float: left;
						margin-right: 10px;
						margin-top: 25px;
						margin-left: 25px;
					}

					#skins a.selected,
					#skins a.selected img,
					#skins a:hover,
					#skins a:hover img {
						width: 145px;
						height: 145px;
					}

					.input-group-addon {
						border-radius: 0 20px 20px 0;
					}

					:focus {
						outline: -webkit-focus-ring-color auto 0px;
					}

					#skin {
						filter: blur(3px);
						-webkit-transition: .5s -webkit-filter linear;
					}

					#skin:hover {
						filter: blur(0px);
					}

					.restore-settings {
						margin-top: 6px;
					}

					.model-dialog,
					.btn,
					.restore-settings,
					#hotkeys {
						border-radius: 20px;
					}

					input.stream-mode,
					input.hide-url {
						color: #fff!important;
					}

					#helloContainer {
						opacity: 0!important;
						display: none;
					}

					.btn-logout {
						margin-bottom: 10px
					}

					.btn-play-guest {
						width: 100%;
						margin-bottom: 10px
					}

					.btn-gplus {
						margin-top: 10px
					}

					#helloContainer {
						opacity: 0
					}

					#theme,
					#og-settings {
						display: block
					}

					.btn-setting {
						width: 150px;
						cursor: pointer;
						margin-left: 530px;
						box-shadow: -10px 0 10px 0 rgba(0, 0, 0, 0.05)
					}

					.btn-theme {
						height: 100px!important;
						width: 120px;
						cursor: pointer;
						margin-left: 1194px;
						box-shadow: 10px 0 10px 0 rgba(0, 0, 0, 0.05)
					}

					#create-party-btn-2 {
						margin-left: 10px
					}

					#party-token {
						width: 90px!important;
						margin-top: 10px
					}

					#join-party-btn-2,
					#create-party-btn-2 {
						width: 100px!important;
						margin-top: 10px;
						border-radius: 20px
					}

					#gamemode {
						float: left;
						width: 75px;
						margin-top: 10px!important
					}

					#region {
						margin-top: 10px;
						width: 225px;
						float: right
					}

					#skin {
						margin-top: 42px!important
					}

					#nick {
						width: 240px!important;
						float: right
					}

					#clantag {
						width: 60px!important;
						float: left
					}

					.form-control {
						height: 32px;
						padding: 8px;
						font-size: 14px!important;
						color: #fff;
						border: 0!important;
						border-radius: 20px
					}

					#panelx {
						width: 330px;
						padding: 10px;
						height: 183px;
						z-index: 300;
						border-radius: 20px;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, 130px);
					}

					.btn-hotkey {
						height: 100px!important;
						width: 120px;
						cursor: pointer;
						margin-left: 231px
					}

					#chat-box {
						z-index: 199
					}

					#skin-preview img {
						width: 200px;
						height: 200px;
						margin-top: -9px;
					}

					#skin-preview {
						z-index: 300;
						position: relative;
						margin-left: 643px;
						width: 200px;
						height: 200px;
						margin-top: -50px
					}

					.spectate-btn {
						height: 100px!important;
						width: 120px;
						cursor: pointer;
						margin-left: 112px
					}

					.material-icons {
						font-size: 35px
					}

					.btnt {
						font-size: 13px;
						font-style: normal;
						margin-bottom: 5px
					}

					#overlays {
						position: fixed;
						background: url(https://i.imgur.com/QUaD9yc.png);
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						z-index: 200
					}

					.btnmgx {
						height: 100px!important;
						position: absolute;
						bottom: 50px;
						transform: skew(-15deg);
						border: none;
						color: #fff;
						text-transform: Uppercase;
						font-weight: 700
					}

					.btn-pley {
						width: 140px;
						cursor: pointer;
						margin-left: 815px;
						display: block;
					}

					#panelm {
						height: 100px;
						transition: all .75s ease-in-out;
						margin-top: 50px;
						width: 100%
					}

					#panelmgx {
						width: 100%;
						height: 200px;
						position: absolute;
						top: 50%;
						margin-top: -100px;
					}

					.modal-content {
						color: #fff
					}

					.submenu-tabs {
						border-radius: 20px;
						width: 100%!important
					}

					.colorpicker-element .add-on i,
					.colorpicker-element .input-group-addon i {
						border-radius: 50%
					}

					.modal-title {
						text-align: center
					}

					</style>`);
		$('head').append(`<style>#panelg {
						width: 845px;
						position: absolute;
						left: 20%;
						transform: translateX(-52%);
					}

					.btn-play,
					.btn-play-guest,
					.btn-fb,
					.btn-gplus,
					.btn-logout {
						display: none;
					}

					#fps-hud {
						display: inline-block;
						color: #828282;
						font-family: ubuntu;
						background: #333;
						padding: 3px 7px;
						font-size: 12px;
						font-weight: 600;
						border-radius: 1px 1px 0px 0px;
					}

					.minimap-sector {
						font-family: 'ubuntu';
						width: 35px;
						height: 40px;
						display: inline-block;
						text-align: center;
						padding-top: 10px;
						font-size: 15px;
						padding-left: 10px;
					}

					#target-hud {
						top: 10px;
					}

					#target-panel-hud {
						top: 16px;
					}

					#panelmgx {
						box-shadow: 1px 1px 27px 2px rgba(0, 0, 0, 0.62);
					}

					#skin-preview {
						box-shadow: 1px 3px 20px 6px rgba(0, 0, 0, 0.62);
					}

					#top5-hud {
						top: 10px!important;
						background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0))
					}

					#target-panel-hud {
						background-color: rgba(0, 0, 0, 0)
					}

					#leaderboard-hud h4 {
						font-size: 25px
					}

					.hud,
					.hud-b {
						border-radius: 20px
					}

					.modal-body {
						height: 732px
					}</style`);
		(function () {
			const d = CanvasRenderingContext2D.prototype.fillText;
			CanvasRenderingContext2D.prototype.fillText = function () {
				return arguments[0].startsWith('ogario.ovh') && (arguments[0] = ''), d.apply(this, arguments);
			};
		}());
	}
	favicon_link_html = document.createElement('link');
	favicon_link_html.rel = 'icon';
	favicon_link_html.href = 'http://mgx-one.nl/favicon-32x32.png';
	favicon_link_html.type = 'image/x-icon';
	try {
		document.getElementsByTagName('head')[0].appendChild(favicon_link_html);
	} catch (a) {}
	setTimeout(c, 1e3);
}(9619));
