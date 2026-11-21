"use strict";
/* Independent committed-file replay, PNG decode and ground-connectivity check.
   No writing, and does not depend on builder's internal replay/PNG validators. */
const fs=require("fs"),zlib=require("zlib"),crypto=require("crypto");
const assert=require("assert/strict");
const W=2048,H=1024,N=W*H;
const file=n=>fs.readFileSync(require("path").join(__dirname,n));
const hash=b=>crypto.createHash("sha256").update(b).digest("hex");
const setupRaw=file("setup.json"),receipt=JSON.parse(file("receipt.json")),setup=JSON.parse(setupRaw);
assert.equal(setup.version,2);assert.deepEqual(setup.extent,[W,H]);
const g=new Uint8Array(N),allowed=new Set([58,62,100]);
let area=0;
for(const r of setup.edits){
 assert.equal(r.length,5);
 const [x,y,w,h,m]=r;
 assert.ok([x,y,w,h,m].every(Number.isInteger));
 assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&allowed.has(m));
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  const p=yy*W+xx;assert.equal(g[p],0,"overlap");g[p]=m;area++;
 }
}
assert.equal(setup.edits.length,receipt.rectangles);
assert.equal(hash(g),receipt.material_plane_sha256);
assert.equal(hash(setupRaw),receipt.setup_sha256);
assert.equal(area,receipt.grounded);
const seen=new Uint8Array(N),q=new Int32Array(N);
let first=0,last=0;
for(let x=0;x<W;x++){const p=(H-1)*W+x;if(g[p]){seen[p]=1;q[last++]=p;}}
while(first<last){const p=q[first++],y=(p/W)|0;
 for(const t of [p-W,p+W,p-1,p+1]){
  if(t<0||t>=N||(Math.abs(p-t)===1&&((t/W)|0)!==y)||!g[t]||seen[t])continue;
  seen[t]=1;q[last++]=t;
 }
}
assert.equal(last,area,"material not boundary-grounded");
function crc(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++){c^=bytes[i];for(let j=0;j<8;j++)c=(c>>>1)^(-(c&1)&0xedb88320);}return (c^0xffffffff)>>>0;}
const colors=[0,100,58,62];
function checkPng(im){
 const p=file(im.name+".png");
 assert.equal(hash(p),im.sha256);
 assert.deepEqual([...p.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 let off=8,width=0,height=0,depth=-1,data=[],ended=false;
 while(off<p.length){
  const n=p.readUInt32BE(off),t=p.toString("ascii",off+4,off+8),body=p.subarray(off+8,off+8+n);
  assert.equal(crc(p.subarray(off+4,off+8+n)),p.readUInt32BE(off+8+n),"bad PNG CRC "+t);
  if(t==="IHDR"){width=body.readUInt32BE(0);height=body.readUInt32BE(4);depth=body[8];assert.equal(body[9],3);}
  if(t==="IDAT")data.push(body);
  if(t==="IEND")ended=true;
  off+=12+n;
 }
 assert.ok(ended);assert.equal(off,p.length);assert.equal(depth,2);
 const [x0,y0,w,h]=im.rect;assert.deepEqual([width,height],[w,h]);
 const raw=zlib.inflateSync(Buffer.concat(data)),row=(w+3)>>2;
 assert.equal(raw.length,(row+1)*h);
 for(let y=0;y<h;y++){
  let start=y*(row+1);assert.equal(raw[start],0,"unexpected PNG scanline filter");
  for(let x=0;x<w;x++){
   let index=(raw[start+1+(x>>2)]>>(6-2*(x&3)))&3;
   assert.equal(colors[index],g[(y0+y)*W+x0+x],"mismatched source pixel "+im.name+" @ "+x+","+y);
  }
 }
}
for(const im of receipt.images)checkPng(im);
const generated=require("./build.cjs").generate();
assert.equal(JSON.stringify(generated.setup),JSON.stringify(setup));
assert.ok(generated.status.every(s=>s.reached===Object.keys(receipt.exact_sites).length));
assert.deepEqual(generated.distance,receipt.obstruction.distance_before_after);
console.log(JSON.stringify({result:"PASS",rectangles:setup.edits.length,grounded:area,images:receipt.images.length,sites:Object.keys(receipt.exact_sites).length,distances:generated.distance}));
