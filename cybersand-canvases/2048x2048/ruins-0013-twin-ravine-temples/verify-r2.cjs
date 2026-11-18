'use strict';
/* Independent committed JSON/png integrity and deterministic evidence test. Node 18+. */
const fs=require('fs'),assert=require('assert'),zlib=require('zlib');
const {generate,template}=require('./builder.cjs');
const names={"twin-ravine-temples-preview.png":[1024,1024,0,0,2],"temples-material-2048.png":[2048,2048,0,0,1],"temples-detail-west-tree.png":[512,512,125,35,1],"temples-detail-west-shrine.png":[512,512,100,475,1],"temples-detail-living-bridge.png":[512,512,753,445,1],"temples-detail-bridge-west-anchor.png":[512,512,420,550,1],"temples-detail-bridge-east-anchor.png":[512,512,1380,545,1],"temples-detail-east-bypass.png":[512,512,1536,640,1],"temples-detail-east-guardian.png":[512,512,1512,207,1],"temples-detail-east-crypt.png":[512,512,1490,1135,1],"temples-detail-root-passages.png":[512,512,214,1240,1],"temples-detail-lower-ravine.png":[512,512,803,1510,1],"temples-detail-west-root-relay.png":[512,512,230,1290,1],"temples-detail-east-lantern-archive.png":[512,512,1536,1235,1],"temples-detail-valley-substrate.png":[512,512,790,1536,1]};
const mids=[0,58,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const read32=(b,i)=>b.readUInt32BE(i);
let tab=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;tab[i]=c>>>0}
function crc(b){let c=0xffffffff;for(let v of b)c=tab[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0}
const setupText=fs.readFileSync('setup-twin-ravine-temples.json','utf8'),setup=JSON.parse(setupText),W=2048,H=2048;assert.deepStrictEqual(setup.extent,[W,H]);assert.strictEqual(setup.actors[0].model,'midge');assert.deepStrictEqual(setup.actors[0].spawn,[1024,454]);assert(setup.edits.length<=32768);assert(Buffer.byteLength(setupText)<=1048576);
const grid=Buffer.alloc(W*H);let covered=0;
for(const [x,y,w,h,id] of setup.edits){assert([x,y,w,h,id].every(Number.isInteger)&&x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&[38,40,41,42,49,52,100,101].includes(id));for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){let p=row*W+col;assert.strictEqual(grid[p],0,'overlap '+p);grid[p]=id;covered++}}

// Independent final-serialized-cell validation. Never infer structural attachment from draw order.
const labels=new Uint32Array(W*H),queue=new Int32Array(W*H),componentSizes=[];let componentId=0;
for(let seed=0;seed<grid.length;seed++){
 if(!grid[seed]||labels[seed])continue;
 ++componentId;let head=0,tail=1;queue[0]=seed;labels[seed]=componentId;
 while(head<tail){const p=queue[head++],x=p%W,y=(p/W)|0;
  // Four-neighbour cardinal structural connectivity, not diagonal touch.
  for(let dir=0;dir<4;dir++){
   const k=dir===0?(x>0?p-1:-1):dir===1?(x<W-1?p+1:-1):dir===2?(y>0?p-W:-1):(y<H-1?p+W:-1);
   if(k>=0&&grid[k]&&!labels[k]){labels[k]=componentId;queue[tail++]=k}
  }
 }
 componentSizes.push(tail);
}
const solidAt=([x,y])=>labels[y*W+x];
const bridgePoints=[[1070,705],[586,745],[1455,655],[1580,680],[1770,730]];
const bridgeId=solidAt(bridgePoints[0]);assert(bridgeId>0,'bridge material seed missing');
for(const p of bridgePoints)assert.strictEqual(solidAt(p),bridgeId,'floating bridge or erased bank anchor '+p);
const orderedComponents=[...componentSizes].sort((a,b)=>b-a);
assert.strictEqual(orderedComponents[0],1783723,'unexpected cardinal root/bridge main solid size');assert.strictEqual(componentSizes.length,16,'unexpected independent stone component count');assert(orderedComponents.slice(1).every(x=>x<=20000),'unexpected isolated large structure');
console.log('PASS both actual saved-grid bridge anchors, upper east cap and entire deck in common 4-neighbour material component: '+componentSizes[bridgeId-1]+' cells; '+componentSizes.length+' solid components');

