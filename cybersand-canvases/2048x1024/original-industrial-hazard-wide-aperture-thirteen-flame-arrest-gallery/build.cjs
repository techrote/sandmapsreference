'use strict';
// ORIGINAL Aperture-13 Flame Arrest Gallery, fixed seed 19260483. No source art, tracing, or AI concept rendering.
// Read-only engine authority: de109d0131641d6adc8d25bb9ced7ca3d4991105
const fs=require('node:fs'),path=require('node:path');
const W=2048,H=1024,NAME="Aperture-13 Flame Arrest Gallery",SEED=19260483,ENGINE="de109d0131641d6adc8d25bb9ced7ca3d4991105",BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const sites=[["Aerostat arrival",80,420],["Blast assay deck",263,445],["Slag arrival lock",438,485],["Quench relay",617,414],["Ceramic vane overlook",772,472],["Shield west gate",904,392],["Shield hollow",1109,480],["Upper rupture lookout",1109,157],["Shield east recovery",1353,440],["Vapor drum service",1515,447],["Retort return gallery",1660,561],["Quarantine departure",1852,315],["Eastern emergency exit",1982,679],["Coolant bypass west",778,773],["Damped lower transit",1172,754],["Cold isolation refuge",1660,780]],crops=[["assay",24,213,438,613],["vanes",433,190,429,636],["shield",864,151,460,680],["retorts",1332,205,392,620],["exit",1699,222,326,604]],policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={W:58,S:62,P:63,G:66,I:68,C:70,Z:76,N:77,A:79,B:100,F:104,T:117,V:120,U:123};
 function b(x,y,w,h,k){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let Y=Math.max(0,y);Y<Math.min(H,y+h);Y++)g.fill(k,Y*W+Math.max(0,x),Y*W+Math.min(W,x+w));}
 function l(x,y,X,Y,t,k){let n=Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y))/3);for(let i=0;i<=n;i++){let p=i/n;b(x+(X-x)*p-t/2,y+(Y-y)*p-t/2,t,t,k)}}
 function fr(x,y,w,h,t,k){b(x,y,w,t,k);b(x,y+h-t,w,t,k);b(x,y+t,t,h-2*t,k);b(x+w-t,y+t,t,h-2*t,k)}
 function deck(x,y,w,t=10){b(x,y,w,t,M.S);b(x,y+t,w,4,M.P)}
 function post(x,y,w,k=M.W){b(x,y,w,852-y,k)}
 function vat(x,y,w,h,k,amount){b(x,y,w,h,M.W);b(x+14,y+14,w-28,h-28,k);b(x+14,y+14,w-28,Math.round((h-28)*(1-amount)),M.W);b(x,y,w,9,M.S);b(x,y+h-9,w,9,M.F);}
 // Rooted fault bed; no unstable powders or unsupported free-standing mechanical pieces.
 b(0,852,W,172,M.B);b(0,0,18,H,M.W);b(2030,0,18,H,M.W);
 for(let x=18;x<2030;x+=16){let y=840+Math.round(5*Math.sin(x/139)+4*Math.sin(x/54));b(x,y,Math.min(16,2030-x),852-y,M.W);}
 // A: blast assay yard: asymmetric raking structural cradle, dry weighing hall, twin access portals.
 post(104,302,25);post(378,374,27);deck(105,588,304,12);
 l(117,313,264,264,12,M.S);l(264,264,387,381,11,M.S);
 l(117,584,245,386,10,M.T);l(387,590,277,389,9,M.T);
 l(194,268,320,349,12,M.S);l(320,349,360,473,8,M.T);
 b(222,240,74,31,M.U);b(228,247,62,8,M.N);
 fr(167,644,210,134,12,M.W);b(160,691,39,61,0);b(343,691,41,58,0);
 deck(211,742,128,9);b(225,703,45,8,M.A);l(239,739,251,709,8,M.I);
 // B: distinct grounded ceramic splitter vanes; twin individually sealed cooling vats.
 post(483,549,19);post(710,440,18);post(836,542,15);
 deck(477,611,373,13);deck(469,729,384,11);
 l(496,575,564,290,14,M.F);l(571,298,600,605,10,M.S);
 l(718,446,677,229,13,M.F);l(677,229,751,603,11,M.S);
 l(842,546,792,339,12,M.F);
 l(500,650,711,693,8,M.I);l(711,693,832,657,7,M.I);
 vat(507,742,101,85,3,.71);vat(642,742,89,85,3,.56);
 fr(610,653,173,62,9,M.W);b(604,665,43,38,0);b(746,660,43,46,0);deck(648,704,100,5);
 for(const [x,y] of [[537,565],[649,539],[773,587]]){l(x,y,x+26,y+35,7,M.S);b(x,y,19,7,M.Z);}
 // C: pulse shield. Massive open middle chamber, high overflight and low return.
 post(929,233,39);post(1241,264,37);b(929,226,349,24,M.F);b(942,251,319,9,M.T);
 b(976,256,15,297,M.F);b(1215,281,15,289,M.F);
 l(950,563,986,654,15,M.S);l(1263,568,1222,663,15,M.S);
 deck(950,679,315,11);deck(995,779,220,10);
 l(994,584,1042,621,9,M.T);l(1205,597,1163,632,8,M.T);
 l(1042,621,1048,669,9,M.I);l(1163,632,1162,668,8,M.I);
 b(1044,662,124,8,M.N);b(1109,653,20,12,M.Z);
 vat(1044,705,99,81,8,.63);b(1034,794,122,10,M.F);
 b(1066,213,64,10,M.A);b(1125,206,10,7,M.N);
 // D: mixed-height condensers, differing sealed water charge, double-entered instrument cell.
 post(1391,358,24);post(1538,290,27);post(1685,409,22);
 deck(1391,616,315,12);deck(1386,750,325,12);
 l(1404,376,1551,303,10,M.S);l(1551,303,1696,423,9,M.T);
 l(1436,622,1436,643,8,M.I);l(1592,627,1609,662,8,M.I);
 vat(1417,651,84,87,3,.66);vat(1553,665,103,75,3,.78);
 b(1417,343,66,15,M.U);b(1552,278,47,12,M.N);b(1631,391,62,10,M.U);
 fr(1464,505,181,90,11,M.W);b(1456,538,50,45,0);b(1601,539,52,44,0);
 b(1507,572,17,18,M.Z);b(1528,562,36,8,M.N);
 for(let i=0;i<3;i++){b(1478+i*53,596,12,16,M.T);b(1478+i*53,590,35,6,M.G)}
 // E: lower evacuation isolator, sloped wind-vane, sheltered two-sided extraction ports.
 post(1771,471,25);post(1937,561,19);deck(1751,630,226,12);deck(1746,782,235,10);
 l(1781,487,1859,378,12,M.S);l(1859,378,1942,566,11,M.T);
 fr(1777,675,183,92,11,M.W);b(1771,701,44,57,0);b(1921,695,44,57,0);
 b(1831,745,27,9,M.Z);b(1871,738,37,8,M.A);
 b(1842,364,39,14,M.U);b(1870,351,15,11,M.N);
 for(const [x,y] of [[109,580],[379,578],[478,604],[829,604],[935,671],[1251,671],[1392,611],[1689,611],[1776,625],[1937,625]])b(x,y,17,5,M.Z);
 // Steel-to-shield upper crown bearing: joins the underside inspection rail to the rooted eastern cheek.
 b(1247,247,17,32,M.T);
 // Authored flight-scale emergency transfer apertures, never waypoint substitutions.
 b(236,148,64,323,0);    // blast assay roof release
 b(1073,120,78,394,0);   // large open pulse-shield flash-vent crown
 b(1485,182,65,388,0);   // ventilated condenser service access
 b(1639,187,60,414,0);   // retort vertical pressure-release duct
 b(750,536,65,284,0);    // quench underdeck recovery
 b(1143,534,72,266,0);   // lower shield return
 b(1660,601,64,226,0);   // cold hatch outside retained water vessels

