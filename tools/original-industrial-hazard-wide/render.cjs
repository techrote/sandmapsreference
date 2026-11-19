'use strict';
// PNG palette indices are literal CyberSand material IDs, one index per cell.
// Standard PNG indexed-8, filter 0; zlib DEFLATE fixed canonical Huffman.
// Deterministic in Node and the independent static verifier, no network/runtime.
const W=2048;
const color={0:[8,13,27],3:[36,137,214],8:[238,99,37],58:[83,96,117],
62:[140,164,178],63:[56,118,143],68:[104,142,157],70:[222,214,192],
76:[242,177,37],77:[53,225,221],79:[255,177,55],100:[60,74,83],
101:[34,38,57],104:[175,111,71],117:[165,166,172],120:[108,209,223],
122:[230,217,156],123:[150,224,120],128:[75,105,136],131:[208,138,82]};
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]}
function crc(b){let c=-1;for(const v of b){c^=v;for(let k=0;k<8;k++)c=c&1?(c>>>1)^0xedb88320:c>>>1;}return(c^-1)>>>0}
function chunk(type,d){const b=new Uint8Array(d.length+12);b.set(be(d.length));
for(let i=0;i<4;i++)b[4+i]=type.charCodeAt(i);b.set(d,8);
b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b;}
function rev(v,n){let o=0;while(n--){o=o<<1|v&1;v>>>=1;}return o;}
function zlib(raw){const out=[120,1];let bits=0,used=0;
function wr(v,n){bits|=v<<used;used+=n;while(used>=8){out.push(bits&255);bits>>>=8;used-=8;}}
function sym(s){let c,n;if(s<=143){c=48+s;n=8;}else if(s<=255){c=400+s-144;n=9;}
else if(s<=279){c=s-256;n=7;}else{c=192+s-280;n=8;}wr(rev(c,n),n);}
const bases=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const extras=[...Array(8).fill(0),...Array(4).fill(1),...Array(4).fill(2),
...Array(4).fill(3),...Array(4).fill(4),...Array(4).fill(5),0];
function run(n){let i=0;while(i<28&&bases[i+1]<=n)i++;sym(i+257);if(extras[i])wr(n-bases[i],extras[i]);wr(0,5);}
wr(1,1);wr(1,2);
for(let i=0;i<raw.length;){let n=1;while(i+n<raw.length&&n<258&&raw[i+n]===raw[i])n++;
if(n>=4&&i>0&&raw[i-1]===raw[i]){run(n);i+=n;}else{sym(raw[i]);i++;}}
sym(256);if(used)out.push(bits&255);
let s1=1,s2=0;for(let v of raw){s1=(s1+v)%65521;s2=(s2+s1)%65521;}
out.push(...be(((s2<<16)|s1)>>>0));return new Uint8Array(out);}
function make(grid,x0,y0,w,h,step=1){
if(x0<0||y0<0||w<=0||h<=0||x0+w>W||y0+h>1024||step<1||w%step||h%step)
throw Error('invalid real-cell PNG crop');
const tw=w/step,th=h/step,raw=new Uint8Array((tw+1)*th);
for(let y=0;y<th;y++)for(let x=0;x<tw;x++)raw[y*(tw+1)+x+1]=grid[(y0+y*step)*W+x0+x*step];
const palette=new Uint8Array(256*3);
for(let i=0;i<256;i++)palette.set(color[i]||[10,12,21],i*3);
const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),
chunk('IHDR',new Uint8Array([...be(tw),...be(th),8,3,0,0,0])),
chunk('PLTE',palette),chunk('IDAT',zlib(raw)),chunk('IEND',new Uint8Array())];
let bytes=new Uint8Array(parts.reduce((n,p)=>n+p.length,0)),pos=0;
for(const part of parts){bytes.set(part,pos);pos+=part.length;}return bytes;
}
function base64(bytes){const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',out=[];
for(let i=0;i<bytes.length;i+=3){let n=(bytes[i]<<16)|((bytes[i+1]||0)<<8)|(bytes[i+2]||0);
out.push(abc[n>>>18],abc[(n>>>12)&63],i+1<bytes.length?abc[(n>>>6)&63]:'=',i+2<bytes.length?abc[n&63]:'=');}return out.join('');}
module.exports={make,base64,color};
