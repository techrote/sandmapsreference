/* WORKS-0023 · Cliff-Cut Rocket Assembly Hall
   Deterministic CyberSand 2048x2048 material-cell authoring and qualification.
   Requires Node.js only for writing files; all graphics and proof logic are pure JS.
   Inputs committed alongside: base-setup.json, generated-start-template.json, material-palette.json.
   Run node build.js from this directory.
*/
function buildCyberSand(base, template, palette) {
 const W=2048,H=2048,SEED=23071,cells=new Uint8Array(W*H);
 let state=SEED; const rand=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 const M={air:0,granite:40,slate:49,iron:50,steel:62,paint:63,corr:64,rust:65,
  wall:58,basalt:100,obsi:101,brass:119,cyan:77,amber:79,hazard:76,
  dark:72,white:70,glass:71,phos:127,brick:57,copper:53,grate:66};
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  const a=Math.max(x,0),b=Math.max(y,0),c=Math.min(W,x+w),d=Math.min(H,y+h);
  for(let yy=b;yy<d;yy++)if(a<c)cells.fill(m,yy*W+a,yy*W+c);
 }
 function poly(points,m){let ymin=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),
   ymax=Math.min(H-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
  for(let y=ymin;y<=ymax;y++){const xs=[];
   for(let j=0;j<points.length;j++){const [ax,ay]=points[j],[bx,by]=points[(j+1)%points.length];
    if((ay<=y&&by>y)||(by<=y&&ay>y))xs.push(ax+(y-ay)*(bx-ax)/(by-ay));}
   xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)rect(Math.ceil(xs[j]),y,Math.floor(xs[j+1])-Math.ceil(xs[j])+1,1,m);
  }
 }
 function ellipse(x,y,rx,ry,m){for(let yy=Math.max(0,Math.ceil(y-ry));yy<=Math.min(H-1,Math.floor(y+ry));yy++){
  const off=rx*Math.sqrt(Math.max(0,1-Math.pow((yy-y)/ry,2))),a=Math.ceil(x-off),b=Math.floor(x+off);
  rect(a,yy,b-a+1,1,m);
 }}
 function line(x,y,x2,y2,t,m){let n=Math.ceil(Math.hypot(x2-x,y2-y)/Math.max(1,t/2));
  for(let j=0;j<=n;j++){let f=j/n;rect(x+(x2-x)*f-t/2,y+(y2-y)*f-t/2,t,t,m);}
 }
 function railing(a,b,y){rect(a,y,b-a,5,M.amber);rect(a,y-24,b-a,4,M.amber);for(let x=a;x<=b;x+=29)rect(x,y-24,4,24,M.amber);}
 function label(s,x,y,z,m){const f={
 A:["01110","10001","10001","11111","10001","10001","10001"],
 B:["11110","10001","10001","11110","10001","10001","11110"],
 C:["01111","10000","10000","10000","10000","10000","01111"],
 D:["11110","10001","10001","10001","10001","10001","11110"],
 E:["11111","10000","10000","11110","10000","10000","11111"],
 F:["11111","10000","10000","11110","10000","10000","10000"],
 G:["01111","10000","10000","10111","10001","10001","01110"],
 H:["10001","10001","10001","11111","10001","10001","10001"],
 I:["11111","00100","00100","00100","00100","00100","11111"],
 J:["00111","00010","00010","00010","10010","10010","01100"],
 K:["10001","10010","10100","11000","10100","10010","10001"],
 L:["10000","10000","10000","10000","10000","10000","11111"],
 M:["10001","11011","10101","10101","10001","10001","10001"],
 N:["10001","11001","10101","10011","10001","10001","10001"],
 O:["01110","10001","10001","10001","10001","10001","01110"],
 P:["11110","10001","10001","11110","10000","10000","10000"],
 R:["11110","10001","10001","11110","10100","10010","10001"],
 S:["01111","10000","10000","01110","00001","00001","11110"],
 T:["11111","00100","00100","00100","00100","00100","00100"],
 U:["10001","10001","10001","10001","10001","10001","01110"],
 V:["10001","10001","10001","10001","10001","01010","00100"],
 W:["10001","10001","10001","10101","10101","11011","10001"],
 X:["10001","10001","01010","00100","01010","10001","10001"],
 Y:["10001","10001","01010","00100","00100","00100","00100"],
 Z:["11111","00001","00010","00100","01000","10000","11111"],
 0:["01110","10001","10011","10101","11001","10001","01110"],
 1:["00100","01100","00100","00100","00100","00100","01110"],
 2:["01110","10001","00001","00010","00100","01000","11111"],
 3:["11110","00001","00001","01110","00001","00001","11110"],
 4:["00010","00110","01010","10010","11111","00010","00010"],
 5:["11111","10000","10000","11110","00001","00001","11110"],
 "-":["00000","00000","00000","11111","00000","00000","00000"],
 " ":["00000","00000","00000","00000","00000","00000","00000"]};
  for(const ch of s.toUpperCase()){const v=f[ch]||f[" "];for(let yy=0;yy<7;yy++)
   for(let xx=0;xx<5;xx++)if(v[yy][xx]==="1")rect(x+xx*z,y+yy*z,z-1,z-1,m);x+=6*z;}
 }
 // Cutaway cavern geology / industrial retaining envelope.
 for(let y=0;y<H;y+=6){const d=(rand()-.5)*36,left=105+38*Math.sin(y/150)+17*Math.sin(y/44)+d,right=1943-37*Math.sin(y/173)-18*Math.sin(y/53)-d;
  rect(0,y,left,6,y%60<12?M.granite:M.basalt);rect(right,y,2048-right,6,y%54<12?M.granite:M.basalt);}
 for(let x=0;x<W;x+=6){rect(x,0,6,112+24*Math.sin(x/123)+12*Math.sin(x/35)+(rand()-.5)*16,M.basalt);}
 rect(0,0,W,31,M.iron);rect(0,32,W,12,M.steel);
 rect(165,123,1716,26,M.iron);rect(190,150,1650,12,M.steel);
 for(let x=260;x<1790;x+=132){line(x,150,x+88,214,9,M.paint);line(x+88,150,x,214,6,M.iron);}
 // Two five-storey engineering wings: solid shells, explicit open rooms and portals.
 rect(115,205,525,1542,M.wall);rect(1404,205,530,1542,M.wall);
 rect(148,221,467,1504,M.slate);rect(1428,221,470,1504,M.slate);
 const floors=[300,580,860,1140,1420];
 for(let k=0;k<floors.length;k++){const y=floors[k];
  rect(184,y,418,209,0);rect(1451,y,410,209,0);
  rect(180,y-16,425,20,M.corr);rect(1447,y-16,414,20,M.corr);
  rect(173,y+209,440,26,M.steel);rect(1439,y+209,438,26,M.steel);
  rect(173,y+235,440,8,M.iron);rect(1439,y+235,438,8,M.iron);
  rect(177,y+210,432,5,M.hazard);rect(1443,y+210,432,5,M.hazard);
  rect(183,y+22,12,171,M.paint);rect(1843,y+20,10,173,M.paint);
  for(let x=220;x<505;x+=68){rect(x,y+42,45,30,M.dark);rect(x+3,y+45,39,2,k%2?M.cyan:M.phos);}
  for(let x=1510;x<1810;x+=68){rect(x,y+42,46,28,M.dark);rect(x+4,y+47,38,4,k%2?M.cyan:M.amber);}
  for(let j=0;j<6;j++){rect(230+j*47,y+176,28,22,j%2?M.corr:M.steel);rect(233+j*47,y+180,22,4,M.iron);
   rect(1522+j*48,y+176,27,23,j%2?M.corr:M.rust);}
  for(let j=0;j<3;j++){const x=205+j*104;rect(x,y+89,78,7,M.corr);rect(x,y+98,8,60,M.iron);}
  for(let j=0;j<3;j++){const x=1530+j*97;rect(x,y+90,77,7,M.corr);rect(x,y+100,8,45,M.iron);}
  label("B"+(k+1),228,y+115,5,M.phos);label("E"+(k+1),1730,y+115,5,M.amber);
  for(const x of [191,1851]){rect(x,y+183,42,10,M.amber);rect(x+8,y+187,26,3,M.white);}
 }
 // Uninterrupted elevator shafts carve holes in the five floor slabs.
 rect(545,261,122,1461,0);rect(1375,261,118,1461,0);
 rect(545,263,10,1370,M.steel);rect(657,263,9,1370,M.steel);
 rect(1375,263,9,1370,M.steel);rect(1483,263,9,1370,M.steel);
 for(let y=280;y<1600;y+=32){rect(545,y,8,8,M.amber);rect(1484,y,7,8,M.cyan);rect(619,y,6,8,M.iron);rect(1411,y,6,8,M.iron);}
 // Physical Midge portals across lift rails: broad, deliberate clearings on each storey.
 for(const y of floors){rect(638,y+72,47,93,M.air);rect(1360,y+72,51,93,M.air);
  rect(537,y+72,29,93,M.air);rect(1474,y+72,30,93,M.air);}
 // Exposed balconies: small railings, open maneuvering space around central vehicle.
 for(const y of floors.map(n=>n+212)){
  rect(670,y-5,172,17,M.iron);rect(1205,y-5,170,17,M.iron);
  rect(677,y-5,165,5,M.steel);rect(1205,y-5,166,5,M.steel);
  railing(688,833,y-10);railing(1210,1364,y-10);
 }
 // Excavated lower maintenance tunnel, with two genuinely open access throats.
 rect(92,1731,1859,317,M.basalt);
 for(let y=1751;y<2048;y+=32)for(let x=120;x<1910;x+=61)if(rand()<.7)rect(x+(rand()*8|0),y,38,3,rand()<.27?M.granite:M.basalt);
 rect(132,1795,1780,146,M.air);rect(155,1939,1720,22,M.steel);
 for(let x=210;x<1820;x+=176){rect(x,1795,16,143,M.steel);rect(x-8,1805,32,11,M.corr);rect(x-5,1922,27,16,M.iron);}
 rect(545,1691,126,170,0);rect(1372,1691,126,170,0);
 rect(545,1743,12,143,M.steel);rect(1483,1743,11,143,M.steel);
 for(let x=250;x<1740;x+=160){rect(x,1889,97,25,M.corr);rect(x+10,1890,79,4,M.hazard);}
 // Overhead full-width assembly gantry and travelling crane.
 rect(474,225,1125,22,M.steel);rect(484,240,1110,12,M.brass);
 for(let x=500;x<1590;x+=33)rect(x,232,15,6,M.iron);
 rect(655,252,740,58,M.corr);rect(663,257,722,8,M.amber);
 for(let x=665;x<1380;x+=39){rect(x,281,22,12,M.iron);rect(x+7,294,7,9,M.steel);}
 rect(910,252,224,76,M.steel);rect(919,260,206,13,M.hazard);
 rect(990,318,66,25,M.brass);rect(1019,342,9,65,M.steel);rect(1012,398,24,16,M.amber);
 for(let x of [690,1345]){rect(x,247,28,90,M.iron);rect(x-5,327,39,12,M.hazard);}
 // Single towering central ship/rocket: pointed nose, bright stage bands, dual side boosters.
 poly([[1023,386],[1090,505],[1105,610],[939,610],[953,505]],M.iron);
 poly([[1023,402],[1075,515],[1090,600],[955,600],[970,515]],M.steel);
 poly([[1023,435],[1038,495],[1007,495]],M.white);
 rect(919,607,208,782,M.iron);rect(940,613,166,754,M.steel);
 rect(956,618,30,736,M.corr);rect(1082,618,22,736,M.corr);
 rect(994,619,81,735,M.white);rect(1010,621,45,732,M.steel);
 for(let y of [624,742,861,980,1095,1205,1319]){
  rect(919,y,208,23,M.iron);rect(940,y+3,166,14,M.corr);
  for(let x=949;x<1090;x+=32)rect(x,y+7,11,4,M.brass);
 }
 for(const x of [836,1133]){
  rect(x,890,73,397,M.iron);rect(x+13,900,47,372,M.paint);
  poly([[x+36,788],[x+66,901],[x+8,901]],M.steel);
  rect(x+16,990,42,14,M.corr);rect(x+16,1170,42,12,M.brass);
  ellipse(x+36,1045,24,32,M.iron);ellipse(x+36,1045,17,25,M.air);
  rect(x+30,1018,12,55,M.glass);
  for(let y=910;y<1280;y+=63)rect(x+15,y,43,8,M.steel);
  rect(x+17,1288,39,46,M.rust);
 }
 rect(887,1375,273,49,M.iron);rect(905,1388,239,22,M.corr);
 for(const x of [918,993,1068]){poly([[x,1418],[x+60,1418],[x+75,1533],[x-16,1533]],M.iron);
  poly([[x+12,1425],[x+48,1425],[x+61,1520],[x,1520]],M.rust);rect(x+16,1509,38,8,M.brass);}
 // Deliberate maintenance passage notches, plus service masts.
 // Crane side masts, maintenance platforms and access lights.
 for(const x of [775,1262]){rect(x,422,13,1028,M.corr);
  for(let y=455;y<1440;y+=72){rect(x-11,y,34,10,M.iron);rect(x+3,y+12,7,38,M.brass);}}
 for(const y of [783,1173]){rect(660,y,173,19,M.steel);rect(1213,y,174,19,M.steel);
  railing(674,827,y);railing(1222,1374,y);}
 for(const [x,y] of [[775,840],[1262,1070]]){rect(x-30,y,73,22,M.hazard);rect(x-14,y-14,37,14,M.steel);}
 // Lab dressing: switches, blue phosphor monitors, storage canisters.
 const desk=(x,y,w)=>{rect(x,y,w,62,M.iron);rect(x+6,y+7,w-12,38,M.dark);rect(x+11,y+12,w-22,7,M.cyan);
  for(let j=0;j<5;j++)rect(x+12+j*11,y+27,6,8,j%2?M.amber:M.glass);rect(x+6,y+52,w-12,6,M.corr);};
 desk(306,369,102);desk(1610,376,88);desk(335,940,98);desk(1578,1212,88);
 for(const [x,y] of [[205,665],[1680,669],[215,1218],[1655,1510]])for(let i=0;i<3;i++){
  rect(x+i*49,y,36,104,M.iron);rect(x+i*49+5,y+7,26,80,M.paint);
  rect(x+i*49+10,y+16,16,20,M.amber);rect(x+i*49+7,y+74,20,5,M.phos);
 }
 rect(223,199,192,75,M.iron);rect(234,208,171,57,M.slate);label("A-3",252,214,8,M.white);
 rect(1564,199,236,75,M.iron);rect(1574,209,215,57,M.slate);label("ORBITAL",1590,225,4,M.cyan);
 for(let x=450;x<=1640;x+=95){rect(x,160,52,7,M.white);rect(x+8,166,35,5,M.cyan);}
 // Clear unobstructed horizontal transit across piers in the lower undercroft.
 for(let x=210;x<1820;x+=176)rect(x-12,1835,54,83,M.air);
 // Assembly-stage precision markings over rocket's existing solid skin.
 for(let y=683;y<1320;y+=92){
  rect(1018,y,16,5,M.brass);rect(1042,y,13,5,M.iron);
  rect(962,y+35,7,26,M.steel);rect(1082,y+35,7,26,M.brass);
 }
 // Mineral/steel visual texture only in cutaway rock and basement, never in flight corridors.
 for(let i=0;i<410;i++){let x,y;if(i<225){x=rand()<.5?12+rand()*75:1960+rand()*75;y=160+rand()*1700;}
  else{x=120+rand()*1800;y=1983+rand()*64;}
  rect(x,y,3+(rand()*10|0),3,i%7===0?M.obsi:(i%3===0?M.granite:M.slate));}
 for(let x=246;x<1800;x+=210){rect(x,1795,12,32,M.brass);rect(x-16,1825,45,10,M.amber);rect(x-10,1834,32,3,M.white);}
 const spawn=[730,370],marks=[
  ["A3 Control Gallery",[445,417]],["East Flight Control",[1745,456]],
  ["Upper Nose Overlook",[813,470]],["West Crane Rail",[718,386]],
  ["East Crane Rail",[1317,386]],["Booster West",[710,716]],
  ["Booster East",[1335,716]],["Fabrication West",[447,1026]],
  ["Metrology East",[1709,1026]],["Port Engine Deck",[714,1290]],
  ["Starboard Engine Deck",[1345,1290]],["West Lower Lab",[438,1568]],
  ["East Lower Lab",[1730,1501]],["Lift Shaft West",[603,1628]],
  ["Lift Shaft East",[1440,1628]],["Lower Service West",[820,1850]],
  ["Lower Service East",[1220,1850]]
 ];
 // Lossless spatial RLE (same edit representation as Workbench PAINT).
 const edits=[];let active=new Map();
 for(let y=0;y<H;y++){const next=new Map();for(let x=0;x<W;){
   const material=cells[y*W+x];let x2=x+1;while(x2<W&&cells[y*W+x2]===material)x2++;
   if(material){const key=x+":"+x2+":"+material,p=active.get(key);
    if(p){p[3]++;next.set(key,p);}else next.set(key,[x,y,x2-x,1,material]);}x=x2;
  }
  for(const [k,p] of active)if(!next.has(k))edits.push(p);active=next;
 }
 for(const p of active.values())edits.push(p);
 edits.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 // Exact 4,194,304-cell reconstruction from the actual serialized edit rectangle stream.
 const reconstructed=new Uint8Array(W*H);
 for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)reconstructed.fill(m,yy*W+x,yy*W+x+w);
 let mismatches=0;for(let i=0;i<cells.length;i++)if(cells[i]!==reconstructed[i])mismatches++;
 // Conservative exact 19x15 full-kernel clearance via two passes of occupancy prefix sums.
 const horizontal=new Uint16Array(W*H),blocked=new Uint8Array(W*H);
 for(let y=0;y<H;y++){const pref=new Uint16Array(W+1),off=y*W;
  for(let x=0;x<W;x++)pref[x+1]=pref[x]+(cells[off+x]!==0?1:0);
  for(let x=0;x<W;x++)horizontal[off+x]=pref[Math.min(W,x+10)]-pref[Math.max(0,x-9)];
 }
 for(let x=0;x<W;x++){const pref=new Uint32Array(H+1);
  for(let y=0;y<H;y++)pref[y+1]=pref[y]+horizontal[y*W+x];
  for(let y=0;y<H;y++)blocked[y*W+x]=pref[Math.min(H,y+8)]-pref[Math.max(0,y-7)]>0?1:0;
 }
 const visited=new Uint8Array(W*H),q=new Int32Array(W*H),start=spawn[1]*W+spawn[0];
 let head=0,tail=0;if(!blocked[start]){visited[start]=1;q[tail++]=start;}
 while(head<tail){const v=q[head++],x=v%W,y=Math.floor(v/W);
  if(x>0&&!blocked[v-1]&&!visited[v-1]){visited[v-1]=1;q[tail++]=v-1;}
  if(x<W-1&&!blocked[v+1]&&!visited[v+1]){visited[v+1]=1;q[tail++]=v+1;}
  if(y>0&&!blocked[v-W]&&!visited[v-W]){visited[v-W]=1;q[tail++]=v-W;}
  if(y<H-1&&!blocked[v+W]&&!visited[v+W]){visited[v+W]=1;q[tail++]=v+W;}
 }
 const marksResult=marks.map(([name,p])=>({name,point:p,reachable:Boolean(visited[p[1]*W+p[0]]),clear:Boolean(!blocked[p[1]*W+p[0]])}));
 const setup=JSON.parse(JSON.stringify(base));setup.extent=[W,H];setup.edits=edits;
 setup.actors=[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",
  spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}];
 setup.selected=1;setup.next_id=2;
 const wrapper=JSON.parse(JSON.stringify(template));wrapper.starting_setup=setup;wrapper.version=1;wrapper.generation.extent=[W,H];
 const json=JSON.stringify(wrapper);
 // Self-implemented indexed palette PNG. PNG pixels sample actual authored 2048² cell plane.
 const colors=new Uint8Array(768);
 for(const p of palette)if(p.id>=0&&p.id<256&&p.rgba){colors[3*p.id]=p.rgba[0];colors[3*p.id+1]=p.rgba[1];colors[3*p.id+2]=p.rgba[2];}
 const pw=512,ph=512,scan=new Uint8Array(ph*(pw+1));
 for(let y=0;y<ph;y++)for(let x=0;x<pw;x++)scan[y*(pw+1)+1+x]=cells[(y*4+1)*W+(x*4+1)];
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
 function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let j=0;j<8;j++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);}return (c^0xffffffff)>>>0;}
 function chunk(type,data){let inner=Uint8Array.from([...type].map(x=>x.charCodeAt(0)).concat([...data]));
  return [...be(data.length),...inner,...be(crc(inner))];}
 const comp=[0x78,1];let a=1,b=0;
 for(let off=0;off<scan.length;){let n=Math.min(65535,scan.length-off),last=(off+n===scan.length);
  comp.push(last?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255);
  for(let j=0;j<n;j++){let v=scan[off+j];comp.push(v);a=(a+v)%65521;b=(b+a)%65521;}off+=n;
 }
 comp.push(...be(((b<<16)|a)>>>0));
 const bytes=[137,80,78,71,13,10,26,10,...chunk("IHDR",Uint8Array.from([...be(pw),...be(ph),8,3,0,0,0])),...chunk("PLTE",colors),...chunk("IDAT",Uint8Array.from(comp)),...chunk("IEND",new Uint8Array(0))];
 const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 let pngBase64="";for(let i=0;i<bytes.length;i+=3){const a=bytes[i],b=bytes[i+1]||0,c=bytes[i+2]||0,v=(a<<16)|(b<<8)|c;
  pngBase64+=alpha[(v>>>18)&63]+alpha[(v>>>12)&63]+(i+1<bytes.length?alpha[(v>>>6)&63]:"=")+(i+2<bytes.length?alpha[v&63]:"=");}
 const counts={};for(const m of cells)counts[m]=(counts[m]||0)+1;
 return {json,pngBase64,rectangleCount:edits.length,jsonBytes:json.length,pngBytes:bytes.length,
  destinations:marksResult,reachable:marksResult.filter(x=>x.reachable).length,componentCells:tail,
  reconstructionMismatches:mismatches,materialCounts:counts,extent:[W,H],seed:SEED,source:"works-0023"};
}
if(typeof module!=="undefined"&&typeof require==="function"&&require.main===module){
 const fs=require("fs"),base=JSON.parse(fs.readFileSync("base-setup.json")),
  template=JSON.parse(fs.readFileSync("generated-start-template.json")),
  palette=JSON.parse(fs.readFileSync("material-palette.json")),o=buildCyberSand(base,template,palette);
 fs.writeFileSync("setup-works-0023-cliffcut-rocket-hall.json",o.json);
 fs.writeFileSync("preview.png",Buffer.from(o.pngBase64,"base64"));
 fs.writeFileSync("evidence.json",JSON.stringify({extent:o.extent,rectangle_count:o.rectangleCount,
  json_bytes:o.jsonBytes,reachable:o.reachable,destinations:o.destinations,
  reconstruction_mismatches:o.reconstructionMismatches,material_counts:o.materialCounts,
  seed:o.seed},null,2)+"\n");
 console.log(o.rectangleCount+" rectangles; "+o.jsonBytes+" bytes; "+o.reachable+"/"+o.destinations.length+" reachable");
}