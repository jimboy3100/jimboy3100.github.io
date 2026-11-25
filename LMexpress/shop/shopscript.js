//v0.4u

/* Every .lazyload() call binds a "scroll" and a "resize" handler on window and never removes
 * them (even for an empty selection), so each shop open left 12 more handlers looping over the
 * removed window's images. Keep the ones this window added; shop.js removes them before the
 * window is opened again or closed. */
window._lmShopLazyHandlers = window._lmShopLazyHandlers || [];
window._lmShopUnbindLazy = function () {
    var list = window._lmShopLazyHandlers;
    for (var i = 0; i < list.length; i++) jQuery(window).off(list[i].type, list[i].handler);
    window._lmShopLazyHandlers = [];
};
function _lmShopWindowHandlers() {
    var events = jQuery._data(window, "events") || {};
    var found = [];
    ["scroll", "resize"].forEach(function (type) {
        (events[type] || []).forEach(function (h) { found.push({ type: type, handler: h.handler }); });
    });
    return found;
}
/* shop.js counts the opens and this script runs while its own window is being added: keep
 * that count in a closure (a global would already hold the next open's count) */
(function (_lmShopThisOpen) {
//$(document).ready(function() {
jQuery(function($) {

setTimeout(function() {
    /* closed, or opened again, during the wait: the elements below belong to no window or to a newer one */
    if (_lmShopThisOpen !== window._lmShopOpenId || !document.getElementById("LMShop")) return;
    var _lmBefore = _lmShopWindowHandlers();

    $("#imgur img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
    
    $("#hizliresim img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
     $("#lowres img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });	
     $("#free img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });		
     $("#vanillaskins img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
     $("#animatedLikeGif img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
    /* the handlers the calls above added */
    _lmShopWindowHandlers().forEach(function (h) {
        var known = _lmBefore.some(function (b) { return b.type === h.type && b.handler === h.handler; });
        if (!known) window._lmShopLazyHandlers.push(h);
    });

    /* this window's skins only (it is the only place that shows lazy skin images) */
    $("#LMShop img.lazy").on("click", function(e) {
        e.preventDefault();
		var url = $(this).attr("name");
        $("#skin-url").val(url).select();
        try {
        } catch (e) {}
    });
    
    $("#skin-url").on("click", function(e) {
        $(this).select();
        try {
        } catch (e) {}
    });

	$("#nav a").on("click", function() {
        var _this = $(this);
        if (_this.hasClass("link")) {
            return;
        }
        $("#nav a").removeClass("active");
        _this.addClass("active");
        var id = _this.attr("href");
        $(".skins-wrapper").hide();
        $(id).show();
        $(window).scrollTop(0).trigger("scroll");
        return false;
    });
    $("#UseEffect").on("click", function(e) {
		loadSpecialEffectSkin(e)
    });
    $("#UseEffect2").on("click", function(e) {
		
		if (document.getElementsByClassName("skins-wrapper")[4].children[0]){
			document.getElementsByClassName("skins-wrapper")[4].children[0].remove()
			toastr.info(lmT('shop.erased'));
		}
			SpecialEffectPlayers[application.lastSentNick]=null
			//
			animatedskins[application.lastSentNick] = null
			//
			localStorage.setItem("isActualUsingSpecialEffectsSkin", null);
			window.application.sendSocket3Info("spfc", null)		
    });	
	//setTimeout(function() {
		if ($("#nav a")[0]){
			$("#nav a")[0].click();
		}
		startSpecialEffectSkin();
	//}, 950);
	}, 900);
});
})(window._lmShopOpenId);


function startSpecialEffectSkin(){
	if (localStorage.getItem("isActualUsingSpecialEffectsSkin")){
			try {	
			for (var i = 0; i < $(".skins-wrapper").length; i++){
				if ($(".skins-wrapper")[i].style.display != "none"){
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++)
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==localStorage.getItem("isActualUsingSpecialEffectsSkin")){ 
							if (document.getElementsByClassName("skins-wrapper")[4].children[0]) document.getElementsByClassName("skins-wrapper")[4].children[0].remove()
							document.getElementsByClassName("skins-wrapper")[4].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
						} 
				}			
			}	
			//if (application.lastSentNick == "") application.lastSentNick = $("#nick").val()
			//SpecialEffectPlayers[application.lastSentNick]=localStorage.getItem("isActualUsingSpecialEffectsSkin")
			//window.application.sendSocket3Info("spfc", localStorage.getItem("isActualUsingSpecialEffectsSkin"))	
		
			} catch (e) {}	
	}
}

function loadSpecialEffectSkin(e){
	if 	($("#skin-url").val()!= ""){
		if (($("#nick").val().includes('℄') && $("#clantag").val() == window.atob(window.clanTagLc)) || window.proLicenceUID || 
		($("#skin-url").val() == "Byzantium" || $("#skin-url").val() == "LegendHeroes" || $("#skin-url").val() == "LegendClan" || $("#skin-url").val() == "HappyNewYear" || $("#skin-url").val() == "ThanksGivings" || $("#skin-url").val() == "ChristmasTree" || $("#skin-url").val() == "Flag4July")
		|| window.tempAnimatedCoolArray.includes($("#skin-url").val())){
			try {	
			toastr.info(lmT('shop.activated', [String($('#skin-url').val() || '').replace(/[&<>"']/g, function(c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; })]));
			for (var i = 0; i < $(".skins-wrapper").length; i++){
				if ($(".skins-wrapper")[i].style.display != "none"){
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++)
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==$("#skin-url").val()){ 
							if (document.getElementsByClassName("skins-wrapper")[4].children[0]) document.getElementsByClassName("skins-wrapper")[4].children[0].remove()
							document.getElementsByClassName("skins-wrapper")[4].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
						} 
				}			
			}	
			//if (window.proLicenceUID){
				localStorage.setItem("isActualUsingSpecialEffectsSkin", $("#skin-url").val());
			//}
			//application.lastSentNick = $("#nick").val()
			//SpecialEffectPlayers[application.lastSentNick]=$("#skin-url").val()		
			//window.application.sendSocket3Info("spfc", $("#skin-url").val())	
		
			} catch (e) {}
		}
		else{
			toastr.warning(lmT('shop.notPremium')).css("width", "350px");
		}
	}
	else{
		toastr.warning(lmT('shop.noEffect')).css("width", "350px");
	}
}	
