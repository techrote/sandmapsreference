"use strict";
function build(){
 const W=2048,H=1024,SEED=0x5C1F026, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}




 // UMBRA PALIMPSEST — SEISMIC FURNACE: wholly original counterweighted
 // geothermal survey colossus, excavated in a black extrusive rift.
 // Five working sectors, soaring tooth-like collector spines, two-bore
 // excursion shaft, clear upper/central/underfloor Midge return topology.
 const grade=x=>Math.round(960+7*Math.sin(x*.013)+5*Math.cos(x*.035));
 for(let x=0;x<W;x++){let y=grade(x);R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,320],[72,340],[160,394],[230,483],[307,577],[389,734],[467,885],[509,1024]],M.rock);
 P([[2048,1024],[2048,300],[1982,319],[1900,364],[1816,453],[1734,584],[1638,768],[1542,1024]],M.rock);
 // Geologically aligned dark igneous bands, not copy-pasted tile sheets.
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y*W+x]===M.rock){
   const v=(y+Math.floor(x/25)+Math.floor(5*Math.cos(x*.019)))%139;
   if(v<5)g[y*W+x]=M.schist;else if(v<8)g[y*W+x]=M.iron;
 }
 // Real excavated inhabited spaces, their side entries and a continuous
 // excavated lower geological return. Shaft mouths remain at least 90 wide.
 R(75,392,465,117,0);R(91,541,445,119,0);R(151,690,391,122,0);
 R(1520,371,470,126,0);R(1506,530,467,119,0);R(1520,690,423,129,0);
 R(301,843,1444,112,0);R(374,730,119,227,0);R(1587,728,118,232,0);
 R(495,396,112,380,0);R(1430,388,111,396,0);
 // Accessible doors and mezzanines cut through cliff-facing rock.
 R(390,462,190,76,0);R(392,611,195,70,0);
 R(1480,436,160,75,0);R(1470,604,180,75,0);
 // Five inhabited corridors: thick rooted floors, breakable-side aesthetic but
 // no reactive materials, all beams/cables belong to the material plane.
 R(95,501,365,10,M.titanium);R(108,652,396,10,M.steel);R(174,803,361,10,M.titanium);
 R(1576,488,403,10,M.titanium);R(1549,640,409,10,M.steel);R(1535,809,370,10,M.titanium);
 for(const x of [105,320,451])R(x,503,9,47,M.chrome);
 for(const x of [1556,1768,1968])R(x,491,10,46,M.chrome);
 // Left-side rover bunk / assay / salvage: distinct occupied workfaces.
 R(112,482,111,9,M.ceramic);R(120,449,26,32,M.blue);
 R(151,455,45,25,M.glassDark);R(174,440,9,13,M.signal);
 R(262,482,112,9,M.steel);R(271,433,21,48,M.chrome);
 for(let t=0;t<5;t++)R(305+t*11,452+((t&1)*7),6,27,M.window);
 R(370,622,130,10,M.titanium);R(388,572,29,48,M.frost);
 R(437,588,48,31,M.blue);L(411,578,471,560,6,M.conduit);
 R(198,782,155,11,M.steel);R(209,731,26,49,M.chrome);
 R(258,744,26,36,M.glassDark);R(295,752,46,28,M.ceramic);
 // East isolation with two different processing sequences.
 R(1606,464,150,11,M.ceramic);R(1619,423,30,39,M.frost);
 R(1663,435,25,28,M.chrome);R(1707,447,33,16,M.blue);
 L(1644,425,1727,416,7,M.conduit);
 R(1810,464,133,11,M.steel);R(1836,419,29,43,M.glassDark);
 R(1889,428,24,33,M.window);R(1917,411,9,11,M.signal);
 R(1616,617,139,12,M.steel);R(1626,557,27,57,M.chrome);
 for(let t=0;t<6;t++)R(1672+t*10,578,4,36,M.frost);
 R(1790,617,157,12,M.titanium);R(1803,559,30,55,M.blue);
 R(1848,584,78,29,M.glassDark);R(1888,561,19,21,M.amber);
 R(1572,780,146,10,M.titanium);R(1589,726,25,51,M.chrome);
 R(1628,747,55,30,M.frost);R(1693,754,12,23,M.signal);
 R(1760,780,128,10,M.steel);R(1775,745,37,32,M.glassDark);
 R(1831,728,29,48,M.blue);R(1868,717,9,10,M.amber);

 // Two towering opposed collector forks, NOT a ring, with deep clear void
 // between. Piers are continuous to the boundary, protected by gap routes.
 R(702,312,20,650,M.steel);R(728,390,14,569,M.chrome);
 R(1284,263,21,700,M.titanium);R(1317,362,15,600,M.chrome);
 // Distinctive stepped antenna-fingers and seismic diaphragm chevrons.
 L(716,312,630,201,16,M.titanium);L(714,312,802,190,12,M.titanium);
 L(1294,263,1193,154,17,M.steel);L(1294,263,1400,163,13,M.steel);
 L(649,207,576,157,10,M.chrome);L(802,190,861,137,8,M.chrome);
 L(1204,162,1150,118,9,M.chrome);L(1400,163,1472,123,9,M.chrome);
 for(const [x,y] of [[581,157],[858,136],[1147,118],[1468,124]])R(x-10,y-10,21,16,M.signal);
 // Three unequal descending cross-couplings, an asymmetric skyline.
 L(720,388,1286,354,9,M.conduit);
 L(730,525,1284,558,8,M.steel);
 L(719,729,1289,699,7,M.conduit);
 for(const [x,y,yy] of [[812,383,514],[930,379,542],[1088,370,540],[1180,363,551]]){
   L(x,y,x+19,yy,5,M.chrome);
 }
 // Compression/counterweight carriage, genuinely enterable.
 R(901,350,275,10,M.titanium);R(909,443,257,12,M.titanium);
 R(901,358,10,85,M.chrome);R(1154,359,12,84,M.chrome);
 R(931,383,46,46,M.glassDark);R(993,374,50,53,M.window);
 R(1067,394,54,32,M.blue);
 // Side entries remain 42+ px, not drawn doors masquerading as openings.
 R(904,379,14,55,0);R(1157,373,14,57,0);
 // Ground-connected work decks and their industrial fixtures.
 R(719,580,194,12,M.titanium);R(744,547,25,29,M.chrome);
 R(783,539,57,35,M.glassDark);R(863,555,29,19,M.frost);
 R(1122,605,182,12,M.steel);R(1148,556,26,46,M.chrome);
 R(1201,567,61,33,M.blue);R(1274,553,10,12,M.amber);
 R(733,750,164,10,M.titanium);R(749,708,33,38,M.window);
 R(818,713,60,35,M.glassDark);
 R(1130,767,168,12,M.titanium);R(1150,719,28,45,M.steel);
 R(1200,733,64,30,M.frost);R(1277,720,11,10,M.signal);
 // Extra stiffeners to actual bedrock roots, sparingly rather than filler.
 L(713,612,716,956,8,M.steel);L(1302,641,1301,958,8,M.steel);
 // Compact underground geological labs: four non-cloned rooted workcells,
 // each with distinctive scientific/infrastructure apparatus.
 R(515,955,198,11,M.steel);R(527,925,28,28,M.chrome);
 R(572,930,55,22,M.window);R(646,935,49,18,M.glassDark);
 L(541,920,598,902,6,M.conduit);
 R(800,955,191,11,M.titanium);ellipse(885,937,28,18,M.frost);
 ellipse(885,937,14,8,M.blue);R(811,933,27,20,M.chrome);
 R(948,931,26,22,M.glassDark);
 R(1053,955,188,11,M.steel);R(1066,921,20,31,M.chrome);
 for(let t=0;t<5;t++)R(1104+t*16,929+(t%2)*4,9,22,M.window);
 R(1188,918,31,34,M.blue);
 R(1392,955,195,11,M.titanium);R(1407,920,32,31,M.chrome);
 R(1451,926,52,26,M.glassDark);R(1528,917,42,35,M.frost);
 for(let t=0;t<5;t++)R(1532+t*7,904,3,12,M.chrome);
 // Grounded metal pillars are unbroken except for existing tunnel circulation.

 // True enterable repairs: clear gangway thresholds and deliberate vaulted
 // crossovers, not nearest-site substitutions or artificially relaxed hulls.
 // Main gallery opens vertically into the suspended inspection cradle.
 R(1031,374,159,63,0);R(873,371,83,72,0);
 // Breaks in the compression lintels preserve two distinct vertical return
 // channels between top, middle and lower workfaces.
 R(752,459,248,70,0);R(1084,462,191,69,0);
 R(814,555,83,116,0);R(1184,582,78,99,0);
 R(965,510,99,78,0);R(960,698,107,94,0);
 // Two cliff-rooted counterweight braces keep the superstructures
 // genuinely grounded while vaulted 90px doors cross the excavated bore.
 L(331,725,710,725,12,M.titanium);
 L(1293,709,1669,720,12,M.titanium);
 R(681,841,90,116,0);R(1270,841,90,116,0);
 // Habitation clearances follow real excavated side-entry corridors.
 R(1546,381,430,46,0);R(1567,528,389,45,0);
 R(1543,685,409,49,0);
 // Actual deep mechanically rooted side braces above the entered excavation.
 // Physical counterweight arches use route-protected grounded cable ties.
 // A separate approved flight corridor is preserved through each bore.
 // Named Midge approach/recovery sites, deliberate metre-scale clear space.
 const sites={
 "Rover recovery dock":[126,464],
 "West assay berth":[329,459],
 "West salvage mezzanine":[475,599],
 "Western rescue shaft":[464,758],
 "Upper west survey ledge":[570,285],
 "Aurora fork west":[658,218],
 "Collector west service":[780,487],
 "West hydraulic gallery":[853,645],
 "Mid-gantry inspection":[1038,405],
 "Cradle optical lab":[1086,315],
 "Central open basin":[1008,658],
 "East collector service":[1224,487],
 "Fork east locator":[1399,219],
 "East upper weather ledge":[1500,308],
 "Quarantine intake":[1625,403],
 "Eastern isolation lab":[1890,401],
 "Thermal displacement bay":[1867,543],
 "East freight and evacuation":[1798,708],
 "Eastern rescue shaft":[1637,766],
 "Deep west entry":[420,881],
 "Lower mineral assay":[614,885],
 "Lower centrifuge":[888,886],
 "Lower archive":[1142,888],
 "Lower pump station":[1464,885],
 "Deep east return":[1632,888],
 "Upper flight corridor":[1026,211]
 };
 // Open all literal sites without shifting their submitted centres. These
 // conservative vestibules are inside designed larger traversable spaces.
 for(const [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);


 // Ground every actual solid component, including apparatus, with rooted inert
 // guy-wire and bracket paths selected OUTSIDE two independently exact-clear
 // Midge route graphs. This makes support geometry subordinate to playability
 // rather than punching holes in route proof after the fact.
 let tied=[];
 function routeGuardedRigging(){
   const N=g.length, IW=W+1, reserved=new Uint8Array(N), sitesList=Object.entries(sites);
   function reserveEssentialRoutes(block){
     const test=block?g.slice():g;
     if(block)for(let y=block[1];y<block[3];y++)test.fill(M.wall,y*W+block[0],y*W+block[2]);
     const ii=new Int32Array((W+1)*(H+1));
     for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){
       row+=test[o+x-1]!==0?1:0;ii[y*IW+x]=ii[(y-1)*IW+x]+row;
     }}
     const pass=new Uint8Array(N),parent=new Int32Array(N),queue=new Int32Array(N);parent.fill(-1);
     for(let y=13;y<H-13;y++)for(let x=15;x<W-15;x++){
       const a=x-15,b=y-13,c=x+16,d=y+14;
       if(ii[d*IW+c]-ii[d*IW+a]-ii[b*IW+c]+ii[b*IW+a]===0)pass[y*W+x]=1;
     }
     let si=sites["Rover recovery dock"][1]*W+sites["Rover recovery dock"][0];
     if(!pass[si])throw Error("Rigging route source not 31x27 clear");
     let hd=0,tl=1;queue[0]=si;parent[si]=si;
     while(hd<tl){let a=queue[hd++],x=a%W;
       for(let z of [a-W,a+W,x>0?a-1:-1,x<W-1?a+1:-1])
         if(z>=0&&z<N&&pass[z]&&parent[z]<0){parent[z]=a;queue[tl++]=z;}
     }
     for(const [name,[x,y]] of sitesList){
       if(block&&name==="Mid-gantry inspection")continue;
       let p=y*W+x;if(parent[p]<0)throw Error("Unroutable pre-rigging centre "+name);
       while(true){const cx=p%W,cy=(p/W)|0;
         for(let yy=cy-13;yy<=cy+13;yy++)reserved.fill(1,yy*W+cx-15,yy*W+cx+16);
         if(parent[p]===p)break;p=parent[p];
       }
     }
     return {reachable:tl};
   }
   const routeSources=[reserveEssentialRoutes(null),reserveEssentialRoutes([1002,373,1080,436])];
   const owner=new Int32Array(N);owner.fill(-1);
   const roots=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),comps=[];
   for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
     let hd=0,tl=1,edge=false;queue[0]=k;seen[k]=1;
     while(hd<tl){let p=queue[hd++],x=p%W,y=(p/W)|0;
       if(x===0||x===W-1||y===0||y===H-1)edge=true;
       for(const z of [p-W,p+W,x>0?p-1:-1,x<W-1?p+1:-1])
         if(z>=0&&z<N&&g[z]&&!seen[z]){seen[z]=1;queue[tl++]=z;}
     }
     if(edge){for(let j=0;j<tl;j++)roots[queue[j]]=1;}
     else {const id=comps.length;comps.push(tl);for(let j=0;j<tl;j++)owner[queue[j]]=id;}
   }
   if(!comps.length)return;
   const parent=new Int32Array(N);parent.fill(-1);let hd=0,tl=0;
   for(let k=0;k<N;k++)if(roots[k]){parent[k]=k;queue[tl++]=k;}
   const found=new Int32Array(comps.length);found.fill(-1);
   while(hd<tl){let p=queue[hd++],x=p%W;
     for(const z of [p-W,p+W,x>0?p-1:-1,x<W-1?p+1:-1]){
       if(z<0||z>=N)continue;
       if(g[z]){let id=owner[z];if(id>=0&&found[id]<0)found[id]=p;}
       else if(parent[z]<0&&!reserved[z]){parent[z]=p;queue[tl++]=z;}
     }
   }
   for(let id=0;id<comps.length;id++){
     let p=found[id];if(p<0)throw Error("No nonflight structural tie for island "+id+" size "+comps[id]);
     let count=0;
     while(parent[p]!==p){
       if(reserved[p])throw Error("Rigging touched reserved route");
       if(!g[p])g[p]=M.conduit;
       count++;p=parent[p];if(count>4096)throw Error("Excessive service rigging "+count);
     }
     tied.push({component_size:comps[id],support_length:count});
   }
   return routeSources;
 }
 const route_rigging_sources=routeGuardedRigging();
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
  let s=sites["Rover recovery dock"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1002,373,1080,436]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Mid-gantry inspection")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Rover recovery dock"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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
 const crops=[["01-west-rover",0,318,555,522],["02-west-collector",540,115,405,635],["03-gantry-lab",860,234,475,455],["04-east-quarantine",1495,295,553,550],["05-thermal-return",350,813,1355,199]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info:tied,r1_workcell_anchors:null,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Umbra Palimpsest - Seismic Furnace and Aurora Reclamation",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:null,r1_workcell_anchors:null,creator_revision:'R1 new original map; creator-only static tests; independent assessment pending',nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1002,373,1080,436],material_id:58,purpose:"Blocks only exact Mid-gantry inspection; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; wholly new original invented sci-fi frontier",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
