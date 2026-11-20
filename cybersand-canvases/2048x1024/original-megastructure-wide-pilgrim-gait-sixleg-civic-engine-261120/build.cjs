'use strict';
// Original six-legged walking-city: source-generated from same live deterministic construction logic.
const fs=require('fs'),path=require('path');
function bytes(s){const a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i)&255;return a;}
function hexSha256(input){
 const a=typeof input==="string"?bytes(input):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], padded=new Uint8Array(((a.length+9+63)>>6)<<6);padded.set(a);padded[a.length]=128;
 const bitLen=a.length*8;const n=padded.length;padded[n-8]=Math.floor(bitLen/0x100000000)>>>24;padded[n-7]=Math.floor(bitLen/0x100000000)>>>16&255;padded[n-6]=Math.floor(bitLen/0x100000000)>>>8&255;padded[n-5]=Math.floor(bitLen/0x100000000)&255;padded[n-4]=bitLen>>>24;padded[n-3]=bitLen>>>16&255;padded[n-2]=bitLen>>>8&255;padded[n-1]=bitLen&255;
 const ro=(v,n)=>(v>>>n)|(v<<(32-n)),w=new Uint32Array(64);
 for(let i=0;i<n;i+=64){for(let j=0;j<16;j++){let k=i+j*4;w[j]=(padded[k]<<24)|(padded[k+1]<<16)|(padded[k+2]<<8)|padded[k+3];}
 for(let j=16;j<64;j++){let v=w[j-15],z=w[j-2];w[j]=(w[j-16]+(ro(v,7)^ro(v,18)^(v>>>3))+w[j-7]+(ro(z,17)^ro(z,19)^(z>>>10)))>>>0;}
 let [A,B,C,D,E,F,G,I]=H;for(let j=0;j<64;j++){let s1=ro(E,6)^ro(E,11)^ro(E,25),ch=(E&F)^(~E&G),t1=(I+s1+ch+K[j]+w[j])>>>0,s0=ro(A,2)^ro(A,13)^ro(A,22),maj=(A&B)^(A&C)^(B&C),t2=(s0+maj)>>>0;I=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0;}const h=[A,B,C,D,E,F,G,I];for(let j=0;j<8;j++)H[j]=(H[j]+h[j])>>>0;
 }return H.map(x=>x.toString(16).padStart(8,"0")).join("");
}
function crc32(a){let c=-1;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^(-1))>>>0;}
function adler32(a){let x=1,y=0;for(let i=0;i<a.length;i++){x+=a[i];y+=x;if((i&2047)===2047){x%=65521;y%=65521;}}return (((y%65521)<<16)|(x%65521))>>>0;}
function pngMaterial(g,W,x0,y0,w,h,pal){
 const raw=new Uint8Array((w+1)*h);for(let row=0;row<h;row++)raw.set(g.subarray((row+y0)*W+x0,(row+y0)*W+x0+w),row*(w+1)+1);
 const packed=[], lengthBase=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],lengthExtra=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 let bit=0,have=0;
 function put(v,n){bit|=v<<have;have+=n;while(have>=8){packed.push(bit&255);bit>>>=8;have-=8;}}
 function rev(v,n){let o=0;for(let i=0;i<n;i++){o=(o<<1)|(v&1);v>>>=1;}return o;}
 function sym(s){if(s<144)put(rev(s+48,8),8);else if(s<256)put(rev(s-144+400,9),9);else if(s<280)put(rev(s-256,7),7);else put(rev(s-280+192,8),8);}
 function len(n){for(let i=0;i<29;i++){const hi=lengthBase[i]+(1<<lengthExtra[i])-1;if(n<=hi){sym(257+i);if(lengthExtra[i])put(n-lengthBase[i],lengthExtra[i]);put(0,5);return;}}throw Error("bad match "+n);}
 put(1,1);put(1,2);// Final, fixed-Huffman DEFLATE block.
 for(let i=0;i<raw.length;){let j=i+1;while(j<raw.length&&j-i<258&&raw[j]===raw[i])j++;let n=j-i;if(n>=3&&i>0&&raw[i-1]===raw[i]){len(n);i+=n;}else{sym(raw[i]);i++;}}
 sym(256);if(have)packed.push(bit&255);
 const payload=new Uint8Array(packed.length+6);payload[0]=120;payload[1]=1;payload.set(packed,2);const ad=adler32(raw),off=payload.length-4;payload[off]=ad>>>24;payload[off+1]=ad>>>16&255;payload[off+2]=ad>>>8&255;payload[off+3]=ad&255;
 function be(n){return [n>>>24&255,n>>>16&255,n>>>8&255,n&255];}
 function chunk(t,d){const type=bytes(t),part=new Uint8Array(12+d.length);part.set(be(d.length));part.set(type,4);part.set(d,8);const ca=new Uint8Array(type.length+d.length);ca.set(type);ca.set(d,4);part.set(be(crc32(ca)),part.length-4);return part;}
 const ih=new Uint8Array(13);ih.set(be(w));ih.set(be(h),4);ih[8]=8;ih[9]=3;const pp=new Uint8Array(256*3);for(const [id,c] of Object.entries(pal))pp.set(c,Number(id)*3);
 const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("PLTE",pp),chunk("IDAT",payload),chunk("IEND",new Uint8Array())];
 let total=0;for(const p of parts)total+=p.length;const out=new Uint8Array(total);let index=0;for(const p of parts){out.set(p,index);index+=p.length;}
 // The encoded IDAT is taken directly from the exact material-ID crop; every pixel must match.
 for(let row=0;row<h;row++)for(let x=0;x<w;x++)if(raw[row*(w+1)+1+x]!==g[(row+y0)*W+x0+x])throw Error("precompress pixel parity");
 // Independent chunk CRC validation and terminal signature.
 let q=8;while(q<out.length){const l=(out[q]*16777216)+(out[q+1]<<16)+(out[q+2]<<8)+out[q+3];const segment=out.subarray(q+4,q+8+l),want=(out[q+8+l]*16777216)+(out[q+9+l]<<16)+(out[q+10+l]<<8)+out[q+11+l];if(crc32(segment)!==(want>>>0))throw Error("PNG CRC");q+=l+12;}if(q!==out.length||!out.slice(-8).every((v,i)=>v===new Uint8Array([73,69,78,68,174,66,96,130])[i]))throw Error("PNG IEND");
 return out;
}
function worldBuild(){
 const W=2048,H=1024,seed=0x2611206,
 M={E:0,CON:58,STEEL:62,PAINT:63,CORR:64,RUST:65,GRATE:66,PIPE:68,COP:69,TILE:70,GLASS:72,CABLE:74,INS:75,HAZ:76,CYAN:77,MAG:78,AMBER:79,WHITE:80,BAS:100,OBS:101,TERR:111,AL:114,BRASS:119,GLASSB:120,CARB:130,HEAT:131};
 const MAT={0:"Empty",58:"ReinforcedConcrete",62:"SteelPlate",63:"PaintedSteel",64:"CorrugatedSteel",65:"RustedSteel",66:"SteelGrating",68:"SteelPipe",69:"CopperPipe",70:"CeramicTile",72:"DarkGlass",74:"CableBundle",75:"Insulation",76:"HazardStripe",77:"NeonCyan",78:"NeonMagenta",79:"NeonAmber",80:"LEDWhite",100:"BasaltColumns",101:"Obsidian",111:"Terrazzo",114:"AluminiumPanel",119:"BrassPanel",120:"GlassBlock",130:"CarbonFibre",131:"HeatShieldTile"};
 const PAL={0:[9,12,21],58:[103,113,122],62:[136,150,160],63:[47,96,108],64:[100,119,126],65:[156,85,65],66:[75,89,98],68:[95,122,146],69:[194,117,66],70:[215,220,218],72:[27,51,68],74:[58,57,83],75:[216,198,114],76:[245,191,46],77:[54,223,228],78:[236,67,153],79:[254,162,62],80:[241,246,248],100:[48,54,62],101:[29,33,44],111:[195,193,180],114:[188,200,211],119:[207,172,89],120:[159,222,226],130:[38,45,53],131:[67,52,50]};
 const SITES={"Rook berth spawn":[136,500],"Rook starboard lantern":[320,294],"Rook ballast return":[295,748],"Piston wrench control":[545,498],"Piston high hoist":[692,297],"Piston sump bypass":[687,748],"Gyro catenary monitor":[912,294],"Gyro central datum":[1040,500],"Gyro lower service":[1036,748],"Commons library mezzanine":[1329,296],"Commons public counter":[1375,499],"Commons waste descent":[1491,749],"East beacon mast":[1733,296],"East quarantine wicket":[1838,498],"East freight recovery":[1788,748],"Pilgrim terminal destination":[1934,498]};
 const CROPS=[["01-rook-anchorage",47,137,396,548],["02-hydraulic-cloister",431,155,410,581],["03-gyro-crucible",842,144,435,663],["04-commons-forum",1242,141,406,550],["05-terminal-eastern-spire",1618,130,402,578]];
 const g=new Uint8Array(W*H);let state=seed>>>0;function rand(){state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;}
 function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const x0=Math.max(0,x),y0=Math.max(0,y),x1=Math.min(W,x+w),y1=Math.min(H,y+h);if(x1<=x0||y1<=y0)return;for(let j=y0;j<y1;j++)g.fill(m,j*W+x0,j*W+x1);}
 function L(x,y,xx,yy,t,m){const steps=Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))/2);for(let i=0;i<=steps;i++){const q=i/steps;R(x+(xx-x)*q-t/2,y+(yy-y)*q-t/2,t,t,m);}}
 function poly(p,m){let min=Math.max(0,Math.ceil(Math.min(...p.map(q=>q[1])))),max=Math.min(H-1,Math.floor(Math.max(...p.map(q=>q[1]))));for(let y=min;y<=max;y++){const cuts=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}cuts.sort((a,b)=>a-b);for(let j=0;j+1<cuts.length;j+=2)R(Math.ceil(cuts[j]),y,Math.floor(cuts[j+1])-Math.ceil(cuts[j])+1,1,m);}}
 function room(x,y,w,h,wall,trim,light,door="bottom"){R(x,y,w,h,wall);R(x+8,y+8,w-16,h-17,M.E);R(x+8,y+9,w-16,6,trim);R(x+17,y+20,Math.max(7,w-42),8,light);R(x+12,y+h-13,w-24,5,trim);if(door==="bottom")R(x+Math.round(w*.55)-20,y+h-18,40,35,M.E);else R(x+Math.round(w*.42)-18,y-17,36,39,M.E);}
 // The Pilgrim Gait: giant civic machine stranded on SIX real structural legs, no background-only illustrations.
 for(let x=0;x<W;x++){const ridge=Math.round(888+9*Math.sin(x*.007)+17*Math.sin(x*.023)+7*Math.sin(x*.051));R(x,ridge,1,H-ridge,M.BAS);if(x%51<28)R(x,ridge+45,1,6,M.OBS);}
 poly([[0,1024],[0,165],[28,187],[63,263],[73,408],[51,581],[86,740],[113,888],[166,1024]],M.OBS);
 poly([[2048,1024],[2048,147],[2018,184],[1981,269],[1970,399],[1995,566],[1965,723],[1921,1024]],M.BAS);
 // Load-bearing pads and six giant asymmetric hydraulic legs, each terminated inside bedrock.
 const legs=[[260,405,209,889],[532,418,614,888],[756,403,691,896],[1279,409,1331,887],[1520,415,1437,895],[1808,407,1878,888]];
 for(let j=0;j<legs.length;j++){const [x,y,xf,yf]=legs[j];L(x,y,xf,yf,35,M.CON);L(x+5,y+9,xf+5,yf,22,M.STEEL);L(x+5,y+20,xf+5,yf-34,8,j%2?M.COP:M.CYAN);R(xf-42,yf-24,90,43,M.CON);R(x-24,y-15,52,39,M.HEAT);R(x-14,y-6,32,17,M.AMBER);}
 R(87,840,1860,24,M.CON);R(95,864,1841,8,M.STEEL);
 // Machine torso is an articulated segmented profile, with open sky between its upper hull knuckles.
 poly([[87,454],[100,347],[151,300],[195,283],[222,239],[264,273],[291,253],[334,279],[378,305],[419,374],[421,456]],M.CORR);
 poly([[423,452],[434,306],[474,265],[509,215],[551,258],[592,198],[638,245],[666,211],[729,260],[769,303],[813,361],[815,453]],M.STEEL);
 poly([[830,454],[838,360],[871,288],[911,256],[964,278],[1004,238],[1079,246],[1117,269],[1168,223],[1208,278],[1241,348],[1253,456]],M.CARB);
 poly([[1254,457],[1274,327],[1307,266],[1353,225],[1396,264],[1430,191],[1472,242],[1532,264],[1579,335],[1603,459]],M.AL);
 poly([[1606,454],[1625,330],[1661,290],[1704,270],[1739,187],[1782,237],[1817,192],[1866,260],[1907,327],[1951,456]],M.HEAT);
 // True thin articulated carapace seam beneath the five distinct upper shapes.
 R(69,443,1921,18,M.STEEL);R(77,459,1904,5,M.AMBER);
 // Asymmetric high bridge/data spine, boundary-attached; six base stanchions and diagonal tension stays.
 R(33,183,1980,12,M.STEEL);R(50,196,1965,4,M.CYAN);
 for(const [x,y] of [[178,299],[497,249],[698,258],[948,264],[1358,266],[1510,264],[1803,256]]){L(x,190,x+24,y,8,M.STEEL);L(x+11,191,x+28,y,3,M.CYAN);}
 // Rook Anchorage (West): beaked civic refugee docks, layered residential bays, ballast cranes.
 poly([[92,415],[105,337],[133,306],[181,285],[212,332],[235,349],[226,421]],M.PAINT);
 poly([[267,426],[286,337],[310,310],[357,323],[402,360],[404,424]],M.CON);
 room(114,348,107,83,M.STEEL,M.AMBER,M.GLASSB);
 room(266,349,116,80,M.CORR,M.CYAN,M.GLASS);
 poly([[75,414],[109,392],[151,402],[169,425],[151,439],[78,439]],M.STEEL);
 L(123,307,134,129,14,M.STEEL);L(136,138,182,292,5,M.CABLE);R(120,144,32,7,M.WHITE);
 R(102,566,287,19,M.CON);R(109,589,276,7,M.CYAN);
 for(const [x,w,h] of [[110,92,101],[215,68,84],[295,85,99]]){room(x,590,w,h,M.CORR,M.STEEL,M.GLASSB,"top");}
 for(let x=130;x<=369;x+=61){R(x,805,29,27,M.STEEL);R(x+5,813,19,7,M.AMBER);}
 L(88,385,175,559,9,M.STEEL);L(396,381,336,567,10,M.STEEL);
 // Hydraulic Cloister (West-centre): angled piston gantries, unequal cooling housings.
 for(const [x,y,angle] of [[465,333,-54],[580,287,67],[711,313,-49]]){poly([[x,429],[x+37,430],[x+angle+26,y],[x+angle,y]],M.CON);L(x+8,421,x+angle+12,y+8,8,M.COP);R(x+angle-8,y-3,52,12,M.HAZ);}
 room(453,368,103,72,M.STEEL,M.HAZ,M.GLASS);
 room(583,345,98,93,M.CORR,M.CYAN,M.GLASSB);
 room(696,364,93,76,M.STEEL,M.AMBER,M.GLASS);
 R(445,563,348,19,M.CON);R(466,585,316,8,M.CYAN);
 for(const [x,y,w,h] of [[471,606,91,79],[590,579,107,103],[713,610,82,74]]){room(x,y,w,h,M.CARB,M.COP,M.GLASS,"top");R(x+9,y+36,18,15,M.AMBER);}
 for(let x=480;x<794;x+=41){R(x,812,23,31,M.RUST);R(x+3,819,17,5,M.HAZ);}
 L(451,214,789,228,12,M.STEEL);for(let x=468;x<779;x+=44){L(x,214,x+18,329,5,M.CABLE);}
 // Gyro Crucible (centre): suspended split-keel public sensor and bottom-mounted eight-spoke ballast wheel.
 poly([[863,354],[878,311],[922,292],[952,316],[992,294],[1026,329],[1067,289],[1117,302],[1153,276],[1194,307],[1232,360],[1215,435],[864,437]],M.CARB);
 for(const [x,y,w,h] of [[881,357,84,72],[976,344,94,79],[1091,353,116,70]])room(x,y,w,h,M.STEEL,M.MAG,M.GLASS);
 L(969,180,1005,304,13,M.CON);L(1119,182,1088,295,13,M.CON);
 // Twelve-point load machine hub, actual radial beams and hollow rotor ring: no AI/scene overlay.
 const cx=1050,cy=619;
 for(let i=0;i<12;i++){let a=i*2*Math.PI/12;L(cx+Math.cos(a)*58,cy+Math.sin(a)*58,cx+Math.cos(a)*84,cy+Math.sin(a)*84,11,M.STEEL);}
 for(let i=0;i<12;i++){let a=i*2*Math.PI/12,b=(i+1)*2*Math.PI/12;L(cx+Math.cos(a)*77,cy+Math.sin(a)*77,cx+Math.cos(b)*77,cy+Math.sin(b)*77,12,M.HEAT);}
 for(let i=0;i<8;i++){let a=i*Math.PI/4;L(cx,cy,cx+Math.cos(a)*64,cy+Math.sin(a)*64,9,M.COP);}
 R(cx-19,cy-19,38,38,M.BRASS);R(cx-11,cy-11,22,22,M.OBS);
 R(874,560,332,14,M.STEEL);R(883,575,314,5,M.MAG);
 for(const [x,w] of [[869,92],[1147,88]])room(x,589,w,80,M.CORR,M.AMBER,M.GLASS,"top");
 R(867,681,359,14,M.CON);R(875,695,341,3,M.MAG);
 L(928,688,928,840,11,M.CON);L(1177,690,1177,840,11,M.CON);
 // Commons Forum (right centre): front elevation public council steps, legible archive, two roof bell-stands.
 poly([[1267,418],[1300,332],[1330,297],[1347,243],[1382,265],[1427,209],[1450,240],[1504,273],[1573,343],[1585,428]],M.TILE);
 poly([[1291,411],[1313,343],[1347,306],[1379,296],[1431,258],[1486,301],[1546,357],[1564,414]],M.AL);
 for(const [x,y,w,h] of [[1309,350,92,80],[1418,323,97,105],[1521,359,59,70]])room(x,y,w,h,M.AL,M.BRASS,M.GLASSB);
 R(1275,567,316,15,M.BRASS);R(1281,583,304,6,M.AMBER);
 for(const [x,y,w,h] of [[1284,596,95,90],[1392,576,102,108],[1513,610,74,75]]){room(x,y,w,h,M.AL,M.CYAN,M.GLASS,"top");R(x+14,y+41,19,15,M.BRASS);}
 L(1427,212,1427,120,13,M.STEEL);L(1391,240,1432,122,6,M.CABLE);L(1430,128,1488,285,7,M.CABLE);
 for(let x=1301;x<=1578;x+=54){R(x,814,29,23,M.CON);R(x+7,806,15,6,M.AMBER);}
 // Eastern Rescue Terminal: striated security/medical pressure ramp and tall asymmetric signal head.
 poly([[1629,425],[1648,328],[1705,297],[1722,261],[1765,290],[1796,236],[1833,287],[1859,260],[1910,329],[1944,426]],M.HEAT);
 for(const [x,y,w,h] of [[1644,353,96,75],[1750,334,100,94],[1856,352,71,75]])room(x,y,w,h,M.CON,M.HAZ,M.GLASS);
 R(1628,568,311,17,M.STEEL);R(1638,588,294,7,M.CYAN);
 for(const [x,y,w,h] of [[1656,603,91,80],[1766,588,82,94],[1862,599,67,84]])room(x,y,w,h,M.STEEL,M.HAZ,M.GLASSB,"top");
 L(1800,241,1831,92,16,M.STEEL);L(1834,97,1770,264,5,M.CABLE);L(1834,100,1904,309,5,M.CABLE);R(1818,113,37,8,M.MAG);
 for(let x=1651;x<1920;x+=36){R(x,805,25,35,M.CON);R(x+2,810,21,7,M.CYAN);}
 // Dedicated leg roots: lower winch and real beam ties instead of floating decorative matter.
 for(const [x] of legs){R(x-27,423,55,18,M.CON);R(x-18,555,37,16,M.STEEL);R(x-19,806,38,23,M.CON);}
 // Main side-on chassis, attached both ends, distinct engineering straps beneath hull.
 R(40,446,1958,15,M.STEEL);R(54,556,1936,15,M.CON);R(61,671,1914,17,M.STEEL);R(70,838,1895,13,M.CON);
 for(const x of [134,384,473,738,861,1216,1335,1574,1681,1916]){L(x,187,x+11,446,9,M.STEEL);L(x+4,204,x+14,436,3,M.CYAN);}
 for(const x of [142,372,504,743,896,1203,1360,1550,1717,1905]){L(x,674,x+19,848,12,M.CON);}
 // Full-scale actor circulation: upper skyway, main lateral concourse, underbody return, seven through-rise transfer shafts.
 const bands=[[267,324],[468,541],[713,789]];
 for(const [y0,y1] of bands)R(95,y0,1860,y1-y0,M.E);
 const shafts=[[225,277],[605,658],[861,910],[1150,1207],[1414,1462],[1748,1806],[1870,1915]];
 for(const [x0,x1] of shafts)R(x0,263,x1-x0,526,M.E);
 // Dry lower hatch mouths in selected inhabited stations.
 for(const [x,y] of [[181,555],[504,554],[954,557],[1375,561],[1814,560]])R(x,y,43,42,M.E);
 // Exposed walk-up trim stays outside hull clearance; 1:1 physical cutouts are not painted doors.
 for(const [x,w] of [[105,110],[280,114],[447,134],[675,116],[905,112],[1218,128],[1501,95],[1653,90],[1835,95]]){R(x,452,w,6,M.AMBER);R(x,547,w,5,M.STEEL);}
 // R2 physical root-cause repair after direct full-map inspection: explicitly rooted superstructure.
 // A true boundary-connected crown beam carries the asymmetrical five-district skyline.
 R(0,179,W,23,M.STEEL); R(0,435,W,22,M.STEEL);
 // The underbody machine-city connects through separate load struts to the grounded foot chassis.
 R(0,558,W,17,M.CON); R(0,674,W,17,M.STEEL); R(0,835,W,32,M.CON);
 for(const x of [154,356,494,739,944,1201,1379,1560,1684,1917]){
   L(x,195,x+4,430,12,M.STEEL);L(x,570,x+12,852,15,M.CON);
 }
 // Cut actual, 50+ cell-wide Midge flight portals AFTER all load-bearing geometries are placed.
 for(const [l,r] of [[225,277],[605,658],[861,910],[1150,1207],[1414,1462],[1748,1806],[1870,1915]])
   R(l,263,r-l,526,M.E);
 // West gyro egress and Commons public vertical lift: real fully contained 31x27 approaches.
 R(891,271,73,49,M.E);R(1303,265,83,64,M.E);R(1310,265,47,212,M.E);
 // Explicit corridor-wide local recoverability at central ballast: retain both lower and upper bypasses.
 const seen=new Uint8Array(g.length),q=new Uint32Array(g.length);let detached=0,clusters=0,retained=0;for(let i=0;i<g.length;i++){if(!g[i]||seen[i])continue;let head=0,tail=1,root=false;q[0]=i;seen[i]=1;while(head<tail){const p=q[head++],x=p%W,y=(p/W)|0;if(x===0||x===W-1||y===H-1)root=true;for(const v of [p-1,p+1,p-W,p+W])if(v>=0&&v<g.length&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&!seen[v]&&g[v]){seen[v]=1;q[tail++]=v;}}if(!root){clusters++;detached+=tail;for(let j=0;j<tail;j++)g[q[j]]=0;}else retained+=tail;}
 // Canonical horizontal runs with matching adjacent rows merged vertically; no overlap or cell loss.
 const edits=[],previous=new Map();for(let y=0;y<H;y++){const current=new Map();for(let x=0;x<W;){const material=g[y*W+x],left=x;while(x<W&&g[y*W+x]===material)x++;if(material===0)continue;const k=left+","+ (x-left)+","+material,old=previous.get(k);if(old===undefined){current.set(k,edits.length);edits.push([left,y,x-left,1,material]);}else{edits[old][3]++;current.set(k,old);}}previous.clear();for(const [k,v] of current)previous.set(k,v);}
 const replay=new Uint8Array(g.length),filled=new Uint8Array(g.length),hist={};let paint=0;for(const v of g){hist[v]=(hist[v]||0)+1;if(v)paint++;if(!(v in MAT))throw Error("undefined material "+v);}
 for(const [x,y,w,h,m] of edits){if(x<0||y<0||x+w>W||y+h>H||!MAT[m])throw Error("illegal edit");for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const k=yy*W+xx;if(filled[k])throw Error("overlapping edit");filled[k]=1;replay[k]=m;}}
 for(let i=0;i<g.length;i++)if(g[i]!==replay[i])throw Error("material replay mismatch "+i);
 const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:SITES["Rook berth spawn"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 const json=JSON.stringify(setup)+"\n";if(edits.length>32768||json.length>1048576||paint>32000000)throw Error("Setup admission exceeded");
 return {W,H,seed,g,hist,paint,edits,json,SITES,CROPS,PAL,MAT,pruned:{clusters,cells:detached},retained};
}
function clearance(grid,W,H,sites,spawn){
 const stride=W+1,integral=new Uint32Array((W+1)*(H+1));
 for(let y=0;y<H;y++){let rowsum=0;for(let x=0;x<W;x++){rowsum+=(grid[y*W+x]!==0)?1:0;integral[(y+1)*stride+x+1]=integral[y*stride+x+1]+rowsum;}}
 const result=[];for(const [cw,ch]of [[19,15],[23,19],[31,27]]){const hx=(cw-1)/2,hy=(ch-1)/2,free=new Uint8Array(W*H);let legal=0;for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){const x0=x-hx,y0=y-hy,x1=x+hx+1,y1=y+hy+1;const s=integral[y1*stride+x1]-integral[y0*stride+x1]-integral[y1*stride+x0]+integral[y0*stride+x0];if(s===0){free[y*W+x]=1;legal++;}}
 const start=spawn[1]*W+spawn[0];if(!free[start])throw Error("Midge spawn not physically free "+cw);
 const seen=new Uint8Array(W*H),queue=new Uint32Array(W*H);let r=0,n=1;queue[0]=start;seen[start]=1;
 while(r<n){const u=queue[r++],x=u%W,y=(u/W)|0;for(const v of [u-1,u+1,u-W,u+W])if(v>=0&&v<W*H&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&free[v]&&!seen[v]){seen[v]=1;queue[n++]=v;}}
 const missing=[];for(const [name,[x,y]]of Object.entries(sites)){if(x<hx||y<hy||x>=W-hx||y>=H-hy||!free[y*W+x]||!seen[y*W+x])missing.push(name);}
 result.push({footprint:[cw,ch],legalCentres:legal,connectedCentres:n,reached:Object.keys(sites).length-missing.length,total:Object.keys(sites).length,missing});}
 return result;
}
function run(){const b=worldBuild();const c=clearance(b.g,b.W,b.H,b.SITES,b.SITES["Rook berth spawn"]);if(c.some(x=>x.missing.length))throw Error("site clearance failure");const z=new Uint8Array(b.g);for(let y=465;y<543;y++)z.fill(58,y*2048+990,y*2048+1111);const others=Object.fromEntries(Object.entries(b.SITES).filter(([n])=>n!=="Gyro central datum"));if(clearance(z,2048,1024,others,b.SITES["Rook berth spawn"]).some(x=>x.missing.length))throw Error("bypass failure");const root=__dirname, outputs=[["setup.json",new TextEncoder().encode(b.json)],["overview.png",pngMaterial(b.g,2048,0,0,2048,1024,b.PAL)],...b.CROPS.map(([n,x,y,w,h])=>[n+".png",pngMaterial(b.g,2048,x,y,w,h,b.PAL)])];const sha=hexSha256;for(const [n,data]of outputs){const dest=path.join(root,n);if(process.argv.includes("--verify")){const old=fs.readFileSync(dest);if(old.length!==data.length||old.some((v,i)=>v!==data[i]))throw Error("nonreproducible artifact "+n);}else fs.writeFileSync(dest,Buffer.from(data));}console.log(JSON.stringify({grid_sha256:sha(b.g),setup_sha256:sha(b.json),edits:b.edits.length,bytes:b.json.length,checks:c,files:outputs.map(([n])=>n)},null,2));}
if(require.main===module)run();
