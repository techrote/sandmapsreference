'use strict';
const TextEncoder=class{encode(s){let out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}};
const W=2048,H=1024,SEED=2026112108,NAME="Ilex-8 Faultline Retort Lifts",BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",ENGINE="f7e056c9b8791106e22f2d1c295043783d8a9701";
const SITES=[["Arrival",62,238],["Manifold canopy",265,239],["Manifold assay",268,558],["Manifold salvage",265,820],["Retort overlook",624,240],["Retort station",622,605],["Retort return",618,816],["West fault edge",817,245],["Fault recovery",969,819],["Spindle overlook",1095,252],["Spindle service",1090,635],["Quench canopy",1472,246],["Quench station",1494,623],["Quench recovery",1501,821],["Exhaust overlook",1838,245],["Exhaust salvage",1857,821],["Extraction",1981,243]];
const CROPS=[["01-manifold",38,308,418,605],["02-retorts",471,324,340,596],["03-fault-spindle",807,316,510,600],["04-quench",1335,320,441,602],["05-exhaust",1780,309,257,602],["06-recovery",707,719,670,205]];
const PAL={"0":[7,19,30],"3":[41,115,211],"8":[248,99,45],"58":[105,122,141],"100":[43,61,80],"101":[30,42,56],"117":[160,186,201],"120":[74,184,191]};
const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
function solids(g){let mask=new Uint8Array(g.length),seen=new Uint8Array(g.length),q=new Int32Array(g.length),h=0,t=0,n=0;for(let p=0;p<g.length;p++)if(g[p]&&g[p]!==3&&g[p]!==8){mask[p]=1;n++}for(let x=0;x<W;x++)for(let p of [x,(H-1)*W+x])if(mask[p]&&!seen[p]){seen[p]=1;q[t++]=p}for(let y=0;y<H;y++)for(let p of [y*W,y*W+W-1])if(mask[p]&&!seen[p]){seen[p]=1;q[t++]=p}while(h<t){let p=q[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v>=0&&v<g.length&&!(d===-1&&x===0)&&!(d===1&&x===W-1)&&mask[v]&&!seen[v]){seen[v]=1;q[t++]=v}}}return {total:n,grounded:t,detached:n-t,mask,seen}}
function material(){
 const g=new Uint8Array(W*H);
 const r=(x,y,w,h,m)=>{x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<=0||h<=0)return;for(let j=Math.max(y,0);j<Math.min(y+h,H);j++)g.fill(m,j*W+Math.max(x,0),j*W+Math.min(x+w,W))};
 const l=(x,y,X,Y,t,m)=>{let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let f=i/n;r(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m)}};
 const a=(cx,cy,rx,ry,from,to,t,m)=>{let n=Math.max(1,Math.ceil(Math.abs(to-from)*Math.max(rx,ry)/2));for(let i=0;i<=n;i++){let v=from+(to-from)*i/n;r(cx+rx*Math.cos(v)-t/2,cy+ry*Math.sin(v)-t/2,t,t,m)}};
 // Faultline section: distinct anchored industrial terraces separated by a deep open throat.
 r(0,931,W,93,100);r(0,923,W,8,58);r(0,985,W,39,101);
 for(let i=0;i<8;i++){r(i*20,808+i*12,19,123-i*12,100);r(2048-(i+1)*22,805+i*14,21,126-i*14,101)}
 l(0,818,160,870,14,100);l(160,870,435,922,11,100);
 l(1595,922,1870,882,12,101);l(1870,882,2047,801,14,101);
 // A: asymmetric entered pressure manifold on two working storeys.
 r(95,461,18,462,58);r(410,483,18,440,58);
 l(94,462,161,358,15,58);l(161,358,289,382,14,58);
 l(289,382,352,334,14,58);l(352,334,431,485,17,58);
 r(111,627,302,13,117);r(125,765,282,13,58);r(126,875,278,13,117);
 l(105,471,151,536,8,117);l(419,497,385,554,8,117);
 r(135,574,62,51,100);r(146,559,39,14,120);
 r(234,586,59,38,58);r(242,572,43,13,117);
 r(333,577,47,48,100);r(344,565,28,13,120);
 l(150,735,207,716,8,117);l(207,716,365,744,8,117);
 // B: two offset retort cassettes, staggered work decks, cliff-bearing stems.
 r(482,488,20,435,58);r(782,492,18,431,58);
 l(477,483,531,396,17,58);l(531,396,629,421,13,58);
 l(629,421,729,374,15,58);l(729,374,804,489,17,58);
 r(498,648,287,14,117);r(501,771,279,12,58);r(504,868,276,13,117);
 for(let [cx,cy,rx,ry] of [[554,486,31,61],[697,472,40,72]]){
   a(cx,cy,rx,ry,Math.PI,2*Math.PI,9,117);r(cx-rx,cy,12,65,58);r(cx+rx-12,cy,12,65,58)
 }
 r(526,598,65,47,100);r(539,586,39,12,120);
 r(661,603,88,40,58);r(670,587,58,13,117);
 l(502,694,569,680,8,117);l(569,680,716,706,8,117);
 // C: faultside suspension: unequal splay props and an open vertical spindle.
 r(893,876,300,13,117);r(927,902,225,12,58);
 r(935,728,17,195,58);r(1212,719,18,204,58);
 l(941,729,1001,610,12,58);l(1220,729,1158,602,12,58);
 a(1088,502,95,130,Math.PI*1.02,Math.PI*1.98,12,58);
 r(997,585,189,12,117);r(1016,716,153,12,58);
 r(998,449,13,144,58);r(1175,439,13,154,58);
 r(1021,548,51,33,100);r(1032,537,29,13,120);
 r(1114,550,37,30,58);r(1121,539,22,11,117);
 l(807,461,899,439,10,117);l(899,439,948,460,10,117);
 l(1228,459,1315,431,10,117);l(1315,431,1356,450,10,117);
 // D: cliff-quench court: visibly different sealed drums + dry bypass mezzanine.
 r(1356,478,20,445,58);r(1742,497,20,426,58);
 l(1344,477,1401,400,16,58);l(1401,400,1529,433,15,58);
 l(1529,433,1593,381,17,58);l(1593,381,1763,493,17,58);
 r(1371,651,378,14,117);r(1384,774,364,13,58);r(1381,873,365,13,117);
 r(1398,556,82,91,58);r(1411,567,54,60,100);
 r(1512,567,92,80,58);r(1526,577,65,53,100);
 r(1636,540,83,107,58);r(1649,551,58,77,100);
 l(1480,600,1512,611,9,117);l(1604,606,1637,582,9,117);
 r(1404,722,62,49,100);r(1415,710,40,13,120);
 r(1620,726,89,45,58);r(1633,713,62,12,117);
 // E: tall asymmetric exhaust works and dry personnel extraction.
 r(1790,481,18,442,58);r(2015,438,17,485,58);
 l(1780,481,1831,382,14,58);l(1831,382,1917,403,14,58);
 l(1917,403,1968,334,14,58);l(1968,334,2033,439,16,58);
 r(1807,625,220,13,117);r(1814,780,212,12,58);r(1816,878,209,13,117);
 r(1909,446,35,174,58);r(1919,454,14,152,100);
 a(1876,521,48,63,Math.PI,2*Math.PI,9,117);
 r(1836,582,72,37,100);r(1852,568,47,13,120);
 r(1832,733,64,43,100);r(1842,720,43,13,117);
 l(1808,673,1851,694,8,117);l(1851,694,1962,683,8,117);
 // Grounded visible process handoffs and load-bearing stools: no decorative floating console plates.
 for(let [x,y,w,h] of [[157,619,9,13],[257,620,10,12],[351,620,10,14],[118,761,19,16],[398,760,13,19],[136,867,10,11],[549,636,10,17],[701,638,10,16],[499,864,15,17],[1418,644,11,16],[1552,642,10,16],[1681,643,11,15],[1429,765,11,14],[1652,769,10,9],[1382,866,11,11],[1869,614,10,15],[1921,614,10,15],[1850,774,9,12]])r(x,y,w,h,58);
 l(805,463,792,493,9,58);l(1228,458,1209,518,9,58);
 l(938,727,889,918,10,58);
 // Sealed test samples: inert casing is rooted; fluids cannot initially spill.
 for(let [x,y,w,h,m] of [[334,678,39,38,3],[680,696,48,42,8],[1643,680,41,40,3]]){
   r(x-8,y-8,w+16,h+16,58);r(x,y,w,h,m)
 }
 // Genuine tectonic walls, asymmetric and floor-rooted: the fault mouth is the traversable void between them.
 r(863,704,66,219,100);r(878,650,51,60,100);
 l(872,653,907,610,13,100);l(907,610,930,672,11,100);
 for(let i=0;i<5;i++)r(864+i*12,718+i*34,10,202-i*34,101);
 r(1226,739,52,184,101);r(1244,684,34,61,101);
 l(1258,680,1237,623,12,101);l(1237,623,1223,679,9,101);
 for(let i=0;i<5;i++)r(1229+i*9,754+i*30,8,167-i*30,100);
 // Four open public vertical service throats (the side passages below join entered districts).
 for(let [x,y,w,h] of [[432,320,43,602],[814,327,47,595],[1280,326,51,596],[1766,327,40,595]])r(x,y,w,h,0);
 // Entered dry service galleries: actual 47-cell high walk/fly openings, not marker substitutions.
 for(let [x,y,w,h] of [
 [256,536,194,47],[255,798,196,47],
 [617,582,214,52],[614,795,217,51],
 [927,797,75,51],[930,613,181,51],
 [1265,599,246,53],[1265,800,265,48],
 [1767,792,107,50]
 ])r(x,y,w,h,0);
 // Reproduce and protect the exact named Midge centre envelopes.
 for(let [,x,y] of SITES)r(x-23,y-20,46,40,0);
 // All solids must be boundary-rooted; extend small disconnected struts without altering site centres.
 const reserved=[[432,320,43,602],[814,327,47,595],[1280,326,51,596],[1766,327,40,595],[256,536,194,47],[255,798,196,47],[617,582,214,52],[614,795,217,51],[927,797,75,51],[930,613,181,51],[1265,599,246,53],[1265,800,265,48],[1767,792,107,50]];
 const barred=(x,y)=>SITES.some(s=>Math.abs(s[1]-x)<28&&Math.abs(s[2]-y)<26)||reserved.some(([a,b,w,h])=>x>=a-4&&x<a+w+4&&y>=b-4&&y<b+h+4);
 function stitch(c){
   const prev=new Int32Array(g.length);prev.fill(-1);
   const q=new Int32Array(g.length);let h=0,t=0,last=-1;
   for(let p=0;p<g.length;p++)if(c.mask[p]&&!c.seen[p]){
     const x=p%W,y=(p/W)|0;
     if(!barred(x,y)){prev[p]=p;q[t++]=p}
   }
   while(h<t){
     const p=q[h++],x=p%W,y=(p/W)|0;
     for(let d of [-W,W,-1,1]){
       const v=p+d,nx=v%W,ny=(v/W)|0;
       if(v<0||v>=g.length||(d===-1&&x===0)||(d===1&&x===W-1))continue;
       if(c.seen[v]){last=p;h=t;break}
       if(prev[v]>=0||barred(nx,ny))continue;
       prev[v]=p;q[t++]=v;
     }
   }
   if(last<0)return false;
   for(let p=last;prev[p]!==p;p=prev[p])if(!g[p])g[p]=58;
   return true;
 }
 for(let n=0;n<80;n++){
   let c=solids(g);if(!c.detached)break;
   if(!stitch(c)){
     if(c.detached>400)throw Error("structural tie unavailable "+c.detached);
     for(let p=0;p<g.length;p++)if(c.mask[p]&&!c.seen[p])g[p]=0;
   }
   if(n===79)throw Error("rooting did not converge");
 }
 for(let [,x,y] of SITES)r(x-23,y-20,46,40,0);
 return g;
}
function rectangles(g){let out=[],active=new Map();for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],b=x+1;while(b<W&&g[y*W+b]===m)b++;if(m){let k=x+":"+String(b-x)+":"+m,o=active.get(k);if(o){o[3]++;next.set(k,o)}else{o=[x,y,b-x,1,m];out.push(o);next.set(k,o)}}x=b}active=next}return out}
function free(g,rx,ry){let p=new Uint32Array((W+1)*(H+1)),o=new Uint8Array(g.length),S=W+1;for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=g[y*W+x]?1:0;p[(y+1)*S+x+1]=p[y*S+x+1]+row}}for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let a=x-rx,b=x+rx+1,c=y-ry,d=y+ry+1;if(p[d*S+b]-p[c*S+b]-p[d*S+a]+p[c*S+a]===0)o[y*W+x]=1}return o}
function bfs(mask,start){let dist=new Int32Array(W*H),q=new Int32Array(W*H),h=0,t=1,s=start[1]*W+start[0];dist.fill(-1);if(!mask[s])throw Error("original spawn blocked");q[0]=s;dist[s]=0;while(h<t){let p=q[h++],x=p%W;for(let d of [-W,W,-1,1]){let v=p+d;if(v<0||v>=mask.length||(d===-1&&x===0)||(d===1&&x===W-1)||dist[v]>=0||!mask[v])continue;dist[v]=dist[p]+1;q[t++]=v}}return {dist,visited:t}}
function sha(a){a=typeof a==="string"?new TextEncoder().encode(a):a;let K=[],HH=[];for(let n=2;K.length<64;n++){let prime=true;for(let j=2;j*j<=n;j++)if(n%j===0){prime=false;break}if(prime)K.push(Math.floor((n**(1/3)%1)*4294967296)>>>0)}for(let n=2;HH.length<8;n++){let prime=true;for(let j=2;j*j<=n;j++)if(n%j===0){prime=false;break}if(prime)HH.push(Math.floor((Math.sqrt(n)%1)*4294967296)>>>0)}let L=a.length,T=Math.ceil((L+9)/64)*64,b=new Uint8Array(T);b.set(a);b[L]=128;for(let i=0;i<8;i++)b[T-1-i]=Math.floor(L*8/2**(8*i))&255;const R=(x,k)=>(x>>>k)|(x<<(32-k));for(let z=0;z<T;z+=64){let w=new Uint32Array(64);for(let j=0;j<16;j++){let k=z+j*4;w[j]=((b[k]<<24)|(b[k+1]<<16)|(b[k+2]<<8)|b[k+3])>>>0}for(let j=16;j<64;j++){let x=w[j-15],y=w[j-2];w[j]=(w[j-16]+(R(x,7)^R(x,18)^(x>>>3))+w[j-7]+(R(y,17)^R(y,19)^(y>>>10)))>>>0}let [A,B,C,D,E,F,G,I]=HH;for(let j=0;j<64;j++){let t1=(I+(R(E,6)^R(E,11)^R(E,25))+((E&F)^((~E)&G))+K[j]+w[j])>>>0,t2=((R(A,2)^R(A,13)^R(A,22))+((A&B)^(A&C)^(B&C)))>>>0;I=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}for(let [i,v] of [A,B,C,D,E,F,G,I].entries())HH[i]=(HH[i]+v)>>>0}return HH.map(v=>v.toString(16).padStart(8,"0")).join("")}
function validate(g,rr){let replay=new Uint8Array(g.length),taken=new Uint8Array(g.length),work=0;for(let [x,y,w,h,m] of rr){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!PAL[m])throw Error("illegal rectangle");work+=w*h;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){let k=j*W+i;if(taken[k])throw Error("record overlap");taken[k]=1;replay[k]=m}}for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("record/grid mismatch");let c=solids(g);if(c.detached)throw Error("ungrounded "+c.detached);let hist={},fl=0;for(let i=0;i<g.length;i++){let m=g[i];hist[m]=(hist[m]||0)+1;if(m===3||m===8){fl++;let x=i%W,y=(i/W)|0;if(!x||x===W-1||!y||y===H-1)throw Error("fluid border");for(let d of [-W,W,-1,1])if(!g[i+d]||(m===3&&g[i+d]===8)||(m===8&&g[i+d]===3))throw Error("fluid-to-air "+i)}}let reach={},base;for(let [w,h] of [[19,15],[23,19],[31,27]]){let f=bfs(free(g,w>>1,h>>1),SITES[0].slice(1)),lost=SITES.filter(s=>f.dist[s[2]*W+s[1]]<0);if(lost.length)throw Error("unreachable "+w+"x"+h+": "+lost.map(s=>s[0]).join("|"));reach[w+"x"+h]={sites:SITES.length,centres:f.visited};if(w===31)base=f.dist}const box=[926,0,62,355],gg=g.slice();for(let y=0;y<box[3];y++)gg.fill(58,y*W+box[0],y*W+box[0]+box[2]);let alt=bfs(free(gg,15,13),SITES[0].slice(1)),lost=SITES.filter(s=>alt.dist[s[2]*W+s[1]]<0);if(lost.length)throw Error("obstructed loss "+lost.map(s=>s[0]).join("|"));let det=SITES.map(s=>({name:s[0],added:alt.dist[s[2]*W+s[1]]-base[s[2]*W+s[1]],original:base[s[2]*W+s[1]],obstructed:alt.dist[s[2]*W+s[1]]}));if(!det.some(x=>x.added>0))throw Error("no forced detour");return {work,ground:{total:c.total,grounded:c.grounded,detached:c.detached},hist,fluid:fl,reach,alternate:{obstruction:box,sites:SITES.length,detours:det}}}
function crc(a){let c=-1;for(let x of a){c^=x;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}
function be32(x){return[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255]}
function zlib(a){let bases=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ext=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],out=[120,1],bits=0,n=0;const put=(v,w)=>{bits|=v<<n;n+=w;while(n>=8){out.push(bits&255);bits>>>=8;n-=8}},rev=(v,w)=>{let k=0;for(let i=0;i<w;i++){k=(k<<1)|(v&1);v>>>=1}return k},emit=x=>{let c,w;if(x<=143){c=48+x;w=8}else if(x<=255){c=400+x-144;w=9}else if(x<=279){c=x-256;w=7}else{c=192+x-280;w=8}put(rev(c,w),w)};put(3,3);for(let i=0;i<a.length;){let z=0;if(i>0&&a[i]===a[i-1])while(i+z<a.length&&a[i+z]===a[i-1]&&z<258)z++;if(z>=3){let j=28;while(j>0&&(z<bases[j]||z>bases[j]+(2**ext[j]-1)))j--;emit(257+j);if(ext[j])put(z-bases[j],ext[j]);put(0,5);i+=z}else{emit(a[i]);i++}}emit(256);if(n)out.push(bits&255);let u=1,v=0;for(let x of a){u=(u+x)%65521;v=(v+u)%65521}out.push((v>>>8)&255,v&255,(u>>>8)&255,u&255);return Uint8Array.from(out)}
function png(g,x=0,y=0,w=W,h=H){let data=new Uint8Array((w+1)*h);for(let j=0;j<h;j++){let off=j*(w+1);data[off]=2;for(let i=0;i<w;i++)data[off+i+1]=(g[(y+j)*W+x+i]-(j?g[(y+j-1)*W+x+i]:0)+256)&255}let p=new Uint8Array(768);for(let i=0;i<256;i++)p.set(PAL[i]||[0,0,0],3*i);let chunks=[];for(let [type,buf] of [["IHDR",Uint8Array.from([...be32(w),...be32(h),8,3,0,0,0])],["PLTE",p],["IDAT",zlib(data)],["IEND",new Uint8Array()]]){let c=new Uint8Array(buf.length+4);for(let i=0;i<4;i++)c[i]=type.charCodeAt(i);c.set(buf,4);chunks.push(Uint8Array.from([...be32(buf.length),...c,...be32(crc(c))]))}let out=new Uint8Array(8+chunks.reduce((s,b)=>s+b.length,0));out.set([137,80,78,71,13,10,26,10]);let k=8;for(let c of chunks){out.set(c,k);k+=c.length}return out}
function b64(a){let s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=[];for(let i=0;i<a.length;i+=3){let x=a[i],y=i+1<a.length?a[i+1]:0,z=i+2<a.length?a[i+2]:0;o.push(s[x>>2],s[((x&3)<<4)|(y>>4)],i+1<a.length?s[((y&15)<<2)|(z>>6)]:"=",i+2<a.length?s[z&63]:"=")}return o.join("")}
function build(){let g=material(),edits=rectangles(g),v=validate(g,edits),setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:SITES[0].slice(1),options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:LIQ,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup);if(edits.length>32768||new TextEncoder().encode(json).length>1048576)throw Error("Setup-v2 limit");let imgs={"overview.png":png(g)};for(let [n,x,y,w,h] of CROPS)imgs[n+".png"]=png(g,x,y,w,h);let receipt={title:NAME,seed:SEED,canvas_main:BASE,engine_main_readonly:ENGINE,source_grid_dimensions:[W,H],final_material_cells:g.length,material_sha256:sha(g),setup_sha256:sha(json),setup_bytes:json.length,rectangles:edits.length,work_cells:v.work,histogram:v.hist,solids:v.ground,fluid_cells:v.fluid,clearance:v.reach,obstruction:v.alternate,sites:SITES,images:Object.fromEntries(Object.entries(imgs).map(([n,b])=>[n,{bytes:b.length,sha256:sha(b),crop:n==="overview.png"?[0,0,W,H]:CROPS.find(c=>c[0]+".png"===n).slice(1)}])),status:"CREATOR-STATIC PASS / NATIVE-UNTESTED"};return {g,json,imgs,receipt}}
const fs=require('node:fs'),path=require('node:path'),z=require('node:zlib'),b=build(),dir=process.env.OUT_DIR||__dirname;
if(process.argv.includes('--write')){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'setup.json'),b.json);fs.writeFileSync(path.join(dir,'receipt.json'),JSON.stringify(b.receipt,null,2)+'\n');for(let [n,img] of Object.entries(b.imgs))fs.writeFileSync(path.join(dir,n),img)}
if(process.argv.includes('--verify')){for(let [n,v] of [['setup.json',b.json],['receipt.json',JSON.stringify(b.receipt,null,2)+'\n'],...Object.entries(b.imgs)])if(!fs.readFileSync(path.join(dir,n)).equals(Buffer.from(v)))throw Error('byte mismatch '+n);for(let [n,img] of Object.entries(b.imgs)){let p=8,idats=[];while(p<img.length){let len=((img[p]<<24)|(img[p+1]<<16)|(img[p+2]<<8)|img[p+3])>>>0,type=Buffer.from(img.slice(p+4,p+8)).toString('ascii'),data=img.slice(p+8,p+8+len),full=img.slice(p+4,p+8+len),c=((img[p+8+len]<<24)|(img[p+9+len]<<16)|(img[p+10+len]<<8)|img[p+11+len])>>>0;if(crc(full)!==c)throw Error('PNG CRC '+n);if(type==='IDAT')idats.push(Buffer.from(data));p+=len+12}let plane=z.inflateSync(Buffer.concat(idats)),[x,y,w,h]=b.receipt.images[n].crop,prior=new Uint8Array(w);if(plane.length!==(w+1)*h)throw Error('PNG extent');for(let j=0;j<h;j++){if(plane[j*(w+1)]!==2)throw Error('PNG filter');let row=new Uint8Array(w);for(let i=0;i<w;i++){row[i]=(plane[j*(w+1)+i+1]+prior[i])&255;if(row[i]!==b.g[(y+j)*W+x+i])throw Error('PNG cell parity '+n)}prior=row}}}
console.log(JSON.stringify({result:'PASS',material_sha256:b.receipt.material_sha256,rectangles:b.receipt.rectangles}));
