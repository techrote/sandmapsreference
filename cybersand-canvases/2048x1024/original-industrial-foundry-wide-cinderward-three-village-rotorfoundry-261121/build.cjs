'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+72)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;let bits=msg.length*8,V=new DataView(b.buffer);V.setUint32(n-8,Math.floor(bits/4294967296),false);V.setUint32(n-4,bits>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),r=(x,n)=>(x>>>n)|(x<<(32-n));for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)w[i]=V.getUint32(o+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(r(x,7)^r(x,18)^(x>>>3))+w[i-7]+(r(y,17)^r(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(r(f,6)^r(f,11)^r(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((r(a,2)^r(a,13)^r(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),seed=261121958,M={0:"empty",3:"water",8:"lava",58:"reinforced concrete",62:"steel plate",65:"rusted steel",68:"steel pipe",69:"copper pipe",76:"hazard stripe",79:"neon amber",100:"basalt columns",104:"firebrick",117:"bare iron",131:"heat shield"};
 let sd=seed>>>0;const rand=()=>{sd^=sd<<13;sd^=sd>>>17;sd^=sd<<5;return (sd>>>0)/4294967296;};
 const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
 const ln=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(3,t/2));for(let i=0;i<=n;i++){let f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
 const ring=(cx,cy,rx,ry,t,m)=>{for(let yy=-ry;yy<=ry;yy++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/ry/ry))),v=Math.abs(yy)<ry-t?Math.floor((rx-t)*Math.sqrt(Math.max(0,1-yy*yy/(ry-t)/(ry-t)))):-1;if(a>v){b(cx-a,cy+yy,a-v,1,m);b(cx+v+1,cy+yy,a-v,1,m);}}};
 const pool=(x,y,w,h,m)=>{b(x,y,w,h,117);b(x+8,y+8,w-16,h-16,104);b(x+18,y+18,w-36,h-36,m);b(x+23,y-10,w-46,10,62);};
 const house=(x,y,w,h)=>{b(x,y,w,h,58);b(x+12,y+14,w-24,h-26,0);b(x,y,12,h,117);b(x+w-12,y,12,h,117);b(x+8,y+7,w-16,9,62);b(x+15,y+h-19,w-30,11,65);for(let xx=x+25;xx<x+w-25;xx+=38){b(xx,y+30,12,18,69);b(xx+3,y+34,6,10,79);}};
 // Three unequal functional industrial townships, not a repeated stamp.
 b(0,0,W,28,100);b(0,863,W,161,100);b(40,846,1968,17,58);b(40,838,1968,8,62);
 for(const [x,w,y]of[[55,460,816],[655,670,821],[1460,535,821]]){b(x,y,w,23,58);for(let xx=x+26;xx<x+w-25;xx+=91)b(xx,y-49,15,49,68);}
 house(64,730,133,92);house(215,763,94,58);house(325,748,143,75);
 for(const [x,y,w]of[[64,727,133],[215,760,94],[325,746,143]]){ln(x,y,x+w/2,y-35,7,65);ln(x+w/2,y-35,x+w,y,7,65);}
 for(const x of[112,254,396]){b(x,695,13,28,68);b(x-7,685,26,10,62);}
 pool(336,770,94,59,8);b(367,717,17,50,117);ln(428,805,501,765,8,69);
 b(475,739,89,14,62);b(496,753,12,92,68);b(544,753,12,92,68);
 // Shared industrial guild rotor, not a linear assembly-line silhouette.
 b(766,766,433,13,62);b(784,779,15,68,58);b(1181,779,15,67,58);
 ring(1050,754,136,81,13,62);ring(1050,754,102,59,6,69);b(1040,709,19,133,117);
 for(let a=0;a<8;a++){let ang=a*Math.PI/4;ln(1050,754,1050+95*Math.cos(ang),754+54*Math.sin(ang),7,a%2?65:117);}
 b(918,823,272,14,58);house(800,789,74,60);house(1218,788,113,62);
 for(const [x,w,h]of[[704,61,48],[784,40,59],[1281,42,44],[1370,72,58]]){b(x,746-h,w,11,65);b(x+9,757-h,w-18,h-12,68);b(x+11,751-h,w-22,7,76);}
 // East village: quench, separated freight gate, worker shelters and rail cars.
 house(1493,766,127,81);house(1796,738,168,108);pool(1628,741,121,88,3);
 b(1738,780,72,14,62);ln(1718,805,1793,771,8,69);b(1823,713,124,10,62);
 for(const x of[1530,1580,1831,1890,1938]){b(x,693,11,43,68);b(x-7,686,24,8,79);}
 for(const [x,ww]of[[1831,47],[1893,44]]){b(x,790,ww,21,65);b(x+10,796,ww-20,9,131);ring(x+9,811,9,9,4,117);ring(x+ww-9,811,9,9,4,117);}
 // Continuous aerial foundry on hanging gantries with asymmetrical room clusters.
 for(const [x,y,w] of [[98,224,429],[629,169,581],[1352,236,573]]){b(x,y,w,14,62);b(x+15,y+14,w-30,8,117);for(let xx=x+24;xx<x+w-30;xx+=83){ln(xx,y+26,xx+30,y+57,7,68);ln(xx+30,y+57,xx+66,y+26,7,68);}}
 for(const [x,y,w,h]of[[171,268,141,82],[345,289,147,72],[742,252,152,105],[972,277,98,75],[1515,293,144,67],[1717,265,150,93]]){b(x,y,w,h,117);b(x+12,y+13,w-24,h-25,131);for(let xx=x+27;xx<x+w-20;xx+=33)b(xx,y+28,13,14,79);}
 pool(217,293,69,60,8);pool(377,306,69,52,8);ln(460,350,608,319,8,69);
 b(735,241,297,14,58);b(759,255,15,68,68);b(990,255,15,68,68);
 b(813,308,145,87,117);b(828,322,112,60,104);b(845,339,78,27,8);b(804,396,151,12,62);ln(944,386,1071,364,9,69);
 b(1021,299,317,17,58);for(const [x,w]of[[1055,57],[1134,39],[1192,56],[1273,45]]){b(x,343,w,10,65);b(x+9,354,w-18,27,68);ln(x+10,381,x+w-9,394,7,117);}
 b(1454,336,404,17,58);b(1475,296,120,31,131);b(1608,298,77,28,65);ln(1680,322,1750,348,8,69);
 ring(1760,285,34,34,9,62);ring(1837,286,24,24,8,62);
 for(const [x,y,w]of[[516,774,90],[619,800,38],[1347,795,82],[1438,766,40],[1680,841,77]]){b(x,y,w,9,62);b(x+9,y+9,9,Math.max(1,845-y-9),68);if(w>60){b(x+29,y-19,25,18,117);b(x+35,y-31,10,12,69);}}
 for(const [x,y,w]of[[66,812,119],[320,814,123],[731,810,88],[1507,817,71],[1835,812,121]])for(let xx=x+9;xx<x+w-10;xx+=16+Math.floor(rand()*6))b(xx,y,7,4,rand()<0.5?69:65);
 // Two real broad free-centre transverse routes, connecting upper and main tier.
 b(35,551,1978,123,0);b(35,412,1978,69,0);
 const sites=[["West arrival",96,611],["Ore hamlet",262,612],["Smelter face",438,612],["West junction",584,612],["Aerial west",540,438],["Guild inlet",735,613],["Ladle handoff",903,613],["Rotor lookout",1147,612],["Aerial caster",1192,437],["Guild outfeed",1305,612],["East maintenance",1433,612],["Quench laboratory",1552,612],["Quench controls",1682,612],["Aerial east",1741,438],["Freight terminal",1841,613],["East export goal",1950,612]].map(([name,x,y])=>({name,x,y}));
 for(const p of sites)b(p.x-18,p.y-16,37,33,0);
 // Explicit load-path completion: solid components connect to a real world edge.
 function isolated(){const seen=new Uint8Array(g.length),q=new Int32Array(g.length),solid=i=>g[i]!==0&&g[i]!==3&&g[i]!==8;let h=0,t=0;for(let x=0;x<W;x++)for(const i of[x,(H-1)*W+x])if(solid(i)&&!seen[i]){seen[i]=1;q[t++]=i;}while(h<t){let i=q[h++],x=i%W;for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W])if(j>=0&&j<g.length&&solid(j)&&!seen[j]){seen[j]=1;q[t++]=j;}}let groups=[];for(let i=0;i<g.length;i++)if(solid(i)&&!seen[i]){let a=[i],p=0;seen[i]=1;while(p<a.length){let z=a[p++],x=z%W;for(const j of[x?z-1:-1,x+1<W?z+1:-1,z-W,z+W])if(j>=0&&j<g.length&&solid(j)&&!seen[j]){seen[j]=1;a.push(j);}}groups.push(a);}return groups;}
 for(let pass=0;pass<3;pass++){let comps=isolated();if(!comps.length)break;for(const c of comps){let low=H,high=0,up=-1,down=-1;for(const i of c){let x=i%W,y=i/W|0;if(sites.some(p=>Math.abs(x-p.x)<55))continue;if(y<low){low=y;up=i;}if(y>high){high=y;down=i;}}if(up<0){low=H;for(const i of c){let y=i/W|0;if(y<low){low=y;up=i;}if(y>high){high=y;down=i;}}}if(low<542&&up>=0){let x=up%W;b(x,27,2,Math.max(1,low-26),68);}else if(down>=0){let x=down%W;b(x,high,2,H-high,68);}}}
 return {W,H,g,seed,sites,spawn:[96,611],M,isolated_after:isolated().length};
}

