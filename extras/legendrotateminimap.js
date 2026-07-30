var c=document.getElementById("minimap-sectors");var ctx = c.getContext("2d");ctx.clearRect(0, 0, c.width, c.height);
ctx.font="16px Georgia";
//ctx.fillText(minbtext2,c.width/2,22);
var xcanvas=$("#minimap-sectors").width();
var spacewidth=($("#minimap").width() -  xcanvas)/2;
var spaceheight=$("#minimap").height() -  xcanvas - spacewidth;


//Var c=document.getElementById("minimap-sectors");
//var ctx=c.getContext("2d");

ctx.beginPath();
ctx.moveTo(0,spaceheight);
ctx.lineTo(0,$("#minimap").height() - spacewidth);
ctx.lineTo(xcanvas,$("#minimap").height() - spacewidth);
ctx.lineTo(xcanvas,spaceheight);
ctx.lineTo(0,spaceheight);
ctx.stroke();


ctx.moveTo(xcanvas/5,spaceheight);
ctx.lineTo(xcanvas/5,$("#minimap").height() - spacewidth);
ctx.stroke();
ctx.moveTo(2*xcanvas/5,spaceheight);
ctx.lineTo(2*xcanvas/5,$("#minimap").height() - spacewidth);
ctx.stroke();
ctx.moveTo(3*xcanvas/5,spaceheight);
ctx.lineTo(3*xcanvas/5,$("#minimap").height() - spacewidth);
ctx.stroke();
ctx.moveTo(4*xcanvas/5,spaceheight);
ctx.lineTo(4*xcanvas/5,$("#minimap").height() - spacewidth);
ctx.stroke();

ctx.moveTo(0,spaceheight + xcanvas/5);
ctx.lineTo(xcanvas,spaceheight + xcanvas/5);
ctx.stroke();
ctx.moveTo(0,spaceheight + 2*xcanvas/5);
ctx.lineTo(xcanvas,spaceheight + 2*xcanvas/5);
ctx.stroke();
ctx.moveTo(0,spaceheight + 3*xcanvas/5);
ctx.lineTo(xcanvas,spaceheight + 3*xcanvas/5);
ctx.stroke();
ctx.moveTo(0,spaceheight + 4*xcanvas/5);
ctx.lineTo(xcanvas,spaceheight + 4*xcanvas/5);
ctx.stroke();

if (rotateminimap==0){
ctx.fillText("Legend Mod/0°",c.width/2,22);
ctx.fillText("A1",(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("A2",3*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("A3",5*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("A4",7*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("A5",9*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);

ctx.fillText("B1",(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B2",3*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B3",5*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B4",7*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B5",9*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);

ctx.fillText("C1",(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C2",3*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C3",5*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C4",7*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C5",9*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);

ctx.fillText("D1",(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D2",3*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D3",5*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D4",7*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D5",9*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);

ctx.fillText("E1",(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("E2",3*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("E3",5*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("E4",7*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("E5",9*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
}
//Rotate 90 degrees
if (rotateminimap==1){
ctx.fillText("Legend Mod/90°",c.width/2,22);
ctx.fillText("E1",(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("D1",3*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("C1",5*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("B1",7*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("A1",9*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);

ctx.fillText("E2",(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D2",3*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("C2",5*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B2",7*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("A2",9*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);

ctx.fillText("E3",(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("D3",3*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C3",5*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("B3",7*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("A3",9*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);

ctx.fillText("E4",(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D4",3*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("C4",5*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B4",7*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("A4",9*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);

ctx.fillText("E5",(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("D5",3*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("C5",5*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("B5",7*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("A5",9*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
}
//Rotate 180 degrees
if (rotateminimap==2){
ctx.fillText("Legend Mod/180°",c.width/2,22);
ctx.fillText("E5",(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("E4",3*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("E3",5*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("E2",7*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("E1",9*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);

ctx.fillText("D5",(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D4",3*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D3",5*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D2",7*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D1",9*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);

ctx.fillText("C5",(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C4",3*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C3",5*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C2",7*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C1",9*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);

ctx.fillText("B5",(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B4",3*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B3",5*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B2",7*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B1",9*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);

ctx.fillText("A5",(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("A4",3*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("A3",5*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("A2",7*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("A1",9*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
}
//Rotate 270 degrees
if (rotateminimap==3){
ctx.fillText("Legend Mod/270°",c.width/2,22);
ctx.fillText("A5",(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("B5",3*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("C5",5*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("D5",7*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);
ctx.fillText("E5",9*(xcanvas/5)/2,spaceheight+(xcanvas/5)/2);

ctx.fillText("A4",(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("B4",3*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("C4",5*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("D4",7*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);
ctx.fillText("E4",9*(xcanvas/5)/2,spaceheight+3*(xcanvas/5)/2);

ctx.fillText("A3",(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("B3",3*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("C3",5*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("D3",7*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);
ctx.fillText("E3",9*(xcanvas/5)/2,spaceheight+5*(xcanvas/5)/2);

ctx.fillText("A2",(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("B2",3*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("C2",5*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("D2",7*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);
ctx.fillText("E2",9*(xcanvas/5)/2,spaceheight+7*(xcanvas/5)/2);

ctx.fillText("A1",(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("B1",3*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("C1",5*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("D1",7*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
ctx.fillText("E1",9*(xcanvas/5)/2,spaceheight+9*(xcanvas/5)/2);
}
if (rotateminimapfirst==0){
toastr["info"]("Minimap is still unrotated, only sectors rotate").css("width","210px");
rotateminimapfirst=1;
}