// Conservative Midge envelope testing with FULLY IN-BOUNDS centres and exact target points.
const receipt=JSON.parse(fs.readFileSync('evidence.json','utf8'));
assert.strictEqual(receipt.format.rectangles,setup.edits.length,"stale rectangle receipt");
assert.strictEqual(receipt.format.json_bytes,Buffer.byteLength(setupText),"stale JSON byte receipt");
assert.strictEqual(receipt.format.covered_material_cells,1788588,"stale occupied-cell receipt");
const sites=receipt.actor.exact_named_sites,legacy=receipt.actor.clearance.archival_regressions.previous_exact_sites;assert.strictEqual(sites.length,23,'all 20 original plus three new exact sites must be present');
const bypass=[[2018,310],[2018,780],[1932,781],[1730,783],[1450,782],[1418,815]];
const integral=new Int32Array((W+1)*(H+1));
for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){
 row+=grid[y*W+x]!==0?1:0;integral[(y+1)*(W+1)+x+1]=integral[y*(W+1)+x+1]+row;
}}

function localDistance(legal,start,end){
 const q=new Int32Array(W*H),D=new Int32Array(W*H),src=start[1]*W+start[0],dst=end[1]*W+end[0];
 assert(legal[src]&&legal[dst],'exact local Midge endpoint blocked');
 q[0]=src;D[src]=1;let head=0,tail=1;
 while(head<tail){const p=q[head++],x=p%W,y=(p/W)|0;if(p===dst)return D[p]-1;
  for(const k of [x?p-1:-1,x<W-1?p+1:-1,y?p-W:-1,y<H-1?p+W:-1])
   if(k>=0&&legal[k]&&!D[k]){D[k]=D[p]+1;q[tail++]=k}
 }
 throw Error('local exact-semantic route disconnected '+start+' -> '+end);
}
for(const [ww,hh,expectedConnected,oldRetained] of [[19,15,2117103,13],[23,19,2059808,13],[31,27,1947319,11]]){
 const rx=(ww-1)/2,ry=(hh-1)/2,allowed=new Uint8Array(W*H),reached=new Uint8Array(W*H);
 for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){
  const l=x-rx,r=x+rx+1,t=y-ry,b=y+ry+1;
  if(!(integral[b*(W+1)+r]-integral[t*(W+1)+r]-integral[b*(W+1)+l]+integral[t*(W+1)+l]))allowed[y*W+x]=1;
 }
 const source=454*W+1024;assert(allowed[source],'Midge spawn blocked '+ww);
 let head=0,tail=1;queue[0]=source;reached[source]=1;
 while(head<tail){const p=queue[head++],x=p%W;
  if(x&&allowed[p-1]&&!reached[p-1]){reached[p-1]=1;queue[tail++]=p-1}
  if(x<W-1&&allowed[p+1]&&!reached[p+1]){reached[p+1]=1;queue[tail++]=p+1}
  if(p>=W&&allowed[p-W]&&!reached[p-W]){reached[p-W]=1;queue[tail++]=p-W}
  if(p<W*H-W&&allowed[p+W]&&!reached[p+W]){reached[p+W]=1;queue[tail++]=p+W}
 }
 for(const d of sites){const p=d.point;assert(reached[p[1]*W+p[0]],'exact Midge site blocked '+ww+' '+d.name)}
 for(const p of bypass)assert(reached[p[1]*W+p[0]],'east fly-around bypass not reachable '+ww+' '+p);
 assert(localDistance(allowed,[604,589],[491,850])<=600,'west shrine approach excessively indirect');
 assert(localDistance(allowed,[1811,619],[1790,930])<=600,'east lookout approach excessively indirect');
 assert.strictEqual(tail,expectedConnected,'Midge air component changed '+ww);
 const oldPass=legacy.filter(([x,y])=>reached[y*W+x]).length;
 assert.strictEqual(oldPass,oldRetained,'historical positional count differs '+ww);
 console.log('PASS '+ww+'x'+hh+' exact Midge 23/23 (20 preserved + 3 new), east outside-air bypass 6/6, centres '+tail+', historical '+oldPass+'/17');
}

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
assert.strictEqual(covered,1788588);
console.log('PASS full exact setup replay '+setup.edits.length+' rectangles; '+covered+' occupied cells; deterministic rebuild twice');
