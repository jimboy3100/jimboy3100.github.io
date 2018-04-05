setTimeout(function() {
$("#canvas").remove();
$("#adsBottom").remove();
$("#rightPanel").remove();
$(".agario-panel.agario-side-panel.agario-profile-panel").remove();
$("#dailyquests-panel").remove();
$("#v-ex-menu").remove();
$(".radio-module").remove();
$(".tosBox.right").remove();
$(".tosBox.left").remove();
$(".form-group.clearfix").remove();
$("#skinCustomButton").remove();
$("#settings").remove();
$("#vanilla-home-link").remove();
$("#settingsButton").remove();
$("#instructions").remove();
$(".btn.btn-play.btn-primary").remove();
$(".btn.btn-play-guest.btn-success").remove();
$(".btn.btn-warning.btn-login-play").text("Login");
$(".btn.btn-warning.btn-login-play").css("margin-left", "80px");
$("#helloContainer").css("margin-left", "-150px");
$('.agario-panel.agario-side-panel.agario-shop-panel').append('<button id="logoutbtn" onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout">Logout</button>');
$("#imagebig").remove();

}, 7000);
