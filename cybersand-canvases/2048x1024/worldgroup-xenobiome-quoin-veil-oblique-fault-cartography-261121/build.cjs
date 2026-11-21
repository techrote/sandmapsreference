"use strict";
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={rock:100,schist:101,iron:49,wall:58,steel:62,conduit:66,titanium:68,signal:77,window:120,quartz:122,glass:129,chrome:131};
 const R=(x,y,w,h,m)=>{let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let i=c;i<d;i++)g.fill(m,i*W+a,i*W+b);};
 function P(poly,m){let ya=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1])))),yb=Math.min(H-1,Math.ceil(Math.max(...poly.map(p=>p[1]))));for(let y=ya;y<=yb;y++){let xs=[];for(let i=0;i<poly.length;i++){let a=poly[i],b=poly[(i+1)%poly.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++)for(let x=Math.max(0,Math.floor(cx-rx));x<Math.min(W,Math.ceil(cx+rx));x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=m;}



 // QUOIN VEIL SIBLING 02 — Oblique Fault Cartography / Embedded Resonance Galleries.
 // Canonical authoring seed: quoin-veil-fault-cartography-261121-v1.
 // Four embedded scientific districts and two highly asymmetric long routes.
 // Major departure from Sibling 01: interior-dominant oblique, multi-strata geology;
 // NO opposing inhabited cliff faces, suspended islands, V basin, or tension harp.
 P([[0,401],[110,391],[208,448],[298,381],[381,340],[467,370],
 [583,303],[676,270],[768,313],[883,265],[987,315],[1096,277],
 [1200,226],[1296,251],[1370,311],[1478,263],[1562,231],
 [1677,254],[1790,301],[1905,341],[2048,410],[2048,1024],[0,1024]],M.rock);
 R(0,972,2048,52,M.schist);
 // Distinct stepped geological beds that retain a unified load-bearing mass.
 for(let k=0;k<9;k++){
   const y=544+k*46;
   for(let x=0;x<2048;x+=64){
     const xx=x+((x+17*k)%17),yy=y+((x*3+k*11)%13),len=13+((x+k*7)%32);
     if(yy>=H)continue;
     for(let j=xx;j<Math.min(W,xx+len);j++)if(g[yy*W+j]===M.rock)g[yy*W+j]=M.schist;
   }
 }
 // Narrow discontinuous tectonic scar, partitioned rather than gaping into a crater.
 for(let [x,y,X,Y,t] of [[315,915,495,692,23],[535,701,720,473,20],
 [773,566,938,372,22],[1010,472,1190,326,17],[1345,419,1513,289,17],
 [1567,575,1770,392,14]]){
   L(x,y,X,Y,t,M.schist);
 }
 // Broad, irregular *embedded* research chambers. They are cavities inside solid
 // geology; no copied opposing-scarp/raft arrangement from the first sibling.
 ellipse(212,728,191,123,0);
 ellipse(535,629,184,104,0);
 ellipse(796,540,157,119,0);
 ellipse(1116,452,211,117,0);
 ellipse(1450,363,156,102,0);
 ellipse(1813,416,181,132,0);
 // Different chamber silhouettes; one has a formal rectangular cut,
 // another a partly unfinished tooth-shaped station, two are round/ovoid.
 R(398,574,251,124,0);R(981,397,299,98,0);
 R(1388,322,193,91,0);R(1767,347,201,116,0);
 // Side experiments and intentional unfinished enlargement seams.
 ellipse(635,445,114,78,0);
 ellipse(1082,685,133,68,0);
 R(346,495,138,71,0);
 R(1197,596,156,65,0); // Unfurnished acoustic isolation pocket.
 // One small exposed observation slot, not a wide sky basin.
 R(1639,173,81,168,0);
 L(1545,344,1660,234,82,0);
 // Elongated dry, serrated emergency adit, remote from the ascent route.
 for(let [x,y,X,Y] of [[328,806,400,863],[400,863,609,840],
 [609,840,814,844],[814,844,1030,774],[1030,774,1210,768],
 [1210,768,1444,743],[1444,743,1674,771],[1674,771,1814,589]])
 L(x,y,X,Y,89,0);
 // Entered connecting shafts and eccentric side loops before equipment.
 for(let [x,y,X,Y] of [[280,746,330,806],[600,841,620,646],
 [1008,778,1126,530],[1432,744,1450,440],
 [1814,589,1810,415],[610,610,635,445],
 [1120,478,1082,685],[385,666,408,530],
 [1310,413,1260,628]]) L(x,y,X,Y,80,0);
 // Interior platforms are keyed to the chamber floor / walls and have
 // differentiated process shapes; all parts use stable immovable IDs.
 // West ingress: seismic-rover cradle, long rail and a sheltered habitation stack.
 R(72,812,270,14,M.titanium);
 R(94,789,89,19,M.iron); R(111,769,24,16,M.glass);
 R(214,792,105,18,M.steel);R(266,779,13,12,M.signal);
 L(151,790,174,748,7,M.conduit);L(301,795,329,755,8,M.chrome);
 R(51,657,12,137,M.iron);R(61,657,49,14,M.titanium);
 R(66,686,38,21,M.window);R(76,728,25,19,M.glass);
 // Gallery A — a long bedded calibration track with nested probes.
 R(428,705,271,10,M.steel);
 for(let [x,h] of [[463,24],[512,41],[571,30],[634,47]]){
   R(x,705-h,18,h,M.iron);R(x+4,705-h+8,10,8,M.window);
 }
 R(458,665,61,9,M.signal);L(676,679,693,622,8,M.conduit);
 // Tall tonal geode and off-axis assay annex (separate entered branch).
 R(567,491,11,21,M.chrome); R(565,480,16,11,M.glass);
 R(611,486,42,12,M.titanium);R(620,473,18,9,M.signal);
 L(671,485,695,421,8,M.conduit);
 // Gallery B — bore indexing, unequal window bays and calibration fork.
 R(727,647,257,11,M.titanium);
 R(747,616,39,24,M.iron);R(758,602,14,13,M.signal);
 R(831,612,59,29,M.chrome);R(845,621,29,17,M.glass);
 R(918,610,29,33,M.steel);L(927,611,946,562,9,M.conduit);
 L(691,574,723,640,7,M.iron);
 // Gallery C — double-phase resonance comparator, asymmetric banks, and
 // a large central vacancy useful for scripting failure/activation events.
 R(979,562,305,10,M.titanium);
 R(982,531,62,22,M.iron);R(999,515,23,13,M.window);
 R(1226,522,46,31,M.steel);R(1240,502,17,18,M.signal);
 L(1040,559,1052,498,8,M.conduit);
 L(1212,557,1223,481,7,M.chrome);
 // An intentionally skeletal append module is not to be cosmetically filled.
 R(1213,657,133,9,M.chrome);R(1241,641,16,16,M.iron);
 R(1276,645,25,8,M.glass);
 // Gallery D — high cartography instrument: stepped disk and registration racks.
 R(1374,466,217,11,M.titanium);
 R(1412,445,55,17,M.iron);R(1430,435,17,10,M.signal);
 L(1523,455,1546,393,8,M.conduit);
 R(1483,441,55,18,M.glass);
 for(let j=0;j<5;j++)R(1531+j*9,412-(j%2)*7,5,17,M.chrome);
 // East quarantine and rover transfer differ visibly from the west intake.
 R(1705,540,290,13,M.iron);
 R(1720,497,58,31,M.steel);R(1732,504,35,15,M.window);
 R(1861,501,83,27,M.titanium);R(1888,486,18,14,M.signal);
 L(1814,518,1796,472,10,M.conduit);L(1960,523,1992,480,8,M.chrome);
 // Lower maintenance adit: three intentionally different workcells, not a
 // copied full-width service-floor chain.
 R(578,899,204,9,M.titanium);R(603,883,35,13,M.chrome);
 L(726,890,751,865,7,M.conduit);
 R(1016,821,168,10,M.steel);R(1047,805,31,13,M.window);
 R(1127,797,10,20,M.signal);
 R(1427,818,202,10,M.iron);R(1473,790,47,22,M.glass);
 L(1577,803,1600,776,7,M.conduit);
 // Complete upper oblique flight spine is distinct from the remote dry bypass.
 for(let [x,y,X,Y] of [[171,724,326,695],[326,695,486,645],
 [486,645,685,584],[685,584,857,531],[857,531,1039,474],
 [1039,474,1233,435],[1233,435,1440,367],
 [1440,367,1657,321],[1657,321,1810,405],
 [1810,405,1967,444]]) L(x,y,X,Y,87,0);
 // Re-clear branch routes after material details, preserving a guaranteed
 // 31x27 hull through every named site without nearest-centre substitution.
 for(let [x,y,X,Y] of [[326,695,408,532],[610,598,641,451],
 [1067,464,1085,672],[1233,435,1261,627],
 [1470,365,1660,225],[1580,347,1700,298],
 [328,806,400,863],[400,863,609,840],[609,840,814,844],
 [814,844,1030,774],[1030,774,1210,768],
 [1210,768,1444,743],[1444,743,1674,771],
 [1674,771,1814,589],[280,746,328,806],
 [600,841,620,646],[1008,778,1126,530],
 [1432,744,1450,440],[1814,589,1810,415]]) L(x,y,X,Y,76,0);
 // Sites are strictly literal centre coordinates on the final material plane.
 const sites={
 "West seismic rover arrival":[171,724],
 "West protected custody":[232,728],
 "Western undercut junction":[326,695],
 "Low acoustic refuge":[408,532],
 "Embedded calibration A":[520,632],
 "Casing handoff":[685,584],
 "Spare side geode":[641,451],
 "Embedded calibration B":[857,531],
 "Sonic gate entrance":[956,498],
 "Upper sonic interlock":[1039,474],
 "Seismic comparator":[1142,457],
 "Append-pocket entry":[1085,672],
 "Phase comparator east":[1233,435],
 "Unfurnished attachment seam":[1261,627],
 "Embedded survey D":[1440,367],
 "Observation slit entrance":[1580,347],
 "Exposed observation cut":[1660,225],
 "East sheltered assay":[1810,405],
 "Eastern rover dispatch":[1967,444],
 "West rescue drop":[400,863],
 "Underfault relay A":[609,840],
 "Deep alternate signal":[814,844],
 "Deep tilted core":[1030,774],
 "Underfault refuge":[1210,768],
 "Lower eastern calibration":[1444,743],
 "Emergency east ascent":[1674,771]
 };
 for(let p of Object.values(sites))R(p[0]-26,p[1]-25,53,51,0);

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
  let s=sites["West seismic rover arrival"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+"×"+h);
  queue[tail++]=si;vis[si]=1;
  while(head<tail){let a=queue[head++],x=a%W,b=a-W;if(b>=0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+W;if(b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a-1;if(x>0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+1;if(x<W-1&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p,clear:clear(...p)}));
  return {envelope:[w,h],centres:tail,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};
 }
 const clearances=[[19,15],[23,19],[31,27]].map(p=>flood(...p));
 if(clearances.some(c=>c.bad.length))throw Error("Failed Midge sites "+JSON.stringify({ties,clearances}));
 const obstruction=[1006,443,1073,509],bypass=flood(31,27,obstruction),unaffected=bypass.bad.map(x=>x.name);
 if(unaffected.some(n=>n!=="Upper sonic interlock")||bypass.passed!==Object.keys(sites).length-1)throw Error("Obstruction must cover only named site "+JSON.stringify(bypass));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West seismic rover arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 if(Object.keys(setup).length!==14||Object.keys(setup.actors[0]).length!==5)throw Error("Setup envelope mismatch");
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Oversize Setup JSON "+json.length);
 const crops=[["01-west-seismic-rover-ingress",21,583,414,348],["02-embedded-calibration-galleries",407,391,559,385],["03-resonance-comparator-fault",964,339,393,376],["04-high-observation-quarantine",1370,154,646,423],["05-stepped-emergency-adit",355,722,1369,273]];
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


// Deterministic write or byte-exact readback; no host-engine/native claims.
if (typeof require !== "undefined" && require.main === module) {
 const fs=require("fs"), crypto=require("crypto"), zlib=require("zlib");
 const a=build(), hash=b=>crypto.createHash("sha256").update(b).digest("hex");
 const images=[["overview.png",0,0,2048,1024],...a.crops.map(q=>[q[0]+".png",q[1],q[2],q[3],q[4]])];
 const records=[],files=[["setup.json",Buffer.from(a.json)]];
 function validateImage(bytes,x0,y0,w,h){
   const blocks=[],sig=Buffer.from([137,80,78,71,13,10,26,10]);
   if(!bytes.subarray(0,8).equals(sig))throw Error("bad PNG magic");
   let p=8,iw=0,ih=0;
   while(p<bytes.length){
     let size=bytes.readUInt32BE(p),name=bytes.toString("ascii",p+4,p+8),body=bytes.subarray(p+8,p+8+size);
     if(name==="IHDR"){iw=body.readUInt32BE(0);ih=body.readUInt32BE(4);if(body[8]!==8||body[9]!==3)throw Error("not indexed PNG");}
     if(name==="IDAT")blocks.push(body);
     p+=size+12;
     if(name==="IEND")break;
   }
   if(iw!==w||ih!==h)throw Error("PNG dimensions mismatch");
   const raw=zlib.inflateSync(Buffer.concat(blocks));
   if(raw.length!==(w+1)*h)throw Error("bad PNG decompressed length");
   for(let y=0;y<h;y++){
     if(raw[y*(w+1)]!==0)throw Error("unexpected indexed filter");
     const src=Buffer.from(a.g.subarray((y+y0)*2048+x0,(y+y0)*2048+x0+w));
     if(!raw.subarray(y*(w+1)+1,(y+1)*(w+1)).equals(src))throw Error("PNG/source-cell pixel mismatch");
   }
 }
 for(let [name,x,y,w,h] of images){
   let bytes=Buffer.from(png(a.g,x,y,w,h));validateImage(bytes,x,y,w,h);
   records.push({name,extent:[w,h],origin:[x,y],bytes:bytes.length,sha256:hash(bytes),indexed_material_pixel_parity:"PASS"});
   files.push([name,bytes]);
 }
 const receipt={
   project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Quoin Veil Survey Network",sibling:2,
   role:"Oblique Fault Cartography / Embedded Resonance Galleries",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
   engine_readonly_main:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",
   donor_design_language:["wide-sable-quoin-gravitic-core","wide-threnody-scar-foldwing-seedlift"],
   no_geometry_donated:true,seed:"quoin-veil-fault-cartography-261121-v1",
   extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,
   occupied_cells:a.area,grounded_cells:a.rooted,unrooted_cells:a.unrooted,
   connected_solid_components:a.comps,tie_structures:a.ties,
   lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,
   rectangle_work_cells:a.area,setup_bytes:Buffer.byteLength(a.json),
   plane_sha256:hash(Buffer.from(a.g)),setup_sha256:hash(Buffer.from(a.json)),
   literal_sites:a.sites,midge_full_hull_clearances:a.clearances,
   obstruction:{box:a.obstruction,expected_blocked_site:"Upper sonic interlock",result:a.bypass},
   indexed_images:records,source_static:"CREATOR-STATIC-PASS",
   independent_art_technical_shepherd:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"DRAFT/HOLD"
 };
 files.push(["receipt.json",Buffer.from(JSON.stringify(receipt,null,2)+"\n")]);
 for(let [name,bytes] of files){
   const path=__dirname+"/"+name;
   if(process.argv.includes("--verify")){
     if(!fs.existsSync(path)||!fs.readFileSync(path).equals(bytes))throw Error("not byte-identical "+name);
   }else fs.writeFileSync(path,bytes);
 }
 console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",rectangles:a.rect.length,
    sites:a.clearances.map(x=>x.passed),obstruction_remains:a.bypass.passed,images:records.length,
    action:process.argv.includes("--verify")?"verified":"written",native:"NATIVE-UNTESTED"}));
}
