'use strict';
// Portable deterministic image and receipt encoders for the actual material grid.
// No external dependencies for PNG writing; Node can verify the resulting zlib stream.
const ENGINE='de109d0131641d6adc8d25bb9ced7ca3d4991105';
const ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
function setup(b,edits){return {version:2,extent:[b.W,b.H],actors:[{id:1,model:'midge',hash:ACTOR_HASH,spawn:[b.sites[0][1],b.sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false}}
function bytes(s){const b=new Uint8Array(s.length);for(let i=0;i<s.length;i++){const v=s.charCodeAt(i);if(v>127)throw Error('ASCII-only bytes input');b[i]=v}return b}
function base64(data){const T='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';let s='';for(let i=0;i<data.length;i+=3){const a=data[i],b=i+1<data.length?data[i+1]:0,c=i+2<data.length?data[i+2]:0;const k=(a<<16)|(b<<8)|c;s+=T[(k>>>18)&63]+T[(k>>>12)&63]+(i+1<data.length?T[(k>>>6)&63]:'=')+(i+2<data.length?T[k&63]:'=')}return s}
function sha256(src){
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
const n=src.length,m=Math.ceil((n+9)/64)*64,buf=new Uint8Array(m);buf.set(src);buf[n]=128;const bits=n*8,hi=Math.floor(bits/4294967296),lo=bits>>>0;
for(let j=0;j<4;j++){buf[m-8+j]=(hi>>>(24-8*j))&255;buf[m-4+j]=(lo>>>(24-8*j))&255}
let w=new Int32Array(64);for(let pos=0;pos<m;pos+=64){for(let i=0;i<16;i++)w[i]=((buf[pos+4*i]<<24)|(buf[pos+4*i+1]<<16)|(buf[pos+4*i+2]<<8)|buf[pos+4*i+3]);for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2],s0=((a>>>7)|(a<<25))^((a>>>18)|(a<<14))^(a>>>3),s1=((b>>>17)|(b<<15))^((b>>>19)|(b<<13))^(b>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0}
let [a,b,c,d,e,f,g,h]=H;for(let i=0;i<64;i++){const x=((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7)),ch=(e&f)^((~e)&g),t1=(h+x+ch+K[i]+w[i])|0,y=((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10)),maj=(a&b)^(a&c)^(b&c),t2=(y+maj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0}
return H.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('')}
const COLORS={0:[8,11,18],3:[47,127,210],8:[241,78,31],57:[116,63,54],58:[119,123,128],62:[126,141,153],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],72:[37,60,76],76:[227,182,47],77:[55,243,228],79:[255,181,46],100:[54,56,61],104:[200,152,98],117:[90,94,100],131:[26,26,29]};
const LEN=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DIST=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
function deflate(data,stride){
const out=[0x78,0x01];let acc=0,nb=0;
function bit(v,n){acc|=v<<nb;nb+=n;while(nb>=8){out.push(acc&255);acc>>>=8;nb-=8}}
function rev(x,n){let r=0;for(let i=0;i<n;i++){r=(r<<1)|(x&1);x>>>=1}return r}
function symbol(x){let v,n;if(x<144){v=48+x;n=8}else if(x<256){v=400+x-144;n=9}else if(x<280){v=x-256;n=7}else{v=192+x-280;n=8}bit(rev(v,n),n)}
bit(1,1);bit(1,2);
for(let i=0;i<data.length;){let best=0,dist=0,max=Math.min(258,data.length-i);
for(const d of [1,stride,stride*2,2,3,4,8,16,32,64,128]){if(d>i||d>32768)continue;let n=0;while(n<max&&data[i+n]===data[i+n-d])n++;if(n>best&&n>=3){best=n;dist=d}if(best===max)break}
if(best<3){symbol(data[i]);i++;continue}
let l=0;while(l<28&&!(best>=LEN[l]&&best<LEN[l]+(1<<LE[l])))l++;symbol(257+l);if(LE[l])bit(best-LEN[l],LE[l]);
let d=0;while(d<29&&!(dist>=DIST[d]&&dist<DIST[d]+(1<<DE[d])))d++;bit(rev(d,5),5);if(DE[d])bit(dist-DIST[d],DE[d]);i+=best}
symbol(256);if(nb)out.push(acc&255);
let a=1,b=0;for(let v of data){a=(a+v)%65521;b=(b+a)%65521}out.push((b>>>8)&255,b&255,(a>>>8)&255,a&255);
return new Uint8Array(out)}
let crcTable=null;function crc(data1,data2){if(!crcTable){crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));crcTable[n]=c>>>0}}let c=0xffffffff;for(const data of [data1,data2])for(let v of data)c=crcTable[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0}
function png(b,x,y,w,h){if(x<0||y<0||w<1||h<1||x+w>b.W||y+h>b.H)throw Error('PNG crop out of bounds');const raw=new Uint8Array(h*(w+1));for(let j=0;j<h;j++)raw.set(b.g.subarray((y+j)*b.W+x,(y+j)*b.W+x+w),j*(w+1)+1);
const palette=new Uint8Array(768);for(const [id,rgb] of Object.entries(COLORS))palette.set(rgb,+id*3);
const chunks=[];function chunk(name,data){const a=bytes(name),n=data.length,z=new Uint8Array(n+12);z[0]=n>>>24;z[1]=n>>>16;z[2]=n>>>8;z[3]=n;z.set(a,4);z.set(data,8);const c=crc(a,data);z[n+8]=c>>>24;z[n+9]=c>>>16;z[n+10]=c>>>8;z[n+11]=c;chunks.push(z)}
const ih=new Uint8Array(13);ih[0]=w>>>24;ih[1]=w>>>16;ih[2]=w>>>8;ih[3]=w;ih[4]=h>>>24;ih[5]=h>>>16;ih[6]=h>>>8;ih[7]=h;ih[8]=8;ih[9]=3;
chunk('IHDR',ih);chunk('PLTE',palette);chunk('IDAT',deflate(raw,w+1));chunk('IEND',new Uint8Array(0));const n=8+chunks.reduce((v,c)=>v+c.length,0),file=new Uint8Array(n);file.set([137,80,78,71,13,10,26,10]);let pos=8;for(const c of chunks){file.set(c,pos);pos+=c.length}return file}
const CROPS=[['overview.png',0,0,2048,1024],['01-ore-reception.png',50,225,385,470],['02-induction-spires.png',401,229,457,469],['03-vacuum-arch.png',851,201,386,481],['04-rolling-mill.png',1239,380,426,318],['05-quench-departure.png',1675,383,334,343],['06-underdeck-rail.png',50,780,1950,213]];
if(typeof module!=='undefined')module.exports={ENGINE,ACTOR_HASH,POLICY,setup,bytes,base64,sha256,COLORS,deflate,png,CROPS,crc};
