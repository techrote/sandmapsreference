#!/usr/bin/env node
"use strict";
// External-to-builder audit of COMMITTED/CHECKED OUT serialization and actual material-cell PNGs.
// This verifier does not import or execute build.cjs; never treat its static checks as native gameplay.
const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");
const W=2048,H=1024,N=W*H,DIR=__dirname;
const raw=fs.readFileSync(path.join(DIR,"setup-cinderwake.json"));
const setup=JSON.parse(raw.toString("utf8"));
const rec=JSON.parse(fs.readFileSync(path.join(DIR,"receipt.json"),"utf8"));
const sha=v=>crypto.createHash("sha256").update(v).digest("hex");
function check(ok,s){if(!ok)throw Error("INDEPENDENT CHECK FAILED: "+s);}
check(setup.version===2&&setup.extent.join(",")==="2048,1024","Setup-v2 extent/schema");
check(raw.length<=1048576&&raw.length===rec.setup_bytes&&sha(raw)===rec.setup_sha256,"Setup byte budget/hash");
check(setup.edits.length<=32768&&setup.edits.length===rec.rectangles,"rectangle budget");
check(Array.isArray(setup.actors)&&setup.actors.length===1&&setup.actors[0].model==="midge","Midge actor");
check(setup.actors[0].spawn.join(",")===rec.exact_sites["West arrival lock"].join(","),"exact spawn");
const valid=new Set([49,58,62,63,64,66,68,77,79,80,98,100,101,120,121,122,128,129,130,131]);
const grid=new Uint8Array(N),occupied=new Uint8Array(N),hist={};let work=0;
for(const e of setup.edits){
 check(Array.isArray(e)&&e.length===5&&e.every(Number.isInteger),"edit tuple");
 const [x,y,w,h,m]=e;
 check(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H,"out of bounds");
 check(valid.has(m),"unsupported or mobile material "+m);work+=w*h;
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){const k=j*W+i;check(!occupied[k],"rectangle overlap "+k);occupied[k]=1;grid[k]=m;}
}
check(work===rec.rectangle_work&&work<=32000000,"work budget"); 
for(const m of grid)if(m)hist[m]=(hist[m]||0)+1;
check(JSON.stringify(hist)===JSON.stringify(rec.solid_material_histogram),"material histogram");
check(sha(grid)===rec.material_plane_sha256,"complete material-grid hash");
// Whole rectangular 2D hull integral occupancy, no nearest-point substitutions.
const stride=W+1,ii=new Int32Array(stride*(H+1));
for(let y=1;y<=H;y++){let a=0;for(let x=1;x<=W;x++){a+=occupied[(y-1)*W+x-1];ii[y*stride+x]=ii[(y-1)*stride+x]+a;}}
function clear(x,y,w,h){const l=x-(w>>1),t=y-(h>>1),r=l+w,b=t+h;
 return l>=0&&t>=0&&r<=W&&b<=H&&ii[b*stride+r]-ii[b*stride+l]-ii[t*stride+r]+ii[t*stride+l]===0;}
