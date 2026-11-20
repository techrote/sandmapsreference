'use strict';
const W=2048,H=1024,N=W*H,SEED=0x261120e9;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122};
const P={0:[8,12,21],49:[76,92,111],58:[137,149,163],62:[178,195,209],100:[45,57,75],101:[27,35,53],113:[218,174,87],117:[103,124,142],122:[242,231,196]};
const MODEL='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const SITES=[['West ignition spawn',126,358],['Launch gantry',308,355],['First lock descent',554,600],['Pressure bypass',743,584],['Second lock rise',976,404],['Central diaphragm route',1105,473],['Third lock descent',1454,656],['Fourth lock rise',1760,479],['East reversal',1902,567],['East recovery apron',1860,800],['Fourth lock return bypass',1553,489],['Lower cascade',1460,741],['Regulator return',1070,720],['Second lock return bypass',974,412],['Foundry underpass',690,753],['West brake zone',252,750],['Finish west low',126,769],['West ignition room',242,226],['Diaphragm operator',1090,260],['East warning bridge',1822,214],['West service room',370,846],['Rotor maintenance',766,836],['Cold sluice service',1515,800]];
const CROPS=[['overview.png',0,0,W,H],['01-west-railhead.png',0,94,446,776],['02-drop-gate.png',390,105,462,801],['03-mid-compressor.png',810,105,465,827],['04-sluice-barrage.png',1220,105,460,818],['05-east-lockworks.png',1655,112,393,799],['06-foundation-shops.png',265,715,1320,309]];
function generate(){
 const g=new Uint8Array(N);let seed=SEED>>>0;
 function rnd(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
 function box(x,y,w,h,id,paint=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!paint||g[i])g[i]=id;}}
 function beam(x0,y0,x1,y1,r,id){let n=Math.ceil(Math.hypot(x1-x0,y1-y0)*1.5);for(let i=0;i<=n;i++){let t=i/n;box(x0+(x1-x0)*t-r,y0+(y1-y0)*t-r,2*r+1,2*r+1,id);}}
 for(let x=0;x<W;x++){let t=Math.round(125+6*Math.sin(x/83)+7*Math.sin(x/183)),f=Math.round(914+9*Math.sin(x/141));for(let y=0;y<t;y++)g[y*W+x]=y<24?M.S:y<t-20?M.B:M.T;for(let y=f;y<H;y++)g[y*W+x]=y<f+18?M.C:y<980?M.O:M.B;}
 // Four alternating roof/floor sluice baffles: the east line weaves downward/upward.
 box(419,110,46,368,M.C);box(432,145,18,309,M.I);box(405,455,73,23,M.T);beam(418,170,352,349,10,M.T);beam(465,185,502,321,9,M.Z);
 for(let j=0;j<4;j++)box(462,248+j*49,17,19,j%2?M.Z:M.I);
 box(832,533,57,391,M.C);box(849,568,23,344,M.I);box(819,530,84,30,M.T);beam(841,672,782,749,12,M.T);beam(883,623,928,717,9,M.Z);
 for(let j=0;j<4;j++)box(814,614+j*50,20,12,j%2?M.Q:M.I);
 box(1257,110,68,485,M.C);box(1276,151,27,409,M.I);box(1247,567,91,26,M.T);beam(1257,207,1171,410,13,M.T);beam(1325,230,1371,456,11,M.Z);
 for(let j=0;j<5;j++)box(1324,269+j*51,19,11,j%2?M.Z:M.Q);
 box(1630,545,61,387,M.C);box(1647,571,30,340,M.I);box(1617,534,86,27,M.T);beam(1635,670,1560,742,14,M.T);beam(1686,635,1742,710,11,M.Z);
 for(let j=0;j<4;j++)box(1617,625+j*56,16,15,j%2?M.Z:M.Q);
 // West ignition control gallery; accessible through an actual 65-cell bottom hatch.
 box(145,120,18,161,M.C);box(322,120,18,161,M.C);box(145,124,195,17,M.T);box(145,267,68,15,M.T);box(278,267,62,15,M.T);
 box(180,165,69,16,M.I);box(190,187,14,48,M.Q);box(226,199,68,14,M.Z);box(289,180,23,57,M.I);beam(166,129,204,166,8,M.T);
 beam(75,125,84,262,13,M.C);beam(318,128,312,285,12,M.C);box(82,273,68,17,M.T);box(285,281,60,17,M.T);
 // Physically rooted dual compressor and first pressure-lock district.
 for(let [x,w,h] of [[495,107,110],[644,117,134]]){box(x,915-h,17,h,M.C);box(x+w-17,915-h,17,h,M.C);box(x+12,904,w-24,12,M.T);box(x+24,856,26,46,M.I);beam(x+50,912,x+76,822,11,M.T);box(x+32,828,w-61,13,M.Z);}
 beam(537,909,541,747,14,M.C);box(518,736,71,20,M.I);box(529,740,48,7,M.Q,true);
 // Discrete monitored diaphragm room and founded drive cylinders.
 box(1000,123,18,163,M.C);box(1191,124,18,162,M.C);box(1000,122,209,17,M.T);box(1000,273,56,15,M.T);box(1146,273,63,15,M.T);
 box(1045,183,112,21,M.I);box(1061,204,30,36,M.Z);box(1115,205,28,41,M.Q);
 beam(1018,122,1029,327,12,M.T);beam(1190,122,1183,326,12,M.T);box(1028,325,157,19,M.I);for(let j=0;j<5;j++)box(1040+j*29,328,14,14,M.Q,true);
 beam(954,913,969,772,18,M.C);beam(1182,913,1163,772,18,M.C);box(964,773,217,19,M.T);box(972,792,19,96,M.I);box(1151,792,19,96,M.I);
 for(let j=0;j<5;j++){box(1005+j*30,806+(j%2)*7,20,82-(j%2)*7,M.T);box(1011+j*30,826,8,25,M.Z);}box(984,883,170,18,M.I);
 // Third-rooted barrage: separated thermal risers and distinct stepped purge tanks.
 for(let j=0;j<5;j++){let x=1360+j*43;beam(x,119,x+(j%2?15:-12),315+19*(j%3),10,M.T);box(x-8,317+19*(j%3),25,16,M.Z);}
 box(1374,895,233,23,M.T);for(let j=0;j<3;j++){box(1400+j*67,833-j*11,43,63+j*11,M.I);box(1410+j*67,816-j*11,17,24,M.Q);}
 beam(1392,908,1397,852,13,M.C);beam(1598,909,1595,852,13,M.C);
 // East reverser with separate overhead capture jaws and ground-supported release.
 box(1750,124,24,244,M.C);box(1971,123,24,244,M.C);beam(1757,357,1801,390,13,M.T);beam(1983,357,1933,390,13,M.T);
 box(1784,393,66,15,M.Z);box(1873,405,74,15,M.Q);
 box(1727,778,24,143,M.C);box(1992,780,24,139,M.C);beam(1740,779,1795,746,15,M.T);beam(2004,780,1940,743,15,M.T);
 box(1792,732,58,16,M.Z);box(1908,728,55,16,M.Q);
 // East signage gallery, structurally tied to same roof and open below.
 box(1757,125,16,155,M.C);box(1891,125,16,155,M.C);box(1762,130,145,15,M.T);box(1760,271,38,14,M.T);box(1861,271,44,14,M.T);
 box(1791,177,62,15,M.I);box(1806,196,18,25,M.Q);
 // Three distinct enterable service stations, each founded and top-open.
 for(let [x,w,k] of [[311,124,0],[683,136,1],[1438,158,2]]){box(x,797,14,111,M.C);box(x+w-14,797,14,111,M.C);box(x,897,w,15,M.T);box(x,789,29,16,M.T);box(x+w-31,789,31,16,M.T);
   box(x+19,870,26,27,M.I);box(x+26,850,13,22,M.Q);
   if(k===0){box(x+67,867,26,25,M.Z);beam(x+50,894,x+92,842,6,M.T);}
   if(k===1){box(x+68,853,37,40,M.T);box(x+76,860,21,14,M.Q);}
   if(k===2){beam(x+62,893,x+115,826,8,M.I);box(x+76,868,26,16,M.Z);}
 }
 for(let [x,y,id] of [[409,448,M.Q],[821,534,M.Z],[1249,570,M.Q],[1619,535,M.Z],[1990,909,M.Q],[161,127,M.Z]])box(x,y,29,8,id,true);
 for(let i=0;i<28;i++){let x=40+(rnd()*1960|0);box(x,18,12,3,i%2?M.O:M.Z,true);}
 // Full 31x27 Midge ports: cut the center access from the control plenum to the open race space and remove a compressor leg blocking the intended workshop approach.
 box(1061,315,84,47,0);
 box(742,806,29,70,0);
 let visited=new Uint8Array(N),queue=new Int32Array(N),a=0,b=0;function push(i){if(g[i]&&!visited[i]){visited[i]=1;queue[b++]=i;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(a<b){let i=queue[a++],x=i%W;if(x)push(i-1);if(x<W-1)push(i+1);if(i>=W)push(i-W);if(i<N-W)push(i+W);}
 let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!visited[i]){g[i]=0;discarded++;}return{g,grounded:b,discarded};
}
function encodeRects(g){let edits=[],prior=new Map();for(let y=0;y<H;y++){let cur=new Map();for(let x=0;x<W;){let v=g[y*W+x],start=x++;while(x<W&&g[y*W+x]===v)x++;if(!v)continue;let key=start+':'+(x-start)+':'+v,r=prior.get(key);if(r)r[3]++;else{r=[start,y,x-start,1,v];edits.push(r);}cur.set(key,r);}prior=cur;}return{edits,visits:edits.reduce((s,r)=>s+r[2]*r[3],0)};}
function reach(g,w,h){let stride=W+1,sum=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=g[(y-1)*W+x-1]?1:0;sum[y*stride+x]=r+sum[(y-1)*stride+x];}}
 let pass=new Uint8Array(N),l=w>>1,rr=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++)for(let x=l;x<W-rr;x++){let a=(y-t)*stride,c=(y+b+1)*stride,u=x-l,v=x+rr+1;if(sum[c+v]-sum[a+v]-sum[c+u]+sum[a+u]===0)pass[y*W+x]=1;}
 let seen=new Uint8Array(N),queue=new Int32Array(N),src=SITES[0][2]*W+SITES[0][1];if(!pass[src])throw Error('blocked spawn');
 let a=0,z=1;seen[src]=1;queue[0]=src;while(a<z){let i=queue[a++],x=i%W;if(x&&pass[i-1]&&!seen[i-1]){seen[i-1]=1;queue[z++]=i-1;}if(x<W-1&&pass[i+1]&&!seen[i+1]){seen[i+1]=1;queue[z++]=i+1;}if(i>=W&&pass[i-W]&&!seen[i-W]){seen[i-W]=1;queue[z++]=i-W;}if(i<N-W&&pass[i+W]&&!seen[i+W]){seen[i+W]=1;queue[z++]=i+W;}}
 return{connected:z,missing:SITES.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0])};
}
module.exports={W,H,N,SEED,M,P,MODEL,POLICY,SITES,CROPS,generate,encodeRects,reach};
