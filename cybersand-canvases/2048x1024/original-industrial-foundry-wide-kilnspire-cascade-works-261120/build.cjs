'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 // KILNSPIRE CASCADING STEELWORKS -- from-scratch perpendicular 2D side elevation.
 // Unique staggered altitude transaction: ore gantry -> triple rising hearths -> twin
 // transverse ladles -> stepped vertical casting wells -> sealed quench -> east freight.
 // Free upper flight spine, two dissimilar full-width rescue shafts, excavated lower return.
 function r(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error("bad authored rect "+[x,y,w,h,id]);for(let v=y;v<y+h;v++)g.fill(id,v*W+x,v*W+x+w);}
 function beam(x,y,xx,yy,w,id){const n=Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y)));for(let i=0;i<=n;i+=Math.max(2,Math.floor(w/3))){const t=i/n;r(x+(xx-x)*t-w/2,y+(yy-y)*t-w/2,w,w,id);}}
 function oval(cx,cy,rx,ry,id){for(let j=-ry;j<=ry;j++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry))));r(cx-a,cy+j,2*a+1,1,id);}}
 // Foundational geology, suspended production deck and actual external buttressed frame.
 r(0,920,W,104,100);r(0,901,W,19,58);
 r(18,126,26,794,58);r(2007,126,25,794,58);
 r(44,138,1963,15,62);r(44,153,1963,8,65);
 r(44,700,1963,16,62);r(44,716,1963,33,58);
 r(44,749,1963,21,65);r(44,770,1963,131,58);
 // Roof: four sharply separated industrial sawtooth bays, NOT a repeating pavilion.
 for(const [a,p,b] of [[108,443,700],[700,891,1090],[1090,1377,1600],[1600,1809,2000]]){
   beam(a,137,p,61,11,65);beam(p,61,b,137,11,62);
   r(a,142,b-a,6,66);
 }
 // Massive suspended servicing traverse; bracing explicitly reaches parent roof.
 r(411,173,1240,13,66);r(411,186,1240,7,65);
 for(const x of [423,755,1085,1460,1638]){r(x,156,10,30,58);r(x-5,187,20,9,117);}
 // Excavated horizontal lower recovery network and independent shaft mouths.
 r(48,784,1950,102,0);
 r(225,295,113,606,0);r(1818,295,115,606,0);
 // Shaft guide elements and clear inlets are outside their flight envelope.
 r(204,436,13,264,65);r(340,432,12,268,62);
 r(1798,438,12,262,62);r(1940,440,13,260,65);
 for(const x of [178,1966]){r(x,755,27,14,76);r(x,770,9,14,69);}
 // Upper main route y230-300 and lower return y810-848 remain open.
 // ORE DISTRICT: traversable gate station, opposed rail-tip hopper, gravity chute.
 r(54,655,299,45,58);r(70,633,221,22,65);
 r(91,604,130,30,117);r(104,598,104,8,76);
 for(const x of [104,145,186]){r(x,615,18,10,79);r(x+4,631,10,10,58);}
 r(72,578,31,19,62);r(215,572,36,28,131);
 r(88,491,17,103,65);r(227,472,17,111,65);r(88,479,156,12,62);
 r(106,491,118,64,58);r(115,500,98,47,72);
 r(136,509,58,12,79);r(150,533,42,10,66);
 beam(245,480,381,547,14,62);beam(246,492,368,552,5,76);
 r(375,456,17,244,58);r(395,503,21,197,58);
 r(379,458,30,12,117);r(381,482,14,92,69);
 r(352,558,59,17,104);r(353,576,31,27,131);
 r(354,609,43,9,76);r(353,619,63,15,65);
 r(351,647,84,53,58);r(354,631,68,14,62);
 r(408,558,24,104,68);r(420,560,9,58,69);
 // THERMAL DISTRICT: three different-height vertical hearths share a real supported
 // insulated manifold; shallow nozzle, deep retort and sloped heat shield are distinct.
 const hearths=[
   {x:454,y:416,w:110,h:284,fireY:488},
   {x:584,y:356,w:117,h:344,fireY:444},
   {x:726,y:398,w:98,h:302,fireY:475}
 ];
 for(const [i,f] of hearths.entries()){
   r(f.x,f.y,f.w,f.h,131);
   r(f.x+12,f.y+15,f.w-24,f.h-52,104);
   r(f.x+20,f.fireY,f.w-40,63,8); // molten charge sealed by firebrick on every face
   r(f.x+15,f.fireY-12,f.w-30,12,117);
   r(f.x+15,f.fireY+63,f.w-30,14,104);
   r(f.x+20,f.y+92,f.w-40,22,72);
   r(f.x+27,f.y+101,13,7,79);
   r(f.x-11,700-18, f.w+22,18,58);
   r(f.x+f.w/2-12,f.y-27,24,27,65);
   r(f.x+f.w/2-16,f.y-33,32,7,76);
   // Each hearth has a different external access terrace and inspection face.
   r(f.x-15,f.y+153+i*21,15,27,66);
   r(f.x-21,f.y+154+i*21,7,26,68);
   r(f.x+f.w,f.y+125+i*14,24,13,69);
 }
 r(435,679,420,21,58);r(446,668,409,10,65);
 r(469,649,335,13,62);
 r(510,644,12,36,69);r(649,632,13,45,69);r(786,640,15,35,69);
 // Exterior thermal duct and exhaust crown, each load path reaches the grounded hearth.
 r(488,290,24,126,62);r(480,283,40,15,131);r(490,275,20,10,79);
 r(627,248,31,108,65);r(619,240,47,15,131);r(631,231,23,9,79);
 r(765,310,20,88,62);r(759,300,32,13,131);
 beam(496,352,631,353,9,69);beam(645,348,773,392,8,69);
 // Ladle district: operated dual transverse cranes, two dry vessels, supported pours.
 r(849,380,281,18,65);r(854,398,271,9,76);
 r(855,407,18,293,58);r(1098,407,19,293,58);
 beam(859,418,906,685,9,62);beam(1111,419,1071,686,8,62);
 for(const [x,y,w,h] of [[896,494,82,93],[1006,446,79,115]]){
   r(x+6,396,12,y-396,68);r(x+w-18,396,12,y-396,68);
   r(x-5,y,w+10,20,117);r(x,y+18,w,h-33,104);
   r(x+9,y+33,w-18,h-53,131);
   r(x-4,y+h-16,w+8,16,65);
   r(x+14,y+h,w-28,700-(y+h),58);
 }
 r(955,628,156,19,62);r(964,647,135,53,58);
 r(969,610,43,17,72);r(983,613,15,9,77);
 r(1059,600,47,16,76);r(1064,590,14,36,69);
 r(1118,642,81,10,69);r(1189,645,12,55,131);
 // Casting district: authentic stepped elevations with independent strand dies.
 // Unequal cavities are enclosed and dry, materially supported to the foundation.
 r(1146,655,392,45,58);r(1153,645,376,10,62);
 const dies=[
  [1161,508,84,137,117,72],
  [1265,473,99,172,131,72],
  [1384,530,67,115,104,72],
  [1464,451,67,194,65,72]
 ];
 dies.forEach(([x,y,w,h,id,glass],i)=>{
   r(x,y,w,h,id);r(x+12,y+12,w-24,h-40,131);
   r(x+19,y+24,w-38,h-62,glass);
   r(x+19,y+41,w-38,10,117);
   r(x+8,y-18,w-16,18,66);
   r(x+10,634,w-20,11,76);
   r(x+17,644,16,11,69);
   // Distinct ejection assemblies, never cloned identical mould capsules.
   if(i===0){r(x+25,y+69,27,12,79);r(x+w,y+44,27,13,68);}
   if(i===1){r(x+27,y+71,36,8,77);r(x+w,y+83,22,19,69);}
   if(i===2){r(x+17,y+79,17,8,79);r(x-19,y+38,19,38,65);}
   if(i===3){r(x+19,y+116,24,9,77);r(x-18,y+86,18,12,68);}
 });
 r(1149,415,379,15,65);r(1159,430,364,7,76);
 r(1161,437,10,64,69);r(1285,437,10,36,69);
 r(1416,437,10,95,69);r(1483,436,10,15,69);
 r(1503,635,61,12,117);r(1513,645,16,27,68);
 // Shear/inspection station: taper backstops, visible hydraulic ram and guarded throat.
 r(1540,561,63,139,58);r(1543,543,59,18,76);
 r(1556,512,22,49,68);r(1564,534,11,14,79);
 r(1553,614,33,13,72);r(1550,660,40,12,117);
 // Quench district: three inequivalent insulated water cassettes, fluids fully sealed.
 const cools=[[1611,523,60,142],[1685,553,46,112],[1740,511,58,154]];
 for(const [i,c] of cools.entries()){
   let [x,y,w,h]=c;
   r(x,y,w,h,131);r(x+9,y+11,w-18,h-23,104);
   r(x+15,y+18,w-30,h-42,3);
   r(x,y+h,w,35,58);
   r(x-7,y-16,w+14,16,62);
   r(x+5,y-23,13,12,68);
   r(x+w-15,y-23,11,16,69);
   r(x+Math.floor(w/2)-9,y+h+9,18,12,79);
 }
 r(1609,689,195,11,65);
 r(1603,480,198,12,69);r(1624,468,12,20,68);
 r(1703,467,17,24,77);r(1774,469,15,20,68);
 // Dry freight gate on far shore; shaft remains an open full-body passage.
 r(1942,616,59,84,58);r(1944,601,55,15,66);
 r(1950,577,39,24,117);r(1955,583,23,10,72);
 r(1962,638,17,19,76);r(1984,620,12,25,69);
 r(1945,540,35,10,65);r(1957,535,12,8,79);
 // Genuine below-deck workshops, not a row of disconnected glyph plinths.
 // 1: asymmetrical gearbox teardown with a reachable recessed access volume.
 r(80,876,206,25,58);r(91,860,179,16,65);r(98,846,22,14,68);
 oval(168,879,52,20,117);oval(168,879,32,12,72);
 r(222,847,15,16,69);r(239,844,23,31,131);r(244,852,13,12,77);
 // 2: hydraulics and separated pressure testing presses.
 r(386,875,247,26,58);r(397,858,230,17,62);
 for(const [x,y] of [[413,835],[469,848],[526,830],[586,844]]){
   r(x,y,18,39,68);r(x-5,y+27,28,13,117);r(x+4,y+32,10,7,76);
 }
 // 3: coolant coil annealer and dissimilar orthogonal filter stacks.
 r(751,874,311,27,58);r(761,858,285,16,65);
 oval(814,881,40,18,117);oval(814,881,24,10,72);
 r(862,842,14,32,69);r(886,845,17,29,69);
 for(let x=928;x<=1032;x+=26){r(x,846,15,32,131);r(x+4,854,7,18,72);}
 // 4: 4-bank vertical compressor, horizontal service trolley and cooler.
 r(1151,875,291,26,58);r(1160,855,274,20,62);
 for(const [x,h] of [[1177,22],[1210,25],[1250,17],[1290,28]]){r(x,855-h,19,h,131);r(x+5,867-h,10,14,72);}
 r(1343,843,58,21,117);r(1353,836,38,8,76);
 // 5: magnetised induction controls, feed drums and pump at separate scale.
 r(1530,879,275,22,58);r(1542,863,251,16,65);
 r(1562,842,35,20,72);r(1570,848,15,5,77);
 oval(1643,879,37,18,117);oval(1643,879,19,9,72);
 r(1690,850,18,29,68);r(1729,835,36,44,131);
 r(1737,843,20,19,72);r(1743,850,8,8,79);
 // Vertical local pump beside exit shaft, distinct from boiler station.
 r(1953,863,45,38,65);r(1960,846,30,17,72);
 r(1064,161,10,237,68); // anchored roof-to-transfer load hanger
 r(977,625,8,40,68); // tie inspection screen into founded tooling
 r(1576,860,8,21,68); // root underfloor electrical controller
 // All upper and lower load-bearing volumes have anchored routes.
 // Critical full-body free shafts are genuinely excavated through every deck and foreground.
 r(225,295,113,606,0);r(1818,295,115,606,0);
 const sites=[
 ["West charge spawn",91,254],["Ore tipping overlook",192,252],
 ["West rescue entry",275,400],["Rising first kiln",493,251],
 ["Upper stack service",646,214],["Third hearth",781,251],
 ["West ladle access",885,250],["Twin-crane inspection",1015,251],
 ["Ladle delivery",1110,250],["First die gallery",1215,250],
 ["Stepped caster",1372,251],["Shear interlock",1530,250],
 ["Quench inspection",1709,250],["East rescue entry",1875,417],
 ["Freight dispatch goal",1955,250],["West repair floor",161,821],
 ["Press workshop",484,821],["Coil annealer",884,822],
 ["Compressor shop",1270,821],["Induction workface",1667,821],
 ["East return lift",1875,823]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:261120161,spawn:[91,254]};
}
function bridgeSupport(world) {
 const {g,W,H}=world,N=g.length,solid=v=>v!==0&&v!==3&&v!==8,root=new Uint8Array(N),q=new Int32Array(N);let at=0,tail=0;
 for(let x=0;x<W;x++){let p=(H-1)*W+x;if(solid(g[p])){root[p]=1;q[tail++]=p;}}
 while(at<tail){const i=q[at++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&solid(g[j])&&!root[j]){root[j]=1;q[tail++]=j;}}
 const visited=new Uint8Array(N),components=[];let maxSize=0;
 for(let i=0;i<N;i++)if(solid(g[i])&&!root[i]&&!visited[i]){let comp=[],front=0,end=0;const queue=[i];visited[i]=1;while(front<queue.length){let v=queue[front++];comp.push(v);let x=v%W,y=(v/W)|0;for(const j of[x?v-1:-1,x+1<W?v+1:-1,y?v-W:-1,y+1<H?v+W:-1])if(j>=0&&solid(g[j])&&!root[j]&&!visited[j]){visited[j]=1;queue.push(j);}}components.push(comp);maxSize=Math.max(maxSize,comp.length);}
 if(!components.length)return {components:0,links:0,maxSize:0,maxLink:0};
 // Exact shortest empty-cell connectors from existing rooted structure (unobstructed 4-neighbour construction).
 const dist=new Int32Array(N),parent=new Int32Array(N);dist.fill(-1);parent.fill(-1);const mq=new Int32Array(N);let h=0,t=0;
 for(let i=0;i<N;i++)if(root[i]){dist[i]=0;mq[t++]=i;}
 while(h<t){const i=mq[h++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&g[j]===0&&dist[j]===-1){dist[j]=dist[i]+1;parent[j]=i;mq[t++]=j;}}
 let links=0,maxLink=0;
 for(const comp of components){let best=-1,bestDist=2147483647;for(const idx of comp){const x=idx%W,y=(idx/W)|0;for(const ni of[x?idx-1:-1,x+1<W?idx+1:-1,y?idx-W:-1,y+1<H?idx+W:-1])if(ni>=0&&g[ni]===0&&dist[ni]>=0&&dist[ni]<bestDist){best=ni;bestDist=dist[ni];}}
  if(best<0||bestDist>220)throw Error("Unsupported component needs long spanning false brace length "+bestDist+", size "+comp.length);
  maxLink=Math.max(maxLink,bestDist);let at=best;while(at>=0&&!root[at]){if(g[at]===0){g[at]=68;links++;}at=parent[at];}
 }
 return {components:components.length,links,maxSize,maxLink};
}

