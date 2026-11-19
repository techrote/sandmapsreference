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


  // R5 independently prompted true-cell load-path remediation. All structural
  // members below are part of the physical material grid, not a visual overlay.
  // West dispatch and foot rail are now attached to the west boundary rock.
  L(5,572,48,572,24,mat.CONCRETE);
  L(200,165,203,136,16,mat.IRON);
  L(5,608,64,608,10,mat.STEEL);
  // An asymmetrically braced continuous service spine joins the drifting
  // engineering mass to the Glassstorm underside and true east wall.
  // It sits between the fast main racing air (y~445) and undercroft (y~752).
  L(730,635,1340,635,16,mat.STEEL);
  for(const x of [786,925,1088,1228]){
    L(x,642,x+49,674,7,mat.ZINC);
    L(x+49,674,x+102,642,7,mat.IRON);
    R(x+43,664,15,7,mat.BLUE);
  }
  L(1709,613,2040,614,17,mat.CONCRETE);
  // Rebuild the previously unmoored iris arch as a top-anchored suspension.
  // Its 440x79 pass is a real 31x27-compatible over-crown flight gallery;
  // this underpass restores blocked-main-iris high route around the hanger.
  R(805,257,440,79,mat.E);
  R(785,0,562,17,mat.CONCRETE);
  L(1007,18,1007,193,16,mat.IRON);
  L(818,17,948,77,7,mat.ZINC);
  L(1199,17,1066,77,7,mat.ZINC);
  R(968,17,83,9,mat.STEEL);
  // Catch jaw is fixed into the wall, away from the finish centre (1943,446).
  L(2005,335,2040,334,12,mat.STEEL);
  L(1810,617,1830,659,10,mat.IRON);


  // R6 original course-finishing pass: physical racing decisions, no screenshot-only art.
  // Preserve the 31x27-capable y445 direct accelerator while creating authored optional lines.
  L(346,331,405,355,13,mat.STEEL);L(348,359,411,390,11,mat.IRON);
  P([[402,338],[433,350],[439,378],[418,391],[400,371]],mat.CONCRETE);
  R(414,350,15,13,mat.BLUE);R(418,354,7,4,mat.SIGNAL);
  // Crown-rooted elevated chicane: sawhead, asymmetrical deflector, over-iris gallery.
  L(510,237,539,297,10,mat.STEEL);
  P([[531,295],[553,304],[566,320],[555,339],[543,331]],mat.IRON);
  R(542,307,18,9,mat.BLUE);
  L(690,260,691,313,10,mat.STEEL);
  P([[690,315],[726,321],[740,344],[714,348]],mat.IRON);
  R(715,323,18,8,mat.SIGNAL);
  // Undercliff return: a separate slalom with alternate shallow roof/floor banks.
  P([[385,680],[406,653],[437,664],[452,692],[432,709],[400,706]],mat.CONCRETE);
  L(383,704,437,704,8,mat.STEEL);
  R(650,699,78,11,mat.STEEL);R(668,710,37,12,mat.CONCRETE);
  R(802,792,82,18,mat.STEEL);P([[802,790],[832,774],[884,789]],mat.CONCRETE);
  R(1300,703,78,13,mat.STEEL);P([[1312,717],[1342,729],[1378,715]],mat.CONCRETE);
  R(1466,799,98,14,mat.STEEL);P([[1481,800],[1514,780],[1552,798]],mat.CONCRETE);
  // Iris: the western 350px-high crossbar was rejected because it killed the 31x27 bypass.
  // Retain the legal crown crossing; one asymmetric east cue and working service switchbanks.
  L(1178,330,1224,353,10,mat.IRON);
  P([[1216,340],[1253,350],[1259,376],[1234,387]],mat.STEEL);
  R(1228,353,17,8,mat.BLUE);
  P([[943,610],[973,587],[999,597],[1002,622]],mat.CONCRETE);
  R(955,600,26,10,mat.STEEL);R(960,601,17,6,mat.SIGNAL);
  P([[1156,620],[1196,590],[1219,603],[1208,633]],mat.IRON);
  R(1181,606,25,10,mat.BLUE);
  // Glassstorm: locally supported inhabited weigh-station and irregular track underbelly.
  P([[1390,601],[1419,562],[1504,550],[1543,574],[1554,600]],mat.CONCRETE);
  P([[1418,574],[1482,562],[1508,576],[1486,590],[1415,590]],mat.STEEL);
  R(1430,573,46,15,mat.GLASSBLOCK);R(1440,578,14,6,mat.SIGNAL);
  L(1491,589,1491,615,9,mat.IRON);
  P([[1574,600],[1621,558],[1662,574],[1692,604]],mat.CONCRETE);
  R(1616,572,32,12,mat.STEEL);R(1622,575,20,6,mat.BLUE);
  // Recovery: non-forced lower loop mouth, recognizable dual-jaw braking geometry.
  L(1786,603,1818,565,13,mat.STEEL);
  P([[1808,563],[1847,545],[1878,553],[1870,578],[1831,591]],mat.CONCRETE);
  R(1832,560,28,11,mat.BLUE);
  P([[1968,356],[2008,368],[2027,396],[2001,402],[1979,387]],mat.STEEL);
  L(1916,578,1966,539,12,mat.IRON);
  P([[1955,527],[1999,516],[2024,539],[2002,559],[1973,553]],mat.CONCRETE);
  L(1832,822,1928,819,10,mat.STEEL);R(1881,817,24,10,mat.BLUE);


  // R7: true-cell high/low operational course finishing, grounded support and broad Midge clearances.
  // Consolidate peripheral R6 banks into actually alternating S-turns; all inert Solid native IDs.
  P([[678,695],[691,702],[715,706],[737,724],[758,737],[759,746],[684,746]],mat.BASALT);
  L(691,687,691,717,15,mat.STEEL);
  R(699,715,20,11,mat.BLUE);
  R(830,777,55,40,mat.BASALT);
  P([[830,778],[844,758],[869,758],[885,779]],mat.CONCRETE);
  R(852,775,24,8,mat.BLUE);
  L(859,800,859,836,13,mat.IRON);
  P([[1284,701],[1296,705],[1324,714],[1351,733],[1377,737],[1378,745],[1284,745]],mat.BASALT);
  L(1312,635,1314,724,14,mat.IRON);
  R(1337,729,23,9,mat.BLUE);
  R(1467,779,101,34,mat.BASALT);
  P([[1467,779],[1486,772],[1529,771],[1568,784]],mat.CONCRETE);
  L(1520,794,1520,836,15,mat.STEEL);
  R(1498,784,35,7,mat.BLUE);
  // Genuine cliff-tied western fork, supported east Iris approach and rooted high saw.
  L(410,681,329,656,14,mat.STEEL);
  L(329,656,310,686,16,mat.CONCRETE);
  R(356,662,31,8,mat.ZINC);
  L(1240,360,1355,129,10,mat.IRON);
  R(1266,307,24,9,mat.BLUE);
  L(689,259,660,191,10,mat.STEEL);
  L(660,191,634,199,12,mat.IRON);
  R(612,190,28,8,mat.BLUE);
  // Inhabited Glassstorm loading apron and visible service/underpass thresholds.
  R(1455,587,84,12,mat.STEEL);
  R(1470,578,50,10,mat.BLUE);
  L(1495,590,1495,619,11,mat.IRON);
  R(1492,568,18,8,mat.SIGNAL);
  L(460,670,482,639,9,mat.ZINC);
  R(451,650,24,9,mat.BLUE);
  L(1810,610,1864,558,12,mat.STEEL);
  R(1842,563,31,8,mat.BLUE);


  // R8 Fidelity finish (2026-11-19): authored actual material cells.
  // Dispatch: both former floating launcher guides are cardinal-joined to west bedrock.
  L(8,627,79,627,12,mat.STEEL);
  L(8,535,151,535,11,mat.IRON);
  // Split-current Iris: three lower crescents now resolve into deliberately
  // angled load cables and the existing founded y635 industrial service spine.
  L(992,584,1000,637,12,mat.IRON);
  L(1144,566,1189,639,10,mat.IRON);
  L(1159,573,1221,639,10,mat.STEEL);
  R(993,625,25,10,mat.BLUE);
  R(1174,629,32,9,mat.BLUE);
  // West descent: two separated, oblique structural horns make a recognisable
  // service/race portal. NO transverse bar, so the full actor shaft remains open.
  L(372,676,372,584,13,mat.IRON);
  L(372,584,396,551,12,mat.STEEL);
  L(542,681,541,581,12,mat.IRON);
  L(541,581,517,552,12,mat.STEEL);
  P([[374,555],[391,534],[414,538],[402,559]],mat.CONCRETE);
  P([[502,540],[530,533],[549,560],[524,566]],mat.CONCRETE);
  R(390,550,10,7,mat.BLUE);
  R(519,552,10,7,mat.SIGNAL);
  // East recovery: a different, splayed upward pair of horns marks the
  // ascent from technical lower tunnel into the east brake/recovery.
  L(1650,639,1651,580,13,mat.IRON);
  L(1651,580,1696,548,12,mat.STEEL);
  L(1811,687,1811,589,13,mat.IRON);
  L(1811,589,1773,551,12,mat.STEEL);
  P([[1694,543],[1726,536],[1739,547],[1725,557],[1703,553]],mat.BLUE);
  P([[1764,544],[1787,539],[1801,549],[1790,562],[1771,557]],mat.SIGNAL);
  // Four differentiated slope-identifying "dive / crest" bank inlays.
  // These REMATERIALIZE EXISTING occupied rock only: no collision addition.
  function faceInlay(x0,y0,x1,y1,expected,replacement,pred){
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const ix=y*W+x;if(g[ix]===expected&&pred(x,y))g[ix]=replacement;
    }
  }
  faceInlay(681,703,759,746,mat.BASALT,mat.ZINC,(x,y)=>((x+2*y)%37)<6);
  faceInlay(830,778,884,816,mat.BASALT,mat.BLUE,(x,y)=>((2*x-y)%43)<8);
  faceInlay(1284,702,1378,746,mat.BASALT,mat.ZINC,(x,y)=>((x+y)%41)<7);
  faceInlay(1467,778,1568,813,mat.BASALT,mat.BLUE,(x,y)=>((2*x+y)%47)<7);
  // Glassstorm: an asymmetrical single-load weigh beam, calibration marker
  // and angled supported delivery heel, not an endlessly duplicated box row.
  L(1411,603,1464,589,10,mat.IRON);
  L(1464,589,1531,601,10,mat.STEEL);
  R(1455,582,29,8,mat.QUARTZ);
  R(1520,588,16,9,mat.SIGNAL);
  L(1499,604,1535,628,8,mat.ZINC);
  // Outboard solid brake fins rooted in the far-right world boundary;
  // placed safely above the horizontal y446 Midge finishing corridor.
  P([[2039,248],[2007,271],[1988,291],[2006,302],[2040,298]],mat.IRON);
  P([[2039,315],[2009,330],[1994,352],[2017,362],[2040,357]],mat.STEEL);
  R(2003,336,15,6,mat.SIGNAL);
  for(const x of [1856,1902,1950]){
    R(x,852,18,5,mat.ZINC);R(x+4,846,10,5,mat.BLUE);
  }


  // R9 exact-cell art/wayfinding repair, 19 Nov 2026. All texture marks are
  // conditioned on occupied solids: no collision changes in racing bank faces.
  function tintStroke(x0,y0,x1,y1,width,m) {
    const dx=x1-x0,dy=y1-y0,len2=dx*dx+dy*dy,rad=width/2;
    for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-rad));y<=Math.min(H-1,Math.ceil(Math.max(y0,y1)+rad));y++)
      for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-rad));x<=Math.min(W-1,Math.ceil(Math.max(x0,x1)+rad));x++){
        const t=Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/(len2||1)));
        if((x-x0-t*dx)**2+(y-y0-t*dy)**2<=rad*rad && g[y*W+x])g[y*W+x]=m;
      }
  }
  function tintFace(points,m) {
    const lo=Math.max(0,Math.ceil(Math.min(...points.map(p=>p[1]))));
    const hi=Math.min(H-1,Math.floor(Math.max(...points.map(p=>p[1]))));
    for(let y=lo;y<=hi;y++){
      let cuts=[];
      for(let j=0;j<points.length;j++){
        const a=points[j],b=points[(j+1)%points.length];
        if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))
          cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
      }
      cuts.sort((a,b)=>a-b);
      for(let j=0;j+1<cuts.length;j+=2)
        for(let x=Math.max(0,Math.ceil(cuts[j]));x<=Math.min(W-1,Math.floor(cuts[j+1]));x++)
          if(g[y*W+x])g[y*W+x]=m;
    }
  }
  // Large grounded entrance-edge cues carried to actual traversable throats.
  for(const [x0,y0,x1,y1,w,m] of [
    [350,554,355,693,28,mat.QUARTZ],[560,555,565,690,29,mat.BLUE],
    [302,567,356,605,17,mat.SIGNAL],[580,568,553,610,18,mat.QUARTZ],
    [1636,570,1642,677,29,mat.BLUE],[1827,582,1824,696,29,mat.QUARTZ],
    [1602,622,1650,573,19,mat.SIGNAL],[1822,601,1860,639,19,mat.BLUE]
  ])tintStroke(x0,y0,x1,y1,w,m);
  tintFace([[319,644],[367,633],[370,650],[327,671]],mat.IRON);
  tintFace([[552,656],[608,642],[616,658],[561,678]],mat.IRON);
  tintFace([[1601,652],[1658,649],[1660,669],[1610,680]],mat.ZINC);
  tintFace([[1809,661],[1865,651],[1870,669],[1813,680]],mat.ZINC);

  // Opposed stator/collector housings: rooted on existing service structure,
  // readable split into above-crown bypass and lower-transfer approach.
  P([[800,618],[813,578],[846,552],[881,568],[909,606],[895,632]],mat.IRON);
  P([[1191,613],[1218,565],[1250,555],[1279,581],[1292,629],[1241,641]],mat.STEEL);
  P([[810,608],[839,579],[858,588],[850,622],[813,623]],mat.BLUE);
  P([[1228,598],[1244,574],[1267,582],[1276,614],[1243,629]],mat.BLUE);
  R(829,591,17,20,mat.GLASSBLOCK);R(1249,591,15,21,mat.QUARTZ);
  L(827,626,860,636,14,mat.IRON);L(1251,631,1234,638,13,mat.IRON);
  L(1137,555,1107,637,12,mat.IRON);R(1120,623,28,10,mat.BLUE);
  tintStroke(832,598,858,613,13,mat.SIGNAL);
  tintStroke(1259,597,1238,615,13,mat.SIGNAL);

  // Four differently coded full-size bank faces, no extra flight collision.
  tintFace([[679,705],[708,708],[757,736],[746,745],[696,725]],mat.QUARTZ);
  tintStroke(684,712,738,740,11,mat.BLUE);
  tintFace([[832,786],[841,771],[855,765],[867,779],[880,784],[881,800],[858,791]],mat.BLUE);
  tintStroke(840,789,882,807,10,mat.SIGNAL);
  tintFace([[1285,706],[1317,711],[1350,731],[1376,739],[1370,744],[1335,728],[1293,720]],mat.QUARTZ);
  tintStroke(1292,713,1362,737,12,mat.SIGNAL);
  tintFace([[1470,787],[1490,778],[1524,779],[1557,786],[1560,798],[1521,790],[1481,800]],mat.BLUE);
  tintStroke(1481,805,1552,799,14,mat.QUARTZ);

  // One enterable inspection bay (not a cloned scenic box): hollow, two
  // accessible mouths, rooted weigh floor, directed upper infeed.
  R(1415,648,189,43,mat.E);R(1378,651,44,38,mat.E);R(1602,649,38,42,mat.E);
  L(1418,694,1607,694,9,mat.CONCRETE);
  L(1423,643,1595,643,8,mat.STEEL);
  R(1452,694,122,10,mat.IRON);R(1467,698,97,7,mat.BLUE);
  P([[1444,641],[1463,625],[1514,624],[1548,640]],mat.STEEL);
  R(1463,634,52,9,mat.GLASSBLOCK);R(1500,634,15,8,mat.SIGNAL);
  L(1490,641,1506,617,9,mat.IRON);

  // True brake jaws flank y446 actual finish without sealing the flight line.
  P([[1959,381],[1992,372],[2040,386],[2040,411],[2001,407],[1979,418]],mat.STEEL);
  P([[1961,500],[1992,488],[2040,483],[2040,526],[1991,538],[1968,518]],mat.IRON);
  L(1981,410,2038,411,9,mat.ZINC);L(1978,499,2040,489,10,mat.ZINC);
  R(2012,400,24,7,mat.BLUE);R(2015,497,21,7,mat.SIGNAL);
  tintStroke(1925,392,1976,414,16,mat.QUARTZ);
  tintStroke(1927,508,1971,517,15,mat.BLUE);

  // Root-preserving inspection-bay descent at x1400, no slash through support piers.
  R(1400,678,58,82,mat.E);

  // R10 Shepherd rework: make this a three-stage industrial race facility,
  // not a field of tiny repeated signs. All colour changes below are made
  // strictly inside ALREADY OCCUPIED material cells, preserving collision.
  function r10Tint(x0,y0,x1,y1,from,to) {
    let n=0;
    for(let y=Math.max(0,y0);y<=Math.min(H-1,y1);y++)
      for(let x=Math.max(0,x0);x<=Math.min(W-1,x1);x++){
        const i=y*W+x;
        if(g[i]===from){g[i]=to;n++;}
      }
    return n;
  }
  // Clear conflicting micro-signals around the weigh line and catch throat.
  r10Tint(1320,558,1680,633,mat.SIGNAL,mat.STEEL);
  r10Tint(1380,613,1654,712,mat.SIGNAL,mat.IRON);
  r10Tint(1824,291,2036,556,mat.SIGNAL,mat.STEEL);
  // A racing line clearly traverses INFEED -> FULL-SIZE SCALE -> RELEASE:
  // three radically different signal bands on the existing rail/support faces.
  // The actual weighing bay at (1500,670) stays an unobstructed void.
  tintFace([[1367,588],[1439,574],[1452,606],[1382,615]],mat.BLUE);
  tintStroke(1382,601,1442,591,22,mat.QUARTZ);
  tintFace([[1449,620],[1497,613],[1518,631],[1484,645],[1451,640]],mat.ZINC);
  tintStroke(1440,639,1565,640,22,mat.QUARTZ);
  tintStroke(1452,699,1567,700,21,mat.BLUE);
  tintFace([[1544,610],[1596,604],[1634,627],[1597,641],[1557,630]],mat.IRON);
  tintStroke(1575,637,1653,620,18,mat.SIGNAL);
  tintStroke(1571,697,1636,691,17,mat.QUARTZ);
  // Calibrated rail-scale tick blocks are integrated INTO the existing
  // solid floor rather than small floating tokens in the flight envelope.
  for(const x of [1469,1490,1511,1532,1553]){
    tintStroke(x,694,x+9,705,10,mat.QUARTZ);
  }
  // Directional, oversized cues placed on real west/east portal masonry.
  // One west fork promises DESCENT; opposite east portal promises ASCENT.
  tintStroke(330,614,365,661,35,mat.QUARTZ);
  tintStroke(561,630,585,681,32,mat.BLUE);
  tintStroke(1649,662,1624,616,34,mat.BLUE);
  tintStroke(1805,662,1835,618,34,mat.QUARTZ);
  tintFace([[360,632],[386,635],[404,666],[377,663]],mat.SIGNAL);
  tintFace([[1789,624],[1817,625],[1805,655],[1776,661]],mat.BLUE);
  // Large silhouette/contrast lead-in to the actual slalom turns:
  // only rock already occupied receives this colour; zero new obstacles.
  tintStroke(625,708,680,730,24,mat.BLUE);
  tintStroke(775,804,829,790,25,mat.QUARTZ);
  tintStroke(1231,713,1307,734,24,mat.SIGNAL);
  tintStroke(1415,809,1490,790,27,mat.QUARTZ);
  // The deceleration catcher is an obvious twin-rail throat at the
  // actual y446 finish, attached to the established right-hand jaws.
  // Its solid upper/lower lips remain safely away from 31x27 y446.
  L(1874,396,2008,400,11,mat.STEEL);
  L(1878,501,2008,502,12,mat.IRON);
  L(1997,400,2005,351,12,mat.ZINC);
  L(1998,503,2006,516,12,mat.ZINC);
  tintStroke(1880,399,1970,402,15,mat.QUARTZ);
  tintStroke(1882,500,1970,502,16,mat.BLUE);
  // A single broad mechanical speed-trap fascia instead of small trim.
  tintFace([[1980,380],[2003,375],[2039,385],[2039,406],[1996,399]],mat.BLUE);
  tintFace([[1981,521],[2009,512],[2039,508],[2039,531],[1996,532]],mat.IRON);


  // R11: subtractive race-line repair following exact-R10 Shepherd feedback.
  // Selectively erase only independently ungrounded decoration in the crowded
  // eastern flyover and the obsolete midshaft dangling unit; preserve supported
  // steelworks, intentionally engineered 31x27 race obstacles and actor sites.
  function clearDetachedWhere(want){
    const visited=new Uint8Array(W*H),queue=new Int32Array(W*H);
    for(let start=0;start<g.length;start++){
      if(!g[start]||visited[start])continue;
      let rd=0,wr=1,x0=W,x1=0,y0=H,y1=0,boundary=false;
      queue[0]=start;visited[start]=1;
      while(rd<wr){
        const i=queue[rd++],x=i%W,y=(i/W)|0;
        x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
        if(x===0||x===W-1||y===0||y===H-1)boundary=true;
        for(const k of [x>0?i-1:-1,x+1<W?i+1:-1,y>0?i-W:-1,y+1<H?i+W:-1])
          if(k>=0&&g[k]&&!visited[k]){visited[k]=1;queue[wr++]=k;}
      }
      if(!boundary&&want(x0,x1,y0,y1,wr))
        for(let j=0;j<wr;j++)g[queue[j]]=mat.E;
    }
  }
  clearDetachedWhere((x0,x1,y0,y1,n)=>
    (x0>=450&&x1<=489&&y0>=630&&y1<=680&&n>=500) ||
    (x0>=1300&&x1<=1800&&y0>=280&&y1<=390&&n<=250)
  );
  // Old lower-bank floating equipment now has true founded load members.
  // Posts begin below the qualified bank apertures and connect to bedrock.
  L(668,807,668,884,15,mat.IRON);
  L(1358,806,1358,883,15,mat.STEEL);
  // Consolidate signal-colour noise strictly on already occupied solids;
  // no physically collidable "painted" pixels are added in the flight void.
  r10Tint(1320,250,1772,387,mat.SIGNAL,mat.IRON);
  r10Tint(1710,547,1950,691,mat.SIGNAL,mat.STEEL);
  // Three sequential working-scale stages: wide intake, calibration platform,
  // broad release throat. Actual inspection centre (1500,670) remains clear.
  R(1369,647,53,45,mat.E);
  R(1597,647,50,45,mat.E);
  L(1460,642,1558,642,11,mat.STEEL);
  tintStroke(1465,641,1553,641,11,mat.QUARTZ);
  tintStroke(1374,604,1419,611,21,mat.BLUE);
  tintStroke(1592,611,1632,622,21,mat.ZINC);
  tintFace([[1372,593],[1394,582],[1434,594],[1437,616],[1392,612]],mat.CONCRETE);
  tintFace([[1468,696],[1560,696],[1572,707],[1454,709]],mat.BLUE);
  tintFace([[1584,597],[1627,596],[1642,626],[1608,632]],mat.IRON);
  // One high-contrast approach / capture / release progression on the two
  // supported jaws, instead of detached lights in the Midge race aperture.
  tintStroke(1863,398,1930,399,17,mat.ZINC);
  tintStroke(1932,399,2005,402,17,mat.QUARTZ);
  tintStroke(1865,501,1930,502,17,mat.BLUE);
  tintStroke(1932,502,2005,502,17,mat.IRON);
  // Eastern below-jaw release-pocket void, clear of the y445 fast line.
  R(1964,547,32,26,mat.E);
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


  // R5: verify true four-connected material grounding from every world edge.
  // This supplements (not replaces) the airspace actor-envelope tests below.
  const grounded=new Uint8Array(W*H), groundQueue=new Int32Array(W*H);
  let gRead=0,gWrite=0;
  function seedGround(x,y){
    const i=y*W+x;
    if(g[i]&&!grounded[i]){grounded[i]=1;groundQueue[gWrite++]=i;}
  }
  for(let x=0;x<W;x++){seedGround(x,0);seedGround(x,H-1);}
  for(let y=1;y<H-1;y++){seedGround(0,y);seedGround(W-1,y);}
  while(gRead<gWrite){
    const i=groundQueue[gRead++],x=i%W,y=(i/W)|0;
    for(const v of [x>0?i-1:-1,x+1<W?i+1:-1,y>0?i-W:-1,y+1<H?i+W:-1]){
      if(v>=0&&g[v]&&!grounded[v]){grounded[v]=1;groundQueue[gWrite++]=v;}
    }
  }
  const supportSites=[
    ["Western dispatch core",200,180],
    ["Western apron",200,604],
    ["Drift engineering",700,640],
    ["Iris structural crown",1007,191],
    ["Glassstorm anchored service span",1500,620],
    ["East braking jaw",2005,335],
    ["West entry rail",410,681],
    ["West slalom floor rooted",859,795],
    ["Iris east tension anchorage",1240,360],
    ["East slalom roof rooted",1314,713],
    ["East slalom floor rooted",1520,803],
    ["Canyon overhead root",660,191],
    ["Lower launch guide connected",172,627],
    ["Upper launch guide connected",214,535],
    ["Left Iris arc connected",992,584],
    ["Right Iris arc A connected",1144,566],
    ["Right Iris arc B connected",1159,573],
    ["Weigh-bay entry frame",1490,641],
    ["West stator collector",830,605],
    ["East stator collector",1253,603],
    ["Upper brake catch",2000,398],
    ["Lower brake catch",2000,512],
    ["R10 upper continuous catch rail",1900,397],
    ["R10 lower continuous catch rail",1900,501],
    ["R11 west low-floor bank mooring",668,820],
    ["R11 east low-floor bank mooring",1358,820]
  ];
  for(const [name,x,y] of supportSites){
    if(!grounded[y*W+x])throw Error("STRUCTURAL_SUPPORT_FAIL "+name+" ("+x+","+y+")");
  }

  const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
  const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[116,445],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
  const json=JSON.stringify(setup);
  if(json.length>1048576)throw Error("BYTE_BUDGET_FAIL "+json.length);
  // Strict fully-contained actor-centre envelope 4-neighbour connected pass. No nearest-point relocation.
  const sites=[
    ["Launch cradle",116,445],["Dispatch roof bypass",203,329],["Split-canyon high",617,356],
    ["West dive shaft",443,612],["West undercroft",614,752],["Iris west approach",841,445],
    ["Iris central chamber",1037,448],["Iris lower transfer",1072,753],
    ["East conductor",1323,454],["Glassstorm viaduct",1506,453],["Weigh inspection bay",1500,670],
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
  if(Object.values(reachable).some(v=>v.sites.filter(s=>s[1]).length!==sites.length))throw Error("EXACT_SITE_CLEARANCE_FAIL");

  // R7 exact 31x27 lower-corridor-only path. Full actor rectangle: never use the main y445 shortcut.
  function lowerCorridorProof(){
    const sw=W+1,sat=new Uint32Array((W+1)*(H+1));
    for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=g[y*W+x]!==0;sat[(y+1)*sw+x+1]=sat[y*sw+x+1]+s;}}
    function legal(x,y){
      if(x<15||x>=W-15||y<13||y>=H-13)return false;
      const a=x-15,b=x+15,c=y-13,d=y+13;
      return sat[(d+1)*sw+b+1]-sat[c*sw+b+1]-sat[(d+1)*sw+a]+sat[c*sw+a]===0;
    }
    const names=[["West tunnel entry",614,752],["West ceiling bank",728,776],["West floor bank",854,721],["Iris lower transit",1072,753],["East ceiling bank",1338,772],["East floor bank",1520,742],["East tunnel exit",1614,753]];
    const pass=new Uint8Array(W*H);
    for(let y=700;y<=802;y++)for(let x=580;x<=1650;x++)if(legal(x,y))pass[y*W+x]=1;
    const st=752*W+614;if(!pass[st])throw Error("LOWER_CORRIDOR_SPAWN_NOT_CLEAR");
    const seen=new Uint8Array(W*H),q=new Int32Array(W*H),dist=new Int32Array(W*H);
    q[0]=st;seen[st]=1;let read=0,write=1;
    while(read<write){const v=q[read++],x=v%W,y=(v/W)|0;
      for(const n of [x>0?v-1:-1,x+1<W?v+1:-1,y>0?v-W:-1,y+1<H?v+W:-1]){
        if(n>=0&&pass[n]&&!seen[n]){seen[n]=1;dist[n]=dist[v]+1;q[write++]=n;}
      }
    }
    const actual=names.map(([name,x,y])=>({name,x,y,exact_legal:!!pass[y*W+x],reachable:!!seen[y*W+x],steps:dist[y*W+x]}));
    if(actual.some(v=>!v.reachable))throw Error("LOWER_CORRIDOR_OPTION_NOT_CONNECTED "+JSON.stringify(actual));
    const windows=[700,728,854,890,1338,1520].map(x=>{const ys=[];for(let y=700;y<=802;y++)if(pass[y*W+x])ys.push(y);return {x,min:ys[0],max:ys[ys.length-1],count:ys.length};});
    return {corridor_bounds:[580,700,1650,802],clearance:[31,27],fully_in_bounds:true,access_points:actual,connected_centres:write,windows};
  }
  const lowerCorridor=lowerCorridorProof();

  const bypass=flood(31,27,[900,330,1110,554]);
  const fullHullBlocked=flood(31,27,[885,317,1125,567]);
  if(fullHullBlocked.sites.filter(s=>s[1]).length!==14||!fullHullBlocked.sites.find(s=>s[0]==="Brake finish")[1])throw Error("FULL_HULL_PHYSICAL_IRIS_BYPASS_FAIL");
  // Material catalogue exact RGB palette, indexed 4-bit lossless pixel parity.
  function encodePNG(x0,y0,ww,hh,step=1){
    const stride=1+ww/2,raw=new Uint8Array(stride*hh);
    const toIndex=new Int16Array(256);toIndex.fill(-1);for(let i=0;i<indexToMaterial.length;i++)toIndex[indexToMaterial[i]]=i;
    for(let y=0;y<hh;y++)for(let x=0;x<ww;x+=2){
      const a=toIndex[g[(y0+y*step)*W+x0+x*step]],b=toIndex[g[(y0+y*step)*W+x0+(x+1)*step]];
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
      if(indexToMaterial[ind]!==g[(y*step+y0)*W+x*step+x0])pDiff++;
    }
    if(pDiff)throw Error("PNG_PIXEL_PARITY "+pDiff);
    return {bytes:png,pixels:ww*hh,chunkCRC:"PASS",adler:"PASS",materialPixelsVerified:ww*hh};
  }
  const gallery=[
    ["overview.png",0,0,2048,1024],
    ["overview-review-2x.png",0,0,1024,512,2],
    ["01-launch-cradle.png",0,160,512,384],
    ["02-drift-canyon.png",384,140,512,384],
    ["03-split-current-iris.png",760,164,512,384],
    ["04-glassstorm-viaduct.png",1240,232,512,384],
    ["05-catch-recovery.png",1536,540,512,384],
    ["06-lower-s-turn-west.png",580,640,512,384],
    ["07-lower-s-turn-east.png",1150,640,512,384],
    // R8 explicit 1:1 evidence for the newly anchored arcs and two distinct gates.
    ["08-iris-service-braces.png",780,440,512,384],
    ["09-west-dive-portal.png",310,450,512,384],
    ["10-east-return-portal.png",1490,450,512,384],
    // R9 additional true 1:1 functional-room and finish-jaw evidence.
    ["11-weigh-inspection-bay.png",1280,550,512,384],
    ["12-finish-catch-jaws.png",1536,280,512,384]
  ].map(p=>({name:p[0],region:p.slice(1),...encodePNG(...p.slice(1))}));
  const hist={};for(const v of g)hist[v]=(hist[v]||0)+1;
  return {W,H,seed,grid:g,json,edits,sites,reachable,bypass,fullHullBlocked,lowerCorridor,supportSites,grounded,hist,materials:mat,gallery,mismatches,collisions};
}

