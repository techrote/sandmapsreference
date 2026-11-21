"use strict";
function sha256(input){
 const a=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const n=(a.length+72)&~63,b=new Uint8Array(n);b.set(a);b[a.length]=128;let bits=a.length*8;for(let i=0;i<8;i++){b[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(x,n)=>x>>>n|x<<(32-n);
 for(let o=0;o<n;o+=64){for(let j=0;j<16;j++){let i=o+j*4;w[j]=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;}
 for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rot(p,7)^rot(p,18)^(p>>>3))+w[j-7]+(rot(q,17)^rot(q,19)^(q>>>10)))>>>0;}
 let [A,B,C,D,E,F,G,H]=h;for(let j=0;j<64;j++){let t1=(H+(rot(E,6)^rot(E,11)^rot(E,25))+((E&F)^(~E&G))+K[j]+w[j])>>>0,t2=((rot(A,2)^rot(A,13)^rot(A,22))+((A&B)^(A&C)^(B&C)))>>>0;H=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0;}let v=[A,B,C,D,E,F,G,H];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;}
 return h.map(n=>n.toString(16).padStart(8,"0")).join("");
}
function b64(bytes){const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=[];let s="";for(let i=0;i<bytes.length;i+=3){let x=bytes[i],y=bytes[i+1]||0,z=bytes[i+2]||0;s+=c[x>>2]+c[(x&3)<<4|y>>4]+(i+1<bytes.length?c[(y&15)<<2|z>>6]:"=")+(i+2<bytes.length?c[z&63]:"=");if(s.length>10000){a.push(s);s="";}}return a.join("")+s;}
function png(g,x0,y0,w,h){
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],raw=new Uint8Array(h*(w+1));
 for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*2048+x0,(y+y0)*2048+x0+w),y*(w+1)+1);
 const rev=(v,n)=>{let a=0;while(n--){a=a<<1|v&1;v>>>=1;}return a;};
 function zip(raw){let out=[120,1],bits=0,nb=0;function wr(v,k){bits|=v<<nb;nb+=k;while(nb>=8){out.push(bits&255);bits>>>=8;nb-=8;}}
 function sym(v){let k,x;if(v<=143){x=v+48;k=8;}else if(v<=255){x=v+256;k=9;}else if(v<=279){x=v-256;k=7;}else{x=v-280+192;k=8;}wr(rev(x,k),k);}
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ex=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 wr(3,3);for(let i=0;i<raw.length;){let r=1;while(i+r<raw.length&&r<258&&raw[i]===raw[i+r])r++;if(r>=4&&i>0&&raw[i]===raw[i-1]){let j=0;while(j<28&&lb[j+1]<=r)j++;sym(257+j);if(ex[j])wr(r-lb[j],ex[j]);wr(0,5);i+=r;}else sym(raw[i++]);}
 sym(256);if(nb)out.push(bits&255);let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}out.push(...be((b<<16|a)>>>0));return Uint8Array.from(out);}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set([...name].map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 let pal=new Uint8Array(132*3),cols={0:[8,11,18],49:[95,98,107],58:[119,123,128],62:[126,141,153],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[250,184,86],100:[54,56,61],101:[24,19,32],120:[156,210,220],129:[33,70,110],131:[168,171,177]};
 for(let [k,v] of Object.entries(cols))pal.set(v,Number(k)*3);
 let pieces=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())],b=new Uint8Array(pieces.reduce((n,v)=>n+v.length,0));let off=0;for(let v of pieces){b.set(v,off);off+=v.length;}return b;
}

