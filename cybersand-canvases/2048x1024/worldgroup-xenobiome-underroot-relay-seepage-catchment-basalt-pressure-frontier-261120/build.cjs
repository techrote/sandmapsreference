"use strict";
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={rock:100,schist:101,iron:49,wall:58,steel:62,conduit:66,titanium:68,signal:77,window:120,quartz:122,glass:129,chrome:131};
 const R=(x,y,w,h,m)=>{let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let i=c;i<d;i++)g.fill(m,i*W+a,i*W+b);};
 function P(poly,m){let ya=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1])))),yb=Math.min(H-1,Math.ceil(Math.max(...poly.map(p=>p[1]))));for(let y=ya;y<=yb;y++){let xs=[];for(let i=0;i<poly.length;i++){let a=poly[i],b=poly[(i+1)%poly.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++)for(let x=Math.max(0,Math.floor(cx-rx));x<Math.min(W,Math.ceil(cx+rx));x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=m;}
 // UNDERROOT SIBLING 03: new asymmetric catchment and a remote single vertical fault, not another nursery or cassette mast.
 R(0,956,W,68,M.schist);
 P([[0,1024],[0,372],[80,385],[170,452],[257,557],[337,667],[418,822],[518,1024]],M.rock);
 P([[2048,1024],[2048,372],[1996,394],[1906,450],[1811,561],[1715,673],[1640,807],[1559,1024]],M.rock);
 P([[420,960],[429,678],[483,675],[517,696],[561,714],[592,748],[664,750],[692,773],[783,786],[807,812],[909,818],[966,842],[1058,862],[1159,877],[1254,910],[1302,955]],M.rock);
 // Discrete dark strata inside basalt, simple long horizon mineral banding, not photographic stippling.
 for(let y=0;y<H;y+=28)for(let x=0;x<W;x+=57){
   let yy=y+((x*17+y*7)%11),len=22+((x+y*3)%29),p=yy*W+x;
   if(yy>450&&yy<1010&&g[p]===M.rock)for(let xx=x;xx<Math.min(W,x+len);xx++)if(g[yy*W+xx]===M.rock)g[yy*W+xx]=M.schist;
 }
 // Broad shared underflow (dry, structurally retained), long enough for future user-authored events.
 R(359,887,1439,58,0); R(375,838,127,118,0);R(1239,832,350,115,0);R(1650,816,145,134,0);
 R(1387,440,146,507,0); // independent deep draw-off fault
 // Unequal inhabited edge settlements physically entered, not decorative cliff facades.
 R(56,427,319,132,0);R(96,585,309,115,0);R(165,710,283,105,0);
 R(1748,451,289,115,0);R(1700,610,333,116,0);R(1624,750,406,105,0);
 R(320,497,143,110,0);R(334,668,139,115,0);
 R(1530,642,218,89,0);R(1530,777,221,98,0);
 for(let [x,y,w] of [[65,544,307],[106,687,290],[173,804,269],[1758,552,258],[1710,713,301],[1634,842,373]]){R(x,y,w,13,M.titanium);R(x+16,y+13,w-32,4,M.conduit);}
 // The huge descending catchment is one offset multistep dam, not another symmetric rotor/twin-pylon pair.
 const steps=[[468,647,133],[607,691,118],[733,737,127],[866,785,129],[1001,832,151],[1161,864,111]];
 for(let i=0;i<steps.length;i++){let [x,y,w]=steps[i];R(x,y,w,12,M.titanium);R(x+11,y+12,w-22,4,M.conduit);R(x+20,y-27,19,26,M.steel);R(x+w-38,y-19,25,17,M.window);if(i<5)L(x+w-3,y+3,steps[i+1][0]+7,steps[i+1][1]+3,9,M.chrome);}
 L(445,649,483,505,18,M.iron);L(483,501,625,556,16,M.titanium);L(626,555,739,632,11,M.steel); // fractured top survey spine
 L(581,641,611,528,14,M.chrome);L(610,526,775,579,7,M.conduit);L(776,580,893,674,13,M.titanium);
 // Lateral slotted seepage collectors; clear visual motion logic without simulating unsupported hydraulics.
 for(let i=0;i<4;i++){let x=550+i*161,y=732+i*36;R(x,y,25,70,M.iron);R(x+6,y+10,14,31,M.glass);L(x+11,y+68,x+59,y+99,8,M.conduit);R(x-17,y-13,62,7,M.chrome);}
 // Layered pressure chambers perched at different elevations, not identical low cabinets.
 for(let [x,y,w] of [[493,620,90],[756,710,88],[985,801,108]]){
   R(x,y,w,10,M.chrome);R(x+7,y-34,17,33,M.titanium);R(x+32,y-29,31,27,M.glass);R(x+41,y-40,11,12,M.signal);
   L(x+17,y-34,x+w-12,y-58,5,M.conduit);
 }
 // A single deep fault, mechanically asymmetric: offset twin draw heads facing a continuous open chasm.
 L(1351,841,1360,398,21,M.iron);L(1560,834,1590,486,15,M.titanium);
 L(1360,398,1439,332,12,M.titanium);L(1588,489,1712,444,14,M.iron);
 L(1348,530,1398,547,10,M.chrome);L(1533,607,1590,611,12,M.titanium);
 R(1351,546,38,18,M.glass);R(1535,624,48,19,M.glass);
 R(1360,563,7,33,M.signal);R(1566,642,10,31,M.window);
 // A pair of partial mechanical gates on independent supports, never a circular rotating fan.
 for(let [x,y] of [[1380,690],[1544,751]]){R(x,y,47,12,M.steel);R(x+4,y-45,12,44,M.chrome);R(x+21,y-31,22,18,M.glass);L(x+5,y-46,x+37,y-74,6,M.conduit);}
 // Geologically rooted side hung sensor balcony plus staggered switch and draw-off.
 R(1280,703,86,11,M.titanium);L(1285,713,1270,849,11,M.iron);
 R(1551,525,105,12,M.titanium);L(1649,531,1694,688,9,M.steel);
 L(1403,826,1487,831,11,M.chrome);R(1429,818,41,8,M.glass);L(1483,837,1561,826,7,M.conduit);
 // West refuge: biologically keyed pressure survey, physical sample carrier and field maintenance.
 R(101,529,126,11,M.steel);R(113,494,26,31,M.chrome);R(156,502,53,22,M.glass);R(177,490,10,11,M.signal);
 R(248,530,100,10,M.titanium);L(256,514,323,470,9,M.conduit);R(310,484,28,28,M.window);
 R(142,678,119,9,M.titanium);R(165,633,22,41,M.iron);R(208,642,40,28,M.glass);R(220,629,11,12,M.signal);
 R(287,675,92,11,M.chrome);R(300,641,24,30,M.iron);R(333,652,28,19,M.window);
 R(197,790,211,11,M.steel);L(217,775,268,745,8,M.conduit);R(267,758,45,28,M.glass);R(349,759,22,28,M.window);
 // East edge habitat and bore-control trade terminal: distinctly different than west.
 R(1781,539,214,11,M.steel);R(1799,507,30,30,M.iron);R(1866,511,66,24,M.glass);R(1957,500,24,35,M.window);
 L(1775,492,1899,472,8,M.titanium);R(1886,464,19,10,M.signal);
 R(1727,700,274,11,M.chrome);R(1742,670,26,27,M.titanium);
 for(let j=0;j<5;j++){let x=1803+j*35;R(x,678,19,20,j%2?M.window:M.glass);R(x+6,667,7,10,M.signal);}
 R(1662,830,339,11,M.steel);R(1682,798,23,29,M.iron);R(1743,807,58,19,M.window);
 L(1837,830,1842,752,8,M.conduit);R(1858,800,81,26,M.glass);
 // Deliberately differentiated underflow workfaces: sediment inspection, pressure bypass, root-core survey, fault return.
 R(529,938,204,11,M.titanium);R(547,912,22,23,M.chrome);R(582,917,56,16,M.glass);R(669,915,26,19,M.window);L(551,909,655,890,5,M.conduit);
 R(829,938,195,11,M.titanium);R(845,910,27,25,M.iron);R(887,919,59,15,M.window);L(856,910,959,880,6,M.conduit);R(979,912,14,19,M.signal);
 R(1071,938,165,11,M.steel);R(1086,909,20,27,M.chrome);R(1129,915,57,18,M.glass);for(let i=0;i<4;i++)R(1189+i*9,910,5,23,M.chrome);
 R(1590,938,173,11,M.titanium);R(1605,914,20,22,M.iron);R(1642,917,51,17,M.window);R(1716,905,25,31,M.glass);
 // Large negative-space overflight and thin, readable service bridges preserve editing opportunities.
 L(337,405,541,372,5,M.conduit);L(1596,390,1802,355,7,M.conduit);
 R(450,785,46,10,M.chrome);R(1257,804,51,12,M.chrome);
 // Actual physical openings into each district and underneath dam; no teleport/proxy route.
 R(308,473,139,86,0);R(323,647,162,77,0);R(340,766,140,105,0);
 R(372,836,131,109,0);R(392,874,1410,55,0);
 R(1375,815,175,135,0);R(1533,776,149,164,0);
 R(1616,624,146,94,0);R(1590,763,173,103,0);
 R(427,561,104,82,0);R(541,585,169,50,0); // deliberate catchment service access
 R(695,641,118,58,0);R(810,690,113,64,0); // passage to progressively higher terraces
 // Named literal authoring sites. The 31×27 footprint is kept in true empty material.
 const sites={
 "West refuge arrivals":[147,475],"Spore pressure ledger":[247,613],"West service bay":[266,736],"West scarp lookout":[320,388],
 "Catchment shoulder":[485,588],"First baffle intake":[631,644],"Second pressure terrace":[782,681],"Lower discharge watch":[999,765],
 "Crest signal perch":[1094,660],"West atmospheric overflight":[746,337],"High catchment air":[1147,312],
 "Fault upper lip":[1340,374],"Fault drawhead":[1459,520],"Mid-fault service air":[1468,656],"Fault basin rescue":[1461,789],
 "Exterior fault bypass":[1286,522],"East high overflight":[1840,340],"East pressure survey":[1853,484],
 "East isolation shelter":[1925,641],"East telemetry berth":[1832,772],
 "West underflow hatch":[430,868],"Sediment inspection":[621,878],"Bypass pump service":[925,879],
 "Root-core survey":[1158,882],"Fault lower return":[1545,885],"East underflow exit":[1737,896]
 };
 // Ensure these are physically open and routeable from the real spawn; carve coherent portals before final exact-site squares.
 R(125,370,277,137,0);R(110,562,310,100,0);
 R(350,543,150,86,0);R(471,562,195,71,0);R(680,630,165,75,0);R(834,731,205,69,0);
 R(1255,463,148,116,0);R(1363,466,195,86,0);
 R(1644,427,203,76,0);R(1723,452,278,104,0);R(1748,568,289,108,0);
 R(1766,727,254,103,0);R(1546,844,288,93,0);
 R(510,862,776,65,0);R(1258,853,351,83,0);
 for(const p of Object.values(sites))R(p[0]-23,p[1]-21,47,43,0);
 function tieStructures(){
   const mark=new Int32Array(N),q=new Int32Array(N),comps=[{edge:true,count:0}],e=new Map();
   for(let k=0;k<N;k++)if(g[k]&&!mark[k]){let id=comps.length,hd=0,tl=1,edge=false;q[0]=k;mark[k]=id;
     while(hd<tl){let a=q[hd++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
       let v=[a-W,a+W,x?a-1:-1,x<W-1?a+1:-1];for(let b of v)if(b>=0&&b<N&&g[b]&&!mark[b]){mark[b]=id;q[tl++]=b;}}
     comps.push({edge,count:tl});}
   let owner=new Int32Array(N),dist=new Uint16Array(N),origin=new Int32Array(N),queue=new Int32Array(N),hd=0,tl=0;
   for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;queue[tl++]=i;}
   while(hd<tl){let a=queue[hd++],x=a%W,d=dist[a],oa=owner[a];
     for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N){
       if(!owner[b]){owner[b]=oa;origin[b]=origin[a];dist[b]=d+1;queue[tl++]=b;}
       else if(owner[b]!==oa){let ob=owner[b],key=Math.min(oa,ob)+":"+Math.max(oa,ob),len=d+dist[b]+1,p=e.get(key);if(!p||len<p.len)e.set(key,{a:origin[a],b:origin[b],oa,ob,len});}
     }
   }
   let parent=new Int32Array(comps.length);for(let i=0;i<comps.length;i++)parent[i]=i;
   function find(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
   for(let i=1;i<comps.length;i++)if(comps[i].edge)parent[i]=0;
   let ties=0,longest=0;
   for(let z of [...e.values()].sort((a,b)=>a.len-b.len)){let a=find(z.oa),b=find(z.ob);if(a===b)continue;parent[a]=b;L(z.a%W,(z.a/W)|0,z.b%W,(z.b/W)|0,4,M.conduit);ties++;longest=Math.max(longest,z.len);}
   for(let i=1;i<comps.length;i++)if(find(i)!==find(0))throw Error("Disconnected component "+i);
   return {ties,longest,raw_components:comps.length-1};
 }
 const ties=tieStructures();
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N),overlap=0;
 for(let y=0;y<H;y++){let next=new Map(),off=y*W;for(let x=0;x<W;){let m=g[off+x],s=x;while(x<W&&g[off+x]===m)x++;if(!m)continue;let k=s+":"+(x-s)+":"+m,idx=prev.get(k);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(k,idx);}prev=next;}
 for(const [x,y,w,h,m] of rect){area+=w*h;hist[m]=(hist[m]||0)+w*h;for(let yy=y;yy<y+h;yy++){for(let xx=x;xx<x+w;xx++)if(replay[yy*W+xx])overlap++;replay.fill(m,yy*W+x,yy*W+x+w);}}
 if(rect.length>32768||area>32000000||overlap)throw Error("Budget/overlap: "+JSON.stringify({rectangles:rect.length,area,overlap}));
 for(let i=0;i<N;i++)if(replay[i]!==g[i])throw Error("Replay mismatch at "+i);
 let seen=new Uint8Array(N),q=new Int32Array(N),rooted=0,unrooted=0,comps=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){comps++;let head=0,tail=1,edge=false;q[0]=k;seen[k]=1;while(head<tail){let a=q[head++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!seen[b]){seen[b]=1;q[tail++]=b;}}if(edge)rooted+=tail;else unrooted+=tail;}
 if(unrooted)throw Error("Unrooted solids "+unrooted);
 const IW=W+1;
 function flood(w,h,blocked){
  let ii=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){let p=o+x-1,solid=g[p]||(blocked&&x-1>=blocked[0]&&x-1<blocked[2]&&y-1>=blocked[1]&&y-1<blocked[3]);row+=solid?1:0;ii[y*IW+x]=ii[(y-1)*IW+x]+row;}}
  function clear(x,y){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*IW+c]-ii[d*IW+a]-ii[b*IW+c]+ii[b*IW+a]===0;}
  let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N),head=0,tail=0;
  for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(clear(x,y))pass[y*W+x]=1;
  let s=sites["West refuge arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+"×"+h);
  queue[tail++]=si;vis[si]=1;
  while(head<tail){let a=queue[head++],x=a%W,b=a-W;if(b>=0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+W;if(b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a-1;if(x>0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+1;if(x<W-1&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p,clear:clear(...p)}));
  return {envelope:[w,h],centres:tail,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};
 }
 const clearances=[[19,15],[23,19],[31,27]].map(p=>flood(...p));
 if(clearances.some(c=>c.bad.length))throw Error("Failed Midge sites "+JSON.stringify({ties,clearances}));
 const obstruction=[1437,642,1499,676],bypass=flood(31,27,obstruction),unaffected=bypass.bad.map(x=>x.name);
 if(unaffected.some(n=>n!=="Mid-fault service air")||bypass.passed!==Object.keys(sites).length-1)throw Error("Obstruction must cover only named site "+JSON.stringify(bypass));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West refuge arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 if(Object.keys(setup).length!==14||Object.keys(setup.actors[0]).length!==5)throw Error("Setup envelope mismatch");
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Oversize Setup JSON "+json.length);
 const crops=[["01-west-refuge-and-intake",35,330,520,510],["02-descending-catchment-wall",424,490,845,385],["03-single-deep-drawoff-fault",1260,315,480,640],["04-east-isolation-settlement",1580,390,468,465],["05-dry-pressure-underflow",370,826,1390,140]];
 return {g,json,rect,hist,area,sites,clearances,bypass,obstruction,rooted,unrooted,comps,ties,crops};
};
const sha256=function sha256(input){
 let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rot(p,7)^rot(p,18)^(p>>>3))+w[j-7]+(rot(q,17)^rot(q,19)^(q>>>10)))>>>0;}
 let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rot(e,6)^rot(e,11)^rot(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rot(a,2)^rot(a,13)^rot(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}let v=[a,b0,c,d,e,f,g,z];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;}
 return h.map(n=>n.toString(16).padStart(8,"0")).join("");
};
const png=function png(g,x0,y0,w,h){
 const W=2048,colors={0:[8,11,18],49:[70,83,99],58:[119,123,128],62:[126,141,153],66:[74,85,93],68:[102,119,129],77:[55,243,228],100:[54,56,61],101:[24,19,32],120:[156,210,220],122:[226,236,244],129:[33,70,110],131:[168,171,177]};
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set(name.split("").map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 const rev=(v,n)=>{let z=0;while(n--){z=(z<<1)|(v&1);v>>>=1;}return z;};
 function zip(raw){let o=[120,1],bits=0,n=0;function wr(v,k){bits|=v<<n;n+=k;while(n>=8){o.push(bits&255);bits>>>=8;n-=8;}}function sym(s){let v,k;if(s<=143){v=48+s;k=8;}else if(s<=255){v=400+s-144;k=9;}else if(s<=279){v=s-256;k=7;}else{v=192+s-280;k=8;}wr(rev(v,k),k);}const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];function run(len){let a=0;while(a<28&&lb[a+1]<=len)a++;sym(a+257);if(le[a])wr(len-lb[a],le[a]);wr(0,5);}wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let l=1;while(i+l<raw.length&&l<258&&raw[i+l]===raw[i])l++;if(l>=4&&i>0&&raw[i-1]===raw[i]){run(l);i+=l;}else{sym(raw[i]);i++;}}sym(256);if(n)o.push(bits&255);let a=1,b=0;for(let x of raw){a=(a+x)%65521;b=(b+a)%65521;}o.push(...be(((b<<16)|a)>>>0));return new Uint8Array(o);}
 let pal=new Uint8Array(132*3);for(let i=0;i<132;i++)pal.set(colors[i]||[100,100,100],i*3);
 let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
 let p=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())],out=new Uint8Array(p.reduce((a,b)=>a+b.length,0)),i=0;for(let q of p){out.set(q,i);i+=q.length;}return out;
};

