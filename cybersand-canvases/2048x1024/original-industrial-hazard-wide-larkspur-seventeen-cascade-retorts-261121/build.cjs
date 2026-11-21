'use strict';
// Original fixed-seed Larkspur-17 material-cell generation; no reference-art imports.
function build(){
const W=2048,H=1024,N=W*H,SEED=2026112117,BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",ENGINE="69209acaffb34ebe18c45e19290b5976b7fb2c82";
const PAL={0:[9,21,32],3:[39,123,200],8:[243,92,38],58:[125,132,141],100:[48,61,76],101:[27,42,58],117:[170,182,197],120:[84,189,177]};
const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const SITES=[["West entry",111,142],["Scale-room upper",312,174],["Receiving gallery",351,321],["Receiving recovery",339,839],["Retort transfer crown",598,165],["Hot retort access",697,394],["Retort recovery",683,841],["Quench bridge",943,168],["Quench inspection",1048,476],["Quench recovery",1045,840],["Cyclone crossover",1290,160],["Ash return",1391,567],["Ash recovery",1372,837],["Fraction collector",1637,157],["Export workface",1743,650],["Export recovery",1699,839],["East exit",1910,161]];
const CROPS=[["01-cask-weighbridge",98,220,375,412],["02-thermal-retorts",446,255,378,470],["03-quench-siphon",791,310,397,510],["04-ash-cyclone",1125,400,404,480],["05-export-bottler",1484,475,443,430],["06-cascade-transfers",649,164,765,444]];
const g=new Uint8Array(N);
function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1)return;let a=Math.max(0,x),b=Math.min(W,x+w);if(a>=b)return;for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)g.fill(m,j*W+a,j*W+b)}
function line(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let f=i/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m)}}
function arc(cx,cy,rx,ry,from,to,t,m){let n=Math.ceil(Math.abs(to-from)*Math.max(rx,ry)/2);for(let i=0;i<=n;i++){let v=from+(to-from)*i/n;rect(cx+rx*Math.cos(v)-t/2,cy+ry*Math.sin(v)-t/2,t,t,m)}}
// Original stepped, descending five-district dry industrial process cascade; no source/reference geometry.
rect(0,0,62,H,101);rect(1984,0,64,H,101);rect(0,934,W,90,100);rect(0,998,W,26,101);rect(62,905,1922,29,58);rect(62,0,1922,27,101);
let xs=[120,471,821,1170,1518],fs=[410,503,584,671,760],widths=[270,265,268,266,286];
for(let stage=0;stage<5;stage++){let x=xs[stage],y=fs[stage],w=widths[stage];
 rect(x,y,w,18,58);rect(x+6,y+18,12,486,100);rect(x+w-32,y+18,15,470,58);
 rect(x+6,y+18,25,120,117);rect(x+w-48,y+18,22,93,117);
 line(x+15,y+44,x+78,y+115,11,117);line(x+w-26,y+45,x+w-86,y+110,11,117);
 rect(x+8,y-184,119,14,117);line(x+12,y-170,x+68,y-112,11,58);rect(x+8,y-172,15,97,58);
 line(x+w-43,y-124,x+w-8,y-97,12,117);
 if(stage<4){let nx=xs[stage+1],ny=fs[stage+1];line(x+w-19,y-46,nx+20,ny-121,15,117);line(x+w-19,y-24,nx+20,ny-96,9,58)}
}
// Cask weighbridge, inlet arms and accessible receiving hatch.
rect(149,311,74,97,100);rect(157,317,58,79,101);rect(236,335,62,73,58);rect(246,346,42,46,120);rect(308,338,34,68,117);
line(172,312,186,260,14,117);line(186,260,261,276,13,117);line(261,276,280,334,14,117);rect(165,261,42,11,58);rect(292,359,15,45,101);
// Unequal dry reactor retort columns and crossflow conductor.
rect(504,358,71,144,58);rect(515,370,48,106,100);rect(594,319,79,181,58);rect(606,331,54,138,101);
rect(524,355,41,9,117);rect(604,315,55,10,117);line(566,348,615,328,12,117);rect(685,434,35,67,100);rect(674,444,10,53,117);
// Quench assembly: water in inert nested housing, dry empty opposing vessel; lower second sealed hot specimen.
rect(868,448,90,136,58);rect(880,463,64,86,3);
rect(979,465,70,119,58);rect(991,479,43,70,100);
line(856,425,952,366,14,117);line(952,366,1081,405,14,58);rect(921,394,24,16,120);rect(1074,490,26,91,101);
// Cyclone crest and ash cyclone recovery, fourth stage.
arc(1268,511,97,115,Math.PI*1.04,Math.PI*2.02,15,117);line(1200,483,1269,421,15,58);line(1325,462,1403,493,15,117);
rect(1229,546,77,124,100);rect(1241,559,50,86,101);rect(1337,575,56,91,58);rect(1348,585,32,70,120);
// Distinct export collectors, hanging loading frame, empty eastern expansion.
rect(1561,614,60,144,58);rect(1572,625,36,107,100);rect(1640,578,68,178,58);rect(1652,590,43,138,101);
rect(1731,614,47,143,58);rect(1742,629,23,104,120);line(1665,578,1711,514,15,117);
line(1711,514,1825,555,13,117);rect(1790,717,86,14,117);rect(1800,732,12,69,58);
// Sparse lower maintenance walled workstands, then clear flyable return and five shafts.
for(let [x,y] of [[195,730],[550,746],[885,760],[1207,753],[1568,790]]){rect(x,y,120,12,117);rect(x+11,y+12,12,70,58);rect(x+100,y+12,12,70,58);rect(x+42,y+17,38,25,100)}
rect(84,808,1869,78,0);
for(let x of [344,698,1043,1390,1745])rect(x-37,282,74,606,0);
rect(85,101,1855,90,0);
for(let [,x,y] of SITES)rect(x-19,y-17,39,35,0);
// Liquid specimens sealed only after all subtraction. Separate fluids and no air boundary.
rect(889,738,74,66,58);rect(902,749,49,36,3);rect(981,732,74,72,58);rect(994,744,48,38,8);
rect(890,802,74,7,58);rect(981,802,75,8,58);
function structural(){let mask=new Uint8Array(N),seen=new Uint8Array(N),q=new Int32Array(N),n=0,t=0,h=0;
 for(let i=0;i<N;i++)if(g[i]&&g[i]!==3&&g[i]!==8){mask[i]=1;n++}
 for(let x=0;x<W;x++)for(let p of [x,(H-1)*W+x])if(mask[p]&&!seen[p]){seen[p]=1;q[t++]=p}
 for(let y=0;y<H;y++)for(let p of [y*W,y*W+W-1])if(mask[p]&&!seen[p]){seen[p]=1;q[t++]=p}
 while(h<t){let p=q[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v<0||v>=N||(d===-1&&x===0)||(d===1&&x===W-1)||seen[v]||!mask[v])continue;seen[v]=1;q[t++]=v}}
 return {mask,seen,total:n,grounded:t,detached:n-t}}
