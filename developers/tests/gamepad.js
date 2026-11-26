/* Gamepad checks: runs ogario/gamepad.js against simulated controllers (lifecycle, button map,
 * held hotkeys, inverted axes, trigger threshold, profile and storage validation).
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
// 4 customization: a fresh page per case (own storage, hotkeys and settings)
function page(o={}){
 const st=o.store||{},c={raf:[],moves:[],wheels:[],calls:[],L:{},focus:true,pads:[]};
 const cv={dispatchEvent(e){if(e.type==='mousemove')c.moves.push([e.clientX,e.clientY]);if(e.type==='wheel')c.wheels.push(e.deltaY);}};
 const w={innerWidth:1000,innerHeight:800,navigator:{getGamepads:()=>c.pads},
  document:{hidden:false,hasFocus:()=>c.focus,activeElement:null,getElementById:id=>id==='canvas'?cv:null,querySelector:()=>null,addEventListener(){},dispatchEvent(){}},
  localStorage:{getItem:k=>Object.prototype.hasOwnProperty.call(st,k)?st[k]:null,setItem(k,v){if(o.full)throw new Error('QuotaExceededError');st[k]=String(v);},removeItem(k){delete st[k];}},
  requestAnimationFrame:f=>c.raf.push(f),setInterval(f){c.tick=f;},Date,Math,Number,Event:class{constructor(t){this.type=t}},
  MouseEvent:class{constructor(t,x){this.type=t;Object.assign(this,x)}},WheelEvent:class{constructor(t,x){this.type=t;Object.assign(this,x)}}};
 w.window=w;w.addEventListener=(t,f)=>c.L[t]=f;
 c.ev={};w.LMEvents={on(n,f){(c.ev[n]=c.ev[n]||[]).push(f);},off(n,f){c.ev[n]=(c.ev[n]||[]).filter(x=>x!==f);}};
 w.legendmod5=Object.assign({gamepadEnabled:true,gamepadDeadzone:0.2},o.settings||{});
 w.application={split(){c.calls.push('split')},doubleSplit(){c.calls.push('doubleSplit')},macroFeed(on){c.calls.push('feed:'+on)},saveSettings(){c.calls.push('saved')}};
 w.hotkeysCommand={
  'hk-tripleSplit':{keyDown(){c.calls.push('triple')},keyUp:null},
  'hk-hold':{keyDown(){c.calls.push('hold:down')},keyUp(){c.calls.push('hold:up')}},
  'hk-macroFeed':{keyDown(){c.calls.push('mf:down')},keyUp(){c.calls.push('mf:up')}}};
 vm.createContext(w);vm.runInContext(src,w);
 c.w=w;c.G=w.LMGamepad;c.store=st;
 c.step=()=>{const q=c.raf;c.raf=[];q.forEach(f=>f());};
 c.go=()=>{c.L.gamepadconnected({gamepad:c.pads[0]});c.step();};
 return c;
}
// buttons: index -> true (digital) or a number (analog value); axes [lx,ly,rx,ry]
const gp=(btn={},axes=[0,0,0,0])=>{const b=[];for(let i=0;i<16;i++){const v=btn[i];b.push(typeof v==='number'?{pressed:v>0.1,value:v}:{pressed:!!v,value:v?1:0});}return {index:0,id:'pad',connected:true,mapping:'standard',buttons:b,axes};};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
{ const c=page();
  check('defaults: the old fixed map',same(c.G.getMap(),{0:'split',1:'feed',2:'doubleSplit',3:'respawn',4:'multiboxSwap',5:'split16',6:'none',7:'none',8:'none',9:'menu',10:'none',11:'none',12:'none',13:'none',14:'none',15:'none'}));
  c.pads=[gp({0:true})];c.go();c.step();
  check('defaults: A splits once while held',c.calls.filter(x=>x==='split').length===1);
  check('defaults: nothing written to storage',!('lmGamepad' in c.store)); }
{ const c=page();
  check('mapping: X to a hotkey',c.G.setButton(2,'hk-tripleSplit')===true);
  check('mapping: bad action or button refused',c.G.setButton(2,'<img>')===false&&c.G.setButton(16,'none')===false&&c.G.setButton(1.5,'none')===false);
  c.G.setButton(0,'none');
  c.pads=[gp({0:true,2:true})];c.go();c.step();
  check('mapping: X runs its hotkey keyDown, not double split',c.calls.includes('triple')&&!c.calls.includes('doubleSplit'));
  check('mapping: A set to none does nothing',!c.calls.includes('split'));
  check('mapping: stored',JSON.parse(c.store.lmGamepad).map[2]==='hk-tripleSplit');
  const c2=page({store:c.store});
  check('mapping: survives a reload',c2.G.getMap()[2]==='hk-tripleSplit'&&c2.G.getMap()[0]==='none'); }
{ const c=page();c.G.setButton(3,'hk-hold');c.G.setButton(4,'hk-hold');
  const n=x=>c.calls.filter(y=>y===x).length;
  c.pads=[gp({3:true})];c.go();c.step();c.step();
  check('hold: keyDown once while held',n('hold:down')===1&&n('hold:up')===0);
  c.pads=[gp({3:true,4:true})];c.step();c.pads=[gp({4:true})];c.step();
  check('hold: two buttons on one hotkey stay down until both are up',n('hold:up')===0);
  c.pads=[gp()];c.step();
  check('hold: keyUp on release',n('hold:up')===1);
  c.pads=[gp({3:true})];c.step();c.focus=false;c.L.blur();c.step();
  check('hold: released on blur',n('hold:up')===2);
  c.focus=true;c.step();
  check('hold: back down on refocus while still held',n('hold:down')===3);
  c.G.setSuspended(true);c.step();
  check('hold: window open (suspended) releases it',n('hold:up')===3);
  c.pads=[gp({0:true})];c.step();
  check('suspended: A does not split',!c.calls.includes('split'));
  c.G.setSuspended(false);c.step();
  check('suspended: a press held from the window does not fire on close',!c.calls.includes('split'));
  c.G.setButton(1,'hk-macroFeed');c.pads=[gp({1:true})];c.step();c.pads=[gp()];c.step();
  check('hold: hk-macroFeed on a button is held, then released',c.calls.join().indexOf('mf:down,mf:up')>=0&&!c.calls.includes('feed:true')); }
{ const c=page({settings:{gamepadInvertX:true,gamepadInvertY:true}});
  c.pads=[gp({},[1,0.5,0,0])];c.go();
  const p=c.moves[c.moves.length-1];
  check('invert: X and Y mirrored around the centre',!!p&&p[0]<500&&p[1]<400);
  const d=page();d.pads=[gp({},[1,0.5,0,0])];d.go();const q=d.moves[d.moves.length-1];
  check('invert off: same distance, other side',!!q&&Math.abs((q[0]-500)+(p[0]-500))<1e-6&&Math.abs((q[1]-400)+(p[1]-400))<1e-6);
  const r=page({settings:{gamepadMoveRange:0.9}});r.pads=[gp({},[1,0,0,0])];r.go();
  check('move range: full tilt at 0.9 of the screen height',Math.abs(r.moves[0][0]-(500+800*0.9))<1e-6);
  const e=page();e.pads=[gp({},[1,0,0,0])];e.go();
  check('move range default: full tilt at 0.45 as before',Math.abs(e.moves[0][0]-(500+800*0.45))<1e-6);
  const lin=d.G._stickOffset(0.6,0,0.2,1)[0],cur=d.G._stickOffset(0.6,0,0.2,2)[0];
  check('curve: above 1 a half tilt moves less',Math.abs(lin-0.5)<1e-9&&Math.abs(cur-0.25)<1e-9);
  check('dead zone: inside gives nothing',d.G._stickOffset(0.1,0.1,0.2,1)===null); }
{ const z=page({settings:{gamepadInvertZoom:true,gamepadZoomSens:2}});z.pads=[gp({},[0,0,0,1])];z.go();
  const y=page();y.pads=[gp({},[0,0,0,1])];y.go();
  check('zoom: default 24 per step',y.wheels[0]===24);
  check('zoom: inverted and twice as fast',z.wheels[0]===-48); }
{ const c=page();c.G.setButton(6,'hk-tripleSplit');
  const n=()=>c.calls.filter(x=>x==='triple').length;
  c.pads=[gp({6:0.3})];c.go();c.step();
  check('trigger: 0.3 is below the default 0.5',n()===0);
  c.pads=[gp({6:0.6})];c.step();
  check('trigger: 0.6 presses',n()===1);
  c.pads=[gp()];c.step();c.w.legendmod5.gamepadTrigger=0.25;c.pads=[gp({6:0.3})];c.step();
  check('trigger: threshold 0.25 presses at 0.3',n()===2);
  check('trigger: digital trigger (pressed, value 0) counts',c.G._buttonDown({pressed:true,value:0},6,0.9)===true);
  check('trigger: other buttons ignore the threshold',c.G._buttonDown({pressed:true,value:0.3},0,0.9)===true); }
{ const G=page().G;
  const bad=G._cleanConfig({map:{0:'<script>',1:5,2:'hk-a b',3:'hk-ok',4:'none',99:'split'},profiles:[
    {name:' My  <pad> ',map:{0:'menu'},opts:{gamepadDeadzone:9,gamepadMoveCurve:'2',gamepadInvertX:'true',gamepadVibrate:true,evil:1}},
    {name:'my pad',map:{}},{name:''},{name:'x'.repeat(50)},null,[],'str',{name:7}]});
  check('validate: bad map entries keep their default',bad.map[0]==='split'&&bad.map[1]==='feed'&&bad.map[2]==='doubleSplit'&&bad.map[3]==='hk-ok'&&bad.map[4]==='none'&&!(99 in bad.map));
  const p0=bad.profiles[0];
  check('validate: names cleaned, duplicates and unusable profiles dropped',bad.profiles.length===2&&p0.name==='My pad'&&bad.profiles[1].name.length===32);
  check('validate: opts clamped, wrong types and unknown keys dropped',same(p0.opts,{gamepadDeadzone:0.5,gamepadVibrate:true}));
  check('validate: profile map filled to 16 buttons',p0.map[0]==='menu'&&p0.map[1]==='feed'&&Object.keys(p0.map).length===16);
  check('validate: not an object gives the defaults',same(G._cleanConfig('x').map,G.defaultMap())&&same(G._cleanConfig([1]).profiles,[]));
  const many=[];for(let i=0;i<30;i++)many.push({name:'p'+i});
  check('validate: at most 20 profiles',G._cleanConfig({profiles:many}).profiles.length===20);
  check('validate: NaN / Infinity refused',G._cleanOpt('gamepadZoomSens',NaN)===undefined&&G._cleanOpt('gamepadZoomSens',Infinity)===undefined);
  const broken=page({store:{lmGamepad:'{not json'}});
  check('validate: broken JSON in storage gives the defaults',same(broken.G.getMap(),G.defaultMap())); }
/* named profiles are Settings profiles now (ogario/modules/profiles.js moves the old list):
 * this file has no profile functions, but keeps an old list in storage until it is moved */
{ const c=page();
  check('profiles: no named-profile functions here any more',['profiles','saveProfile','loadProfile','deleteProfile'].every(k=>!(k in c.G)));
  c.G.setButton(0,'hk-tripleSplit');
  const s2=JSON.parse(c.store.lmGamepad);
  check('profiles: a save without an old list stores none',s2.v===1&&s2.map[0]==='hk-tripleSplit'&&!('profiles' in s2));
  const old=page({store:{lmGamepad:JSON.stringify({v:1,map:{0:'split'},profiles:[{name:'Phone',map:{0:'hk-tripleSplit'},opts:{gamepadMoveRange:0.7}}]})}});
  old.G.setButton(1,'hk-doubleSplit');
  const s3=JSON.parse(old.store.lmGamepad);
  check('profiles: an old list not moved yet survives a button change',s3.map[1]==='hk-doubleSplit'&&s3.profiles.length===1&&s3.profiles[0].name==='Phone'&&s3.profiles[0].opts.gamepadMoveRange===0.7);
  old.store.lmGamepad=JSON.stringify({v:1,map:s3.map});old.G._reload();old.G.setButton(2,'none');
  check('profiles: once moved (gone from storage), a save does not bring it back',!('profiles' in JSON.parse(old.store.lmGamepad))); }
