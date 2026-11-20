"use strict";
// Completely separate reader/verification of committed Setup-v2 and material-cell PNGs.
// This file does NOT import or execute build.cjs.
const fs=require("fs"),assert=require("assert"),crypto=require("crypto"),zlib=require("zlib");
const W=2048,H=1024,N=W*H,sha=x=>crypto.createHash("sha256").update(x).digest("hex");
const rawSetup=fs.readFileSync(__dirname+"/setup.json"),setup=JSON.parse(rawSetup);
const receipt=JSON.parse(fs.readFileSync(__dirname+"/receipt.json","utf8"));
assert.deepStrictEqual(Object.keys(setup).sort(),["actors","brush","edits","extent","fire","liquid_policy","material","next_id","normalize","response","rule_radius","selected","source","version"]);
assert.strictEqual(setup.version,2);assert.deepStrictEqual(setup.extent,[W,H]);
assert.strictEqual(setup.actors.length,1);
assert.deepStrictEqual(setup.actors[0].spawn,receipt.literal_sites["West windbreak arrivals"]);
assert.strictEqual(rawSetup.length,receipt.setup_bytes);assert.strictEqual(sha(rawSetup),receipt.setup_sha256);
const g=Buffer.alloc(N),used=Buffer.alloc(N),allowed=new Set([49,62,66,68,77,100,101,120,122,129,131]),hist={};
let total=0;
for(const r of setup.edits){
 assert(Array.isArray(r)&&r.length===5,"rectangle must have five fields");const [x,y,w,h,m]=r;
 for(let k of r)assert(Number.isInteger(k),"integer");
 assert(w>0&&h>0&&x>=0&&y>=0&&x+w<=W&&y+h<=H&&allowed.has(m),"invalid bounds/material");
 hist[m]=(hist[m]||0)+w*h;total+=w*h;
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  let i=yy*W+xx;assert(!used[i],"overlapping edit");used[i]=1;g[i]=m;
 }
}
assert.strictEqual(g.length,2097152);assert.strictEqual(total,receipt.filled_material_cells);
assert.strictEqual(total,receipt.rectangle_work);assert.strictEqual(setup.edits.length,receipt.rectangles);
assert.deepStrictEqual(hist,receipt.material_histogram);assert.strictEqual(sha(g),receipt.plane_sha256);
let seen=new Uint8Array(N),queue=new Int32Array(N),head=0,tail=0;
function start(i){if(g[i]&&!seen[i]){seen[i]=1;queue[tail++]=i;}}
for(let x=0;x<W;x++){start(x);start((H-1)*W+x);}
for(let y=0;y<H;y++){start(y*W);start(y*W+W-1);}
while(head<tail){let i=queue[head++],x=i%W;
 if(i>=W)start(i-W);if(i+W<N)start(i+W);
 if(x)start(i-1);if(x<W-1)start(i+1);
}
assert.strictEqual(tail,total,"some inert solids not connected to a canvas edge");
assert.strictEqual(tail,receipt.grounded_cells);assert.strictEqual(receipt.unrooted_cells,0);
// Full-footprint Midge clear-centre 4-neighbour BFS at each literal destination.
function routing(dim,blocked){
 const [w,h]=dim,iw=W+1,ii=new Int32Array((W+1)*(H+1));
 let obstacle=g;
 if(blocked){obstacle=Buffer.from(g);for(let y=blocked[1];y<blocked[3];y++)obstacle.fill(58,y*W+blocked[0],y*W+blocked[2]);}
 for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){row+=obstacle[(y-1)*W+x-1]===0?0:1;ii[y*iw+x]=ii[(y-1)*iw+x]+row;}}
 const pass=new Uint8Array(N);
 for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){
  const a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;
  if(ii[d*iw+c]-ii[d*iw+a]-ii[b*iw+c]+ii[b*iw+a]===0)pass[y*W+x]=1;
 }
 let vis=new Uint8Array(N),q=new Int32Array(N),hd=0,tl=0;
 const [sx,sy]=receipt.literal_sites["West windbreak arrivals"],s=sy*W+sx;
 assert(pass[s],"spawn is not physically clear");vis[s]=1;q[tl++]=s;
 while(hd<tl){let a=q[hd++],x=a%W,j;
  j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;q[tl++]=j;}
  j=a+W;if(j<N&&pass[j]&&!vis[j]){vis[j]=1;q[tl++]=j;}
  j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;q[tl++]=j;}
  j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;q[tl++]=j;}
 }
 const bad=Object.entries(receipt.literal_sites).filter(([n,[x,y]])=>!vis[y*W+x]).map(([n])=>n);
 return {passed:Object.keys(receipt.literal_sites).length-bad.length,bad,reachable_centres:tl};
}
for(let dim of [[19,15],[23,19],[31,27]]){let v=routing(dim,null);assert.strictEqual(v.passed,22,"literal route "+dim);assert(!v.bad.length);}
let obstruction=receipt.physical_obstruction.box;
assert.deepStrictEqual(obstruction,[1564,622,1601,643]);
const blocked=routing([31,27],obstruction);
assert.strictEqual(blocked.passed,21);assert.deepStrictEqual(blocked.bad,["Sealed gate throat"]);
// Independent PNG chunk parser, per-chunk CRC, zlib decode, exact palette-ID comparison.
const crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcTable[n]=c>>>0;}
function crc32(buf){let c=0xffffffff;for(let v of buf)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
let checked=0;
for(const meta of receipt.images){
 const buf=fs.readFileSync(__dirname+"/"+meta.name);
 assert.strictEqual(sha(buf),meta.sha256);
 assert.strictEqual(buf.length,meta.bytes);
 assert.strictEqual(buf.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 let off=8,width=0,height=0,parts=[],end=0,indexed=false;
 while(off<buf.length){
  assert(off+12<=buf.length);const len=buf.readUInt32BE(off),tag=buf.toString("ascii",off+4,off+8);
  assert(off+len+12<=buf.length,"PNG truncated");
  assert.strictEqual(crc32(buf.subarray(off+4,off+8+len)),buf.readUInt32BE(off+8+len),"bad PNG CRC "+tag);
  if(tag==="IHDR"){width=buf.readUInt32BE(off+8);height=buf.readUInt32BE(off+12);indexed=buf[off+16]===8&&buf[off+17]===3&&buf[off+18]===0;}
  if(tag==="IDAT")parts.push(buf.subarray(off+8,off+8+len));
  if(tag==="IEND")end++;
  off+=len+12;
 }
 assert.strictEqual(off,buf.length);assert.strictEqual(end,1);assert(indexed&&parts.length);
 let crop=meta.name==="overview.png"?[0,0,W,H]:receipt.crops.find(c=>c[0]+".png"===meta.name).slice(1);
 const [x0,y0,cw,ch]=crop;assert.strictEqual(width,cw);assert.strictEqual(height,ch);
 let scan=zlib.inflateSync(Buffer.concat(parts));assert.strictEqual(scan.length,(width+1)*height);
 for(let y=0;y<height;y++){let q=y*(width+1);assert.strictEqual(scan[q],0,"nonzero PNG filter");
  for(let x=0;x<width;x++){if(scan[q+1+x]!==g[(y+y0)*W+x+x0])throw Error("PNG material mismatch "+meta.name+" at "+x+","+y);checked++;}
 }
}
console.log(JSON.stringify({independent:"STATIC-PASS",exact_cells:N,rectangles:setup.edits.length,grounded:tail,sites:[22,22,22],obstruction_other_sites:21,images:receipt.images.length,material_index_pixels_checked:checked,plane_sha256:sha(g),native:"NATIVE-UNTESTED"},null,2));
