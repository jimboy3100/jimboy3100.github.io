var image = new Image;
image.src = $(".agario-profile-picture").attr("src");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.style.position = "absolute";
canvas.style.top = "0px";
canvas.style.left = "0px";
document.body.appendChild(canvas);
var w,h;
function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight;}
resize();
window.addEventListener("resize",resize);
function rand(min,max){return Math.random() * (max ?(max-min) : min) + (max ? min : 0) }
function DO(count,callback){ while (count--) { callback(count) } }
const sprites = [];
DO(500,()=>{
    sprites.push({
       x : rand(w), y : rand(h),
       xr : 0, yr : 0, // actual position of sprite
       r : rand(Math.PI * 2),
       scale : rand(0.1,0.25),
       dx : rand(-2,2), dy : rand(-2,2),
       dr : rand(-0.2,0.2),
    });
});
function drawImage(image, spr){
    ctx.setTransform(spr.scale, 0, 0, spr.scale, spr.xr, spr.yr); // sets scales and origin
    ctx.rotate(spr.r);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
}
function update(){
    var ihM,iwM;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,w,h);
    if(image.complete){
      var iw = image.width;
      var ih = image.height;
      for(var i = 0; i < sprites.length; i ++){
          var spr = sprites[i];
          spr.x += spr.dx;
          spr.y += spr.dy;
          spr.r += spr.dr;
          iwM = iw * spr.scale * 2 + w;
          ihM = ih * spr.scale * 2 + h;
          spr.xr = ((spr.x % iwM) + iwM) % iwM - iw * spr.scale;
          spr.yr = ((spr.y % ihM) + ihM) % ihM - ih * spr.scale;
          drawImage(image,spr);
      }
    }    
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
