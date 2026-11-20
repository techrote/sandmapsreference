"use strict";

function level(){
 const W=2048,H=1024,M={BED:100,VOID:101,CON:58,STEEL:62,SLATE:49,ZINC:113,IRON:117,GLASS:120,QUARTZ:122,ICEGLASS:123,POLY:128,WATER:3};
 const grid=new Uint8Array(W*H),ceil=new Int16Array(W),floor=new Int16Array(W);
 const min=(a,b)=>Math.min(a,b),max=(a,b)=>Math.max(a,b);
 const clamp=(v,a,b)=>max(a,min(b,v));
 const bell=(x,p,r)=>Math.exp(-Math.pow((x-p)/r,2));
 function rect(x,y,w,h,v,ink=false){
  const l=clamp(Math.round(x),0,W),r=clamp(Math.round(x+w),0,W),
        t=clamp(Math.round(y),0,H),b=clamp(Math.round(y+h),0,H);
  for(let yy=t;yy<b;yy++)for(let xx=l;xx<r;xx++){
   let k=yy*W+xx;if(!ink || (grid[k]!==0&&grid[k]!==M.WATER))grid[k]=v;
  }
 }
 function oval(cx,cy,rx,ry,v,ink=false){
  for(let y=max(0,Math.floor(cy-ry));y<min(H,Math.ceil(cy+ry));y++)
   for(let x=max(0,Math.floor(cx-rx));x<min(W,Math.ceil(cx+rx));x++)
    if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1){
     let i=y*W+x;if(!ink||(grid[i]!==0&&grid[i]!==M.WATER))grid[i]=v;
    }
 }
 function beam(x0,y0,x1,y1,r,v,ink=false){
  let dx=x1-x0,dy=y1-y0,den=dx*dx+dy*dy;
  for(let y=max(0,Math.floor(min(y0,y1)-r));y<min(H,Math.ceil(max(y0,y1)+r));y++)
   for(let x=max(0,Math.floor(min(x0,x1)-r));x<min(W,Math.ceil(max(x0,x1)+r));x++){
    let t=clamp(((x-x0)*dx+(y-y0)*dy)/(den||1),0,1);
    if((x-x0-t*dx)**2+(y-y0-t*dy)**2<=r*r){
      let i=y*W+x;if(!ink||(grid[i]!==0&&grid[i]!==M.WATER))grid[i]=v;
    }
   }
 }
 // NEW design: a double-horizon drydock cut into geological bed and shipyard roof.
 // Unobstructed flight is the negative space: outgoing at y366, returning at y656.
 for(let x=0;x<W;x++){
  ceil[x]=clamp(Math.round(178+12*Math.sin(x*.008)+8*Math.sin(x*.025)+61*bell(x,493,147)+77*bell(x,1088,192)+55*bell(x,1602,157)),153,296);
  floor[x]=clamp(Math.round(814+13*Math.sin(x*.006)+10*Math.sin(x*.023)-67*bell(x,337,118)-93*bell(x,939,175)-72*bell(x,1588,139)),702,841);
  for(let y=0;y<ceil[x];y++){
   grid[y*W+x]= y>ceil[x]-12?M.STEEL:y>ceil[x]-33?M.CON:
     ((Math.floor(x/83)+Math.floor(y/69))%9===0?M.SLATE:M.BED);
  }
  for(let y=floor[x];y<H;y++){
   grid[y*W+x]=y<floor[x]+17?M.CON:y>955&&((x+3*y)%181)<26?M.VOID:M.BED;
  }
 }
 // West magnetic launch house, reachable from the upper flight line through a wide lift throat.
 rect(111,59,277,135,0);rect(269,161,97,207,0);
 rect(124,83,29,97,M.STEEL);rect(124,92,73,12,M.ZINC);rect(126,161,91,9,M.QUARTZ);
 rect(215,91,18,84,M.STEEL);rect(229,97,91,12,M.IRON);rect(241,110,21,12,M.ZINC);
 for(let j=0;j<4;j++)rect(148+j*24,111,13,38,j%2?M.ICEGLASS:M.GLASS);
 rect(303,69,66,11,M.POLY,true);
 // The launch engine is physically rooted in the lower formation, but sits well below flight.
 oval(226,832,119,77,0);rect(162,824,125,13,M.STEEL);
 beam(166,826,218,904,13,M.IRON);beam(282,826,241,906,13,M.IRON);
 rect(191,891,93,19,M.QUARTZ,true);rect(181,913,115,20,M.CON,true);
 // West departure/return guide faces are physically painted along support rims.
 for(let j=0;j<9;j++){let x=70+25*j;rect(x,ceil[x]-7,14,6,M.QUARTZ,true);}
 for(let j=0;j<7;j++){let x=82+29*j;rect(x,floor[x]+2,17,7,M.ICEGLASS,true);}
 // Crew shaft and production-district tunnels with usable 80+ cell entrances.
 rect(399,828,204,125,0);rect(465,687,93,180,0);
 rect(404,812,111,10,M.ZINC,true);rect(533,814,59,10,M.ZINC,true);
 rect(425,908,150,13,M.STEEL,true);rect(420,889,50,11,M.IRON,true);
 for(let k=0;k<3;k++){rect(480+k*28,880,17,22,M.GLASS,true);}
 // District 2: staggered grounded overhead cable cranes, both with deliberately
 // different mast and jib geometry. No floating supports or perspective tops.
 beam(485,ceil[485]-12,602,298,12,M.STEEL);
 beam(488,ceil[488]-20,626,282,5,M.ZINC);
 beam(604,298,697,294,10,M.IRON);
 beam(624,283,697,294,5,M.QUARTZ);
 beam(637,290,665,312,5,M.STEEL);
 beam(748,ceil[748]-11,792,278,15,M.STEEL);
 beam(750,ceil[750]-28,864,293,7,M.ZINC);
 beam(790,275,884,279,11,M.IRON);
 beam(861,280,879,316,7,M.POLY);
 // Roof-founded cutter cathedral at the huge open central void (all solid parts
 // above 325; the broad y366 lane must remain fully available).
 beam(1018,ceil[1018]-18,1088,295,12,M.STEEL);
 beam(1088,295,1179,ceil[1179]-18,12,M.STEEL);
 beam(1016,ceil[1016]-22,1178,ceil[1178]-19,5,M.ZINC);
 beam(1088,280,1088,318,12,M.CON);
 rect(1065,307,46,16,M.ICEGLASS,true);
 // A genuine broad dock undercut with sculpted lift keel and two enterable workshops,
 // all anchored to the lower bed. The U-shaped pressed-hull silhouette is original.
 oval(1042,862,234,110,0);
 rect(1003,696,97,222,0); // a full-hull entry shaft into the dry pressed bay
 beam(818,805,859,953,11,M.STEEL);beam(1265,812,1223,956,12,M.STEEL);
 oval(1045,935,126,23,M.CON);oval(1045,926,101,13,M.STEEL);
 rect(926,948,240,13,M.IRON);
 // Architectural graving ribs are tied to lower material, never detached.
 for(let j=0;j<5;j++){
  let x=850+j*42,y=974-j*8;
  beam(x,1005,x+26,y,8,j%2?M.ZINC:M.IRON);
 }
 // Central cockpit, load-testing and pressure gauges on a floor-rooted island.
 rect(942,899,32,71,M.IRON);rect(943,887,74,16,M.STEEL);
 rect(1013,918,29,51,M.STEEL);rect(1012,908,80,16,M.QUARTZ);
 for(let j=0;j<4;j++)rect(1055+j*18,918,8,24,j%2?M.GLASS:M.ICEGLASS);
 // Clear outbound mid-route at y~490; anchored upper overhangs guide the choice.
 beam(1278,ceil[1278]-8,1322,305,9,M.STEEL);
 beam(1363,ceil[1363]-8,1398,304,9,M.IRON);
 beam(1322,305,1398,304,8,M.ZINC);
 // District 4: cold-ballast cassette halls dug into dense material near the bottom.
 rect(1436,816,246,138,0);rect(1505,688,105,170,0);
 rect(1454,934,211,12,M.CON,true);
 rect(1478,899,55,11,M.STEEL,true);
 rect(1558,886,82,11,M.QUARTZ,true);
 rect(1461,833,17,69,M.IRON,true);
 for(let j=0;j<4;j++)rect(1554+j*22,902,12,26,M.ZINC,true);
 // Two independent closed-loop cryocassettes: stable tank cavity and full solid
 // walls on all sides; no fluid is adjacent to any open-air cell.
 rect(686,912,108,49,M.WATER);
 rect(1710,940,108,38,M.WATER);
 // Quench bank's recognizable pressure comb is painted into grounded floor cells.
 for(let j=0;j<7;j++){
  let x=1470+j*31,base=floor[x];
  rect(x,base+13,11,61,j%2?M.IRON:M.ZINC,true);
  rect(x,base+73,24,8,M.ICEGLASS,true);
 }
 // East gravity return throat, with return-facing diagonal baffles firmly founded
 // in the roof and the floor. Both straight flight lanes have ample clearance.
 beam(1782,ceil[1782]-13,1835,312,13,M.STEEL);
 beam(1940,ceil[1940]-11,1897,305,10,M.STEEL);
 beam(1850,ceil[1850]-12,1827,297,7,M.ZINC);
 for(let k=0;k<5;k++){let x=1760+k*48;rect(x,floor[x]+3,25,8,M.ICEGLASS,true);}
 // East navigation refuge: oval void and direct 90-cell throat from open air.
 oval(1888,876,85,74,0);rect(1855,713,81,170,0);
 rect(1849,925,88,11,M.STEEL,true);rect(1832,933,118,10,M.CON,true);
 // Ballast reef and shallow 3-bump diagonal impact field (actual rooted material).
 for(let [cx,rise,width] of [[402,33,73],[727,42,84],[1380,28,95]]){
  for(let x=max(0,cx-width);x<min(W,cx+width);x++){
   let y=Math.round(floor[x]-rise*bell(x,cx,width*.58));
   rect(x,y,1,max(0,floor[x]-y)+14,M.CON);
   rect(x,y,1,4,M.ICEGLASS,true);
  }
 }
 // Original direction hierarchy: contrasted west/east portal patterns on grounded
 // steel, not floating signal confetti. Lower return uses a different hue/motif.
 for(let x=132;x<=1800;x+=37){
  rect(x,ceil[x]-5,13,5,(x<760?M.QUARTZ:x<1350?M.ZINC:M.ICEGLASS),true);
 }
 for(let x=1800;x>=150;x-=43)rect(x,floor[x]+4,19,7,(x>1230?M.POLY:x>700?M.GLASS:M.ICEGLASS),true);
 // Grounded status pylons (nothing free-floating, nothing in either race envelope).
 for(let x of [440,827,1310,1620]){
  rect(x,floor[x]+8,19,76,M.STEEL,true);rect(x-8,floor[x]+6,34,11,M.ZINC,true);
 }

 // Rooted machinery for the three occupied service rooms. Each shelf is mechanically
 // attached to the surrounding actual bed; the enormous voids are not empty facades.
 rect(102,93,83,12,M.STEEL);rect(113,163,142,12,M.CON);
 rect(141,104,19,60,M.IRON);rect(177,111,15,52,M.IRON);
 rect(135,115,82,11,M.ZINC);rect(148,126,59,9,M.QUARTZ);
 for(let k=0;k<3;k++)rect(153+k*17,136,10,27,k%2?M.GLASS:M.ICEGLASS);
 rect(348,101,48,13,M.STEEL);rect(363,111,12,47,M.IRON);
 rect(360,133,26,11,M.QUARTZ);rect(354,145,24,7,M.ICEGLASS);
 // West hydraulic maintenance hall: continuous foundation and an asymmetric
 // mounted dual-piston pump, clear access from the 93-cell hatch.
 rect(403,941,191,14,M.CON);rect(424,878,17,66,M.STEEL);
 rect(440,888,89,13,M.IRON);rect(448,901,12,39,M.IRON);
 oval(480,922,26,19,M.ZINC);oval(480,922,12,9,M.GLASS);
 rect(541,899,19,46,M.STEEL);rect(557,912,29,12,M.POLY);
 rect(554,930,36,10,M.ICEGLASS);
 // Ballast workface, structurally mounted left/right of the center-site envelope.
 rect(1441,944,237,12,M.CON);
 rect(1452,876,20,69,M.STEEL);rect(1462,876,66,10,M.IRON);
 rect(1492,886,14,53,M.IRON);rect(1468,897,43,11,M.GLASS);
 rect(1620,874,16,71,M.STEEL);rect(1610,886,70,10,M.ZINC);
 rect(1641,899,13,44,M.IRON);
 for(let j=0;j<4;j++)rect(1640+j*8,910+j*7,6,6,M.ICEGLASS);
 // East oval shelter stores a brake jaw anchored into the floor beneath the void.
 rect(1838,931,106,15,M.STEEL);
 rect(1871,921,13,16,M.ZINC);rect(1888,927,28,11,M.QUARTZ);

 // Verify / excise any disconnected inert decoration produced by subtractive cutting.
 const seen=new Uint8Array(grid.length),q=new Int32Array(grid.length);let a=0,b=0;
 const solid=i=>grid[i]!==0&&grid[i]!==M.WATER;
 for(let x=0;x<W;x++)for(let i of [x,(H-1)*W+x])if(solid(i)&&!seen[i]){seen[i]=1;q[b++]=i}
 for(let y=0;y<H;y++)for(let i of [y*W,y*W+W-1])if(solid(i)&&!seen[i]){seen[i]=1;q[b++]=i}
 while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;
  for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])
   if(n>=0&&!seen[n]&&solid(n)){seen[n]=1;q[b++]=n}
 }
 let isolated=0;for(let i=0;i<grid.length;i++)if(solid(i)&&!seen[i]){grid[i]=0;isolated++}
 if(isolated>18000)throw Error("substantial detachment "+isolated);
 let airEdges=0,water=0;for(let i=0;i<grid.length;i++)if(grid[i]===M.WATER){
  water++;let x=i%W,y=(i/W)|0;
  for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])
   if(n<0||grid[n]===0)airEdges++;
 }
 if(airEdges)throw Error("uncontained water edges "+airEdges);
 const hist={};for(let v of grid)hist[v]=(hist[v]||0)+1;
 // Maximal horizontal-run to vertical-repeat exact non-overlap rectangle encoding.
 let active=new Map(),edits=[];
 for(let y=0;y<H;y++){
  const next=new Map(),o=y*W;
  for(let x=0;x<W;){
   let m=grid[o+x],st=x++;while(x<W&&grid[o+x]===m)x++;
   if(!m)continue;
   let k=st+":"+ (x-st)+":"+m;
   if(active.has(k)){let e=active.get(k);e[3]++;next.set(k,e)}else next.set(k,[st,y,x-st,1,m]);
  }
  for(let e of active.values())if(![...next.values()].includes(e))edits.push(e);
  active=next;
 }
 for(let e of active.values())edits.push(e);
 edits.sort((a,b)=>a[1]-b[1]||a[0]-b[0]||a[4]-b[4]);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",
  hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",
  spawn:[124,366],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],
  next_id:2,selected:1,edits};
 const json=JSON.stringify(setup);if(edits.length>32768||json.length>1048576)throw Error("setup capacity "+edits.length+" "+json.length);
 let visits=0;const played=new Uint8Array(grid.length),mask=new Uint8Array(grid.length);
 for(let [x,y,w,h,m] of edits){
  if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bad edit");
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
   let i=yy*W+xx;if(mask[i])throw Error("overlap at "+i);mask[i]=1;played[i]=m;
  }visits+=w*h;
 }
 for(let i=0;i<grid.length;i++)if(grid[i]!==played[i])throw Error("replay mismatch "+i);
 if(visits>32000000)throw Error("work exceeded");
 const sites=[
  ["West Launch",124,366],["Launch Control",269,137],
  ["Crane One",578,365],["Crane Two",816,365],
  ["Drylift Upper",1080,365],["Ballast Upper",1510,365],
  ["East Capture",1875,386],["Return Descent",1925,516],
  ["East Lower",1792,652],["Ballast Return",1510,652],
  ["Drydock Return",1138,651],["Crane Return",710,652],
  ["West Return",290,653],["West Brake",120,538],
  ["Drylift Interior",1084,875],["Ballast Lab",1573,896],
  ["West Finish",164,366]
 ].map(([name,x,y])=>({name,x,y}));
 const stride=W+1,sat=new Uint32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let s=0;for(let x=1;x<=W;x++){
  s+=grid[(y-1)*W+x-1]!==0?1:0;sat[y*stride+x]=sat[(y-1)*stride+x]+s;
 }}
 function free(x,y,w,h){
  let l=x-Math.floor(w/2),t=y-Math.floor(h/2),r=l+w,b=t+h;
  if(l<0||t<0||r>W||b>H)return false;
  return sat[b*stride+r]-sat[t*stride+r]-sat[b*stride+l]+sat[t*stride+l]===0;
 }
 function bfs(w,h,barrier){
  const legal=new Uint8Array(grid.length),reach=new Uint8Array(grid.length),queue=new Int32Array(grid.length);
  const xrad=Math.floor(w/2),yrad=Math.floor(h/2);
  for(let y=yrad;y<H-yrad;y++)for(let x=xrad;x<W-xrad;x++)
   if(free(x,y,w,h)&&(!barrier||!barrier(x,y)))legal[y*W+x]=1;
  let start=366*W+124;if(!legal[start])throw Error("invalid exact spawn");
  let i=0,n=1;queue[0]=start;reach[start]=1;
  while(i<n){let k=queue[i++],x=k%W,y=(k/W)|0;
   for(let v of [x?k-1:-1,x<W-1?k+1:-1,y?k-W:-1,y<H-1?k+W:-1])
    if(v>=0&&legal[v]&&!reach[v]){reach[v]=1;queue[n++]=v;}
  }
  let missing=sites.filter(s=>!reach[s.y*W+s.x]).map(s=>s.name);
  return {reached:sites.length-missing.length,missing,legal_connected:n};
 }
 const clearances={};for(let [w,h] of [[19,15],[23,19],[31,27]]){
  let r=bfs(w,h);clearances[w+"x"+h]=r;if(r.missing.length)throw Error("exact site clearance "+w+"x"+h+": "+r.missing.join(","));
 }
 let samples=0;for(let x=112;x<1925;x++){
  if(!free(x,366,31,27))throw Error("outbound sample blocked at "+x);
  if(!free(x,652,31,27))throw Error("return sample blocked at "+x);
  samples++;
 }
 // Real temporary concrete obstruction across the upper Drylift aperture.
 // Eligibility is computed for an actor's ENTIRE hull, not just its centre.
 const gate=[966,328,222,78];
 const closure=bfs(31,27,(x,y)=>x>=gate[0]-15&&x<gate[0]+gate[2]+15&&y>=gate[1]-13&&y<gate[1]+gate[3]+13);
 if(closure.reached<sites.length-1||closure.missing.some(m=>m!=="Drylift Upper"))
  throw Error("real obstruction alternate failed "+closure.missing.join(","));
 const report={kind:"CATENARY_SKYHOOK_SHIPYARD_ORIGINAL_RACING_WIDE",
  seed:"0xC471E20261120",engine_main_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",
  extent:[W,H],material_cells:W*H,rectangles:edits.length,setup_json_bytes:json.length,cell_visits:visits,
  setup_source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram:hist,
  exact_replay_mismatches:0,overlap_writes:0,isolated_solids_excavated:isolated,remaining_detached:0,
  sealed_water_air_edges:airEdges,sealed_water_cells:water,
  material_laws:"Only 49,58,62,100,101,113,117,120,122,123,128 are inert immovable Solid RuleKernel::None; water 3 confined movable Water kernel",
  midge:{model:"midge",authored_hull:[4,3],hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[124,366]},
  sites,clearances,straight_flight_31x27_samples_each:samples,
  temporary_gate:{xywh:gate,material:58},gate_alternate:closure,
  districts:["West magnetic launch and recovery","Asymmetric two-crane high yard","Central graving bay and suspended skyhook","Eastern cold-ballast laboratories","East brake and reversal throat"],
  route_graph:"West Launch -> Crane One -> Crane Two -> Drylift Upper -> Ballast Upper -> East Capture -> Return Descent -> East Lower -> Ballast Return -> Drydock Return -> Crane Return -> West Return -> West Brake -> West Finish; mid-height graving short-cut; independent crane/ballast workshops",
  native:"NATIVE-UNTESTED; accepted source 32768 rectangles, installed native bridge may be legacy 4096"};
 return {grid,json,report};
}

