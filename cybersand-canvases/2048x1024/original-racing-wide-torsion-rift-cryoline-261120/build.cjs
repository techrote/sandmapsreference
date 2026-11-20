"use strict";
// Torsion Rift Cryoline R1. Fixed-seed original 2048x1024 actual material-cell Workbench world.
// Authoritative accepted engine: de109d0131641d6adc8d25bb9ced7ca3d4991105.
const W=2048,H=1024,N=W*H,ENGINE="de109d0131641d6adc8d25bb9ced7ca3d4991105",M={"E":0,"S":49,"C":58,"T":62,"B":100,"O":101,"Z":113,"I":117,"G":120,"Q":122,"P":128},POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],PALETTE={"0":[8,12,20],"49":[79,93,113],"58":[128,141,154],"62":[152,175,190],"100":[44,55,69],"101":[23,33,49],"113":[222,177,112],"117":[98,110,130],"120":[130,209,223],"122":[242,235,210],"128":[48,175,169]},MODEL_HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",SPAWN=[136,629],SITES=[["West Lock Start",136,629],["Ignition Straight",346,629],["Torque Foundry Approach",601,630],["Rift Lower Approach",910,626],["Rift Aperture High",1090,416],["Rift Landing",1262,630],["Cryo Lower",1480,626],["East Braking",1760,631],["East Recovery Pivot",1910,515],["East Upper Return",1900,398],["Cryo Upper",1540,393],["Rift Upper",1240,394],["Torque Upper",766,393],["West Upper",397,390],["West Dive",175,512],["Finish",186,630],["West Operator Loft",278,127],["Torque Telemetry Loft",610,129],["Rift Controller",1076,130],["West Underworks",225,906],["Torque Service",684,913],["Cryo Vault",1457,915],["East Service Bay",1794,917]],CROPS=[["overview.png",0,0,2048,1024],["01-west-lock.png",0,28,454,578],["02-torque-foundry.png",382,253,478,657],["03-rift-spire.png",829,248,502,698],["04-cryo-filter.png",1267,226,454,704],["05-east-recovery.png",1650,238,398,686],["06-underground-services.png",459,650,564,374]];
function generate(){
 const g=new Uint8Array(W*H),roof=new Int16Array(W),floor=new Int16Array(W);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),bell=(x,c,r)=>Math.exp(-(((x-c)/r)**2));
 function box(x,y,w,h,m,ink=false){let a=clamp(Math.round(x),0,W),b=clamp(Math.round(x+w),0,W),c=clamp(Math.round(y),0,H),d=clamp(Math.round(y+h),0,H);for(let yy=c;yy<d;yy++)for(let xx=a;xx<b;xx++){let i=yy*W+xx;if(!ink||g[i])g[i]=m;}}
 function oval(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let dx=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));box(cx-dx,y,2*dx+1,1,m);}}
 function beam(x0,y0,x1,y1,r,m,ink=false){let dx=x1-x0,dy=y1-y0,l=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r+1));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/(l||1),0,1);if((x-x0-t*dx)**2+(y-y0-t*dy)**2<=r*r){let i=y*W+x;if(!ink||g[i])g[i]=m;}}}
 function polygon(P,m){for(let y=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1]))));y<Math.min(H,Math.ceil(Math.max(...P.map(p=>p[1]))));y++){let xs=[];for(let i=0;i<P.length;i++){let a=P[i],b=P[(i+1)%P.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)box(xs[i],y,xs[i+1]-xs[i]+1,1,m);}}
 for(let x=0;x<W;x++){roof[x]=clamp(Math.round(150+12*Math.sin(x*.0058)+9*Math.sin(x*.018)+53*bell(x,493,125)+73*bell(x,1041,145)+40*bell(x,1490,120)+24*bell(x,1820,112)),135,242);floor[x]=clamp(Math.round(823+12*Math.sin(x*.0074)+8*Math.sin(x*.029)-55*bell(x,517,137)-44*bell(x,1510,126)-24*bell(x,1814,92)),738,853);for(let y=0;y<roof[x];y++)g[y*W+x]=y>=roof[x]-13?M.T:y<25&&Math.floor(x/146)%3===0?M.S:y%101<5?M.O:M.B;for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+14?M.C:y>976&&Math.floor(x/139)%4===0?M.O:M.B;}
 // Ignition lock: authored roof operator vault, open full-hull shaft and founded lower recovery bay.
 box(170,65,238,163,0);box(238,209,90,195,0);box(174,65,229,13,M.Z);box(171,81,14,131,M.I);box(174,211,59,11,M.C);box(331,211,70,11,M.C);
 for(let j=0;j<4;j++){let x=190+42*j;box(x,102,20,68,j%2?M.T:M.I);box(x+6,117,8,41,j%2?M.Q:M.P,true);}box(188,174,143,11,M.Z);
 box(96,835,233,148,0);box(186,657,83,215,0);box(102,968,216,12,M.C);box(111,920,24,47,M.T);box(135,936,72,11,M.I);
 beam(57,roof[57]-12,82,319,13,M.T);beam(82,319,109,306,7,M.Q);beam(83,floor[83]+8,94,720,12,M.T);beam(94,720,129,735,7,M.Z);
 // Torque foundry: asymmetric ceiling tension truss, two offset hollow flywheels and real service shaft.
 box(528,61,222,154,0);box(598,194,87,216,0);box(533,61,209,11,M.Z);box(528,70,15,124,M.T);box(541,199,50,13,M.C);box(690,200,51,13,M.C);
 for(let j=0;j<5;j++){let x=552+j*31;box(x,96,13,70-(j%2)*12,M.I);box(x+4,104,5,45,M.P,true);}
 beam(445,roof[445]-16,500,313,14,M.T);beam(500,313,556,303,8,M.I);beam(445,roof[445]-17,528,283,5,M.Z);beam(735,roof[735]-10,788,319,11,M.T);
 for(let [cx,cy,rx,ry]of [[505,808,79,82],[735,811,58,60]]){oval(cx,cy,rx,ry,M.T);oval(cx,cy,rx-16,ry-16,0);oval(cx,cy,rx-30,ry-29,M.I);oval(cx,cy,rx-39,ry-39,0);box(cx-rx+9,cy+ry-22,2*rx-18,27,M.C,true);box(cx-14,cy+ry-32,28,33,M.I);}
 box(575,848,228,132,0);box(648,651,86,247,0);box(579,965,213,12,M.C);
 for(let j=0;j<3;j++){let x=596+j*65;box(x,925,16,40,M.I);box(x+11,929,34,12,M.T);box(x+17,902-(j%2)*11,20,25,M.Z);}
 // Original central Rift Exchange: the lower outbound route climbs over a grounded tall spear-arch.
 polygon([[940,826],[977,725],[1034,594],[1076,497],[1098,528],[1154,672],[1209,826]],M.T);
 polygon([[969,825],[1004,747],[1065,561],[1077,538],[1101,579],[1143,736],[1178,826]],M.I);
 beam(1015,730,1077,510,7,M.Z,true);beam(1077,510,1180,813,7,M.Q,true);
 box(1001,64,216,156,0);box(1045,204,90,207,0);box(1005,64,206,12,M.Z);box(1003,84,14,122,M.I);box(1019,207,21,12,M.C);box(1141,210,60,10,M.C);
 box(1018,94,29,87,M.T);box(1041,110,60,14,M.Z);box(1044,136,26,44,M.I);box(1080,119,17,15,M.P);box(1092,133,45,12,M.Z);
 beam(850,roof[850]-9,927,306,14,M.T);beam(927,306,966,296,8,M.Q);beam(1245,roof[1245]-9,1186,312,13,M.T);beam(1186,312,1152,292,8,M.Z);
 // Dry cryogenic filtering (no unstable fluids): varied roof-rooted articulated teeth and distinct collector towers.
 for(let [x,dx,tip]of [[1326,40,315],[1431,-33,299],[1548,51,312],[1652,-36,306]]){beam(x,roof[x]-16,x+dx,tip,13,M.T);beam(x+dx,tip,x+dx+(dx>0?24:-24),tip-25,7,M.Z);beam(x,roof[x]-16,x+dx,tip-14,5,M.Q);}
 for(let [x,w,rise]of [[1314,64,100],[1444,75,113],[1582,59,89]]){let y=floor[x];polygon([[x,y+14],[x+11,y-rise],[x+33,y-rise-18],[x+w-9,y-rise],[x+w,y+14]],M.T);box(x+16,y-rise+22,w-31,14,M.I);box(x+20,y-rise+40,w-40,10,M.P,true);}
 box(1380,847,255,138,0);box(1460,652,85,237,0);box(1386,968,242,13,M.C);
 for(let j=0;j<4;j++){let x=1401+j*52;box(x,917,12,47,M.I);box(x+10,909,29,11,M.T);box(x+14,925,22,9,j%2?M.P:M.Q);}
 // Eastern recovery lift: generous full-body turnaround, two unequal magnetic jaw portals and founded workshop.
 beam(1720,roof[1720]-13,1788,310,13,M.T);beam(1788,310,1822,294,7,M.Q);beam(1994,roof[1994]-13,1936,313,13,M.T);beam(1936,313,1902,291,7,M.P);
 beam(1991,floor[1991]+14,1975,694,13,M.T);beam(1975,694,1940,706,8,M.Z);
 box(1756,853,224,130,0);box(1826,654,82,239,0);box(1764,970,202,11,M.C);box(1772,930,16,40,M.T);box(1790,935,54,12,M.I);box(1860,928,16,41,M.T);beam(1851,939,1900,919,10,M.I);
 // Rooted, low-noise surface recolours distinguish lower departure from elevated westbound return.
 for(let x=74;x<2036;x+=48)box(x,roof[x]-8,22,7,x<780?M.Z:x<1290?M.Q:x<1700?M.P:M.Z,true);
 for(let x=106;x<1945;x+=58)box(x,floor[x]+3,26,9,x<840?M.Q:x<1270?M.Z:x<1710?M.P:M.Q,true);
 // Discard non-boundary-grounded islands before encoding: physically correct final grid, never scenic ghosts.
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,b=0,discarded=0;
 function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}
 for(let i=0;i<g.length;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return {g,grounded:b,discarded};
}

