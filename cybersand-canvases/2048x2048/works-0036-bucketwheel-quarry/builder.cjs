'use strict';
/* CyberSand showcase canvas: WORKS-0036 / Dry-Magnitude Bucketwheel Quarry.
 * No image pixels are embedded: this synthesizes true Workbench material cells.
 * Standalone Node rebuild: node -e "const fs=require('fs'),{generate}=require('./builder.cjs');const a=generate();fs.writeFileSync('setup-bucketwheel-quarry.json',a.json);fs.writeFileSync('bucketwheel-quarry-preview.png',a.png);console.log(a.stats)"
 */
function generate(){
const W=2048,H=2048,S=360081, A=new Uint8Array(W*H);
const M={AIR:0,WALL:1,STONE:13,LIMESTONE:38,GRANITE:40,COBBLE:41,BRICK:43,TERRACOTTA:48,SLATE:49,IRON:50,COPPER:53,EARTH:56,INDUSTRIAL:57,CONCRETE:58,ASPHALT:59,STEEL:62,PAINTED:63,CORRUGATED:64,RUST:65,GRATING:66,CHAIN:67,PIPE:68,CABLE:74,HAZARD:76,CYAN:77,MAGENTA:78,AMBER:79,WHITE:80,BASALT:100,OBSIDIAN:101,FIREBRICK:104,RAMMED:109,BRASS:119,QUARTZ:122};
let seed=S;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.floor(w);h=Math.floor(h);const x0=Math.max(0,x),y0=Math.max(0,y),x1=Math.min(W,x+w),y1=Math.min(H,y+h);if(x1<=x0||y1<=y0)return;for(let yy=y0;yy<y1;yy++)A.fill(m,yy*W+x0,yy*W+x1);}
function poly(pts,m){let ys=pts.map(p=>p[1]),y0=Math.max(0,Math.floor(Math.min(...ys))),y1=Math.min(H-1,Math.ceil(Math.max(...ys)));for(let y=y0;y<=y1;y++){let crosses=[];for(let j=0;j<pts.length;j++){let a=pts[j],b=pts[(j+1)%pts.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))crosses.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}crosses.sort((a,b)=>a-b);for(let k=0;k+1<crosses.length;k+=2)rect(Math.floor(crosses[k]),y,Math.ceil(crosses[k+1]-crosses[k])+1,1,m);}}
function line(x0,y0,x1,y1,m,w=3){let dx=x1-x0,dy=y1-y0,steps=Math.max(Math.abs(dx),Math.abs(dy));if(steps<1){rect(x0,y0,w,w,m);return;}for(let i=0;i<=steps;i+=Math.max(1,w*.48)){let t=i/steps;rect(x0+dx*t-w/2,y0+dy*t-w/2,w,w,m);}}
function disk(cx,cy,r,m){for(let y=Math.max(0,Math.floor(cy-r));y<Math.min(H,Math.ceil(cy+r));y++){let dx=Math.sqrt(Math.max(0,r*r-(y-cy)**2));rect(cx-dx,y,2*dx,1,m);}}
function ring(cx,cy,r,m,w=10){let segments=Math.max(100,Math.floor(r*1.5));for(let i=0;i<segments;i++){let a=i*2*Math.PI/segments,b=(i+1)*2*Math.PI/segments;line(cx+r*Math.cos(a),cy+r*Math.sin(a),cx+r*Math.cos(b),cy+r*Math.sin(b),m,w);}}
const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],J:['011','001','001','101','010'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],N:['101','111','111','111','101'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],Q:['010','101','101','111','011'],R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],W:['101','101','111','111','101'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111'],'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],'2':['110','001','010','100','111'],'3':['110','001','010','001','110'],'4':['101','101','111','001','001'],'5':['111','100','110','001','110'],'6':['011','100','110','101','010'],'7':['111','001','010','010','010'],'8':['010','101','010','101','010'],'9':['010','101','011','001','110'],'-':['000','000','111','000','000'],' ':['000','000','000','000','000']};
function label(x,y,str,m=M.AMBER,sc=3){for(const ch of str){const glyph=FONT[ch]||FONT[' '];for(let yy=0;yy<5;yy++)for(let xx=0;xx<3;xx++)if(glyph[yy][xx]==='1')rect(x+xx*sc,y+yy*sc,sc,sc,m);x+=4*sc;}}
function sign(x,y,str,sc=3){const sw=str.length*4*sc+14;rect(x-5,y-5,sw+10,5*sc+20,M.STEEL);rect(x,y,sw,5*sc+10,M.OBSIDIAN);label(x+6,y+5,str,M.AMBER,sc);}
function deck(x,y,w,accent=M.AMBER){rect(x,y,w,16,M.STEEL);rect(x,y+16,w,13,M.RUST);rect(x,y-5,w,5,accent);for(let i=x+15;i<x+w-8;i+=36){rect(i,y+3,12,3,M.IRON);rect(i+5,y+13,4,5,M.IRON);}}
function truss(x1,y1,x2,y2,spacing=42){line(x1,y1,x2,y2,M.STEEL,12);line(x1,y1+22,x2,y2+22,M.STEEL,9);let dx=x2-x1,dy=y2-y1,dist=Math.hypot(dx,dy),num=Math.floor(dist/spacing);for(let i=0;i<num;i++){let a=i/num,b=(i+1)/num,p=[x1+dx*a,y1+dy*a],q=[x1+dx*b,y1+dy*b];line(p[0],p[1],q[0],q[1]+22,M.IRON,4);if(i%2)line(p[0],p[1]+22,q[0],q[1],M.IRON,4);}}
function shed(x,y,w,h,title,accent=M.AMBER,door='right'){rect(x,y,w,h,M.STEEL);rect(x+10,y+12,w-20,h-24,M.INDUSTRIAL);rect(x+19,y+23,w-38,h-45,M.AIR);rect(x+12,y+h-22,w-24,14,M.STEEL);rect(x+20,y+h-12,w-40,4,accent);if(door==='right')rect(x+w-21,y+h-98,32,73,M.AIR);if(door==='left')rect(x-12,y+h-98,32,73,M.AIR);sign(x+25,y+22,title,2);for(let j=0;j<3;j++){let px=x+40+j*55;rect(px,y+h-56,40,30,M.IRON);rect(px+5,y+h-52,30,15,accent);}}
/* Broad sedimentary formation and sloping open cut. */
rect(0,0,W,H,M.BASALT);
for(let y=0;y<H;y+=62){const layers=[M.EARTH,M.RAMMED,M.TERRACOTTA,M.FIREBRICK,M.LIMESTONE,M.SLATE,M.GRANITE,M.EARTH];rect(0,y,W,62,layers[Math.floor(y/62)%layers.length]);rect(0,y+5,W,3,M.OBSIDIAN);}
poly([[90,0],[1950,0],[1950,240],[1935,400],[1850,610],[1810,820],[1760,1030],[1715,1220],[1650,1440],[1550,1670],[1450,1855],[615,1855],[520,1700],[415,1500],[335,1270],[252,995],[192,780],[105,490]],M.AIR);
/* Long stepped quarry benches reveal stratigraphy without becoming a scenic backplate. */
poly([[0,480],[470,480],[560,530],[510,608],[280,608],[245,660],[0,660]],M.RAMMED);
poly([[0,825],[650,825],[710,865],[670,948],[365,948],[320,1020],[0,1020]],M.EARTH);
poly([[0,1280],[630,1280],[730,1334],[695,1425],[458,1425],[415,1480],[0,1480]],M.FIREBRICK);
poly([[0,1700],[730,1700],[830,1760],[785,1840],[0,1840]],M.RAMMED);
poly([[1640,520],[2048,520],[2048,700],[1790,700],[1740,655],[1650,655]],M.LIMESTONE);
poly([[1500,890],[2048,890],[2048,1080],[1680,1080],[1620,1020],[1530,1020]],M.RAMMED);
poly([[1420,1255],[2048,1255],[2048,1500],[1540,1500],[1465,1410],[1400,1410]],M.TERRACOTTA);
poly([[1340,1670],[2048,1670],[2048,1840],[1440,1840]],M.EARTH);
/* Thin geological exposure lines, bedding faults and carefully bounded ore seams. */
for(let i=0;i<38;i++){let x=16+Math.floor(rnd()*450),y=470+Math.floor(rnd()*1350),w=28+Math.floor(rnd()*85);let m=(i%4===0)?M.QUARTZ:(i%3===0?M.RUST:M.SLATE);if(A[y*W+x]!==M.AIR)rect(x,y,w,3+(i%4),m);}
for(let i=0;i<35;i++){let x=1680+Math.floor(rnd()*320),y=540+Math.floor(rnd()*1260);if(A[y*W+x]!==M.AIR)rect(x,y,16+Math.floor(rnd()*55),4+(i%3),i%3?M.FIREBRICK:M.COPPER);}
/* Upper rim operations; doors connect back into the open pit. */
deck(250,290,430);deck(1350,345,475);
shed(230,120,350,182,'ORE-36',M.AMBER,'right');
shed(1580,155,350,200,'LIFT CONTROL',M.CYAN,'left');
deck(80,600,550);deck(1390,675,590,M.CYAN);
deck(170,930,510);deck(1485,1060,510);
deck(230,1400,540);deck(1375,1425,550);
deck(460,1780,430);deck(1130,1815,530,M.CYAN);
/* Reopen generous portals at each bench and across wall-face strips. */
for(const b of [[565,195,155,100],[570,520,135,75],[625,865,125,60],[660,1340,135,60],[760,1690,145,90],[1330,280,145,80],[1345,605,160,70],[1420,995,115,65],[1360,1355,110,70],[1260,1735,120,75]])rect(...b,M.AIR);
/* Work-yard bridgework and trussed overhead conveyor. */
truss(560,450,1330,585,47);truss(1320,587,1630,695,43);
for(let x=560;x<=1320;x+=75){let t=(x-560)/760,y=450+(585-450)*t;line(x,y-90,x,y,M.PIPE,4);rect(x-8,y-90,16,8,M.AMBER);}
truss(680,895,1320,760,44);
/* Quarry colossal wheel: actual collidable steel/rust materials, not pixels in a background. */
const CX=1080,CY=1195,R=253;ring(CX,CY,R,M.RUST,22);ring(CX,CY,R-35,M.IRON,9);ring(CX,CY,R-80,M.STEEL,6);
for(let k=0;k<16;k++){const a=2*Math.PI*k/16;line(CX+45*Math.cos(a),CY+45*Math.sin(a),CX+(R-18)*Math.cos(a),CY+(R-18)*Math.sin(a),k%2?M.STEEL:M.RUST,9);let ox=CX+(R+15)*Math.cos(a),oy=CY+(R+15)*Math.sin(a);poly([[ox-16,oy-10],[ox+16,oy-10],[ox+28*Math.cos(a),oy+28*Math.sin(a)+10],[ox-26*Math.cos(a),oy-26*Math.sin(a)+10]],M.COPPER);}
disk(CX,CY,47,M.IRON);disk(CX,CY,26,M.BRASS);disk(CX,CY,9,M.AMBER);
truss(1240,1000,1540,795,36);truss(1190,1080,1600,860,40);
poly([[1430,670],[1600,650],[1650,750],[1550,870],[1420,845]],M.STEEL);
rect(1480,699,120,70,M.INDUSTRIAL);rect(1495,710,87,48,M.AIR);rect(1510,716,50,15,M.CYAN);
for(let x=1500;x<1600;x+=34)rect(x,822,9,280,M.PIPE);
/* Wheel undercarriage and maintenance access; avoid filling the central free-flight lanes. */
truss(930,1455,1230,1455,33);rect(875,1474,415,29,M.RUST);rect(915,1503,345,14,M.STEEL);
for(const x of [945,1205]){disk(x,1528,30,M.IRON);disk(x,1528,16,M.RUST);}
deck(850,1570,450,M.AMBER);
/* Ore sorting and crusher side rooms, aligned with benches. */
shed(90,1090,330,170,'CRUSHER',M.AMBER,'right');
shed(1635,1100,340,168,'SORTING',M.CYAN,'left');
for(let x=170;x<390;x+=45){rect(x,1215,28,19,M.CORRUGATED);rect(x+7,1219,14,4,M.HAZARD);}
for(let x=1680;x<1950;x+=45){rect(x,1212,28,19,M.CORRUGATED);rect(x+7,1216,14,4,M.CYAN);}
/* Deep extraction pit: an exposed triangular ore vein and alternating stratified faces. */
poly([[730,1830],[830,1760],[1055,1776],[1110,1890],[980,1960],[835,1960]],M.OBSIDIAN);
for(let i=0;i<21;i++){let x=788+(i*17)%310,y=1810+(i*31)%155;poly([[x-8,y],[x+8,y],[x+3,y-18]],i%5===0?M.QUARTZ:i%3===0?M.COPPER:M.FIREBRICK);}
rect(0,1980,W,68,M.BASALT);rect(0,1978,W,4,M.SLATE);
/* Decorative rivets and embedded material detail on solid plates only. */
for(const y of [290,600,675,930,1060,1400,1425,1570,1780,1815])for(let x=70;x<1980;x+=47){const idx=(y+4)*W+x;if(A[idx]!==M.AIR&&A[idx]!==M.EARTH){rect(x,y+4,7,3,M.IRON);if(x%4===0)rect(x+16,y+3,4,4,M.AMBER);}}
/* Cable hangs under the highest conveyor, purposely above the wheel and away from required points. */
for(let x=720;x<1290;x+=95){line(x,490+(x-560)*.18,x,540+(x-560)*.18,M.CABLE,3);}
for(let x=240;x<600;x+=75){rect(x,278,6,13,M.WHITE);rect(x-8,270,22,9,M.AMBER);}
for(let x=1430;x<1810;x+=75){rect(x,336,6,15,M.WHITE);rect(x-8,330,22,7,M.CYAN);}
const destinations=[
{name:'Upper Ore Administration',at:[645,245]},
{name:'Eastern Lift Control',at:[1530,295]},
{name:'North Conveyor',at:[920,390]},
{name:'West Overburden Terrace',at:[625,715]},
{name:'East Processing Bench',at:[1460,780]},
{name:'Wheel Inspection Approach',at:[780,1045]},
{name:'Excavator Gantry',at:[1430,890]},
{name:'West Crusher Yard',at:[465,1165]},
{name:'Middle Pit Airspace',at:[815,870]},
{name:'Lower West Ramp',at:[775,1605]},
{name:'Deep Ore Exposure',at:[1060,1685]},
{name:'East Sorting Gallery',at:[1530,1225]},
{name:'South Service Transit',at:[1070,1740]},
{name:'Eastern Ore Terrace',at:[1455,1540]}];
/* Conservative 19×15 full-solid envelope navigation (air only). */
function clearance(){
const SAT=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=(A[y*W+x]!==0)?1:0;SAT[(y+1)*(W+1)+x+1]=SAT[y*(W+1)+x+1]+row;}}
const nav=new Uint8Array(W*H);for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let x0=x-9,x1=x+10,y0=y-7,y1=y+8;let s=SAT[y1*(W+1)+x1]-SAT[y0*(W+1)+x1]-SAT[y1*(W+1)+x0]+SAT[y0*(W+1)+x0];if(!s)nav[y*W+x]=1;}
return nav;
}
let nav=clearance();
const spawn=[785,325];
function reachable(){const q=new Int32Array(W*H),seen=new Uint8Array(W*H),s=spawn[1]*W+spawn[0];if(!nav[s])return {seen,count:0};seen[s]=1;q[0]=s;let h=0,t=1;while(h<t){let k=q[h++],x=k%W,y=(k/W)|0;const offsets=[-1,1,-W,W];for(let j=0;j<4;j++){if((j===0&&x===0)||(j===1&&x===W-1)||(j===2&&y===0)||(j===3&&y===H-1))continue;let n=k+offsets[j];if(nav[n]&&!seen[n]){seen[n]=1;q[t++]=n;}}}return {seen,count:t};}
let rec=reachable();
/* Find legal waypoints in the vicinity of each landmark; no hiding blocked rooms. */
const waypoint=[];
for(let d of destinations){let [cx,cy]=d.at,best=null,bestDist=Infinity;for(let r=0;r<=105;r+=5){let found=false;for(let y=Math.max(9,cy-r);y<=Math.min(H-10,cy+r);y+=5)for(let x=Math.max(10,cx-r);x<=Math.min(W-11,cx+r);x+=5){let idx=y*W+x;if(rec.seen[idx]){let dd=(x-cx)**2+(y-cy)**2;if(dd<bestDist){best=[x,y];bestDist=dd;found=true;}}}if(found&&r*r>bestDist+500)break;}waypoint.push({name:d.name,intended:d.at,reachable:!!best,point:best,offset:best?Math.round(Math.sqrt(bestDist)):null});}
const failures=waypoint.filter(x=>!x.reachable);
if(!rec.count||failures.length)throw Error('Navigation qualification failed: '+JSON.stringify({spawn,nav:nav[spawn[1]*W+spawn[0]],reachable:rec.count,failures}));
/* Lossless vertical run coalescing: Workbench [x,y,width,height,material] stamps. */
const runs=[];let open=new Map();for(let y=0;y<H;y++){let cur=new Map(),row=y*W,x=0;while(x<W){let m=A[row+x],start=x++;while(x<W&&A[row+x]===m)x++;if(!m)continue;let key=start+':'+(x-start)+':'+m,idx=open.get(key);if(idx!==undefined&&runs[idx][1]+runs[idx][3]===y){runs[idx][3]++;cur.set(key,idx);}else{cur.set(key,runs.length);runs.push([start,y,x-start,1,m]);}}open=cur;}
const reconstructed=new Uint8Array(A.length);for(const [x,y,w,h,m] of runs)for(let yy=y;yy<y+h;yy++)reconstructed.fill(m,yy*W+x,yy*W+x+w);
for(let i=0;i<A.length;i++)if(A[i]!==reconstructed[i])throw Error('Material equivalence mismatch at '+i);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:spawn.map(Number),options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits:runs,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup)+'\n';let jsonBytes=json.length;
if(runs.length>32768||jsonBytes>1048576)throw Error('Serialization budget exceeded: '+JSON.stringify({rectangles:runs.length,jsonBytes}));
/* PNG indexed-colour reference preview, sampling every 2 real material cells. */
const PL=new Uint8Array(256*3);for(let i=0;i<256;i++){PL[i*3]=8;PL[i*3+1]=11;PL[i*3+2]=18;}
const colors={0:[8,11,18],1:[82,91,106],13:[126,126,132],38:[197,191,175],40:[119,119,130],41:[119,116,108],43:[163,80,59],48:[185,91,60],49:[70,83,99],50:[50,58,64],53:[184,108,64],56:[124,91,59],57:[116,63,54],58:[119,123,128],59:[41,45,50],62:[126,141,153],63:[49,100,119],64:[109,125,134],65:[124,63,43],66:[74,85,93],67:[101,116,123],68:[102,119,129],74:[60,53,68],76:[227,182,47],77:[55,243,228],78:[255,61,184],79:[255,181,46],80:[236,248,255],100:[54,56,61],101:[24,19,32],104:[200,152,98],109:[172,114,74],119:[196,160,72],122:[226,236,244]};for(let [k,v] of Object.entries(colors))PL.set(v,+k*3);
const PW=1024,PH=1024,raw=new Uint8Array((PW+1)*PH);for(let y=0;y<PH;y++){let o=y*(PW+1);raw[o]=0;for(let x=0;x<PW;x++)raw[o+x+1]=A[(y*2)*W+x*2];}
function u32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
const crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcTable[n]=c>>>0;}
function crc(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=crcTable[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function join(arrs){let size=0;for(const a of arrs)size+=a.length;let out=new Uint8Array(size),p=0;for(const a of arrs){out.set(a,p);p+=a.length;}return out;}
function pngChunk(type,data){let t=new Uint8Array([...type].map(c=>c.charCodeAt(0))),cdata=join([t,data]);return join([new Uint8Array(u32(data.length)),cdata,new Uint8Array(u32(crc(cdata)))]);}
function zlibStored(data){let bits=[0x78,0x01],a=1,b=0;for(let p=0;p<data.length;){let length=Math.min(65535,data.length-p),last=(p+length===data.length)?1:0;bits.push(last,length&255,(length>>>8)&255,(~length)&255,((~length)>>>8)&255);for(let i=0;i<length;i++){let v=data[p+i];bits.push(v);a+=v;if(a>=65521)a-=65521;b+=a;if(b>=65521)b-=65521;}p+=length;}let ad=((b<<16)|a)>>>0;bits.push(...u32(ad));return Uint8Array.from(bits);}
const ihdr=new Uint8Array([...u32(PW),...u32(PH),8,3,0,0,0]),png=join([new Uint8Array([137,80,78,71,13,10,26,10]),pngChunk('IHDR',ihdr),pngChunk('PLTE',PL),pngChunk('IDAT',zlibStored(raw)),pngChunk('IEND',new Uint8Array())]);
const counts={};for(let k=0;k<A.length;k++)counts[A[k]]=(counts[A[k]]||0)+1;
const stats={source_public_id:'works-0036',target:[W,H],seed:S,rectangles:runs.length,rectangle_budget:32768,json_bytes:jsonBytes,json_byte_budget:1048576,material_cells_verified:A.length,air_cells:counts[0],clearance_envelope:[19,15],nav_component_cells:rec.count,spawn,waypoints:waypoint,material_counts:counts,png_bytes:png.length,native_qualification:'NOT EXECUTED',reference_visual_comparison:'NOT EXECUTED: binary reference image inaccessible in this runtime'};
return {json,png,stats};
}
if(typeof module!=='undefined')module.exports={generate};
