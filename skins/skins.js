$(document).ready(function() {
    $("#imgur img.lazy").lazyload({
        effect : "fadeIn",
        skip_invisible : true
    });
    
    $("#hizliresim img.lazy").lazyload({
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
	
});
