/* Gamepad lifecycle checks: runs ogario/gamepad.js against simulated controllers.
 * node developers/tests/gamepad.js */
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(process.argv[2] || require('path').join(__dirname, '..', '..', 'ogario', 'gamepad.js'),'utf8');
let raf=[],listeners={},dlisteners={},pads=[],moves=[],calls=[],focus=true;
const canvas={dispatchEvent(e){if(e.type==='mousemove')moves.push([e.clientX,e.clientY]);}};
const ctx={
 window:null,innerWidth:1000,innerHeight:800,
 navigator:{getGamepads:()=>pads},
 document:{hidden:false,hasFocus:()=>focus,activeElement:null,getElementById:id=>id==='canvas'?canvas:null,querySelector:()=>null,addEventListener:(t,f)=>dlisteners[t]=f,dispatchEvent(){}},
 requestAnimationFrame:f=>raf.push(f),setInterval(){},Date,Math,Number,Event:class{constructor(t){this.type=t}},
 MouseEvent:class{constructor(t,o){this.type=t;Object.assign(this,o)}},WheelEvent:class{constructor(t,o){this.type=t}},
};
ctx.window=ctx;ctx.addEventListener=(t,f)=>listeners[t]=f;
ctx.legendmod5={gamepadEnabled:true,gamepadDeadzone:0.2};
ctx.application={split(){calls.push('split')},macroFeed(on){calls.push('feed:'+on)}};
vm.createContext(ctx);vm.runInContext(src,ctx);
const pad=(i,a0=false,b1=false,x=0,y=0)=>({index:i,id:'p'+i,connected:true,buttons:[{pressed:a0},{pressed:b1}],axes:[x,y,0,0]});
const step=()=>{const q=raf;raf=[];q.forEach(f=>f());};
let fail=0;const check=(n,c)=>{console.log((c?'ok   ':'FAIL ')+n);if(!c)fail++;};
// 1 reconnect at same index
pads=[pad(0),pad(1,true)];listeners.gamepadconnected({gamepad:pads[0]});step();step();
calls=[];pads=[pad(0)];listeners.gamepaddisconnected({gamepad:{index:1,id:'p1'}});step();
pads=[pad(0),pad(1,true)];step();
check('reconnected pad: first press splits',calls.includes('split'));
// 2 joystick release and re-engage
pads=[pad(0,false,false,1,0)];moves=[];step();const n1=moves.length;
pads=[pad(0)];step();pads=[pad(0,false,false,1,0)];step();
check('stick re-engaged at same spot: moves again',n1===1&&moves.length===2);
// 3 blur while feeding
pads=[pad(0,false,true)];calls=[];step();
check('feed held: feeding',calls.includes('feed:true'));
focus=false;listeners.blur();step();
check('blur: feed released and stays released',calls[calls.length-1]==='feed:false'&&calls.filter(c=>c==='feed:true').length===1);
focus=true;pads=[pad(0,true,true)];calls=[];step();
check('refocus: held feed resumes',calls.includes('feed:true'));
console.log(fail?fail+' failed':'all gamepad checks passed');process.exit(fail?1:0);
