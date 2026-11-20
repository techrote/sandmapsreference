"use strict";
const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),path=require("path");
const dir=__dirname,W=2048,H=1024,N=W*H,M=new Set([58,62,100]);
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const read=n=>fs.readFileSync(path.join(dir,n));
const setupBytes=read("setup.json"),setup=JSON.parse(setupBytes),receipt=JSON.parse(read("receipt.json"));
function assert(x,m){if(!x)throw Error("INDEPENDENT-VERIFY "+m);}
assert(JSON.stringify(setup.extent)==="[2048,1024]"&&setup.version===2,"schema/extent");
assert(sha(setupBytes)===receipt.setup_sha256&&setupBytes.length===receipt.setup_bytes,"setup exact SHA and bytes");
const g=Buffer.alloc(N),hist={"0":N};let area=0;
for(const r of setup.edits){
 assert(Array.isArray(r)&&r.length===5&&r.every(Number.isInteger),"non-integral rectangle");
 const [x,y,w,h,m]=r;
 assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H&&M.has(m),"bad material/bounds");
 for(let j=y;j<y+h;j++){const off=j*W+x;for(let i=off;i<off+w;i++)assert(g[i]===0,"overlap");g.fill(m,off,off+w);}
 area+=w*h;hist[m]=(hist[m]||0)+w*h;hist["0"]-=w*h;
}
assert(sha(g)===receipt.material_plane_sha256,"complete raw material grid hash");
assert(area===receipt.rectangle_work&&setup.edits.length===receipt.rectangles,"area/rectangles");
assert(JSON.stringify(hist)===JSON.stringify(receipt.material_histogram),"material histogram");
assert(receipt.grounded===area&&receipt.detached_cells===0,"grounded receipt statement");
const rootSeen=new Uint8Array(N),rootQueue=new Int32Array(N);let firstRoot=0,lastRoot=0;
for(let x=0;x<W;x++){const t=(H-1)*W+x;if(g[t]&&!rootSeen[t]){rootSeen[t]=1;rootQueue[lastRoot++]=t;}}
while(firstRoot<lastRoot){const t=rootQueue[firstRoot++],y=Math.floor(t/W);for(const u of [t-W,t+W,t-1,t+1]){
 if(u<0||u>=N||!g[u]||rootSeen[u]||(Math.abs(u-t)===1&&Math.floor(u/W)!==y))continue;
 rootSeen[u]=1;rootQueue[lastRoot++]=u;
}}
assert(lastRoot===area,"independently checked every occupied cell grounded to bottom");
function crc32(buf){let c=-1;for(const v of buf){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
const idx=[0,100,58,62];
for(const im of receipt.images){
 const p=read(im.name+".png");assert(sha(p)===im.sha256&&p.length===im.bytes,"PNG SHA/bytes");
 assert(p.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG header");
 let pos=8,chunks=[],size,seenEnd=false;
 while(pos<p.length){const n=p.readUInt32BE(pos),type=p.toString("ascii",pos+4,pos+8),bytes=p.subarray(pos+8,pos+8+n);
 assert(crc32(p.subarray(pos+4,pos+8+n))===p.readUInt32BE(pos+8+n),"PNG CRC");
 if(type==="IHDR"){size=[bytes.readUInt32BE(0),bytes.readUInt32BE(4)];assert(bytes[8]===2&&bytes[9]===3,"indexed PNG");}
 if(type==="IDAT")chunks.push(bytes);
 if(type==="IEND")seenEnd=true;
 pos+=12+n;
 }
 assert(seenEnd&&pos===p.length&&size[0]===im.rect[2]&&size[1]===im.rect[3],"PNG structure and dimensions");
 const raw=zlib.inflateSync(Buffer.concat(chunks)),[ox,oy,w,h]=im.rect,row=Math.ceil(w/4);
 assert(raw.length===(row+1)*h,"PNG raw length");
 for(let y=0;y<h;y++){const q=y*(row+1);assert(raw[q]===0,"PNG filter");for(let x=0;x<w;x++)assert(idx[(raw[q+1+(x>>2)]>>(6-2*(x&3)))&3]===g[(oy+y)*W+ox+x],"PNG exact material pixel");}
}
const sat=new Uint32Array((W+1)*(H+1)),stride=W+1;
for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=(g[(y-1)*W+x-1]!==0)?1:0;sat[y*stride+x]=sat[(y-1)*stride+x]+sum;}}
function empty(cx,cy,w,h,obs){
 const x=cx-(w>>1),y=cy-(h>>1);
 if(x<0||y<0||x+w>W||y+h>H)return false;
 if(obs&&x<obs[0]+obs[2]&&x+w>obs[0]&&y<obs[1]+obs[3]&&y+h>obs[1])return false;
 return sat[(y+h)*stride+x+w]-sat[(y+h)*stride+x]-sat[y*stride+x+w]+sat[y*stride+x]===0;
}
assert(setup.actors[0].model==="midge"&&JSON.stringify(setup.actors[0].spawn)===JSON.stringify(receipt.exact_sites["West labour arrival"]),"authoritative Midge spawn");
function flood(w,h,obs){
 const seen=new Uint8Array(N),queue=new Int32Array(N),dist=new Int32Array(N),start=receipt.exact_sites["West refugee kitchen"],s=start[1]*W+start[0];assert(empty(start[0],start[1],w,h,obs),"spawn");
 let head=0,tail=1;queue[0]=s;seen[s]=1;
 while(head<tail){const p=queue[head++],x=p%W,y=Math.floor(p/W);
 for(const q of [p-W,p+W,p-1,p+1]){if(q<0||q>=N||(Math.abs(p-q)===1&&Math.floor(q/W)!==y)||seen[q])continue;
 const xx=q%W,yy=Math.floor(q/W);if(!empty(xx,yy,w,h,obs))continue;seen[q]=1;dist[q]=dist[p]+1;queue[tail++]=q;}
 }
 const unreachable=Object.entries(receipt.exact_sites).filter(([,v])=>!seen[v[1]*W+v[0]]).map(([name])=>name);
 return {count:Object.keys(receipt.exact_sites).length-unreachable.length,unreachable,distanceToInspection:dist[receipt.exact_sites["Coop trade table"][1]*W+receipt.exact_sites["Coop trade table"][0]]};
}
for(const [w,h] of [[19,15],[23,19],[31,27]])assert(flood(w,h).count===Object.keys(receipt.exact_sites).length,"exact hull destination "+w+"x"+h);
const a=flood(31,27),b=flood(31,27,receipt.obstruction.rect);
assert(b.count===Object.keys(receipt.exact_sites).length&&b.distanceToInspection>a.distanceToInspection,"physical obstacle alternate path");
assert(a.distanceToInspection===receipt.obstruction.distance_before_after[0]&&b.distanceToInspection===receipt.obstruction.distance_before_after[1],"detour distances");
console.log(JSON.stringify({status:"INDEPENDENT SOURCE-STATIC PASS",cells:N,rectangles:setup.edits.length,grounded_receipt:receipt.grounded,sites:Object.keys(receipt.exact_sites).length,detour:[a.distanceToInspection,b.distanceToInspection],material_sha:sha(g),png_count:receipt.images.length}));
