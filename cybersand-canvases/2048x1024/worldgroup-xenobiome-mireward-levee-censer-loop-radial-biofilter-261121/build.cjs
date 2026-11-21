"use strict";
function sha256(input){
 const a=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const n=(a.length+72)&~63,b=new Uint8Array(n);b.set(a);b[a.length]=128;let bits=a.length*8;for(let i=0;i<8;i++){b[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(x,n)=>x>>>n|x<<(32-n);
 for(let o=0;o<n;o+=64){for(let j=0;j<16;j++){let i=o+j*4;w[j]=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;}
 for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rot(p,7)^rot(p,18)^(p>>>3))+w[j-7]+(rot(q,17)^rot(q,19)^(q>>>10)))>>>0;}
 let [A,B,C,D,E,F,G,H]=h;for(let j=0;j<64;j++){let t1=(H+(rot(E,6)^rot(E,11)^rot(E,25))+((E&F)^(~E&G))+K[j]+w[j])>>>0,t2=((rot(A,2)^rot(A,13)^rot(A,22))+((A&B)^(A&C)^(B&C)))>>>0;H=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0;}let v=[A,B,C,D,E,F,G,H];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;}
 return h.map(n=>n.toString(16).padStart(8,"0")).join("");
}
function b64(bytes){const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=[];let s="";for(let i=0;i<bytes.length;i+=3){let x=bytes[i],y=bytes[i+1]||0,z=bytes[i+2]||0;s+=c[x>>2]+c[(x&3)<<4|y>>4]+(i+1<bytes.length?c[(y&15)<<2|z>>6]:"=")+(i+2<bytes.length?c[z&63]:"=");if(s.length>10000){a.push(s);s="";}}return a.join("")+s;}
function png(g,x0,y0,w,h){
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],raw=new Uint8Array(h*(w+1));
 for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*2048+x0,(y+y0)*2048+x0+w),y*(w+1)+1);
 const rev=(v,n)=>{let a=0;while(n--){a=a<<1|v&1;v>>>=1;}return a;};
 function zip(raw){let out=[120,1],bits=0,nb=0;function wr(v,k){bits|=v<<nb;nb+=k;while(nb>=8){out.push(bits&255);bits>>>=8;nb-=8;}}
 function sym(v){let k,x;if(v<=143){x=v+48;k=8;}else if(v<=255){x=v+256;k=9;}else if(v<=279){x=v-256;k=7;}else{x=v-280+192;k=8;}wr(rev(x,k),k);}
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ex=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 wr(3,3);for(let i=0;i<raw.length;){let r=1;while(i+r<raw.length&&r<258&&raw[i]===raw[i+r])r++;if(r>=4&&i>0&&raw[i]===raw[i-1]){let j=0;while(j<28&&lb[j+1]<=r)j++;sym(257+j);if(ex[j])wr(r-lb[j],ex[j]);wr(0,5);i+=r;}else sym(raw[i++]);}
 sym(256);if(nb)out.push(bits&255);let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}out.push(...be((b<<16|a)>>>0));return Uint8Array.from(out);}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set([...name].map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 let pal=new Uint8Array(132*3),cols={0:[8,11,18],49:[95,98,107],58:[119,123,128],62:[126,141,153],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[250,184,86],100:[54,56,61],101:[24,19,32],120:[156,210,220],129:[33,70,110],131:[168,171,177]};
 for(let [k,v] of Object.entries(cols))pal.set(v,Number(k)*3);
 let pieces=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())],b=new Uint8Array(pieces.reduce((n,v)=>n+v.length,0));let off=0;for(let v of pieces){b.set(v,off);off+=v.length;}return b;
}

