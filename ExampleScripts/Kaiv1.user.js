function nuevoScript() {
    window.onload = function() {
        inicio();
    }
}
 
function inicio() {
    document.title = "OGARio Kai";
    modificarTextoMinimapa("By Kai");
    modificarTextoLeaderboard("OGARio Kai");
    modificarCanalYoutube("Suscríbete a mi canal", "UCJuTk8rL10dIHbnW2CFhTBQ");
    modificarFooter("Visita mi Canal de Youtube", "https://www.youtube.com/channel/UCbmERyEunp6-OOlMn4hm2VQ");
    panelDerecho();
    ocultarBotonAdelante();
    ocultarBotonAtras();
    redondearPanelCentral("20");
    redondearPanelDerecho("20");
    modificarMargenesPanel();
    redondearControles("20");
    colorPanelCentral("#13DE8E");
    colorPanelDerecho("#13DE8E");
    colorTextoPestaña("#FFFFFF");
    colorPestañaActiva("black");
    
    colorBotonPlay("black", "white");
    bordeBotonPlay("black", "white");
 
    colorBotonLoginAndPlay("black", "white");
    bordeBotonLoginAndPlay("black", "white");
 
    colorBotonLogout("black", "white");
    bordeBotonLogout("black", "white");
 
    colorBotonFacebook("black", "white");
    bordeBotonFacebook("black", "white");
 
    colorBotonGoogle("black", "white");
    bordeBotonGoogle("black", "white");
 
    colorBotonSpectate("black", "white");
    bordeBotonSpectate("black", "white");
 
    colorBotonCopy("black", "white");
    bordeBotonCopy("black", "white");
 
    colorBotonCreate("black", "white");
    bordeBotonCreate("black", "white");
 
    colorBotonJoin("black", "white");
    bordeBotonJoin("black", "white");
 
    colorBotonStreamMode("black", "white");
 
    colorBotonHideUrl("black", "white");
 
    colorBotonFreeCoins("black", "white");
    bordeBotonFreeCoins("black", "white");
 
    colorBotonShop("black", "white");
    bordeBotonShop("black", "white");
 
 
    colorBotonResetHotkeys("black", "white");
    bordeBotonResetHotkeys("black", "white");
    
   
    colorBotonSaveHotkeys("black", "white");
    bordeBotonSaveHotkeys("black", "white");
 
    colorBotonCloseHotkeys("black", "white");
    bordeBotonCloseHotkeys("black", "white");
 
    colorBotonSaveTheme("black", "white");
    bordeBotonSaveTheme("black", "white");
    
        colorInput("black");
    colorTextoInput("white");
   
    colorSelect("black");
    colorTextoSelect("white");
    
    colorDarkTheme("black", "white");
    colorLightTheme("black", "white");
    
    colorPicker("black");
    
    nuevoCursor("http://cur.cursors-4u.net/cursors/cur-2/cur116.cur");
    
    setTimeout(function() {
        alert("Bienvenido a Kai Ext v1");
    }, 2000);
}
 
function modificarTextoMinimapa(titulo) {
    var texto = CanvasRenderingContext2D.prototype._fillText;
    CanvasRenderingContext2D.prototype._fillText = function(){
        if(arguments[0] == 'ogario.ovh'){
            arguments[0] = titulo; // arguments[0] = 'ʙʏ ᴋᴀɪ❥'; // Borra el texto transparente encima del minimapa
        }
        return texto.apply(this,arguments);
    };
}
 
function modificarTextoLeaderboard(titulo) {
    var texto = $("h4.main-color").text();
    if (texto === "ogario.ovh") {
        $("h4.main-color").text(titulo);
    }
 
    // Cambia el leaderboard
    $("h4.main-color").on('DOMSubtreeModified', function() {
        var texto = $(this).text();
        if (texto !== "Leaderboard") {
            $(this).text(titulo);
        }
    });
}
 
