"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26B20B, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}





 // Underroot Windbreak complete independent geometry

 // UNDERROOT WINDBREAK NURSERY / ISOLATION GATE. Independent low-horizon sibling.
 function terrace(points,m,step=10){for(let y=0;y<H;y+=step){const cy=y+(step>>1),xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=cy&&b[1]>cy)||(b[1]<=cy&&a[1]>cy))xs.push(a[0]+(cy-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),step,m);}}
 const C=M;
 R(0,988,W,36,C.rock);
 terrace([[0,1024],[0,546],[92,551],[197,577],[310,626],[407,676],[526,771],[650,861],[743,1024]],C.rock);
 terrace([[2048,1024],[2048,513],[1954,529],[1865,554],[1794,601],[1732,665],[1672,743],[1588,861],[1505,1024]],C.rock);
 for(let x=0;x<W;x+=24){let y=988+Math.round(4*Math.cos(x*.023));R(x,y,24,H-y,C.schist);}
 for(let x=0;x<670;x+=49)R(x,846+Math.floor(x*.1),7,69,C.schist);
 for(let x=1550;x<2048;x+=53)R(x,903-Math.floor((x-1550)*.16),8,61,C.schist);
 // Side-entered inhabited west and east, not decorative room silhouettes.
 R(96,606,283,135,0);R(202,744,312,109,0);R(142,862,355,85,0);
 R(1756,594,279,136,0);R(1661,739,371,115,0);R(1608,864,423,83,0);
 R(345,700,200,89,0);R(1720,693,140,85,0);
 // The continuous undergrowth service conduit is separated from the open surface.
 R(435,892,1347,64,0);R(479,828,102,129,0);R(1652,806,96,151,0);
 R(455,934,1323,23,0);
 for(let [x,y,w] of [[108,730,274],[207,840,303],[150,938,346],[1770,715,247],[1673,840,362],[1616,935,411]])R(x,y,w,13,C.titanium);
 // Low wide living field, NOT central mast. Three long nursery pans on separate columns.
 for(let i=0;i<3;i++){
   let x=510+i*293, y=736+(i%2)*19;
   R(x,y,265,15,C.titanium); R(x+13,y-12,239,10,C.glassDark);R(x+19,y-17,223,5,C.chrome);
   for(let j=0;j<8;j++){
     let sx=x+28+j*27, top=y-47-(j%3)*9;
     R(sx,y-42,5,29,C.conduit);
     if(j%2===0)L(sx+2,y-40,sx-10,top,4,C.quartz);else L(sx+2,y-38,sx+13,top+4,3,C.window);
     R(sx-3,top-3,12,5,j%3===0?C.signal:C.window);
   }
   for(let k=0;k<4;k++){let px=x+34+k*60;L(px,y+14,px-17,904,9,C.steel);L(px+4,y+14,px+33,900,6,C.conduit);}
 }
 // Windbreak distributed crest: interrupted roof, not one continuous ceiling.
 const canopy=[[382,511,539,473],[567,470,727,442],[758,449,907,455],[939,456,1099,444],[1124,451,1286,468],[1321,474,1448,518]];
 for(let [x,y,X,Y] of canopy){L(x,y,X,Y,12,C.titanium);L(x,y-12,X,Y-12,3,C.chrome);}
 for(let x=473;x<1436;x+=151){let roofY=454+Math.round(11*Math.sin(x*.008));L(x,roofY,x+12,677,8,C.steel);L(x+11,roofY+15,x+27,671,5,C.conduit);R(x+20,roofY+8,13,9,C.signal);}
 // West condensation catcher atop founded bank.
 L(319,617,435,533,22,C.titanium);L(430,532,496,575,12,C.steel);
 R(316,595,77,11,C.chrome);R(330,575,14,19,C.signal);R(356,580,27,13,C.glassDark);
 // Long catenary with spaced inspection clamps.
 L(516,691,1375,691,8,C.conduit);
 for(let x=565;x<1360;x+=89){R(x,679,13,22,C.chrome);R(x+3,669,7,8,C.window);}
 // Primary nursery surveyed irrigation intake.
 R(133,715,218,12,C.steel);R(154,672,23,39,C.chrome);R(195,689,74,22,C.glassDark);R(288,686,45,25,C.window);
 L(173,670,231,638,7,C.titanium);R(236,633,17,13,C.signal);
 // Root-bank sample ledger.
 R(238,826,245,10,C.titanium);R(256,797,22,26,C.chrome);
 for(let j=0;j<4;j++){let x=299+j*30;R(x,801,17,23,j%2?C.quartz:C.window);R(x+4,790,8,10,C.signal);}
 L(260,786,347,765,7,C.conduit);
 // Isolation tower OFF-CENTRE at far east; sealed vertical clean/dirty interface.
 L(1523,845,1523,434,23,C.iron);L(1635,848,1635,362,27,C.titanium);
 L(1523,430,1624,358,18,C.titanium);L(1638,368,1700,492,18,C.steel);
 L(1501,832,1439,911,24,C.iron);L(1664,800,1772,907,18,C.iron);
 R(1536,468,83,14,C.titanium);R(1536,561,85,14,C.titanium);R(1537,744,83,15,C.titanium);
 R(1552,482,15,25,C.chrome);R(1592,478,16,24,C.glassDark);
 R(1543,578,13,22,C.window);R(1601,582,15,18,C.signal);
 R(1557,713,16,25,C.glassDark);R(1590,714,16,22,C.quartz);
 L(1487,504,1525,533,6,C.conduit);
 // Quarantine mechanical lock: opposing jaws around an OPEN route.
 R(1453,624,59,15,C.titanium);R(1641,621,78,15,C.chrome);
 R(1475,603,19,20,C.window);R(1664,594,16,25,C.signal);
 L(1473,591,1509,548,8,C.titanium);L(1660,580,1699,539,8,C.steel);
 // East cliffside autoclave, intake and transit.
 R(1790,700,198,13,C.titanium);R(1808,665,24,32,C.chrome);
 for(let j=0;j<4;j++){let x=1852+j*30;R(x,675,18,21,j%2?C.window:C.glassDark);R(x+4,662,9,12,C.quartz);}
 R(1702,825,287,12,C.steel);R(1721,793,22,29,C.chrome);
 R(1766,806,56,15,C.glassDark);R(1854,794,71,28,C.window);
 L(1738,791,1830,761,7,C.titanium);R(1957,796,17,25,C.signal);
 // West habitat firebreak / refuge.
 R(162,718,173,10,C.titanium);R(175,681,23,34,C.steel);
 R(223,690,68,24,C.glassDark);R(303,686,20,26,C.window);L(187,679,236,651,6,C.conduit);
 // Four differently equipped below-grade workfaces.
 R(562,950,173,11,C.titanium);R(578,932,18,18,C.chrome);
 R(616,938,35,11,C.window);L(584,931,656,905,7,C.conduit);R(680,934,22,17,C.quartz);
 R(825,950,195,11,C.titanium);R(842,932,23,18,C.steel);
 for(let j=0;j<4;j++)R(887+j*28,935-(j%2)*5,16,16,j%2?C.glassDark:C.window);
 R(1097,950,190,11,C.titanium);R(1115,928,27,21,C.chrome);
 R(1164,931,62,17,C.window);R(1246,928,14,21,C.signal);L(1122,925,1234,908,5,C.conduit);
 R(1406,950,158,11,C.titanium);R(1422,932,19,18,C.steel);
 R(1464,935,41,13,C.glassDark);for(let k=0;k<4;k++)R(1513+k*9,928,5,20,C.chrome);
 // Wide-air return and two excavated rescue shafts.
 R(477,840,90,121,0);R(1650,821,107,141,0);R(529,879,1158,41,0);
 const sites={
  "West windbreak arrivals":[126,514],"Cliff shelter loft":[330,525],
  "Habitat refuge":[220,653],"West nursery ledger":[318,760],
  "West lower intake":[332,899],"Upwind free crossing":[580,405],
  "Nursery bank alpha":[610,664],"Nursery bank beta":[897,635],
  "Nursery bank gamma":[1173,634],"Canopy signal bridge":[1004,383],
  "Condensation rescue":[503,810],"Windbreak survey pier":[1377,560],
  "East clean gate top":[1586,296],"Sealed gate throat":[1582,632],
  "Quarantine sample lock":[1740,567],"East autoclave bay":[1847,639],
  "East cold dispatch":[1862,769],"East ridge overflight":[1923,450],
  "Deep irrigation valve":[748,878],"Deep xenoseed sorter":[1048,884],
  "Deep quarantine vent":[1349,878],"East return shaft":[1692,901]
 };
 
 // Midge-scale opened SERVICE PORTALS, not proxy-site waivers:
 R(450,586,1038,79,0); // horizontal bypass below the discontinuous windbreak roof, above nursery pans
 R(390,544,155,164,0); // west intake to nursery approach
 R(472,714,110,137,0); // west entered ledger side portal to nursery air
 R(286,721,293,82,0); // generous 31x27 connected ledger ingress
 R(1327,517,177,148,0); // open survey pier
 R(1485,601,196,70,0); // real horizontally open dirty/clean gate at mid-level
 R(1610,727,125,130,0); // east quarantine/dispatch side portal
 R(1583,733,318,64,0); // generous 31x27 clean freight portal
 R(1640,554,110,119,0); // east clean dispatch air bridge
 R(477,790,104,111,0); // independently excavated low west rescue
 R(1632,779,137,121,0); // low east rescue
 for(const [name,[x,y]] of Object.entries(sites))R(x-20,y-19,41,39,0);


  function tieStructures(){
  const N=g.length,mark=new Int32Array(N),q=new Int32Array(N),comps=[null];
  for(let k=0;k<N;k++)if(g[k]&&!mark[k]){
   let id=comps.length,hd=0,tl=1,edge=false;q[0]=k;mark[k]=id;
   while(hd<tl){let a=q[hd++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
    for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!mark[n]){mark[n]=id;q[tl++]=n;}}
   comps.push({edge,count:tl});
  }
  let owner=new Int32Array(N),distance=new Uint16Array(N),origin=new Int32Array(N);
  let queue=new Int32Array(N),hd=0,tl=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;queue[tl++]=i;}
  let edges=new Map();
  while(hd<tl){let a=queue[hd++],x=a%W,d=distance[a],oa=owner[a];
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N){
    if(!owner[n]){owner[n]=oa;origin[n]=origin[a];distance[n]=d+1;queue[tl++]=n;}
    else if(owner[n]!==oa){
     let ob=owner[n],key=Math.min(oa,ob)+":"+Math.max(oa,ob),length=d+distance[n]+1,best=edges.get(key);
     if(!best||length<best.length)edges.set(key,{a:origin[a],b:origin[n],oa,ob,length});
    }
   }
  }
  let parent=new Int32Array(comps.length);for(let i=0;i<parent.length;i++)parent[i]=i;
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(let i=1;i<comps.length;i++)if(comps[i].edge)parent[i]=0;
  let ties=0, longest=0;
  for(let e of [...edges.values()].sort((a,b)=>a.length-b.length)){
   let a=find(e.oa),b=find(e.ob);if(a===b)continue;parent[a]=b;
   L(e.a%W,(e.a/W)|0,e.b%W,(e.b/W)|0,4,M.conduit);
   ties++;longest=Math.max(longest,e.length);
  }
  for(let i=1;i<comps.length;i++)if(find(i)!==find(0))throw Error("Disconnected component graph "+i);
  return {ties,longest};
 }



 const tie_info=tieStructures();
 // Final source-grounded support ties preserve the open deep return at all Midge hulls.
 const r2_workcell_anchors={ties:0,longest:0};
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
  let s=sites["West windbreak arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1564,622,1601,643]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Sealed gate throat")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West windbreak arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const expectedKeys=["actors","brush","edits","extent","fire","liquid_policy","material","next_id","normalize","response","rule_radius","selected","source","version"];
 if(JSON.stringify(Object.keys(setup).sort())!==JSON.stringify(expectedKeys))throw Error("Invalid Setup-v2 root schema");
 if(setup.actors.length!==1||JSON.stringify(Object.keys(setup.actors[0]).sort())!==JSON.stringify(["hash","id","model","options","spawn"]))throw Error("Invalid actor schema");
 if(setup.actors[0].spawn.length!==2||setup.actors[0].spawn.some((v,i)=>v!==sites["West windbreak arrivals"][i]))throw Error("Wrong literal Midge spawn");
 if(clearances.some(z=>z.passed!==Object.keys(sites).length))throw Error("Spawn / site blocked");
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
 const crops=[["01-west-nursery-shelter",65,455,520,415],["02-propagation-banks",490,525,865,310],["03-distributed-windbreak",380,365,1115,292],["04-east-isolation-gate",1430,320,618,550],["05-deep-irrigation-works",460,837,1320,136]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {world_group:"Underroot Relay System",world_group_sibling:2,role:"Upstream windbreak nursery, optical seed screening and asymmetric sealed isolation gate",concept:"Windbreak Nursery Isolation Gate",original_no_source:true,seed:a.seed,anchor:"wide-graftloom-slipway",anchor_head:"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657",engine_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[2048,1024],material_cell_count:a.g.length,material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,unrooted_cells:a.unrooted,structural_ties:a.tie_info,rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,source_max_rectangles:32768,source_max_bytes:1048576,legacy_bridge_fallback:4096,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,clearances:a.clearances,physical_obstruction:{box:[1564,622,1601,643],isolated_site:"Sealed gate throat",result:a.bypass},images:a.images.map(([n,b])=>({name:n,bytes:b.length,sha256:sha256(b)})),crops:a.crops,static:"CREATOR-STATIC-PASS",native:"NATIVE-UNTESTED",independent:"PENDING",status:"DRAFT/HOLD"};}
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
 console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",verified_files:output.map(q=>q[0]),plane_sha256:makeReceipt(a).plane_sha256,rectangles:a.rect.length,sites:a.clearances.map(c=>c.passed),obstruction_other_sites:Object.keys(a.sites).length-1,png_decoded_pixel_parity:"PASS",native:"NATIVE-UNTESTED",verify},null,2));
}