function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={basalt:100,schist:101,slate:49,steel:62,grate:66,pipe:68,cyan:77,amber:79,glass:120,blue:129,shield:131};
 function R(x,y,w,h,v){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));for(let j=c;j<d;j++)g.fill(v,j*W+a,j*W+b);}
 function L(x,y,X,Y,t,v){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2,rr=r*r;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r+1));j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r+1));i++){let p=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-p*dx)**2+(j-y-p*dy)**2<=rr)g[j*W+i]=v;}}
 function P(a,v){let low=Math.max(0,Math.floor(Math.min(...a.map(p=>p[1])))),high=Math.min(H-1,Math.ceil(Math.max(...a.map(p=>p[1]))));for(let y=low;y<=high;y++){let xs=[];for(let i=0;i<a.length;i++){let p=a[i],q=a[(i+1)%a.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}xs.sort((x,y)=>x-y);for(let k=0;k+1<xs.length;k+=2)R(Math.ceil(xs[k]),y,Math.max(0,Math.floor(xs[k+1])-Math.ceil(xs[k])+1),1,v);}}



 // MIREWARD CENSER: founded segmented stationary annular biofilter, not a copied rotor.
 // Low reed settlement, four annular entrances, asymmetrical radial piers, three excavated returns.
 let rng=0x35c021;function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 R(0,862,W,162,M.basalt);R(0,991,W,33,M.schist);
 for(let x=0;x<W;x+=49){let h=7+Math.floor(rand()*11);R(x,862-h,49,h,M.basalt);if(x%3===0)R(x,854,21,3,M.slate);}
 // Innumerable authored voids are not defects. Lower dry two-lane service survives.
 R(65,889,1918,93,0);
 for(let [x,w] of [[380,210],[685,210],[1175,195],[1465,160]])R(x,888,w,94,0);
 // Radial annular biological casement, eight interrupted arcs and four inner arcs.
 function A(cx,cy,rx,ry,start,end,t,m){let steps=Math.ceil((end-start)*Math.max(rx,ry)/6);for(let k=0;k<steps;k++){let a=start+(end-start)*k/steps,b=start+(end-start)*(k+1)/steps;L(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cx+rx*Math.cos(b),cy+ry*Math.sin(b),t,m);}}
 const Cx=1030,Cy=531;
 for(let j=0;j<8;j++){let a=j*Math.PI/4+.15,b=(j+1)*Math.PI/4-.17;
 A(Cx,Cy,414+(j%3-1)*9,250+(j%2)*9,a,b,16,j%3?M.steel:M.shield);
 A(Cx,Cy,397+(j%3-1)*8,231+(j%2)*9,a+.07,b-.07,5,j%2?M.blue:M.pipe);}
 for(let [a,b] of [[.2,1.08],[1.77,2.55],[3.25,4.15],[4.88,5.66]])A(Cx+24,Cy-3,233,142,a,b,9,M.grate);
 // Unlike a bilateral dam, four unbalanced founded load paths support the annulus.
 for(let [x,y,X] of [[664,681,624],[825,771,832],[1305,754,1365],[1462,666,1501]]){
 L(x,y,X,860,19,M.steel);L(x+11,y+13,X+21,859,6,M.pipe);R(X-28,844,81,17,M.basalt);}
 // Sampling workfaces separated by flyable portals, nonuniform local morphology.
 for(let [x,y,w] of [[657,426,85],[738,352,73],[1183,352,105],[1354,436,92],[676,658,91],[837,730,125],[1170,730,110],[1358,652,108]]){
 R(x,y,w,8,M.steel);R(x+7,y-28,15,28,M.slate);R(x+29,y-24,Math.min(39,w-41),23,M.glass);R(x+w-17,y-35,9,30,M.cyan);}
 for(let j=0;j<11;j++){let x=730+j*55,y=480+Math.round(38*Math.sin(j*1.9));if(j===5||j===6)continue;L(x,y-33,x+12,y+12,7,M.pipe);R(x-13,y-39,27,12,M.glass);R(x-9,y-53,9,12,M.amber);}
 // West resident propagation and registry workyard, not five divided islands.
 P([[42,834],[42,721],[129,700],[211,725],[272,687],[378,708],[484,681],[526,746],[526,860]],M.basalt);
 for(let [x,y,w] of [[94,549,204],[135,655,223],[330,604,168]]){R(x,y,w,10,M.steel);R(x+17,y+10,w-34,4,M.blue);}
 for(let [x,y,w,h] of [[112,479,124,55],[326,520,124,50],[147,587,112,47]]){
 R(x,y,w,7,M.shield);R(x,y+7,10,h,M.slate);R(x+w-10,y+7,10,h,M.slate);R(x+22,y+16,w-44,9,M.glass);R(x+30,y+29,24,8,M.cyan);}
 L(151,555,212,833,12,M.steel);L(436,605,460,834,11,M.pipe);
 for(let [x,y] of [[90,682],[261,662],[383,681]]){R(x,y,66,11,M.steel);R(x+11,y-31,40,29,M.glass);R(x+25,y-44,9,13,M.amber);}
 // East quarantine and radial cargo shunts with asymmetrical upper and lower habitats.
 P([[1513,860],[1518,751],[1594,732],[1674,746],[1773,716],[1867,733],[1998,702],[2048,740],[2048,860]],M.basalt);
 for(let [x,y,w] of [[1535,495,213],[1667,601,245],[1810,702,189]]){R(x,y,w,10,M.steel);R(x+19,y+10,w-38,4,M.blue);}
 for(let [x,y,w,h] of [[1571,434,157,57],[1712,532,165,60],[1841,634,135,62]]){
 R(x,y,w,8,M.shield);R(x+2,y+8,8,h,M.pipe);R(x+w-10,y+8,8,h,M.pipe);R(x+21,y+16,45,28,M.glass);R(x+30,y+8,10,7,M.cyan);R(x+81,y+18,24,19,M.amber);}
 L(1585,509,1602,858,15,M.steel);L(1907,708,1932,859,13,M.pipe);
 R(1562,778,109,8,M.steel);R(1581,749,35,28,M.blue);L(1803,437,1976,398,9,M.grate);R(1969,385,15,32,M.amber);
 // Three physically open shafts are cut AFTER the inhabited ground polygons.
 for(let [x,w,top] of [[202,97,758],[984,115,769],[1741,121,757]])R(x,top,w,983-top,0);
 // Thinner floor-mounted lower field instruments leave a full-hull passable upper gallery.
 for(let [x,y,w] of [[109,976,93],[403,976,102],[744,976,96],[1158,976,114],[1466,976,114],[1834,976,91]]){
 R(x,y,w,5,M.steel);R(x+12,y-19,21,18,M.glass);R(x+39,y-27,9,26,M.slate);R(x+w-20,y-18,10,17,M.cyan);}
 // Larger no-op stage sockets, not scripted mechanics; alternate routes remain.
 R(1143,820,191,10,M.grate);R(1152,817,34,3,M.amber);
 R(572,799,124,9,M.grate);R(1407,790,139,9,M.grate);
 R(199,797,64,7,M.pipe);R(1764,787,63,7,M.pipe);

 let tieCount=0;
 function tie(){
  let mark=new Int32Array(N),q=new Int32Array(N),parts=[{edge:true}],edges=new Map();
  for(let i=0;i<N;i++)if(g[i]&&!mark[i]){let id=parts.length,h=0,t=1,edge=false;q[0]=i;mark[i]=id;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!mark[b]){mark[b]=id;q[t++]=b;}}parts.push({edge,count:t});}
  let owner=new Int32Array(N),origin=new Int32Array(N),dist=new Uint16Array(N),qq=new Int32Array(N),h=0,t=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;qq[t++]=i;}
  while(h<t){let a=qq[h++],x=a%W,v=owner[a];for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N){
   if(!owner[b]){owner[b]=v;origin[b]=origin[a];dist[b]=dist[a]+1;qq[t++]=b;}
   else if(owner[b]!==v){let key=Math.min(v,owner[b])+":"+Math.max(v,owner[b]),len=dist[a]+dist[b]+1,z=edges.get(key);if(!z||len<z.len)edges.set(key,{a:origin[a],b:origin[b],oa:v,ob:owner[b],len});}}}
  let parent=new Int32Array(parts.length);for(let i=0;i<parts.length;i++)parent[i]=parts[i].edge?0:i;
  function root(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
  let joins=0,max_span=0;for(let e of [...edges.values()].sort((a,b)=>a.len-b.len)){let a=root(e.oa),b=root(e.ob);if(a===b)continue;L(e.a%W,e.a/W|0,e.b%W,e.b/W|0,4,M.grate);parent[a]=b;joins++;max_span=Math.max(max_span,e.len);}
  for(let i=1;i<parts.length;i++)if(root(i)!==root(0))throw Error("Disconnected rock "+i);
  return {raw_components:parts.length-1,ties:joins,max_span};
 }


 const reconciled=tie();
 const sites={"West arrival basin":[75,365],"West registry porch":[150,438],"West propagator":[383,463],"West foundry lookdown":[410,414],"West high bypass":[510,249],"Outer rim west":[585,492],"North west loop":[782,245],"North culture crown":[1015,211],"North east loop":[1279,240],"East outer rim":[1490,400],"East upper bypass":[1530,233],"East quarantine approach":[1685,402],"East clean vault":[1851,518],"East skyline exit":[1970,310],"Eastern dispatch":[1950,663],"Eastern low shelf":[1660,694],"South west rim":[696,773],"South east rim":[1240,804],"Biosieve inner west":[910,535],"Living core":[1050,541],"Biosieve inner east":[1180,550],"Censer lower cusp":[1046,711],"West descent mouth":[248,811],"Middle descent mouth":[1037,803],"East descent mouth":[1801,813],"West dry transit":[421,923],"Centre dry transit":[1065,923],"East dry transit":[1536,923],"East purge interlock":[1740,663]};
 const ties={joins:tieCount+reconciled.ties,max_span:reconciled.max_span};
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N),overlap=0;
 for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let v=g[o+x],s=x;while(x<W&&g[o+x]===v)x++;if(!v)continue;let key=s+":"+(x-s)+":"+v,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,v]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,v] of rect){hist[v]=(hist[v]||0)+w*h;area+=w*h;for(let j=y;j<y+h;j++){for(let i=x;i<x+w;i++)if(replay[j*W+i])overlap++;replay.fill(v,j*W+x,j*W+x+w);}}
 if(rect.length>32768||area>32000000||overlap)throw Error("Rect budget failure "+JSON.stringify({rectangles:rect.length,area,overlap}));
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Rectangle replay failure at "+i);
 let seen=new Uint8Array(N),q=new Int32Array(N),grounded=0,detached=0,components=0;
 for(let i=0;i<N;i++)if(g[i]&&!seen[i]){let h=0,t=1,edge=false;seen[i]=1;q[0]=i;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!seen[b]){seen[b]=1;q[t++]=b;}}components++;if(edge)grounded+=t;else detached+=t;}
 if(detached)throw Error("Unrooted solids "+detached);
 function flood(w,h,box){let stride=W+1,I=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){let solid=g[o+x-1]||(box&&x-1>=box[0]&&x-1<box[2]&&y-1>=box[1]&&y-1<box[3]);row+=solid?1:0;I[y*stride+x]=I[(y-1)*stride+x]+row;}}
 let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N);for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;if(!(I[d*stride+c]-I[d*stride+a]-I[b*stride+c]+I[b*stride+a]))pass[y*W+x]=1;}
 let s=sites["West arrival basin"],i=s[1]*W+s[0],hd=0,tl=0;if(!pass[i])throw Error("Spawn obstructed");queue[tl++]=i;vis[i]=1;
 while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
 let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p}));return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[1710,635,1770,695],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="East purge interlock")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrival basin"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-west-registry",30,400,510,460],["02-annular-north",610,180,790,430],["03-censer-culture",660,420,730,415],["04-east-purge",1510,360,538,495],["05-dry-return",190,855,1690,169]]};
}


