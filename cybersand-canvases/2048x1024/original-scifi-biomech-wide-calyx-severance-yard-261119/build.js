/* Calyx Severance Yard. Deterministic, dependency-free full-grid builder/validator.
 * Node 18+: node build.js [design.json] [output-directory]
 * Source of truth: authored ordered design.json drawing operations, not reference artwork.
 */
"use strict";
function createCalyxBuilder() {
 const W=2048,H=1024,N=W*H;
 function draw(spec) {
  if(spec.width!==W||spec.height!==H) throw Error("extent mismatch");
  let g=new Uint8Array(N);
  const put=(x,y,m)=>{if(x>=0&&x<W&&y>=0&&y<H)g[y*W+x]=m;};
  const box=(x0,y0,x1,y1,m)=>{x0=Math.max(0,Math.ceil(x0));y0=Math.max(0,Math.ceil(y0));x1=Math.min(W,Math.ceil(x1));y1=Math.min(H,Math.ceil(y1));for(let y=y0;y<y1;y++)g.fill(m,y*W+x0,y*W+x1);};
  const ell=(cx,cy,rx,ry,m)=>{if(rx<=0||ry<=0)throw Error("ellipse radii");for(let y=Math.max(0,Math.ceil(cy-ry));y<Math.min(H,Math.ceil(cy+ry+1));y++){let dy=(y+0.5-cy)/ry;if(Math.abs(dy)>1)continue;let dx=rx*Math.sqrt(1-dy*dy);box(Math.floor(cx-dx),y,Math.ceil(cx+dx),y+1,m);}};
  const line=(ax,ay,bx,by,r,m)=>{const sx=Math.min(ax,bx)-r-1,ex=Math.max(ax,bx)+r+1,sy=Math.min(ay,by)-r-1,ey=Math.max(ay,by)+r+1,dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(sy));y<=Math.min(H-1,Math.ceil(ey));y++)for(let x=Math.max(0,Math.floor(sx));x<=Math.min(W-1,Math.ceil(ex));x++){let t=len?Math.max(0,Math.min(1,((x+.5-ax)*dx+(y+.5-ay)*dy)/len)):0;let px=ax+t*dx,py=ay+t*dy;if((x+.5-px)**2+(y+.5-py)**2<=r*r)put(x,y,m);}};
  const poly=(pts,m)=>{const ys=pts.map(p=>p[1]);for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(H-1,Math.ceil(Math.max(...ys)));y++){let xs=[];for(let j=0;j<pts.length;j++){const a=pts[j],b=pts[(j+1)%pts.length],Y=y+.5;if((a[1]<=Y&&Y<b[1])||(b[1]<=Y&&Y<a[1]))xs.push(a[0]+(Y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(Math.ceil(xs[j]-.5),y,Math.ceil(xs[j+1]-.5),y+1,m);}};
  for(const op of spec.geometry){const [t,...v]=op;if(t==="b")box(...v);else if(t==="l")line(...v);else if(t==="e")ell(...v);else if(t==="p")poly(...v);else throw Error("unknown operation "+t);}
  if(spec.qualification_policy&&spec.qualification_policy.prune_unanchored){const supported=grounded(g);for(let i=0;i<N;i++)if(g[i]&&!supported.mask[i])g[i]=0;}
  return g;
 }
 function histogram(g){let a=new Array(256).fill(0);for(const z of g)a[z]++;return Object.fromEntries(a.map((v,k)=>[k,v]).filter(x=>x[1]));}
 function grounded(g){let seen=new Uint8Array(N),q=new Int32Array(N),h=0,t=0,total=0;
  function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[t++]=i;}}
  for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}
  for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
  while(h<t){const k=q[h++],x=k%W;total++;if(x>0)push(k-1);if(x<W-1)push(k+1);if(k>=W)push(k-W);if(k<N-W)push(k+W);}
  let occupied=0;for(const z of g)if(z)occupied++;return {grounded:total,occupied,detached:occupied-total,mask:seen};
 }
 function rectangles(g){let prev=new Map(),out=[];for(let y=0;y<H;y++){let now=new Map(),x=0,row=y*W;while(x<W){let m=g[row+x];if(!m){x++;continue;}let x0=x++;while(x<W&&g[row+x]===m)x++;let key=x0+":"+(x-x0)+":"+m, idx=prev.get(key);if(idx!==undefined)out[idx][3]++;else{idx=out.length;out.push([x0,y,x-x0,1,m]);}now.set(key,idx);}prev=now;}return out;}
 function replay(edit){let g=new Uint8Array(N),overlaps=0,invalid=0;for(const [x,y,w,h,m] of edit){if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(w)||!Number.isInteger(h)||x<0||y<0||w<=0||h<=0||x+w>W||y+h>H||m<1||m>255) {invalid++;continue;}for(let yy=y;yy<y+h;yy++){let off=yy*W+x;for(let xx=0;xx<w;xx++){if(g[off+xx])overlaps++;g[off+xx]=m;}}}return{grid:g,overlaps,invalid};}
 function clarity(g,w,h){let ip=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let z=0,off=(y-1)*W,io=y*(W+1),prev=(y-1)*(W+1);for(let x=1;x<=W;x++){z+=g[off+x-1]?1:0;ip[io+x]=ip[prev+x]+z;}}
  let mask=new Uint8Array(N),l=Math.floor(w/2),r=w-l-1,t=Math.floor(h/2),b=h-t-1;
  for(let y=t;y<H-b;y++)for(let x=l;x<W-r;x++){let x0=x-l,x1=x+r+1,y0=y-t,y1=y+b+1;let n=ip[y1*(W+1)+x1]-ip[y0*(W+1)+x1]-ip[y1*(W+1)+x0]+ip[y0*(W+1)+x0];if(!n)mask[y*W+x]=1;}return mask;
 }
 function flood(mask,from,ban){let s=from[1]*W+from[0],seen=new Uint8Array(N),queue=new Int32Array(N),head=0,tail=0;if(!mask[s]||ban&&ban(from[0],from[1]))return{seen,count:0};seen[s]=1;queue[tail++]=s;
  while(head<tail){const i=queue[head++],x=i%W,y=(i-x)/W;const a=[i-1,i+1,i-W,i+W];for(let k=0;k<4;k++){if(k===0&&x===0||k===1&&x===W-1||k===2&&y===0||k===3&&y===H-1)continue;let q=a[k];if(seen[q]||!mask[q])continue;let xx=q%W,yy=(q-xx)/W;if(ban&&ban(xx,yy))continue;seen[q]=1;queue[tail++]=q;}}
  return{seen,count:tail};
 }
 function auditRoutes(g,spec){let route={},ok=true;let source=spec.sites.spawn_decontamination_gate;for(const [w,h] of [[19,15],[23,19],[31,27]]){let legal=clarity(g,w,h),res=flood(legal,source);let sites={};let approaches={};for(const [name,[x,y]]of Object.entries(spec.sites)){const i=y*W+x;let v=!!res.seen[i];sites[name]=v;let n=0;for(const id of [i-1,i+1,i-W,i+W])if(legal[id])n++;approaches[name]=n;if(!v||n<2)ok=false;}route[w+"x"+h]={legal_centres:legal.reduce((a,b)=>a+b,0),connected_centres:res.count,sites,approaches};if(w===31){const con=spec.route_constraints,[x1,x2]=con.central_x;const z=(x,y)=>x>x1&&x<x2;
    const up=flood(legal,con.west,(x,y)=>z(x,y)&&y>con.upper_cross_y_max);
    const down=flood(legal,con.west,(x,y)=>z(x,y)&&y<con.lower_cross_y_min);
    let target=con.east[1]*W+con.east[0];let upper=!!up.seen[target],lower=!!down.seen[target];
    route.restricted_detours={upper:{pass:upper,centres:up.count,max_cross_y:con.upper_cross_y_max},lower:{pass:lower,centres:down.count,min_cross_y:con.lower_cross_y_min}};if(!upper||!lower)ok=false;
  }}return {pass:ok,clearance:route};}
 function sha256(message){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let Hs=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];let bytes=Array.from(message),bitLen=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);for(let i=7;i>=0;i--)bytes.push(Math.floor(bitLen/2**(8*i))&255);let w=new Uint32Array(64),rotr=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let z=0;z<bytes.length;z+=64){for(let j=0;j<16;j++)w[j]=((bytes[z+4*j]<<24)|(bytes[z+4*j+1]<<16)|(bytes[z+4*j+2]<<8)|bytes[z+4*j+3])>>>0;for(let j=16;j<64;j++){let s0=rotr(w[j-15],7)^rotr(w[j-15],18)^(w[j-15]>>>3),s1=rotr(w[j-2],17)^rotr(w[j-2],19)^(w[j-2]>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0;}let [a,b,c,d,e,f,g,h]=Hs;for(let j=0;j<64;j++){let s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[j]+w[j])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}Hs=Hs.map((v,j)=>(v+[a,b,c,d,e,f,g,h][j])>>>0);}
 return Hs.map(n=>n.toString(16).padStart(8,"0")).join("");
 }
 function utf8(s){let a=[];for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)a.push(c);else if(c<2048)a.push(192|(c>>6),128|(c&63));else a.push(224|(c>>12),128|((c>>6)&63),128|(c&63));}return Uint8Array.from(a);}
 function palette(){let p=new Uint8Array(256*3);for(let i=0;i<256;i++){p[3*i]=32+(i*41)%165;p[3*i+1]=36+(i*37)%147;p[3*i+2]=38+(i*29)%153;}
 const v={0:[8,11,18],49:[79,95,111],58:[94,100,111],62:[114,135,149],63:[126,146,158],65:[130,93,80],66:[93,124,132],72:[41,79,101],77:[25,222,226],79:[247,173,49],100:[45,55,68],101:[34,40,57],113:[168,170,174],117:[97,105,117],120:[108,185,203],128:[144,166,170],130:[59,93,99]};for(const [k,a]of Object.entries(v))p.set(a,3*Number(k));return p;}
 function crc32(buf){let c=-1;for(let i=0;i<buf.length;i++){c^=buf[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^(-1))>>>0;}
 function be(x){return[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255];}
 function chunk(type,data){let name=utf8(type),size=data.length,all=new Uint8Array(12+size);all.set(be(size),0);all.set(name,4);all.set(data,8);let tmp=new Uint8Array(size+4);tmp.set(name);tmp.set(data,4);all.set(be(crc32(tmp)),8+size);return all;}
 function png(g,x0,y0,width,height){let raw=new Uint8Array((width+1)*height);for(let y=0;y<height;y++)raw.set(g.subarray((y0+y)*W+x0,(y0+y)*W+x0+width),y*(width+1)+1);
 let def=[0x78,0x01], pos=0;while(pos<raw.length){let n=Math.min(65535,raw.length-pos),last=pos+n===raw.length;def.push(last?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255);for(let j=0;j<n;j++)def.push(raw[pos+j]);pos+=n;}
 let a=1,b=0;for(let i=0;i<raw.length;i++){a=(a+raw[i])%65521;b=(b+a)%65521;}def.push(...be(((b<<16)|a)>>>0));
 let ihdr=Uint8Array.from([...be(width),...be(height),8,3,0,0,0]),plte=palette(),parts=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("PLTE",plte),chunk("IDAT",Uint8Array.from(def)),chunk("IEND",new Uint8Array(0))],result=new Uint8Array(parts.reduce((s,x)=>s+x.length,0));let at=0;for(let p of parts){result.set(p,at);at+=p.length;}
 return {data:result,source_index_bytes:raw.length,source_sha256:sha256(raw),png_sha256:sha256(result)};
 }
 function base64(a){const T="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=[];for(let i=0;i<a.length;i+=3){let v=(a[i]<<16)|((a[i+1]||0)<<8)|(a[i+2]||0);s.push(T[v>>>18],T[(v>>>12)&63],i+1<a.length?T[(v>>>6)&63]:"=",i+2<a.length?T[v&63]:"=");}return s.join("");}
 function auditPng(pngBytes,g,x0,y0,w,h){let a=pngBytes,i=8,blocks=[],ok=true;while(i<a.length){let len=(a[i]*16777216+a[i+1]*65536+a[i+2]*256+a[i+3])>>>0,typ=String.fromCharCode(...a.subarray(i+4,i+8)),dat=a.subarray(i+8,i+8+len),cs=(a[i+8+len]*16777216+a[i+9+len]*65536+a[i+10+len]*256+a[i+11+len])>>>0;let tmp=new Uint8Array(len+4);tmp.set(a.subarray(i+4,i+8));tmp.set(dat,4);ok&&=(crc32(tmp)===cs);blocks.push([typ,len]);i+=len+12;if(typ==="IDAT"){let ptr=2, row=0,expected=(w+1)*h,total=0;while(ptr<dat.length-4){let hdr=dat[ptr++],nn=dat[ptr]|dat[ptr+1]<<8,inv=dat[ptr+2]|dat[ptr+3]<<8;ptr+=4;if(((nn^inv)&65535)!==65535)ok=false;for(let z=0;z<nn;z++){let n=total++,col=n%(w+1),yy=Math.floor(n/(w+1));let value=col?g[(y0+yy)*W+x0+col-1]:0;if(value!==dat[ptr+z])ok=false;}ptr+=nn;if(hdr===1)break;}if(total!==expected)ok=false;}}
 return{pass:ok&&i===a.length&&blocks[blocks.length-1][0]==="IEND",chunks:blocks};}
 function setup(g,edits,spec,policy){let model="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";return {version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:model,spawn:spec.sites.spawn_decontamination_gate,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};}
 return{draw,histogram,grounded,rectangles,replay,clarity,flood,auditRoutes,sha256,utf8,png,base64,auditPng,setup};
}
if (typeof module!=="undefined"&&module.exports)module.exports=createCalyxBuilder;
if(typeof require==="function"&&typeof process==="object"&&require.main===module){
 const fs=require("fs"),path=require("path"),input=process.argv[2]||"design.json",out=process.argv[3]||".",x=createCalyxBuilder(),recipe=JSON.parse(fs.readFileSync(input,"utf8")),grid=x.draw(recipe);
 let edits=x.rectangles(grid),rp=x.replay(edits),bad=0;for(let i=0;i<grid.length;i++)if(grid[i]!==rp.grid[i])bad++;
 const gt=x.grounded(grid),routes=x.auditRoutes(grid,recipe),stats={extent:[2048,1024],grid_sha256:x.sha256(grid),histogram:x.histogram(grid),rectangles:edits.length,replay_mismatches:bad,overlaps:rp.overlaps,grounded:gt.occupied,detached:gt.detached,routes,native_status:"NATIVE-UNTESTED",accepted_engine_sha:recipe.engine_main};if(bad||rp.overlaps||gt.detached||!routes.pass)throw Error("Refuse unqualified artifacts");
 fs.mkdirSync(out,{recursive:true});
 const crops=[["01-quarantine.png",50,275,410,465],["02-graft-gantry.png",460,30,360,360],["03-split-keel.png",820,510,490,420],["04-fractionation.png",1415,275,384,520],["05-export.png",1805,394,207,502],["06-upper-keel.png",775,95,480,310]];
 const images=[["overview.png",0,0,2048,1024],...crops],png_receipts=[];
 for(const [name,a,b,w,h] of images){
  const png=x.png(grid,a,b,w,h),proof=x.auditPng(png.data,grid,a,b,w,h);
  if(!proof.pass)throw Error("PNG signature/CRC/zlib/IEND or grid parity failure: "+name);
  fs.writeFileSync(path.join(out,name),Buffer.from(png.data));
  png_receipts.push({name,box:[a,b,w,h],png_sha256:png.png_sha256,pixel_sha256:png.source_sha256,bytes:png.data.length,verified:proof.pass});
 }
 const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup=JSON.stringify(x.setup(grid,edits,recipe,policy));
 if(setup.length>1048576||edits.length>32768)throw Error("Source Workbench capacity exceeded");
 const original=JSON.parse(fs.readFileSync(input,"utf8")),draft={...original,qualification_policy:{...original.qualification_policy,prune_unanchored:false}};
 const nominal=x.draw(draft),rejected=x.grounded(nominal).detached;
 if(rejected!==recipe.qualification_policy.pre_prune_rejected_cells)throw Error("Support rejection count changed: "+rejected);
 const report={...stats,setup_bytes:setup.length,setup_sha256:x.sha256(x.utf8(setup)),pruned_unanchored_cells:rejected,png_receipts};
 const expectedPath=path.join(path.dirname(input),"qualification.json");
 if(fs.existsSync(expectedPath)){
  const expected=JSON.parse(fs.readFileSync(expectedPath,"utf8"));
  if(expected.grid.sha256!==stats.grid_sha256||expected.codec.rectangles!==edits.length||expected.codec.setup_sha256!==report.setup_sha256)throw Error("Canonical committed qualification mismatches rebuild");
  for(const p of png_receipts){const e=expected.images.find(v=>v.name===p.name);if(!e||e.png_sha256!==p.png_sha256||e.indexed_pixels_sha256!==p.pixel_sha256)throw Error("Committed PNG receipt mismatch: "+p.name);}
 }
 fs.writeFileSync(path.join(out,"setup-calyx-severance-yard.json"),setup);
 fs.writeFileSync(path.join(out,"qualification-rebuilt.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify(report,null,2));
}
