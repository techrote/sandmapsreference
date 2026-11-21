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
 // Mireward: five uneven anchored mycelial settlements, split low dry polders, independent short arches.
 P([[0,738],[44,717],[111,641],[194,613],[273,645],[351,734],[423,941],[0,941]],M.basalt);
 P([[420,946],[474,832],[531,736],[630,707],[743,750],[810,850],[843,946]],M.basalt);
 P([[855,945],[918,807],[985,671],[1094,624],[1206,683],[1286,781],[1341,947]],M.basalt);
 P([[1352,947],[1400,841],[1465,753],[1565,728],[1660,814],[1708,947]],M.basalt);
 P([[1710,946],[1766,814],[1825,664],[1920,627],[2001,689],[2048,706],[2048,946]],M.basalt);
 P([[0,929],[125,939],[285,924],[445,944],[633,939],[817,934],[983,930],[1198,944],[1402,938],[1618,949],[1833,930],[2048,942],[2048,1024],[0,1024]],M.basalt);
 R(0,1003,W,21,M.schist);
 for(let y=960;y<995;y+=16)for(let x=30;x<2048;x+=153)R(x,y,33+((x+y)%41),3,M.schist);
 for(let p of [[[367,799],[420,800],[478,778],[499,913],[404,930]],[[776,803],[835,789],[906,813],[902,917],[798,929]],[[1297,808],[1370,800],[1412,832],[1383,927],[1314,934]],[[1641,833],[1703,808],[1759,841],[1754,932],[1654,935]]])P(p,0);
 // Unequal excavated living and process rooms; far-side side entries are genuinely air.
 for(let a of [[49,687,261,77],[84,797,259,76],[527,763,223,93],[989,711,237,92],[1004,814,218,64],[1462,786,180,84],[1835,691,209,84],[1817,809,212,73],
 [292,695,92,58],[324,812,74,55],[711,769,75,70],[1202,715,88,80],[1442,807,79,48],[1821,708,68,55]])R(...a,0);
 for(let [x,y,w] of [[52,764,255],[86,873,256],[525,856,231],[987,803,244],[1003,877,218],[1457,867,189],[1835,776,209],[1818,882,208]]){R(x,y,w,11,M.steel);R(x+8,y+11,w-16,3,M.pipe);}
 // Short arches and piers are visibly rooted rather than one massive central dam.
 function arch(x,y,w,r){L(x,y+23,x+13,950,9,M.slate);L(x+w-12,y+23,x+w-12,950,9,M.slate);
 let a=[[x,y+18],[x+23,y-r*.43],[x+w*.36,y-r],[x+w*.59,y-r-7],[x+w*.79,y-r*.55],[x+w,y+18]];
 for(let i=0;i<a.length-1;i++)L(...a[i],...a[i+1],8,M.shield);R(x+8,y+19,w-16,9,M.steel);}
 arch(321,661,213,65);arch(736,665,239,68);arch(1254,681,201,52);arch(1635,699,227,82);
 function deck(x,y,w,posts){R(x,y,w,11,M.steel);R(x+8,y+11,w-16,4,M.pipe);for(let p of posts)L(p,y+11,p+8,951,8,M.slate);}
 deck(70,598,267,[91,283]);deck(526,684,234,[552,731]);deck(977,602,281,[1007,1235]);deck(1453,711,194,[1468,1620]);deck(1822,603,221,[1840,2021]);
 function cabinet(x,y,w,h,mat,light){R(x,y-h,w,h,mat);R(x+6,y-h-5,Math.max(8,w-12),5,light);}
 cabinet(111,598,39,27,M.blue,M.cyan);cabinet(169,598,74,18,M.glass,M.amber);
 cabinet(84,764,52,24,M.slate,M.cyan);cabinet(206,764,63,19,M.glass,M.amber);
 cabinet(137,873,83,20,M.glass,M.cyan);cabinet(237,873,52,30,M.blue,M.amber);
 for(let x of [127,164,202,240]){L(x,598,x+13,554,5,M.grate);R(x+8,550,17,6,M.glass);}
 for(let x of [559,616,681]){L(x,684,x+9,625-(x%17),8,M.pipe);R(x+4,617-(x%17),24,11,M.glass);}
 cabinet(558,856,61,30,M.blue,M.cyan);cabinet(673,856,57,25,M.shield,M.amber);
 cabinet(1017,602,56,26,M.glass,M.cyan);cabinet(1096,602,92,20,M.blue,M.amber);
 L(1011,573,1063,519,9,M.slate);L(1063,519,1140,493,9,M.slate);L(1140,493,1238,572,9,M.slate);L(1238,572,1240,602,9,M.slate);
 R(1060,516,22,8,M.glass);R(1137,493,27,8,M.cyan);
 cabinet(1030,803,64,29,M.glass,M.cyan);cabinet(1119,803,62,22,M.blue,M.amber);
 cabinet(1038,877,62,22,M.blue,M.amber);cabinet(1123,877,72,28,M.shield,M.cyan);
 cabinet(1491,711,47,29,M.glass,M.cyan);cabinet(1551,711,60,18,M.blue,M.amber);
 for(let x of [1485,1524,1566,1605]){R(x,839,13,28,M.shield);R(x+3,832,7,7,M.cyan);}
 cabinet(1847,603,51,26,M.blue,M.cyan);cabinet(1930,603,58,18,M.glass,M.amber);
 cabinet(1859,776,74,29,M.shield,M.cyan);cabinet(1952,776,61,28,M.blue,M.amber);
 cabinet(1852,882,52,28,M.blue,M.amber);cabinet(1940,882,52,29,M.glass,M.cyan);
 // Open expansion interfaces, not obligatory decorations.
 for(let [x,y] of [[340,757],[782,810],[1324,794],[1710,805]]){R(x,y,40,9,M.steel);L(x+8,y,x+24,y-23,5,M.grate);}
 // True Midge-width entered gates: remove rock/deck/pier through five different island access shafts.
 // Carving *after* fixtures removes colliding construction, then structural hardware is re-tethered.
 for(let [x,y,w,h] of [[258,531,72,372],[709,602,78,311],[1205,512,85,416],[1606,642,82,291],[1791,634,88,298],[493,714,75,219]])R(x,y,w,h,0);
 // Six additional actual carved Midge-access passages, not changed/nearest-site targets.
 // Bridge underpasses, sheltered worktown rooms and canal floors now have positive entries.
 for(let [x,y,w,h] of [[306,789,210,100],[585,752,156,78],[1072,697,163,96],
 [1067,800,156,52],[1331,719,81,83],[1846,681,175,65],[1846,781,170,75],[1659,727,99,95]])R(x,y,w,h,0);
 // Physically tether every isolated authoring fixture into the bedrock before encoding.
 let tieCount=0;for(let pass=0;pass<2;pass++){let seen=new Uint8Array(N),queue=new Int32Array(N),links=[];for(let i=0;i<N;i++)if(g[i]&&!seen[i]){let hd=0,tl=1,rooted=false;seen[i]=1;queue[0]=i;while(hd<tl){let p=queue[hd++],x=p%W,y=p/W|0;if(!x||x===W-1||!y||y===H-1)rooted=true;for(let j of [p-W,p+W,x?p-1:-1,x<W-1?p+1:-1])if(j>=0&&j<N&&g[j]&&!seen[j]){seen[j]=1;queue[tl++]=j;}}if(!rooted)links.push(i);}for(let p of links){let x=p%W,y=p/W|0;L(x,y,x,1010,5,M.grate);tieCount++;}if(!links.length)break;}
 // Positive side-entry doors through structurally redundant tether/piers, sized to 31x27.
 // These remain actual geometry edits and keep every named site at its fixed literal location.
 for(let [x,y,w,h] of [[419,783,70,121],[598,743,74,91],[1106,691,78,99],
 [1107,808,76,54],[1333,707,70,102],[1658,719,78,109],[1887,672,77,187]])R(x,y,w,h,0);
 const sites={
 "West arrival sky":[94,548],"West council deck":[205,510],"West seed ledger":[165,714],"West cold registry":[167,819],
 "First polder air crossing":[444,553],"First dry catchment":[445,839],"Reed purge deck":[640,565],
 "Mycelial sieve":[608,785],"Polder shelf":[814,757],"Second high arch":[862,554],
 "Canopy transit interlock":[947,451],"Canopy bypass apex":[1105,427],
 "Hospice outer deck":[1187,438],"Central examination":[1096,736],
 "Central lower culture":[1090,829],"Quarantine upper flight":[1491,649],
 "Quarantine decontamination":[1547,814],"Eastern low polder":[1365,760],
 "Third bridge outlet":[1386,535],"West recovery rim":[358,576],
 "Far east dispatch":[1912,551],"Far east postal hall":[1941,716],
 "Far east secondary sampling":[1927,817],"East expansion horizon":[1734,520],
 "Underbridge salvage site":[1699,775],"Middle dry bypass":[902,437]
 };
 const ties={joins:tieCount,max_span:0};
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
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[918,415,980,477],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="Canopy transit interlock")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrival sky"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-seed-ledger-west",22,510,391,400],["02-reed-purge-island",434,570,403,391],["03-biological-hospice",907,480,407,466],["04-quarantine-east",1350,585,394,380],["05-remote-outfall",1712,508,336,472]]};
}

