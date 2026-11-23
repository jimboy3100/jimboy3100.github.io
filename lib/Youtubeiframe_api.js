/* Loads YouTube's official, always-current IFrame Player API (same YT global and
 * onYouTubeIframeAPIReady callback as before). The previous file pinned a 2017
 * www-widgetapi build on s.ytimg.com and an http:// host. */
(function () {
    if (window.YT && window.YT.Player) return;
    if (document.getElementById('www-widgetapi-loader')) return;
    var a = document.createElement('script');
    a.id = 'www-widgetapi-loader';
    a.src = 'https://www.youtube.com/iframe_api';
    a.async = true;
    var b = document.getElementsByTagName('script')[0];
    if (b && b.parentNode) b.parentNode.insertBefore(a, b); else document.head.appendChild(a);
})();
