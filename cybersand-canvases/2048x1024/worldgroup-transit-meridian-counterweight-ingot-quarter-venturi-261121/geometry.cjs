'use strict';
// ORIGINAL MERIDIAN SIBLING 05. Compact inhabited nested Venturi gateworks, not a mast or wheel remake.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={iron:58,plate:62,frame:49,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const roof=new Int16Array(W),floor=new Int16Array(W);
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("INVALID RECT "+[x,y,w,h,m]);if(m!==0&&!palette[m])throw Error("BAD MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den));let xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 function poly(pts,m){let y0=Math.max(0,Math.floor(Math.min(...pts.map(p=>p[1])))),y1=Math.min(H,Math.ceil(Math.max(...pts.map(p=>p[1]))));for(let y=y0;y<y1;y++){let xs=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2){let a=Math.max(0,Math.ceil(xs[j])),b=Math.min(W,Math.floor(xs[j+1]));if(b>a)g.fill(m,y*W+a,y*W+b);}}}
 // Enclosed dry pressureworks and roof massif, not another open-air mast forest.
 for(let x=0;x<W;x++){roof[x]=202+Math.round(9*Math.sin(x/73)+7*Math.sin(x/29));floor[x]=861+Math.round(9*Math.sin(x/113)+4*Math.sin(x/31));for(let y=0;y<roof[x];y++)g[y*W+x]=y<22?M.frame:y>roof[x]-13?M.plate:(y%127<6?M.dark:M.rock);for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+14?M.iron:((y%91<5)?M.dark:M.rock);}
 rect(0,188,27,836,M.rock);rect(2021,210,27,814,M.rock);
 // Four dense roof-vault settlements excavated in continuous rock.
 const controls=[[100,51,215,123,207],[552,40,222,135,658],[1303,43,202,128,1404],[1740,52,215,119,1833]];
 for(let [x,y,w,h,mouth] of controls){rect(x,y,w,h,0);rect(mouth-42,y+83,84,247,0);rect(x+16,y+14,22,44,M.steel);rect(x+w-53,y+18,19,36,M.frame);rect(x+18,y+h-29,45,9,M.plate);rect(x+w-79,y+h-28,48,8,M.iron);}
 for(let [x,y,w] of [[382,207,95],[820,197,88],[1094,209,106],[1501,201,99]]){rect(x,y,w,27,M.frame);rect(x+9,y+29,w-18,12,M.steel);for(let j=0;j<4;j++)rect(x+14+j*19,y+39,10,19,j%2?M.amber:M.plate);}
 // Lower dense city blocks divided by open freight courts, rooted to floor terrain.
 const quarters=[[70,638,302,227],[399,707,253,167],[1412,696,252,170],[1700,642,276,224]];
 for(let qi=0;qi<quarters.length;qi++){let [x,y,w,h]=quarters[qi];rect(x,y,w,h,M.frame);rect(x+12,y+14,w-24,h-28,0);
 for(let j=0;j<6;j++){let xx=x+20+j*Math.floor((w-47)/6),hh=31+((j*19+qi*11)%44);rect(xx,y+h-14-hh,22,hh,M.iron);rect(xx+4,y+h-18-hh,14,8,M.amber);}
 rect(x+43,y+48,w-86,87,0);rect(x+Math.floor(w/2)-39,y-14,78,77,0);
 rect(x+6,y+9,12,h-28,M.steel);rect(x+w-19,y+9,12,h-28,M.steel);}
 for(let [x,y,w] of [[91,580,239],[432,642,176],[1449,627,184],[1750,580,193]]){line(x,y,x+w,y,10,M.plate);for(let j=0;j<4;j++){let xx=x+13+j*Math.floor((w-27)/4);rect(xx,y+9,13,45,M.frame);rect(xx+3,y+20,7,15,M.amber);}}
 // Huge opposing grounded Venturi compression jaws, rather than radial braking machinery.
 poly([[733,roof[733]-2],[945,roof[945]-2],[983,371],[933,401],[810,320]],M.rock);
 poly([[1112,roof[1112]-2],[1278,roof[1278]-2],[1249,378],[1205,410],[1120,321]],M.rock);
 for(let [x,y,r] of [[811,306,7],[921,349,5],[1140,310,6],[1241,342,5]])line(x,y,x+36,y+19,r,M.plate);
 poly([[764,floor[764]+10],[967,floor[967]+10],[953,680],[889,631],[831,736]],M.frame);
 poly([[1055,floor[1055]+10],[1310,floor[1310]+10],[1196,650],[1110,704]],M.frame);
 for(let j=0;j<8;j++){let x=817+j*17;rect(x,730+(j%3)*12,10,32+(j%2)*18,j%2?M.steel:M.iron);}
 for(let j=0;j<7;j++){let x=1100+j*21;rect(x,734+(j%2)*9,13,22+(j%3)*12,j%2?M.plate:M.steel);}
 line(886,687,1017,643,14,M.steel);line(1178,666,1274,715,13,M.iron);
 for(let [x,y] of [[886,687],[1169,670]]){rect(x-12,y,24,98,M.frame);rect(x-21,y+92,42,15,M.iron);}
 line(953,213,994,315,12,M.frame);line(1111,207,1082,318,13,M.frame);
 rect(987,292,112,20,M.plate);rect(1002,309,82,12,M.amber);rect(1018,323,52,28,M.frame);rect(1028,330,31,12,M.steel);
 // Machinery contracts differ across districts: west slides, east cylinders, lower grounded shops.
 for(let j=0;j<3;j++){let x=128+j*72;line(x,638,x+37,553-j*11,11,M.iron);rect(x+30,545-j*11,43,13,M.steel);rect(x+36,541-j*11,15,8,M.amber);}
 for(let j=0;j<4;j++){let x=1753+j*44;rect(x,607-j%2*18,27,17,M.steel);rect(x+7,602-j%2*18,13,8,M.ivory);line(x+14,621-j%2*18,x+31,642,7,M.iron);}
 const bays=[[93,894,296,91,236],[474,897,280,86,618],[1254,897,254,88,1382],[1638,893,292,90,1814]];
 for(let [x,y,w,h,entry] of bays){rect(x,y,w,h,0);rect(entry-43,785,86,y+26-785,0);rect(x+14,y+h-14,w-28,12,M.iron);rect(x+16,y+18,18,12,M.amber);rect(x+w-43,y+17,24,11,M.ivory);}
 for(let j=0;j<4;j++){let x=118+j*51;rect(x,951,36,18,M.frame);line(x+14,948,x+28,918-j%2*10,7,M.steel);}
 for(let j=0;j<5;j++){let x=491+j*45;rect(x,956,27,13,M.iron);rect(x+7,926+(j%3)*7,13,29,M.amber);}
 for(let j=0;j<4;j++){let x=1276+j*50;rect(x,958,26,17,M.frame);line(x+8,953,x+21,918+(j%2)*8,8,M.steel);}
 for(let j=0;j<4;j++){let x=1660+j*63;rect(x,953,39,19,M.frame);rect(x+7,927+j%2*9,24,26,M.iron);rect(x+14,931+j%2*9,10,11,M.amber);}
 for(let [a,b,y] of [[405,812,780],[1300,1644,788]]){line(a,y,b,y,7,M.steel);for(let x=a+20;x<b-20;x+=66){rect(x,y+8,18,10,M.ivory);}}
 for(let [x,y] of [[442,245],[1340,247],[1870,238]]){line(x,y,x+55,y+58,8,M.frame);rect(x+43,y+48,42,14,M.amber);}
 // Reopen actual 31x27 hull routes after settling details; no site relocation exemptions.
 for(let [x,y,w,h,mouth] of controls){rect(mouth-36,y+93,72,205,0);rect(mouth-38,y+62,76,65,0);}
 for(let [x,y,w,h,entry] of bays){rect(entry-34,773,68,y+39-773,0);rect(entry-33,y,66,35,0);}
 // Restore low-to-high vertical relief in the west nested settlement, a physically open 74px shaft.
 rect(199,430,74,518,0);
 rect(658,632,100,70,0);rect(1327,563,65,90,0);rect(1616,541,67,70,0);
 rect(1956,738,51,103,0);
 const sites=[
 ["West launch",111,493],["Pressure slide inspection",244,494],["West shop street",470,557],
 ["West roof operator",215,111],["West high service",614,118],["West freight court",534,603],
 ["Venturi west lip",713,449],["Upper throat lookout",928,452],["High vent interlock",1056,469],
 ["Venturi east lip",1351,462],["East switching court",1504,509],["East control",1415,108],
 ["East roof dispatcher",1838,117],["East cylinder yard",1813,489],["East launch gate",1944,506],
 ["West low recovery",701,743],["Under-throat recovery",1033,779],["East low return",1350,736],
 ["East finish",1948,771],["West service bay",239,920],["Middle service bay",625,922],
 ["East gear bay",1382,922],["East recovery shop",1822,922]
 ];
 const obs=[1005,425,102,91];
 const crops=[["overview.png",0,0,W,H],["01-west-mixed-use-press.png",38,246,542,610],["02-roof-inspection-vaults.png",488,8,1124,408],["03-venturi-lockworks.png",689,193,657,630],["04-east-industrial-quarter.png",1300,269,706,592],["05-underworks-recovery.png",77,739,1876,283],["06-interlock-closure.png",870,329,385,311]];
 const attached=new Uint8Array(N),q=new Int32Array(N);let tail=0,head=0;
 function push(z){if(g[z]&&!attached[z]){attached[z]=1;q[tail++]=z;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(head<tail){let z=q[head++],x=z%W;if(x)push(z-1);if(x<W-1)push(z+1);if(z>=W)push(z-W);if(z+W<N)push(z+W);}
 let detached=0;for(let i=0;i<N;i++)if(g[i]&&!attached[i]){g[i]=0;detached++;}
 const histogram={};for(let i=0;i<N;i++)histogram[g[i]]=(histogram[g[i]]||0)+1;
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],s=x;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else{entry=[s,y,x-s,1,m];edits.push(entry);}next.set(key,entry);visits+=x-s;}active.clear();for(let [k,v]of next)active.set(k,v);}
 function reach(wh,block){let [ww,hh]=wh,rx=(ww-1)/2,ry=(hh-1)/2,stride=W+1,P=new Int32Array((W+1)*(H+1));
 for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=g[y*W+x]!==0;if(block&&x>=block[0]&&x<block[0]+block[2]&&y>=block[1]&&y<block[1]+block[3])solid=true;row+=solid?1:0;P[(y+1)*stride+x+1]=P[y*stride+x+1]+row;}}
 let open=new Uint8Array(N);for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let l=x-rx,r=x+rx+1,t=y-ry,b=y+ry+1;if(P[b*stride+r]-P[t*stride+r]-P[b*stride+l]+P[t*stride+l]===0)open[y*W+x]=1;}
 let spawn=sites[0][2]*W+sites[0][1];if(!open[spawn])throw Error("BLOCKED SPAWN "+wh);
 let seen=new Uint8Array(N),queue=new Int32Array(N),head=0,tail=0;queue[tail++]=spawn;seen[spawn]=1;
 while(head<tail){let z=queue[head++],x=z%W;for(let v of [x>0?z-1:-1,x<W-1?z+1:-1,z>=W?z-W:-1,z+W<N?z+W:-1])if(v>=0&&open[v]&&!seen[v]){seen[v]=1;queue[tail++]=v;}}
 let missing=sites.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0]);return {hull:wh,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:tail};
 }
 const clear={};for(let s of [[19,15],[23,19],[31,27]])clear[s.join("x")]=reach(s,null);
 const blocked=reach([31,27],obs);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,world_policy:POLICY};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,setup};
}
module.exports={buildWorld};
