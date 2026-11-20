'use strict';
/* UMBRAL INDUCTION DOCK: original 2048x1024 material-cell racing course.
 * Standalone deterministic builder. node build.cjs reproduces all output bytes.
 * Uses no references or files besides this source. Source authority: CyberSand
 * main@7b03aa437561ec63e31fd09531171360ab60eeb4 (2026-11-20).
 * A second script independently reconstructs and audits every committed pixel.
 */
const W=2048,H=1024,N=W*H,SEED=0x1d07b620;
const MATERIAL={EMPTY:0,SLATE:49,CONCRETE:58,STEEL:62,BASALT:100,OBSIDIAN:101,ZINC:113,IRON:117,QUARTZ:122};
const PAL={0:[8,13,24],49:[74,93,116],58:[139,157,175],62:[177,195,205],100:[43,59,74],101:[27,39,57],113:[232,175,80],117:[106,128,158],122:[237,231,200]};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MIDGE='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const SITES=[
 ['Start / west coil lock',150,640],['Impulse threshold',330,607],['Freight incline',595,616],
 ['West annulus approach',792,521],['Annulus main portal',854,496],['Annulus core',1021,504],
 ['Upper annulus exit',1203,447],['Lower annulus exit',1207,567],['East coupling service',1375,526],
 ['Finned filter clearway',1601,547],['East loading catcher',1832,620],['East ascent',1947,438],
 ['East high return',1794,306],['Northbound bypass',1480,322],['Central return throat',1264,368],
 ['Upper western return',704,320],['West descent',274,424],['Finish / coil lock',153,640],
 ['Injector control bridge',239,181],['Rail drive pulpit',640,195],['Annulus survey balcony',1024,192],
 ['Cryopump switchroom',1490,192],['East lift operator',1850,219],
 ['West cargo bay',224,816],['Rail gearbox service',640,816],['Annulus lower monitor',1013,815],
 ['Cryopump service deck',1472,832],['East arrestor winch room',1860,825]
];
const CROPS=[['overview.png',0,0,2048,1024],['01-impulse-lock.png',18,90,425,770],
 ['02-incline-freight-hoists.png',417,105,411,795],['03-annulus-portal.png',784,185,468,680],
 ['04-cryo-coupling-plant.png',1248,135,405,754],['05-east-braking-catcher.png',1611,95,429,815],
 ['06-underworks-and-drive.png',391,695,1251,329]];
