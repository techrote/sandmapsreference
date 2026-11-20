#!/usr/bin/env node
"use strict";
// Independent file-based verifier: Node crypto + zlib; does not import build.cjs.
// Strictly checks committed JSON, full material plane, routes, images, and grounding.
const fs=require("fs"),path=require("path"),zlib=require("zlib"),crypto=require("crypto");
const root=__dirname,receipt=JSON.parse(fs.readFileSync(path.join(root,"qualification.json"),"utf8"));
const json=fs.readFileSync(path.join(root,"setup-faraday-returnworks.json"));
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
function must(test,message){if(!test)throw new Error(message)}
must(json.length===receipt.setup_json_bytes,"JSON byte budget receipt");
must(sha(json)===receipt.setup_json_sha256,"JSON SHA-256");
const data=JSON.parse(json.toString("utf8")),W=2048,H=1024;
must(data.version===2&&data.extent[0]===W&&data.extent[1]===H,"Setup-v2 dimensions");
const ROOT_KEYS=["version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"];
must(JSON.stringify(Object.keys(data).sort())===JSON.stringify(ROOT_KEYS.sort()),"accepted Setup-v2 strict ROOT_KEYS");
must(data.response==="LA-SELECTIVE"&&data.normalize===false&&data.rule_radius===2&&data.source.length===0&&data.material===2&&data.brush===8&&data.fire===false,"accepted Setup-v2 mandatory controls");
must(Array.isArray(data.liquid_policy)&&data.liquid_policy.length===55&&data.liquid_policy.every(n=>Number.isInteger(n)&&n>=-2147483648&&n<=2147483647),"source-pinned full liquid solver policy");
must(data.actors.length===1&&data.actors[0].model==="midge"&&data.actors[0].spawn.join(",")==="120,350","authored spawn");
must(data.edits.length===receipt.rectangles&&data.edits.length<=32768,"rectangle count");
must(json.length<=1048576,"payload limit");
const grid=new Uint8Array(W*H),marked=new Uint8Array(W*H),allowed=new Set([3,49,58,62,100,101,113,117,120,122,123,128]);
let visits=0;
for(const edit of data.edits){
 must(Array.isArray(edit)&&edit.length===5&&edit.every(Number.isInteger),"edit record");
 const [x,y,w,h,m]=edit;
 must(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&allowed.has(m),"edit bounds or material law");
 for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){
  const i=row*W+col;must(marked[i]===0,"overlapping rectangle at "+col+","+row);marked[i]=1;grid[i]=m;
 }
 visits+=w*h;
}
must(visits===receipt.cell_visits&&visits<=32000000,"replay work count");
must(sha(Buffer.from(grid))===receipt.grid_sha256,"grid SHA-256");
const hist={};for(const v of grid)hist[v]=(hist[v]||0)+1;
must(JSON.stringify(hist)===JSON.stringify(receipt.histogram),"material histogram");
function solid(i){return grid[i]!==0&&grid[i]!==3}
let q=new Int32Array(W*H),seen=new Uint8Array(W*H),a=0,b=0;
for(let x=0;x<W;x++)for(const i of [x,(H-1)*W+x])if(solid(i)&&!seen[i]){seen[i]=1;q[b++]=i}
for(let y=0;y<H;y++)for(const i of [y*W,y*W+W-1])if(solid(i)&&!seen[i]){seen[i]=1;q[b++]=i}
while(a<b){const i=q[a++],x=i%W,y=(i/W)|0;
 for(const n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n>=0&&!seen[n]&&solid(n)){seen[n]=1;q[b++]=n}
}
let ungrounded=0,openWater=0;
for(let i=0;i<grid.length;i++){
 if(solid(i)&&!seen[i])ungrounded++;
 if(grid[i]===3){const x=i%W,y=(i/W)|0;
  for(const n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n<0||grid[n]===0)openWater++;
 }
}
must(ungrounded===0&&openWater===0,"ungrounded collision solid or unsealed water");
const stride=W+1,sat=new Uint32Array((W+1)*(H+1));
for(let y=1;y<=H;y++){let s=0;for(let x=1;x<=W;x++){s+=grid[(y-1)*W+x-1]!==0?1:0;sat[y*stride+x]=sat[(y-1)*stride+x]+s}}
function free(x,y,w,h){
 const l=x-Math.floor(w/2),t=y-Math.floor(h/2),r=l+w,d=t+h;
 if(l<0||t<0||r>W||d>H)return false;
 return sat[d*stride+r]-sat[t*stride+r]-sat[d*stride+l]+sat[t*stride+l]===0;
}
function flood(w,h,gate){
 const legal=new Uint8Array(W*H),visited=new Uint8Array(W*H),queue=new Int32Array(W*H);
 for(let y=Math.floor(h/2);y<H-Math.floor(h/2);y++)for(let x=Math.floor(w/2);x<W-Math.floor(w/2);x++)
  if(free(x,y,w,h)&&(!gate||!gate(x,y)))legal[y*W+x]=1;
 const first=350*W+120;must(legal[first],"spawn invalid");
 let i=0,n=1;queue[0]=first;visited[first]=1;
 while(i<n){let k=queue[i++],x=k%W,y=(k/W)|0;
  for(const j of [x?k-1:-1,x<W-1?k+1:-1,y?k-W:-1,y<H-1?k+W:-1])
   if(j>=0&&legal[j]&&!visited[j]){visited[j]=1;queue[n++]=j}
 }
 return {centres:n,missing:receipt.sites.filter(s=>!visited[s.y*W+s.x]).map(s=>s.name)};
}
for(const [w,h] of [[19,15],[23,19],[31,27]]){
 const result=flood(w,h),target=receipt.clearances[w+"x"+h];
 must(result.missing.length===0&&result.centres===target.free_centres,"conservative full-centre BFS "+w+"x"+h);
}
const blocked=flood(31,27,(x,y)=>x>=903&&x<=1153&&y>=271&&y<=461);
must(blocked.missing.length===1&&blocked.missing[0]==="Upper flywheel","actual wall-counterfactual bypass");
function read32(buf,p){return buf.readUInt32BE(p)}
function crc(buf,a,z){
 let v=0xffffffff;for(let i=a;i<z;i++){v^=buf[i];for(let j=0;j<8;j++)v=(v>>>1)^((v&1)?0xedb88320:0)}
 return (v^0xffffffff)>>>0;
}
let totalPixels=0;
for(const image of receipt.images){
 const buf=fs.readFileSync(path.join(root,image.name)),[x0,y0,w,h]=image.rect;
 must(sha(buf)===image.sha256,"PNG SHA "+image.name);
 must(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG signature");
 let p=8,idat=[],ended=false,hasPalette=false;
 while(p<buf.length){
  must(p+12<=buf.length,"truncated chunk");
  const size=read32(buf,p),type=buf.toString("ascii",p+4,p+8),end=p+12+size;
  must(end<=buf.length&&crc(buf,p+4,p+8+size)===read32(buf,p+8+size),"PNG chunk CRC");
  if(type==="IHDR")must(read32(buf,p+8)===w&&read32(buf,p+12)===h&&buf[p+16]===8&&buf[p+17]===3,"PNG dimensions/index mode");
  if(type==="PLTE"){must(size===768,"literal material palette");hasPalette=true}
  if(type==="IDAT")idat.push(buf.subarray(p+8,p+8+size));
  if(type==="IEND"){must(size===0&&end===buf.length,"PNG IEND or trailing bytes");ended=true}
  p=end;
 }
 must(ended&&hasPalette&&idat.length>0,"PNG incomplete");
 const raw=zlib.inflateSync(Buffer.concat(idat));
 must(raw.length===(w+1)*h,"PNG unfiltered byte length");
 for(let y=0;y<h;y++){
  must(raw[y*(w+1)]===0,"PNG filter not zero");
  for(let x=0;x<w;x++)must(raw[y*(w+1)+x+1]===grid[(y0+y)*W+x0+x],"material parity "+image.name+" at "+x+","+y);
 }
 must(image.pixels===w*h,"PNG size receipt");
 totalPixels+=w*h;
}
console.log(JSON.stringify({status:"INDEPENDENT_STATIC_PASS",grid_sha256:receipt.grid_sha256,rectangles:data.edits.length,visits,exact_sites:receipt.sites.length,grounded_solids:b,open_water_edges:openWater,pngs:receipt.images.length,verified_pixels:totalPixels,installed_native:"NOT_TESTED"},null,2));