function modificarCanalYoutube(titulo, ID) {
    $(".ogario-yt-panel").remove();
    $("#profile").append('<div class="agario-panel ogario-yt-panel"></div>');
    $(".ogario-yt-panel").append('<h5 class="main-color">' + titulo + '</h5>');
    $(".ogario-yt-panel").append(
        '<center><div class="g-ytsubscribe" data-channelid="' + ID + '" data-layout="full" data-theme="dark" data-count="default"></div></center>');
    $(".ogario-yt-panel").insertBefore(".radio-panel");
}
 
function modificarFooter(texto, URL) {
    if (texto === undefined) {
        $("#menu-footer-v").hide();
    } else {
        if (URL === undefined) {
            $("#menu-footer-v").text(texto);
        } else {
            $("#menu-footer-v").html('<a href="' + URL + '" target="_blank">' + texto + '</a>');
        }
    }
}
 
function panelDerecho(){$("#prev-profile").attr("id","botonAtras"),$("#next-profile").attr("id","botonAdelante"),$("#botonAtras, #botonAdelante").css({width:"80px",height:"80px","border-radius":"50%",opacity:".6",transition:"all .2s linear",display:"inline-block","vertical-align":"bottom"}),$("#botonAtras img, #botonAdelante img").css({width:"80px",height:"80px",border:"0","border-radius":"50%"}),$("#botonAtras").on("click",function(){setProfile(0)}),$("#botonAdelante").on("click",function(){setProfile(1)}),$("#helloContainer").css("width","974px"),$("#helloContainer").css("top","50%","important"),$("#helloContainer").css("transform","translate(-50%,-50%)"),$("#helloContainer").css("text-align","center"),$("#options").css("text-align","left"),$("#og-options").css("text-align","left"),$("#theme-options").css("text-align","left"),$(".left-container").remove(),$(".right-container").remove(),$("#helloContainer").append('<div id="rightPanel2" class="side-container right-container" style="display: inline-block;">'),$("#rightPanel2").append('<div class="agario-panel agario-side-panel leaderboard-panel"></div>'),$(".leaderboard-panel").html('<style>@media screen and (max-width:580px) {.table { display: block }}.table>#hotkey_setting .row { font-size: 12px! important } #hotkey_setting .row {display: table-row; background: #333 }#hotkey_setting .row:nth-of-type(odd){background: #444 }#hotkey_setting .row.header {font-weight: 900; color: #fff; background: #1565c0 } #hotkey_setting .row.green {background : #27ae60 } #hotkey_setting .row.blue { background: #2980b9 !important } @media screen and (max-width:580px) {#hotkey_setting .row { padding:8px 0; display:block }}.table-row-selected { background: #c62828 !important; color:#fff !important}.cell { padding: 6px 12px; display: table-cell; font-size: 11px } @media screen and (max-width:580px) {.cell { padding:2px 12px; display:block } } .leaderboard-panel { width: 190px; padding: 15px; }.right-container { width: 190px; }#skinz, #skinz4, #skinz1, #skinz2, #skinz3, #skinz5, #skinz6, #skinz7, #skinz8, #skinz9, #skinz10 {float: left;display: inline-block;-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);cursor: pointer;width: 70px;height: 70px;margin: 5px;border-radius: 100%;}</style><div id="skinsPanel"><img id="skinz1" style="opacity: 1; background: url(http://i.imgur.com/WQMyFfk.png);" class="1"></img><img id="skinz2" style="opacity: 1; background: url(http://i.imgur.com/fWSf996.png);" class="2"></img><img id="skinz3" style="opacity: 1; background: url(http://i.imgur.com/bf4riGt.png);" class="3"></img><img id="skinz4" style="opacity: 1; background: url(http://i.imgur.com/M4yrRt7.png);" class="4"></img><img id="skinz5" style="opacity: 1; background: url(http://i.imgur.com/CAQ3Su9.png);" class="5"></img><img id="skinz6" style="opacity: 1; background: url(http://i.imgur.com/KRxpM9f.png);" class="6"></img><img id="skinz7" style="opacity: 1; background: url(http://i.imgur.com/fPcuqzO.png);" class="7"></img><img id="skinz8" style="opacity: 1; background: url(http://i.imgur.com/hdhb111.png);" class="8"></img><img id="skinz9" style="opacity: 1; background: url(http://i.imgur.com/41riMKN.png);" class="9"></img><img id="skinz10" style="opacity: 1; background: url(http://i.imgur.com/62eOpMn.png);" class="10"></img></div>');for(var i=1;11>i;i++)null===localStorage.getItem("profile"+i)&&localStorage.setItem("profile"+i,null);$("head").append("<style>#img, #skinz, #skinz6, #skinz7, #skinz8, #skinz9, #skinz10, #skinz4, #skinz1, #skinz2, #skinz3, #skinz5 {background-size: cover !important;border-radius: 1000px!important;¡width: 100px;height: 100px;}#mainPanel2 #img, #skinz, #skinz6, #skinz7, #skinz8, #skinz9, #skinz10, #skinz4 #skinz1, #skinz2, #skinz3, #skinz5 {-webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);}</style>");var t=localStorage.getItem("activeprofile");if(null!==t){var n=JSON.parse(localStorage["profile"+t]);null!==n&&($("#clantag").val(n[0]),$("#nick").val(n[1]),$("#skin").val(n[2]),n[2]&&n[2].length>0&&$("#skin-preview img").attr("src",""+$("#skin").val()))}for(var i=1;11>i;i++){var a=JSON.parse(localStorage["profile"+i]);null!==a&&$("."+i).attr("src",""+a[2])}$(".1, .2, .3, .4, .5, .6, .7, .8, .9, .10").on("click",function(){var i=$(this).attr("class").split(" ")[0],t=parseInt(i)-1===0?10:parseInt(i)-1,n=parseInt(i)+1===11?1:parseInt(i)+1;console.log(t+" :  "+n),$("#botonAtras img").attr("src",$("#skinz"+t).attr("src")),$("#botonAdelante img").attr("src",$("#skinz"+n).attr("src")),window.localStorage.setItem("activeprofile",i);var a=JSON.parse(window.localStorage["profile"+i]);if(null!=a){$("#clantag").val(a[0]),$("#nick").val(a[1]);var e=a[2];$("#skin").val(e),e.length>0?($("#skin-preview img").fadeOut(100,"swing"),setTimeout(function(){$("#skin-preview img").attr("src",""+e)},100),$("#skin-preview img").fadeIn(100,"swing")):$("#skin-preview img").attr("src","")}else $("#clantag").val(""),$("#nick").val("Profile"+i),$("#skin").val(""),$("#skin-preview img").attr("src","");$("#skin").trigger("click")}),$("#clantag, #skin, #nick").on("input",function(){$("#skin-preview img").attr("src",""+$("#skin").val());var i=localStorage.getItem("activeprofile"),t=new Array;t[0]=$("#clantag").val(),t[1]=$("#nick").val(),t[2]=$("#skin").val(),localStorage["profile"+i]=JSON.stringify(t);for(var n=0,a=1;11>a;a++){var e=JSON.parse(localStorage["profile"+a]);null!==e&&(n++,$("."+a).attr("src",""+e[2]))}})}
 