function packageFilesOld(){
 const a=build(),images=[],records=[];
 for(let [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){
  const bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});
  records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_EXACT_FINAL_GRID"});
 }
 const receipt={
  project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Mireward Levee Communes",sibling:3,role:"Vesper Inverted Root Orchard / Hanging Culture Exchange",
  seed:"mireward-vesper-inverted-root-orchard-261121-v1",
  map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
  engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
  donors:[{slug:"wide-harrow-mere-spore-dam",pr:64,head:"1202aea8d696e2bfecd7e4f3353c9738a9435858"},{slug:"wide-threnody-scar-foldwing-seedlift",pr:73,head:"00cb6b6b86b875d8b81cc387c711aa56f172d9dd"}],
  extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,
  solid_components:a.components,physical_tethers:a.ties,lossless_rectangles:a.rect.length,source_rectangle_limit:32768,
  source_max_json_bytes:1048576,rectangle_work_cells:a.area,setup_bytes:a.json.length,
  plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),
  literal_sites:a.sites,midge_full_hull_clearances:a.routes,
  obstruction:{box:a.box,blocked_site:"East purge interlock",result:a.obstruction},indexed_images:records,
  qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD",
  caveat:"Accepted 32768 source rectangles distinct from unmeasured 4096 installed bridge fallback"
 };
 const exemplar={
  schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
  family:"Mireward Levee Communes",lane:"Xenobiome / Frontier Clusters",
  map_role:"Sibling 03 — Vesper Inverted Root Orchard / Hanging Culture Exchange",
  anchor_donors:["wide-harrow-mere-spore-dam","wide-threnody-scar-foldwing-seedlift"],
  macro_topology:["suspended","mixed"],
  density_profile:"Dense unequal hanging galleries at both ends, nonuniform canopy culture sleeves and a large central flight lumen over sparse dry salvage",
  route_grammar:{primary:"West lantern, suspended orchard, central lumen, eastern quarantine and freight",
    alternate:"Three separated upper cableway spans, midair cross-cavern recovery and bottom dry service",
    recovery:"Opaque customs obstruction denies only its named chamber; independent upper and lower routes remain"},
  strong_motifs:["inverted roof-rooted biological production","discontinuous twin cableways","unequal suspended lantern wharves","nonuniform hanging culture sleeves","dry lower recovery tunnels"],
  interesting_relationships:["Geological ceiling supports production hardware independently of the bedrock floor","Suspended biological workfaces alternate with large unoccupied flyable gaps","Upper and lower traversal remain connected around one physically obstructed customs chamber"],
  authoring_affordances:[
   {site:"Crown append seam",center:[1245,402],use:"New bridge or hanging culture cassette"},
   {site:"Central lumen",center:[1086,692],use:"Large editable transit/chase volume"},
   {site:"Customs checkpoint",center:[1155,842],use:"Holdout threshold with recovery"},
   {site:"East freight margin",center:[1994,687],use:"Further cargo connector"}
  ],
  setpiece_candidates:[
   {name:"Rootfall release",center:[525,594],kind:"destructible suspended landmark",exits:"Midair bypass and lower service"},
   {name:"Customs isolation",center:[1155,842],kind:"ambush/holdout",exits:"High and low alternate routes"},
   {name:"Freight launch",center:[1994,687],kind:"departure stage",exits:"Upper eastern sky and basal salvage"},
   {name:"Lumen chase",center:[1086,692],kind:"midair pursuit",exits:"Cross-cavern height changes"}
  ],
  procedural_exemplar_value:["Roof-rooted suspension versus floor-rooted industrial construction","Independent cable spans and traversable discontinuities","Upper hanging workfaces over authored empty middle and basal recovery","Variable-depth culture cassette motifs"],
  similarity_avoidance:"Mireward 01 uses shallow polder islands; Mireward 02 is a descending continuous escarpment; this new suspended roof-rooted orchard is neither. Unlike Quoin's V-crater station, it has no central gravitic instrument or basin spanning rotor.",
  diversity_axes:{macro_topology:["suspended"],altitude_grammar:["multi_strata","high_low_bypass"],density_cadence:["dense_open_dense"],route_structure:["parallel_lanes","branch_rejoin"],landmark_family:["cableway","gantry"],support_form:["roof_rooted"],environment_relation:["biological","dry"],incompleteness:["editable_gaps","modular_append_zones"]},
  geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}
 };
 const readme=[
 "# Mireward Levee Communes — Sibling 03: Vesper Inverted Root Orchard / Hanging Culture Exchange","",
 "**NEW original 2048×1024 material-cell canvas · CREATOR-STATIC-PASS · NATIVE-UNTESTED · OPEN Draft/HOLD.**","",
 "The Xenobiome world hangs from an inverted basalt ceiling: western lantern registry, roof-rooted culture orchard, wide open midair custody exchange, eastern quarantine lantern and separate dry basal salvage works. Continuous central voids and incomplete work sockets are intentional manual-authoring opportunities, not missing geometry.",
 "",
 "**Anchor vocabulary:** Harrow Mere #64 at 1202aea8d696e2bfecd7e4f3353c9738a9435858 and Threnody Scar #73 at 00cb6b6b86b875d8b81cc387c711aa56f172d9dd. Borrowed biological engineering and xenoseed logistics only; no donor pixels, rectangle streams, machinery stamps, routes, coordinates, district layout or names.",
 "",
 "## Source-static qualification","",
 "- Final plane 2,097,152 cells, "+a.area+" occupied / "+a.grounded+" grounded, 0 unsupported. Ordered non-overlapping Setup-v2 rectangles "+a.rect.length+" / 32768; Setup JSON bytes "+a.json.length+" / 1048576.",
 "- Exact named Midge destination reachability, 19x15 / 23x19 / 31x27: "+a.routes.map(r=>r.passed+"/"+r.total).join(" ; ")+". Real opaque obstruction "+JSON.stringify(a.box)+" denies only customs chamber, leaving "+a.obstruction.passed+"/"+a.obstruction.total+" sites accessible.",
 "- Plane SHA256 "+receipt.plane_sha256+"; Setup SHA256 "+receipt.setup_sha256+". Fixed seed "+receipt.seed+". Deterministic regeneration: node build.cjs. Check committed bytes with node build.cjs --verify.",
 "- Accepted CyberSand main "+receipt.engine_readonly_main+" was read-only. Source 32768 limit is not an installed-bridge admission claim; installed legacy fallback may have only 4096. Actual Godot/Workbench/CyberDemoBridge/Rapier actor flight, physical collisions/ticks, cold save/reopen are NATIVE-UNTESTED. Independent Art/Technical/Shepherd reviews PENDING. Never Ready/merge without owner.",
 "",
 "## Genuine indexed material-cell images","",
 "![Complete material-cell world](./overview.png)","",
 ...records.slice(1).map(r=>"!["+r.name+"](./"+r.name+")"),""
 ].join("\n");
 return {a,images,receipt,exemplar,readme};
}