function stitch(c){let prev=new Int32Array(N),q=new Int32Array(N),h=0,t=0,last=-1;prev.fill(-1);
 function barred(p){let x=p%W,y=(p/W)|0;return SITES.some(s=>Math.abs(s[1]-x)<31&&Math.abs(s[2]-y)<29)||g[p]===3||g[p]===8}
 for(let p=0;p<N;p++)if(c.mask[p]&&!c.seen[p]&&!barred(p)){prev[p]=p;q[t++]=p}
 while(h<t){let p=q[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v<0||v>=N||(d===-1&&x===0)||(d===1&&x===W-1)||prev[v]>=0)continue;if(c.seen[v]){last=p;h=t;break}if(barred(v))continue;prev[v]=p;q[t++]=v}}
 if(last<0)return false;for(let p=last;prev[p]!==p;p=prev[p])if(!g[p])g[p]=58;return true}
function sha(input){let b=typeof input==="string"?Uint8Array.from(input.split("").map(c=>c.charCodeAt(0))):input;
 let K=[],Hh=[];for(let n=2;K.length<64;n++){let q=true;for(let j=2;j*j<=n;j++)if(n%j===0){q=false;break}if(q)K.push(Math.floor((n**(1/3)%1)*4294967296)>>>0)}
 for(let n=2;Hh.length<8;n++){let q=true;for(let j=2;j*j<=n;j++)if(n%j===0){q=false;break}if(q)Hh.push(Math.floor((Math.sqrt(n)%1)*4294967296)>>>0)}
 let L=b.length,T=Math.ceil((L+9)/64)*64,a=new Uint8Array(T);a.set(b);a[L]=128;for(let i=0;i<8;i++)a[T-i-1]=Math.floor(L*8/2**(i*8))&255;
 const R=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let z=0;z<T;z+=64){let w=new Uint32Array(64);for(let j=0;j<16;j++){let i=z+j*4;w[j]=((a[i]<<24)|(a[i+1]<<16)|(a[i+2]<<8)|a[i+3])>>>0}
  for(let j=16;j<64;j++){let x=w[j-15],y=w[j-2];w[j]=(w[j-16]+(R(x,7)^R(x,18)^(x>>>3))+w[j-7]+(R(y,17)^R(y,19)^(y>>>10)))>>>0}
  let [A,B,C,D,E,F,G,I]=Hh;for(let j=0;j<64;j++){let t1=(I+(R(E,6)^R(E,11)^R(E,25))+((E&F)^((~E)&G))+K[j]+w[j])>>>0,t2=((R(A,2)^R(A,13)^R(A,22))+((A&B)^(A&C)^(B&C)))>>>0;
   I=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}
  [A,B,C,D,E,F,G,I].forEach((v,i)=>Hh[i]=(Hh[i]+v)>>>0)}
 return Hh.map(x=>x.toString(16).padStart(8,"0")).join("")}
