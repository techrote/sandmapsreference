"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0x6C5A31;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}







 // ARID HELM / TECTONIC VESSEL DRYDOCK. New authored geometry, orthographic side elevation.
 function grade(x){return Math.round(846+9*Math.sin(x*.009)+5*Math.sin(x*.034));}
 for(let x=0;x<W;x+=4){let y=grade(x);R(x,y,4,H-y,(x%139<4)?M.schist:M.rock);}
 R(0,1001,W,23,M.schist);
 R(510,807,1058,175,0);
 for(let x=475;x<535;x+=3)R(x,800+(x-475)*2,3,180-(x-475)*2,0);
 for(let x=1548;x<1611;x+=3)R(x,799+(1611-x)*2,3,185-(1611-x)*2,0);
 R(145,906,1750,76,0);R(187,884,210,99,0);R(1606,878,257,107,0);
 R(460,909,177,74,0);R(1378,905,220,79,0);
 R(160,985,1740,13,M.steel);R(150,1000,1750,10,M.rock);
 function slab(x,y,w,posts){R(x,y,w,12,M.steel);R(x,y+12,w,5,M.titanium);
 for(let p of posts){R(p,y+12,17,grade(p)-y-8,M.iron);R(p+6,y+21,5,grade(p)-y-20,M.chrome);}}
 slab(88,654,397,[111,440]);slab(1552,662,428,[1565,1953]);
 // West medical worktown: inhabited floors, hatches, diagnostics and grounded frames.
 R(124,538,316,10,M.titanium);R(124,548,13,105,M.iron);R(428,548,12,107,M.iron);
 R(246,533,82,21,0);R(133,636,295,18,M.steel);
 R(167,604,72,29,M.ceramic);R(178,611,19,14,M.blue);R(206,593,19,12,M.signal);
 R(285,611,42,22,M.black);R(296,598,11,13,M.chrome);
 R(364,603,51,27,M.white);R(377,612,15,12,M.amber);
 R(453,654,100,11,M.steel);L(466,664,489,783,11,M.iron);
 R(473,700,83,11,M.titanium);R(488,711,16,109,M.iron);
 R(508,681,44,15,M.black);R(522,687,11,9,M.signal);
 // West asymmetrical loading winch.
 R(549,334,22,509,M.iron);R(540,326,96,15,M.titanium);
 L(557,350,643,422,10,M.steel);L(570,349,601,277,11,M.iron);
 R(592,269,35,14,M.amber);R(615,341,14,121,M.chrome);
 R(621,455,54,15,M.titanium);R(626,470,11,92,M.iron);
 // East sterile/filter/freight facilities and departure stage.
 R(1580,536,367,11,M.titanium);R(1580,547,13,114,M.iron);R(1934,547,13,115,M.iron);
 R(1710,530,90,22,0);R(1590,642,342,18,M.steel);
 R(1609,597,75,37,M.ceramic);R(1623,607,25,15,M.blue);
 R(1691,613,70,22,M.black);R(1707,617,21,13,M.signal);
 R(1827,601,83,31,M.white);R(1845,610,17,13,M.amber);
 R(1589,704,101,10,M.steel);L(1596,709,1558,816,11,M.iron);
 R(1829,706,94,10,M.titanium);R(1907,716,16,124,M.iron);
 R(1955,587,68,13,M.steel);L(1967,598,2005,651,8,M.chrome);R(1991,556,14,19,M.amber);
 // The ship itself: huge asymmetric tapered hull, not an inaccessible scenic cutout.
 L(601,532,776,438,17,M.titanium);L(776,438,1315,438,17,M.steel);
 L(1315,438,1492,555,18,M.titanium);L(601,532,613,693,15,M.steel);
 L(613,693,792,748,18,M.iron);L(792,748,1297,751,19,M.titanium);
 L(1297,751,1492,669,18,M.steel);L(1492,555,1492,669,17,M.iron);
 R(802,460,491,10,M.chrome);R(791,511,552,10,M.steel);
 R(770,649,587,12,M.titanium);R(784,666,566,7,M.iron);
 // Real open door thresholds and separated functional mid-ship chambers.
 R(909,468,15,182,M.steel);R(1199,468,16,182,M.iron);
 R(895,553,40,85,0);R(1188,544,40,99,0);
 R(597,551,70,100,0);R(1441,568,67,101,0);
 R(765,605,73,32,M.black);R(777,612,20,14,M.blue);
 R(824,604,13,46,M.chrome);L(808,604,840,568,7,M.iron);
 R(965,607,82,29,M.ceramic);R(982,615,16,12,M.signal);
 R(1086,603,77,33,M.black);R(1102,610,16,14,M.amber);
 R(1244,604,81,30,M.white);R(1261,612,19,13,M.blue);
 // Ship bridge, top access, and asymmetrical roofline.
 L(947,432,988,359,11,M.iron);L(988,359,1164,359,13,M.chrome);
 L(1164,359,1220,433,11,M.iron);
 R(1023,344,111,10,M.titanium);R(1063,331,20,13,M.amber);
 R(1016,464,87,22,M.black);R(1039,473,15,12,M.signal);
 // Twin unequal cradles carry entire hull into hard bottom rock.
 R(759,738,26,263,M.iron);R(1299,741,29,260,M.iron);
 R(771,771,8,210,M.chrome);R(1310,763,7,217,M.chrome);
 L(765,807,701,880,14,M.steel);L(1323,810,1391,883,13,M.titanium);
 L(782,797,844,850,12,M.iron);L(1304,794,1248,851,12,M.iron);
 R(1495,704,109,13,M.titanium);R(1582,714,18,113,M.iron);
 L(1513,706,1573,631,9,M.steel);R(1564,616,21,22,M.amber);
 // Deep service apparatus grouped by true functional role.
 R(201,980,185,5,M.steel);R(215,943,63,29,M.black);R(226,952,14,11,M.blue);
 R(315,952,42,18,M.ceramic);R(320,962,12,9,M.signal);
 R(884,982,333,6,M.steel);R(909,943,52,31,M.black);R(924,952,19,11,M.amber);
 R(1030,948,82,26,M.ceramic);R(1045,956,15,11,M.blue);
 R(1174,942,51,35,M.black);R(1185,955,18,13,M.signal);
 R(1639,982,213,6,M.steel);R(1665,944,62,28,M.ceramic);R(1674,954,18,10,M.blue);
 R(1776,952,46,22,M.black);R(1788,962,12,11,M.amber);
 // Two separately entered deep shafts and the central vessel-to-dock cargo chute.
 R(308,635,76,350,0);R(1686,613,76,372,0);R(1033,627,82,176,0);
 R(866,427,79,116,0);R(1214,428,81,118,0);
 // Rooted outer buttresses, without a fictitious underground through-gate.
 R(116,646,25,198,M.iron);R(1918,647,28,201,M.iron);
 R(557,336,13,510,M.iron);R(1563,647,19,197,M.iron);
 const sites={
 "Rover clinic spawn":[174,584],"Medical assay":[352,588],"West observation":[444,466],
 "Left winch apex":[596,238],"Drydock loader":[520,733],"Keel aft entrance":[684,587],
 "Port ballast control":[856,588],"Upper aft aisle":[830,488],
 "Midship laboratory":[1001,584],"Keel drive control":[1066,584],
 "Midship control bridge":[1076,308],"Ship upper research":[1135,478],
 "Forward biocustody":[1284,579],"Fore access":[1448,516],"Bow loading":[1531,588],
 "Quarantine receiving":[1631,581],"Sterile exit":[1754,581],
 "Eastern relief ward":[1858,583],"Evacuation beacon":[1995,506],
 "Open sky bypass":[1001,234],"Drydock basin":[977,831],
 "Port keel underpass":[637,813],"Centre deep landing":[1079,909],
 "West shaft mouth":[344,705],"West shaft bottom":[346,885],
 "West diagnostic basement":[232,914],"East shaft mouth":[1723,700],
 "East shaft bottom":[1723,891],"Eastern archive":[1847,927],
 "Deep return":[1100,932],"West survey":[48,755],
 "East survey":[2017,753],"Outer hull inspection":[1346,333],
 "Upper mast transfer":[594,307]};
 // Literally fixed hull-protected centres; no substituted or shifted destinations.
 for(const [x,y] of Object.values(sites))R(x-19,y-17,39,35,0);
 for(let x of [308,1686])R(x,620,76,365,0);
 R(1033,655,82,159,0);
 // Discard only provisional non-boundary-grounded material before publication.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let p=q[h++],x=p%W,y=(p/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let v of [p-W,p+W,x?p-1:-1,x<W-1?p+1:-1])if(v>=0&&v<N&&g[v]&&!seen[v]){seen[v]=1;q[t++]=v;}
  }if(!edge){removedGroups++;removed+=t;for(let j=0;j<t;j++)g[q[j]]=0;}}
 let r2Features={};for(let [name,x0,y0,x1,y1] of [["clinic",120,535,449,656],["winch",490,264,700,817],["ship",595,335,1505,774],["quarantine",1570,535,1950,666],["deep",185,885,1880,989]]){
 let cnt=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)cnt++;r2Features[name]=cnt;}
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N);
 for(let y=0;y<H;y++){let next=new Map(),b=y*W;for(let x=0;x<W;){let m=g[b+x],s=x;while(x<W&&g[b+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,m]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,m] of rect){area+=w*h;hist[m]=(hist[m]||0)+w*h;for(let j=y;j<y+h;j++)replay.fill(m,j*W+x,j*W+x+w);}
 if(rect.length>32768||area>32000000)throw Error("Source limits exceeded "+rect.length);
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Lossless replay mismatch "+i);
 function flood(w,h,box){
  let src=g;if(box){src=g.slice();for(let y=box[1];y<box[3];y++)src.fill(M.wall,y*W+box[0],y*W+box[2]);}
  let iw=W+1,ii=new Int32Array((W+1)*(H+1));
  for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=(src[(y-1)*W+x-1]!==0)?1:0;ii[y*iw+x]=ii[(y-1)*iw+x]+sum;}}
  let hw=w>>1,hh=h>>1;function clear(x,y){let a=x-hw,b=y-hh,c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*iw+c]-ii[d*iw+a]-ii[b*iw+c]+ii[b*iw+a]===0;}
  let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N),h0=0,t0=0;
  for(let y=hh;y<H-hh;y++)for(let x=hw;x<W-hw;x++)if(clear(x,y))pass[y*W+x]=1;
  let [sx,sy]=sites["Rover clinic spawn"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
  vis[si]=1;queue[t0++]=si;
  while(h0<t0){let a=queue[h0++],x=a%W,n=a-W;if(n>=0&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a+W;if(n<N&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a-1;if(x>0&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a+1;if(x<W-1&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}}
  let bad=Object.entries(sites).filter(([n,[x,y]])=>!vis[y*W+x]).map(([name,p])=>({name,xy:p,clear:clear(...p)}));
  return {envelope:[w,h],centres:t0,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};
 }
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));
 if(clearances.some(v=>v.bad.length))throw Error("Route failure "+JSON.stringify(clearances.map(z=>z.bad)));
 let obstacle=[1046,567,1088,609],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Keel drive control")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Rover clinic spawn"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 let json=JSON.stringify(setup);if(json.length>1048576||Object.keys(setup).length!==14)throw Error("Setup violation "+json.length);
 // Index palette: each pixel sample is precisely one original stored material ID.
 function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set(name.split("").map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 function rev(v,n){let z=0;while(n--){z=(z<<1)|(v&1);v>>>=1;}return z;}
 function zip(raw){let o=[120,1],bits=0,n=0;function wr(v,k){bits|=v<<n;n+=k;while(n>=8){o.push(bits&255);bits>>>=8;n-=8;}}
  function sym(s){let v,k;if(s<=143){v=48+s;k=8;}else if(s<=255){v=400+s-144;k=9;}else if(s<=279){v=s-256;k=7;}else{v=192+s-280;k=8;}wr(rev(v,k),k);}
  const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  function run(len){let a=0;while(a<28&&lb[a+1]<=len)a++;sym(a+257);if(le[a])wr(len-lb[a],le[a]);wr(0,5);}
  wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let l=1;while(i+l<raw.length&&l<258&&raw[i+l]===raw[i])l++;if(l>=4&&i>0&&raw[i-1]===raw[i]){run(l);i+=l;}else{sym(raw[i]);i++;}}sym(256);if(n)o.push(bits&255);
  let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}o.push(...be(((b<<16)|a)>>>0));return new Uint8Array(o);}
 let colors={0:[8,11,18],49:[70,83,99],58:[119,123,128],62:[126,141,153],63:[49,100,119],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],100:[54,56,61],101:[24,19,32],120:[156,210,220],121:[190,216,225],122:[226,236,244],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
 let pal=new Uint8Array(132*3);for(let k=0;k<132;k++)pal.set(colors[k]||[100,100,100],3*k);
 function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
  let p=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())];
  let b=new Uint8Array(p.reduce((s,x)=>s+x.length,0)),i=0;for(let x of p){b.set(x,i);i+=x.length;}return b;}

 let crops=[["01-clinic-and-west-airlock",50,430,630,430],["02-inbound-gate",385,290,545,550],["03-central-phase-actuator",875,190,560,625],["04-east-quarantine",1410,315,625,520],["05-subgrade-artery",170,735,1720,285]];
 let images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,removed,removedGroups,sites,clearances,blocked,obstacle,crops,images,seed,r2Features};
};