const B=(id)=>id>>>0;
function utf8(s){let out=[];for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)out.push(c);else if(c<2048)out.push(192|(c>>6),128|(c&63));else out.push(224|(c>>12),128|((c>>6)&63),128|(c&63));}return new Uint8Array(out);}
function sha256(bytes){let k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let hs=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],len=bytes.length,n=Math.ceil((len+9)/64)*64,buf=new Uint8Array(n);buf.set(bytes);buf[len]=128;let bitlen=len*8;buf[n-4]=(bitlen>>>24)&255;buf[n-3]=(bitlen>>>16)&255;buf[n-2]=(bitlen>>>8)&255;buf[n-1]=bitlen&255;let w=new Int32Array(64);const ro=(x,r)=>(x>>>r)|(x<<(32-r));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++){let j=off+4*i;w[i]=(buf[j]<<24)|(buf[j+1]<<16)|(buf[j+2]<<8)|buf[j+3];}for(let i=16;i<64;i++){let a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(ro(a,7)^ro(a,18)^(a>>>3))+w[i-7]+(ro(b,17)^ro(b,19)^(b>>>10)))|0;}let [a,b,c,d,e,f,g,h]=hs;for(let i=0;i<64;i++){let t1=(h+(ro(e,6)^ro(e,11)^ro(e,25))+((e&f)^(~e&g))+k[i]+w[i])|0,t2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&b)^(a&c)^(b&c)))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}let v=[a,b,c,d,e,f,g,h];for(let i=0;i<8;i++)hs[i]=(hs[i]+v[i])|0;}return hs.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');}
function generate(){let g=new Uint8Array(N);const {EMPTY:E,SLATE:S,CONCRETE:C,STEEL:T,BASALT:B,OBSIDIAN:O,ZINC:Z,IRON:I,QUARTZ:Q}=MATERIAL;let roof=new Int16Array(W),floor=new Int16Array(W);let seed=SEED;const rnd=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function box(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+Math.max(0,x),yy*W+Math.min(W,x+w));}
 function beam(x0,y0,x1,y1,r,m){let dx=x1-x0,dy=y1-y0,len=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/len,0,1),a=x-x0-t*dx,b=y-y0-t*dy;if(a*a+b*b<=r*r)g[y*W+x]=m;}}
 function ellipse(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.ceil(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let t=(y-cy)/ry,d=rx*Math.sqrt(Math.max(0,1-t*t));box(Math.ceil(cx-d),y,Math.max(1,Math.floor(cx+d)-Math.ceil(cx-d)+1),1,m);}}
 function poly(pts,m){let ys=pts.map(p=>p[1]);for(let y=Math.max(0,Math.ceil(Math.min(...ys)));y<Math.min(H,Math.ceil(Math.max(...ys)));y++){let xs=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length];if(a[1]!=b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
 // Load-bearing basalt stratum + open cavity with genuinely asymmetric fault banks.
 for(let x=0;x<W;x++){let wave=8*Math.sin(x*.006)+5*Math.sin(x*.021),north=112+wave+30*Math.exp(-(((x-1100)/245)**2)),south=911-13*Math.sin(x*.007)-42*Math.exp(-(((x-485)/220)**2))-36*Math.exp(-(((x-1540)/215)**2));roof[x]=Math.round(north);floor[x]=Math.round(south);for(let y=0;y<roof[x];y++)g[y*W+x]=y<16?S:y>roof[x]-22?T:(y%113<15?O:B);for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+23?C:(y>978&&Math.floor(x/193)%2?O:B);}
 box(0,0,12,H,C);box(W-12,0,12,H,C);
 // WEST INJECTION: singular triangular charge capacitor, arched throat and lifted cargo deck.
 poly([[40,roof[40]],[125,roof[125]],[286,329],[259,350],[179,283]],T);beam(179,283,212,298,11,Z);
 beam(78,floor[78],145,727,22,C);beam(145,727,233,723,11,T);box(115,697,59,26,I);box(128,684,35,13,Q);
 poly([[275,floor[275]],[376,floor[376]],[359,741],[317,728],[301,772]],C);box(309,744,45,11,Z);
 // EASTBOUND CARGO RAMPS: two facing unequal cargo hoists and an open 90px throat.
 poly([[415,roof[415]],[517,roof[517]],[628,439],[591,461],[475,346]],T);beam(516,roof[516],574,413,13,I);box(548,414,33,13,Q);
 poly([[578,floor[578]],[739,floor[739]],[704,653],[677,614],[620,679]],C);beam(692,floor[692],686,657,13,I);box(645,700,77,15,T);
 beam(745,roof[745],777,405,17,T);beam(744,floor[744],770,760,19,C);box(750,392,64,14,Z);box(755,737,60,14,Q);
 // CENTRAL ANNULAR INDUCTION GATE: one unmistakable interrupted 356px ring, not repeated sawtooth baffles.
 // Outer ring and inner cavity; concentric induction bands. A large left/right gap at 435-582
 // means the central aperture is directly entered at Midge collision scale.
 ellipse(1013,510,184,185,I);ellipse(1013,510,160,161,E);
 ellipse(1013,510,172,173,Z);ellipse(1013,510,164,165,E);
 box(820,426,393,166,E); // wide opposed access notches through the annulus ring sides
 // The real annular *upper* and *lower* arcs are anchored to bedrock at different points.
 beam(1013,roof[1013],1013,330,20,T);beam(964,682,937,floor[937],22,C);beam(1066,679,1090,floor[1090],20,C);
 // Inside the annulus: grounded resonance caliper, radial readout and two switched cargo tongues.
 beam(972,roof[972],972,386,12,Z);beam(1052,roof[1052],1052,388,12,I);box(980,376,63,11,Q);
 beam(920,floor[920],954,660,14,T);beam(1110,floor[1110],1074,655,14,T);
 box(931,625,58,19,Z);box(1051,629,50,16,Q);
 // Left/right induction jaw shapes physically connect to floor, preserving two annular diversion heights.
 beam(821,floor[821],842,635,20,C);beam(1200,floor[1200],1181,630,18,C);
 // Dynamic-looking static switch indicators: physically grounded to ring arcs only.
 for(let j=0;j<5;j++){let x=890+j*55;box(x,337+Math.abs(j-2)*10,13,19,j%2?Z:Q);}
 // CRYOPUMP and COUPLING STACK: widely spaced three massive functional plant assemblies.
 poly([[1303,floor[1303]],[1415,floor[1415]],[1414,679],[1388,635],[1330,655]],C);
 box(1327,696,68,20,I);box(1343,675,32,14,Q);
 beam(1325,roof[1325],1360,393,17,T);beam(1360,393,1410,431,11,Z);box(1380,413,47,13,Q);
 poly([[1480,roof[1480]],[1605,roof[1605]],[1567,427],[1536,432],[1520,347]],T);
 beam(1550,roof[1550],1550,386,9,Z);box(1539,374,46,14,Q);
 poly([[1580,floor[1580]],[1716,floor[1716]],[1684,681],[1642,657],[1605,710]],C);
 beam(1669,690,1660,714,13,I);box(1637,711,52,10,Z);
 // EAST ARRESTOR: dissimilar giant semicircular catcher and two distinct return/landing jaws.
 ellipse(1836,571,161,170,T);ellipse(1836,571,139,146,E);box(1650,391,410,229,E);
 beam(1930,roof[1930],1876,396,21,I);beam(1876,396,1911,422,13,Z);box(1870,397,47,13,Q);
 beam(2012,floor[2012],1911,733,27,C);beam(1911,733,1858,736,12,T);
 beam(1740,floor[1740],1790,744,19,C);box(1780,736,52,12,Z);
 // Unique occupied operator galleries with cross-flow access, not repetitive open boxes.
 const offices=[
  [175,165,157,96,0],[564,182,143,91,1],[920,154,168,108,2],
  [1416,169,172,105,3],[1796,151,156,99,4]
 ];
 for(let [x,y,w,h,t] of offices){box(x,y,w,h,E);box(x+10,y+h-15,w-20,15,T);box(x+10,y+17,14,h-32,I);box(x+w-26,y+16,14,h-30,I);
  if(t===0){box(x+36,y+h-53,61,38,Z);box(x+43,y+h-65,39,12,Q);beam(x+123,y+h-16,x+119,y+h-60,8,I);}
  if(t===1){beam(x+34,y+h-14,x+70,y+h-65,12,I);box(x+82,y+h-41,47,26,Z);box(x+90,y+h-52,31,11,Q);}
  if(t===2){box(x+24,y+h-63,53,49,I);box(x+32,y+h-72,34,10,Q);box(x+105,y+h-42,35,26,Z);}
  if(t===3){for(let a=0;a<3;a++){box(x+23+a*49,y+h-34-(a%2)*9,27,18+(a%2)*9,I);box(x+29+a*49,y+h-42-(a%2)*9,16,9,Q);}}
  if(t===4){box(x+38,y+h-69,50,54,Z);box(x+46,y+h-78,30,11,Q);beam(x+100,y+h-14,x+126,y+h-54,10,I);}
  // An open door and a vertical free access shaft at a separate side of the control deck.
  let shaft=x+w-36;box(shaft,y+h-32,38,94,E);box(shaft-8,y+h+43,8,17,Z);
 }
 // Differentiated operator workvaults, each uses foundation and a broad usable vertical entrance.
 const vaults=[[121,292,0],[519,256,1],[904,224,2],[1324,290,3],[1737,249,4]];
 for(let [x,w,t] of vaults){let y=784,h=135;box(x,y,w,h,E);box(x-5,y+h-20,w+10,20,C);box(x+12,y+21,15,100,T);box(x+w-27,y+16,15,103,T);
 if(t===0){box(x+35,y+74,95,41,I);box(x+52,y+61,56,13,Z);beam(x+170,y+112,x+208,y+65,11,T);}
 if(t===1){ellipse(x+83,y+82,45,39,I);ellipse(x+83,y+82,27,22,E);box(x+156,y+83,61,31,T);box(x+166,y+69,37,14,Q);}
 if(t===2){beam(x+44,y+115,x+104,y+43,17,I);beam(x+162,y+115,x+107,y+52,13,T);box(x+82,y+29,54,11,Z);}
 if(t===3){for(let a=0;a<3;a++){box(x+29+a*75,y+78-(a%2)*15,46,36+(a%2)*15,I);box(x+36+a*75,y+66-(a%2)*15,31,12,Q);}}
 if(t===4){box(x+31,y+74,64,40,T);box(x+43,y+62,38,12,Z);beam(x+112,y+118,x+178,y+65,14,I);}
 // Side portals into rooms, no full-width roof troughs. Service shafts remain flyable.
 let entrance=x+Math.floor(w/2);box(entrance-31,710,62,144,E);
 }
 // Freight support cables with individually different engineering, each grounded to existing machinery.
 beam(316,roof[316],390,345,8,I);beam(390,345,405,347,7,Q);
 beam(1438,roof[1438],1432,371,9,I);box(1433,367,20,20,Z);
 beam(1714,roof[1714],1772,400,8,T);box(1770,398,29,13,Q);
 // Deliberate route windows at both annulus exits and catcher. They remain actual empty cells.
 box(811,445,78,99,E);box(1144,430,83,91,E);box(1144,541,85,62,E);
 // Reattach side gates as physical directions, but keep 31x27 clearances for literal sites.
 box(1241,607,18,84,Z);beam(1250,691,1265,floor[1265],12,C);
 box(1284,342,17,73,Z);beam(1292,342,1298,roof[1298],11,T);
 // Structural commissioning: real continuous bearing links, not suspended scenery.
 // The annular halves have different load paths into the basalt roof and concrete bedplate.
 beam(875,roof[875]-4,876,369,16,T);beam(861,746,867,floor[867]+5,15,C);
 beam(1927,roof[1927]-3,1930,384,13,T);
 beam(674,760,674,floor[674]+8,14,C);beam(1717,750,1717,floor[1717]+5,14,C);
 beam(1946,757,1946,floor[1946]+5,14,C);
 beam(582,roof[582]-3,587,218,13,T);
 beam(326,767,325,floor[325]+8,13,C);
 // Attach genuinely functional upper displays and lower machinery to nearby frames.
 beam(1069,210,1069,267,9,I);beam(1510,232,1510,278,10,I);
 beam(1571,195,1571,280,10,T);beam(312,210,312,280,9,T);
 beam(1015,631,1015,706,11,I);
 // Commissioning completion: supported annular bed, upper instrument mounts and shop tools.
 beam(1141,681,1141,floor[1141]+8,18,C);beam(1070,680,1070,floor[1070]+8,17,C);
 beam(1795,733,1795,floor[1795]+8,16,C);
 beam(1800,856,1800,921,11,I);
 beam(1063,roof[1063],1063,189,12,T);
 beam(1564,roof[1564],1564,191,12,T);
 beam(1460,858,1460,915,11,I);
 beam(1373,865,1373,913,10,I);beam(1525,863,1525,915,11,I);
 beam(950,630,952,700,11,I);
 beam(292,315,281,338,7,T);beam(667,318,666,roof[666]+7,8,T);
 // Open real 64px vertical arrival throats through the five staffed galleries.
 // Interiors retain district-specific equipment on either side of the access.
 for(let [cx,start,end]of [[239,194,361],[640,208,353],[1048,203,347],[1490,205,363],[1850,198,346]])box(cx-29,start,58,end-start,E);
 // Distinct lateral access to the annular lower drive monitor, not a guessed nearest site.
 box(782,790,211,55,E);box(979,658,69,201,E);
 // Root the left retained annular girder after opening the service riser.
 beam(952,740,952,floor[952]+7,16,C);
 box(999,618,30,40,E);
 // Bearing attachments after access-door clearances; grounded to original rock envelope.
 beam(763,733,763,floor[763]+7,15,C);
 beam(1578,roof[1578],1579,253,13,T);beam(1544,roof[1544],1544,389,15,T);
 beam(313,roof[313],312,215,12,T);
 beam(1811,roof[1811],1811,208,11,T);
 beam(288,322,310,264,9,I);
 // Remove two severed instrument stubs rather than pretending they are load-bearing.
 box(620,191,29,25,E);box(1073,203,8,71,E);
 // Re-open deliberate operator entrances after decorative strokes; retain actual machine faces elsewhere.
 return g;
}
function encodeRects(g){let active=new Map(),out=[];for(let y=0;y<H;y++){let next=new Map();let row=y*W,x=0;while(x<W){let m=g[row+x],a=x;while(x<W&&g[row+x]===m)x++;if(!m)continue;let key=a+':'+(x-a)+':'+m,r=active.get(key);if(r){r[3]++;next.set(key,r);}else next.set(key,[a,y,x-a,1,m]);}for(let [key,r] of active)if(!next.has(key))out.push(r);active=next;}for(let r of active.values())out.push(r);out.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);let work=0;for(let r of out)work+=r[2]*r[3];return {rects:out,work};}
function centreReach(g,cw,ch){const ix=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let sum=0,off=(y-1)*W,row=y*(W+1),prev=row-(W+1);for(let x=1;x<=W;x++){sum+=(g[off+x-1]!==0)?1:0;ix[row+x]=ix[prev+x]+sum;}}let hw=(cw-1)>>1,hh=(ch-1)>>1,free=new Uint8Array(N);for(let y=hh;y<H-hh;y++){let ya=y-hh,yb=y+hh+1;for(let x=hw;x<W-hw;x++){let xa=x-hw,xb=x+hw+1,occ=ix[yb*(W+1)+xb]-ix[ya*(W+1)+xb]-ix[yb*(W+1)+xa]+ix[ya*(W+1)+xa];if(!occ)free[y*W+x]=1;}}let start=SITES[0][2]*W+SITES[0][1];if(!free[start])throw Error('Literal spawn blocked '+cw+'x'+ch);let q=new Int32Array(N),vis=new Uint8Array(N),front=0,back=1;q[0]=start;vis[start]=1;while(front<back){let i=q[front++],x=i%W,y=(i/W)|0;const add=j=>{if(free[j]&&!vis[j]){vis[j]=1;q[back++]=j;}};if(x>0)add(i-1);if(x<W-1)add(i+1);if(y>0)add(i-W);if(y<H-1)add(i+W);}let missing=[];for(let [name,x,y]of SITES)if(!free[y*W+x]||!vis[y*W+x])missing.push(name);return {connected:back,missing,reached:SITES.length-missing.length};}
function groundedCheck(g){let visited=new Uint8Array(N),q=new Int32Array(N),front=0,back=0,solid=0;for(let i=0;i<N;i++)if(g[i])solid++;function seed(i){if(g[i]&&!visited[i]){visited[i]=1;q[back++]=i;}}for(let x=0;x<W;x++){seed(x);seed((H-1)*W+x);}for(let y=0;y<H;y++){seed(y*W);seed(y*W+W-1);}while(front<back){let i=q[front++],x=i%W;if(x>0)seed(i-1);if(x<W-1)seed(i+1);if(i>=W)seed(i-W);if(i<N-W)seed(i+W);}return {solid,grounded:back,detached:solid-back};}
const LENBASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LENEX=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
function compress(bytes){let out=[120,1],hold=0,nbit=0;const emit=(v,n)=>{hold|=(v<<nbit);nbit+=n;while(nbit>=8){out.push(hold&255);hold>>>=8;nbit-=8;}};const h=(sym)=>{let code,n;if(sym<=143){code=sym+48;n=8;}else if(sym<=255){code=sym-144+400;n=9;}else if(sym<=279){code=sym-256;n=7;}else{code=sym-280+192;n=8;}for(let i=n-1;i>=0;i--)emit((code>>i)&1,1);};emit(1,1);emit(1,1);emit(0,1);let hash=new Int32Array(65536);hash.fill(-1);let i=0;while(i<bytes.length){let key=i+2<bytes.length?((bytes[i]*257+bytes[i+1]*31+bytes[i+2]*7)&65535):-1,pr=key>=0?hash[key]:-1;if(key>=0)hash[key]=i;let length=0,dist=i-pr;if(pr>=0&&dist<=32768&&dist>0&&bytes[pr]===bytes[i]){let max=Math.min(258,bytes.length-i);while(length<max&&bytes[pr+length]===bytes[i+length])length++;}if(length>=4){let j=LENBASE.length-1;while(j>0&&LENBASE[j]>length)j--;h(257+j);emit(length-LENBASE[j],LENEX[j]);let k=DB.length-1;while(k>0&&DB[k]>dist)k--;for(let j=4;j>=0;j--)emit((k>>j)&1,1);emit(dist-DB[k],DE[k]);for(let t=1;t<length;t++){let at=i+t;if(at+2<bytes.length)hash[(bytes[at]*257+bytes[at+1]*31+bytes[at+2]*7)&65535]=at;}i+=length;}else{h(bytes[i]);i++;}}h(256);if(nbit>0)out.push(hold&255);let aa=1,bb=0;for(let x of bytes){aa=(aa+x)%65521;bb=(bb+aa)%65521;}out.push((bb>>>8)&255,bb&255,(aa>>>8)&255,aa&255);return new Uint8Array(out);}
function crc32(a){let v=0xffffffff;for(let b of a){v^=b;for(let j=0;j<8;j++)v=(v>>>1)^((v&1)?0xedb88320:0);}return (v^0xffffffff)>>>0;}
const be32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
function png(g,x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);let pal=new Uint8Array(768);for(let j=0;j<256;j++)pal.set([8,13,24],j*3);for(let [id,v]of Object.entries(PAL))pal.set(v,+id*3);let ih=Uint8Array.from([...be32(w),...be32(h),8,3,0,0,0]);let chunks=[];function chunk(name,data){let k=utf8(name),sum=new Uint8Array(4+data.length);sum.set(k);sum.set(data,4);chunks.push(Uint8Array.from([...be32(data.length),...sum,...be32(crc32(sum))]));}chunk('IHDR',ih);chunk('PLTE',pal);chunk('IDAT',compress(raw));chunk('IEND',new Uint8Array(0));let sz=8+chunks.reduce((a,b)=>a+b.length,0),out=new Uint8Array(sz),o=8;out.set([137,80,78,71,13,10,26,10]);for(let c of chunks){out.set(c,o);o+=c.length;}return out;}
function build(){let g=generate();if(g.length!==2097152||POLICY.length!==55)throw Error('grid/policy');let anchored=groundedCheck(g);if(anchored.detached)throw Error('DETACHED '+JSON.stringify(anchored));let {rects,work}=encodeRects(g);if(rects.length>32768||work>32000000)throw Error('source construction capacity');let replay=new Uint8Array(N);for(let [x,y,w,h,m]of rects){if(!PAL[m]||m===0||x<0||y<0||x+w>W||y+h>H)throw Error('illegal rect');for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=yy*W+xx;if(replay[i])throw Error('overlap');replay[i]=m;}}for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error('replay mismatch '+i);let clr={};for(let [w,h]of [[19,15],[23,19],[31,27]]){let r=centreReach(g,w,h);clr[w+'x'+h]=r;if(r.missing.length)throw Error('Midge site '+w+'x'+h+': '+r.missing);}
 const obstruct=[1146,409,75,109],blocked=g.slice();for(let y=obstruct[1];y<obstruct[1]+obstruct[3];y++)blocked.fill(MATERIAL.CONCRETE,y*W+obstruct[0],y*W+obstruct[0]+obstruct[2]);let alt=centreReach(blocked,31,27);if(alt.missing.length!==1||alt.missing[0]!=='Upper annulus exit')throw Error('Obstruction fails '+JSON.stringify(alt));
 let hist={};for(let x of g)hist[x]=(hist[x]||0)+1;let setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:MIDGE,spawn:[150,640],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};let setupText=JSON.stringify(setup),setupBytes=utf8(setupText);if(setupBytes.length>1048576)throw Error('Setup bytes');let files=[{name:'setup-umbral-induction-dock.json',data:setupText,text:true}];let pics={};for(let [name,x,y,w,h]of CROPS){let img=png(g,x,y,w,h);files.push({name,data:img});pics[name]={x,y,w,h,bytes:img.length,sha256:sha256(img),parity:'source builder true; independent verifier required'};}
 let receipt={kind:'UMBRAL_INDUCTION_DOCK_ORIGINAL_RACING_WIDE',revision:'R1',seed:'0x1d07b620',engine_main_sha:'7b03aa437561ec63e31fd09531171360ab60eeb4',material_cells:N,extent:[W,H],rectangles:rects.length,setup_json_bytes:setupBytes.length,work_visits:work,source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram:hist,grounded_solids:anchored.grounded,remaining_detached:0,fluids:0,reactive:0,material_laws:'49 Slate / 58 ReinforcedConcrete / 62 SteelPlate / 100 BasaltColumns / 101 Obsidian / 113 ZincSheet / 117 BareIron / 122 QuartzCrystal: inert nonmoving Solid, RuleKernel None',midge:{hull:[4,3],model_hash:MIDGE,spawn:[150,640]},sites:SITES.map(([name,x,y])=>({name,x,y})),clearances:clr,physical_obstruction:{xywh:obstruct,missing:alt.missing,remaining:alt.reached,finish_reachable:!alt.missing.includes('Finish / coil lock')},grid_sha256:sha256(g),setup_sha256:sha256(setupBytes),pngs:pics,native:'NATIVE-UNTESTED; installed bridge capacity not measured; flight/collisions/save-reopen not tested'};
 files.push({name:'qualification.json',data:JSON.stringify(receipt,null,2)+'\n',text:true});return {files,receipt,grid:g};}
if(typeof module!=='undefined')module.exports={build,generate,encodeRects,centreReach,groundedCheck,sha256,utf8,W,H,N,MATERIAL,SITES,CROPS};
if(typeof require==='function'&&require.main===module){const fs=require('node:fs');let r=build();for(let f of r.files)fs.writeFileSync(__dirname+'/'+f.name,f.text?f.data:Buffer.from(f.data));console.log(JSON.stringify({rectangles:r.receipt.rectangles,setup_bytes:r.receipt.setup_json_bytes,grounded:r.receipt.grounded_solids,sha:r.receipt.grid_sha256,clears:r.receipt.clearances,obstruction:r.receipt.physical_obstruction,pngs:r.receipt.pngs},null,2));}
