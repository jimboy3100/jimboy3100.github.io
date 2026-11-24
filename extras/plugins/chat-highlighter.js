// ==LMPlugin==
// @id          chat-highlighter
// @name        Chat word highlighter
// @version     1.0.0
// @description A message when a chat line contains one of your words (your nick when you set none).
// @author      Legend Mod
// @minVersion  3.568
// @permissions reads chat, shows messages
// ==/LMPlugin==
(function () {
    'use strict';
    var E = window.LMEvents, P = window.LMPlugins;
    if (!E) return;
    var ctx = null, words = [], own = false, lastAt = 0;

    function read() {
        var text = ctx && ctx.id ? ctx.get('words') : '';
        own = !!(ctx && ctx.id && ctx.get('own'));
        words = String(text || '').split(',').map(function (w) { return w.trim().toLowerCase(); })
            .filter(function (w) { return w.length >= 2; }).slice(0, 30);
    }
    function currentWords() {
        if (words.length) return words;
        var nick = document.getElementById('nick');
        var n = nick && typeof nick.value === 'string' ? nick.value.trim().toLowerCase() : '';
        return n.length >= 2 ? [n] : [];
    }
    function onChat(e) {
        if (e.own && !own) return;
        var t = String(e.text || '').toLowerCase(), list = currentWords();
        for (var i = 0; i < list.length; i++) {
            if (t.indexOf(list[i]) === -1) continue;
            /* a burst of matching lines shows one message */
            if (Date.now() - lastAt < 1500) return;
            lastAt = Date.now();
            /* toast() shows plain text: the chat line cannot add markup */
            E.api.toast(String(e.nick || '?') + ': ' + String(e.text || ''));
            return;
        }
    }
    function on() { E.on('chat', onChat); }
    function off() { E.off('chat', onChat); }

    if (P && typeof P.ready === 'function') {
        ctx = P.ready({
            settings: [
                { key: 'words', type: 'text', label: 'Words, separated by commas (empty = your nick)', 'default': '' },
                { key: 'own', type: 'checkbox', label: 'Also my own lines', 'default': false }
            ],
            onSettingsChange: read,
            onEnable: on,
            onDisable: off
        });
    }
    read();
    on();
})();