// R7: grounded functional workfaces, crew-scale inspection, shield sensor booths, and opened access.
for(const [x,y,w,h,k] of [
[252,565,83,23,"F"],[261,546,64,19,"G"],[269,537,47,9,"U"],[278,532,29,6,"N"],[318,485,12,54,"S"],
[217,733,89,9,"P"],[228,721,11,12,"G"],[244,710,30,7,"V"],[248,698,18,12,"N"],[286,706,11,27,"I"],[291,694,16,12,"A"],
[970,650,26,20,"P"],[979,638,13,12,"N"],[970,633,27,5,"V"],[980,659,18,10,"G"],[983,646,9,13,"I"],
[1462,628,8,23,"P"],[1461,624,28,7,"G"],[1471,612,11,12,"N"],[1596,628,9,38,"P"],[1587,624,30,8,"G"],[1601,609,12,15,"Z"],
[1497,639,67,7,"P"],[1498,639,8,20,"P"],[1555,639,8,26,"P"],[1525,630,11,17,"I"],[1520,626,21,6,"U"],[1541,567,14,7,"V"],[1565,553,11,17,"I"],
[1831,746,80,10,"S"],[1850,726,45,20,"F"],[1855,715,36,11,"U"],[1867,709,12,6,"N"],[1819,731,26,15,"P"],[1827,717,10,14,"Z"],[1906,729,13,17,"I"],[1907,720,22,7,"N"],[1796,773,53,9,"P"],[1802,760,13,13,"G"]])b(x,y,w,h,M[k]);
for(const [x,y,X,Y,t,k] of [[325,352,324,493,7,"T"],[323,529,310,546,6,"I"],[323,529,337,548,6,"I"],[552,602,552,611,6,"P"],[678,585,678,612,6,"P"],[1048,674,1048,704,7,"P"]])l(x,y,X,Y,t,M[k]);
for(const [x,y] of [[533,570],[656,536],[723,581]]){b(x,y,26,8,M.Z);b(x+5,y+8,9,20,M.I);b(x+6,y+25,22,6,M.G);}
fr(957,583,91,96,8,M.S);b(1030,605,30,71,0);
deck(1262,679,104,9);fr(1275,583,84,96,8,M.F);b(1350,604,10,69,0);
b(1322,648,24,23,M.P);b(1331,634,11,14,M.Z);b(1290,650,18,21,M.G);l(1280,675,1280,709,7,M.I);
b(322,583,56,28,0);b(322,640,56,55,0);b(341,692,42,66,0);
b(100,667,39,88,0);b(141,673,78,83,0);
b(620,606,66,60,0);b(620,660,85,38,0);
b(688,693,18,10,M.P);b(698,681,8,12,M.I);b(692,673,13,7,M.N);
 return g;
}
function connect(g,fix){const W=2048,H=1024,s=g.length,seen=new Uint8Array(s),q=new Int32Array(s),solid=k=>k!==0&&k!==3&&k!==8;function scan(){seen.fill(0);let i=0,j=0;function add(v){if(solid(g[v])&&!seen[v]){seen[v]=1;q[j++]=v}}for(let x=0;x<W;x++){add(x);add((H-1)*W+x)}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1)}while(i<j){let v=q[i++],x=v%W,y=v/W|0;if(x>0)add(v-1);if(x<W-1)add(v+1);if(y>0)add(v-W);if(y<H-1)add(v+W)}return j}
let bearings=[],grounded=scan(),total=0;for(const k of g)if(solid(k))total++;
if(fix&&grounded<total)for(let step=0;step<3&&grounded<total;step++){const root=seen.slice(),handled=new Uint8Array(s),list=new Int32Array(s);for(let p=0;p<s;p++){if(root[p]||handled[p]||!solid(g[p]))continue;let r=0,n=1,bottom=p;list[0]=p;handled[p]=1;while(r<n){let v=list[r++],x=v%W,y=v/W|0;if(y>(bottom/W|0))bottom=v;for(const z of [x>0?v-1:-1,x<W-1?v+1:-1,y>0?v-W:-1,y<H-1?v+W:-1])if(z>=0&&!handled[z]&&!root[z]&&solid(g[z])){handled[z]=1;list[n++]=z}}const x=bottom%W,y=bottom/W|0;let end=H-1;for(let yy=y+1;yy<H;yy++)if(root[yy*W+x]&&solid(g[yy*W+x])){end=yy;break}for(let yy=y+1;yy<=end;yy++)for(let dx=-2;dx<=2;dx++){const X=x+dx,p=yy*W+X;if(X>16&&X<W-16&&g[p]===0)g[p]=62}bearings.push([x,y+1,end,n])}grounded=scan();total=0;for(const k of g)if(solid(k))total++;}
return {grounded,total,detached:total-grounded,bearings};
}

