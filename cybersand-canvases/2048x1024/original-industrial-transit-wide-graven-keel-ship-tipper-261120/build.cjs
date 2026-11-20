"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x91A7E65,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
function utf8(s){let b=[];for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)b.push(c);else if(c<2048)b.push(192|c>>6,128|c&63);else if(c>=55296&&c<56320&&i+1<s.length){let d=s.charCodeAt(++i),v=65536+((c-55296)<<10)+(d-56320);b.push(240|v>>18,128|v>>12&63,128|v>>6&63,128|v&63);}else b.push(224|c>>12,128|c>>6&63,128|c&63);}return new Uint8Array(b);}
function sha256(dat){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],r=(x,n)=>x>>>n|x<<32-n;let l=dat.length,q=new Uint8Array(Math.ceil((l+9)/64)*64);q.set(dat);q[l]=128;let bits=l*8;for(let j=0;j<8;j++)q[q.length-1-j]=Math.floor(bits/2**(8*j))&255;let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],v=new Uint32Array(64);for(let i=0;i<q.length;i+=64){for(let j=0;j<16;j++){let p=i+j*4;v[j]=(q[p]<<24|q[p+1]<<16|q[p+2]<<8|q[p+3])>>>0;}for(let j=16;j<64;j++){let a=v[j-15],b=v[j-2];v[j]=(v[j-16]+(r(a,7)^r(a,18)^a>>>3)+v[j-7]+(r(b,17)^r(b,19)^b>>>10))>>>0;}let a=h[0],b=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],z=h[7];for(let j=0;j<64;j++){let t1=(z+(r(e,6)^r(e,11)^r(e,25))+(e&f^~e&g)+k[j]+v[j])>>>0,t2=((r(a,2)^r(a,13)^r(a,22))+(a&b^a&c^b&c))>>>0;z=g;g=f;f=e;e=d+t1>>>0;d=c;c=b;b=a;a=t1+t2>>>0;}h=[h[0]+a>>>0,h[1]+b>>>0,h[2]+c>>>0,h[3]+d>>>0,h[4]+e>>>0,h[5]+f>>>0,h[6]+g>>>0,h[7]+z>>>0];}return h.map(x=>x.toString(16).padStart(8,"0")).join("");}
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function crc(b){let c=0xffffffff;for(let i=0;i<b.length;i++){c^=b[i];for(let j=0;j<8;j++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
function concat(parts){let a=new Uint8Array(parts.reduce((v,z)=>v+z.length,0)),p=0;for(let z of parts){a.set(z,p);p+=z.length;}return a;}
function chunk(t,d){let b=new Uint8Array(d.length+12);b.set(be(d.length),0);for(let j=0;j<4;j++)b[4+j]=t.charCodeAt(j);b.set(d,8);b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b;}
function zipStore(raw){let b=[new Uint8Array([120,1])],p=0,s1=1,s2=0;while(p<raw.length){let n=Math.min(65535,raw.length-p),last=p+n===raw.length;let h=new Uint8Array([last?1:0,n&255,n>>>8&255,(~n)&255,(~n)>>>8&255]);b.push(h,raw.subarray(p,p+n));for(let i=p;i<p+n;i++){s1=(s1+raw[i])%65521;s2=(s2+s1)%65521;}p+=n;}b.push(new Uint8Array(be(((s2<<16)|s1)>>>0)));return concat(b);}
function png(g,rect){let [x0,y0,w,h]=rect,row=(w+3)>>2,raw=new Uint8Array((row+1)*h),idx=new Uint8Array(256);idx[100]=1;idx[58]=2;idx[62]=3;for(let y=0;y<h;y++)for(let x=0;x<w;x++)raw[y*(row+1)+1+(x>>2)]|=idx[g[(y0+y)*W+x0+x]]<<(6-2*(x&3));const pal=new Uint8Array([10,16,26,65,60,69,149,151,157,88,158,190]),txt=utf8("MaterialIDs\0palette_index=0:Empty,1:100_Basalt,2:58_HardWall,3:62_StructuralSolid");return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),2,3,0,0,0])),chunk("PLTE",pal),chunk("tEXt",txt),chunk("IDAT",zipStore(raw)),chunk("IEND",new Uint8Array(0))]);}
function verifyPng(g,rect,p){const [x0,y0,w,h]=rect;let o=8,idat=null;let total=0;while(o<p.length){let n=(p[o]<<24|p[o+1]<<16|p[o+2]<<8|p[o+3])>>>0,t=String.fromCharCode(p[o+4],p[o+5],p[o+6],p[o+7]);if(crc(p.subarray(o+4,o+8+n))!==((p[o+n+8]<<24|p[o+n+9]<<16|p[o+n+10]<<8|p[o+n+11])>>>0))throw Error("PNG CRC "+t);if(t==="IDAT")idat=p.subarray(o+8,o+8+n);if(t==="IEND")total++;o+=12+n;}if(total!==1||o!==p.length||!idat)throw Error("PNG structure");let z=idat,pos=2,parts=[],a=1,b=0;while(true){let mark=z[pos++],n=z[pos]|z[pos+1]<<8,inv=z[pos+2]|z[pos+3]<<8;pos+=4;if((n^inv)!==65535||(mark&6)!==0)throw Error("zlib stored block");parts.push(z.subarray(pos,pos+n));for(let i=pos;i<pos+n;i++){a=(a+z[i])%65521;b=(b+a)%65521;}pos+=n;if(mark&1)break;}let ad=(z[pos]<<24|z[pos+1]<<16|z[pos+2]<<8|z[pos+3])>>>0;if(ad!==(((b<<16)|a)>>>0))throw Error("PNG Adler");let raw=concat(parts),row=(w+3)>>2;if(raw.length!==(row+1)*h)throw Error("PNG raw length");let map=IDS;for(let y=0;y<h;y++){let off=y*(row+1);if(raw[off]!==0)throw Error("PNG filter");for(let x=0;x<w;x++){let val=(raw[off+1+(x>>2)]>>(6-2*(x&3)))&3;if(map[val]!==g[(y+y0)*W+x0+x])throw Error("PNG pixel "+x+","+y);}}return w*h;}
function base64(a){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",out=[];for(let i=0;i<a.length;i+=3){let n=(a[i]<<16)|((a[i+1]||0)<<8)|(a[i+2]||0);out.push(t[n>>>18&63],t[n>>>12&63],i+1<a.length?t[n>>>6&63]:"=",i+2<a.length?t[n&63]:"=");}return out.join("");}
function generate(){
const g=new Uint8Array(N),sites={"West tidal ingress":[125,425],"Keel ledger room":[315,476],"Dry berth interior":[338,695],"Hull tipper intake":[568,425],"Tipper upper gantry":[718,174],"Cradle operator bay":[833,478],"Tipper keel gallery":[783,659],"Slipway transfer throat":[960,425],"South truss inspection":[1120,180],"Crossdock pick station":[1109,475],"Crane bridge crown":[1322,196],"Crossdock cargo bay":[1318,594],"Forked rail switch":[1478,425],"Classification underside":[1550,671],"East dispatch loading":[1783,422],"Terminal assay bay":[1825,609],"Outbound overlook":[1953,429],"West bilge recover":[258,839],"Tipper hydraulic service":[693,844],"Midspan valve room":[1119,843],"Rail relay rescue":[1506,841],"East tram recovery":[1845,840]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}




/* GRAVEN KEEL — original ship-tip cradle + crossdock; full 2D orthographic
   material cells. No copied map silhouette, reference photo or art trace. */
function house(x,y,w,h){R(x,y,w,h,M.WALL);R(x+7,y+8,w-14,h-15,M.AIR);R(x+12,y+h-11,w-24,7,M.STEEL);R(x+15,y+19,Math.min(17,w-28),12,M.STEEL);}
function moduleBox(x,y,w,h){R(x,y,w,h,M.STEEL);R(x+6,y+6,w-12,h-12,M.WALL);for(let j=12;j<w-12;j+=22)R(x+j,y+10,4,h-20,M.STEEL);}
function strut(x,y,X,Y,t=10){L(x,y,X,Y,t,M.STEEL);L(x+7,y+8,X+7,Y+8,Math.max(4,t-5),M.WALL);}
function sheave(x,y,r){ring(x,y,r,r,8,M.STEEL);ring(x,y,Math.max(6,r-14),Math.max(6,r-14),5,M.WALL);for(let n=0;n<6;n++){let t=n*Math.PI/3;L(x+9*Math.cos(t),y+9*Math.sin(t),x+(r-5)*Math.cos(t),y+(r-5)*Math.sin(t),4,M.STEEL);}}
/* Cut-stone shelf and five independently occupied lower service rooms. */
for(let x=0;x<W;x++){let floor=770+Math.floor(19*Math.sin(x/169)+11*Math.sin(x/37));if(x>420&&x<1080)floor+=Math.floor(80*Math.sin(Math.PI*(x-420)/660)**2);R(x,floor,1,H-floor,M.ROCK);}
P([[0,0],[0,1024],[105,1024],[108,760],[83,664],[88,475],[69,348],[0,331]],M.ROCK);
P([[2048,0],[2048,1024],[1960,1024],[1957,762],[1985,634],[1975,474],[2048,365]],M.ROCK);
P([[160,630],[203,588],[458,607],[500,640],[492,817],[181,839]],M.AIR);
P([[478,684],[541,548],[835,522],[902,680],[885,902],[482,900]],M.AIR);
R(95,799,1863,88,M.AIR);R(118,905,1817,68,M.AIR);
R(0,994,W,30,M.WALL);R(90,983,1875,12,M.STEEL);
/* Foundation piers, spaced for distinct long freight supports. */
for(const [x,y,w] of [[150,718,21],[426,698,23],[493,696,25],[864,651,27],
 [934,690,27],[1325,664,29],[1404,684,23],[1648,671,25],[1929,674,24]]){
 R(x,y,w,994-y,M.WALL);R(x+8,y+9,5,985-y,M.STEEL);
}
R(116,755,335,13,M.STEEL);R(473,749,426,15,M.WALL);
R(928,752,427,14,M.STEEL);R(1370,748,311,13,M.WALL);
R(1694,748,265,14,M.STEEL);
/* Horizontal freighter: true keel and pilot cabin, open hold and crane lift. */
P([[184,713],[203,668],[238,647],[417,651],[452,688],[438,763],
 [412,786],[227,799],[191,767]],M.STEEL);
P([[201,712],[214,683],[241,662],[402,666],[438,697],[424,749],
 [408,774],[233,779],[209,752]],M.WALL);
P([[223,710],[246,682],[392,682],[417,710],[407,755],[245,756]],M.AIR);
R(234,762,171,14,M.STEEL);
P([[357,686],[357,617],[386,595],[410,609],[424,653],[417,684]],M.STEEL);
P([[370,671],[370,629],[389,615],[405,628],[412,672]],M.AIR);
R(380,644,21,12,M.WALL);
moduleBox(258,725,54,28);moduleBox(323,730,52,23);
for(const x of [206,304,412]){R(x,782,16,66,M.WALL);strut(x-9,824,x+33,791,7);}
R(187,843,269,13,M.STEEL);
house(235,552,118,64);R(250,616,88,13,M.STEEL);
strut(328,616,458,684,12);
strut(279,549,375,479,11);strut(375,479,464,557,10);
sheave(376,483,22);L(378,504,378,647,7,M.STEEL);
/* Unmistakable tilted salvage hull, open diagonal deck bays and massive
   supported rotation pillow (STATIC position only; no claimed animation). */
P([[545,710],[574,649],[646,564],[751,438],[811,455],[835,503],
 [748,630],[647,720],[578,740]],M.STEEL);
P([[566,705],[596,641],[661,577],[751,461],[797,477],[811,503],
 [731,615],[638,698],[585,719]],M.WALL);
P([[597,690],[625,636],[674,579],[754,482],[785,490],[794,508],
 [717,606],[641,683]],M.AIR);
strut(582,717,773,466,17);strut(604,731,807,492,10);
R(561,735,90,16,M.WALL);R(746,616,17,139,M.STEEL);
for(const [x,y] of [[625,635],[683,565],[733,502]]){moduleBox(x,y,38,24);strut(x+8,y+24,x+36,y+48,5);}
R(527,734,169,16,M.STEEL);sheave(626,741,29);
strut(625,744,691,812,11);
for(const [x,top] of [[529,273],[818,282]]){R(x,top,26,470,M.WALL);R(x+9,top+7,7,448,M.STEEL);}
strut(541,274,669,151,15);strut(669,151,831,279,14);
R(632,143,74,16,M.STEEL);sheave(679,204,27);
L(678,229,678,584,8,M.STEEL);
R(610,501,122,14,M.STEEL);R(620,516,101,58,M.WALL);R(635,526,69,39,M.AIR);
house(755,575,56,48);
strut(743,519,863,579,11);
/* Crossdock's exceptionally long paired triangular truss and transfer hoist. */
R(939,354,28,401,M.WALL);R(947,370,9,375,M.STEEL);
R(1333,388,33,369,M.WALL);R(1343,402,9,344,M.STEEL);
strut(951,353,1091,169,18);strut(1091,169,1348,393,19);
R(1063,159,68,17,M.STEEL);sheave(1100,240,31);
strut(968,346,1310,359,18);R(971,360,339,12,M.WALL);
for(const x of [992,1075,1160,1243]){strut(x,374,x+35,413,7);strut(x+34,377,x,415,7);}
L(1179,375,1179,567,8,M.STEEL);moduleBox(1137,563,81,32);
R(984,574,344,15,M.STEEL);R(1003,590,15,111,M.WALL);
R(1299,590,15,112,M.WALL);R(1019,607,277,69,M.AIR);
R(1020,685,303,14,M.STEEL);
house(1038,627,56,43);house(1233,632,51,37);
strut(875,515,1013,546,14);strut(996,542,1139,526,12);
strut(1138,527,1363,546,14);
moduleBox(999,506,65,27);moduleBox(1248,505,65,27);
/* Classifying frog, paired independent rail heights, staffed transshipment. */
R(1360,593,333,15,M.STEEL);R(1373,608,270,8,M.WALL);
strut(1382,593,1518,540,12);strut(1518,540,1658,586,12);
R(1393,646,248,15,M.STEEL);
for(const x of [1431,1542,1618]){R(x,658,13,96,M.WALL);strut(x,660,x+31,707,6);}
moduleBox(1459,561,72,27);moduleBox(1573,584,66,25);
R(1450,692,181,15,M.STEEL);house(1459,710,87,45);
sheave(1595,677,20);
R(1384,752,300,14,M.WALL);
/* East consolidation and customs: stepped asymmetrical roof and vehicle dock. */
P([[1700,749],[1714,522],[1761,465],[1830,479],[1849,428],
 [1910,437],[1950,473],[1980,721]],M.WALL);
P([[1725,717],[1736,544],[1772,493],[1820,506],
 [1867,460],[1896,468],[1922,495],[1952,712]],M.AIR);
R(1716,738,267,17,M.STEEL);R(1735,581,206,16,M.STEEL);
R(1742,599,16,91,M.WALL);R(1923,599,16,91,M.WALL);
R(1758,614,164,60,M.AIR);R(1766,680,162,12,M.STEEL);
moduleBox(1842,639,53,29);house(1886,545,51,34);
R(1772,626,65,14,M.STEEL);R(1784,639,13,41,M.WALL);
R(1717,694,192,12,M.STEEL);R(1745,706,14,33,M.WALL);R(1892,706,14,33,M.WALL);
strut(1690,584,1774,547,13);strut(1927,585,1996,556,11);
/* Excavated underworks contains five visually distinct real-cell machine bays. */
for(const [x,w] of [[175,221],[514,352],[977,360],[1388,274],[1722,208]]){
 R(x,957,w,14,M.STEEL);R(x+8,970,16,24,M.WALL);
}
sheave(247,921,32);L(277,921,320,890,8,M.STEEL);house(330,919,43,37);
sheave(695,925,23);sheave(760,925,31);L(716,927,737,928,7,M.STEEL);house(815,922,44,32);
R(1023,913,122,16,M.STEEL);sheave(1107,929,37);
L(1144,928,1202,894,11,M.WALL);house(1251,916,61,37);
R(1441,919,100,10,M.STEEL);L(1450,918,1510,897,10,M.WALL);moduleBox(1562,923,62,30);
R(1768,916,127,13,M.WALL);sheave(1790,945,16);sheave(1874,945,16);
L(1897,941,1935,898,9,M.STEEL);
/* Highline: credible two-ended continuous grounded load path; shafts below
   are playable corridors, never invisible art scenery. */
R(81,233,1902,16,M.STEEL);
R(79,231,21,478,M.WALL);R(1978,235,22,472,M.WALL);
for(const x of [490,904,1350,1692]){strut(x,248,x+52,282,7);strut(x+52,248,x,282,7);}
for(const [x,y] of [[541,275],[821,285],[947,359],[1344,390],[1852,438]]){
 strut(x,270,x+7,y,10);
}
/* Actual accessible cardinal flight band plus shafts to upper/lower/entered bays */
R(103,379,1847,72,M.AIR);
R(104,306,1830,53,M.AIR);
for(const cx of [125,568,960,1478,1783,1953])R(cx-34,329,69,169,M.AIR);
for(const cx of [258,693,1119,1506,1845])R(cx-38,422,77,463,M.AIR);
for(const cx of [338,783,1318,1550,1825])R(cx-34,507,69,228,M.AIR);
for(const p of Object.values(sites))R(p[0]-21,p[1]-19,43,39,M.AIR);
/* End-of-build structural grounding after the air cuts; no fake floating
   refinery. These remain solid pillars with alternate upper flight routes. */
for(const [x,y,w] of [[431,720,25],[875,636,27],[1344,670,29],
 [1652,670,27],[1936,678,26]]){R(x,y,w,994-y,M.WALL);R(x+8,y+8,6,984-y,M.STEEL);}
strut(837,598,887,672,13);
strut(1298,699,1353,717,11);
strut(1632,697,1664,722,9);
R(0,994,W,30,M.WALL);


// Real Midge-accessible gated crown passes; preserve the highline as a
// structurally grounded multi-span bridge instead of an impassable sky wall.
for(const [x,y,w,h] of [[683,208,75,89],[1081,207,77,93],[1284,206,84,94]])R(x,y,w,h,M.AIR);
R(683,278,76,110,M.AIR);
R(1081,277,78,111,M.AIR);
R(1284,275,85,113,M.AIR);
// Enterable sloped hull passage to shipyard void; not a radius waiver:
R(807,468,65,218,M.AIR);R(769,626,107,75,M.AIR);
for(const [x,y] of [[718,174],[1120,180],[1322,196]])R(x-21,y-19,43,39,M.AIR);


/* Crown load-bearing arches restore highline physical continuity across
   three real 31x27 air gates.  Retain 2D solid/None law. */
for(const [a,b,yy] of [[674,768,119],[1074,1167,113],[1276,1375,121]]){
 strut(a,238,a,yy,10);strut(a,yy,b,yy,13);strut(b,yy,b,238,10);
}
/* Dry berth: rooted sheer and asymmetric wheelhouse; open serviced hold. */
P([[191,721],[214,664],[239,648],[411,647],[459,692],
 [445,772],[420,795],[224,798]],M.STEEL);
P([[205,719],[229,682],[248,669],[400,671],[442,704],
 [428,768],[240,779],[212,751]],M.WALL);
P([[231,713],[248,687],[394,688],[418,721],[401,757],[239,759]],M.AIR);
R(226,773,206,17,M.STEEL);R(422,710,22,107,M.WALL);
R(422,797,28,20,M.STEEL);
P([[354,688],[355,621],[381,597],[409,608],[422,658],[419,689]],M.STEEL);
P([[369,674],[371,631],[388,616],[402,632],[408,673]],M.AIR);
R(370,683,49,13,M.WALL);
moduleBox(253,731,47,23);moduleBox(322,731,53,23);
strut(430,716,457,755,11);R(433,748,21,70,M.WALL);
/* Tipper keel is explicitly founded and internally approached. */
P([[558,702],[589,642],[653,558],[749,447],[800,456],[830,494],
 [737,633],[647,716],[580,746]],M.STEEL);
P([[571,701],[606,645],[666,569],[755,466],[795,475],[810,502],
 [720,619],[637,702],[582,719]],M.WALL);
P([[597,685],[625,638],[677,584],[752,490],[787,493],[796,503],
 [709,608],[639,682]],M.AIR);
strut(583,721,765,472,15);R(558,731,121,19,M.STEEL);
R(571,738,82,16,M.WALL);strut(789,637,883,699,15);
strut(759,515,875,637,10);R(861,651,18,118,M.STEEL);
moduleBox(650,604,43,23);moduleBox(700,554,43,22);
/* Genuine side-accessible shipbreaking and bilge recovery portals.
   Cut 31x27 flyable walk-throughs rather than accepting nearest-site waivers. */
R(302,482,75,258,M.AIR);
R(231,725,69,162,M.AIR);
R(655,465,78,427,M.AIR);
R(753,613,77,91,M.AIR);R(810,461,69,226,M.AIR);
for(const q of Object.values(sites))R(q[0]-21,q[1]-19,43,39,M.AIR);

const r2Base=g.slice();

/* Graven Keel R2 / functional process chain: sheltered berth → engaged angled
   tipper → suspended crossdock → shunt frog → customs, plus differentiated
   maintenance below. Real stable material, perpendicular 2D elevation. */
function r2Room(x,y,w,h){R(x,y,w,8,M.STEEL);R(x,y,8,h,M.WALL);R(x+8,y+h-9,w-8,9,M.STEEL);R(x+w-8,y,8,h,M.WALL);R(x+10,y+12,w-20,h-26,M.AIR);R(x+w-9,y+17,13,h-27,M.AIR);}
function r2Load(x,y,w=66){R(x,y,w,8,M.STEEL);R(x+7,y-23,w-14,22,M.WALL);for(let z=x+16;z<x+w-10;z+=18)R(z,y-19,4,14,M.STEEL);for(let z of [x+15,x+w-15]){ring(z,y+12,11,11,4,M.STEEL);R(z-3,y+9,6,7,M.WALL);}}
// One vessel: fore sheer, continuous keel under open 70px hatch, aft
// wheelhouse on same vessel (not a second dock cabin).
L(198,747,209,682,13,M.STEEL);L(209,682,243,646,14,M.STEEL);
R(243,638,174,11,M.STEEL);L(417,646,453,691,13,M.STEEL);
L(453,690,440,765,13,M.STEEL);L(440,765,416,791,13,M.STEEL);
R(223,783,210,15,M.STEEL);L(226,786,197,754,13,M.STEEL);
R(223,746,70,12,M.WALL);R(384,746,59,12,M.WALL);
R(244,742,10,48,M.STEEL);R(419,742,11,49,M.STEEL);
r2Room(377,595,51,64);R(400,653,12,94,M.WALL);
R(385,608,27,13,M.AIR);R(393,601,20,8,M.STEEL);
r2Load(239,720,55);r2Load(383,717,50);
R(175,743,24,15,M.WALL);L(193,752,224,777,9,M.STEEL);
R(178,753,12,61,M.WALL);r2Room(238,552,73,63);
R(254,610,13,144,M.WALL);R(263,587,42,10,M.STEEL);
R(485,668,55,13,M.STEEL);L(426,699,493,673,11,M.STEEL);
R(474,678,11,81,M.WALL);r2Load(490,650,52);
// Incline: two rails tied to grounded heel, rolling pivot and a ram
// touching the same tilted load deck; clear keeper gallery stays traversable.
L(577,715,761,473,17,M.STEEL);L(598,716,782,495,10,M.WALL);
L(619,744,753,606,12,M.STEEL);L(628,748,776,603,7,M.WALL);
R(621,742,107,15,M.WALL);ring(629,738,25,25,9,M.STEEL);
R(619,748,19,44,M.WALL);R(750,480,62,12,M.STEEL);
R(788,489,10,100,M.WALL);R(752,579,60,10,M.STEEL);
L(804,610,880,659,13,M.STEEL);
R(873,650,88,12,M.STEEL);R(882,660,12,96,M.WALL);
R(895,624,62,23,M.STEEL);R(905,631,44,14,M.WALL);
r2Room(835,554,51,64);R(854,610,12,47,M.WALL);
// Crossdock hoist: the load hangs from the grounded bridging trolley and
// is received at a defined platform beside an entered operator room.
L(946,354,1260,354,11,M.STEEL);
R(1136,343,95,14,M.WALL);R(1159,334,61,10,M.STEEL);
ring(1192,355,18,18,7,M.STEEL);
R(1187,373,9,183,M.WALL);R(1190,554,8,29,M.STEEL);
R(1158,578,75,10,M.STEEL);R(1163,587,65,26,M.WALL);
R(1175,593,42,12,M.STEEL);
L(1153,614,1117,684,9,M.STEEL);L(1238,613,1268,684,9,M.STEEL);
R(1103,684,183,11,M.STEEL);r2Room(1020,625,81,68);
R(1063,683,12,20,M.WALL);R(1245,633,61,12,M.STEEL);
R(1284,638,10,62,M.WALL);r2Load(1252,710,66);
// Real diverging shunt, loaded wagons and enclosed switch room.
r2Load(1407,568,70);r2Load(1577,583,71);
L(1395,612,1515,632,11,M.STEEL);
L(1515,632,1664,604,10,M.STEEL);
R(1620,603,33,11,M.WALL);R(1661,583,10,75,M.STEEL);
r2Room(1584,690,76,62);R(1608,738,13,21,M.WALL);
// East: inspect/weigh portal, side room and loaded outbound trolley.
r2Room(1729,646,91,82);R(1754,695,34,13,M.WALL);
R(1747,722,12,26,M.WALL);
R(1862,578,11,166,M.WALL);R(1923,575,11,169,M.WALL);
R(1861,575,73,12,M.STEEL);R(1883,600,29,9,M.STEEL);
R(1895,610,8,25,M.WALL);R(1875,634,39,9,M.STEEL);
r2Load(1870,706,70);R(1941,689,41,12,M.STEEL);
R(1960,700,13,49,M.WALL);
// Five different machines anchored to true underground decks.
R(195,921,12,34,M.WALL);R(205,944,106,12,M.STEEL);
R(218,906,10,39,M.WALL);R(228,907,49,10,M.STEEL);
R(310,918,44,34,M.WALL);R(320,927,27,18,M.AIR);
L(261,925,309,908,7,M.STEEL);
R(633,943,172,13,M.STEEL);R(645,907,14,43,M.WALL);
R(663,918,11,34,M.STEEL);R(695,923,13,28,M.WALL);
R(742,901,12,51,M.WALL);L(648,925,746,911,7,M.STEEL);
R(1013,941,206,14,M.STEEL);R(1029,913,13,38,M.WALL);
R(1042,904,95,9,M.STEEL);R(1195,898,13,53,M.WALL);
L(1143,922,1202,921,8,M.STEEL);
R(1464,944,165,12,M.STEEL);R(1467,911,12,39,M.WALL);
R(1478,917,92,9,M.STEEL);
for(const z of [1484,1500,1516,1532,1548])R(z,928,7,17,M.WALL);
R(1587,904,11,45,M.WALL);R(1596,912,33,9,M.STEEL);
R(1779,936,142,14,M.STEEL);R(1788,906,92,29,M.WALL);
R(1800,913,67,15,M.AIR);R(1885,902,12,47,M.STEEL);
L(1891,921,1929,890,9,M.STEEL);

// Rooted crossdock chain: overhead car spanning bridge -> sheave at mast ->
// guided downward pick -> loaded cradle -> wheeled deposit staging.
R(1152,227,84,13,M.STEEL);
R(1183,237,13,340,M.STEEL);
ring(1189,285,18,18,7,M.WALL);
R(1178,542,26,12,M.STEEL);
R(1154,556,74,12,M.STEEL);
R(1160,570,66,28,M.WALL);R(1168,576,49,16,M.STEEL);
L(1204,591,1264,648,10,M.STEEL);
R(1251,644,68,13,M.STEEL);R(1301,656,13,97,M.WALL);
R(1244,689,87,10,M.STEEL);

// Reestablish PRE-R2 legal corridors while *never excavating a preexisting
// rooted structural pixel*. Additional machine strokes cannot close them.
function restoreFree(x,y,w,h){
 for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)
 for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let n=yy*W+xx;if(r2Base[n]===0 && !(yy>=379&&yy<451&&xx>=1183&&xx<1196))g[n]=0;}
}
restoreFree(103,379,1847,72);restoreFree(104,306,1830,53);
for(const x of [125,568,960,1478,1783,1953])restoreFree(x-34,329,69,169);
for(const x of [258,693,1119,1506,1845])restoreFree(x-38,422,77,463);
for(const x of [338,783,1318,1550,1825])restoreFree(x-34,507,69,228);
restoreFree(302,482,75,258);restoreFree(231,725,69,162);
restoreFree(655,465,78,427);restoreFree(753,613,77,91);
restoreFree(810,461,69,226);
for(const p of Object.values(sites))restoreFree(p[0]-21,p[1]-19,43,39);