function ocultarBotonAdelante() {
    $("#botonAdelante").hide();
    $("#next-profile").hide();
    $("#profiles").css("text-align", "center");
}
 
function ocultarBotonAtras() {
    $("#botonAtras").hide();
    $("#prev-profile").hide();
    $("#profiles").css("text-align", "center");
}
 
function redondearPanelCentral(r){void 0===r?$("#main-menu").css("border-radius","10px"):$("#main-menu").css("border-radius",r+"px")}
 
function redondearPanelDerecho(r){void 0===r?$(".leaderboard-panel").css("border-radius","10px"):$(".leaderboard-panel").css("border-radius",r+"px")}
 
 
function modificarMargenesPanel(margen) {
    if (margen === undefined) {
        margen = 20;
    }
    $("#main-menu, .center-container").css("width", "350px");
    $("#main-menu").css("padding", margen + "px");
    $(".menu-tabs").css("width", "100%");
    $(".agario-profile-panel, .agario-panel-freecoins, .agario-shop-panel, .ogario-yt-panel, .radio-panel").css("width", "100%");
}

function redondearControles(valor) {
 
    if (valor === undefined) {
        valor = "4";
    }
    $(".btn").css("border-radius", valor + "px");
    $("input").css("border-radius", valor + "px");
    $("select").css("border-radius", valor + "px");
    $(".input-group-addon").css("border-radius", valor + "px");
    $(".input-group-btn").css("border-radius", valor + "px");
    $("button").css("border-radius", valor + "px");
    $(".menu-tabs li").css("border-radius", valor + "px");
}
 