function encode(g,W,H){let out=[],a=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let m=g[y*W+x],start=x++;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=start+":"+(x-start)+":"+m,r=a.get(key);if(r)r[3]++;else{r=[start,y,x-start,1,m];out.push(r);}now.set(key,r);}a=now;}return out;}

function replay(w,rect){let{g,W,H}=w,N=g.length,copy=new Uint8Array(N),seen=new Uint8Array(N),hist={};let work=0,overlap=0,mismatch=0;
 for(const[x,y,ww,hh,m]of rect){if(x<0||y<0||ww<1||hh<1||x+ww>W||y+hh>H||!(m in w.M))throw Error("rectangle");work+=ww*hh;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){let i=yy*W+xx;if(seen[i])overlap++;seen[i]=1;copy[i]=m;}}
 let solid=0,air=0,cross=0;for(let i=0;i<N;i++){if(copy[i]!==g[i])mismatch++;let m=g[i];hist[m]=(hist[m]||0)+1;if(m&&m!==3&&m!==8)solid++;if(m===3||m===8){let x=i%W;for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W]){if(j<0||j>=N||!g[j])air++;if(j>=0&&j<N&&(g[j]===3||g[j]===8)&&g[j]!==m)cross++;}}}
 if(overlap||mismatch)throw Error("bad replay");
 return {count:rect.length,work,hist,solid,detached:w.isolated_after,air,cross};
}