function crc32(bytes,start=0,end=bytes.length){
 let c=0xffffffff;for(let i=start;i<end;i++){c^=bytes[i];for(let b=0;b<8;b++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0;
}

function pngFrom(grid,x0,y0,w,h,W=2048){
 function put32(a,p,n){a[p]=(n>>>24)&255;a[p+1]=(n>>>16)&255;a[p+2]=(n>>>8)&255;a[p+3]=n&255}
 const raw=new Uint8Array((w+1)*h);
 for(let y=0;y<h;y++)raw.set(grid.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);
 const blocks=Math.ceil(raw.length/65535),z=new Uint8Array(2+raw.length+5*blocks+4);let pos=0;z[pos++]=120;z[pos++]=1;
 for(let off=0;off<raw.length;){let n=Math.min(65535,raw.length-off),fin=off+n===raw.length;z[pos++]=fin?1:0;z[pos++]=n&255;z[pos++]=(n>>>8)&255;z[pos++]=(~n)&255;z[pos++]=((~n)>>>8)&255;z.set(raw.subarray(off,off+n),pos);pos+=n;off+=n}
 let A=1,B=0;for(let b of raw){A=(A+b)%65521;B=(B+A)%65521}put32(z,pos,((B<<16)|A)>>>0);
 const palette=new Uint8Array(768);for(let id=0;id<256;id++){let i=id*3;palette[i]=13;palette[i+1]=16;palette[i+2]=22}
 const colors={0:[8,12,20],3:[26,101,178],49:[77,90,109],58:[121,128,139],62:[152,176,192],100:[56,62,75],101:[35,42,57],113:[214,176,107],117:[105,115,132],120:[142,222,228],122:[238,230,204],123:[80,176,250],128:[55,180,160]};
 for(let k of Object.keys(colors)){const p=Number(k)*3;palette.set(colors[k],p)}
 const ihdr=new Uint8Array(13);put32(ihdr,0,w);put32(ihdr,4,h);ihdr[8]=8;ihdr[9]=3;
 function chunk(name,payload){
  let arr=new Uint8Array(12+payload.length);put32(arr,0,payload.length);
  for(let i=0;i<4;i++)arr[4+i]=name.charCodeAt(i);
  arr.set(payload,8);put32(arr,8+payload.length,crc32(arr,4,8+payload.length));
  return arr;
 }
 const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("PLTE",palette),chunk("IDAT",z),chunk("IEND",new Uint8Array(0))];
 const png=new Uint8Array(parts.reduce((sum,p)=>sum+p.length,0));let off=0;for(let p of parts){png.set(p,off);off+=p.length}return png;
}

function verifyPng(png,grid,x0,y0,w,h,W=2048){
 const get32=(b,p)=>((b[p]*16777216)+(b[p+1]<<16)+(b[p+2]<<8)+b[p+3])>>>0;
 const sig=[137,80,78,71,13,10,26,10];for(let i=0;i<8;i++)if(png[i]!==sig[i])throw Error("bad PNG signature");
 let pos=8,idat=null,seenIHDR=false,seenPal=false,seenEnd=false;
 while(pos<png.length){if(pos+12>png.length)throw Error("truncated chunk");
  let n=get32(png,pos),type=String.fromCharCode(...png.subarray(pos+4,pos+8)),end=pos+12+n;
  if(end>png.length)throw Error("chunk overrun");
  if(crc32(png,pos+4,pos+8+n)!==get32(png,pos+8+n))throw Error("CRC "+type);
  let data=png.subarray(pos+8,pos+8+n);
  if(type==="IHDR"){if(n!==13||get32(data,0)!==w||get32(data,4)!==h||data[8]!==8||data[9]!==3)throw Error("IHDR mismatch");seenIHDR=true}
  if(type==="PLTE"){if(n!==768)throw Error("palette mismatch");seenPal=true}
  if(type==="IDAT"){if(idat)throw Error("multiple IDAT not supported");idat=data}
  if(type==="IEND"){if(n)throw Error("IEND payload");seenEnd=true;if(end!==png.length)throw Error("trailing PNG bytes")}
  pos=end;
 }
 if(!seenIHDR||!seenPal||!seenEnd||!idat)throw Error("missing critical chunk");
 if(idat[0]!==120||idat[1]!==1)throw Error("invalid zlib header");
 const raw=new Uint8Array((w+1)*h);let j=2,out=0,final=false;
 while(!final){let tag=idat[j++];if((tag&6)!==0)throw Error("unsupported deflate type");final=!!(tag&1);
  let n=idat[j]|(idat[j+1]<<8),inverse=idat[j+2]|(idat[j+3]<<8);j+=4;
  if(((n^inverse)&65535)!==65535)throw Error("deflate NLEN");
  if(j+n>idat.length-4||out+n>raw.length)throw Error("deflate overrun");
  raw.set(idat.subarray(j,j+n),out);out+=n;j+=n}
 if(out!==raw.length||j!==idat.length-4)throw Error("zlib length mismatch");
 let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521}
 if(get32(idat,j)!==(((b<<16)|a)>>>0))throw Error("adler checksum mismatch");
 for(let y=0;y<h;y++){let off=y*(w+1);if(raw[off]!==0)throw Error("unsupported scanline filter");
  for(let x=0;x<w;x++)if(raw[off+x+1]!==grid[(y0+y)*W+x0+x])throw Error("material pixel parity mismatch "+x+","+y)}
 return {pixels:w*h,bytes:png.length,chunk_crc:true,zlib:true,material_parity:true};
}