const hash=function hash(b){if(typeof b==="string")b=Uint8Array.from(b,c=>c.charCodeAt(0));
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 let n=(b.length+9+63)&~63,z=new Uint8Array(n);z.set(b);z[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){z[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(v,n)=>(v>>>n)|(v<<(32-n));
 for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((z[i]<<24)|(z[i+1]<<16)|(z[i+2]<<8)|z[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rr(p,7)^rr(p,18)^(p>>>3))+w[j-7]+(rr(q,17)^rr(q,19)^(q>>>10)))>>>0;}
  let [a,b,c,d,e,f,g,k]=h;for(let j=0;j<64;j++){let t1=(k+(rr(e,6)^rr(e,11)^rr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rr(a,2)^rr(a,13)^rr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;k=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
  for(let j=0;j<8;j++)h[j]=(h[j]+[a,b,c,d,e,f,g,k][j])>>>0;}
 return h.map(v=>v.toString(16).padStart(8,"0")).join("");
};




const receipt=b=>({concept:"Arid Helm - Tectonic Vessel Drydock",source:"original/scifi-frontier-wide",seed:b.seed,
 accepted_engine_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 extent:[2048,1024],material_cells:b.g.length,grid_sha256:hash(b.g),setup_sha256:hash(b.json),histogram:b.hist,
 rectangle_count:b.rect.length,work_cells:b.area,setup_bytes:b.json.length,accepted_limits:{rectangles:32768,setup_bytes:1048576,construction_work:32000000},
 grounded_final_cells:b.area,detached_final_cells:0,liquid_mobile_falling_reactive:0,
 provisional_removed:b.removed,provisional_groups:b.removedGroups,footprints:b.r2Features,
 literal_sites:b.sites,actor_spawn:b.sites["Rover clinic spawn"],exact_hull_BFS:b.clearances,
 real_obstruction:{xyxy:b.obstacle,material:58,excluded:"Keel drive control",BFS:b.blocked},
 images:b.images.map(([name,p])=>({name,bytes:p.length,sha256:hash(p)})),crops:b.crops,
 materials:"Accepted immovable Solid/None construction only; no fluids, falling supports, fire or lava",
 native:"NATIVE-UNTESTED",static:"CREATOR-STATIC-PASS",independent_specialists:"Art/Tech/Shepherd pending"});
const exemplar=b=>({schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"original/scifi-frontier-wide",map_role:"inhabited full side-elevation survey vessel on grounded unequal dock cradles between medical settlement and sterile freight worktown",
 anchor_donors:[],macro_topology:"landlocked excavated drydock holding multi-deck vessel and below-grade work bays",
 density_profile:"edge-dense medical and sterile stations surrounding broad editable drydock basin; compact hull chamber machinery",
 route_grammar:{primary:"west medical via aft vessel entered decks to east sterile freight/evacuation",alternatives:["open high overflight bypass of complete ship","two fully entered service shafts and open drydock basin"],obstruction:"Keel drive control",named_literal_sites:Object.keys(b.sites).length},
 strong_motifs:["tapered survey vessel with usable upper and lower interiors","physically rooted twin unequal bearing cradles","distinct left heavy winch and right freight derrick","two entered underground recovery shafts","vast open central basin framed by dense edge settlements"],
 interesting_relationships:["ship itself is a functional people-scale research district, unlike a merely scenic landmark","left medical and right quarantine facilities differ in material rooms and logistics","load paths emerge from actual geological bottom instead of simulated flying boat","three independently usable altitude layers survive one blocked hull operation"],
 authoring_affordances:["unfurnished dock floor permits manual arrival or convoy encounters","unused ship foredeck suits Gentek modular hull grammar","deep hall pockets accept later NPC settlements","removable vessel support provides failure setpiece"],
 setpiece_candidates:[{name:"Keel drive control",region:[1010,555,1130,650],type:"machine activation / lockdown",scripted:false},
 {name:"Unequal dock cradle",region:[725,730,855,896],type:"support failure",scripted:false},
 {name:"East sterile arrival",region:[1580,540,1940,661],type:"quarantine holdout",scripted:false},
 {name:"Lower assay",region:[875,890,1255,988],type:"salvage recovery",scripted:false}],
 procedural_exemplar_value:"Grounded asymmetric full-hull vessel as nested inhabitable level, a twin-pier engineering grammar and 3-altitude navigable drydock for authored event and modular parts.",
 similarity_avoidance:"A full grounded drydock with entered vessel rather than Serrate's gate corridor, Orison's islands, Nivelle's suspended structures or Cairnstep's altitude staircase",
 diversity_axes:{macro_topology:"drydock",altitude_grammar:"tri_level",density_cadence:"edge_dense_center_open",route_structure:"layered",landmark_family:"vessel",support_form:"twin_pier",environment_relation:"geological",incompleteness:"editable_gaps"},
 source_grid_sha256:hash(b.g),native:"NATIVE-UNTESTED"});
const routeGraph=b=>({schema_version:1,kind:"literal exact-hull 4-neighbour BFS, qualitative routes",extent:[2048,1024],spawn:"Rover clinic spawn",
 sites:b.sites,envelopes:[[19,15],[23,19],[31,27]],BFS:b.clearances,obstruction:{xyxy:b.obstacle,solid:58,blocked_target:"Keel drive control",result:b.blocked},
 paths:{main:["Rover clinic spawn","Medical assay","Keel aft entrance","Port ballast control","Midship laboratory","Keel drive control","Forward biocustody","Quarantine receiving","Eastern relief ward","Evacuation beacon"],
 sky:["West observation","Open sky bypass","Outer hull inspection","Evacuation beacon"],under:["West shaft mouth","West shaft bottom","West diagnostic basement","Drydock basin","Deep return","East shaft bottom","East shaft mouth"]},
 caveat:"Site membership and source-grid 4-connectedness checked, not individual pairwise directed flight dynamics"});
const README="# Arid Helm - Tectonic Vessel Drydock\n\nA new original 2048x1024 truly orthographic material-ID CyberSand world: the grounded survey ship itself is a large multi-deck inhabited research and industrial area, with different medical and quarantine worktowns at each end, the excavation and three recoverable service bays below, and a broad upper overflight. Purposeful unused drydock voids are editable authoring space. No reference-art reuse.\n\nRun \`node build.cjs\` and \`node build.cjs --verify\` (stock Node.js, fixed seed). Source authority: CyberSand main f7e056c9b8791106e22f2d1c295043783d8a9701; map main 99a166e7fcae45eb22be1740e9f33f62faccbcc7. See receipt.json, route_graph.json and exemplar.json. All six PNGs are true source material-ID pixels. Creator static qualification only, not gameplay/native PASS. OPEN DRAFT/HOLD; Art/Tech/Shepherd and real owner Windows Workbench/Rapier/load/save pending.\n";
const emitted=(b)=>[
 ["setup.json",b.json],["receipt.json",JSON.stringify(receipt(b),null,2)+"\n"],
 ["exemplar.json",JSON.stringify(exemplar(b),null,2)+"\n"],
 ["route_graph.json",JSON.stringify(routeGraph(b),null,2)+"\n"],
 ["README.md",README],...b.images
];
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),b=build(),files=emitted(b),verify=process.argv.includes("--verify");
 let ok=true;for(const [name,value] of files){const bytes=typeof value==="string"?Buffer.from(value,"utf8"):Buffer.from(value);
 const target=path.join(__dirname,name);
 if(verify){if(!fs.existsSync(target)||!bytes.equals(fs.readFileSync(target))){console.error("MISMATCH "+name);ok=false;}}
 else fs.writeFileSync(target,bytes);
 }
 console.log(JSON.stringify({rectangles:b.rect.length,grounded:b.area,sites:Object.keys(b.sites).length,obstruction:b.blocked.bad,grid_sha256:hash(b.g),verified:ok}));
 if(!ok)process.exitCode=1;
}
