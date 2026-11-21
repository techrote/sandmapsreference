"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xD1C5A2;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}




 // NIVELLE GROTTO — inhabited roof-rooted counter-mass cableport with novel load-path grammar.
 // A sparse, deep void connects three asymmetrical upper settlements with distinct lower works.
 function roof(x){return Math.round(112+15*Math.sin(x*.014)+8*Math.sin(x*.047));}
 function floor(x){return Math.round(891+29*Math.sin(x*.0107)+23*Math.sin(x*.027));}
 for(let x=0;x<W;x+=4){R(x,0,4,roof(x),(x/4|0)%23?M.rock:M.schist);R(x,floor(x),4,H-floor(x),(x/4|0)%19?M.rock:M.schist);}
 R(0,991,W,33,M.schist);
 for(const [x,y,w,h] of [[506,92,65,90],[1377,86,76,82],[1940,110,69,58]]){R(x,y,w,h,M.schist);R(x+14,y+h-9,Math.max(12,w-28),24,M.rock);}
 // Inert structural hanging piers always have roof or border root and support real walkable shelves.
 function hang(x,deckY,w,anchors){R(x,deckY,w,15,M.steel);for(const a of anchors){
  R(a,96,13,deckY-96,M.iron);R(a+3,125,6,deckY-147,M.chrome);
  L(a+6,deckY-94,Math.max(x+10,a-68),deckY-3,9,M.titanium);
  L(a+6,deckY-94,Math.min(x+w-13,a+72),deckY-3,9,M.titanium);
 }}
 hang(132,471,274,[165,365]);hang(800,434,339,[830,1104]);hang(1530,496,333,[1561,1824]);
 // Inhabited west clinic: sunlit roof access, grounded left and right roof supports.
 R(147,349,196,10,M.titanium);R(147,359,11,112,M.iron);
 R(175,433,57,29,M.black);R(191,441,10,15,M.amber);
 R(242,427,55,35,M.ceramic);R(258,432,9,20,M.blue);
 R(312,440,28,20,M.white);R(322,444,9,13,M.signal);
 for(let j=0;j<4;j++)R(172+j*38,457,13,7,j%2?M.chrome:M.amber);
 L(147,355,116,314,10,M.steel);L(116,314,82,345,8,M.titanium);
 R(372,477,96,9,M.iron);L(382,471,455,366,11,M.chrome);
 // Counter-mass A, suspended heavy ore ballast with two clear external service sides.
 R(603,327,124,13,M.steel);R(614,90,14,531,M.iron);R(702,90,13,538,M.titanium);
 R(597,613,132,17,M.steel);R(609,624,113,60,M.black);
 R(625,645,28,21,M.signal);R(679,641,25,28,M.amber);
 L(632,329,572,244,11,M.chrome);L(702,329,765,250,12,M.iron);
 // Floor-rooted mechanical geothermal service for rescue and research.
 R(483,807,277,14,M.steel);R(502,815,17,105,M.iron);R(737,816,17,105,M.iron);
 R(523,770,68,35,M.black);R(536,778,19,14,M.blue);
 R(607,731,37,73,M.ceramic);R(614,741,23,57,M.amber);
 R(658,745,73,57,M.black);R(671,754,12,38,M.signal);
 L(561,768,590,690,12,M.titanium);L(590,690,628,730,11,M.chrome);
 // Second roof-rooted settlement, seismographic instrument family.
 R(819,311,269,11,M.titanium);R(819,315,12,118,M.steel);
 R(857,388,51,36,M.black);R(864,397,13,18,M.signal);
 R(932,363,42,60,M.ceramic);for(let j=0;j<4;j++)R(941+j*8,372,4,36,j%2?M.amber:M.blue);
 R(1012,377,59,46,M.white);R(1033,384,13,28,M.blue);
 L(1079,301,1148,238,12,M.chrome);L(1148,238,1208,287,9,M.titanium);
 R(1142,223,16,25,M.amber);
 // Hanging counter-mass B forms a sheer asymmetric negative-space boundary.
 R(1277,343,113,14,M.iron);R(1284,132,15,360,M.steel);R(1371,135,15,355,M.iron);
 R(1268,482,133,18,M.titanium);R(1286,501,102,91,M.black);
 R(1301,512,22,62,M.amber);R(1350,517,23,51,M.signal);
 L(1283,348,1220,256,12,M.chrome);L(1379,355,1443,239,12,M.chrome);
 // East quarantine and freight colony, usable west and skylight entry.
 R(1576,367,253,13,M.titanium);R(1817,380,12,116,M.steel);
 R(1583,461,68,28,M.black);R(1595,468,17,14,M.blue);
 R(1678,441,64,45,M.ceramic);for(let j=0;j<4;j++)R(1687+j*13,449,7,22,j%2?M.signal:M.amber);
 R(1767,454,43,28,M.white);R(1779,462,15,12,M.chrome);
 L(1844,493,1911,386,12,M.iron);L(1911,386,1992,424,9,M.titanium);
 // Deep inhabited seismic archive and open-ended expansion seams.
 R(1129,820,295,14,M.steel);R(1144,826,15,92,M.iron);R(1394,826,15,92,M.iron);
 R(1170,776,84,40,M.black);R(1184,784,21,23,M.blue);
 R(1286,757,67,58,M.ceramic);R(1300,772,12,31,M.amber);R(1359,788,45,27,M.white);
 R(772,700,108,10,M.steel);L(781,698,759,818,11,M.iron);
 R(1435,692,136,10,M.titanium);L(1544,698,1576,495,12,M.iron);
 // Load-bearing cable lines attach to existing structures, not pseudo-screen decorations.
 L(370,207,517,312,8,M.chrome);L(517,312,612,327,9,M.iron);
 L(1098,205,1237,319,8,M.chrome);L(1237,319,1286,343,9,M.iron);
 L(1450,219,1558,367,10,M.chrome);
 for(const [x,y] of [[187,454],[280,452],[535,806],[700,807],[863,429],[1051,430],[1616,487],[1731,488],[1205,818],[1359,818]])R(x,y,5,8,M.chrome);
 // Structural mechanical feet bond equipment to load decks; central seismic rotor remains an editable site.
 R(550,798,11,18,M.iron);R(685,795,11,20,M.iron);
 R(1195,807,11,18,M.iron);R(1318,805,11,21,M.iron);R(1374,808,10,18,M.iron);
 R(1603,478,11,25,M.steel);R(1709,478,10,26,M.steel);R(1784,478,11,25,M.steel);
 // Deliberate roof service hatches: fully traversable 60px throats; beams remain rooted.
 R(264,339,70,31,0);R(971,302,75,31,0);R(1661,359,80,32,0);
 // Human-scale lateral entrance portals interrupt the otherwise enclosure-forming hangers.
 R(348,361,38,87,0);R(1084,340,46,86,0);R(1804,384,47,94,0);
 const sites={
 "West arrival pad":[387,407],"West clinic":[280,402],"Crew shelter":[204,406],
 "West aerial balcony":[441,311],"West lower return":[335,705],
 "Counterweight A left service":[565,559],"Counterweight A right service":[756,567],
 "Geothermal pump approach":[490,737],"Bore sample console":[695,707],
 "Lower crossing west":[798,643],"Seismograph lab":[886,355],
 "Heliograph relay":[1040,346],"Central cableway underside":[1181,538],
 "Central void vista":[1165,619],"Counterweight B top":[1233,326],
 "Counterweight B maintenance":[1450,558],
 "East quarantine":[1630,410],"East freight lift":[1766,409],
 "East landing":[1950,359],"East lower return":[1906,715],
 "Seismic records":[1214,742],"Archive pump floor":[1326,723],
 "Underpass south":[1070,762],"West ballast underflight":[565,710],
 "East quay approach":[1529,596],"West deep inspection":[83,722],
 "East boundary survey":[2014,664]
 };
 // Exactly bounded keepouts: centres never shifted. Keep machinery elsewhere.
 for(let [,p] of Object.entries(sites))R(p[0]-19,p[1]-17,39,35,0);
 // Every final feature must survive physical grounding; disconnected prototypes are removed.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
  let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let a=q[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!seen[n]){seen[n]=1;q[t++]=n;}
  }
  if(!edge){removedGroups++;removed+=t;for(let z=0;z<t;z++)g[q[z]]=0;}
 }

 let r2Features={habitat:0,ballast_a:0,pumpyard:0,relay:0,ballast_b:0,east_station:0,archive:0};for(let [name,x0,y0,x1,y1] of [["habitat",132,325,470,505],["ballast_a",597,325,740,686],["pumpyard",483,690,760,842],["relay",800,300,1140,440],["ballast_b",1268,320,1410,593],["east_station",1530,360,1864,500],["archive",1129,745,1425,845]])for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)r2Features[name]++; let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N);
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
  let [sx,sy]=sites["West arrival pad"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
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
 let obstacle=[1161,519,1200,557],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Central cableway underside")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrival pad"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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

 let crops=[["01-habitat-clinic",50,250,580,345],["02-counterweight-bore",447,285,570,590],["03-relay-vista",800,190,680,455],["04-eastern-quarantine",1440,275,608,520],["05-deep-archive",790,570,900,450]];
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


const receipt=function receipt(b,hash){return {
 concept:"Nivelle Grotto — Hanging Countermass Cableport",lane:"original/scifi-frontier-wide",original_no_source:true,
 seed:b.seed,extent:[2048,1024],material_cell_count:b.g.length,
 engine_accepted_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
 map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,
 material_rule_assumption:"Stationary source-authorized hard surfaces. Basalt, obsidian and glass have lava-only pair interactions; no lava or acid is placed. No mobile powder, water or reactive source pair.",
 material_histogram:b.hist,filled_grounded_cells:b.area,detached_final_cells:0,final_fluid_cells:0,
 prototype_disconnected_cells_removed:b.removed,prototype_components_removed:b.removedGroups,
 rectangle_count:b.rect.length,rectangle_work:b.area,setup_bytes:b.json.length,
 grid_sha256:hash(b.g),setup_sha256:hash(b.json),
 images:b.images.map(([name,z])=>({name,bytes:z.length,sha256:hash(z)})),
 clearance:b.clearances,
 obstruction:{xyxy_halfopen:b.obstacle,material_id:58,purpose:"Solid trial obstruction at central cableway underside; alternate underflight and side routes remain",result:b.blocked},
 named_sites:b.sites,literal_actor_spawn:b.sites["West arrival pad"],crops:b.crops,
 surviving_functional_footprints:b.r2Features,static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",
 independent_reviews:"Exact-HEAD independent Art/Technical/Shepherd pending",
 creator_revision:"New suspended, roof-rooted counter-mass family exemplar, 2026-11-21"
};};
const exemplar=function exemplar(b,hash){return {
 schema_version:1,
 purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"original/scifi-frontier-wide",
 map_role:"multi-strata inhabited cableport in a huge geological grotto with three roof-hung settlements, two unequal counterweights, and distinct floor-rooted research workfaces",
 anchor_donors:[],
 macro_topology:"roof-rooted hanging archipelago above a jagged bottom geological research floor; two great suspended counter-mass stations interrupt the negative space",
 density_profile:"inhabited upper clusters and two outfitted lower workfaces alternate with large navigable air volumes and intentionally unfinished lateral expansion gantries",
 route_grammar:{
  spawn:"West arrival pad",
  primary:"west clinic and air arrival → central seismographic relay → eastern quarantine/freight departure",
  alternatives:["deep floor-hugging flight beneath suspended counterweights","upper pockets around both counterweight structures","high-right and low-left site reconnections"],
  named_sites:Object.keys(b.sites).length,
  obstruction:{site:"Central cableway underside",box:b.obstacle,unaffected_reachable:b.blocked.passed}
 },
 strong_motifs:["long tensile roof piers supporting asymmetrical inhabited decks","two different hanging counter-mass block silhouettes","real crew, instrument and sterile-transfer workfaces","three open-roof rescue entrances admitting Midge hull","basalt roof and rolling excavation floor with separate load paths","two incomplete scaffold expansion segments"],
 interesting_relationships:["the upper districts inherit load bearing from ceiling while lower machinery takes load from floor","the cableport's service counterweights bound open bypass air instead of dividing the world into sealed rooms","the seismography works observe geology below but hang from it above","human-editable deep scaffold lines are not advertised as furnished chambers"],
 authoring_affordances:["unfinished counterweight A lower service interface","deep geothermal pump expansion gap","open east-side quay for rover/NPC encounter","south seismic archive stub for scripted recovery","large middle void usable for a falling-object event without sealing the overflight"],
 setpiece_candidates:[
  {name:"Roof suspension interruption",area:[575,170,775,525],event_type:"cable break/counterweight release",scripted:false},
  {name:"Inhabited refuge arrival",area:[110,320,470,510],event_type:"NPC settlement/rescue",scripted:false},
  {name:"Central ballast start-up",area:[1250,330,1430,620],event_type:"machinery activation/holdout",scripted:false},
  {name:"Lower seismic record escape",area:[1100,710,1430,865],event_type:"archive breach and low bypass",scripted:false}
 ],
 procedural_exemplar_value:"Teaches roof-rooted cable load paths, upper and lower settlement adjacency across open air, partial service-gate portals, weighted suspended modules, and two-level escape affordances to example-derived SWARM/GENTEK grammars.",
 similarity_avoidance:"Unlike Copperwake's nested excavated caves, Cairnstep's successive floor-rooted terraces, Penumbral's enormous reflector ring and Vela's opposed wind sails, uses ceiling-rooted habitation and asymmetric counterweights with a mostly empty continuous flight volume.",
 diversity_axes:{
  macro_topology:"suspended",altitude_grammar:"multi_strata",density_cadence:"edge_dense_center_open",
  route_structure:"layered",landmark_family:"cableway",support_form:"roof_rooted",
  environment_relation:"geological",incompleteness:"modular_append_zones"
 },
 native_status:"NATIVE-UNTESTED",source_grid_sha256:hash(b.g)
};};
const fs=require("fs"),path=require("path"),a=build(),r=receipt(a,hash),e=exemplar(a,hash);
let ok=true;for(let [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],["exemplar.json",JSON.stringify(e,null,2)+"\n"],...a.images]){
 let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);
 if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,grounded:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,sha256:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
