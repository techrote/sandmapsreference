#!/usr/bin/env node
"use strict";
/* Independent artifact validator: reads serialized JSON + PNGs, does not call builder. */
const fs=require("fs"),zlib=require("zlib"),crypto=require("crypto"),path=require("path"),root=__dirname;
const load=n=>JSON.parse(fs.readFileSync(path.join(root,n),"utf8"));
const d=load("setup-mosaic-viaduct-commons.json"),s=d.starting_setup,ev=load("evidence.json"),pal=load("material-palette.json"),W=2048,H=2048;
if(d.format!=="cybersand-generated-start-v1"||d.version!==1||s.version!==2||s.extent[0]!==W||s.extent[1]!==H||s.edits.length>32768||Buffer.byteLength(JSON.stringify(d))>1048576)throw Error("setup/schema/budget");
const allowed=new Map(pal.filter(p=>p.valid).map(p=>[p.id,p])),g=new Uint8Array(W*H);let cells=0;
for(let e of s.edits){if(!Array.isArray(e)||e.length!==5||!e.every(Number.isInteger))throw Error("bad stamp");let [x,y,w,h,v]=e;if(x<0||y<0||w<=0||h<=0||x+w>W||y+h>H||v===0||!allowed.has(v)||allowed.get(v).state!=="Solid"||allowed.get(v).movable)throw Error("physical/material bounds");
 for(let yy=y;yy<y+h;yy++)for(let i=yy*W+x;i<yy*W+x+w;i++){if(g[i])throw Error("overlapping rectangles");g[i]=v;cells++}}
let sha=crypto.createHash("sha256").update(g).digest("hex");if(sha!==ev.material_sha256||cells!==ev.covered_cells)throw Error("whole-plane SHA/coverage");
let pixels=0;
for(let [name,r] of Object.entries(ev.crops)){let [ox,oy,w,h,scale]=r,buf=fs.readFileSync(path.join(root,name)),pos=8,wh=null,colors=null,z=[];
 if(!buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error("not PNG");
 while(pos<buf.length){let n=buf.readUInt32BE(pos),type=buf.toString("ascii",pos+4,pos+8),body=buf.subarray(pos+8,pos+8+n);pos+=n+12;
 if(type==="IHDR")wh=[body.readUInt32BE(0),body.readUInt32BE(4),body[8],body[9]];if(type==="PLTE")colors=body;if(type==="IDAT")z.push(body);if(type==="IEND")break}
 if(!wh||wh[0]!==w||wh[1]!==h||wh[2]!==8||wh[3]!==3||!colors)throw Error("PNG geometry "+name);
 for(let [id,mat] of allowed)for(let k=0;k<3;k++)if(colors[id*3+k]!==mat.rgba[k])throw Error("palette "+name+" "+id);
 let raw=zlib.inflateSync(Buffer.concat(z));if(raw.length!==(w+1)*h)throw Error("PNG compressed pixels");
 for(let y=0;y<h;y++){let row=y*(w+1);if(raw[row]!==0)throw Error("PNG filter "+name);for(let x=0;x<w;x++){if(raw[row+x+1]!==g[(oy+y*scale)*W+ox+x*scale])throw Error("PNG/material mismatch "+name+" "+x+","+y);pixels++}}
}
function bfs(w,h){let stride=W+1,pre=new Int32Array(stride*(H+1));for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=(g[(y-1)*W+x-1]!==0);pre[y*stride+x]=sum+pre[(y-1)*stride+x]}}
let hx=w>>1,hy=h>>1,free=new Uint8Array(g.length);for(let y=hy;y<H-hy;y++){let t=(y-hy)*stride,b=(y+hy+1)*stride;for(let x=hx;x<W-hx;x++)if(pre[b+x+hx+1]-pre[t+x+hx+1]-pre[b+x-hx]+pre[t+x-hx]===0)free[y*W+x]=1}
let seen=new Uint8Array(g.length),queue=new Int32Array(g.length),at=0,n=0,origin=502*W+404;if(free[origin]){seen[origin]=1;queue[n++]=origin}
while(at<n){let i=queue[at++],x=i%W,y=i/W|0;for(let j of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(j>=0&&free[j]&&!seen[j]){seen[j]=1;queue[n++]=j}}
return {size:[w,h],centres:n,sites:ev.targets.filter(t=>seen[t.point[1]*W+t.point[0]]).length}}
let c=[bfs(19,15),bfs(23,19)];if(c.some(x=>x.sites!==16))throw Error("exact operational target unreachable");
console.log(JSON.stringify({pass:true,rectangles:s.edits.length,plane_sha256:sha,validated_PNG_pixels:pixels,strict_clearance:c},null,2));
