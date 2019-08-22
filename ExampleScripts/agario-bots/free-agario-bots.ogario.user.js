// ==UserScript==
// @name         Free Agar.io Bots (OGARio Version)
// @version      1.0.8
// @description  Free open source agar.io bots with OGARio
// @author       Nel & szymy (OGARio deobfuscated by ReF)
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @match        *://agar.io/*
// @connect      sonnybuchan.co.uk
// @connect      cdn.ogario.ovh
// ==/UserScript==

const CLIENT_VERSION = '1.0.8'

if(location.host === 'agar.io' && location.pathname === '/'){
    location.href = `https://agar.io/ogario${location.hash}`
    return
}

function modifyHTML(html){
    return html
        .replace('<head>', '<head><script src="https://bundle.run/buffer@5.2.1"></script><script src="https://pastebin.com/raw/z9hBsFYi"></script>')
        .replace('https://cdn.ogario.ovh/v4/beta/ogario.v4.js', 'https://pastebin.com/raw/PaA4XAYX')
}

if(!navigator.userAgent.includes('Chrome/') || Number(navigator.userAgent.match(/Chrome\/(\d+)/)[1]) < 76) window.stop()

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https:/sonnybuchan.co.uk/version.txt',
    onload(res1){
        if(res1.responseText.split(';')[0].split('=')[1] === CLIENT_VERSION){
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://cdn.ogario.ovh/v4/beta',
                onload(res2){
                    document.open()
                    document.write(modifyHTML(res2.responseText))
                    document.close()
                }
            })
        }
        else alert('Outdated client version, join our discord server to get latest version: https://discord.gg/SDMNEcJ  Do you using Latest version?, Still get this message? Wait until the Version on the website got updated aswell')
    }
})
