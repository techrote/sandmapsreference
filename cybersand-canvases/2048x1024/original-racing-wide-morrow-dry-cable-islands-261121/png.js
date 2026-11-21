/* Pure-JS deterministic indexed-material PNG encoder; no libraries/filesystem/network.
 * Converts literal material-ID bytes to palette-indexed PNG bytes; each crop is 1:1.
 * Uses a legal fixed-Huffman zlib stream with distance-1 repetition coding.
 */
const PALETTE256 = (()=>{const p=new Uint8Array(768);for(let i=0;i<MATERIALS.length;i++){const id=MATERIALS[i],rgb=COLORS[i];p.set(rgb,id*3)}return p})();
function makePng(grid,x,y,w,h){
 const data=new Uint8Array((w+1)*h);
 for(let yy=0;yy<h;yy++){
  let k=yy*(w+1);data[k++]=1;let prev=0;
  for(let xx=0;xx<w;xx++){const b=grid[(y+yy)*W+(x+xx)];data[k++]=(b-prev+256)&255;prev=b}
 }
 const LENBASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
 const LENEX=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 const bits=[];let bitpos=0,bitacc=0;
 function writeBits(n,count){for(let i=0;i<count;i++){bitacc|=((n>>i)&1)<<bitpos;bitpos++;if(bitpos===8){bits.push(bitacc);bitpos=0;bitacc=0}}}
 function rev(n,count){let v=0;for(let i=0;i<count;i++){v=(v<<1)|(n&1);n>>>=1}return v}
 function symbol(s){let code,size;if(s<=143){code=0x30+s;size=8}else if(s<=255){code=0x190+s-144;size=9}else if(s<=279){code=s-256;size=7}else{code=0xc0+s-280;size=8}writeBits(rev(code,size),size)}
 // One complete final fixed-Huffman block: BFINAL=1, BTYPE=01.
 writeBits(1,1);writeBits(1,2);
 let i=0;
 while(i<data.length){const byte=data[i];let count=1;while(i+count<data.length&&data[i+count]===byte&&count<32768)count++;
  if(count<4){for(let j=0;j<count;j++)symbol(byte);i+=count;continue}
  if(i===0 || data[i-1]!==byte){symbol(byte);i++;count--}
  while(count>=3){let n=Math.min(count,258),c=28;while(c>0&&LENBASE[c]>n)c--;
   const base=LENBASE[c],extra=LENEX[c],maxLen=base+(extra?(1<<extra)-1:0);
   if(n>maxLen)n=maxLen;
   symbol(257+c);if(extra)writeBits(n-base,extra);writeBits(0,5);count-=n;i+=n;
  }
  while(count>0){symbol(byte);count--;i++}
 }
 symbol(256);if(bitpos)bits.push(bitacc);
 let a=1,b=0;for(const d of data){a=(a+d)%65521;b=(b+a)%65521}
 const z=new Uint8Array(bits.length+6);z[0]=0x78;z[1]=0x01;z.set(bits,2);const adler=((b<<16)|a)>>>0;
 z[z.length-4]=(adler>>>24)&255;z[z.length-3]=(adler>>>16)&255;z[z.length-2]=(adler>>>8)&255;z[z.length-1]=adler&255;
 const uint32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
 const crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let v=n;for(let j=0;j<8;j++)v=v&1?0xedb88320^(v>>>1):v>>>1;crcTable[n]=v>>>0}
 function chunk(name,payload){const type=Array.from(name).map(c=>c.charCodeAt(0)),crcData=type.concat(Array.from(payload));let c=0xffffffff;for(const b of crcData)c=crcTable[(c^b)&255]^(c>>>8);c=(c^0xffffffff)>>>0;return [...uint32(payload.length),...type,...payload,...uint32(c)]}
 const ihdr=new Uint8Array([...uint32(w),...uint32(h),8,3,0,0,0]);
 const chunks=[Uint8Array.from([137,80,78,71,13,10,26,10]),Uint8Array.from(chunk('IHDR',ihdr)),Uint8Array.from(chunk('PLTE',PALETTE256)),Uint8Array.from(chunk('IDAT',z)),Uint8Array.from(chunk('IEND',new Uint8Array(0)))];
 const out=new Uint8Array(chunks.reduce((a,b)=>a+b.length,0));let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length}return out;
}
function base64(bytes){const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';let out='';for(let i=0;i<bytes.length;i+=3){const a=bytes[i],b=i+1<bytes.length?bytes[i+1]:0,c=i+2<bytes.length?bytes[i+2]:0;const triple=(a<<16)|(b<<8)|c;out+=chars[(triple>>>18)&63]+chars[(triple>>>12)&63]+(i+1<bytes.length?chars[(triple>>>6)&63]:'=')+(i+2<bytes.length?chars[triple&63]:'=')}return out}
