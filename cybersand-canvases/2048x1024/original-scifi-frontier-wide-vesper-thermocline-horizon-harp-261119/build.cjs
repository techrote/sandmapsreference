"use strict";
const WIDTH=2048, HEIGHT=1024, SEED=81102619;
const M={AIR:0, BASALT:100, OBSIDIAN:101, WALL:58, STEEL:62, PAINT:63, GRATE:66, PIPE:68, GLASS:120, FROST:121, QUARTZ:122, SOLAR:129, CARBON:130, SHIELD:131, CYAN:77, AMBER:79, LED:80, SLATE:49};
function buildPlane(){
 const g=new Uint8Array(WIDTH*HEIGHT), pix=(x,y,m)=>{if(x>=0&&x<WIDTH&&y>=0&&y<HEIGHT)g[y*WIDTH+x]=m};
 const rect=(x,y,w,h,m)=>{x=Math.max(0,Math.round(x));y=Math.max(0,Math.round(y));w=Math.max(0,Math.round(w));h=Math.max(0,Math.round(h));for(let yy=y; yy<Math.min(HEIGHT,y+h);yy++)g.fill(m,yy*WIDTH+x,yy*WIDTH+Math.min(WIDTH,x+w))};
 const line=(x0,y0,x1,y1,w,m)=>{let dx=x1-x0,dy=y1-y0,n=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy)));for(let i=0;i<=n;i++){let x=Math.round(x0+dx*i/Math.max(1,n)),y=Math.round(y0+dy*i/Math.max(1,n));rect(x-Math.floor(w/2),y-Math.floor(w/2),w,w,m)}};
 const oval=(cx,cy,rx,ry,m)=>{const ymin=Math.max(0,Math.ceil(cy-ry)),ymax=Math.min(HEIGHT,Math.floor(cy+ry));for(let y=ymin;y<ymax;y++){let dx=rx*Math.sqrt(Math.max(0,1-((y+.5-cy)/ry)**2));rect(Math.ceil(cx-dx),y,Math.floor(2*dx),1,m)}};
 const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
 const jag=(x)=>Math.round(6*Math.sin(x*.011)+8*Math.sin(x*.037)+3*Math.sin(x*.111));
 const height=(x)=>{let y=741+12*Math.sin(x*.012)+7*Math.sin(x*.046);
  if(x>520&&x<920)y+=210*Math.sin(Math.PI*(x-520)/800);
  if(x>=920&&x<1190)y=930+8*Math.sin(x*.032);
  if(x>=1190&&x<1530)y=917-185*(x-1190)/340+6*Math.sin(x*.04);
  if(x>=1530)y=718-65*Math.exp(-(((x-1700)/155)**2))+9*Math.sin(x*.034);
  return Math.round(y/4)*4;
 };
 for(let x=0;x<WIDTH;x+=4){let y=height(x);let b=((x>>5)%3===0?M.OBSIDIAN:M.BASALT);rect(x,y,4,HEIGHT-y,b);rect(x,y,4,12,M.SLATE);if(y+40<HEIGHT)rect(x,y+46,4,9,M.OBSIDIAN);if(y+117<HEIGHT)rect(x,y+114,4,6,M.SHIELD)}
 rect(0,1012,WIDTH,12,M.BASALT);
 rect(160,859,396,70,M.AIR);rect(540,882,990,58,M.AIR);rect(1480,857,410,73,M.AIR);
 for(let x=178;x<1882;x+=80){line(x,890,x+18,883,1,M.AIR)}
 rect(310,678,52,230,M.AIR);rect(1692,657,54,257,M.AIR);rect(1250,810,60,140,M.AIR);
 oval(1000,771,140,140,M.AIR);oval(1120,826,110,96,M.AIR);
 for(let x of [210,475,620,810,1050,1325,1535,1810]){rect(x,908,10,35,M.STEEL);rect(x-7,906,24,4,M.PAINT);}
 rect(75,711,510,26,M.WALL);rect(85,611,26,110,M.STEEL);rect(510,610,28,112,M.STEEL);
 rect(105,610,430,13,M.STEEL);rect(110,512,408,10,M.STEEL);rect(124,413,368,10,M.STEEL);
 rect(110,416,13,204,M.STEEL);rect(487,418,13,200,M.STEEL);
 rect(158,513,10,94,M.STEEL);rect(314,515,11,94,M.STEEL);rect(438,517,11,92,M.STEEL);
 rect(138,424,10,85,M.STEEL);rect(360,425,12,84,M.STEEL);
 line(116,412,172,373,7,M.CARBON);line(172,373,271,366,7,M.CARBON);line(271,366,372,383,7,M.CARBON);line(372,383,493,410,8,M.CARBON);
 line(124,409,174,379,4,M.GLASS);line(180,377,270,370,4,M.GLASS);line(278,370,367,388,4,M.GLASS);line(377,388,488,413,4,M.GLASS);
 rect(256,525,10,31,M.WALL);rect(256,589,10,16,M.WALL);
 rect(398,526,10,30,M.WALL);rect(398,592,10,14,M.WALL);
 rect(235,427,10,27,M.WALL);rect(235,493,10,12,M.WALL);
 rect(128,493,61,5,M.PAINT);rect(286,494,63,5,M.PAINT);
 for(let x of [146,191,278,323,415]){rect(x,443,25,5,M.FROST);rect(x,465,25,5,M.GLASS);rect(x,443,4,27,M.CARBON);rect(x+21,443,4,27,M.CARBON)}
 for(let x of [179,201,340,356,453]){rect(x,579,9,29,M.SHIELD);rect(x-3,574,15,5,M.STEEL);rect(x,581,3,9,M.CYAN)}
 rect(281,585,34,18,M.WALL);rect(285,576,26,9,M.GLASS);rect(305,569,4,8,M.LED);
 rect(398,595,43,9,M.PAINT);rect(410,579,6,16,M.PIPE);
 rect(125,598,31,9,M.GRATE);rect(129,590,5,8,M.AMBER);
 rect(73,575,10,139,M.STEEL);rect(81,312,10,263,M.STEEL);line(85,326,160,255,8,M.CARBON);
 oval(160,255,56,42,M.STEEL);oval(171,248,48,31,M.AIR);line(115,282,154,317,8,M.PIPE);
 rect(83,329,9,83,M.LED);rect(80,336,5,5,M.CYAN);
 rect(536,612,130,9,M.STEEL);line(615,619,651,730,8,M.CARBON);rect(637,727,50,12,M.WALL);
 rect(540,549,10,69,M.STEEL);rect(545,545,116,9,M.CARBON);
 rect(595,573,21,10,M.GRATE);rect(597,562,4,11,M.AMBER);rect(612,560,4,14,M.AMBER);
 line(657,737,763,838,14,M.BASALT);line(763,838,816,923,14,M.BASALT);
 rect(966,960,118,35,M.WALL);rect(1016,594,20,368,M.STEEL);
 line(1026,672,878,866,9,M.CARBON);line(1026,676,1187,876,9,M.CARBON);
 line(1026,720,904,877,4,M.PIPE);line(1026,718,1163,864,4,M.PIPE);
 rect(975,788,100,8,M.STEEL);rect(981,791,8,20,M.CARBON);rect(1065,790,8,22,M.CARBON);
 line(1025,598,898,451,12,M.CARBON);line(1025,598,1159,445,12,M.CARBON);
 line(898,451,770,435,7,M.CARBON);line(1159,445,1260,403,7,M.CARBON);
 line(792,439,903,453,14,M.SOLAR);line(906,450,1012,579,10,M.SOLAR);
 line(1156,448,1252,413,12,M.SOLAR);line(1040,573,1154,449,12,M.SOLAR);
 rect(875,622,132,9,M.STEEL);rect(1046,625,130,9,M.STEEL);
 line(950,630,1020,725,6,M.PIPE);line(1080,633,1023,726,6,M.PIPE);
 rect(896,601,10,22,M.LED);rect(1088,603,10,21,M.CYAN);
 rect(985,730,79,10,M.GRATE);rect(1017,741,10,46,M.STEEL);
 rect(1490,674,520,22,M.WALL);rect(1514,563,456,13,M.STEEL);rect(1550,474,391,11,M.STEEL);
 rect(1532,395,366,12,M.STEEL);rect(1516,317,237,14,M.STEEL);
 for(let x of [1515,1642,1770,1905]){rect(x,558,13,124,M.STEEL);rect(x,473,13,87,M.STEEL)}
 for(let x of [1543,1740,1939]){rect(x,398,13,164,M.CARBON)}
 rect(1523,333,12,62,M.STEEL);rect(1737,330,14,67,M.STEEL);
 line(1480,399,1599,254,10,M.CARBON);line(1599,254,1710,263,10,M.CARBON);line(1710,263,1778,318,10,M.CARBON);
 line(1486,399,1601,265,4,M.FROST);line(1609,259,1707,268,4,M.GLASS);
 rect(1866,287,15,390,M.CARBON);line(1874,291,1790,201,9,M.STEEL);line(1874,291,1954,203,9,M.STEEL);
 line(1790,204,1874,290,5,M.SOLAR);line(1954,203,1874,290,5,M.SOLAR);
 rect(1869,278,10,16,M.LED);rect(1869,342,12,6,M.AMBER);
 rect(1610,488,8,23,M.PAINT);rect(1610,550,8,10,M.PAINT);rect(1834,489,8,23,M.STEEL);rect(1834,547,8,10,M.STEEL);
 rect(1706,578,8,20,M.STEEL);rect(1706,637,8,32,M.STEEL);
 for(let x of [1580,1593,1740,1757,1868,1880]){rect(x,529,8,29,M.SHIELD);rect(x,529,8,4,M.AMBER)}
 for(let x of [1550,1577,1790,1817]){rect(x,627,19,44,M.WALL);rect(x+3,633,13,16,M.GLASS)}
 rect(1670,630,18,39,M.STEEL);rect(1673,637,12,12,M.LED);
 line(1912,571,2010,632,11,M.CARBON);rect(1988,632,13,43,M.STEEL);
 for(let x of [235,365,448,1571,1670,1845]){rect(x,908,10,24,M.STEEL);rect(x,882,10,25,M.CARBON)}
 rect(210,923,295,9,M.STEEL);rect(1530,926,323,9,M.STEEL);
 for(let x of [240,268,402,432,1590,1634,1780,1824]){rect(x,892,13,22,M.WALL);rect(x,887,13,5,M.FROST);rect(x,895,6,4,M.CYAN)}
 rect(560,932,820,12,M.WALL);
 for(let x of [626,758,905,1075,1227]){rect(x,915,16,16,M.STEEL);rect(x+3,906,10,9,M.SOLAR)}
 for(let x of [717,794,854,1272,1346,1427]){
  let top=height(x),base=Math.min(HEIGHT-20,top+20),len=24+(x%4)*5;
  line(x,base,x-12,base-len,7,M.QUARTZ);line(x+10,base,x+17,base-len+9,5,M.FROST);
 }
 line(1492,693,1400,800,13,M.WALL);line(1400,800,1360,903,10,M.CARBON);
 for(let [x,y] of [[114,518],[482,520],[549,612],[1534,566],[1755,566],[1922,561],[1020,665]])rect(x,y,4,9,M.CYAN);
 // Final 31x27-tested entrances and routes, bored after construction.
 rect(508,638,42,55,M.AIR);
 rect(484,540,30,57,M.AIR);
 rect(264,508,66,20,M.AIR);
 rect(481,436,33,59,M.AIR);
 rect(1724,338,37,51,M.AIR);
 rect(1734,410,31,54,M.AIR);
 rect(1635,490,35,55,M.AIR);
 rect(1897,587,36,59,M.AIR);
 rect(1665,862,33,48,M.AIR);
 rect(292,607,80,153,M.AIR);
 rect(613,646,52,75,M.AIR);
 rect(1534,412,34,55,M.AIR);
 rect(1509,492,48,57,M.AIR);
 rect(1934,410,35,54,M.AIR);
 rect(1688,665,64,46,M.AIR);
 rect(1900,585,48,64,M.AIR);
 rect(1960,580,50,53,M.AIR);
 rect(1508,585,48,62,M.AIR);
 rect(1634,586,39,62,M.AIR);
 rect(1764,586,32,62,M.AIR);
 rect(1688,630,65,83,M.AIR);
 rect(1557,858,37,62,M.AIR);
 rect(1373,868,50,67,M.AIR);
 // Geologically rooted cross-void shoring and permanent anchored equipment.
 line(1460,768,1320,984,12,M.BASALT);
 line(675,876,734,986,12,M.BASALT);
 line(382,548,354,412,7,M.CARBON);
 line(350,510,303,412,7,M.STEEL);
 rect(151,499,5,18,M.CARBON);rect(362,404,5,28,M.CARBON);
 for(let x of [146,191,278,323,415])rect(x+3,415,4,30,M.CARBON);
 for(let x of [1550,1817])rect(x+7,667,5,11,M.STEEL);
 for(let x of [268,402,432,1634,1780])rect(x+5,908,4,20,M.STEEL);
 for(let x of [626,758,905,1075,1227])rect(x+5,927,5,9,M.STEEL);
 // Enforce stable grounded final material; discard unattached construction trials.
 const mask=new Uint8Array(g.length);const q=new Int32Array(g.length);let head=0,tail=0;
 for(let x=0;x<WIDTH;x++){let i=(HEIGHT-1)*WIDTH+x;if(g[i]!==0&&!mask[i]){mask[i]=1;q[tail++]=i}}
 while(head<tail){let p=q[head++], x=p%WIDTH,y=(p-x)/WIDTH;let ns=[x>0?p-1:-1,x+1<WIDTH?p+1:-1,y>0?p-WIDTH:-1,y+1<HEIGHT?p+WIDTH:-1];for(let n of ns)if(n>=0&&g[n]!==0&&!mask[n]){mask[n]=1;q[tail++]=n}}
 let removed=0;for(let i=0;i<g.length;i++)if(g[i]!==0&&!mask[i]){g[i]=0;removed++}
 return {grid:g,rooted:tail,removed};
}
const SITES={
 'West arrival': [145,653], 'Habitat canteen': [201,555], 'Archive overlook': [395,464],
 'Rover repair': [576,665], 'West transmitter': [119,348], 'West drill relay':[620,670],
 'Cleft north': [802,345], 'Harp upper': [1020,525], 'Harp western console':[942,577],
 'Harp east console':[1123,579], 'Harp base':[1096,827], 'Cleft lower': [1170,745],
 'East observation': [1624,352], 'Spectrograph bay': [1698,440], 'East medical': [1663,530],
 'East storage': [1814,609], 'East boarding': [1963,602], 'West archive': [350,872],
 'Tectonic corridor': [1107,910], 'Cryobank': [1618,877], 'East relief shaft': [1718,780]
};
function rectangles(g){const edits=[];let active=new Map();for(let y=0;y<HEIGHT;y++){
 let next=new Map();let x=0;while(x<WIDTH){let m=g[y*WIDTH+x];if(m===0){x++;continue;}let sx=x;while(x<WIDTH&&g[y*WIDTH+x]===m)x++;let key=sx+','+(x-sx)+','+m, old=active.get(key);if(old){old[3]++;next.set(key,old)}else{let rr=[sx,y,x-sx,1,m];edits.push(rr);next.set(key,rr)}}active=next}return edits}
