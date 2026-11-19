"use strict";
// Independent exact-HEAD / actual-cell verification; Node built-ins only.
const fs=require("fs"),path=require("path"),cp=require("child_process"),crypto=require("crypto"),zlib=require("zlib");
const root=process.argv[2], W=1024,H=2048,N=W*H;
const dir="cybersand-canvases/1024x2048/original-organic-vertical-karst-lung-organ-261118/";
const valid=new Set([38,39,40,41,42,49,56,71,77,83,86,97,98,99,100,101,106,119,122]);
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const rd=f=>fs.readFileSync(path.join(root,f));
const setup=JSON.parse(rd("setup-karst-lung-organ.json")),q=JSON.parse(rd("qualification.json"));
if(setup.version!==2||String(setup.extent)!=="1024,2048"||setup.actors.length!==1||
   setup.actors[0].model!=="midge"||String(setup.actors[0].spawn)!=="507,133")throw Error("Bad setup root/actor");
if(setup.edits.length>32768||rd("setup-karst-lung-organ.json").length>1048576)throw Error("Exceeds accepted source budget");
function replay(s,strict){
  const a=new Uint8Array(N),t=strict?new Uint8Array(N):null;
  for(const e of s.edits){
    if(e.length!==5||!e.every(Number.isInteger))throw Error("Bad five-integer rectangle");
    const [x,y,w,h,m]=e;
    if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!valid.has(m))throw Error("Out of bounds / illegal ID");
    for(let yy=y;yy<y+h;yy++){const p=yy*W+x;
      if(strict){for(let k=p;k<p+w;k++)if(t[k])throw Error("Overlapping rectangle");t.fill(1,p,p+w)}
      a.fill(m,p,p+w);
    }
  }return a;
}
const a=replay(setup,true);
const prev=JSON.parse(cp.execFileSync("git",["show","HEAD^:"+dir+"setup-karst-lung-organ.json"],{encoding:"utf8",maxBuffer:5500000}));
const b=replay(prev,false);
let changed=0,painted=0;for(let i=0;i<N;i++){if(a[i]!==b[i])changed++;if(a[i])painted++}
const regions={orchard:[0,470,350,825],spore:[780,487,1024,843],fossil:[0,855,330,1200],
  calcite:[790,870,1024,1160],artery:[0,1320,350,1510],moonwell:[805,1400,1024,1690]};
const changes={};for(const [key,[x0,y0,x1,y1]] of Object.entries(regions)){
  let n=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)n+=(a[y*W+x]!==b[y*W+x]);changes[key]=n;
}
if(changed<15000||["orchard","spore","fossil","calcite"].filter(k=>changes[k]>2000).length<3)
  throw Error("Insufficient changed real district cells: "+JSON.stringify(changes));
if(sha(a)!==q.grid_sha256||sha(rd("setup-karst-lung-organ.json"))!==q.json_sha256||
   sha(rd("build-karst-lung-organ.js"))!==q.source_sha256||
   painted!==q.painted_cells||setup.edits.length!==q.rectangle_count)throw Error("Grid/source/receipt divergence");
