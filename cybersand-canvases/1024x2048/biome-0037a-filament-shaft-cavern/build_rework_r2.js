#!/usr/bin/env node
/**
 * CyberSand BIOME-0037a R2 deterministic source-led material-plane constructor.
 * Regenerates from immutable historic parent HEAD; never writes reference art.
 * Node 18+, no dependencies. Static geometry and material data, not native proof.
 */
function buildR2(baseline) {
  const W=1024,H=2048,N=W*H, a=new Uint8Array(N);
  if (baseline.extent[0]!==W||baseline.extent[1]!==H||baseline.version!==2) throw Error("Baseline extent/schema drift");
  const id=(x,y)=>y*W+x;
  const pix=(x,y,m)=>{if(x>=0&&x<W&&y>=0&&y<H)a[id(x,y)]=m};
  const rect=(x,y,w,h,m)=>{for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)a.fill(m,id(Math.max(0,x),yy),id(Math.min(W,x+w),yy))};
  // Preserve the sealed historical physical Water basin, not the repeated cavern stacks.
  for(const [x,y,w,h,m] of baseline.edits) {
    let y0=Math.max(1840,y),y1=Math.min(H,y+h);
    for(let yy=y0;yy<y1;yy++)a.fill(m,id(x,yy),id(x+w,yy));
  }
  // An unambiguous quiet substrate in the deep tail; stable rock and Water retained.
  for(let y=1840;y<H;y++)for(let x=0;x<W;x++){
    const at=id(x,y),m=a[at];
    if([77,78,79,127,97].includes(m))a[at]=m===127?38:(m===97?42:49);
  }
  // Side-elevation rock boundaries, with a coherent left porous hero and a nonmatching right wall.
  for(let y=0;y<1840;y++){
    const left=y<960? Math.round(467+36*Math.sin(y/132+.52)+22*Math.sin(y/57+1.2)+11*Math.sin(y/23)):
      y<1150?Math.round(168+35*Math.sin(y/84)+19*Math.sin(y/25)):
      y<1460?Math.round(190+45*Math.sin(y/111+.7)+14*Math.sin(y/32)):
      Math.round(161+39*Math.sin(y/120+1.8)+24*Math.sin(y/41));
    const right=Math.round(972-26*Math.sin(y/104+.8)-17*Math.sin(y/38));
    const lm=y<960?99:(y<1150?49:100);
    for(let x=0;x<left;x++)a[id(x,y)]=lm;
    for(let x=right;x<W;x++)a[id(x,y)]=y<960?101:100;
    rect(0,y,18,1,100);rect(1006,y,18,1,100);
  }
  const ellipse=(cx,cy,rx,ry,m,phase=0)=>{
    const xa=Math.max(0,Math.floor(cx-rx*1.22)),xb=Math.min(W,Math.ceil(cx+rx*1.22));
    const ya=Math.max(0,Math.floor(cy-ry*1.22)),yb=Math.min(H,Math.ceil(cy+ry*1.22));
    for(let y=ya;y<yb;y++)for(let x=xa;x<xb;x++){
      const dx=(x-cx)/rx,dy=(y-cy)/ry,t=Math.atan2(dy,dx);
      const radial=1+.085*Math.sin(3*t+phase)+.042*Math.sin(7*t+phase*1.9);
      if(dx*dx+dy*dy<radial*radial)pix(x,y,m);
    }
  };
  const capsule=(x0,y0,x1,y1,r,m)=>{
    const xmin=Math.max(0,Math.floor(Math.min(x0,x1)-r-3)),xmax=Math.min(W,Math.ceil(Math.max(x0,x1)+r+3));
    const ymin=Math.max(0,Math.floor(Math.min(y0,y1)-r-3)),ymax=Math.min(H,Math.ceil(Math.max(y0,y1)+r+3));
    const vx=x1-x0,vy=y1-y0,ss=vx*vx+vy*vy;
    for(let y=ymin;y<ymax;y++)for(let x=xmin;x<xmax;x++){
      const t=Math.max(0,Math.min(1,((x-x0)*vx+(y-y0)*vy)/ss));
      const dx=x-x0-t*vx,dy=y-y0-t*vy;
      if(dx*dx+dy*dy<r*r)pix(x,y,m);
    }
  };
  // Organically varying fenestrations cut through ONE connected left-wall mass.
  for(const [cx,cy,rx,ry,ph] of [
    [112,141,70,85,.25],[280,170,65,70,1.7],[414,247,58,74,3.1],
    [166,373,104,87,2.9],[355,402,73,75,4.5],
    [108,573,72,96,4.1],[274,608,88,79,1.35],[424,616,51,67,2.3],
    [151,800,98,105,1.35],[341,833,76,84,3.3]
  ])ellipse(cx,cy,rx,ry,0,ph);
  // Actual transit through apertures, not teleport-tolerance waypoints.
  capsule(162,211,232,183,24,0);capsule(344,187,483,242,25,0);
  capsule(237,379,310,397,29,0);capsule(404,401,520,402,24,0);
  capsule(161,627,232,607,26,0);capsule(351,608,520,620,27,0);
  capsule(224,800,289,828,27,0);capsule(390,826,530,855,31,0);
  capsule(158,228,172,300,21,0);capsule(147,457,127,497,21,0);
  capsule(151,673,144,719,26,0);capsule(342,894,355,983,32,0);
  // An accessible, named old observatory hole and a controlled portal preserve the actual historic site.
  ellipse(205,230,51,48,0,2.8);capsule(224,220,258,192,24,0);
  // The original spawn is in a genuine broad 31x27 air region, not a nearest-air substitute.
  ellipse(512,107,53,42,0,1.1);
  // Scattered small pores supply organic biological lace; sub-envelope fenestrations are decoration only.
  for(let k=0;k<38;k++){
    const x=37+(k*137)%395,y=85+(k*179)%807;
    if(x<430)ellipse(x,y,5+(k*13)%13,8+(k*9)%18,0,k*.93);
  }
  // Continuous left-side living cliff, with several irregular membranous connections.
  // Large fenestrations remain open; these are SOLID cartilage ribs, not graphic strokes.
  for(let y=38;y<952;y++){
    const edge=Math.round(46+6*Math.sin(y/49)+3*Math.sin(y/13));
    for(let x=19;x<=edge;x++)pix(x,y,99);
  }
  for(const [x0,y0,x1,y1,r] of [
    [41,98,105,71,13], [45,330,135,306,13], [135,306,215,335,12],
    [46,483,139,502,12], [139,502,215,464,11],
    [42,691,140,702,12], [140,702,222,742,12],
    [43,911,142,933,12], [142,933,250,916,11],
    [250,916,403,939,10], [148,285,199,286,12], [275,930,365,930,12]
  ])capsule(x0,y0,x1,y1,r,99);
  // Lower outlet from organism to the original's long horizontal geological shelf.
  capsule(303,883,345,1005,35,0);
  // Narrow bone bridge restores an otherwise detached lower fenestration component.
  capsule(273,931,370,931,12,99);
  // Broad clearance in the lower oval aperture; source-aligned room now truly opens to outer cavern.
  capsule(206,807,338,815,34,0);
  // Material highlights follow real solid/air boundaries, not arbitrary neon scratches.
  const old=a.slice();
  for(let y=42;y<961;y++)for(let x=19;x<455;x++){
    const at=id(x,y);
    if(old[at]!==99)continue;
    let adjacent=false;
    for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3]])if(old[id(Math.max(0,Math.min(W-1,x+dx)),Math.max(0,Math.min(H-1,y+dy))) ]===0)adjacent=true;
    if(adjacent)a[at]=122;
    else if(Math.sin(x/24+y/58)+.55*Math.sin(x/13-y/41)>1.20)a[at]=38;
  }
  // Five attached mineral ribs trace curved wall relief, with no loose/falling decoration.
  for(let k=0;k<5;k++){
    const sy=86+k*159;
    for(let t=0;t<72;t++){
      const y=sy+t, x=Math.round(314+36*Math.sin((sy+t)/123+.52)+16*Math.sin(t/17+k));
      if(x<545&&y<960)for(let d=-1;d<=1;d++)if(a[id(x+d,y)]!==0)pix(x+d,y,(k%2)?38:122);
    }
  }
  // Sparse bounded hanging crystal nodules, mechanically stable solid.
  // Crystal coloration is *only* in existing structural material; never create floating obstacles.
  for(const [x,y,r] of [[95,43,10],[174,103,8],[286,227,7],[86,538,12],[316,667,8],[248,814,10]]){
    for(let yy=Math.max(0,Math.floor(y-r*1.6));yy<=Math.min(H-1,Math.ceil(y+r*1.6));yy++)
      for(let xx=Math.max(0,x-r);xx<=Math.min(W-1,x+r);xx++){
        const dx=(xx-x)/r,dy=(yy-y)/(r*1.6);
        if(dx*dx+dy*dy<1&&a[id(xx,yy)]!==0)pix(xx,yy,122);
      }
  }
  // True vertical service ladder, visibly distinct from organic pore architecture.
  // Sparse rungs do not close the conservative Midge envelope in the adjacent air.
  for(let y=596;y<=1016;y++){
    for(let d=0;d<3;d++){pix(548+d,y,62);pix(576+d,y,62);}
    if(y%21<2)for(let x=551;x<576;x++)pix(x,y,62);
  }
  for(let y=1014;y<1018;y++)for(let x=543;x<584;x++)pix(x,y,49);
  // Major continuous, mechanically supported 600px landscape shelf; unblocked east return.
  for(let x=246;x<855;x++){
    const thickness=23+Math.round(6*Math.sin(x/38)+3*Math.sin(x/13));
    for(let y=1018;y<1018+thickness;y++)pix(x,y,y<1023?38:(y>1039?100:49));
  }
  // Short eastern landing leaves an explicit 65-cell flight return to the lower district.
  for(let x=920;x<1005;x++)for(let y=1018;y<1043;y++)pix(x,y,y<1023?38:49);
  for(const [x,w,h] of [[286,26,69],[475,31,94],[674,39,116]]){
    for(let yy=1041;yy<1041+h;yy++)for(let xx=x;xx<x+w;xx++)if(a[id(xx,yy)]===0)pix(xx,yy,100);
  }
  // Stable pale tissues attached to left side, naturally tapering below old shelf.
  for(let y=1062;y<1260;y++){
    const reach=Math.max(0,Math.round(85+87*Math.sin((y-1062)/198*Math.PI)+11*Math.sin(y/17)));
    for(let x=40;x<reach;x++)if(a[id(x,y)]!==0)a[id(x,y)]=(x>reach-10?99:38);
  }
  // One cavernous lower-left natural recess, not ten mirrored compartments.
  ellipse(144,1363,117,140,0,.7);
  ellipse(118,1679,95,128,0,2.3);
  capsule(169,1380,270,1356,37,0);capsule(153,1700,272,1737,39,0);
  capsule(132,1486,124,1579,31,0);
  // Differentiated left bank balconies: root-supported geological benches.
  for(let x=32;x<475;x++){
    if(x<285||x>352){
      const y=1281+Math.round(4*Math.sin(x/35)+2*Math.sin(x/15));
      for(let yy=y;yy<y+10;yy++)if(yy<H)pix(x,yy,yy<y+3?38:49);
    }
  }
  for(let x=62;x<413;x++){
    const y=1818+Math.round(4*Math.sin(x/41));
    for(let yy=y;yy<y+17;yy++)pix(x,yy,yy<y+4?38:100);
  }
  // Unique right-hand cave buttress, connected to the cliff rather than a recurring grotto stack.
  ellipse(967,1490,214,189,100,.9);
  ellipse(833,1545,112,103,0,1.35);
  ellipse(776,1550,95,41,0,2.4); // open mouth to flight shaft
  // A single lesser-right-wall window rather than five repeating destinations.
  ellipse(941,1210,79,63,0,1.2);
  capsule(896,1210,827,1218,31,0);
  // Hanging lower limestone roots, asymmetric and sparse.
  for(const [x,y,r,m] of [[988,1190,20,49],[988,1390,14,38],[991,1716,16,42]]){
    capsule(x,y,x-74,y+58,r,m); // wall-rooted, not an isolated flying collision snag
  }
  // Dark cave ceiling and restrained stalactites: avoid spawn and free-flight route.
  rect(0,0,W,27,101);
  for(const [x,length,r] of [[52,79,24],[237,71,18],[331,51,13],[626,66,22],[744,93,17],[897,63,22]]){
    for(let y=27;y<27+length;y++){
      const span=Math.max(1,Math.round(r*(1-(y-27)/length)+2*Math.sin(y/9+x)));
      for(let xx=x-span;xx<=x+span;xx++)pix(xx,y,100);
    }
  }