function packageFiles(){
 let x=packageFilesOld(),a=x.a,r=x.receipt,e=x.exemplar;
 r.family="Mireward Levee Communes";r.sibling=4;r.role="Censer Loop / Radial Biofilter Commons";
 r.seed="mireward-censer-loop-radial-biofilter-261121-v1";
 r.donors=[{slug:"wide-harrow-mere-spore-dam",pr:64,head:"1202aea8d696e2bfecd7e4f3353c9738a9435858"},{slug:"wide-graftloom-slipway",pr:22,head:"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657"}];
 e.map_role="Sibling 04 — Censer Loop / Radial Biofilter Commons";
 e.anchor_donors=["wide-harrow-mere-spore-dam","wide-graftloom-slipway"];e.macro_topology=["ring","basin"];
 e.density_profile="Grounded asymmetric workyards framing a partly open and broken stationary annular cultural filter, broad centre, dry lower service";
 e.route_grammar={primary:"West registry, radial field approaches, open annular interior and east purge",alternate:"Upper free-flight and three descent shafts feeding an unobstructed dry return",recovery:"Local physical eastern purge obstruction avoids routing through the disabled threshold"};
 e.strong_motifs=["Interrupted broad annular fixed assay frame","four asymmetric founded radial piers","inhabited west reed registry","east xenocustody dispatch","three dry lower entrances"];
 e.interesting_relationships=["Empty annular core is useful event/edit space","Radial suspended field has four founded supports without imitating a dam rotor","Three entrances admit a dry service recovery path"];
 e.authoring_affordances=[{site:"Editable living core",center:[1050,541],use:"New culture engine"},{site:"West loop joint",center:[585,492],use:"Reroutable crossing"},{site:"Southern exchange",center:[1046,711],use:"Activation stage"},{site:"East open append seam",center:[1970,310],use:"Remote freight expansion"}];
 e.setpiece_candidates=[{name:"Southern annular shear",center:[696,773],kind:"bridge failure",exits:"Sky or dry gallery"},{name:"Living court",center:[1050,541],kind:"reveal",exits:"Four incomplete ring portals"},{name:"Purge threshold",center:[1740,663],kind:"holdout/interlock",exits:"Upper sky and basal bypass"},{name:"East freight",center:[1950,663],kind:"departure",exits:"Sky or eastern descent"}];
 e.procedural_exemplar_value=["Nested stationary broken ring sections with physical flyable portals","Four dissimilar founded load paths","Three distinct vertical entrances to one dry recovery lane","Purposeful useful void in center"];
 e.similarity_avoidance="Unlike Mireward 01 polder islands, 02 descending biofilter hillside and 03 roof-rooted hanging culture, this facility is a ground-founded broken annular research commons. No Harrow pressure dam, diaphragm or donor coordinates are copied.";
 e.diversity_axes={macro_topology:["ring","basin"],altitude_grammar:["high_low_bypass","multi_strata"],density_cadence:["dense_open_dense"],route_structure:["loop","branch_rejoin"],landmark_family:["ring","gantry"],support_form:["multi_leg","floor_rooted"],environment_relation:["biological","dry"],incompleteness:["editable_gaps","modular_append_zones"]};
 e.geometry_evidence={literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:r.plane_sha256};
 x.readme=[
 "# Mireward Levee Communes — Sibling 04: Censer Loop / Radial Biofilter Commons","",
 "**NEW ORIGINAL 2048×1024 indexed CyberSand material-cell world · OPEN Draft/HOLD · NATIVE-UNTESTED**","",
 "A large asymmetrical stationary segmented annular culture framework, resident west reagent works, eastern sterility/shipping, and three dry return shafts. The broken ring and empty living centre are intentional authoring spaces.",
 "",
 "Donors: Harrow Mere #64 @ 1202aea8d696e2bfecd7e4f3353c9738a9435858 and Graftloom #22 @ b0d1e5216aabb9b5e009e599ffbffcec6fd8a657. Family language: basalt-grounded bioindustrial machinery, specimen custody, inert sample screens and asymmetric structural supports. NEW: ring rather than dam, low-founded service rather than hanging canopy, three-shaft dry recovery. No donor pixels, route plans, rectangle streams or district layouts reused.",
 "",
 "## Qualification (creator source-static only)","",
 "- Exactly 2,097,152 indexed material-ID cells. Occupied "+a.area+"; physically grounded "+a.grounded+"; zero detached/unsupported writes.",
 "- "+a.rect.length+" lossless nonoverlapping ordered Setup-v2 rectangles of source capacity 32768, bytes "+a.json.length+" of 1048576; no invalid writes, all bytes exactly reproduce the final grid.",
 "- Exact Midge full-hull sites at 19×15,23×19,31×27: "+a.routes.map(v=>v.passed+"/"+v.total).join(" ; ")+". A temporary physical purge obstruction "+JSON.stringify(a.box)+" preserves "+a.obstruction.passed+"/"+a.obstruction.total+" sites.",
 "- Grid SHA256 "+r.plane_sha256+"; Setup SHA256 "+r.setup_sha256+". Fixed deterministic seed "+r.seed+". Run node build.cjs --verify for committed bytes.",
 "- Accepted CyberSand main "+r.engine_readonly_main+" was READ-ONLY. Native Workbench/CyberDemoBridge/Rapier gameplay, collisions, ticks and save/reopen NATIVE-UNTESTED. Installed bridge may retain 4096 rectangle fallback; 32768 source max does not prove admission. Independent Art, Technical, Shepherd PENDING. Never Ready or merge without owner.",
 "",
 "## Authentic material-cell gallery","", "![Complete grid](./overview.png)","",
 ...x.images.slice(1).map(o=>"!["+o.name+"](./"+o.name+")"),""
 ].join("\n");
 return x;
}

const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d]of files){let b=Buffer.from(d),p=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Byte mismatch "+name);}else fs.writeFileSync(p,b);}console.log(JSON.stringify({qualification:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),native:"NATIVE-UNTESTED"}));