function encodeRects(g){let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),off=y*W;for(let x=0;x<W;){let m=g[off+x],s=x;while(x<W&&g[off+x]===m)x++;if(!m)continue;let key=s+":"+String(x-s)+":"+String(m),r=active.get(key);if(r)r[3]++;else{r=[s,y,x-s,1,m];edits.push(r);}next.set(key,r);visits+=x-s;}active=next;}return {edits,visits};}

function freeMask(g,w,h){let s=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let c=0,at=y*stride,p=(y-1)*stride;for(let x=1;x<=W;x++){c+=g[(y-1)*W+x-1]!==0?1:0;s[at+x]=c+s[p+x];}}let ok=new Uint8Array(g.length),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++){let a=(y-t)*stride,z=(y+b+1)*stride;for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1;if(s[z+xb]-s[a+xb]-s[z+xa]+s[a+xa]===0)ok[y*W+x]=1;}}return ok;}

function reach(g,w,h){let ok=freeMask(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),s=SPAWN[1]*W+SPAWN[0];if(!ok[s])throw Error("SPAWN BLOCKED "+w);let a=0,b=1;q[0]=s;seen[s]=1;while(a<b){let i=q[a++],x=i%W,y=(i-x)/W,v=i-1;if(x&&ok[v]&&!seen[v]){seen[v]=1;q[b++]=v;}v=i+1;if(x<W-1&&ok[v]&&!seen[v]){seen[v]=1;q[b++]=v;}v=i-W;if(y&&ok[v]&&!seen[v]){seen[v]=1;q[b++]=v;}v=i+W;if(y<H-1&&ok[v]&&!seen[v]){seen[v]=1;q[b++]=v;}}return {connected:b,missing:SITES.filter(a=>!seen[a[1]+W*a[2]]).map(a=>a[0])};}

