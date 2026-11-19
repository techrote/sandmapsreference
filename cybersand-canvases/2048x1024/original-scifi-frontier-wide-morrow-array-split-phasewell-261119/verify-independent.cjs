#!/usr/bin/env node
"use strict";
// Independent-from-builder verifier: reads committed Setup-v2, receipt and PNG bytes.
// Reconstructs every cell without executing build.cjs. No source art or mockup.
const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");
const root=__dirname,W=2048,H=1024,N=W*H,LIMIT=1048576;
const source=fs.readFileSync(path.join(root,"setup-morrow-array.json")),setup=JSON.parse(source);
const receipt=JSON.parse(fs.readFileSync(path.join(root,"receipt.json"),"utf8"));
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
function insist(p,msg){if(!p)throw Error(msg)}
insist(setup.version===2&&setup.extent.join(",")==="2048,1024","wrong extent/schema");
const required=["version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"];
insist(Object.keys(setup).sort().join(",")===required.sort().join(","),"root keys mismatch");
insist(source.length<=LIMIT&&source.length===receipt.setup_bytes,"JSON byte budget");
insist(setup.edits.length<=32768&&setup.edits.length===receipt.rectangles,"edit count budget");
insist(sha(source)===receipt.setup_sha256,"setup SHA mismatch");
insist(setup.actors.length===1&&setup.actors[0].model==="midge","missing Midge actor");
insist(setup.actors[0].spawn.join(",")==="135,495","spawn mismatch");
const valid=new Set([49,58,62,63,66,68,77,79,80,100,101,120,121,122,129,130,131]);
const g=new Uint8Array(N),seen=new Uint8Array(N),hist={};let area=0,overlaps=0;
for(const e of setup.edits){
 insist(Array.isArray(e)&&e.length===5&&e.every(Number.isInteger),"invalid rectangle tuple");
 const [x,y,w,h,m]=e;
 insist(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H,"rectangle out-of-bounds");
 insist(valid.has(m),"unsupported/reactive material "+m);
 area+=w*h;
 for(let Y=y;Y<y+h;Y++)for(let X=x;X<x+w;X++){const i=Y*W+X;if(seen[i])overlaps++;seen[i]=1;g[i]=m;}
}
insist(overlaps===0,"overlapping rectangles "+overlaps);
insist(area<=32000000&&area===receipt.rectangle_work,"edit work budget");
for(const m of g)if(m)hist[m]=(hist[m]||0)+1;
insist(JSON.stringify(hist)===JSON.stringify(receipt.solid_material_histogram),"histogram differs from receipt");
insist(sha(g)===receipt.material_plane_sha256,"material-plane SHA mismatch");
// Two-dimensional integral image for whole conservative Midge rectangular footprints.
const T=W+1,ii=new Int32Array((W+1)*(H+1));
for(let y=1;y<=H;y++){let acc=0;for(let x=1;x<=W;x++){acc+=seen[(y-1)*W+x-1];ii[y*T+x]=ii[(y-1)*T+x]+acc;}}
const sites=receipt.exact_sites;
function passCentre(x,y,w,h){const l=x-(w>>1),t=y-(h>>1),r=l+w,b=t+h;return l>=0&&t>=0&&r<=W&&b<=H&&ii[b*T+r]-ii[b*T+l]-ii[t*T+r]+ii[t*T+l]===0}
const flight=[];
for(const [w,h] of [[19,15],[23,19],[31,27]]){
 const pass=new Uint8Array(N),visited=new Uint8Array(N),q=new Int32Array(N);
 for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(passCentre(x,y,w,h))pass[y*W+x]=1;
 const [sx,sy]=setup.actors[0].spawn,start=sy*W+sx;insist(pass[start]===1,"spawn blocked "+w+"x"+h);
 let head=0,tail=1;q[0]=start;visited[start]=1;
 while(head<tail){const i=q[head++],x=i%W,y=(i/W)|0;
 if(x&&pass[i-1]&&!visited[i-1]){visited[i-1]=1;q[tail++]=i-1;}
 if(x<W-1&&pass[i+1]&&!visited[i+1]){visited[i+1]=1;q[tail++]=i+1;}
 if(y&&pass[i-W]&&!visited[i-W]){visited[i-W]=1;q[tail++]=i-W;}
 if(y<H-1&&pass[i+W]&&!visited[i+W]){visited[i+W]=1;q[tail++]=i+W;}
 }
 const missed=Object.entries(sites).filter(([_,[x,y]])=>!visited[y*W+x]).map(([n])=>n);
 insist(!missed.length,"unreachable exact sites "+w+"x"+h+": "+missed.join(", "));
 const target=receipt.clearance.find(c=>c.size[0]===w&&c.size[1]===h);
 insist(target&&target.reached===Object.keys(sites).length&&target.airCentres===tail,"air-centre receipt mismatch");
 flight.push({footprint:[w,h],exact: Object.keys(sites).length,reachable:tail});
}
// Explicit independent PNG chunk/CRC/inflate/checksum and exact grid pixel parity.
const crc32=buf=>{let c=0xffffffff;for(const v of buf){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0};
const crops=[["overview",0,0,W,H],["01-west-citadel",45,245,510,470],["02-split-phasewell",770,46,500,590],["03-rift-geology",480,548,485,390],["04-east-cargo",1505,237,530,490],["05-deep-survey",1190,638,620,340]];
function verifyPNG(name,x0,y0,width,height){
 const b=fs.readFileSync(path.join(root,name+".png"));
 insist(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG signature "+name);
 let pos=8,ihdr=null,palette=false,end=false,idat=[];
 while(pos<b.length){
  insist(pos+12<=b.length,"PNG chunk truncated "+name);
  const n=b.readUInt32BE(pos),type=b.toString("ascii",pos+4,pos+8),next=pos+12+n;
  insist(next<=b.length,"PNG length invalid "+name);
  insist(crc32(b.subarray(pos+4,pos+8+n))===b.readUInt32BE(pos+8+n),"PNG CRC "+name+"/"+type);
  if(type==="IHDR")ihdr=b.subarray(pos+8,pos+8+n);
  else if(type==="PLTE")palette=true;
  else if(type==="IDAT")idat.push(b.subarray(pos+8,pos+8+n));
  else if(type==="IEND"){end=true;insist(next===b.length,"PNG trailing bytes "+name);}
  pos=next;
 }
 insist(end&&palette&&idat.length>0&&ihdr&&ihdr.length===13,"PNG structure "+name);
 insist(ihdr.readUInt32BE(0)===width&&ihdr.readUInt32BE(4)===height&&ihdr[8]===8&&ihdr[9]===3,"PNG type/dims "+name);
 const decoded=zlib.inflateSync(Buffer.concat(idat));insist(decoded.length===(width+1)*height,"PNG raw dimensions "+name);
 for(let y=0;y<height;y++){const row=y*(width+1);insist(decoded[row]===0,"unexpected PNG filter "+name);
 for(let x=0;x<width;x++)insist(decoded[row+x+1]===g[(y0+y)*W+x0+x],"pixel material mismatch "+name+" "+x+","+y);}
 const rec=receipt.images.find(v=>v.name===name);insist(rec&&rec.bytes===b.length&&rec.sha256===sha(b),"PNG receipt hash "+name);
 return {name,bytes:b.length};
}
const images=crops.map(c=>verifyPNG(...c));
// Connectivity diagnostic is intentionally separate from inert static validity.
// Some phasewell/ring infrastructure may be intentionally levitated: require ART review.
const touched=new Uint8Array(N),q=new Int32Array(N);let detached=0,detachedComponents=0,anchored=0,anchoredComponents=0;
for(let i=0;i<N;i++){if(!g[i]||touched[i])continue;let head=0,tail=1,boundary=false;q[0]=i;touched[i]=1;
 while(head<tail){const j=q[head++],x=j%W,y=(j/W)|0;if(!x||x===W-1||!y||y===H-1)boundary=true;
 if(x&&g[j-1]&&!touched[j-1]){touched[j-1]=1;q[tail++]=j-1}
 if(x<W-1&&g[j+1]&&!touched[j+1]){touched[j+1]=1;q[tail++]=j+1}
 if(y&&g[j-W]&&!touched[j-W]){touched[j-W]=1;q[tail++]=j-W}
 if(y<H-1&&g[j+W]&&!touched[j+W]){touched[j+W]=1;q[tail++]=j+W}
 }
 if(boundary){anchored+=tail;anchoredComponents++}else{detached+=tail;detachedComponents++}
}
const result={status:"INDEPENDENT-STATIC-PASS",native:"NATIVE-UNTESTED",dimension:[W,H],rectangles:setup.edits.length,area,overlaps,json_bytes:source.length,plane_sha256:sha(g),flight,images,structural_diagnostic:{anchored,anchoredComponents,detached,detachedComponents,review:"Independent art/support evaluation required: static solids are immobile but not necessarily physically attached"}};
console.log(JSON.stringify(result,null,2));
