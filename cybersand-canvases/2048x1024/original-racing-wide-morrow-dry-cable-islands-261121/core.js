/* MORROW DRY CABLE ISLANDS: original 2048 x 1024 material-cell authoring program.
 * Pure JS core: no disk/network dependencies; runnable by Node or the GitHub publication executor.
 * SOURCE STATIC only. Never a native flight assertion.
 */
const W=2048,H=1024,SEED=0x4d4f5252;
const AIR=0,WALL=58,CONCRETE=62,BASALT=100,OBSIDIAN=101,ZINC=113,IRON=117,QUARTZ=122,GLASS=72;
const MATERIALS=[AIR,WALL,CONCRETE,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ,GLASS];
const COLORS=[[8,19,31],[78,86,93],[115,121,128],[43,54,64],[27,35,45],[181,168,135],[207,195,155],[246,217,115],[71,141,158]];
const SITES={
 'Launch western quay':[96,276], 'West split lintel':[278,284],
 'Upper cablewest':[464,275], 'Tern anchor crown':[689,251],
 'Open central crossing':[1007,261], 'Cable tail beacon':[1261,275],
 'East worktown approach':[1515,264], 'East horn throat':[1864,286],
 'East lower reversal':[1933,787], 'Return terminal':[1773,780],
 'Lower cistern causeway':[1551,755], 'Basin east overlook':[1280,782],
 'Central undercable traverse':[1051,775], 'Basin west overlook':[791,757],
 'West maintenance return':[547,796], 'West lower quay':[232,776],
 'Finish threshold':[101,795],
 'West signal cockpit':[152,475], 'Quay repair bay':[368,636],
 'Tern cable supervisor':[608,531], 'Tern underside service':[733,656],
 'Central latch inspection':[1167,540],
 'Eastern tram dispatch':[1420,511], 'East inverter galley':[1597,613],
 'Breakwater hoist workshop':[1853,625], 'Basal west repair pocket':[501,947],
 'Basal east repair pocket':[1584,949]
};
const PRIMARY=['Launch western quay','West split lintel','Upper cablewest','Tern anchor crown','Open central crossing','Cable tail beacon','East worktown approach','East horn throat','East lower reversal','Return terminal','Lower cistern causeway','Basin east overlook','Central undercable traverse','Basin west overlook','West maintenance return','West lower quay','Finish threshold'];
const ALTERNATE=['Launch western quay','West split lintel','Upper cablewest','Tern anchor crown','Open central crossing','Cable tail beacon','East worktown approach','East lower reversal','Return terminal','Lower cistern causeway','Basin east overlook','Central undercable traverse','Basin west overlook','West maintenance return','West lower quay','Finish threshold'];
const OBSTRUCTION=[1832,240,75,88], BLOCKED_SITE='East horn throat';
const CROP=[['overview.png',0,0,W,H],['01-west-quay.png',20,255,450,680],['02-tern-cable-anchor.png',410,205,460,680],['03-cistern-basin-bridge.png',775,230,500,690],['04-east-worktown.png',1300,280,435,675],['05-catcher-horn.png',1700,280,335,675],['06-lower-underworks.png',500,735,1040,284]];
function makeGrid(){
 const g=new Uint8Array(W*H);
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const x0=Math.max(0,x),x1=Math.min(W,x+w),y0=Math.max(0,y),y1=Math.min(H,y+h);if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1)}
 function line(x0,y0,x1,y1,r,m){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;while(1){rect(x0-r,y0-r,r*2+1,r*2+1,m);if(x0===x1&&y0===y1)break;const t=2*e;if(t>=dy){e+=dy;x0+=sx}if(t<=dx){e+=dx;y0+=sy}}}
 function room(x,y,w,h,m,side){rect(x,y,w,h,m);rect(x+10,y+10,w-20,h-20,AIR);if(side==='top')rect(x+w/2-37,y-1,74,19,AIR);if(side==='left')rect(x-1,y+h/2-35,20,70,AIR);if(side==='right')rect(x+w-19,y+h/2-35,20,70,AIR);if(side==='bottom')rect(x+w/2-37,y+h-18,74,19,AIR)}
 // Geological base has no fluid cells and all upper supports ground on it.
 rect(0,0,15,H,WALL);rect(W-15,0,15,H,WALL);rect(0,917,W,107,BASALT);rect(0,1012,W,12,WALL);
 // Broad dry cistern basin, purposefully left incomplete for manual staged events.
 rect(748,895,560,112,AIR);rect(748,1005,560,19,OBSIDIAN);
 line(747,915,812,973,8,IRON);line(1309,915,1246,975,8,IRON);
 // Three uneven geothermal receiving pockets, physically excavated into bedrock.
 for(const [x,y,w,h] of [[357,922,195,78],[1512,925,200,74],[887,942,187,58]]){
  rect(x,y,w,h,AIR);rect(x+8,y+h-10,w-16,9,CONCRETE);
  rect(x+22,y+h-32,56,10,IRON);rect(x+39,y+h-55,10,23,ZINC);
 }
 // WEST QUAY: heavy split-buttress, asymmetrical relief arch and lived-in repair cells.
 rect(68,580,307,21,CONCRETE);rect(73,585,23,332,IRON);rect(336,583,23,334,IRON);
 line(85,586,204,418,10,IRON);line(348,588,204,418,10,IRON);
 rect(186,397,41,28,ZINC);rect(202,361,10,39,QUARTZ);
 rect(104,710,245,17,OBSIDIAN);line(90,716,72,920,8,IRON);line(355,712,374,920,8,IRON);
 room(101,450,158,111,CONCRETE,'top');rect(128,535,48,9,IRON);rect(136,515,16,22,ZINC);rect(192,485,34,23,GLASS);
 room(279,590,126,103,CONCRETE,'right');rect(300,665,42,8,IRON);rect(309,646,14,18,ZINC);
 // The rail pier and 3-legged offset TERN ANCHOR is a working cable winch, not a repeated tower.
 line(411,627,538,515,7,IRON);line(538,515,635,568,7,IRON);line(634,568,683,915,11,IRON);
 rect(458,581,285,17,CONCRETE);rect(459,581,23,334,IRON);rect(719,583,22,333,IRON);
 line(472,584,597,417,8,IRON);line(597,417,729,584,8,IRON);
 rect(579,384,42,32,ZINC);rect(594,340,13,46,QUARTZ);
 // Boat-shaped winch bridge: upper span is in the island, no scenery-only tops.
 line(370,550,446,558,4,ZINC);line(741,586,836,554,4,ZINC);
 rect(477,716,230,15,IRON);
 room(523,479,149,99,CONCRETE,'right');rect(542,551,41,9,IRON);rect(554,532,14,21,ZINC);rect(613,500,31,22,GLASS);
 room(635,615,150,98,BASALT,'left');rect(654,686,43,8,IRON);rect(669,667,12,20,ZINC);
 // Genuinely spare upper loading pad with future container-crash affordance.
 rect(737,595,123,15,ZINC);line(750,598,735,915,6,IRON);
 // CENTRAL INTERSTICE: large NEGATIVE SPACE, single cantilevered cableway, open beneath.
 // Deck carried to two known island edges by a triangulated suspension truss.
 line(784,460,1007,512,5,ZINC);line(1007,512,1230,471,5,ZINC);
 line(823,489,985,568,4,IRON);line(985,568,1211,490,4,IRON);
 line(852,506,848,632,4,IRON);line(1166,511,1169,641,4,IRON);
 // The suspension cable is attached at both cable ends: not a fake horizontal sky platform.
 line(738,454,1008,353,3,IRON);line(1008,353,1284,448,3,IRON);
 for(const [x,y] of [[828,421],[916,386],[1008,353],[1100,390],[1196,421]])line(x,y,x,y+80,2,IRON);
 // A single entered cable inspection pod; roof-attached, without blocking open air around it.
 room(1066,481,128,108,CONCRETE,'right');rect(1087,560,43,9,IRON);rect(1093,541,13,21,ZINC);
 // Support ties across mid basin: both tied back into permanent basalt.
 line(852,630,800,913,6,IRON);line(1170,641,1220,913,6,IRON);
 // EAST WORKTOWN: terraced modules around asymmetric central switch-house.
 rect(1295,592,335,20,CONCRETE);rect(1320,590,22,326,IRON);rect(1600,590,22,326,IRON);
 line(1331,590,1457,435,9,IRON);line(1457,435,1610,590,9,IRON);
 rect(1437,404,43,34,ZINC);rect(1451,365,14,41,QUARTZ);
 rect(1360,703,263,16,CONCRETE);
 line(1342,719,1390,915,8,IRON);line(1613,718,1651,915,8,IRON);
 room(1351,459,161,113,CONCRETE,'top');rect(1379,542,48,9,IRON);rect(1392,519,13,23,ZINC);rect(1458,483,28,24,GLASS);
 room(1545,575,130,109,CONCRETE,'right');rect(1563,651,38,10,IRON);rect(1576,628,14,24,ZINC);
 // Unused expansion sockets remain deliberately bare along southeast service strip.
 rect(1304,767,171,14,ZINC);rect(1332,780,18,137,IRON);
 line(1475,772,1530,914,7,IRON);
 // EAST CAPTURE: open V arrestor reaches the boundary, with an inner roll-back stage.
 rect(1801,582,158,18,CONCRETE);rect(1810,589,21,328,IRON);rect(1942,588,23,327,IRON);
 line(1819,582,1887,464,9,IRON);line(1887,464,1948,583,9,IRON);
 line(1977,462,2032,365,6,IRON);line(1977,462,2031,557,6,IRON);
 rect(1880,437,24,29,ZINC);rect(1889,410,8,29,QUARTZ);
 room(1790,588,138,109,CONCRETE,'left');rect(1810,670,33,8,IRON);rect(1823,649,12,22,ZINC);
 // Interrupted lower machinery level: 2 different collection bays; connected to supports.
 rect(1790,725,195,17,IRON);line(1804,727,1754,915,7,IRON);
 rect(1897,822,89,15,CONCRETE);line(1975,831,1994,915,6,IRON);
 // Dedicated re-entry ports sized for 31x27 actual clear centres, never pictorial doors.
 // Reopen external side arrivals through otherwise closed cockpit cabins.
 rect(114,438,76,70,AIR);rect(250,491,67,69,AIR);
 rect(550,444,80,83,AIR);rect(642,512,75,64,AIR);
 rect(701,622,74,71,AIR);rect(1128,487,84,73,AIR);
 rect(1380,433,79,77,AIR);rect(1477,496,88,80,AIR);
 rect(1614,594,74,73,AIR);rect(1766,602,90,78,AIR);
 // Two cavern accesses, literal shafts linking surface to underground pockets.
 rect(402,855,79,100,AIR);rect(1570,848,84,110,AIR);
 // Local load bracing at access openings, each stays physically tied to its wall.
 rect(387,901,13,20,IRON);rect(1655,903,12,19,IRON);
 // Two-level flight separation: a full-width UNDER-SLING return-air corridor.
 // Every aerial district is tension-supported by a continuous boundary-rooted
 // cable arch, so cutting open this race band does NOT leave unsupported platforms.
 rect(26,740,1996,108,AIR);
 // Reopen the entered basal maintenance pockets from the low flyway.
 rect(405,842,76,119,AIR); rect(1571,841,78,120,AIR);
 // Structural corrections: mast/cable roots survive the eventual entered-room cuts.
 line(598,390,477,576,5,IRON);
 line(1459,435,1609,585,5,IRON);
 line(347,549,451,560,4,IRON);
 // Flyable 100px relief gates in lower aprons; main load is rerouted through side piers.
 rect(190,696,96,62,AIR);
 rect(547,688,96,62,AIR);
 rect(1468,685,94,69,AIR);
 rect(1835,690,94,69,AIR);
 rect(706,737,78,110,AIR);
 // A hole in the east basin retaining wall offers an upper-lower alternate passage.
 rect(1201,726,80,112,AIR);
 // Suspended archipelago load path: anchors live in actual left/right walls.
 line(13,308,204,418,5,IRON);
 line(204,418,597,417,5,IRON);
 line(597,417,1008,353,5,IRON);
 line(1008,353,1457,435,5,IRON);
 line(1457,435,1887,464,5,IRON);
 line(1887,464,2034,313,5,IRON);
 // Large true entered service shafts: no sealed ornamental interiors.
 rect(575,558,93,196,AIR);
 rect(1393,556,93,194,AIR);
 // The transfer throats are real air gaps in the boundary-tension bridge:
 // they connect the overhead outward racing lane with the undersling return.
 // Their surrounding arch anchors remain rooted on both sides.
 rect(1699,307,88,396,AIR);
 // Omitted detached fixture fragments are not permitted in an active falling-cell world.
 // Deliberately discard only wholly ungrounded chips after hand-authored portal cuts;
 // all whole districts remain attached to bedrock or boundary-tension anchors.
 const mark=new Uint8Array(W*H), stack=new Int32Array(W*H);
 let rooted=0,removed=0,deletedComponents=0;
 for(let start=0;start<g.length;start++){
  if(!g[start]||mark[start])continue;
  let head=0,tail=1;stack[0]=start;mark[start]=1;
  let boundary=false;
  while(head<tail){const at=stack[head++],x=at%W,y=(at/W)|0;
   if(x===0||x===W-1||y===0||y===H-1)boundary=true;
   if(x>0&&g[at-1]&&!mark[at-1]){mark[at-1]=1;stack[tail++]=at-1}
   if(x+1<W&&g[at+1]&&!mark[at+1]){mark[at+1]=1;stack[tail++]=at+1}
   if(y>0&&g[at-W]&&!mark[at-W]){mark[at-W]=1;stack[tail++]=at-W}
   if(y+1<H&&g[at+W]&&!mark[at+W]){mark[at+W]=1;stack[tail++]=at+W}
  }
  if(boundary)rooted+=tail;else {deletedComponents++;removed+=tail;for(let i=0;i<tail;i++)g[stack[i]]=0}
 }
 return g;
}
function encode(g){const out=[];let active=new Map();for(let y=0;y<H;y++){const next=new Map();let x=0;while(x<W){const mat=g[y*W+x],start=x;while(x<W&&g[y*W+x]===mat)x++;if(mat===0)continue;const key=start+','+(x-start)+','+mat;let row=active.get(key);if(row){row[3]++}else{row=[start,y,x-start,1,mat];out.push(row)}next.set(key,row)}active=next}return out}
function makeSetup(g,actorHash,policy){return{version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:actorHash,spawn:SITES['Launch western quay'],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:encode(g),response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false}}
// All exports are explicitly declared for publication executor and Node CLI.