const r=buildWideCanvas();
const crypto=require("node:crypto");
const shab=(v)=>crypto.createHash("sha256").update(v).digest("hex");
const setupName="setup-thunderclap-switchyard.json";
const prior=JSON.parse(fs.readFileSync("qualification.json","utf8"));
let delta=prior.r10_to_r11_cell_delta;
if(!delta) {
 const old=JSON.parse(fs.readFileSync(setupName,"utf8")),oldGrid=new Uint8Array(r.W*r.H);
 for(const [x,y,w,h,m] of old.edits)for(let yy=y;yy<y+h;yy++)oldGrid.fill(m,yy*r.W+x,yy*r.W+x+w);
 let added=0,removed=0,rematerialized=0;
 for(let i=0;i<oldGrid.length;i++) {
  const a=oldGrid[i],b=r.grid[i];
  if(a===b)continue;
  if(!a)added++;else if(!b)removed++;else rematerialized++;
 }
 delta={added,removed,rematerialized,changed_total:added+removed+rematerialized};
}
const pngs=r.gallery.map(p=>({
 file:p.name,dimensions:[p.region[2],p.region[3]],sample_step:p.region[4]||1,
 bytes:p.bytes.length,sha256:shab(Buffer.from(p.bytes)),
 crc32:p.chunkCRC,adler32:p.adler,material_pixel_parity:p.materialPixelsVerified
}));
const writtenVisits=r.edits.reduce((n,e)=>n+e[2]*e[3],0);
const receipt={
 ...prior,
 kind:"CYBERSAND_ORIGINAL_LANDSCAPE_RACING_WIDE_R11",
 created_utc:"2026-11-19",
 previous_branch_head:"bdda61a729a33a2494d036f79dc7702482f7195f",
 engine_main_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",
 terrain_rectangles:r.edits.length,
 setup_json_bytes:Buffer.byteLength(r.json,"utf8"),
 cell_visits:writtenVisits,
 overlapping_edits:r.collisions,
 replay_mismatches:r.mismatches,
 grid_sha256:shab(Buffer.from(r.grid)),
 json_sha256:shab(Buffer.from(r.json,"utf8")),
 material_histogram:r.hist,
 named_sites:r.sites.map(v=>({name:v[0],x:v[1],y:v[2]})),
 exact_reach:Object.fromEntries(Object.entries(r.reachable).map(([k,v])=>[k,{reached:v.sites.filter(z=>z[1]).length,total:v.sites.length,connected_centres:v.size}])),
 physical_iris_obstruction:{
   physical_box:[900,330,1110,554],
   reached:r.fullHullBlocked.sites.filter(z=>z[1]).map(z=>z[0]),
   unreachable:r.fullHullBlocked.sites.filter(z=>!z[1]).map(z=>z[0]),
   connected_centres:r.fullHullBlocked.size
 },
 lower_corridor_only:r.lowerCorridor,
 grounded_support_probes:r.supportSites.map(([name,x,y])=>({name,x,y,cardinal_grounding:!!r.grounded[y*r.W+x]})),
 detached_solid_cells:writtenVisits-r.grounded.reduce((v,x)=>v+x,0),
 r10_to_r11_cell_delta:delta,
 pngs,
 installed_bridge_rectangle_capacity:"NATIVE-UNTESTED",
 native_workbench_install_input_collision_simulation_save_reopen:"NATIVE-UNTESTED",
 code_execution:"Node 22 GitHub Actions; independent exact-setup replay and committed PNG verification in verify-independent.cjs"
};
delete receipt.r8_to_r9_cell_delta;
 delete receipt.r9_to_r10_cell_delta;