function route(w,ww,hh,block){const{W,H,sites,spawn}=w,N=W*H,g=block?w.g.slice():w.g;if(block){let[x,y,wide,high]=block;for(let yy=y;yy<y+high;yy++)g.fill(58,yy*W+x,yy*W+x+wide);}let S=W+1,sum=new Int32Array(S*(H+1));for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){row+=g[(y-1)*W+x-1]?1:0;sum[y*S+x]=sum[(y-1)*S+x]+row;}}
 let dx=ww>>1,dy=hh>>1,free=new Uint8Array(N);for(let y=dy;y+hh-dy<=H;y++)for(let x=dx;x+ww-dx<=W;x++){let l=x-dx,t=y-dy,r=l+ww,b=t+hh;if(sum[b*S+r]-sum[t*S+r]-sum[b*S+l]+sum[t*S+l]===0)free[y*W+x]=1;}
 let dist=new Int32Array(N),q=new Int32Array(N);dist.fill(-1);let start=spawn[1]*W+spawn[0],f=0,z=0;if(free[start]){q[z++]=start;dist[start]=0;}while(f<z){let i=q[f++],x=i%W;for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&dist[j]===-1){dist[j]=dist[i]+1;q[z++]=j;}}
 let ss=sites.map(p=>({...p,clear:!!free[p.y*W+p.x],steps:dist[p.y*W+p.x],reached:dist[p.y*W+p.x]>=0}));return {hull:[ww,hh],connected_centres:z,passed:ss.filter(p=>p.reached).length,sites:ss,goal_steps:ss[ss.length-1].steps};
}

