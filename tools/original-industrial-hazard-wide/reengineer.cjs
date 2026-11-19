'use strict';
// R2: real-cell engineered bearings and distinct industrial processes.
// No source image, render overlay, invented material ID, or altered fluid.
module.exports=function reengineer(g,index,spec,{W,H,MAT}) {
  const old=g.slice(), S=MAT.iron, Q=MAT.quartz, G=MAT.glow, C=MAT.glass;
  const braces=[],instrument=[];
  function span(x0,y0,x1,y1,thick,id,label) {
    const count=Math.ceil(Math.hypot(x1-x0,y1-y0));
    for(let k=0;k<=count;k++) {
      const x=Math.round(x0+(x1-x0)*k/Math.max(1,count)),
            y=Math.round(y0+(y1-y0)*k/Math.max(1,count)),radius=Math.floor(thick/2);
      for(let yy=Math.max(0,y-radius);yy<=Math.min(H-1,y+radius);yy++)
        for(let xx=Math.max(0,x-radius);xx<=Math.min(W-1,x+radius);xx++){
          const p=yy*W+xx;if(g[p]===0)g[p]=id;
        }
    }
    braces.push({label,from:[x0,y0],to:[x1,y1],thickness:thick});
  }
  // A second engineered reactor emergency ingress through a dry shear web.
  // Preserve all Water/Lava enclosures. Physically opens a >=31x27 path
  // independently of the primary east door during the 1250,515 closure.
  function dryHatch(x0,y0,w,h,label) {
    let removed=0;
    for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++) {
      const p=y*W+x,m=g[p];
      if(m===3||m===8)throw Error('dry hatch intersects mobile fluid '+label);
      if(m!==0){g[p]=0;removed++;}
    }
    instrument.push(label+' ('+removed+' real solid cells removed)');
  }
  function inlay(x0,y0,x1,y1,thick,id,label) {
    const count=Math.ceil(Math.hypot(x1-x0,y1-y0)),radius=Math.floor(thick/2);
    for(let k=0;k<=count;k++) {
      const x=Math.round(x0+(x1-x0)*k/Math.max(1,count)),
            y=Math.round(y0+(y1-y0)*k/Math.max(1,count));
      for(let yy=Math.max(0,y-radius);yy<=Math.min(H-1,y+radius);yy++)
        for(let xx=Math.max(0,x-radius);xx<=Math.min(W-1,x+radius);xx++){
          const p=yy*W+xx,m=g[p];
          if(m!==0&&m!==3&&m!==8)g[p]=id;
        }
    }
    instrument.push(label);
  }
  if(index===0) {
    // Essential ring side bearing leaves the southern reactor flight port OPEN.
    span(849,404,883,434,8,S,'western reactor shear-buttress');
    span(1690,333,1735,333,8,S,'east distillation wall tie');
    span(1220,430,1280,430,8,S,'gyre ring east-side bearing');
    span(805,330,850,330,8,S,'quench rail to reactor service mast');
    span(464,340,464,355,8,S,'quench overdeck bearing');
    span(1268,354,1288,354,8,S,'hood cantilever reaction joint');
    span(850,335,855,335,8,S,'west hood reaction joint');
    span(1684,401,1715,401,8,S,'condenser-to-evacuation bearing');
    // The 446..538 primary east reactor portal is cut off by the independent
    // 55x45 obstruction at (1250,515). A lower human/robot-scale service
    // hatch preserves another 31x27 Midge ingress below that interruption.
    // A dry steel web remains between the upper and lower portals.
    dryHatch(1260,548,50,67,'lower reactor emergency service hatch');
    // Inlaid process markings do not change the structural collision footprint.
    inlay(468,584,752,584,3,Q,'quench transfer manifold');
    inlay(852,779,1260,779,3,C,'sealed heat-transport casing');
    inlay(1380,606,1660,606,3,Q,'distillate and return service manifold');
    inlay(1430,595,1430,644,3,G,'assay feed indicator');
    inlay(1553,595,1553,672,3,G,'distillation inspection feed');
    inlay(1725,701,1998,701,3,C,'evacuation bulkhead pressure indication');
    for(const x of [455,607,747]) inlay(x,764,x+38,764,3,G,'quench vessel inspection rim');
  } else {
    // Twin plasma hood now carried to the cyclone mast; no tank interactions.
    span(1344,293,1323,293,8,S,'western reactor gantry into cyclone mast');
    span(1392,393,1378,393,8,S,'small plasma collar bearing');
    inlay(913,379,1086,232,3,C,'cyclone intake-facing baffle');
    // Locally inspected short separation lip avoids over-fragmenting rectangles.
    inlay(1158,199,1202,228,3,Q,'cyclone upper separation lip');
    inlay(925,790,1283,790,4,G,'low particulate collection rail');
    inlay(452,506,842,506,3,C,'cold siphon upper manifold');
    inlay(1351,568,1520,568,3,Q,'hot reactor lower isolation monitor');
    inlay(1582,742,1717,742,3,C,'cold reactor recovery manifold');
    for(const [x,y] of [[500,777],[632,776],[782,776]])
      inlay(x,y,x+22,y,3,G,'differentiated siphon analyser');
    for(const [x,y,len] of [[310,993,80],[832,992,110],[1120,989,72],[1570,993,97]])
      inlay(x,y,x+len,y-2,3,Q,'irregular sediment brace');
  }
  let added=0,recoloured=0,removed=0,water=0,lava=0;
  for(let p=0;p<g.length;p++){
    if(!old[p]&&g[p])added++;
    else if(old[p]&&!g[p])removed++;
    else if(old[p]&&old[p]!==g[p])recoloured++;
    if((old[p]===3)!==(g[p]===3))water++;
    if((old[p]===8)!==(g[p]===8))lava++;
  }
  if(water||lava)throw Error('sealed fluid material changed');
  return {revision:'R3',added_cells:added,removed_cells:removed,inlaid_cells:recoloured,
    static_braces:braces,process_markings:instrument,
    note:'R3 retained R2 material bearings plus a genuine dry emergency hatch; dynamic native processes untested'};
};
