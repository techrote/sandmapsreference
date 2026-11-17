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

 // P1 actual-cell industrial repair. All fixtures are cold, static, no new dynamic material rules.
 function forklift(x,y,s){rect(x,y,90*s,21*s,M.iron);rect(x+7*s,y+5*s,67*s,7*s,M.amber);
  rect(x+13*s,y-23*s,29*s,26*s,M.steel);rect(x+18*s,y-19*s,18*s,16*s,M.dark);
  rect(x+77*s,y-50*s,7*s,53*s,M.corr);rect(x+77*s,y-51*s,44*s,6*s,M.brass);
  for(let dx of [20,68]){ellipse(x+dx*s,y+22*s,13*s,13*s,M.iron);ellipse(x+dx*s,y+22*s,5*s,5*s,M.cyan);}
 }
 function optic(x,y){rect(x-3,y-10,100,11,M.corr);rect(x+11,y-39,5,33,M.steel);
  rect(x+58,y-37,7,28,M.steel);rect(x+18,y-61,40,23,M.iron);
  rect(x+21,y-57,32,12,M.cyan);rect(x+45,y-64,15,13,M.white);
  rect(x+30,y-3,40,5,M.brass);}
 function mill(x,y){rect(x,y,113,15,M.iron);rect(x+10,y-49,10,49,M.brass);
  rect(x+92,y-68,9,68,M.corr);rect(x+15,y-69,85,9,M.steel);
  rect(x+28,y-62,25,17,M.iron);rect(x+37,y-48,7,24,M.amber);
  rect(x+60,y-7,32,6,M.cyan);}
 function gauge(x,y){ellipse(x,y,30,30,M.iron);ellipse(x,y,22,22,M.dark);
  for(let a=0;a<12;a++){const t=a*Math.PI/6;line(x+15*Math.cos(t),y+15*Math.sin(t),x+21*Math.cos(t),y+21*Math.sin(t),2,M.white);}
  rect(x-5,y-5,10,10,M.amber);rect(x-2,y-31,4,17,M.cyan);}
 const westProgram=["LIFT","FORM","JIG","PRESS","ENGINE"];
 const eastProgram=["CONTROL","OPTICS","METRO","SENSOR","PAYLOAD"];
 for(let k=0;k<5;k++){const y=floors[k];
  // Replace identical repetitive display banks inside each room, retain shell, slabs, lift portals.
  rect(211,y+33,325,160,M.air);rect(1510,y+33,319,161,M.air);
  label(westProgram[k],230,y+13,2,M.phos);
  label(eastProgram[k],1540,y+13,2,M.cyan);
  rect(226,y+38,290,5,M.corr);rect(1530,y+38,278,5,M.steel);
  for(let x=235;x<510;x+=64){rect(x,y+41,5,18,M.brass);rect(x+16,y+37,20,4,k%2?M.cyan:M.amber);}
  for(let x=1543;x<1806;x+=79){rect(x,y+41,4,13,M.brass);rect(x+11,y+37,25,4,M.cyan);}
  if(k===0){ // gantry receiving / flight telemetry
   rect(259,y+62,226,12,M.iron);rect(293,y+74,14,55,M.steel);
   rect(495,y+74,12,38,M.brass);rect(272,y+95,56,13,M.hazard);
   rect(242,y+151,118,10,M.corr);rect(253,y+162,83,22,M.iron);
   for(let x=264;x<342;x+=24)ellipse(x,y+187,8,8,M.brass);
   rect(1538,y+66,162,57,M.iron);rect(1546,y+75,146,40,M.dark);
   for(let x=1552;x<1685;x+=25)rect(x,y+83,18,8,x%2?M.cyan:M.phos);
   rect(1571,y+169,100,21,M.corr);rect(1580,y+166,80,7,M.cyan);
   rect(1800,y+104,13,74,M.steel);rect(1798,y+99,20,9,M.amber);
  } else if(k===1){ // plate mill / vacuum optics
   mill(256,y+167);rect(378,y+159,83,11,M.corr);
   for(let x=385;x<462;x+=21)ellipse(x,y+175,8,9,M.steel);
   rect(498,y+105,12,94,M.iron);rect(474,y+100,57,10,M.hazard);
   rect(1522,y+95,68,90,M.iron);rect(1531,y+102,50,73,M.dark);
   rect(1538,y+121,35,7,M.phos);rect(1554,y+145,4,25,M.cyan);
   optic(1643,y+174);gauge(1771,y+95);
  } else if(k===2){ // booster jig / metrology bay
   rect(246,y+88,124,12,M.corr);rect(247,y+99,10,95,M.steel);
   rect(358,y+100,9,93,M.steel);rect(251,y+187,122,10,M.iron);
   ellipse(306,y+151,49,31,M.steel);ellipse(306,y+151,40,23,M.dark);
   rect(274,y+147,64,6,M.amber);rect(391,y+170,20,26,M.corr);
   rect(1548,y+68,184,11,M.steel);rect(1560,y+80,10,54,M.iron);
   rect(1708,y+81,9,54,M.iron);rect(1585,y+105,106,9,M.cyan);
   for(let x=1588;x<1704;x+=23)rect(x,y+116,7,13,M.brass);
   optic(1569,y+184);gauge(1770,y+110);
  } else if(k===3){ // punch press / vibration analysis
   rect(256,y+79,94,13,M.iron);rect(268,y+93,11,91,M.corr);
   rect(328,y+93,10,89,M.corr);rect(285,y+118,39,28,M.steel);
   rect(294,y+146,21,14,M.amber);rect(266,y+186,84,12,M.iron);
   mill(396,y+189);
   rect(1555,y+71,104,63,M.iron);rect(1563,y+80,87,47,M.dark);
   for(let j=0;j<6;j++)line(1568+j*14,y+110,1575+j*14,y+93+(j%3)*7,2,M.cyan);
   rect(1717,y+166,100,21,M.corr);rect(1726,y+155,76,10,M.steel);
   gauge(1772,y+98);
  } else { // engine rig / payload clean room
   rect(258,y+85,120,9,M.corr);rect(275,y+94,11,63,M.brass);
   rect(354,y+95,10,49,M.iron);ellipse(314,y+160,50,35,M.iron);
   ellipse(314,y+160,36,24,M.rust);rect(299,y+154,30,11,M.steel);
   rect(245,y+193,144,7,M.hazard);
   rect(1533,y+89,106,10,M.corr);rect(1533,y+99,9,95,M.iron);
   rect(1626,y+99,10,95,M.iron);rect(1553,y+115,64,57,M.dark);
   rect(1556,y+120,58,6,M.cyan);rect(1557,y+156,55,5,M.amber);
   optic(1760,y+189);rect(1792,y+150,25,39,M.steel);
  }
 }
 // Preserve complete actor clearance into the metrology inspection site.
 // 33px open horizontal service aisle leaves the optical bench and ceiling jig recognizable.
 rect(1500,860+149,267,35,M.air);
 // Multiple rocket service tiers: nose optics, umbilical bus, protected avionics and cold engine skirt.
 poly([[1018,520],[1031,520],[1043,577],[1007,577]],M.dark);
 rect(1015,528,19,32,M.cyan);rect(1020,535,10,14,M.glass);
 for(let y of [701,827,953,1090,1225]){
  rect(927,y,21,7,M.brass);rect(1099,y,21,7,M.brass);
  rect(945,y+7,13,31,M.corr);rect(1087,y+7,11,31,M.corr);
  rect(952,y+17,19,8,M.hazard);rect(1077,y+17,18,7,M.hazard);
 }
 rect(983,700,82,56,M.iron);rect(994,711,60,34,M.dark);
 for(let x=1001;x<1052;x+=15)rect(x,716,9,22,M.cyan);
 rect(978,766,91,6,M.brass);
 ellipse(1025,895,42,35,M.corr);ellipse(1025,895,30,23,M.dark);
 for(let x=1004;x<1051;x+=15)rect(x,884,8,23,M.cyan);
 rect(911,877,26,43,M.iron);rect(1110,877,26,43,M.iron);
 rect(918,892,19,9,M.amber);rect(1110,892,19,9,M.amber);
 rect(984,1083,80,54,M.iron);
 for(let x=993;x<1052;x+=13)for(let y=1090;y<1127;y+=8)rect(x,y,8,4,M.dark);
 rect(998,1141,58,8,M.cyan);
 for(let x of [925,973,1021,1069,1114]){rect(x,1377,9,39,M.corr);
  rect(x-7,1409,23,7,M.amber);}
 for(let x of [854,1168]){rect(x,921,22,33,M.iron);rect(x+4,928,14,8,M.cyan);
  rect(x+7,955,7,15,M.brass);}
 // Cold undercroft equipment: the roof rail intentionally breaks at both lift outlets.
 for(const [a,b] of [[205,535],[682,1360],[1510,1820]])rect(a,1810,b-a,7,M.corr);
 for(let x=244;x<1770;x+=165)if((x<530||x>690&&x<1360||x>1510)){rect(x,1817,13,12,M.brass);rect(x+3,1829,7,9,M.amber);}
 forklift(294,1903,1);forklift(1460,1903,1);
 rect(523,1877,95,13,M.steel);rect(535,1890,9,42,M.corr);
 rect(603,1890,9,42,M.corr);rect(548,1902,53,17,M.rust);
 rect(536,1922,91,8,M.amber);
 for(let x=668;x<768;x+=24){ellipse(x,1918,11,11,M.iron);ellipse(x,1918,5,5,M.brass);}
 rect(662,1903,110,7,M.corr);
 rect(928,1802,185,12,M.iron);
 for(let x=947;x<1115;x+=38)rect(x,1814,8,18,M.brass);
 rect(1027,1815,14,26,M.steel);rect(1008,1832,52,10,M.hazard);
 rect(938,1905,151,7,M.steel);rect(945,1915,138,20,M.iron);
 for(let x=959;x<1080;x+=22)rect(x,1920,12,8,M.cyan);
 rect(1282,1879,105,10,M.corr);rect(1295,1889,9,46,M.iron);
 rect(1375,1889,8,46,M.iron);rect(1317,1890,41,23,M.rust);
 rect(1323,1918,29,13,M.brass);
 label("TRANSFER",325,1808,3,M.white);
 label("LIFT",972,1771,3,M.amber);
 label("HYDRAULIC",1268,1808,2,M.cyan);

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

 function pngCrop(rx,ry,rw,rh){
  const s=new Uint8Array(rh*(rw+1));for(let y=0;y<rh;y++)s.set(cells.subarray((ry+y)*W+rx,(ry+y)*W+rx+rw),y*(rw+1)+1);
  const z=[0x78,1];let a=1,b=0;
  for(let off=0;off<s.length;){const n=Math.min(65535,s.length-off),last=off+n===s.length;
   z.push(last?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255);
   for(let j=0;j<n;j++){const v=s[off+j];z.push(v);a=(a+v)%65521;b=(b+a)%65521;}off+=n;
  }
  z.push(...be(((b<<16)|a)>>>0));
  const v=[137,80,78,71,13,10,26,10,...chunk("IHDR",Uint8Array.from([...be(rw),...be(rh),8,3,0,0,0])),
   ...chunk("PLTE",colors),...chunk("IDAT",Uint8Array.from(z)),...chunk("IEND",new Uint8Array(0))];
  let o="";for(let i=0;i<v.length;i+=3){const a=v[i],b=v[i+1]||0,c=v[i+2]||0,t=a<<16|b<<8|c;
   o+=alpha[t>>>18&63]+alpha[t>>>12&63]+(i+1<v.length?alpha[t>>>6&63]:"=")+(i+2<v.length?alpha[t&63]:"=");}
  return o;
 }
 const districtCrops=[
  {name:"rocket-gantry",origin:[705,285],size:[660,720],pngBase64:pngCrop(705,285,660,720)},
  {name:"west-fabrication",origin:[185,790],size:[510,650],pngBase64:pngCrop(185,790,510,650)},
  {name:"east-metrology",origin:[1367,790],size:[510,650],pngBase64:pngCrop(1367,790,510,650)},
  {name:"undercroft",origin:[280,1580],size:[1490,460],pngBase64:pngCrop(280,1580,1490,460)}
 ];

 const counts={};for(const m of cells)counts[m]=(counts[m]||0)+1;
 return {json,pngBase64,districtCrops,rectangleCount:edits.length,jsonBytes:json.length,pngBytes:bytes.length,
  destinations:marksResult,reachable:marksResult.filter(x=>x.reachable).length,componentCells:tail,
  reconstructionMismatches:mismatches,materialCounts:counts,extent:[W,H],seed:SEED,source:"works-0023"};
}

