"use strict";
function level(){
 const W=2048,H=1024,M={S:49,C:58,T:62,B:100,O:101,Z:113,I:117,G:120,Q:122,U:123,P:128,W:3};
 const g=new Uint8Array(W*H),top=new Int16Array(W),bottom=new Int16Array(W);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),bump=(x,c,s)=>Math.exp(-Math.pow((x-c)/s,2));
 function rect(x,y,w,h,m,paint=false){let x0=clamp(Math.round(x),0,W),x1=clamp(Math.round(x+w),0,W),y0=clamp(Math.round(y),0,H),y1=clamp(Math.round(y+h),0,H);for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){let i=yy*W+xx;if(!paint||g[i]&&g[i]!==3)g[i]=m}}
 function oval(cx,cy,rx,ry,m){for(let y=clamp(Math.floor(cy-ry),0,H-1);y<=clamp(Math.ceil(cy+ry),0,H-1);y++)for(let x=clamp(Math.floor(cx-rx),0,W-1);x<=clamp(Math.ceil(cx+rx),0,W-1);x++)if(Math.pow((x-cx)/rx,2)+Math.pow((y-cy)/ry,2)<=1)g[y*W+x]=m}
 for(let x=0;x<W;x++){
  top[x]=clamp(Math.round(192+16*Math.sin(x*.009)+10*Math.sin(x*.027)+52*bump(x,280,100)+37*bump(x,724,160)+54*bump(x,1060,165)+43*bump(x,1512,135)+28*bump(x,1875,100)),167,282);
  bottom[x]=clamp(Math.round(817+16*Math.sin(x*.012)+9*Math.sin(x*.034)-165*bump(x,531,124)-198*bump(x,1030,175)-155*bump(x,1500,151)),597,850);
  for(let y=0;y<top[x];y++){g[y*W+x]=y>top[x]-16?M.C:y>top[x]-30?M.T:y<56&&((Math.floor(x/47)+Math.floor(y/15))%7===0)?M.O:M.S}
  for(let y=bottom[x];y<H;y++)g[y*W+x]=y<bottom[x]+12?M.C:((y+Math.floor(x*.056))%136)<26?M.O:y>952&&((x+Math.floor(y*.22))%227)<28?M.S:M.B;
 }
 // Five enterable and structurally rooted overhead laboratories with 75px shaft mouths.
 const overhead=[["Pulse Injector",142,64,220,131,242,M.Q],["Magnet-Skein",553,62,231,126,655,M.U],["Flywheel Watch",927,51,268,144,1057,M.Q],["Quench-Wave",1411,67,242,129,1492,M.P],["Return Control",1771,73,214,141,1846,M.U]];
 for(let [name,x,y,w,h,door,tint] of overhead){
  rect(x,y,w,h,0);rect(door,y+h-3,75,344-(y+h),0);
  rect(x-13,y-15,w+26,12,M.T,true);rect(x-13,y+h+4,w+26,7,M.I,true);
  for(let j=0;j<4;j++)rect(x+23+j*48,y-22,19,11,tint,true);
  rect(x-9,y+22,9,80,M.Z,true);rect(x+w,y+22,9,80,M.Z,true);
 }
 // Three original founded racing crests, cut from the physical mountain silhouette.
 for(let [x,w,tint] of [[420,230,M.Z],[884,301,M.Q],[1370,302,M.U]])
  for(let xx=x;xx<x+w;xx+=19){rect(xx,bottom[xx]+13,10,65,M.T,true);rect(xx,bottom[xx]+1,15,9,tint,true)}
 // Enterable lower workrooms, actual empty space, not painted facade windows.
 const lower=[["Injector hydraulics",279,855,215,109,340,M.Q],["Twin bearing vault",1128,805,230,151,1224,M.Z],["Quench workshop",1641,856,209,116,1700,M.U]];
 for(let [name,x,y,w,h,door,tint] of lower){
  rect(x,y,w,h,0);rect(door,690,75,y-690+16,0);
  rect(x-13,y-13,w+26,9,M.T,true);rect(x-13,y+h+4,w+26,10,M.I,true);
  for(let j=0;j<5;j++)rect(x+15+j*38,y-28,22,9,tint,true);
 }
 // Two sealed quench vessels; no active chemical spill can touch a racing route.
 for(let [x,y,w,h] of [[722,886,96,51],[1869,893,85,48]]){rect(x,y,w,h,M.W);rect(x-9,y-9,w+18,7,M.T,true);rect(x-9,y+h+3,w+18,7,M.I,true)}
 // Twin excavated air-bearing hollows and supported fin relief near the underpass.
 oval(943,862,70,55,0);oval(1084,854,77,61,0);
 rect(871,797,282,17,M.I,true);rect(878,794,268,8,M.Q,true);
 for(let x=905;x<1139;x+=31)rect(x,805,12,18,M.Z,true);
 for(let j=0;j<4;j++){oval(427+j*54,756+j*7,13,21,0);rect(409+j*54,732+j*7,36,5,M.T,true)}
 for(let j=0;j<4;j++){oval(1376+j*61,793-j*5,16,20,0);rect(1358+j*61,768-j*5,37,7,M.P,true)}
 // Large district signals physically pigmented into the roof and floor boundaries.
 for(let [a,b,tint] of [[60,370,M.Q],[374,815,M.Z],[817,1294,M.Q],[1299,1745,M.U],[1750,2010,M.P]])
  for(let x=a;x<b;x++){g[(top[x]-5)*W+x]=tint;g[(bottom[x]+6)*W+x]=tint}
 for(let j=0;j<6;j++){rect(67+j*8,top[85]+21+j*3,6,15,M.Q,true);rect(1954-j*7,top[1965]+26+j*3,5,14,M.U,true)}

 // Founded cantilever blades and a twin-prong hanging coil: tangible collision geometry.
 // Every blade starts in roof material and terminates ABOVE the 31x27 outbound envelope.
 function beam(x0,y0,x1,y1,r,m){let dx=x1-x0,dy=y1-y0,den=dx*dx+dy*dy;
  for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<=Math.min(H-1,Math.ceil(Math.max(y0,y1)+r));y++)
   for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<=Math.min(W-1,Math.ceil(Math.max(x0,x1)+r));x++){
    let t=clamp(((x-x0)*dx+(y-y0)*dy)/(den||1),0,1);
    if(Math.pow(x-x0-t*dx,2)+Math.pow(y-y0-t*dy,2)<=r*r)g[y*W+x]=m;
   }
 }
 const cantilevers=[[86,190,312],[402,448,312],[492,554,312],[829,859,308],[886,941,312],
  [1205,1270,308],[1326,1378,310],[1665,1710,312],[1982,1940,306]];
 for(let [sx,ex,ey] of cantilevers){
  beam(sx,top[sx]-13,ex,ey,9,M.T);
  beam(sx+2,top[sx]-14,ex,ey-19,3,M.Z);
 }
 // Central double inverted magnet arch has two actual roof-founded endpoints.
 beam(888,top[888]-10,953,297,8,M.I);
 beam(953,297,1008,316,8,M.I);
 beam(1195,top[1195]-12,1134,297,8,M.I);
 beam(1134,297,1083,316,8,M.I);
 rect(1008,305,75,8,M.Q,true);
 // Thick fixed counterweight fins cut the silhouette without faking a perspective layer.
 for(let [sx,shift] of [[478,1],[779,-1],[1394,1],[1746,-1]]){
  beam(sx,top[sx]-9,sx+shift*23,290,7,M.T);
  rect(sx-8,top[sx]-10,16,8,M.U,true);
 }


 // R2 independent Shepherd P1: rooted equipment inside the accessible operator bays.
 rect(140,82,22,96,M.I);rect(155,94,65,13,M.T);rect(153,156,66,12,M.T);
 for(let k=0;k<3;k++){rect(165+k*17,107,12,50,M.Z);rect(169+k*17,115,5,34,k%2?M.U:M.Q)}
 rect(151,171,64,9,M.Z);
 rect(340,77,26,102,M.I);rect(322,90,23,12,M.Q);rect(327,101,14,55,M.T);rect(322,153,25,11,M.Z);
 // Metrology station: sloped indexed probe and opposing diagnostic terminal.
 rect(550,79,21,99,M.I);rect(565,151,75,12,M.T);
 for(let k=0;k<5;k++)rect(571+k*13,130-(k%2)*9,6,22,M.U);
 rect(552,171,83,9,M.Z);
 rect(765,78,23,103,M.I);rect(744,95,27,12,M.U);rect(749,107,17,57,M.T);
 for(let k=0;k<3;k++)rect(751,114+k*13,12,5,M.Q);
 // Flywheel drive: rooted bearing-workface, eccentric hub and radial torque spokes
 // below the return contour; the main upper and lower flight envelopes are untouched.
 oval(1035,727,71,66,M.T);oval(1035,727,60,55,M.I);oval(1035,727,49,44,M.Z);
 oval(1035,727,24,22,M.Q);oval(1035,727,11,11,M.U);
 for(let k=0;k<8;k++){let t=k*Math.PI/4;
  beam(1035+24*Math.cos(t),727+22*Math.sin(t),1035+59*Math.cos(t),727+54*Math.sin(t),4,k%2?M.U:M.Q);
 }
 rect(918,718,58,13,M.I,true);rect(1098,718,91,13,M.I,true);
 rect(942,790,32,9,M.Q,true);rect(1090,790,52,9,M.Q,true);
 // Quench: staggered transfer headers and thermal serpentine channels in inert floor.
 // Distinct from round flywheel; no uncontained water, reactive heat or new flight traps.
 for(let j=0;j<5;j++){let x=1420+j*53;
  rect(x,bottom[x]+24,37,8,j%2?M.P:M.U,true);
  rect(x,bottom[x]+30,7,72,M.T,true);rect(x+30,bottom[x+30]+30,7,72,M.T,true);
  rect(x,bottom[x]+94,37,8,j%2?M.Q:M.U,true);
  for(let q=0;q<3;q++)rect(x+8+q*7,bottom[x+8+q*7]+40+q*14,8,7,M.P,true);
 }
 // Navigation inks live only on existing grounded material: outbound acceleration,
 // east reversing portal, the lower three pressure crests, west recovery.
 for(let k=0;k<8;k++){let x=350+k*38;rect(x,top[x]-6,15,5,M.Q,true)}
 for(let k=0;k<7;k++){let x=1825+k*24;rect(x,bottom[x]+4,11,7,M.P,true)}
 for(let x of [460,560,948,1092,1462,1558])rect(x,bottom[x]+4,20,9,M.Q,true);
 for(let k=0;k<6;k++){let x=148+k*29;rect(x,bottom[x]+4,14,8,M.U,true)}

 // Every inert collision cell must touch some boundary-grounded support.
 const seen=new Uint8Array(g.length),queue=new Int32Array(g.length);let head=0,tail=0,solid=i=>g[i]!==0&&g[i]!==3;
 for(let x=0;x<W;x++)for(let i of [x,(H-1)*W+x])if(solid(i)&&!seen[i]){seen[i]=1;queue[tail++]=i}
 for(let y=0;y<H;y++)for(let i of [y*W,y*W+W-1])if(solid(i)&&!seen[i]){seen[i]=1;queue[tail++]=i}
 while(head<tail){let i=queue[head++],x=i%W,y=(i/W)|0;for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n>=0&&!seen[n]&&solid(n)){seen[n]=1;queue[tail++]=n}}
 let isolated=0;for(let i=0;i<g.length;i++)if(solid(i)&&!seen[i]){g[i]=0;isolated++}
 if(isolated>2000)throw Error("unexpected isolated solids "+isolated);
 // Water must have zero cardinal adjacency to air, including newly excavated voids.
 let leakage=0;for(let i=0;i<g.length;i++)if(g[i]===3){let x=i%W,y=(i/W)|0;for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n<0||g[n]===0)leakage++}
 if(leakage)throw Error("water leakage "+leakage);
 const counts={};for(let i=0;i<g.length;i++)counts[g[i]]=(counts[g[i]]||0)+1;
 const edits=[],active=new Map();for(let y=0;y<H;y++){
  const next=new Map(),off=y*W;
  for(let x=0;x<W;){let val=g[off+x],st=x++;while(x<W&&g[off+x]===val)x++;if(!val)continue;
   let key=st+":"+(x-st)+":"+val;if(active.has(key)){let e=active.get(key);e[3]++;next.set(key,e);active.delete(key)}else next.set(key,[st,y,x-st,1,val])}
  for(let e of active.values())edits.push(e);active.clear();for(let [k,v] of next)active.set(k,v);
 }
 for(let e of active.values())edits.push(e);edits.sort((a,b)=>a[1]-b[1]||a[0]-b[0]||a[4]-b[4]);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[120,350],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 const json=JSON.stringify(setup);if(edits.length>32768||json.length>1048576)throw Error("source budget "+edits.length+" "+json.length);
 const replay=new Uint8Array(g.length),mask=new Uint8Array(g.length);let visits=0;
 for(let [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("invalid rectangle");
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=yy*W+xx;if(mask[i])throw Error("overlap");mask[i]=1;replay[i]=m}visits+=w*h}
 for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("replay mismatch "+i);
 if(visits>32000000)throw Error("work budget");
 const sites=[["Launch",120,350],["Injector dispatch",269,123],["Magnet lab",676,116],["Upper injector",510,350],["Upper flywheel",1030,350],["Upper quench",1530,350],["East turn",1875,510],["East return",1710],["Quench ridge",1500],["Bearing ridge",1030],["Magnet ridge",531],["West return",275],["West turn",125,540],["Bearing vault",1260,895],["Finish",190,350]]
 .map(([name,x,y])=>({name,x,y:y===undefined?Math.round(Math.min(706,bottom[x]-109)):y}));
 // SAT and exact 4-connected conservative free-centre BFS (never substitute checkpoints).
 const stride=W+1,sat=new Uint32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=g[(y-1)*W+x-1]!==0?1:0;sat[y*stride+x]=sat[(y-1)*stride+x]+sum}}
 function free(x,y,w,h){let l=x-Math.floor(w/2),t=y-Math.floor(h/2),r=l+w,b=t+h;if(l<0||t<0||r>W||b>H)return false;return sat[b*stride+r]-sat[t*stride+r]-sat[b*stride+l]+sat[t*stride+l]===0}
 function bfs(w,h,block){let legal=new Uint8Array(g.length),seen=new Uint8Array(g.length),q=new Int32Array(g.length);
  for(let y=Math.floor(h/2);y<H-Math.floor(h/2);y++)for(let x=Math.floor(w/2);x<W-Math.floor(w/2);x++)if(free(x,y,w,h)&&(!block||!block(x,y)))legal[y*W+x]=1;
  let start=350*W+120;if(!legal[start])throw Error("invalid spawn");let a=0,b=1;q[0]=start;seen[start]=1;
  while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;
   for(let n of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(n>=0&&legal[n]&&!seen[n]){seen[n]=1;q[b++]=n}
  }
  return {reached:sites.filter(s=>seen[s.y*W+s.x]).length,missing:sites.filter(s=>!seen[s.y*W+s.x]).map(s=>s.name),free_centres:b};
 }
 const hull={};for(let [w,h] of [[19,15],[23,19],[31,27]]){let r=bfs(w,h);hull[w+"x"+h]=r;if(r.reached!==sites.length)throw Error("unreachable "+w+"x"+h+": "+r.missing)}
 let lineSamples=0;for(let x=160;x<=1850;x++){if(!free(x,350,31,27))throw Error("upper blocked "+x);
  let y=Math.round(Math.min(706,bottom[x]-109));if(!free(x,y,31,27))throw Error("lower blocked "+x);lineSamples++}
 // Model an actual solid temporary gate [918,284,221,165] by exact 31x27 Minkowski expansion.
 const closure=bfs(31,27,(x,y)=>x>=903&&x<=1153&&y>=271&&y<=461);
 if(closure.reached!==sites.length-1||closure.missing.join(",")!=="Upper flywheel")throw Error("closed gate bypass "+closure.missing);
 const report={kind:"FARADAY_RETURNWORKS_ORIGINAL_RACING_WIDE",seed:"0xFA202611",engine_main_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",
  extent:[W,H],material_cells:W*H,rectangles:edits.length,setup_json_bytes:json.length,cell_visits:visits,
  setup_source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram:counts,
  exact_replay_mismatches:0,overlap_writes:0,isolated_solids_excavated:isolated,remaining_detached:0,sealed_water_air_edges:leakage,
  material_laws:"IDs 49,58,62,100,101,113,117,120,122,123,128 are inert immovable Solid/RuleKernel::None; ID 3 is confined movable water",
  midge:{model:"midge",hull:[4,3],hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[120,350]},
  sites,clearances:hull,full_upper_and_lower_31x27_samples_each:lineSamples,temporary_gate:[918,284,221,165,58],gate_bypass_31x27:closure.reached,
  districts:["Pulse Injector","Magnet-Skein Metrology","Twin Flywheel Press","Quench-Wave Exchangers","Reversal Throat"],
  native:"NATIVE-UNTESTED; accepted source supports 32768 rectangles but installed bridge may cap 4096"};
 report.repair_revision="R3 Setup-v2 14-field loader contract repair; R2 rooted pulse/metrology/flywheel/quench geometry unchanged";
 return {grid:g,json,report};
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
 ["01-pulse-injector.png",22,30,520,480],
 ["02-magnet-skein.png",460,28,500,480],
 ["03-twin-flywheel.png",833,320,520,570],
 ["04-quench-exchangers.png",1290,340,500,590],
 ["05-east-turnaround.png",1650,268,398,630]
 ];
 const imgs=[],imageChecks=[];
 for(let [name,x,y,w,h] of cases){const bytes=pngFrom(g,x,y,w,h),check=verifyPng(bytes,g,x,y,w,h);
  imageChecks.push({name,rect:[x,y,w,h],sha256:sha256(bytes),...check});imgs.push({name,content:bytes,encoding:"base64"})}
 const receipt={...built.report,grid_sha256:sha256(g),setup_json_sha256:sha256(hashBytes(built.json)),images:imageChecks,
  source_type:"ORIGINAL-NO-REFERENCE",status:"OPEN DRAFT/HOLD",generated_source_mode:"One-byte material ID for each cell, deterministic fixed-seed pure JS, lossless ordered rectangles",
  png_rule:"8-bit indexed PNG; PNG pixel index IS the material ID; PLTE only changes display colour",
  image_verification:"Self-checked signature, IHDR, PLTE, chunk CRC, zlib stored deflate, Adler32, IEND, and exhaustive literal material-ID pixel parity",
  stage:"STATIC AUTHOR VALIDATION; independent auditor and native playtest outstanding"};
 const files=[{name:"setup-faraday-returnworks.json",content:built.json,encoding:"utf-8"},
  {name:"qualification.json",content:JSON.stringify(receipt,null,2)+"\n",encoding:"utf-8"},...imgs];
 return {files,receipt};
}
if(typeof require==='function'&&require.main===module){const fs=require('fs');const pkg=packageOutputs();for(const file of pkg.files)fs.writeFileSync(__dirname+'/'+file.name,file.content);console.log(JSON.stringify({grid_sha256:pkg.receipt.grid_sha256,setup_json_sha256:pkg.receipt.setup_json_sha256,rectangles:pkg.receipt.rectangles,sites:pkg.receipt.clearances,images:pkg.receipt.images.map(v=>v.name)},null,2));}
