var stylesLegendModConsole1 = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 1px solid #3E0E02'
    , 'color: #99c2ff'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
].join(';');
var stylesLegendModConsole2 = [
    'background: linear-gradient(grey, black)'
    , 'border: 1px solid #3E0E02'
    , 'color: #FFFFFF'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'text-align: center'
].join(';');

$("#adsBottomInner").remove();
$("#mcbanners-container").remove();
$("#instructions").remove();
//$("#adsBottom").remove();
$(".tosBox.left").remove();
$(".tosBox.right").remove();

	var variable_0 = setInterval(function() {
        if (document.getElementById("nick") && typeof window.core !== "undefined") {
            clearInterval(variable_0);
            var variable_1 = document.createElement("SCRIPT");
            variable_1.src = "https://code.jquery.com/ui/1.12.0/jquery-ui.js";
            variable_1.type = "text/javascript";
            setTimeout(function() {
			//variable_1.onload = function() {
                $(document).on("contextmenu", function(variable_2) {
                    variable_2.preventDefault()
                });
                var variable_3;

                function variable_4(variable_5, variable_6) {
                    return $.Event(variable_5, {
                        keyCode: variable_6.charCodeAt(0)
                    })
                }
                $("#splitBtn").on("touchstart", function(variable_7) {
                    $("body").trigger(variable_4("keydown", " "));
                    $("body").trigger(variable_4("keyup", " "))
                });
				
                $("#feedBtn").on("touchstart", function(variable_7) {
                    variable_3 = setInterval(function() {
                        $("body").trigger($.Event("keydown", {
                            keyCode: 87
                        }));
                        $("body").trigger($.Event("keyup", {
                            keyCode: 87
                        }))
                    }, 10)
                });
                $("#feedBtn").on("touchend", function(variable_7) {
                    clearInterval(variable_3);
                    return
                })
            //};
			}, 2500);
            document.getElementsByTagName("head")[0].appendChild(variable_1);
            var variable_8 = "https://jimboy3100.github.io/banners/iconMobileSplit.png";
            var variable_9 = "https://jimboy3100.github.io/banners/iconMobileFeed.png";

            function canvaselement2(variable_11, variable_12, variable_13, variable_14, variable_00) {
                return Math.pow(variable_11 - variable_12, 2) + Math.pow(variable_13 - variable_14, 2) >= variable_00 * variable_00
            }

            function variable_01(variable_02, variable_03) {
                if ((variable_02.x == 0 && variable_02.y == 0) || variable_03 == 0) {
                    return {
                        x: 0,
                        y: 0
                    }
                };
                var variable_04 = Math.atan2(variable_02.y, variable_02.x);
                var variable_05 = Math.cos(variable_04) * variable_03;
                var variable_06 = Math.sin(variable_04) * variable_03;
                return {
                    x: variable_05,
                    y: variable_06
                }
            }
            var variable_07 = document.body;
            if (variable_07) {
                variable_07.addEventListener("click", function() {
                    var variable_08 = document.documentElement;
                    if (variable_08.requestFullscreen) {
                        variable_08.requestFullscreen()
                    } else {
                        if (variable_08.msRequestFullscreen) {
                            variable_08.msRequestFullscreen()
                        } else {
                            if (variable_08.mozRequestFullScreen) {
                                variable_08.mozRequestFullScreen()
                            } else {
                                if (variable_08.webkitRequestFullScreen) {
                                    variable_08.webkitRequestFullScreen()
                                }
                            }
                        }
                    }
                })
            };
            var variable_09 = document.createElement("div");
            var variable_0a = document.createElement("div");
            variable_09.style.width = "0vh";
            variable_09.style.height = "0vh";
            variable_09.style.background = "rgba(0,0,0,0.1)";
            variable_09.style.dislay = "inline-block";
            variable_09.style.position = "absolute";
            variable_09.style.top = "65vh";
            variable_09.style.left = "calc(100vw - 35vh)";
            variable_09.style.zIndex = "99999";
            variable_09.innerHTML = "<div style='z-index:99999'><img id='splitBtn' style='width:15vh;margin-left:15vh' src='" + variable_8 + "'></div><div style='z-index:99999'><img id='feedBtn' style='width:15vh;margin-left:calc(15vh - 8.25vh)' src='" + variable_9 + "'></div>";
            document.body.appendChild(variable_09);
            var variable_0a = document.createElement("div");
            variable_0a.style.width = "20vh";
            variable_0a.style.height = "20vh";
            variable_0a.style.background = "rgba(0,0,0,0.1)";
            variable_0a.style.display = "none";
            variable_0a.style.borderRadius = "50%";
            variable_0a.style.position = "absolute";
            variable_0a.style.top = "0px";
            variable_0a.style.zIndex = "99999";
            variable_0a.style.margin = "-10vh 0 0 -10vh";
            document.body.appendChild(variable_0a);
            var variable_0b = document.createElement("div");
            variable_0b.style.width = "10vh";
            variable_0b.style.height = "10vh";
            variable_0b.style.background = "rgba(0,0,0,0.1)";
            variable_0b.style.display = "none";
            variable_0b.style.borderRadius = "50%";
            variable_0b.style.position = "absolute";
            variable_0b.style.top = "0px";
            variable_0b.style.zIndex = "99998";
            variable_0b.style.margin = "-5vh 0 0 -5vh";
            document.body.appendChild(variable_0b);
			var variable_0c = ({ 
			"x": 0,
			"y": 0
			});
			var variable_0d = ({ 
			"x": 0, 
			"y": 0 
			});            
			var variable_0e = ({
            "x": 0,
			"y": 0
            });
            var variable_0f = window.innerWidth / window.innerHeight;
            var canvaselement = document.getElementById("canvas");
            canvaselement.style.width = "100vw";
            canvaselement.style.height = "100vh";
            canvaselement.addEventListener("touchstart", function(variable_7) {
			var variable_11 = new MouseEvent("mousemove", {   
			"clientX": variable_7.changedTouches[0].clientX,
			"clientY": variable_7.changedTouches[0].clientY 
			});
                variable_0c.x = variable_7.changedTouches[0].clientX;
                variable_0c.y = variable_7.changedTouches[0].clientY;
                canvaselement.dispatchEvent(variable_11);
                variable_0a.style.display = "inline-block";
                variable_0b.style.display = "inline-block";
                variable_0a.style.left = variable_0c.x + "px";
                variable_0a.style.top = variable_0c.y + "px";
                variable_0b.style.left = variable_0c.x + "px";
                variable_0b.style.top = variable_0c.y + "px"
            }, false);
            canvaselement.addEventListener("touchend", function(variable_7) {
				var variable_11 = new MouseEvent("mousemove", { 
				"clientX": window.innerWidth / 2,
				"clientY": window.innerHeight / 2 
				});
				variable_0c = ({ 
				"x": 0,
				"y": 0});
                canvaselement.dispatchEvent(variable_11);
                variable_0a.style.display = "none";
                variable_0b.style.display = "none"
            }, false);
            canvaselement.addEventListener("touchmove", function(variable_7) {
                variable_0e.x = -(variable_0c.x - variable_7.changedTouches[0].clientX) * 300;
                variable_0e.y = -(variable_0c.y - variable_7.changedTouches[0].clientY) * 300 * variable_0f;
				var variable_11 = new MouseEvent("mousemove", { 
				"clientX": (window.innerWidth / 2) + variable_0e.x,
				"clientY": (window.innerHeight / 2) + variable_0e.y
                });
                canvaselement.dispatchEvent(variable_11);
                variable_0a.style.display = "inline-block";
                variable_0b.style.display = "inline-block";
				if (canvaselement2(variable_0c.x, variable_7.changedTouches[0].clientX, variable_0c.y, variable_7.changedTouches[0].clientY, (window.innerHeight * 10) / 100) == true){
                    variable_0d = variable_01({                        
					"x": variable_7.changedTouches[0].clientX - variable_0c.x,
					"y": variable_7.changedTouches[0].clientY - variable_0c.y 
					}, (window.innerHeight * 10) / 100);
                    variable_0b.style.left = variable_0d.x + variable_0c.x + "px";
                    variable_0b.style.top = variable_0d.y + variable_0c.y + "px"
                } else {
                    variable_0b.style.left = variable_7.changedTouches[0].clientX + "px";
                    variable_0b.style.top = variable_7.changedTouches[0].clientY + "px"
                }
            }, false);
			//document.getElementByiD("title")[0].innerHTML = "<h1> <b>Agar.io LM Mobile</b></h1></font></b>";
/*            if (!document.getElementsByClassName("row")[0].innerHTML.match(/▶/gi)) {
                var variable_12 = document.createElement("a");
                variable_12.href = "http://legendmod.ml";
				variable_12.innerHTML = "." + "Free premium scripts" + ".";
                variable_12.className = "btn btn-primary btn-gifting";

                var variable_13 = document.createElement("a");
                variable_13.href = "http://legendmod.ml";
				variable_13.innerHTML = "." + "Donate to support LM" + ".";
                variable_13.className = "btn btn-primary btn-shop";
            }; */
            document.getElementById("mainui-ads").innerHTML = "<br><a id=\"ftbtn\" href=\"http://legendmod.ml/\" target=\"_blank\"><img style=\"margin-top:-20px\" width=\"300\" height=\"100\" src=\"https://jimboy3100.github.io/banners/iconmod3.png\"></a><br/><br/>";
			$("#advertisement").css("height", "140px");
			

		}
    }, 100);
setTimeout(function() {
	console.group('%cLegend Mobile%c  %chttp://www.legendmod.ml',stylesLegendModConsole1, 'font-size: 48px; background: url(https://jimboy3100.github.io/banners/icon48.png) no-repeat' , stylesLegendModConsole1);
    console.group("Part of");    		
		console.log('%cThe Legend mod Project™', stylesLegendModConsole2);
    console.groupEnd();
    console.group("Mod developed by"); 
		console.log('%c℄🌀Jimboy3100', stylesLegendModConsole2);
    console.groupEnd();
console.groupEnd();
}, 1500);	