// Remove genuinely ungrounded decorator fragments, never retain false hanging
// "solid" machinery unsupported by any connected load path.
let seen=new Uint8Array(N),q=new Int32Array(N),front=0,back=0;
for(let x=0;x<W;x++){let n=(H-1)*W+x;if(g[n]&&!seen[n]){seen[n]=1;q[back++]=n;}}
while(front<back){let a=q[front++],x=a%W,y=(a/W)|0;for(let z of [a-W,a+W,a-1,a+1])if(z>=0&&z<N&&!(Math.abs(z-a)===1&&((z/W)|0)!==y)&&g[z]&&!seen[z]){seen[z]=1;q[back++]=z;}}
let pruned=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;pruned++;}
// Lossless disjoint ordered rectangle encoding, vertical span merged where
// the exact horizontal material-run key repeats on the immediately next row.
let rect=[],active=new Map();for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,idx=active.get(key);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(key,idx);}active=next;}
let replay=new Uint8Array(N),hist={};let area=0;for(let [x,y,w,h,m] of rect){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!IDS.includes(m))throw Error("bad rectangle");hist[m]=(hist[m]||0)+w*h;area+=w*h;for(let yy=y;yy<y+h;yy++){for(let i=yy*W+x;i<yy*W+x+w;i++)if(replay[i]!==0)throw Error("overlap");replay.fill(m,yy*W+x,yy*W+x+w);}}
for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("replay mismatch "+i);
hist[0]=N-area;
let int=new Int32Array((W+1)*(H+1)),S=W+1;for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=g[o+x-1]!==0?1:0;int[y*S+x]=int[(y-1)*S+x]+sum;}}
function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&int[d*S+c]-int[d*S+a]-int[b*S+c]+int[b*S+a]===0;}
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West tidal ingress"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[169,363,75,111],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West tidal ingress"],finish=sites["Keel ledger room"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-tidal-berth",112,440,354,399],["02-tipped-hull",490,128,431,677],["03-crossdock",925,144,458,642],["04-rail-sorter",1370,450,330,333],["05-customs",1700,415,348,381],["06-underworks",920,774,547,250]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Graven Keel — Ship-Tipper Crossdock",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{"main":["West tidal ingress","Keel ledger room","Hull tipper intake","Cradle operator bay","Slipway transfer throat","Crossdock pick station","Forked rail switch","East dispatch loading","Outbound overlook"],"upper":["Tipper upper gantry","South truss inspection","Crane bridge crown"],"lower":["West bilge recover","Tipper hydraulic service","Midspan valve room","Rail relay rescue","East tram recovery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West tidal ingress",to:"Keel ledger room",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-graven-keel.json",Buffer.from(a.json,"utf8")],
    ["receipt.json",Buffer.from(JSON.stringify(a.receipt,null,2)+"\n","utf8")],
    ...a.images.map(im=>[im.name+".png",Buffer.from(im.bytes)])];
  for(const [name,bytes] of outputs){
   const target=path.join(p,name);
   if(verify){if(!fs.existsSync(target)||!fs.readFileSync(target).equals(bytes))throw Error("Committed artifact diverges from builder: "+name);}
   else fs.writeFileSync(target,bytes);
  }
  console.log(JSON.stringify({mode:verify?"SOURCE-EXACT-PASS":"GENERATED",rectangles:a.rect.length,setup_bytes:a.jbytes.length,
    grounded:a.receipt.grounded,pruned:a.receipt.pruned_disconnected_decor_cells,
    envelope_sites:a.status.map(x=>x.reached+"/"+x.total),detour:a.receipt.obstruction.distance_before_after,
    material_plane_sha256:a.receipt.material_plane_sha256,images:a.receipt.images.map(x=>x.name+":"+x.pixel_parity)}));
 }
}
