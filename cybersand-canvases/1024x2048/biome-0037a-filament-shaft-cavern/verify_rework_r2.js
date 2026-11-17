#!/usr/bin/env node
/**
 * Strict no-waiver source-led R2 Workbench Setup-v2 static qualification.
 * Native Godot/Rapier is NOT tested here. No nearest-air displacement.
 */
const TARGET_R2=[
 ["Upper lattice opening",355,187],["Upper observatory",205,230],
 ["High vault traverse",740,320],["Mid-lattice chamber",274,608],
 ["Lower porous chamber",151,800],["Ladder access viewpoint",626,783],
 ["Broad shelf landing",600,992],["Eastern vertical return",888,1035],
 ["Sub-shelf hall",820,1100],["Left root chamber",144,1363],
 ["East buttress cave",833,1545],["Deep cove return",138,1695],
 ["Reservoir overlook",520,1864]
];
const LEGACY_R1=[
 ["Canopy launch",512,107],["Upper fern observatory",205,230],
 ["Pollen canopy",830,413],["Root lantern gallery",219,588],
 ["Fossil glass alcove",829,772],["Filament nursery",233,976],
 ["Luminous core hollow",824,1160],["Woven-root stair",224,1359],
 ["Echo chambers",832,1567],["Deep calcite grove",219,1764],
 ["Upper free-flight shaft",514,362],["Mid-shaft gallery",512,854],
 ["Root bridge junction",513,1335],["Lower free-flight shaft",518,1706],
 ["Reservoir overlook",520,1864]
];
// Authoritative enum/material state checked against current accepted CyberSand main
// 018bd09503d7f079ddac52e225c2f7daf8d678bf, native/include/cybersand/material.hpp
const STABLE=new Set([0,38,42,49,62,99,100,101,122]);
const WATER=3;
function assertR2(condition,message){if(!condition)throw Error(message);}
function verifyR2(setup,baseline,serialized) {
  const W=1024,H=2048,N=W*H;
  assertR2(setup.version===2&&setup.extent[0]===W&&setup.extent[1]===H,"Incorrect setup-v2 extent");
  assertR2(setup.edits.length<=32768,"Stored edit limit exceeded");
  assertR2(serialized.length<=1048576,"Setup byte limit exceeded");
  assertR2(JSON.stringify(setup)===serialized,"Unstable JSON serialization");
  assertR2(JSON.stringify(setup.actors)===JSON.stringify(baseline.actors),"Actor definition or spawn changed");
  assertR2(JSON.stringify(setup.liquid_policy)===JSON.stringify(baseline.liquid_policy),"Liquid policy drift");
  const grid=new Uint8Array(N),orig=new Uint8Array(N);
  function paint(arr,edits,check){
    let area=0;
    for(let i=0;i<edits.length;i++){
      const rect=edits[i], [x,y,w,h,m]=rect;
      assertR2(rect.length===5 && [x,y,w,h,m].every(Number.isInteger) &&
        x>=0 && y>=0 && w>0 && h>0 && x+w<=W && y+h<=H,"Malformed rectangle "+i);
      if(check)assertR2(STABLE.has(m)||m===WATER,"Unsupported/moving/hazard decoration material "+m);
      area+=w*h;
      for(let yy=y;yy<y+h;yy++)arr.fill(m,yy*W+x,yy*W+x+w);
    }
    return area;
  }
  paint(orig,baseline.edits,false);
  const area=paint(grid,setup.edits,true);
  let diff=0,waterDiff=0,nonzero=0,water=0;
  const histogram={};
  for(let i=0;i<N;i++){
    const m=grid[i];histogram[m]=(histogram[m]||0)+1;
    nonzero+=(m!==0);water+=(m===WATER);
    diff+=(m!==orig[i]);waterDiff+=((m===WATER)!==(orig[i]===WATER));
  }
  assertR2(area===nonzero,"Final non-air rectangles overlap or miss cells");
  assertR2(water===35688&&waterDiff===0,"Unchanged historical Water basin lost cells");
  // Actor-envelope flood fill in exact authored cells: all nonempty IDs BLOCK.
  const stride=W+1,prefix=new Uint32Array((W+1)*(H+1));
  for(let y=0;y<H;y++){let rowsum=0;for(let x=0;x<W;x++){
    if(grid[y*W+x]!==0)rowsum++;
    prefix[(y+1)*stride+x+1]=prefix[y*stride+x+1]+rowsum;
  }}
  const clearance=[];
  for(const [ew,eh] of [[19,15],[23,19],[31,27]]){
    const hx=ew>>1,hy=eh>>1;
    function open(x,y){
      if(x<hx||y<hy||x>=W-hx||y>=H-hy)return false;
      const x0=x-hx,x1=x+hx+1,y0=y-hy,y1=y+hy+1;
      return prefix[y1*stride+x1]-prefix[y0*stride+x1]-prefix[y1*stride+x0]+prefix[y0*stride+x0]===0;
    }
    const seen=new Uint8Array(N),queue=new Int32Array(N);
    let first=0,last=0;
    assertR2(open(512,107),"Actual Midge spawn obstructed at "+ew+"x"+eh);
    seen[107*W+512]=1;queue[last++]=107*W+512;
    while(first<last){
      const current=queue[first++],x=current%W,y=current/W|0;
      for(const next of [current-1,current+1,current-W,current+W]){
        if(next<0||next>=N||seen[next])continue;
        const xx=next%W,yy=next/W|0;
        if(Math.abs(xx-x)+Math.abs(yy-y)!==1||!open(xx,yy))continue;
        seen[next]=1;queue[last++]=next;
      }
    }
    const exact=(sites,label)=>sites.map(([name,x,y])=>{
      const ok=open(x,y)&&seen[y*W+x]===1;
      assertR2(ok,ew+"x"+eh+" cannot reach exact "+label+" "+name+" @ "+x+","+y);
      return {name,x,y,actual_clear:true,reached:true};
    });
    const r2=exact(TARGET_R2,"R2 operation"),legacy=exact(LEGACY_R1,"legacy regression");
    clearance.push({envelope:[ew,eh],spawn_exact:true,component_centres:last,r2_exact:r2.length,legacy_exact:legacy.length});
  }
  const countTissue=(m)=>m===38||m===99||m===122;
  const seenTissue=new Uint8Array(W*960),queue=new Int32Array(W*960),tissueComps=[];
  for(let i=0;i<W*960;i++){
    if(seenTissue[i]||!countTissue(grid[i]))continue;
    let first=0,last=1;queue[0]=i;seenTissue[i]=1;
    while(first<last){
      const current=queue[first++],x=current%W,y=current/W|0;
      for(const next of [current-1,current+1,current-W,current+W]){
        if(next<0||next>=W*960||seenTissue[next])continue;
        const nx=next%W,ny=next/W|0;
        if(Math.abs(nx-x)+Math.abs(ny-y)!==1||!countTissue(grid[next]))continue;
        seenTissue[next]=1;queue[last++]=next;
      }
    }tissueComps.push(last);
  }
  tissueComps.sort((a,b)=>b-a);
  const tissueTotal=tissueComps.reduce((s,n)=>s+n,0);
  assertR2(tissueComps[0]/tissueTotal>0.99,"Hero tissue too fragmented");
  return {
    extent:[W,H],complete_cells:N,rectangles:setup.edits.length,
    max_rectangles:32768,json_bytes:serialized.length,max_json_bytes:1048576,
    final_cell_mismatches:0,changed_cells_from_archived_r1:diff,
    nonempty_cells:nonzero,water_cells:water,water_changed_cells:waterDiff,
    material_histogram:histogram,allowlist:Array.from(STABLE).concat([WATER]).sort((a,b)=>a-b),
    exact_waypoints_r2:TARGET_R2,exact_waypoints_r1_regression:LEGACY_R1,
    clearance,
    upper_tissue_components:tissueComps.slice(0,10),
    connected_primary_tissue_cells:tissueComps[0],tissue_cells:tissueTotal,
    primary_tissue_fraction:+(tissueComps[0]/tissueTotal).toFixed(6),
    native_runtime:"NATIVE-UNTESTED (no installed CyberDemoBridge/Godot/Rapier load, input, collision, simulation, or save/reopen)"
  };
}
if(typeof process!=="undefined"&&typeof require!=="undefined"&&require.main===module){
 const fs=require("fs"),cp=require("child_process"),path=require("path");
 const here=__dirname,name="setup-filament-shaft-cavern.json";
 const rel="cybersand-canvases/1024x2048/biome-0037a-filament-shaft-cavern/"+name;
 const raw=fs.readFileSync(path.join(here,name),"utf8");
 const baseline=JSON.parse(cp.execFileSync("git",["show","8b43319f3eb43d2deef8502d59f70849cd0179f5:"+rel],{encoding:"utf8",maxBuffer:2*1024*1024,cwd:here}));
 const r=verifyR2(JSON.parse(raw),baseline,raw);
 const previewSha=cp.execFileSync("git",["hash-object",path.join(here,"source-reference-preview.jpg")],{encoding:"utf8"}).trim();
 assertR2(previewSha==="168294085274702df98f5698721890fd30874c8f","Source JPEG blob drift");
 cp.execFileSync(process.execPath,[path.join(here,"build_rework_r2.js"),"--check"],{cwd:here,stdio:"pipe"});
 console.log(JSON.stringify(r,null,2));
}
