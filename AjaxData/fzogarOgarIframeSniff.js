var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function (e) {
       if (~e.data.indexOf("PostedOgarSettings2")){
	   alert(e.data);
	   }
        }, false);
