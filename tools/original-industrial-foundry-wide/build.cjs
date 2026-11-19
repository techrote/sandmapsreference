'use strict';
// FROM-SCRATCH original material-cell foundry, no image inputs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const W=2048,H=1024,SEED=19261119;
const OUT=path.resolve(__dirname,'../../cybersand-canvases/2048x1024/original-industrial-foundry-wide-long-pour-steelworks');
const g=new Uint8Array(W*H); let rng=SEED>>>0;
function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296}
const M={air:0,water:3,lava:8,industrial:57,concrete:58,steel:62,painted:63,rust:65,grate:66,pipe:68,copper:69,glass:72,stripe:76,cyan:77,amber:79,white:80,basalt:100,firebrick:104,iron:117,heat:131};
function R(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.floor(w);h=Math.floor(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error('out-of-bounds '+[x,y,w,h]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w)}
function L(x1,y1,x2,y2,t,m){let dx=x2-x1,dy=y2-y1,n=Math.max(Math.abs(dx),Math.abs(dy));for(let i=0;i<=n;i++){let x=Math.round(x1+dx*i/n),y=Math.round(y1+dy*i/n);R(x,y,t,t,m)}}
function frame(x,y,w,h,t,m){R(x,y,w,t,m);R(x,y+h-t,w,t,m);R(x,y,t,h,m);R(x+w-t,y,t,h,m)}
function girder(x1,x2,y,thick,step=70){R(x1,y,x2-x1,thick,M.steel);R(x1,y+44,x2-x1,thick,M.rust);for(let x=x1;x<x2-42;x+=step){L(x,y+thick,x+42,y+44,3,M.steel);L(x+42,y+thick,x,y+44,3,M.steel)}}
// Excavated steelworks: continuous subgrade air corridors are genuine cells.
R(0,745,W,279,M.basalt);R(0,996,W,28,M.concrete);
for(const [y,h] of [[806,70],[911,63]])R(48,y,1952,h,M.air);
for(const [x,w] of [[134,82],[447,92],[859,95],[1354,90],[1871,96]])R(x,685,w,291,M.air);
// Structured cave linings, tracks and sleeper rails. Connected to bedrock.
for(const y of [795,884,900,984])R(40,y,1960,9,M.concrete);
for(let x=65;x<1995;x+=83){R(x,884,7,27,M.steel);R(x+8,984,6,12,M.rust)}
// Keep shaft portals genuinely open after lining geometry.
for(const [x,w] of [[134,82],[447,92],[859,95],[1354,90],[1871,96]])R(x,785,w,203,M.air);
for(let x=70;x<1980;x+=41){if(![[134,216],[447,539],[859,954],[1354,1444],[1871,1967]].some(([a,b])=>x>=a-7&&x<=b+7)){R(x,896,10,4,M.pipe);R(x,976,10,3,M.rust)}}
// Tiered foundation outlines; the lower transport-axis remains playable.
R(22,724,1988,21,M.concrete);R(26,714,1980,10,M.steel);
for(const [x,w] of [[134,82],[447,92],[859,95],[1354,90],[1871,96]])R(x,700,w,48,M.air);
// Primary 2D trussed gantry: a credible spanning structural skeleton.
R(32,122,1984,13,M.steel);R(32,174,1984,11,M.rust);
for(let x=46;x<1975;x+=144){L(x,136,x+70,172,4,M.steel);L(x+70,136,x,172,4,M.steel)}
for(const [x,w] of [[48,15],[1994,14]])R(x,122,w,605,M.rust);
// Twin perimeter stanchions close the live roof-to-ground load path outside the excavated flight ducts.
R(29,137,12,855,M.steel);R(2007,137,12,855,M.steel);
// Load-bearing high columns with real Midge-sized crossovers.
for(const [x,w] of [[382,16],[876,18],[1515,16]]){
 R(x,124,w,164,M.steel);R(x,358,w,107,M.steel);R(x,598,w,129,M.rust);
 // a 70px upper window (288-358), a 133px mid crossover (465-598)
 R(x-12,590,w+24,9,M.steel);R(x-13,457,w+26,7,M.steel);
}
// Exposed, independently readable industrial ground floor platforms.
for(const [x0,x1,y] of [[45,370,660],[405,846,674],[912,1588,672],[1632,2010,690]]){
 R(x0,y,x1-x0,10,M.steel);R(x0,y+10,x1-x0,5,M.grate);
 for(let x=x0+36;x<x1-12;x+=87)L(x,y+15,x+37,712,4,M.rust);
}
// District 1: ore reception / skip hoist, asymmetrical dual receiving pockets.
R(82,467,13,246,M.steel);R(282,424,14,289,M.rust);R(86,470,211,10,M.steel);
R(108,486,153,10,M.industrial);R(114,498,144,10,M.grate);
for(const [x,y,w,h] of [[111,535,64,72],[188,515,78,104]]){
 frame(x,y,w,h,7,M.rust);R(x+9,y+h-18,w-18,8,M.steel);
 for(let b=0;b<4;b++)R(x+13+b*12,y+h-12,7,4,M.stripe);
}
for(let y=296;y<440;y+=31){R(87,y,18,6,M.steel);R(259,y,18,6,M.rust)}
R(84,291,197,16,M.steel);L(97,312,280,424,7,M.rust);L(102,319,285,431,4,M.stripe);
// Functional ore chute into high blast furnace feed, continuous rails/rollers.
L(284,439,487,473,9,M.steel);L(287,432,489,466,4,M.rust);
for(let x=313;x<467;x+=28){R(x,440+Math.floor((x-283)*34/205),12,6,M.grate)}
// District 2: TWO UNEQUAL BLAST FURNACES with exhaust stacks, not a generic reactor ring.
for(const [x,y,w,h] of [[488,381,164,294],[682,441,116,233]]){
 R(x,y,w,h,M.industrial);R(x+10,y+13,w-20,h-26,M.firebrick);
 R(x+22,y+57,w-44,h-91,M.heat);R(x+33,y+68,w-66,h-119,M.lava);
 R(x+6,y-27,w-12,29,M.rust);R(x+18,y-44,w-36,18,M.steel);
 for(let yy=y+34; yy<y+h-20; yy+=37){R(x-11,yy,w+22,6,M.steel);R(x-7,yy+7,5,11,M.stripe)}
 R(x+10,y+h-2,w-20,47,M.concrete);
}
// Structural hanger at the western blast furnace: continuous load path from the top truss.
R(523,177,12,75,M.steel); // roof-to-ore furnace exhaust load hanger
R(523,247,43,134,M.rust);R(698,307,34,134,M.steel);
for(let y=255;y<365;y+=28){R(517,y,55,5,M.steel);R(695,y+50,39,6,M.rust)}
R(523,234,43,13,M.steel);R(698,295,34,12,M.steel);
// Inter-furnace blower manifold and pressure plant; visibly connected.
R(635,561,52,18,M.steel);R(626,570,17,92,M.pipe);R(777,560,78,16,M.pipe);
for(let x=648;x<773;x+=30){R(x,654,11,20,M.rust)}
// Second-tier inspection galleries readable at one-to-one game scale.
R(440,354,389,10,M.grate);R(472,345,13,18,M.steel);R(814,345,15,18,M.steel);
for(let x=461;x<823;x+=48){R(x,332,8,22,M.steel);R(x+6,332,13,3,M.stripe)}
// District 3: elevated travelling overhead crane / hot ladle transfer.
girder(906,1528,248,10,66);
for(let x=955;x<1497;x+=106){R(x,206,10,43,M.steel);L(x,206,x+47,181,4,M.steel)}
// Crane carriage, separate rails, hoist/twin suspension cable, ladle in section.
R(1122,231,142,24,M.steel);R(1134,222,116,11,M.stripe);
for(let x of [1147,1235]){R(x,257,8,176,M.rust);R(x+2,257,3,176,M.copper)}
R(1117,429,151,12,M.steel);R(1126,441,133,63,M.industrial);
R(1140,448,105,42,M.firebrick);R(1153,458,79,26,M.amber);
R(1158,504,66,10,M.rust);
// Two operating operator cubicles: enterable, grounded, and externally approached.
frame(945,501,137,149,9,M.steel);R(963,516,94,13,M.glass);R(962,560,104,7,M.grate);
R(945,589,10,61,M.air);R(1067,589,15,61,M.air);R(951,642,132,8,M.steel);
frame(1372,497,134,157,9,M.rust);R(1385,516,105,8,M.cyan);R(1386,551,98,8,M.grate);
R(1372,584,10,67,M.air);R(1496,587,10,67,M.air);R(1372,644,134,8,M.steel);
// District 4: continuous casting ribbon, mould bays, tandem roller presses.
R(1083,645,494,16,M.rust);R(1095,625,473,11,M.steel);
for(let x=1100;x<1567;x+=27){R(x,631,14,14,M.grate);R(x+3,622,8,8,M.steel);R(x+6,613,3,9,M.stripe)}
R(1105,608,445,6,M.iron);R(1170,602,320,5,M.amber);
for(const [x,w] of [[1136,30],[1290,36],[1503,32]]){R(x,578,w,28,M.steel);R(x+7,587,w-14,14,M.industrial);R(x-6,603,w+12,4,M.stripe)}
for(let x=1124;x<1550;x+=100){R(x,656,9,16,M.rust);L(x+9,656,x+36,674,4,M.steel)}
// District 5: stepped cooling/quench facility with independent fully sealed Water chamber.
R(1629,605,213,100,M.concrete);R(1643,617,187,76,M.steel);
R(1655,632,165,53,M.water);R(1643,617,187,12,M.heat);R(1643,687,187,18,M.concrete);
R(1670,600,120,10,M.grate);R(1680,589,100,9,M.cyan);
for(let x=1665;x<1822;x+=39){R(x,571,11,18,M.rust);R(x-4,559,19,13,M.stripe)}
R(1841,617,134,13,M.steel);R(1856,631,106,55,M.rust);
R(1863,644,91,9,M.grate);R(1853,682,119,9,M.concrete);
// Extraction gantry and export rail, grounded and varied roof line.
R(1901,344,13,347,M.steel);R(1954,391,12,301,M.rust);
R(1886,335,96,10,M.steel);L(1889,345,1960,389,5,M.steel);
for(let y=421;y<575;y+=34){R(1895,y,64,5,M.grate);R(1905,y+6,8,12,M.pipe)}
R(1840,650,156,9,M.steel);R(1836,670,161,8,M.grate);
// Access ladders / shafts are strictly side elevation and connected to slabs.
for(const [x,a,b] of [[126,511,700],[844,530,700],[1586,493,700],[1986,501,694]]){
 R(x,a,4,b-a,M.steel);R(x+17,a,4,b-a,M.rust);
 for(let y=a+10;y<b-5;y+=17)R(x+4,y,13,4,M.grate);
}
// Underground piping: supports emerge from tunnel walls, service return still open.
for(const [x,y,len] of [[223,892,175],[571,892,212],[989,892,242],[1490,892,248]]){
 R(x,y,len,5,M.pipe);R(x+15,y+5,7,14,M.steel);R(x+len-21,y+5,7,14,M.steel);
}
for(const [x,y,w] of [[251,943,75],[578,944,78],[1005,941,100],[1484,942,96]]){
 R(x,y,w,7,M.steel);R(x,y+7,8,14,M.rust);R(x+w-8,y+7,8,14,M.rust);
}
// Slender subgrade pier caps ground the long inspection-trench soffits while leaving shaft detours.
for(const x of [310,670,1130,1610]){R(x,795,10,85,M.steel);R(x-10,876,30,8,M.rust)}
// Re-open all five transfer wells at the two subterranean levels after details.
for(const [x,w] of [[134,82],[447,92],[859,95],[1354,90],[1871,96]]){
 R(x,778,w,19,M.air);R(x,887,w,24,M.air);R(x,975,w,20,M.air);
}
// Deliberate bridge lips at portal edges, leave >31x27 clear air.
for(const [x,w] of [[134,82],[447,92],[859,95],[1354,90],[1871,96]]){
 R(x-9,775,9,11,M.steel);R(x+w,775,9,11,M.steel);
}
// Structural service hatches and shaft mouths are physical passages, not telemetry waivers.
// Hoist hatch and the ore-transfer cutout connect its suspended upper gallery to the mine return.
R(175,342,62,73,M.air);R(156,458,95,79,M.air);R(156,537,69,93,M.air);R(151,627,65,179,M.air);
// 40-cell industrial slot beside the furnace, rather than undermining the hot core.
R(448,642,40,165,M.air);
// Open centre blower descent and preserve a visible upper industrial crossover.
R(835,526,36,55,M.air);R(876,648,78,158,M.air);
// Open the east service hatch and two gantry service doors, with 31-cell flight envelope.
R(1907,653,60,153,M.air);R(1887,509,35,103,M.air);R(1945,514,82,121,M.air);
// West skip-hoist headroom hatch, restores a second roof-to-gallery Midge path.
R(164,283,68,43,M.air);
R(1970,340,42,8,M.steel); // east gantry tied to perimeter stanchion
// R2: grounded load paths reconstructed from independently audited floating assemblies.
// Braces are engineered local supports, NOT full-height flight-channel barriers.
// The initially plausible right roof-to-hoist strut at x265 was rejected after
// exact 31x27 four-neighbour rerouting disconnected West furnace approach.
R(1138,598,15,54,M.steel);R(1322,597,15,55,M.steel);R(1463,598,15,54,M.steel); // caster roll pedestals onto anchored rail deck
R(996,637,13,40,M.steel); // west crane operator cabin column to plant deck
R(876,279,10,90,M.steel);R(1515,279,10,90,M.steel); // high gantry interrupted columns through upper window margins
R(94,180,9,121,M.steel); // west skip crown hung from roof truss
R(273,291,10,134,M.steel); // east skip crown supported by local grounded hoist stanchion, NO roof-channel closure
R(92,300,7,141,M.steel);R(264,300,7,141,M.steel); // hoist ladder rails and mechanical crossbars
R(1710,588,12,38,M.steel); // quench status rig anchored on sealed containment shell
R(1380,513,12,56,M.steel); // operator instrument shelf tied to entry frame
R(280,957,10,22,M.steel);R(608,957,10,22,M.steel);R(1044,954,10,25,M.steel);R(1530,955,10,24,M.steel); // inspection benches on lower tunnel footing
R(417,685,13,60,M.steel); // west furnace approach apron on basalt cap
R(94,482,24,10,M.steel); // west receiving shelf coupled into skip mast
R(254,522,34,8,M.steel); // east skip basket's positive tie to stanchion

const sites={
 'Receiving spawn':[115,448], 'Ore sorting booth':[335,554], 'Skip hoist apex':[203,365],
 'West furnace approach':[453,399], 'Blast furnace survey':[644,301], 'Blower transfer':[845,545],
 'Crane upper gallery':[1053,336], 'Ladle inspection':[1275,542], 'Caster operator':[1435,460],
 'Quench overseer':[1765,513], 'East rail recovery':[2003,567],
 'Western service return':[270,849], 'Blower basement':[700,843], 'Caster sump':[1195,841], 'East maintenance':[1780,842],
};
const SECTIONS={
 '01-ore-and-skip':[32,265,482,457], '02-blast-furnaces':[395,222,490,505],
 '03-ladle-crane':[897,168,642,440], '04-caster-cells':[1020,527,573,192],
 '05-quench-and-export':[1585,320,452,408], '06-subgrade-rail':[300,755,1400,241],
};
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function encode(grid){const edits=[];let open=new Map();for(let y=0;y<H;y++){const next=new Map();for(let x=0;x<W;){let start=x,mat=grid[y*W+x];while(x<W&&grid[y*W+x]===mat)x++;if(!mat)continue;const key=start+','+(x-start)+','+mat;
 let idx=open.get(key);if(idx!==undefined&&edits[idx][1]+edits[idx][3]===y){edits[idx][3]++;next.set(key,idx)}else{next.set(key,edits.length);edits.push([start,y,x-start,1,mat])}}
 open=next;}return edits}
function replay(edits){const b=new Uint8Array(W*H);for(const [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||m===0)throw Error('bad edit');for(let yy=y;yy<y+h;yy++){for(let k=yy*W+x;k<yy*W+x+w;k++){if(b[k])throw Error('overlap '+k);b[k]=m}}}return b}
function prefix(grid){const A=new Uint32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=(grid[y*W+x]!==0?1:0);A[(y+1)*(W+1)+x+1]=row+A[y*(W+1)+x+1]}}return A}
function flight(grid,w,h){const dx=Math.floor(w/2),dy=Math.floor(h/2),A=prefix(grid),ok=new Uint8Array(W*H),bfs=new Uint8Array(W*H),q=new Int32Array(W*H);
 for(let y=dy;y<H-dy;y++)for(let x=dx;x<W-dx;x++){let top=y-dy,bot=y+dy+1,left=x-dx,right=x+dx+1;let n=A[bot*(W+1)+right]-A[top*(W+1)+right]-A[bot*(W+1)+left]+A[top*(W+1)+left];if(!n)ok[y*W+x]=1}
 const [sx,sy]=sites['Receiving spawn'];if(!ok[sy*W+sx])throw Error(`spawn invalid ${w}x${h}`);let head=0,tail=0;q[tail++]=sy*W+sx;bfs[sy*W+sx]=1;
 while(head<tail){const a=q[head++],x=a%W,y=(a/W)|0;for(const nb of [x>0?a-1:-1,x<W-1?a+1:-1,y>0?a-W:-1,y<H-1?a+W:-1]){if(nb>=0&&ok[nb]&&!bfs[nb]){bfs[nb]=1;q[tail++]=nb}}}
 const reach={};for(const [name,[x,y]] of Object.entries(sites))reach[name]={x,y,free:!!ok[y*W+x],reachable:!!bfs[y*W+x]};return {envelope:[w,h],reachable:Object.values(reach).filter(x=>x.reachable).length,total:Object.keys(sites).length,flood:tail,sites:reach};}
