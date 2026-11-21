// From-scratch deterministic ORIGINAL CyberSand material-cell generator; Node >=18.
"use strict";
const fs=require("fs"),path=require("path");
function utf8(s){let a=[];for(let i=0;i<s.length;i++){let c=s.codePointAt(i);if(c>65535)i++;if(c<128)a.push(c);else if(c<2048)a.push(192|(c>>6),128|(c&63));else if(c<65536)a.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else a.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63))}return new Uint8Array(a)}
function sha256(input){
 let b=typeof input==="string"?utf8(input):input,n=b.length,blocks=Math.ceil((n+9)/64),a=new Uint8Array(blocks*64);a.set(b);a[n]=128;
 let bits=n*8;for(let k=0;k<8;k++)a[a.length-1-k]=Math.floor(bits/2**(k*8))&255;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Int32Array(64),rot=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let q=0;q<a.length;q+=64){for(let i=0;i<16;i++){let j=q+i*4;w[i]=(a[j]<<24)|(a[j+1]<<16)|(a[j+2]<<8)|a[j+3]}for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(((w[i-16]+(rot(x,7)^rot(x,18)^(x>>>3)))|0)+w[i-7]+(rot(y,17)^rot(y,19)^(y>>>10)))|0}
 let [A,B,C,D,E,F,G,Z]=H;
 for(let i=0;i<64;i++){let s1=rot(E,6)^rot(E,11)^rot(E,25),ch=(E&F)^(~E&G),t1=(Z+s1+ch+K[i]+w[i])|0,s0=rot(A,2)^rot(A,13)^rot(A,22),maj=(A&B)^(A&C)^(B&C),t2=(s0+maj)|0;Z=G;G=F;F=E;E=(D+t1)|0;D=C;C=B;B=A;A=(t1+t2)|0}
 const v=[A,B,C,D,E,F,G,Z];for(let i=0;i<8;i++)H[i]=(H[i]+v[i])|0}
 return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");
}
function paint(spec){
 const W=spec.extent[0],H=spec.extent[1],a=new Uint8Array(W*H);
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let xa=Math.max(0,x),xb=Math.min(W,x+w);if(xa>=xb)return;for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)a.fill(m,yy*W+xa,yy*W+xb)}
 for(const o of spec.ops){let [t,...v]=o;if(t==="R")rect(...v);else if(t==="F"){let[x,y,w,h,th,m]=v;rect(x,y,w,th,m);rect(x,y+h-th,w,th,m);rect(x,y,th,h,m);rect(x+w-th,y,th,h,m)}else if(t==="L"){let[x,y,X,Y,th,m]=v,n=Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y)));for(let i=0;i<=n;i++)rect(x+(X-x)*i/n-th/2,y+(Y-y)*i/n-th/2,th,th,m)}else throw Error("bad op "+t)}
 return a;
}
function ground(a,W,H){
 const q=new Int32Array(a.length),s=new Uint8Array(a.length);let h=0,t=0;
 const push=i=>{if(a[i]&&!s[i]){s[i]=1;q[t++]=i}};
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
 while(h<t){let i=q[h++],x=i%W;if(x)push(i-1);if(x+1<W)push(i+1);if(i>=W)push(i-W);if(i+W<a.length)push(i+W)}
 let pruned=0;for(let i=0;i<a.length;i++)if(a[i]&&!s[i]){a[i]=0;pruned++}return{grounded:t,pruned};
}
function encode(a,W,H){
 const out=[],act=new Map();for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let v=a[y*W+x];if(!v){x++;continue}let st=x;while(x<W&&a[y*W+x]===v)x++;let key=st+","+ (x-st)+","+v,idx=act.get(key);if(idx===undefined){idx=out.length;out.push([st,y,x-st,1,v])}else out[idx][3]++;next.set(key,idx)}act.clear();for(let [k,v]of next)act.set(k,v)}return out;
}
function replay(edits,W,H){
 const a=new Uint8Array(W*H),seen=new Uint8Array(W*H);let work=0;const legal=new Set([58,62,63,72,77,79,100,101,117,128]);
 for(const [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!legal.has(m))throw Error("illegal rectangle");
 for(let yy=y;yy<y+h;yy++){let p=yy*W+x;for(let xx=0;xx<w;xx++){if(seen[p+xx])throw Error("overlap");seen[p+xx]=1;a[p+xx]=m;work++}}}
 return{a,work};
}
function flight(a,spec){
 const W=spec.extent[0],H=spec.extent[1],N=W*H,P=W+1,ps=new Int32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=a[(y-1)*W+x-1]?1:0;ps[y*P+x]=ps[(y-1)*P+x]+sum}}
 function freeFor(ww,hh,obs){const hx=(ww-1)/2,hy=(hh-1)/2,f=new Uint8Array(N);for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){let xa=x-hx,xb=x+hx+1,ya=y-hy,yb=y+hy+1;if(ps[yb*P+xb]-ps[ya*P+xb]-ps[yb*P+xa]+ps[ya*P+xa]===0)f[y*W+x]=1}
 if(obs){let[ox,oy,ow,oh]=obs;for(let y=Math.max(hy,oy-hy);y<Math.min(H-hy,oy+oh+hy);y++)for(let x=Math.max(hx,ox-hx);x<Math.min(W-hx,ox+ow+hx);x++)f[y*W+x]=0}return f}
 function bfs(f,st,en,restrict){let start=st[1]*W+st[0],goal=en?en[1]*W+en[0]:-1;if(!f[start]||(goal>=0&&!f[goal]))return{distance:-1,count:0,dist:null};let d=new Int32Array(N),q=new Int32Array(N);d.fill(-1);let h=0,t=0;q[t++]=start;d[start]=0;while(h<t){let i=q[h++];if(i===goal)return{distance:d[i],count:t,dist:d};let x=i%W,y=(i/W)|0;for(let ni of [i-1,i+1,i-W,i+W]){if(ni<0||ni>=N||!f[ni]||d[ni]>=0)continue;let xx=ni%W,yy=(ni/W)|0;if(Math.abs(x-xx)+Math.abs(y-yy)!==1)continue;if(restrict&&xx>=spec.route_bans.xmin&&xx<=spec.route_bans.xmax){if(restrict==="upper"&&yy>spec.route_bans.upper_max_y)continue;if(restrict==="lower"&&yy<spec.route_bans.lower_min_y)continue}d[ni]=d[i]+1;q[t++]=ni}}return{distance:goal>=0?-1:0,count:t,dist:d}}
 let checks={},failures=[];for(const wh of [[19,15],[23,19],[31,27]]){let f=freeFor(...wh),res=bfs(f,spec.sites.spawn_quarantine),sites={},lost=[];if(!res.dist)throw Error("spawn invalid");
 for(const [k,[x,y]] of Object.entries(spec.sites)){let i=y*W+x,valid=!!f[i],reach=valid&&res.dist[i]>=0,four=valid&&[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].every(([xx,yy])=>xx>=0&&yy>=0&&xx<W&&yy<H&&!!f[yy*W+xx]);sites[k]={free:valid,reachable:reach,four_cardinal_approaches:four};if(!valid||!reach||!four)lost.push(k)}
 checks[wh.join("x")]={visited_centres:res.count,sites,failed:lost};if(lost.length)failures.push({hull:wh,failed:lost})}
 let f=freeFor(31,27),fo=freeFor(31,27,spec.obstruction),s=spec.gates.west,e=spec.gates.east,baseline=bfs(f,s,e).distance,blocked=bfs(fo,s,e).distance,upper=bfs(fo,s,e,"upper").distance,lower=bfs(fo,s,e,"lower").distance;
 let r=bfs(fo,spec.sites.spawn_quarantine),occ={};for(const [k,[x,y]] of Object.entries(spec.sites)){let p=y*W+x;occ[k]={covered:!fo[p],reachable:!!fo[p]&&r.dist!==null&&r.dist[p]>=0};if(fo[p]&&!occ[k].reachable)failures.push({obstructed_lost_site:k})}
 if(baseline<0||blocked<0||upper<0||lower<0||blocked<=baseline)failures.push({routes:{baseline,blocked,upper,lower}});
 return{checks,failures,route_distances:{baseline,blocked,upper,lower},obstructed_sites:occ};
}
function concat(arr){let n=0;for(const a of arr)n+=a.length;const b=new Uint8Array(n);let p=0;for(const a of arr){b.set(a,p);p+=a.length}return b}
function be(n){return new Uint8Array([n>>>24,(n>>>16)&255,(n>>>8)&255,n&255])}
function crc32(a){let c=0xffffffff;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=c&1?(c>>>1)^0xedb88320:c>>>1}return (c^0xffffffff)>>>0}
function pngIndexed(a,W,region,pal,verify=true){
 const[x0,y0,w,h]=region;let ids=Object.keys(pal).map(Number).sort((x,y)=>x-y);if(ids.length>16)throw Error("palette exceeds 4bit");let trans=new Uint8Array(256);ids.forEach((id,i)=>trans[id]=i);
 let row=1+Math.ceil(w/2),raw=new Uint8Array(row*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){let val=trans[a[(y+y0)*W+x+x0]];let p=y*row+1+(x>>1);if(x&1)raw[p]|=val;else raw[p]|=val<<4}
 let chunks=[new Uint8Array([0x78,0x01])],s1=1,s2=0;for(let i=0;i<raw.length;i++){s1=(s1+raw[i])%65521;s2=(s2+s1)%65521}
 for(let i=0;i<raw.length;i+=65535){let n=Math.min(65535,raw.length-i);chunks.push(new Uint8Array([i+n>=raw.length?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255]),raw.subarray(i,i+n))}
 chunks.push(new Uint8Array([s2>>>8,s2&255,s1>>>8,s1&255]));const z=concat(chunks),plte=new Uint8Array(ids.length*3);ids.forEach((id,i)=>plte.set(pal[id],3*i));
 const chunk=(name,data)=>{let tag=utf8(name);return concat([be(data.length),tag,data,be(crc32(concat([tag,data])))]);};
 let ihdr=concat([be(w),be(h),new Uint8Array([4,3,0,0,0])]);
 const png=concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("PLTE",plte),chunk("IDAT",z),chunk("IEND",new Uint8Array())]);
 if(verify){ // Independent parser of emitted PNG, stored-deflate blocks and exact indexed pixel equality
  let pos=8,seen=[],payload=null,prgb=null,I=null;
  while(pos<png.length){let n=((png[pos]*16777216)+(png[pos+1]<<16)+(png[pos+2]<<8)+png[pos+3])>>>0;let tag=String.fromCharCode(...png.subarray(pos+4,pos+8)),data=png.subarray(pos+8,pos+8+n),crc=((png[pos+8+n]*16777216)+(png[pos+9+n]<<16)+(png[pos+10+n]<<8)+png[pos+11+n])>>>0;if(crc32(png.subarray(pos+4,pos+8+n))!==crc)throw Error("PNG CRC");
  if(tag==="IHDR")I=data;if(tag==="PLTE")prgb=data;if(tag==="IDAT")payload=data;if(tag==="IEND")seen.push(tag);pos+=n+12}
  if(pos!==png.length||seen.length!==1||I[8]!==4||I[9]!==3||prgb.length!==ids.length*3)throw Error("PNG shape mismatch");
  let out=new Uint8Array(raw.length),ip=2,op=0;while(ip<payload.length-4){let hdr=payload[ip++],n=payload[ip]|payload[ip+1]<<8,inv=payload[ip+2]|payload[ip+3]<<8;ip+=4;if(((n^inv)&65535)!==65535)throw Error("deflate len");out.set(payload.subarray(ip,ip+n),op);ip+=n;op+=n;if(hdr===1)break;if(hdr!==0)throw Error("deflate mode")}
  if(op!==raw.length)throw Error("deflate size");
  let a1=1,a2=0;for(let i=0;i<out.length;i++){a1=(a1+out[i])%65521;a2=(a2+a1)%65521}if(payload[ip]!==a2>>>8||payload[ip+1]!==(a2&255)||payload[ip+2]!==a1>>>8||payload[ip+3]!==(a1&255))throw Error("Adler");
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let idx=out[y*row+1+(x>>1)],id=ids[(x&1)?(idx&15):(idx>>>4)];if(id!==a[(y+y0)*W+x0+x])throw Error("material pixel mismatch")}
 }
 return png;
}
function makeArtifacts(spec){
 const [W,H]=spec.extent,a=paint(spec),grounding=ground(a,W,H),edits=encode(a,W,H),re=replay(edits,W,H);
 if(a.length!==2097152||re.work!==grounding.grounded||!a.every((v,i)=>v===re.a[i]))throw Error("material replay mismatch");
 if(edits.length>32768||re.work>32000000)throw Error("source capacity exceeded");
 const fl=flight(a,spec);
 if(fl.failures.length)throw Error("FLIGHT QUALIFICATION FAILED: "+JSON.stringify(fl.failures));
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:spec.sites.spawn_quarantine,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),sz=utf8(setupText).length;if(sz>1048576)throw Error("Setup exceeds 1MiB");
 const hist={};for(const v of a)hist[v]=(hist[v]||0)+1;
 const images={};images["overview.png"]=pngIndexed(a,W,[0,0,W,H],spec.palette);
 for(const crop of spec.crops)images[crop.name]=pngIndexed(a,W,crop.rect,spec.palette);
 const image_receipts=Object.fromEntries(Object.entries(images).map(([k,v])=>[k,{bytes:v.length,sha256:sha256(v),material_pixel_parity:true,png_crc_adler_and_dimensions:true,region:k==="overview.png"?[0,0,W,H]:spec.crops.find(c=>c.name===k).rect}]));
 const qualification={source:"ORIGINAL-NO-REFERENCE",seed:spec.seed,base_sha:spec.base_sha,read_only_engine_sha:spec.engine_sha,extent:spec.extent,final_cell_count:a.length,grid_sha256:sha256(a),setup_sha256:sha256(setupText),setup_bytes:sz,setup_root_keys:Object.keys(setup),rectangle_count:edits.length,rectangle_limit_source:32768,native_installation_status:"NATIVE-UNTESTED: source supports 32768; compatible Godot/bridge binary not executed",construction_writes:re.work,write_limit:32000000,material_histogram:hist,occupied:grounding.grounded,grounded:grounding.grounded,nominal_unsupported_removed:grounding.pruned,detached_final:0,fluid_falling_reactive_final:0,rectangle_overlap_count:0,replay_cell_mismatches:0,canonical_rectangle_reencode_identity:JSON.stringify(edits)===JSON.stringify(encode(re.a,W,H)),sites:fl.checks,obstruction:spec.obstruction,route_bans:spec.route_bans,route_distances:fl.route_distances,obstructed_sites:fl.obstructed_sites,pngs:image_receipts,author_static_status:"PASS",independent_reviews:"PENDING",native_status:"NATIVE-UNTESTED"};
 const readme=`# ${spec.title} — ORIGINAL 2048x1024 CyberSand material-cell landscape\n\n**DRAFT / HOLD. Author source-static PASS only. Independent Art, Technical and Shepherd review requested; NATIVE-UNTESTED. No Ready, merge or owner acceptance.**\n\n${spec.description}\n\n## Level design, routes, recovery\n\n${spec.districts.map((d,i)=>`${i+1}. ${d}`).join("\n")}\n\nAll 16 literal checkpoints in design.json are independently tested at full 19x15, 23x19, 31x27 collision envelopes with exact four-neighbour free-centre BFS and four local cardinal approaches. An entered two-shaft under-core diagnostic gallery is carved from actual floor cells. Two separate aerial-band routes over the monolith crown form the full west-east bypass; the underfloor gallery is an editable local interior, not asserted as a second independent through-route. The entered inspection workface is rooted to the floor-supported central monolith at ${JSON.stringify(spec.sites.entered_index)}. The packet choir and lung condenser are independently roof-supported, with an exposed lower service excavation. The temporary obstruction ${JSON.stringify(spec.obstruction)} forces a real route change while independently restricted upper-sky and lower-crown altitude passages remain feasible.\n\n## Full deterministic proof\n\nRun \`node build.js\` in this directory (Node >=18, standard library only); reads exact fixed-seed \`design.json\` geometry; recreates material grid, removes unsupported nominal decorative cells, validates all named routes and obstacles, and writes Setup-v2, qualification.json, indexed actual-material overview and unscaled 1:1 crops. All artwork derives from material bytes, never image synthesis.\n\n- Source sandmapsreference main: \`${spec.base_sha}\`. Read-only current accepted CyberSand: \`${spec.engine_sha}\`.\n- Exactly ${a.length} actual final material cells, SHA-256 \`${qualification.grid_sha256}\`. Grounded inert solids ${grounding.grounded}/${grounding.grounded}; detached=0; forbidden mobile/fluids/reactive=0; unsupported nominal cells omitted=${grounding.pruned}. Native inert Solid/None material palette: ${Object.keys(hist).filter(x=>x!=="0").join(", ")}.\n- ${edits.length} canonical lossless nonoverlapping rectangles / source 32768, ${sz} bytes Setup JSON / 1048576, ${re.work} construction work / 32000000. Replay overlap/mismatches=0; exact coalesced re-encode equality.\n- Exact 31x27 gate shortest route: ${fl.route_distances.baseline} steps; after physical obstruction: ${fl.route_distances.blocked}; independently constrained upper: ${fl.route_distances.upper}; lower: ${fl.route_distances.lower}.\n- Full 2048x1024 authentic 4-bit indexed PNG and ${spec.crops.length} unscaled native-resolution district crops. The committed encoded images use an explicit ID-to-index palette, each verified by PNG chunk CRC and independently decoded stored-DEFLATE, zlib Adler and per-pixel exact material matching. Image SHA256 values in qualification.json.\n\n## Limits and independent acceptance\n\nNo actual Godot/Workbench/CyberDemoBridge/Rapier load, body advancement/collision or fresh-process Save/Reopen was executed. **NATIVE-UNTESTED**. Accepted source permits 32768 rectangles. A matching installed Workbench/bridge and actual actor movement remain NATIVE-UNTESTED. A valid source-static pass is NOT playable owner acceptance. Request independent exact-HEAD Art, Tech and Shepherd qualification. Keep Draft/HOLD.\n`;
 return{files:{"design.json":JSON.stringify(spec,null,2)+"\n","setup-mnemosyne-grade-separation-foundry.json":setupText,"qualification.json":JSON.stringify(qualification,null,2)+"\n","README.md":readme,...images},qualification};
}
if(require.main===module){const spec=JSON.parse(fs.readFileSync(path.join(__dirname,"design.json"),"utf8"));const out=makeArtifacts(spec);for(const [name,value] of Object.entries(out.files)){if(name==="design.json")continue;fs.writeFileSync(path.join(__dirname,name),typeof value==="string"?value:Buffer.from(value));}console.log(JSON.stringify({sha:out.qualification.grid_sha256,rectangles:out.qualification.rectangle_count,static:"PASS"}));}