function colorPanelCentral(color) {
    $("#main-menu").css("background-color", color);
}
 
function colorPanelDerecho(color) {
    $(".leaderboard-panel").css("background-color", color);
}
 
function colorPestañaActiva(color) {
    $(".menu-tabs li.active").css("background-color", color);
 
    $(".menu-tabs li").click(function() {
        $(".menu-tabs li").css("background-color", $("#main-menu").css("background-color"));
        $(".menu-tabs li.active").css("background-color", color);
    });
}
 
function colorTextoPestaña(color) {
    $(".menu-tabs a").css("color", color);
}
 
function colorBotonPlay(color, colorFondo) {
    $(".btn-play-guest, .btn-play").css("background-color", color);
 
    $(".btn-play-guest, .btn-play").hover(function() {
        $(".btn-play-guest, .btn-play").css("background-color", colorFondo);
    }, function() {
        $(".btn-play-guest, .btn-play").css("background-color", color);
    });
}
 
function bordeBotonPlay(color1, color2) {
    $(".btn-play-guest, .btn-play").css("border-color", color1);
 
    $(".btn-play-guest, .btn-play").hover(function() {
        $(".btn-play-guest, .btn-play").css("border-color", color2);
    }, function() {
        $(".btn-play-guest, .btn-play").css("border-color", color1);
    });
}
 
function colorBotonLoginAndPlay(color, colorFondo) {
    $(".btn-login-play").css("background-color", color);
 
    $(".btn-login-play").hover(function() {
        $(".btn-login-play").css("background-color", colorFondo);
    }, function() {
        $(".btn-login-play").css("background-color", color);
    });
}
 
function bordeBotonLoginAndPlay(color1, color2) {
    $(".btn-login-play").css("border-color", color1);
 
    $(".btn-login-play").hover(function() {
        $(".btn-login-play").css("border-color", color2);
    }, function() {
        $(".btn-login-play").css("border-color", color1);
    });
}
 
function colorBotonSpectate(color, colorFondo) {
    $(".btn-spectate").css("background-color", color);
 
    $(".btn-spectate").hover(function() {
        $(".btn-spectate").css("background-color", colorFondo);
    }, function() {
        $(".btn-spectate").css("background-color", color);
    });
}
 
function bordeBotonSpectate(color1, color2) {
    $(".btn-spectate").css("border-color", color1);
 
    $(".btn-spectate").hover(function() {
        $(".btn-spectate").css("border-color", color2);
    }, function() {
        $(".btn-spectate").css("border-color", color1);
    });
}
 
function colorBotonLogout(color, colorFondo) {
    $(".btn-logout").css("background-color", color);
 
    $(".btn-logout").hover(function() {
        $(".btn-logout").css("background-color", colorFondo);
    }, function() {
        $(".btn-logout").css("background-color", color);
    });
}
 
function bordeBotonLogout(color1, color2) {
    $(".btn-logout").css("border-color", color1);
 
    $(".btn-logout").hover(function() {
        $(".btn-logout").css("border-color", color2);
    }, function() {
        $(".btn-logout").css("border-color", color1);
    });
}
 
function colorBotonCopy(color, colorFondo) {
    $(".btn-copy-token").css("background-color", color);
 
    $(".btn-copy-token").hover(function() {
        $(".btn-copy-token").css("background-color", colorFondo);
    }, function() {
        $(".btn-copy-token").css("background-color", color);
    });
}
 
function bordeBotonCopy(color1, color2) {
    $(".btn-copy-token").css("border-color", color1);
 
    $(".btn-copy-token").hover(function() {
        $(".btn-copy-token").css("border-color", color2);
    }, function() {
        $(".btn-copy-token").css("border-color", color1);
    });
}
 
