'use strict';
// WORLDGROUP MERIDIAN 06, original ground-dominant three-turnback calibration racetrack.
// Orthographic material-cell side elevation; no prior donor geometry copied.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={iron:58,plate:62,frame:49,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 function chain(a,r,m){for(let i=1;i<a.length;i++)line(a[i-1][0],a[i-1][1],a[i][0],a[i][1],r,m);}
 const A=[[105,493],[292,542],[470,623],[654,593],[871,580],[1056,603],[1237,553],[1445,574],[1660,608],[1820,583],[1916,660]];
 const B=[[1890,715],[1770,755],[1601,728],[1382,721],[1170,754],[981,703],[777,735],[586,751],[388,706],[248,753]];
 const C=[[265,819],[422,842],[644,872],[862,834],[1070,874],[1231,835],[1468,854],[1742,829],[1940,838]];
 // Different-height exterior earthwork with unequal pitline terraces: entire terrain rooted to bottom.
 for(let x=0;x<W;x++){let surface=Math.round(504+31*Math.sin(x/178)+16*Math.sin(x/49)+(x>700&&x<1090?24:0)+(x>1460&&x<1790?35:0));
 for(let y=surface;y<H;y++)g[y*W+x]=(y<surface+12)?M.plate:(y%143<5?M.dark:M.rock);}
 rect(0,470,27,554,M.rock);rect(2021,470,27,554,M.rock);
 // Three unlike, real Midge-clear turnback galleries. They are geometry, not painted guide-lines.
 chain(A,49,0);chain(B,47,0);chain(C,46,0);
 chain([[1916,660],[1900,689],[1890,715]],50,0); // eastern deep S-turn
 chain([[248,753],[220,786],[265,819]],49,0); // western tight return
 // Two nonmirrored high-low bypasses; different step and shaft styles.
 chain([[654,593],[703,643],[777,735]],47,0);
 chain([[1445,574],[1386,632],[1382,721]],45,0);
 chain([[981,703],[1022,788],[1070,874]],45,0);
 chain([[1770,755],[1738,788],[1742,829]],44,0);
 // Higher hairpin calibration rejoin loop creates a third optional turnback, not parallel corridors.
 chain([[871,580],[900,498],[1080,473],[1237,553]],45,0);
 // Recoverable damaged spur, deliberately ending in sealed ground; no new exit beyond endpoint.
 chain([[1468,854],[1422,928],[1471,969]],43,0);
 // Floor/roof guide structures sit at gallery margins, leaving actual >31x27 centre clearance.
 for(const [path,off] of [[A,55],[B,54],[C,53]])for(let i=0;i<path.length-1;i++){let a=path[i],b=path[i+1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;line(mx-17,my+off,mx+17,my+off,3,M.iron);line(mx-10,my-off,mx+10,my-off,2,M.steel);}
 // Exterior floor-rooted slalom calibration towers: deliberately small, not monumental central machinery.
 for(let [x,y,h] of [[190,489,83],[528,517,115],[835,489,73],[1194,492,110],[1548,531,73],[1871,501,98]]){
  rect(x,y-h,13,h,M.frame);rect(x-26,y-h,65,13,M.plate);rect(x+2,y-h+26,10,10,M.amber);
 }
 // Each of four pit workshops is a genuine carved room connected to the C gallery.
 const pits=[[215,903,178,101,309],[618,910,198,101,720],[1129,910,210,101,1226],[1633,897,236,114,1720]];
 for(let [x,y,w,h,entry] of pits){rect(x,y,w,h,0);line(entry,850,entry,y+18,44,0);
  rect(x+15,y+19,14,27,M.frame);rect(x+40,y+h-30,28,12,M.iron);
  rect(x+w-47,y+h-29,31,13,M.plate);rect(x+w-35,y+22,12,12,M.amber);
  rect(x+16,y+h-16,w-32,8,M.steel);
 }
 // Distinct physically inhabited calibration / service workfaces.
 rect(79,447,139,18,M.frame);rect(106,423,49,24,M.steel);rect(174,427,18,19,M.amber);
 for(let j=0;j<4;j++){let x=322+j*34;rect(x,667,23,8,M.iron);rect(x+5,659,12,8,M.ivory);}
 for(let j=0;j<5;j++){let x=930+j*38;rect(x,812+(j%2)*7,21,9,M.frame);rect(x+6,806+(j%2)*7,9,6,M.amber);}
 for(let j=0;j<4;j++){let x=1511+j*53;rect(x,789,32,10,M.steel);rect(x+9,781,16,8,M.ivory);}
 // Right rescue crane is a low asymmetrical side-installation grounded in the pitline (not a central rotor).
 line(1962,963,1962,802,11,M.frame);line(1962,803,1870,780,8,M.plate);rect(1886,790,13,15,M.amber);
 // Damaged-track markings physically root into surrounding rock.
 line(1496,1009,1511,965,7,M.iron);line(1535,1021,1519,975,6,M.steel);
 for(let [x,y] of [[271,895],[710,897],[1237,894],[1721,891]]){rect(x-37,y,74,9,M.plate);rect(x+22,y+1,9,18,M.amber);}
 // Repair strokes around junctions to guarantee conservative body clearance; keep central tracks legible.
 chain(A,43,0);chain(B,43,0);chain(C,42,0);
 chain([[654,593],[703,643],[777,735]],42,0);chain([[1445,574],[1386,632],[1382,721]],42,0);
 chain([[981,703],[1022,788],[1070,874]],41,0);chain([[1770,755],[1738,788],[1742,829]],41,0);
 // Intentional physical start and finish relief from the western/righthand exterior, connected to the course.
 chain([[80,447],[105,493]],43,0);chain([[1940,838],[1982,798]],43,0);
 // Two unequal inhabited load-path piers and two compact terrace ties anchor otherwise detached terrace wedges.
// They change real travel: pilots use aboveground clearance or the braided recovery crossovers.
 
 
 line(1650,675,1650,1015,10,M.frame);
 line(610,808,610,1015,9,M.iron);
 
 // Pitline access is a geometric opening, not a label: clear service-channel throats.
 for(let [x,y,w,h,entry] of pits)line(entry,846,entry,y+45,36,0);
 line(1330,650,1440,650,8,M.frame); // side-rooted load bridge from the loop island into the east escarpment
 line(840,520,845,655,7,M.frame); // single protected crest buttress, alternate paths retained
 const sites=[
 ["West staging",105,493],["Pulse calibration rise",292,542],["First crest",470,623],
 ["Western inner rejoin",654,593],["Midline diagnostic",871,580],["High hairpin apex",1080,473],
 ["Severable crest",1056,603],["High apex return",1237,553],["East brake marker",1660,608],["East U turnaround",1916,660],
 ["East double-back",1770,755],["East pit approach",1601,728],["Second-grade instrument",1382,721],
 ["Middle B return",981,703],["West cutback",388,706],["West U turnaround",248,753],
 ["Deep lap entry",422,842],["Deep camber check",862,834],["Third recovery rejoin",1070,874],
 ["Eastern deep run",1742,829],["Eastern release",1940,838],
 ["West pit workshop",300,944],["West mechanics",708,947],["Mid traction pit",1226,943],["East rescue pit",1720,943],
 ["Damaged recovery spur",1471,969],["Finish",1982,798]
 ];
 const obs=[1012,552,89,97]; // literal material hard block placed across the main crest approach
 const crops=[["overview.png",0,0,W,H],["01-west-launch-cutback.png",30,325,615,562],
 ["02-west-pits-and-first-turn.png",188,589,663,435],["03-crest-calibration-loop.png",743,359,649,525],
 ["04-east-hairpin-and-pitline.png",1332,400,709,612],["05-deep-return-pits.png",550,731,962,291],
 ["06-damaged-spur-and-rescue.png",1272,706,760,318]];
 // Prune all physically unsupported material islands; do not invent floating supports.
 const attached=new Uint8Array(N),q=new Int32Array(N);let tail=0,head=0;
 function push(z){if(g[z]&&!attached[z]){attached[z]=1;q[tail++]=z;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(head<tail){let z=q[head++],x=z%W;if(x)push(z-1);if(x<W-1)push(z+1);if(z>=W)push(z-W);if(z+W<N)push(z+W);}
 let detached=0;for(let i=0;i<N;i++)if(g[i]&&!attached[i]){g[i]=0;detached++;}
 const histogram={};for(let i=0;i<N;i++)histogram[g[i]]=(histogram[g[i]]||0)+1;
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],s=x;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else{entry=[s,y,x-s,1,m];edits.push(entry);}next.set(key,entry);visits+=x-s;}active.clear();for(let [k,v]of next)active.set(k,v);}
 function reach(wh,block){const [ww,hh]=wh,rx=(ww-1)/2,ry=(hh-1)/2,stride=W+1,P=new Int32Array((W+1)*(H+1));
 for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=g[y*W+x]!==0;if(block&&x>=block[0]&&x<block[0]+block[2]&&y>=block[1]&&y<block[1]+block[3])solid=true;row+=solid?1:0;P[(y+1)*stride+x+1]=P[y*stride+x+1]+row;}}
 let open=new Uint8Array(N);for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let l=x-rx,r=x+rx+1,t=y-ry,b=y+ry+1;if(P[b*stride+r]-P[t*stride+r]-P[b*stride+l]+P[t*stride+l]===0)open[y*W+x]=1;}
 let spawn=sites[0][2]*W+sites[0][1];if(!open[spawn])throw Error("BLOCKED SPAWN "+wh);
 let seen=new Uint8Array(N),queue=new Int32Array(N),hd=0,tl=0;queue[tl++]=spawn;seen[spawn]=1;
 while(hd<tl){let z=queue[hd++],x=z%W;for(let v of [x>0?z-1:-1,x<W-1?z+1:-1,z>=W?z-W:-1,z+W<N?z+W:-1])if(v>=0&&open[v]&&!seen[v]){seen[v]=1;queue[tl++]=v;}}
 let missing=sites.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0]);return {hull:wh,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:tl};
 }
 const clear={};for(let s of [[19,15],[23,19],[31,27]])clear[s.join("x")]=reach(s,null);
 const blocked=reach([31,27],obs);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,setup};
}
module.exports={buildWorld};
