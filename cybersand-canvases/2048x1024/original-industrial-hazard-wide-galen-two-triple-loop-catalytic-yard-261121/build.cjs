'use strict';
// Galen-2: original triple-loop catalytic sorting yard.
// Fixed-seed deterministic authoring. No source images, no historical geometry.
function build(){
 const W=2048,H=1024,N=W*H,SEED=2026112111;
 const BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7";
 const ENGINE="f7e056c9b8791106e22f2d1c295043783d8a9701";
 const PAL={0:[8,19,30],3:[47,127,210],8:[241,78,31],58:[119,123,128],100:[45,60,78],101:[28,39,55],117:[157,182,198],120:[84,185,182]};
 const SITES=[["West ingress",144,220],["Reagent canopy",330,230],["Reagent workface",330,688],["Reagent recovery",334,829],["North exchanger",678,228],["Exchanger undercroft",712,685],["Exchanger return",710,826],["Rotary crown",1037,231],["Sorter chamber",1040,526],["Rotor underside",1036,818],["Quench airlock",1300,234],["Quench overlook",1300,682],["Quench recovery",1300,831],["Scrubber hoist",1620,229],["Scrubber gallery",1623,686],["Scrubber recovery",1623,828],["Eastern dispatch",1905,231],["Eastern platform",1870,681]];
 const CROPS=[["01-reagent-sluice",100,344,390,520],["02-heat-exchange",460,320,420,540],["03-triple-loop-sorter",853,335,448,498],["04-quench-locks",1240,410,335,475],["05-scrubber-dispatch",1590,340,425,535],["06-rotor-service-gap",870,552,407,320]];
 const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const g=new Uint8Array(N);
 function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1)return;let a=Math.max(0,x),b=Math.min(W,x+w);if(a>=b)return;for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)g.fill(m,j*W+a,j*W+b)}
 function line(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let f=i/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m)}}
 function arc(cx,cy,rx,ry,from,to,t,m){let n=Math.ceil(Math.abs(to-from)*Math.max(rx,ry)/2);for(let i=0;i<=n;i++){let v=from+(to-from)*i/n;rect(cx+rx*Math.cos(v)-t/2,cy+ry*Math.sin(v)-t/2,t,t,m)}}
 function carveEllipse(cx,cy,rx,ry){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let k=(y+.5-cy)/ry;if(Math.abs(k)>=1)continue;let dx=rx*Math.sqrt(1-k*k);rect(cx-dx,y,2*dx,1,0)}}



 // GALEN-2: distinct author-designed double-bypass sorting YARD.
 // Five industrial functions flank a central entered concentric static classifier.
 // Continuous public sky, open staging, transfer galleries, lower recovery and multiple revisitable access shafts.
 rect(0,0,72,H,101);rect(1981,0,67,H,101);
 rect(0,880,W,144,100);rect(0,975,W,49,101);
 rect(72,847,272,33,58);rect(1740,852,241,28,58);
 for(let [x,y,w,h] of [[92,807,320,73],[408,834,180,46],[650,845,190,35],[847,862,450,18],[1310,843,155,37],[1572,826,230,54],[1835,820,146,60]])rect(x,y,w,h,100);
 for(let [x,h] of [[121,345],[456,245],[857,331],[1221,370],[1572,290],[1910,335]]) {
    rect(x,880-h,18,h,58);rect(x+18,880-h+18,8,h-18,117);
 }
 // A: reagent sluice, unequal intake valves, assay and freight landing
 rect(150,499,224,19,58);line(152,499,231,406,18,117);line(231,406,375,501,19,117);
 rect(174,529,17,324,58);rect(365,516,18,348,58);
 rect(205,541,63,120,100);rect(217,554,39,85,101);
 rect(280,558,59,86,58);rect(290,576,40,49,120);
 line(193,476,235,466,12,58);line(282,456,344,488,11,58);
 rect(198,718,116,14,117);rect(213,733,13,119,58);rect(311,728,12,120,58);
 // B: dry heat-exchange double helix, sample throat and two low returns
 rect(500,447,21,412,58);rect(801,455,21,406,58);
 arc(654,528,125,122,2.85,6.75,13,117);
 arc(654,522,85,88,0.05,5.72,11,58);
 line(542,478,606,561,11,58);line(710,566,797,476,12,117);
 rect(543,566,233,12,58);rect(560,584,46,69,100);
 rect(722,568,65,75,100);rect(734,578,42,46,117);
 rect(574,721,170,15,117);rect(588,734,15,102,58);rect(723,734,16,102,58);
 // C: central deliberately grounded classifier, three nested loops and radial service limbs
 rect(918,720,24,157,58);rect(1166,726,24,150,58);
 arc(1052,532,145,165,0,Math.PI*2,15,117);
 arc(1052,532,99,116,0,Math.PI*2,12,58);
 arc(1052,532,55,66,0,Math.PI*2,10,120);
 line(934,673,960,747,18,58);line(1173,683,1155,764,18,58);
 line(963,435,1005,485,14,117);line(1115,477,1174,425,14,117);
 rect(985,735,159,15,58);rect(1011,752,24,107,58);rect(1103,757,23,101,58);
 line(895,388,973,334,18,58);line(973,334,1082,363,18,117);
 line(1082,363,1191,333,18,117);line(1191,333,1222,397,18,58);
 // D: split counterflow quench lock, dry public overlook; sealed samples inserted after carve
 rect(1274,506,19,360,58);rect(1545,503,18,352,58);
 line(1283,507,1358,450,16,117);line(1358,450,1451,466,14,58);
 line(1451,466,1556,503,15,117);
 rect(1311,538,211,15,58);
 rect(1336,553,77,91,100);rect(1432,558,79,86,101);
 rect(1306,721,210,14,117);rect(1318,735,15,117,58);rect(1511,737,17,113,58);
 // E: asymmetrical scrubber, draught condenser and freight egress
 rect(1620,450,20,416,58);rect(1925,472,18,394,58);
 line(1628,455,1720,380,14,117);line(1720,380,1840,403,16,58);
 line(1840,403,1933,480,14,117);
 rect(1671,499,72,118,100);rect(1686,515,44,88,101);
 arc(1833,527,83,79,3.0,6.25,14,117);
 rect(1778,591,104,16,58);rect(1802,608,16,91,117);
 rect(1680,717,179,16,117);rect(1695,732,13,122,58);
 rect(1845,732,13,122,58);
 // Four separate engineered aerial transfers, orthographic supports only.
 for(let [x,y,x2,y2] of [[378,486,518,439],[818,471,917,383],[1191,386,1280,506],[1556,493,1629,447]])
     line(x,y,x2,y2,14,117);
 // Core routes are actual air cells, not false background art.
 rect(95,158,1856,146,0);
 rect(100,646,1845,70,0);
 rect(104,796,1835,60,0);
 for(let [x,top,bottom] of [[329,303,857],[711,303,856],[870,303,856],[1244,303,857],[1621,303,857],[1868,303,856]])
    rect(x-38,top,76,bottom-top,0);
 // Entered rotor hollow and 63-cell-wide floorward opening in the rings.
 rect(1021,566,63,172,0);
 rect(1032,300,43,198,0);
 // Isolated water and hot-material reference vats with complete inert seals.
 rect(1353,733,82,146,58);rect(1365,747,58,98,3);
 rect(1462,738,81,141,58);rect(1476,753,53,90,8);
 rect(1364,879,68,8,58);rect(1470,879,73,8,58);
 for(let [,x,y] of SITES)rect(x-19,y-17,39,35,0);

 function rootComponents(){
   let seen=new Uint8Array(N),q=new Int32Array(N),rooted=0;
   for(let p=0;p<N;p++){
     if(seen[p]||!g[p]||g[p]===3||g[p]===8)continue;
     let h=0,t=1,roots=false,top=H,bot=0,mem=[];q[0]=p;seen[p]=1;
     while(h<t){let k=q[h++],x=k%W,y=(k/W)|0;mem.push(k);top=Math.min(top,y);bot=Math.max(bot,y);
       if(!x||x===W-1||!y||y===H-1)roots=true;
       for(let d of [-W,W,-1,1]){let v=k+d;if(v<0||v>=N||(d===-1&&x===0)||(d===1&&x===W-1)||seen[v]||!g[v]||g[v]===3||g[v]===8)continue;seen[v]=1;q[t++]=v;}}
     if(roots)continue;
     const anchor=top<680?0:H-1;let selected=null,best=H+1;
     for(let k of mem){let x=k%W,y=(k/W)|0,lo=Math.min(y,anchor),hi=Math.max(y,anchor),d=hi-lo;
       if(d>=best||x<10||x>=W-10)continue;
       if(SITES.some(s=>Math.abs(s[1]-x)<27&&s[2]>=lo-20&&s[2]<=hi+20))continue;
       let valid=true;for(let j=lo;j<=hi&&valid;j++)for(let dx=0;dx<3;dx++)if(g[j*W+x+dx]===3||g[j*W+x+dx]===8){valid=false;break}
       if(valid){selected=[x,lo,d+1];best=d;}}
     if(!selected)throw Error("unrootable component y="+top+".."+bot+" size="+t);
     rect(selected[0],selected[1],3,selected[2],58);rooted++;
   }
   return rooted;
 }
 const ties=0; // structural qualifier stitches non-rooted ornaments into stable grounded support
 return qualify();
 function structural(){
   let mask=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),n=0,t=0,h=0;
   for(let i=0;i<N;i++)if(g[i]&&g[i]!==3&&g[i]!==8){mask[i]=1;n++}
   for(let x=0;x<W;x++)for(let p of [x,(H-1)*W+x])if(mask[p]&&!seen[p]){seen[p]=1;queue[t++]=p}
   for(let y=0;y<H;y++)for(let p of [y*W,y*W+W-1])if(mask[p]&&!seen[p]){seen[p]=1;queue[t++]=p}
   while(h<t){let p=queue[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v<0||v>=N||(d===-1&&x===0)||(d===1&&x===W-1)||seen[v]||!mask[v])continue;seen[v]=1;queue[t++]=v}}
   return {mask,seen,total:n,grounded:t,detached:n-t};
 }
 function stitch(c){
   // Join only disconnected inert details to nearest in-bounds rooted structure.
   // Cannot pass through 40x36 protected checkpoint envelopes.
   let prev=new Int32Array(N),q=new Int32Array(N),h=0,t=0,last=-1;
   prev.fill(-1);
   function barred(p){let x=p%W,y=(p/W)|0;return SITES.some(s=>Math.abs(s[1]-x)<29&&Math.abs(s[2]-y)<26)}
   for(let p=0;p<N;p++)if(c.mask[p]&&!c.seen[p]&&!barred(p)){prev[p]=p;q[t++]=p}
   while(h<t){let p=q[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v<0||v>=N||(d===-1&&x===0)||(d===1&&x===W-1)||prev[v]>=0)continue;if(c.seen[v]){last=p;h=t;break}if(barred(v))continue;prev[v]=p;q[t++]=v}}
   if(last<0)return false;
   for(let p=last;prev[p]!==p;p=prev[p])if(!g[p])g[p]=58;
   return true;
 }
 function sha(input){
   let b=typeof input==="string"?Uint8Array.from(input.split("").map(c=>c.charCodeAt(0))):input;
   let K=[],Hh=[];for(let n=2;K.length<64;n++){let q=true;for(let j=2;j*j<=n;j++)if(n%j===0){q=false;break}if(q)K.push(Math.floor((n**(1/3)%1)*4294967296)>>>0)}
   for(let n=2;Hh.length<8;n++){let q=true;for(let j=2;j*j<=n;j++)if(n%j===0){q=false;break}if(q)Hh.push(Math.floor((Math.sqrt(n)%1)*4294967296)>>>0)}
   let L=b.length,T=Math.ceil((L+9)/64)*64,a=new Uint8Array(T);a.set(b);a[L]=128;
   for(let i=0;i<8;i++)a[T-i-1]=Math.floor(L*8/2**(i*8))&255;
   const R=(x,k)=>(x>>>k)|(x<<(32-k));
   for(let z=0;z<T;z+=64){let w=new Uint32Array(64);
     for(let j=0;j<16;j++){let i=z+j*4;w[j]=((a[i]<<24)|(a[i+1]<<16)|(a[i+2]<<8)|a[i+3])>>>0}
     for(let j=16;j<64;j++){let x=w[j-15],y=w[j-2];w[j]=(w[j-16]+(R(x,7)^R(x,18)^(x>>>3))+w[j-7]+(R(y,17)^R(y,19)^(y>>>10)))>>>0}
     let [A,B,C,D,E,F,G,I]=Hh;
     for(let j=0;j<64;j++){let t1=(I+(R(E,6)^R(E,11)^R(E,25))+((E&F)^((~E)&G))+K[j]+w[j])>>>0;
       let t2=((R(A,2)^R(A,13)^R(A,22))+((A&B)^(A&C)^(B&C)))>>>0;
       I=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}
     [A,B,C,D,E,F,G,I].forEach((v,i)=>Hh[i]=(Hh[i]+v)>>>0)
   }return Hh.map(x=>x.toString(16).padStart(8,"0")).join("");
 }
 function crc(a){let c=-1;for(let x of a){c^=x;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}
 function be32(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]}
 function compress(a){
   let bases=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ext=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
   let out=[120,1],bits=0,n=0;
   function put(v,w){bits|=v<<n;n+=w;while(n>=8){out.push(bits&255);bits>>>=8;n-=8}}
   function rev(v,w){let z=0;for(let i=0;i<w;i++){z=(z<<1)|(v&1);v>>>=1}return z}
   function emit(x){let c,w;if(x<=143){c=48+x;w=8}else if(x<=255){c=400+x-144;w=9}else if(x<=279){c=x-256;w=7}else{c=192+x-280;w=8}put(rev(c,w),w)}
   put(3,3);
   for(let i=0;i<a.length;){let z=0;if(i>0&&a[i]===a[i-1])while(i+z<a.length&&a[i+z]===a[i-1]&&z<258)z++;
     if(z>=3){let j=28;while(j>0&&(z<bases[j]||z>bases[j]+(2**ext[j]-1)))j--;
       emit(257+j);if(ext[j])put(z-bases[j],ext[j]);put(0,5);i+=z
     }else{emit(a[i]);i++}}
   emit(256);if(n)out.push(bits&255);
   let u=1,v=0;for(let x of a){u=(u+x)%65521;v=(v+u)%65521}
   out.push((v>>>8)&255,v&255,(u>>>8)&255,u&255);
   return Uint8Array.from(out);
 }
 function png(x=0,y=0,w=W,h=H){
   // PNG colour type 3, 8-bit indexed material ID, filter=2 (Up), zlib fixed Huffman.
   let raw=new Uint8Array((w+1)*h);
   for(let j=0;j<h;j++){let o=j*(w+1);raw[o]=2;for(let i=0;i<w;i++)raw[o+i+1]=(g[(y+j)*W+x+i]-(j?g[(y+j-1)*W+x+i]:0)+256)&255}
   let pal=new Uint8Array(768);for(let k=0;k<256;k++)pal.set(PAL[k]||[0,0,0],3*k);
   let chunks=[];for(let [t,v] of [["IHDR",Uint8Array.from([...be32(w),...be32(h),8,3,0,0,0])],["PLTE",pal],["IDAT",compress(raw)],["IEND",new Uint8Array()]]){
     let c=new Uint8Array(v.length+4);for(let i=0;i<4;i++)c[i]=t.charCodeAt(i);c.set(v,4);
     chunks.push(Uint8Array.from([...be32(v.length),...c,...be32(crc(c))]))
   }
   let out=new Uint8Array(8+chunks.reduce((s,b)=>s+b.length,0)),p=8;
   out.set([137,80,78,71,13,10,26,10]);
   for(let c of chunks){out.set(c,p);p+=c.length}return out;
 }
 function free(rx,ry,plane){
   let sums=new Uint32Array((W+1)*(H+1)),mask=new Uint8Array(N),S=W+1;
   for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=plane[y*W+x]?1:0;sums[(y+1)*S+x+1]=sums[y*S+x+1]+row}}
   for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let a=x-rx,b=x+rx+1,c=y-ry,d=y+ry+1;
     if(sums[d*S+b]-sums[c*S+b]-sums[d*S+a]+sums[c*S+a]===0)mask[y*W+x]=1}
   return mask;
 }
 function bfs(mask){
   let d=new Int32Array(N),q=new Int32Array(N),h=0,t=1,start=SITES[0][2]*W+SITES[0][1];d.fill(-1);
   if(!mask[start])throw Error("literal Midge spawn obstructed");q[0]=start;d[start]=0;
   while(h<t){let p=q[h++],x=p%W;for(let step of [-W,W,-1,1]){let k=p+step;
     if(k<0||k>=N||(step===-1&&x===0)||(step===1&&x===W-1)||d[k]>=0||!mask[k])continue;
     d[k]=d[p]+1;q[t++]=k}}
   return {dist:d,centres:t};
 }
 function rectangles(plane){let edits=[],old=new Map();for(let y=0;y<H;y++){let now=new Map();
   for(let x=0;x<W;){let m=plane[y*W+x],b=x+1;while(b<W&&plane[y*W+b]===m)b++;
     if(m){let key=x+":"+String(b-x)+":"+m,e=old.get(key);if(e){e[3]++;now.set(key,e)}else{e=[x,y,b-x,1,m];edits.push(e);now.set(key,e)}}
     x=b}old=now}return edits}
 function qualify(){
   for(let k=0;k<50;k++){let s=structural();if(!s.detached)break;
     if(!stitch(s))throw Error("disconnected inert support cannot be rooted: "+s.detached);
     if(k===49)throw Error("structural grounding did not converge");
   }
   let edits=rectangles(g),out=new Uint8Array(N),used=new Uint8Array(N),work=0;
   for(let [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!PAL[m])throw Error("invalid rectangle");
     work+=w*h;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){let k=j*W+i;if(used[k])throw Error("overlapping rectangles");used[k]=1;out[k]=m}}
   for(let k=0;k<N;k++)if(out[k]!==g[k])throw Error("ordered replay differs at cell "+k);
   let s=structural();if(s.detached)throw Error("detached solids "+s.detached);
   let hist={},fluid=0,contacts=0;for(let k=0;k<N;k++){let m=g[k];hist[m]=(hist[m]||0)+1;
     if(m===3||m===8){fluid++;let x=k%W,y=(k/W)|0;if(x===0||y===0||x===W-1||y===H-1)throw Error("liquid on border");
       for(let d of [-W,W,-1,1])if(!g[k+d]||(m===3&&g[k+d]===8)||(m===8&&g[k+d]===3))contacts++}}
   if(contacts)throw Error("uncontained fluid contacts "+contacts);
   let clearance={},base;
   for(let [w,h] of [[19,15],[23,19],[31,27]]){
     let z=bfs(free(w>>1,h>>1,g));
     let lost=SITES.filter(s=>z.dist[s[2]*W+s[1]]<0);
     if(lost.length)throw Error("unreachable "+w+"x"+h+": "+lost.map(s=>s[0]).join(","));
     clearance[w+"x"+h]={reached:SITES.length,centres:z.centres};
     if(w===31)base=z.dist;
   }
   const barrier=[924,0,70,265],blocked=g.slice();
   for(let y=barrier[1];y<barrier[1]+barrier[3];y++)blocked.fill(58,y*W+barrier[0],y*W+barrier[0]+barrier[2]);
   let detours={},forced=0;
   for(let [w,h] of [[19,15],[23,19],[31,27]]){
     let z=bfs(free(w>>1,h>>1,blocked)),lost=SITES.filter(s=>z.dist[s[2]*W+s[1]]<0);
     if(lost.length)throw Error("obstruction prevents return "+w+"x"+h+": "+lost.map(s=>s[0]).join(","));
     if(w===31){for(let site of SITES){let k=site[2]*W+site[1],d=z.dist[k]-base[k];detours[site[0]]=d;if(d>0)forced++}}
   }
   if(!forced)throw Error("obstruction did not force alternate route");
   let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:SITES[0].slice(1),options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:LIQ,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
   let setupText=JSON.stringify(setup);
   if(edits.length>32768||setupText.length>1048576||work>N)throw Error("advertised editor bounds exceeded");
   let imgs={"overview.png":png()};
   for(let [name,x,y,w,h] of CROPS)imgs[name+".png"]=png(x,y,w,h);
   let images={};
   for(let [name,b] of Object.entries(imgs)){
     let crop=name==="overview.png"?[0,0,W,H]:CROPS.find(c=>c[0]+".png"===name).slice(1);
     images[name]={bytes:b.length,sha256:sha(b),crop};
   }
   let receipt={title:"Galen-2 Triple-Loop Catalytic Sorting Yard",seed:SEED,source_repo:"techrote/sandmapsreference",base_main:BASE,engine_readonly:ENGINE,
      extent:[W,H],final_material_cells:N,material_sha256:sha(g),setup_sha256:sha(setupText),setup_bytes:setupText.length,
      rectangle_count:edits.length,work_cells:work,histogram:hist,structural:{total:s.total,grounded:s.grounded,detached:s.detached},
      initial_fluid_cells:fluid,initial_fluid_open_or_mixed_faces:contacts,sites:SITES,clearance,obstruction:{rectangle:barrier,forced_detours:forced,added_steps_at_31x27:detours},
      routes:{main:"outer sky -> asymmetrical exchangers -> central three-loop classifier -> separate quench / scrubber -> dispatch",
        alternative:"upper air -> six separately entered service wells -> lower dry return -> east dispatch",
        interconnects:["reagent sluices","double heat-exchange helix","grounded triple-loop static classifier","two isolated quench specimens","scrubber dispatch gantry"]},
      images,status:"SOURCE-STATIC PASS / NATIVE-UNTESTED"};
   return {g,setupText,receipt,imgs};
 }
}
if(typeof module!=="undefined"&&module.exports){
 module.exports={build};
 if(require.main===module){
   const fs=require("node:fs"),path=require("node:path"),out=process.env.OUT_DIR||__dirname;
   let b=build();if(process.argv.includes("--write")){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"setup.json"),b.setupText);
     fs.writeFileSync(path.join(out,"receipt.json"),JSON.stringify(b.receipt,null,2)+"\n");
     for(let [n,v] of Object.entries(b.imgs))fs.writeFileSync(path.join(out,n),v)}
   if(process.argv.includes("--verify")){for(let [n,v] of [["setup.json",b.setupText],["receipt.json",JSON.stringify(b.receipt,null,2)+"\n"],...Object.entries(b.imgs)])
     if(!fs.readFileSync(path.join(out,n)).equals(Buffer.from(v)))throw Error("committed artifact mismatch "+n)}
   process.stdout.write(JSON.stringify({material_sha256:b.receipt.material_sha256,rectangles:b.receipt.rectangle_count,solid_rooted:b.receipt.structural.grounded,sites:b.receipt.sites.length,fluid:b.receipt.initial_fluid_cells})+"\n");
 }
}