function sha256(bytes){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],n=bytes.length,len=((n+9+63)>>6)<<6,msg=new Uint8Array(len);msg.set(bytes);msg[n]=128;let hi=Math.floor(n*8/4294967296),lo=(n*8)>>>0;for(let i=0;i<4;i++){msg[len-8+i]=(hi>>>(24-8*i))&255;msg[len-4+i]=(lo>>>(24-8*i))&255;}let rot=(v,s)=>((v>>>s)|(v<<(32-s)))>>>0;for(let off=0;off<len;off+=64){let w=new Uint32Array(64);for(let i=0;i<16;i++){let p=off+i*4;w[i]=((msg[p]<<24)|(msg[p+1]<<16)|(msg[p+2]<<8)|msg[p+3])>>>0;}for(let i=16;i<64;i++){let v=w[i-15],z=w[i-2];w[i]=(w[i-16]+(rot(v,7)^rot(v,18)^(v>>>3))+w[i-7]+(rot(z,17)^rot(z,19)^(z>>>10)))>>>0;}let [a,b,c,d,e,f,g,t]=h;for(let i=0;i<64;i++){let s1=rot(e,6)^rot(e,11)^rot(e,25),ch=(e&f)^(~e&g),tmp1=(t+s1+ch+K[i]+w[i])>>>0,s0=rot(a,2)^rot(a,13)^rot(a,22),maj=(a&b)^(a&c)^(b&c),tmp2=(s0+maj)>>>0;t=g;g=f;f=e;e=(d+tmp1)>>>0;d=c;c=b;b=a;a=(tmp1+tmp2)>>>0;}h=[(h[0]+a)>>>0,(h[1]+b)>>>0,(h[2]+c)>>>0,(h[3]+d)>>>0,(h[4]+e)>>>0,(h[5]+f)>>>0,(h[6]+g)>>>0,(h[7]+t)>>>0];}return h.map(v=>v.toString(16).padStart(8,"0")).join("");}

