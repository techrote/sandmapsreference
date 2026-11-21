'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}




function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),seed=261121511;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"pipe",69:"copper",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"steel",131:"shield"};
 function b(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);}
 function l(x,y,X,Y,t,m){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2)));for(let i=0;i<=n;i++){let f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}}
 function ring(cx,cy,rx,ry,t,m){for(let yy=-ry;yy<=ry;yy++){let outer=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry)))),inner=(ry>t&&Math.abs(yy)<ry-t)?Math.floor((rx-t)*Math.sqrt(Math.max(0,1-yy*yy/((ry-t)*(ry-t))))):-1;if(outer>inner){b(cx-outer,cy+yy,outer-inner,1,m);b(cx+inner+1,cy+yy,outer-inner,1,m);}}}
 let s=seed;function rand(){s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;}
 // Inverted industrial ecology: production weight hangs from a single continuous roof.
 b(0,0,W,64,100);b(0,64,W,15,58);
 for(let x=0;x<W;){let dx=Math.min(55+Math.floor(rand()*75),W-x);b(x,79,dx,10+Math.floor(rand()*27),100);x+=dx;}
 for(let x=35;x<W-45;x+=143+Math.floor(rand()*120)){b(x,79,21,14+Math.floor(rand()*38),62);b(x+4,100,13,14,65);}
 b(0,987,W,37,100);
 for(let x=0;x<W;){let dx=Math.min(65+Math.floor(rand()*105),W-x);b(x,947,dx,40,100);b(x,941,dx,6,58);x+=dx;}
 for(const[x,w,y]of[[0,260,827],[260,350,910],[610,290,963],[900,340,946],[1240,310,931],[1550,250,906],[1800,248,834]]){b(x,y,w,1024-y,100);b(x,y,w,10,62);}
 for(const[x,y,w,h]of[[278,821,230,82],[655,853,197,87],[948,836,222,95],[1276,808,218,104],[1591,804,169,84],[1830,744,177,76]]){b(x,y,w,h,0);b(x,y+h,w,8,62);}
 // Seven roof-rooted tensile hangers and diagonal engineering braces.
 for(const[x,y,h]of[[180,112,420],[454,110,358],[732,105,415],[1010,100,420],[1352,102,436],[1680,105,385],[1906,100,395]]){
 b(x-15,80,30,18,117);b(x-7,95,14,h,58);b(x-22,105+h,45,13,117);l(x-8,178,x-68,224,7,68);l(x+8,178,x+61,218,7,68);
 }
 // Staggered aerial engineering bus, not another continuous stripworks deck.
 for(const[x,w,y]of[[60,284,293],[365,300,317],[681,296,285],[995,329,309],[1342,294,281],[1655,329,314]]){
 b(x,y,w,10,62);b(x+14,y+11,w-28,5,65);
 for(let xx=x+22;xx<x+w-24;xx+=54){l(xx,y+17,xx+28,y+36,5,68);l(xx+28,y+36,xx+53,y+17,5,68);}
 }
 // West ore sling and dual elevated hoppers.
 b(70,450,226,18,62);b(81,469,18,112,68);b(275,468,18,114,68);
 for(const[x,w]of[[109,73],[197,66]]){b(x,415,w,40,65);b(x+9,427,w-18,25,100);l(x+10,455,x+w/2,493,9,117);l(x+w-11,455,x+w/2,493,9,117);}
 b(90,500,196,15,117);b(105,521,172,18,62);
 for(let x=116;x<266;x+=27)b(x,514,11,8,79);
 l(292,532,345,558,12,62);b(308,551,31,14,65);
 // Suspended sealed refractory furnace and grounded solid shell.
 for(const a of[[338,457,238,174,117],[353,472,207,143,131],[368,487,177,111,104],[382,507,149,72,8],[326,444,262,15,58],[351,628,215,14,62],[415,425,82,18,69]])b(...a);
 for(const x of[367,543]){b(x,386,14,63,68);b(x-8,379,30,8,65);}
 b(567,536,74,14,117);l(575,544,661,550,10,68);
 // Ladle hanging from yoke with sealed core and articulated pour nozzle.
 b(627,473,176,16,117);
 for(const x of[653,779]){b(x,489,12,48,68);ring(x+6,480,15,15,6,69);}
 for(const a of[[662,532,119,77,131],[674,544,96,48,104],[688,555,70,22,8],[654,609,137,11,117]])b(...a);
 l(773,597,837,577,10,68);
 // Three unequal extrusion wheels beneath a roof die-press.
 b(863,432,352,17,58);b(887,452,17,140,117);b(1180,451,17,138,117);
 for(const[x,y,r]of[[949,529,50],[1075,539,65],[1153,605,35]]){ring(x,y,r,r,10,117);ring(x,y,19,19,6,69);b(x-6,y-6,12,12,65);}
 for(const a of[[918,605,239,16,62],[943,627,186,11,76],[966,446,18,28,68],[1080,449,20,37,68],[996,395,86,24,69],[1022,419,37,45,117]])b(...a);
 l(1130,620,1215,612,11,68);
 // East mould transfer with cutting pistons.
 for(const a of[[1229,548,216,15,62],[1257,565,152,17,65],[1273,582,14,71,68],[1395,582,14,71,68]])b(...a);
 for(let x=1279;x<1395;x+=36)b(x,599,16,18,117);
 l(1229,631,1289,655,8,117);l(1440,631,1485,614,8,117);
 // Fully contained quench tank with machine diagnostics.
 for(const a of[[1504,511,191,152,117],[1520,526,159,123,104],[1534,542,130,91,3],[1490,501,219,12,58],[1495,665,210,15,62]])b(...a);
 for(let x=1520;x<1670;x+=41){b(x,481,18,20,68);b(x,473,26,8,79);}
 b(1705,571,58,13,68);l(1709,575,1779,547,10,117);
 // Overhead freight davit, angled gantry and unequal cargo wagons.
 for(const a of[[1737,423,242,17,62],[1774,444,13,153,68],[1944,445,13,151,68]])b(...a);
 l(1776,422,1863,357,8,68);l(1864,357,1949,425,8,68);ring(1870,362,30,30,8,117);
 b(1856,393,12,132,117);b(1826,517,69,13,65);
 for(const[x,w,y]of[[1773,105,605],[1900,104,624]]){b(x,y,w,35,65);b(x+9,y+9,w-18,16,131);ring(x+20,y+34,12,12,5,117);ring(x+w-20,y+34,12,12,5,117);}
 b(1725,657,294,16,62);b(1750,676,245,7,117);
 // Six editable undercroft repair stations with independent mechanical identities.
 for(const[x,y,w]of[[322,877,160],[688,909,140],[986,907,148],[1316,884,142],[1615,860,130],[1848,794,128]]){
 b(x,y,w,9,62);b(x+14,y-34,12,34,68);b(x+w-28,y-42,15,42,65);b(x+45,y-25,48,19,117);b(x+59,y-35,19,10,69);
 }
 for(const[x,y]of[[253,333],[592,349],[840,328],[1415,341],[1698,355]]){b(x,y,72,9,62);b(x+14,y-16,44,12,65);}
 const solid=v=>v!==0&&v!==3&&v!==8;
 function components(){const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 for(let x=0;x<W;x++)for(const i of[x,(H-1)*W+x])if(solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}
 while(a<z){let i=q[a++],x=i%W;
 for(const k of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(k>=0&&solid(g[k])&&!seen[k]){seen[k]=1;q[z++]=k;}}
 let comps=[];for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){let arr=[i],j=0;seen[i]=1;
 while(j<arr.length){let k=arr[j++],x=k%W;for(const h of[x?k-1:-1,x<W-1?k+1:-1,k>=W?k-W:-1,k+W<g.length?k+W:-1])if(h>=0&&solid(g[h])&&!seen[h]){seen[h]=1;arr.push(h);}}comps.push(arr);}
 return comps;}
 // Boundary-link each small isolated engineering part with a narrow real solid beam.
 for(let loop=0;loop<3;loop++){let comps=components();if(!comps.length)break;
 for(const comp of comps){let at=comp[0],score=1e9;for(let k=0;k<comp.length;k+=Math.max(1,Math.floor(comp.length/300))){let i=comp[k],y=(i/W)|0,sc=Math.min(y-79,947-y);if(sc<score){at=i;score=sc;}}
 let x=at%W,y=(at/W)|0;if(y<=513)b(x,Math.min(y,96),3,Math.max(1,y-Math.min(y,96)+1),68);else b(x,y,3,Math.max(1,948-y),68);}}
 for(const x of[89,807,1238,1743])b(x,329,54,446,0);
 b(38,345,1972,47,0);b(38,706,1972,64,0);
 for(const[x,y,Y]of[[80,79,330],[589,79,324],[1200,79,332],[1716,79,334]])b(x,y,7,Y-y,117);
 for(const[x,y]of[[95,679],[824,680],[1264,678],[1792,681]])b(x,y,63,9,62);
 const sites=[["West arrival",103,738],["Ore sling",235,738],["Furnace face",466,738],["Hot-side workshop",565,738],["West bridge",602,738],["Ladle watch",721,738],["Aerial junction west",850,676],["Die crown",1006,676],["Caster below",1109,738],["Aerial junction east",1175,676],["Mould bay",1314,738],["Quench lookout",1575,738],["Cooling diagnostics",1693,738],["Freight station",1818,738],["East rim goal",1942,738],["West undercroft",350,794],["Caster repair pit",890,794],["Quench underpass",1363,738],["East footbridge",1900,738]].map(([name,x,y])=>({name,x,y}));
 for(const p of sites)b(p.x-17,p.y-15,35,31,0);
 for(let loop=0;loop<3;loop++){let comps=components();if(!comps.length)break;
 for(const c of comps){let at=c[0],d=9999;for(let k=0;k<c.length;k+=Math.max(1,Math.floor(c.length/500))){let i=c[k],y=(i/W)|0,dd=Math.min(y-72,930-y);if(dd<d){d=dd;at=i;}}
 let x=at%W,y=(at/W)|0;if(y<700)b(x,79,3,Math.max(1,y-78),68);else b(x,y,3,Math.max(1,947-y),68);}}
 b(38,706,1972,64,0);b(825,650,386,54,0);b(832,680,60,88,0);b(1147,680,61,88,0);
 for(let loop=0;loop<3;loop++){let comps=components();if(!comps.length)break;
 for(const c of comps){let at=c[0],ay=(at/W)|0;for(const i of c){let y=(i/W)|0;if(y<ay){ay=y;at=i;}}
 let x=at%W,y=ay;if(y<706)b(x,79,2,Math.max(1,y-78),68);else b(x,y,2,Math.max(1,947-y),68);}}
 b(825,650,386,56,0);b(38,706,1972,64,0);b(832,680,60,88,0);b(1147,680,61,88,0);
 return {W,H,g,M,seed,sites,spawn:[103,738]};
}
function encode(g,W,H){let rects=[],active=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let mat=g[y*W+x],left=x++;while(x<W&&g[y*W+x]===mat)x++;if(!mat)continue;const k=left+":"+ (x-left)+":"+mat;let r=active.get(k);if(r)r[3]++;else{r=[left,y,x-left,1,mat];rects.push(r);}now.set(k,r);}active=now;}return rects;}