function colorBotonCreate(color, colorFondo) {
    $("#create-party-btn").css("background-color", color);
 
    $("#create-party-btn").hover(function() {
        $("#create-party-btn").css("background-color", colorFondo);
    }, function() {
        $("#create-party-btn").css("background-color", color);
    });
}
 
function bordeBotonCreate(color1, color2) {
    $("#create-party-btn").css("border-color", color1);
 
    $("#create-party-btn").hover(function() {
        $("#create-party-btn").css("border-color", color2);
    }, function() {
        $("#create-party-btn").css("border-color", color1);
    });
}
 
function colorBotonJoin(color, colorFondo) {
    $("#join-party-btn").css("background-color", color);
 
    $("#join-party-btn").hover(function() {
        $("#join-party-btn").css("background-color", colorFondo);
    }, function() {
        $("#join-party-btn").css("background-color", color);
    });
}
 
function bordeBotonJoin(color1, color2) {
    $("#join-party-btn").css("border-color", color1);
 
    $("#join-party-btn").hover(function() {
        $("#join-party-btn").css("border-color", color2);
    }, function() {
        $("#join-party-btn").css("border-color", color1);
    });
}
 
function colorBotonFreeCoins(color, colorFondo) {
    $("#freeCoins").css("background-color", color);
 
    $("#freeCoins").hover(function() {
        $("#freeCoins").css("background-color", colorFondo);
    }, function() {
        $("#freeCoins").css("background-color", color);
    });
}
 
function bordeBotonFreeCoins(color1, color2) {
    $("#freeCoins").css("border-color", color1);
 
    $("#freeCoins").hover(function() {
        $("#freeCoins").css("border-color", color2);
    }, function() {
        $("#freeCoins").css("border-color", color1);
    });
}
 
function colorBotonShop(color, colorFondo) {
    $("#openShopBtn").css("background-color", color);
 
    $("#openShopBtn").hover(function() {
        $("#openShopBtn").css("background-color", colorFondo);
    }, function() {
        $("#openShopBtn").css("background-color", color);
    });
}
 
function bordeBotonShop(color1, color2) {
    $("#openShopBtn").css("border-color", color1);
 
    $("#openShopBtn").hover(function() {
        $("#openShopBtn").css("border-color", color2);
    }, function() {
        $("#openShopBtn").css("border-color", color1);
    });
}
 
function colorBotonResetHotkeys(color, colorFondo) {
    $('button[onclick="resetHotkeys();"]').css("background-color", color);
 
    $('button[onclick="resetHotkeys();"]').hover(function() {
        $('button[onclick="resetHotkeys();"]').css("background-color", colorFondo);
    }, function() {
        $('button[onclick="resetHotkeys();"]').css("background-color", color);
    });
}
 
function bordeBotonResetHotkeys(color1, color2) {
    $('button[onclick="resetHotkeys();"]').css("border-color", color1);
 
    $('button[onclick="resetHotkeys();"]').hover(function() {
        $('button[onclick="resetHotkeys();"]').css("border-color", color2);
    }, function() {
        $('button[onclick="resetHotkeys();"]').css("border-color", color1);
    });
}
 
function colorBotonSaveHotkeys(color, colorFondo) {
    $('button[onclick="saveHotkeys();"]').css("background-color", color);
 
    $('button[onclick="saveHotkeys();"]').hover(function() {
        $('button[onclick="saveHotkeys();"]').css("background-color", colorFondo);
    }, function() {
        $('button[onclick="saveHotkeys();"]').css("background-color", color);
    });
}
 
function bordeBotonSaveHotkeys(color1, color2) {
    $('button[onclick="saveHotkeys();"]').css("border-color", color1);
 
    $('button[onclick="saveHotkeys();"]').hover(function() {
        $('button[onclick="saveHotkeys();"]').css("border-color", color2);
    }, function() {
        $('button[onclick="saveHotkeys();"]').css("border-color", color1);
    });
}
 
