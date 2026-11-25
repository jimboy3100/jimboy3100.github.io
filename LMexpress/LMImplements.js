setTimeout(function() {

        
$("#top5-hud").hide();
$("#leaderboard-hud").hide();
$("#shortcuts-hud").hide();
$("#rotate-hud").hide();
$("#exp-bar").hide();
$("#time-hud").hide();
$("#minimap-hud").hide();
$("#stats-hud").hide();
$("#target-hud").hide();
$("#target-panel-hud").hide();
$("#skins-panel").hide();
$(".TimesUsedPanel").hide();

$("#quick-menu").hide();
$("logout").after('<button id="logoutbtn" onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout">' + (window.lmT ? window.lmT('agario.page_logout') : 'agario.page_logout') + '</button>');

$(".btn.btn-warning.btn-login-play").insertAfter("#logout");
$(".btn.btn-warning.btn-login-play").text(window.lmT ? window.lmT('lmx.im.login') : 'lmx.im.login');
$("#socialLoginContainer").insertAfter("#logout");
$("#socialLoginContainer").css({
            marginTop: "0px",
			width: "80%",
			marginLeft: "10%"
        });
$(".btn.btn-warning.btn-login-play").css({
            marginTop: "0px",
			width: "80%",
			marginLeft: "10%",
			marginRight: "10%"
        });

		$("#legendbanners").hide();
		$("#LEGENDAds").hide();
		$(".ogicon-user").click();
		$(".menu-tabs").hide();
		toastr.clear();
		$("#menu-footer").hide();
		$("#donationbtn").hide();
		$("#canvas").remove();
		$("#SpecialDealsBtn").click(function () {
			                setTimeout(function() {
                    $(".close").click(function () {$("#specialShopModal").hide();});
                }, 1000);
		});
        

}, 5000);
