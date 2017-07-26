setTimeout(function() {
        var ogarioVersion = $("#menu-footer").text().split("| ")[1];
        $("#menu-footer").text("");
		$("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'legendWebsite\');" href="http://www.legendmod.ml" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend Mod Website" data-placement="left">Legend mod ' + 'Temporary Script (BUGGY)' + '</a></span>' +
            '<a href="https://legendmod.joomla.com/en/more-fps.html" data-toggle="tooltip" data-title="How to improve performance" data-placement="top" style ="font-size: 13px"; target="_blank">More FPS</a>');
        document.getElementsByClassName('quick-yt icon-youtube2')[0].setAttribute('id', 'legendid');
        document.getElementsByClassName('quick-yt icon-youtube2')[0].href = "https://www.youtube.com/watch?v=CnIfNSpCf70";
        document.getElementsByClassName('quick-yt icon-youtube2')[0].setAttribute('data-original-title', 'Legend Promo Video');
        $('#legendid').addClass('fa fa-thumbs-o-up').removeClass('quick-yt icon-youtube2');
		$("#more-skins").attr('href', 'https://jimboy3100.github.io/skins/skins.html');
	
		$("#___ytsubscribe_0").remove();
setTimeout(function() {		
	toastr["warning"]("This Version is temporary and buggy. Install the old one when its ready");		
	}, 5000);
}, 2000);		
