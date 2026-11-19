'use strict';
// Independent, on-disk original industrial-hazard landscape qualification.
// Does NOT import the builder, receipt compiler or renderer.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib'),assert=require('assert/strict');
const W=2048,H=1024,N=W*H,ROOT='cybersand-canvases/2048x1024';
const legalIds=new Set([0,3,8,58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131]);
const maps=['pyrewater-quarantine-ring','ashlight-counterflow-foundry'];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const isInt=n=>Number.isInteger(n);
function crc32(buf){let crc=-1;for(const ch of buf){crc^=ch;for(let j=0;j<8;j++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1;}return (crc^-1)>>>0;}
function decodePng(bytes,w,h){
 const magic=Buffer.from([137,80,78,71,13,10,26,10]);
 assert(bytes.subarray(0,8).equals(magic),'PNG signature');
 let at=8,done=false,ids=[],hdr=false,pal=false;
 while(at<bytes.length){
  assert(at+12<=bytes.length,'PNG truncated chunk');
  const n=bytes.readUInt32BE(at),end=at+12+n;
  assert(end<=bytes.length,'PNG truncated data');
  const type=bytes.toString('ascii',at+4,at+8),data=bytes.subarray(at+8,at+8+n);
  assert.equal(bytes.readUInt32BE(at+8+n),crc32(bytes.subarray(at+4,at+8+n)),'PNG CRC '+type);
  if(type==='IHDR'){assert.equal(data.readUInt32BE(0),w);assert.equal(data.readUInt32BE(4),h);
   assert.equal(data[8],8);assert.equal(data[9],3);assert.equal(data[10],0);hdr=true;}
  if(type==='PLTE'){assert(n>=3&&n%3===0);pal=true;}
  if(type==='IDAT')ids.push(data);
  if(type==='IEND'){done=true;assert.equal(end,bytes.length);break;}
  at=end;
 }
 assert(hdr&&pal&&done&&ids.length,'PNG required chunks');
 const raw=zlib.inflateSync(Buffer.concat(ids));assert.equal(raw.length,h*(w+1),'PNG inflated length');
 for(let y=0;y<h;y++)assert.equal(raw[y*(w+1)],0,'PNG nonzero scanline filter');
 return raw;
}
function fourNeighbours(p,fn){let x=p%W,y=Math.floor(p/W);
 if(x)fn(p-1);if(x<W-1)fn(p+1);if(y)fn(p-W);if(y<H-1)fn(p+W);}
function flood(mask,start){
 const seen=new Uint8Array(N),q=new Int32Array(N);let head=0,tail=0;
 assert(mask[start],'blocked BFS origin');seen[start]=1;q[tail++]=start;
 while(head<tail){const p=q[head++];fourNeighbours(p,n=>{if(mask[n]&&!seen[n]){seen[n]=1;q[tail++]=n;}});}
 return {seen,count:tail};
}
function clearance(grid,w,h){
 const ii=new Int32Array((W+1)*(H+1)),stride=W+1;
 for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){
  sum+=(grid[(y-1)*W+x-1]!==0)?1:0;
  ii[y*stride+x]=ii[(y-1)*stride+x]+sum;
 }}
 const pass=new Uint8Array(N),wx=w>>1,hy=h>>1;let count=0;
 for(let y=hy;y<H-hy;y++)for(let x=wx;x<W-wx;x++){
  let left=x-wx,right=x+wx+1,top=y-hy,bottom=y+hy+1;
  const occupied=ii[bottom*stride+right]-ii[top*stride+right]-ii[bottom*stride+left]+ii[top*stride+left];
  if(!occupied){pass[y*W+x]=1;count++;}
 }
 return {pass,count};
}
function anchored(grid){
 const solid=new Uint8Array(N),q=new Int32Array(N);let count=0;
 for(let p=0;p<N;p++){let m=grid[p];if(m!==0&&m!==3&&m!==8){solid[p]=1;count++;}}
 let head=0,tail=0;
 function add(p){if(solid[p]===1){solid[p]=2;q[tail++]=p;}}
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}
 for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(head<tail){const p=q[head++];fourNeighbours(p,add);}
 return {total:count,anchored:tail,detached:count-tail};
}
function parseSites(readme){
 const sites=[];
 for(const line of readme.split('\n')){
  const m=/^\|\s*([^|]+?)\s*\|\s*\((\d+),\s*(\d+)\)\s*\|/.exec(line);
  if(m)sites.push([m[1].trim(),[+m[2],+m[3]]]);
 }
 return sites;
}
for(const slug of maps){
 const root=path.join(ROOT,'original-industrial-hazard-wide-'+slug);
 const setupBytes=fs.readFileSync(path.join(root,'setup.json'));
 const setup=JSON.parse(setupBytes),receipt=JSON.parse(fs.readFileSync(path.join(root,'receipt.json'),'utf8'));
 const sites=parseSites(fs.readFileSync(path.join(root,'README.md'),'utf8'));
 assert.equal(setup.version,2);assert.deepEqual(setup.extent,[W,H]);assert.equal(setup.actors.length,1);
 assert.equal(setup.actors[0].model,'midge');assert.equal(setup.actors[0].hash,'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96');
 assert.equal(setup.edits.length,receipt.rectangles);assert(receipt.rectangles<=32768);
 assert(setupBytes.length<=1048576);assert.equal(setupBytes.length,receipt.setup_utf8_bytes);
 assert.equal(sha(setupBytes),receipt.setup_sha256);
 assert.equal(sites.length,receipt.clearance['31x27'].sites);
 assert.equal(receipt.engine_main,'de109d0131641d6adc8d25bb9ced7ca3d4991105');
 const grid=new Uint8Array(N);let area=0;
 for(const [x,y,w,h,m] of setup.edits){
  assert([x,y,w,h,m].every(isInt),'fractional rectangle');
  assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H,'rectangle bounds');
  assert(legalIds.has(m),'unsupported material id '+m);
  area+=w*h;
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
   let p=yy*W+xx;assert.equal(grid[p],0,'overlapping nonempty rectangles');grid[p]=m;
  }
 }
 assert.equal(area,receipt.construction_work);assert(area<=32_000_000);
 assert.equal(sha(grid),receipt.material_plane_sha256);
 const hist={};for(const m of grid)hist[m]=(hist[m]||0)+1;
 assert.deepEqual(hist,receipt.material_histogram);
 assert.deepEqual(anchored(grid),receipt.solid_connectivity);
 let pixels=0;
 for(const im of receipt.images){
  const bytes=fs.readFileSync(path.join(root,im.name));
  assert.equal(bytes.length,im.bytes);assert.equal(sha(bytes),im.sha256);
  const raw=decodePng(bytes,im.width,im.height);
  assert(im.x>=0&&im.y>=0&&im.x+im.width<=W&&im.y+im.height<=H,'image bounds');
  for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){
   assert.equal(raw[y*(im.width+1)+x+1],grid[(y+im.y)*W+im.x+x],'material-cell PNG parity');
  }
  pixels+=im.width*im.height;assert.equal(im.material_pixel_parity,im.width*im.height);
 }
 const origin=setup.actors[0].spawn,spawn=origin[1]*W+origin[0];
 for(const [w,h] of [[19,15],[23,19],[31,27]]){
  const key=w+'x'+h,c=clearance(grid,w,h),reached=flood(c.pass,spawn),saved=receipt.clearance[key];
  const bad=sites.filter(([name,[x,y]])=>!reached.seen[y*W+x]).map(([name])=>name);
  assert.deepEqual(bad,[],'unreachable exact named sites '+key+' '+bad);
  assert.equal(c.count,saved.legal);assert.equal(reached.count,saved.reachable);
  assert.deepEqual(saved.failed,[]);
  if(w===31){
   for(const [cx,cy] of [[810,515],[1250,515]]){
    const blocked=c.pass.slice();
    for(let yy=cy-22;yy<=cy+22;yy++)for(let xx=cx-27;xx<=cx+27;xx++)
     if(xx>=0&&yy>=0&&xx<W&&yy<H)blocked[yy*W+xx]=0;
    const re=flood(blocked,spawn);
    const survivors=sites.filter(([n,[x,y]])=>re.seen[y*W+x]);
    assert.equal(survivors.length,sites.length,'blocked-centre alternate route '+cx+','+cy);
   }
  }
 }
 // A live fluid can never touch the free-air component containing the spawn.
 const empty=new Uint8Array(N);for(let p=0;p<N;p++)if(!grid[p])empty[p]=1;
 const reachableAir=flood(empty,spawn);
 for(let p=0;p<N;p++)if(reachableAir.seen[p])fourNeighbours(p,n=>{
  assert(grid[n]!==3&&grid[n]!==8,'fluid exposed to traversable free air');
 });
 console.log('STATIC-PASS '+slug+': 2048x1024, '+receipt.rectangles+' rect, '+sites.length+
 ' exact sites, 3 envelopes, 2 centre-blocked alternates, '+receipt.images.length+
 ' PNGs, '+pixels+' pixel parity checks, detached inert solids '+receipt.solid_connectivity.detached+
 ', NATIVE-UNTESTED');
}
