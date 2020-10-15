setTimeout(function() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Welcome to UI Client</span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 5000,
        stack: 5
    });
}, 2000);
setTimeout(function() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Developed by xAz</span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 5000,
        stack: 5
    });
}, 2500);
setTimeout(function() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Github: <span href="http://github.com/xAzz" target="_blank" id="github">xAzz</span></span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 5000,
        stack: 5
    });
}, 3000);

$("#div_lb > .header").attr("id", "title");
$("#input_box2").attr("placeholder", "Enter chat message...");
$("#input_box2").attr("onkeydown", "getText();");
$('<img id="toggleUI" src="http://i.imgur.com/L7SxxQq.png" onclick="toggleUIs();">').insertBefore("#chatroom");

function toggleUIs() {
    $("#div_lb, #minimap, #minimapNode, #localTime").fadeToggle(500);
}

function getText() {
    UIObject = document.getElementById("input_box2");
    if (/\b(?=\w)(controlbots)\b(?!\w)/i.test(UIObject.value)) {
        var getName = $("#nick").val();
        $.toast({
            heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
            text: '<span class="toast_chatmsg">Hello <b>' + getName + "</b>, To control your bots press Q and press again for control your self.</span>",
            icon: 'success',
            showHideTransition: 'slide',
            bgColor: 'rgba(10, 10, 10, 0.95)',
            allowToastClose: false,
            hideAfter: 5000,
            stack: 5
        });
        UIObject.value = "";
    }
}

$("#profile-main").prependTo("#home");
$("#preview-img").attr("src", $("#skin_url").val());
$("#skin_url").change(function() {
    $("#preview-img").attr("src", this.value);
});

$(".btn-green").insertBefore(".btn-blue");
$(".btn-red").insertAfter(".btn-green");

UI.getVersion = "V1.2.3";
$("n2").text("UI.io | " + UI.getVersion);

$("#theming").prepend('<div id="panel-opacity">Panel Opacity: <span id="txt_panel_opacity">1.0</span><input oninput="$(\'#txt_panel_opacity\').text(this.value); setOpacity(this.value)" class="range-slider__range" style="width:100%;" type="range" id="opt_panel_opacity" name="opt_panel_opacity" min="0.1" max="1.0" step="0.01" value="1.0"></div>');

if (localStorage.getItem("panel_opacity") !== null) {
    $(".UI-panel, .nav-tabs").css({
        "opacity": localStorage.getItem("panel_opacity")
    });
    $("#txt_panel_opacity").text(localStorage.getItem("panel_opacity"));
    $("#opt_panel_opacity").val(localStorage.getItem("panel_opacity"));
}

function setOpacity(panel_opacity) {
    $(".UI-panel, .nav-tabs").css({
        "opacity": panel_opacity
    });
    localStorage.setItem("panel_opacity", panel_opacity);
}

! function(c) {
    $(document).ready(function() {
        drawColor();
    });
    
    var round;
    var colors;
    round = {
        r1: '.round.red',
        r2: '.round.mahogany',
        r3: '.round.dulllime',
        r4: '.round.peru',
        r5: '.round.tuftsblue',
        r6: '.round.raspberry',
        r7: '.round.white',
        r8: '.round.aqua',
        r9: '.round.lawngreen',
        r10: '.round.magenta',
        r11: '.round.aztec',
        r12: '.round.yellow',
    };
    colors = {
        r1: '#ff0000',
        r2: '#ce4242',
        r3: '#42ce42',
        r4: '#ce8842',
        r5: '#4288ce',
        r6: '#d35695',
        r7: '#ffffff',
        r8: '#18ffff',
        r9: '#76ff03',
        r10: '#e040fb',
        r11: '#893bff',
        r12: '#ffff00',
    };

    function drawColor() {
        $(round.r1).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r1
            });
        });
        $(round.r2).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r2
            });
        });
        $(round.r3).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r3
            });
        });
        $(round.r4).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r4
            });
        });
        $(round.r5).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r5
            });
        });
        $(round.r6).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r6
            });
        });
        $(round.r7).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r7
            });
        });
        $(round.r8).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r8
            });
        });
        $(round.r9).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r9
            });
        });
        $(round.r10).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r10
            });
        });
        $(round.r11).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r11
            });
        });
        $(round.r12).on("click", function() {
            $("#div_lb > .header").css({
                color: colors.r12
            });
        });
    }
}(window.jQuery);


