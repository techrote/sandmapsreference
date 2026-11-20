'use strict';
function buildWorld(){
 const W=2048,H=1024,N=W*H,G=new Uint8Array(N),M={B:100,C:58,S:62,I:117,Z:113,Q:122,O:101,R:49};
 const sites=[['West ingress',130,497],['Intake switch',328,494],['High west glide',482,322],['West recovery',466,718],['A-frame gantry high',817,298],['A-frame service lower',699,706],['Crosshead upper',1074,309],['Crosshead middle',1098,504],['Counterweight bypass',1114,711],['East mast upper',1509,293],['East mast low',1507,708],['Discharge approach',1837,487],['Turnaround',1900,705],['Return',334,704],['Finish',149,497],['Intake telemetry',228,113],['Western switch control',669,109],['Transfer signal room',1335,113],['East dispatch control',1847,111],['Intake shop',266,932],['A-frame service',690,932],['Coupler vault',1020,928],['Eastern motor bay',1418,930],['Recovery workshop',1850,932]];
 const crops=[['overview.png',0,0,W,H],['01-west-switch.png',0,180,480,725],['02-a-frame-gantry.png',460,175,465,810],['03-transfer-crosshead.png',905,165,447,817],['04-counterweight-mast.png',1290,180,430,803],['05-east-dispatch.png',1680,175,368,810],['06-underworks.png',90,800,1868,221]];
 const palette={0:[8,12,20],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198]};
 const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const model='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
 function box(x,y,w,h,m,ink=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!ink||G[i])G[i]=m}}
 function beam(x1,y1,x2,y2,r,m){let dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(y1,y2)-r));y<Math.min(H,Math.ceil(Math.max(y1,y2)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x1,x2)-r));x<Math.min(W,Math.ceil(Math.max(x1,x2)+r));x++){let t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/L)),u=x-x1-t*dx,v=y-y1-t*dy;if(u*u+v*v<=r*r)G[y*W+x]=m}}
 function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++){let d=Math.sqrt(Math.max(0,1-((y-cy)/ry)**2))*rx;box(cx-d,y,2*d,1,m)}for(let y=Math.max(0,cy-ry+t);y<Math.min(H,cy+ry-t);y++){let d=Math.sqrt(Math.max(0,1-((y-cy)/(ry-t))**2))*(rx-t);box(cx-d,y,2*d,1,0)}}
 let roof=new Int16Array(W),floor=new Int16Array(W),bell=(x,c,r)=>Math.exp(-Math.pow((x-c)/r,2));
 for(let x=0;x<W;x++){roof[x]=Math.round(174+8*Math.sin(x*.01)+5*Math.sin(x*.024)+28*bell(x,780,230)+23*bell(x,1460,180));floor[x]=Math.round(842+8*Math.sin(x*.009)-36*bell(x,700,180)-26*bell(x,1470,180));for(let y=0;y<roof[x];y++)G[y*W+x]=y<24?M.R:y>roof[x]-13?M.S:(y%149<8?M.O:M.B);for(let y=floor[x];y<H;y++)G[y*W+x]=y<floor[x]+16?M.C:M.B}
 // Major form: two asymmetrical supported mast frameworks and horizontal switching crosshead.
 beam(89,floor[89],174,598,22,M.C);beam(174,598,252,545,11,M.S);beam(372,roof[372],313,352,20,M.S);beam(313,352,267,400,10,M.Z);
 box(291,717,33,127,M.I);box(289,697,39,25,M.Z);beam(390,floor[390],444,682,15,M.C);
 beam(555,floor[555],691,366,20,M.C);beam(848,floor[848],708,367,20,M.S);beam(643,387,756,387,21,M.I);box(674,369,58,35,M.C);beam(697,369,697,roof[697],12,M.S);
 for(let i=0;i<4;i++)box(655+i*22,430+i%2*15,12,25,M.Z);
 beam(927,roof[927],965,352,23,M.S);beam(1227,roof[1227],1175,352,23,M.C);beam(963,356,1177,356,19,M.I);
 for(let i=0;i<6;i++){let x=992+i*30;box(x,374+i%2*10,12,64,M.C);box(x+2,391+i%2*10,8,24,M.Z,true)}
 beam(1024,floor[1024],1016,626,18,M.C);beam(1193,floor[1193],1169,631,19,M.S);beam(1014,633,1171,633,12,M.I);
 for(let x of [943,1210]){box(x,717,45,121,M.C);box(x+5,709,34,19,M.Z)}
 beam(1368,floor[1368],1442,369,21,M.C);beam(1601,floor[1601],1532,377,22,M.S);beam(1439,378,1537,378,18,M.I);box(1457,357,58,25,M.Z);beam(1488,367,1510,roof[1510],12,M.S);
 for(let i=0;i<5;i++)box(1443+i*23,425+i%2*18,11,31,M.C);
 beam(1745,roof[1745],1794,367,18,M.S);beam(1794,367,1854,391,10,M.Z);beam(1977,roof[1977],1921,395,17,M.C);beam(1921,395,1871,415,10,M.I);
 beam(1740,floor[1740],1779,686,17,M.C);beam(1779,686,1835,675,9,M.S);beam(2013,floor[2013],1954,693,18,M.S);
 // Open and equip 4 physically entered roof control galleries.
 for(let [x,y,w,h,c]of [[103,53,250,157,228],[548,54,252,158,669],[1210,51,263,161,1335],[1721,52,240,159,1847]]){box(x,y,w,h,0);box(c-50,132,100,340,0);box(x,y+15,30,h-18,M.I);for(let i=0;i<4;i++)box(x+24,y+25+i*26,26,12,i%2?M.Z:M.C);beam(x+w,y+23,x+w-38,y+70,9,M.S)}
 // Five big excavated service stations, each with distinct purpose.
 for(let [x,y,w,h,c]of [[133,858,257,128,266],[516,863,302,123,690],[899,862,255,124,1020],[1290,859,271,127,1418],[1704,857,263,130,1850]]){box(x,y,w,h,0);box(c-50,725,100,230,0);box(x,936,41,50,M.I);for(let i=0;i<4;i++)box(x+8+i*24,947-i%2*9,13,25,i%2?M.Z:M.C);box(x+w-42,942,42,44,M.S)}
 // Functional room apparatus: compressors, switchboards, clutches, motor drums, geared cable haul.
 // Five different shops: actuator cam, phase stator, dog clutch, tension ram, recovery winch.
