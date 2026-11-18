// Pure deterministic original material-cell builder. No images or reference assets are inputs.
// Node 22+; no third-party packages. Usage: node build.cjs [--verify]
"use strict";
const fs=require("fs");
function buildWideCanvas() {
  "use strict";
  const W=2048,H=1024,seed=0x20261118;
  const mat={E:0,SLATE:49,BASALT:100,OBSIDIAN:101,CONCRETE:58,STEEL:62,IRON:117,ZINC:113,BLUE:128,GLASS:35,GLASSBLOCK:120,QUARTZ:122,SIGNAL:123,MARBLE:98,LIME:38};
  const indexToMaterial=[0,49,100,101,58,62,117,113,128,35,120,122,123,98,38];
  const rgb=[[8,11,18],[70,83,99],[54,56,61],[24,19,32],[119,123,128],[126,141,153],[90,94,100],[152,162,168],[62,122,180],[128,205,220],[156,210,220],[226,236,244],[152,232,94],[226,223,216],[197,191,175]];
  const g=new Uint8Array(W*H);
  let rnd=seed>>>0;
  function random(){ rnd^=rnd<<13;rnd^=rnd>>>17;rnd^=rnd<<5; return ((rnd>>>0)/4294967296); }
  function R(x,y,w,h,m){
    const xa=Math.max(0,Math.round(x)), xb=Math.min(W,Math.round(x+w)), ya=Math.max(0,Math.round(y)),yb=Math.min(H,Math.round(y+h));
    if(xb<=xa||yb<=ya)return;
    for(let yy=ya;yy<yb;yy++)g.fill(m,yy*W+xa,yy*W+xb);
  }
  function P(points,m){
    const lo=Math.max(0,Math.ceil(Math.min(...points.map(a=>a[1])))), hi=Math.min(H-1,Math.floor(Math.max(...points.map(a=>a[1]))));
    for(let y=lo;y<=hi;y++){
      const cuts=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      cuts.sort((a,b)=>a-b);for(let j=0;j+1<cuts.length;j+=2) R(Math.ceil(cuts[j]),y,Math.max(0,Math.floor(cuts[j+1])-Math.ceil(cuts[j])+1),1,m);
    }
  }
  function L(x0,y0,x1,y1,th,m){
    const rad=th*0.5,r2=rad*rad,dx=x1-x0,dy=y1-y0,len2=dx*dx+dy*dy;
    const xa=Math.max(0,Math.floor(Math.min(x0,x1)-rad)),xb=Math.min(W-1,Math.ceil(Math.max(x0,x1)+rad));
    const ya=Math.max(0,Math.floor(Math.min(y0,y1)-rad)),yb=Math.min(H-1,Math.ceil(Math.max(y0,y1)+rad));
    for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const t=Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/(len2||1))),xx=x0+t*dx, yy=y0+t*dy;if((x-xx)**2+(y-yy)**2<=r2)g[y*W+x]=m;}
  }
  function ring(cx,cy,rx,ry,t,m,gate){
    const xa=Math.max(0,Math.floor(cx-rx)),xb=Math.min(W-1,Math.ceil(cx+rx));
    for(let y=Math.max(0,Math.floor(cy-ry));y<=Math.min(H-1,Math.ceil(cy+ry));y++)for(let x=xa;x<=xb;x++){
      const dx=x-cx,dy=y-cy,d=Math.sqrt((dx/rx)**2+(dy/ry)**2);
      if(d>1-t/Math.min(rx,ry)&&d<=1&&(!gate||gate(dx,dy,x,y)))g[y*W+x]=m;
    }
  }
  function markAgainstSolid(x0,y0,x1,y1,from,to){for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=y*W+x;if(g[i]===from)g[i]=to;}}
  // Original design thesis: a repurposed lightning-conductor railway over fractured escarpments.
  // Three broad race altitudes: 320 high, 448 main, 753 rock-cut return.
  // 1. Geology: asymmetric end shoulders, an overburden slab, and hanging crown cliffs.
  for(let x=0;x<W;x++){
    let top=886+19*Math.sin(x*.0107)+8*Math.sin(x*.037)+19*Math.sin(x*.0023);
    if(x>1340&&x<1800)top+=44*Math.sin(Math.PI*(x-1340)/460);
    top=Math.max(828,Math.min(954,Math.round(top)));
    R(x,top,1,H-top,mat.BASALT);
  }
  P([[238,680],[350,638],[493,655],[670,632],[835,665],[980,621],[1160,655],[1360,644],[1500,677],[1678,639],[1795,690],[1876,790],[1880,1024],[210,1024]],mat.BASALT);
  P([[0,955],[120,912],[220,958],[220,1024],[0,1024]],mat.SLATE);
  P([[1685,928],[1810,892],[1920,923],[2048,878],[2048,1024],[1685,1024]],mat.SLATE);
  P([[0,0],[0,219],[54,170],[114,180],[145,142],[235,156],[253,116],[317,140],[337,0]],mat.BASALT);
  P([[389,0],[389,121],[428,154],[500,147],[544,202],[602,152],[653,196],[689,130],[744,180],[806,111],[821,0]],mat.BASALT);
  P([[1310,0],[1310,112],[1380,180],[1437,158],[1510,213],[1550,172],[1650,190],[1732,139],[1810,181],[1850,0]],mat.BASALT);
  // A deliberate irregular cracked geology band, only on existing rock cells.
  for(let y=0;y<H;y++){
    const off=y*W;for(let x=0;x<W;x++)if(g[off+x]===mat.BASALT){
      const k=Math.sin(x*.024+y*.083)+.8*Math.sin(x*.008-y*.046);
      if(y>810){
        const layer=y-.078*x+18*Math.sin(x*.006);
        const phase=((layer%154)+154)%154;
        if(phase<19)g[off+x]=mat.OBSIDIAN;
        else if(phase<43)g[off+x]=mat.SLATE;
      } else if(y<215&&k>.98)g[off+x]=mat.SLATE;
    }
  }
  // 2. Unequal rock-cut return tunnel, 103px high nominal with broad transitions.
  R(290,700,1540,108,mat.E);
  R(340,683,360,128,mat.E); R(760,689,470,126,mat.E);R(1320,696,445,113,mat.E);
  R(376,572,146,252,mat.E); // west vertical transition
  R(1000,569,151,266,mat.E); // iris dive / alternate route
  R(1665,560,142,276,mat.E); // east recovery lift
  // Larger turnout bays, not narrow tube-like local pockets.
  R(545,681,165,134,mat.E); R(1232,677,172,136,mat.E);
  // Distinctly irregular tunnel shoulders, grounded in rock above/below.
  P([[276,680],[314,642],[344,652],[352,703],[316,705]],mat.SLATE);
  P([[1790,684],[1864,689],[1874,768],[1813,799],[1790,795]],mat.SLATE);
  // 3. Launch complex: heavily articulated west shell, opening onto all three altitudes.
  P([[24,586],[24,304],[90,238],[144,215],[205,232],[275,207],[344,241],[377,299],[377,316],[328,286],[274,272],[214,280],[140,271],[94,306],[70,368],[70,566],[55,586]],mat.CONCRETE);
  // Launch canopy hollow and main 2D sightline; shell perimeter remains rooted.
  P([[81,545],[81,352],[123,309],[210,288],[297,312],[332,346],[350,532],[315,545]],mat.E);
  R(65,357,330,194,mat.E); // massive main runway, no gate collision
  L(37,579,340,579,12,mat.STEEL);
  L(44,598,380,598,8,mat.IRON);
  for(const xx of [60,123,193,276,344]){
    R(xx,567,30,7,mat.ZINC); R(xx+8,580,8,13,mat.BLUE);
  }
  // Scale-defining launcher rails, not foreground obstacles in the flight lane.
  L(60,614,300,614,8,mat.STEEL);L(60,627,284,627,5,mat.ZINC);
  P([[110,210],[151,168],[226,167],[255,197],[240,210]],mat.STEEL);
  R(148,184,94,10,mat.BLUE);R(172,174,47,7,mat.GLASSBLOCK);
  for(let i=0;i<5;i++){let x=102+i*45;P([[x,598],[x+17,598],[x+8,610]],mat.SIGNAL);}
  // West tower / checkpoint arch remains open at y 390..510.
  R(333,286,13,92,mat.STEEL);R(333,519,13,72,mat.STEEL);
  R(337,278,6,13,mat.SIGNAL);R(336,524,7,11,mat.SIGNAL);
  // 4. Drift-canyon: flying buttresses and falling-rock fossil shelves, anchored.
  P([[396,629],[440,580],[520,590],[575,638]],mat.SLATE);
  P([[578,634],[645,588],[701,602],[731,645]],mat.SLATE);
  P([[450,182],[484,238],[526,252],[556,199],[559,0],[448,0]],mat.OBSIDIAN);
  P([[624,198],[657,259],[707,271],[738,170],[743,0],[652,0]],mat.SLATE);
  // Long high bypass gallery driven through the hanging crown rock.
  R(438,110,301,50,mat.E);
  R(488,166,207,59,mat.E);
  // Articulated buttress roots placed well below main flight.
  L(584,620,622,546,12,mat.STEEL);L(613,550,649,625,8,mat.IRON);
  L(733,636,776,555,14,mat.STEEL);
  R(572,555,32,9,mat.ZINC);R(717,550,35,8,mat.ZINC);
  // Hurrying gate chevrons live ABOVE main-line 31x27 envelope.
  for(const [x,y] of [[445,344],[716,305]]){
    P([[x,y],[x+27,y+9],[x,y+18],[x+9,y+9]],mat.SIGNAL);
    P([[x+33,y],[x+60,y+9],[x+33,y+18],[x+42,y+9]],mat.QUARTZ);
  }
  // 5. Main hero: non-circular "split-current iris", an asymmetrical suspended structural instrument.
  // The visually emphatic ring has two huge gates at side centre-line, not a narrow flight hole.
  ring(1010,411,242,207,15,mat.STEEL,(dx,dy)=>!(Math.abs(dx)>177&&dy>-116&&dy<130));
  ring(1010,411,208,177,8,mat.ZINC,(dx,dy)=>!(Math.abs(dx)>172&&dy>-108&&dy<133));
  // Sheared open at approach and departure; extra explicit voids for the main fast route.
  R(756,343,112,169,mat.E);R(1156,343,122,171,mat.E);
  // Iris ribs: upper lattice, with real upper high-speed bypass ABOVE the crown.
  L(848,278,908,219,10,mat.IRON);L(1107,207,1165,267,11,mat.IRON);
  L(909,216,1010,197,8,mat.ZINC);L(1011,197,1100,209,8,mat.ZINC);
  for(const x of [885,924,1092,1127])R(x,259,16,8,mat.BLUE);
  // Suspended central lightning capacitor, clear of main line.
  P([[976,234],[1003,250],[1036,237],[1048,280],[1026,315],[1001,292],[974,315],[958,282]],mat.QUARTZ);
  R(987,252,12,34,mat.SIGNAL);L(1007,191,1007,230,6,mat.ZINC);
  // Iris floor/catwalk, y 590+, leaving a 180 px high main flight vault.
  L(850,605,1186,605,12,mat.STEEL);
  for(const xx of [865,948,1053,1152]){
    L(xx,609,xx+22,647,9,mat.IRON);R(xx,593,22,6,mat.BLUE);
  }
  // Large central dive opening through floor, exact actor-accessible 151px.
  R(997,568,161,92,mat.E);
  // 6. Eastern glassstorm viaduct: angular rooted pylons, long straight time-trial lane.
  P([[1305,622],[1370,568],[1474,573],[1566,593],[1690,552],[1756,629]],mat.SLATE);
  L(1291,603,1778,603,14,mat.STEEL);L(1314,617,1758,617,7,mat.ZINC);
  for(const x of [1340,1483,1626,1729]){
    // support piers are grounded into rock/overburden
    P([[x,619],[x+18,619],[x+26,699],[x-10,699]],mat.CONCRETE);
    R(x-14,633,46,10,mat.STEEL);
    R(x+4,648,7,31,mat.BLUE);
  }
  // Suspended oblique overhead conductor, from mountain crown not in racing lane.
  L(1362,168,1430,278,10,mat.STEEL);L(1430,278,1510,233,11,mat.STEEL);
  L(1510,233,1608,283,10,mat.STEEL);L(1608,283,1730,167,11,mat.STEEL);
  L(1393,194,1407,246,5,mat.ZINC);L(1568,258,1579,315,5,mat.ZINC);
  for(const [xx,yy] of [[1431,283],[1515,238],[1607,286]]){
    P([[xx-16,yy+9],[xx,yy+16],[xx+17,yy+9],[xx,yy+28]],mat.SIGNAL);
  }
  // Four shielded specimen panes on viaduct underside, deliberately inert.
  for(const xx of [1363,1448,1539,1636]){
    R(xx,647,53,29,mat.STEEL);R(xx+5,652,43,19,mat.GLASSBLOCK);
    R(xx+16,658,9,8,mat.SIGNAL);R(xx+31,655,9,11,mat.QUARTZ);
  }
  // 7. Catch-basin "braking claw" founded on east escarpment.
  P([[1770,636],[1801,568],[1850,548],[1901,570],[1961,523],[2024,577],[2048,614],[2048,1024],[1790,1024]],mat.SLATE);
  // Shape the recovery bowl by excavating its full traversable heart.
  P([[1772,530],[1810,495],[1890,504],[1964,488],[2032,529],[2032,799],[1960,843],[1874,835],[1829,799],[1760,689]],mat.E);
  L(1828,839,1957,839,10,mat.STEEL);
  L(1957,839,2020,802,9,mat.STEEL);
  R(1862,842,90,12,mat.CONCRETE);
  // Finish markers above/below main; full 120px+ gate aperture.
  R(1920,331,14,62,mat.STEEL);R(1920,521,14,68,mat.STEEL);
  R(1918,324,19,12,mat.SIGNAL);R(1918,579,19,10,mat.SIGNAL);
  for(let i=0;i<5;i++){
    const yy=335+i*14;
    R(1938,yy,13,7,i%2?mat.QUARTZ:mat.STEEL);
  }
  // Two-sided speed trap tower supported by bowl shoulder.
  L(1994,580,1994,802,12,mat.CONCRETE);
  R(1965,586,61,12,mat.STEEL);R(1979,597,30,49,mat.GLASSBLOCK);
  R(1984,605,19,7,mat.SIGNAL);
  // 8. Return tunnel and canyon operational detailing: never plug 31x27 clearway.
  for(const [x,roof] of [[314,710],[590,690],[875,701],[1190,706],[1504,706],[1630,708]]){
    R(x,roof,25,7,mat.IRON);R(x+7,roof+7,8,8,mat.SIGNAL);
  }
  for(const x of [360,650,846,1340,1585,1711]){
    R(x,802,36,10,mat.STEEL);R(x+11,792,12,10,mat.BLUE);
  }
  // Test pylons rooted in overburden, deliberately NOT bridging into 31x27 tunnel airspace.
  for(const [x,y] of [[440,625],[776,634],[1208,655],[1740,652]]){
    R(x,y,9,46,mat.IRON);R(x-6,y,22,7,mat.ZINC);
  }
  // Reinforce exposed left/right world edges and preserve all occupied cells as material IDs.
  R(0,0,8,1024,mat.OBSIDIAN);R(2040,0,8,1024,mat.OBSIDIAN);
  R(0,1014,2048,10,mat.OBSIDIAN);

  // A limited human-authored fine-work layer: deterministic, tied to actual founded surfaces.
  // Inlaid stripes under launch, frayed bands on stone, not random collision specks in sky.
  for(let i=0;i<36;i++){
    const x=310+Math.floor(random()*1500), y=879+Math.floor(random()*92);
    R(x,y,8+Math.floor(random()*20),2,mat.SLATE);
  }

  // 9. Finishing pass following full-scale review: rooted facilities and legible macro cadence.
  // Deliberate full-width (130px) west ramp shaft restores physical lower-route access.
  R(380,561,159,251,mat.E);
  // Flared entry from west main flight and continuous recovery floor.
  R(352,545,211,42,mat.E);
  R(373,685,178,128,mat.E);
  // Correct any rock slivers at west tunnel throat; no checkpoint/site relocations.
  R(383,688,137,127,mat.E);

  // Launch cradle: human-readable construction scale and console array within rooted shell.
  for(const [xa,ya,xb,yb] of [[90,291,131,266],[136,266,205,244],[210,244,282,259],[287,259,342,297]]){
    L(xa,ya,xb,yb,5,mat.ZINC);
  }
  R(96,240,18,8,mat.BLUE);R(274,223,19,8,mat.BLUE);
  P([[194,235],[201,219],[211,219],[223,237]],mat.QUARTZ);
  R(246,266,35,8,mat.GLASSBLOCK);
  L(134,535,293,535,5,mat.STEEL);
  for(const x of [150,181,216,257]){
    R(x,539,15,8,mat.BLUE);R(x+4,541,5,3,mat.SIGNAL);
  }
  // Raised signal director founded in the west wall, safely overhead.
  R(304,189,13,53,mat.IRON);R(293,180,35,12,mat.STEEL);
  R(297,172,10,8,mat.SIGNAL);R(314,172,11,8,mat.GLASSBLOCK);
  L(309,176,315,151,4,mat.ZINC);

  // Drift canyon: unique oblique cliffside rail-saw and its supported display hut.
  L(509,185,562,267,8,mat.STEEL);L(561,267,605,246,7,mat.IRON);
  L(585,254,615,215,6,mat.ZINC);
  P([[546,267],[574,270],[586,285],[559,294],[542,282]],mat.BLUE);
  R(566,277,15,9,mat.GLASSBLOCK);
  R(660,275,64,11,mat.STEEL);R(672,286,40,8,mat.BLUE);
  for(const x of [675,688,700])R(x,289,5,5,mat.SIGNAL);
  L(690,276,686,218,5,mat.IRON);
  // Broad optical speed chevrons NOT at the physical flight centreline.
  for(const [x,y] of [[526,344],[1304,312],[1740,328]]){
    P([[x,y],[x+28,y+11],[x,y+22],[x+8,y+11]],mat.SIGNAL);
  }

  // Split-current control instrument: asymmetrical sensor comb rooted at the iris crown.
  for(const [x,y,d] of [[901,257,42],[950,222,61],[1058,215,56],[1119,251,39]]){
    L(x,y,x+7,y+d,5,mat.ZINC);
    R(x-6,y-6,19,7,mat.STEEL);
  }
  L(919,285,977,308,7,mat.STEEL);
  L(1052,305,1093,279,7,mat.STEEL);
  for(const [x,y] of [[920,315],[1081,318]]){
    R(x,y,39,8,mat.STEEL);R(x+9,y+2,21,4,mat.BLUE);
  }
  // Zigzag racing sightline landmark with generous non-colliding vertical clearance.
  P([[971,322],[984,335],[994,316],[1004,337],[1021,322],[1004,350],[996,337],[985,356]],mat.SIGNAL);

  // Central switch-table is mechanically rooted; no false floating decorative room.
  for(const x of [905,1120]){
    R(x,616,30,12,mat.CONCRETE);R(x+9,631,12,21,mat.IRON);
  }
  L(874,660,958,681,7,mat.ZINC);
  R(885,664,28,7,mat.BLUE);R(940,675,18,6,mat.SIGNAL);
  L(1195,650,1275,677,7,mat.ZINC);
  R(1211,655,34,7,mat.BLUE);

  // Viaduct conductor chambers: purposeful asymmetric industrial mass (not duplicated rooms).
  P([[1360,185],[1429,271],[1483,241],[1512,260],[1537,237],[1605,279],[1700,187],[1662,220],[1606,246],[1549,211],[1499,213],[1435,251]],mat.IRON);
  L(1433,251,1460,292,5,mat.ZINC);
  L(1605,244,1645,298,5,mat.ZINC);
  P([[1456,289],[1479,278],[1497,289],[1479,309]],mat.QUARTZ);
  P([[1637,293],[1656,277],[1669,295],[1656,307]],mat.SIGNAL);
  // One suspended laboratory capsule, attached through conductor above, avoids generic pod row.
  L(1555,267,1555,336,9,mat.IRON);
  P([[1522,328],[1587,328],[1600,347],[1583,373],[1529,373],[1517,348]],mat.STEEL);
  R(1532,339,48,22,mat.GLASSBLOCK);
  for(const x of [1540,1554,1568])R(x,343,7,8,mat.SIGNAL);
  // This overhead laboratory has y>370 but free main line centered ~453.

  // Catch district: grounded braking-lattice and offset viewing/control deck.
  L(1797,620,1844,659,12,mat.STEEL);
  L(1854,661,1896,614,12,mat.STEEL);
  L(1905,616,1966,652,11,mat.STEEL);
  R(1837,656,80,10,mat.IRON);
  R(1845,667,65,33,mat.GLASSBLOCK);
  for(const x of [1856,1875,1896])R(x,678,8,10,mat.SIGNAL);
  L(1856,699,1856,736,7,mat.ZINC);
  L(1901,699,1901,728,7,mat.ZINC);
  // Massive inset grounded basalt scar on the recovery floor; unchanged flight corridor.
  P([[1820,873],[1878,849],[1967,862],[2010,832],[2048,866],[2048,939],[1820,939]],mat.BASALT);
  L(1851,859,1949,859,5,mat.ZINC);
  R(1898,844,50,8,mat.BLUE);

  // Milestone glyphs embedded in the founded deck (not physical floating trophies).
  for(const [x,y] of [[558,640],[733,642],[1350,620],[1533,621],[1715,616]]){
    R(x,y,19,6,mat.ZINC);
    R(x+5,y-4,9,4,mat.SIGNAL);
  }
  // Full Midge-31×27 west-to-east recovery throat, opened behind the catch bowl.
  // Leave the upper catch control deck untouched; cut only the lower deadwall.
  R(1716,694,218,122,mat.E);
  R(1786,682,156,132,mat.E);
  // Exact recovery-basin site and contiguous wide return throat, with a safe margin.
  R(1826,731,145,89,mat.E);

  // R4 original racing craft: broaden the founded macro structures while keeping a fast free-flight centreline.
  // New west dispatch hall, mechanically pinned into the fragmented canopy.
  P([[113,234],[138,178],[201,157],[281,166],[327,144],[363,176],[356,241],[290,253],[229,224],[170,244]],mat.STEEL);
  P([[152,187],[199,175],[257,185],[250,209],[190,214],[143,208]],mat.CONCRETE);
  R(163,185,34,18,mat.BLUE);R(169,190,22,8,mat.GLASSBLOCK);
  R(208,186,35,16,mat.OBSIDIAN);R(213,191,25,6,mat.SIGNAL);
  L(271,188,309,159,9,mat.ZINC);L(308,159,342,185,9,mat.ZINC);
  R(281,204,47,21,mat.IRON);R(289,210,29,8,mat.GLASSBLOCK);
  L(132,223,103,281,11,mat.IRON);L(322,232,355,284,10,mat.IRON);
  R(355,313,20,8,mat.SIGNAL);R(355,561,26,7,mat.BLUE);
  // A unique geologic saw-cut: dangling serrated roof and a fixed, roof-supported rail head.
  P([[427,149],[466,137],[500,182],[536,172],[567,221],[551,261],[510,235],[488,257],[459,208]],mat.OBSIDIAN);
  P([[590,174],[633,204],[671,196],[723,237],[751,207],[741,268],[700,303],[662,273],[624,299]],mat.SLATE);
  L(609,188,601,270,12,mat.STEEL);L(601,270,568,300,10,mat.IRON);
  L(570,300,609,312,8,mat.IRON);
  P([[554,306],[564,283],[588,291],[601,315],[579,337]],mat.STEEL);
  P([[569,298],[585,303],[583,318],[566,313]],mat.QUARTZ);
  // Broad lower cliff tooth remains *above* the lower tunnel, not a racing pinhole.
  P([[560,638],[604,601],[646,591],[682,616],[718,592],[754,661],[754,681],[670,675],[626,651],[574,678]],mat.BASALT);
  L(609,611,657,628,9,mat.STEEL);L(657,628,688,597,8,mat.STEEL);
  R(620,603,28,7,mat.BLUE);
  // IRIS: preserve the entire upper 31x27 high-speed bypass and relocate backbone to the crown above it.
  L(789,96,1327,91,12,mat.STEEL);
  L(770,116,803,97,12,mat.IRON);
  L(1326,92,1353,133,12,mat.IRON);
  R(950,91,46,13,mat.BLUE);R(1086,88,55,13,mat.ZINC);
  
  
  
  P([[1082,232],[1129,199],[1177,218],[1171,258],[1126,272]],mat.IRON);
  L(1102,264,1151,241,9,mat.ZINC);
  R(1114,235,32,12,mat.BLUE);
  // Asymmetric switch-bank housings sit on an existing load deck, away from the 161-wide dive.
  P([[855,603],[884,581],[918,588],[951,617],[945,639],[877,640]],mat.CONCRETE);
  R(873,608,47,12,mat.STEEL);R(881,618,31,9,mat.GLASSBLOCK);
  P([[1178,602],[1204,584],[1238,599],[1252,632],[1215,651]],mat.CONCRETE);
  R(1192,606,41,9,mat.STEEL);R(1200,616,25,8,mat.BLUE);
  // GLASSSTORM: preserve the exact upper speed-line approach x1300..1510/y150..340.
  
  L(1731,153,1696,268,17,mat.CONCRETE);
  
  
  
  P([[1605,269],[1644,240],[1703,256],[1742,315],[1732,349],[1647,337],[1613,312]],mat.STEEL);
  R(1643,279,60,40,mat.CONCRETE);R(1653,288,42,23,mat.GLASSBLOCK);
  R(1661,292,26,8,mat.BLUE);R(1667,306,12,5,mat.SIGNAL);
  L(1684,266,1741,205,12,mat.IRON);
  // Load-bearing web spans only the deck underbelly: no floating props or low-tunnel plugs.
  L(1306,595,1404,661,11,mat.STEEL);L(1404,661,1481,600,11,mat.STEEL);
  L(1482,606,1588,672,11,mat.IRON);L(1588,672,1635,635,11,mat.STEEL);
  // East recovery ascent x1665..1807 is an open 31x27 flyable throat, not a truss bay.
  L(1332,630,1434,630,7,mat.ZINC);L(1501,637,1621,637,7,mat.ZINC);
  // Vast EAST brakestand, anchored to existing east-side massif, without occupying finish y446.
  L(2029,857,2015,597,20,mat.CONCRETE);
  L(2015,597,1988,563,19,mat.STEEL);
  L(1988,563,1945,573,14,mat.STEEL);
  P([[1987,648],[2029,622],[2039,727],[2002,742],[1984,708]],mat.STEEL);
  R(1991,665,35,48,mat.IRON);
  R(1998,671,24,32,mat.GLASSBLOCK);
  R(2001,682,18,8,mat.SIGNAL);
  P([[1981,836],[2018,802],[2048,809],[2048,885],[1980,888]],mat.SLATE);
  L(1981,838,2026,807,11,mat.ZINC);
  // Upper brake jaw intentionally ends left of the finish mast and joins the right tower only above y550.
  L(2012,565,2005,335,13,mat.IRON);
  L(2005,335,1830,318,14,mat.STEEL);
  L(1838,319,1870,337,10,mat.ZINC);
  R(1881,325,39,11,mat.BLUE);R(1893,330,16,4,mat.SIGNAL);

    // Compress exact material plane into non-overlapping vertically coalesced five-field boxes.
  function compress(){
    const boxes=[],prev=new Map();
    let last=prev;
    for(let y=0;y<H;y++){
      const next=new Map(),row=y*W;let x=0;
      while(x<W){
        const start=x,m=g[row+x];while(x<W&&g[row+x]===m)x++;
        if(m===0)continue;
        const key=start+"|"+(x-start)+"|"+m,old=last.get(key);
        if(old!==undefined){boxes[old][3]++;next.set(key,old);}
        else{const idx=boxes.length;boxes.push([start,y,x-start,1,m]);next.set(key,idx);}
      }
      last=next;
    }
    return boxes;
  }
  const edits=compress();
  // Reconstruct ALL cells, reject every overlapping pair.
  const replay=new Uint8Array(W*H),hits=new Uint8Array(W*H);
  let collisions=0;
  for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
    const n=yy*W+xx;if(hits[n])collisions++;hits[n]=1;replay[n]=m;
  }
  let mismatches=0;
  for(let i=0;i<g.length;i++)if(g[i]!==replay[i])mismatches++;
  if(mismatches||collisions)throw Error("LOSSLESS_REPLAY_FAIL "+mismatches+" "+collisions);
  if(edits.length>32768)throw Error("RECT_BUDGET_FAIL "+edits.length);

  const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
  const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[116,445],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
  const json=JSON.stringify(setup);
  if(json.length>1048576)throw Error("BYTE_BUDGET_FAIL "+json.length);
  // Strict fully-contained actor-centre envelope 4-neighbour connected pass. No nearest-point relocation.
  const sites=[
    ["Launch cradle",116,445],["Dispatch roof bypass",203,329],["Split-canyon high",617,356],
    ["West dive shaft",443,612],["West undercroft",614,752],["Iris west approach",841,445],
    ["Iris central chamber",1037,448],["Iris lower transfer",1072,753],
    ["East conductor",1323,454],["Glassstorm viaduct",1506,453],
    ["Eastern underpass",1571,756],["Catch cliff",1826,449],
    ["Brake finish",1943,446],["Recovery basin",1883,767]
  ];
  function flood(fw,fh,blocked){
    const halfw=Math.floor(fw/2),halfh=Math.floor(fh/2),stride=W+1, sat=new Uint32Array((W+1)*(H+1));
    for(let y=0;y<H;y++){
      let s=0;for(let x=0;x<W;x++){s+=(g[y*W+x]!==0)?1:0;sat[(y+1)*stride+x+1]=sat[y*stride+x+1]+s;}
    }
    const pass=new Uint8Array(W*H);
    for(let y=halfh;y<H-halfh;y++)for(let x=halfw;x<W-halfw;x++){
      const a=x-halfw,b=x+halfw, c=y-halfh,d=y+halfh;
      const n=sat[(d+1)*stride+b+1]-sat[c*stride+b+1]-sat[(d+1)*stride+a]+sat[c*stride+a];
      if(!n&&(!blocked||!(x>=blocked[0]&&x<=blocked[2]&&y>=blocked[1]&&y<=blocked[3])))pass[y*W+x]=1;
    }
    const start=445*W+116;if(!pass[start])return {size:0,sites:sites.map(q=>[q[0],false]),error:"SPAWN_OBSTRUCTED"};
    const q=new Int32Array(W*H),seen=new Uint8Array(W*H);let r=0,w=1;q[0]=start;seen[start]=1;
    while(r<w){
      const p=q[r++],x=p%W,y=(p/W)|0;
      const nei=[p-1,p+1,p-W,p+W];
      for(let j=0;j<4;j++){
        if((j===0&&x===0)||(j===1&&x===W-1)||(j===2&&y===0)||(j===3&&y===H-1))continue;
        const n=nei[j];if(pass[n]&&!seen[n]){seen[n]=1;q[w++]=n;}
      }
    }
    return {size:w,sites:sites.map(s=>[s[0],!!seen[s[2]*W+s[1]]])};
  }
  const reachable={};for(const [fw,fh] of [[19,15],[23,19],[31,27]])reachable[fw+"x"+fh]=flood(fw,fh,null);
  const bypass=flood(31,27,[900,330,1110,554]);
  // Material catalogue exact RGB palette, indexed 4-bit lossless pixel parity.
  function encodePNG(x0,y0,ww,hh){
    const stride=1+ww/2,raw=new Uint8Array(stride*hh);
    const toIndex=new Int16Array(256);toIndex.fill(-1);for(let i=0;i<indexToMaterial.length;i++)toIndex[indexToMaterial[i]]=i;
    for(let y=0;y<hh;y++)for(let x=0;x<ww;x+=2){
      const a=toIndex[g[(y0+y)*W+x0+x]],b=toIndex[g[(y0+y)*W+x0+x+1]];
      if(a<0||b<0)throw Error("PALETTE_FAIL "+a+" "+b);
      raw[y*stride+1+(x>>1)]=(a<<4)|b;
    }
    function be32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
    function crc32(v){let c=0xffffffff;for(const b of v){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&(-(c&1)));}return (c^0xffffffff)>>>0;}
    function adler32(v){let a=1,b=0;for(let i=0;i<v.length;i++){a=(a+v[i])%65521;b=(b+a)%65521;}return ((b<<16)|a)>>>0;}
    function chunk(typ,dat){
      const tb=Array.from(typ).map(s=>s.charCodeAt(0)),res=[...be32(dat.length),...tb,...dat,...be32(crc32([...tb,...dat]))];
      return res;
    }
    const z=[0x78,0x01];for(let off=0;off<raw.length;){
      const len=Math.min(65535,raw.length-off),final=off+len===raw.length;
      z.push(final?1:0,len&255,(len>>8)&255,(~len)&255,((~len)>>8)&255);
      for(let j=0;j<len;j++)z.push(raw[off+j]);off+=len;
    }
    z.push(...be32(adler32(raw)));
    const plte=rgb.flat(),pout=[
      137,80,78,71,13,10,26,10,
      ...chunk("IHDR",[...be32(ww),...be32(hh),4,3,0,0,0]),
      ...chunk("PLTE",plte),
      ...chunk("IDAT",z),
      ...chunk("IEND",[])
    ];
    const png=new Uint8Array(pout);
    // Independently re-parse signature/chunks/CRC, stored zlib, Adler and compare all decoded palette pixels.
    function u32(pos){return (((png[pos]*0x1000000)+(png[pos+1]<<16)+(png[pos+2]<<8)+png[pos+3])>>>0);}
    for(let i=0;i<8;i++)if(png[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG_SIG");
    let pos=8,idat=null,terminated=false,chunks=0;
    while(pos<png.length){
      const len=u32(pos),type=String.fromCharCode(...png.slice(pos+4,pos+8)),d=png.slice(pos+8,pos+8+len),crc=u32(pos+8+len);
      const cb=new Uint8Array(4+d.length);cb.set(png.slice(pos+4,pos+8));cb.set(d,4);
      if(crc32(cb)!==crc)throw Error("PNG_CRC "+type);
      if(type==="IDAT")idat=d;
      if(type==="IEND"){terminated=true;pos+=12;break;}
      pos+=12+len;chunks++;
    }
    if(!terminated||pos!==png.length||!idat)throw Error("PNG_IEND");
    const zin=idat;let zi=2,ro=0,decoded=new Uint8Array(raw.length);
    while(zi<zin.length-4){
      const fl=zin[zi++],len=zin[zi]|(zin[zi+1]<<8),nl=zin[zi+2]|(zin[zi+3]<<8);zi+=4;
      if(((len^nl)&65535)!==65535||((fl>>1)&3)!==0)throw Error("PNG_ZLIB_BLOCK");
      decoded.set(zin.slice(zi,zi+len),ro);zi+=len;ro+=len;
      if(fl&1)break;
    }
    const expect=((zin[zin.length-4]*0x1000000)+(zin[zin.length-3]<<16)+(zin[zin.length-2]<<8)+zin[zin.length-1])>>>0;
    if(ro!==raw.length||expect!==adler32(decoded))throw Error("PNG_ADLER");
    let pDiff=0;
    for(let y=0;y<hh;y++)for(let x=0;x<ww;x++){
      const packed=decoded[y*stride+1+(x>>1)],ind=(x&1)?packed&15:packed>>4;
      if(indexToMaterial[ind]!==g[(y+y0)*W+x+x0])pDiff++;
    }
    if(pDiff)throw Error("PNG_PIXEL_PARITY "+pDiff);
    return {bytes:png,pixels:ww*hh,chunkCRC:"PASS",adler:"PASS",materialPixelsVerified:ww*hh};
  }
  const gallery=[
    ["overview.png",0,0,2048,1024],
    ["01-launch-cradle.png",0,160,512,384],
    ["02-drift-canyon.png",384,140,512,384],
    ["03-split-current-iris.png",760,164,512,384],
    ["04-glassstorm-viaduct.png",1240,232,512,384],
    ["05-catch-recovery.png",1536,540,512,384]
  ].map(p=>({name:p[0],region:p.slice(1),...encodePNG(...p.slice(1))}));
  const hist={};for(const v of g)hist[v]=(hist[v]||0)+1;
  return {W,H,seed,grid:g,json,edits,sites,reachable,bypass,hist,materials:mat,gallery,mismatches,collisions};
}
const r=buildWideCanvas();
const artifacts=[["setup-thunderclap-switchyard.json",Buffer.from(r.json,"utf8")],...r.gallery.map(g=>[g.name,Buffer.from(g.bytes)])];
let ok=true;
for(const [name,bytes] of artifacts){
 if(process.argv.includes("--verify")){
   if(!fs.existsSync(name)||!fs.readFileSync(name).equals(bytes)){ console.error("FAIL:",name); ok=false; }
   else console.log("PASS:",name,bytes.length);
 } else {fs.writeFileSync(name,bytes); console.log("WRITE:",name,bytes.length);}
}
if(!ok)process.exitCode=1;