var sound = document.getElementById("radio");
sound.volume = 0.1;

if (localStorage.getItem("lb_title") !== null) {
    $("#div_lb > .header").text(localStorage.getItem("lb_title"));
    $("#lb_name").val(localStorage.getItem("lb_title"));
}

function setTitle(newTitle) {
    $("#div_lb > .header").text(newTitle);
    localStorage.setItem("lb_title", newTitle);
}

function connectionError() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Connection Error</span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 2500,
        stack: 5
    });
}

function serverRestart() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Server Restarting</span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 2500,
        stack: 5
    });
}

$(".btn-green").on("click", function() {
    $.toast({
        heading: '<span id="server-toast" class="toast_sender">SERVER:</span>',
        text: '<span class="toast_chatmsg">Your hotkeys has been saved!</span>',
        icon: 'success',
        showHideTransition: 'slide',
        bgColor: 'rgba(10, 10, 10, 0.95)',
        allowToastClose: false,
        hideAfter: 2500,
        stack: 5
    });
});

var l = localStorage.getItem("player_profile");
var profiles = JSON.parse(l);
setTimeout(function() {
    var name = profiles[0].name;
    var url = profiles[0].skinurl;
    $('#profile-bg').append('<img id="prof-1" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[1].name;
    var url = profiles[1].skinurl;
    $('#profile-bg2').append('<img id="prof-2" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[2].name;
    var url = profiles[2].skinurl;
    $('#profile-bg3').append('<img id="prof-3" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[3].name;
    var url = profiles[3].skinurl;
    $('#profile-bg4').append('<img id="prof-4" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[4].name;
    var url = profiles[4].skinurl;
    $('#profile-bg5').append('<img id="prof-5" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[5].name;
    var url = profiles[5].skinurl;
    $('#profile-bg6').append('<img id="prof-6" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[6].name;
    var url = profiles[6].skinurl;
    $('#profile-bg7').append('<img id="prof-7" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[7].name;
    var url = profiles[7].skinurl;
    $('#profile-bg8').append('<img id="prof-8" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[8].name;
    var url = profiles[8].skinurl;
    $('#profile-bg9').append('<img id="prof-9" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label><br>');
    var name = profiles[9].name;
    var url = profiles[9].skinurl;
    $('#profile-bg10').append('<img id="prof-10" class="profs" src="' + escapeHtml(url) + '" onerror="xAzError(this);"><label class="prof-label">' + escapeHtml(name) + '</label>');
}, 500);

function xAzError(image) {
    image.onerror = "";
    image.src = "img/error.png";
    return true;
}

$('#profile-bg').click(function() {
    while (localStorage.getItem("selected_profile") != 0) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg2').click(function() {
    while (localStorage.getItem("selected_profile") != 1) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg3').click(function() {
    while (localStorage.getItem("selected_profile") != 2) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg4').click(function() {
    while (localStorage.getItem("selected_profile") != 3) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg5').click(function() {
    while (localStorage.getItem("selected_profile") != 4) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg6').click(function() {
    while (localStorage.getItem("selected_profile") != 5) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg7').click(function() {
    while (localStorage.getItem("selected_profile") != 6) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg8').click(function() {
    while (localStorage.getItem("selected_profile") != 7) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg9').click(function() {
    while (localStorage.getItem("selected_profile") != 8) {
        $('.arrow-right').trigger('click');
    }
});
$('#profile-bg10').click(function() {
    while (localStorage.getItem("selected_profile") != 9) {
        $('.arrow-right').trigger('click');
    }
});

! function($, doc, w) {
    function localTime() {
        var d = new Date();
        var y = d.getDate();
        if (y < 10) {
            y = "0" + y;
        }
        var t = d.getMonth() + 1;
        if (t < 10) {
            t = "0" + t;
        }
        var a = d.getFullYear();
        if (a < 10) {
            a = "0" + a;
        }
        var h = d.getHours();
        if (h < 10) {
            h = "0" + h;
        }
        var m = d.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        var s = d.getSeconds();
        if (s < 10) {
            s = "0" + s;
        }
        $("#localTime").text(y + '/' + t + '/' + a + ' | ' + h + ':' + m + ':' + s);
    }
    setInterval(localTime, 1e3);
    localTime();
}(window.jQuery, document, window);