function join(xs){let n=0;for(let x of xs)n+=x.length;let out=new Uint8Array(n),j=0;for(let x of xs){out.set(x,j);j+=x.length;}return out;}

function be(v){return Uint8Array.of(v>>>24&255,v>>>16&255,v>>>8&255,v&255);}

function crc(a){let c=-1;for(let x of a){c^=x;for(let j=0;j<8;j++)c=c>>>1^((c&1)?0xedb88320:0);}return (c^(-1))>>>0;}

function adler(a){let x=1,y=0;for(let v of a){x=(x+v)%65521;y=(y+x)%65521;}return ((y<<16)|x)>>>0;}

function chunk(tag,d){let b=join([utf(tag),d]);return join([be(d.length),b,be(crc(b))]);}

function png(g,W,x,y,w,h){let raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++)raw.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*(w+1)+1);
 let zz=[Uint8Array.of(0x78,1)];for(let i=0;i<raw.length;){let n=Math.min(65535,raw.length-i),z=new Uint8Array(n+5);z[0]=i+n===raw.length?1:0;z[1]=n&255;z[2]=n>>>8;z[3]=~n&255;z[4]=~n>>>8&255;z.set(raw.subarray(i,i+n),5);zz.push(z);i+=n;}zz.push(be(adler(raw)));
 let palette=new Uint8Array(132*3),colors={0:[8,11,18],3:[47,127,210],8:[241,78,31],58:[119,123,128],62:[126,141,153],65:[124,63,43],68:[102,119,129],69:[165,92,54],76:[227,182,47],79:[255,181,46],100:[54,56,61],104:[200,152,98],117:[90,94,100],131:[26,26,29]};for(const[k,v]of Object.entries(colors))palette.set(v,k*3);
 return join([Uint8Array.of(137,80,78,71,13,10,26,10),chunk("IHDR",join([be(w),be(h),Uint8Array.of(8,3,0,0,0)])),chunk("PLTE",palette),chunk("IDAT",join(zz)),chunk("IEND",new Uint8Array(0))]);}

function pngCheck(p,g,W,x,y,w,h){let v=new DataView(p.buffer,p.byteOffset,p.byteLength),at=8,z=null,tags=[];for(let j=0;j<8;j++)if(p[j]!==[137,80,78,71,13,10,26,10][j])throw Error("signature");
 while(at<p.length){let n=v.getUint32(at,false),tag=String.fromCharCode(...p.subarray(at+4,at+8));if(crc(p.subarray(at+4,at+8+n))!==v.getUint32(at+8+n,false))throw Error("crc");if(tag==="IDAT")z=p.subarray(at+8,at+8+n);if(tag==="IHDR"&&(v.getUint32(at+8,false)!==w||v.getUint32(at+12,false)!==h))throw Error("dimensions");tags.push(tag);at+=12+n;if(tag==="IEND")break;}if(at!==p.length||tags.join()!=="IHDR,PLTE,IDAT,IEND")throw Error("chunks");
 let raw=new Uint8Array((w+1)*h),i=2,k=0,done=false;while(!done){let flag=z[i++];done=!!(flag&1);if(flag&6)throw Error("deflate");let n=z[i]|z[i+1]<<8,nc=z[i+2]|z[i+3]<<8;i+=4;if(((n^nc)&65535)!==65535)throw Error("deflate length");raw.set(z.subarray(i,i+n),k);i+=n;k+=n;}if(k!==raw.length||adler(raw)!==((z[i]*16777216+z[i+1]*65536+z[i+2]*256+z[i+3])>>>0))throw Error("adler");for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)])throw Error("filter");for(let xx=0;xx<w;xx++)if(raw[yy*(w+1)+xx+1]!==g[(y+yy)*W+x+xx])throw Error("pixel");}return w*h;}

