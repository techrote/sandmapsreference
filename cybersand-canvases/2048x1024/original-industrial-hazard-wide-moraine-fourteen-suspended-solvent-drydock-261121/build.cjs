'use strict';
// Moraine-14: original suspended-solvent drydock.
// Fixed-seed deterministic authoring. No source images, no historical geometry.
function build(){
 const W=2048,H=1024,N=W*H,SEED=2026112106;
 const BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7";
 const ENGINE="f7e056c9b8791106e22f2d1c295043783d8a9701";
 const PAL={0:[8,19,30],3:[47,127,210],8:[241,78,31],58:[119,123,128],100:[45,60,78],101:[28,39,55],117:[157,182,198],120:[84,185,182]};
 const SITES=[["Arrival",154,216],["Feed upper",244,213],["Feed transfer",240,639],["Feed recovery",237,789],["Fractionator upper",633,215],["Solvent assay",630,640],["Solvent return",627,789],["Suspension crown",1004,214],["Hull transfer",1003,643],["Drydock underside",1090,792],["Keel approach",1191,214],["Quench upper",1493,212],["Quench sample",1495,640],["Quench recovery",1491,788],["Exhaust upper",1828,212],["Exhaust berth",1828,645],["Exhaust recovery",1827,790],["Departure",1910,211]];
 const CROPS=[["01-feed-assay",106,318,380,536],["02-solvent-columns",468,317,375,539],["03-suspended-hull",826,314,500,510],["04-quench-chain",1342,318,363,540],["05-exhaust-dispatch",1703,314,340,553],["06-drydock-pit",745,587,703,283]];
 const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const g=new Uint8Array(N);
 function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1)return;let a=Math.max(0,x),b=Math.min(W,x+w);if(a>=b)return;for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)g.fill(m,j*W+a,j*W+b)}
 function line(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let f=i/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m)}}
 function arc(cx,cy,rx,ry,from,to,t,m){let n=Math.ceil(Math.abs(to-from)*Math.max(rx,ry)/2);for(let i=0;i<=n;i++){let v=from+(to-from)*i/n;rect(cx+rx*Math.cos(v)-t/2,cy+ry*Math.sin(v)-t/2,t,t,m)}}
 function carveEllipse(cx,cy,rx,ry){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let k=(y+.5-cy)/ry;if(Math.abs(k)>=1)continue;let dx=rx*Math.sqrt(1-k*k);rect(cx-dx,y,2*dx,1,0)}}

 // MORAINE-14: author-designed roof-rooted salvage drydock in strict orthographic side view.
 rect(0,0,W,103,100);rect(0,0,92,H,101);rect(1967,0,81,H,100);
 rect(0,882,W,142,100);rect(0,957,W,67,101);
 rect(0,800,445,82,100);rect(1612,812,436,70,100);
 rect(94,844,214,38,58);rect(310,861,220,21,100);
 rect(1504,852,203,30,100);rect(1701,835,231,47,58);
 rect(488,865,157,17,100);rect(1264,862,197,20,100);
 rect(155,103,1772,20,117);rect(178,123,1492,15,58);
 for(let [x,len] of [[192,62],[515,76],[885,94],[1060,82],[1254,93],[1603,86],[1850,65]])rect(x,103,14,len,58);
 line(174,143,361,163,13,117);line(401,155,746,137,15,117);
 line(807,151,1295,154,16,117);line(1362,157,1619,138,11,117);
 line(1644,144,1908,166,13,117);
 for(let [x,y] of [[408,433],[848,510],[1001,461],[1247,499],[1627,436]]){
   rect(x,116,19,y-116,58);rect(x+19,116,7,y-116,117);
 }
 // A: reagent handling, roofed receive bay and grounded transfer workfaces.
 rect(143,472,19,405,58);rect(378,478,19,402,58);
 line(152,477,265,395,16,117);line(265,395,391,480,16,117);
 rect(162,551,105,19,117);rect(270,570,115,16,58);
 rect(180,535,64,15,120);rect(290,538,62,31,100);
 line(205,520,257,470,10,58);line(257,470,340,508,9,58);
 rect(323,606,12,119,117);rect(170,703,48,18,100);
 // B: unequal solvent columns, receiver drums and grounded assay sample casings.
 rect(481,493,18,384,58);rect(788,484,19,393,58);
 rect(516,376,67,196,58);rect(525,393,48,162,100);
 rect(593,419,103,175,58);rect(606,431,79,149,101);
 arc(550,380,54,74,Math.PI,Math.PI*2,12,117);
 arc(645,418,66,74,Math.PI,Math.PI*2,13,117);
 line(488,515,536,508,12,117);line(688,540,792,487,12,117);
 rect(695,557,74,14,117);rect(711,575,15,87,58);
 for(let [x,y,w,h,m] of [[520,515,39,45,3],[715,511,40,55,8]]){
   rect(x-10,y-10,w+20,h+20,58);rect(x,y,w,h,m);
 }
 // C: inverted suspended salvage hull, asymmetrically shaped and dry below.
 line(857,398,901,459,16,117);line(901,459,977,532,18,58);
 line(977,532,1109,562,20,58);line(1109,562,1213,527,20,58);
 line(1213,527,1296,414,17,117);
 rect(882,406,390,18,58);rect(917,424,333,11,117);
 rect(1004,449,196,17,58);rect(1039,468,130,13,117);
 rect(875,104,18,319,58);rect(1103,104,20,348,58);rect(1268,104,18,314,58);
 line(886,358,1030,489,10,117);line(1280,350,1178,496,11,117);
 rect(919,487,18,64,58);rect(1211,485,18,48,58);
 rect(970,527,76,15,117);rect(1124,529,69,13,117);
 rect(855,696,108,13,117);rect(1249,689,116,14,117);
 line(885,690,944,648,12,58);line(1270,688,1338,646,12,58);
 rect(942,691,12,71,58);rect(1271,689,12,72,58);
 // D: three physically isolated quench samples and equipment bypass.
 rect(1356,464,20,403,58);rect(1667,461,18,418,58);
 line(1370,457,1474,389,13,117);line(1474,389,1671,469,12,117);
 rect(1385,501,254,17,117);rect(1400,533,222,13,58);
 for(let [x,y,w,h,m] of [[1379,551,68,53,3],[1541,565,49,45,8],[1606,540,39,66,3]]){
    rect(x-11,y-11,w+22,h+22,58);rect(x,y,w,h,m);
 }
 rect(1432,621,14,130,58);rect(1555,619,15,130,117);
 rect(1400,693,65,13,117);rect(1570,691,61,12,117);
 line(1438,681,1508,663,8,58);line(1508,663,1629,676,8,117);
 // E: uneven exhaust gasometers and outbound salvage transfer.
 rect(1711,496,18,381,58);rect(1943,467,16,415,58);
 arc(1796,470,69,105,Math.PI,Math.PI*2,13,117);
 arc(1895,430,41,76,Math.PI,Math.PI*2,11,58);
 rect(1742,506,14,117,58);rect(1838,490,13,122,58);
 rect(1870,489,12,116,58);rect(1924,457,11,153,117);
 line(1720,530,1800,493,11,117);line(1843,520,1945,480,10,117);
 rect(1739,650,151,14,117);rect(1870,700,52,15,58);
 rect(1761,580,91,19,120);rect(1891,578,38,16,120);
 // Human authoring affordances: lift activation + open dock bay + two annex seams.
 rect(1144,114,13,244,58);rect(1157,143,59,14,117);rect(1172,157,7,126,58);
 rect(661,815,124,15,117);rect(686,836,13,46,58);
 rect(1314,816,102,15,117);rect(1383,837,16,45,58);
 // Independently flyable upper/middle/lower public corridors.
 rect(110,179,1832,75,0);rect(114,615,1828,65,0);rect(119,757,1825,67,0);
 for(let [x,top,bottom] of [[239,255,756],[626,254,756],[1002,254,756],[1190,254,756],[1494,254,757],[1827,254,757]])
    rect(x-36,top,72,bottom-top,0);
 for(let [,x,y] of SITES)rect(x-18,y-16,37,33,0);
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
   const barrier=[960,0,60,270],blocked=g.slice();
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
   let receipt={title:"Moraine-14 Suspended Solvent Drydock",seed:SEED,source_repo:"techrote/sandmapsreference",base_main:BASE,engine_readonly:ENGINE,
      extent:[W,H],final_material_cells:N,material_sha256:sha(g),setup_sha256:sha(setupText),setup_bytes:setupText.length,
      rectangle_count:edits.length,work_cells:work,histogram:hist,structural:{total:s.total,grounded:s.grounded,detached:s.detached},
      initial_fluid_cells:fluid,initial_fluid_open_or_mixed_faces:contacts,sites:SITES,clearance,obstruction:{rectangle:barrier,forced_detours:forced,added_steps_at_31x27:detours},
      routes:{main:"roof-rooted gantry -> six service wells -> suspended drydock and exit",
        alternative:"gantry public air -> cross-access shafts -> lower drydock recovery -> east departure",
        interconnects:["reagent weighbridge","unequal solvent columns","roof-hung drydock hull","three isolated quench cells","dispatch gasometers"]},
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