'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),seed=261120347;
 const M={0:"empty",3:"water",8:"lava",58:"concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt",104:"firebrick",117:"iron",131:"heat-shield"};
 // Saltglass Scatterforge: five production ISLANDS on an asymmetric cascade, not
 // a linear unified hall. Deliberate gaps and four reusable event/editing sites.
 function r(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error("bad authored rect "+[x,y,w,h,id]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function beam(x,y,xx,yy,w,id){let n=Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))),step=Math.max(2,Math.floor(w/3));for(let i=0;i<=n;i+=step){let t=i/n;r(x+(xx-x)*t-w/2,y+(yy-y)*t-w/2,w,w,id);}}
 function oval(cx,cy,rx,ry,id){for(let j=-ry;j<=ry;j++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry))));r(cx-a,cy+j,2*a+1,1,id);}}
 // Rock and five separate reinforced piers; all major load paths run to base.
 r(0,930,2048,94,100);r(0,918,2048,12,58);
 r(0,265,38,653,58);r(38,462,39,456,100);r(2010,430,38,488,58);r(1965,707,45,211,100);
 function isle(x,y,w,p,q){r(x,y,w,25,58);r(x+7,y-7,w-14,7,65);
  for(const v of[p,q]){r(v,y+25,24,918-y-25,58);r(v-6,898,37,20,100);beam(v+9,y+77,v+46,y+161,12,65);}
  r(x+7,y+25,15,20,62);r(x+w-22,y+25,15,20,62);}
 isle(180,487,270,212,398);isle(547,602,265,575,770);isle(936,446,307,967,1195);isle(1355,681,275,1386,1574);isle(1746,772,201,1780,1906);
 // ISLAND 1: high ore hopper, staged weighing, hoist, enclosed thermal core.
 r(195,374,188,16,62);r(209,390,15,97,65);r(362,390,16,97,65);
 beam(210,390,270,443,13,117);beam(363,390,306,443,13,117);
 r(246,411,87,20,65);r(251,431,77,12,76);r(249,444,71,24,104);r(259,453,48,9,131);
 r(228,359,120,14,66);r(237,351,28,8,77);r(326,351,14,8,79);
 r(221,289,12,70,68);r(221,289,128,10,62);r(339,298,10,53,68);
 r(284,320,14,78,69);r(278,325,26,12,117);r(274,383,35,12,117);
 r(368,412,61,75,104);r(377,423,43,50,131);r(389,440,20,16,8);
 r(350,405,92,11,65);r(369,393,58,12,117);r(371,470,54,16,76);
 r(410,381,18,31,69);r(414,358,12,25,62);
 // ISLAND 2: off-axis delivery duct, suspended ladle, open machinery basement.
 beam(431,467,589,572,14,68);beam(438,479,580,587,8,65);
 r(592,520,169,80,104);r(602,532,149,54,131);
 r(620,547,112,18,104);r(632,556,87,8,79);
 r(592,505,169,15,65);r(615,491,122,13,62);
 beam(620,500,689,451,13,117);beam(732,500,689,451,13,117);
 r(679,433,19,25,68);r(675,420,28,15,117);r(668,405,42,11,79);
 r(619,586,118,13,76);
 r(596,649,158,69,0);r(603,706,145,10,62);r(601,658,13,48,65);r(743,658,11,48,65);
 r(640,672,54,18,68);r(654,661,12,11,79);r(705,683,25,20,117);
 // Cross-gorge elevated bridge with low recovery route below.
 beam(757,574,945,440,11,68);beam(761,588,942,452,7,65);
 r(842,550,13,48,62);r(842,598,14,320,58);
 // ISLAND 3: high radial caster crown; wheel sizes and spans deliberately varied.
 r(966,392,238,13,62);r(970,405,226,11,76);
 for(const [cx,cy,rx,ry] of [[1011,354,31,28],[1088,333,46,41],[1182,364,25,23]]){
  oval(cx,cy,rx,ry,65);oval(cx,cy,rx-10,ry-10,117);oval(cx,cy,Math.max(3,rx-19),Math.max(3,ry-19),0);
  r(cx-7,cy-7,14,14,69);r(cx-3,cy-3,6,6,77);beam(cx,cy+ry,cx,394,11,65);}
 r(967,421,227,18,131);r(990,437,186,9,104);
 r(1034,379,92,12,68);r(1127,391,64,11,68);
 r(1193,365,30,66,104);r(1198,376,20,42,131);r(1228,411,14,34,76);
 // An independent high bypass gantry and intentionally open editable core.
 r(819,240,411,10,62);r(840,250,13,74,65);r(1198,250,13,93,65);
 beam(840,310,902,246,8,68);beam(1198,328,1154,246,8,68);
 r(968,230,112,10,66);r(982,221,10,9,77);r(1068,222,9,8,79);
 // ISLAND 4: sheer descending ladle-to-quench chute, sealed water.
 beam(1238,445,1390,659,13,68);beam(1231,445,1380,658,7,65);
 r(1358,632,231,42,58);r(1365,616,215,16,104);
 r(1380,566,180,49,131);r(1388,574,162,33,104);r(1417,581,116,17,3);
 r(1400,556,149,10,65);r(1406,547,139,9,76);
 r(1457,536,25,11,79);r(1470,509,13,29,69);
 r(1527,549,17,20,68);r(1563,587,17,44,117);r(1376,656,184,13,66);
 r(1440,747,122,92,0);r(1440,825,122,14,62);
 r(1452,759,91,11,117);r(1462,778,24,37,69);r(1508,786,32,27,65);
 r(1472,765,10,10,77);r(1533,775,13,12,79);
 // ISLAND 5: freight rail, crane points, decompression bay and exit.
 beam(1615,667,1768,753,12,68);beam(1615,683,1751,764,7,65);
 r(1760,708,182,62,65);r(1772,720,160,34,72);
 r(1796,732,122,12,117);r(1803,745,106,9,76);
 for(const x of[1783,1837,1908]){r(x,693,11,15,69);r(x-8,684,27,10,62);}
 r(1805,662,111,15,66);r(1848,651,15,11,77);
 r(1763,780,165,21,62);r(1788,805,111,36,0);
 r(1800,823,87,10,66);r(1811,834,69,7,117);
 // Three editable underplant chambers are physically connected to open air.
 r(222,743,159,91,0);r(234,816,136,15,62);r(240,750,12,66,65);
 r(271,769,36,21,117);r(315,784,36,24,68);
 r(940,758,187,95,0);r(950,835,164,14,62);
 r(972,771,27,51,68);r(1015,797,75,14,117);r(1059,772,15,25,79);
 // A 50-cell full-Midge maintenance hatch through the upper caster shelf.\n r(1117,435,50,55,0);\n // Recovery markers, and incomplete crane arms (intentional authoring seams).
 r(880,624,11,40,68);r(870,618,30,8,76);
 r(1288,738,11,65,69);r(1276,736,36,10,76);
 r(1666,810,11,83,68);r(1658,808,27,10,77);
 beam(162,482,144,370,9,65);beam(1643,684,1680,623,11,65);beam(1680,623,1708,615,9,62);
 const spawn=[116,251],sites=[
  {name:"West lip spawn",x:116,y:251},{name:"Ore gantry north",x:180,y:285},
  {name:"Ore roof checkpoint",x:315,y:265},{name:"Furnace overlook",x:469,y:353},
  {name:"Upper transit",x:540,y:249},{name:"Ladle gantry",x:678,y:380},
  {name:"Ladle maintenance",x:590,y:471},{name:"Delivery fall",x:824,y:430},
  {name:"North high bypass",x:911,y:194},{name:"Caster crown",x:1070,y:278},
  {name:"Caster observation",x:1135,y:275},{name:"Central seam north entry",x:782,y:356},
  {name:"Caster hatch approach",x:1115,y:188},{name:"Decline upper entry",x:1290,y:340},
  {name:"Quench overlook",x:1470,y:489},{name:"Quench service",x:1612,y:578},
  {name:"Valve rescue overlook",x:1660,y:575},{name:"Freight entry",x:1725,y:669},
  {name:"Freight mast",x:1878,y:624},{name:"East slip goal",x:1952,y:670},
  {name:"Return overdeck",x:1268,y:183}
 ];
 return {g,W,H,M,sites,seed,spawn};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[750,185,56,130],blocked=route(31,27,obstruction);
 return {rectangles:rects.length,work,hist,rooted:b,total,detached:total-b,airfaces,direct,flight,obstruction,blocked};
}