function build(BASE,EX,CROPS,README,META){
 let w=world(),rr=encode(w.g,w.W,w.H),a=replay(w,rr),routes=[[19,15],[23,19],[31,27]].map(q=>route(w,...q,null)),block=[1016,550,80,128],blocked=route(w,31,27,block);
 let direct=routes[2].goal_steps,detour=blocked.goal_steps;
 if(a.detached||a.air||a.cross||routes.some(q=>q.passed!==w.sites.length)||blocked.passed!==w.sites.length||direct<0||detour<=direct)throw Error("STATIC_GATE "+JSON.stringify({proof:a,sites:w.sites.length,passes:routes.map(q=>q.passed),blocked:blocked.passed,failed:blocked.sites.filter(q=>!q.reached),distance:[direct,detour]}).slice(0,1700));
 let setup={...BASE,edits:rr,actors:BASE.actors.map((v,i)=>i?v:{...v,spawn:w.spawn})},s=JSON.stringify(setup);if(rr.length>32768||utf(s).length>1048576)throw Error("max setup");
 let pngs={},imgs={},pixels=0;for(let [file,x,y,wi,he]of CROPS){let p=png(w.g,w.W,x,y,wi,he);pixels+=pngCheck(p,w.g,w.W,x,y,wi,he);pngs[file]=p;imgs[file]={xywh:[x,y,wi,he],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema_version:1,concept:META.title,original_no_source:true,seed:w.seed,base_main_sha:META.base,engine_sha:META.engine,extent:[2048,1024],source_grid_sha256:sha256(w.g),setup_sha256:sha256(utf(s)),json_bytes:utf(s).length,rectangle_count:rr.length,rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.solid,rooted:a.solid-a.detached,detached:a.detached},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,initial_air_faces:a.air,water_lava_contacts:a.cross},spawn:w.spawn,route_sites:w.sites,flights:routes,obstruction:block,blocked,shortest_goal:{direct,blocked:detour,delta:detour-direct},pngs:imgs,pixel_parity:pixels,native:"NATIVE-UNTESTED",independent_review:"PENDING",ci:"NOT_RUN"};
 return {files:{"setup.json":s,"receipt.json":JSON.stringify(receipt,null,2)+"\n","exemplar.json":JSON.stringify(EX,null,2)+"\n","README.md":README,...pngs},receipt};
}


