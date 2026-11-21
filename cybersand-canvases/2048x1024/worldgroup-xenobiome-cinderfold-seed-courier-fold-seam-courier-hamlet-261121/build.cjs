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





 // NEW original Cinderfold district cell-geometry, not a donor template.
 let rng=0xc1de7011;function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 R(0,855,W,169,M.basalt);R(0,1002,W,22,M.schist);
 for(let x=0;x<W;x+=71)R(x,848+Math.floor(rand()*7),53,7,M.schist);
 P([[0,855],[0,797],[96,787],[224,824],[403,835],[507,855]],M.basalt);
 P([[579,855],[630,820],[782,811],[932,855]],M.basalt);
 P([[1015,855],[1141,829],[1278,825],[1468,855]],M.basalt);
 P([[1495,855],[1660,826],[1821,832],[1956,827],[2047,807],[2047,855]],M.basalt);
 // A short dry rescue return has three full-hull shafts and two rejoin choices.
 R(352,923,1320,60,0);R(355,986,1318,8,M.schist);
 for(let [x,y,w]of [[402,780,80],[994,782,81],[1560,781,80]])R(x,y,w,986-y,0);
 // Four genuinely different roof-gables, proportions, occupied workfaces and altitudes.
 const blocks=[
 {x:96,w:415,roof:[[96,563],[216,521],[352,552],[511,579]],floor:820,steel:M.shield},
 {x:565,w:443,roof:[[565,481],[705,395],[847,436],[1008,474]],floor:826,steel:M.steel},
 {x:1045,w:408,roof:[[1045,563],[1158,506],[1314,541],[1453,509]],floor:833,steel:M.shield},
 {x:1514,w:440,roof:[[1514,555],[1627,485],[1740,510],[1858,473],[1954,552]],floor:831,steel:M.steel}
 ];
 for(let [k,b]of blocks.entries()){
  R(b.x+9,b.floor,b.w-17,17,M.steel);
  for(let i=0;i<b.roof.length-1;i++){let p=b.roof[i],q=b.roof[i+1];L(p[0],p[1],q[0],q[1],17,b.steel);}
  let a=b.roof[0],z=b.roof[b.roof.length-1];
  L(a[0]+17,a[1]+7,a[0]+27,b.floor,13,M.steel);
  L(z[0]-17,z[1]+6,z[0]-27,b.floor,15,M.steel);
  L(b.x+b.w*.57,Math.min(...b.roof.map(p=>p[1]))+29,b.x+b.w*.62,b.floor,9,M.pipe);
  let yy=b.floor-135,xx=b.x+42;
  R(xx,yy,b.w*.31,10,M.grate);R(b.x+b.w*.58,yy-45,b.w*.28,10,M.steel);
  R(b.x+40,b.floor-35,b.w-80,9,M.grate);
  for(let j=0;j<4;j++){
   let X=b.x+48+j*(b.w-96)/4,Y=b.floor-88-(j%2)*31-(k%2)*12;
   R(X,Y,54+((j+k)%3)*8,9,j===k?M.shield:M.steel);
   R(X+7,Y-30,10,29,M.slate);R(X+23,Y-24,23,19,[M.glass,M.blue,M.glass,M.glass][(j+k)%4]);
   R(X+45,Y-39,8,12,((j+k)&1)?M.amber:M.cyan);
  }
 }
 // West ledger and dispatch; source analogue is only cargo culture.
 R(182,621,124,14,M.shield);R(208,585,23,35,M.glass);
 L(239,593,286,615,8,M.pipe);R(277,602,19,13,M.cyan);
 // Specimen rail plus separate readout / unequal assay bay.
 L(733,522,825,557,11,M.shield);R(777,502,23,34,M.glass);
 R(804,561,94,13,M.grate);R(855,543,20,17,M.amber);
 // Refuge/tissue hospice.
 R(1120,621,172,10,M.steel);R(1151,579,33,40,M.glass);
 L(1187,580,1246,620,9,M.pipe);R(1271,584,21,37,M.blue);
 // Eastern sterile sequence and public exchange are two different operations.
 R(1634,609,135,12,M.shield);R(1680,568,28,40,M.glass);
 L(1739,557,1803,607,8,M.pipe);R(1783,568,15,35,M.cyan);
 // Unequal, very short transverse links; unlike giant drydock/cableway predecessors.
 L(508,673,573,645,11,M.grate);L(1003,691,1063,715,10,M.steel);
 L(1447,716,1520,676,11,M.grate);
 // Damaged annex with material-preserved empty repairs and alternate exit.
 R(1924,833,124,14,M.steel);
 L(1932,643,1979,617,12,M.slate);L(2003,637,2047,659,10,M.grate);
 R(1949,702,11,112,M.steel);R(1993,753,42,11,M.steel);R(2003,722,14,30,M.glass);
 // Actual Midge-scale hallways carved through completed roofs/platforms;
 // staggered, not a generic large central sky void.
 R(27,740,520,65,0);R(532,731,500,75,0);
 R(1016,748,465,64,0);R(1465,737,583,74,0);
 // Four physically entered throat/inspection niches with conservative clearance.
 R(719,548,50,263,0);R(1180,568,48,247,0);
 R(1667,570,52,246,0);R(1774,625,85,186,0);R(1854,645,48,168,0);
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


 

 const sites={
 "West arrivals":[73,769],"West seed ledger":[244,774],"West outpass":[416,769],
 "West roof outlook":[245,458],"West public connector":[526,766],
 "Assay public entry":[637,771],"Seed receipt desk":[793,769],
 "Assay upper gallery":[745,572],"Assay exterior lookout":[831,344],
 "Assay exit":[951,770],"Refuge western link":[1022,779],
 "Refuge clinic":[1131,787],"Refuge seed custody":[1357,785],
 "Refuge throat":[1203,715],"East exchange":[1489,784],
 "Quarantine public hall":[1597,781],"Quarantine sterile intake":[1742,775],
 "Quarantine east inspection":[1863,779],"Quarantine upper hatch":[1693,592],
 "Damaged wing entry":[1981,783],"Eastern delivery outdoors":[2029,692],
 "West recovery descent":[440,879],"Central recovery descent":[1030,882],
 "East recovery descent":[1597,882],"West belowgrade service":[627,952],
 "Central belowgrade service":[1139,952],"East belowgrade service":[1480,951],
 "Sterile lock":[1813,663]
 };
 const reconciled=tie();
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
 let s=sites["West arrivals"],i=s[1]*W+s[0],hd=0,tl=0;if(!pass[i])throw Error("Spawn obstructed");queue[tl++]=i;vis[i]=1;
 while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
 let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p}));return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[1795,639,1832,682],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="Sterile lock")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West intake arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-west-ledger",43,460,516,397],["02-assay-lofts",560,377,472,480],["03-refuge",1027,480,460,376],["04-east-sterile",1496,449,552,408],["05-dry-return",349,850,1320,162]]};
}


