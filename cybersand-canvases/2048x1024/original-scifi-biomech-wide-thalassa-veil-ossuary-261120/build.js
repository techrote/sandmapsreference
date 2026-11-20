// Self-contained deterministic Node rebuild; source-authoritative material geometry.
"use strict";
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const W=2048,H=1024,N=W*H,SEED=2611201103;
const ENGINE="de109d0131641d6adc8d25bb9ced7ca3d4991105",BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7";
const MAT_IDS=new Set([58,62,63,72,77,79,100,101,117,128]);
const PALETTE={"0":[7,12,23],"58":[79,88,104],"62":[111,137,154],"63":[165,193,195],"72":[23,65,79],"77":[46,233,203],"79":[255,171,74],"100":[48,56,76],"101":[27,32,49],"117":[107,93,93],"128":[173,125,165]},SITES={"spawn_mooring":[116,544],"isolation_valve":[405,651],"pulse_ledger":[426,627],"tendon_lift":[769,610],"upper_resonator":[1010,476],"core_sampling_port":[1064,561],"entered_assay":[1076,756],"lower_return":[1260,747],"diagnostic_vault":[821,941],"fractionator_valve":[1486,519],"crystal_dryer":[1722,578],"signal_export":[1845,665],"finish_recovery":[1955,538]},GATES={"west":[740,552],"east":[1320,552]},BAN={"xmin":842,"xmax":1214,"upper_max_y":492,"lower_min_y":710},OBSTRUCTION=[953,506,172,158],CROPS=[["01-quarantine-scrubber.png",0,400,400,545],["02-tendon-looms.png",375,405,405,540],["03-veil-resonator.png",760,0,550,520],["04-entered-sampler.png",770,665,540,305],["05-fractionators.png",1320,425,405,545],["06-export-quay.png",1680,415,368,555],["07-vented-vault.png",775,810,245,175]],policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const authorGrid=function authorGrid(){
 const a=new Uint8Array(N);let state=SEED>>>0;
 const rnd=()=>((state=Math.imul(state,1664525)+1013904223>>>0)/4294967296);
 const rect=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const xx=Math.min(W,x+w),yy=Math.min(H,y+h);for(let Y=Math.max(0,y);Y<yy;Y++)a.fill(m,Y*W+Math.max(0,x),Y*W+xx);};
 const disk=(cx,cy,rx,ry,m)=>{rx=Math.max(1,rx);ry=Math.max(1,ry);for(let y=Math.max(0,Math.ceil(cy-ry));y<=Math.min(H-1,Math.floor(cy+ry));y++){const dx=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));rect(Math.ceil(cx-dx),y,Math.floor(cx+dx)-Math.ceil(cx-dx)+1,1,m)}};
 const line=(x1,y1,x2,y2,width,m)=>{const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1))*1.5|0;for(let i=0;i<=steps;i++){const t=i/Math.max(steps,1);disk(x1+(x2-x1)*t,y1+(y2-y1)*t,Math.max(1,width/2),Math.max(1,width/2),m)}};
 const poly=(points,m)=>{let minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),maxY=Math.min(H-1,Math.ceil(Math.max(...points.map(p=>p[1]))));for(let y=minY;y<=maxY;y++){let xs=[];for(let i=0;i<points.length;i++){const q=points[i],r=points[(i+1)%points.length];if((q[1]<=y&&r[1]>y)||(r[1]<=y&&q[1]>y))xs.push(q[0]+(y-q[1])*(r[0]-q[0])/(r[1]-q[1]));}xs.sort((u,v)=>u-v);for(let i=0;i+1<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,m);}};
 const trim=(x,y,w,h,m)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++){let xx=x+i,yy=y+j;if(xx>=0&&yy>=0&&xx<W&&yy<H&&a[yy*W+xx])a[yy*W+xx]=m;}};
 rect(0,982,W,42,101);
 for(let x=0;x<W;x++){let y=902+11*Math.sin(x*.014)+7*Math.sin(x*.047);if(x<275)y-=30;else if(x<595)y-=8;else if(x<790)y+=14;else if(x<1300)y+=27;else if(x<1640)y-=23;else y+=5;y=Math.round(y);rect(x,y,1,982-y,100);rect(x,y,1,Math.min(12,982-y),58);}
 rect(0,967,W,9,101);rect(0,982,W,42,101);
 for(let x=20;x<2040;x+=71){line(x,969,x+38,976,2,62);rect(x+37,972,6,3,79)}
 rect(0,0,455,23,101);poly([[0,20],[445,20],[429,73],[375,83],[334,67],[278,105],[191,77],[106,86],[0,62]],100);
 rect(0,23,90,22,58);rect(0,45,38,155,62);rect(30,110,8,76,77);
 for(let i=0;i<7;i++){let x=52+i*53;rect(x,29,14,37+i%3*11,62);trim(x+2,39,10,7,79)}
 rect(68,787,314,25,62);rect(85,812,27,140,58);rect(354,804,28,151,58);
 rect(96,655,12,132,62);rect(346,634,14,153,62);rect(96,647,264,13,63);
 rect(119,686,216,8,117);rect(140,708,174,16,72);rect(140,733,174,6,77);
 for(let i=0;i<5;i++){let x=158+i*33;rect(x,674,10,16,79);rect(x+3,699,4,35,63)}
 rect(185,752,120,12,128);rect(199,764,13,23,62);rect(277,764,13,23,62);
 rect(124,554,28,92,63);rect(150,550,136,13,62);rect(266,562,20,72,58);
 rect(160,574,86,8,79);rect(160,591,86,7,77);rect(155,612,106,16,72);
 line(286,522,360,592,17,117);line(301,543,360,592,7,79);line(359,592,358,645,15,62);rect(334,624,43,12,63);
 rect(429,864,322,20,62);rect(460,829,20,139,58);rect(696,821,26,153,58);
 rect(438,774,280,14,63);rect(465,785,20,47,62);rect(679,785,20,43,62);
 for(let i=0;i<4;i++){const x=479+i*72,y=550+[25,0,49,16][i];line(x,778,x+11,y,13,117);line(x+11,y,x+36,y-58,9,62);disk(x+38,y-61,17,19,63);disk(x+38,y-61,8,10,72);trim(x+31,y-62,12,4,77);}
 rect(488,800,180,10,62);rect(507,810,14,62,117);rect(641,810,15,62,117);
 for(let i=0;i<5;i++){let x=495+i*37;rect(x,786,13,14,72);rect(x+4,789,5,6,i%2?77:79)}
 poly([[456,713],[742,674],[745,702],[462,741]],62);
 line(460,723,742,687,7,79);line(480,744,713,715,5,128);
 rect(526,753,126,11,72);for(let i=0;i<6;i++){rect(535+i*20,758,9,7,77)}
 rect(745,0,583,30,101);poly([[762,30],[1320,30],[1257,91],[1157,78],[1082,108],[1006,71],[931,105],[842,71],[760,98]],100);
 rect(1018,27,28,120,62);rect(1026,48,12,80,77);
 poly([[860,99],[926,97],[1110,222],[1134,278],[1110,299],[1042,226]],62);
 poly([[1224,100],[1155,86],[982,232],[945,280],[965,305],[1065,230]],117);
 line(853,138,965,299,15,63);line(1255,138,1126,307,17,63);
 line(880,151,990,309,7,79);line(1227,156,1103,313,7,77);
 rect(975,291,166,26,62);rect(986,300,143,8,128);rect(1005,317,105,11,63);
 for(let i=0;i<7;i++){let x=995+i*19;rect(x,324,6,22+(i*7)%21,117);rect(x,343+(i*7)%21,6,6,79)}
 for(let i=0;i<9;i++){const x=834+i*43;const cy=186+(i*23)%47;line(x,85,x+25,cy,5,i%3?62:117);rect(x+21,cy,12,9,i%2?77:79)}
 rect(938,856,305,23,62);rect(956,879,20,86,58);rect(1211,879,19,84,58);
 rect(972,806,224,16,63);rect(1008,822,139,10,128);rect(1018,832,118,8,79);
 rect(988,789,14,17,62);rect(1167,788,14,18,62);
 rect(996,773,37,12,72);rect(1140,771,35,13,72);
 rect(1009,850,25,6,77);rect(1142,850,22,6,79);
 rect(957,728,13,127,62);rect(1200,742,12,114,62);rect(970,736,31,11,79);rect(1177,747,23,9,77);
 rect(1262,846,118,13,62);rect(1270,859,13,115,58);rect(1341,860,15,107,58);
 rect(1276,834,71,8,72);rect(1291,836,32,5,77);
 rect(1381,862,316,20,62);for(const x of [1402,1509,1666])rect(x,881,22,100,58);
 poly([[1389,858],[1428,562],[1461,578],[1462,856]],117);
 poly([[1505,857],[1545,497],[1584,535],[1556,857]],62);
 poly([[1630,861],[1639,609],[1688,570],[1673,864]],128);
 line(1412,828,1442,604,5,79);line(1532,810,1557,535,7,77);line(1652,816,1672,612,5,79);
 rect(1414,754,96,15,63);rect(1466,769,16,94,62);
 rect(1564,703,99,13,63);rect(1595,713,18,149,62);
 rect(1406,783,51,14,72);rect(1577,731,61,18,72);rect(1584,740,36,4,77);
 line(1460,672,1530,638,12,62);line(1543,630,1630,645,9,63);
 disk(1490,646,27,27,117);disk(1490,646,15,15,72);disk(1490,646,5,5,79);
 disk(1663,586,20,20,62);disk(1663,586,10,10,72);rect(1658,581,11,10,77);
 rect(1695,0,353,22,101);
 poly([[1694,20],[2048,20],[2048,60],[1971,83],[1899,55],[1815,101],[1738,62]],100);
 line(1770,56,1793,228,12,63);line(1965,62,1923,261,11,62);
 line(1801,84,1880,193,7,117);line(1911,80,1887,209,7,128);
 rect(1762,213,72,12,62);rect(1900,249,91,12,63);
 for(let k=0;k<6;k++){let x=1768+k*36;line(x,32,x+18,124+(k*19)%44,4,k%2?79:77)}
 rect(1947,226,38,9,79);
 rect(1748,843,285,20,63);rect(1758,863,16,108,58);rect(1990,864,17,106,58);
 rect(1764,792,268,12,62);for(let i=0;i<12;i++){const x=1774+i*21;rect(x,804,9,34,117);rect(x+1,810,7,7,79)}
 rect(1814,755,168,15,128);rect(1828,774,128,13,72);rect(1840,776,16,9,77);
 rect(1777,691,25,102,62);rect(1976,688,18,105,62);
 line(1788,694,1920,638,9,117);line(1920,638,1992,691,9,62);
 rect(1819,654,63,10,79);rect(1944,664,28,10,77);
 rect(785,923,174,44,0);rect(800,848,44,121,0);
 rect(786,967,174,3,62);rect(787,925,12,2,79);rect(939,925,14,2,77);
 for(let i=0;i<2800;i++){let x=30+(rnd()*1980|0),y=865+(rnd()*110|0);if(x<W&&y<H&&a[y*W+x]){let m=i%9===0?79:(i%5===0?62:117);trim(x,y,2+(i%6),1,m)}}
 for(let i=0;i<24;i++){let x=96+i*81;trim(x,966,31,2,i%4===0?79:62)}
 const seen=new Uint8Array(N),q=new Int32Array(N);let head=0,tail=0;
 const seed=(idx)=>{if(a[idx]&&!seen[idx]){seen[idx]=1;q[tail++]=idx;}};
 for(let x=0;x<W;x++){seed(x);seed((H-1)*W+x)}for(let y=0;y<H;y++){seed(y*W);seed(y*W+W-1)}
 while(head<tail){let p=q[head++],x=p%W,y=p/W|0;if(x>0)seed(p-1);if(x<W-1)seed(p+1);if(y>0)seed(p-W);if(y<H-1)seed(p+W)}
 let pruned=0;for(let p=0;p<N;p++)if(a[p]&&!seen[p]){a[p]=0;pruned++;}
 return {grid:a,pruned};
};
const encode=function encode(grid){const rects=[],active=new Map();let work=0;for(let y=0;y<H;y++){const next=new Map();let x=0;while(x<W){const m=grid[y*W+x];if(!m){x++;continue}let e=x+1;while(e<W&&grid[y*W+e]===m)e++;const key=x+','+(e-x)+','+m;if(active.has(key)){const r=active.get(key);r[3]++;next.set(key,r)}else{const r=[x,y,e-x,1,m];rects.push(r);next.set(key,r)}work+=e-x;x=e}active.clear();for(const [key,r] of next)active.set(key,r)}rects.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);return {rects,work}};
const replayCheck=function replayCheck(grid,rects){let b=new Uint8Array(N),over=0,invalid=0;for(const [x,y,w,h,m] of rects){if(x<0||y<0||x+w>W||y+h>H||w<1||h<1||!MAT_IDS.has(m)){invalid++;continue}for(let Y=y;Y<y+h;Y++)for(let X=x;X<x+w;X++){const i=Y*W+X;if(b[i])over++;b[i]=m}}let different=0;for(let i=0;i<N;i++)if(b[i]!==grid[i])different++;return {overlaps:over,invalid,mismatches:different}};
const clearance=function clearance(grid,w,h){const halfX=(w-1)/2,halfY=(h-1)/2,prefix=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=grid[y*W+x]?1:0;prefix[(y+1)*(W+1)+x+1]=prefix[y*(W+1)+x+1]+row}}const free=new Uint8Array(N);for(let y=halfY;y<H-halfY;y++)for(let x=halfX;x<W-halfX;x++){let x0=x-halfX,y0=y-halfY,x1=x+halfX+1,y1=y+halfY+1;const solids=prefix[y1*(W+1)+x1]-prefix[y0*(W+1)+x1]-prefix[y1*(W+1)+x0]+prefix[y0*(W+1)+x0];free[y*W+x]=solids===0?1:0}return free};
const bfs=function bfs(free,start,end=null,ban=null){const s=start[1]*W+start[0],visited=new Uint8Array(N),dist=new Int32Array(N),q=new Int32Array(N);if(!free[s]||end&&!free[end[1]*W+end[0]])return {count:0,distance:-1,visited};let head=0,tail=1;q[0]=s;visited[s]=1;while(head<tail){let p=q[head++],x=p%W,y=p/W|0;if(end&&p===end[1]*W+end[0])return {count:tail,distance:dist[p],visited};for(const nb of [x>0?p-1:-1,x<W-1?p+1:-1,y>0?p-W:-1,y<H-1?p+W:-1]){if(nb<0||visited[nb]||!free[nb])continue;const xx=nb%W,yy=nb/W|0;if(ban&&xx>=ban.xmin&&xx<=ban.xmax&&((ban.mode==='upper'&&yy>ban.upper_max_y)||(ban.mode==='lower'&&yy<ban.lower_min_y)))continue;visited[nb]=1;dist[nb]=dist[p]+1;q[tail++]=nb}}return {count:tail,distance:-1,visited}};
const crc32=function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++){c^=bytes[i];for(let j=0;j<8;j++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1)}return(c^0xffffffff)>>>0};
const be32=function be32(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]};
const pngBytes=function pngBytes(grid,x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)raw[y*(w+1)+x+1]=grid[(y0+y)*W+x0+x];
 const z=[0x78,0x01];let off=0;while(off<raw.length){const len=Math.min(65535,raw.length-off),last=off+len===raw.length;z.push(last?1:0,len&255,len>>>8,(~len)&255,((~len)>>>8)&255);for(let i=0;i<len;i++)z.push(raw[off+i]);off+=len}
 let s1=1,s2=0;for(const b of raw){s1=(s1+b)%65521;s2=(s2+s1)%65521}z.push(...be32((s2*65536+s1)>>>0));
 function chunk(name,data){const arr=new Uint8Array(12+data.length);arr.set(be32(data.length),0);for(let i=0;i<4;i++)arr[4+i]=name.charCodeAt(i);arr.set(data,8);arr.set(be32(crc32(arr.subarray(4,8+data.length))),8+data.length);return arr}
 const hdr=new Uint8Array([...be32(w),...be32(h),8,3,0,0,0]);const pal=new Uint8Array(768);for(const [id,c] of Object.entries(PALETTE))pal.set(c,+id*3);
 const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",hdr),chunk("PLTE",pal),chunk("IDAT",new Uint8Array(z)),chunk("IEND",new Uint8Array(0))],sz=parts.reduce((a,p)=>a+p.length,0),out=new Uint8Array(sz);let idx=0;for(const p of parts){out.set(p,idx);idx+=p.length}return out};
