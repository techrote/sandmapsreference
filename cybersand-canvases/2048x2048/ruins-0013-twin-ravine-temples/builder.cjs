'use strict';
/* Reproducible source-to-material-cell geometry for the CyberSand ruins-0013 canvas. */
const template={"version":2,"extent":[2048,2048],"actors":[{"id":1,"model":"midge","hash":"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96","spawn":[785,325],"options":{"budget":20,"mass_multiplier":1,"inertia_multiplier":1,"thrust_multiplier":1,"torque_multiplier":1,"boost_multiplier":1.5}}],"next_id":2,"selected":1,"edits":[],"response":"LA-SELECTIVE","liquid_policy":[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],"normalize":false,"rule_radius":2,"source":[],"material":2,"brush":8,"fire":false};
function generate(base){
const W=2048,H=2048,SEED=1556133,A=new Uint8Array(W*H),M={AIR:0,WALL:1,WATER:3,LIME:38,GRANITE:40,COBBLE:41,MOSS:42,TERRA:48,SLATE:49,BRONZE:52,VERD:54,CYAN:77,AMBER:79,MARBLE:98,BASALT:100,OBSIDIAN:101,QUARTZ:122,PHOS:127};let sd=SEED;
const rand=()=>{sd=(Math.imul(sd,1664525)+1013904223)>>>0;return sd/4294967296};
function rect(x,y,w,h,m){let l=Math.max(0,x|0),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,y|0),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)if(r>l)A.fill(m,yy*W+l,yy*W+r)}
function poly(p,m){let lo=Math.max(0,Math.min(...p.map(a=>a[1]))|0),hi=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)rect(xx[j],y,xx[j+1]-xx[j]+1,1,m)}}
function line(x,y,X,Y,m,w=5){let n=Math.max(1,Math.abs(X-x),Math.abs(Y-y));for(let i=0;i<=n;i+=Math.max(1,w*.55)){let f=i/n;rect(x+(X-x)*f-w/2,y+(Y-y)*f-w/2,w,w,m)}}
function disk(cx,cy,R,m){for(let y=Math.max(0,(cy-R)|0);y<Math.min(H,cy+R);y++){let dx=Math.sqrt(Math.max(0,R*R-(cy-y)**2));rect(cx-dx,y,2*dx+1,1,m)}}
function ring(x,y,R,m,w=6){for(let i=0,N=185;i<N;i++){let a=i*2*Math.PI/N,b=(i+1)*2*Math.PI/N;line(x+R*Math.cos(a),y+R*Math.sin(a),x+R*Math.cos(b),y+R*Math.sin(b),m,w)}}
// Orthographic natural sandstone/rock face with open central canyon.
poly([[0,0],[850,0],[810,185],[782,342],[825,533],[775,690],[816,898],[785,1068],[829,1280],[778,1510],[825,1690],[795,2048],[0,2048]],M.BASALT);
poly([[1181,0],[2048,0],[2048,2048],[1218,2048],[1192,1741],[1247,1580],[1200,1380],[1244,1220],[1190,981],[1244,767],[1204,583],[1243,400],[1181,0]],M.BASALT);
for(let y=65;y<2005;y+=96){rect(0,y,604,7,M.GRANITE);rect(1455,y+42,593,7,M.MOSS)}
poly([[0,0],[828,0],[760,90],[700,137],[584,110],[495,170],[394,151],[277,195],[177,158],[0,187]],M.OBSIDIAN);
poly([[1200,0],[2048,0],[2048,197],[1921,137],[1834,205],[1720,156],[1621,195],[1515,126],[1354,149],[1250,80]],M.OBSIDIAN);
for(let i=0;i<70;i++){let left=i%2===0,x=left?rand()*785:1245+rand()*785,y=65+rand()*185;line(x,y,x+(left?1:-1)*(10+rand()*43),y+20+rand()*116,i%4?M.MOSS:M.OBSIDIAN,7+i%4*3)}
function temple(x,y,w,h,left){rect(x-28,y-39,w+56,23,M.SLATE);rect(x-10,y-15,w+20,h+25,M.GRANITE);rect(x,y,w,h,M.LIME);rect(x+20,y+31,w-40,h-58,M.AIR);for(let i=0;i<5;i++){let px=x+51+i*(w-102)/4;rect(px-14,y+30,28,h-64,M.LIME);rect(px-20,y+22,40,14,M.MARBLE);rect(px-19,y+h-54,38,15,M.SLATE)}rect(x+17,y+h-27,w-34,14,M.SLATE);for(let i=0;i<9;i++)rect(x+i*w/9,y-66,17,26,i%3?M.COBBLE:M.MOSS);if(left)rect(x+w-110,y+91,177,116,M.AIR);else rect(x-69,y+91,177,116,M.AIR);for(let i=0;i<3;i++){let px=x+95+i*178;rect(px,y+68,49,35,M.OBSIDIAN);rect(px+10,y+76,29,15,i%2?M.AMBER:M.CYAN)}}
temple(98,312,610,288,true);temple(1335,325,610,290,false);
for(let [x,y,w,h] of [[67,228,120,342],[666,232,115,340],[1266,224,113,360],[1870,236,112,345]]){rect(x,y,w,h,M.GRANITE);rect(x+9,y+14,w-18,h-28,M.LIME);rect(x+34,y+65,w-68,h-125,M.AIR);rect(x-13,y-21,w+26,24,M.MARBLE);rect(x+15,y+h-27,w-30,13,M.BRONZE)}
for(let side=0;side<2;side++)for(let j=0;j<4;j++){let x=side?1405:98,y=[708,1039,1370,1695][j]+(side?19:0),w=550,h=239;rect(x,y,w,h,M.GRANITE);rect(x+11,y+12,w-22,h-24,M.LIME);rect(x+30,y+29,w-60,h-58,M.AIR);rect(x+21,y+h-29,w-42,16,M.SLATE);rect(x+34,y+52,w-68,7,M.BRONZE);for(let k=0;k<4;k++){let px=x+54+k*142;rect(px-11,y+69,22,67,M.MARBLE);rect(px-16,y+61,32,12,M.COBBLE);rect(px-12,y+h-81,24,31,M.LIME)}for(let k=0;k<3;k++){let px=x+85+k*157;ring(px,y+101,18,M.MOSS,6);disk(px,y+101,6,M.CYAN)}if(side===0)rect(x+w-95,y+82,160,102,M.AIR);else rect(x-60,y+82,160,102,M.AIR)}
// Twin huge guardian faces inset into side temples.
for(let side=0;side<2;side++){let x=side?1675:369,y=1160;disk(x,y,122,M.MOSS);ring(x,y,118,M.GRANITE,12);poly([[x-92,y-62],[x-44,y-111],[x+47,y-111],[x+93,y-62],[x+71,y+101],[x-77,y+101]],M.LIME);for(let d of [-43,43]){disk(x+d,y-18,23,M.OBSIDIAN);rect(x+d-17,y-19,34,8,M.CYAN)}poly([[x,y-4],[x-22,y+39],[x+19,y+39]],M.GRANITE);rect(x-40,y+64,80,14,M.OBSIDIAN);for(let i=0;i<6;i++)rect(x-32+i*13,y+64,5,12,M.MARBLE);for(let i=0;i<7;i++)line(x-75+i*22,y-108,x-90+i*20,y-153-i%3*19,M.MOSS,6)}
// Three bridge decks, root trusses, outcrops and mineral wisps.
for(let [y,v] of [[641,M.BRONZE],[1298,M.MOSS],[1793,M.GRANITE]]){rect(735,y,582,19,M.SLATE);rect(735,y+19,582,12,M.GRANITE);rect(739,y-6,575,6,v);for(let x=750;x<1300;x+=56){rect(x,y+8,29,5,M.COBBLE);rect(x+9,y+21,10,8,M.MOSS)}}
for(let x=773;x<1296;x+=55){line(x,671,x+27,703,M.BRONZE,6);line(x+27,703,x+55,671,M.MOSS,6);rect(x,1278,8,20,M.BRONZE)}
poly([[925,951],[946,813],[967,960],[997,879],[1021,951]],M.QUARTZ);
poly([[1030,1635],[1055,1495],[1090,1622],[1132,1550],[1145,1642]],M.MOSS);
for(let i=0;i<38;i++){let x=860+rand()*330,y=911+rand()*794;if(Math.abs(y-1298)>91)line(x,y,x+5+rand()*21,y-12-rand()*36,i%4?M.QUARTZ:M.PHOS,5)}
for(let i=0;i<3700;i++){let left=i%2===0,x=left?rand()*601:1447+rand()*601,y=100+rand()*1870;if(A[(y|0)*W+(x|0)]!==0)rect(x,y,3+rand()*19,2+rand()*6,i%31===0?M.PHOS:i%6?M.MOSS:M.BRONZE)}
for(let i=0;i<500;i++){let x=i%2?1395+rand()*590:60+rand()*590,y=220+rand()*1600;if(A[(y|0)*W+(x|0)]!==0)rect(x,y,3+rand()*5,2,M.MARBLE)}
// Sealed water in bottom basin with stone overbridge.
rect(844,1884,396,150,M.WALL);rect(860,1891,364,129,M.AIR);rect(864,1918,357,102,M.WATER);rect(867,1911,347,7,M.CYAN);
poly([[849,1880],[908,1849],[959,1880]],M.QUARTZ);poly([[1093,1880],[1169,1838],[1236,1880]],M.MOSS);rect(0,1994,W,54,M.OBSIDIAN);
// Final portals, generous clearance in every named room, and bypass shafts.
rect(650,356,194,1580,M.AIR);rect(1209,360,196,1575,M.AIR);
for(let y of [471,785,1117,1454,1750,1858]){rect(270,y-59,665,118,M.AIR);rect(1130,y-59,666,118,M.AIR)}
// Reconnect all three bridge decks to lateral buttresses; shaft bypass exists outside both ends.
for(let [y,v] of [[641,M.BRONZE],[1298,M.MOSS],[1793,M.GRANITE]]){rect(740,y,579,19,M.SLATE);rect(740,y+19,579,12,M.GRANITE);rect(745,y-6,569,6,v)}
// Keep shaft bypass clear without cutting causeway ends. Left x650..735 / right x1320..1400.
rect(653,575,79,1280,M.AIR);rect(1324,575,75,1280,M.AIR);
// Water perimeter below waterline is solid after all opening cuts.
rect(840,1915,24,111,M.WALL);rect(1221,1915,22,111,M.WALL);rect(843,2020,398,17,M.WALL);
const spawn=[1024,454],loc=[
['West Crown Sanctuary',[450,471]],['East Crown Sanctuary',[1590,471]],['Upper Sky Ravine',[1024,454]],
['West Root Gallery',[455,785]],['East Sun Gallery',[1588,785]],['High Ravine Overlook',[1080,1038]],
['West Moss Archive',[456,1117]],['East Oracle Archive',[1593,1117]],['West Guardian Portal',[701,1117]],['East Guardian Portal',[1365,1117]],
['Midspan Bridge Overlook',[1024,1233]],['West Relics Gallery',[450,1454]],['East Relics Gallery',[1591,1454]],
['West Lower Sanctuary',[451,1750]],['East Root Crypt',[1589,1750]],['Lower Bridge Outlook',[1022,1732]],['Moonwater Basin Outlook',[1062,1858]]
].map(([name,point])=>({name,point}));
// Full 19x15 actor-envelope erosion, component connectivity.
const integral=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;integral[(y+1)*(W+1)+x+1]=integral[y*(W+1)+x+1]+s}}
const allowed=new Uint8Array(W*H);for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let a=x-9,b=x+10,c=y-7,d=y+8;if(!(integral[d*(W+1)+b]-integral[c*(W+1)+b]-integral[d*(W+1)+a]+integral[c*(W+1)+a]))allowed[y*W+x]=1}
const seen=new Uint8Array(W*H),q=new Int32Array(W*H),src=spawn[1]*W+spawn[0];if(!allowed[src])throw Error('Spawn blocked');seen[src]=1;q[0]=src;let h=0,t=1;
while(h<t){let k=q[h++],x=k%W,y=(k/W)|0;if(x>0&&allowed[k-1]&&!seen[k-1]){seen[k-1]=1;q[t++]=k-1}if(x<W-1&&allowed[k+1]&&!seen[k+1]){seen[k+1]=1;q[t++]=k+1}if(y>0&&allowed[k-W]&&!seen[k-W]){seen[k-W]=1;q[t++]=k-W}if(y<H-1&&allowed[k+W]&&!seen[k+W]){seen[k+W]=1;q[t++]=k+W}}
let adjustments=[];for(let d of loc){let [px,py]=d.point;if(seen[py*W+px])continue;let best=null,dist=Infinity;for(let dy=-80;dy<=80;dy+=4)for(let dx=-80;dx<=80;dx+=4){let x=px+dx,y=py+dy;if(x<20||y<20||x>W-20||y>H-20)continue;if(seen[y*W+x]&&dx*dx+dy*dy<dist){best=[x,y];dist=dx*dx+dy*dy}}if(best){adjustments.push({name:d.name,nominal:d.point,qualified:best,distance:Math.round(Math.sqrt(dist))});d.point=best}}
const failures=loc.filter(d=>!seen[d.point[1]*W+d.point[0]]);if(failures.length)throw Error('Clearance unreachable '+JSON.stringify(failures));
const edits=[];let prev=new Map();for(let y=0;y<H;y++){let curr=new Map(),row=y*W,x=0;while(x<W){let v=A[row+x],start=x++;while(x<W&&A[row+x]===v)x++;if(!v)continue;let key=start+':'+(x-start)+':'+v,idx=prev.get(key);if(idx!==undefined&&edits[idx][1]+edits[idx][3]===y){edits[idx][3]++;curr.set(key,idx)}else{curr.set(key,edits.length);edits.push([start,y,x-start,1,v])}}prev=curr}
const restored=new Uint8Array(A.length);for(let [x,y,w,ht,v] of edits)for(let row=y;row<y+ht;row++)restored.fill(v,row*W+x,row*W+x+w);for(let i=0;i<A.length;i++)if(A[i]!==restored[i])throw Error('Exact-cell reconstruction failed '+i);
const setup={...base,extent:[W,H],actors:[{...base.actors[0],spawn}],next_id:2,selected:1,edits},json=JSON.stringify(setup)+'\n';if(edits.length>32768||json.length>1048576)throw Error('Budget exceeded '+edits.length+'/'+json.length);
// Compact PNG with 4-bit indexed palette. Two sampled real cell IDs per byte.
const mids=[0,1,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const colors=[[24,22,44],[74,75,78],[24,168,190],[215,188,138],[139,129,132],[161,143,123],[86,127,89],[76,83,102],[182,128,74],[46,238,225],[244,188,67],[230,218,181],[65,54,81],[35,28,43],[218,229,230],[176,245,173]];
const pl=new Uint8Array(colors.flat()),map=new Uint8Array(256);mids.forEach((m,i)=>map[m]=i);
let pw=1024,ph=1024,raw=new Uint8Array((pw/2+1)*ph);
for(let y=0;y<ph;y++)for(let x=0;x<pw;x+=2){let a=map[A[(y*2)*W+x*2]],b=map[A[(y*2)*W+x*2+4]];raw[y*(pw/2+1)+1+x/2]=(a<<4)|b}
const U=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0}
function join(xs){let out=new Uint8Array(xs.reduce((s,x)=>s+x.length,0)),o=0;for(let x of xs){out.set(x,o);o+=x.length}return out}
function chunk(tag,data){let a=Uint8Array.from([...tag].map(c=>c.charCodeAt(0))),b=join([a,data]),crc=0xffffffff;for(let v of b)crc=table[(crc^v)&255]^(crc>>>8);return join([Uint8Array.from(U(data.length)),b,Uint8Array.from(U((crc^0xffffffff)>>>0))])}
function zlib(d){let parts=[Uint8Array.from([120,1])],a=1,b=0;for(let k=0;k<d.length;){let len=Math.min(65535,d.length-k),last=k+len===d.length;parts.push(Uint8Array.from([last?1:0,len&255,(len>>>8)&255,(~len)&255,((~len)>>>8)&255]),d.subarray(k,k+len));for(let j=k;j<k+len;j++){a=(a+d[j])%65521;b=(b+a)%65521}k+=len}parts.push(Uint8Array.from(U(((b<<16)|a)>>>0)));return join(parts)}
let png=join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(pw),...U(ph),4,3,0,0,0])),chunk('PLTE',pl),chunk('IDAT',zlib(raw)),chunk('IEND',new Uint8Array())]);
let counts={};for(let v of A)counts[v]=(counts[v]||0)+1;
return {json,png,stats:{source_id:'ruins-0013',extent:[W,H],seed:SEED,rectangle_count:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,png_bytes:png.length,cell_reconstruction:W*H,clearance_envelope:[19,15],reachable_destinations:loc.length,destinations:loc,waypoint_adjustments:adjustments,air_component_cells:t,spawn,material_counts:counts,native_runtime:'NOT RUN',source_visual_review:'NOT RUN — binary original unavailable in this environment'}};
}
if(typeof module!=='undefined')module.exports={generate,template};