function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={basalt:100,schist:101,slate:49,steel:62,grate:66,pipe:68,cyan:77,amber:79,glass:120,blue:129,shield:131};
 function R(x,y,w,h,v){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));for(let j=c;j<d;j++)g.fill(v,j*W+a,j*W+b);}
 function L(x,y,X,Y,t,v){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2,rr=r*r;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r+1));j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r+1));i++){let p=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-p*dx)**2+(j-y-p*dy)**2<=rr)g[j*W+i]=v;}}
 function P(a,v){let low=Math.max(0,Math.floor(Math.min(...a.map(p=>p[1])))),high=Math.min(H-1,Math.ceil(Math.max(...a.map(p=>p[1]))));for(let y=low;y<=high;y++){let xs=[];for(let i=0;i<a.length;i++){let p=a[i],q=a[(i+1)%a.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}xs.sort((x,y)=>x-y);for(let k=0;k+1<xs.length;k+=2)R(Math.ceil(xs[k]),y,Math.max(0,Math.floor(xs[k+1])-Math.ceil(xs[k])+1),1,v);}}

 // REEDFALL STAVEWORKS: one long DOWNHILL biofilter cascade. All geometry original.
 P([[0,352],[175,352],[203,405],[350,405],[385,474],[513,474],[542,547],
 [711,547],[741,622],[907,622],[933,693],[1074,693],[1102,764],
 [1286,764],[1312,813],[1509,813],[1544,866],[1730,866],
 [1758,896],[2048,896],[2048,1024],[0,1024]],M.basalt);
 R(0,985,W,39,M.schist);
 for(let y=970;y<984;y+=6)for(let x=28;x<2020;x+=151)R(x,y,74+(x%31),2,M.slate);
 // Parallel underground waste-return trunk, 5 stepped excavated workfaces and six cross-shafts.
 R(30,920,1988,39,0);
 for(let v of [[85,437,271,92],[111,571,270,99],[470,566,275,98],[824,669,264,93],
 [963,795,273,98],[1321,838,267,90],[1741,863,269,96]])R(...v,0);
 for(let v of [[295,334,91,610],[677,483,100,460],[1002,564,117,393],
 [1201,648,102,310],[1515,755,109,204],[1848,784,98,174]])R(...v,0);
 for(let v of [[328,473,118,49],[684,600,144,61],[1054,711,159,45],
 [1223,811,173,49],[1574,849,156,46]])R(...v,0);
 for(let v of [[305,881,1645,34],[391,822,103,96],[786,821,94,99],
 [1124,856,84,70],[1604,840,97,92]])R(...v,0);
 // Nine uneven roofline culture staves, bent supports and anchored load paths.
 for(let [x,y,w] of [[65,340,119],[227,390,133],[396,458,127],[569,527,141],
 [771,608,145],[948,681,113],[1133,750,142],[1342,800,153],[1570,851,165]]) {
 R(x,y,w,9,M.steel);R(x+10,y+9,w-20,4,M.pipe);
 for(let p=x+14;p<x+w-12;p+=27){R(p,y-10,6,10,M.grate);R(p-5,y-14,17,4,M.glass);}
 }
 for(let [x,y,n] of [[118,334,5],[551,517,6],[832,604,4],[1371,788,6],[1663,841,4]])
  for(let i=0;i<n;i++){let u=x+i*22;L(u,y,u+(i%2?7:-5),y-43-(i%3)*8,5,M.grate);
    R(u-6,y-47-(i%3)*8,22,7,i%2?M.cyan:M.glass);}
 // Separate inspection/pressure membranes and inhabited machinery in every lower hall.
 for(let [x,y,w] of [[120,527,195],[504,660,207],[857,761,191],
 [994,890,209],[1352,925,204],[1767,954,188]]){R(x,y,w,8,M.shield);R(x+12,y+8,w-24,4,M.pipe);
 for(let u=x+23;u<x+w-18;u+=47){R(u,y-17,19,17,M.blue);R(u+4,y-22,11,5,M.cyan);}}
 // Lateral fungal transfer cantilever is the focal landmark; not a spore-dam rotor.
 L(857,622,957,430,12,M.shield);L(957,430,1058,376,11,M.shield);
 L(1058,376,1186,414,12,M.shield);L(1186,414,1300,764,12,M.shield);
 L(875,625,970,487,6,M.grate);L(970,487,1165,468,7,M.pipe);
 for(let x of [1000,1043,1086,1129]){L(x,445,x+19,527,6,M.grate);
 R(x+9,526,29,10,M.glass);R(x+15,532,17,7,M.amber);}
 R(1048,368,29,9,M.cyan);R(1169,411,30,8,M.glass);
 // Differentiated occupied ledgers, centrifuge/sieve, quarantine and dispatch stations.
 for(let [x,y,w,h,v] of [[107,514,57,31,M.blue],[194,516,79,19,M.glass],
 [143,651,88,25,M.shield],[269,645,50,20,M.blue],[506,640,66,29,M.glass],
 [621,643,72,24,M.shield],[844,738,81,21,M.blue],[951,740,76,28,M.glass],
 [991,870,83,27,M.shield],[1104,874,87,21,M.blue],[1356,906,63,24,M.glass],
 [1471,907,82,22,M.blue],[1769,942,91,25,M.shield],[1928,941,55,31,M.glass]]) {
 R(x,y-h,w,h,v);R(x+5,y-h-5,w-10,5,M.cyan);}
 for(let x of [510,551,592,633]){L(x,617,x+8,574,7,M.pipe);R(x-5,565,29,12,M.glass);}
 for(let x of [1401,1443,1485]){R(x,879,25,31,M.shield);R(x+6,866,13,13,M.amber);}
 for(let x of [1797,1854,1920]){L(x,910,x+18,850,8,M.slate);R(x+10,845,23,11,M.blue);}
 // Deliberate vacant assembly/breach sockets - incomplete by design.
 for(let [x,y,w] of [[421,402,91],[885,557,113],[1232,701,116],[1612,790,109]]) {
 R(x,y,w,7,M.steel);R(x+8,y-12,16,12,M.amber);}
 // Re-open all full-hull vertical contacts into the dry trunk AFTER assembly placement.
 // These are explicitly entered service clearances, not cosmetic teleports.
 R(30,917,1988,52,0);
 for(let v of [[296,831,88,140],[680,833,93,138],[1003,830,110,141],
 [1205,828,94,141],[1520,825,95,146],[1852,822,91,147]])R(...v,0);
 let tieCount=0;
 function tie(){
  let mark=new Int32Array(N),q=new Int32Array(N),parts=[{edge:true}],edges=new Map();
  for(let i=0;i<N;i++)if(g[i]&&!mark[i]){let id=parts.length,h=0,t=1,edge=false;q[0]=i;mark[i]=id;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!mark[b]){mark[b]=id;q[t++]=b;}}parts.push({edge,count:t});}
  let owner=new Int32Array(N),origin=new Int32Array(N),dist=new Uint16Array(N),qq=new Int32Array(N),h=0,t=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;qq[t++]=i;}
  while(h<t){let a=qq[h++],x=a%W,v=owner[a];for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N){
   if(!owner[b]){owner[b]=v;origin[b]=origin[a];dist[b]=dist[a]+1;qq[t++]=b;}
   else if(owner[b]!==v){let key=Math.min(v,owner[b])+":"+Math.max(v,owner[b]),len=dist[a]+dist[b]+1,z=edges.get(key);if(!z||len<z.len)edges.set(key,{a:origin[a],b:origin[b],oa:v,ob:owner[b],len});}}}
  let parent=new Int32Array(parts.length);for(let i=0;i<parts.length;i++)parent[i]=parts[i].edge?0:i;
  function root(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
  let joins=0,max_span=0;for(let e of [...edges.values()].sort((a,b)=>a.len-b.len)){let a=root(e.oa),b=root(e.ob);if(a===b)continue;L(e.a%W,e.a/W|0,e.b%W,e.b/W|0,4,M.grate);parent[a]=b;joins++;max_span=Math.max(max_span,e.len);}
  for(let i=1;i<parts.length;i++)if(root(i)!==root(0))throw Error("Disconnected rock "+i);
  return {raw_components:parts.length-1,ties:joins,max_span};
 }


 const reconciled=tie();
 const sites={
 "West arrival sky":[71,270],"Seed ledger upper":[175,469],"Registry lower archive":[204,599],
 "West crown grade":[458,362],"Second stave assay":[705,596],"Second filter chamber":[718,589],
 "Dry upper filter return":[733,789],"Stave assembly rim":[798,546],
 "High fungal spool site":[1108,320],"Transfer canopy upper":[1050,293],
 "Transfer loom lower":[1074,711],"Underloom exchange":[1093,832],
 "Sterile side-hatch":[1240,663],"Quarantine flight":[1420,682],
 "Quarantine chamber":[1384,852],"Waste return west":[251,940],
 "Waste return east":[1634,941],"Fourth cascade lip":[1720,739],
 "Outfall survey sky":[1870,742],"Outfall hall":[1889,940],
 "Eastern recovery":[1940,732],"Canopy release vista":[1165,257],
 "Distant dry intake":[121,254],"Damaged reed-hauler":[807,450],
 "Midpass bypass":[1192,938],"Downhill post":[1585,721],
 "East evacuation deck":[2010,806]
 };
 const ties={joins:tieCount+reconciled.ties,max_span:reconciled.max_span};
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N),overlap=0;
 for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let v=g[o+x],s=x;while(x<W&&g[o+x]===v)x++;if(!v)continue;let key=s+":"+(x-s)+":"+v,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,v]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,v] of rect){hist[v]=(hist[v]||0)+w*h;area+=w*h;for(let j=y;j<y+h;j++){for(let i=x;i<x+w;i++)if(replay[j*W+i])overlap++;replay.fill(v,j*W+x,j*W+x+w);}}
 if(rect.length>32768||area>32000000||overlap)throw Error("Rect budget failure "+JSON.stringify({rectangles:rect.length,area,overlap}));
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Rectangle replay failure at "+i);
 let seen=new Uint8Array(N),q=new Int32Array(N),grounded=0,detached=0,components=0;
 for(let i=0;i<N;i++)if(g[i]&&!seen[i]){let h=0,t=1,edge=false;seen[i]=1;q[0]=i;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!seen[b]){seen[b]=1;q[t++]=b;}}components++;if(edge)grounded+=t;else detached+=t;}
 if(detached)throw Error("Unrooted solids "+detached);
 function flood(w,h,box){let stride=W+1,I=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){let solid=g[o+x-1]||(box&&x-1>=box[0]&&x-1<box[2]&&y-1>=box[1]&&y-1<box[3]);row+=solid?1:0;I[y*stride+x]=I[(y-1)*stride+x]+row;}}
 let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N);for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;if(!(I[d*stride+c]-I[d*stride+a]-I[b*stride+c]+I[b*stride+a]))pass[y*W+x]=1;}
 let s=sites["West arrival sky"],i=s[1]*W+s[0],hd=0,tl=0;if(!pass[i])throw Error("Spawn obstructed");queue[tl++]=i;vis[i]=1;
 while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
 let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p}));return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[1076,292,1143,350],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="High fungal spool site")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrival sky"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-crest-seed-ledger",35,294,406,420],["02-stave-biofilter",438,429,407,450],["03-fungal-transfer-loom",822,285,492,618],["04-sterile-quarantine",1286,707,393,265],["05-downhill-outfall",1690,716,355,278]]};
}

