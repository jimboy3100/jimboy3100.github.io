//v0.4i

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
     $("#vanillaskins img.lazy").lazyload({
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
		if (document.getElementsByClassName("skins-wrapper")[2].children[0]) document.getElementsByClassName("skins-wrapper")[2].children[0].remove()
			SpecialEffectPlayers[application.lastSentNick]=null
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
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++)
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==localStorage.getItem("isActualUsingSpecialEffectsSkin")){ 
							if (document.getElementsByClassName("skins-wrapper")[2].children[0]) document.getElementsByClassName("skins-wrapper")[2].children[0].remove()
							document.getElementsByClassName("skins-wrapper")[2].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
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
		if (($("#nick").val().includes('℄') && $("#clantag").val() == window.atob(window.clanTagLc)) || window.proLicenceUID){
			try {	
			toastr.info("<b>[SERVER]:</b> Special Effect " + $("#skin-url").val() + " activated");
			for (var i = 0; i < $(".skins-wrapper").length; i++){
				if ($(".skins-wrapper")[i].style.display != "none"){
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++)
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==$("#skin-url").val()){ 
							if (document.getElementsByClassName("skins-wrapper")[2].children[0]) document.getElementsByClassName("skins-wrapper")[2].children[0].remove()
							document.getElementsByClassName("skins-wrapper")[2].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
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
			toastr.warning("<b>[SERVER]:</b> Not Premium account found. If you donated in the past, please refer it to Legend mod discord.<br>Thank you for using Legend mod!").css("width", "350px");
		}	
}