function crc(a){let c=-1;for(let x of a){c^=x;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}
function be32(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]}
function compress(a){
 let bases=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ext=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 let out=[120,1],bits=0,n=0;function put(v,w){bits|=v<<n;n+=w;while(n>=8){out.push(bits&255);bits>>>=8;n-=8}}
 function rev(v,w){let z=0;for(let i=0;i<w;i++){z=(z<<1)|(v&1);v>>>=1}return z}
 function emit(x){let c,w;if(x<=143){c=48+x;w=8}else if(x<=255){c=400+x-144;w=9}else if(x<=279){c=x-256;w=7}else{c=192+x-280;w=8}put(rev(c,w),w)}
 put(3,3);for(let i=0;i<a.length;){let z=0;if(i>0&&a[i]===a[i-1])while(i+z<a.length&&a[i+z]===a[i-1]&&z<258)z++;
  if(z>=3){let j=28;while(j>0&&(z<bases[j]||z>bases[j]+(2**ext[j]-1)))j--;emit(257+j);if(ext[j])put(z-bases[j],ext[j]);put(0,5);i+=z}
  else{emit(a[i]);i++}}
 emit(256);if(n)out.push(bits&255);let u=1,v=0;for(let x of a){u=(u+x)%65521;v=(v+u)%65521}
 out.push((v>>>8)&255,v&255,(u>>>8)&255,u&255);return Uint8Array.from(out)}
