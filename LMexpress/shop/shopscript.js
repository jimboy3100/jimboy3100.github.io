//v0.4o

//$(document).ready(function() {
jQuery(function($) {

	setTimeout(function() {
		
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

    $("img.lazy").on("click", function(e) {
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
		toastr.info("<b>[SERVER]:</b> Special Effect erased");
		if (document.getElementsByClassName("skins-wrapper")[4].children[0]) document.getElementsByClassName("skins-wrapper")[4].children[0].remove()
			SpecialEffectPlayers[application.lastSentNick]=null
			//
			animatedskins[application.lastSentNick] = null
			//
			localStorage.setItem("isActualUsingSpecialEffectsSkin", null);
			window.application.sendSocket3Info("spfc", null)		
    });	
	setTimeout(function() {
		$("#nav a")[0].click();
		startSpecialEffectSkin();
	}, 950);
	}, 900);
});

function startSpecialEffectSkin(){
	if (localStorage.getItem("isActualUsingSpecialEffectsSkin")){
			try {	
			for (var i = 0; i < $(".skins-wrapper").length; i++){
				if ($(".skins-wrapper")[i].style.display != "none"){
					
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++){
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==localStorage.getItem("isActualUsingSpecialEffectsSkin")){ 
							if (document.getElementsByClassName("skins-wrapper")[4].children[0]) document.getElementsByClassName("skins-wrapper")[4].children[0].remove()
							document.getElementsByClassName("skins-wrapper")[4].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
						} 
				}			
			}			
		} catch (e) {}	
}

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
		} catch (e) {}	
	}
}