ring(208,940,28,29,15,M.C);beam(199,971,185,981,11,M.I);box(347,905,20,67,M.Z);
for(let i=0;i<5;i++)box(537+i*14,901+i%2*11,9,71,i%2?M.Z:M.I);beam(787,968,756,910,13,M.S);
ring(939,943,25,27,12,M.S);box(913,959,45,26,M.C);for(let i=0;i<4;i++)box(1113+i*11,931-i%2*13,8,39,M.Z);
beam(1328,976,1382,907,15,M.C);box(1538,922,17,53,M.S);for(let i=0;i<4;i++)box(1506+i*13,936,10,25,M.Z);
box(1715,944,40,39,M.I);beam(1766,959,1797,912,11,M.S);ring(1800,927,18,18,8,M.C);beam(1924,976,1960,909,12,M.S);
 for(let j=0;j<8;j++){let x=61+j*250;box(x,roof[x]-10,23,8,j%2?M.Q:M.Z,true);box(x,floor[x]+4,30,8,j%2?M.Z:M.Q,true)}
 // Put conservative, non-scenic flightways through the whole construction.
 box(75,475,1915,60,0);box(75,682,1915,74,0);box(84,279,1880,55,0);
 for(let x of [205,430,877,1277,1668,1900])box(x-39,315,78,419,0);
 for(let [name,x,y]of sites){box(x-22,y-20,45,41,0);if(y<190)box(x-31,y+10,62,483-y,0);else if(y<390)box(x-31,y+10,62,493-y,0);else if(y>845)box(x-31,706,62,y-690,0);else if(y>650)box(x-31,500,62,y-486,0)}
 // Furnish uncut room walls after through routing; never obstruct named centre/hulls.
 for(let [x,y]of [[130,84],[569,81],[1228,82],[1738,85]]){box(x,y,22,79,M.I);for(let j=0;j<3;j++)box(x+18,y+11+j*23,24,8,M.Z)}

