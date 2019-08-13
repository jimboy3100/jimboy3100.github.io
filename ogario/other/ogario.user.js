// ==UserScript==
// @name         OGARio with bots
// @version      1.0.2
// @description  Free open source agar.io bots with OGARio
// @author       Nel & szymy & Ref & Jimboy3100
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @match        *://agar.io/*
// @connect      cdn.ogario.ovh
// ==/UserScript==

/* START OF USER SETTINGS */

unsafeWindow.SERVER_HOST = 'localhost' // Hostname/IP of the server where the bots are running [Default = localhost (your own pc)]

unsafeWindow.SERVER_PORT = 1337 // Port number used on the server where the bots are running [Default = 1337]

/* END OF USER SETTINGS */

if(location.host === 'agar.io' && location.pathname === '/'){
    location.href = `https://agar.io/ogario${location.hash}`
    return
}

function modifyHTML(html){
    return html
        .replace('<head>', '<head><script src="https://bundle.run/buffer@5.2.1"></script><script src="https://jimboy3100.github.io/ogario/other/ogario.static.js"></script>')
        .replace('https://cdn.ogario.ovh/v4/beta/ogario.v4.js', 'https://jimboy3100.github.io/ogario/other/ogario.js')
}

if(!navigator.userAgent.includes('Chrome/') || Number(navigator.userAgent.match(/Chrome\/(\d+)/)[1]) < 76) window.stop()

document.documentElement.innerHTML = ''

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://cdn.ogario.ovh/v4/beta',
    onload(res){
        document.open()
        document.write(modifyHTML(res.responseText))
        document.close()
    }
})
