window.addEventListener("load", function() {
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#009688",
                "text": "#ffffff"
            },
            "button": {
                "background": "#00877a"
            }
        },
        "theme": "edgeless",
        "position": "bottom",
        "content": {
            "message": "This website uses cookies to ensure you get the best experience on UI.io.",
            "dismiss": "ACCEPT",
            "link": "Read more"
        }
    })
});