function ascii(s){let a=new Uint8Array(s.length);for(let i=0;i<s.length;i++){if(s.charCodeAt(i)>127)throw Error("non-ASCII build payload");a[i]=s.charCodeAt(i);}return a;}

function crc32(bytes,start=0,end=bytes.length){let c=0xffffffff;for(let i=start;i<end;i++){c^=bytes[i];for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}

function pngIndexed(g,x0,y0,w,h){
 function put32(a,p,n){a[p]=(n>>>24)&255;a[p+1]=(n>>>16)&255;a[p+2]=(n>>>8)&255;a[p+3]=n&255;}
 let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);
 let nblocks=Math.ceil(raw.length/65535),z=new Uint8Array(2+raw.length+5*nblocks+4),pos=0;z[pos++]=120;z[pos++]=1;
 for(let off=0;off<raw.length;){let n=Math.min(65535,raw.length-off),fin=off+n===raw.length;z[pos++]=fin?1:0;z[pos++]=n&255;z[pos++]=(n>>>8)&255;z[pos++]=(~n)&255;z[pos++]=((~n)>>>8)&255;z.set(raw.subarray(off,off+n),pos);pos+=n;off+=n;}
 let A=1,B=0;for(let v of raw){A=(A+v)%65521;B=(B+A)%65521;}put32(z,pos,((B<<16)|A)>>>0);
 let palette=new Uint8Array(768);for(let i=0;i<256;i++){palette[i*3]=14;palette[i*3+1]=16;palette[i*3+2]=20;}for(let k of Object.keys(PALETTE))palette.set(PALETTE[k],Number(k)*3);
 function chunk(name,data){let a=new Uint8Array(12+data.length);put32(a,0,data.length);for(let i=0;i<4;i++)a[4+i]=name.charCodeAt(i);a.set(data,8);put32(a,8+data.length,crc32(a,4,8+data.length));return a;}
 let hdr=new Uint8Array(13);put32(hdr,0,w);put32(hdr,4,h);hdr[8]=8;hdr[9]=3;let parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",hdr),chunk("PLTE",palette),chunk("IDAT",z),chunk("IEND",new Uint8Array(0))],img=new Uint8Array(parts.reduce((s,p)=>s+p.length,0));let off=0;for(let p of parts){img.set(p,off);off+=p.length;}return img;
}

function verifyPng(bytes,g,x0,y0,w,h){
 const get32=(v,p)=>((v[p]*16777216)+(v[p+1]<<16)+(v[p+2]<<8)+v[p+3])>>>0,signature=[137,80,78,71,13,10,26,10];for(let i=0;i<8;i++)if(bytes[i]!==signature[i])throw Error("PNG signature");
 let at=8,idat=null,ihdr=false,plte=false,ended=false;
 while(at<bytes.length){if(at+12>bytes.length)throw Error("PNG short chunk");let len=get32(bytes,at),kind=String.fromCharCode(...bytes.subarray(at+4,at+8)),end=at+12+len;if(end>bytes.length||crc32(bytes,at+4,at+8+len)!==get32(bytes,at+8+len))throw Error("PNG CRC");if(kind==="IHDR"){if(get32(bytes,at+8)!==w||get32(bytes,at+12)!==h||bytes[at+16]!==8||bytes[at+17]!==3)throw Error("PNG IHDR");ihdr=true;}if(kind==="PLTE")plte=true;if(kind==="IDAT")idat=bytes.subarray(at+8,at+8+len);if(kind==="IEND"){if(len!==0||end!==bytes.length)throw Error("PNG trailing");ended=true;}at=end;}
 if(!idat||!ihdr||!plte||!ended||idat[0]!==120||idat[1]!==1)throw Error("PNG structure");
 let raw=new Uint8Array((w+1)*h),j=2,out=0,final=false;
 while(!final){let tag=idat[j++];if((tag&6)!==0)throw Error("PNG non-stored");final=(tag&1)!==0;let n=idat[j]|(idat[j+1]<<8),inv=idat[j+2]|(idat[j+3]<<8);j+=4;if(((n^inv)&65535)!==65535||out+n>raw.length)throw Error("PNG block");raw.set(idat.subarray(j,j+n),out);out+=n;j+=n;}
 if(out!==raw.length||j!==idat.length-4)throw Error("PNG zlib length");
 let A=1,B=0;for(let v of raw){A=(A+v)%65521;B=(B+A)%65521;}if(get32(idat,j)!==(((B<<16)|A)>>>0))throw Error("PNG Adler");
 for(let y=0;y<h;y++){if(raw[y*(w+1)]!==0)throw Error("PNG filter");let off=(y0+y)*W+x0;for(let x=0;x<w;x++)if(raw[y*(w+1)+x+1]!==g[off+x])throw Error("PNG index pixel mismatch "+x+","+y);}return {bytes:bytes.length,pixels:w*h,crc:true,adler:true,parity:true};
}

