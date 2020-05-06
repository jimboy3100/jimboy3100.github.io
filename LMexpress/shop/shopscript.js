//v0.8
$(document).ready(function() {
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
		
        //var url = $(this).attr("src");
        $("#skin-url").val(url).select();
        try {
            //document.execCommand("copy");
        } catch (e) {}
    });
    
    $("#skin-url").on("click", function(e) {
        $(this).select();
        try {
            //document.execCommand("copy");
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
		if ($("#nick").val().includes('℄') || window.proLicenceUID){
			try {	
			//    window.parent.postMessage("CustomSkins&?skin="+$("#skin-url").val(), "*"); 
			
			for (var i = 0; i < $(".skins-wrapper").length; i++){
				if ($(".skins-wrapper")[i].style.display != "none"){
					for (var j = 0; j < document.getElementsByClassName("skins-wrapper")[i].children.length; j++)
						if (document.getElementsByClassName("skins-wrapper")[i].children[j].children[0].name ==$("#skin-url").val()){ 
							document.getElementsByClassName("skins-wrapper")[2].append(document.getElementsByClassName("skins-wrapper")[i].children[j])
							toastr.info("<b>[SERVER]:</b> Special Effect " + $("#skin-url").val() + " activated");
							application.lastSentNick = $("#nick").val()
							SpecialEffectPlayers[application.lastSentNick]=$("#skin-url").val()
							window.isActualUsingSpecialEffectsSkin=$("#skin-url").val()
							window.application.sendSocket3Info("spfc", $("#skin-url").val())	
							
							if (document.getElementsByClassName("skins-wrapper")[2].children[0]){
								document.getElementsByClassName("skins-wrapper")[0].append(document.getElementsByClassName("skins-wrapper")[2].children[0])
							}							
						} 
						else if (document.getElementsByClassName("skins-wrapper")[2].children[0] && document.getElementsByClassName("skins-wrapper")[2].children[0].children[0].name ==$("#skin-url").val()){ 
							SpecialEffectPlayers[application.lastSentNick]=null
							window.isActualUsingSpecialEffectsSkin=null
							window.application.sendSocket3Info("spfc", null)
							toastr.info("<b>[SERVER]:</b> Special Effect " + $("#skin-url").val() + " de-activated");
						}
				}			
			}		
			} catch (e) {}
		}
		else{
			toastr.warning("<b>[SERVER]:</b> Not Premium account found. If you donated in the past, please refer it to Legend mod discord.<br>Thank you for using Legend mod!").css("width", "350px");
		}
    });
	setTimeout(function() {
		$("#nav a")[0].click();
	}, 100);
	}, 50);
});
