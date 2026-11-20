'use strict';
// ORIGINAL Aperture-13 Flame Arrest Gallery, fixed seed 19260483. No source art, tracing, or AI concept rendering.
// Read-only engine authority: de109d0131641d6adc8d25bb9ced7ca3d4991105
const fs=require('node:fs'),path=require('node:path');
const W=2048,H=1024,NAME="Vesper-9 Graphite Reclamation Lock",SEED=2026112009,ENGINE="de109d0131641d6adc8d25bb9ced7ca3d4991105",BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",sites=[["Rail embarkation",73,510],["West canister weighing approach",215,538],["Overhead counterweight",315,351],["Entered assay access",345,738],["Western lower recovery",410,819],["Rotor high lookout",633,260],["Wheel maintenance bore",550,462],["Rotor service desk approach",794,753],["Rotor lower service",794,827],["Western furnace gate",864,540],["Induction high watch",1093,239],["Dry flash chamber",1082,490],["West furnace instrument access",915,562],["East furnace instrument access",1261,600],["East furnace undercroft recovery",1261,854],["Wet baffle west",1320,514],["Wet baffle upper view",1492,352],["Filter mezzanine access",1575,553],["Drain access",1575,823],["Export canister queue",1797,551],["Dispatch departure workface",1850,543],["Eastern emergency exit",1981,704],["Undergrade East return",1904,846]],crops=[["rail",37,258,394,573],["rotor",438,205,388,634],["induction",839,180,437,692],["scrubber",1296,244,334,635],["dispatch",1662,271,340,623]],policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];

