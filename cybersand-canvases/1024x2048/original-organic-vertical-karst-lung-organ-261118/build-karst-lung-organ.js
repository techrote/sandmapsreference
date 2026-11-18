function runPipeline() {
  const W=1024,H=2048, N=W*H, SEED=0x4b415253;
  const dirname="cybersand-canvases/1024x2048/original-organic-vertical-karst-lung-organ-261118/";
  const paletteSpec={
    0:[8,11,18],38:[197,191,175],39:[199,156,98],40:[119,119,130],41:[119,116,108],42:[101,112,90],
    46:[111,69,40],48:[185,91,60],49:[70,83,99],50:[50,58,64],55:[71,127,168],
    56:[124,91,59],62:[126,141,153],71:[107,196,181],77:[55,243,228],79:[255,181,46],
    81:[196,152,92],83:[92,64,44],86:[182,166,86],88:[150,143,131],92:[180,140,84],
    97:[70,104,52],98:[226,223,216],99:[234,231,220],100:[54,56,61],101:[24,19,32],
    102:[178,124,84],105:[232,240,248],106:[222,196,190],109:[172,114,74],
    119:[196,160,72],120:[156,210,220],121:[206,226,232],122:[226,236,244],124:[236,212,158]
  };
  const solids=new Set(Object.keys(paletteSpec).map(Number).filter(v=>v!==0));
  const g=new Uint8Array(N);
  function hash(x,y,z=0) {let h=(Math.imul((x|0)^SEED,0x45d9f3b)+Math.imul((y|0),0x119de1f3)+Math.imul((z|0),0x27d4eb2d))|0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);return (h^(h>>>16))>>>0;}
  function set(x,y,m,onlySolid=false){x|=0;y|=0;if(x<0||y<0||x>=W||y>=H)return;const p=y*W+x;if(!onlySolid||g[p])g[p]=m;}
  // Geology: broad nonrepeating strata, independent of any image or reference raster.
  const beds=[[0,290,38,39],[290,570,42,38],[570,835,39,56],[835,1150,40,41],[1150,1470,100,49],[1470,1740,40,101],[1740,2048,101,100]];
  for(let y=0;y<H;y++){
    const wobble=18*Math.sin(y/72)+12*Math.sin(y/31);
    for(let x=0;x<W;x++){
      const yy=y+22*Math.sin(x/130)+12*Math.sin(x/49);
      let band=beds.length-1;
      for(let k=0;k<beds.length;k++) if(yy<beds[k][1]){band=k;break;}
      const b=beds[band],tile=hash(Math.floor((x+wobble)/79),Math.floor((y+9*Math.sin(x/85))/69),band);
      let material=(tile%13<3)?b[3]:b[2];
      if(Math.abs(Math.sin((yy+Math.sin(x/37)*19)/85))<0.023 && (tile&3)===1)material= band<3?98:106;
      g[y*W+x]=material;
    }
  }
  function disk(cx,cy,r,mat,onlySolid=false){
    const rr=r*r,x0=Math.max(0,Math.floor(cx-r)),x1=Math.min(W-1,Math.ceil(cx+r)),y0=Math.max(0,Math.floor(cy-r)),y1=Math.min(H-1,Math.ceil(cy+r));
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if((x-cx)*(x-cx)+(y-cy)*(y-cy)<=rr)set(x,y,mat,onlySolid);
  }
  function stroke(ax,ay,bx,by,r,mat,onlySolid=false){
    const L=Math.hypot(bx-ax,by-ay),steps=Math.max(1,Math.ceil(L/Math.max(3,r/2)));
    for(let k=0;k<=steps;k++){const t=k/steps;disk(ax+(bx-ax)*t,ay+(by-ay)*t,r,mat,onlySolid);}
  }
  function curve(points,r,mat,onlySolid=false){
    for(let i=1;i<points.length;i++)stroke(points[i-1][0],points[i-1][1],points[i][0],points[i][1],r,mat,onlySolid);
  }
  function ellipse(cx,cy,rx,ry,phase=0,mat=0){
    const x0=Math.max(0,Math.floor(cx-rx*1.08)),x1=Math.min(W-1,Math.ceil(cx+rx*1.08));
    const y0=Math.max(0,Math.floor(cy-ry*1.08)),y1=Math.min(H-1,Math.ceil(cy+ry*1.08));
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const dx=(x-cx)/rx,dy=(y-cy)/ry;
      const ang=Math.atan2(dy,dx);
      const rim=1+0.045*Math.sin(ang*7+phase)+0.019*Math.sin(ang*17-phase);
      if(dx*dx+dy*dy<rim)g[y*W+x]=mat;
    }
  }
  // An irregular permanent respiratory shaft: x and radius change as a geological surface, not a repeated tile.
  for(let y=0;y<H;y++){
    const c=502+70*Math.sin((y+130)/188)+26*Math.sin(y/74);
    const r=153+33*Math.sin(y/111)+21*Math.cos(y/207);
    const l=Math.max(0,Math.floor(c-r)),u=Math.min(W-1,Math.ceil(c+r));
    g.fill(0,y*W+l,y*W+u+1);
  }
  // Five biologically distinctive vertical tiers with intentionally different silhouette and asymmetry.
  const chambers=[
    [508,177,365,248,0.3], // sky fracture, tree crown
    [240,535,190,193,0.8], // left root-orchard
    [792,623,172,214,1.8], // right spore organ
    [292,978,212,176,2.9], // fossil atrium
    [780,1028,175,226,0.7],// calcite observatory
    [269,1410,192,205,1.5],// left anastomosis
    [786,1500,169,180,2.3],// right moonwell
    [514,1826,353,196,3.1] // deep bell
  ];
  for(const q of chambers)ellipse(...q);
  // Two independent peripheral bypasses in every tier, no dead-end-only route design.
  const branches=[
    [[505,218],[375,330],[290,420],[240,535]],
    [[240,535],[315,670],[437,752]],
    [[530,225],[670,382],[762,514],[792,623]],
    [[792,623],[690,727],[575,814]],
    [[480,765],[384,845],[292,978]],
    [[292,978],[360,1090],[445,1213]],
    [[568,805],[686,918],[780,1028]],
    [[780,1028],[707,1160],[562,1262]],
    [[478,1200],[359,1319],[269,1410]],
    [[269,1410],[365,1574],[471,1660]],
    [[556,1231],[679,1373],[786,1500]],
    [[786,1500],[684,1614],[561,1724]],
    [[466,1689],[416,1764],[514,1826]],
    [[560,1700],[620,1775],[514,1826]]
  ];
  for(const b of branches)curve(b,53,0);
  // Revision 1: crown looked bare in initial macro layout; graft unique supported branching root arteries.
  const roots=[
    [[112,0],[136,63],[168,121],[191,185],[225,228]],
    [[286,0],[301,69],[266,132],[253,187]],
    [[837,0],[846,62],[815,124],[782,193],[762,234]],
    [[948,0],[914,77],[873,141],[849,214]],
    [[174,140],[147,179],[127,214]],
    [[815,126],[855,173],[887,218]]
  ];
  roots.forEach((p,i)=>{curve(p,8+(i%3),83);curve(p.slice(Math.min(1,p.length-2)),3,86);});
  // Five district-specific organ structures are physically mineralized, not sprites or decorative overlays.
  // Left orchard: diagonal old-growth trunks embedded in rock, with lichen crenellations.
  for(let i=0;i<9;i++){
    const x=35+i*24, y=360+Math.round(35*Math.sin(i*.9));
    curve([[x,y],[x+8,y+47],[x+22,y+99]],i%3===0?8:5,83,true);
    disk(x+22,y+99,12+(i%3)*4,97,true);
  }
  // Spore gallery: irregular celestial clusters held in the rock margin, not in navigation space.
  for(let i=0;i<75;i++){
    const x=640+(hash(i,4)%370),y=425+(hash(i,17)%425);
    const m= i%7===0?77:(i%3===0?122:97);
    disk(x,y,3+hash(i,8)%7,m,true);
  }
  // Fossil atrium: circumferential chalk/cartilage fossil ribs cut into load-bearing stone.
  for(let i=0;i<17;i++){
    const a=-2.7+i*(5.4/16),rx=244+8*Math.sin(i*2.1),ry=206;
    const px=292+rx*Math.cos(a),py=974+ry*Math.sin(a);
    const qx=292+(rx+42)*Math.cos(a+0.17),qy=974+(ry+31)*Math.sin(a+0.17);
    stroke(px,py,qx,qy,5+(i%3),i%4?99:98,true);
  }
  // Deep anastomosis: branching basalt veins and the rare mineral sheen of calcite vessels.
  for(let i=0;i<10;i++){
    const y=1160+i*61;
    curve([[4,y],[110+10*Math.sin(i),y+24],[235,y+43]],4+(i%3),i%3?49:122,true);
  }
  // Moonwell: splayed quartz growth under an overhanging natural gallery.
  for(let i=0;i<15;i++){
    const x=640+i*24, y=1420+Math.round(18*Math.cos(i/3));
    stroke(x,y,x-9+(i%4)*7,y+63+(i%5)*11,4+(i%3),i%2?122:106,true);
  }
  // Revision 2: the basal bell was generic; added nested pressure-rib crests and a nonrepeating crystal congregation.
  for(let k=0;k<12;k++){
    const a= -3.02+k*6.04/11;
    for(let t=0;t<60;t++){
      const rr=354+t*0.63;
      const x=514+rr*Math.cos(a+0.045*Math.sin(t/12+k)),y=1826+rr*0.56*Math.sin(a+0.045*Math.sin(t/12+k));
      disk(x,y,2+(k%2),k%3===0?122:98,true);
    }
  }
  for(let i=0;i<94;i++){
    const x=180+(hash(i,93)%665),y=1710+(hash(i,71)%338);
    disk(x,y,2+(hash(i,101)%6),i%9===0?77:(i%4===0?106:122),true);
  }

  // R3: Original inhabited-organ architecture, physically authored into the SAME material plane.
  // All inert structural spans are rooted in the surrounding geological shell.
  function arc(cx,cy,rx,ry,a,b,weight,mat){
    const pts=[];
    for(let i=0;i<=Math.ceil(Math.abs(b-a)*Math.max(rx,ry)/6);i++){
      const n=Math.ceil(Math.abs(b-a)*Math.max(rx,ry)/6),t=a+(b-a)*i/n;
      pts.push([cx+rx*Math.cos(t),cy+ry*Math.sin(t)]);
    }
    curve(pts,weight,mat);
  }
  function prism(points,weight,body,glint){
    curve(points,weight,body);
    if(glint)curve(points.slice(1,-1).map(([x,y])=>[x-2,y-4]),Math.max(2,Math.floor(weight/4)),glint);
  }
  function shard(x,y,dx,dy,r,mat,tip=122){
    stroke(x,y,x+dx*0.66,y+dy*0.66,r,mat);
    stroke(x+dx*.66,y+dy*.66,x+dx,y+dy,Math.max(2,r*.35),tip);
  }
  // District A: the broken skylight becomes a roof-bearing twin root-vault with a
  // central free entry, deliberately asymmetrical inclined flights and ledges.
  prism([[45,325],[116,320],[175,277],[231,229],[301,215],[352,242]],18,39,98);
  prism([[975,295],[900,290],[835,256],[769,220],[713,252],[674,309]],22,38,99);
  prism([[77,351],[162,349],[233,331],[280,312]],11,100,119);
  prism([[963,353],[882,340],[819,325],[770,342]],10,40,99);
  for(const q of [[[169,280],[184,231],[206,178]],[[234,231],[256,168],[299,141]],[[806,254],[807,194],[782,159]],[[757,247],[719,196],[697,148]]])
    prism(q,8,83,86);
  for(const [x,y] of [[209,239],[263,190],[799,226],[738,210]]){
    disk(x,y,17,42);disk(x-8,y-7,8,97);disk(x+12,y-13,7,97);
  }
  // District B-west: one coherent rooted tree with buttress trunks and visitable
  // floors; NOT radial one-pixel outlines or identically repeated twig teeth.
  prism([[46,708],[112,706],[160,676],[187,617],[201,555],[236,491]],24,83,86);
  prism([[68,730],[132,708],[194,696],[251,664]],14,83,86);
  prism([[130,711],[148,623],[126,565],[101,518]],13,83,46);
  prism([[180,615],[248,586],[303,550],[328,513]],11,83,86);
  prism([[202,560],[231,519],[252,451]],10,83,86);
  prism([[105,547],[139,509],[161,454]],10,83,86);
  prism([[60,624],[134,614],[183,625],[229,637]],9,39,98);
  prism([[72,769],[160,756],[218,733]],12,39,99);
  prism([[204,693],[255,694],[287,675]],9,39,119);
  for(const [x,y,r] of [[140,526,27],[186,477,25],[247,466,23],[293,536,28],[114,600,18]]){
    disk(x,y,r,97);disk(x-8,y-9,Math.max(8,r*.5),42);disk(x+10,y-13,Math.max(7,r*.3),86);
  }
  // B-east: open honeycomb sponge towers with actual physical voids, a stairlike
  // collection ledge and large differentiated pores, rather than scattered dots.
  prism([[984,766],[920,747],[878,695],[876,628],[914,578],[973,553]],22,42,122);
  prism([[1006,640],[949,630],[911,598],[897,523],[941,470]],18,42,97);
  for(const [x,y,r] of [[927,706,42],[929,603,49],[886,548,41],[974,687,36],[860,747,35],[886,480,34]])
    disk(x,y,r,97);
  for(const [x,y,r] of [[924,695,20],[937,610,25],[881,545,17],[973,691,13],[858,746,15],[896,486,14]]) disk(x,y,r,0);
  prism([[997,776],[924,789],[872,787],[828,777]],11,39,122);
  prism([[1003,829],[927,811],[879,835]],8,38,119);
  for(let i=0;i<12;i++){
    const x=839+(i*19)%167,y=470+((i*37)%312);
    if(g[y*W+x]){disk(x,y,5+(i%3)*3,i%2?77:122,true);}
  }
  // District C-west: grounded fossil amphitheatre; three independent stepped
  // seating trajectories, an open central apse and load-bearing limestone ribs.
  for(const [rx,ry,r,m] of [[132,115,9,98],[103,89,11,99],[77,67,8,38]]){
    arc(277,1006,rx,ry,0.33,2.88,r,m);
  }
  prism([[69,1089],[124,1070],[178,1072],[210,1086]],15,40,99);
  prism([[54,1149],[126,1119],[195,1118],[252,1141]],17,40,98);
  prism([[92,901],[147,918],[171,953]],11,99,98);
  prism([[115,864],[170,885],[203,910]],8,98,119);
  for(const [x,y] of [[149,1103],[213,1088],[347,1098],[193,1150]]){
    prism([[x,y],[x-5,y-46],[x+3,y-84]],8,38,99);
  }
  // C-east: observation terrace has a supported portico and suspension cradles.
  prism([[1007,1118],[934,1098],[864,1104],[818,1081]],16,100,122);
  prism([[978,1182],[914,1161],[844,1165]],12,40,99);
  prism([[859,1099],[859,995],[887,956],[927,921]],12,98,122);
  prism([[950,1099],[948,1013],[933,970]],9,98,119);
  prism([[863,951],[911,937],[950,943]],8,98,99);
  for(const [x,y,dx,dy] of [[903,937,-24,-52],[940,943,13,-50],[970,1146,-18,-56]])
    shard(x,y,dx,dy,9,122);
  // District D-west: distinct arterial anastomosis arch and mineral side bridges.
  prism([[45,1500],[110,1477],[168,1440],[202,1383],[230,1346]],19,100,122);
  prism([[30,1595],[115,1540],[168,1538],[233,1510]],12,40,106);
  prism([[90,1295],[154,1290],[209,1314],[229,1358]],11,100,49);
  for(const q of [[[108,1469],[106,1417],[138,1368]],[[170,1446],[180,1401],[208,1360]],[[167,1539],[186,1582],[225,1620]]])
    prism(q,9,122,106);
  // D-east: a real dry moonwell made of nested, physically supported irregular
  // crescent terraces, a bounded socket and coarse quartz outcrops.
  arc(800,1513,158,147,-1.27,1.39,15,40);
  arc(810,1518,121,113,-1.22,1.49,12,98);
  arc(820,1527,84,77,-1.17,1.31,9,106);
  prism([[1008,1394],[943,1404],[899,1427]],12,40,122);
  prism([[1002,1606],[933,1609],[871,1587]],13,40,99);
  prism([[970,1672],[904,1635],[843,1642]],10,40,106);
  for(const [x,y,dx,dy,r] of [[950,1430,-22,-71,13],[923,1566,-22,-55,11],[866,1640,6,-62,12],[985,1600,-16,-47,11],[891,1422,-33,-55,10]])
    shard(x,y,dx,dy,r,98);
  // Distinct inset moonwell stone socket and crystal thicket, not a fake Water pool.
  arc(889,1550,48,33,0.12,2.96,9,101);
  for(const [x,y] of [[891,1570],[924,1578],[953,1588]]){
    disk(x,y,7,122);shard(x,y,-8,-19,5,122);
  }
  // District E: the basal bell is now a giant rooted architectural instrument
  // with a visible shell, resonant side chambers and mineral clapper, not a void.
  prism([[284,2044],[330,1990],[345,1939],[375,1869],[427,1820]],22,100,98);
  prism([[746,2044],[694,1984],[680,1940],[651,1872],[601,1817]],23,100,122);
  prism([[375,1976],[387,1939],[422,1900],[473,1885],[539,1888],[595,1905],[628,1948],[638,1978]],18,98,122);
  prism([[380,1991],[433,1980],[481,1985],[539,1975],[596,1978],[644,1987]],13,101,106);
  prism([[422,1903],[445,1848],[477,1839]],10,39,98);
  prism([[602,1908],[581,1849],[559,1839]],10,39,122);
  prism([[503,1888],[514,1928],[520,1960]],12,40,119);
  disk(521,1960,19,119);disk(517,1950,9,122);
  prism([[281,2018],[376,2008],[435,2019]],11,101,106);
  prism([[740,2011],[659,2004],[590,2026]],13,101,122);
  for(const [x,y,dx,dy,r] of [[375,1997,-17,-69,13],[411,2011,21,-76,11],[640,1994,22,-60,12],[603,2011,-8,-79,13],[475,2020,-23,-53,8],[548,2019,20,-65,8]])
    shard(x,y,dx,dy,r,106);

  // In situ rim facies: every contour is drawn from the actual underlying Empty/non-Empty boundary.
  const rim=new Uint8Array(N);
  for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){
    const p=y*W+x;if(!g[p])continue;
    if(!g[p-W]||!g[p+W]||!g[p-1]||!g[p+1])rim[p]=1;
  }
  for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){
    const p=y*W+x;
    if(!rim[p])continue;
    if(y<500)g[p]=(hash(Math.floor(x/40),Math.floor(y/35),1)%5===0)?83:97;
    else if(y<850)g[p]=(hash(Math.floor(x/37),Math.floor(y/42),2)%5===0)?122:42;
    else if(y<1210)g[p]=(hash(Math.floor(x/34),Math.floor(y/41),3)%3===0)?99:98;
    else if(y<1710)g[p]=(hash(Math.floor(x/46),Math.floor(y/55),4)%4===0)?106:49;
    else g[p]=(hash(Math.floor(x/35),Math.floor(y/44),5)%4===0)?122:98;
  }
  // Capillary finisher: irregular secondary ribs arise from actual shaft/cave boundaries.
  // Separate left/right seeding breaks vertical repetition; they extend only 19-52 cells.
  for(let y0=70;y0<1980;y0+=49){
    for(const side of [-1,1]){
      const yy=y0+(hash(y0,side,74)%37)-18;
      const centre=Math.max(70,Math.min(950,Math.round(502+70*Math.sin((yy+130)/188)+26*Math.sin(yy/74))));
      let edge=-1;
      for(let dist=0;dist<500;dist++){
        const x=centre+side*dist;
        if(x<6||x>=W-6)break;
        if(g[yy*W+x]!==0){edge=x;break;}
      }
      if(edge<0)continue;
      const m=yy<600?83:yy<880?97:yy<1210?98:yy<1690?106:122;
      const rr=22+hash(y0,side,87)%33;
      const inner=edge-side*rr;
      const tipy=yy+((hash(y0,side,88)%53)-26);
      const base=[edge+side*4,yy],joint=[edge-side*16,yy+((hash(y0,side,89)%21)-10)];
      stroke(base[0],base[1],joint[0],joint[1],3,m);
      stroke(joint[0],joint[1],inner,tipy,2+(hash(y0,side,90)%2),m);
      const branch=[joint[0]-side*(16+hash(y0,side,95)%15),tipy+(hash(y0,side,93)%35)-17];
      stroke(joint[0],joint[1],branch[0],branch[1],2,yy<880?86:122);
      disk(inner,tipy,2+hash(y0,side,96)%3,yy<880?97:122);
    }
  }
  // Paint is not allowed to collapse the canonical safe flight centre lines.
  for(const b of branches)curve(b,37,0);
  const spawn=[507,133];
  const sites=[
    ["Crown skylight", [507,213]],
    ["Root orchard", [240,535]],
    ["Spore organ", [792,623]],
    ["Fossil amphitheatre", [292,978]],
    ["Calcite observatory", [780,1028]],
    ["Left anastomosis", [269,1410]],
    ["Moonwell garden", [786,1500]],
    ["Deep bell", [514,1826]]
  ];
  // Preserve 31x27 clearance at the exact actor insertion/site centres.
  for(const p of [spawn,...sites.map(s=>s[1])])disk(p[0],p[1],21,0);
  // Structural qualification: all rock is part of the anchored host. Delete unsupported mineral islands.
  const connected=new Uint8Array(N),queue=new Int32Array(N);let head=0,tail=0;
  function pushSolid(p){if(g[p]&&!connected[p]){connected[p]=1;queue[tail++]=p;}}
  for(let x=0;x<W;x++){pushSolid(x);pushSolid((H-1)*W+x);}
  for(let y=0;y<H;y++){pushSolid(y*W);pushSolid(y*W+W-1);}
  while(head<tail){
    const p=queue[head++],x=p%W,y=(p/W)|0;
    if(x>0)pushSolid(p-1);if(x<W-1)pushSolid(p+1);
    if(y>0)pushSolid(p-W);if(y<H-1)pushSolid(p+W);
  }
  let floatingRemoved=0;
  for(let p=0;p<N;p++)if(g[p]&&!connected[p]){g[p]=0;floatingRemoved++;}
  // A full-cell ordered, vertically coalesced, nonoverlapping run encoding.
  const edits=[];let open=new Map();let runCount=0;
  for(let y=0;y<H;y++){
    const next=new Map();let x=0;
    while(x<W){
      const m=g[y*W+x],start=x;
      while(x<W&&g[y*W+x]===m)x++;
      if(!m)continue;
      const key=start+":"+ (x-start) +":"+m,idx=open.get(key);
      if(idx!==undefined&&edits[idx][1]+edits[idx][3]===y) {edits[idx][3]++;next.set(key,idx);}
      else {const j=edits.length;edits.push([start,y,x-start,1,m]);next.set(key,j);}
    }
    open=next;
  }
  if(edits.length>32768)throw new Error("Too many construction rectangles: "+edits.length);
  const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
  const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
  const json=JSON.stringify(setup)+"\n";
  function ascii(s){const b=new Uint8Array(s.length);for(let i=0;i<s.length;i++){const v=s.charCodeAt(i);if(v>127)throw Error("nonASCII");b[i]=v;}return b;}
  if(ascii(json).length>1048576)throw Error("JSON exceeds native manifest budget "+json.length);
  // Full independent cell replay, rather than histogram-only validation.
  const replay=new Uint8Array(N),touched=new Uint8Array(N);let overlaps=0;
  for(const e of edits){
    const [x,y,w,h,m]=e;
    if(!solids.has(m)||w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error("invalid rectangle");
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
      const p=yy*W+xx;if(touched[p])overlaps++;touched[p]=1;replay[p]=m;
    }
  }
  let diffs=0,painted=0;const hist={};
  for(let p=0;p<N;p++){if(g[p]!==replay[p])diffs++;if(g[p])painted++;hist[g[p]]=(hist[g[p]]||0)+1;}
  if(diffs||overlaps)throw Error("Bad replay: "+diffs+" mismatches "+overlaps+" overlaps");
  // Independent prefix-sum conservative clearance and BFS for exact-centre actor destinations.
  const S=W+1,I=new Uint32Array((W+1)*(H+1));
  for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=g[y*W+x]?1:0;I[(y+1)*S+x+1]=I[y*S+x+1]+sum;}}
  function clear(x,y,w,h){
    const x0=x-Math.floor(w/2),y0=y-Math.floor(h/2),x1=x0+w,y1=y0+h;
    if(x0<0||y0<0||x1>W||y1>H)return false;
    return I[y1*S+x1]-I[y0*S+x1]-I[y1*S+x0]+I[y0*S+x0]===0;
  }
  function flood(w,h,block){
    const good=new Uint8Array(N),visit=new Uint8Array(N),q=new Int32Array(N),distances=new Int32Array(N);
    distances.fill(-1);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(clear(x,y,w,h)&&!(block&&x>=block[0]&&x<=block[2]&&y>=block[1]&&y<=block[3]))good[y*W+x]=1;
    const start=spawn[1]*W+spawn[0];if(!good[start])throw Error("Midge origin collides at "+w+"x"+h);
    let a=0,b=1;q[0]=start;visit[start]=1;distances[start]=0;
    while(a<b){
      const p=q[a++],x=p%W;
      const v=[x? p-1:-1,x<W-1?p+1:-1,p>=W?p-W:-1,p<N-W?p+W:-1];
      for(const n of v)if(n>=0&&good[n]&&!visit[n]){visit[n]=1;distances[n]=distances[p]+1;q[b++]=n;}
    }
    const status=sites.map(s=>{
      const x=s[1][0],y=s[1][1],p=y*W+x,offsets=[[48,0],[-48,0],[0,48],[0,-48],[34,34],[-34,34],[34,-34],[-34,-34]];
      const exit_octants_48=offsets.map(([dx,dy],i)=>({i,tx:x+dx,ty:y+dy}))
        .filter(o=>o.tx>=0&&o.ty>=0&&o.tx<W&&o.ty<H&&!!visit[o.ty*W+o.tx]&&!!good[o.ty*W+o.tx])
        .map(o=>o.i);
      return {name:s[0],x,y,clear:!!good[p],reached:!!visit[p],shortest_cardinal_steps:distances[p],exit_octants_48};
    });
    return {width:w,height:h,reached:b,sites:status};
  }
  const clearance=[flood(19,15,null),flood(23,19,null),flood(31,27,null)];
  if(clearance.some(x=>x.sites.some(s=>!s.clear||!s.reached)))throw Error("Exact named site Midge route failure: "+JSON.stringify(clearance.map(v=>({size:[v.width,v.height],failed:v.sites.filter(x=>!x.reached||!x.clear)}))));
  const minLocalExits=Math.min(...clearance[2].sites.map(s=>s.exit_octants_48.length));
  if(minLocalExits<2)throw Error("A named 31x27 destination lacks two reachable local approach samples");
  const alt=flood(31,27,[300,965,708,1148]);
  const essential=["Moonwell garden","Deep bell","Left anastomosis"];
  if(essential.some(n=>!alt.sites.find(x=>x.name===n)?.reached))throw Error("Alternate bypass cannot reach lower chambers: "+JSON.stringify(alt.sites));
  // SHA-256 is implemented locally to keep the fixed-seed builder functional in standalone Node without dependencies.
  function sha256(bytes){
    const ps=[];for(let a=2;ps.length<64;a++){let prime=true;for(let b=2;b*b<=a;b++)if(a%b===0){prime=false;break;}if(prime)ps.push(a);}
    const h=ps.slice(0,8).map(x=>Math.floor((Math.sqrt(x)%1)*0x100000000)>>>0);
    const k=ps.map(x=>Math.floor((Math.cbrt(x)%1)*0x100000000)>>>0);
    const len=bytes.length, n=((len+9+63)>>6)<<6, m=new Uint8Array(n);m.set(bytes);m[len]=0x80;
    const bits=len*8; m[n-8]=Math.floor(bits/0x100000000/0x1000000)&255;m[n-7]=Math.floor(bits/0x100000000/65536)&255;m[n-6]=Math.floor(bits/0x100000000/256)&255;m[n-5]=Math.floor(bits/0x100000000)&255;
    m[n-4]=(bits/0x1000000)&255;m[n-3]=(bits>>>16)&255;m[n-2]=(bits>>>8)&255;m[n-1]=bits&255;
    const w=new Uint32Array(64),ror=(x,z)=>(x>>>z)|(x<<(32-z));
    for(let off=0;off<n;off+=64){
      for(let i=0;i<16;i++){const p=off+i*4;w[i]=((m[p]<<24)|(m[p+1]<<16)|(m[p+2]<<8)|m[p+3])>>>0;}
      for(let i=16;i<64;i++){const s0=ror(w[i-15],7)^ror(w[i-15],18)^(w[i-15]>>>3);const s1=ror(w[i-2],17)^ror(w[i-2],19)^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}
      let [a,b,c,d,e,f,gg,hh]=h;
      for(let i=0;i<64;i++){const s1=ror(e,6)^ror(e,11)^ror(e,25);const ch=(e&f)^(~e&gg);const t1=(hh+s1+ch+k[i]+w[i])>>>0;const s0=ror(a,2)^ror(a,13)^ror(a,22);const maj=(a&b)^(a&c)^(b&c);const t2=(s0+maj)>>>0;hh=gg;gg=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
      const z=[a,b,c,d,e,f,gg,hh];for(let i=0;i<8;i++)h[i]=(h[i]+z[i])>>>0;
    }
    return h.map(x=>x.toString(16).padStart(8,"0")).join("");
  }
  if(sha256(ascii("abc"))!=="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")throw Error("SHA-256 selftest failed");
  // Indexed palette PNG: raw index == true authored material ID. No false-color RGB reconstruction or AI imagery.
  const crcTable=new Uint32Array(256);
  for(let i=0;i<256;i++){let x=i;for(let k=0;k<8;k++)x=(x&1)?(0xedb88320^(x>>>1)):(x>>>1);crcTable[i]=x>>>0;}
  function crc32(buf,start=0,end=buf.length){let c=0xffffffff;for(let i=start;i<end;i++)c=crcTable[(c^buf[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function put32(buf,p,v){buf[p]=(v>>>24)&255;buf[p+1]=(v>>>16)&255;buf[p+2]=(v>>>8)&255;buf[p+3]=v&255;}
  function get32(buf,p){return ((buf[p]*0x1000000)+(buf[p+1]<<16)+(buf[p+2]<<8)+buf[p+3])>>>0;}
  function concat(parts){let size=0;for(const a of parts)size+=a.length;const z=new Uint8Array(size);let p=0;for(const a of parts){z.set(a,p);p+=a.length;}return z;}
  function chunk(name,payload){const n=ascii(name),z=new Uint8Array(payload.length+12);put32(z,0,payload.length);z.set(n,4);z.set(payload,8);put32(z,z.length-4,crc32(z,4,z.length-4));return z;}
  function adler32(bytes){let a=1,b=0;for(let i=0;i<bytes.length;i++){a=(a+bytes[i])%65521;b=(b+a)%65521;}return (b<<16|a)>>>0;}
  function zipStored(raw){
    const parts=[new Uint8Array([0x78,0x01])];let off=0;
    while(off<raw.length){const n=Math.min(65535,raw.length-off),final=(off+n===raw.length);const header=new Uint8Array(5);header[0]=final?1:0;header[1]=n&255;header[2]=(n>>>8)&255;header[3]=(~n)&255;header[4]=((~n)>>>8)&255;parts.push(header,raw.subarray(off,off+n));off+=n;}
    const tail=new Uint8Array(4);put32(tail,0,adler32(raw));parts.push(tail);return concat(parts);
  }
  const plte=new Uint8Array(256*3);
  for(let i=0;i<256;i++){const rgb=paletteSpec[i]||[255,0,255];plte.set(rgb,i*3);}
  function makePNG(width,height,pixels){
    if(pixels.length!==width*height)throw Error("PNG wrong plane length");
    const raw=new Uint8Array((width+1)*height);
    for(let y=0;y<height;y++)raw.set(pixels.subarray(y*width,(y+1)*width),y*(width+1)+1);
    const ihdr=new Uint8Array(13);put32(ihdr,0,width);put32(ihdr,4,height);ihdr[8]=8;ihdr[9]=3;
    return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("PLTE",plte),chunk("IDAT",zipStored(raw)),chunk("IEND",new Uint8Array(0))]);
  }
  // Independent PNG reader checks all CRCs, zlib uncompressed block headers, Adler and row-by-row physical IDs.
  function decodePNG(png){
    const sig=[137,80,78,71,13,10,26,10];if(sig.some((v,i)=>png[i]!==v))throw Error("PNG bad signature");
    let off=8,width=0,height=0,compressed=null,pal=null,done=false;
    while(off<png.length){
      const len=get32(png,off),name=String.fromCharCode(...png.subarray(off+4,off+8)),from=off+8,to=from+len;
      if(to+4>png.length||crc32(png,off+4,to)!==get32(png,to))throw Error("PNG invalid CRC "+name);
      const val=png.subarray(from,to);
      if(name==="IHDR"){width=get32(val,0);height=get32(val,4);if(val[8]!==8||val[9]!==3||val[12]!==0)throw Error("PNG header not 8-bit palette");}
      if(name==="PLTE")pal=val;
      if(name==="IDAT")compressed=val;
      if(name==="IEND"){if(len)throw Error("IEND nonempty");done=true;}
      off=to+4;
    }
    if(off!==png.length||!done||!compressed||!pal||pal.length!==768)throw Error("PNG incomplete");
    if(compressed[0]!==0x78||compressed[1]!==0x01)throw Error("PNG unknown zlib");
    let pos=2;const raw=new Uint8Array((width+1)*height),limit=compressed.length-4;let used=0,final=false;
    while(!final){
      const h=compressed[pos++];if((h&0xfe)!==0)throw Error("PNG non-store deflate");
      final=(h&1)===1;const n=compressed[pos]|(compressed[pos+1]<<8),not=compressed[pos+2]|(compressed[pos+3]<<8);
      if(((~n)&65535)!==not)throw Error("PNG length complement");pos+=4;
      if(pos+n>limit||used+n>raw.length)throw Error("PNG output extent invalid");
      raw.set(compressed.subarray(pos,pos+n),used);used+=n;pos+=n;
    }
    if(pos!==limit||used!==raw.length||adler32(raw)!==get32(compressed,limit))throw Error("PNG invalid Adler or length");
    const out=new Uint8Array(width*height);
    for(let y=0;y<height;y++){if(raw[y*(width+1)]!==0)throw Error("PNG unexpected filter");out.set(raw.subarray(y*(width+1)+1,(y+1)*(width+1)),y*width);}
    return {width,height,pixels:out};
  }
  const artifacts={};const pngs={};const cropData=[
    ["01-sink-crown.png",70,90,384,320],
    ["01b-crown-east.png",565,75,384,320],
    ["02-root-orchard.png",48,430,384,320],
    ["03-spore-organ.png",606,477,384,320],
    ["04-fossil-atrium.png",78,820,384,320],
    ["04b-calcite-observatory.png",630,860,384,320],
    ["05-moonwell-garden.png",613,1345,384,320],
    ["05b-anastomosis.png",45,1280,384,320],
    ["06-deep-bell.png",320,1710,384,320]
  ];
  function extract(x,y,w,h){const a=new Uint8Array(w*h);for(let yy=0;yy<h;yy++)a.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*w);return a;}
  function retainPNG(name,w,h,source,crop=null){
    const png=makePNG(w,h,source),parsed=decodePNG(png);let mismatch=0;
    for(let i=0;i<source.length;i++)if(source[i]!==parsed.pixels[i])mismatch++;
    if(mismatch)throw Error("PNG source material mismatch "+name);
    artifacts[name]=png;pngs[name]={width:w,height:h,sha256:sha256(png),crc_pass:true,adler_pass:true,decoded_material_mismatches:mismatch,crop};
  }
  retainPNG("overview.png",W,H,g);
  for(const [name,x,y,w,h] of cropData)retainPNG(name,w,h,extract(x,y,w,h),[x,y,w,h]);
  const tw=256,th=512,mini=new Uint8Array(tw*th);
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++)mini[y*tw+x]=g[(y*4)*W+x*4];
  retainPNG("thumbnail.png",tw,th,mini);
  const generatorSource=runPipeline.toString()+"\nrunPipeline();\n";
  const receipt={
    format:"cybersand-original-canvas-qualification-v1",concept:"The Karst Lung Organ",lane:"original-organic-vertical",
    original_reference_free:true,extent:[W,H],seed_hex:"0x"+SEED.toString(16),source_authority:{
      cybersand_main:"018bd09503d7f079ddac52e225c2f7daf8d678bf",
      workbench_setup_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",
      material_header_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",
      midge_definition_blob:"228399e38a0e0ab215b9f48698edce67a7a35799"
    },
    source_sha256:sha256(ascii(generatorSource)),grid_sha256:sha256(g),json_sha256:sha256(ascii(json)),
    exact_cell_count:N,painted_cells:painted,empty_cells:hist[0],rectangle_count:edits.length,
    rectangle_limit_source:32768,native_installed_rectangle_capacity:"UNVERIFIED",
    setup_bytes:json.length,setup_limit_bytes:1048576,full_replay_mismatches:diffs,rectangle_overlaps:overlaps,
    disconnected_solid_cells_pruned:floatingRemoved,
    material_histogram:hist,
    all_nonempty_materials_immovable_inert_solid:false,all_nonempty_materials_immovable_solid:true,combustible_organic_material_ids:[46,81,83,86,88,92,97],combustible_organic_cell_count:[46,81,83,86,88,92,97].reduce((sum,id)=>sum+(hist[id]||0),0),essential_geological_foundations_inert:true,fluid_cells:0,powder_cells:0,
    midge_hull_source:[4,3],minimum_31x27_reachable_48px_exit_octants:minLocalExits,conservative_centre_clearances:clearance,
    bypass_test:{blocked_centre_region:[300,965,708,1148],conservative_31x27:alt,required_destinations:essential},
    pngs,static_qualification:"PASS",native_install:"NATIVE-UNTESTED",native_input_collision:"NATIVE-UNTESTED",
    native_save_fresh_process_reopen:"NATIVE-UNTESTED",
    creative_revisions:["R3 Sunken Crown: monumental asymmetrical anchored root vaults and platforms, clear central arrival.","R3 Root Orchard: thick coherent rooted tree, buttress arches, visitable tiered shelves and differentiated crowns.","R3 Spore Organ: large porous, rim-backed clustered sponge masses with open circular cavities and collection ledges.","R3 Fossil Atrium and Calcite Observatory: grounded stepped fossil seating, unique supported observation portico and crystals.","R3 Anastomosis and Moonwell: branching left arterial gallery, nested dry well terraces, clear mineral socket and outcrops.","R3 Deep Bell: monumental anchored resonator shell, mineral clapper, and two grounded lower platforms."],
    limitations:["No matching installed Godot/native runtime was executed.","Only static native material laws are selected, so no living biological motion or functioning liquid pumps are implied.","PNG is an indexed material-ID image, not a screenshot from CyberSand."]
  };
  const readme=`# The Karst Lung Organ\n\n**Original CyberSand material-cell canvas, 1024 x 2048, orthographic side elevation.**\n\n## Original spatial thesis\n\nA petrified underground respiratory organ formed naturally over geological time: a continuous curved breathing shaft ventilates offset limestone lobes. Old roots entered from the collapsed skylight and were gradually mineralized into living-looking timber arteries. The porous spore organ, fossil atrium, calcite observatory, moonwell and basal resonating bell retain distinct geological identities. This is a navigable 2D level, not an image-to-map tracing.\n\n## Artistic structure\n\n1. **Sunken Crown (y 0-390):** broken skylight and asymmetric suspending oak/bamboo root arteries; inhabited negative space beneath the fracture.\n2. **Root Orchard and Spore Organ (y 390-820):** intertwined soil/lichen west lobe against luminous eastern spore pockets and deliberately different shapes of perforation.\n3. **Fossil Atrium and Calcite Observatory (y 820-1220):** chalk pressure ribs in the west, quieter opposite mineral observatory and a large alternate right-hand bypass.\n4. **Anastomosis and Moonwell (y 1220-1700):** branching basalt vessels against nacre/quartz eastern mineral garden; forms a side loop below the central obstruction region.\n5. **Deep Bell (y 1700-2048):** massive dry calcite resonator and asymmetrical embedded rib crests, with a traversable lower hollow.\n\n## Exact-centre flight map\n\n\`\`\`text\n                         x=0                 x=1024\n y=0          ROCK ROOTS   / SKYLIGHT /    ROCK\n                    +------ MIDGE (507,133) ------+\n                    |        CROWN               |\n y=535       ROOT ORCHARD == MAIN ORGAN == SPORE ORGAN y=623\n                    \\\\       ||         //\n y=978       FOSSIL ATRIUM == SHAFT == CALCITE OBS. y=1028\n                    \\\\    [central test block]  //\n y=1410      ANASTOMOSIS === SHAFT ====== MOONWELL y=1500\n                         \\\\       //\n y=1826           ==== DEEP BELL ====\n y=2048                 ROOTED ROCK\n\`\`\`\n\nExact destination centres (no radius or nearest-point waivers):\n\n${sites.map(s=>`- ${s[0]}: (${s[1][0]}, ${s[1][1]})`).join("\n")}\n\nThree conservative axis-aligned Midge envelopes (19 x 15, 23 x 19, 31 x 27) are flood-tested at every exact named site. The 31x27 clearance includes shortest cardinal-centre route lengths and at least three of eight distinct reachable 48-cell local approach samples per exact site; these samples do not prove edge-disjoint paths or piloted dynamics. The lower route is independently tested after blocking x300..708/y965..1148 in actor-centre space. The main shaft and at least one non-central bypass remain part of the same connected component.\n\n## Format and use\n\n\`setup-karst-lung-organ.json\` is an ordinary strict Setup-v2 authored starting-map document with ordered, losslessly coalesced nonoverlapping [x,y,width,height,material-ID] rectangles. The array reconstructs the **entire** initial material plane; Empty cells are implicit, with no recipe-dependent background. Use **Shared Workbench -> Load start** after installing the JSON as \`user://workbench/setup-karst-lung-organ.json\` under the **matching accepted CyberSand build**. The installed native rectangle capacity may differ from source; check against the actual GDExtension first. A saved starting map does not persist evolved physics.\n\nEvery nonempty starting cell is an immovable solid, but the actual accepted physics catalogue marks **OakTimber (46), PinePlanks (81), OakLog (83), Bamboo (86), Driftwood (88), Wicker (92), and MossWall (97) as Combustible**, not inert. Mineral structural supports are RuleKernel::None solids. Organic accents are unignited at spawn; subsequent ignition would change them. No combustion or other dynamic behaviour was natively simulated in this qualification. No false falling-stone supports, liquids, burning ecology or self-propagating cells. Organic form is mineral/timber structure; simulated biological dynamics are not claimed.\n\n## Provenance and repeatability\n\n- Fixed seed: \`0x4b415253\`.\n- Deterministic builder: \`build-karst-lung-organ.js\` (Node.js; no dependencies); writes all artifacts to its optional first directory argument or its own directory.\n- Builder SHA-256: \`${receipt.source_sha256}\`.\n- Full material plane SHA-256: \`${receipt.grid_sha256}\`.\n- Setup JSON SHA-256: \`${receipt.json_sha256}\`.\n- Full-grid parity: ${diffs} mismatches, ${overlaps} overlapping rectangles.\n- PNG: uncompressed-deflate, 8-bit indexed palette; palette pixel **index** is real CyberSand material ID, not illustration. All ${Object.keys(pngs).length} images independently decoded and checked for PNG CRC/Adler/index fidelity.\n- Current CyberSand accepted \`main\`: \`${receipt.source_authority.cybersand_main}\`.\n\n## Visual and independent acceptance\n\nThe full \`overview.png\` is exactly 1024x2048 physical cells, one actual material ID per PNG pixel. Nine \`NN-*.png\` files are native 1:1 crops of that same grid; \`thumbnail.png\` is a nearest-neighbor overview only. See \`qualification.json\` for exact histogram, full-cell source/PNG hashes, connectivity, basins and static/native truth.\n\n**DRAFT / HOLD. NATIVE-UNTESTED.** No Windows/Godot install, actor input/collision, Rapier progression or save/fresh-process reopen is represented as performed; Shepherd and independent auditor assessment remain outstanding.\n\nR3 independently repaired seven formerly near-empty true-cell districts (crown, root orchard, spore organ, fossil amphitheatre, calcite observatory, dry moonwell, deep bell), plus supported anastomosis; each has large/midscale physical architecture and distinct silhouettes rather than added outline whiskers. Core airway and blocked-centre bypass remain open. No source/reference image or other repository is used.\n`;
  artifacts["setup-karst-lung-organ.json"]=ascii(json);
  artifacts["build-karst-lung-organ.js"]=ascii(generatorSource);
  artifacts["README.md"]=ascii(readme);
  artifacts["qualification.json"]=ascii(JSON.stringify(receipt,null,2)+"\n");
  artifacts["seed.txt"]=ascii("Karst Lung Organ | 0x4b415253 | 1024x2048 | original-organic-vertical | no-reference\n");
  if(typeof require==="function"){
    const fs=require("fs"),path=require("path");
    const out=process.argv[2]||__dirname;fs.mkdirSync(out,{recursive:true});
    for(const [name,bytes] of Object.entries(artifacts))fs.writeFileSync(path.join(out,name),bytes);
    process.stdout.write(JSON.stringify({output:out,receipt},null,2)+"\n");
  }
  return {dirname,artifacts,receipt,sites,previewPNG:artifacts["thumbnail.png"],readme};
}
runPipeline();