function rectangles(g){const W=2048,H=1024,a=[],past=new Map();for(let y=0;y<H;y++){const now=new Map();for(let x=0;x<W;){let m=g[y*W+x],start=x;x++;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=start+","+ (x-start)+","+m,old=past.get(key);if(old===undefined){old=a.length;a.push([start,y,x-start,1,m])}else a[old][3]++;now.set(key,old)}past.clear();for(const [k,v] of now)past.set(k,v)}return a}

function clearance(g,w,h){const W=2048,H=1024,I=W+1,s=new Uint32Array(I*(H+1)),allowed=new Uint8Array(W*H),rx=w>>1,ry=h>>1;for(let y=0;y<H;y++){let t=0;for(let x=0;x<W;x++){t+=g[y*W+x]?1:0;s[(y+1)*I+x+1]=s[y*I+x+1]+t}}let count=0;for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let a=x-rx,b=x+rx+1,c=y-ry,d=y+ry+1;if(s[d*I+b]-s[c*I+b]-s[d*I+a]+s[c*I+a]===0){allowed[y*W+x]=1;count++}}return {allowed,count}}

function flood(allowed){const W=2048,H=1024,q=new Int32Array(W*H),seen=new Uint8Array(W*H),start=420*W+80; if(!allowed[start])throw Error("spawn collides");let n=1,i=0;q[0]=start;seen[start]=1;while(i<n){let v=q[i++],x=v%W,y=v/W|0;for(let z of [x>0?v-1:-1,x<W-1?v+1:-1,y>0?v-W:-1,y<H-1?v+W:-1])if(z>=0&&allowed[z]&&!seen[z]){seen[z]=1;q[n++]=z}}return{seen,count:n}}