function colorBotonCloseHotkeys(color, colorFondo) {
    $('button[onclick="closeHotkeys();"]').css("background-color", color);
 
    $('button[onclick="closeHotkeys();"]').hover(function() {
        $('button[onclick="closeHotkeys();"]').css("background-color", colorFondo);
    }, function() {
        $('button[onclick="closeHotkeys();"]').css("background-color", color);
    });
}
 
function bordeBotonCloseHotkeys(color1, color2) {
    $('button[onclick="closeHotkeys();"]').css("border-color", color1);
 
    $('button[onclick="closeHotkeys();"]').hover(function() {
        $('button[onclick="closeHotkeys();"]').css("border-color", color2);
    }, function() {
        $('button[onclick="closeHotkeys();"]').css("border-color", color1);
    });
}
 
function colorBotonSaveTheme(color, colorFondo) {
    $('button[onclick="saveThemeSettings();"]').css("background-color", color);
 
    $('button[onclick="saveThemeSettings();"]').hover(function() {
        $('button[onclick="saveThemeSettings();"]').css("background-color", colorFondo);
    }, function() {
        $('button[onclick="saveThemeSettings();"]').css("background-color", color);
    });
}
 
function bordeBotonSaveTheme(color1, color2) {
    $('button[onclick="saveThemeSettings();"]').css("border-color", color1);
 
    $('button[onclick="saveThemeSettings();"]').hover(function() {
        $('button[onclick="saveThemeSettings();"]').css("border-color", color2);
    }, function() {
        $('button[onclick="saveThemeSettings();"]').css("border-color", color1);
    });
}
 
function colorBotonFacebook(color, colorFondo) {
    $('.btn-fb').css("background-color", color);
 
    $('.btn-fb').hover(function() {
        $('.btn-fb').css("background-color", colorFondo);
    }, function() {
        $('.btn-fb').css("background-color", color);
    });
}
 
function bordeBotonFacebook(color1, color2) {
    $('.btn-fb').css("border-color", color1);
 
    $('.btn-fb').hover(function() {
        $('.btn-fb').css("border-color", color2);
    }, function() {
        $('.btn-fb').css("border-color", color1);
    });
}
 
function colorBotonGoogle(color, colorFondo) {
    $('.btn-gplus').css("background-color", color);
 
    $('.btn-gplus').hover(function() {
        $('.btn-gplus').css("background-color", colorFondo);
    }, function() {
        $('.btn-gplus').css("background-color", color);
    });
}
 
function bordeBotonGoogle(color1, color2) {
    $('.btn-gplus').css("border-color", color1);
 
    $('.btn-gplus').hover(function() {
        $('.btn-gplus').css("border-color", color2);
    }, function() {
        $('.btn-gplus').css("border-color", color1);
    });
}
 
function colorBotonDarkTheme(color, colorFondo) {
    $('#darkTheme').parent().css("border-width", "1px");
    $('#darkTheme').parent().css("background-color", color);
    $('#darkTheme').parent().hover(function() {
        $('#darkTheme').parent().css("background-color", colorFondo);
    }, function() {
        $('#darkTheme').parent().css("background-color", color);
    });
}
 
function colorBotonLightTheme(color, colorFondo) {
    $('#lightTheme').parent().css("background-color", color);
    $('#lightTheme').parent().hover(function() {
        $('#lightTheme').parent().css("background-color", colorFondo);
    }, function() {
        $('#lightTheme').parent().css("background-color", color);
    });
}
 
function colorBotonStreamMode(color) {
    $("#stream-mode").css("background-color", color);
    $("#stream-mode").parent().css("background-color", color);
}
 
function colorBotonHideUrl(color) {
    $("#hide-url").css("background-color", color);
    $("#hide-url").parent().css("background-color", color);
}
 
function colorInput(color) {
    $("input").css("background-color", color);
}
 
function colorTextoInput(color) {
    $("input").css("color", color);
}
 
function colorSelect(color) {
    $("select").css("background-color", color);
}
 
function colorTextoSelect(color) {
    $("select").css("color", color);
}
 
function colorPicker(color) {
    $(".input-group-addon").css("background-color", color);
}

function nuevoCursor(URL) {
    $("body").css("cursor", 'url("' + URL + '"), auto');
}
