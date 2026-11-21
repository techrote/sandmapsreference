'use strict';
// Switchglass Civic Transit 01: interlocking passenger borough.
// New geometry: four *inhabited* supported transit precincts, bridges and an entered undercity.
// Exact 2048x1024 orthographic CyberSand indexed-material side elevation.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={iron:58,plate:62,frame:49,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 // Dry, stratified geological foundation. No fluids, falling material, or dynamic machinery.
 for(let y=784;y<H;y++)for(let x=0;x<W;x++)g[y*W+x]=(y===784||y%91<4)?M.plate:(y%137<6?M.dark:M.rock);
 rect(0,780,35,244,M.rock);rect(2012,780,36,244,M.rock);
 // Deliberately unequal civic precincts: station hall, markets, control/dispatch and tram maintenance.
 const precincts=[
  {x:94,w:380,roof:519,partition:283,kind:"arrival"},
  {x:538,w:359,roof:573,partition:703,kind:"market"},
  {x:978,w:379,roof:502,partition:1153,kind:"control"},
  {x:1454,w:451,roof:556,partition:1688,kind:"depot"}
 ];
 for(let [idx,p]of precincts.entries()){
   rect(p.x,p.roof,p.w,18,M.plate);
   rect(p.x,p.roof+18,20,784-p.roof-18,M.frame);
   rect(p.x+p.w-20,p.roof+18,20,784-p.roof-18,M.frame);
   rect(p.partition,p.roof+70,16,784-p.roof-70,M.iron);
   // Functional, body-wide positive doorways both sides and through civic partitions.
   rect(p.x,620,21,124,0);rect(p.x+p.w-20,620,21,124,0);
   rect(p.partition,622,16,117,0);
   // Raised fascia, windows and load-bearing vertical piers above occupied concourses.
   rect(p.x+22,p.roof+33,p.w-44,7,M.steel);
   for(let j=0;j<Math.floor((p.w-75)/51);j++){
     const sx=p.x+42+j*51;
     rect(sx,p.roof+40,27,8,M.frame);
     rect(sx+7,p.roof+48,13,7,(j+idx)%3===0?M.amber:M.ivory);
   }
   // Foundation-rooted low floor-service benches; preserve the transit line at y~675.
   for(let j=0;j<3;j++){
     const xx=p.x+43+j*Math.floor((p.w-85)/3);
     rect(xx,748,29,36,j===1?M.iron:M.frame);
     rect(xx+5,733+(j%2)*5,19,15,idx===2?M.amber:M.steel);
   }
   // Side sign distinct from decoration: roof-attached warning / wayfinding signal.
   rect(p.x+40,p.roof-19,15,19,M.iron);
   rect(p.x+29,p.roof-28,38,10,M.amber);
 }
 // Station roof ridge: three offset gate segments rather than a dominant radial machine.
 rect(147,485,123,34,M.frame);rect(175,474,57,11,M.ivory);
 rect(113,529,14,62,M.steel);rect(444,529,15,62,M.steel);
 // Market stair-step civic roof and two low occupied kiosk wings.
 rect(574,540,126,33,M.frame);rect(599,529,75,11,M.plate);
 rect(738,553,113,20,M.steel);
 // Municipal switching office with a small stepped rooftop signal tower, not a massive hub.
 rect(1180,451,86,51,M.frame);rect(1202,432,42,19,M.plate);
 rect(1196,474,56,14,M.amber);rect(1208,458,31,10,M.ivory);
 // Depot stepped crane shed and transfer clerestory.
 rect(1774,531,99,25,M.frame);rect(1795,521,58,10,M.steel);
 rect(1531,544,120,12,M.plate);
 // Three physically supported tram footbridges between precinct façades, passable underneath.
 for(let [x0,x1,y] of [[467,541,595],[890,983,603],[1352,1461,610]]){
   rect(x0,y,x1-x0,9,M.plate);
   rect(x0+8,y+9,8,19,M.frame);rect(x1-18,y+9,8,19,M.frame);
   // Subtle rail signal at east end, attached to bridge structure.
   rect(x1-30,y-16,12,16,M.iron);rect(x1-30,y-21,12,5,M.amber);
 }
 // Trackside freight handoff and three road approaches remain distinctly open, not grid-filled.
 for(let [x,w] of [[478,48],[909,53],[1372,65]]){
   rect(x,759,w,25,M.frame);
   rect(x+10,752,w-20,7,M.plate);
 }
 // Civic roof lattice is physically rooted by a western utility mast; all four precinct roofs share short supported bridge ties.
 rect(33,505,14,279,M.frame);rect(46,519,50,14,M.plate);
 // Four distinct interior workface vocabularies: ticket/capstan, market, interlock, repair.
 for(let j=0;j<4;j++){
   const x=148+j*29;rect(x,759,19,25,M.iron);rect(x+5,745,9,14,j%2?M.amber:M.ivory);
 }
 for(let j=0;j<3;j++){
   const x=599+j*72;rect(x,746,42,38,M.frame);
   rect(x+6,739,30,7,M.amber);rect(x+10,757,7,12,M.ivory);
 }
 for(let j=0;j<5;j++){
   const x=1030+j*49;rect(x,747,24,37,M.steel);
   rect(x+6,737,12,10,j%2?M.amber:M.ivory);
 }
 for(let j=0;j<5;j++){
   const x=1504+j*66;rect(x,750,43,34,M.iron);
   rect(x+10,737,22,13,(j%2)?M.amber:M.steel);
 }
 // Authentic subgrade tram recovery: long, broad, inhabited undercity service gallery.
 rect(67,835,1917,78,0);
 // Four distinct, >=90px-wide entered vertical communications, drawn after floors/decor.
 const shafts=[359,761,1175,1734];
 for(const x of shafts)rect(x-49,691,98,313,0);
 // Human-editable lower chambers: all entered by shafts, no fake decorative cavities.
 const low=[
  [211,925,278,82,"archive"],[645,925,254,82,"freight"],
  [1061,926,279,81,"relay"],[1598,922,284,85,"repair"]
 ];
 for(let [x,y,w,h] of low){rect(x,y,w,h,0);rect(x+16,y+h-19,w-32,11,M.steel);
    rect(x+33,y+h-41,27,22,M.frame);
    rect(x+w-70,y+h-46,38,27,M.iron);
    rect(x+w-53,y+h-54,12,8,M.amber);
 }
 // Gallery divides into four joined-by-surface recovery sectors. These bottom-grounded street piers carry the overburden.
 for(const x of [482,907,1402])rect(x,784,17,240,M.frame);
 // Functionally unequal undercity equipment, attached to chamber floors.
 rect(255,979,46,19,M.plate);rect(315,969,18,21,M.ivory);
 rect(688,982,59,14,M.iron);rect(800,963,13,22,M.steel);
 rect(1101,977,40,19,M.frame);rect(1210,975,50,22,M.steel);
 rect(1637,982,55,15,M.plate);rect(1800,979,34,18,M.iron);
 // Narrow cable arrays at lower gallery ceiling; physically rock-rooted, do not block free centres.
 for(let x=120;x<1980;x+=125){
   rect(x,913,9,21,M.frame);
   rect(x+2,916,5,7,M.amber);
 }
 // True open street frontages, not isolated sky pods; re-clear door edges and main body corridor.
 for(const p of precincts){rect(p.x,625,22,119,0);rect(p.x+p.w-21,625,22,119,0);rect(p.partition,627,16,114,0);}
 // Re-clear shaft-throats and the actual 31x27 corridor after furnishing.
 for(const x of shafts)rect(x-42,696,84,304,0);
 // Two large genuine roof hatches form an elevated inter-borough bypass when the surface tram threshold fails.
 // They clear all roof/fascia thickness and give >31x27 Midge space between occupied concourse and open sky.
 rect(788,532,78,133,0);
 rect(1034,478,94,165,0);
 // Surviving parapets frame rather than obstruct both hatch mouths.
 rect(781,555,7,22,M.iron);rect(866,555,7,22,M.iron);
 rect(1026,483,8,20,M.frame);rect(1128,483,8,20,M.frame);
 // Independent top-boundary-supported civic catenary carries separated roof portions above the vehicle/pedestrian passage.
 // Functional signal/energy trunk, not a repeated giant central wheel or decorative floating skyline.
 rect(45,412,1948,10,M.frame);
 rect(45,412,13,109,M.frame);rect(1980,412,13,372,M.frame);
 for(const [x,y] of [[420,519],[565,573],[876,573],[1012,502],[1290,502],[1531,556],[1868,556]]){
   rect(x,422,10,y-422,M.steel);rect(x-6,y-3,22,7,M.plate);
 }
 // Actual open catenary transit portals align with the two roof hatches: the emergency upper detour passes OVER the live trunk.
 rect(783,402,91,29,0);rect(1029,402,106,29,0);
 // Intentional crop coverages follow the final material plane exactly.
 const sites=[
 ["West street arrival",68,685],["West passenger hall",184,683],
 ["Ticket counters",254,683],["West platform transfer",422,683],
 ["West archive shaft",359,866],["West luggage archive",340,950],
 ["Market west portal",515,681],["Market traders hall",611,684],
 ["Market service hall",807,682],["Market goods underpass",761,865],["Market freight cellar",763,950],
 ["Market east interchange",881,679],["Severable tram threshold",950,682],
 ["Dispatch reception",1047,680],["Interlocking desk",1250,684],
 ["Dispatch undercity",1175,865],["Cable relay room",1180,952],
 ["Eastern bridge landing",1404,682],["Depot line intake",1511,680],
 ["East maintenance benches",1821,685],["Depot lower servicing",1734,862],
 ["Recovery machinery workshop",1745,950],["East city exit",1963,687]
 ];
 const obs=[916,631,83,103]; // Actual source-static closure of the central crossing.
 const crops=[
 ["overview.png",0,0,W,H],
 ["01-west-passenger-terminal.png",60,445,490,382],
 ["02-market-arcade-and-transfer.png",515,500,485,345],
 ["03-municipal-signal-borough.png",938,391,477,460],
 ["04-east-depot-and-outpost.png",1428,477,596,357],
 ["05-undertram-service-galleries.png",135,792,1050,232],
 ["06-eastern-lower-recovery.png",1060,792,964,232]
 ];
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
