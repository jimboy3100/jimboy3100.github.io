document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('extensionToggle');

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
    });

    // Links
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