function base64Encode(bytes){
 const a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",out=[];for(let i=0;i<bytes.length;i+=3){
  let x=bytes[i],y=bytes[i+1],z=bytes[i+2];out.push(a[x>>>2]+a[((x&3)<<4)|((y||0)>>>4)]+(y===undefined?"=":a[((y&15)<<2)|((z||0)>>>6)])+(z===undefined?"=":a[z&63]))}
 return out.join("");
}
function sha256(bytes){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],n=bytes.length,len=((n+9+63)>>6)<<6,msg=new Uint8Array(len);msg.set(bytes);msg[n]=128;
 const hi=Math.floor(n*8/4294967296),lo=(n*8)>>>0;for(let i=0;i<4;i++){msg[len-8+i]=(hi>>>(24-8*i))&255;msg[len-4+i]=(lo>>>(24-8*i))&255}
 const rot=(v,s)=>((v>>>s)|(v<<(32-s)))>>>0;
 for(let off=0;off<len;off+=64){
  const w=new Uint32Array(64);for(let i=0;i<16;i++){let p=off+i*4;w[i]=((msg[p]<<24)|(msg[p+1]<<16)|(msg[p+2]<<8)|msg[p+3])>>>0}
  for(let i=16;i<64;i++){let v=w[i-15],z=w[i-2];w[i]=(w[i-16]+(rot(v,7)^rot(v,18)^(v>>>3))+w[i-7]+(rot(z,17)^rot(z,19)^(z>>>10)))>>>0}
  let [a,b,c,d,e,f,g,t]=h;
  for(let i=0;i<64;i++){let s1=rot(e,6)^rot(e,11)^rot(e,25),ch=(e&f)^(~e&g),tmp1=(t+s1+ch+K[i]+w[i])>>>0,s0=rot(a,2)^rot(a,13)^rot(a,22),maj=(a&b)^(a&c)^(b&c),tmp2=(s0+maj)>>>0;
   t=g;g=f;f=e;e=(d+tmp1)>>>0;d=c;c=b;b=a;a=(tmp1+tmp2)>>>0}
  h=[(h[0]+a)>>>0,(h[1]+b)>>>0,(h[2]+c)>>>0,(h[3]+d)>>>0,(h[4]+e)>>>0,(h[5]+f)>>>0,(h[6]+g)>>>0,(h[7]+t)>>>0];
 }
 return h.map(v=>v.toString(16).padStart(8,"0")).join("");
}
function packageOutputs(){
 const built=level(),g=built.grid,hashBytes=s=>{let a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a};
 const cases=[
 ["overview.png",0,0,2048,1024],
 ["01-magnetic-launch.png",48,32,470,515],
 ["02-skycrane-canyon.png",414,128,490,425],
 ["03-skyhook-and-graving-bay.png",800,178,515,800],
 ["04-ballast-workshops.png",1360,495,450,495],
 ["05-east-reversal-throat.png",1732,199,316,790]
 ];
 const imgs=[],imageChecks=[];
 for(let [name,x,y,w,h] of cases){const bytes=pngFrom(g,x,y,w,h),check=verifyPng(bytes,g,x,y,w,h);
  imageChecks.push({name,rect:[x,y,w,h],sha256:sha256(bytes),...check});imgs.push({name,content:bytes,encoding:"base64"})}
 const receipt={...built.report,grid_sha256:sha256(g),setup_json_sha256:sha256(hashBytes(built.json)),images:imageChecks,
  source_type:"ORIGINAL-NO-REFERENCE",status:"OPEN DRAFT/HOLD",generated_source_mode:"One-byte material ID for each cell, deterministic fixed-seed pure JS, lossless ordered rectangles",
  png_rule:"8-bit indexed PNG; PNG pixel index IS the material ID; PLTE only changes display colour",
  image_verification:"Self-checked signature, IHDR, PLTE, chunk CRC, zlib stored deflate, Adler32, IEND, and exhaustive literal material-ID pixel parity",
  stage:"STATIC AUTHOR VALIDATION; independent auditor and native playtest outstanding"};
 const files=[{name:"setup-catenary-skyhook-shipyard.json",content:built.json,encoding:"utf-8"},
  {name:"qualification.json",content:JSON.stringify(receipt,null,2)+"\n",encoding:"utf-8"},...imgs];
 return {files,receipt};
}
if(typeof require==='function'&&require.main===module){const fs=require('fs');const pkg=packageOutputs();for(const file of pkg.files)fs.writeFileSync(__dirname+'/'+file.name,file.content);console.log(JSON.stringify({grid_sha256:pkg.receipt.grid_sha256,setup_json_sha256:pkg.receipt.setup_json_sha256,rectangles:pkg.receipt.rectangles,sites:pkg.receipt.clearances,images:pkg.receipt.images.map(v=>v.name)},null,2));}

module.exports={level,packageOutputs,sha256,pngFrom,verifyPng};
