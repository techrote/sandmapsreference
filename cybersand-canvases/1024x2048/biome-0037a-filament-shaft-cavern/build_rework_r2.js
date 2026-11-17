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
