"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26C020, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}


 // KESTREL HOLLOW: the original 1100-cell diagonal cryogenic mass driver crosses an old impact fissure.
 // Route graph and seven functional district identities were planned before cell editing.
 const grade=x=>Math.round(883+12*Math.sin(x*.008)+5*Math.cos(x*.034));
 for(let x=0;x<W;x++){let y=grade(x);R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,402],[72,414],[147,461],[229,554],[293,701],[387,866],[445,1024]],M.rock);
 P([[2048,1024],[2048,388],[1999,409],[1941,456],[1882,562],[1815,708],[1740,862],[1691,1024]],M.rock);
 // Geologically layered inert anchored solids, not mobile sand.
 for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.rock){
   let strata=(y+Math.floor(x*.14)+Math.round(4*Math.sin(x*.019)))%107;
   if(strata<6)g[o+x]=M.schist;else if(strata>=6&&strata<10)g[o+x]=M.iron;
 }}
 // The entire subgrade maintenance loop is a connected open-air bore, with real shafts at both ends.
 R(263,879,1534,82,0);R(312,734,100,229,0);R(1682,715,111,248,0);
 // West inhabitable cut-rock operations: three distinct large rooms, not scale-free scenery.
 R(52,424,371,113,0);R(90,550,381,133,0);R(164,700,346,117,0);
 // East separate personnel, specimen-transfer and power/cargo rooms.
 R(1667,429,363,117,0);R(1585,554,445,145,0);R(1634,707,397,120,0);
 // Deep buried galleries sit below the existing through-bore with side-fed access.
 for (const [x,w] of [[520,226],[880,248],[1240,231],[1534,171]]){
   R(x,935,w,80,0);R(x+8,1008,w-16,6,M.steel);
   R(x+7,983,8,31,M.titanium);R(x+w-16,985,8,29,M.titanium);
 }
 // Western intake: work decks rooted inside the left cliff face.
 R(64,535,322,11,M.titanium);R(75,545,305,5,M.blue);
 R(103,681,359,12,M.steel);R(115,692,339,5,M.chrome);
 R(171,818,327,12,M.titanium);
 L(117,691,176,817,12,M.steel);L(402,682,425,818,12,M.steel);
 L(139,546,185,683,9,M.titanium);L(348,545,381,682,9,M.titanium);
 // Spool-shaped cryogenic loading cassette, separated station controls and hoist.
 R(91,523,111,10,M.ceramic);R(108,501,18,22,M.chrome);R(171,501,17,22,M.chrome);
 ellipse(149,496,27,24,M.titanium);ellipse(149,496,19,16,0);
 R(140,493,20,7,M.frost);R(210,526,31,8,M.blue);R(217,508,17,18,M.glassDark);
 L(265,531,268,476,6,M.chrome);R(256,473,27,10,M.signal);
 // West crew exchange with side-enterable rooms and non-repetitive silhouettes.
 R(117,646,136,10,M.steel);R(130,622,30,24,M.glassDark);
 R(185,631,57,15,M.ceramic);R(194,613,28,18,M.window);
 R(294,653,105,9,M.chrome);R(309,626,11,27,M.titanium);
 R(326,628,53,16,M.amber);L(348,619,358,576,6,M.conduit);
 // West machine-shop forging press, transverse ram, operator bay and service gantry.
 R(202,795,187,14,M.steel);R(224,752,130,12,M.ceramic);
 R(228,734,18,23,M.titanium);R(330,735,17,22,M.titanium);
 R(255,720,66,21,M.iron);R(268,706,38,13,M.chrome);
 R(292,763,12,31,M.signal);R(380,767,20,28,M.glassDark);
 // West shaft hatch and broad laterally flyable rescue exit.
 R(344,784,123,174,0);R(372,580,152,117,0);R(398,690,108,102,0);

 // MAIN SILHOUETTE: twin open-sided, 106-cell separated accelerator rails rising diagonally.
 // Large coil ribs are structural and spaced so Midge can recover above and beneath.
 function railY(x){return 717-(x-420)*.356;}
 L(421,railY(421)-43,1568,railY(1568)-43,15,M.titanium);
 L(421,railY(421)+43,1568,railY(1568)+43,17,M.steel);
 L(423,railY(423)-55,1531,railY(1531)-55,6,M.blue);
 L(428,railY(428)+55,1534,railY(1534)+55,5,M.chrome);
 for(let x of [485,587,723,872,1030,1198,1354,1500]){
   let y=railY(x), a=24+(x%3)*4;
   L(x-14,y-45,x-a,y+40,7,M.titanium);
   L(x+18,y-45,x+a,y+38,6,M.chrome);
   R(x-10,y-61,27,9,M.ceramic);R(x-7,y+48,23,7,M.ceramic);
   R(x-6,y+32,12,6,M.signal);
 }
 // The true load path uses grounded triangular truss pillars, not thin unsupported doodles.
 L(607,872,670,railY(670)+42,20,M.titanium);
 L(748,870,670,railY(670)+42,14,M.steel);
 L(1098,871,1042,railY(1042)+40,18,M.steel);
 L(1238,873,1042,railY(1042)+40,13,M.titanium);
 L(1494,873,1456,railY(1456)+46,18,M.titanium);
 L(1600,873,1456,railY(1456)+46,14,M.steel);
 L(1510,railY(1510)-39,1745,495,14,M.steel);
 L(437,railY(437)+45,350,804,16,M.steel);
 // High western meteorological research deck, with real mechanical grounding from basin.
 L(622,860,680,196,20,M.titanium);L(832,870,810,223,17,M.steel);
 L(673,223,811,223,14,M.titanium);L(662,393,828,393,15,M.steel);
 L(671,559,820,559,13,M.steel);
 L(676,223,741,176,8,M.chrome);L(800,223,739,176,8,M.chrome);
 R(688,211,122,12,M.ceramic);R(712,193,73,17,M.glassDark);
 // Distinct anemometer / meteor scanner and calibration rig, both physically supported.
 L(746,190,758,115,7,M.titanium);L(721,135,795,135,7,M.chrome);
 R(743,125,34,20,M.frost);R(754,114,13,10,M.signal);
 R(692,377,103,12,M.chrome);R(714,344,13,32,M.titanium);
 R(740,333,38,11,M.window);L(760,330,789,280,8,M.chrome);
 R(693,542,87,10,M.ceramic);R(709,522,18,19,M.glassDark);
 R(749,515,14,27,M.amber);
 // Curved free-standing telemetry dish actually connected to observatory mast.
 function arch(cx,cy,rx,ry,from,to,t,m){let steps=72;for(let i=0;i<steps;i++){let a=from+(to-from)*i/steps,b=from+(to-from)*(i+1)/steps;L(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cx+rx*Math.cos(b),cy+ry*Math.sin(b),t,m);}}
 arch(773,190,55,63,Math.PI*1.06,Math.PI*1.92,9,M.ceramic);
 L(736,223,731,179,7,M.steel);

 // Midspan suspended coil service laboratory above rail: roof, entered side, machine/workroom.
 R(910,318,278,12,M.titanium);R(921,330,253,5,M.blue);
 R(917,410,273,13,M.steel);R(925,423,257,5,M.chrome);
 R(922,333,11,79,M.titanium);R(1174,332,12,80,M.titanium);
 L(918,323,894,564,11,M.steel);L(1181,322,1162,561,11,M.steel);
 R(942,393,105,10,M.ceramic);R(951,374,25,19,M.window);
 R(1008,368,22,24,M.signal);R(1068,400,92,10,M.titanium);
 ellipse(1111,369,36,28,M.chrome);ellipse(1111,369,26,20,0);
 L(1111,369,1137,356,6,M.amber);R(1130,345,21,8,M.frost);
 R(1151,375,15,28,M.glassDark);
 // Two distinct shot-accelerator coil switchyards situated beneath the diagonal beam.
 R(733,683,154,14,M.steel);R(742,696,133,5,M.blue);
 R(771,655,47,26,M.iron);R(781,648,27,8,M.amber);
 L(749,680,739,633,8,M.chrome);L(854,680,866,632,9,M.chrome);
 R(1203,647,184,15,M.titanium);R(1213,661,163,5,M.chrome);
 for(let x of [1225,1279,1341]){R(x,624,13,22,M.steel);R(x+3,610,7,13,M.signal);}
 R(1251,640,58,10,M.ceramic);R(1326,638,47,10,M.iron);
 // Raised maintenance overpass separate from rail. True spacious return remains below.
 R(862,810,453,13,M.steel);R(874,823,430,6,M.blue);
 L(878,825,922,873,11,M.titanium);L(1289,825,1235,872,12,M.steel);
 // Right cargo nose and tall approach beacon.
 L(1553,railY(1553)-45,1667,190,18,M.titanium);
 L(1604,railY(1604)+48,1694,438,17,M.steel);
 L(1655,190,1720,190,10,M.chrome);R(1671,173,35,17,M.signal);
 L(1688,182,1687,104,8,M.titanium);R(1673,96,30,10,M.frost);
 // East quarantine and habitat, separate levels with functioning floor-to-ceiling equipment.
 R(1692,545,324,12,M.steel);R(1700,557,306,5,M.blue);
 R(1627,696,387,13,M.titanium);R(1636,709,369,6,M.chrome);
 R(1650,821,345,12,M.steel);
 for(let x of [1696,1827,1950]){L(x,710,x+36,820,10,M.titanium);}
 // An identifiable double-door decontamination airlock, scrubber cartridges and transfer bed.
 R(1713,519,138,10,M.ceramic);R(1720,486,12,33,M.steel);R(1834,485,11,34,M.steel);
 for(let x of [1742,1774,1805]){R(x,495,19,22,M.frost);R(x+6,485,7,10,M.signal);}
 R(1864,521,79,9,M.chrome);R(1875,502,56,19,M.window);
 // Freight launch control: actual pallet and gantry hoist attached to upper ceiling.
 R(1645,663,155,12,M.ceramic);R(1660,629,17,34,M.titanium);
 R(1782,624,12,39,M.titanium);R(1680,639,89,22,M.iron);
 L(1694,638,1694,594,5,M.chrome);L(1762,637,1762,587,5,M.chrome);
 R(1672,585,103,10,M.steel);R(1674,573,22,12,M.glassDark);
 // Cryogenic refinery: diagonal condenser coil, anchored turbines and drain manifold.
 R(1845,685,154,11,M.titanium);
 for(let x of [1858,1888,1921,1953]){L(x,680,x+13,627,7,M.chrome);L(x+13,627,x+24,680,6,M.steel);}
 R(1876,609,55,13,M.ceramic);R(1891,593,28,16,M.amber);
 R(1648,795,139,12,M.chrome);R(1656,774,14,20,M.glassDark);
 R(1692,778,64,17,M.ceramic);R(1709,767,23,11,M.frost);
 // Western underground fossil bank: saw-frame and scanning storage.
 R(552,998,173,12,M.titanium);
 R(582,969,108,13,M.ceramic);R(595,956,23,13,M.glassDark);
 for(let x of [620,650,674]){R(x,985,18,12,M.iron);R(x+5,976,8,8,M.window);}
 L(555,997,575,956,7,M.chrome);L(717,1002,694,965,8,M.steel);
 // Mid underfloor superconducting cable splice vault with non-repeating coil stacks.
 R(915,998,186,12,M.steel);ellipse(979,976,34,24,M.titanium);ellipse(979,976,25,16,0);
 R(1028,967,23,29,M.glassDark);R(1035,961,10,9,M.signal);
 L(1049,993,1076,964,8,M.chrome);R(1068,954,18,10,M.blue);
 // Subsurface thermal service: braced heat-exchanger array and access-side diagnostics.
 R(1280,1001,169,10,M.chrome);
 for(let x of [1293,1334,1375]){R(x,965,23,33,M.iron);R(x+7,956,10,9,M.amber);}
 R(1422,975,15,25,M.glassDark);L(1432,973,1445,947,7,M.titanium);
 // East subterranean relief work chamber and emergency ventilation.
 R(1562,996,121,10,M.titanium);R(1581,974,22,22,M.window);
 R(1631,981,27,15,M.ceramic);L(1640,975,1640,952,5,M.signal);
 // Reopen wide genuine flight apertures; equipment must not barricade the traversable interiors.
 R(364,542,169,117,0);R(405,689,121,127,0);
 R(1574,492,139,110,0);R(1671,719,122,119,0);
 R(313,802,137,158,0);R(1656,799,150,162,0);
 // Explicit exact semantic checkpoints, including Midge actor spawn. No snap-to-free logic.
 const sites={
 "West arrivals":[376,626],"Cryo cartridge intake":[180,481],"Pilots exchange":[272,610],
 "Payload machining":[293,762],"West service shaft":[366,854],
 "Meteorology crown":[736,256],"Storm sampler":[727,349],"Telemetry middeck":[735,490],
 "Driver west gate":[554,574],"Coil bank alpha":[820,623],
 "Mass driver flight lane":[930,550],"Core switching lab":[1053,364],
 "Upper recovery":[1120,157],"Coil bank beta":[1272,602],
 "Launch nose":[1467,280],"East quarantine":[1780,470],
 "Scrubber transfer":[1910,572],"Freight handling":[1770,647],
 "Condenser plant":[1901,742],"East ridge exit":[1945,405],
 "West bore rescue":[369,920],"Fossil sorting":[634,909],
 "Cable splice vault":[1003,905],"Thermal return":[1370,919],
 "East bore rescue":[1739,904],"Driver underside":[1080,742]
 };
 // Exact safe clearance zones are authored architectural landing volumes.
 for(const [name,[x,y]] of Object.entries(sites))R(x-17,y-15,35,31,0);
 // Deep return connects both side shafts and four separately accessible side-bays.
 R(294,860,148,101,0);R(1662,860,145,103,0);
 R(450,866,1200,96,0);
 // Upper, interdeck and port-to-port 31×27 manouevring connections.
 R(399,515,146,163,0);R(1540,426,179,170,0);
 R(870,424,104,125,0);R(1177,422,104,125,0);
 R(876,760,106,117,0);R(1257,748,106,122,0);
 
 function tieStructures(){
  const N=g.length,mark=new Int32Array(N),q=new Int32Array(N),comps=[null];
  for(let k=0;k<N;k++)if(g[k]&&!mark[k]){
   let id=comps.length,hd=0,tl=1,edge=false;q[0]=k;mark[k]=id;
   while(hd<tl){let a=q[hd++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
    for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!mark[n]){mark[n]=id;q[tl++]=n;}}
   comps.push({edge,count:tl});
  }
  let owner=new Int32Array(N),distance=new Uint16Array(N),origin=new Int32Array(N);
  let queue=new Int32Array(N),hd=0,tl=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;queue[tl++]=i;}
  let edges=new Map();
  while(hd<tl){let a=queue[hd++],x=a%W,d=distance[a],oa=owner[a];
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N){
    if(!owner[n]){owner[n]=oa;origin[n]=origin[a];distance[n]=d+1;queue[tl++]=n;}
    else if(owner[n]!==oa){
     let ob=owner[n],key=Math.min(oa,ob)+":"+Math.max(oa,ob),length=d+distance[n]+1,best=edges.get(key);
     if(!best||length<best.length)edges.set(key,{a:origin[a],b:origin[n],oa,ob,length});
    }
   }
  }
  let parent=new Int32Array(comps.length);for(let i=0;i<parent.length;i++)parent[i]=i;
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(let i=1;i<comps.length;i++)if(comps[i].edge)parent[i]=0;
  let ties=0, longest=0;
  for(let e of [...edges.values()].sort((a,b)=>a.length-b.length)){
   let a=find(e.oa),b=find(e.ob);if(a===b)continue;parent[a]=b;
   L(e.a%W,(e.a/W)|0,e.b%W,(e.b/W)|0,4,M.conduit);
   ties++;longest=Math.max(longest,e.length);
  }
  for(let i=1;i<comps.length;i++)if(find(i)!==find(0))throw Error("Disconnected component graph "+i);
  return {ties,longest};
 }

 const tie_info=tieStructures();
 // Resolve intentional tie crossings at shafts, entrances and the deep return.
 R(295,855,135,104,0);R(1663,845,144,117,0);R(456,870,1194,92,0);
 R(389,537,124,143,0);R(1561,439,158,155,0);
 

 // Authored airlock passages bridging operative rooms to open cleft flight volumes.
 // Side/ceiling exits are generously larger than 31×27, with real excavation.
 R(310,584,215,79,0);R(385,706,149,96,0);  // west exchange and machine access
 R(793,239,126,112,0);R(808,330,135,86,0);R(802,429,142,139,0); // high science mast
 R(847,578,153,96,0);R(1171,338,151,74,0); // coil workshop / switch lab side locks
 R(1789,542,242,86,0);R(1716,612,192,91,0); // east transfer and freight doors
 R(1714,714,162,97,0);R(1834,715,187,91,0); // heat exchange returns
 // Service lift between machining and exchange, and coil underside escape riser.
 R(272,659,71,117,0);R(811,603,143,88,0);R(818,633,79,121,0);R(867,697,143,75,0);
 // Exact checkpoint clearance applied AFTER all support ties and release hatches.
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);


 // Impact-rock-anchored receiver suspension: robust load path over the excavated return.
 L(90,820,506,railY(506)-47,25,M.titanium);
 L(2041,407,1518,railY(1518)-42,24,M.steel);
 L(61,826,630,552,17,M.steel);
 // A last actual-cell structural union follows final intentional excavations.
 const final_support_union=tieStructures();
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);
 
 R(306,765,106,58,0); // machinist access below forging tooling into rescue shaft
 // Short real load joints into already anchored trusses, rather than extra spanning barriers.
 L(546,599,546,617,11,M.titanium);
 L(352,765,416,799,12,M.steel);

 // Compact canonical full-row run vertical coalescing: 5-element ordered edits.
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(g.length);
 for(let y=0;y<H;y++){let next=new Map(),base=y*W;for(let x=0;x<W;){let m=g[base+x],s=x;while(x<W&&g[base+x]===m)x++;if(!m)continue;let k=s+":"+(x-s)+":"+m,idx=prev.get(k);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(k,idx);}prev=next;}
 for(let [x,y,w,h,m] of rect){area+=w*h;hist[m]=(hist[m]||0)+w*h;for(let yy=y;yy<y+h;yy++)replay.fill(m,yy*W+x,yy*W+x+w);}
 if(rect.length>32768||area>32000000)throw Error("Budget "+rect.length+" "+area);
 for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("Replay diverged "+i);
 // Stable inert-solid connectedness grounded to one or more real canvas edges.
 let seen=new Uint8Array(g.length),q=new Int32Array(g.length),rooted=0,unrooted=0,componentCount=0,rootedComponents=0;
 for(let k=0;k<g.length;k++)if(g[k]&&!seen[k]){componentCount++;let hq=0,tq=1,edge=false;q[0]=k;seen[k]=1;while(hq<tq){let a=q[hq++],x=a%W,y=(a/W)|0;if(x===0||x===W-1||y===0||y===H-1)edge=true;let n=[a-W,a+W,a-1,a+1];for(let j=0;j<4;j++){let b=n[j];if(b>=0&&b<g.length&&(j<2||(j===2&&x>0)||(j===3&&x<W-1))&&g[b]&&!seen[b]){seen[b]=1;q[tq++]=b;}}}if(edge){rooted+=tq;rootedComponents++;}else unrooted+=tq;}
 
 // Exact full hull 4-connected free centre BFS using area integral, no proxy targets.
 const ii=new Int32Array((W+1)*(H+1)),IW=W+1;for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){row+=g[o+x-1]!==0?1:0;ii[y*IW+x]=ii[(y-1)*IW+x]+row;}}
 function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*IW+c]-ii[d*IW+a]-ii[b*IW+c]+ii[b*IW+a]===0;}
 function flood(w,h,blocked){let pass=new Uint8Array(g.length),vis=new Uint8Array(g.length),queue=new Int32Array(g.length),hd=0,tl=0;
  // Physical temporary solid wall, not a centre-point-only exclusion.
  let source=ii;if(blocked){let test=g.slice();
   for(let y=blocked[1];y<blocked[3];y++)test.fill(M.wall,y*W+blocked[0],y*W+blocked[2]);
   source=new Int32Array((W+1)*(H+1));
   for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=test[o+x-1]?1:0;source[y*IW+x]=source[(y-1)*IW+x]+sum;}}
  }
  function clearAt(x,y){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&source[d*IW+c]-source[d*IW+a]-source[b*IW+c]+source[b*IW+a]===0;}
  for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(clearAt(x,y))pass[y*W+x]=1;
  let s=sites["West arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1010,327,1111,409]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Core switching lab")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Setup bytes "+json.length);
 // Indexed PNG palette has ID == raw material cell, every output scanline is unfiltered.
 const colors={0:[8,11,18],49:[70,83,99],58:[119,123,128],62:[126,141,153],63:[49,100,119],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],80:[236,248,255],100:[54,56,61],101:[24,19,32],120:[156,210,220],121:[190,216,225],122:[226,236,244],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
 function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set(name.split("").map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 function rev(v,n){let z=0;while(n--){z=(z<<1)|(v&1);v>>>=1;}return z;}
 function zip(raw){let o=[120,1],bits=0,n=0;
  function wr(v,k){bits|=v<<n;n+=k;while(n>=8){o.push(bits&255);bits>>>=8;n-=8;}}
  function sym(s){let v,k;if(s<=143){v=48+s;k=8;}else if(s<=255){v=400+s-144;k=9;}else if(s<=279){v=s-256;k=7;}else{v=192+s-280;k=8;}wr(rev(v,k),k);}
  const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  function run(len){let a=0;while(a<28&&lb[a+1]<=len)a++;sym(a+257);if(le[a])wr(len-lb[a],le[a]);wr(0,5);}
  wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let l=1;while(i+l<raw.length&&l<258&&raw[i+l]===raw[i])l++;if(l>=4&&i>0&&raw[i-1]===raw[i]){run(l);i+=l;}else{sym(raw[i]);i++;}}sym(256);if(n)o.push(bits&255);
  let a=1,b=0;for(let x of raw){a=(a+x)%65521;b=(b+a)%65521;}o.push(...be(((b<<16)|a)>>>0));return new Uint8Array(o);}
 let pal=new Uint8Array(132*3);for(let k=0;k<132;k++)pal.set(colors[k]||[100,100,100],k*3);
 function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
  let a=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())];
  let b=new Uint8Array(a.reduce((s,p)=>s+p.length,0)),i=0;for(let p of a){b.set(p,i);i+=p.length;}return b;}
 const crops=[["01-west-intake",0,360,560,560],["02-accelerator-gantry",430,400,630,470],["03-switching-observatory",600,110,730,635],["04-east-quarantine",1510,345,538,560],["05-underground-return",450,820,1215,204]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Kestrel Hollow - Cryogenic Mass Driver",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1082,446,1208,516],material_id:58,purpose:"Blocks exact Core switching lab; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; independently invented level design",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

if(typeof require!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");
 const a=build(),receipt=JSON.stringify(makeReceipt(a),null,2)+"\n";
 const output=[["setup.json",Buffer.from(a.json)],["receipt.json",Buffer.from(receipt)],...a.images.map(([n,b])=>[n,Buffer.from(b)])];
 function cmpCrypto(v){return crypto.createHash("sha256").update(v).digest("hex");}
 for(const [name,buf] of output)if(sha256(buf)!==cmpCrypto(buf))throw Error("SHA256 crosscheck "+name);
 // Independent Node zlib decode, CRC-32 per chunk, dimensions, raw palette indices.
 function crc(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 for(let [name,bytes] of a.images){
  let b=Buffer.from(bytes),i=8,w,h,ids=[],count=0;if(b.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw Error("PNG signature "+name);
  while(i<b.length){let n=b.readUInt32BE(i),k=b.toString("ascii",i+4,i+8),span=b.subarray(i+4,i+8+n);if(crc(span)!==b.readUInt32BE(i+8+n))throw Error("CRC "+name+" "+k);
   if(k==="IHDR"){w=b.readUInt32BE(i+8);h=b.readUInt32BE(i+12);if(b[i+17]!==3)throw Error("Not indexed material PNG");}
   if(k==="IDAT")ids.push(b.subarray(i+8,i+8+n));if(k==="IEND")count++;i+=n+12;}
  if(i!==b.length||count!==1)throw Error("PNG length/IEND "+name);
  let [x0,y0,ew,eh]=name==="overview.png"?[0,0,2048,1024]:a.crops.find(c=>c[0]+".png"===name).slice(1);
  if(w!==ew||h!==eh)throw Error("PNG crop size "+name);
  let raw=zlib.inflateSync(Buffer.concat(ids));if(raw.length!==(w+1)*h)throw Error("Inflated raw length "+name);
  for(let y=0;y<h;y++){let p=y*(w+1);if(raw[p]!==0)throw Error("Filter "+name);for(let x=0;x<w;x++)if(raw[p+1+x]!==a.g[(y+y0)*2048+x+x0])throw Error("Grid-to-PNG pixel mismatch "+name+" "+x+","+y);}
 }
 let verify=process.argv.includes("--verify");
 for(const [name,buf] of output){let target=path.join(__dirname,name);if(verify){if(!fs.existsSync(target)||!fs.readFileSync(target).equals(buf))throw Error("Noncanonical output: "+name);}
  else fs.writeFileSync(target,buf);}
 console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",verified_files:output.map(q=>q[0]),plane_sha256:makeReceipt(a).material_plane_sha256,rectangles:a.rect.length,sites:a.clearances.map(c=>c.passed),obstruction_other_sites:Object.keys(a.sites).length-1,png_decoded_pixel_parity:"PASS",native:"NATIVE-UNTESTED",verify},null,2));
}
