    //This overwrites every XHR object's open method with a new function that adds load and error listeners to the XHR request. When the request completes or errors out, the functions have access to the method and url variables that were used with the open method.
    //You can do something more useful with method and url than simply passing them into console.log if you wish.
    //https://stackoverflow.com/questions/43282885/how-do-i-use-javascript-to-store-xhr-finished-loading-messages-in-the-console
    (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                console.log('XHR finished loading', method, url);
                display();
            });

            this.addEventListener('error', function() {
                console.log('XHR errored out', method, url);
            });
            origOpen.apply(this, arguments);
        };
    })();
    function display(){
        //codes to do something;
    }