function replay(edits){const W=2048,H=1024,g=new Uint8Array(W*H);for(const [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||m===0||m>131)throw Error("invalid rectangle");for(let Y=y;Y<y+h;Y++)for(let X=x;X<x+w;X++){let k=Y*W+X;if(g[k])throw Error("overlap");g[k]=m}}return g}

function qualify(g,edits,sites){const W=2048,H=1024,t=replay(edits),hist={},liquids={open_faces:0,cross_reaction:0};for(let i=0;i<t.length;i++){if(t[i]!==g[i])throw Error("material rectangle replay mismatch");hist[g[i]]=(hist[g[i]]||0)+1}for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=y*W+x,m=g[k];if(m!==3&&m!==8)continue;for(let z of [x>0?k-1:-1,x<W-1?k+1:-1,y>0?k-W:-1,y<H-1?k+W:-1])if(z>=0){let v=g[z];if(v===0)liquids.open_faces++;if((m===3&&v===8)||(m===8&&v===3))liquids.cross_reaction++}}if(liquids.open_faces||liquids.cross_reaction)throw Error("fluid breach");let support=connect(g,false);if(support.detached)throw Error("detached solids "+support.detached);const route={};for(const [w,h] of [[19,15],[23,19],[31,27]]){let pass=clearance(g,w,h),r=flood(pass.allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);route[w+"x"+h]={passable_centres:pass.count,reachable_centres:r.count,sites:sites.length,missing:miss};if(miss.length)throw Error("route "+w+"x"+h+" "+JSON.stringify(miss))}let obstructions=[];for(let [x,y] of [[895,445],[1350,471]]){let a=g.slice();for(let Y=y;Y<y+64;Y++)a.fill(58,Y*W+x,Y*W+x+52);let r=flood(clearance(a,31,27).allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);obstructions.push({rectangle:[x,y,52,64,58],missing:miss,reachable_centres:r.count});if(miss.length)throw Error("blocked "+JSON.stringify(miss))}return{hist,liquids,support,route,obstructions}}

