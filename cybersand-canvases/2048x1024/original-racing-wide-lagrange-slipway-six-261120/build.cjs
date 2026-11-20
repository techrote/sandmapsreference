'use strict';
const fs=require('node:fs'),path=require('node:path');
const {W,H,N,M,P,MODEL,POLICY,SITES,CROPS,generate,encodeRects,reach}=require('./geometry.cjs');
const {sha,utf,png}=require('./codec.cjs');
const ENGINE='de109d0131641d6adc8d25bb9ced7ca3d4991105';
const g0=generate(),g=g0.g,{edits,visits}=encodeRects(g);
if(g.length!==2097152||edits.length>32768||visits>32000000||POLICY.length!==55||visits!==g0.grounded)throw Error('limit/grounding');
const replay=new Uint8Array(N);for(let [x,y,w,h,m] of edits){if(!w||!h||!P[m]||x<0||y<0||x+w>W||y+h>H)throw Error('bad rectangle');for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=yy*W+xx;if(replay[i])throw Error('overlap');replay[i]=m;}}
for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error('replay mismatch');
const hist={};for(let v of g)hist[v]=(hist[v]||0)+1;
const clearances={};for(let [w,h] of [[19,15],[23,19],[31,27]]){let r=reach(g,w,h);if(r.missing.length)throw Error('missing sites: '+r.missing);clearances[w+'x'+h]={...r,reached:SITES.length};}
const obstruction=[1400,341,130,79],blocked=g.slice();for(let y=obstruction[1];y<obstruction[1]+obstruction[3];y++)for(let x=obstruction[0];x<obstruction[0]+obstruction[2];x++)blocked[y*W+x]=M.C;
const alt=reach(blocked,31,27);if(alt.missing.join(',')!=='Separator westbound')throw Error('alternate failed: '+alt.missing);
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:MODEL,spawn:[142,636],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup);if(utf(json).length>1048576)throw Error('json bytes');
const pngs={};for(let [name,x,y,w,h] of CROPS){let bytes=png(g,x,y,w,h,W,P);fs.writeFileSync(path.join(__dirname,name),Buffer.from(bytes));pngs[name]={x,y,w,h,bytes:bytes.length,pixels:w*h,sha256:sha(bytes),png_crc_zlib_expected:true,source_cell_pixel_map:true};}
const q={kind:'LAGRANGE_SLIPWAY_SIX_ORIGINAL_RACING_WIDE',revision:'R2',seed:'0x261120d1',engine_main_sha:ENGINE,material_cells:N,extent:[W,H],rectangles:edits.length,setup_json_bytes:utf(json).length,work_visits:visits,source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram:hist,grounded_solids:g0.grounded,discarded_detached_material_cells:g0.discarded,remaining_detached:0,fluids:0,reactive:0,material_laws:'IDs 49 Slate, 58 ReinforcedConcrete, 62 SteelPlate, 100 BasaltColumns, 101 Obsidian, 113 ZincSheet, 117 BareIron, 122 QuartzCrystal; accepted read-only native: Solid, not movable, RuleKernel::None.',midge:{hull:[4,3],model_hash:MODEL,spawn:[142,636]},sites:SITES.map(([name,x,y])=>({name,x,y})),clearances,physical_obstruction:{xywh:obstruction,material:58,missing:alt.missing,remaining:SITES.length-alt.missing.length,finish_reachable:true},grid_sha256:sha(g),setup_sha256:sha(utf(json)),pngs,native:'NATIVE-UNTESTED; installed bridge 4096/32768 capacity unknown, no flight/collisions/persistence tests'};
fs.writeFileSync(path.join(__dirname,'setup-lagrange-slipway-six.json'),json);fs.writeFileSync(path.join(__dirname,'qualification.json'),JSON.stringify(q,null,2)+'\n');
console.log('REBUILT',JSON.stringify({grid_sha:q.grid_sha256,rectangles:q.rectangles,pngs:Object.keys(pngs),sites:SITES.length}));
