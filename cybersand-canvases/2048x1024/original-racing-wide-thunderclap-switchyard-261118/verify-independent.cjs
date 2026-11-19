// Independent exact-output verifier. Does not import or execute the builder.
"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),zlib=require("node:zlib");
const eq=(x,y,msg)=>{if(x!==y)throw Error(msg+": expected "+y+" got "+x)};
const sha=v=>crypto.createHash("sha256").update(v).digest("hex");
const W=2048,H=1024;
const source=fs.readFileSync("setup-thunderclap-switchyard.json");
const setup=JSON.parse(source.toString("utf8"));
const rec=JSON.parse(fs.readFileSync("qualification.json","utf8"));
eq(setup.version,2,"setup version");eq(setup.extent.join("x"),"2048x1024","extent");
eq(setup.actors.length,1,"actors");eq(setup.actors[0].model,"midge","actor");
eq(setup.actors[0].spawn.join(","),"116,445","spawn");
if(source.length>1048576||setup.edits.length>32768)throw Error("CAPACITY");
const g=new Uint8Array(W*H),used=new Uint8Array(W*H);
const IDs=new Set([49,58,62,100,101,113,117,120,122,123,128]);
let visits=0;
for(const e of setup.edits){
 if(!Array.isArray(e)||e.length!==5||e.some(x=>!Number.isSafeInteger(x)))throw Error("EDIT_FORMAT");
 const [x,y,w,h,m]=e;
 if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!IDs.has(m))throw Error("EDIT_BOUNDS_MATERIAL");
 visits+=w*h;
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  const i=yy*W+xx;if(used[i])throw Error("EDIT_OVERLAP_"+i);used[i]=1;g[i]=m;
 }
}
if(visits>32000000)throw Error("WORK_BUDGET");
eq(visits,rec.cell_visits,"paint visits");eq(setup.edits.length,rec.terrain_rectangles,"rectangles");
eq(source.length,rec.setup_json_bytes,"json byte budget");
eq(sha(source),rec.json_sha256,"setup checksum");
eq(sha(g),rec.grid_sha256,"grid checksum");
const h={};for(const m of g)h[m]=(h[m]||0)+1;
eq(JSON.stringify(h),JSON.stringify(Object.fromEntries(Object.entries(rec.material_histogram).sort((a,b)=>+a[0]-+b[0]))),"histogram");
const grounded=new Uint8Array(W*H),qq=new Int32Array(W*H);
let rd=0,wr=0;function enqueue(i){if(g[i]&&!grounded[i]){grounded[i]=1;qq[wr++]=i;}}
for(let x=0;x<W;x++){enqueue(x);enqueue((H-1)*W+x);}
for(let y=1;y<H-1;y++){enqueue(y*W);enqueue(y*W+W-1);}
while(rd<wr){
 const p=qq[rd++],x=p%W,y=(p/W)|0;
 if(x)enqueue(p-1);if(x<W-1)enqueue(p+1);
 if(y)enqueue(p-W);if(y<H-1)enqueue(p+W);
}
eq(visits-wr,rec.detached_solid_cells,"detached solids");
for(const p of rec.grounded_support_probes)if(!g[p.y*W+p.x]||!grounded[p.y*W+p.x])throw Error("UNSUPPORTED_"+p.name);
const sat=new Uint32Array((W+1)*(H+1)),sw=W+1;
for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=g[y*W+x]?1:0;sat[(y+1)*sw+x+1]=sat[y*sw+x+1]+sum;}}
function free(x,y,fw,fh){
 const hw=fw>>1,hh=fh>>1;if(x<hw||y<hh||x>=W-hw||y>=H-hh)return false;
 const a=x-hw,b=x+hw,c=y-hh,d=y+hh;
 return sat[(d+1)*sw+b+1]-sat[c*sw+b+1]-sat[(d+1)*sw+a]+sat[c*sw+a]===0;
}
function bfs(fw,fh,origin,region,block) {
 const ok=new Uint8Array(W*H);
 const [xmin,ymin,xmax,ymax]=region||[0,0,W-1,H-1];
 for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){
  if(block&&x>=block[0]&&x<=block[2]&&y>=block[1]&&y<=block[3])continue;
  if(free(x,y,fw,fh))ok[y*W+x]=1;
 }
 const st=origin[1]*W+origin[0];if(!ok[st])throw Error("BFS_ORIGIN_"+origin);
 const visited=new Uint8Array(W*H),queue=new Int32Array(W*H);
 let head=0,n=1;queue[0]=st;visited[st]=1;
 while(head<n){
  const p=queue[head++],x=p%W,y=(p/W)|0;
  for(const next of [x>0?p-1:-1,x<W-1?p+1:-1,y>0?p-W:-1,y<H-1?p+W:-1]){
   if(next>=0&&ok[next]&&!visited[next]){visited[next]=1;queue[n++]=next;}
  }
 }
 return {n,visited,ok};
}
for(const [fw,fh] of [[19,15],[23,19],[31,27]]){
 const k=fw+"x"+fh,b=bfs(fw,fh,[116,445]);
 eq(b.n,rec.exact_reach[k].connected_centres,k+" connected centres");
 for(const p of rec.named_sites)if(!b.visited[p.y*W+p.x])throw Error(k+" UNREACHABLE "+p.name);
}
// A deliberately straight full-envelope line proves that the new brake lips
// do not turn a 2048-wide high-speed approach into a collision maze.
for(let x=116;x<=1943;x++)if(!free(x,445,31,27))throw Error("MAIN_FAST_LANE_PINCH x="+x);
console.log("DIRECT_MAIN_31x27_CLEAR: 1828/1828 exact centres at y445");
const block=[885,317,1125,567],blocked=bfs(31,27,[116,445],null,block);
eq(blocked.n,rec.physical_iris_obstruction.connected_centres,"blocked bypass");
for(const p of rec.named_sites){
 const reach=!!blocked.visited[p.y*W+p.x];
 if(reach!==rec.physical_iris_obstruction.reached.includes(p.name))throw Error("IRIS_BYPASS "+p.name);
}
const lower=bfs(31,27,[614,752],[580,700,1650,802]);
eq(lower.n,rec.lower_corridor_only.connected_centres,"lower course");
for(const p of rec.lower_corridor_only.access_points)if(!lower.visited[p.y*W+p.x])throw Error("LOWER_POINT "+p.name);
for(const aperture of rec.lower_corridor_only.windows){
 let count=0;for(let y=700;y<=802;y++)if(lower.ok[y*W+aperture.x])count++;
 eq(count,aperture.count,"aperture x="+aperture.x);
}
function crc(b){let c=0xffffffff;for(const x of b){c^=x;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
const palette=[0,49,100,101,58,62,117,113,128,35,120,122,123,98,38];
for(const p of rec.pngs){
 const png=fs.readFileSync(p.file),sign=Buffer.from([137,80,78,71,13,10,26,10]);
 if(!png.subarray(0,8).equals(sign))throw Error("PNG_SIGNATURE "+p.file);
 eq(sha(png),p.sha256,"PNG sha "+p.file);
 let cursor=8,ihdr=null,idat=[],closed=false;
 while(cursor<png.length){
  const n=png.readUInt32BE(cursor),tag=png.toString("ascii",cursor+4,cursor+8);
  const chunk=png.subarray(cursor+4,cursor+8+n);
  eq(crc(chunk),png.readUInt32BE(cursor+8+n),"PNG chunkCRC "+p.file);
  const body=png.subarray(cursor+8,cursor+8+n);
  if(tag==="IHDR")ihdr=body;
  if(tag==="IDAT")idat.push(body);
  cursor+=n+12;
  if(tag==="IEND"){closed=true;break;}
 }
 if(!closed||cursor!==png.length||!ihdr)throw Error("PNG_IEND "+p.file);
 const ww=ihdr.readUInt32BE(0),hh=ihdr.readUInt32BE(4),stride=1+ww/2;
 eq(ww,p.dimensions[0],"PNG width");eq(hh,p.dimensions[1],"PNG height");
 eq(ihdr[8],4,"PNG indexed bit depth");eq(ihdr[9],3,"PNG palette");
 const raw=zlib.inflateSync(Buffer.concat(idat));eq(raw.length,stride*hh,"PNG inflated size");
 const origin={"overview.png":[0,0],"overview-review-2x.png":[0,0],
  "01-launch-cradle.png":[0,160],"02-drift-canyon.png":[384,140],
  "03-split-current-iris.png":[760,164],"04-glassstorm-viaduct.png":[1240,232],
  "05-catch-recovery.png":[1536,540],"06-lower-s-turn-west.png":[580,640],
  "07-lower-s-turn-east.png":[1150,640],"08-iris-service-braces.png":[780,440],
  "09-west-dive-portal.png":[310,450],"10-east-return-portal.png":[1490,450],
  "11-weigh-inspection-bay.png":[1280,550],"12-finish-catch-jaws.png":[1536,280]}[p.file];
 if(!origin)throw Error("UNKNOWN_PNG "+p.file);
 let count=0;
 for(let y=0;y<hh;y++){
  if(raw[y*stride]!==0)throw Error("PNG_FILTER "+p.file);
  for(let x=0;x<ww;x++){
   const v=raw[y*stride+1+(x>>1)],index=(x&1)?v&15:v>>4;
   const material=palette[index],actual=g[(origin[1]+y*p.sample_step)*W+origin[0]+x*p.sample_step];
   if(material!==actual)throw Error("PNG_MATERIAL_PARITY "+p.file+" "+x+","+y);
   count++;
  }
 }
 eq(count,p.material_pixel_parity,"PNG count");
}
console.log("INDEPENDENT STATIC-PASS",JSON.stringify({cells:W*H,rectangles:setup.edits.length,bytes:source.length,visits,grid_sha:sha(g),hulls:"15/15 x3",bypass:"14/15",lower:"7/7",pngs:rec.pngs.length,detached:visits-wr,native:"NATIVE-UNTESTED"}));