function ascii(s){let a=new Uint8Array(s.length);for(let i=0;i<a.length;i++){if(s.charCodeAt(i)>127)throw Error("non-ASCII "+s.charCodeAt(i));a[i]=s.charCodeAt(i)}return a}

function sha256(arr){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let s=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],n=arr.length,L=((n+9+63)>>6)<<6,b=new Uint8Array(L);b.set(arr);b[n]=128;let bits=n*8;b[L-4]=bits>>>24;b[L-3]=bits>>>16;b[L-2]=bits>>>8;b[L-1]=bits&255;const ro=(v,c)=>(v>>>c)|(v<<(32-c));for(let base=0;base<L;base+=64){let v=new Uint32Array(64);for(let i=0;i<16;i++){let j=base+i*4;v[i]=((b[j]<<24)|(b[j+1]<<16)|(b[j+2]<<8)|b[j+3])>>>0}for(let i=16;i<64;i++){let t=v[i-15],u=v[i-2];v[i]=(v[i-16]+(ro(t,7)^ro(t,18)^(t>>>3))+v[i-7]+(ro(u,17)^ro(u,19)^(u>>>10)))>>>0}let [a,c,d,e,f,g,h,z]=s;for(let i=0;i<64;i++){let T1=(z+(ro(f,6)^ro(f,11)^ro(f,25))+((f&g)^(~f&h))+K[i]+v[i])>>>0,T2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&c)^(a&d)^(c&d)))>>>0;z=h;h=g;g=f;f=(e+T1)>>>0;e=d;d=c;c=a;a=(T1+T2)>>>0}for(let i=0;i<8;i++)s[i]=(s[i]+[a,c,d,e,f,g,h,z][i])>>>0}return s.map(x=>x.toString(16).padStart(8,"0")).join("")}

function crc(arr){let c=-1;for(const b of arr){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}

function join(parts){let n=parts.reduce((s,p)=>s+p.length,0),r=new Uint8Array(n),at=0;for(const p of parts){r.set(p,at);at+=p.length}return r}

function png(g,x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y0+y)*2048+x0,(y0+y)*2048+x0+w),y*(w+1)+1);let a=1,b=0;for(const v of raw){a=(a+v)%65521;b=(b+a)%65521}let z=[[120,1]],p=0;while(p<raw.length){let n=Math.min(65535,raw.length-p),fin=p+n===raw.length;z.push([fin?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255]);z.push(raw.subarray(p,p+n));p+=n}z.push([b>>>8,b&255,a>>>8,a&255]);const palette=new Uint8Array(768),cl={0:[9,14,25],3:[41,128,184],8:[240,94,37],58:[78,84,99],62:[133,146,160],63:[53,102,131],66:[113,135,153],68:[83,123,141],70:[192,191,172],76:[228,185,63],77:[70,243,227],79:[250,161,74],100:[45,55,66],101:[32,37,50],104:[133,64,55],117:[145,153,169],120:[77,183,205],122:[175,225,225],123:[88,226,160]};for(let i=0;i<256;i++)palette.set(cl[i]||[164,85,141],3*i);const U=(v)=>[(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255];const chunk=(t,d)=>{let c=join([ascii(t),d]);return join([U(d.length),c,U(crc(c))])};return join([[137,80,78,71,13,10,26,10],chunk("IHDR",join([U(w),U(h),[8,3,0,0,0]])),chunk("PLTE",palette),chunk("IDAT",join(z)),chunk("IEND",[])])}

