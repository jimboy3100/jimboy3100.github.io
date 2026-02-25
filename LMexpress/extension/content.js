// content.js for Legend Express Agar.io Extension

const version = 2;
const modVersion = chrome.runtime.getManifest().version;

// Helper for cross-origin fetch via background script
function GM_xmlhttpRequest(details) {
    chrome.runtime.sendMessage({
        type: 'fetch',
        url: details.url,
        options: {
            method: details.method || 'GET'
        }
    }, (response) => {
        if (response.error) {
            console.error('Fetch error:', response.error);
        } else if (details.onload) {
            details.onload({ responseText: response.data });
        }
    });
}

// Mock GM_info
const GM_info = {
    script: {
        version: modVersion
    }
};

// Check location and redirect
if (location.host === "agar.io" && location.pathname === "/") {
    const url = window.location.href;
    localStorage.setItem("url", url);
    location.href = "https://agar.io/legendmod" + location.hash;
} else if (location.host === "agar.io" && location.pathname.startsWith("/legendmod")) {
    runMod();
}

function runMod() {
    document.documentElement.innerHTML = "";
    let mode = location.pathname.slice(1);
    if (mode.startsWith("legendmod")) mode = "legendmod";

    let modwebsite;
    switch (mode) {
        case 'normal':
            modwebsite = 'https://agar.io';
            Htmlscript(modwebsite);
            break;
        case 'hslo':
            modwebsite = 'https://hslo.io/install.user.js';
            Userscript(modwebsite);
            break;
        case 'agartool':
            modwebsite = 'https://www.agartool.io/agartool.user.js';
            Userscript(modwebsite);
            break;
        case 'vanilla':
            modwebsite = 'http://imasters.org.ru/agar/js/vanilla.user.js';
            Userscript(modwebsite);
            break;
        case 'ogario':
            modwebsite = 'https://cdn.ogario.ovh/v4/beta/ogario.v4.user.js';
            Userscript(modwebsite);
            break;
        case 'delta':
            modwebsite = 'https://deltav4.glitch.me/v4/index.html';
            Htmlscript(modwebsite);
            break;
        case 'neo':
            modwebsite = 'https://www.legendmod.ml/play.html?' + version;
            Htmlscript(modwebsite);
            setTimeout(function () {
                modwebsite = 'https://jimboy3100.github.io/ExampleScripts/Neoprivate.js';
                Userscript(modwebsite);
            }, 5000);
            break;
        case 'mobile':
            modwebsite = 'https://www.legendmod.ml/play.html';
            Htmlscript(modwebsite);
            setTimeout(function () {
                modwebsite = 'https://www.legendmod.ml/ExampleScripts/gamepad.user.js';
                Userscript(modwebsite);
            }, 5000);
            break;
        case 'captcha':
            modwebsite = 'https://www.legendmod.ml/ogario/captcha.html'
            Htmlscript(modwebsite);
            break;
        case 'legendmod': default:
            modwebsite = 'https://www.legendmod.ml/play.html?' + version;
            Htmlscript(modwebsite);
            break;
    }
}

function inject(page) {
    return page.replace("</body>", "<script>init('" + modVersion + "');</script></body>");
}

function Htmlscript(modwebsite) {
    GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        onload: function (legend) {
            const doc = inject(legend.responseText);
            document.open();
            document.write(doc);
            setTimeout(function () {
                window.history.pushState(null, null, "/");
            }, 2000);
            document.close();
        }
    });
}

function Userscript(modwebsite) {
    GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        onload: function (e) {
            // Note: In Chrome extensions, new Function can be blocked by CSP
            // This might need a different injection method if the external script is complex
            const script = document.createElement('script');
            script.textContent = `(function(GM_info, GM_xmlhttpRequest) { ${e.responseText} })(JSON.parse('${JSON.stringify(GM_info)}'), ${GM_xmlhttpRequest.toString()});`;
            document.head.appendChild(script);
        }
    });
}