function encode(g,W,H){let rects=[],active=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let mat=g[y*W+x],left=x++;while(x<W&&g[y*W+x]===mat)x++;if(!mat)continue;const k=left+":"+ (x-left)+":"+mat;let r=active.get(k);if(r)r[3]++;else{r=[left,y,x-left,1,mat];rects.push(r);}now.set(k,r);}active=now;}return rects;}

function audit(w,rects){
 const {g,W,H,sites,spawn,M}=w,N=g.length,replay=new Uint8Array(N),used=new Uint8Array(N),hist={},legal=new Set(Object.keys(M).map(Number));let work=0,overlaps=0,bad=0;
 for(const [x,y,ww,hh,id]of rects){if(!legal.has(id)||x<0||y<0||ww<=0||hh<=0||x+ww>W||y+hh>H)throw Error("bad rectangle");work+=ww*hh;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){const k=yy*W+xx;if(used[k])overlaps++;used[k]=1;replay[k]=id;}}
 for(let i=0;i<N;i++){if(replay[i]!==g[i])bad++;hist[g[i]]=(hist[g[i]]||0)+1;}if(bad||overlaps)throw Error("rect parity "+bad+"/"+overlaps);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(N),q=new Int32Array(N);let a=0,b=0;for(let x=0;x<W;x++){let i=(H-1)*W+x;if(solid(g[i])){seen[i]=1;q[b++]=i;}}while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&!seen[j]&&solid(g[j])){seen[j]=1;q[b++]=j;}}
 let total=0,airfaces=0,direct=0;for(let i=0;i<N;i++){const id=g[i];if(solid(id))total++;if(id!==3&&id!==8)continue;const x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0){if(g[j]===0)airfaces++;if(id+g[j]===11&&(g[j]===3||g[j]===8))direct++;}}
 function route(ww,hh,block){let grid=block?g.slice():g;if(block){const[x,y,w,h]=block;for(let yy=y;yy<y+h;yy++)grid.fill(58,yy*W+x,yy*W+x+w);}const s=W+1,sum=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=grid[(y-1)*W+x-1]?1:0;sum[y*s+x]=sum[(y-1)*s+x]+r;}}
 const dx=ww>>1,dy=hh>>1,free=new Uint8Array(N);let all=0;for(let y=dy;y+hh-dy<=H;y++)for(let x=dx;x+ww-dx<=W;x++){const l=x-dx,t=y-dy,r=l+ww,b=t+hh;if(sum[b*s+r]-sum[t*s+r]-sum[b*s+l]+sum[t*s+l]===0){free[y*W+x]=1;all++;}}
 const reached=new Uint8Array(N),qq=new Int32Array(N);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[1043,165,45,307],blocked=route(31,27,obstruction);
 return {rectangles:rects.length,work,hist,rooted:b,total,detached:total-b,airfaces,direct,flight,obstruction,blocked};
}