function checkPng(bytes,g,x0,y0,w,h){const u=p=>((bytes[p]*16777216)+(bytes[p+1]<<16)+(bytes[p+2]<<8)+bytes[p+3])>>>0;let at=8,ids=[],iend=false;while(at<bytes.length){let n=u(at),type=String.fromCharCode(...bytes.subarray(at+4,at+8));if(u(at+8+n)!==crc(bytes.subarray(at+4,at+8+n)))throw Error("PNG CRC");if(type==="IHDR"&&(u(at+8)!==w||u(at+12)!==h||bytes[at+17]!==3))throw Error("PNG IHDR");if(type==="IDAT")ids.push(bytes.subarray(at+8,at+8+n));if(type==="IEND")iend=true;at+=12+n}if(!iend)throw Error("missing IEND");const z=join(ids),r=new Uint8Array((w+1)*h);let p=2,j=0;while(true){let f=z[p++],n=z[p]|z[p+1]<<8,N=z[p+2]|z[p+3]<<8;p+=4;if((n^N)!==65535||(f&6))throw Error("Bad DEFLATE");r.set(z.subarray(p,p+n),j);p+=n;j+=n;if(f&1)break}if(j!==r.length)throw Error("PNG scanline");for(let y=0;y<h;y++){let s=y*(w+1);if(r[s])throw Error("PNG filter");for(let x=0;x<w;x++)if(r[s+x+1]!==g[(y+y0)*2048+x+x0])throw Error("PNG index parity mismatch")}return w*h}
sites.push(["Assay entered inspection",204,699],["Splitters calibration",653,674],["West shield sensor",1014,645],["East shield isolation",1309,620],["Retort operator console",1515,534],["Quarantine extraction",1848,701]);
const g=world(),support=connect(g,true),edits=rectangles(g),check=qualify(g,edits,sites);
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:HASH,spawn:[80,420],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
const setupBytes=ascii(JSON.stringify(setup)+'\n');if(edits.length>32768||setupBytes.length>1048576)throw Error('Workbench budget');
const outputs={'setup.json':setupBytes};let imgs=[],pixel=0;
for(const [name,x,y,w,h] of [['overview',0,0,W,H],...crops]){let data=png(g,x,y,w,h),p=checkPng(data,g,x,y,w,h);imgs.push({name:name+'.png',x,y,width:w,height:h,bytes:data.length,sha256:sha256(data),material_pixels_checked:p});outputs[name+'.png']=data;pixel+=p;}
const receipt={schema:'original-landscape-static-v1',name:NAME,seed:SEED,engine_sha:ENGINE,base_sha:BASE,dimensions:[W,H],actual_cells:g.length,plane_sha256:sha256(g),setup_sha256:sha256(setupBytes),setup_bytes:setupBytes.length,rectangle_count:edits.length,construction_writes:edits.reduce((s,e)=>s+e[2]*e[3],0),histogram:check.hist,structural_grounded:check.support,added_steel_bearings:support.bearings,initial_liquid_isolation:check.liquids,sites,clearance:check.route,physical_obstructions:check.obstructions,images:imgs,decoded_material_pixels_compared:pixel,native:'NATIVE-UNTESTED',installed_bridge_capacity:'UNKNOWN; source 32768 / possible old installed 4096'};
outputs['receipt.json']=ascii(JSON.stringify(receipt,null,2)+'\n');
const verifying=process.argv.includes('--verify');
for(const [name,content] of Object.entries(outputs)){const p=path.join(__dirname,name);if(verifying){if(!fs.existsSync(p)||!Buffer.from(content).equals(fs.readFileSync(p)))throw Error('Byte mismatch '+name);}else fs.writeFileSync(p,content);}
console.log(JSON.stringify({status:'PASS',mode:verifying?'verify':'build',rectangles:edits.length,json_bytes:setupBytes.length,full_plane_sha256:sha256(g),pixels_checked:pixel}));
