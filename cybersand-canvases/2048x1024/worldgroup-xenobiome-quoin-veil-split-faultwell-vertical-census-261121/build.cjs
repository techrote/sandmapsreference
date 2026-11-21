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
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={basalt:100,obsidian:101,slate:49,steel:62,grate:66,pipe:68,cyan:77,amber:79,glass:120,solar:129,shield:131};
 function R(x,y,w,h,v){let X=Math.max(0,Math.round(x)),Y=Math.max(0,Math.round(y)),Z=Math.min(W,Math.round(x+w)),T=Math.min(H,Math.round(y+h));for(let j=Y;j<T;j++)g.fill(v,j*W+X,j*W+Z);}
 function L(x,y,X,Y,t,v){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2,rr=r*r;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r+1));j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r+1));i++){let p=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-p*dx)**2+(j-y-p*dy)**2<=rr)g[j*W+i]=v;}}
 function P(a,v){for(let y=0;y<H;y++){let xs=[];for(let i=0;i<a.length;i++){let p=a[i],q=a[(i+1)%a.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){let X=Math.ceil(xs[i]),Z=Math.floor(xs[i+1]);R(X,y,Math.max(0,Z-X+1),1,v);}}}
 P([[0,354],[180,316],[355,366],[520,325],[740,353],[945,333],[1130,362],[1332,326],[1550,331],[1815,320],[2048,346],[2048,1024],[0,1024]],M.basalt);R(0,988,W,36,M.obsidian);
 for(let y=785;y<955;y+=52)for(let x=14;x<W;x+=109){let len=19+(x+y)%43;for(let i=x;i<x+len&&i<W;i++){let p=y*W+i;if(g[p]===M.basalt)g[p]=M.obsidian;}}
 R(540,230,188,722,0);R(1370,218,194,727,0);
 for(let [x,y,w,h] of [[490,327,70,221],[710,488,73,263],[1325,376,65,219],[1550,615,77,240]])R(x,y,w,h,0);
 for(let [x,y,X,Y,t] of [
 [294,434,628,434,105],[624,434,1467,434,107],[1458,519,1870,519,105],
 [625,686,1452,686,107],[625,862,1452,862,108],
 [625,268,625,871,109],[1452,253,1452,876,110],
 [376,434,376,690,96],[376,686,625,686,96],
 [1745,519,1745,696,96],[1745,686,1452,686,96],
 [840,686,840,861,91],[1182,434,1182,686,91],[990,686,990,861,91],
 [376,860,625,860,95],[1452,861,1750,861,93]
 ])L(x,y,X,Y,t,0);
 R(775,375,502,11,M.steel);R(778,487,492,10,M.pipe);
 for(let [x,w] of [[800,56],[898,73],[1062,78],[1194,54]]){R(x,389,w,13,M.glass);R(x+8,374,16,12,M.cyan);}
 for(let [x,w] of [[818,72],[1012,98],[1173,58]]){R(x,474,w,12,M.steel);R(x+11,465,20,9,M.amber);}
 L(938,374,976,345,7,M.grate);R(969,337,23,13,M.shield);
 R(751,628,573,12,M.steel);R(764,742,561,9,M.pipe);
 for(let [x,w] of [[775,96],[912,53],[1052,82],[1200,47]]){R(x,641,w,14,M.glass);R(x+w-22,626,18,13,M.cyan);}
 for(let x of [820,959,1089,1263]){R(x,703,16,30,M.steel);R(x+4,689,10,11,M.amber);}
 R(738,804,589,9,M.shield);R(743,912,593,9,M.steel);
 for(let [x,w] of [[769,56],[881,79],[1041,110],[1213,48]]){R(x,818,w,12,M.slate);R(x+14,805,19,14,M.cyan);R(x+w-31,904,29,9,M.glass);}
 R(151,361,330,13,M.steel);R(164,374,13,133,M.slate);R(455,374,13,126,M.slate);
 R(195,387,66,22,M.glass);R(293,391,68,21,M.solar);R(385,379,26,12,M.cyan);
 R(335,304,170,12,M.steel);R(357,304,13,52,M.slate);R(494,307,13,45,M.slate);R(409,293,43,10,M.cyan);
 R(141,641,225,12,M.steel);R(154,654,13,94,M.slate);R(347,654,14,93,M.slate);
 R(193,665,91,17,M.glass);R(298,661,26,13,M.amber);
 for(let [x,y,w] of [[507,369,46],[489,553,60],[506,763,46],[1301,337,78],[1308,563,64],[1556,736,61]]){
   R(x,y,w,11,M.steel);R(x+10,y-30,14,30,M.slate);R(x+w-13,y-17,9,14,M.cyan);}
 for(let [x,y,w] of [[708,393,54],[721,601,48],[708,788,66],[1550,472,58],[1566,622,69]]){R(x,y,w,9,M.pipe);L(x+12,y-31,x+26,y,5,M.grate);}
 L(1619,335,1617,191,14,M.steel);L(1617,191,1680,171,8,M.slate);L(1680,171,1709,207,7,M.shield);L(1632,266,1707,346,9,M.grate);R(1667,156,24,11,M.amber);
 R(1630,455,288,13,M.steel);R(1644,468,14,127,M.slate);R(1890,468,15,124,M.slate);
 R(1684,481,57,18,M.glass);R(1789,478,72,22,M.solar);R(1758,456,25,12,M.amber);
 R(1662,592,226,13,M.pipe);R(1711,583,21,16,M.cyan);
 R(1684,745,232,13,M.steel);R(1695,757,14,143,M.slate);R(1898,757,14,144,M.slate);
 R(1758,778,77,17,M.glass);R(1844,782,39,18,M.amber);
 for(let [x,y,X,Y,t] of [
 [625,260,625,866,80],[1452,250,1452,866,80],
 [294,434,625,434,78],[625,434,1452,434,81],[1452,519,1870,519,77],
 [625,686,1452,686,85],[625,862,1452,862,87],
 [376,434,376,686,75],[376,686,625,686,81],
 [1745,519,1745,686,75],[1745,686,1452,686,76],
 [840,686,840,862,75],[1182,434,1182,686,76],
 [990,686,990,862,78],[376,860,625,860,78],[1452,861,1750,861,81]
 ])L(x,y,X,Y,t,0);
 const sites={
 "West rim approach":[625,269],"West upper bore":[625,345],"West inhabited isotope census":[302,434],"West first bore":[625,434],
 "High calibration interlock":[990,434],"Upper resonance assay":[1255,434],"East upper bore":[1452,269],
 "East gravimetric head":[1452,434],"East xenoseed custody":[1772,519],"West sheltered cryo":[376,620],
 "West side bypass":[376,686],"West survey midwell":[625,590],"West middle fault":[625,686],
 "Middle cartographic receiver":[841,686],"Midwall analysis":[1054,686],"Eastern transverse recorder":[1254,686],
 "East middle fault":[1452,686],"East side rescue":[1745,686],"East dry mineral gate":[1750,861],
 "West deep bore":[625,781],"West return plenum":[625,862],"West rescue spur":[376,860],
 "Deep strain array":[921,862],"Deep return bypass":[1105,862],"East lower bore":[1452,783],
 "East rescue plenum":[1452,862],"Midwestern crossdrop":[840,783],"Central lower annex":[990,786],
 "East independent descent":[1182,581]
 };
 for(let p of Object.values(sites))R(p[0]-22,p[1]-23,45,47,0);
 // Join isolated geology/industry into rooted structures by minimal all-cells multi-source BFS.
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
 const ties=tie();
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
 let s=sites["West first bore"],i=s[1]*W+s[0],hd=0,tl=0;if(!pass[i])throw Error("Spawn obstructed");queue[tl++]=i;vis[i]=1;
 while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
 let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p}));return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[954,396,1025,471],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="High calibration interlock")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West first bore"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-west-isotope-observatory",112,255,600,315],["02-west-intermediate-fault",462,339,341,563],["03-three-transverse-research-links",742,350,566,601],["04-east-head-and-custody",1294,142,632,570],["05-buried-rescue-routes",360,723,1446,251]]};
}
function packageFiles(){
 const a=build(),images=[],imageRecords=[];
 for(let [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){let bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});imageRecords.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_VERIFIED_FINAL_GRID"});}
 const receipt={project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Quoin Veil Survey Network",sibling:4,role:"Split Faultwell / Vertical Census Escarpment",seed:"quoin-veil-split-faultwell-261121-v1",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",donors:["wide-sable-quoin-gravitic-core","wide-threnody-scar-foldwing-seedlift"],extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,solid_components:a.components,structural_ties:a.ties,lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,rectangle_work_cells:a.area,setup_bytes:a.json.length,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,midge_full_hull_clearances:a.routes,obstruction:{box:a.box,blocked_site:"High calibration interlock",result:a.obstruction},indexed_images:imageRecords,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD"};
 const exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"Quoin Veil Survey Network",lane:"Xenobiome / Frontier Clusters",map_role:"Sibling 04 — Split Faultwell / Vertical Census Escarpment",anchor_donors:["wide-sable-quoin-gravitic-core","wide-threnody-scar-foldwing-seedlift"],macro_topology:["vertical_fault"],density_profile:"Two unequal deeply excavated rock faults, clustered entered scientific workfaces at three transverse levels, intentionally vacant excavation margins",route_grammar:{primary:"West isotope settlement -> west survey well -> upper transverse seismographic gallery -> east custody station",alternate:"Middle and deep horizontal linkages, independently descended well shafts, west and east lower recovery spurs",recovery:"Physical upper interlock block leaves all other literal destinations accessible by middle and low-level routes"},strong_motifs:["twin geological vertical wells","rock-embedded cantilevered survey stations","three materially distinct cross-bore instrument galleries","west inhabited rim observatory","abandoned east high instrument head","dry deep recovery recorder"],interesting_relationships:["Twin vertical fault shafts are joined laterally in three levels instead of a single diagonal tunnel","Inhabited isotope census on one side contrasts with isolated xenoseed custody on the other","Damaged upper instrument is positioned above functioning deep recording machinery","Purposeful large dark editing margins separate compact but functional workfaces"],authoring_affordances:[{site:"East damaged head",point:[1452,269],use:"Rebuild, collapse, reveal or extend a damaged mast"},{site:"West middle well",point:[625,686],use:"Add control gate or pressure-monitor equipment while preserving deep bypass"},{site:"Deep vacant annex",point:[990,786],use:"Extend machine or event stage from crossdrop"},{site:"East mineral lock",point:[1750,861],use:"Reroutable research/quarantine encounter"}],setpiece_candidates:[{name:"Upper calibration interlock loss",center:[990,434],kind:"controlled structural obstruction",exits:"Middle gallery and deep return pass conservative full-hull BFS"},{name:"Abandoned faultwell head",center:[1452,269],kind:"collapse or reveal",exits:"Open sky and east bore"},{name:"Middle cartographic encounter",center:[1054,686],kind:"NPC encounter / machinery activation",exits:"West/east shafts and lower drop"},{name:"Deep cross-bore recovery",center:[1105,862],kind:"escape or chase",exits:"Lower routes to both vertical wells"}],procedural_exemplar_value:["Paired vertical geology shafts with unlike cantilevered parts","Branch/rejoin across three transverse levels under literal obstruction","Contrast active inhabited rim and damaged remote survey hardware","Intentionally empty rock margins for manual new sockets and scripts"],similarity_avoidance:"Unlike Quoin Veil 01's facing-cliff V basin, 02's diagonal tunnel ascent and 03's three horizontal town clusters, this sibling uses twin unequal deep vertical wells connected through upper, middle and lower transverse entered workfaces; no cloned rafts, giant central rotor or flat township.",diversity_axes:{macro_topology:["vertical_fault"],altitude_grammar:["vertical_spine","multi_strata"],density_cadence:["clustered","dense_open_dense"],route_structure:["branch_rejoin","layered"],landmark_family:["tower","gantry"],support_form:["cliff_embedded","roof_rooted"],environment_relation:["geological","damaged"],incompleteness:["excavation","editable_gaps","damaged"]},geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}};
 const readme=`# Quoin Veil Survey Network — Split Faultwell / Vertical Census Escarpment\n\n**Xenobiome / Frontier Clusters · Sibling 04 · new 2048×1024 material-cell canvas · CREATOR-STATIC-PASS · NATIVE-UNTESTED · OPEN Draft/HOLD.**\n\nTwo unequal **vertical faultwells** are cut into an exposed basalt-obsidian plateau. Three long transverse entered laboratories connect them at upper calibration, mid-level cartography and deep dry recorder strata. The west inhabited isotope observatory, cantilevered bore measurement fixtures, east xenoseed custody/sterile dispatch and partly wrecked high instrument head give at least four distinct functioning workfaces; large deliberately vacant geology/edit margins remain. Each well has a separately entered shaft and alternative route/recovery. Unlike Quoin Veil siblings [01](https://github.com/techrote/sandmapsreference/pull/108) (opposing cliff crater/rafts), [02](https://github.com/techrote/sandmapsreference/pull/114) (oblique interior ascent) and [03](https://github.com/techrote/sandmapsreference/pull/121) (three-town shallow groundline), this is a coupled dual-vertical-fault system.\n\n**Donor vocabulary, not geometry:** Current approved Sable Quoin and Threnody Scar original anchors lend only gravitic calibration, inhabited frontier survey and xenoseed quarantine language, not pixels, rectangle streams, routes, names, coordinates, or district layouts.\n\n## Physical qualification (creator source-static only)\n\n- Final grid **2,097,152 exact material-ID cells**, **${a.rect.length}** valid disjoint Setup-v2 rectangles, **${a.json.length}** serialized bytes, **${a.area}** inert solid cells, **${a.grounded}/${a.area}** rooted; no invalid, overlapping or out-of-bounds final writes. Grid SHA256 \`${receipt.plane_sha256}\`, Setup SHA256 \`${receipt.setup_sha256}\`.\n- Full Midge 19×15, 23×19 and 31×27 conservative traversable-centre flood reaches **${a.routes.map(x=>x.passed+"/"+x.total).join(", ")}** exact named sites from literal spawn \`${JSON.stringify(a.sites["West first bore"])}\` without substitutions. Solid obstruction \`${JSON.stringify(a.box)}\` denies only the named upper calibration interlock; **${a.obstruction.passed}/${a.obstruction.total}** others remain reachable. Static topology does not prove native flight, contact physics or shortest-path detour time.\n- Complete authentic 8-bit indexed material overview plus five true 1:1 district crops generated directly from that same final grid, with dimensions, origins and SHA256 in receipt. No native screenshot or AI conceptual art claim.\n- Fixed seed \`${receipt.seed}\`. Rebuild all data with \`node build.cjs\`, or compare committed bytes with \`node build.cjs --verify\`. Accepted read-only CyberSand \`${receipt.engine_readonly_main}\`; source cap 32,768 rectangles / 1 MiB; installed bridge may fall back to 4096, never assumed.\n- Native Godot 4.7 / Workbench / CyberDemoBridge / Rapier actor load, movement, ticks, save and cold reopen **NATIVE-UNTESTED**. Independent Art/Technical/Shepherd exact-HEAD acceptance **PENDING**. Draft/HOLD always; no merge or Ready.\n\n## Actual indexed-material images\n\n![Full 2048×1024 material plane](./overview.png)\n\n${imageRecords.slice(1).map(x=>`![Authentic 1:1 ${x.name}](./${x.name})`).join("\n\n")}\n\n\`exemplar.json\` schema-v1 controlled axes are descriptive corpus metadata only; setpiece annotations identify four unscripted authoring sockets, not installed game events. Empty gaps are intentional.\n`;
 return {a,images,receipt,exemplar,readme};
}
const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d] of files){let bytes=typeof d==="string"?Buffer.from(d):Buffer.from(d),path=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(path)||!fs.readFileSync(path).equals(bytes))throw Error("Byte mismatch "+name);}else fs.writeFileSync(path,bytes);}console.log(JSON.stringify({state:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),after_obstruction:a.a.obstruction.passed,native:"NATIVE-UNTESTED"}));