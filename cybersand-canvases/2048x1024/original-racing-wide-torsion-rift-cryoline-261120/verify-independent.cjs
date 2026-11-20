#!/usr/bin/env node
"use strict";
// Independent committed-file verifier, does not import the creator's build.cjs.
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),crypto=require("node:crypto"),root=__dirname;
const receipt=JSON.parse(fs.readFileSync(path.join(root,"qualification.json"),"utf8"));
const raw=fs.readFileSync(path.join(root,"setup-torsion-rift-cryoline.json")),setup=JSON.parse(raw.toString("utf8"));
const W=2048,H=1024,sha=x=>crypto.createHash("sha256").update(x).digest("hex"),assert=(v,m)=>{if(!v)throw Error(m);},equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ROOT=["version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"];
assert(equal(Object.keys(setup).sort(),ROOT.sort())&&setup.version===2&&equal(setup.extent,[W,H]),"accepted strict Setup-v2 root contract");
assert(setup.response==="LA-SELECTIVE"&&setup.liquid_policy.length===55&&setup.rule_radius===2&&setup.normalize===false&&equal(setup.source,[])&&setup.material===2&&setup.brush===8&&setup.fire===false,"mandatory loader field values");
assert(setup.actors.length===1&&setup.actors[0].model==="midge"&&setup.actors[0].hash==="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96"&&equal(setup.actors[0].spawn,[136,629]),"actual authored Midge actor");
assert(raw.length===receipt.setup_json_bytes&&sha(raw)===receipt.setup_sha256&&raw.length<=1048576&&setup.edits.length===receipt.rectangles&&setup.edits.length<=32768,"setup bytes/hash/budget");
const g=new Uint8Array(W*H),allowed=new Set([49,58,62,100,101,113,117,122,128]);let visits=0;
for(let [x,y,w,h,m]of setup.edits){assert([x,y,w,h,m].every(Number.isInteger)&&x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&allowed.has(m),"invalid box/material");
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=yy*W+xx;assert(!g[i],"overlap");g[i]=m;visits++;}}
const hist={};for(let v of g)hist[v]=(hist[v]||0)+1;
assert(visits===receipt.work_visits&&visits<=32000000&&sha(g)===receipt.grid_sha256&&equal(hist,receipt.histogram)&&visits===receipt.grounded_solids,"grid equality/hash/histogram/visits");
const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,b=0;function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}
assert(b===visits&&receipt.remaining_detached===0,"unanchored solid");
const crc=t=>{let c=0xffffffff;for(let v of t){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
for(const [name,meta]of Object.entries(receipt.pngs)){let bytes=fs.readFileSync(path.join(root,name)),p=8,idat=[],hdr=null,pal=false,end=false;assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG signature");
 while(p<bytes.length){let len=bytes.readUInt32BE(p),key=bytes.toString("ascii",p+4,p+8),d=bytes.subarray(p+8,p+8+len),fin=p+12+len;assert(fin<=bytes.length&&crc(bytes.subarray(p+4,p+8+len))===bytes.readUInt32BE(p+8+len),"PNG CRC "+name);if(key==="IHDR")hdr=[d.readUInt32BE(0),d.readUInt32BE(4),d[8],d[9]];if(key==="PLTE")pal=true;if(key==="IDAT")idat.push(d);if(key==="IEND"){assert(len===0&&fin===bytes.length,"PNG IEND");end=true;}p=fin;}
 assert(end&&pal&&equal(hdr,[meta.w,meta.h,8,3])&&sha(bytes)===meta.sha256,"PNG structure/hash "+name);
 let data=zlib.inflateSync(Buffer.concat(idat));assert(data.length===(meta.w+1)*meta.h,"PNG decoded length");for(let y=0;y<meta.h;y++){let row=y*(meta.w+1);assert(data[row]===0,"PNG filter");for(let x=0;x<meta.w;x++)assert(data[row+x+1]===g[(meta.y+y)*W+meta.x+x],"PNG material indexed parity "+name+" "+x+","+y);}
}
const integral=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let n=0;for(let x=1;x<=W;x++){n+=g[(y-1)*W+x-1]!==0?1:0;integral[y*stride+x]=integral[(y-1)*stride+x]+n;}}
function reachable(w,h,block=false){let legal=new Uint8Array(g.length),seen=new Uint8Array(g.length),queue=new Int32Array(g.length),l=w>>1,r=w-1-l,t=h>>1,bo=h-1-t;
 for(let y=t;y<H-bo;y++)for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1,ya=y-t,yb=y+bo+1;let k=integral[yb*stride+xb]-integral[ya*stride+xb]-integral[yb*stride+xa]+integral[ya*stride+xa];if(block&&x>=840-l&&x<999+r&&y>=590-t&&y<684+bo)continue;if(k===0)legal[y*W+x]=1;}
 const start=629*W+136;assert(legal[start],"spawn not free");let a=0,b=1;queue[0]=start;seen[start]=1;while(a<b){let i=queue[a++],x=i%W,y=(i-x)/W;for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n>=0&&legal[n]&&!seen[n]){seen[n]=1;queue[b++]=n;}}return {connected:b,missing:receipt.sites.filter(s=>!seen[s.x+W*s.y]).map(s=>s.name)};}
for(let [w,h]of [[19,15],[23,19],[31,27]]){let n=reachable(w,h),c=receipt.clearances[w+"x"+h];assert(!n.missing.length&&n.connected===c.connected,"exact whole-body cardinal BFS "+w+"x"+h);}
const obstacle=reachable(31,27,true);assert(equal(obstacle.missing,["Rift Lower Approach"])&&receipt.physical_obstruction.remaining===receipt.sites.length-1,"physically blocked route");
console.log(JSON.stringify({result:"INDEPENDENT_SOURCE_STATIC_PASS",rectangles:setup.edits.length,material_cells:g.length,visits,grounded:b,sites:receipt.sites.length,pngs:Object.keys(receipt.pngs).length,grid_sha256:receipt.grid_sha256,native:"NATIVE-UNTESTED"},null,2));
