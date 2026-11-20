// Deterministic author-material rebuild. Requires Node >=18. No external packages.
"use strict";
const fs=require("fs"),path=require("path");
function utf8(s){let a=[];for(let i=0;i<s.length;i++){let cp=s.codePointAt(i);if(cp>65535)i++;if(cp<128)a.push(cp);else if(cp<2048)a.push(192|(cp>>6),128|(cp&63));else if(cp<65536)a.push(224|(cp>>12),128|((cp>>6)&63),128|(cp&63));else a.push(240|(cp>>18),128|((cp>>12)&63),128|((cp>>6)&63),128|(cp&63))}return new Uint8Array(a)}
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
 const w=spec.extent[0],h=spec.extent[1],a=new Uint8Array(w*h);
 function rect(x,y,ww,hh,m){x=Math.round(x);y=Math.round(y);ww=Math.round(ww);hh=Math.round(hh);let xa=Math.max(0,x),xb=Math.min(w,x+ww);if(xa>=xb)return;for(let yy=Math.max(0,y);yy<Math.min(h,y+hh);yy++)a.fill(m,yy*w+xa,yy*w+xb)}
 for(const z of spec.ops){if(z[0]==="R"){rect(...z.slice(1));continue}
 if(z[0]==="F"){const [_,x,y,ww,hh,t,m]=z;rect(x,y,ww,t,m);rect(x,y+hh-t,ww,t,m);rect(x,y,t,hh,m);rect(x+ww-t,y,t,hh,m);continue}
 if(z[0]==="L"){let [_,x0,y0,x1,y1,t,m]=z;let n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0)));for(let i=0;i<=n;i++){let x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;rect(x-t/2,y-t/2,t,t,m)}continue}throw Error("Bad operation "+z[0])}
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
 const out=[],act=new Map();for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let v=a[y*W+x];if(!v){x++;continue}let start=x;while(x<W&&a[y*W+x]===v)x++;let key=start+","+(x-start)+","+v,idx=act.get(key);if(idx===undefined){idx=out.length;out.push([start,y,x-start,1,v])}else out[idx][3]++;next.set(key,idx)}act.clear();for(let [k,v]of next)act.set(k,v)}return out;
}
function replay(edits,W,H){
 const arr=new Uint8Array(W*H),seen=new Uint8Array(W*H);let work=0;
 for(let [x,y,w,h,m] of edits){if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(w)||!Number.isInteger(h)||x<0||y<0||w<1||h<1||x+w>W||y+h>H||![58,62,63,72,77,79,100,101,117,128].includes(m))throw Error("Invalid edit");for(let yy=y;yy<y+h;yy++){let p=yy*W+x;for(let xx=0;xx<w;xx++){if(seen[p+xx])throw Error("Overlap");seen[p+xx]=1;arr[p+xx]=m;work++}}}
 return{arr,work};
}
function flight(a,spec){
 const W=spec.extent[0],H=spec.extent[1],N=W*H,P=W+1,ps=new Int32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=a[(y-1)*W+x-1]?1:0;ps[y*P+x]=ps[(y-1)*P+x]+sum}}
 function freeFor(ww,hh,obs){let hx=(ww-1)/2,hy=(hh-1)/2,f=new Uint8Array(N);for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){let xa=x-hx,xb=x+hx+1,ya=y-hy,yb=y+hy+1;let s=ps[yb*P+xb]-ps[ya*P+xb]-ps[yb*P+xa]+ps[ya*P+xa];if(!s)f[y*W+x]=1}
 if(obs){let [ox,oy,ow,oh]=obs;for(let y=Math.max(hy,oy-hy);y<Math.min(H-hy,oy+oh+hy);y++)for(let x=Math.max(hx,ox-hx);x<Math.min(W-hx,ox+ow+hx);x++)f[y*W+x]=0}return f}
 function bfs(f,st,en,restricted){let start=st[1]*W+st[0],target=en?en[1]*W+en[0]:-1;if(!f[start]||(target>=0&&!f[target]))return{distance:-1,count:0,dist:null};
 const d=new Int32Array(N),q=new Int32Array(N);d.fill(-1);let head=0,tail=0;q[tail++]=start;d[start]=0;
 while(head<tail){let i=q[head++];if(i===target)return{distance:d[i],count:tail,dist:d};let x=i%W,y=(i/W)|0;for(let ni of [i-1,i+1,i-W,i+W]){if(ni<0||ni>=N||!f[ni]||d[ni]>=0)continue;let nx=ni%W,ny=(ni/W)|0;if(Math.abs(nx-x)+Math.abs(ny-y)!==1)continue;if(restricted&&nx>=spec.route_bans.xmin&&nx<=spec.route_bans.xmax){if(restricted==="upper"&&ny>spec.route_bans.upper_max_y)continue;if(restricted==="lower"&&ny<spec.route_bans.lower_min_y)continue}d[ni]=d[i]+1;q[tail++]=ni}}
 return{distance:target>=0?-1:0,count:tail,dist:d}}
 const checks={};let failures=[];for(let wh of [[19,15],[23,19],[31,27]]){let f=freeFor(...wh),walk=bfs(f,spec.sites.spawn_quarantine);let ok={},nonfree=[],lost=[],approach=[];
 for(let [k,p] of Object.entries(spec.sites)){let i=p[1]*W+p[0];let valid=!!f[i],reachable=valid&&walk.dist[i]>=0,cardinals=[[p[0]+1,p[1]],[p[0]-1,p[1]],[p[0],p[1]+1],[p[0],p[1]-1]];let four=cardinals.every(([x,y])=>x>=0&&y>=0&&x<W&&y<H&&!!f[y*W+x]);ok[k]={free:valid,reachable,four_cardinal_approaches:four};if(!valid)nonfree.push(k);if(!reachable)lost.push(k);if(!four)approach.push(k)}
 checks[wh.join("x")]={visited_centres:walk.count,named_sites:ok,nonfree,lost,approach};if(nonfree.length||lost.length||approach.length)failures.push({hull:wh,nonfree,lost,approach})}
 const f=freeFor(31,27),fo=freeFor(31,27,spec.obstruction),st=spec.gates.west,en=spec.gates.east,baseline=bfs(f,st,en).distance,blocked=bfs(fo,st,en).distance,upper=bfs(fo,st,en,"upper").distance,lower=bfs(fo,st,en,"lower").distance;
 let obsReach=bfs(fo,spec.sites.spawn_quarantine),obstructedSites={};for(let [k,[x,y]] of Object.entries(spec.sites))obstructedSites[k]={directly_occluded:!fo[y*W+x],reachable:!!fo[y*W+x]&&obsReach.dist[y*W+x]>=0};
 if(baseline<0||blocked<0||upper<0||lower<0||blocked<=baseline)failures.push({routes:{baseline,blocked,upper,lower}});
 return{checks,failures,obstruction:spec.obstruction,route_distances:{baseline,blocked,upper,lower},obstructed_sites:obstructedSites};
}
function crc32(b){let c=0xffffffff;for(let x of b){c^=x;for(let k=0;k<8;k++)c=c&1?(c>>>1)^0xedb88320:c>>>1}return(c^0xffffffff)>>>0}
function concat(list){let n=0;for(let a of list)n+=a.length;let out=new Uint8Array(n),p=0;for(let a of list){out.set(a,p);p+=a.length}return out}
function pngIndexed(a,W,x0,y0,w,h,palette){
 const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(a.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);
 let chunks=[new Uint8Array([0x78,0x01])],s1=1,s2=0;for(let x of raw){s1=(s1+x)%65521;s2=(s2+s1)%65521}
 for(let i=0;i<raw.length;i+=65535){let n=Math.min(65535,raw.length-i),last=i+n>=raw.length;chunks.push(new Uint8Array([last?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255]),raw.subarray(i,i+n))}
 chunks.push(new Uint8Array([(s2>>>8)&255,s2&255,(s1>>>8)&255,s1&255]));let compressed=concat(chunks);
 const be=n=>new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);
 const chunk=(type,data)=>{let name=utf8(type),body=concat([name,data]);return concat([be(data.length),body,be(crc32(body))])};
 let ihdr=concat([be(w),be(h),new Uint8Array([8,3,0,0,0])]),plte=new Uint8Array(129*3);for(let i=0;i<=128;i++){let v=palette[String(i)]||[80,80,80];plte.set(v,i*3)}
 return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("PLTE",plte),chunk("IDAT",compressed),chunk("IEND",new Uint8Array(0))]);
}
function verifyPNG(p,a,W,x0,y0,w,h){
 const num=(pos)=>(p[pos]*16777216+p[pos+1]*65536+p[pos+2]*256+p[pos+3])>>>0;
 if(p.length<30||p[0]!==137||p[1]!==80||p[2]!==78||p[3]!==71)throw Error("Bad PNG signature");
 let off=8,idat=null,gotIhdr=false;while(off<p.length){let n=num(off),type=String.fromCharCode(...p.subarray(off+4,off+8)),data=p.subarray(off+8,off+8+n),saved=num(off+8+n),real=crc32(p.subarray(off+4,off+8+n));if(saved!==real)throw Error(type+" CRC mismatch");if(type==="IHDR"){if(num(off+8)!==w||num(off+12)!==h||p[off+16]!==8||p[off+17]!==3)throw Error("Wrong IHDR");gotIhdr=true}if(type==="IDAT")idat=data;off+=n+12;if(type==="IEND")break}
 if(!gotIhdr||!idat)throw Error("Missing PNG payload");if(idat[0]!==120||idat[1]!==1)throw Error("Zlib header");
 let cursor=2,parts=[],size=0,final=false;while(!final){let mode=idat[cursor++];final=!!(mode&1);if(mode&0xfe)throw Error("Not stored deflate");let n=idat[cursor]|(idat[cursor+1]<<8),inv=idat[cursor+2]|(idat[cursor+3]<<8);cursor+=4;if((n^inv)!==65535)throw Error("Bad deflate length");let sub=idat.subarray(cursor,cursor+n);cursor+=n;parts.push(sub);size+=n}let raw=concat(parts);if(size!==(w+1)*h)throw Error("Scanline byte count");let s1=1,s2=0;for(let x of raw){s1=(s1+x)%65521;s2=(s2+s1)%65521}let stored=((idat[cursor]*16777216+idat[cursor+1]*65536+idat[cursor+2]*256+idat[cursor+3])>>>0),adler=((s2*65536+s1)>>>0);if(adler!==stored)throw Error("Adler mismatch");
 for(let y=0;y<h;y++){if(raw[y*(w+1)]!==0)throw Error("Filter not 0");for(let x=0;x<w;x++)if(raw[y*(w+1)+x+1]!==a[(y0+y)*W+x0+x])throw Error("Pixel parity "+x+","+y)}return w*h;
}
function makeArtifacts(spec){
 const W=spec.extent[0],H=spec.extent[1],a=paint(spec),grounding=ground(a,W,H),edits=encode(a,W,H),replayed=replay(edits,W,H),route=flight(a,spec),hist={};let mismatch=0;
 for(let i=0;i<a.length;i++){if(replayed.arr[i]!==a[i])mismatch++;let k=String(a[i]);hist[k]=(hist[k]||0)+1}
 if(mismatch||edits.length>32768||route.failures.length||grounding.grounded!==replayed.work)throw Error("Static qualification failed: "+JSON.stringify({mismatch,rects:edits.length,routes:route.failures,grounding,work:replayed.work}));
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:spec.sites.spawn_quarantine,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:spec.policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupName="setup-asterion-packet-loom.json",setupText=JSON.stringify(setup),setupBytes=utf8(setupText);
 if(setupBytes.length>1048576||replayed.work>32000000)throw Error("Setup cap exceeded");
 const media={};let imageReceipt={};for(let c of [["overview.png",0,0,W,H],...spec.crops]){let [name,x,y,w,h]=c,p=pngIndexed(a,W,x,y,w,h,spec.palette);let parity=verifyPNG(p,a,W,x,y,w,h);media[name]=p;imageReceipt[name]={x,y,w,h,bytes:p.length,sha256:sha256(p),verified_pixels:parity,crc_adler_and_exact_material_parity:true}}
 const qual={title:spec.title,seed:spec.seed,source:spec.source,base_sha:spec.base_sha,engine_sha:spec.engine_sha,extent:spec.extent,cells:a.length,grid_sha256:sha256(a),setup_sha256:sha256(setupBytes),setup_bytes:setupBytes.length,materials:hist,occupied:grounding.grounded,grounded:grounding.grounded,detached:0,pruned_nominal_cells:grounding.pruned,rectangles:edits.length,work:replayed.work,replay:{overlaps:0,invalid:0,mismatches:mismatch},valid_material_ids:[58,62,63,72,77,79,100,101,117,128],physics:"Accepted native immovable Solid / RuleKernel::None; no liquids, powders or reactive cells",sites:route.checks,route_distances:route.route_distances,route_obstruction:route.obstruction,obstructed_sites:route.obstructed_sites,images:imageReceipt,source_limits:{rectangles:32768,json_bytes:1048576,cell_writes:32000000},installed_bridge:"NOT-VERIFIED; possible historical 4096 edit limit",native_status:"NATIVE-UNTESTED",review_status:"AUTHOR-STATIC-PASS; INDEPENDENT ART/TECH/SHEPHERD PENDING"};
 const readme=`# ${spec.title} - original CyberSand 2048x1024 landscape
**Draft/HOLD; author source-static PASS; independent art/tech/Shepherd pending; NATIVE-UNTESTED.**

${spec.description}

## Functional districts and Midge route
${spec.districts.map((x,i)=>`${i+1}. ${x}`).join("\n")}

Spawn is ${JSON.stringify(spec.sites.spawn_quarantine)}, finishing at ${JSON.stringify(spec.sites.finish_beacon)}. All 15 literal named sites in design.json pass 19x15, 23x19 and 31x27 conservative clearance and 4-neighbour free-centre BFS from exact spawn; each site has four legal cardinal local approaches. No target shifting or nearest-site substitution. The grounded index bench at ${JSON.stringify(spec.sites.entered_inspection)} is Midge enterable from the large centre flight void. True side elevation, no perspective/isometric platforms.

## Rebuild, physical contract and evidence
- Reproduce locally with \`node build.js\` from this directory (Node 18+). It reconstructs all material cells from fixed-seed design.json, prunes detached nominal decorations, emits exact Setup-v2, full-grid receipt and 7 true material-indexed PNGs.
- Source authority sandmapsreference \`${spec.base_sha}\`, read-only accepted CyberSand \`${spec.engine_sha}\`. Actual native installed bridge has NOT been tested.
- Material grid: ${a.length} bytes/cells; SHA-256 \`${qual.grid_sha256}\`; ${qual.occupied} occupied and boundary-grounded inert solids; ${grounding.pruned} unsupported nominal cells discarded; 0 detached final solids; 0 mobile/reactive/fluid cells.
- Source-authorized rectangle budget: ${edits.length}/32768. Setup JSON ${setupBytes.length}/1048576 bytes, work ${replayed.work}/32000000. Replay zero overlaps and mismatches.
- Physical ${spec.obstruction.join("x")} central temporary block changes west-to-east 31x27 shortest flight from ${qual.route_distances.baseline} to ${qual.route_distances.blocked} cardinal steps. Restricted upper ${qual.route_distances.upper} and lower ${qual.route_distances.lower} bypasses each pass.
- Full authentic indexed overview and six 1:1 material-cell district crops all have strict encoded CRC, zlib Adler, dimensions, and complete pixel parity versus the source cells.
- No actual Godot/Workbench/GDExtension/Midge-Rapier trajectory, collision, world tick, fresh process save/reopen or installed DLL capacity test has occurred: NATIVE-UNTESTED. The accepted source cap of 32768 cannot be assumed to apply to old installed bridges (~4096 possible). Independent source Art/Technical/Shepherd review and owner acceptance remain separate gates. Do not merge or promote.

**Geometry is author-created industrial xenotechnology, not a reference image conversion or artwork substitute.**
`;
 const files={...media,[setupName]:setupText,"qualification.json":JSON.stringify(qual,null,2)+"\n","README.md":readme};
 return{files,qualification:qual};
}
const spec=JSON.parse(fs.readFileSync(path.join(__dirname,"design.json"),"utf8"));
const result=makeArtifacts(spec);
for(const [name,value] of Object.entries(result.files)){fs.writeFileSync(path.join(__dirname,name),typeof value==="string"?value:Buffer.from(value));}
console.log(JSON.stringify({grid_sha256:result.qualification.grid_sha256,rectangles:result.qualification.rectangles,sites:Object.keys(spec.sites).length,source_static:"PASS"},null,2));
