'use strict';
/* Independent committed JSON/png integrity and deterministic evidence test. Node 18+. */
const fs=require('fs'),assert=require('assert'),zlib=require('zlib');
const {generate,template}=require('./builder.cjs');
const names={"twin-ravine-temples-preview.png":[1024,1024,0,0,2],"temples-material-2048.png":[2048,2048,0,0,1],"temples-detail-west-tree.png":[512,512,125,35,1],"temples-detail-west-shrine.png":[512,512,100,475,1],"temples-detail-living-bridge.png":[512,512,753,445,1],"temples-detail-east-guardian.png":[512,512,1512,207,1],"temples-detail-east-crypt.png":[512,512,1490,1135,1],"temples-detail-root-passages.png":[512,512,214,1240,1],"temples-detail-lower-ravine.png":[512,512,803,1510,1]};
const mids=[0,58,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const read32=(b,i)=>b.readUInt32BE(i);
let tab=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;tab[i]=c>>>0}
function crc(b){let c=0xffffffff;for(let v of b)c=tab[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0}
const setupText=fs.readFileSync('setup-twin-ravine-temples.json','utf8'),setup=JSON.parse(setupText),W=2048,H=2048;assert.deepStrictEqual(setup.extent,[W,H]);assert.strictEqual(setup.actors[0].model,'midge');assert.deepStrictEqual(setup.actors[0].spawn,[1024,454]);assert(setup.edits.length<=32768);assert(Buffer.byteLength(setupText)<=1048576);
const grid=Buffer.alloc(W*H);let covered=0;
for(const [x,y,w,h,id] of setup.edits){assert([x,y,w,h,id].every(Number.isInteger)&&x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&mids.includes(id)&&id!==0);for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){let p=row*W+col;assert.strictEqual(grid[p],0,'overlap '+p);grid[p]=id;covered++}}
const build=generate(template);assert.strictEqual(build.json,setupText,'deterministic JSON differs');
const other=generate(template);assert.strictEqual(other.json,build.json);
for(const [name,[w,h,left,top,step]] of Object.entries(names)){
 const b=fs.readFileSync(name);assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'signature '+name);let p=8,pngW,pngH,idats=[],palette=null,ended=false;
 while(p<b.length){const len=read32(b,p),tag=b.toString('ascii',p+4,p+8),end=p+12+len;assert(end<=b.length,'truncated '+name);assert.strictEqual(crc(b.subarray(p+4,p+8+len)),read32(b,p+8+len),'bad CRC '+name+'/'+tag);
 if(tag==='IHDR'){pngW=read32(b,p+8);pngH=read32(b,p+12);assert.strictEqual(b[p+16],4);assert.strictEqual(b[p+17],3);}
 if(tag==='PLTE')palette=b.subarray(p+8,p+8+len);
 if(tag==='IDAT')idats.push(b.subarray(p+8,p+8+len));
 if(tag==='IEND'){ended=true;assert.strictEqual(len,0);}
 p=end}
 assert(ended&&p===b.length&&palette.length===48,'PNG structure '+name);assert.strictEqual(pngW,w);assert.strictEqual(pngH,h);
 const scan=zlib.inflateSync(Buffer.concat(idats));assert.strictEqual(scan.length,(w/2+1)*h);
 let errors=0;for(let y=0;y<h;y++){assert.strictEqual(scan[y*(w/2+1)],0,'scanline filter');for(let x=0;x<w;x++){const v=scan[y*(w/2+1)+1+(x>>1)],idx=x&1?(v&15):(v>>4);if(grid[(top+y*step)*W+left+x*step]!==mids[idx])errors++}}
 assert.strictEqual(errors,0,'pixel parity '+name);
 const emitted=name==='twin-ravine-temples-preview.png'?build.png:build.details[name];assert(emitted&&Buffer.from(emitted).equals(b),'output bytes mismatch '+name);
 const emitted2=name==='twin-ravine-temples-preview.png'?other.png:other.details[name];assert(Buffer.from(emitted2).equals(b),'second build mismatch '+name);
 console.log('PASS '+name+' '+w+'x'+h+' 0 pixel mismatches, verified CRC/IEND');
}
assert.strictEqual(covered,1746789);
console.log('PASS full exact setup replay '+setup.edits.length+' rectangles; '+covered+' occupied cells; deterministic rebuild twice');