function audit(w,rects){
 const {g,W,H,sites,spawn,M}=w,N=g.length,replay=new Uint8Array(N),used=new Uint8Array(N),hist={},legal=new Set(Object.keys(M).map(Number));let work=0,overlaps=0,bad=0;
 for(const [x,y,ww,hh,id]of rects){if(!legal.has(id)||x<0||y<0||ww<=0||hh<=0||x+ww>W||y+hh>H)throw Error("bad rectangle");work+=ww*hh;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){const k=yy*W+xx;if(used[k])overlaps++;used[k]=1;replay[k]=id;}}
 for(let i=0;i<N;i++){if(replay[i]!==g[i])bad++;hist[g[i]]=(hist[g[i]]||0)+1;}if(bad||overlaps)throw Error("rect parity "+bad+"/"+overlaps);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(N),q=new Int32Array(N);let a=0,b=0;for(let x=0;x<W;x++){for(const i of [x,(H-1)*W+x])if(solid(g[i])&&!seen[i]){seen[i]=1;q[b++]=i;}}while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&!seen[j]&&solid(g[j])){seen[j]=1;q[b++]=j;}}
 let total=0,airfaces=0,direct=0;for(let i=0;i<N;i++){const id=g[i];if(solid(id))total++;if(id!==3&&id!==8)continue;const x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0){if(g[j]===0)airfaces++;if(id+g[j]===11&&(g[j]===3||g[j]===8))direct++;}}
 function route(ww,hh,block){let grid=block?g.slice():g;if(block){const[x,y,w,h]=block;for(let yy=y;yy<y+h;yy++)grid.fill(58,yy*W+x,yy*W+x+w);}const s=W+1,sum=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=grid[(y-1)*W+x-1]?1:0;sum[y*s+x]=sum[(y-1)*s+x]+r;}}
 const dx=ww>>1,dy=hh>>1,free=new Uint8Array(N);let all=0;for(let y=dy;y+hh-dy<=H;y++)for(let x=dx;x+ww-dx<=W;x++){const l=x-dx,t=y-dy,r=l+ww,b=t+hh;if(sum[b*s+r]-sum[t*s+r]-sum[b*s+l]+sum[t*s+l]===0){free[y*W+x]=1;all++;}}
 const reached=new Uint8Array(N),qq=new Int32Array(N);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[930,705,151,65],blocked=route(31,27,obstruction);
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
 const end=sites.find(q=>q.name==="East rim goal");if(!end)throw Error("missing literal goal");
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
 const w=world(),support={components:0,links:0,maxLink:0},rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 const direct=shortest31(w,null),detour=shortest31(w,[930,705,151,65]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||direct.steps<0||detour.steps<=direct.steps)
 throw Error("STATIC_GATE "+JSON.stringify({ground:[a.rooted,a.total],fluid:[a.airfaces,a.direct],passes:a.flight.map(v=>v.passed),blocked:a.blocked.passed,total:w.sites.length,failed:a.flight[2].sites.filter(q=>!q.reached),badBlocked:a.blocked.sites.filter(q=>!q.reached),steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),planeHash=sha256(w.g),setupHash=sha256(utf(setupText));
 if(rects.length>32768||utf(setupText).length>1048576)throw Error("source limit");
 let crops=[["overview.png",0,0,2048,1024],["01-ore-intake.png",36,365,354,363],["02-suspended-furnace.png",311,378,340,359],["03-ladle-handoff.png",620,388,279,326],["04-inverted-rotors.png",866,376,365,346],["05-quench-bank.png",1459,440,340,320],["06-dispatch-undercroft.png",1710,348,337,490]],pngs={},pn={},pixels=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(p,w.g,2048,x,y,ww,hh);pngs[n]=p;pn[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,concept:"Nadirspan Ceiling-Anchored Extrusion Foundry",original_no_source:true,seed:w.seed,base_main_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",extent:[2048,1024],plane_sha256:planeHash,setup_sha256:setupHash,json_bytes:utf(setupText).length,rectangle_count:rects.length,rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,finalisation:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_air_faces:a.airfaces,water_lava_contacts:a.direct},flight:a.flight,obstruction:a.obstruction,blocked:a.blocked,shortest_goal:{direct:direct.steps,blocked:detour.steps,delta:detour.steps-direct.steps},pngs:pn,material_pixel_parity:pixels,native:"NATIVE-UNTESTED"};
 const exemplar={"schema_version":1,"purpose":["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],"family":"original/industrial-foundry-wide","map_role":"Ceiling-anchored inverted foundry with dry undercroft and paired local upper/lower Midge transit","anchor_donors":[],"macro_topology":"A continuous geologic roof supports an inverted industrial machine line above sparse ground service rooms","density_profile":"Dense roof-hung furnace, ladle, extrusion die and quench modules; open flight return and unfinished lower bays","route_grammar":{"main":["West arrival","Ore sling","Furnace face","Ladle watch","Caster below","Quench lookout","Freight station","East rim goal"],"alternate":["Aerial junction west","Die crown","Aerial junction east"],"recovery":["West undercroft","Caster repair pit","Quench underpass","East footbridge"]},"strong_motifs":["Continuous roof-rooted suspension","Two sealed hot vessels","Triple unequal extrusion rotors","Local bypass over physical blocked corridor","Editable dry repair rooms","Overhead freight davit"],"interesting_relationships":["Roof load-bearing inverses the conventional floor-rooted grammar","Low flight path and upper detour rejoin at clear shafts","Industrial modules above empty workshop expansion sites"],"authoring_affordances":[{"name":"west undercroft","region_xywh":[278,821,230,82],"use":"worker repair expansion"},{"name":"caster service undercroft","region_xywh":[948,836,222,95],"use":"SWARM modular assembly"},{"name":"quench maintenance","region_xywh":[1276,808,218,104],"use":"unscripted thermal event"},{"name":"east freight expansion","region_xywh":[1830,744,177,76],"use":"arrival/departure stage"}],"setpiece_candidates":[{"name":"Furnace isolation","anchor":"Furnace face","kind":"thermal_isolation"},{"name":"Extruder activation","anchor":"Die crown","kind":"machine_activation"},{"name":"Quench pressure event","anchor":"Quench lookout","kind":"hazard_release"},{"name":"Freight departure","anchor":"East rim goal","kind":"departure"}],"procedural_exemplar_value":["Roof-rooted structural grammar","Layered flight topology with genuine solid obstruction rejoin","Spare unscripted lower service rooms","Distinctive inverted casting production flow"],"similarity_avoidance":"Unlike Spindlebreak's fault cable crossing, Sablecut's rock arterials, Vespergate's annulus and Saltglass's separate land islands, Nadirspan suspends the entire functional plant from one continuous roof.","diversity_axes":{"macro_topology":"suspended","altitude_grammar":"multi_strata","density_cadence":"clustered","route_structure":"parallel_lanes","landmark_family":"rotor","support_form":"roof_rooted","environment_relation":"thermal","incompleteness":"editable_gaps"}};
 const readme="# Nadirspan Ceiling-Anchored Extrusion Foundry\n\nOriginal 2048×1024 indexed material-cell world. One continuous deep geological roof bears a sequence of suspended ore hoppers, refractory furnace, sealed ladle, three unequal extrusion wheels, contained quench and freight davit. Truly orthographic side-on geometry, no adapted art. Four distinct lower service and set-piece sites intentionally remain incomplete for later SWARM/GENTEK and manual authoring.\n\nNavigation: literal West arrival to East rim goal through a lower dry return; a solid 151x65 obstruction at x930,y705 forces a +94-step flight detour up to the casting machine service passage. Every named target is checked by conservative Midge 19x15, 23x19 and 31x27 whole-hull four-neighbour BFS without shifted targets. Source-static only; native Workbench/Rapier/collision/save-reopen NOT TESTED.\n\nTo reproduce, run node build.cjs [output-folder]. Compare complete setup.json and receipt.json, including SHA-256, exhaustive grid replay and all genuine 1:1 PNGs. Source-only creator PASS; independent Art/Technical/Shepherd review needed. Remain Draft/HOLD.\n";
 return {files:{"setup.json":setupText,"receipt.json":JSON.stringify(receipt,null,2)+"\n","exemplar.json":JSON.stringify(exemplar,null,2)+"\n","README.md":readme,...pngs},receipt};
}
if(typeof module!=="undefined"&&module.exports){const fs=require("fs"),path=require("path");module.exports={world,encode,audit,build};if(require.main===module){let d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();for(const[n,v]of Object.entries(a.files))fs.writeFileSync(path.join(d,n),v);console.log(a.receipt.plane_sha256,a.receipt.rectangle_count);}}