function world(){
 const g=new Uint8Array(W*H),M={B:100,C:58,S:62,P:63,G:66,T:68,A:70,F:104,I:117,H:76,N:77,O:79,L:120,U:123,D:101};
 function b(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(w<=0||h<=0)return;for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++){let x0=Math.max(0,x),x1=Math.min(W,x+w);if(x1>x0)g.fill(m,yy*W+x0,yy*W+x1)}}
 function l(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y))/3));for(let i=0;i<=n;i++)b(x+(X-x)*i/n-t/2,y+(Y-y)*i/n-t/2,t,t,m)}
 function deck(x,y,w,t=9){b(x,y,w,t,M.S);b(x,y+t,w,4,M.P)}
 function post(x,y,w=15,m=M.C){b(x,y,w,888-y,m)}
 function booth(x,y,w,h){b(x,y,w,h,M.C);b(x+9,y+10,w-18,h-18,0);b(x+3,y+3,w-6,6,M.S);b(x-4,y+h-7,w+8,8,M.F)}
 function vessel(x,y,w,h,type,level){b(x,y,w,h,M.C);b(x+11,y+12,w-22,h-24,type);b(x+11,y+12,w-22,Math.floor((h-24)*(1-level)),M.C);b(x,y,w,9,M.S);b(x,y+h-9,w,9,M.F)}
 function instrument(x,y){b(x,y+19,10,18,M.T);b(x-6,y+8,22,11,M.P);b(x-3,y,16,8,M.N);b(x+11,y+11,8,7,M.O)}
 b(0,888,2048,136,M.B);b(0,0,18,1024,M.C);b(2030,0,18,1024,M.C);
 for(let x=18;x<2030;x+=24){let h=14+Math.round(6*Math.sin(x/113)+5*Math.sin(x/43));b(x,888-h,Math.min(24,2030-x),h,M.D)}
 post(101,397,28);post(372,448,27);deck(94,651,308,12);deck(102,771,300,10);
 l(110,405,229,305,13,M.S);l(229,305,380,452,12,M.I);l(112,606,274,419,10,M.T);
 l(242,308,240,505,9,M.S);b(226,295,51,15,M.O);b(229,316,43,9,M.G);
 b(190,600,128,30,M.S);b(208,589,95,11,M.H);b(215,571,80,15,M.P);
 for(let i=0;i<4;i++){b(201+i*30,593,7,35,M.T);b(209+i*30,589,18,8,M.N)}
 booth(153,694,180,73);b(153,719,50,42,0);b(290,720,48,40,0);
 deck(173,755,129,6);instrument(243,715);instrument(311,716);
 l(348,490,386,532,11,M.I);l(348,490,347,641,6,M.T);
 b(407,655,74,203,0);
 post(476,469,23);post(761,430,26);deck(455,666,349,12);deck(477,783,311,10);
 const cx=631,cy=462,R=130;for(let i=0;i<240;i++){let a=i*Math.PI*2/240;b(cx+R*Math.cos(a)-10,cy+R*Math.sin(a)-10,20,20,M.I)}
 for(let i=0;i<10;i++){let a=i*Math.PI*2/10;l(cx+33*Math.cos(a),cy+33*Math.sin(a),cx+R*Math.cos(a),cy+R*Math.sin(a),7,i%2?M.T:M.S)}
 b(cx-36,cy-34,72,68,M.C);b(cx-23,cy-23,46,46,M.S);b(cx-11,cy-11,22,22,M.O);
 l(cx,cy+32,cx,666,17,M.C);l(505,650,546,593,9,M.I);l(748,651,719,591,9,M.I);
 booth(492,700,98,70);b(483,725,39,39,0);instrument(551,720);
 booth(688,700,88,71);b(756,727,28,38,0);instrument(718,716);
 b(592,711,83,16,M.S);b(610,695,42,16,M.G);b(620,683,21,12,M.N);
 post(856,312,28);post(1242,350,28);
 l(866,315,940,238,21,M.F);l(940,238,1013,353,19,M.I);
 l(1252,351,1177,257,21,M.F);l(1177,257,1118,370,19,M.I);
 deck(844,678,439,13);deck(852,789,414,10);
 l(868,647,941,723,15,M.T);l(1261,648,1203,728,15,M.T);
 b(944,722,251,15,M.S);b(959,732,225,9,M.H);
 vessel(971,711,102,96,8,.64);vessel(1093,711,87,96,8,.51);
 b(973,709,209,9,M.F);b(974,811,206,11,M.C);
 booth(863,576,90,92);b(940,601,31,58,0);instrument(906,624);
 booth(1204,572,72,94);b(1194,599,34,60,0);instrument(1231,620);
 l(944,670,972,705,8,M.T);l(1182,703,1205,670,8,M.T);
 post(1310,479,25);post(1571,426,26);deck(1307,638,321,12);deck(1299,795,332,11);
 l(1323,492,1402,338,13,M.S);l(1402,338,1545,405,12,M.I);l(1545,405,1590,434,10,M.S);
 vessel(1347,673,81,105,3,.78);vessel(1450,680,76,93,3,.59);vessel(1545,666,70,113,3,.69);
 b(1365,652,47,15,M.G);b(1470,659,36,12,M.G);b(1563,650,32,16,M.G);
 for(let i=0;i<3;i++){let x=1364+i*89,y=533-i*22;b(x,y,66,11,M.S);b(x+14,y-12,41,12,M.A);b(x+20,y-18,25,7,M.U);l(x+32,y+11,x+32,638,7,M.T)}
 booth(1380,554,176,72);b(1373,578,42,43,0);b(1518,579,47,44,0);
 instrument(1452,589);instrument(1510,592);
 post(1679,424,26);post(1924,473,23);deck(1669,660,290,11);deck(1662,802,302,12);
 l(1694,441,1815,317,15,M.S);l(1815,317,1934,483,13,M.T);l(1693,619,1782,511,10,M.I);
 for(let i=0;i<4;i++){let x=1729+48*i;b(x,615,39,24,M.C);b(x+4,610,31,10,M.P);b(x+12,595,16,15,M.H);b(x+14,588,12,8,M.N)}
 booth(1755,712,169,76);b(1750,743,45,38,0);b(1891,739,42,40,0);
 deck(1792,778,96,7);instrument(1833,736);instrument(1897,737);
 l(1909,541,1947,615,9,M.S);b(1806,316,31,12,M.O);
 b(387,637,66,227,0);b(802,659,65,201,0);b(1271,654,63,207,0);b(1616,655,74,206,0);
 b(1053,632,65,98,0);b(1063,734,58,10,M.S);
 for(const [x,y] of [[117,644],[385,644],[474,659],[784,660],[853,671],[1245,671],[1313,631],[1595,630],[1676,652],[1930,654]])b(x,y-7,12,7,M.H);
 instrument(127,730);instrument(460,738);instrument(818,726);instrument(1290,737);instrument(1610,749);instrument(1700,745);
 b(424,498,49,170,0);b(808,500,48,178,0);b(1612,497,48,182,0);
 b(461,420,134,86,0);b(644,731,112,41,0);b(1914,650,79,77,0);b(1668,673,72,38,0);
 for(let [x,y,w,h] of [[93,462,46,132],[357,490,53,120],[464,499,52,96],[746,490,60,101],[843,466,61,133],[916,463,59,116],[1178,459,59,117],[1227,466,59,121],[1296,477,61,116],[1559,474,61,117],[1666,473,61,118],[1911,487,57,108],
 [366,578,88,284],[752,587,106,280],[1240,580,91,281],[1608,579,79,282],[1956,569,61,297],
 [839,805,72,62],[1226,804,68,64],[1299,807,61,60],[1561,803,65,65],[1908,805,57,60]])b(x,y,w,h,0);
 for(let [x,y,w,h] of [[141,705,72,49],[288,712,70,48],[485,710,61,50],[744,710,43,52],[856,590,54,69],[935,590,38,65],[1190,589,43,69],[1370,571,60,51],[1529,571,45,54],[1742,719,66,58],[1891,711,50,64]])b(x,y,w,h,0);
 b(112,507,286,57,0);b(461,524,334,52,0);b(837,506,445,57,0);b(1294,513,345,56,0);b(1667,513,297,58,0);
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

