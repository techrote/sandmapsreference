'use strict';
// ORIGINAL-NO-SOURCE industrial foundry. Pure material-plane authoring; no external artwork.
// Source engine: techrote/cybersand main de109d0131641d6adc8d25bb9ced7ca3d4991105.
// The site list is exact and must never be snapped to a nearest accessible point.
function build(){
const W=2048,H=1024,SEED=26111947,g=new Uint8Array(W*H);
const M={air:0,water:3,lava:8,brick:57,concrete:58,steel:62,paint:63,rust:65,grate:66,pipe:68,copper:69,glass:72,hazard:76,cyan:77,amber:79,white:80,basalt:100,firebrick:104,iron:117,shield:131};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error('Bounds '+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w)}
function L(x,y,X,Y,t,m){let n=Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y)));for(let i=0;i<=n;i++)R(Math.round(x+(X-x)*i/n),Math.round(y+(Y-y)*i/n),t,t,m)}
function F(x,y,w,h,t,m){R(x,y,w,t,m);R(x,y+h-t,w,t,m);R(x,y,t,h,m);R(x+w-t,y,t,h,m)}
// One fully excavated underground air route plus five playable access shafts.
R(0,754,W,270,M.basalt);R(0,992,W,32,M.concrete);
R(45,806,1957,172,M.air);R(42,802,1960,8,M.steel);
for(const [x,w] of [[135,96],[500,90],[910,90],[1460,92],[1880,88]])R(x,656,w,247,M.air);
R(40,709,1966,35,M.concrete);
for(const [x,w] of [[135,96],[500,90],[910,90],[1460,92],[1880,88]])R(x,689,w,216,M.air);
for(const x of [74,340,438,675,843,1090,1300,1605,1750,1982]){R(x,742,15,62,M.steel);R(x-9,782,33,18,M.concrete)}
R(45,978,1957,14,M.steel);
for(let x=76;x<1980;x+=157){R(x,979,54,6,M.rust);R(x+12,972,19,6,M.grate)}
// Layered, asymmetrical roof truss with grounded sidewall reactions.
R(29,116,1990,15,M.steel);R(29,173,1990,7,M.rust);
R(28,116,15,880,M.steel);R(2005,116,15,880,M.steel);
for(const [x,b] of [[50,180],[242,137],[404,203],[624,154],[805,205],[1046,162],[1224,190],[1433,188],[1643,183],[1846,147]]){
L(x,131,x+b,173,4,M.steel);L(x+b,131,x,173,3,M.rust)}
for(const x of [444,818,1110,1688]){R(x,179,15,85,M.steel);R(x-8,260,31,8,M.rust)}
for(const [x,w] of [[72,274],[403,393],[841,362],[1242,421],[1686,308]]){R(x,684,w,13,M.steel);R(x,697,w,5,M.grate)}
for(const x of [90,325,429,778,856,1190,1260,1650,1709,1982]){R(x,700,17,68,M.rust);R(x-4,754,24,9,M.steel)}
// Intake cyclone, asymmetric freight/charge dock, two open crew portals.
R(106,375,14,311,M.steel);R(338,392,14,294,M.rust);
R(108,374,236,12,M.steel);R(111,443,191,12,M.rust);
F(154,474,123,154,9,M.rust);R(166,490,99,49,M.glass);R(169,547,94,9,M.grate);
R(205,611,12,55,M.air);R(262,599,15,60,M.air);
R(116,390,182,10,M.grate);R(138,407,140,8,M.hazard);
R(195,282,63,86,M.iron);R(201,289,51,64,M.brick);R(195,280,63,9,M.steel);
R(223,193,14,89,M.pipe);R(222,174,17,25,M.steel);
L(272,434,421,514,10,M.rust);L(267,427,418,506,5,M.steel);
for(let i=0;i<7;i++)R(284+i*20,445+Math.round(i*10.5),9,9,M.grate);
for(const [x,y,w] of [[93,637,111],[239,635,83]]){R(x,y,w,9,M.grate);R(x+8,y-13,w-15,7,M.steel)}
R(305,535,44,18,M.pipe);R(311,553,32,22,M.iron);
// Three nonidentical sealed induction furnaces, individually grounded to the deck.
for(const [x,y,w,h] of [[453,410,112,264],[595,344,118,330],[736,465,86,209]]){
R(x,y,w,h,M.brick);R(x+8,y+11,w-16,h-22,M.firebrick);
R(x+18,y+38,w-36,h-76,M.shield);R(x+27,y+53,w-54,h-109,M.lava);
R(x+15,y+19,w-30,13,M.rust);R(x+5,y+h-25,w-10,12,M.steel);
for(let yy=y+45;yy<y+h-42;yy+=35){R(x-9,yy,w+18,6,M.copper);R(x-5,yy+8,5,9,M.hazard)}
R(x+19,y-42,w-38,42,M.steel);R(x+27,y-58,w-54,16,M.rust);
R(x+35,y+h-1,15,17,M.steel)}
R(489,258,34,152,M.shield);R(629,237,32,107,M.rust);R(765,276,26,189,M.pipe);
R(422,316,390,11,M.grate);R(436,311,16,16,M.steel);R(785,311,18,15,M.steel);
for(let x=451;x<780;x+=53){R(x,300,9,16,M.steel);R(x+9,302,13,3,M.hazard)}
R(812,576,42,23,M.pipe);R(810,599,48,27,M.rust);R(834,621,38,15,M.steel);
R(555,649,42,12,M.steel);R(694,644,36,12,M.steel);
for(const x of [565,705,800])R(x,661,9,24,M.rust);
// Industrial vacuum jaw: a substantial dry operator cavity and suspended handled charge.
R(895,386,25,286,M.steel);R(1145,374,25,298,M.steel);
R(895,375,275,16,M.steel);R(918,395,7,122,M.rust);R(1142,395,7,131,M.rust);
R(936,399,187,10,M.glass);
for(const [x,w] of [[941,28],[995,32],[1053,32]]){R(x,285,w,19,M.steel);R(x+10,304,w-20,76,M.rust)}
R(921,248,224,12,M.steel);R(945,257,177,12,M.hazard);
R(978,267,9,114,M.copper);R(1082,267,9,116,M.copper);
R(963,481,137,11,M.steel);R(975,492,114,63,M.brick);
R(990,505,85,38,M.firebrick);R(1001,511,64,24,M.amber);R(989,555,83,13,M.rust);
R(919,610,222,12,M.steel);R(919,634,222,7,M.grate);
R(895,542,25,81,M.air);R(1145,542,25,81,M.air);
F(849,531,46,123,7,M.rust);R(849,580,8,62,M.air);R(887,589,8,53,M.air);
F(1171,539,57,119,8,M.steel);R(1171,592,9,58,M.air);R(1219,590,9,60,M.air);
R(1185,550,27,8,M.cyan);R(895,668,25,25,M.steel);R(1145,668,25,25,M.steel);
// Staggered drawing line: four unequal press stations over a red hot billet.
R(1248,629,421,18,M.rust);R(1254,615,408,11,M.steel);
R(1267,598,377,7,M.iron);R(1280,589,337,5,M.amber);
for(let x=1261;x<=1640;x+=35){R(x,621,15,16,M.grate);R(x+2,611,9,11,M.steel)}
for(const [x,y,w,h] of [[1272,510,57,81],[1374,484,66,103],[1500,492,61,93],[1593,524,43,60]]){
R(x,y,w,h,M.steel);R(x+9,y+9,w-18,h-21,M.glass);
R(x+11,y+h-12,w-22,6,M.hazard);R(x+4,y-9,w-8,10,M.rust);
R(x+Math.floor(w/2)-5,y+h,10,615-y-h,M.steel)}
R(1341,435,12,178,M.pipe);R(1516,408,13,83,M.steel);
R(1283,407,357,10,M.grate);
for(let x=1320;x<1625;x+=80){R(x,397,6,10,M.cyan);R(x+1,381,4,16,M.pipe)}
F(1284,532,75,114,7,M.rust);R(1284,576,8,57,M.air);R(1300,548,43,12,M.glass);
F(1560,530,93,117,7,M.steel);R(1644,574,9,61,M.air);R(1574,544,58,8,M.glass);
R(1347,646,10,39,M.steel);R(1630,646,10,39,M.steel);
// Water cassette is deliberately hermetic at cell level; east dispatch is a dry section.
R(1712,535,202,153,M.concrete);R(1720,542,185,135,M.steel);
R(1730,552,165,111,M.water);R(1730,545,165,7,M.cyan);
R(1720,672,185,15,M.concrete);R(1712,687,202,16,M.steel);
R(1693,502,28,199,M.rust);R(1898,473,21,227,M.steel);
R(1744,502,132,12,M.grate);R(1752,490,111,9,M.cyan);
for(let x=1748;x<1880;x+=32){R(x,470,8,22,M.rust);R(x+2,458,4,13,M.hazard)}
R(1891,413,78,11,M.steel);R(1910,423,9,177,M.pipe);
R(1938,449,30,26,M.glass);R(1938,474,9,192,M.steel);
R(1890,630,92,15,M.rust);R(1905,649,64,7,M.grate);
R(1887,670,106,8,M.steel);R(1892,685,91,10,M.grate);
// Subgrade pressure-control stations are physically supported by the bedrock.
for(const [x,w] of [[70,116],[353,133],[765,112],[1230,147],[1690,137]]){
R(x,913,w,8,M.concrete);R(x+4,921,w-8,42,M.rust);
R(x+10,925,w-20,21,M.glass);R(x+13,951,w-26,6,M.cyan);R(x,960,w,18,M.steel)}
R(580,928,130,7,M.pipe);R(583,935,9,43,M.copper);
R(1110,927,72,10,M.grate);R(1120,938,15,40,M.steel);
R(1481,923,105,9,M.rust);R(1492,936,8,42,M.copper);
// Finish playable open access shafts *after* all art and landform passes.
for(const [x,w] of [[135,96],[500,90],[910,90],[1460,92],[1880,88]]){
R(x,689,w,116,M.air);R(x-10,792,9,17,M.hazard);R(x+w+1,792,9,17,M.hazard)}
// Positive, explicit door construction; no dynamic clearance waiver.
R(106,528,14,107,M.air);R(154,565,9,61,M.air);
R(268,562,9,66,M.air);R(338,530,14,120,M.air);
// Physical hanging clamps and suspended optics tie to rooted crane or deck.
R(940,386,15,13,M.steel);R(1085,386,15,13,M.steel);
R(963,468,10,23,M.steel);R(1080,468,10,25,M.steel);