const BASE={"version":2,"extent":[2048,1024],"actors":[{"id":1,"model":"midge","hash":"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96","spawn":[95,690],"options":{"budget":20,"mass_multiplier":1,"inertia_multiplier":1,"thrust_multiplier":1,"torque_multiplier":1,"boost_multiplier":2}}],"next_id":2,"selected":1,"edits":[],"response":"LA-SELECTIVE","liquid_policy":[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],"normalize":false,"rule_radius":2,"source":[],"material":58,"brush":8,"fire":false};
const EXEMPLAR={"schema_version":1,"purpose":["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],"family":"original/industrial-foundry-wide","map_role":"Three distinct settlements sharing a radial floor-rooted transfer machine and upper foundry","anchor_donors":[],"macro_topology":"multi_settlement","density_profile":"Three asymmetric dense civic-industrial groups linked through a large editable transfer avenue; upper airworks concentrated between clusters","route_grammar":{"main":["West arrival","Ore hamlet","Smelter face","Guild inlet","Ladle handoff","Rotor lookout","Guild outfeed","Quench laboratory","Freight terminal","East export goal"],"upper":["Aerial west","Aerial caster","Aerial east"],"recovery":["West junction","East maintenance","Quench controls"]},"strong_motifs":["Three unlike worker settlements","Giant radial eight-spoke grounded rotor","Elevated contained furnace and ladle","Four staggered caster rams","East sealed quench and rail freight"],"interesting_relationships":["Settlements share one giant central transfer machine","Upper metallurgical line serves below-grade industrial communities","Aerial diversion remains accessible despite a blocked direct transfer avenue"],"authoring_affordances":[{"name":"West machine-guild seam","region_xywh":[531,701,103,119],"use":"Later human-added machinery"},{"name":"Rotor failure site","region_xywh":[974,677,165,32],"use":"Future unscripted activation"},{"name":"East settlement socket","region_xywh":[1370,705,102,111],"use":"Modular SWARM/GENTEK extension"},{"name":"Upper flyway","region_xywh":[515,481,1180,65],"use":"Future chase or bridge disruption"}],"setpiece_candidates":[{"name":"Rotor seizure","anchor":"Rotor lookout","kind":"machinery_failure"},{"name":"Quench-release","anchor":"Quench controls","kind":"fluid_release"},{"name":"Export departure","anchor":"East export goal","kind":"escape"},{"name":"Ore village defence","anchor":"West junction","kind":"holdout"}],"procedural_exemplar_value":["Three-town industrial settlement grammar","Floor-rooted radial transfer landmark linked to upper caster and ladle","Dense-open-dense civic landscape with large edit seams","Independent aerial return route"],"similarity_avoidance":"Unlike the previous drydock shipyard, ceiling-hung foundry, buried nested factory and crater ring, this map explores a multi-community factory city with a giant rooted transfer rotor.","diversity_axes":{"macro_topology":"multi_settlement","altitude_grammar":"tri_level","density_cadence":"clustered","route_structure":"hub_spoke","landmark_family":"rotor","support_form":"floor_rooted","environment_relation":"fluid_containment","incompleteness":"modular_append_zones"}};
const CROPS=[["overview.png",0,0,2048,1024],["01-west-cottages.png",46,655,515,218],["02-refractory-skyline.png",142,184,499,248],["03-ladle-and-casters.png",707,212,682,236],["04-central-rotoryard.png",698,671,701,216],["05-quench-rail-village.png",1444,655,572,231],["06-upper-airway.png",746,411,650,273]];
const README="# Cinderward Three-Village Rotoryard\n\nNew original, not reference-led, 2048×1024 strictly perpendicular side-elevation material-cell world. Three differentiated industrial townships occupy the lower plane. The west ore village feeds sealed refractory furnaces and a travelling ladle; upper casters feed a huge central floor-rooted radial rotor, sealed east quench, and export rail. Deliberately vacant district seams are SWARM/GENTEK and manual editing opportunities, not missing scenery. Four potential set pieces are unscripted. Exact 4-neighbour whole-hull Midge proofs and a physical obstruction are stored in receipt.json. `exemplar.json` records the design-corpus classifications.\n\nRun `node build.cjs OUTPUT_FOLDER` to regenerate all source-true files. **DRAFT/HOLD · creator source-static only; NATIVE-UNTESTED**. Workbench/engine loading, collision, dynamic materials and fresh-process save/reopen need separate Windows native qualification.\n";
const META={"base":"99a166e7fcae45eb22be1740e9f33f62faccbcc7","engine":"f7e056c9b8791106e22f2d1c295043783d8a9701","title":"Cinderward Three-Village Rotoryard"};
function reproduce(){return build(BASE,EXEMPLAR,CROPS,README,META)}
if(typeof module!=='undefined'&&module.exports){const fs=require('fs'),path=require('path');module.exports={world,encode,replay,route,reproduce};if(require.main===module){const dest=process.argv[2]||__dirname;fs.mkdirSync(dest,{recursive:true});let out=reproduce();for(const [name,data]of Object.entries(out.files))fs.writeFileSync(path.join(dest,name),data);console.log(JSON.stringify({sha256:out.receipt.source_grid_sha256,rectangles:out.receipt.rectangle_count}));}}
