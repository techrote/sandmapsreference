"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26C120, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}


 // ORISON THROAT: wholly new flared seismic listening horn, unequal signal spires, side-cut inhabited chambers and real subterranean return.
 // Distinct original material geometry, independently planned BEFORE applied rectangle edits.
 // Inert continuous bedrock beneath all inhabited industry, with horizontal geological strata.
 const grade=x=>Math.round(838+11*Math.sin(x*.006)+4*Math.cos(x*.031));
 for(let x=0;x<W;x++){let y=grade(x);R(x,y,1,H-y,M.rock);}
 for(let y=0;y<H;y++){let off=y*W;for(let x=0;x<W;x++)if(g[off+x]===M.rock){let s=(y+Math.floor(x*.12)+Math.round(3*Math.sin(x*.021)))%109;if(s<6)g[off+x]=M.schist;else if(s>=6&&s<10)g[off+x]=M.iron;}}
 const OPS=[["p",[[0,1024],[0,366],[46,371],[83,400],[142,438],[191,504],[229,614],[257,777],[315,1024]],100],["p",[[2048,1024],[2048,356],[2007,379],[1960,424],[1920,487],[1872,600],[1818,736],[1781,1024]],100],["r",210,868,1630,96,0],["r",337,704,103,259,0],["r",1603,690,134,276,0],["r",1014,744,94,216,0],["r",485,932,207,76,0],["r",761,932,207,76,0],["r",1161,932,192,76,0],["r",1393,932,194,76,0],["r",60,415,328,121,0],["r",92,545,354,140,0],["r",156,699,312,116,0],["r",1663,408,374,131,0],["r",1587,558,452,135,0],["r",1607,709,421,109,0],["r",82,524,280,12,62],["r",109,532,251,6,63],["r",106,646,315,13,68],["r",119,660,293,6,131],["r",163,793,293,12,62],["l",128,657,185,801,11,62],["l",396,656,421,794,10,68],["r",101,501,118,12,130],["r",112,479,20,22,129],["r",187,478,20,23,129],["r",239,512,75,10,131],["r",245,489,24,23,120],["r",286,490,17,22,79],["r",117,625,90,12,62],["r",128,596,23,29,68],["r",169,601,27,24,49],["r",243,637,123,11,130],["r",258,612,30,24,120],["r",310,607,34,30,129],["r",315,597,22,11,77],["r",174,780,170,11,62],["r",196,750,17,30,68],["r",322,746,12,34,68],["r",227,740,87,29,49],["r",242,729,60,11,131],["r",355,745,22,39,129],["l",497,850,503,335,22,68],["l",743,853,741,337,23,68],["l",495,336,749,336,17,131],["r",502,448,247,15,62],["r",514,463,221,5,63],["r",500,601,250,15,68],["r",513,616,226,5,131],["r",493,779,261,15,62],["l",509,607,550,777,9,68],["l",745,604,709,777,11,68],["l",553,332,540,142,12,68],["l",691,331,719,195,11,62],["l",539,143,623,111,9,131],["l",716,195,765,155,8,131],["e",626,111,17,12,130],["r",610,98,32,10,77],["e",764,157,13,12,121],["r",525,437,102,11,130],["r",538,408,20,28,129],["r",576,412,40,24,120],["r",650,435,76,11,62],["r",663,393,17,41,68],["r",682,405,30,28,79],["r",533,585,138,13,49],["r",546,558,26,27,68],["r",588,557,26,28,68],["r",625,560,33,25,121],["r",679,586,49,13,130],["r",693,567,23,19,129],["r",537,762,163,12,62],["r",564,732,40,29,130],["r",613,738,29,24,120],["r",656,736,23,27,79],["l",799,373,1426,220,19,68],["l",797,466,1426,602,22,62],["l",1415,220,1421,601,21,131],["l",1416,214,1463,208,13,68],["l",1417,610,1461,619,14,62],["l",789,377,791,469,25,130],["l",807,373,892,333,11,63],["l",809,464,894,505,11,131],["l",921,337.22966507177034,944,301.22966507177034,8,131],["l",921,500.81081081081084,945,531.8108108108108,8,62],["l",1091,295.7464114832536,1114,259.7464114832536,8,131],["l",1091,537.5675675675676,1115,568.5675675675676,8,62],["l",1261,254.26315789473682,1284,218.26315789473682,8,131],["l",1261,574.3243243243244,1285,605.3243243243244,8,62],["l",896,842,885,492,23,68],["l",1000,844,885,494,13,62],["l",1170,845,1256,564,19,68],["l",1281,846,1255,564,16,62],["l",1479,841,1419,602,20,62],["l",1526,846,1420,605,12,68],["r",946,512,196,12,62],["l",953,521,932,494,8,131],["l",1127,516,1111,535,8,68],["r",957,495,57,13,130],["r",970,477,29,18,120],["r",1059,499,58,12,68],["r",1076,480,15,19,77],["r",1247,580,105,12,62],["r",1257,560,21,20,68],["r",1289,562,43,19,49],["r",1305,552,18,9,79],["r",1394,610,111,10,131],["r",1408,590,23,21,121],["l",1150,285,1149,342,8,62],["r",1136,337,27,11,77],["l",1325,247,1304,305,8,131],["r",1291,302,31,8,120],["l",1522,849,1537,267,22,68],["l",1706,850,1600,270,17,62],["l",1535,270,1600,270,16,130],["l",1547,271,1487,131,9,131],["l",1584,266,1645,143,9,131],["r",1481,125,29,12,77],["r",1631,137,28,13,121],["r",1525,469,175,15,62],["r",1541,483,146,5,63],["r",1540,618,190,14,68],["r",1555,632,163,6,131],["l",1545,479,1593,616,12,62],["l",1681,478,1647,615,10,68],["r",1550,452,85,12,130],["r",1562,420,21,32,129],["r",1597,425,25,27,120],["r",1591,606,102,12,62],["r",1605,578,11,28,68],["r",1631,575,40,30,49],["r",1646,562,13,13,77],["r",1672,538,323,14,68],["r",1683,552,304,5,131],["r",1628,692,384,14,62],["r",1637,706,369,7,63],["r",1618,816,389,14,62],["l",1703,705,1724,817,12,68],["l",1970,705,1939,815,10,68],["r",1684,516,137,10,130],["r",1699,488,15,27,68],["r",1791,489,18,27,68],["r",1727,496,13,20,121],["r",1730,484,7,11,77],["r",1752,496,13,20,121],["r",1755,484,7,11,77],["r",1776,496,13,20,121],["r",1779,484,7,11,77],["r",1863,524,81,11,131],["r",1872,504,25,19,129],["r",1910,508,24,16,120],["r",1645,678,158,10,130],["r",1660,647,16,31,68],["r",1780,645,12,33,68],["r",1684,658,86,20,49],["l",1691,659,1691,605,6,131],["l",1760,660,1760,606,6,131],["r",1671,600,101,12,62],["r",1872,680,133,13,68],["l",1882,679,1896,622,7,131],["l",1896,622,1907,677,6,62],["l",1915,679,1929,622,7,131],["l",1929,622,1940,677,6,62],["l",1949,679,1963,622,7,131],["l",1963,622,1974,677,6,62],["r",1909,614,42,10,79],["r",1641,802,145,14,62],["r",1653,779,18,22,129],["r",1687,781,72,20,130],["r",498,955,164,10,62],["r",517,937,30,18,129],["r",560,937,66,17,130],["l",615,950,634,930,7,131],["r",773,953,168,12,68],["r",795,933,37,20,49],["r",838,931,22,22,129],["l",857,930,893,913,7,77],["r",1030,953,99,12,62],["r",1050,931,24,22,120],["r",1086,934,21,18,79],["r",1165,954,170,11,131],["e",1224,937,31,22,68],["e",1224,937,22,14,0],["r",1275,932,17,22,129],["r",1288,927,24,7,77],["r",1420,953,150,11,68],["r",1432,930,22,22,49],["r",1439,921,8,9,79],["r",1468,930,22,22,49],["r",1475,921,8,9,79],["r",1504,930,22,22,49],["r",1511,921,8,9,79],["r",1544,931,15,20,129],["r",956,280,112,12,62],["l",969,281,957,331,8,68],["l",1056,282,1049,314,8,131],["r",974,259,21,21,120],["r",1015,255,33,25,129],["r",325,816,119,148,0],["r",1609,817,134,150,0],["r",210,855,1604,107,0],["r",484,934,199,62,0],["r",754,934,196,62,0],["r",1157,934,188,62,0],["r",1390,934,199,62,0],["r",510,954,164,10,62],["r",529,939,29,15,130],["r",595,938,19,16,129],["r",777,954,164,10,62],["r",796,939,29,15,130],["r",862,938,19,16,129],["r",1025,954,164,10,62],["r",1044,939,29,15,130],["r",1110,938,19,16,129],["r",1168,954,164,10,62],["r",1187,939,29,15,130],["r",1253,938,19,16,129],["r",1423,954,164,10,62],["r",1442,939,29,15,130],["r",1508,938,19,16,129]];
 for(const o of OPS){const [kind,...a]=o;if(kind==="r")R(...a);else if(kind==="l")L(...a);else if(kind==="p")P(...a);else if(kind==="e")ellipse(...a);else throw Error("Unknown physical primitive "+kind);}
 // Architectural side doors and recovery apertures: these are actual zero-material XY cells, not nearest-site waivers.
 const DOORS=[[313,696,190,86],[732,371,49,70],[732,503,50,83],[730,671,53,87],[774,390,73,58],[1643,524,122,76],[1568,622,130,70],[1715,619,115,64],[1561,725,150,80],[1680,736,100,64],[462,366,130,83],[463,512,130,91],[463,671,144,116],[766,362,109,119],[1662,614,101,196],[1749,662,93,64]];
 for(const [x,y,w,h] of DOORS)R(x,y,w,h,0);
 const sites={"West landing":[392,645],"West rover exchange":[178,475],"Crew engineering":[260,605],"Western forge":[285,742],"Spire upper archive":[600,401],"Spire thermal lab":[600,551],"Spire descent":[634,716],"Signal fork overflight":[639,217],"Horn entry":[811,410],"Acoustic inner chamber":[1048,401],"Bell calibration":[1296,388],"Bell rim approach":[1479,403],"Upper sky recovery":[1156,155],"Horn underpass":[1060,666],"Central service return":[1028,780],"East prism navigation":[1636,397],"Eastern prism base":[1632,572],"Quarantine processing":[1740,468],"East freight":[1840,646],"East living vault":[1889,765],"Eastern ridge escape":[1920,381],"West bore descent":[385,900],"Lower fossil sampler":[554,905],"Deep field seismograph":[810,904],"Sump manifold":[1081,898],"Helical heat coupler":[1240,901],"Eastern bioassay":[1490,900],"East bore return":[1675,897]};
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
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);
 const post_clear_tie=tieStructures();
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);

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
  let s=sites["West landing"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1003,362,1090,442]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Acoustic inner chamber")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West landing"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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
 const crops=[["01-west-habitation",0,345,520,570],["02-commissioning-spire",445,95,405,725],["03-horn-heart",760,195,750,630],["04-east-prism",1500,210,548,630],["05-deep-survey",330,820,1430,204]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Orison Throat - Seismic Resonance Horn",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1003,362,1090,442],material_id:58,purpose:"Blocks exact Acoustic inner chamber; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; independently invented level design",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