function pack(){
 let a=generate(),g=a.g,{edits,visits}=encodeRects(g);
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL_HASH,spawn:SPAWN,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false},json=JSON.stringify(setup);
 if(edits.length>32768||json.length>1048576||visits>32000000)throw Error("SOURCE BUDGET");
 let replay=new Uint8Array(g.length),writes=0;for(let [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!PALETTE[m]||m===0)throw Error("BAD RECT");for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=yy*W+xx;if(replay[i])throw Error("RECT OVERLAP");replay[i]=m;writes++;}}
 for(let i=0;i<g.length;i++)if(g[i]!==replay[i])throw Error("REPLAY MISMATCH");if(writes!==visits||writes!==a.grounded)throw Error("GROUNDING OR REPLAY");
 let hist={};for(let v of g)hist[v]=(hist[v]||0)+1;
 let clearances={};for(let [w,h]of [[19,15],[23,19],[31,27]]){let r=reach(g,w,h);if(r.missing.length)throw Error("SITE "+w+"x"+h+": "+r.missing.join(","));clearances[w+"x"+h]={connected:r.connected,reached:SITES.length,missing:[]};}
 let blocked=g.slice();for(let y=590;y<684;y++)for(let x=840;x<999;x++)blocked[y*W+x]=M.C;let alternate=reach(blocked,31,27);if(alternate.missing.join(",")!=="Rift Lower Approach")throw Error("BAD PHYSICAL ALTERNATE "+alternate.missing);
 let pngs={},images=[];for(let [name,x,y,w,h] of CROPS){let bytes=pngIndexed(g,x,y,w,h),check=verifyPng(bytes,g,x,y,w,h);pngs[name]={x,y,w,h,sha256:sha256(bytes),...check};images.push({name,bytes});}
 let receipt={kind:"TORSION_RIFT_CRYOLINE_ORIGINAL_RACING_WIDE",revision:"R1",seed:"0x77F12026",engine_main_sha:ENGINE,material_cells:N,extent:[W,H],rectangles:edits.length,setup_json_bytes:json.length,work_visits:visits,source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram:hist,grounded_solids:a.grounded,discarded_detached_material_cells:a.discarded,remaining_detached:0,fluid_cells:0,reactive_cells:0,material_laws:"All occupied IDs 49,58,62,100,101,113,117,122,128 are immovable inert Solid/RuleKernel::None; no mobile materials.",midge:{hull:[4,3],model_hash:MODEL_HASH,spawn:SPAWN},sites:SITES.map(([name,x,y])=>({name,x,y})),clearances,physical_obstruction:{xywh:[840,590,159,94],material:58,remaining:SITES.length-alternate.missing.length,missing:alternate.missing,finish_reachable:!alternate.missing.includes("Finish")},grid_sha256:sha256(g),setup_sha256:sha256(ascii(json)),pngs,native:"NATIVE-UNTESTED; installed bridge rectangle capacity is unverified, possible fallback 4096"};
 return {receipt,files:[{name:"setup-torsion-rift-cryoline.json",content:json,encoding:"utf-8"},{name:"qualification.json",content:JSON.stringify(receipt,null,2)+"\n",encoding:"utf-8"},...images.map(i=>({name:i.name,content:i.bytes,encoding:"base64"}))]};
}
if(require.main===module){const fs=require("node:fs"),path=require("node:path");const out=pack();for(let f of out.files){let bytes=f.encoding==="base64"?Buffer.from(f.content):f.content;fs.writeFileSync(path.join(__dirname,f.name),bytes);}console.log(JSON.stringify({rectangles:out.receipt.rectangles,grid_sha256:out.receipt.grid_sha256,setup_sha256:out.receipt.setup_sha256,pngs:Object.keys(out.receipt.pngs).length,native:"NATIVE-UNTESTED"},null,2));}
module.exports={generate,encodeRects,freeMask,reach,pngIndexed,pack};
