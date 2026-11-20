"use strict";
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={rock:100,schist:101,iron:49,wall:58,steel:62,conduit:66,titanium:68,signal:77,window:120,quartz:122,glass:129,chrome:131};
 const R=(x,y,w,h,m)=>{let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let i=c;i<d;i++)g.fill(m,i*W+a,i*W+b);};
 function P(poly,m){let ya=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1])))),yb=Math.min(H-1,Math.ceil(Math.max(...poly.map(p=>p[1]))));for(let y=ya;y<=yb;y++){let xs=[];for(let i=0;i<poly.length;i++){let a=poly[i],b=poly[(i+1)%poly.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++)for(let x=Math.max(0,Math.floor(cx-rx));x<Math.min(W,Math.ceil(cx+rx));x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=m;}

 // UNDERROOT SIBLING 04: Root-Archive / Sealed Quarantine Vault.
 // Entirely authored interior-dominant 2D cavity grammar, not exterior catchment replication.
 R(0,239,W,785,M.rock);
 P([[0,239],[0,213],[92,211],[173,176],[250,201],[326,159],[415,204],[494,179],[580,202],[644,187],[731,213],[816,180],[913,196],[1006,172],[1106,203],[1192,178],[1293,215],[1389,191],[1481,174],[1584,211],[1666,189],[1774,181],[1880,210],[1974,170],[2048,205],[2048,239]],M.rock);
 R(0,970,W,54,M.schist);
 for(let y=266;y<981;y+=29)for(let x=11;x<2040;x+=57){
  let yy=y+((x*13+y*7)%11),xx=x+((x*5+y*3)%9),w=20+(x+y)%28;
  if(g[yy*W+xx]===M.rock)for(let a=xx;a<Math.min(W,xx+w);a++)if(g[yy*W+a]===M.rock)g[yy*W+a]=M.schist;
 }
 // Five spatially unrelated chambers inside one supported mountainside.
 ellipse(304,526,195,186,0);ellipse(664,519,170,157,0);
 ellipse(1025,524,236,211,0);ellipse(1405,510,181,163,0);ellipse(1753,534,181,187,0);
 ellipse(364,683,115,81,0);ellipse(728,669,108,68,0);
 ellipse(1124,709,117,60,0);ellipse(1503,690,96,68,0);
 P([[195,705],[259,684],[331,706],[365,790],[283,807],[219,770]],0);
 P([[1540,463],[1612,430],[1665,491],[1610,552],[1540,542]],0);
 // Three distinct routing strata and six irregular vertical interlinks.
 R(175,290,1704,62,0);R(160,482,1717,84,0);R(185,804,1680,71,0);
 for(let x of [275,603,888,1251,1500,1771])R(x,294,67,576,0);
 // Twin nested containment rims around the examination void with four face-on gates.
 ellipse(1026,525,199,176,M.titanium);ellipse(1026,525,184,161,0);
 ellipse(1026,525,172,150,M.iron);ellipse(1026,525,155,134,0);
 R(817,466,422,110,0);R(961,331,128,398,0);
 // Grounded arch-like nerves, staggered, never one central spinning mechanism.
 for(let [x,y,X,Y,t,m] of [
 [119,447,211,367,17,M.iron],[123,620,202,691,18,M.titanium],
 [429,401,492,448,11,M.chrome],[482,631,542,673,13,M.iron],
 [574,376,687,413,9,M.titanium],[757,639,828,694,11,M.conduit],
 [1180,373,1257,431,15,M.iron],[1255,677,1315,703,13,M.chrome],
 [1575,397,1647,452,17,M.iron],[1601,649,1661,716,13,M.titanium],
 [1905,446,1833,364,15,M.chrome],[1870,678,1800,718,14,M.iron]
 ])L(x,y,X,Y,t,m);
 // West custody and inhabited refuge: sorting, asepsis, indexed registry.
 R(176,651,260,11,M.titanium);R(195,609,21,37,M.chrome);
 R(235,619,63,25,M.glass);R(242,604,47,10,M.signal);
 R(334,613,25,34,M.iron);R(376,629,33,17,M.window);
 L(210,600,250,573,9,M.conduit);R(194,398,27,41,M.steel);
 R(237,409,72,13,M.glass);R(335,399,32,24,M.window);
 // Root-lattice archive: staggered, individually shaped specimen receptacles.
 R(523,628,260,11,M.titanium);
 for(let [x,y,w] of [[562,597,24],[632,607,43],[731,583,28]]){
  R(x,y,w,26,M.glass);R(x+4,y-11,Math.max(8,w-8),10,M.signal);
  L(x+5,y+25,x-8,y+44,7,M.conduit);
 }
 R(605,442,66,14,M.window);R(697,458,29,12,M.glass);
 L(543,428,593,392,9,M.steel);L(742,426,796,376,8,M.chrome);
 // Examination void: differential shell and deliberate unfurnished bay for later script.
 R(864,639,287,10,M.chrome);R(916,612,46,21,M.glass);
 R(1102,604,22,30,M.window);R(1105,594,8,8,M.signal);
 R(908,418,49,11,M.titanium);R(1107,418,51,12,M.titanium);
 L(917,437,962,412,7,M.conduit);L(1141,440,1176,391,7,M.conduit);
 // Four asymmetric isolation stages and filters in eastern sterile chamber.
 R(1321,621,242,10,M.titanium);
 L(1328,600,1373,564,9,M.iron);L(1515,602,1559,571,9,M.chrome);
 for(let i=0;i<4;i++){let x=1350+i*49;R(x,587,18,25,i%2?M.window:M.glass);R(x+5,576,8,9,M.signal);}
 R(1439,387,43,13,M.chrome);L(1462,404,1492,462,7,M.conduit);
 // Eastern quarantine: staggered specimen vaults and incomplete expansion bay.
 R(1637,662,241,11,M.titanium);
 for(let i=0;i<3;i++){let x=1659+i*70,y=606-(i%2)*23;R(x,y,54,44,M.iron);R(x+8,y+8,37,30,M.glass);R(x+18,y+1,13,6,M.signal);}
 R(1644,408,24,42,M.steel);R(1695,414,52,11,M.window);
 R(1773,396,21,32,M.chrome);L(1818,609,1879,696,14,M.conduit);
 // Four contrasting underfloor apparatuses, each linked to its parent district.
 R(298,889,217,9,M.titanium);L(317,860,347,887,9,M.conduit);
 R(375,862,40,20,M.glass);L(426,865,472,887,8,M.chrome);
 R(622,889,204,9,M.steel);L(647,852,674,885,12,M.iron);
 L(750,850,735,884,12,M.iron);R(690,863,53,18,M.window);R(706,855,10,9,M.signal);
 R(940,891,205,8,M.titanium);R(966,859,30,27,M.chrome);
 R(1032,865,62,20,M.glass);L(1113,877,1144,847,8,M.conduit);
 R(1338,887,193,9,M.titanium);R(1361,854,25,27,M.iron);
 R(1404,860,69,20,M.window);R(1436,844,10,17,M.signal);
 R(1660,889,178,8,M.chrome);R(1676,854,21,30,M.iron);
 R(1726,867,47,15,M.glass);R(1799,853,24,30,M.window);
 // Exterior slitted vents: grounded access into enclosed rock, no edge settlements.
 for(let [x,y] of [[301,210],[887,188],[1502,193],[1783,205]]){
  R(x-11,y-19,23,20,M.titanium);R(x-4,y-24,9,7,M.signal);L(x,y,x+11,249,9,M.conduit);
 }
 // Restore Midge-threshold circulation AFTER decoration. Four meaningful route decisions.
 R(174,294,1699,48,0);R(177,488,1698,71,0);R(197,815,1651,50,0);
 for(let x of [275,603,888,1251,1500,1771])R(x,306,65,553,0);
 R(348,550,231,60,0);R(715,554,153,70,0);R(1168,553,190,71,0);R(1512,557,172,61,0);
 for(let x of [444,773,1170,1567])R(x,696,66,166,0);
 const sites={
 "Western intake checkpoint":[211,521],"Western specimen handoff":[362,583],
 "Inoculation refuge":[297,425],"West roof vent":[311,322],
 "Archive registration":[576,513],"Root lattice gallery":[724,516],
 "Root archive lower neck":[662,669],"Archive upper optics":[699,323],
 "Core transfer aperture":[1024,520],"Archive viewing gallery":[1096,389],
 "Examination descent":[1030,673],"Core roof bypass":[1107,327],
 "Eastern sterile vestibule":[1356,517],"Decontamination survey":[1434,543],
 "Eastern filter station":[1485,640],"North quarantine vent":[1507,321],
 "Sealed specimen cells":[1734,537],"Quarantine shelter":[1832,626],
 "East archive landing":[1769,429],"East roof vent":[1809,320],
 "West deep return":[350,836],"Registry press":[744,836],
 "Deep transfer sluice":[1041,840],"Root filtration underworks":[1423,840],
 "Eastern deep refuge":[1726,839]
 };
 for(const p of Object.values(sites))R(p[0]-24,p[1]-23,49,47,0);

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
  let s=sites["Western intake checkpoint"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+"×"+h);
  queue[tail++]=si;vis[si]=1;
  while(head<tail){let a=queue[head++],x=a%W,b=a-W;if(b>=0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+W;if(b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a-1;if(x>0&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}b=a+1;if(x<W-1&&pass[b]&&!vis[b]){vis[b]=1;queue[tail++]=b;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p,clear:clear(...p)}));
  return {envelope:[w,h],centres:tail,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};
 }
 const clearances=[[19,15],[23,19],[31,27]].map(p=>flood(...p));
 if(clearances.some(c=>c.bad.length))throw Error("Failed Midge sites "+JSON.stringify({ties,clearances}));
 const obstruction=[1001,497,1047,545],bypass=flood(31,27,obstruction),unaffected=bypass.bad.map(x=>x.name);
 if(unaffected.some(n=>n!=="Core transfer aperture")||bypass.passed!==Object.keys(sites).length-1)throw Error("Obstruction must cover only named site "+JSON.stringify(bypass));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Western intake checkpoint"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 if(Object.keys(setup).length!==14||Object.keys(setup.actors[0]).length!==5)throw Error("Setup envelope mismatch");
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Oversize Setup JSON "+json.length);
 const crops=[["01-west-custody-refuge",97,309,430,445],["02-root-lattice-archive",473,338,345,410],["03-double-shell-examination",805,305,457,483],["04-eastern-quarantine",1288,331,647,434],["05-deep-service-ring",232,782,1610,167]];
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
   project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Underroot Relay System",sibling:4,
   role:"Root-Archive / Sealed Quarantine Vault",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
   engine_readonly_main:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",
   donor_design_language:["wide-graftloom-slipway","wide-sable-quoin-gravitic-core","wide-threnody-scar-foldwing-seedlift"],
   no_geometry_donated:true,seed:"deterministic-coordinate-formulas-v1",
   extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,
   occupied_cells:a.area,grounded_cells:a.rooted,unrooted_cells:a.unrooted,
   connected_solid_components:a.comps,tie_structures:a.ties,
   lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,
   rectangle_work_cells:a.area,setup_bytes:Buffer.byteLength(a.json),
   plane_sha256:hash(Buffer.from(a.g)),setup_sha256:hash(Buffer.from(a.json)),
   literal_sites:a.sites,midge_full_hull_clearances:a.clearances,
   obstruction:{box:a.obstruction,expected_blocked_site:"Core transfer aperture",result:a.bypass},
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
