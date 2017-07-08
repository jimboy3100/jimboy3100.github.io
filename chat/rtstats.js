/* global pako */

window.rtstats = {};

(function() {
  var pcs = [];
  var logInterval = -1;

  function logStats() {
    for (var i = 0; i < pcs.length; i++) {
      var details = pcs[i];
      details.pc.getPeerConnectionStats(function(stats) {
        var statsCopy = {};
        for (var pair of stats) {
          statsCopy[pair[0]] = pair[1];
        }
        var statsJSON = JSON.stringify(statsCopy);

        /* eslint-disable camelcase */
        /* This is data POSTed to an API that requires snake_case. */
        var body = {
          header: {
            client_info: {
              app_info: {
                name: 'apprtc'
              }
            }
          },
          event: {
            client_header: {
              session_id: details.sessionId,
              user_id: details.userId
            },
            // The event has to be base64 encoded, and we
            // zlib (pako) deflate it to save some bw.
            stats_json: btoa(String.fromCharCode.apply(null,
                pako.deflate(statsJSON)))
          },
          compression: 'ZLIB'
          /* eslint-enable camelcase */
        };
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST',
                     'https://realtimemediaservices-pa.googleapis.com/v1alpha/log?key=AIzaSyDU620juYM1FmyURBQW-MOQF4qQx1ag-_M',
                     true);
        xmlhttp.send(JSON.stringify(body));
      });
    }
  }

  function maybeStartLogging() {
    if (logInterval === -1 && pcs.length > 0) {
      logStats();
      logInterval = setInterval(logStats, 10000);
    }
  }

  function maybeStopLogging() {
    if (logInterval !== -1 && pcs.length === 0) {
      clearInterval(logInterval);
      logInterval = -1;
    }
  }

  window.addEventListener('pccreated', function(ev) {
    pcs.push(ev.detail);
    maybeStartLogging();
  }, false);

  window.addEventListener('pcclosed', function(ev) {
    var index = -1;
    for (index = 0; index < pcs.length; index++) {
      if (pcs[index].pc === ev.detail.pc) {
        break;
      }
    }
    if (index > -1) {
      pcs.splice(index, 1);
    } else {
      console.log('Unknown peer connection closed?');
    }
    maybeStopLogging();
  }, false);

  window.rtstats.activePCs = function() {
    return pcs;
  };
}());
