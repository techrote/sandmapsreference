"use strict";
/* Separate Node verification of committed source-static material artifacts.
   This is intentionally not used to generate the source grid or publish PNGs. */
const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");
const {generate}=require("./build.cjs");
const W=2048,H=1024,N=W*H,IDS=new Set([0,58,62,100]);
function sha(b){return crypto.createHash("sha256").update(b).digest("hex")}
function eq(name,bytes){const onDisk=fs.readFileSync(path.join(__dirname,name));if(!onDisk.equals(Buffer.from(bytes)))throw Error("committed byte mismatch: "+name);}
function crc32(b){let c=0xffffffff;for(const z of b){c^=z;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0}
const setup=JSON.parse(fs.readFileSync(path.join(__dirname,"setup.json"),"utf8"));
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,"receipt.json"),"utf8"));
const a=generate(),g=new Uint8Array(N),hist={0:0,58:0,62:0,100:0};
if(setup.version!==2||setup.extent[0]!==W||setup.extent[1]!==H)throw Error("Setup extent/version");
if(setup.edits.length>32768||setup.edits.length!==receipt.rectangles)throw Error("rectangle budget/count");
for(const [x,y,w,h,m] of setup.edits){
 if(!IDS.has(m)||m===0||w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error("illegal rectangle");
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const at=yy*W+xx;if(g[at])throw Error("overlap");g[at]=m;}
}
for(let i=0;i<N;i++){if(!IDS.has(g[i])||g[i]!==a.g[i])throw Error("material plane mismatch at "+i);hist[g[i]]++;}
if(sha(Buffer.from(g))!==receipt.material_plane_sha256)throw Error("grid SHA mismatch");
for(const [id,count] of Object.entries(hist))if(count!==receipt.material_histogram[id])throw Error("hist mismatch "+id);
eq("setup.json",Buffer.from(JSON.stringify(setup)));
eq("receipt.json",Buffer.from(JSON.stringify(a.receipt,null,2)+"\n"));
if(JSON.stringify(setup.actors[0].spawn)!==JSON.stringify(a.sites["Western lift apron"]))throw Error("spawn");
if(a.status.some(s=>s.reached!==s.total)||a.receipt.obstruction.sites_reached!==Object.keys(a.sites).length||a.distance[1]<=a.distance[0])throw Error("routing or detour");
for(const im of a.images){
 const bytes=fs.readFileSync(path.join(__dirname,im.name+".png"));
 if(sha(bytes)!==im.sha256)throw Error("image SHA "+im.name);
 if(bytes.length<32||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error("PNG sig");
 let off=8,idat=[],w=0,h=0;
 while(off<bytes.length){let n=bytes.readUInt32BE(off),tag=bytes.toString("ascii",off+4,off+8),content=bytes.subarray(off+8,off+8+n);
  if(crc32(bytes.subarray(off+4,off+8+n))!==bytes.readUInt32BE(off+8+n))throw Error("PNG CRC "+tag);
  if(tag==="IHDR"){w=content.readUInt32BE(0);h=content.readUInt32BE(4);if(content[8]!==2||content[9]!==3)throw Error("PNG not indexed");}
  if(tag==="IDAT")idat.push(content);
  off+=12+n;
 }
 if(w!==im.rect[2]||h!==im.rect[3]||off!==bytes.length)throw Error("PNG dimensions/extent");
 const pixels=zlib.inflateSync(Buffer.concat(idat)),row=(w+3)>>2,inv=[0,100,58,62];
 if(pixels.length!==h*(row+1))throw Error("PNG inflated size");
 for(let y=0;y<h;y++){let o=y*(row+1);if(pixels[o]!==0)throw Error("nonzero filter");for(let x=0;x<w;x++){
  const idx=(pixels[o+1+(x>>2)]>>(6-2*(x&3)))&3;
  if(inv[idx]!==g[(y+im.rect[1])*W+x+im.rect[0]])throw Error("PNG/material mismatch "+im.name+" "+x+","+y);
 }}
}
console.log(JSON.stringify({result:"SOURCE-EXACT PASS",grid:sha(g),rectangles:setup.edits.length,sites:a.status.map(s=>s.reached+"/"+s.total),detour:a.distance,images:a.images.length,bytes:receipt.setup_bytes}));
