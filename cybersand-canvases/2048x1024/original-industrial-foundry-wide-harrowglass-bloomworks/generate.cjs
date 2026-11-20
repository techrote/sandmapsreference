'use strict';
// Run: node generate.cjs && node verify.cjs
// All files are derived deterministically from the authored material grid; zero image inputs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {build,rectangles}=require('./build.cjs');
const {ENGINE,setup,bytes,sha256,png,CROPS}=require('./format.cjs');
const {analysis,assertQualified,replay}=require('./audit.cjs');
const b=build(),e=rectangles(b.g,b.W,b.H);
const test=analysis(b.g,b.W,b.H,b.sites);assertQualified(test);
const obj=setup(b,e),json=JSON.stringify(obj),data=bytes(json);
if(data.length>1048576)throw Error('Setup exceeds one MiB');
const copy=replay(obj);
if(copy.work>32000000||e.length>32768)throw Error('construction capacity');
if(copy.grid.length!==b.g.length)throw Error('replay extent mismatch');
for(let i=0;i<b.g.length;i++)if(copy.grid[i]!==b.g[i])throw Error('lossless replay mismatch '+i);
if(e.some(([x,y,w,h,m])=>!m))throw Error('air edits forbidden');
fs.writeFileSync(path.join(__dirname,'setup.json'),data);
const pngs={};for(const [name,x,y,w,h] of CROPS){const buffer=png(b,x,y,w,h);
fs.writeFileSync(path.join(__dirname,name),buffer);
pngs[name]={viewport:[x,y,w,h],bytes:buffer.length,sha256:sha256(buffer)}}
const receipt={
schema:1,original_no_source:true,concept:'Harrowglass induction bloomworks',
seed:b.SEED,extent:[b.W,b.H],engine_sha:ENGINE,
material_plane_sha256:sha256(b.g),
setup_sha256:sha256(data),json_bytes:data.length,
rectangle_count:e.length,rectangle_budget:32768,installed_fallback_unknown:4096,
construction_work:copy.work,construction_work_budget:32000000,
materials:test.histogram,ground:test.ground,fluid_air_faces:test.fluid_air_faces,
flight:test.flight,blocked_alternative:test.alternate,
named_sites:b.sites.map(([name,x,y])=>({name,x,y})),
pngs,native:'NATIVE-UNTESTED',
limitations:['No installed Windows Godot/CyberDemoBridge compatibility probe','No Rapier control, continuous liquid evolution or fresh-process save/reopen test']
};
fs.writeFileSync(path.join(__dirname,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
const check=crypto.createHash('sha256').update(b.g).digest('hex');if(check!==receipt.material_plane_sha256)throw Error('SHA-256 mismatch against Node crypto');
console.log(JSON.stringify({extent:receipt.extent,rectangles:e.length,json_bytes:data.length,work:copy.work,sha256:check,ground:test.ground,flight:test.flight.map(x=>x.sites.filter(s=>s.reachable).length),alternate:test.alternate.sites.filter(s=>s.reachable).length,pngs:Object.keys(pngs)}));