// Every solid cell must belong to one boundary-grounded 4-connected component.
const seen=new Uint8Array(N),queue=new Int32Array(N);let t=0,r=0;
function put(i){if(a[i]&&!seen[i]){seen[i]=1;queue[t++]=i}}
for(let x=0;x<W;x++){put(x);put((H-1)*W+x)}
for(let y=0;y<H;y++){put(y*W);put(y*W+W-1)}
while(r<t){let i=queue[r++],x=i%W,y=(i/W)|0;if(x)put(i-1);if(x<W-1)put(i+1);if(y)put(i-W);if(y<H-1)put(i+W)}
if(t!==painted)throw Error("Unsupported separate solid island");
// Independent integral-image full-hull cardinal four-neighbour site search.
const S=W+1,I=new Int32Array((W+1)*(H+1));
for(let y=0;y<H;y++){let n=0;for(let x=0;x<W;x++){n+=a[y*W+x]?1:0;I[(y+1)*S+x+1]=I[y*S+x+1]+n}}
const exact=[[507,213],[240,535],[792,623],[292,978],[780,1028],[269,1410],[786,1500],[514,1826]];
const routes={};
for(const [w,h] of [[19,15],[23,19],[31,27]]){
  const ok=new Uint8Array(N),visited=new Uint8Array(N),qq=new Int32Array(N),rx=(w-1)>>1,ry=(h-1)>>1;
  for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){
    const x0=x-rx,y0=y-ry,x1=x+rx+1,y1=y+ry+1;
    const solids=I[y1*S+x1]-I[y0*S+x1]-I[y1*S+x0]+I[y0*S+x0];
    if(!solids)ok[y*W+x]=1;
  }
  let tail=0,head=0;
  function add(i){if(ok[i]&&!visited[i]){visited[i]=1;qq[tail++]=i}}
  add(133*W+507);if(!tail)throw Error("Spawn illegal");
  while(head<tail){const i=qq[head++],x=i%W,y=(i/W)|0;if(x)add(i-1);if(x<W-1)add(i+1);if(y)add(i-W);if(y<H-1)add(i+W)}
  for(const [x,y] of exact)if(!visited[y*W+x])throw Error("Site unreachable: "+x+","+y+" hull "+w+"x"+h);
  const report=q.conservative_centre_clearances.find(c=>c.width===w&&c.height===h);
  if(!report||report.reached!==tail||report.sites.some(s=>!s.clear||!s.reached))throw Error("BFS receipt mismatch");
  routes[w+"x"+h]=tail;
}
// Independent PNG CRC, zlib and per-material pixel parity, including full plane.
function crc(data){let c=0xffffffff;for(const v of data){c^=v;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1}return(c^0xffffffff)>>>0}
function png(file){
  const f=rd(file);if(!f.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error("Signature");
  let p=8,w=0,h=0,plte=false,parts=[];
  while(p<f.length){let n=f.readUInt32BE(p),kind=f.toString("ascii",p+4,p+8),payload=f.subarray(p+8,p+8+n);
    if(p+n+12>f.length||crc(f.subarray(p+4,p+8+n))!==f.readUInt32BE(p+8+n))throw Error("CRC "+file);
    if(kind==="IHDR"){w=payload.readUInt32BE(0);h=payload.readUInt32BE(4);if(payload[8]!==8||payload[9]!==3)throw Error("PNG not 8bit indexed")}
    if(kind==="PLTE")plte=payload.length===768;
    if(kind==="IDAT")parts.push(payload);p+=n+12;
  }
  if(!plte||p!==f.length)throw Error("Invalid palette/chunk sequence");
  const raw=zlib.inflateSync(Buffer.concat(parts));if(raw.length!==(w+1)*h)throw Error("Bad inflated size");
  const cells=new Uint8Array(w*h);
  for(let y=0;y<h;y++){if(raw[y*(w+1)]!==0)throw Error("Filter unsupported");cells.set(raw.subarray(y*(w+1)+1,(y+1)*(w+1)),y*w)}
  if(sha(f)!==q.pngs[file].sha256)throw Error("PNG receipt hash mismatch");
  return {w,h,cells};
}
for(const [f,p] of Object.entries(q.pngs)){
  const {w,h,cells}=png(f);if(w!==p.width||h!==p.height)throw Error("PNG wrong dims");
  let miss=0;
  if(f==="overview.png"){for(let i=0;i<N;i++)miss+=(a[i]!==cells[i])}
  else if(f==="thumbnail.png"){for(let y=0;y<h;y++)for(let x=0;x<w;x++)miss+=(a[(y*4)*W+x*4]!==cells[y*w+x])}
  else {const [x0,y0]=p.crop;for(let y=0;y<h;y++)for(let x=0;x<w;x++)miss+=(a[(y0+y)*W+x0+x]!==cells[y*w+x])}
  if(miss)throw Error("PNG source-grid parity "+f+": "+miss);
}
const report={status:"INDEPENDENT-STATIC-PASS",original_reference_free:true,extent:[W,H],
  total_changed_cells_from_R6:changed,changed_cells_by_district:changes,painted_cells:painted,
  rectangles:setup.edits.length,setup_bytes:rd("setup-karst-lung-organ.json").length,
  grounded_solid_cells:t,exact_sites:8,full_hull_reachable_centres:routes,
  images_crc_zlib_material_parity:Object.keys(q.pngs).length,
  builder_sha256:sha(rd("build-karst-lung-organ.js")),setup_sha256:sha(rd("setup-karst-lung-organ.json")),
  grid_sha256:sha(a),native_workbench:"NATIVE-UNTESTED"};
fs.writeFileSync(path.join(root,"verification-r7-independent.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
