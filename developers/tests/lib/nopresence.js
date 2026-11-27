'use strict';
/* Test browsers stay out of the Player Monitor (monitor/, lm-server /stats).
 * Every Legend Mod page sends its nick and server to wss://api.legendmod.ml/lm-ws as "update_details"
 * (LMexpress.js socket.updateServerDetails), and the test Chromes of parallel runs filled the list
 * with "Profile #1" on Legend FFA (Private, 5001). The page script below drops only those messages:
 * the socket, its pings and its server list search still work, and players' clients are unchanged.
 * Install with Page.addScriptToEvaluateOnNewDocument({ source }) before the page loads. */
function noPresence() {
  try {
    var P = WebSocket.prototype, send = P.send;
    P.send = function (d) {
      /* the game's own packets are binary: one typeof check for them */
      if (typeof d === 'string' && d.indexOf('update_details') >= 0 && /^wss?:\/\/api\.legendmod\.ml\/lm-ws/i.test(String(this.url))) {
        try { if (JSON.parse(d).type === 'update_details') return; } catch (e) { }
      }
      return send.apply(this, arguments);
    };
  } catch (e) { }
}
module.exports = { source: '(' + noPresence.toString() + ')();' };