function countReach(g,w,h,spawn,sites){const W=WIDTH,H=HEIGHT,N=W*H;let sat=new Int32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){row+=g[(y-1)*W+x-1]?1:0;sat[y*(W+1)+x]=sat[(y-1)*(W+1)+x]+row}}
 const free=new Uint8Array(N),rx=Math.floor(w/2),ry=Math.floor(h/2);
 for(let y=ry;y<H-(h-ry-1);y++)for(let x=rx;x<W-(w-rx-1);x++){
 let l=x-rx,t=y-ry,r=l+w,b=t+h;let sum=sat[b*(W+1)+r]-sat[t*(W+1)+r]-sat[b*(W+1)+l]+sat[t*(W+1)+l];if(sum===0)free[y*W+x]=1}
 const [sx,sy]=spawn;let q=new Int32Array(N),h0=0,t0=0,seen=new Uint8Array(N),idx=sy*W+sx;if(!free[idx])return {size:[w,h],reached:0,bad:['spawn obstructed'],centres:0};seen[idx]=1;q[t0++]=idx;
 while(h0<t0){let p=q[h0++],x=p%W;for(let v of [x>0?p-1:-1,x+1<W?p+1:-1,p>=W?p-W:-1,p<N-W?p+W:-1])if(v>=0&&free[v]&&!seen[v]){seen[v]=1;q[t0++]=v}}
 const bad=Object.entries(sites).filter(([n,[x,y]])=>!seen[y*W+x]).map(([n])=>n);return {size:[w,h],reached:Object.keys(sites).length-bad.length,bad,centres:t0,seen,free};
}
module.exports={WIDTH,HEIGHT,SEED,M,buildPlane,SITES,rectangles,countReach};