if(receipt.terrain_rectangles>32768||receipt.setup_json_bytes>1048576||receipt.cell_visits>32000000)throw Error("CAPACITY");
if(receipt.exact_reach["31x27"].reached!==15||receipt.physical_iris_obstruction.reached.length!==14)throw Error("CLEARANCE");
const artifacts=[
 [setupName,Buffer.from(r.json,"utf8")],
 ...r.gallery.map(p=>[p.name,Buffer.from(p.bytes)]),
 ["qualification.json",Buffer.from(JSON.stringify(receipt,null,2)+"\n","utf8")]
];
let ok=true;
for(const [name,bytes] of artifacts){
 if(process.argv.includes("--verify")){
   if(!fs.existsSync(name)||!fs.readFileSync(name).equals(bytes)){
     console.error("FAIL:",name);ok=false;
   }else console.log("PASS:",name,bytes.length);
 } else {fs.writeFileSync(name,bytes);console.log("WRITE:",name,bytes.length);}
}
console.log("R11",JSON.stringify({
 rectangles:receipt.terrain_rectangles,bytes:receipt.setup_json_bytes,
 grid:receipt.grid_sha256,delta,reach:receipt.exact_reach,
 lower:receipt.lower_corridor_only.access_points.length,detached:receipt.detached_solid_cells
}));
if(!ok)process.exitCode=1;