// Explicit full-body upper crane-flight axis and navigable deep alternate transport.
R(55,208,1940,70,M.air);
for(const [x,w] of [[135,96],[500,90],[910,90],[1460,92],[1880,88]])R(x,689,w,171,M.air);
R(141,590,85,109,M.air);R(1421,388,65,40,M.air);R(1145,423,26,95,M.air);
R(380,489,58,70,M.air);
// Load paths and floor-supported service components, evaluated by exact-cell flood.
R(317,384,13,301,M.steel);R(160,384,10,91,M.steel);
R(210,481,9,13,M.glass);R(230,539,10,12,M.glass);
R(139,398,8,16,M.rust);R(309,566,16,119,M.steel);
R(278,643,11,42,M.steel);R(126,631,10,54,M.rust);
R(940,609,12,79,M.steel);R(1100,609,12,79,M.steel);
R(978,376,9,109,M.copper);R(1082,376,9,109,M.copper);
R(1751,488,10,48,M.steel);R(1821,488,10,48,M.steel);
R(1492,928,8,50,M.copper);R(1120,932,15,46,M.steel);
R(1187,653,12,38,M.steel);
R(210,362,12,24,M.steel);R(1341,410,12,28,M.steel);
R(115,630,70,8,M.steel);R(857,633,11,53,M.steel);
R(1824,488,57,8,M.steel);R(1272,600,8,34,M.steel);
R(1653,622,10,12,M.steel);R(105,629,7,10,M.steel);
R(1481,381,4,7,M.air);
// A whole-hull vacuum throat rather than a nominally open but impassable slot.
R(1125,533,87,93,M.air);
// Floating remnant of the removed right hatch is physically removed.
R(1212,539,16,52,M.air);

const sites=[
['West freight spawn',68,495],['Ore cyclone inspection',291,312],['Charging aisle',391,562],
['Induction crown',579,258],['Coil yard',837,469],['Vacuum gantry',1044,216],
['Vacuum service port',1155,575],['Rolling control',1445,455],['Caster exit',1675,548],
['Quench overseer',1840,432],['East shipment',1979,570],
['West underdeck',241,850],['Power conduit',696,854],['Vacuum sump',1081,860],
['Return tunnel',1804,851]];
return {g,sites,W,H,SEED,M}}
function rectangles(g,W,H){const out=[];let open=new Map();for(let y=0;y<H;y++){const next=new Map();for(let x=0;x<W;){const m=g[y*W+x];if(!m){x++;continue}let X=x+1;while(X<W&&g[y*W+X]===m)X++;const k=x+':'+X+':'+m,r=open.get(k);if(r){r[3]++;next.set(k,r)}else{const v=[x,y,X-x,1,m];out.push(v);next.set(k,v)}x=X}open=next}return out}
if(typeof module!=='undefined')module.exports={build,rectangles};