function qualify(g,edits,sites){const W=2048,H=1024,t=replay(edits),hist={},liquids={open_faces:0,cross_reaction:0};for(let i=0;i<t.length;i++){if(t[i]!==g[i])throw Error("material rectangle replay mismatch");hist[g[i]]=(hist[g[i]]||0)+1}for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=y*W+x,m=g[k];if(m!==3&&m!==8)continue;for(let z of [x>0?k-1:-1,x<W-1?k+1:-1,y>0?k-W:-1,y<H-1?k+W:-1])if(z>=0){let v=g[z];if(v===0)liquids.open_faces++;if((m===3&&v===8)||(m===8&&v===3))liquids.cross_reaction++}}if(liquids.open_faces||liquids.cross_reaction)throw Error("fluid breach");let support=connect(g,false);if(support.detached)throw Error("detached solids "+support.detached);const route={};for(const [w,h] of [[19,15],[23,19],[31,27]]){let pass=clearance(g,w,h),r=flood(pass.allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);route[w+"x"+h]={passable_centres:pass.count,reachable_centres:r.count,sites:sites.length,missing:miss};if(miss.length)throw Error("route "+w+"x"+h+" "+JSON.stringify(miss))}let obstructions=[];for(let [x,y] of [[404,524],[1281,545]]){let a=g.slice();for(let Y=y;Y<y+64;Y++)a.fill(58,Y*W+x,Y*W+x+52);let r=flood(clearance(a,31,27).allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);obstructions.push({rectangle:[x,y,52,64,58],missing:miss,reachable_centres:r.count});if(miss.length)throw Error("blocked "+JSON.stringify(miss))}return{hist,liquids,support,route,obstructions}}

function ascii(s){let a=new Uint8Array(s.length);for(let i=0;i<a.length;i++){if(s.charCodeAt(i)>127)throw Error("non-ASCII "+s.charCodeAt(i));a[i]=s.charCodeAt(i)}return a}