function flight(w,h){
 const pass=new Uint8Array(N),seen=new Uint8Array(N),q=new Int32Array(N);
 for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(clear(x,y,w,h))pass[y*W+x]=1;
 const spawn=setup.actors[0].spawn,si=spawn[1]*W+spawn[0];check(pass[si],"spawn clearance "+w+"x"+h);
 let head=0,tail=1;q[0]=si;seen[si]=1;
 while(head<tail){
  const a=q[head++],x=a%W,y=(a/W)|0;
  for(const b of [x?a-1:-1,x<W-1?a+1:-1,y?a-W:-1,y<H-1?a+W:-1])
   if(b>=0&&pass[b]&&!seen[b]){seen[b]=1;q[tail++]=b;}
 }
 for(const [name,[x,y]]of Object.entries(rec.exact_sites))
  check(clear(x,y,w,h)&&seen[y*W+x],"strict exact 4-connected site "+name+" at "+w+"x"+h);
 const claim=rec.clearance.find(z=>z.size.join(",")===w+","+h);
 check(claim&&claim.reached===Object.keys(rec.exact_sites).length&&claim.airCentres===tail,"clearance count receipt "+w+"x"+h);
 return {envelope:[w,h],reachable_centres:tail,exact_sites:Object.keys(rec.exact_sites).length};
}
const clearances=[[19,15],[23,19],[31,27]].map(([w,h])=>flight(w,h));
// External CRC and zlib inflate, verifying one material-index per real game cell.
function crc(b){let v=0xffffffff;for(const x of b){v^=x;for(let i=0;i<8;i++)v=v>>>1^(0xedb88320&-(v&1));}return(v^0xffffffff)>>>0;}
function png(name,x0,y0,w,h){
 const b=fs.readFileSync(path.join(DIR,name+".png"));
 check(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG signature "+name);
 let pos=8,header=null,hasPalette=false,finished=false,compressed=[];
 while(pos<b.length){
  check(pos+12<=b.length,"truncated chunk "+name);
  const len=b.readUInt32BE(pos),type=b.toString("ascii",pos+4,pos+8),end=pos+len+12;
  check(end<=b.length,"chunk length "+name);
  check(crc(b.subarray(pos+4,pos+8+len))===b.readUInt32BE(pos+8+len),"PNG CRC "+name+" "+type);
  if(type==="IHDR")header=b.subarray(pos+8,pos+8+len);
  if(type==="PLTE")hasPalette=true;
  if(type==="IDAT")compressed.push(b.subarray(pos+8,pos+8+len));
  if(type==="IEND"){finished=true;check(end===b.length,"trailing PNG bytes "+name);}
  pos=end;
 }
 check(header&&hasPalette&&finished&&compressed.length,"PNG structure "+name);
 check(header.readUInt32BE(0)===w&&header.readUInt32BE(4)===h&&header[8]===8&&header[9]===3,"native 1:1 indexed PNG dims "+name);
 const d=zlib.inflateSync(Buffer.concat(compressed));check(d.length===(w+1)*h,"inflation "+name);
 for(let y=0;y<h;y++){check(d[y*(w+1)]===0,"PNG filter "+name);
  for(let x=0;x<w;x++)check(d[y*(w+1)+x+1]===grid[(y+y0)*W+x0+x],"pixel identity "+name+" at "+x+","+y);}
 const entry=rec.images.find(a=>a.name===name);check(entry&&entry.bytes===b.length&&entry.sha256===sha(b),"PNG receipt hash "+name);
 return {name,w,h,bytes:b.length};
}
const definitions=[["overview",0,0,W,H],["01-west-drydock",40,195,527,654],["02-blue-gantry",487,189,478,625],["03-counterweight-lift",909,143,374,711],["04-hump-classification",1253,233,478,630],["05-east-terminal",1672,220,376,674]];
const images=definitions.map(d=>png(...d));
// Every separate solid component is inventoried. No assumption that inert means supported.
const seen=new Uint8Array(N),q=new Int32Array(N);let anchored=0,detached=0,anchored_count=0,detached_count=0,largest_detached=0;const detached_details=[];
for(let k=0;k<N;k++){
 if(!grid[k]||seen[k])continue;
 let tail=1,head=0,boundary=false;let minx=W,maxx=0,miny=H,maxy=0;q[0]=k;seen[k]=1;
 while(head<tail){
  const a=q[head++],x=a%W,y=(a/W)|0;minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);if(!x||x===W-1||!y||y===H-1)boundary=true;
  for(const b of [x?a-1:-1,x<W-1?a+1:-1,y?a-W:-1,y<H-1?a+W:-1])
   if(b>=0&&grid[b]&&!seen[b]){seen[b]=1;q[tail++]=b;}
 }
 if(boundary){anchored+=tail;anchored_count++;}else{detached+=tail;detached_count++;largest_detached=Math.max(largest_detached,tail);detached_details.push({cells:tail,box:[minx,miny,maxx,maxy]});}
}
check(detached===0&&detached_count===0,"unattached structural material components "+detached_count+" / "+detached+" cells "+JSON.stringify(detached_details.sort((a,b)=>b.cells-a.cells)));

// Real inserted-solid obstruction stress, not centre exclusion or viewpoint substitution.
// Probe the inhabited West-to-East crossing: entire full-size actor footprint
// is recomputed against the obstacle, and any remaining flight route is 4-neighbour.
function crossing(block){
 const v=grid.slice();
 if(block){const [x,y,w,h]=block;for(let yy=y;yy<y+h;yy++)v.fill(62,yy*W+x,yy*W+x+w);}
 const it=new Int32Array((W+1)*(H+1)),stride=W+1;
 for(let y=1;y<=H;y++){let a=0;for(let x=1;x<=W;x++){a+=v[(y-1)*W+x-1]?1:0;it[y*stride+x]=it[(y-1)*stride+x]+a;}}
 const pass=new Uint8Array(N),distance=new Int32Array(N),queue=new Int32Array(N);
 const w=31,h=27;for(let y=13;y<H-13;y++)for(let x=15;x<W-15;x++){
  const l=x-15,t=y-13,r=l+w,b=t+h;
  if(it[b*stride+r]-it[b*stride+l]-it[t*stride+r]+it[t*stride+l]===0)pass[y*W+x]=1;
 }
 const [sx,sy]=rec.exact_sites["West arrival lock"];
 const [tx,ty]=rec.exact_sites["Terminal arrival"];
 const source=sy*W+sx,target=ty*W+tx;
 check(pass[source]&&pass[target],"alternate test endpoints blocked");
 let head=0,tail=1;queue[0]=source;distance[source]=1;
 while(head<tail&&!distance[target]){
  const a=queue[head++],x=a%W,y=(a/W)|0;
  for(const b of [x?a-1:-1,x<W-1?a+1:-1,y?a-W:-1,y<H-1?a+W:-1])
   if(b>=0&&pass[b]&&!distance[b]){distance[b]=distance[a]+1;queue[tail++]=b;}
 }
 return distance[target]?distance[target]-1:null;
}
const physical_block=[740,65,110,160]; // inserted steel on canonical upper cross-harbour route
const baseline_steps=crossing(null),detour_steps=crossing(physical_block);
check(baseline_steps!==null&&detour_steps!==null&&detour_steps>baseline_steps,
 "real 31x27 physical-obstruction detour missing");
const alternate_route={start:"West arrival lock",end:"Terminal arrival",envelope:[31,27],
 obstruction_xywh:physical_block,baseline_steps,obstructed_steps:detour_steps};

const output={status:"INDEPENDENT-STATIC-PASS",native:"NATIVE-UNTESTED",engine_sha:rec.engine_sha,extent:[W,H],rectangles:setup.edits.length,work,bytes:raw.length,material_sha256:sha(grid),clearances,images,alternate_route,structural:{boundary_anchored_cells:anchored,anchored_components:anchored_count,detached_cells:detached,detached_components:detached_count,largest_detached}};
console.log(JSON.stringify(output,null,2));