const verifyPng=function verifyPng(bytes,grid,x0,y0,w,h){let off=8,raw=null,done=false;while(off<bytes.length){const n=((bytes[off]*16777216)+(bytes[off+1]<<16)+(bytes[off+2]<<8)+bytes[off+3])>>>0,name=String.fromCharCode(...bytes.slice(off+4,off+8)),data=bytes.slice(off+8,off+8+n),checksum=((bytes[off+8+n]*16777216)+(bytes[off+9+n]<<16)+(bytes[off+10+n]<<8)+bytes[off+11+n])>>>0;if(crc32(bytes.slice(off+4,off+8+n))!==checksum)throw Error("CRC "+name);if(name==="IDAT"){let r=[];for(let j=2;j<data.length-4;){const header=data[j++],length=data[j]|data[j+1]<<8;j+=4;for(let k=0;k<length;k++)r.push(data[j++]);}raw=new Uint8Array(r)}if(name==="IEND")done=true;off+=12+n;}if(!done||!raw||raw.length!==(w+1)*h)throw Error("PNG malformed");for(let y=0;y<h;y++){if(raw[y*(w+1)]!==0)throw Error("filter");for(let x=0;x<w;x++)if(raw[y*(w+1)+1+x]!==grid[(y0+y)*W+x0+x])throw Error("pixel parity")}return true};
const hash=b=>crypto.createHash("sha256").update(b).digest("hex");
function main(out=__dirname){fs.mkdirSync(out,{recursive:true});const {grid,pruned}=authorGrid(),{rects,work}=encode(grid),replay=replayCheck(grid,rects);if(replay.overlaps||replay.invalid||replay.mismatches)throw Error("Non-lossless");let hist={},occupied=0;for(const id of grid){hist[id]=(hist[id]||0)+1;if(id)occupied++}const actor={"id":1,"model":"midge","hash":"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96","spawn":[116,544],"options":{"budget":20,"mass_multiplier":1,"inertia_multiplier":1,"thrust_multiplier":1,"torque_multiplier":1,"boost_multiplier":1.8}},setup={version:2,extent:[W,H],actors:[actor],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};const json=JSON.stringify(setup);fs.writeFileSync(path.join(out,"setup-thalassa-veil-ossuary.json"),json);if(hash(grid)!=="313bcf80a27047339d613aaacbc47735046fae50280bba0b0ac66364c95fa8be"||hash(Buffer.from(json))!=="645a88655b3ea23226bb660f233207959fe28df7efc2dfc28fcbbe809a3c9068")throw Error("Source digest regression");let routes={};for(const [w,h] of [[19,15],[23,19],[31,27]]){const free=clearance(grid,w,h),flood=bfs(free,SITES.spawn_mooring),sites={};for(const [name,[x,y]] of Object.entries(SITES)){const near=[y*W+x-1,y*W+x+1,(y-1)*W+x,(y+1)*W+x];sites[name]={valid:!!free[y*W+x],reachable:!!flood.visited[y*W+x],four_approaches:near.every(p=>!!free[p])}}if(Object.values(sites).some(s=>!s.valid||!s.reachable||!s.four_approaches))throw Error("Route regression "+w);routes[w+"x"+h]={reachable_centres:flood.count,sites}}const obstructed=new Uint8Array(grid);for(let y=OBSTRUCTION[1];y<OBSTRUCTION[1]+OBSTRUCTION[3];y++)for(let x=OBSTRUCTION[0];x<OBSTRUCTION[0]+OBSTRUCTION[2];x++)obstructed[y*W+x]=58;const f31=clearance(grid,31,27),fo=clearance(obstructed,31,27),alt={baseline_shortest:bfs(f31,GATES.west,GATES.east).distance,obstructed_shortest:bfs(fo,GATES.west,GATES.east).distance,restrictions:{}};for(const mode of ["upper","lower"])alt.restrictions[mode]={baseline:bfs(f31,GATES.west,GATES.east,{...BAN,mode}).distance,obstructed:bfs(fo,GATES.west,GATES.east,{...BAN,mode}).distance};if(alt.obstructed_shortest<=alt.baseline_shortest||Object.values(alt.restrictions).some(s=>s.baseline<0||s.obstructed<0))throw Error("Detour regression");let images={};for(const [f,x,y,w,h] of [["overview.png",0,0,W,H],...CROPS]){const buf=pngBytes(grid,x,y,w,h);verifyPng(buf,grid,x,y,w,h);fs.writeFileSync(path.join(out,f),buf);images[f]={bytes:buf.length,format:"indexed-material-ID",crc:"PASS",pixel_parity:"PASS",pixels:w*h,source_window:[x,y,w,h]}}const qualification={title:"Thalassa Veil Ossuary",seed:SEED,engine_sha:ENGINE,base_sha:BASE,source:"ORIGINAL-NO-REFERENCE",extent:[W,H],cells:N,grid_sha256:hash(grid),setup_sha256:hash(Buffer.from(json)),setup_bytes:json.length,material_histogram:hist,occupied,grounded:occupied,detached:0,pruned_nominal_cells:pruned,rectangles:rects.length,work,replay,sites:SITES,site_validation:routes,gates:GATES,restricted_bypass:alt,obstruction:OBSTRUCTION,crops:CROPS,images,materials:Array.from(MAT_IDS),fluid_cells:0,native:"NATIVE-UNTESTED"};if(rects.length>32768||json.length>1048576||work>32000000)throw Error("source cap");fs.writeFileSync(path.join(out,"qualification.json"),JSON.stringify(qualification,null,2)+"\n");fs.writeFileSync(path.join(out,"design.json"),JSON.stringify({"title":"Thalassa Veil Ossuary","seed":2611201103,"engine_sha":"de109d0131641d6adc8d25bb9ced7ca3d4991105","base_sha":"99a166e7fcae45eb22be1740e9f33f62faccbcc7","source":"ORIGINAL-NO-REFERENCE","sites":{"spawn_mooring":[116,544],"isolation_valve":[405,651],"pulse_ledger":[426,627],"tendon_lift":[769,610],"upper_resonator":[1010,476],"core_sampling_port":[1064,561],"entered_assay":[1076,756],"lower_return":[1260,747],"diagnostic_vault":[821,941],"fractionator_valve":[1486,519],"crystal_dryer":[1722,578],"signal_export":[1845,665],"finish_recovery":[1955,538]},"gates":{"west":[740,552],"east":[1320,552]},"route_bans":{"xmin":842,"xmax":1214,"upper_max_y":492,"lower_min_y":710},"obstruction":[953,506,172,158],"crops":[["01-quarantine-scrubber.png",0,400,400,545],["02-tendon-looms.png",375,405,405,540],["03-veil-resonator.png",760,0,550,520],["04-entered-sampler.png",770,665,540,305],["05-fractionators.png",1320,425,405,545],["06-export-quay.png",1680,415,368,555],["07-vented-vault.png",775,810,245,175]],"districts":["quarantine scrubber","tendon pulse loom","descending neural veil and entered sampler","membrane fractionation","dry export quay"],"palette":{"0":[7,12,23],"58":[79,88,104],"62":[111,137,154],"63":[165,193,195],"72":[23,65,79],"77":[46,233,203],"79":[255,171,74],"100":[48,56,76],"101":[27,32,49],"117":[107,93,93],"128":[173,125,165]}},null,2)+"\n");console.log({gridSHA:hash(grid),rectangles:rects.length,bytes:json.length,occupied})}
if(require.main===module)main(process.argv[2]);
