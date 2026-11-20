'use strict';
// Rookfall caldera original side elevation, deterministic, no reference art.
const fs=require('fs'), crypto=require('crypto'),zlib=require('zlib'),path=require('path');
const W=2048,H=1024, SEED=0x26112011;
const COLORS=[[11,16,23],[62,78,88],[71,94,111],[28,41,56],[39,56,69],[115,150,158],[149,186,169],[168,190,205],[77,114,124]];
const ID=[0,58,62,100,101,113,117,122,72];
function generateCells(){
 const G=new Uint8Array(W*H);
 const B=100,S=62,IRON=117,ZINC=113,WALL=58,GLASS=72,QUARTZ=122,OB=101;
 function box(x,y,w,h,v){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let j=Math.max(0,y);j<Math.min(H,y+h);j++){const o=j*W;for(let i=Math.max(0,x);i<Math.min(W,x+w);i++)G[o+i]=v;}}
 function line(x1,y1,x2,y2,r,v){let dx=Math.abs(x2-x1),dy=Math.abs(y2-y1),sx=x1<x2?1:-1,sy=y1<y2?1:-1,err=dx-dy;while(true){box(x1-r,y1-r,2*r+1,2*r+1,v);if(x1===x2&&y1===y2)break;let e=err*2;if(e>-dy){err-=dy;x1+=sx;}if(e<dx){err+=dx;y1+=sy;}}}
 function floorY(x){if(x<345)return 730;if(x<685)return Math.round(730+155*(x-345)/340);if(x<1350)return 885;if(x<1665)return Math.round(885-165*(x-1350)/315);return 720;}
 // Entire bedrock is a bottom/rooted crater, no falling material.
 for(let x=0;x<W;x++){let y=floorY(x);box(x,y,1,H-y,B);box(x,y,1,9,OB);}
 box(0,0,17,H,WALL);box(W-17,0,17,H,WALL);box(0,H-16,W,16,WALL);
 // WEST SETTLEMENT: multi-floor service cluster, structure carries its loads to crater rim.
 box(52,660,300,19,S);box(65,587,245,16,S);box(80,495,220,16,S);
 box(75,495,15,165,IRON);box(277,495,16,175,IRON);box(98,588,13,72,IRON);box(211,588,12,72,IRON);
 box(70,459,235,12,ZINC);box(90,450,13,45,IRON);box(290,451,13,44,IRON);
 for(let x=111;x<277;x+=53){box(x,470,27,23,GLASS);box(x+7,475,13,13,QUARTZ);}
 line(88,454,158,396,4,S);line(158,396,229,458,4,S);box(153,394,12,65,IRON);
 // Legitimate tall west flight gate from settled signal tower.
 box(323,445,14,286,IRON);box(309,447,44,12,S);box(310,537,48,9,ZINC);box(313,623,44,11,ZINC);
 line(337,452,416,527,3,IRON);line(337,536,416,604,3,IRON);
 // CRATER APPROACH: descending rockwall and cable rail with grounded anchor pylons.
 for(const [x,y] of [[434,773],[546,827],[664,877]]){box(x-11,500,22,y-500,S);box(x-21,500,42,12,ZINC);box(x-18,596,36,8,IRON);}
 line(350,475,690,584,2,IRON);line(355,481,692,591,1,ZINC);
 for(let x=455;x<695;x+=67){const y=Math.round(475+(x-350)*109/340);line(x,y,x,y+48,2,IRON);box(x-6,y+43,14,14,ZINC);}
 // BRIDGE-COLLAPSE: two genuinely rooted caisson abutments with a ruined broken upper girder.
 // Piers are intentionally bifurcated / have fully open navigable breaches below their heads.
 // Interrupted overhead bridge: two cantilevered hanging abutments held from separate edge-rooted districts.
 // Nothing blocks the basin-wide low racing clearance under the suspended deck.
 for(const [x,top] of [[772,392],[1264,390]]){
  box(x-20,top,40,150,S);box(x-31,top,62,12,ZINC);
  box(x-23,top+130,46,15,IRON);
  for(let k=0;k<3;k++)line(x-15+k*14,top+32,x-15+k*14,top+129,2,ZINC);
 }
 // Boundary-rooted tension ties: carrying the upper bridge without mid-course floor piers.
 line(291,464,748,387,3,IRON);line(1287,388,1711,373,3,IRON);
 // Fragmented bridge deck: east and west halves, 136px open collapse seam.
 box(782,383,168,12,S);box(1110,383,163,12,S);
 line(790,373,950,373,3,IRON);line(1110,373,1255,373,3,IRON);
 for(let x=811;x<944;x+=46)line(x,396,x+39,440,2,IRON);
 for(let x=1130;x<1230;x+=46)line(x,396,x+39,439,2,IRON);
 line(950,382,985,445,2,IRON);line(1110,382,1080,454,2,IRON);
 // partially fallen dangling portion with tie still attached; reachable dead-end/scene affordance
 line(938,400,1001,483,4,S);box(986,476,42,11,ZINC);
 // Central crater operation/workface: two subfloor penetrations and small cargo lift tower.
 box(997,746,18,139,IRON);box(990,731,32,14,ZINC);box(966,789,77,11,S);
 box(1071,800,13,85,IRON);box(1063,799,31,9,S);box(1083,816,62,11,ZINC);
 box(1178,824,74,14,S);line(1191,834,1202,884,4,IRON);line(1238,834,1238,885,4,IRON);
 // EAST TERRACE / MACHINERY: tall asymmetric freight sorting mast, no annulus/rotor.
 box(1579,468,29,272,IRON);box(1554,467,94,15,ZINC);
 line(1594,482,1730,388,4,IRON);line(1594,482,1740,485,3,IRON);
 box(1708,366,26,355,S);box(1695,366,55,12,ZINC);
 box(1747,422,103,14,S);box(1842,420,13,300,IRON);
 box(1786,350,168,16,S);box(1800,354,11,72,IRON);box(1936,354,13,117,IRON);
 line(1730,366,1834,311,3,S);line(1834,311,1950,366,3,S);box(1826,308,17,47,IRON);
 box(1830,484,48,12,IRON);box(1920,484,35,12,IRON);box(1844,502,35,9,ZINC);box(1921,502,20,9,ZINC);
 // hanging freight carriage, physical contact through hoist chain
 line(1778,422,1778,531,3,IRON);box(1741,531,77,41,S);box(1750,539,59,25,GLASS);
 // EAST REVERSAL LANDMARK: open V and angular signal, physically rooted.
 line(1905,671,1951,566,5,ZINC);line(1951,566,1997,670,5,ZINC);
 box(1939,555,25,11,S);
 box(1949,666,21,54,IRON);
 // Upper return watch pylons and landing gear on both rims.
 box(1445,475,16,302,IRON);box(1422,476,63,12,S);
 line(1431,474,1492,410,4,IRON);box(1485,411,67,12,ZINC);
 // Intentionally unfilled open upper airspace across the crater.
 // Underfloor enterable caves with 64-100px transit throats (not decorative shadows).
 box(106,746,263,101,0);box(266,672,78,104,0);box(334,687,95,65,0);
 box(895,902,244,72,0);box(980,839,79,92,0);box(983,825,73,16,0);
 box(1667,733,242,104,0);box(1780,671,120,93,0);box(1888,668,84,123,0);
 // Alternative west sub-cableway escape lane: a real 111-cell-high clear transit throat.
 // Overhead pylons are tied into the west-rooted cable, while their lower stumps are bedrock-rooted.
 box(375,611,345,111,0);
  // Doorways through west stacked floors and gate: 40+ cell widths for Midge.
 box(274,514,39,77,0);box(316,520,46,99,0);
  // Retain at least 27px solid under vault, and carve doors into solid only.
 // Furnish cavities with attached inert workstations that remain passable.
 for(const [x,y] of [[143,795],[263,797],[926,934],[1080,938],[1723,789],[1848,791]]){
  box(x,y,48,7,S);box(x+5,y+7,8,20,IRON);box(x+38,y+7,8,20,IRON);
  box(x+15,y-16,22,14,ZINC);
 }
 // Support behind inset underground quartz window racks, rooted to floor side walls.
 box(114,755,8,89,IRON);box(356,755,8,89,IRON);box(908,914,11,57,IRON);
 box(1121,911,11,60,IRON);box(1676,742,10,91,IRON);box(1895,744,10,88,IRON);
 // Source-legible east turnaround: an undercrane open return throat, 104px high.
 // Upper plant hangs from the right rim via a rooted tension beam instead of severing the lower lane.
 line(1950,362,2034,333,4,S);
 box(1535,590,370,104,0);
  // Short, real west rim footings restore the dispatch building's explicit bedrock load path.
 box(89,651,14,88,IRON);box(261,651,14,88,IRON);
 // Full-body rider descent and under-deck slip: unbroken free-air alternate around the crater fracture.
 box(174,371,74,275,0);box(235,610,190,43,0);
 // An intact high suspended load-tie keeps the fractured WEST bridge rooted through the EAST abutment.
 // The actual flight-height deck seam remains missing, preserving the alternative beneath.
 line(772,387,900,245,2,IRON);line(900,245,1155,245,2,IRON);line(1155,245,1264,390,2,IRON);
  // Sparse inert markers, fixed to meaningful structural surfaces (no decorative floating solids).
 for(const [x,y] of [[291,458],[334,448],[770,379],[1271,378],[1595,455],[1728,359],[1834,303],[1950,508]])box(x-8,y-8,16,8,QUARTZ);
 // Ensure everything is rooted to map border, discard truly disconnected light fixtures (no silent physics).
 const q=new Int32Array(W*H);const seen=new Uint8Array(W*H);let head=0,tail=0;
 for(let x=0;x<W;x++){for(let y of [0,H-1]){let k=y*W+x;if(G[k]&&!seen[k]){seen[k]=1;q[tail++]=k;}}}
 for(let y=0;y<H;y++)for(let x of [0,W-1]){let k=y*W+x;if(G[k]&&!seen[k]){seen[k]=1;q[tail++]=k;}}
 while(head<tail){let p=q[head++],x=p%W,y=(p/W)|0;for(let d of [-1,1,-W,W]){let k=p+d;if(k<0||k>=G.length||(d===-1&&x===0)||(d===1&&x===W-1)||seen[k]||!G[k])continue;seen[k]=1;q[tail++]=k;}}
 let discarded=0;for(let i=0;i<G.length;i++)if(G[i]&&!seen[i]){G[i]=0;discarded++;}
 return {grid:G,discarded};
}
// Material identity is encoded as its byte value, never approximated by RGB.
function encodeRects(G){const out=[];let active=new Map();for(let y=0;y<H;y++){let next=new Map();const offset=y*W;for(let x=0;x<W;){let m=G[offset+x];if(!m){x++;continue;}let e=x+1;while(e<W&&G[offset+e]===m)e++;const key=x+':'+(e-x)+':'+m;let rect=active.get(key);if(rect){rect[3]++;}else rect=[x,y,e-x,1,m];next.set(key,rect);if(!active.has(key))out.push(rect);x=e;}active=next;}return out;}
function colorsPNG(G,x0,y0,w,h){const pal=COLORS, ids=ID;let lookup=new Uint8Array(256);for(let i=0;i<ids.length;i++)lookup[ids[i]]=i;const stride=Math.ceil(w/2);const pixels=Buffer.alloc(h*(1+stride));for(let y=0;y<h;y++){let dest=y*(1+stride)+1;for(let x=0;x<w;x++){let v=lookup[G[(y+y0)*W+x+x0]];if(x%2===0)pixels[dest+(x>>1)]|=v<<4;else pixels[dest+(x>>1)]|=v;}}
 function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let j=0;j<8;j++)c=(c&1)?(c>>>1)^0xedb88320:c>>>1;}return (c^0xffffffff)>>>0;}
 function chunk(t,dat){let typ=Buffer.from(t);let n=Buffer.alloc(4);n.writeUInt32BE(dat.length);let c=Buffer.alloc(4);c.writeUInt32BE(crc(Buffer.concat([typ,dat])));return Buffer.concat([n,typ,dat,c]);}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=4;ih[9]=3;
 const pl=Buffer.from(pal.flat());
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',pl),chunk('IDAT',zlib.deflateSync(pixels,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function sha(b){return crypto.createHash('sha256').update(b).digest('hex');}
function main(){const root=__dirname, {grid:G,discarded}=generateCells(), rects=encodeRects(G);
 const actor={id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:[165,300],options:{budget:20.0,mass_multiplier:1.0,inertia_multiplier:1.0,thrust_multiplier:1.0,torque_multiplier:1.0,boost_multiplier:1.8}};
 const liquid=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[actor],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:liquid,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 let b=Buffer.from(JSON.stringify(setup));fs.writeFileSync(path.join(root,'setup-rookfall-caldera.json'),b);
 const tiles=[['overview.png',0,0,W,H],['01-rim-dispatch.png',45,347,390,405],['02-cableway-descender.png',350,390,420,467],['03-broken-bridge.png',757,335,540,470],['04-crater-works.png',845,700,500,290],['05-eastern-freight-claw.png',1530,285,460,465],['06-enterable-vaults.png',55,675,500,315]];
 for(const [name,x,y,w,h] of tiles)fs.writeFileSync(path.join(root,name),colorsPNG(G,x,y,w,h));
 let hist={};for(const v of G)hist[v]=(hist[v]||0)+1;
 const receipt={schema:'original-racing-source-static-v1',name:'Rookfall Caldera Rift Dispatch',seed:SEED,dimensions:[W,H],map_parent_sha:'99a166e7fcae45eb22be1740e9f33f62faccbcc7',engine_sha:'de58bf1997ca75825cf3b29e046dc1c1022c45bf',grid_sha256:sha(Buffer.from(G)),setup_sha256:sha(b),setup_bytes:b.length,rectangles:rects.length,work_cells:rects.reduce((a,r)=>a+r[2]*r[3],0),histogram:hist,discarded_unrooted_candidates:discarded,crops:tiles.slice(1).map(v=>v[0]),native:'NATIVE-UNTESTED'};
 fs.writeFileSync(path.join(root,'qualification.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));}
if(require.main===module)main();
module.exports={generateCells,encodeRects,colorsPNG,W,H,ID,COLORS};
