"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26B20A, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}





 // UNDERROOT RELAY SYSTEM: wholly new 2D industrial logistics world.
 const C=M;
 R(0,985,W,39,C.rock);
 P([[0,1024],[0,346],[84,358],[159,408],[233,486],[313,560],[402,645],[509,759],[605,894],[646,1024]],C.rock);
 P([[2048,1024],[2048,331],[1969,351],[1891,414],[1820,495],[1748,592],[1636,715],[1521,852],[1473,1024]],C.rock);
 for(let x=0;x<W;x+=4){let y=985+Math.round(4*Math.sin(x*.026)+3*Math.cos(x*.075));R(x,y,4,H-y,C.schist);}
 for(let x=0;x<590;x+=37)R(x,822+Math.floor(x*.12),8,70,C.schist);
 for(let x=1520;x<W;x+=43)R(x,841-Math.floor((x-1520)*.13),7,83,C.schist);
 // Unequal terraced physical side-entry district chambers and true dry underworks.
 R(63,412,280,135,0);R(147,565,384,142,0);R(245,731,309,118,0);
 R(1690,410,347,143,0);R(1600,579,438,141,0);R(1544,745,478,116,0);
 R(286,449,384,112,0);R(388,611,291,125,0);R(444,762,210,87,0);
 R(1425,445,330,122,0);R(1380,611,341,129,0);R(1447,767,262,89,0);
 R(316,885,1431,78,0);R(407,685,105,276,0);R(1584,687,116,276,0);
 R(335,927,1380,28,0);
 for(let [x,y,w] of [[77,535,270],[171,692,361],[261,835,302],[1704,539,323],[1614,705,422],[1550,848,486]])R(x,y,w,16,C.titanium);
 // Bedrock-supported diagonal industrial spines and broad empty transfer canyon.
 L(570,836,824,530,27,C.iron);L(1560,860,1246,428,29,C.iron);
 L(570,836,774,525,10,C.conduit);L(1558,852,1310,458,11,C.conduit);
 L(841,489,830,869,23,C.titanium);L(1226,403,1258,867,28,C.titanium);
 for(let [x,y,X,Y] of [[830,520,954,488],[1124,479,1231,430],[840,668,941,622],[1138,652,1234,619],[849,786,943,745],[1148,770,1252,738]])L(x,y,X,Y,16,C.titanium);
 for(let [x,y0,y1] of [[935,445,826],[1127,441,824]]){R(x,y0,8,y1-y0,C.chrome);for(let y=y0+24;y<y1-12;y+=44)R(x-7,y,22,7,C.steel);}
 for(let [x,y,w] of [[750,392,158],[1115,370,152],[745,581,183],[1115,565,165],[768,744,154],[1114,730,173]]){L(x,y,x+w,y+18,10,C.titanium);R(x+8,y+18,w-12,5,C.chrome);}
 // Custody inlet: opposing mechanical jaw and keyed biological specimen columns.
 R(102,524,203,10,C.steel);R(113,480,22,40,C.chrome);R(154,497,41,24,C.window);
 for(let i=0;i<5;i++){let x=212+i*19;R(x,488,12,33,i%2?C.glassDark:C.quartz);R(x+3,482,6,7,C.signal);}
 L(116,479,179,448,8,C.titanium);L(179,448,230,477,6,C.steel);
 R(327,521,180,12,C.titanium);R(350,487,25,31,C.chrome);R(389,490,67,28,C.glassDark);
 // Three-drum assay: different process shape from upper indexing apparatus.
 R(178,675,302,10,C.titanium);R(202,639,27,33,C.chrome);
 for(let i=0;i<3;i++){let x=256+i*55;R(x,650,36,22,C.window);R(x+5,641,25,8,i===1?C.signal:C.quartz);}
 L(222,640,324,607,8,C.steel);L(324,607,452,654,7,C.titanium);
 R(443,648,26,23,C.glassDark);
 R(257,825,258,10,C.titanium);R(273,793,18,29,C.chrome);
 R(323,788,76,34,C.window);R(417,794,69,27,C.glassDark);
 // Inhabited middle inspection gangway carrying its own field sample sensors.
 L(648,619,821,596,11,C.titanium);L(649,620,561,822,12,C.titanium);
 R(659,584,24,25,C.chrome);R(701,591,53,18,C.window);R(778,587,26,20,C.signal);
 L(690,578,795,549,6,C.conduit);
 R(757,727,123,12,C.titanium);L(792,727,833,644,9,C.chrome);
 R(773,704,29,20,C.steel);R(819,703,31,21,C.window);
 // Triple cassette-transfer racks with deliberate clear vertical Midge throat.
 for(let y of [494,633,758]){R(951,y,43,14,C.titanium);R(990,y+9,29,7,C.signal);R(1059,y-6,52,13,C.chrome);R(1092,y-21,12,15,C.quartz);}
 L(981,508,984,607,5,C.chrome);L(1090,618,1087,745,5,C.chrome);
 // Extrusion, packager, sterile freight: three different apparatus grammars.
 L(1243,690,1406,684,15,C.titanium);L(1406,684,1560,836,11,C.steel);
 R(1265,672,34,15,C.chrome);R(1313,664,50,21,C.glassDark);R(1373,665,22,18,C.quartz);
 L(1318,655,1351,628,7,C.steel);
 R(1735,526,246,10,C.titanium);R(1749,475,24,47,C.chrome);
 for(let i=0;i<4;i++){let x=1788+i*42;R(x,493,29,29,i%2?C.window:C.glassDark);R(x+7,486,15,8,C.quartz);}
 R(1960,485,17,38,C.steel);L(1755,469,1810,446,8,C.chrome);
 R(1644,691,352,12,C.titanium);R(1656,645,37,43,C.chrome);
 R(1718,658,74,29,C.glassDark);for(let i=0;i<6;i++)R(1821+i*24,649,13,37,i%2?C.window:C.quartz);
 R(1940,636,31,49,C.steel);L(1686,644,1782,609,10,C.titanium);
 R(1584,833,390,12,C.titanium);R(1602,796,33,32,C.steel);
 R(1667,807,83,21,C.window);R(1803,803,94,26,C.glassDark);
 L(1889,798,1940,759,8,C.steel);
 // Four distinct physically planted below-grade processing workfaces.
 R(535,951,173,13,C.titanium);R(549,930,16,22,C.chrome);
 R(575,939,47,11,C.window);L(551,931,606,910,7,C.steel);R(650,934,31,18,C.quartz);
 R(789,950,198,13,C.titanium);R(801,933,24,18,C.steel);
 R(835,940,29,12,C.signal);for(let i=0;i<4;i++)R(881+i*23,929,12,22,i%2?C.window:C.glassDark);
 R(1060,951,203,13,C.titanium);R(1072,932,27,19,C.chrome);
 R(1120,932,58,18,C.glassDark);R(1199,931,12,20,C.quartz);L(1086,930,1206,915,6,C.steel);
 R(1370,950,172,14,C.titanium);R(1383,934,22,17,C.chrome);
 R(1429,934,37,14,C.window);for(let x=1484;x<1530;x+=11)R(x,922,5,27,C.steel);
 const sites={
 "West relay arrivals":[137,456],"Receiving custody":[286,461],
 "West cliff sky exit":[262,308],"West assay floor":[336,610],
 "West bio-alloy service":[359,757],"West rescue outlet":[505,911],
 "Mid assay controller":[720,535],"West spine inspection":[871,355],
 "Vertical cask throat":[1032,538],"Upper transfer overflight":[1008,240],
 "Extrusion overlook":[1380,541],"East basin recovery":[1443,783],
 "East rescue throat":[1643,870],"East cleanroom":[1733,465],
 "East freight dispatch":[1895,627],"East ridge escape":[1862,304],
 "Deep ore sorter":[734,906],"Deep cask winder":[1011,902],
 "Deep decon filters":[1329,903]
 };

 // Physical routing, completely opened at final grid; no point-proxy waiver.
 R(408,806,99,158,0);R(1585,802,112,159,0);
 R(1719,581,307,68,0);R(1268,580,191,67,0);
 R(470,866,1109,63,0);
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
  let s=sites["West relay arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1008,509,1056,569]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Vertical cask throat")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West relay arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const expectedKeys=["actors","brush","edits","extent","fire","liquid_policy","material","next_id","normalize","response","rule_radius","selected","source","version"];
 if(JSON.stringify(Object.keys(setup).sort())!==JSON.stringify(expectedKeys))throw Error("Invalid Setup-v2 root schema");
 if(setup.actors.length!==1||JSON.stringify(Object.keys(setup.actors[0]).sort())!==JSON.stringify(["hash","id","model","options","spawn"]))throw Error("Invalid actor schema");
 if(setup.actors[0].spawn.length!==2||setup.actors[0].spawn.some((v,i)=>v!==sites["West relay arrivals"][i]))throw Error("Wrong literal Midge spawn");
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
 const crops=[["01-west-custody-intake",50,330,560,480],["02-three-drum-assay",185,530,655,355],["03-vertical-underroot-spine",755,328,595,560],["04-east-cold-freight",1500,349,548,515],["05-deep-assay-carriage",370,866,1300,125]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {world_group:"Underroot Relay System",concept:"Underroot Assay Freight Annex",original_no_source:true,seed:a.seed,anchor:"wide-graftloom-slipway",anchor_head:"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657",engine_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[2048,1024],material_cell_count:a.g.length,material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,unrooted_cells:a.unrooted,structural_ties:a.tie_info,rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,source_max_rectangles:32768,source_max_bytes:1048576,legacy_bridge_fallback:4096,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,clearances:a.clearances,physical_obstruction:{box:[1008,509,1056,569],isolated_site:"Vertical cask throat",result:a.bypass},images:a.images.map(([n,b])=>({name:n,bytes:b.length,sha256:sha256(b)})),crops:a.crops,static:"CREATOR-STATIC-PASS",native:"NATIVE-UNTESTED",independent:"PENDING",status:"DRAFT/HOLD"};}
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