// Exhaustive shortest path on the full 31x27 FREE-CENTRE 4-neighbour grid:
// no nearest-site substitution, Manhattan shortcut or missing 2D collision checks.
function shortest31(world,block){
 const {W,H,spawn,sites}=world,g=block?world.g.slice():world.g;
 if(block){const[x,y,ww,hh]=block;for(let yy=y;yy<y+hh;yy++)g.fill(58,yy*W+x,yy*W+x+ww);}
 const S=W+1,integral=new Int32Array(S*(H+1));
 for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=g[(y-1)*W+x-1]!==0?1:0;integral[y*S+x]=integral[(y-1)*S+x]+run;}}
 const free=new Uint8Array(W*H);
 for(let y=13;y+14<=H;y++)for(let x=15;x+16<=W;x++){
  const l=x-15,t=y-13,rr=l+31,b=t+27;
  if(integral[b*S+rr]-integral[t*S+rr]-integral[b*S+l]+integral[t*S+l]===0)free[y*W+x]=1;
 }
 const end=sites.find(q=>q.name==="East slip goal");if(!end)throw Error("missing literal goal");
 const start=spawn[1]*W+spawn[0],finish=end.y*W+end.x,dist=new Int32Array(W*H),queue=new Int32Array(W*H);
 dist.fill(-1);let front=0,tail=0;
 if(!free[start]||!free[finish])throw Error("literal spawn/goal blocked");
 queue[tail++]=start;dist[start]=0;
 while(front<tail&&dist[finish]===-1){
  const i=queue[front++],x=i%W;
  for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W]){
   if(j>=0&&j<W*H&&free[j]&&dist[j]===-1){dist[j]=dist[i]+1;queue[tail++]=j;}
  }
 }
 return {steps:dist[finish],visited:tail};
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

function build(){
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects),directRoute=shortest31(w,null),blockedRoute=shortest31(w,a.obstruction);
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||directRoute.steps<0||blockedRoute.steps<=directRoute.steps)throw Error('static gates '+JSON.stringify({detached:a.detached,airfaces:a.airfaces,direct:a.direct,flight:a.flight.map(f=>({hull:f.hull,passed:f.passed,failed:f.sites.filter(v=>!v.reached)})),blocked:{passed:a.blocked.passed,failed:a.blocked.sites.filter(v=>!v.reached)},support}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-ore-and-furnace.png",160,285,329,215],["02-ladle-island.png",530,387,315,326],["03-caster-crown.png",923,245,320,214],["04-thermal-decline.png",1240,428,440,270],["05-freight-spur.png",1675,618,300,188],["06-maintenance-voids.png",904,733,716,171]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Saltglass Scatterforge',seed:261120347,engine_sha:'de58bf1997ca75825cf3b29e046dc1c1022c45bf',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked,goal_shortest_direct:directRoute,goal_shortest_blocked:blockedRoute,detour_steps:blockedRoute.steps-directRoute.steps},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}

const fs=require('node:fs'),path=require('node:path');
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
