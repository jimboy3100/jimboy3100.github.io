/* Fills the data-i18n texts (texts.js, generated from developers/i18n/src) in the language chosen in
 * Legend Mod: content.js saves it when agar.io opens; before that the browser's language, else English. */
function showTexts(lang) {
    document.documentElement.lang = LMX_EXT_CODES[lang - 1];
    document.documentElement.dir = lang === 6 ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = lmxExtText(el.getAttribute('data-i18n'), lang); });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => { el.alt = lmxExtText(el.getAttribute('data-i18n-alt'), lang); });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('extensionToggle');
    showTexts(lmxExtLang(null));
    chrome.storage.local.get(['languagemod'], (result) => { if (result && result.languagemod) showTexts(lmxExtLang(result.languagemod)); });

    // Load current state
    chrome.storage.local.get(['enabled'], (result) => {
        // Default to true if not set
        toggle.checked = result.enabled !== false;
    });

    // Handle toggle changes
    toggle.addEventListener('change', () => {
        chrome.storage.local.set({ enabled: toggle.checked }, () => {
            console.log('Legend Express: Enabled set to', toggle.checked);
        });
        /* the content script reads the switch when agar.io loads */
        document.getElementById('reloadHint').style.display = 'block';
    });

    // Links
    document.getElementById('play').addEventListener('click', () => {
        window.open('https://agar.io/', '_blank');
    });
    document.getElementById('website').addEventListener('click', () => {
        window.open('https://www.legendmod.ml', '_blank');
    });

    document.getElementById('library').addEventListener('click', () => {
        window.open('https://github.com/jimboy3100/jimboy3100.github.io/', '_blank');
    });

    document.getElementById('donate').addEventListener('click', () => {
        window.open('https://www.buymeacoffee.com/legendmod', '_blank');
    });
});
