"use strict";
// Independent Node-only readback of COMMITTED files; deliberately does not
// import or invoke build.cjs, nor trust its in-memory geometry.
const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),path=require("path");
const root=__dirname,setup=JSON.parse(fs.readFileSync(path.join(root,"setup.json"),"utf8")),rec=JSON.parse(fs.readFileSync(path.join(root,"receipt.json"),"utf8"));
const fail=m=>{throw Error(m);}, assert=(v,m)=>{if(!v)fail(m);};
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const [W,H]=setup.extent,N=W*H,planes=new Uint8Array(N),written=new Uint8Array(N);
assert(W===2048&&H===1024&&setup.version===2,"extent/version");assert(Object.keys(setup).length===14,"Setup-v2 14-key contract");
assert(fs.statSync(path.join(root,"setup.json")).size<=1048576,"Setup JSON budget");
assert(setup.edits.length<=32768,"record budget");let work=0;
for(const r of setup.edits){assert(Array.isArray(r)&&r.length===5,"rect shape");const [x,y,w,h,id]=r;
 assert(Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(w)&&Number.isInteger(h)&&w>0&&h>0&&x>=0&&y>=0&&x+w<=W&&y+h<=H&&[58,62,100].includes(id),"illegal rect");
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=yy*W+xx;assert(written[i]===0,"overlap "+i);written[i]=1;planes[i]=id;work++;}}
assert(work<=32000000&&work===rec.rectangle_work,"rectangle work");
assert(sha(planes)===rec.material_plane_sha256,"plane SHA");
assert(sha(fs.readFileSync(path.join(root,"setup.json")))===rec.setup_sha256,"Setup SHA");
let hist={0:0,58:0,62:0,100:0};for(const v of planes)hist[v]++;
for(const [k,v] of Object.entries(hist))assert(v===rec.material_histogram[k],"histogram "+k);
let connected=new Uint8Array(N),Q=new Int32Array(N),head=0,tail=0;
for(let x=0;x<W;x++){let v=(H-1)*W+x;if(planes[v]){Q[tail++]=v;connected[v]=1;}}
while(head<tail){let i=Q[head++],x=i%W,y=(i/W)|0;for(const n of [i-W,i+W,i-1,i+1])if(n>=0&&n<N&&!(Math.abs(n-i)===1&&((n/W)|0)!==y)&&planes[n]&&!connected[n]){connected[n]=1;Q[tail++]=n;}}
assert(tail===work&&work===rec.grounded&&rec.detached_cells===0,"ungrounded structural solids");
const stride=W+1,integral=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=(planes[(y-1)*W+x-1]!==0);integral[y*stride+x]=integral[(y-1)*stride+x]+run;}}
function free(x,y,w,h,block){let x0=x-(w>>1),y0=y-(h>>1),x1=x0+w,y1=y0+h;
 if(x0<0||y0<0||x1>W||y1>H||integral[y1*stride+x1]-integral[y1*stride+x0]-integral[y0*stride+x1]+integral[y0*stride+x0])return false;
 return !(block&&x0<block[0]+block[2]&&x1>block[0]&&y0<block[1]+block[3]&&y1>block[1]);}
function traversed(w,h,block){let allowed=new Uint8Array(N),visited=new Int32Array(N),queue=new Int32Array(N),i=0,j=0,origin=setup.actors[0].spawn;
 for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(free(x,y,w,h,block))allowed[y*W+x]=1;
 let start=origin[1]*W+origin[0];assert(allowed[start],"blocked exact spawn");visited[start]=1;queue[j++]=start;
 while(i<j){let v=queue[i++],x=v%W,y=(v/W)|0;for(let u of [v-W,v+W,v-1,v+1])if(u>=0&&u<N&&!(Math.abs(u-v)===1&&((u/W)|0)!==y)&&allowed[u]&&!visited[u]){visited[u]=visited[v]+1;queue[j++]=u;}}
 let bad=[];for(let [name,p] of Object.entries(rec.exact_sites))if(!visited[p[1]*W+p[0]])bad.push(name);
 return {allowed,visited,bad,component:j};}
for(let [w,h] of [[19,15],[23,19],[31,27]]){let r=traversed(w,h,null);assert(!r.bad.length,"site failures "+w+"x"+h+": "+r.bad.join(","));}
let block=rec.obstruction.rect,actual=traversed(31,27,block);assert(!actual.bad.length&&actual.component>0,"obstruction isolate");
const distance=(allowed,a,b)=>{let q=new Int32Array(N),d=new Int32Array(N),i=0,j=0,start=a[1]*W+a[0],end=b[1]*W+b[0];assert(allowed[start]&&allowed[end],"distance endpoints");q[j++]=start;d[start]=1;while(i<j){let v=q[i++],x=v%W,y=(v/W)|0;if(v===end)return d[v]-1;for(let u of [v-W,v+W,v-1,v+1])if(u>=0&&u<N&&!(Math.abs(v-u)===1&&((u/W)|0)!==y)&&allowed[u]&&!d[u]){d[u]=d[v]+1;q[j++]=u;}}return -1;};
let a=rec.exact_sites[rec.obstruction.from],b=rec.exact_sites[rec.obstruction.to],before=distance(traversed(31,27,null).allowed,a,b),after=distance(actual.allowed,a,b);
assert(before===rec.obstruction.distance_before_after[0]&&after===rec.obstruction.distance_before_after[1]&&after>before,"obstruction detour");
const crc=buf=>{let c=-1;for(let v of buf){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^(-1))>>>0;};
function validateImage(o){let data=fs.readFileSync(path.join(root,o.name+".png"));assert(sha(data)===o.sha256&&data.length===o.bytes,"PNG content SHA/size "+o.name);
 assert(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"PNG signature");let p=8,w=0,h=0,depth=0,type=0,idat=[];
 while(p<data.length){let n=data.readUInt32BE(p),tag=data.toString("ascii",p+4,p+8),pay=data.subarray(p+8,p+8+n);assert(p+n+12<=data.length,"chunk overflow");assert(crc(data.subarray(p+4,p+8+n))===data.readUInt32BE(p+8+n),"chunk CRC "+tag);
 if(tag==="IHDR"){w=pay.readUInt32BE(0);h=pay.readUInt32BE(4);depth=pay[8];type=pay[9];}if(tag==="IDAT")idat.push(pay);p+=n+12;if(tag==="IEND")break;}
 assert(p===data.length&&w===o.rect[2]&&h===o.rect[3]&&depth===2&&type===3,"PNG indexed IHDR "+o.name);
 let raw=zlib.inflateSync(Buffer.concat(idat)),bpl=Math.ceil(w/4),[x0,y0]=o.rect;assert(raw.length===(bpl+1)*h,"raw extent");
 let palette=[0,100,58,62];for(let y=0;y<h;y++){let j=y*(bpl+1);assert(raw[j]===0,"nonzero filter");for(let x=0;x<w;x++){let idx=raw[j+1+(x>>2)]>>(6-2*(x&3))&3;assert(palette[idx]===planes[(y+y0)*W+x0+x],"material pixel mismatch "+o.name+":"+x+","+y);}}
 return w*h;}
let pixels=0;for(let im of rec.images)pixels+=validateImage(im);
console.log(JSON.stringify({result:"INDEPENDENT-STATIC-PASS",rectangles:setup.edits.length,grounded:tail,sites:Object.keys(rec.exact_sites).length+" at all 3 hulls",detour:[before,after],verified_png_pixels:pixels,native:"NATIVE-UNTESTED"}));