function concat(arr){const n=arr.reduce((p,a)=>p+a.length,0),out=new Uint8Array(n);let j=0;for(const a of arr){out.set(a,j);j+=a.length;}return out;}

function b32(k){return Uint8Array.of((k>>>24)&255,(k>>>16)&255,(k>>>8)&255,k&255);}

function crc32(a){let c=-1;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^(-1))>>>0;}

function adler32(a){let u=1,v=0;for(let i=0;i<a.length;i++){u=(u+a[i])%65521;v=(v+u)%65521;}return ((v<<16)|u)>>>0;}

function chunk(tag,data){const body=concat([utf(tag),data]);return concat([b32(data.length),body,b32(crc32(body))]);}

function png(g,W,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++)raw.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*(w+1)+1);const z=[Uint8Array.of(0x78,0x01)];for(let i=0;i<raw.length;){const n=Math.min(65535,raw.length-i),block=new Uint8Array(n+5);block[0]=i+n===raw.length?1:0;block[1]=n&255;block[2]=n>>>8;block[3]=(~n)&255;block[4]=((~n)>>>8)&255;block.set(raw.subarray(i,i+n),5);z.push(block);i+=n;}z.push(b32(adler32(raw)));
 const colors={0:[8,11,18],3:[47,127,210],8:[241,78,31],57:[116,63,54],58:[119,123,128],62:[126,141,153],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],72:[37,60,76],76:[227,182,47],77:[55,243,228],79:[255,181,46],100:[54,56,61],104:[200,152,98],117:[90,94,100],131:[26,26,29]},palette=new Uint8Array(132*3);for(const[k,v]of Object.entries(colors))palette.set(v,k*3);
 return concat([Uint8Array.of(137,80,78,71,13,10,26,10),chunk("IHDR",concat([b32(w),b32(h),Uint8Array.of(8,3,0,0,0)])),chunk("PLTE",palette),chunk("IDAT",concat(z)),chunk("IEND",new Uint8Array(0))]);
}

