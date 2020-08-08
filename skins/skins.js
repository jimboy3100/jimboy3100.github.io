$(document).ready(function() {
    $("#imgur img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
    
    $("#hizliresim img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
    $("#videoSkins img.lazy").lazyload({
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
        var url = $(this).attr("src");
        $("#skin-url").val(url).select();
        try {
            document.execCommand("copy");
        } catch (e) {}
    });
    
    $("#skin-url").on("click", function(e) {
        $(this).select();
        try {
            document.execCommand("copy");
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
    $("#PosttoNonIframe").on("click", function(e) {
        try {
        //    window.parent.postMessage("CustomSkins&?skin="+$("#skin-url").val(), "*"); 
		copy($("#skin-url").val());
        } catch (e) {}
    });
	$("#PosttoNonIframe").hide();	
	/*$(".lazy2").parent().click(function() {
		var hello=this;
		$("video").each(function() {
			if ($(hello).children().attr("src")!=$(this).get(0).firstElementChild.src){
				$(this).get(0).pause();
			}
		});		
        $("#skin-url").val($(hello).children().attr("src")).select();
    });*/
	$(".lazy2").parent().mouseenter(function() {
		var hello=this;
		$("video").each(function() {
			if ($(hello).children().attr("src")!=$(this).get(0).firstElementChild.src){
				$(this).get(0).pause();
			}
			else{
				if (!$(this).get(0).playing){
					$(this).get(0).play()
				}
			}
		});		
        $("#skin-url").val($(hello).children().attr("src")).select();
    }).mouseleave(function() {
		var hello=this;
		$("video").each(function() {
				$(this).get(0).pause();
			
		});		
        $("#skin-url").val($(hello).children().attr("src")).select();
    });	
});