function png(x=0,y=0,w=W,h=H){
 let raw=new Uint8Array((w+1)*h);for(let j=0;j<h;j++){let o=j*(w+1);raw[o]=2;for(let i=0;i<w;i++)raw[o+i+1]=(g[(y+j)*W+x+i]-(j?g[(y+j-1)*W+x+i]:0)+256)&255}
 let pal=new Uint8Array(768);for(let k=0;k<256;k++)pal.set(PAL[k]||[0,0,0],3*k);
 let chunks=[];for(let [t,v] of [["IHDR",Uint8Array.from([...be32(w),...be32(h),8,3,0,0,0])],["PLTE",pal],["IDAT",compress(raw)],["IEND",new Uint8Array()]]){
  let c=new Uint8Array(v.length+4);for(let i=0;i<4;i++)c[i]=t.charCodeAt(i);c.set(v,4);chunks.push(Uint8Array.from([...be32(v.length),...c,...be32(crc(c))]))}
 let out=new Uint8Array(8+chunks.reduce((s,b)=>s+b.length,0)),p=8;out.set([137,80,78,71,13,10,26,10]);for(let c of chunks){out.set(c,p);p+=c.length}return out}
function free(rx,ry,plane){
 let sums=new Uint32Array((W+1)*(H+1)),mask=new Uint8Array(N),S=W+1;
 for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=plane[y*W+x]?1:0;sums[(y+1)*S+x+1]=sums[y*S+x+1]+row}}
 for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let a=x-rx,b=x+rx+1,c=y-ry,d=y+ry+1;if(sums[d*S+b]-sums[c*S+b]-sums[d*S+a]+sums[c*S+a]===0)mask[y*W+x]=1}
 return mask}
function bfs(mask){
 let d=new Int32Array(N),q=new Int32Array(N),h=0,t=1,start=SITES[0][2]*W+SITES[0][1];d.fill(-1);if(!mask[start])throw Error("literal spawn obstructed");q[0]=start;d[start]=0;
 while(h<t){let p=q[h++],x=p%W;for(let step of [-W,W,-1,1]){let k=p+step;if(k<0||k>=N||(step===-1&&x===0)||(step===1&&x===W-1)||d[k]>=0||!mask[k])continue;d[k]=d[p]+1;q[t++]=k}}
 return {dist:d,centres:t}}
function rectangles(plane){let edits=[],old=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let m=plane[y*W+x],b=x+1;while(b<W&&plane[y*W+b]===m)b++;if(m){let key=x+":"+String(b-x)+":"+m,e=old.get(key);if(e){e[3]++;now.set(key,e)}else{e=[x,y,b-x,1,m];edits.push(e);now.set(key,e)}}x=b}old=now}return edits}
for(let k=0;k<90;k++){let s=structural();if(!s.detached)break;if(!stitch(s))throw Error("disconnected inert support: "+s.detached);if(k===89)throw Error("rooting did not converge")}
let edits=rectangles(g),out=new Uint8Array(N),used=new Uint8Array(N),work=0;
for(let [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!PAL[m])throw Error("invalid rectangle");work+=w*h;
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){let k=j*W+i;if(used[k])throw Error("overlap "+k);used[k]=1;out[k]=m}}
for(let k=0;k<N;k++)if(out[k]!==g[k])throw Error("replay mismatch "+k);
let s=structural();if(s.detached)throw Error("detached solids "+s.detached);
let hist={},fluid=0,contacts=0;for(let k=0;k<N;k++){let m=g[k];hist[m]=(hist[m]||0)+1;if(m===3||m===8){fluid++;let x=k%W,y=(k/W)|0;
 if(!x||!y||x===W-1||y===H-1)throw Error("fluid border");
 for(let d of [-W,W,-1,1])if(!g[k+d]||(m===3&&g[k+d]===8)||(m===8&&g[k+d]===3))contacts++}}
if(contacts)throw Error("uncontained liquid contacts "+contacts);
let clearance={},base;
for(let [w,h] of [[19,15],[23,19],[31,27]]){let mask=free(w>>1,h>>1,g),z=bfs(mask),lost=SITES.filter(s=>z.dist[s[2]*W+s[1]]<0);
 if(lost.length)throw Error("unreachable "+w+"x"+h+": "+lost.map(s=>s[0]).join(","));
 for(let [name,x,y] of SITES){let p=y*W+x;if(!mask[p-W]||!mask[p+W]||!mask[p-1]||!mask[p+1])throw Error("cardinal obstructed "+w+"x"+h+" "+name)}
 clearance[w+"x"+h]={reached:SITES.length,centres:z.centres};if(w===31)base=z.dist}