function rooted(grid){const seen=new Uint8Array(W*H),q=new Int32Array(W*H);let head=0,tail=0,total=0;for(let i=0;i<g.length;i++)if(grid[i]&&!([3,8].includes(grid[i])))total++;
 for(let x=0;x<W;x++){let i=(H-1)*W+x;if(grid[i]&&grid[i]!==3&&grid[i]!==8&&!seen[i]){q[tail++]=i;seen[i]=1}}
 while(head<tail){let a=q[head++],x=a%W,y=(a/W)|0;for(const b of [x>0?a-1:-1,x<W-1?a+1:-1,y>0?a-W:-1,y<H-1?a+W:-1]){if(b>=0&&grid[b]&&grid[b]!==3&&grid[b]!==8&&!seen[b]){seen[b]=1;q[tail++]=b}}}return {rooted:tail,total,detached:total-tail};}
const palette={0:[8,11,18],3:[47,127,210],8:[241,78,31],57:[116,63,54],58:[119,123,128],62:[126,141,153],63:[49,100,119],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],72:[37,60,76],76:[227,182,47],77:[55,243,228],79:[255,181,46],80:[236,248,255],100:[54,56,61],104:[200,152,98],117:[90,94,100],131:[26,26,29]};
// 131 HeatShieldTile is stable inert Solid; palette RGB matches accepted material.hpp.
function crc32(b){let c=0xffffffff;for(const v of b){c^=v;for(let j=0;j<8;j++)c=c&1?(c>>>1)^0xedb88320:c>>>1}return(c^0xffffffff)>>>0}
function chunk(type,data){const tag=Buffer.from(type),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([tag,data])));return Buffer.concat([len,tag,data,crc])}
function png(grid,x,y,w,h){const row=Buffer.alloc((w+1)*h);for(let j=0;j<h;j++){const a=j*(w+1);row[a]=0;Buffer.from(grid.subarray((y+j)*W+x,(y+j)*W+x+w)).copy(row,a+1)}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=3;const plte=Buffer.alloc(132*3);for(let k=0;k<132;k++){const c=palette[k]||[8,11,18];plte.set(c,k*3)}return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('PLTE',plte),chunk('IDAT',zlib.deflateSync(row,{level:9})),chunk('IEND',Buffer.alloc(0))])}
function write(name,bytes){const file=path.join(OUT,name);if(process.argv.includes('--verify')){if(!fs.existsSync(file)||!fs.readFileSync(file).equals(bytes))throw Error('nonreproducible '+name)}else{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(file,bytes)}}
const edits=encode(g),check=replay(edits);if(!Buffer.from(g).equals(Buffer.from(check)))throw Error('plane replay mismatch');
const f=[[19,15],[23,19],[31,27]].map(([w,h])=>flight(g,w,h));let failed=f.filter(x=>x.reachable!==x.total);if(failed.length){console.error(JSON.stringify(failed.map(x=>({env:x.envelope,bad:Object.entries(x.sites).filter(([k,v])=>!v.reachable)})),null,2));throw Error('flight site failure')}
const mask=g.slice();for(let y=490;y<550;y++)for(let x=1025;x<1075;x++)mask[y*W+x]=M.concrete;const diversion=flight(mask,31,27);
const support=rooted(g),hist={};for(const v of g)hist[v]=(hist[v]||0)+1;
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:sites['Receiving spawn'],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
const json=Buffer.from(JSON.stringify(setup)+'\n');if(json.length>1048576||edits.length>32768)throw Error('capacity exceeded');let work=edits.reduce((s,e)=>s+e[2]*e[3],0);if(work>32000000)throw Error('native construction work exceeded');
const pngs={'overview.png':png(g,0,0,W,H)};for(const [name,bb] of Object.entries(SECTIONS))pngs[name+'.png']=png(g,...bb);
const doc=`# The Long Pour — original industrial steelworks\n\n**2048×1024 exact material-cell plane; independent authored 2D side elevation; no image reference. NATIVE-UNTESTED.**\n\n## Design thesis\nA kilometre-like continuous industrial pouring journey at Midge scale, from dry ore skip and paired unequal blast furnaces to a suspended crane ladle, long roller casting line, contained quench and export gantry. The furnace cores and quench pool are separate sealed physical cells, not simulated machine interactions. A deliberately dark, enterable subgrade inspection railway connects five 82–95-cell-wide transfer shafts. Bright thermal brick and steel equipment stand over deep basalt service geology. Negative space is a real traversal chamber, not a scenic backdrop.\n\n## Intended goal, sites and routes\nFly from **Receiving spawn** to **East rail recovery**, visiting furnace survey, suspended crane, rolling caster and quench. Main: Receiving → Ore sorting → Blower transfer → Ladle inspection → Caster operator → Quench overseer → Exit. Upper alternate: Skip hoist → West furnace approach → Blast furnace survey → Crane upper gallery → Caster operator. Subgrade alternate: descend west shaft near x175 to Western service return, continue through Blower basement and Caster sump, emerge near eastern maintenance shaft; shaft clearances are verified conservatively.\n\nAll exact named site centres (x,y):\n\n${Object.entries(sites).map(([k,v])=>'- '+k+': ('+v.join(', ')+')').join('\n')}\n\n## Art direction and gameplay scale\nAt full resolution every pixel represents one engine cell. Flight clearance has been tested for complete 19×15, 23×19 and 31×27 axis-aligned envelopes, not Midge-radius point sampling. Local inspection booths, hoist rungs and openings were built at readable game scale. No three-quarter views or platform top faces; equipment is side-elevation physical cross-section. The crane assembly is **static at authored start**, not an animated crane actor.\n\n## Engine contract and limits\nAccepted authority: techrote/cybersand main \`de109d0131641d6adc8d25bb9ced7ca3d4991105\` (19 Nov 2026). The Workbench Setup-v2 parser accepts extent sides 512–2048, divisible by 64; max 32,768 starting edits, 1 MiB JSON, and min(64×cells, 32,000,000) construction work. Installed bridge may still only admit 4,096 edits. Midge record hash is pinned to accepted authoring. No material IDs 10, unstable powders or unsupported pseudos. All non-fluid structural IDs are immobile Solid / RuleKernel::None in accepted material.hpp. Water ID 3 and Lava ID 8 are movable/reactive; both fully embedded in sealed solid enclosures at time zero, isolated from accessible air and each other. These are **initial-state static** containment checks only; heating, pressure and long-term world reaction require native verification.\n\n## Static structural audit / limitations\nThe four-neighbour bottom-grounding audit finds **${support.rooted.toLocaleString()} rooted of ${support.total.toLocaleString()} inert solid cells; ${support.detached.toLocaleString()} remain disconnected**. Residual detached solids are documented as non-load-bearing apparatus; load-bearing press frames, operator cubicles and exposed hoist rail now have deliberate supporting members; they remain explicit engineering/art review findings rather than disguised as physically load-bearing. The realistic installed-bridge fallback is 4,096 records; this build currently produces ${edits.length} records, but installed bridge still must be inspected. A filled 50×60-cell obstruction at (1025,490) preserves ${diversion.reachable}/${diversion.total} named sites under the full 31×27 envelope.\n\nNATIVE-UNTESTED: no installed Godot / CyberDemoBridge / Rapier import, sustained physics tick, actual Midge control/collision, active material reactions, performance or fresh-process save/reopen acceptance. Only static geometric reachability, source-schema budgets, deterministic full-plane replay and exact material-index PNG parity are claimed. Independent art/technical/Shepherd reviewers decide whether the map meets owner quality.\n`;
const receipt={schema:1,concept:'the-long-pour-steelworks',seed:SEED,extent:[W,H],engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',material_plane_sha256:sha(g),setup_sha256:sha(json),json_bytes:json.length,rectangle_count:edits.length,rectangle_budget:32768,bridge_fallback:4096,construction_work:work,construction_work_budget:32000000,materials:hist,static_support:support,static_exact_flight:f,main_throat_blockage:{rectangle:[1025,490,50,60],surviving:diversion.reachable,total:diversion.total},pngs:Object.fromEntries(Object.entries(pngs).map(([k,v])=>[k,{bytes:v.length,sha256:sha(v),viewport:k==='overview.png'?[0,0,W,H]:SECTIONS[k.replace('.png','')]}])),native:'NATIVE-UNTESTED'};
write('setup.json',json);for(const [k,v] of Object.entries(pngs))write(k,v);write('receipt.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));write('README.md',Buffer.from(doc));
console.log(JSON.stringify({seed:SEED,json:json.length,rectangles:edits.length,work,rooted:support,flight:f.map(x=>[x.envelope,x.reachable,x.total]),diversion:[diversion.reachable,diversion.total],pngs:Object.keys(pngs)},null,2));
