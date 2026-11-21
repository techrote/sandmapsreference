'use strict';
// Verifies COMMITTED BYTES, not the generator's in-memory PNG or Setup encoder.
// Standard-library inflate and independent replay/parity logic are deliberately
// separate from build.cjs. Still creator-supplied, NOT external independent review.
const fs=require('node:fs'),crypto=require('node:crypto'),zlib=require('node:zlib'),path=require('node:path');
const {buildWorld}=require('./geometry.cjs');
function assert(ok,msg){if(!ok)throw Error(msg)}
function digest(b){return crypto.createHash('sha256').update(b).digest('hex')}
function crc32(b){let c=0xffffffff;for(const v of b){c^=v;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
const root=__dirname,setupBytes=fs.readFileSync(path.join(root,'setup.json')),receiptBytes=fs.readFileSync(path.join(root,'receipt.json'));
const setup=JSON.parse(setupBytes),receipt=JSON.parse(receiptBytes),w=buildWorld(),W=w.W,H=w.H,N=W*H;
const required=["version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"].sort();
assert(JSON.stringify(Object.keys(setup).sort())===JSON.stringify(required),'P0: wrong Setup-v2 root fields');
assert(setup.version===2&&setup.extent[0]===W&&setup.extent[1]===H,'wrong Setup version/extent');
assert(setup.actors.length===1&&setup.actors[0].model==='midge','wrong actor contract');
assert(Array.isArray(setup.edits)&&setup.edits.length===receipt.rectangle_count&&setup.edits.length<=32768,'wrong rectangle budget');
assert(setupBytes.length===receipt.setup_json_bytes&&setupBytes.length<=1048576,'wrong JSON budget');
assert(digest(setupBytes)===receipt.setup_sha256,'Setup digest differs');
const G=new Uint8Array(N),written=new Uint8Array(N),hist={};let count=0;
const allowed=new Set([49,58,62,100,101,113,117,122]);
for(const [i,e] of setup.edits.entries()){
 assert(Array.isArray(e)&&e.length===5,'wrong edit at '+i);
 const [x,y,ww,hh,m]=e;
 assert([x,y,ww,hh,m].every(Number.isInteger)&&ww>0&&hh>0&&x>=0&&y>=0&&x+ww<=W&&y+hh<=H&&allowed.has(m),'illegal bounds/material '+i);
 for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){
 const p=yy*W+xx;assert(!written[p],'overlap at '+i+' pixel '+p);
 written[p]=1;G[p]=m;count++;
 }
}
assert(count===receipt.grounded_inert_solids&&count<=32000000,'wrong solid count / work budget');
assert(digest(Buffer.from(G))===receipt.grid_sha256,'grid digest mismatch');
for(let i=0;i<N;i++)assert(G[i]===w.g[i],'material-plane mismatch at '+i);
for(const v of G)hist[v]=(hist[v]||0)+1;
assert(JSON.stringify(hist)===JSON.stringify(receipt.histogram),'histogram differs');
assert(w.clear['19x15'].reachable===w.sites.length&&w.clear['23x19'].reachable===w.sites.length&&w.clear['31x27'].reachable===w.sites.length,'full-hull sites fail');
assert(w.blocked.reachable===w.sites.length-1&&w.blocked.missing.length===1&&w.blocked.missing[0]==='Severable tram threshold','physical hard-block mismatch');
// Verify remote/publication PNGs independently with standard zlib, CRC and 1:1 pixel parity.
const files=[];
for(const [filename,x0,y0,ww,hh] of w.crops){
 const buf=fs.readFileSync(path.join(root,filename)),meta=receipt.pngs[filename];
 assert(meta&&meta.w===ww&&meta.h===hh&&meta.x===x0&&meta.y===y0,'crop metadata mismatch '+filename);
 assert(buf.length===meta.bytes&&digest(buf)===meta.sha256,'PNG bytes/digest mismatch '+filename);
 assert(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature '+filename);
 let pos=8,ihdr=null,plte=null,compressed=[],iend=false;
 while(pos<buf.length){
  assert(pos+12<=buf.length,'truncated chunk header '+filename);
  const len=buf.readUInt32BE(pos),tag=buf.toString('ascii',pos+4,pos+8),start=pos+8,end=start+len;
  assert(end+4<=buf.length,'truncated chunk '+tag+' '+filename);
  assert(crc32(buf.subarray(pos+4,end))===buf.readUInt32BE(end),'CRC '+tag+' '+filename);
  const data=buf.subarray(start,end);
  if(tag==='IHDR')ihdr=data;else if(tag==='PLTE')plte=data;else if(tag==='IDAT')compressed.push(data);
  else if(tag==='IEND'){assert(len===0&&end+4===buf.length,'bad IEND '+filename);iend=true}
  pos=end+4;
 }
 assert(iend&&pos===buf.length&&ihdr&&plte&&compressed.length,'invalid chunk chain '+filename);
 assert(ihdr.readUInt32BE(0)===ww&&ihdr.readUInt32BE(4)===hh&&ihdr[8]===8&&ihdr[9]===3,'wrong indexed format '+filename);
 for(const [material,rgb] of Object.entries(w.palette))for(let k=0;k<3;k++)assert(plte[Number(material)*3+k]===rgb[k],'palette mismatch '+filename+' '+material);
 const raw=zlib.inflateSync(Buffer.concat(compressed));
 assert(raw.length===(ww+1)*hh,'uncompressed length '+filename);
 for(let y=0;y<hh;y++){
   const off=y*(ww+1);assert(raw[off]===0,'unexpected PNG row filter '+filename+' y '+y);
   for(let x=0;x<ww;x++)assert(raw[off+1+x]===G[(y+y0)*W+x+x0],'indexed-pixel mismatch '+filename+' '+x+','+y);
 }
 files.push({filename,bytes:buf.length,pixels:ww*hh});
}
console.log(JSON.stringify({status:'CREATOR_INDEPENDENT_BYTE_REPLAY_PASS',grid_sha256:receipt.grid_sha256,rectangles:count?setup.edits.length:0,solid_count:count,sites:w.sites.length,clearances:receipt.midge_clearances,blocked:receipt.physical_obstruction.after_31x27,images:files,native:'NATIVE-UNTESTED'},null,2));
