'use strict';
const W=2048,H=1024,N=W*H,SEED=638656721;
const M={"E":0,"S":49,"C":58,"T":62,"B":100,"O":101,"Z":113,"I":117,"Q":122};
const P={"0":[8,12,21],"49":[76,92,111],"58":[137,149,163],"62":[178,195,209],"100":[45,57,75],"101":[27,35,53],"113":[218,174,87],"117":[103,124,142],"122":[242,231,196]};
const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const SITES=[["West slipway start",142,636],["Induction accelerators",346,634],["Forged weights outbound",655,635],["Resonance atrium outbound",1041,634],["Separator outbound",1459,635],["East dry-release",1844,635],["East reversal shaft",1912,505],["East upper capture",1886,373],["Separator westbound",1539,374],["Array return",1160,373],["Foundry return",723,374],["Western deceleration",336,372],["West transition",136,500],["Finish west low",156,635],["West flight control",245,118],["Resonance monitor",1032,117],["East trajectory control",1778,120],["Weight-smith service",583,927],["Central drive room",1020,923],["Cold separator service",1498,920],["East recovery workshop",1840,930]];
const CROPS=[["overview.png",0,0,2048,1024],["01-west-slipway.png",0,60,432,710],["02-foundry-weights.png",396,173,446,711],["03-resonance-atrium.png",818,124,495,806],["04-separator-plant.png",1283,154,438,742],["05-east-turntower.png",1696,100,352,854],["06-undercroft-rooms.png",761,701,620,323]];
function generate(){
 const g=new Uint8Array(N);let seed=SEED>>>0;function rand(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
 const lim=(x,a,b)=>Math.max(a,Math.min(b,x));
 function box(x,y,w,h,v,paint=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!paint||g[i])g[i]=v;}}
 function beam(ax,ay,bx,by,r,v,paint=false){let dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=lim(((x-ax)*dx+(y-ay)*dy)/len,0,1),ux=x-ax-t*dx,uy=y-ay-t*dy;if(ux*ux+uy*uy<=r*r){let i=y*W+x;if(!paint||g[i])g[i]=v;}}}
 function oval(cx,cy,rx,ry,v){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++){let d=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));box(cx-d,y,2*d+1,1,v);}}
 function arc(cx,cy,rx,ry,a,b,th,v){let st=Math.ceil((b-a)*Math.max(rx,ry)/3);for(let k=1;k<=st;k++){let x=a+(b-a)*(k-1)/st,z=a+(b-a)*k/st;beam(cx+rx*Math.cos(x),cy+ry*Math.sin(x),cx+rx*Math.cos(z),cy+ry*Math.sin(z),th,v);}}
 const roof=new Int16Array(W),floor=new Int16Array(W);
 for(let x=0;x<W;x++){let hill=Math.exp(-(((x-1030)/250)**2));roof[x]=Math.round(170+10*Math.sin(x/114)+8*Math.sin(x/39)+30*hill);floor[x]=Math.round(840+11*Math.sin(x/122)-32*hill);for(let y=0;y<roof[x];y++)g[y*W+x]=y<24?M.S:y>=roof[x]-16?M.T:((Math.floor(y/79)%2)?M.O:M.B);for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+14?M.C:(y>976&&Math.floor(x/200)%2?M.O:M.B);}
 for(let [x,y,w,h] of [[126,70,233,154],[904,64,255,157],[1648,66,251,158]]){box(x,y,w,h,0);box(x+12,y+17,w-24,10,M.T);box(x+17,y+h-42,52,17,M.C);box(x+w-83,y+h-49,56,25,M.I);box(x+26,y+27,13,56,M.I);box(x+w-40,y+34,10,50,M.Q);box(x+30,y+h-66,36,12,M.Z,true);}
 for(let [x,y,w,h] of [[405,854,329,140],[899,850,270,144],[1330,862,297,134],[1715,850,278,148]]){box(x,y,w,h,0);box(x+13,y+h-19,w-26,12,M.C);box(x+15,y+17,15,80,M.T);box(x+w-30,y+14,15,82,M.T);}
 beam(43,roof[43]-10,70,309,16,M.T);beam(70,309,127,325,9,M.Q);beam(381,roof[381]-8,345,309,17,M.C);beam(345,309,300,292,8,M.Z);box(172,267,143,17,M.I);beam(184,roof[184]-8,180,274,12,M.T);beam(301,roof[301]-7,301,278,10,M.T);for(let i=0;i<5;i++)box(192+i*24,269,11,13,i%2?M.Z:M.Q,true);
 beam(43,floor[43]+3,77,725,16,M.C);beam(77,725,121,747,9,M.Z);beam(371,floor[371]+3,348,726,17,M.T);beam(348,726,323,753,9,M.Q);box(184,769,158,23,M.I);beam(203,floor[203]-3,207,772,14,M.C);beam(321,floor[321]-4,317,780,13,M.C);
 for(let [x,drop,shift] of [[478,109,72],[612,93,-46],[773,123,51]]){let y=roof[x];beam(x,y-8,x+shift/3,y+drop,15,M.I);beam(x+shift/3,y+drop,x+shift,y+drop-14,11,M.T);beam(x+shift,y+drop-14,x+shift+(shift>0?27:-24),y+drop-34,7,M.Z);box(x+8,y+35,13,38,M.Q,true);}
 for(let [x,w,ht] of [[420,96,98],[610,65,88],[731,94,111]]){let y=floor[x];beam(x+10,y-8,x+20,y-ht,18,M.C);beam(x+w-15,y-8,x+w-22,y-ht-10,17,M.T);box(x+21,y-ht-17,w-43,24,M.I);box(x+23,y-ht-12,w-49,8,M.Z,true);}
 arc(1038,205,190,111,0,Math.PI,13,M.T);arc(1038,205,160,78,.15,Math.PI-.15,5,M.Q);beam(852,roof[852]-5,849,205,19,M.C);beam(1225,roof[1225]-5,1227,205,20,M.C);for(let k=0;k<7;k++){let a=.27+k*(Math.PI-.54)/6;beam(1038+179*Math.cos(a),205+97*Math.sin(a),1038+171*Math.cos(a),205+78*Math.sin(a),5,M.Z);}
 arc(1038,796,190,94,Math.PI,2*Math.PI,14,M.C);arc(1038,796,158,63,Math.PI+.12,2*Math.PI-.12,5,M.I);beam(850,floor[850]+4,849,796,19,M.C);beam(1227,floor[1227]+3,1228,796,19,M.C);box(963,261,155,18,M.T);box(972,265,138,8,M.I,true);box(967,757,142,19,M.I);box(976,762,120,6,M.Z,true);
 for(let [x,dx,drop] of [[1354,-35,109],[1480,45,91],[1605,-22,120]]){let y=roof[x];beam(x,y-8,x+dx,y+drop,15,M.T);beam(x+dx,y+drop,x+dx+39,y+drop-13,8,M.Z);beam(x+dx+18,y+drop-27,x+dx+16,y+drop-4,5,M.Q);}
 for(let [x,w,ht] of [[1325,84,95],[1450,104,128],[1599,66,87]]){let f=floor[x];beam(x+14,f+6,x+24,f-ht,17,M.C);beam(x+w-16,f+6,x+w-22,f-ht-7,16,M.I);box(x+20,f-ht-16,w-40,23,M.T);box(x+23,f-ht-12,w-46,7,M.Z,true);}
 beam(1718,roof[1718]-7,1751,303,17,M.T);beam(1751,303,1792,323,8,M.Q);beam(2028,roof[2028]-9,1986,321,17,M.C);beam(1986,321,1949,301,8,M.Z);beam(1711,floor[1711]+6,1741,731,17,M.C);beam(1741,731,1776,748,8,M.Z);beam(2021,floor[2021]+5,1983,722,17,M.C);beam(1983,722,1941,748,8,M.Q);box(1800,779,107,21,M.T);beam(1812,floor[1812]-5,1815,779,13,M.C);beam(1892,floor[1892]-4,1891,779,12,M.C);
 for(let [x,y,w,h,k] of [[405,854,329,140,0],[899,850,270,144,1],[1330,862,297,134,2],[1715,850,278,148,3]]){let b=y+h-19;box(x+38,b-47,46,47,M.I);box(x+48,b-62,16,15,k%2?M.Q:M.Z);box(x+w-99,b-66,28,66,M.T);box(x+w-71,b-29,44,29,M.I);box(x+w-66,b-20,31,8,M.Q,true);if(k===1){oval(x+114,b-34,30,23,M.T);oval(x+114,b-34,18,10,0);}if(k===2){for(let j=0;j<3;j++)box(x+118+j*28,b-60+j*10,16,60-j*10,M.T);}if(k===3)beam(x+95,b-3,x+146,b-49,9,M.Z);}
 for(let x of [443,810,1277,1650]){let y=roof[x];beam(x,y-7,x+24,y+70,9,M.T);beam(x+24,y+70,x+40,y+52,6,M.Z);}
 for(let x of [1743,1320,824,415]){let y=floor[x];beam(x,y+4,x-24,y-75,10,M.C);beam(x-24,y-75,x-40,y-57,6,M.Q);}
 for(let cx of [245,1032,1778])box(cx-43,130,86,274,0);
 for(let [cx,y,ww,hh] of [[583,638,94,326],[1020,642,99,325],[1498,638,100,327],[1840,634,100,338]])box(cx-ww/2,y,ww,hh,0);
 for(let [x,y,w,h] of [[405,854,329,140],[899,850,270,144],[1330,862,297,134],[1715,850,278,148]]){box(x+17,y+h-39,33,13,M.T);box(x+w-70,y+h-41,38,15,M.I);}
 for(let x=48;x<2017;x+=82){let y=roof[x];box(x,y-10,26,7,x<400?M.Q:x<820?M.Z:x<1290?M.Q:x<1700?M.Z:M.Q,true);}
 for(let x=56;x<2010;x+=78){let y=floor[x];box(x,y+3,27,8,x<410?M.Z:x<827?M.Q:x<1310?M.Z:x<1710?M.Q:M.Z,true);}
 for(let i=0;i<14;i++){let x=160+(rand()*1720|0);box(x,floor[x]+6,13,6,i%2?M.Q:M.Z,true);}

 // R2 independently requested physically rooted and functionally differentiated gear.
 box(151,62,13,143,M.I);box(166,166,46,25,M.T);box(181,142,19,25,M.Z);
 box(166,197,35,9,M.Q);box(326,61,14,147,M.I);box(287,170,30,24,M.T);
 beam(339,184,337,247,7,M.Z);box(310,250,32,12,M.Q);
 for(let [x,len,side] of [[496,44,-1],[634,58,1],[755,39,-1]]){
   let y=roof[x];beam(x,y-6,x+side*12,y+len,11,M.I);
   box(x+side*12-13,y+len-7,26,20,M.T);
   beam(x+side*12,y+len+14,x+side*28,y+len+31,5,M.Z);
 }
 box(490,790,77,14,M.T);beam(510,floor[510]-4,508,794,13,M.C);
 box(512,784,30,10,M.Q);box(676,781,72,17,M.T);
 beam(704,floor[704]-3,703,786,14,M.C);
 beam(858,789,894,839,13,M.T);beam(1218,785,1172,842,13,M.I);
 box(850,812,45,16,M.Z);box(1169,818,53,14,M.Q);
 beam(876,822,886,862,9,M.I);beam(1203,823,1199,857,9,M.I);
 for(let [x,w,h] of [[1341,58,42],[1464,76,64],[1591,49,52]]){
   let y=roof[x];box(x+4,y-4,w-8,13,M.T);
   beam(x+13,y,x+13,y+h,9,M.I);beam(x+w-14,y,x+w-14,y+h+12,9,M.I);
   box(x+13,y+h-8,w-27,17,M.Z);
 }
 box(1374,790,59,19,M.I);beam(1399,floor[1399]-5,1396,800,13,M.C);
 box(1481,768,75,21,M.T);beam(1510,floor[1510]-4,1510,778,12,M.C);
 box(1601,792,58,16,M.Z);beam(1615,floor[1615]-5,1615,801,12,M.C);
 box(433,981,56,21,M.C);box(443,954,30,27,M.T);
 beam(481,994,510,958,9,M.I);box(497,955,34,11,M.Z);
 box(636,986,64,19,M.C);box(646,966,31,20,M.I);box(657,958,17,8,M.Q);
 box(922,979,60,23,M.C);box(935,949,31,30,M.T);
 box(1090,982,54,21,M.C);box(1098,956,33,26,M.I);box(1110,950,14,12,M.Z);
 box(1363,983,61,22,M.C);
 for(let j=0;j<3;j++)box(1374+j*14,963+j*3,10,20-j*3,M.T);
 box(1552,976,45,27,M.C);box(1558,953,33,23,M.I);box(1563,947,14,8,M.Q);
 box(1743,979,58,23,M.C);beam(1761,987,1788,953,8,M.I);
 box(1774,949,33,14,M.Z);box(1933,978,34,24,M.C);
 box(1937,950,25,28,M.I);
 box(1980,257,19,22,M.Z,true);box(1768,245,24,19,M.Q,true);
 box(203,804,37,14,M.Q,true);box(338,803,36,15,M.Z,true);

 let seen=new Uint8Array(N),q=new Int32Array(N),a=0,b=0;function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}return {g,grounded:b,discarded};
}
function encodeRects(g){let rects=[],last=new Map();for(let y=0;y<H;y++){let cur=new Map();for(let x=0;x<W;){let v=g[y*W+x],x0=x++;while(x<W&&g[y*W+x]===v)x++;if(!v)continue;let key=x0+":"+(x-x0)+":"+v,r=last.get(key);if(r)r[3]++;else{r=[x0,y,x-x0,1,v];rects.push(r);}cur.set(key,r);}last=cur;}return {edits:rects,visits:rects.reduce((s,r)=>s+r[2]*r[3],0)};}
function reach(g,w,h){let stride=W+1,sum=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){row+=(g[(y-1)*W+x-1]!==0)?1:0;sum[y*stride+x]=row+sum[(y-1)*stride+x];}}let ok=new Uint8Array(N),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++)for(let x=l;x<W-r;x++){let aa=(y-t)*stride,bb=(y+b+1)*stride,x0=x-l,x1=x+r+1;if(sum[bb+x1]-sum[aa+x1]-sum[bb+x0]+sum[aa+x0]===0)ok[y*W+x]=1;}let seen=new Uint8Array(N),q=new Int32Array(N),source=SITES[0][2]*W+SITES[0][1];if(!ok[source])throw Error("blocked spawn "+w+"x"+h);let a=0,bq=1;q[0]=source;seen[source]=1;while(a<bq){let i=q[a++],x=i%W;if(x&&ok[i-1]&&!seen[i-1]){q[bq++]=i-1;seen[i-1]=1;}if(x<W-1&&ok[i+1]&&!seen[i+1]){q[bq++]=i+1;seen[i+1]=1;}if(i>=W&&ok[i-W]&&!seen[i-W]){q[bq++]=i-W;seen[i-W]=1;}if(i<N-W&&ok[i+W]&&!seen[i+W]){q[bq++]=i+W;seen[i+W]=1;}}return {connected:bq,missing:SITES.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0])};}
module.exports={W,H,N,SEED,M,P,MODEL,POLICY,SITES,CROPS,generate,encodeRects,reach};
