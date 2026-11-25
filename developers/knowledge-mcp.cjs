'use strict';
// Local read-only MCP adapter for public, static knowledge files.
// Supports 2025-11-25 and compatible initialize-handshake clients; no HTTP listener.
const fs=require('node:fs'),path=require('node:path'),readline=require('node:readline');
const base=path.join(__dirname,'..','knowledge');
const files={get_legend_mod_features:'features.json',get_game_mechanics:'mechanics.json',get_supported_game_modes:'modes.json',get_game_information:'game.json',get_official_resources:'resources.json'};
const empty={type:'object',properties:{},additionalProperties:false};
const tools=Object.keys(files).map(name=>({name,description:'Read public '+files[name]+' documentation; not live server data.',inputSchema:empty,annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}));
tools.push({name:'search_documentation',description:'Search the curated public resource titles and documented feature/mechanic names; returns source URLs.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1,maxLength:200}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}});
const read=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const version=['2025-11-25','2025-06-18','2025-03-26','2024-11-05'];
const send=x=>process.stdout.write(JSON.stringify(x)+'\n');
let initialized=false;
const reply=(id,result)=>send({jsonrpc:'2.0',id,result});
const error=(id,code,message)=>send({jsonrpc:'2.0',id, error:{code,message}});
const result=x=>({content:[{type:'text',text:JSON.stringify(x,null,2)}]});
readline.createInterface({input:process.stdin,crlfDelay:Infinity,terminal:false}).on('line',line=>{
 let q;try{q=JSON.parse(line)}catch{return error(null,-32700,'Parse error')}
 if(!q||q.jsonrpc!=='2.0'||typeof q.method!=='string')return error(q?.id??null,-32600,'Invalid request');
 if(!Object.prototype.hasOwnProperty.call(q,'id')){if(q.method==='notifications/initialized')initialized=true;return;}
 const {id,method,params={}}=q;
 if(method==='initialize'){const v=version.includes(params.protocolVersion)?params.protocolVersion:version[0];return reply(id,{protocolVersion:v,capabilities:{tools:{}},serverInfo:{name:'legend-mod-public-knowledge',version:'1.0.0'},instructions:'Read-only local snapshot of public documentation. Follow source URLs for current facts.'});}
 if(method==='ping')return reply(id,{});
 if(method==='server/discover')return error(id,-32601,'Use initialize-handshake protocol');
 if(!initialized)return error(id,-32002,'Initialize first');
 if(method==='tools/list')return reply(id,{tools});
 if(method!=='tools/call')return error(id,-32601,'Method not found');
 const name=params.name,args=params.arguments??{};
 if(!args||typeof args!=='object'||Array.isArray(args))return error(id,-32602,'Invalid arguments');
 try{
  if(Object.hasOwn(files,name)){if(Object.keys(args).length)return error(id,-32602,'No arguments supported');return reply(id,result(read(files[name])));}
  if(name==='search_documentation'){if(Object.keys(args).some(k=>k!=='query')||typeof args.query!=='string'||!args.query.trim()||args.query.length>200)return error(id,-32602,'Invalid query');const terms=args.query.toLowerCase().trim().split(/\s+/);const rows=[...read('resources.json').resources,...read('features.json').features,...read('mechanics.json').mechanics];return reply(id,result(rows.filter(r=>terms.every(t=>r.name.toLowerCase().includes(t)||r.url.toLowerCase().includes(t))).slice(0,30)));}
  return error(id,-32602,'Unknown tool');
 }catch(e){return reply(id,{isError:true,content:[{type:'text',text:'Public knowledge snapshot unavailable.'}]});}
});