/* the old list kept until profiles.js has it: unusual names are names, the move keeps the buttons in use */
{ const names=['constructor','toString','__proto__','hasOwnProperty'];
  const o={store:{lmGamepad:JSON.stringify({v:1,map:{0:'split'},profiles:names.map(n=>({name:n,map:{0:'menu'}}))})}};
  const c=page(o);
  check('profiles: old setups named like built-in object properties are kept',c.G._cleanConfig(JSON.parse(o.store.lmGamepad)).profiles.map(p=>p.name).join()===names.join());
  o.full=true;c.G.setButton(1,'hk-tripleSplit');o.full=false;
  check('profiles: a button changed while the storage is full is in use',c.G.getMap()[1]==='hk-tripleSplit'&&JSON.parse(o.store.lmGamepad).map[1]!=='hk-tripleSplit');
  check('profiles: once profiles.js has the old list, this copy goes and the buttons in use are saved',typeof c.G._dropLegacy==='function'&&c.G._dropLegacy()===true&&!('profiles' in JSON.parse(o.store.lmGamepad))&&JSON.parse(o.store.lmGamepad).map[1]==='hk-tripleSplit'&&JSON.parse(o.store.lmGamepad).map[0]==='split');
  c.G.setButton(2,'none');
  check('profiles: a later save does not bring the old list back',!('profiles' in JSON.parse(o.store.lmGamepad))); }
{ const G=page().G;
  check('calibration: suggested dead zone',G.suggestDeadzone(0)===0.05&&G.suggestDeadzone(0.06)===0.11&&G.suggestDeadzone(0.071)===0.13&&G.suggestDeadzone(0.9)===0.5&&G.suggestDeadzone('x')===0.05); }
{ const c=page();let rum=[];const p=gp({0:true});p.vibrationActuator={playEffect(t,o){rum.push(o.duration);return Promise.resolve();}};
  c.pads=[p];c.go();c.tick();
  check('vibration off: no rumble on split, no death listener',c.calls.includes('split')&&rum.length===0&&!(c.ev.death||[]).length);
  c.G.setOpts({gamepadVibrate:true});
  check('vibration on: listens to death',(c.ev.death||[]).length===1);
  c.pads=[gp()];c.step();const q=gp({0:true});q.vibrationActuator=p.vibrationActuator;c.pads=[q];c.step();
  check('vibration on: rumble on split',rum.length===1);
  c.ev.death[0]({});
  check('vibration on: rumble on death',rum.length===2&&rum[1]===300);
  c.G.setOpts({gamepadVibrate:false});
  check('vibration off again: death listener removed',!(c.ev.death||[]).length);
  check('test button rumbles with the option off',c.G.testRumble(q)===true&&rum.length===3); }
console.log(fail?fail+' failed':'all gamepad checks passed');process.exit(fail?1:0);
