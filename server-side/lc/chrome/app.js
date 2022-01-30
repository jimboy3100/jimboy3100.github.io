// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
chrome.tabs.executeScript({
    code: 'getState();' // argument here is a string but function.toString() returns function's code
},
(results) => {
    var state = results[0];

    document.getElementById("nickname").innerHTML = state.nickname;
    document.getElementById("server").innerHTML = state.server;
    document.getElementById("tag").innerHTML = state.tag;
});
