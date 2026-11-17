'use strict';
/* Reproducible source-to-material-cell geometry for the CyberSand ruins-0013 canvas. */
const template={"version":2,"extent":[2048,2048],"actors":[{"id":1,"model":"midge","hash":"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96","spawn":[785,325],"options":{"budget":20,"mass_multiplier":1,"inertia_multiplier":1,"thrust_multiplier":1,"torque_multiplier":1,"boost_multiplier":1.5}}],"next_id":2,"selected":1,"edits":[],"response":"LA-SELECTIVE","liquid_policy":[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],"normalize":false,"rule_radius":2,"source":[],"material":2,"brush":8,"fire":false};
function generate(base){
const W=2048,H=2048,SEED=20261117,A=new Uint8Array(W*H),M={AIR:0,WALL:58,WATER:3,LIME:38,GRANITE:40,COBBLE:41,MOSS:42,TERRA:48,SLATE:49,BRONZE:52,VERD:54,CYAN:77,AMBER:79,MARBLE:98,BASALT:100,OBSIDIAN:101,QUARTZ:122,PHOS:127};let sd=SEED;
const rand=()=>{sd=(Math.imul(sd,1664525)+1013904223)>>>0;return sd/4294967296};
function rect(x,y,w,h,m){let l=Math.max(0,x|0),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,y|0),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)if(r>l)A.fill(m,yy*W+l,yy*W+r)}
function poly(p,m){let lo=Math.max(0,Math.min(...p.map(a=>a[1]))|0),hi=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)rect(xx[j],y,xx[j+1]-xx[j]+1,1,m)}}
function line(x,y,X,Y,m,w=5){let n=Math.max(1,Math.abs(X-x),Math.abs(Y-y));for(let i=0;i<=n;i+=Math.max(1,w*.55)){let f=i/n;rect(x+(X-x)*f-w/2,y+(Y-y)*f-w/2,w,w,m)}}
function disk(cx,cy,R,m){for(let y=Math.max(0,(cy-R)|0);y<Math.min(H,cy+R);y++){let dx=Math.sqrt(Math.max(0,R*R-(cy-y)**2));rect(cx-dx,y,2*dx+1,1,m)}}
function ring(x,y,R,m,w=6){for(let i=0,N=185;i<N;i++){let a=i*2*Math.PI/N,b=(i+1)*2*Math.PI/N;line(x+R*Math.cos(a),y+R*Math.sin(a),x+R*Math.cos(b),y+R*Math.sin(b),m,w)}}

/* R2: source-JPEG-observed rooted asymmetric cliff sanctuaries; all art is actual cells.
   No overlay, no procedural copy of R1's repeated corridor bands. */