/* R2 finishing: source-driven pale filament branching; wall-attached ladder; purposeful
   lower interpretive geologic route network. Every operation alters material cells. */
function finishR2(a,W,H,id,pix,rect,ellipse,capsule) {
  // Branching cavities: subtract slender tributaries from existing pores, instead
  // of another row of complete oval cavities. The main cave matrix remains continuous.
  const voidBranch=(pts,r)=>{for(let i=1;i<pts.length;i++)
    capsule(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],Math.max(3,r*.63-i*.6),0);};
  for(const [pts,r] of [
    [[[126,64],[152,83],[183,94],[217,86]],12],
    [[[238,107],[224,70],[237,42]],9],
    [[[83,273],[120,254],[160,233]],11],
    [[[316,306],[339,272],[363,255]],10],
    [[[89,452],[108,476],[121,512]],10],
    [[[233,490],[257,475],[281,448]],11],
    [[[319,530],[340,554],[371,569]],10],
    [[[91,691],[119,714],[146,726],[163,749]],12],
    [[[242,712],[262,741],[288,754]],9],
    [[[335,903],[367,910],[387,928]],9]
  ])voidBranch(pts,r);
  // Anchored root/filament ribs thread through some voids, with bifurcations
  // and without regular platform pitch. Steel is used only for the ladder.
  const filament=(points,r,m=99)=>{
    for(let i=1;i<points.length;i++)
      capsule(points[i-1][0],points[i-1][1],points[i][0],points[i][1],
        Math.max(3,r-1.1*i),m);
  };
  for(const [p,r] of [
    [[[30,115],[70,134],[106,156],[125,165]],5],
    [[[73,136],[89,105],[110,90]],4],
    [[[35,335],[86,348],[123,369],[154,388]],5],
    [[[86,348],[111,322],[129,301]],4],
    [[[35,551],[73,574],[103,599],[130,614]],5],
    [[[74,577],[91,543],[110,527]],4],
    [[[34,750],[72,776],[105,803],[132,815]],5],
    [[[74,777],[89,745],[116,726]],4],
    [[[31,907],[73,915],[112,904]],5]
  ])filament(p,r);
  // Tiny lace perforations are genuinely cut from existing solid, not drawn
  // as an opaque PNG effect. Multi-scale offset avoids regular hole rows.
  for(let k=0;k<51;k++){
    const x=46+(k*83+Math.floor(17*Math.sin(k*2.61)))%376;
    const y=54+(k*197+Math.floor(23*Math.sin(k*.79)))%883;
    const rx=4+(k*7)%10,ry=7+(k*11)%17;
    if(a[id(x,y)]===99 || a[id(x,y)]===38 || a[id(x,y)]===122)
      ellipse(x,y,rx,ry,0,k*1.73);
  }
  // Remove the former isolated central-vault ladder and its separate foot.
  // This airspace is restored as authentic open flight volume.
  rect(539,590,47,428,0);
  // A left-cliff cutback creates an accessible service shaft immediately next
  // to the porous wall; its undulating edge avoids a rectangular drilled trench.
  for(let y=578;y<=1017;y++){
    const edge=Math.round(449+8*Math.sin(y/76)+4*Math.sin(y/21));
    for(let x=edge;x<520;x++)if(a[id(x,y)]!==3)pix(x,y,0);
    for(let x=edge-4;x<edge;x++)
      if(a[id(x,y)]!==0 && a[id(x,y)]!==3)pix(x,y,y<960?99:38);
  }
  // Ladder ~24 px outboard of the eroded cave face. Its right edge at x487
  // leaves the exact legacy midshaft location (512,854) a 31x27-clear centre.
  for(let y=574;y<=1016;y++){
    for(let x=466;x<=468;x++)pix(x,y,62);
    for(let x=485;x<=487;x++)pix(x,y,62);
    if(y%23<3)for(let x=469;x<485;x++)pix(x,y,62);
  }
  // Four cliff-tied brackets, never a free-floating prop.
  // A framed access portal breaks the ladder where the lower porous cave
  // enters the open shaft; the rest remains visibly wall-tied.
  rect(460,786,32,79,0);
  capsule(323,823,537,823,37,0);
  for(const y of [632,741,946]){
    const edge=Math.round(449+8*Math.sin(y/76)+4*Math.sin(y/21));
    for(let yy=y;yy<y+5;yy++)for(let x=edge-7;x<=467;x++)pix(x,yy,49);
  }
  // The final landing actually joins the old broad shelf; keep its broad
  // east flight bypass, rather than closing the vault with a full-width deck.
  for(let x=457;x<502;x++)for(let y=1012;y<1019;y++)pix(x,y,y<1015?62:49);
  // Lower HALF: west-rooted massive stratified buttresses and asymmetric
  // nested fly-through cuts. Source's lower geology is adapted, not claimed
  // as literal full-PNG parity.
  const gauss=(y,c,s)=>Math.exp(-Math.pow((y-c)/s,2));
  for(let y=1140;y<1834;y++){
    let reach=147+274*gauss(y,1318,105)+144*gauss(y,1516,87)+211*gauss(y,1717,102);
    reach+=26*Math.sin(y/73)+9*Math.sin(y/18);
    reach=Math.max(80,Math.min(486,Math.round(reach)));
    for(let x=18;x<reach;x++){
      const edge=x>reach-10,shale=Math.sin(y/47+x/91)>1.10;
      pix(x,y,edge?38:(shale?49:100));
    }
  }
  // Distinct passage A: high canyon hollow and long mouth to central air.
  ellipse(145,1345,118,113,0,.43);
  capsule(188,1349,318,1323,38,0);
  capsule(302,1328,513,1338,38,0);
  capsule(115,1412,193,1459,32,0);
  // Distinct passage B: diagonal midwall chute, joining the same lower
  // flight vault by a separate aperture and sheltered balcony.
  capsule(164,1507,275,1530,39,0);
  capsule(265,1530,480,1512,33,0);
  ellipse(176,1547,56,58,0,2.12);
  // Distinct passage C: bottom return, wider than any tested actor hull.
  ellipse(143,1694,102,116,0,2.17);
  capsule(180,1697,318,1672,41,0);
  capsule(307,1675,526,1704,40,0);
  capsule(166,1737,246,1773,36,0);
  // Rooted west ledges are geological shelves, not hovering timbers.
  for(const [y,xmax] of [[1413,405],[1583,357],[1797,419]]){
    for(let x=19;x<xmax;x++){
      const top=y+Math.round(4*Math.sin(x/38)+2*Math.sin(x/11));
      for(let yy=top;yy<top+10;yy++)if(yy<1840&&a[id(x,yy)]!==0)
        pix(x,yy,yy<top+3?38:49);
    }
  }
  // East asymmetry: two natural cliff-rooted overhangs, with genuine windows.
  for(let y=1234;y<1450;y++){
    let tip=974-306*gauss(y,1334,74)+13*Math.sin(y/27);
    for(let x=Math.max(560,Math.round(tip));x<1006;x++){
      if(a[id(x,y)]===3)continue;
      pix(x,y,x<tip+13?38:49);
    }
  }
  capsule(760,1321,933,1330,31,0); // real east-face gallery
  ellipse(891,1372,64,29,0,1.84); // irregular daylit throat
  for(let y=1656;y<1817;y++){
    const tip=981-265*gauss(y,1733,55)+11*Math.sin(y/21);
    for(let x=Math.max(624,Math.round(tip));x<1006;x++)pix(x,y,x<tip+12?38:100);
  }
  capsule(779,1716,935,1710,39,0);
  capsule(804,1735,775,1775,27,0);
  // Root two naturally separated filament islands back to their mother wall.
  // Small 8-cell-wide tissue bridges cross existing pore necks without blocking
  // the named 31x27 operational airspaces or hiding a blocked waypoint.
  capsule(220,38,254,38,8,99);
  capsule(107,489,141,489,8,99);
  // Nonrepeating east-side landing, attached to the main cliff mass.
  for(let x=780;x<1006;x++){
    const top=1584+Math.round(6*Math.sin(x/48)+2*Math.sin(x/17));
    for(let y=top;y<top+13;y++)if(a[id(x,y)]!==0)
      pix(x,y,y<top+4?38:49);
  }
  // Remove strictly isolated 1–4-cell pale chips left by the branching
  // subtractive carver: these are stray solid collision needles, not geology.
  const nTop=W*960, touched=new Uint8Array(nTop), wave=new Int32Array(nTop);
  const isTissue=m=>m===38||m===99||m===122;
  for(let seed=0;seed<nTop;seed++){
    if(touched[seed]||!isTissue(a[seed]))continue;
    let first=0,last=1;wave[0]=seed;touched[seed]=1;
    while(first<last){
      const at=wave[first++],x=at%W,y=at/W|0;
      for(const nx of [at-1,at+1,at-W,at+W]){
        if(nx<0||nx>=nTop||touched[nx]||!isTissue(a[nx]))continue;
        const xx=nx%W,yy=nx/W|0;
        if(Math.abs(xx-x)+Math.abs(yy-y)!==1)continue;
        touched[nx]=1;wave[last++]=nx;
      }
    }
    if(last<=4)for(let j=0;j<last;j++)a[wave[j]]=0;
  }
}

  finishR2(a,W,H,id,pix,rect,ellipse,capsule);
  require('./finish_r2c.js')(a,W,H);
  require('./finish_r2a_geometry.js')(a,W,H);
  require('./finish_r2b.js')(a,W,H);
  require('./finish_r2c2.js')(a,W,H);
  require('./finish_r2c3.js')(a,W,H);
  // Reserved exact historical flight sites are not renumbered or proximity-waived.
  // Real accessible volume is checked independently by the qualification step.
  const stable=new Set([0,3,38,42,49,62,66,99,100,101,122]);
  const counts={};for(let k=0;k<N;k++){const m=a[k];counts[m]=(counts[m]||0)+1;if(!stable.has(m))throw Error("Unsupported/unstable authored material "+m);}
  // Lossless final-state coalescence, not historical stamp inflation.
  const edits=[]; let active=new Map();
  for(let y=0;y<H;y++){
    const next=new Map();
    for(let x=0;x<W;){
      const m=a[id(x,y)],start=x++;
      while(x<W&&a[id(x,y)]===m)x++;
      if(m===0)continue;
      const key=start+":"+ (x-start)+":"+m;
      if(active.has(key)){const e=active.get(key);e[3]++;next.set(key,e);}
      else{const e=[start,y,x-start,1,m];edits.push(e);next.set(key,e);}
    }
    active=next;
  }
  const setup={...baseline,edits};
  const json=JSON.stringify(setup);
  if(edits.length>32768)throw Error("Rectangles "+edits.length+" exceed 32768");
  if(json.length>1048576)throw Error("JSON bytes "+json.length+" exceed 1048576");
  const replay=new Uint8Array(N);
  for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)replay.fill(m,id(x,yy),id(x+w,yy));
  let mismatches=0;for(let i=0;i<N;i++)if(replay[i]!==a[i])mismatches++;
  if(mismatches)throw Error("Reconstruction mismatches "+mismatches);
  return {setup,grid:a,json,rectangles:edits.length,jsonBytes:json.length,mismatches,counts};
}
if(typeof process!=="undefined"&&typeof require!=="undefined"&&require.main===module){
  const fs=require("fs"),cp=require("child_process"),path=require("path");
  const here=__dirname, name="setup-filament-shaft-cavern.json";
  const rel="cybersand-canvases/1024x2048/biome-0037a-filament-shaft-cavern/"+name;
  const baseline=JSON.parse(cp.execFileSync("git",["show","8b43319f3eb43d2deef8502d59f70849cd0179f5:"+rel],{encoding:"utf8",maxBuffer:2097152,cwd:here}));
  const out=buildR2(baseline);
  if(process.argv.includes("--check")) {
    if(fs.readFileSync(path.join(here,name),"utf8")!==out.json)throw Error("Current setup does not match deterministic R2 output");
  } else fs.writeFileSync(path.join(here,name),out.json);
  console.log("R2 deterministic rebuilt",out.rectangles,"rectangles",out.jsonBytes,"bytes",out.mismatches,"cell mismatches");
}