function sha256(arr){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let s=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],n=arr.length,L=((n+9+63)>>6)<<6,b=new Uint8Array(L);b.set(arr);b[n]=128;let bits=n*8;b[L-4]=bits>>>24;b[L-3]=bits>>>16;b[L-2]=bits>>>8;b[L-1]=bits&255;const ro=(v,c)=>(v>>>c)|(v<<(32-c));for(let base=0;base<L;base+=64){let v=new Uint32Array(64);for(let i=0;i<16;i++){let j=base+i*4;v[i]=((b[j]<<24)|(b[j+1]<<16)|(b[j+2]<<8)|b[j+3])>>>0}for(let i=16;i<64;i++){let t=v[i-15],u=v[i-2];v[i]=(v[i-16]+(ro(t,7)^ro(t,18)^(t>>>3))+v[i-7]+(ro(u,17)^ro(u,19)^(u>>>10)))>>>0}let [a,c,d,e,f,g,h,z]=s;for(let i=0;i<64;i++){let T1=(z+(ro(f,6)^ro(f,11)^ro(f,25))+((f&g)^(~f&h))+K[i]+v[i])>>>0,T2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&c)^(a&d)^(c&d)))>>>0;z=h;h=g;g=f;f=(e+T1)>>>0;e=d;d=c;c=a;a=(T1+T2)>>>0}for(let i=0;i<8;i++)s[i]=(s[i]+[a,c,d,e,f,g,h,z][i])>>>0}return s.map(x=>x.toString(16).padStart(8,"0")).join("")}

function crc(arr){let c=-1;for(const b of arr){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}

function join(parts){let n=parts.reduce((s,p)=>s+p.length,0),r=new Uint8Array(n),at=0;for(const p of parts){r.set(p,at);at+=p.length}return r}

function png(g,x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y0+y)*2048+x0,(y0+y)*2048+x0+w),y*(w+1)+1);let a=1,b=0;for(const v of raw){a=(a+v)%65521;b=(b+a)%65521}let z=[[120,1]],p=0;while(p<raw.length){let n=Math.min(65535,raw.length-p),fin=p+n===raw.length;z.push([fin?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255]);z.push(raw.subarray(p,p+n));p+=n}z.push([b>>>8,b&255,a>>>8,a&255]);const palette=new Uint8Array(768),cl={0:[9,14,25],3:[41,128,184],8:[240,94,37],58:[78,84,99],62:[133,146,160],63:[53,102,131],66:[113,135,153],68:[83,123,141],70:[192,191,172],76:[228,185,63],77:[70,243,227],79:[250,161,74],100:[45,55,66],101:[32,37,50],104:[133,64,55],117:[145,153,169],120:[77,183,205],122:[175,225,225],123:[88,226,160]};for(let i=0;i<256;i++)palette.set(cl[i]||[164,85,141],3*i);const U=(v)=>[(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255];const chunk=(t,d)=>{let c=join([ascii(t),d]);return join([U(d.length),c,U(crc(c))])};return join([[137,80,78,71,13,10,26,10],chunk("IHDR",join([U(w),U(h),[8,3,0,0,0]])),chunk("PLTE",palette),chunk("IDAT",join(z)),chunk("IEND",[])])}

function checkPng(bytes,g,x0,y0,w,h){const u=p=>((bytes[p]*16777216)+(bytes[p+1]<<16)+(bytes[p+2]<<8)+bytes[p+3])>>>0;let at=8,ids=[],iend=false;while(at<bytes.length){let n=u(at),type=String.fromCharCode(...bytes.subarray(at+4,at+8));if(u(at+8+n)!==crc(bytes.subarray(at+4,at+8+n)))throw Error("PNG CRC");if(type==="IHDR"&&(u(at+8)!==w||u(at+12)!==h||bytes[at+17]!==3))throw Error("PNG IHDR");if(type==="IDAT")ids.push(bytes.subarray(at+8,at+8+n));if(type==="IEND")iend=true;at+=12+n}if(!iend)throw Error("missing IEND");const z=join(ids),r=new Uint8Array((w+1)*h);let p=2,j=0;while(true){let f=z[p++],n=z[p]|z[p+1]<<8,N=z[p+2]|z[p+3]<<8;p+=4;if((n^N)!==65535||(f&6))throw Error("Bad DEFLATE");r.set(z.subarray(p,p+n),j);p+=n;j+=n;if(f&1)break}if(j!==r.length)throw Error("PNG scanline");for(let y=0;y<h;y++){let s=y*(w+1);if(r[s])throw Error("PNG filter");for(let x=0;x<w;x++)if(r[s+x+1]!==g[(y+y0)*2048+x+x0])throw Error("PNG index parity mismatch")}return w*h}
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