const barrier=[784,0,63,346],blocked=g.slice();for(let y=barrier[1];y<barrier[1]+barrier[3];y++)blocked.fill(58,y*W+barrier[0],y*W+barrier[0]+barrier[2]);
let detours={},forced=0;for(let [w,h] of [[19,15],[23,19],[31,27]]){let z=bfs(free(w>>1,h>>1,blocked)),lost=SITES.filter(s=>z.dist[s[2]*W+s[1]]<0);
 if(lost.length)throw Error("obstruction blocked "+w+"x"+h+": "+lost.map(s=>s[0]).join(","));
 if(w===31)for(let site of SITES){let k=site[2]*W+site[1],d=z.dist[k]-base[k];detours[site[0]]=d;if(d>0)forced++}}
if(!forced)throw Error("obstruction does not force alternate route");
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:SITES[0].slice(1),options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:LIQ,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
let setupText=JSON.stringify(setup);if(edits.length>32768||setupText.length>1048576||work>N)throw Error("editor bounds");
let imgs={"overview.png":png()};for(let [name,x,y,w,h] of CROPS)imgs[name+".png"]=png(x,y,w,h);
let images={};for(let [name,b] of Object.entries(imgs)){let crop=name==="overview.png"?[0,0,W,H]:CROPS.find(c=>c[0]+".png"===name).slice(1);images[name]={bytes:b.length,sha256:sha(b),crop}}
let receipt={title:"Larkspur-17 Stepped Thermal Cascade Retorts",seed:SEED,source_repo:"techrote/sandmapsreference",base_main:BASE,engine_readonly:ENGINE,extent:[W,H],final_material_cells:N,material_sha256:sha(g),setup_sha256:sha(setupText),setup_bytes:setupText.length,rectangle_count:edits.length,work_cells:work,histogram:hist,structural:{total:s.total,grounded:s.grounded,detached:s.detached},initial_fluid_cells:fluid,initial_fluid_open_or_mixed_faces:contacts,sites:SITES,clearance,obstruction:{rectangle:barrier,forced_detours:forced,added_steps_at_31x27:detours},routes:{main:"receiving -> stepped thermal retorts -> contained quench -> cyclone ash return -> export bottlers",alternative:"upper air plus lower flyable maintenance return and wide service shafts",interconnects:["cask weighbridge","twin retort towers","sealed quench","ash cyclone","outbound bottle staging"]},images,status:"CREATOR SOURCE-STATIC PASS / NATIVE-UNTESTED"};
return {g,setupText,receipt,imgs}}
if(typeof module!=='undefined'&&module.exports){module.exports={build};if(require.main===module){const fs=require('node:fs'),path=require('node:path'),dir=process.env.OUT_DIR||__dirname,b=build();if(process.argv.includes('--write')){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'setup.json'),b.setupText);fs.writeFileSync(path.join(dir,'receipt.json'),JSON.stringify(b.receipt,null,2)+'\n');for(const [n,v] of Object.entries(b.imgs))fs.writeFileSync(path.join(dir,n),v)}if(process.argv.includes('--verify')){for(const [n,v] of [['setup.json',b.setupText],['receipt.json',JSON.stringify(b.receipt,null,2)+'\n'],...Object.entries(b.imgs)])if(!fs.readFileSync(path.join(dir,n)).equals(Buffer.from(v)))throw Error('committed mismatch '+n)}process.stdout.write(JSON.stringify({sha:b.receipt.material_sha256,rectangles:b.receipt.rectangle_count,sites:b.receipt.sites.length})+'\n')}}
