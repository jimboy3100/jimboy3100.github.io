$(window).on('load', function () {
    var $preloader = $('#loading-screen'),
        $svg_anm   = $preloader.find('.svg_load');
    $svg_anm.fadeOut();
    $preloader.delay(500).fadeOut('slow');
});
