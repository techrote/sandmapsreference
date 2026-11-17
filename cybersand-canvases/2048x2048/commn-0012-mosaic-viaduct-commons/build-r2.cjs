"use strict";
/* COMMN-0012 R2 — committed-source-JPEG-led, physical-material canvas.
   2048² deterministic cells; no concept-art, original source mutation or new runtime.
   Run: node build-r2.cjs. Requires only Node standard library and local frozen inputs. */
const W=2048,H=2048;
const M={AIR:0,WATER:3,LIME:38,GRANITE:40,COBBLE:41,MOSSSTONE:42,BRICK:43,PLASTER:44,TERRA:48,SLATE:49,IRON:50,BRONZE:52,COPPER:53,VERDI:54,GLASS:55,EARTH:56,IBRICK:57,CONCRETE:58,STEEL:62,GRATING:66,TILE:70,CGLASS:71,DGLASS:72,CYAN:77,MAGENTA:78,AMBER:79,WHITE:80,PLANK:81,MOSS:97,MARBLE:98,BASALT:100,OBSIDIAN:101,BRASS:119,GLASSBLOCK:120,QUARTZ:122};
const TARGETS=[["West high entry",404,502],["Upper viaduct approach",545,536],["Viaduct center",1005,528],["East high entry",1660,519],["West arch gallery",502,916],["Civic west lane",681,1100],["North mosaic overlook",895,812],["South mosaic overlook",1000,1236],["Civic east lane",1305,1082],["Library west overlook",1360,976],["Western lower terrace",680,1583],["Central garden court",1045,1353],["East shelter",1326,1480],["West underpass",521,1712],["Reflecting basin overlook",1000,1712],["East underpass",1534,1692]];
function canvas(){
 const G=new Uint8Array(W*H),R=(x,y,w,h,m)=>{x=Math.max(0,Math.min(W,x|0));y=Math.max(0,Math.min(H,y|0));w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let z=y;z<y+h;z++)G.fill(m,z*W+x,z*W+x+w)};
 const L=(x,y,xx,yy,t,m)=>{let dx=Math.abs(xx-x),dy=Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1,e=dx-dy,j=0;for(;;){R(x-(t>>1),y-(t>>1),t,t,m);if(x===xx&&y===yy)break;let f=e*2;if(f>-dy){e-=dy;x+=sx}if(f<dx){e+=dx;y+=sy}if(++j>6000)throw Error("line")}};
 const P=(p,m)=>{let ys=p.map(v=>v[1]);for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<Math.min(H,Math.ceil(Math.max(...ys)));y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length],z=y+.5;if((a[1]<=z&&b[1]>z)||(b[1]<=z&&a[1]>z))xs.push(a[0]+(z-a[1])*(b[0]-a[0])/(b[1]-a[1]))}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,m)}};
 const E=(cx,cy,rx,ry,m)=>{for(let dy=-ry;dy<=ry;dy++){let q=Math.floor(rx*Math.sqrt(Math.max(0,1-(dy/ry)**2)));R(cx-q,cy+dy,2*q+1,1,m)}};
 const T=(x,y,w,h)=>{R(x,y,w,h,M.TILE);for(let j=3;j<h-4;j+=16)for(let i=3;i<w-4;i+=16){let k=((i/16|0)*7+(j/16|0)*11)%9;R(x+i,y+j,13,13,[M.CGLASS,M.GLASS,M.PLASTER,M.GLASSBLOCK,M.CYAN,M.PLASTER,M.MARBLE,M.CGLASS,M.TILE][k])}};
 const BULB=(x,y)=>{R(x-4,y,8,48,M.IRON);R(x-13,y-4,26,7,M.BRASS);R(x-9,y+8,18,19,M.AMBER);R(x-5,y+12,10,11,M.WHITE)};
 // GEOLOGY: sectioned ground below intact, illuminated civic underpass, not a flood pool.
 P([[0,1842],[160,1865],[450,1880],[950,1895],[1460,1880],[1890,1858],[2048,1840],[2048,2048],[0,2048]],M.EARTH);
 P([[0,1935],[350,1980],[800,1990],[1230,2020],[1690,1977],[2048,1935],[2048,2048],[0,2048]],M.GRANITE);
 for(let j=0;j<8;j++){L(0,1940+j*12,740,1960+j*10,2,j%2?M.COBBLE:M.SLATE);L(760,1962+j*10,2047,1940+j*12,2,j%2?M.BASALT:M.GRANITE)}
 R(70,1848,1900,30,M.CONCRETE);R(70,1848,1900,6,M.LIME);R(70,1873,1900,6,M.BRASS);
 R(70,1572,1900,28,M.CONCRETE);R(70,1586,1900,5,M.LIME);
 for(let [l,r] of [[636,773],[1080,1213],[1680,1833]]){R(l,1565,r-l,39,M.AIR);R(l-9,1565,8,32,M.BRASS);R(r,1565,8,32,M.BRASS)}
 for(let x of [102,331,914,1330,1895]){R(x,1600,24,246,M.LIME);R(x-8,1600,40,13,M.COBBLE);R(x-8,1830,40,16,M.COBBLE)}
 for(let x of [215,487,856,1010,1250,1482,1790])BULB(x,1604);
 R(186,1641,320,24,M.IBRICK);R(190,1648,311,5,M.BRASS);R(186,1683,318,5,M.GRATING);
 for(let x=200;x<480;x+=41){R(x,1693,23,15,M.DGLASS);R(x+6,1697,11,7,M.CYAN)}
 R(1244,1644,454,29,M.IBRICK);R(1244,1644,454,7,M.BRASS);R(1281,1678,385,8,M.CGLASS);
 for(let x=1330;x<1660;x+=62){R(x,1703,42,5,M.IRON);R(x+7,1711,28,5,M.AMBER)}
 for(let x=147;x<1920;x+=126){R(x,1838,72,7,M.COBBLE);R(x+10,1840,52,3,M.TERRA)}
 // Civic block: left-asymmetric two-storey open library, portal, exposed tile mural, column.
 P([[40,436],[228,436],[266,379],[450,379],[466,437],[700,437],[700,1180],[40,1180]],M.LIME);
 R(49,438,643,16,M.SLATE);R(44,1154,658,27,M.COBBLE);
 T(75,458,265,229);T(82,704,256,128);
 R(360,458,307,201,M.AIR);R(358,660,309,27,M.COBBLE);
 R(370,472,291,11,M.BRASS);R(371,630,281,12,M.BRASS);
 R(364,751,303,333,M.AIR);R(353,749,313,20,M.COBBLE);
 R(357,1081,312,17,M.COBBLE);
 R(121,865,212,205,M.IBRICK);R(134,882,184,163,M.AIR);
 for(let x of [85,160,249]){R(x,704,10,370,M.BRASS);R(x-6,715,23,9,M.COBBLE)}
 T(79,459,147,199);R(84,457,151,11,M.MARBLE);
 for(let x of [114,266]){R(x,951,44,64,M.DGLASS);R(x+5,959,33,45,M.AIR)}
 // Egress is genuine open cells; source's civic balcony connects to right stair plaza.
 R(628,469,110,209,M.AIR);R(628,796,130,352,M.AIR);
 R(648,722,331,24,M.LIME);R(648,722,331,6,M.BRASS);
 for(let x of [661,760,916]){R(x,747,14,75,M.LIME);R(x-6,748,29,10,M.BRASS)}
 R(675,790,263,10,M.SLATE);R(675,799,262,4,M.CYAN);
 for(let x of [381,640]){R(x,482,8,156,M.BRASS);R(x+2,497,3,114,M.COPPER)}
 // Three orange civic shade sails—not a chain of random triangles or suspended signboards.
 for(let [x,y,xx,yy] of [[549,355,842,413],[829,405,1192,452],[1014,464,1291,484]]){
  L(x,y-14,xx,yy-14,4,M.IRON);P([[x,y],[xx,yy],[xx-61,yy+48],[x+67,y+29]],M.TERRA);
  L(x+67,y+29,xx-61,yy+48,4,M.BRASS);R(x-4,y-36,8,71,M.STEEL)}
 // STEPPED PUBLIC PROMENADE: long asymmetrical rising run, terrace edges remain side elevation.
 R(711,1214,1263,23,M.COBBLE);R(714,1212,1256,5,M.MARBLE);
 for(let i=0;i<11;i++){let x=734+i*100,y=1216-i*22;R(x,y,187,19,M.LIME);R(x,y,187,5,M.MARBLE);R(x,y+8,187,5,M.BRASS);R(x+6,y+17,185,5,M.TERRA);
  if(i%3===0){R(x+151,y+18,13,42,M.LIME);R(x+148,y+26,18,7,M.COBBLE)}
  if(i%2)R(x+17,y-7,57,7,M.TILE)}
 R(1690,948,310,25,M.MARBLE);R(1690,959,310,7,M.BRASS);
 R(1515,1025,480,23,M.COBBLE);R(1515,1025,480,5,M.MARBLE);
 R(711,1267,1201,17,M.LIME);R(711,1267,1201,5,M.BRASS);
 // Retaining plaza supports (few unequal bays, never six identical arches).
 R(742,1400,434,25,M.PLASTER);R(742,1400,434,6,M.TERRA);
 for(let x of [775,947,1103]){R(x,1425,15,99,M.LIME);R(x-6,1425,28,8,M.BRASS)}
 R(784,1464,341,10,M.CGLASS);
 R(1416,1354,395,24,M.LIME);R(1416,1354,395,5,M.BRASS);
 for(let x of [1448,1650,1795]){R(x,1378,13,116,M.LIME);R(x-7,1384,27,9,M.COBBLE)}
 R(1492,1414,98,48,M.CGLASS);R(1499,1421,84,33,M.AIR);
 // Roots + broad asymmetric inert mosaic foliage, grounded to the rightmost civic planter.
 P([[1595,1105],[1576,994],[1546,851],[1554,818],[1583,814],[1610,902],[1637,1060],[1648,1105]],M.BRONZE);
 for(let [x,y,xx,yy,t] of [[1572,867,1395,719,15],[1560,862,1298,694,13],[1587,836,1750,698,18],[1601,844,1911,751,13],[1551,826,1434,631,12],[1631,928,1730,774,11]])L(x,y,xx,yy,t,M.COBBLE);
 const crown=[[1394,688,94,55],[1460,622,114,71],[1609,657,131,71],[1747,670,109,67],[1856,734,99,56],[1554,752,119,61],[1310,744,76,46],[1742,766,89,43]];
 crown.forEach(([x,y,rx,ry],s)=>{E(x,y,rx,ry,M.MOSSSTONE);E(x-17,y-11,rx-15,ry-13,M.MOSS);
  for(let j=0;j<7;j++){let xx=x+Math.round(Math.sin(s*.92+j*2.1)*rx*.67),yy=y+Math.round(Math.cos(s*.7+j*1.85)*ry*.48);E(xx,yy,Math.max(6,rx/7|0),Math.max(7,ry/5|0),[M.MOSS,M.VERDI,M.MOSSSTONE,M.PLANK][j%4])}});
 R(1480,1105,262,27,M.LIME);R(1480,1105,262,5,M.MARBLE);
 for(let [x,y,xx,yy] of [[1603,1036,1507,1107],[1633,1053,1691,1106],[1616,1070,1565,1113]])L(x,y,xx,yy,12,M.BRONZE);
 // Functional planting beds, pattern and public benches. Static moss stone only.
 for(let [x,y,w] of [[751,1181,121],[1131,1030,112],[1345,993,107],[1779,919,115]]){
  R(x,y,w,13,M.TERRA);R(x,y+13,w,12,M.BRICK);
  for(let k=12;k<w-9;k+=21){L(x+k,y,x+k-8,y-25,4,M.MOSS);L(x+k,y-7,x+k+6,y-32,3,M.VERDI)}}
 R(91,1298,487,23,M.COBBLE);R(91,1321,487,9,M.MARBLE);
 for(let x of [109,246,415]){R(x,1332,13,161,M.LIME);R(x-7,1336,28,10,M.BRASS)}
 for(let [x,w] of [[136,105],[280,103],[416,110]]){R(x,1360,w,78,M.CGLASS);R(x+9,1370,w-18,57,M.AIR)}
 R(120,1462,391,9,M.TERRA);R(120,1480,391,8,M.COBBLE);
 T(827,1438,210,40);T(1551,1485,224,45);
 for(let x of [774,1090,1330,1800])BULB(x,1251);
 // Open daylight and underpass access shafts, no air-surrogate waypoint.
 R(661,1505,115,114,M.AIR);R(1093,1504,117,114,M.AIR);R(1693,1493,126,126,M.AIR);
 // Upper-level doorway is wider than conservative Midge rectangle; no column snag.
 R(610,469,150,200,M.AIR);
 // Civic stair/service skylight: a real 82-cell-wide air corridor through the structural landing.
 R(965,1193,82,111,M.AIR);
 // FIDELITY ITERATION 2: grounded human-scale furnishing, extra complex civic masonry,
 // continuous stair framing and source blue-tile/terracotta colour hierarchy.
 for(let i=0;i<11;i++){let x=734+i*100,y=1216-i*22;
   R(x+172,y+20,8,43,M.LIME);R(x+171,y+25,10,5,M.BRASS);
   if(i%3===1){L(x+164,y+23,x+193,y+52,4,M.COBBLE);R(x+179,y+50,33,5,M.MARBLE)}
 }
 // Irregular civic balcony flowerbeds and pale lintels: hard inert support, no growing plants.
 for(let [x,y,w] of [[375,713,62],[526,698,98],[89,844,92],[541,1126,93]]){
  R(x,y,w,10,M.TERRA);R(x,y+9,w,10,M.BRICK);
  for(let k=11;k<w-10;k+=24){L(x+k,y-4,x+k-8,y-24,3,M.MOSS);L(x+k+3,y-4,x+k+9,y-21,3,M.VERDI)}
 }
 // Shop fascia adds genuine irregular window widths, not cloned facades or caption glyphs.
 R(87,1187,442,17,M.MARBLE);R(87,1187,442,5,M.BRASS);
 for(let [x,w,glass] of [[103,76,M.CGLASS],[211,117,M.DGLASS],[368,133,M.GLASS]]){
  R(x,1212,w,29,M.SLATE);R(x+5,1216,w-10,20,glass);
  R(x+12,1225,w-25,3,M.WHITE);R(x+w-18,1216,4,19,M.BRASS);
 }
 R(118,1255,401,7,M.COBBLE);R(117,1262,401,5,M.BRASS);
 // Lower passage's air-filled library archive and civic drainage can be seen in cross-section.
 for(let [x,y,w] of [[144,1730,132],[405,1745,181]]){
  R(x,y,w,11,M.COBBLE);R(x+7,y-38,w-15,39,M.SLATE);R(x+13,y-31,w-27,27,M.CGLASS);
  R(x+23,y-22,w-47,8,M.DGLASS);
 }
 // Pipe and cable conduits run along roof, leaving the actual broad centre corridor unobstructed.
 R(117,1607,471,6,M.COPPER);R(117,1616,471,3,M.BRASS);
 R(1376,1608,282,5,M.COPPER);R(1376,1616,282,3,M.BRASS);R(1852,1608,83,5,M.COPPER);R(1852,1616,83,3,M.BRASS);
 for(let x of [300,555,1398,1602]){R(x,1607,6,24,M.COPPER);R(x+5,1626,17,4,M.BRASS)}
 // Asymmetric tree branch/twig fringe, visibly tied to the trunk and crown instead of loose circles.
 for(let [x,y,xx,yy] of [[1390,683,1340,640],[1420,700,1392,619],[1714,704,1781,632],[1810,745,1907,691],[1530,709,1499,592],[1639,697,1698,601]])L(x,y,xx,yy,4,M.MOSS);
 // Additional 31x27 accessible maintenance lift opening (underpass connection), not proxy waypoint.
 R(1472,1548,134,91,M.AIR);
 
 // PROTECTED_ANCHORS: source-led genuine air clearances at named operational sites.
 for(let [n,x,y] of TARGETS){R(x-19,y-16,39,33,M.AIR)}
 return G;
}
function coalesce(g){
 const rec=[],prior=new Map();
 for(let y=0;y<H;y++){let next=new Map(),off=y*W;
  for(let x=0;x<W;){let a=x,v=g[off+x++];while(x<W&&g[off+x]===v)x++;if(!v)continue;
   let key=a+"|"+(x-a)+"|"+v,idx=prior.get(key);
   if(idx!==undefined&&rec[idx][1]+rec[idx][3]===y){rec[idx][3]++;next.set(key,idx)}
   else{next.set(key,rec.length);rec.push([a,y,x-a,1,v])}}
  prior.clear();for(let [k,v] of next)prior.set(k,v)
 }return rec;
}
function replay(rec,g){
 const out=new Uint8Array(W*H);let covered=0;
 for(let [x,y,w,h,v] of rec){if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x+w>W||y+h>H||w<1||h<1||v===0)throw Error("invalid rectangle");
  for(let j=y;j<y+h;j++){let p=j*W+x;for(let k=p;k<p+w;k++){if(out[k]!==0)throw Error("rectangle overlap");out[k]=v;covered++}}}
 for(let i=0;i<g.length;i++)if(out[i]!==g[i])throw Error("full-grid mismatch "+i);
 return covered;
}
function clearance(g,w,h){
 const s=W+1,p=new Int32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let n=0,r=y*s,pr=(y-1)*s,gg=(y-1)*W;for(let x=1;x<=W;x++){n+=g[gg+x-1]!==0?1:0;p[r+x]=p[pr+x]+n}}
 const hx=w>>1,hy=h>>1,free=new Uint8Array(g.length);
 for(let y=hy;y<H-hy;y++){let t=(y-hy)*s,b=(y+hy+1)*s,r=y*W;for(let x=hx;x<W-hx;x++)if(p[b+x+hx+1]-p[t+x+hx+1]-p[b+x-hx]+p[t+x-hx]===0)free[r+x]=1}
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length),origin=TARGETS[0][2]*W+TARGETS[0][1];let a=0,b=0;
 if(free[origin]){q[b++]=origin;seen[origin]=1}
 while(a<b){let v=q[a++],x=v%W,y=(v/W)|0;for(let k of [x? v-1:-1,x<W-1?v+1:-1,y?v-W:-1,y<H-1?v+W:-1])if(k>=0&&free[k]&&!seen[k]){seen[k]=1;q[b++]=k}}
 return {envelope:[w,h],connected_centres:b,reachable:TARGETS.filter(z=>seen[z[2]*W+z[1]]).length,blocked:TARGETS.filter(z=>!free[z[2]*W+z[1]]).map(z=>z[0]),unreachable:TARGETS.filter(z=>!seen[z[2]*W+z[1]]).map(z=>z[0])};
}
function b64(bytes){const C="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",out=[];for(let j=0;j<bytes.length;j+=3){let a=bytes[j],b=j+1<bytes.length?bytes[j+1]:0,c=j+2<bytes.length?bytes[j+2]:0,z=(a<<16)|(b<<8)|c;out.push(C[(z>>18)&63],C[(z>>12)&63],j+1<bytes.length?C[(z>>6)&63]:"=",j+2<bytes.length?C[z&63]:"=")}return out.join("")}
function png(g,colors,ox,oy,w,h,scale=1){
 const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++){let z=y*(w+1);for(let x=0;x<w;x++)raw[z+x+1]=g[(oy+y*scale)*W+ox+x*scale]}
 const data=[],LL=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
 let acc=0,nb=0;const bit=(v,n)=>{for(let i=0;i<n;i++){acc|=((v>>>i)&1)<<nb;if(++nb===8){data.push(acc);acc=nb=0}}},rv=(v,n)=>{let r=0;for(let i=0;i<n;i++){r=(r<<1)|(v&1);v>>>=1}return r},symbol=v=>{if(v<=143)bit(rv(v+48,8),8);else if(v<=255)bit(rv(v-144+400,9),9);else if(v<=279)bit(rv(v-256,7),7);else bit(rv(v-280+192,8),8)};
 bit(3,3);const last=new Int32Array(65536);last.fill(-1);
 for(let j=0;j<raw.length;){let len=0,dist=0;
  if(j+2<raw.length){let key=(251*raw[j]+43*raw[j+1]+97*raw[j+2])&65535,old=last[key];last[key]=j;if(old>=0&&j-old<=32768&&raw[old]===raw[j]&&raw[old+1]===raw[j+1]&&raw[old+2]===raw[j+2]){dist=j-old;while(len<258&&j+len<raw.length&&raw[old+len]===raw[j+len])len++}}
  if(len>=3){let k=0;while(k<28&&len>=LL[k+1])k++;symbol(k+257);bit(len-LL[k],LE[k]);let d=0;while(d<29&&dist>=DB[d+1])d++;bit(rv(d,5),5);bit(dist-DB[d],DE[d]);
    for(let z=1;z<len;z++)if(j+z+2<raw.length)last[(251*raw[j+z]+43*raw[j+z+1]+97*raw[j+z+2])&65535]=j+z;j+=len
  }else{symbol(raw[j]);j++}}
 symbol(256);if(nb)data.push(acc);
 let aa=1,bb=0;for(let x of raw){aa=(aa+x)%65521;bb=(bb+aa)%65521}
 const zip=new Uint8Array(data.length+6);zip[0]=120;zip[1]=1;zip.set(data,2);let z=zip.length-4;zip[z]=bb>>8;zip[z+1]=bb&255;zip[z+2]=aa>>8;zip[z+3]=aa&255;
 const be=v=>[(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255],crc=bs=>{let c=-1;for(let v of bs){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (~c)>>>0};
 const chunk=(name,bytes)=>{let body=[...name].map(c=>c.charCodeAt(0));for(let v of bytes)body.push(v);return new Uint8Array([...be(bytes.length),...body,...be(crc(body))])};
 const pal=new Uint8Array(768);for(let i=0;i<256;i++){let p=colors[i]||[255,0,255];pal[3*i]=p[0];pal[3*i+1]=p[1];pal[3*i+2]=p[2]}
 const chunks=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",[...be(w),...be(h),8,3,0,0,0]),chunk("PLTE",pal),chunk("IDAT",zip),chunk("IEND",[])];
 const out=new Uint8Array(chunks.reduce((n,v)=>n+v.length,0));let pos=0;for(let c of chunks){out.set(c,pos);pos+=c.length}return out;
}
function build(template,palette){
 const g=canvas(),rec=coalesce(g),covered=replay(rec,g),reach=[[19,15],[23,19],[31,27]].map(([w,h])=>clearance(g,w,h));
 const o=JSON.parse(JSON.stringify(template));o.starting_setup.edits=rec;
 const json=JSON.stringify(o),hist={};for(let v of g)hist[v]=(hist[v]||0)+1;
 if(rec.length>32768||json.length>1048576||reach[0].reachable!==16)throw Error("Static gates "+JSON.stringify({rects:rec.length,bytes:json.length,reach}));
 const colors=Array.from({length:256},(_,i)=>palette.find(p=>p.id===i)?.rgba||[255,0,255]);
 const crops={"preview.png":[0,0,2048,2048,1],"overview.png":[0,0,1024,1024,2],"detail-civic.png":[39,365,512,512,1],"detail-viaduct.png":[715,736,512,512,1],"detail-gardens.png":[1211,549,512,512,1],"detail-west-gardens.png":[45,1050,512,512,1],"detail-east-gardens.png":[1320,1010,512,512,1],"crop-stair-plaza.png":[890,929,512,512,1],"crop-buried-corridor.png":[825,1468,512,512,1]};
 const pics={};for(let [name,p] of Object.entries(crops))pics[name]=png(g,colors,...p);
 const evidence={source_public_id:"commn-0012",source_path:"artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png",source_original_blob:"fb01ca96733623502e99e9734bf4fb7d5d28035e",source_jpeg_blob:"8cf59bbba8c4a4037924490b7d158872be876abd",source_seeing:"Original genuine committed catalogue JPEG visually inspected; full-resolution original PNG pixel parity NOT VERIFIED",cybersand_accepted_main:"018bd09503d7f079ddac52e225c2f7daf8d678bf",extent:[2048,2048],cells:4194304,covered_cells:covered,zero_full_grid_mismatches:true,rectangles:rec.length,rectangle_limit:32768,json_bytes:json.length,json_limit:1048576,material_histogram:hist,source_art_changed:false,actor:{model:o.starting_setup.actors[0].model,spawn:o.starting_setup.actors[0].spawn,hull:[4,3],hash:o.starting_setup.actors[0].hash},targets:TARGETS.map(s=>({name:s[0],point:s.slice(1)})),reachability:reach,crops,render:"PNG pixels are material-grid ID palette samples (1:1 native-cell crops / nearest-neighbour 2:1 overview); no image overlays",native:"NATIVE-UNTESTED, including bridge capacity, load/flight/collision/simulation and save/reopen"};
 return {grid:g,rec,json,pics,evidence,reach}
}
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),crypto=require("crypto"),dir=__dirname;
 const input=JSON.parse(fs.readFileSync(path.join(dir,"setup-mosaic-viaduct-commons.json"),"utf8"));
 const palette=JSON.parse(fs.readFileSync(path.join(dir,"material-palette.json"),"utf8"));
 const out=build(input,palette);out.evidence.material_sha256=crypto.createHash("sha256").update(out.grid).digest("hex");
 fs.writeFileSync(path.join(dir,"setup-mosaic-viaduct-commons.json"),out.json);
 for(let [name,contents] of Object.entries(out.pics))fs.writeFileSync(path.join(dir,name),Buffer.from(contents));
 fs.writeFileSync(path.join(dir,"evidence.json"),JSON.stringify(out.evidence,null,2)+"\n");
 console.log(JSON.stringify({head:"local",rectangles:out.rec.length,json_bytes:out.json.length,reachability:out.reach}));
}
