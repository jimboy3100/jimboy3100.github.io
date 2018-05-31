/* 
Regexp developer needed for Legend Mod v3.1 to work

Test it in console while using LM v3.1
console.log(a); <-enable this command, to copy the new generated agar.core.js file
The quicker it is fixed, the sooner people will enjoy v3.1 again
Add me on skype, my skype id is jimboy3100


These have problem
17 ->   , 17
18 ->	, 18
19 ->	, 19
25 ->	, 25
27 ->	, 27
35 ->	, 35
*/


jQuery.ajax('http://agar.io/agario.core.js', {
    'success': function(e) {
		
      var ogario = e,
        jQuery = null;
      (jQuery = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = implemOgar(ogario = 
	  implemOgar(ogario, 
	  /(\(function\(([\w$]+)\){)/i, "$1 var ogario=$2.ogario,gameCtx=null;", 1, 1), 
	  /(connect:function\((\w)\){)(\w=[\w$]+\(\w\);)([\w$]+\(\w\);[\w$]+\(\w\)})/i, "$1 ogario.getWS($2); $3$4", 2, 1), 
	  /(([\w$]+)=[\w$]+\.getContext\(\"2d\"\);)/i, "if($2.id===`canvas`){$1 gameCtx=$2;}else{$1}", 3, 1), 
	  /(setTarget:function\((\w),(\w)\)\{)([\w$]+\(\w,\w\)})/i, "$1 if(!ogario.play&&ogario.targeting){$2=ogario.targetX;$3=ogario.targetY;} if(ogario.pause){$2=ogario.innerW/2*ogario.canvasScale; $3=ogario.innerH/2*ogario.canvasScale;}$4", 4, 1), 
	  /(function\s*([\w$]+)\(\w\){return\s*[\w$]+\(\w,\w\)})/i, '$1 ogario.getString=$2;', 5, 1), 
	  /(\w=\w\[\w>>2\]\|0;\w\[\w\+([\d\w]+)>>3]=(\w);\w\[\w\+([\d\w]+)>>3]=(\w);\w\[\w\+([\d\w]+)>>3]=(\w);\w\[\w\+([\d\w]+)>>3]=(\w);)/i, "$1 ogario.setMapCoords($3,$5,$7,$9,$2,$8);", 6, 1), 
	  /if\((\w)<1\.0\){/i, "if($1<ogario.zoomResetValue){", 7, 1), 
	  /(\w)=\w\*(\+[\w$]+)\(\.9,(\+\w)\);/i, "if(!ogario.autoZoom){$1=ogario.zoomValue;} $1=$1*$2((ogario.zoomSpeedValue||0.9),$3); ogario.zoomValue=$1;", 8, 1), 
	  /(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!ogario.autoZoom){$3=ogario.zoomValue;}else{$2}$5", 9, 1), 
	  /(do{\w=\+\w\[\(\w\[\w>>2\]\|0\)\+[\d\w]+>>2];\w=\w\+\s*)(\+\(~~\+\w\(\+\(\w\*\w\/100\.0\)\)\|0\))(;\w=\w\+4\|0}while\(\(\w\|0\)!=\(\w\|0\)\);(\w)=(\w);)/i, 'ogario.playerCellsMass=[]; $1$2; ogario.playerCellsMass.push($2)$3 ogario.playerMass=$5; ogario.calculateMass();', 10, 1), 
	  /if\(\w>0\.0\?\(\w=[\d\w]+,\w=[\w$]+\(\w\|0,\w\|0,\w\[\w>>2\]\|0,\w\[\w\+[\d\w]+>>2\]\|0\)\|0,\w=[\w$]+\(\w\|0,\w\|0,[\d\w]+,0\)\|0,\+\(\w>>>0\)\+4294967296\.0\*\+\(\w\|0\)<\w\):0\){\w=\w;return}/i, '', 11, 1), 
	  /if\(\w\[[\d\w]+\]\|0\)([\w$]+\([\d\w]+,\w\[[\d\w]+\]\|0\);\w=\w;return)/i, '$1', 12, 1), /(if\(\(\w\|0\)==0\|\(\w\[[\d\w]+\]\|0\)==0\){\w\[\w>>2\]\=0;\w\[\w\+[\d\w]+>>2\]=0;\w\[\w\+[\d\w]+>>2\]=0;[\w$]+\(\w,[\d\w]+,15\)}else\s*)([\w$]+\(\w,\w\);)/i, '$2', 13, 1), 
	  /(\w\[\w>>2\]=\(\w\[\w>>2\]\|0\)\+1;)([\w$]+\(\w\);)([\w$]+\(\w\);)(if\(!\(\w\[[\d\w]+\]\|0\)\){[\w$]+\(\w,\w\);(\w=\w)})/i, '$1$2$3 if(1){ogario.drawGrid(gameCtx);$5}', 14, 1), 
	  /([\w$]+\([\d\w]+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\([\d\w]+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+[\d\w]+>>3\]),\+-(\+\w\[\w\+[\d\w]+>>3\])\)\|0;)/i, "$1 ogario.viewScale=$2; ogario.playerX=$4; ogario.playerY=$5; ogario.customDraw(gameCtx);", 15, 1), 
	  /(\w=\w\[\w\+[\d\w]+>>2\]\|0;)(\w=\w\[\w\+[\d\w]+>>2\]\|0;)(if\(\(\w\|0\)!=\(\w\|0\)\)do{[\w$]+\(\w\[\w>>2\]\|0,\w\);\w=\w\+4\|0}while\(\(\w\|0\)!=\(\w\|0\)\);)(\w=\w\[\w\+[\d\w]+>>2\]\|0;)(\w=\w\[\w\+[\d\w]+>>2\]\|0;)(if\(\(\w\|0\)!=\(\w\|0\)\)do{[\w$]+\(\w\[\w>>2\]\|0,\w\);\w=\w\+4\|0}while\(\(\w\|0\)!=\(\w\|0\)\);)/i, '$1$2 ogario.drawRemovedCells=true; $3 ogario.drawRemovedCells=false; $4$5$6', 16, 1), 
	  /(do\s*if\(\w\[\w\+[\d\w]+>>0\]\|0\){)(if\(\(\w\[[\d\w]+\]\|0\)==0\?\(\w\[\(\w\[\w>>2\]\|0\)\+[\d\w]+>>0\]\|0\)==0:0\)break;)/i, "$1 if(ogario.gameMode!==':teams'){break;} $2", 17, 1), 
	  /(while\(0\);)([\w$]+\(\w,\w\);)(\w=\w\[\w>>2\]\|0;)(if\(\(\(\(!\(\(\w\[\w\+[\d\w]+>>0\]\|0\)!=0\|\(\w\[[\d\w]+\]\|0\)==0\)\?\(\w\[\w\+[\d\w]+>>0\]\|0\)==0:0\)\?\(\w\[\w\+[\d\w]+>>0\]\|0\)==0:0\)\?\(\w\[\w\+[\d\w]+>>0\]\|0\)==0:0\)\?\(\w\[[\d\w]+\]\|0\)!=\(\w\[[\d\w]+\]\|0\):0\){[\w$]+\(\w,\w\);\w=\w\[\w>>2\]\|0})(do\s*if\(\w\[\w\+[\d\w]+>>0\]\|0\){if\(\(\w\[\w\+[\d\w]+>>0\]\|0\)==0\?\(\w\[\w\+[\d\w]+>>2\]\|0\)<=0:0\)break;[\w$]+\(\w,\w\)}while\(0\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)(\w=\w\[\w>>2\]\|0;)(if\(!\(\w\[\w\+[\d\w]+>>0\]\|0\)\){)(if\(\w\[\w\+[\d\w]+>>0\]\|0\){\w=\w\+[\d\w]+\|0;\w\[\w>>0\]=1;\w=\w;return})(if\(\w\[\w\+[\d\w]+>>0\]\|0\){\w=\w\+[\d\w]+\|0;\w\[\w>>0\]=1;\w=\w;return})}([\w$]+\(\w,\w\);)(\w=\w\+[\d\w]+\|0;\w\[\w>>0\]=1;\w=\w;return})/i, '$1$14', 18, 1), 
	  /(\w)=\(\w\[\w\+[\d\w]+>>0\]\|0\)!=0;(if\(\w\[[\d\w]+\]\|0\?\(\w\[[\d\w]+\]\|\w\[\w\+[\d\w]+>>0\]\)<<24>>24==0:0\){)(\w=\w\[\w\+[\d\w]+>>2\]\|0;\w=\w)}else{(\w=0;\w=0)}/i, "$1=1; $2 if(!ogario.vanillaSkins&&ogario.customSkins){$4}else{$3}}else{$4}", 19, 1), 
	  /if\((\(\w\|0\)!=0\?\(\w\[\w\+[\d\w]+>>2\]&2\|0\)!=0:0)\){/i, "if(0){", 20, 1), 
	  /(\/100\.0;)(\w+=\w+<0\.0\?0\.0:\w+>1\.0\?1\.0:\w+;)/gi, "/ogario.animation;$2", 21, 1), 
	  /(\/100\.0,)(\(\w+<0\.0\?0\.0:\w+>1\.0\?1\.0:\w+)/gi, "/ogario.animation,$2", 22, 1), 
	  /(if\(\w\[\w\+[\d\w]+>>0\]\|0\){)(\w=\(\w\-\+\w\[\w>>3\]\)\/)(100\.0)(;[\w$]+\([\d\w]+,\w\[\w>>2\]\|0,\+\(\w<0\.0\?1\.0:1\.0-\(\w>1\.0\?1\.0:\w\)\)\)\|0})/i, "$1$2 ogario.animation $4", 23, 1), 
	  /((\w=(\(\w\[(\w)\+[\d\w]+>>0\]\|0\)==0);)([\w$]+\([\d\w]+,\w\[\w>>2\]\|0\)\|0;)([\w$]+\([\d\w]+,\w\[\w>>2\]\|0,\+\(\+(\w\[\w>>2\])\),\+\(\+(\w\[\w>>2\])\),\+\(\w\+\s*\+(\w\[\w>>2\])\),0\.0,6.283185307179586,0\)\|0;)([\w$]+\([\d\w]+,\w\[\w>>2\]\|0\)\|0;)(\w=\w\[\w>>2\]\|0;)if\(!\w\){([\w$]+\([\d\w]+,\w\|0,(\w)&255\|0,(\w)&255\|0,(\w)&255\|0\)\|0;)([\w$]+\([\d\w]+,\w\[\w>>2\]\|0\)\|0;)break}if\(\w\){([\w$]+\([\d\w]+,\w\|0,(\w)&255\|0,(\w)&255\|0,(\w)&255\|0\)\|0;)([\w$]+\([\d\w]+,\w\[\w>>2\]\|0\)\|0))/i, "var cellX=+(+$7),cellY=+(+$8),cellSize=+(+$9),isFood=!$3,isVirus=false,isPlayerCell=false,skipCell=false,nick=null,color=null,skin=null; if(isFood){if(!ogario.showFood||ogario.autoHideFoodOnZoom&&ogario.viewScale<0.2){break;}if(ogario.autoHideFood&&!ogario.foodIsHidden&&ogario.playerMass>1000){ogario.showFood=false;ogario.foodIsHidden=true;break;}if(!ogario.rainbowFood){ogario.foodCache.push({x:cellX,y:cellY,size:cellSize});break;}gameCtx.fillStyle=ogario.rgb2Hex($13&255,$14&255,$15&255);} if(ogario.hideSmallBots&&cellSize<=36){skipCell=true;break;} gameCtx.beginPath();gameCtx.arc(cellX,cellY,cellSize,0,2*Math.PI,false);gameCtx.closePath(); if(isFood){gameCtx.fill();break;} ogario.globalAlpha=gameCtx.globalAlpha; if(gameCtx.lineJoin==='miter'){isVirus=true;if(ogario.virColors&&ogario.play){gameCtx.fillStyle=ogario.setVirusColor(cellSize);gameCtx.strokeStyle=ogario.setVirusStrokeColor(cellSize);}else{gameCtx.fillStyle=ogario.virusColor;gameCtx.strokeStyle=ogario.virusStrokeColor;}if(ogario.transparentViruses){gameCtx.globalAlpha*=ogario.virusAlpha;}if(ogario.virusesRange&&ogario.play){ogario.virusesCache.push({x:cellX,y:cellY,size:cellSize});}gameCtx.fill();gameCtx.globalAlpha=ogario.globalAlpha;gameCtx.lineWidth=ogario.virusStrokeSize;gameCtx.stroke();break;} if((a[$4+ogario.nameMemOffset+15>>0]|0)<0){nick=ogario.getString(c[$4+ogario.nameMemOffset+4>>2]|0);}else{nick=ogario.getString($4+ogario.nameMemOffset+4);} color=ogario.rgb2Hex($18&255|0,$19&255|0,$20&255|0); gameCtx.fillStyle=color; if(nick&&color){if(ogario.showCustomSkins&&ogario.customSkins){skin=ogario.getCustomSkin(nick,color);}} if(ogario.play){var idA=c[$4+ogario.idOffset>>2]|0;var idB=c[ogario.idMemOffset]|0;var idC=c[ogario.idMemOffset+1]|0;loop:do{if((idB|0)!=(idC|0)){while(true){if((c[idB>>2]|0)==(idA|0)){break loop;}idB=idB+4|0;if((idB|0)==(idC|0)){idB=idC;break;}}}}while(false);isPlayerCell=(idB|0)!=(idC|0); if(isPlayerCell){ogario.playerCells.push({x:cellX,y:cellY,size:cellSize});ogario.playerColor=color;} if((ogario.oppColors&&!ogario.oppRings)||(ogario.myCustomColor&&isPlayerCell)){gameCtx.fillStyle=ogario.setOppColor(cellSize,isPlayerCell);} if(!isPlayerCell&&(ogario.splitRange||ogario.oppRings)){ogario.cacheCells(cellX,cellY,cellSize);}} if(ogario.transparentCells){gameCtx.globalAlpha*=ogario.cellsAlpha;}  gameCtx.fill(); gameCtx.globalAlpha=ogario.globalAlpha; if(((ogario.transparentSkins||(ogario.play&&ogario.oppColors))&&!(isPlayerCell&&!ogario.myTransparentSkin))||isPlayerCell&&ogario.myTransparentSkin){gameCtx.globalAlpha*=ogario.skinsAlpha;} if(skin){gameCtx.drawImage(skin,cellX-cellSize,cellY-cellSize,2*cellSize,2*cellSize);} break;$1", 24, 1), 
	  /while\(0\);if\((!\(\(\w\|0\)==0\|\(\w\[[\d\w]+\]\|0\)!=0\))\)/i, "while(0);if(($1)&ogario.vanillaSkins&&!skin)", 25, 1), 
	  /if\(\(\w\[\w\+[\d\w]+>>0\]\|0\)==0\?\(\(\(\w\[\w>>2\]\|0\)\+\(\w\[[\d\w]+\]\|0\)\|0\)>>>0\)%10\|0\|0:0\){\w=\w\[\w>>2\]\|0;[\w$]+\([\d\w]+,\w\|0\)\|0;\w=\w;return}[\w$]+\((\w),\w\);/i, "if(!ogario.drawRemovedCells){ogario.drawCellInfo(gameCtx, $1, cellX, cellY, cellSize, isFood, isVirus, isPlayerCell, skipCell, nick, color, skin !== null);}", 26, 1), 
	  /(\w\[\w\+16>>2\]=0;)(\w\[\w>>2\])=([\w$]+\([\d\w]+\)\|0;)(\w\[[\d\w]+\]=\(\w\[[\d\w]+\]\|0\)\+1)/gi, "$1 $2=-1; $4", 27, 1), 
	  /(}\w\[\w>>2]=-1;\w\[\w>>2])=([\w$]+\([\d\w]+\)\|0;)(\w\[[\d\w]+\]=\(\w\[[\d\w]+\]\|0\)\+1)/gi, "$1=-1; $3", 28, 1), 
	  /(\){)(\w=\w\.\w\[(\w)\]\.canvas)/gi, "$1 if($3==-1){return;} $2", 29, 1), /(\){)(\w\.\w\[(\w)\]\.(globalAlpha|font|scale|fillStyle|strokeStyle|fillRect|fillText|strokeText|textBaseline|lineWidth|lineCap|lineJoin))/gi, '$1 if($3==-1){return;} $2', 30, 1), 
	  /(\){)(return\s+\w\.\w\[(\w)\]\.measureText)/gi, '$1 if($3==-1){return;} $2', 31, 1), 
	  /(\w=0;\w=\w\[(\w)>>2\]\|0;\w=\w\[([\d\w]+)\]\|0;\w=\w\[[\d\w]+\]\|0;)(\w:do)/i, null, 32, 1)) && 
	  (ogario = implemOgar(ogario = implemOgar(ogario, 
	  /ogario.idOffset/g, 0, 33, 1), 
	  /ogario.idMemOffset/g, jQuery[3], 34, 1)), (jQuery = implemOgar(ogario, 
	  /\w=\w\[\([\w$]+\(\w\+([\d\w]+)\+\(~~\(\w<4\.0\?\w:4\.0\)\*80\|0\)\|0\)\|0\)>>2\]\|0;/i, null, 35, 1)) 
	  && (ogario = implemOgar(ogario, 
	  /ogario.nameMemOffset/g, jQuery[1], 36, 1));
      
	  var doc = document.createElement('script');
      doc.textContent = ogario; 
	  doc.async = true;
	  document.body.appendChild(doc);
    },
    'dataType': "text",
    'method': "GET",
    'cache': false,
    'crossDomain': true
	  });
	  
	  
  function implemOgar(a, b, c, d, e) {
    var result = a.match(b);
//	console.log(a);
	console.log(b); //b is regular Expression
	console.log("Number counted: "+d); 
	
	console.log(c); 
	console.log(e);	
    return result ? (e && 2 == e && console.log('[RegExp Debug] Match', d + ':', result), null === c ? result : a.replace(b, c)) : (e && console.log("[RegExp Debug] Missing match:", d), null === c ? null : a);
  }	  
