'use strict';
// Original authored 2048x1024 perpendicular side-elevation material-cell world.
// Vesper Negative-Pressure Lock; authored fixed seed 19112603; no external image input.
const W=2048,H=1024,SEED=19112603;
const SITES=[["Arrival isolation",245,451],["Slag loft",278,453],["West assay deck",440,466],["Sluice valve overlook",779,468],["Brine pump inspection",620,725],["Gorge west lock",861,460],["Suspension span",1052,446],["Void retrieval",1032,862],["Gorge east lock",1210,414],["Vacuum retort observation",1430,500],["Thermal shield service",1500,703],["Fin stack control",1800,462],["East export",2008,440],["Coolant recovery",1806,812]];
const CROPS=[["01-west-intake",70,230,480,480],["02-sluice-deck",440,335,480,480],["03-pressure-gorge",800,355,500,500],["04-vacuum-retort",1240,220,480,500],["05-east-fins",1580,260,450,520],["06-lower-recovery",880,730,500,260]];
const COLORS={"0":[8,11,18],"3":[47,127,210],"8":[241,78,31],"58":[111,118,126],"62":[138,151,166],"68":[102,124,135],"70":[211,207,183],"76":[230,186,41],"77":[25,211,220],"79":[250,168,44],"100":[54,56,61],"101":[24,19,32],"104":[200,152,98],"117":[124,134,149],"120":[134,189,197],"122":[192,214,227],"131":[86,91,105]};
function materialWorld(){
const g=new Uint8Array(W*H);let seed=SEED>>>0;const rng=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
const rect=(x,y,w,h,m)=>{x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));let x2=Math.min(W,Math.floor(x+w)),y2=Math.min(H,Math.floor(y+h));if(x2<=x||y2<=y)return;for(let j=y;j<y2;j++)g.fill(m,j*W+x,j*W+x2)};
const line=(x1,y1,x2,y2,t,m)=>{let n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/3);for(let k=0;k<=n;k++){let a=k/Math.max(1,n);rect(Math.round(x1+(x2-x1)*a-t/2),Math.round(y1+(y2-y1)*a-t/2),t,t,m)}};
const oval=(cx,cy,rx,ry,m,inner=0)=>{for(let y=Math.max(0,Math.ceil(cy-ry));y<Math.min(H,Math.floor(cy+ry)+1);y++){let yy=(y-cy)/ry;let q=1-yy*yy;if(q<0)continue;let dx=rx*Math.sqrt(q);let l=Math.max(0,Math.ceil(cx-dx)),r=Math.min(W-1,Math.floor(cx+dx));for(let x=l;x<=r;x++){const z=((x-cx)/rx)**2+yy**2;if(z<=1&&z>=inner)g[y*W+x]=m}}};
const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
for(let x=0;x<W;x+=8){let top=884+26*Math.sin(x/111)+13*Math.sin(x/47);if(x>790&&x<1240)top=949+9*Math.sin(x/36);if(x<240)top-=15;if(x>1650)top-=20;top=Math.max(822,Math.min(961,Math.round(top/8)*8));rect(x,top,8,1024-top,100);rect(x,978,8,46,58);}
rect(0,1007,W,17,58);
rect(35,920,1980,49,0);rect(35,966,1980,5,62);
rect(867,860,390,115,0);rect(867,963,390,8,62);
rect(38,608,325,13,62);rect(70,630,310,8,117);line(80,608,180,300,15,58);line(180,300,343,480,15,58);line(185,310,185,608,14,62);
line(67,612,67,920,16,58);line(350,612,350,920,16,58);rect(55,740,290,11,62);rect(72,832,263,10,117);
rect(85,392,250,10,62);rect(85,402,10,99,58);rect(325,402,10,99,58);rect(97,482,228,10,62);rect(120,408,66,5,120);rect(216,408,68,5,120);
for(let i=0;i<5;i++){let x=109+i*40;rect(x,492,7,116,117);rect(x+9,510,18,6,i%2?76:70);rect(x+16,516,6,93,117)}
line(365,870,397,345,15,62);line(397,345,472,380,12,117);line(397,345,349,413,10,117);rect(388,348,18,300,62);rect(379,402,37,10,76);
for(let i=0;i<4;i++){let y=465+i*76;line(388,y,420,y+37,8,68)}
rect(470,608,365,11,62);line(485,605,540,915,15,58);line(810,605,792,920,15,58);
rect(491,700,310,9,117);rect(525,803,263,9,117);
for(let i=0;i<3;i++){let x=525+i*93;line(x,608,x+46,680-i*18,13,117);line(x+46,680-i*18,x+67,700,10,68);rect(x+44,682-i*18,25,5,76);}
rect(555,538,213,10,62);line(575,542,645,432,11,117);line(745,542,685,436,11,117);rect(633,414,58,18,58);rect(641,538,14,71,117);
rect(568,756,167,45,3);frame(558,745,187,66,11,58);rect(571,745,15,11,70);rect(711,745,16,11,70);rect(581,811,14,110,58);rect(715,811,14,110,58);
rect(600,740,92,5,77);rect(617,810,58,11,68);
line(840,917,835,585,17,58);line(842,585,886,541,12,62);line(848,608,904,576,9,117);
line(859,565,1004,598,13,62);line(1004,598,1217,542,13,62);
line(859,634,1003,673,10,117);line(1003,673,1217,621,10,117);
for(let i=0;i<6;i++){let x=876+i*54;let a=(x-859)/358;let y1=a<.41?565+33*a/.41:598-56*(a-.41)/.59;let y2=a<.41?634+39*a/.41:673-52*(a-.41)/.59;line(x,y1,x,y2,7,68);}
line(860,560,864,918,13,58);line(1217,540,1232,914,13,58);
rect(895,818,10,146,62);rect(1152,818,10,146,62);rect(905,832,60,8,117);rect(1100,832,52,8,117);
line(1274,912,1330,318,22,58);line(1330,318,1488,206,22,58);line(1488,206,1622,377,22,58);line(1622,377,1638,918,22,58);
line(1301,665,1366,397,14,117);line(1366,397,1488,286,14,117);line(1488,286,1590,419,14,117);line(1590,419,1602,674,14,117);
rect(1288,671,337,14,62);rect(1310,795,308,14,62);rect(1390,575,150,9,68);rect(1401,582,13,91,117);rect(1526,529,8,48,117);
rect(1340,448,200,9,62);rect(1350,458,10,73,117);rect(1525,458,10,73,117);
rect(1354,731,83,48,8);frame(1344,720,103,69,10,104);rect(1354,730,83,1,104);rect(1357,789,18,20,58);rect(1419,789,18,20,58);
rect(1494,736,88,43,3);frame(1484,725,108,64,10,58);rect(1494,735,88,1,58);rect(1496,789,16,20,58);rect(1570,789,16,20,58);
for(let i=0;i<5;i++){rect(1274+i*27,807-i*20,48,7,117);rect(1274+i*27,814-i*20,8,111+i*20,58)}
rect(1514,821,66,8,62);rect(1530,800,11,21,77);rect(1550,807,15,14,76);
rect(1685,652,342,15,58);rect(1703,779,307,11,62);
for(let [x,top,width] of [[1732,315,32],[1830,239,25],[1932,371,40]]){
 rect(x,top,width,650-top,58);rect(x+9,top+8,Math.max(5,width-18),610-top,101);
 rect(x-12,top+55,width+24,10,62);rect(x-13,top+140,width+26,10,62);
 rect(x+2,top+8,5,50,79);rect(x+width-8,top+68,5,39,77);
 rect(x,650,width,270,62);
}
rect(1680,501,350,10,62);rect(1695,599,311,11,117);
for(let i=0;i<6;i++){let x=1702+i*53;rect(x,516,8,83,117);rect(x+14,526,14,5,i%2?77:79);rect(x+18,531,6,68,117)}
rect(1712,833,276,10,117);
line(1770,660,1685,915,13,58);line(1960,660,2000,925,13,58);
line(1855,790,1855,920,12,62);
line(792,802,835,916,8,68);line(1250,842,1280,915,9,68);
rect(1050,930,18,36,76);rect(1038,919,42,11,62);
for(let [x,y] of [[165,934],[468,934],[790,934],[1310,934],[1550,934],[1880,934]]){rect(x,y,34,8,62);rect(x+7,y-6,19,6,77);rect(x+14,y+8,6,30,117)}
rect(329,480,8,132,58);
rect(208,295,46,127,0);
rect(1027,502,61,406,0);
rect(455,684,88,113,0);
rect(1275,464,112,65,0);
rect(1584,686,93,38,0);
rect(1779,489,49,306,0);
line(1330,319,1180,550,14,117);line(1180,548,1180,982,14,58);
line(1217,546,1307,563,16,62);
rect(1348,528,14,8,0);
rect(209,388,43,31,0);
rect(340,420,42,86,0);rect(820,423,51,86,0);rect(1213,426,49,79,0);rect(1639,422,44,82,0);
rect(183,913,58,59,0);rect(748,913,58,59,0);rect(1640,912,58,60,0);
rect(187,968,50,5,62);rect(752,968,50,5,62);rect(1644,968,50,5,62);
return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
