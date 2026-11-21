'use strict';
// Tern-5: independent 2048x1024 orthographic industrial process excavation.
// Fixed-seed deterministic authoring. No source images, no historical geometry.
function build(){
 const W=2048,H=1024,N=W*H,SEED=2026112105;
 const BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7";
 const ENGINE="f7e056c9b8791106e22f2d1c295043783d8a9701";
 const PAL={0:[8,19,30],3:[47,127,210],8:[241,78,31],58:[119,123,128],100:[45,60,78],101:[28,39,55],117:[157,182,198],120:[84,185,182]};
 const SITES=[["Arrival",66,242],["West hoist",236,275],["Ore assay",237,617],["Ore recovery",235,837],["Pressure bell overlook",632,265],["Bell inspection",633,617],["Bell recovery",631,839],["Winding head",1035,255],["Equalizer service",1035,619],["Deep transfer",1033,836],["Quench lookout",1448,265],["Quench inspection",1447,625],["Quench recovery",1446,838],["Exhaust approach",1863,262],["Exhaust scrubber",1862,627],["Exhaust return",1861,840],["Extraction",1979,246]];
 const CROPS=[["01-ore-receiver",40,315,405,606],["02-pressure-bells",463,313,428,600],["03-equalizer-headshaft",888,282,411,645],["04-quench-cell",1295,315,430,605],["05-exhaust-clarifier",1710,311,330,614],["06-deep-recovery",410,790,1258,133]];
 const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const g=new Uint8Array(N);
 function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1)return;let a=Math.max(0,x),b=Math.min(W,x+w);if(a>=b)return;for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)g.fill(m,j*W+a,j*W+b)}
 function line(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let f=i/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m)}}
 function arc(cx,cy,rx,ry,from,to,t,m){let n=Math.ceil(Math.abs(to-from)*Math.max(rx,ry)/2);for(let i=0;i<=n;i++){let v=from+(to-from)*i/n;rect(cx+rx*Math.cos(v)-t/2,cy+ry*Math.sin(v)-t/2,t,t,m)}}
 function carveEllipse(cx,cy,rx,ry){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let k=(y+.5-cy)/ry;if(Math.abs(k)>=1)continue;let dx=rx*Math.sqrt(1-k*k);rect(cx-dx,y,2*dx,1,0)}}
 // Physical terrain: one contiguous salt-basalt vault with asymmetrically notched roof.
 // Distinct from prior open-frame linear process, crater, fault and cableway exemplars.
 rect(0,450,W,574,100);rect(0,949,W,75,101);
 for(let x=0;x<W;x+=4){
   let shelf=437+Math.round(19*Math.sin(x/132)+9*Math.sin(x/39));
   if(x>820&&x<1300)shelf+=48;
   if(x>1630)shelf-=17;
   rect(x,shelf,4,451-shelf,100);
 }
 // Geologically embedded five-cavern complex with internal route interconnects.
 for(let a of [[244,632,185,166],[658,626,219,178],[1051,628,183,194],[1470,643,196,169],[1870,638,159,176]])carveEllipse(...a);
 // Distinct satellite inspection chambers: deliberately unfilled authoring voids.
 for(let a of [[380,760,62,67],[829,751,58,62],[1170,764,77,57],[1624,766,65,62]])carveEllipse(...a);
 // Main dry process transfer and independent low-level escape/recovery.
 rect(78,617,1910,64,0);rect(72,818,1925,70,0);
 // Five naturally large exterior-to-interior vertical access shafts (52-86 wide).
 for(let a of [[202,235,77,647],[607,231,82,653],[1002,219,78,661],[1410,235,79,647],[1827,233,74,652]])rect(...a,0);
 // Thick sidewall inter-cavern door reveals, two elevations; real 4-neighbour openings.
 for(let x of [448,885,1272,1709]){rect(x-27,616,72,69,0);rect(x-28,818,72,70,0)}
 // Secondary dry maze through lower chambers, feeding back to main shafts.
 for(let x of [340,764,1210,1660])rect(x,704,48,153,0);
 // Five high-visible, differently anchored surface silhouettes.
 // A: ore tipping hoist, cantilever loaded west, supported in geological shoulder.
 rect(112,344,16,135,58);rect(371,374,16,113,58);
 line(110,342,204,297,12,117);line(204,297,384,373,11,117);
 line(138,352,206,413,8,58);line(206,413,370,389,8,58);
 rect(149,396,93,21,117);rect(164,404,12,52,58);
 // B: unequal pressure-bell pair, exposed upper domes and buried foundations.
 arc(549,478,77,95,Math.PI,Math.PI*2,12,58);
 arc(775,451,54,82,Math.PI,Math.PI*2,11,117);
 rect(474,454,15,56,58);rect(610,460,15,57,58);
 rect(720,444,13,61,117);rect(821,446,14,65,58);
 line(485,474,518,544,10,117);line(815,461,786,543,10,117);
 // C: narrow central two-sided winding derrick, split rotor crown.
 rect(970,289,15,188,58);rect(1110,286,14,191,58);
 line(977,291,1045,219,14,117);line(1045,219,1122,290,14,117);
 arc(1045,295,66,74,Math.PI,Math.PI*2,10,58);
 line(986,366,1036,399,9,117);line(1036,399,1114,354,9,117);
 // D: three staggered heat exchanger caps with distinct plumbing hierarchy.
 rect(1336,394,13,100,58);rect(1588,370,13,120,58);
 line(1342,394,1411,327,14,117);line(1411,327,1488,369,11,117);
 line(1488,369,1541,308,13,117);line(1541,308,1597,375,13,117);
 line(1354,450,1585,454,8,117);
 // E: asymmetric twin draught stacks and a high-intensity filter box.
 rect(1749,335,30,171,58);rect(1972,259,28,230,58);
 rect(1757,326,13,144,101);rect(1980,266,12,180,101);
 line(1749,394,1875,385,12,117);line(1875,385,1987,378,12,117);
 rect(1804,435,153,19,58);
 // Deep process A: four unequal ore assay, scale and ore-waste workfaces.
 rect(126,705,31,213,58);rect(364,739,27,180,58);
 rect(148,750,95,14,117);rect(268,772,99,13,117);
 rect(160,710,55,39,100);rect(169,698,37,13,120);
 rect(288,730,62,40,58);rect(299,718,41,14,117);
 line(158,711,233,704,9,117);line(233,704,307,735,9,117);
 rect(352,755,10,50,58);
 // Deep process B: two giant nonmatching pressure vessels, rooted on ledges.
 // Their actual material shells are inert; these are not simulated compressors.
 rect(509,737,18,180,58);rect(843,739,18,181,58);
 arc(567,710,46,84,Math.PI,Math.PI*2,12,117);
 arc(779,715,54,104,Math.PI,Math.PI*2,10,58);
 rect(522,712,16,99,58);rect(599,706,16,104,58);
 rect(722,707,15,105,58);rect(817,705,15,106,117);
 rect(527,806,88,13,117);rect(728,809,104,12,117);
 line(532,747,603,752,8,117);line(730,750,818,748,8,117);
 rect(551,722,49,22,100);rect(738,731,57,21,100);
 // C: central equalizer spoke wheel, eccentric low salvage hopper and support struts.
 rect(932,738,24,180,58);rect(1158,744,21,173,58);
 arc(1052,712,101,98,Math.PI*1.06,Math.PI*1.94,12,117);
 line(955,740,1034,705,11,117);line(1034,705,1169,748,11,117);
 rect(974,750,63,15,58);rect(1087,747,52,14,58);
 rect(980,764,14,46,58);rect(1116,760,13,48,58);
 // D: three enclosed chemically isolated quench bulbs, lower dry sample stations.
 rect(1313,738,23,180,58);rect(1690,733,21,185,58);
 for(let a of [[1337,733,84,77,3],[1506,745,71,68,8],[1607,713,62,95,3]]){
   let [x,y,w,h,m]=a;rect(x-9,y-9,w+18,h+18,58);rect(x,y,w,h,m)
 }
 // Dedicated supports from sealed casings to the main anchored geologic body.
 rect(1363,800,15,117,58);rect(1530,807,15,110,58);rect(1630,809,15,108,58);
 rect(1380,710,32,14,117);rect(1487,698,46,12,117);rect(1655,686,28,12,117);
 line(1335,713,1387,692,9,58);line(1580,698,1631,682,9,117);
 // E: double-louver clarifier and editable empty auxiliary gallery.
 rect(1758,743,19,179,58);rect(2009,754,17,166,58);
 arc(1867,728,112,86,Math.PI*1.04,Math.PI*1.96,12,117);
 rect(1792,758,48,15,58);rect(1904,771,77,15,117);
 rect(1799,775,13,52,58);rect(1952,783,14,42,58);
 for(let i=0;i<5;i++)line(1782+i*29,693,1815+i*29,722,7,117);
 rect(1801,731,49,13,120);rect(1928,745,35,11,120);
 // Small low-damage connection seams: intentional human editing / setpiece sites.
 rect(427,736,19,33,101);rect(1263,742,18,39,101);
 rect(1680,713,13,29,101);
 // Open uninterrupted real service shafts after machinery has been installed.
 // These are deliberate maintenance voids, not substituted waypoint positions.
 for(let a of [[211,487,58,401],[614,482,65,406],[1008,480,54,408],[1425,491,60,396],[1833,480,62,409]])rect(...a,0);
 // A split headshaft portal gives the central winding-room lookout access from the public sky.
 rect(959,326,54,78,0);
 // Preserve exact named conservative envelope at every literal checkpoint.
 for(let [,x,y] of SITES)rect(x-17,y-15,35,31,0);
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
   const barrier=[895,0,79,438],blocked=g.slice();
   for(let y=0;y<barrier[3];y++)blocked.fill(58,y*W+barrier[0],y*W+barrier[0]+barrier[2]);
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
   let receipt={title:"Tern-5 Buried Pressure Bellworks",seed:SEED,source_repo:"techrote/sandmapsreference",base_main:BASE,engine_readonly:ENGINE,
      extent:[W,H],final_material_cells:N,material_sha256:sha(g),setup_sha256:sha(setupText),setup_bytes:setupText.length,
      rectangle_count:edits.length,work_cells:work,histogram:hist,structural:{total:s.total,grounded:s.grounded,detached:s.detached},
      initial_fluid_cells:fluid,initial_fluid_open_or_mixed_faces:contacts,sites:SITES,clearance,obstruction:{rectangle:barrier,forced_detours:forced,added_steps_at_31x27:detours},
      routes:{main:"high dry airway -> five vertical portals -> mid-process transfer -> extraction",
        alternative:"five portals -> lower lateral recovery gallery -> rejoin east exit",
        interconnects:["west ore assay","twin pressure bells","central winding equalizer","quench vessels","exhaust clarifier"]},
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