// Functional mid-air and lower-flight machine silhouettes backed by the world's grounded foundations.
// Counterweight exchange: slotted trolley, hoist-lug matrix, lower rail gearbox, signal teeth.
beam(547,roof[547],606,407,14,M.S);beam(610,405,755,410,19,M.I);
for(let i=0;i<5;i++){box(631+i*22,419+i%2*8,12,31,M.C);box(637+i*22,438+i%2*8,7,11,M.Z)}
beam(977,roof[977],987,407,16,M.S);beam(986,404,1177,407,21,M.I);
for(let i=0;i<5;i++){box(1012+i*32,422+i%2*7,21,31,M.C);box(1017+i*32,436+i%2*7,10,10,M.Z)}
beam(1372,roof[1372],1421,407,14,M.S);beam(1423,410,1555,419,19,M.I);
for(let i=0;i<4;i++){box(1443+i*27,429+i%2*8,14,30,M.C);box(1447+i*27,438+i%2*8,7,11,M.Z)}
beam(1812,roof[1812],1823,406,13,M.S);beam(1823,413,1930,422,16,M.I);
for(let i=0;i<3;i++)box(1840+i*28,428+i%2*9,18,31,M.Z);
// Partial founded service systems, with asymmetric flight gates above and around machinery.
beam(630,floor[630],650,594,15,M.C);beam(650,592,805,581,13,M.I);
for(let i=0;i<5;i++)box(675+i*23,588+i%2*7,11,31,M.Z);
beam(1004,floor[1004],1023,602,16,M.C);beam(1020,600,1154,600,16,M.I);
for(let i=0;i<4;i++)box(1042+i*30,601+i%2*9,19,30,M.C);
beam(1400,floor[1400],1428,594,16,M.C);beam(1425,594,1559,603,15,M.I);
for(let i=0;i<4;i++)box(1452+i*25,610+i%2*8,14,27,M.Z);

 // Ensure spatially unsupported accents do not silently become floating material.
 const seen=new Uint8Array(N),q=new Int32Array(N);let h=0,t=0;function push(i){if(G[i]&&!seen[i]){seen[i]=1;q[t++]=i}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
 while(h<t){let i=q[h++],x=i%W;if(x>0)push(i-1);if(x<W-1)push(i+1);if(i>=W)push(i-W);if(i+W<N)push(i+W)}
 let discarded=0,grounded=0;for(let i=0;i<N;i++){if(G[i]&&!seen[i]){G[i]=0;discarded++}if(G[i])grounded++}
 function reach(grid,w,hh){let S=new Uint32Array((W+1)*(H+1)),ww=W+1,free=new Uint8Array(N),mark=new Uint8Array(N),Q=new Int32Array(N),hd=0,tl=0;for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=grid[(y-1)*W+x-1]?1:0;S[y*ww+x]=S[(y-1)*ww+x]+run}}let rx=w>>1,ry=hh>>1;for(let y=ry;y<H-(hh-ry-1);y++)for(let x=rx;x<W-(w-rx-1);x++){let x0=x-rx,y0=y-ry,x1=x0+w,y1=y0+hh;if(S[y1*ww+x1]-S[y1*ww+x0]-S[y0*ww+x1]+S[y0*ww+x0]===0)free[y*W+x]=1}let id=sites[0][2]*W+sites[0][1];if(free[id]){Q[tl++]=id;mark[id]=1}while(hd<tl){let i=Q[hd++],x=i%W;if(x>0&&free[i-1]&&!mark[i-1]){mark[i-1]=1;Q[tl++]=i-1}if(x+1<W&&free[i+1]&&!mark[i+1]){mark[i+1]=1;Q[tl++]=i+1}if(i>=W&&free[i-W]&&!mark[i-W]){mark[i-W]=1;Q[tl++]=i-W}if(i+W<N&&free[i+W]&&!mark[i+W]){mark[i+W]=1;Q[tl++]=i+W}}return {connected:tl,missing:sites.filter(s=>!mark[s[2]*W+s[1]]).map(s=>s[0]),free_sites:sites.filter(s=>free[s[2]*W+s[1]]).length}}
 let clear={};for(let [w,h]of [[19,15],[23,19],[31,27]])clear[w+'x'+h]=reach(G,w,h);
 const obs=[1050,476,96,56],B=G.slice();for(let y=obs[1];y<obs[1]+obs[3];y++)for(let x=obs[0];x<obs[0]+obs[2];x++)B[y*W+x]=M.C;let blocked=reach(B,31,27);
 let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),x=0;while(x<W){let m=G[y*W+x];if(!m){x++;continue}let x0=x;while(x<W&&G[y*W+x]===m)x++;let key=x0+','+(x-x0)+','+m,a=active.get(key);if(a&&a[1]+a[3]===y){a[3]++;next.set(key,a)}else{a=[x0,y,x-x0,1,m];edits.push(a);next.set(key,a)}visits+=x-x0}active=next}edits.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:model,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 let histogram={};for(let m of G)histogram[m]=(histogram[m]||0)+1;
 return {W,H,N,G,sites,crops,palette,setup,grounded,discarded,edits,visits,clear,obs,blocked,histogram};
}
if(typeof module!=='undefined'&&module.exports)module.exports={buildWorld};