function verifyPNG(p,g,W,x,y,w,h){const v=new DataView(p.buffer,p.byteOffset,p.byteLength);let pos=8,z=null,sections=[];for(let i=0;i<8;i++)if(p[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG signature");while(pos<p.length){let n=v.getUint32(pos,false),tag=String.fromCharCode(...p.subarray(pos+4,pos+8));if(crc32(p.subarray(pos+4,pos+8+n))!==v.getUint32(pos+8+n,false))throw Error("CRC");sections.push(tag);if(tag==="IHDR"&&(v.getUint32(pos+8,false)!==w||v.getUint32(pos+12,false)!==h))throw Error("PNG dimensions");if(tag==="IDAT")z=p.subarray(pos+8,pos+8+n);pos+=12+n;if(tag==="IEND")break;}if(pos!==p.length||sections.join()!=="IHDR,PLTE,IDAT,IEND")throw Error("PNG chunks");let raw=new Uint8Array((w+1)*h),j=2,k=0,done=0;while(!done){const header=z[j++];done=header&1;if(header&6)throw Error("DEFLATE mode");let len=z[j]|(z[j+1]<<8),inverse=z[j+2]|(z[j+3]<<8);j+=4;if(((len^inverse)&65535)!==65535)throw Error("DEFLATE stored length");raw.set(z.subarray(j,j+len),k);k+=len;j+=len;}if(k!==raw.length||adler32(raw)!==((z[j]*16777216+z[j+1]*65536+z[j+2]*256+z[j+3])>>>0))throw Error("zlib checksum");for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("row filter");for(let xx=0;xx<w;xx++)if(raw[yy*(w+1)+xx+1]!==g[(y+yy)*W+x+xx])throw Error("pixel parity");}return w*h;}
const fs=require('node:fs'),path=require('node:path');
function build(){
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length)throw Error('native-independent static qualification failed');
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-ore-gateway.png",50,440,397,263],["02-triple-hearths.png",445,220,397,483],["03-twin-ladles.png",840,375,303,328],["04-cascade-casters.png",1145,409,413,294],["05-quench-freight.png",1555,452,449,250],["06-maintenance-return.png",64,775,1743,128]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Kilnspire Cascading Steelworks',seed:261120161,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