function makeFiles(){const a=build(),s=JSON.stringify(a.json),im=[["overview.png",png(a.g,0,0,2048,1024)],...a.crops.map(([n,x,y,w,h])=>[n+".png",png(a.g,x,y,w,h)])];return a;}
if(typeof require!=="undefined"&&require.main===module){const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),a=build();let receipt=JSON.parse("{\"world_group\":\"Underroot Relay System\",\"world_group_sibling\":3,\"concept\":\"Seepage Catchment / Basalt Pressure Frontier\",\"role\":\"downstream pressure and mineral-seepage catchment; remote draw-off fault and dry inspection underflow\",\"anchor_donors\":[\"wide-harrow-mere-spore-dam\",\"wide-graftloom-slipway\"],\"anchor_heads\":[\"1202aea8d696e2bfecd7e4f3353c9738a9435858\",\"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657\"],\"predecessor_siblings\":[\"https://github.com/techrote/sandmapsreference/pull/82\",\"https://github.com/techrote/sandmapsreference/pull/88\"],\"original_no_source\":true,\"seed\":2536227,\"engine_main\":\"de58bf1997ca75825cf3b29e046dc1c1022c45bf\",\"map_base\":\"99a166e7fcae45eb22be1740e9f33f62faccbcc7\",\"extent\":[2048,1024],\"material_cell_count\":2097152,\"material_histogram\":{\"49\":14210,\"62\":11460,\"66\":16850,\"68\":40196,\"77\":162,\"100\":239566,\"101\":76134,\"120\":2587,\"129\":7441,\"131\":10417},\"filled_material_cells\":419023,\"grounded_cells\":419023,\"unrooted_cells\":0,\"grounded_components\":1,\"structural_ties\":{\"ties\":66,\"longest\":117,\"raw_components\":67},\"rectangles\":2895,\"rectangle_work\":419023,\"setup_bytes\":54871,\"source_max_rectangles\":32768,\"source_max_setup_bytes\":1048576,\"plane_sha256\":\"4f6ad3eea3caf8286c35cab6ec6262e6a7563c96e36d34d22649494b594c1433\",\"setup_sha256\":\"8203c975ca734b3316b8b9180f3be3b18111548675199309cd335cf390423833\",\"literal_sites\":{\"West refuge arrivals\":[147,475],\"Spore pressure ledger\":[247,613],\"West service bay\":[266,736],\"West scarp lookout\":[320,388],\"Catchment shoulder\":[485,588],\"First baffle intake\":[631,644],\"Second pressure terrace\":[782,681],\"Lower discharge watch\":[999,765],\"Crest signal perch\":[1094,660],\"West atmospheric overflight\":[746,337],\"High catchment air\":[1147,312],\"Fault upper lip\":[1340,374],\"Fault drawhead\":[1459,520],\"Mid-fault service air\":[1468,656],\"Fault basin rescue\":[1461,789],\"Exterior fault bypass\":[1286,522],\"East high overflight\":[1840,340],\"East pressure survey\":[1853,484],\"East isolation shelter\":[1925,641],\"East telemetry berth\":[1832,772],\"West underflow hatch\":[430,868],\"Sediment inspection\":[621,878],\"Bypass pump service\":[925,879],\"Root-core survey\":[1158,882],\"Fault lower return\":[1545,885],\"East underflow exit\":[1737,896]},\"clearances\":[{\"envelope\":[19,15],\"centres\":1500460,\"passed\":26,\"total\":26,\"bad\":[]},{\"envelope\":[23,19],\"centres\":1462349,\"passed\":26,\"total\":26,\"bad\":[]},{\"envelope\":[31,27],\"centres\":1388173,\"passed\":26,\"total\":26,\"bad\":[]}],\"physical_obstruction\":{\"box\":[1437,642,1499,676],\"isolated_site\":\"Mid-fault service air\",\"result\":{\"envelope\":[31,27],\"centres\":1383487,\"passed\":25,\"total\":26,\"bad\":[{\"name\":\"Mid-fault service air\",\"point\":[1468,656],\"clear\":false}]}},\"crops\":[[\"01-west-refuge-and-intake\",35,330,520,510],[\"02-descending-catchment-wall\",424,490,845,385],[\"03-single-deep-drawoff-fault\",1260,315,480,640],[\"04-east-isolation-settlement\",1580,390,468,465],[\"05-dry-pressure-underflow\",370,826,1390,140]],\"static\":\"CREATOR-STATIC-PASS\",\"native\":\"NATIVE-UNTESTED\",\"independent\":\"PENDING\",\"status\":\"DRAFT/HOLD\",\"images\":[{\"name\":\"overview.png\",\"bytes\":39637,\"sha256\":\"d5252216adf60f62e9ee99b84a7073108027fddb658cef483f2b8bbb79aa422b\"},{\"name\":\"01-west-refuge-and-intake.png\",\"bytes\":8388,\"sha256\":\"b3d82ea66d1aafadc2f0b52b32c3d77e1b57e4dcb4a0cdaed1d259be90d58698\"},{\"name\":\"02-descending-catchment-wall.png\",\"bytes\":10832,\"sha256\":\"355a35469f617845b723326afd322bf712ddb561d63b2b09147f0a7c8b39e4bc\"},{\"name\":\"03-single-deep-drawoff-fault.png\",\"bytes\":9526,\"sha256\":\"07d3f2140e0bf929c628b10f02d6fa3418534f5dca12f0854024f2d4c9a172d8\"},{\"name\":\"04-east-isolation-settlement.png\",\"bytes\":7574,\"sha256\":\"e41b2c66298978f023c8de169e356c824c15b282179272f2b32b82d9397a96a1\"},{\"name\":\"05-dry-pressure-underflow.png\",\"bytes\":5007,\"sha256\":\"633f4397e50fe0c1cdfdc73778bb45840c0d8aa438f9d6ff2aae794a1cb1c52b\"}]}");let list=[["setup.json",Buffer.from(a.json)],["receipt.json",Buffer.from(JSON.stringify(receipt,null,2)+"\n")],...([["overview.png",0,0,2048,1024],...a.crops.map(([n,x,y,w,h])=>[n+".png",x,y,w,h])].map(([n,x,y,w,h])=>[n,Buffer.from(png(a.g,x,y,w,h))]))];for(let [n,b] of list){let digest=crypto.createHash("sha256").update(b).digest("hex");if(n==="setup.json"&&digest!==receipt.setup_sha256)throw Error("SHA mismatch setup");if(n.endsWith(".png")&&receipt.images.find(x=>x.name===n).sha256!==digest)throw Error("SHA mismatch PNG "+n);if(process.argv.includes("--verify")){if(!fs.existsSync(__dirname+"/"+n)||!fs.readFileSync(__dirname+"/"+n).equals(b))throw Error("Noncanonical "+n)}else fs.writeFileSync(__dirname+"/"+n,b);}console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",rectangles:a.rect.length,sites:a.clearances.map(q=>q.passed),native:"NATIVE-UNTESTED"},null,2));}