function packageFiles(){
 const a=build(),images=[],records=[];
 for(let [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){let bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_FINAL_GRID"});}
 const receipt={project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Mireward Levee Communes",sibling:2,role:"Reedfall Staveworks / Downhill Biofilter Terraces",seed:"mireward-reedfall-staveworks-261121-v1",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",donors:["wide-harrow-mere-spore-dam","wide-graftloom-slipway"],extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,solid_components:a.components,physical_tethers:a.ties,lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,rectangle_work_cells:a.area,setup_bytes:a.json.length,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,midge_full_hull_clearances:a.routes,obstruction:{box:a.box,blocked_site:"High fungal spool site",result:a.obstruction},indexed_images:records,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD"};
 const exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"Mireward Levee Communes",lane:"Xenobiome / Frontier Clusters",map_role:"Sibling 02 — Reedfall Staveworks / Downhill Biofilter Terraces",anchor_donors:["wide-harrow-mere-spore-dam","wide-graftloom-slipway"],macro_topology:["cascade"],density_profile:"Five cliff-rooted descending shelves with dense assay and quarantine hollows amid upper open flight and lower dry service voids",route_grammar:{primary:"Upstream seed ledger to reed assay, fungal transfer, sterile custody and downhill outfall",alternate:"Upper open flight and redundant entered cliff shafts and the continuous deep dry waste return",recovery:"Blocked upper spool point bypassed by open upper route and lower dry trunk"},strong_motifs:["asymmetric downhill filter terraces","continuous dry lower waste trunk","high cantilever fungal transfer loom","entered hollow biological workfaces","separate sterile and dispatch cells"],interesting_relationships:["Each altitude drop corresponds to a distinct biological process step","Cliff-edge apparatus is tied to a single rooted landform","Spool activation landmark is spatially independent of lower recovery"],authoring_affordances:[{site:"Upstream editing grade",point:[458,389],use:"Expandable reed intake"},{site:"Upper spool",point:[1108,320],use:"Destructible high transfer assembly"},{site:"Sterile shelf",point:[1442,875],use:"NPC quarantine threshold"},{site:"Outfall",point:[1889,920],use:"Dry discharge and departure stage"}],setpiece_candidates:[{name:"Spool snap",center:[1108,320],kind:"cantilever failure",exits:"Upper sky and deep return"},{name:"Reed assay startup",center:[588,614],kind:"machinery activation",exits:"Upper ramp and lower service"},{"name":"Sterile exchange",center:[1442,875],kind:"NPC isolation encounter",exits:"Vertical shaft and lower route"},{name:"Outfall pursuit",center:[1889,920],kind:"escape chase",exits:"Cliff rim and dry tunnel"}],procedural_exemplar_value:["Rooted descending biological production sequence","Side-entered service halls beneath unequal shelves","Cantilever load paths with separate recovery topology","Open cliff-edge sockets for SWARM/GENTEK addition"],similarity_avoidance:"Unlike Mireward Sibling 01's five separated island communes joined by short arches, this is a single downhill cliff process sequence with its own high lateral cantilever and connected lower waste route. Different from Underroot's catchment because this is a multi-district biological machinework rather than a seepage/fault basin.",diversity_axes:{macro_topology:["cascade"],altitude_grammar:["multi_strata","high_low_bypass"],density_cadence:["alternating"],route_structure:["layered","branch_rejoin"],landmark_family:["gantry","mixed"],support_form:["cliff_embedded","edge_rooted"],environment_relation:["biological","dry"],incompleteness:["editable_gaps","modular_append_zones"]},geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}};
 const readme="# Mireward Levee Communes — Reedfall Staveworks / Downhill Biofilter Terraces\n\n"+
 "**Original Sibling 02 · 2048×1024 genuine material-cell grid · CREATOR-STATIC-PASS · NATIVE-UNTESTED · OPEN Draft/HOLD.**\n\n"+
 "Five descending bedrock-rooted biofilter shelves: uphill cold-seed ledger, assay/filtration, fungal transfer cantilever, entered sterile quarantine, and downstream byproduct dispatch. Multiple separately entered side-halls, upper flight and a dry lower service trunk serve recovery and authoring. This structural cascade does not reuse Mireward Sibling 01's five island banks/short arches. Intentional editable voids are preserved.\n\n"+
 "**Read-only donors:** [Harrow Mere #64](https://github.com/techrote/sandmapsreference/pull/64), [Graftloom Slipway #22](https://github.com/techrote/sandmapsreference/pull/22). Only material palette and biological industrial culture are inherited, never geometry, pixels, edits, coordinates or district layouts.\n\n"+
 "## Reproducible checks\n\n- "+a.area+" occupied static cells, "+a.grounded+" grounded, zero detached; "+a.rect.length+" legal disjoint Setup-v2 rectangles; "+a.json.length+" JSON bytes. Exactly 2,097,152 cells.\n"+
 "- 19×15, 23×19, 31×27 Midge full-hull routes: "+a.routes.map(r=>r.passed+"/"+r.total).join(", ")+". Literal 31×27 blocked upper spool: "+a.obstruction.passed+"/"+a.obstruction.total+" accessible.\n"+
 "- Grid SHA256 "+receipt.plane_sha256+", Setup SHA256 "+receipt.setup_sha256+". Accepted CyberSand main "+receipt.engine_readonly_main+" read-only; native Workbench/Rapier gameplay, collision, ticks, save/reopen **NATIVE-UNTESTED**. Exact-HEAD independent Art/Technical/Shepherd PENDING.\n"+
 "- `node build.cjs` regenerate; `node build.cjs --verify` byte-compare; actual full image + five true 1:1 native material-index crops derive from same material grid.\n\n## True indexed-material images\n\n![Overview](./overview.png)\n\n"+records.slice(1).map(x=>"!["+x.name+"](./"+x.name+")").join("\n\n")+"\n";
 return {a,images,receipt,exemplar,readme};
}

const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d]of files){let b=typeof d==="string"?Buffer.from(d):Buffer.from(d),p=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Byte mismatch "+name);}else fs.writeFileSync(p,b);}console.log(JSON.stringify({qualification:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),native:"NATIVE-UNTESTED"}));
