'use strict';
const fs=require('node:fs'),path=require('node:path');
const {buildWorld}=require('./geometry.cjs');
function sha256(bytes){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 const len=bytes.length,n=Math.ceil((len+9)/64)*64,pad=new Uint8Array(n);pad.set(bytes);pad[len]=128;
 const hi=Math.floor(len/536870912),lo=(len*8)>>>0;
 for(let j=0;j<4;j++){pad[n-8+j]=(hi>>>(24-j*8))&255;pad[n-4+j]=(lo>>>(24-j*8))&255}
 let w=new Uint32Array(64),ro=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let i=0;i<n;i+=64){for(let j=0;j<16;j++){let p=i+j*4;w[j]=((pad[p]<<24)|(pad[p+1]<<16)|(pad[p+2]<<8)|pad[p+3])>>>0}
 for(let j=16;j<64;j++){let x=w[j-15],y=w[j-2],s0=ro(x,7)^ro(x,18)^(x>>>3),s1=ro(y,17)^ro(y,19)^(y>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0}
 let[a,b,c,d,e,f,g,h]=H;
 for(let j=0;j<64;j++){let s1=ro(e,6)^ro(e,11)^ro(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[j]+w[j])>>>0,s0=ro(a,2)^ro(a,13)^ro(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}
 for(let j=0;j<8;j++)H[j]=(H[j]+[a,b,c,d,e,f,g,h][j])>>>0;
 }
 return H.map(x=>x.toString(16).padStart(8,'0')).join('');
}
function fixedDeflate(raw){
 const LB=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 const DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
 let arr=[0x78,0x9c],bitbuf=0,nb=0;
 function put(v,n){bitbuf|=v<<nb;nb+=n;while(nb>=8){arr.push(bitbuf&255);bitbuf>>>=8;nb-=8}}
 function rev(v,n){let r=0;for(let i=0;i<n;i++){r=(r<<1)|(v&1);v>>>=1}return r}
 function sym(s){if(s<144)put(rev(s+48,8),8);else if(s<256)put(rev(s-144+400,9),9);else if(s<280)put(rev(s-256,7),7);else put(rev(s-280+192,8),8)}
 put(1,1);put(1,2);
 const head=new Int32Array(65536),prev=new Int32Array(raw.length);head.fill(-1);let p=0;
 function key(i){return ((raw[i]*251+raw[i+1]*67+raw[i+2]*3)&65535)}
 while(p<raw.length){
  let best=0,dist=0;
  if(p+3<raw.length){let h=key(p),q=head[h],n=0;while(q>=0&&p-q<=32768&&n++<16){let cap=Math.min(258,raw.length-p),z=0;while(z<cap&&raw[q+z]===raw[p+z])z++;if(z>best&&z>=3){best=z;dist=p-q;if(z===cap)break}q=prev[q]}}
  let steps=best>=3?best:1;
  if(best>=3){let li=LB.length-1;while(li>0&&LB[li]>best)li--;sym(257+li);put(best-LB[li],LE[li]);let di=DB.length-1;while(di>0&&DB[di]>dist)di--;put(rev(di,5),5);put(dist-DB[di],DE[di]);}else sym(raw[p]);
  for(let j=0;j<steps;j++){let k=p+j;if(k+2<raw.length){let h=key(k);prev[k]=head[h];head[h]=k}}p+=steps;
 }
 sym(256);if(nb>0)arr.push(bitbuf&255);
 let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521}
 arr.push((b>>>8)&255,b&255,(a>>>8)&255,a&255);
 return new Uint8Array(arr);
}
function crc32(bytes){let c=0xffffffff;for(let v of bytes){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function concat(arr){let n=0;for(let a of arr)n+=a.length;let out=new Uint8Array(n),p=0;for(let a of arr){out.set(a,p);p+=a.length}return out}
function chunk(tag,data){let out=new Uint8Array(data.length+12),len=data.length;out[0]=(len>>>24)&255;out[1]=(len>>>16)&255;out[2]=(len>>>8)&255;out[3]=len&255;for(let i=0;i<4;i++)out[4+i]=tag.charCodeAt(i);out.set(data,8);let c=crc32(out.subarray(4,8+len));for(let i=0;i<4;i++)out[8+len+i]=(c>>>(24-i*8))&255;return out}
function png(grid,W,palette,x0,y0,w,h){
 let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(grid.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);
 let ih=new Uint8Array(13);ih[0]=(w>>>24)&255;ih[1]=(w>>>16)&255;ih[2]=(w>>>8)&255;ih[3]=w&255;ih[4]=(h>>>24)&255;ih[5]=(h>>>16)&255;ih[6]=(h>>>8)&255;ih[7]=h&255;ih[8]=8;ih[9]=3;
 let pl=new Uint8Array(256*3);for(let i=0;i<256;i++){pl[i*3]=14;pl[i*3+1]=16;pl[i*3+2]=20}for(let [id,rgb]of Object.entries(palette))pl.set(rgb,+id*3);
 const z=fixedDeflate(raw);
 return concat([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("PLTE",pl),chunk("IDAT",z),chunk("IEND",new Uint8Array(0))]);
}
function ascii(s){let out=new Uint8Array(s.length);for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c>127)throw Error("non-ascii "+c);out[i]=c}return out}
function buildFiles(){
 const w=buildWorld();
 if(w.N!==2097152||w.grounded!==w.visits||w.edits.length>32768||Object.values(w.clear).some(a=>a.missing.length)||w.blocked.reachable!==w.sites.length-1||w.blocked.missing[0]!=='Severable graded switch')throw Error("source-static route or obstruction invalid");
 const rawSetup=JSON.stringify(w.setup),cells=new Uint8Array(w.N),used=new Uint8Array(w.N);let total=0;
 for(let [x,y,ww,hh,m] of w.edits){if(x<0||y<0||x+ww>w.W||y+hh>w.H||ww<1||hh<1||!w.palette[m])throw Error("invalid rect");
 for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){let p=yy*w.W+xx;if(used[p])throw Error("overlap");used[p]=1;cells[p]=m;total++}}
 for(let i=0;i<w.N;i++)if(cells[i]!==w.g[i])throw Error("replay mismatch");
 if(total!==w.grounded||rawSetup.length>1048576)throw Error("source budget");
 const pngs={},files=[["setup.json",rawSetup,"utf-8"]];
 for(let [name,x,y,ww,hh] of w.crops){
 const bytes=png(w.g,w.W,w.palette,x,y,ww,hh);if(bytes.length>3000000)throw Error("oversized png "+name);
 pngs[name]={x,y,w:ww,h:hh,bytes:bytes.length,pixels:ww*hh,sha256:sha256(bytes),source_grid_parity:"encoder direct material-index pixels",crc32:true,zlib_fixed_deflate:true};files.push([name,bytes,"base64"]); }
 const receipt={kind:"WORLDGROUP_TRANSIT_SWITCHGLASS_CUTLINE_INCLINE_TERRACED_HILLSIDE",revision:"R1",seed:"0x261121e2",base_map_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",accepted_engine_main_read_only:"f7e056c9b8791106e22f2d1c295043783d8a9701",donor:"Primary Tungsten Sawtooth @ 7fc24855cf521c90bf67f4afb08685e490473201 (signal/amber/cableway vocabulary only); Switchglass 01 and Meridian 01-06 inspected as negative design precedents; original seven-step hillside and cut-and-cover geometry",extent:[w.W,w.H],material_cells:w.N,allowed_material_ids:Object.keys(w.palette).map(Number),grounded_inert_solids:w.grounded,discarded_unattached_candidate_cells:w.detached,remaining_detached:0,fluid_granular_reactive:0,rectangle_count:w.edits.length,setup_json_bytes:rawSetup.length,material_work_visits:w.visits,source_limits:{rectangles:32768,setup_bytes:1048576,material_work:32000000},grid_sha256:sha256(w.g),setup_sha256:sha256(ascii(rawSetup)),histogram:w.histogram,sites:w.sites.map(([name,x,y])=>({name,x,y})),midge_clearances:w.clear,physical_obstruction:{xywh:w.obs,material:58,after_31x27:w.blocked,covered_site:"Severable graded switch",other_sites_reachable:w.blocked.reachable},pngs,native:"NATIVE-UNTESTED: no installed CyberDemoBridge, Godot/Workbench, Rapier, actual input/collision/ticks or cold save/reopen executed",independent_review:"PENDING: Art, Technical, Shepherd at exact committed HEAD",ci:"NOT CLAIMED",corpus_role:"seven-step hillside, four graded tram incline segments, five differentiated station precincts, five segmented cut-and-cover service galleries with shaft-rejoin emergency access and editable damaged transfer"};
 files.push(["receipt.json",JSON.stringify(receipt,null,2)+"\n","utf-8"]);
 return {files,receipt,world:w};
}
if(require.main===module){const z=buildFiles();for(const [name,content] of z.files){fs.writeFileSync(path.join(__dirname,name),typeof content==='string'?content:Buffer.from(content))}console.log(JSON.stringify({grid_sha256:z.receipt.grid_sha256,rectangles:z.receipt.rectangle_count,clear:z.receipt.midge_clearances,blocked:z.receipt.physical_obstruction},null,2));}
module.exports={buildFiles};
