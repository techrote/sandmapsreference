'use strict';
const fs=require('fs'),zlib=require('zlib'),assert=require('assert');
const W=1024,H=2048,N=W*H,setup=JSON.parse(fs.readFileSync('setup-containment-tree.json','utf8'));
assert.deepStrictEqual(setup.extent,[W,H]);
const evidence=JSON.parse(fs.readFileSync('evidence.json','utf8'));
const solid=new Set([39,40,42,49,50,52,53,54,58,62,77,79,100,101,119,120,121,122,123,127]);
const A=new Uint8Array(N);let stampArea=0;
for(const [x,y,w,h,id] of setup.edits){
  assert(Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(w)&&Number.isInteger(h)&&Number.isInteger(id));
  assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&solid.has(id));
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let p=yy*W+xx;assert(A[p]===0,'Overlap in final non-air rectangle plane');A[p]=id;}
  stampArea+=w*h;
}
assert(setup.edits.length<=32768&&Buffer.byteLength(fs.readFileSync('setup-containment-tree.json'))<=1048576);
assert.strictEqual(setup.edits.length,evidence.rectangles);
assert.strictEqual(stampArea,evidence.stamped_cells);
const hist={};for(const id of A)hist[id]=(hist[id]||0)+1;
assert.deepStrictEqual(hist,evidence.material_counts);
assert.strictEqual(evidence.mismatches,0);
const crcT=Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0;});
const crc=buf=>{let c=0xffffffff;for(const b of buf)c=crcT[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const specs=[
 ['containment-tree-preview.png',0,0,2,512,1024],
 ['containment-tree-detail-upper.png',192,115,1,640,640],
 ['containment-tree-detail-middle.png',191,715,1,640,640],
 ['containment-tree-detail-lower.png',191,1295,1,640,640],
 ['containment-tree-detail-west.png',35,90,1,640,640],
 ['containment-tree-detail-east.png',382,260,1,640,640]
];
let compared=0;
for(const [path,sx,sy,step,expectedW,expectedH] of specs){
 const b=fs.readFileSync(path);assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
 let ptr=8,pw=0,ph=0,idat=[],ended=false;
 while(ptr<b.length){
  const len=b.readUInt32BE(ptr),type=b.toString('ascii',ptr+4,ptr+8),data=b.subarray(ptr+8,ptr+8+len),expected=b.readUInt32BE(ptr+8+len);
  assert.strictEqual(crc(b.subarray(ptr+4,ptr+8+len)),expected,'PNG CRC '+path+'/'+type);
  if(type==='IHDR'){pw=data.readUInt32BE(0);ph=data.readUInt32BE(4);assert(data[8]===8&&data[9]===3);}
  if(type==='IDAT')idat.push(data);
  ptr+=12+len;if(type==='IEND'){ended=true;break;}
 }
 assert(ended&&ptr===b.length);
 assert.strictEqual(pw,expectedW);assert.strictEqual(ph,expectedH);
 const pixels=zlib.inflateSync(Buffer.concat(idat));
 assert.strictEqual(pixels.length,(pw+1)*ph);
 for(let y=0;y<ph;y++){
  assert.strictEqual(pixels[y*(pw+1)],0,'Unexpected PNG scanline filter');
  for(let x=0;x<pw;x++){
   assert.strictEqual(pixels[y*(pw+1)+1+x],A[(sy+y*step)*W+(sx+x*step)],'PNG cell mismatch '+path+'@'+x+','+y);compared++;
  }
 }
 console.log('PASS indexed PNG parity '+path+' '+(pw*ph)+' exact material cells');
}
function clearance(w,h){
 const hx=(w-1)>>1,hy=(h-1)>>1,P=W+1,integ=new Int32Array((W+1)*(H+1));
 for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=A[y*W+x]?1:0;integ[(y+1)*P+x+1]=integ[y*P+x+1]+sum;}}
 const free=new Uint8Array(N);
 for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){
  const l=x-hx,r=x+hx+1,t=y-hy,b=y+hy+1;
  if(integ[b*P+r]-integ[t*P+r]-integ[b*P+l]+integ[t*P+l]===0)free[y*W+x]=1;
 }
 const spawn=setup.actors[0].spawn,start=spawn[1]*W+spawn[0];assert(free[start],'Spawn not hull clear');
 const seen=new Uint8Array(N),q=new Int32Array(N);q[0]=start;seen[start]=1;let size=1;
 for(let i=0;i<size;i++){
  const p=q[i],x=p%W,y=(p/W)|0;
  for(const [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){
   if(nx<0||ny<0||nx>=W||ny>=H)continue;
   const k=ny*W+nx;if(free[k]&&!seen[k]){seen[k]=1;q[size++]=k;}
  }
 }
 for(const p of evidence.waypoints){const at=p.point[1]*W+p.point[0];assert(free[at]&&seen[at],'Exact site fails '+p.name+' '+p.point);}
 return size;
}
for(const result of evidence.clearance_envelopes){
 const [w,h]=result.envelope,n=clearance(w,h);
 assert.strictEqual(n,result.legal_connected_centres);
 assert.strictEqual(result.passed,evidence.waypoints.length);
 console.log('PASS exact actor clearance '+w+'x'+h+' '+n+' centres '+result.passed+'/'+result.exact_sites+' exact sites');
}
console.log('PASS '+setup.edits.length+' rectangles, '+compared+' pixel-material comparisons, exact W×H grid.');
console.log('NATIVE-UNTESTED: no physical Workbench admission/movement/collision/save-reopen was performed.');
