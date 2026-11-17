'use strict';
// Independent PNG integrity and material-cell comparison for the committed ruins-0013 assets.
// Usage: node verify-png.cjs   (Node.js built-in fs/zlib only).
const fs=require('fs'),zlib=require('zlib');
const assert=require('assert/strict');
const setup=JSON.parse(fs.readFileSync('setup-twin-ravine-temples.json','utf8'));
const W=2048,H=2048,A=Buffer.alloc(W*H);
assert.deepEqual(setup.extent,[W,H]);assert.equal(setup.edits.length,28733);
for(const e of setup.edits){assert.equal(e.length,5);const [x,y,w,h,m]=e;assert([x,y,w,h,m].every(Number.isInteger)&&w>0&&h>0&&x>=0&&y>=0&&x+w<=W&&y+h<=H&&m>0&&m<256);for(let r=y;r<y+h;r++)A.fill(m,r*W+x,r*W+x+w)}
const mids=[0,58,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const palette=Buffer.from([[24,22,44],[74,75,78],[24,168,190],[215,188,138],[139,129,132],[161,143,123],[86,127,89],[76,83,102],[182,128,74],[46,238,225],[244,188,67],[230,218,181],[65,54,81],[35,28,43],[218,229,230],[176,245,173]].flat());
const index=new Uint8Array(256).fill(255);mids.forEach((m,i)=>index[m]=i);
const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
function crc(b){let c=0xffffffff;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0}
const specimens=[
['twin-ravine-temples-preview.png',1024,1024,0,0,2],
['temples-detail-west-crown.png',512,512,155,180,1],
['temples-detail-guardian-bridges.png',512,512,740,845,1],
['temples-detail-east-oracle.png',512,512,1420,960,1],
['temples-detail-moonwater.png',512,512,790,1536,1]
];
function check(file,w,h,ox,oy,s){
  const b=fs.readFileSync(file);assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'signature: '+file);
  let at=8,types=[],chunks={},idats=[];
  while(at<b.length){
    assert(at+12<=b.length,'truncated header: '+file);
    const n=b.readUInt32BE(at),t=b.toString('ascii',at+4,at+8),dataEnd=at+8+n;
    assert(dataEnd+4<=b.length,'truncated chunk: '+file);
    assert.equal(crc(b.subarray(at+4,dataEnd)),b.readUInt32BE(dataEnd),'CRC '+t+' '+file);
    const data=b.subarray(at+8,dataEnd);types.push(t);chunks[t]=data;if(t==='IDAT')idats.push(data);
    at=dataEnd+4;
    if(t==='IEND'){assert.equal(n,0);assert.equal(at,b.length,'trailing PNG bytes');break}
  }
  assert.deepEqual(types,['IHDR','PLTE','IDAT','IEND']);assert.equal(chunks.IHDR.readUInt32BE(0),w);assert.equal(chunks.IHDR.readUInt32BE(4),h);
  assert.equal(chunks.IHDR[8],4);assert.equal(chunks.IHDR[9],3);assert(chunks.PLTE.equals(palette),'palette differs');
  const scan=zlib.inflateSync(Buffer.concat(idats));assert.equal(scan.length,(w/2+1)*h);
  for(let y=0;y<h;y++){const row=y*(w/2+1);assert.equal(scan[row],0,'PNG filter must be 0');
    for(let x=0;x<w;x++){const packed=scan[row+1+(x>>>1)],p=x%2?(packed&15):(packed>>>4);
      assert.equal(p,index[A[(oy+y*s)*W+ox+x*s]],file+' pixel '+x+','+y)}
  }
  console.log('PASS '+file+': '+w+'x'+h+' PNG, CRC/IEND, zlib decode and '+(w*h)+' exact material pixels');
}
specimens.forEach(x=>check(...x));
console.log('ALL PASS: five native material-plane images; no native Workbench or source-image comparison performed');
