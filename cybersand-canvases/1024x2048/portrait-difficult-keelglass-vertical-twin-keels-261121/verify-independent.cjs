'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const {world,build}=require('./build.cjs');
const W=1024,H=2048,g=world().g,receipt=JSON.parse(fs.readFileSync('receipt.json','utf8'));
const bytes=fs.readFileSync('setup.json'),setup=JSON.parse(bytes);
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
assert.equal(bytes.length,receipt.setup_bytes);assert.equal(hash(bytes),receipt.setup_sha256);
assert.equal(hash(g),receipt.source_grid_sha256);assert.deepEqual(setup.extent,[W,H]);
assert.equal(setup.edits.length,receipt.rectangles);assert.equal(g.length,2097152);
const plane=Buffer.alloc(W*H),used=Buffer.alloc(W*H);let work=0;
for(const [x,y,w,h,m]of setup.edits){assert(Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(w)&&Number.isInteger(h)&&Number.isInteger(m));assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H);work+=w*h;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=yy*W+xx;assert.equal(used[i],0);used[i]=1;plane[i]=m;}}
assert.equal(work,receipt.construction_work);assert.equal(hash(plane),hash(g));assert.deepEqual(plane,Buffer.from(g));
function crc(b){let c=-1;for(let i=0;i<b.length;i++){c^=b[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^-1)>>>0;}
let pixels=0;
for(const [name,record]of Object.entries(receipt.pngs)){
 const data=fs.readFileSync(name);assert.equal(data.length,record.bytes);assert.equal(hash(data),record.sha256);
 assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 let pos=8,comp=[],width=0,height=0;
 while(pos<data.length){let len=data.readUInt32BE(pos),tag=data.toString('ascii',pos+4,pos+8),buf=data.subarray(pos+4,pos+8+len);assert.equal(crc(buf),data.readUInt32BE(pos+8+len));if(tag==='IHDR'){width=data.readUInt32BE(pos+8);height=data.readUInt32BE(pos+12);assert.equal(data[pos+17],3);}if(tag==='IDAT')comp.push(data.subarray(pos+8,pos+8+len));pos+=12+len;if(tag==='IEND')break;}
 assert.equal(pos,data.length);let [left,top,w,h]=record.xywh;assert.equal(width,w);assert.equal(height,h);
 const raw=zlib.inflateSync(Buffer.concat(comp));assert.equal(raw.length,(w+1)*h);
 for(let y=0;y<h;y++){assert.equal(raw[y*(w+1)],0);assert.deepEqual(raw.subarray(y*(w+1)+1,(y+1)*(w+1)),plane.subarray((top+y)*W+left,(top+y)*W+left+w));}pixels+=w*h;
}
assert.equal(pixels,receipt.pixel_parity);const a=build();assert.equal(a.receipt.source_grid_sha256,receipt.source_grid_sha256);
console.log('Independent Node parity PASS',receipt.source_grid_sha256,'rects',receipt.rectangles,'pixels',pixels,'native NATIVE-UNTESTED');