function stain(x,y,w,h,m){let l=Math.max(0,Math.floor(x)),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,Math.floor(y)),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)for(let xx=l;xx<r;xx++){let k=yy*W+xx;if(A[k]!==0&&A[k]!==3)A[k]=m}}
function strut(x,y,X,Y,m,w=5){let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,w/2));for(let i=0;i<=n;i++){let f=i/n;stain(x+(X-x)*f-w/2,y+(Y-y)*f-w/2,w,w,m)}}
function room(x,y,w,h){rect(x-14,y-16,w+28,15,M.COBBLE);rect(x,y,w,h,M.AIR);rect(x-8,y+h,w+16,12,M.SLATE)}
function steps(x,y,n,dx,dy,sgn=1){for(let k=0;k<n;k++){rect(x+k*dx*sgn,y+k*dy,dx+2,9,M.COBBLE);rect(x+k*dx*sgn,y+k*dy+9,dx+2,4,M.MOSS)}}
// West cliff is huge and old; eastern ridge is narrower and set lower.
poly([[0,300],[207,305],[257,240],[401,264],[498,361],[565,357],[681,468],[777,586],[806,756],[774,876],[840,990],[780,1163],[799,1295],[741,1452],[777,1581],[697,1755],[812,1913],[890,2048],[0,2048]],M.BASALT);
poly([[0,348],[170,357],[260,299],[360,331],[461,381],[590,444],[700,555],[747,642],[761,801],[720,935],[780,1052],[740,1231],[693,1445],[730,1629],[655,1800],[750,2048],[0,2048]],M.GRANITE);
poly([[0,404],[138,399],[251,354],[386,429],[518,454],[615,560],[691,675],[712,869],[666,1002],[690,1204],[626,1444],[665,1550],[600,1826],[715,2048],[0,2048]],M.OBSIDIAN);
poly([[1753,365],[1862,379],[1931,346],[2048,382],[2048,2048],[1552,2048],[1538,1868],[1586,1674],[1487,1517],[1535,1338],[1455,1191],[1520,990],[1452,847],[1496,706],[1485,603],[1590,480],[1660,449]],M.BASALT);
poly([[1789,423],[1894,407],[2048,410],[2048,2048],[1618,2048],[1600,1820],[1658,1601],[1543,1478],[1589,1306],[1528,1141],[1602,961],[1533,860],[1577,703],[1570,614],[1665,527]],M.GRANITE);
poly([[1838,469],[1942,449],[2048,455],[2048,2048],[1690,2048],[1696,1834],[1691,1592],[1654,1443],[1701,1280],[1661,1097],[1712,940],[1691,766],[1717,618],[1787,538]],M.OBSIDIAN);
poly([[704,2048],[776,1899],[843,1919],[917,1874],[994,1910],[1084,1870],[1164,1915],[1260,1881],[1328,1903],[1436,1844],[1539,1907],[1597,2048]],M.BASALT);
poly([[731,2048],[854,1977],[994,1984],[1205,1962],[1368,1998],[1510,1939],[1589,2048]],M.OBSIDIAN);
// Authentic stone weathering is limited to occupied rock cells.
for(let i=0;i<18;i++){let y=336+i*95;strut(25,y,675-(i%4)*21,y-31+(i%5)*11,i%4===0?M.COBBLE:M.MOSS,3+i%3);strut(1695+(i%4)*13,y+62,2026,y+17-(i%4)*14,i%4?M.SLATE:M.BRONZE,3+i%3)}
for(let i=0;i<800;i++){let x=i%3?25+rand()*750:1500+rand()*525,y=320+rand()*1595,k=(y|0)*W+(x|0);if(A[k]===M.BASALT||A[k]===M.GRANITE||A[k]===M.OBSIDIAN)stain(x,y,5+i%5*5,2,i%7===0?M.MOSS:i%3===0?M.LIME:M.SLATE)}
// Unlike the R1 grid, caves have different extents and heights.
room(164,503,310,154);room(325,766,299,142);room(171,1059,350,169);room(315,1312,327,146);room(153,1657,371,156);
room(1669,548,290,163);room(1665,878,297,130);room(1675,1151,280,152);room(1715,1602,260,149);
for(let p of [[405,577,467,80],[548,819,338,96],[464,1112,407,99],[554,1367,352,99],[443,1716,401,92],[1433,591,335,105],[1429,922,341,96],[1401,1197,395,114],[1445,1668,354,108]])rect(...p,M.AIR);
// Deep flights are really joined via caves/portals and not point-search cheats.
rect(631,564,123,324,M.AIR);rect(676,820,238,84,M.AIR);
rect(1552,579,115,332,M.AIR);rect(1431,865,248,92,M.AIR);
rect(665,1245,134,360,M.AIR);rect(653,1552,226,72,M.AIR);
rect(1550,1215,118,392,M.AIR);rect(1449,1535,233,82,M.AIR);
// Distinctive stepped village stone, deliberately not an identical layer every 300 px.
for(let [x,y,n,dx,dy,s] of [[70,690,8,52,29,1],[188,992,7,53,27,1],[75,1490,8,49,19,1],[1940,767,7,49,27,-1],[1942,1377,6,52,23,-1]])steps(x,y,n,dx,dy,s);
for(let [x,y,w] of [[55,691,275],[120,995,246],[315,1273,184],[85,1488,335],[179,1814,466],[1725,736,310],[1680,1084,292],[1728,1467,314]]){stain(x,y,w,8,M.LIME);stain(x,y+8,w,4,M.MOSS)}
// Large old west tree: mature crown, interlocked trunk/root buttresses wrapping carved stone.
poly([[370,397],[387,249],[411,121],[462,104],[483,271],[535,438],[480,559],[461,600],[432,495],[403,425]],M.BASALT);
line(439,304,355,203,M.BASALT,28);line(421,259,270,166,M.BASALT,27);line(467,279,576,171,M.BASALT,31);line(480,340,620,272,M.BASALT,21);
line(455,465,323,698,M.GRANITE,18);line(478,491,550,677,M.BASALT,21);line(437,458,264,619,M.BASALT,16);
for(let i=0;i<34;i++){let a=i*2.399963,r=Math.sqrt(i/34)*204;disk(429+Math.cos(a)*r,104+Math.sin(a)*r*.56,31+i%5*9,i%7===0?M.COBBLE:M.MOSS)}
for(let i=0;i<11;i++){let x=427+(i-5)*19;strut(x,389,x+(i-5)*45,720+(i%3)*77,i%3===0?M.BASALT:M.SLATE,8+i%4*3);strut(x+(i-5)*45,724+(i%3)*77,x+(i-5)*70,892+(i%5)*38,M.MOSS,5+i%3*3)}
// Right guardian is ONE integral eroded rock monolith rooted to the ridge.
poly([[1615,507],[1637,405],[1640,316],[1664,272],[1701,260],[1732,321],[1772,434],[1786,548],[1745,603],[1673,590]],M.GRANITE);
poly([[1638,433],[1642,331],[1673,298],[1716,315],[1740,377],[1759,454],[1735,488],[1676,473]],M.LIME);
rect(1658,379,21,15,M.OBSIDIAN);rect(1709,379,21,15,M.OBSIDIAN);
poly([[1690,393],[1675,440],[1705,446]],M.SLATE);rect(1661,463,65,9,M.OBSIDIAN);
for(let i=0;i<9;i++)strut(1617+i*17,323,1603+i*20,260-(i%3)*17,M.MOSS,5);
// Smaller east tree on ledge; the guardian and tree are physically connected.
line(1890,480,1890,257,M.BASALT,25);line(1890,330,1832,278,M.BASALT,16);line(1890,340,1963,280,M.BASALT,16);
for(let i=0;i<19;i++){let a=i*2.399963,r=Math.sqrt(i/19)*96;disk(1889+Math.cos(a)*r,251+Math.sin(a)*r*.6,22+i%4*6,M.MOSS)}
// ONE living bridge in mid-high ravine: narrow, uneven, moss, tension/root hangers.
const bp=[[735,666],[805,670],[879,679],[950,693],[1016,703],[1070,705],[1138,694],[1214,685],[1296,669],[1377,660],[1455,650],[1548,647]];
for(let i=0;i<bp.length-1;i++){let [x,y]=bp[i],[X,Y]=bp[i+1];line(x,y,X,Y,M.COBBLE,18);line(x,y-6,X,Y-6,M.MOSS,6);line(x,y+8,X,Y+8,M.SLATE,5)}
for(let i=0;i<bp.length;i++){let [x,y]=bp[i];line(x,y+10,x+(i%2?12:-9),y+40+i%3*8,M.MOSS,4);if(i%2)line(x+8,y+37,x+24,y+67,M.COBBLE,3)}
for(let i=0;i<9;i++){let x=817+i*71,y=674+Math.sin(i/8*Math.PI)*26;line(x,y+13,x+14,y+30,M.MOSS,4);line(x+14,y+30,x+67,y+15,M.COBBLE,3)}
line(703,615,751,663,M.BASALT,15);line(1460,655,1561,583,M.BASALT,16);
// A lower *spur* stays attached to east terrain instead of a second suspended deck.
poly([[1553,1476],[1475,1479],[1375,1521],[1308,1553],[1305,1566],[1380,1567],[1450,1540],[1545,1519]],M.BASALT);
line(1329,1547,1491,1514,M.MOSS,7);line(1391,1548,1422,1627,M.SLATE,6);
for(let i=0;i<7;i++)line(1401+i*17,1546,1404+i*17,1583+(i%3)*14,M.MOSS,3);
// Old inscribed reliefs, relief stone thresholds and lateral root tendrils.
for(let [x,y] of [[246,558],[400,818],[315,1118],[433,1380],[1779,610],[1810,931],[1791,1240],[1828,1676]]){rect(x-15,y-10,30,5,M.MARBLE);rect(x-10,y-5,20,44,M.COBBLE);rect(x-4,y+9,8,12,M.OBSIDIAN);rect(x-16,y+39,32,5,M.SLATE)}
for(let i=0;i<26;i++){let x=115+(i*37)%510,y=465+(i*193)%1270;strut(x,y,x+(i%2?28:-21),y+33+i%3*12,M.MOSS,3+i%3)}
// Final authoring clearance (REAL air corridors, entire portals), carving late material flecks too.
for(let p of [[380,557,489,108],[530,827,358,82],[464,1115,410,86],[545,1367,350,90],[440,1702,403,93],[1426,593,371,79],[1426,919,394,87],[1396,1204,409,93],[1444,1669,366,94]])rect(...p,M.AIR);
for(let p of [[180,521,272,127],[347,784,263,110],[187,1074,317,144],[329,1328,292,115],[168,1680,339,117],[1686,566,254,134],[1684,894,258,108],[1696,1170,247,116],[1736,1622,229,116]])rect(...p,M.AIR);
// The bridge is continuous, but side-cliff shafts allow a flyable loop around it.
rect(626,566,114,341,M.AIR);rect(658,824,237,105,M.AIR);
rect(1560,580,112,352,M.AIR);rect(1429,873,269,113,M.AIR);
rect(655,1246,119,388,M.AIR);rect(644,1566,244,95,M.AIR);
rect(1550,1208,109,431,M.AIR);rect(1432,1524,267,94,M.AIR);
rect(676,1774,220,94,M.AIR);rect(1455,1776,265,99,M.AIR);
// Open flight vault, not an unreachable body of black under the composition.
const spawn=[1024,454],loc=[
['Upper Open Ravine',[1024,454]],['West Upper Shrine',[315,590]],['West Upper Threshold',[604,589]],['West Root Landing',[491,850]],['West Deep Root Niche',[347,1137]],['West Middle Exit',[751,1141]],['West Terrace Chapel',[469,1367]],['West Lower Return',[596,1718]],
['Living Bridge West Air',[837,619]],['Living Bridge Mid-Air',[1050,617]],['Living Bridge East Air',[1450,613]],
['East Sun Sanctuary',[1811,619]],['East High Lookout',[1790,930]],['East Eroded Archive',[1808,1216]],['East Lower Crypt',[1840,1695]],['East Lower Air Exit',[1600,1697]],
['East Root Spur',[1387,1460]],['Vertical Central Ravine',[1100,1121]],['Lower Ravine Flight',[1090,1600]],['Valley Floor Return',[1050,1844]]
].map(([name,point])=>({name,point}));
// Full 19x15 actor-envelope erosion, component connectivity.
const integral=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;integral[(y+1)*(W+1)+x+1]=integral[y*(W+1)+x+1]+s}}
const allowed=new Uint8Array(W*H);for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let a=x-9,b=x+10,c=y-7,d=y+8;if(!(integral[d*(W+1)+b]-integral[c*(W+1)+b]-integral[d*(W+1)+a]+integral[c*(W+1)+a]))allowed[y*W+x]=1}
const seen=new Uint8Array(W*H),q=new Int32Array(W*H),src=spawn[1]*W+spawn[0];if(!allowed[src])throw Error('Spawn blocked');seen[src]=1;q[0]=src;let h=0,t=1;
while(h<t){let k=q[h++],x=k%W,y=(k/W)|0;if(x>0&&allowed[k-1]&&!seen[k-1]){seen[k-1]=1;q[t++]=k-1}if(x<W-1&&allowed[k+1]&&!seen[k+1]){seen[k+1]=1;q[t++]=k+1}if(y>0&&allowed[k-W]&&!seen[k-W]){seen[k-W]=1;q[t++]=k-W}if(y<H-1&&allowed[k+W]&&!seen[k+W]){seen[k+W]=1;q[t++]=k+W}}
const adjustments=[];
const failures=loc.filter(d=>{let [x,y]=d.point;return !seen[y*W+x]});
if(failures.length)throw Error('Exact named destination blocked '+JSON.stringify(failures));
const edits=[];let prev=new Map();for(let y=0;y<H;y++){let curr=new Map(),row=y*W,x=0;while(x<W){let v=A[row+x],start=x++;while(x<W&&A[row+x]===v)x++;if(!v)continue;let key=start+':'+(x-start)+':'+v,idx=prev.get(key);if(idx!==undefined&&edits[idx][1]+edits[idx][3]===y){edits[idx][3]++;curr.set(key,idx)}else{curr.set(key,edits.length);edits.push([start,y,x-start,1,v])}}prev=curr}
const restored=new Uint8Array(A.length);for(let [x,y,w,ht,v] of edits)for(let row=y;row<y+ht;row++)restored.fill(v,row*W+x,row*W+x+w);for(let i=0;i<A.length;i++)if(A[i]!==restored[i])throw Error('Exact-cell reconstruction failed '+i);
const setup={...base,extent:[W,H],actors:[{...base.actors[0],spawn}],next_id:2,selected:1,edits},json=JSON.stringify(setup)+'\n';if(edits.length>32768||json.length>1048576)throw Error('Budget exceeded '+edits.length+'/'+json.length);
// Compact PNG with 4-bit indexed palette. Two sampled real cell IDs per byte.
const mids=[0,58,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const colors=[[24,22,44],[74,75,78],[24,168,190],[215,188,138],[139,129,132],[161,143,123],[86,127,89],[76,83,102],[182,128,74],[46,238,225],[244,188,67],[230,218,181],[65,54,81],[35,28,43],[218,229,230],[176,245,173]];
const pl=new Uint8Array(colors.flat()),map=new Uint8Array(256);mids.forEach((m,i)=>map[m]=i);
let pw=1024,ph=1024,raw=new Uint8Array((pw/2+1)*ph);
for(let y=0;y<ph;y++)for(let x=0;x<pw;x+=2){let a=map[A[(y*2)*W+x*2]],b=map[A[(y*2)*W+x*2+2]];raw[y*(pw/2+1)+1+x/2]=(a<<4)|b}
const U=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0}
function join(xs){let out=new Uint8Array(xs.reduce((s,x)=>s+x.length,0)),o=0;for(let x of xs){out.set(x,o);o+=x.length}return out}
function chunk(tag,data){let a=Uint8Array.from([...tag].map(c=>c.charCodeAt(0))),b=join([a,data]),crc=0xffffffff;for(let v of b)crc=table[(crc^v)&255]^(crc>>>8);return join([Uint8Array.from(U(data.length)),b,Uint8Array.from(U((crc^0xffffffff)>>>0))])}
function zlib(d){let parts=[Uint8Array.from([120,1])],a=1,b=0;for(let k=0;k<d.length;){let len=Math.min(65535,d.length-k),last=k+len===d.length;parts.push(Uint8Array.from([last?1:0,len&255,(len>>>8)&255,(~len)&255,((~len)>>>8)&255]),d.subarray(k,k+len));for(let j=k;j<k+len;j++){a=(a+d[j])%65521;b=(b+a)%65521}k+=len}parts.push(Uint8Array.from(U(((b<<16)|a)>>>0)));return join(parts)}
let png=join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(pw),...U(ph),4,3,0,0,0])),chunk('PLTE',pl),chunk('IDAT',zlib(raw)),chunk('IEND',new Uint8Array())]);

