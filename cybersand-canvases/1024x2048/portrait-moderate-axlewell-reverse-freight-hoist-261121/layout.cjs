'use strict';
// PORTRAIT-001 Creator B / MODERATE. NEW geometric composition, no source-pixel
// transplant. Anchored side-elevation of a descending east-arrival freight chain.
function layoutWorld(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211321;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"steel-pipe",69:"copper-pipe",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"shield"};
 const b=(x,y,w,h,m)=>{[x,y,w,h]=[x,y,w,h].map(Math.round);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let y0=y;y0<y+h;y0++)g.fill(m,y0*W+x,y0*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{const n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){const u=i/n;b(x+(X-x)*u-t/2,y+(Y-y)*u-t/2,t,t,m);}};
 const sites=[
 ["East ship entry",762,140],["Upper ship cargo",749,280],["Crane service watch",694,400],
 ["West customs terrace",253,470],["Hoist crown",505,555],["Dock trade ledger",791,592],
 ["Hoist transfer",525,806],["Upper west rail",253,800],["East side return high",791,918],
 ["Interlock upper",522,938],["Interlock lower",522,1160],
 ["West classifier one",251,1236],["Right mechanical return",785,1250],
 ["West classifier two",258,1470],["East counterweight pit",778,1505],
 ["Lower hoist inspection",529,1570],["West classifier three",261,1768],
 ["Worker relay",795,1779],["West export goal",246,1878],["Deep rock service",530,1868]
 ].map(([name,x,y])=>({name,x,y}));
 // Grounded geological opposing piers. Central skyway fully open.
 b(0,0,112,1940,100);b(903,0,121,1940,100);b(0,1940,W,108,100);
 b(0,0,112,52,58);b(903,0,121,52,58);
 // High dock: recognisable side-elevation freighter with separated tall ship crane.
 b(636,353,267,19,117);b(646,353,15,42,117);
 b(659,342,211,11,62);b(661,332,186,13,65);
 l(643,346,688,405,9,117);l(688,405,871,405,12,117);l(871,405,902,360,11,117);
 b(710,265,117,64,65);b(728,274,81,36,104);
 for(let i=0;i<3;i++)b(737+25*i,283,16,17,131);
 b(825,312,64,17,65);b(838,317,39,10,131);
 b(684,367,9,41,68);b(781,369,9,39,68);
 // Separate crane and freighter: overhead counterweight tied to east cliff.
 b(899,115,13,205,58);b(604,127,302,13,117);
 l(636,145,891,115,8,68);l(704,126,899,244,9,68);
 b(622,139,11,179,69);b(616,300,26,13,79);
 b(847,149,38,25,65);b(856,155,20,10,131);
 b(820,163,12,134,68);
 // Separate cargo customs ledge, rock-founded.
 b(108,482,296,14,58);b(136,462,107,20,62);
 b(151,434,65,28,65);b(163,442,44,13,131);
 b(315,461,57,21,104);b(328,469,33,10,131);
 b(127,496,12,58,68);
 // Transfer platform around central multi-level hoist; unequal hanging beams.
 b(110,629,278,16,58);b(137,610,120,19,62);
 b(175,576,78,33,65);b(187,588,54,13,131);
 b(285,600,18,43,68);b(317,615,51,14,117);
 b(643,631,260,16,58);b(749,608,99,23,62);
 b(773,581,49,25,104);b(784,589,27,12,131);
 // Hoist crown rotor; open-sided containment ensures Midge navigation.
 const ring=(cx,cy,r,t,mat)=>{const pts=[];for(let j=0;j<8;j++){const u=2*Math.PI*j/8;pts.push([cx+Math.cos(u)*r,cy+Math.sin(u)*r]);}for(let j=0;j<8;j++){let a=pts[j],c=pts[(j+1)%8];l(a[0],a[1],c[0],c[1],t,mat);}};
 ring(527,680,68,11,117);
 b(517,607,17,18,79);b(450,676,19,13,76);b(589,676,12,13,76);
 b(562,609,122,10,68);b(670,609,11,34,68);
 // Side rails at 2 elevations with strong geology/rooted struts.
 b(108,864,310,15,58);b(133,845,112,18,65);
 b(151,851,74,9,131);b(352,849,13,15,68);
 b(665,871,238,15,58);b(761,849,110,22,62);
 b(790,816,48,32,65);b(801,825,26,13,131);
 // Central hoist structural feet only lower down, upper travel unobstructed.
 b(438,1225,18,715,58);b(657,1235,19,705,58);
 b(442,1240,11,66,68);b(661,1244,11,68,68);
 // Intermediate central hanging suspender and short freight transfer.
 b(437,944,200,12,62);b(444,956,13,38,68);b(615,956,13,38,68);
 b(461,920,50,24,65);b(470,929,32,12,131);
 b(582,930,43,15,104);
 // Crucial: leave central open beside the midspan so a material blockade reroutes via right.
 b(108,1050,264,15,58);b(134,1035,109,15,62);
 b(155,1006,50,29,65);b(163,1013,34,14,131);
 b(770,1062,133,13,58);b(814,1039,76,23,65);
 b(825,1046,49,13,131);
 b(785,1095,18,75,68);b(865,1095,12,94,69);
 // West three unequal descending classification terraces.
 for(const [x,y,w,h]of[[110,1294,310,73],[110,1530,300,81],[110,1798,313,88]]){
  b(x,y,w,16,58);b(x+16,y-24,w-52,24,62);
  b(x+26,y-58,86,34,65);b(x+36,y-51,65,15,131);
  b(x+142,y-42,48,18,104);b(x+150,y-35,32,9,131);
  b(x+21,y+16,14,h,68);b(x+w-26,y+16,12,h,68);
 }
 // Three distinct sloped cargo ramps as real side-view beams, separated in height.
 l(390,1340,459,1281,10,117);l(377,1595,451,1515,11,117);
 // Third rail ramp intentionally removed to allow lower full-hull exit.
 // East counterweight/recovery side corridor, cliff-supported and entered.
 b(752,1279,151,14,58);b(839,1261,52,18,65);
 b(850,1267,29,11,131);b(882,1293,15,66,68);
 b(734,1515,169,15,58);b(765,1494,112,21,62);
 b(783,1467,59,26,104);b(795,1473,34,13,131);
 b(876,1530,12,52,68);
 b(750,1815,153,15,58);b(795,1797,76,18,62);
 b(821,1770,40,26,65);b(830,1777,25,13,131);
 // Multi-level portal mast signalling; grounded on existing lower piers.
 b(439,1340,214,13,58);b(444,1375,210,11,62);
 b(477,1350,12,100,68);b(630,1360,12,90,68);
 b(442,1650,212,14,58);b(460,1631,91,19,62);
 b(474,1613,59,15,65);b(485,1618,34,8,131);
 b(507,1664,12,100,68);b(636,1664,12,100,68);
 // Very deep service maintenance aperture, entirely grounded, intentionally empty.
 b(435,1903,242,16,58);b(448,1919,12,21,58);
 b(649,1919,12,21,58);
 // Sparse short electrical conduits rooted in side rock.
 for(let y=400;y<=1820;y+=167){b(105,y,16,57,69);b(110,y+4,17,8,79);b(896,y+60,19,48,68);b(884,y+62,18,9,76);}
 
// Actual entered lower 31x27 ship-to-rail passages, rather than visual-only links.
b(490,1321,101,101,0);b(419,1431,57,128,0);
b(618,1461,74,129,0);b(489,1630,102,73,0);
b(418,1690,66,228,0);
// Exact authored site envelopes: no nearest-site shifting or collision waivers.
 for(const p of sites)b(p.x-19,p.y-17,39,35,0);
 // Delete inert fragments without a rooted 4-neighbour load path; report removed count.
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);
 let at=0,tail=0;
 const add=i=>{if(solid(g[i])&&!seen[i]){seen[i]=1;q[tail++]=i;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(at<tail){let i=q[at++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
 return{W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
}
if(typeof module!=="undefined")module.exports={layoutWorld};
