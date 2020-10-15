window.onload = function() {
    setAllHats();
};

var hatsURL = {
    "crown": "http://i.imgur.com/fx0KFMS.png", // Crown
    "irish": "http://i.imgur.com/5kTy39Y.png", // Irish
    "penguin": "http://i.imgur.com/L0dCOQb.png", // Penguin
    "yt": "http://i.imgur.com/nNUCSh2.png", // YouTube
    "troll": "http://i.imgur.com/xZiAA18.png", // Troll
    "santa": "http://i.imgur.com/lw85cSt.png", // Santa
    "pika": "http://i.imgur.com/8qgs5zI.png", // Pikachu
    "vintage": "https://i.imgur.com/3dSkHkx.png", // Vintage
    "wizard": "https://i.imgur.com/QCCBfqH.png", // Wizard
    "trex": "https://i.imgur.com/fmos4Vy.png", // T-Rex
    "kk": "https://i.imgur.com/Qat1KKA.png", // KK
    "kk2": "https://i.imgur.com/miRxB9s.png" // Rainbow KK
};

var hatsImages = {
    "crown": null,
    "irish": null,
    "penguin": null,
    "yt": null,
    "troll": null,
    "santa": null,
    "pika": null,
    "vintage": null,
    "wizard": null,
    "trex": null,
    "kk": null,
    "kk2": null
};

for(var property in hatsImages) {
    if(hatsImages.hasOwnProperty(property)) {
        hatsImages[property] = new Image();
        hatsImages[property].src = hatsURL[property];
    }
}

function setAllHats() {
    var orderHats = [
        ["$crown", "Crown", "http://i.imgur.com/fx0KFMS.png"],
        ["$troll", "Troll", "http://i.imgur.com/xZiAA18.png"],
        ["$vintage", "Vintage", "http://i.imgur.com/3dSkHkx.png"],
        ["$trex", "T-REX", "http://i.imgur.com/fmos4Vy.png"],
        ["$kk", "KK", "http://i.imgur.com/Qat1KKA.png"],
        ["$kk2", "Rainbow KK", "http://i.imgur.com/miRxB9s.png"],
        ["$wizard", "Wizard", "http://i.imgur.com/QCCBfqH.png"],
        ["$irish", "Irish", "http://i.imgur.com/5kTy39Y.png"],
        ["$penguin", "Penguin", "http://i.imgur.com/L0dCOQb.png"],
        ["$yt", "YouTube", "http://i.imgur.com/nNUCSh2.png"],
        ["$santa", "Santa", "http://i.imgur.com/lw85cSt.png"],
        ["$pika", "Pikachu", "http://i.imgur.com/8qgs5zI.png"]
    ];
    for (var i = 0; i < orderHats.length; ++i) {
        var hatCode = orderHats[i][0],
            hatName = orderHats[i][1],
            hatImage = orderHats[i][2];
        $(".loadHats").remove();
        $("#hats-container").append('<div id="hat-card"><img src="' + hatImage + '"><h4 id="hat-name">' + hatName + '</h4><button class="btn btn-primary btn-hat" onclick="setInputHat(\'' + hatCode + '\'); hatSelected(\'' + hatName + '\'); UI.toggleHats();">Select Hat</button></div>');
        $(".input-hats").val(getLocalStorage("hat_selected"));
    }
}

function setInputHat(code) {
    var nickname = $("#nick");
    nickname.val(nickname.val() + code);
    setLocalStorage("nick", $("#nick").val());
}

function hatSelected(name) {
    $(".input-hats").val(name);
    setLocalStorage("hat_selected", $(".input-hats").val());
}
