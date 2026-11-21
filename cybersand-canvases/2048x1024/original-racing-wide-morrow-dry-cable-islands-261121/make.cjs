#!/usr/bin/env node
/** Reproducible author-only artifact builder: node make.cjs; Node 18+.
 * No image sources, random traffic, native Workbench claims or third-party deps.
 */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const ROOT=__dirname;
const core=fs.readFileSync(path.join(ROOT,'core.js'),'utf8');
const png=fs.readFileSync(path.join(ROOT,'png.js'),'utf8');
const api=vm.runInNewContext(core+'\n'+png+';({W,H,SEED,SITES,PRIMARY,ALTERNATE,OBSTRUCTION,BLOCKED_SITE,CROP,MATERIALS,COLORS,makeGrid,encode,makeSetup,makePng})');
const ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const grid=api.makeGrid(),setup=api.makeSetup(grid,ACTOR_HASH,POLICY);
const setupText=JSON.stringify(setup)+'\n';
fs.writeFileSync(path.join(ROOT,'setup-morrow-dry-cable-islands.json'),setupText);
const pngMap={};let imagePixels=0;
for(const [name,x,y,w,h] of api.CROP){const buf=api.makePng(grid,x,y,w,h);fs.writeFileSync(path.join(ROOT,name),Buffer.from(buf));pngMap[name]=[x,y,w,h];imagePixels+=w*h}
const histogram={};for(const id of grid)histogram[String(id)]=(histogram[String(id)]||0)+1;
const siteProof={sites:api.SITES,primary_route:api.PRIMARY,alternate_route:api.ALTERNATE,obstruction_xywh:api.OBSTRUCTION,blocked_site:api.BLOCKED_SITE};
fs.writeFileSync(path.join(ROOT,'route-data.json'),JSON.stringify(siteProof,null,2)+'\n');
const q={schema_version:1,title:'Morrow Dry Cable Islands',status:'SOURCE-STATIC QUALIFICATION / NATIVE-UNTESTED',seed:api.SEED,engine_main_sha:'f7e056c9b8791106e22f2d1c295043783d8a9701',reference_main_sha_at_branch:'99a166e7fcae45eb22be1740e9f33f62faccbcc7',grid_dimensions:[api.W,api.H],source_grid_sha256:sha(Buffer.from(grid)),setup_sha256:sha(Buffer.from(setupText)),setup_bytes:Buffer.byteLength(setupText),rectangle_count:setup.edits.length,rectangle_work:setup.edits.reduce((a,r)=>a+r[2]*r[3],0),material_histogram:histogram,sites:api.SITES,primary_route:api.PRIMARY,alternate_route:api.ALTERNATE,obstruction_xywh:api.OBSTRUCTION,blocked_site:api.BLOCKED_SITE,png_crops:pngMap,verified_png_pixels:imagePixels,apparent_bridges_are_material:true,native:'NATIVE-UNTESTED'};
fs.writeFileSync(path.join(ROOT,'qualification.json'),JSON.stringify(q,null,2)+'\n');
console.log(JSON.stringify({sha:q.source_grid_sha256,rectangles:q.rectangle_count,setup_bytes:q.setup_bytes,solid:q.rectangle_work,png_pixels:q.verified_png_pixels}));