function buildEvidence(o,palette){
 const active=Object.keys(o.materialCounts).map(Number).filter(id=>o.materialCounts[id]>0&&id!==0);
 const invalid=active.filter(id=>{const p=palette.find(x=>x.id===id);return !p||!p.valid||p.state!=="Solid"||p.movable||p.rule_kernel!=="None";});
 return {
  reference:{
   public_id:"works-0023",title:"orbital_assembly_hangars-rocket_assembly_hall-cool_precision",
   artwork_path:"artwork/works_yards/batch1/orbital_assembly_hangars-rocket_assembly_hall-cool_precision.png",
   artwork_git_blob:"167c7873e9637cb3930fe7504a0e463cbfe8983e",
   artwork_sha256:"033534dc0971a8250f27a7d9a91e60af6230559a872107505f574c33e1420fef",
   original_dimensions:[1536,1024],bitmap_decoded:false,source_key:"batch1/image-0052",legacy_record_id:"image-0052"
  },
  engine:{
   repo:"techrote/cybersand",main_sha:"018bd09503d7f079ddac52e225c2f7daf8d678bf",
   representation:"cybersand-generated-start-v1 / Workbench starting_setup version 2",
   material_manifest:"frozen prior accepted material-palette.json",
   midge_hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96"
  },
  static:{
   extent:o.extent,cells:4194304,rectangles:o.rectangleCount,rectangle_limit:32768,
   json_bytes:o.jsonBytes,json_limit:1048576,
   exact_reconstruction_cells:4194304,reconstruction_mismatches:o.reconstructionMismatches,
   envelope:[19,15],component_cells:o.componentCells,destinations:o.destinations,
   reachable:o.reachable,material_cell_counts:o.materialCounts,
   material_physics:{checked_against:"material-palette.json (frozen accepted CyberSand enum)",
    active_ids:active,non_solid_or_dynamic_active_ids:invalid,all_active_terrain_solid_and_inert:invalid.length===0},
   preview:{size:[512,512],source:"actual-material-plane",scale:"downsample 4:1"},
   district_crops:o.districtCrops.map(c=>({file:"crop-"+c.name+".png",origin:c.origin,size:c.size,scale:"1:1",source:"actual-material-plane"}))
  },
  reproducibility:{builder:"build.js",seed:23071,runtime:"Node.js 22+, built-in modules only"},
  unqualified:["native Godot/Rapier loading","native rectangle/actor admission","physical Windows NVIDIA","actor input and simulation","save/reopen","side-by-side source bitmap pixel review"],
  status:"Draft / HOLD — owner acceptance required"
 };
}

if(typeof module!=="undefined"&&typeof require==="function"&&require.main===module){
 const fs=require("fs"),base=JSON.parse(fs.readFileSync("base-setup.json")),
  template=JSON.parse(fs.readFileSync("generated-start-template.json")),
  palette=JSON.parse(fs.readFileSync("material-palette.json")),o=buildCyberSand(base,template,palette);
 fs.writeFileSync("setup-works-0023-cliffcut-rocket-hall.json",o.json);
 fs.writeFileSync("preview.png",Buffer.from(o.pngBase64,"base64"));
 for(const c of o.districtCrops)fs.writeFileSync("crop-"+c.name+".png",Buffer.from(c.pngBase64,"base64"));
 fs.writeFileSync("evidence.json",JSON.stringify(buildEvidence(o,palette),null,2)+"\n");
 console.log(o.rectangleCount+" rectangles; "+o.jsonBytes+" bytes; "+o.reachable+"/"+o.destinations.length+" reachable");
}