function packageFiles(){
 const a=build(),images=[],records=[];
 for(const [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){
   let bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});
   records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_EXACT_FINAL_GRID"});
 }

 const receipt={
  project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Cinderfold Seed Courier Districts",sibling:1,
  role:"Fold-Seam Courier Hamlet / Clustered Seed-Custody Works",
  seed:"cinderfold-fold-seam-courier-hamlet-261121-v1",
  map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
  engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
  donors:[{slug:"wide-threnody-scar-foldwing-seedlift",pr:73,head:"00cb6b6b86b875d8b81cc387c711aa56f172d9dd"},
          {slug:"wide-graftloom-slipway",pr:22,head:"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657"}],
  extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,
  grounded_cells:a.grounded,detached_cells:0,solid_components:a.components,physical_tethers:a.ties,
  lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,
  rectangle_work_cells:a.area,setup_bytes:a.json.length,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),
  literal_sites:a.sites,midge_full_hull_clearances:a.routes,
  obstruction:{box:a.box,blocked_site:"Sterile lock",result:a.obstruction},
  indexed_images:records,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",
  native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD",
  caveat:"The source-static pass checks literal full-hull centre connectivity, not native gameplay, save/reopen or a separate reviewer."
 };
 const exemplar={
  schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
  family:"Cinderfold Seed Courier Districts",lane:"Xenobiome / Frontier Clusters",
  map_role:"Sibling 01 — Fold-Seam Courier Hamlet / Clustered Seed-Custody Works",
  anchor_donors:["wide-threnody-scar-foldwing-seedlift","wide-graftloom-slipway"],
  macro_topology:["multi_settlement","corridor"],
  density_profile:"Four deliberately unequal, densely furnished, partly roof-bounded inhabited work blocks separated by short open gaps; south of the courier lanes is a sparse, excavated rescue gallery",
  route_grammar:{primary:"West couriers and ledgers via traversable lateral hallways through tiered assay, refuge clinic and sterile east dispatch",
    alternate:"Upper mezzanine/roof overflight plus a shorter below-grade service return with three fully open access wells",
    recovery:"One isolated sterile lock obstruction leaves the other exact named destinations accessible, with east and undercroft alternatives retained"},
  strong_motifs:["four different folded-brace roof silhouettes","entered living courier and specimen workfaces","inequivalent diagnostic ledgers and refuge benches","short staggered connectors","damaged quarantined east annex","ground-bounded three-well service gallery"],
  interesting_relationships:["Inhabited workface density occupies multiple staggered small halls rather than an enormous central vessel or open basin",
    "Public courier movement is tangential to raised assay and sterile mezzanines","High roof load paths terminate through irregularly anchored support ribs",
    "Three wells link the work-block footings to a bounded subterranean recovery strip"],
  authoring_affordances:[{site:"Public west handoff",center:[244,774],use:"NPC courier reception and later scene scripting"},
    {site:"Assay upper throat",center:[745,572],use:"Microscope tools and example-derived diagnostic microfills"},
    {site:"Refuge lower hall",center:[1131,787],use:"Settlement decoration and encounter staging"},
    {site:"Damaged eastern annex",center:[1981,783],use:"Future modular extension or collapse-repair event"}],
  setpiece_candidates:[{name:"Specimen handover",center:[793,769],kind:"machine activation",exits:"West public entry and east assay exit"},
    {name:"Courier clinic encounter",center:[1131,787],kind:"NPC settlement interaction",exits:"West and east interblock hallways"},
    {name:"Sterile breach",center:[1813,663],kind:"isolation holdout",exits:"Entered hall and adjacent eastern inspection"},
    {name:"Annex repair reveal",center:[1981,783],kind:"damaged extension",exits:"East delivery and outside sky"}],
  procedural_exemplar_value:["Clustered multi-settlement spatial grammar with roof-profile variety",
    "Unequal small process machines within a truly materialized courier quarter",
    "Three shaft entrances and a bounded dry bypass instead of a full-width huge underworld",
    "Sterile/public adjacency and manually repairable modular append seam"],
  similarity_avoidance:"Unlike existing Mireward drydock, broken annular commons, inverted orchard, polder islands or Quoin Veil fault architecture, this is a compact lateral seed-courier settlement built as four different roof-bounded inhabitable production quarters with close staggered links and only a shallow rescue tunnel.",
  diversity_axes:{macro_topology:["multi_settlement","corridor"],altitude_grammar:["dual_level"],
   density_cadence:["alternating"],route_structure:["branch_rejoin","parallel_lanes"],
   landmark_family:["gate","gantry"],support_form:["floor_rooted","mixed"],
   environment_relation:["biological","damaged"],incompleteness:["editable_gaps","damaged"]},
  geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}
 };
 const readme=[
 "# Cinderfold Seed Courier Districts — Sibling 01: Fold-Seam Courier Hamlet","",
 "**Original CyberSand 2048×1024 material-cell canvas · CREATOR SOURCE-STATIC PASS · NATIVE-UNTESTED · OPEN Draft/HOLD.**","",
 "World-group: Xenobiome / Frontier Clusters. Role: a connected cluster of four inhabited, partly roof-bounded courier quarters, each with a different seed-custody process: western intake and handoff, tiered specimen assay, temporary refugee/clinic, and eastern sterile exchange. A damaged quarantine wing is intentionally unfinished and remains editable.",
 "The small houses connect with short offset public/sterile links and entered 31×27-clear corridors. Three shafts reach a bounded dry lower service strip, while upper roof/inspection regions offer alternate movement. Vacant repair seams and unused bays remain useful design-corpus affordances.","",
 "Anchor donors, read-only: Threnody Scar #73 at 00cb6b6b86b875d8b81cc387c711aa56f172d9dd and Graftloom Slipway #22 at b0d1e5216aabb9b5e009e599ffbffcec6fd8a657. Inherited only folding brace principles, biological specimen handling, diagnostic fixtures, and material culture. New roof profiles, routes, cells, coordinates, names and district layout; no donor pixel/rectangle copying.",
 "New structural thesis: multi-settlement, alternating density, off-centre interior manufacture, dual-level short rescue bypass, damaged modular annex. Not another giant rotor, suspended ark, ring, chasm or drydock.","",
 "## Source-static qualification","",
 "- Final material-ID cells: 2,097,152. Stable occupied/grounded: "+a.area+"/"+a.grounded+"; zero detached.",
 "- In-bounds disjoint lossless Setup-v2 rectangles: "+a.rect.length+" / 32,768. JSON bytes: "+a.json.length+" / 1,048,576. Material plane SHA-256: "+receipt.plane_sha256+".",
 "- Exact full-body 4-neighbour Midge routes at 19×15 / 23×19 / 31×27: "+a.routes.map(z=>z.passed+"/"+z.total).join(" | ")+". Physical obstruction "+JSON.stringify(a.box)+" leaves "+a.obstruction.passed+"/"+a.obstruction.total+" accessible; one literally covered sterile lock is denied.",
 "- Deterministic source: node build.cjs regenerates the Setup, receipt, metadata and six authentic indexed-material PNGs; node build.cjs --verify compares output bytes with the committed artifacts.",
 "- Source authority: CyberSand read-only accepted main "+receipt.engine_readonly_main+". Source acceptance does not prove installed native CyberDemoBridge admission, collision, ticks, actor input, save/reopen or persistence. **NATIVE-UNTESTED**. Independent Art / Technical / Shepherd exact-HEAD reviews PENDING.","",
 "Keep OPEN Draft/HOLD; no owner acceptance, Ready, merge or auto-merge.","",
 "## Authentic material-cell gallery","",
 "![Full actual 2048×1024 material grid](./overview.png)","",
 ...images.slice(1).map(z=>"!["+z.name+"](./"+z.name+")"),""
 ].join("\n");
 return {a,images,receipt,exemplar,readme};
}
const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d]of files){let b=Buffer.from(d),p=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Byte mismatch "+name);}else fs.writeFileSync(p,b);}console.log(JSON.stringify({qualification:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),native:"NATIVE-UNTESTED"}));
