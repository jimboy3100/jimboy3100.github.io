// writer.js for Legend Express Agar.io Extension
/*MIT License*/

/*
 * Runs in agar.io's own page world (manifest "world": "MAIN"), before content.js. content.js runs in the
 * extension's isolated world, where Firefox refuses document.open() on agar.io's page ("The operation
 * is insecure"), so content.js hands every page it writes over agar.io's to this script. Cancelling the
 * event tells content.js the page was written here. document.open() also drops every listener of the
 * window, so this one is added again after each page.
 */
(function () {
    var EVENT = 'lmx-write-page';
    function onWrite(e) {
        var html = e.detail;
        if (typeof html !== 'string') return;
        e.preventDefault();
        e.stopImmediatePropagation();
        try {
            document.open();
            document.write(html);
            document.close();
        } finally {
            listen();
        }
    }
    function listen() {
        window.addEventListener(EVENT, onWrite, true);
    }
    listen();
})();