function nativeCrop(left,top,w=512,h=512){
 const scan=new Uint8Array((w/2+1)*h);
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx+=2){let v=A[(top+yy)*W+left+xx],u=A[(top+yy)*W+left+xx+1];scan[yy*(w/2+1)+1+xx/2]=(map[v]<<4)|map[u]}
 return join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(w),...U(h),4,3,0,0,0])),chunk('PLTE',pl),chunk('IDAT',zlib(scan)),chunk('IEND',new Uint8Array())]);
}
const details={
'temples-material-2048.png':nativeCrop(0,0,2048,2048),
'temples-detail-west-tree.png':nativeCrop(125,35),
'temples-detail-west-shrine.png':nativeCrop(100,475),
'temples-detail-living-bridge.png':nativeCrop(753,445),
'temples-detail-east-guardian.png':nativeCrop(1512,207),
'temples-detail-east-crypt.png':nativeCrop(1490,1135),
'temples-detail-root-passages.png':nativeCrop(214,1240),
'temples-detail-lower-ravine.png':nativeCrop(803,1510)
};
let counts={};for(let v of A)counts[v]=(counts[v]||0)+1;
return {json,png,details,stats:{source_id:'ruins-0013',extent:[W,H],seed:SEED,rectangle_count:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,png_bytes:png.length,cell_reconstruction:W*H,clearance_envelope:[19,15],reachable_destinations:loc.length,destinations:loc,waypoint_adjustments:adjustments,air_component_cells:t,spawn,material_counts:counts,native_runtime:'NOT RUN',source_visual_review:'Genuine gh-pages JPEG preview visually inspected; full-resolution original PNG parity UNVERIFIED'}};
}
if(typeof module!=='undefined')module.exports={generate,template};