function packageFiles(){
 const a=build(),images=[],records=[];
 for(let [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){let bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_FINAL_GRID"});}
 const receipt={project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Mireward Levee Communes",sibling:1,role:"Split-Polder Mycelial Settlements / Dry Reed Outfalls",seed:"mireward-polder-261121-v1",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",donors:["wide-harrow-mere-spore-dam","wide-graftloom-slipway"],extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,solid_components:a.components,physical_tethers:a.ties,lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,rectangle_work_cells:a.area,setup_bytes:a.json.length,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,midge_full_hull_clearances:a.routes,obstruction:{box:a.box,blocked_site:"Canopy transit interlock",result:a.obstruction},indexed_images:records,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD"};
 const exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"Mireward Levee Communes",lane:"Xenobiome / Frontier Clusters",map_role:"Sibling 01 — Split-Polder Mycelial Settlements / Dry Reed Outfalls",anchor_donors:["wide-harrow-mere-spore-dam","wide-graftloom-slipway"],macro_topology:["islands","basin"],density_profile:"Five unlike grounded islands with inhabited research, biologically themed processing and quarantine; irregular broad dry polders and generous open flight voids",route_grammar:{primary:"West ledger -> middle mycelial reed-purge -> central hospice -> east quarantine -> outfall",alternate:"High open overflight and independent shorter asymmetrical bridges, with lower dry polder recoveries",recovery:"Closing the canopy transit interlock preserves all other literal Midge destinations at the conservative full hull"},strong_motifs:["irregular rooted polder-island settlement","four unlike short arches with anchored load paths","static spore-membrane filter ribs","offset hospice culture canopy","east quarantine threshold and remote outfall"],interesting_relationships:["Biological production dispersed over inhabited banks rather than single giant machine","High bypass and low broken-polder recoveries coexist across irregular villages","Cleanroom located downstream of central hospice processing","Dry polder voids remain authoring sites without claims about actual simulated fluid"],authoring_affordances:[{site:"First dry catchment",point:[445,839],use:"Optional staged flood or bridge-failure event"},{site:"Central lower culture",point:[1090,829],use:"GENTEK or SWARM rooted biofilter addition"},{site:"Remote postal seam",point:[1927,817],use:"NPC dispatch or freighter extension"},{site:"Third bridge outlet",point:[1386,609],use:"Alternate bridge destruction / flight recovery"}],setpiece_candidates:[{name:"Dry polder bridge failure",center:[445,839],kind:"destructible crossing / flight recovery",exits:"Upper open sky"},{name:"Quarantine exchange",center:[1547,814],kind:"NPC containment encounter",exits:"Upper flight and short arch"},{name:"Culture activation",center:[1096,736],kind:"machinery activation",exits:"High canopy and lower route"},{name:"Outfall evacuation",center:[1941,716],kind:"departure stage",exits:"Far eastern open sky"}],procedural_exemplar_value:["Five physically dissimilar inhabited island banks","Short rooted arch crossings as modular rule grammar","Biological industrial settlement without reactive simulation dependencies","Purposely unoccupied dry polder editing sockets"],similarity_avoidance:"Harrow Mere's single spanning dam/rotor and opposing crater settlements are absent. Unlike Quoin's vertical survey faults or Underroot's continuous biofactory, the new family spreads work over five uneven dry-polder communes and four short arches.",diversity_axes:{macro_topology:["islands","basin"],altitude_grammar:["high_low_bypass","multi_strata"],density_cadence:["alternating","clustered"],route_structure:["branch_rejoin","parallel_lanes"],landmark_family:["bridge","mixed"],support_form:["arch","floor_rooted"],environment_relation:["biological","dry"],incompleteness:["editable_gaps","modular_append_zones"]},geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}};
 const readme="# Mireward Levee Communes — Split-Polder Mycelial Settlements / Dry Reed Outfalls\n\n**Original world-family Sibling 01 · 2048×1024 genuine material-ID canvas · Xenobiome / Frontier Clusters · CREATOR-STATIC-PASS · NATIVE-UNTESTED · Draft/HOLD.**\n\nFive irregular inhabited raised islands form a spore-settlement network through dry polders. West seed ledger/cold registry, reed purification island, central culture hospice and rooted overhead canopy, east quarantine/decon commune, and remote freight outfall differ in both spatial placement and physically entered hardware. Four distinct short arched crossings take the place of a central dam, with wide, intentional negative-space authoring basins.\n\n**Primary design-language donors:** [Harrow Mere #64](https://github.com/techrote/sandmapsreference/pull/64) and Graftloom Slipway. They lend basalt material culture, mycelial industry, quarantine and spore freight engineering, not geometry, pixels, edits, name/location or district composition. Unlike Quoin Veil and Underroot siblings, this is a multi-island biological commune network.\n\n## Exact source-static qualification\n\n- "+a.area+" stationary occupied cells, "+a.grounded+" boundary-grounded, no detached structures. "+a.rect.length+" disjoint legal Setup-v2 rectangles, "+a.json.length+" JSON bytes and 2,097,152 full plane cells.\n"+
 "- Full 19×15, 23×19 and 31×27 conservative Midge literal-site navigation: "+a.routes.map(x=>x.passed+"/"+x.total).join(", ")+". Physical obstruction "+JSON.stringify(a.box)+" leaves "+a.obstruction.passed+"/"+a.obstruction.total+" named sites available (one directly blocked). Static check is not native gameplay.\n"+
 "- Exact grid SHA-256 "+receipt.plane_sha256+"; Setup SHA-256 "+receipt.setup_sha256+". Only stable static material laws. Accepted CyberSand main "+receipt.engine_readonly_main+" consulted read-only. Source limits 32768 rectangles, 1MiB JSON and 32M edit cells; older installed 4096 fallback may differ.\n"+
 "- Deterministic source: \`node build.cjs\`, and \`node build.cjs --verify\` to compare all committed generated files. The full indexed PNG overview and five native 1:1 crops below are generated from the same final grid (no concept art).\n"+
 "- Godot/Workbench/CyberDemoBridge/Rapier movement, collisions, native ticks and save/reopen remain **NATIVE-UNTESTED**; independent Art/Technical/Shepherd matching-HEAD acceptance pending. OPEN Draft/HOLD; no merge or Ready.\n\n"+
 "## Material-cell evidence\n\n![Overview](./overview.png)\n\n"+records.slice(1).map(x=>"![Native 1:1 "+x.name+"](./"+x.name+")").join("\n\n")+"\n";
 return {a,images,receipt,exemplar,readme};
}

const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d]of files){let b=typeof d==="string"?Buffer.from(d):Buffer.from(d),p=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Byte mismatch "+name);}else fs.writeFileSync(p,b);}console.log(JSON.stringify({qualification:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),native:"NATIVE-UNTESTED"}));
