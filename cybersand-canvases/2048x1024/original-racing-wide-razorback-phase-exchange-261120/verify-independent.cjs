'use strict';
// Independent from build.cjs: replay and pixel-check the COMMITTED Setup and PNG files.
const fs=require('node:fs'),crypto=require('node:crypto'),zlib=require('node:zlib'),path=require('node:path');
const W=2048,H=1024,hash=b=>crypto.createHash('sha256').update(b).digest('hex'),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const raw=fs.readFileSync(path.join(__dirname,'setup-razorback-phase-exchange.json')),setup=JSON.parse(raw);
const expected=['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'];
if(!eq(Object.keys(setup).sort(),expected.sort()))throw Error('SETUP_ROOT_KEYS');
if(setup.version!==2||!eq(setup.extent,[W,H])||!Array.isArray(setup.liquid_policy)||setup.liquid_policy.length!==55||setup.response!=='LA-SELECTIVE'||setup.actors.length!==1||setup.actors[0].model!=='midge'||setup.actors[0].hash!=='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'||!eq(setup.actors[0].spawn,[139,414]))throw Error('SETUP_CONTRACT');
const g=new Uint8Array(W*H),allowed=new Set([49,58,62,100,101,113,117,120,122,123,128]);let writes=0;
for(const rec of setup.edits){if(!Array.isArray(rec)||rec.length!==5)throw Error('RECT_FORMAT');
 const [x,y,w,h,m]=rec;if(![x,y,w,h,m].every(Number.isInteger)||x<0||y<0||w<1||h<1||x+w>W||y+h>H||!allowed.has(m))throw Error('RECT_INVALID');
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){let n=j*W+i;if(g[n])throw Error('RECT_OVERLAP');g[n]=m;writes++;}
}
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'qualification.json'),'utf8'));
const hist={};for(let m of g)hist[m]=(hist[m]||0)+1;
if(receipt.material_cells!==W*H||!eq(hist,receipt.histogram)||receipt.rectangles!==setup.edits.length||receipt.setup_json_bytes!==raw.length||receipt.work_visits!==writes||receipt.grid_sha256!==hash(g)||receipt.setup_sha256!==hash(raw)||receipt.grounded_solids!==writes||receipt.remaining_detached!==0)throw Error('RECEIPT_MISMATCH');
if(setup.edits.length>32768||raw.length>1048576||writes>32000000)throw Error('SOURCE_BUDGET');
const table=new Uint32Array(256);for(let x=0;x<256;x++){let c=x;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[x]=c>>>0;}
function crc(bytes){let c=0xffffffff;for(let b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
const windows={'overview.png':[0,0,2048,1024],'01-west-dispatch.png':[0,20,480,512],'02-bellows-run.png':[397,243,478,590],'03-phase-exchange.png':[806,200,504,620],'04-ion-scrubber.png':[1265,230,453,630],'05-east-return.png':[1600,245,448,615],'06-lower-service.png':[836,690,512,334]};
function pngCheck(name,coords){
 let bytes=fs.readFileSync(path.join(__dirname,name));if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('PNG_SIGNATURE '+name);
 let p=8,ids=[],end=false,palette=false,dim;while(p<bytes.length){
  if(p+12>bytes.length)throw Error('PNG_TRUNCATED '+name);
  let len=bytes.readUInt32BE(p),tag=bytes.toString('ascii',p+4,p+8),dat=bytes.subarray(p+8,p+8+len);
  if(p+12+len>bytes.length||crc(bytes.subarray(p+4,p+8+len))!==bytes.readUInt32BE(p+8+len))throw Error('PNG_CHUNK_CRC '+name);
  if(tag==='IHDR')dim=[dat.readUInt32BE(0),dat.readUInt32BE(4),dat[8],dat[9]];
  if(tag==='PLTE')palette=true;if(tag==='IDAT')ids.push(dat);if(tag==='IEND')end=true;
  p+=12+len;if(end)break;
 }
 if(!end||p!==bytes.length||!palette||!eq(dim,[coords[2],coords[3],8,3]))throw Error('PNG_STRUCTURE '+name);
 const [x0,y0,w,h]=coords,data=zlib.inflateSync(Buffer.concat(ids));if(data.length!==(w+1)*h)throw Error('PNG_ZLIB_LENGTH '+name);
 for(let y=0;y<h;y++){let at=y*(w+1),src=(y0+y)*W+x0;if(data[at]!==0)throw Error('PNG_FILTER '+name);for(let x=0;x<w;x++)if(data[at+1+x]!==g[src+x])throw Error('PNG_MATERIAL_PIXEL '+name+':'+x+','+y);}
 if(receipt.pngs[name].sha256!==hash(bytes)||receipt.pngs[name].bytes!==bytes.length||!eq([receipt.pngs[name].x,receipt.pngs[name].y,receipt.pngs[name].w,receipt.pngs[name].h],coords))throw Error('PNG_RECEIPT '+name);
}
for(const [name,coords]of Object.entries(windows))pngCheck(name,coords);
// Fresh complete in-bounds conservative Midge envelope, 4-neighbour BFS. No snapping.
function legal(g,w,h){const row=W+1,s=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let n=0;for(let x=1;x<=W;x++){n+=g[(y-1)*W+x-1]!==0?1:0;s[y*row+x]=n+s[(y-1)*row+x];}}
 const valid=new Uint8Array(g.length),left=w>>1,right=w-1-left,above=h>>1,below=h-1-above;
 for(let y=above;y<H-below;y++)for(let x=left;x<W-right;x++){let x1=x-left,x2=x+right+1,y1=y-above,y2=y+below+1;if(s[y2*row+x2]-s[y1*row+x2]-s[y2*row+x1]+s[y1*row+x1]===0)valid[y*W+x]=1;}
 return valid;
}
function flood(g,w,h){const valid=legal(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),at=139+414*W;if(!valid[at])throw Error('SPAWN_NOT_FREE');let head=0,tail=1;q[0]=at;seen[at]=1;
 while(head<tail){let n=q[head++],x=n%W,y=(n-x)/W;for(let k of [x?n-1:-1,x<W-1?n+1:-1,y?n-W:-1,y<H-1?n+W:-1])if(k>=0&&valid[k]&&!seen[k]){seen[k]=1;q[tail++]=k;}}
 return {connected:tail,missing:receipt.sites.filter(p=>!seen[p.x+W*p.y]).map(p=>p.name)};
}
for(const [w,h]of [[19,15],[23,19],[31,27]]){let r=flood(g,w,h);if(r.missing.length||r.connected!==receipt.clearances[w+'x'+h].connected)throw Error('SITE_BFS '+w+'x'+h+':'+r.missing);}
const gate=g.slice();for(let y=365;y<450;y++)for(let x=949;x<1091;x++)gate[y*W+x]=58;let alter=flood(gate,31,27);if(!eq(alter.missing,['Phase Transfer Upper'])||receipt.physical_obstruction.remaining!==receipt.sites.length-1)throw Error('PHYSICAL_ALTERNATE');
// Independently test that all occupied solids connect through material cells to a boundary.
const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let head=0,tail=0;
function add(i){if(g[i]&&!seen[i]){seen[i]=1;q[tail++]=i;}}
for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
while(head<tail){let n=q[head++],x=n%W,y=(n-x)/W;if(x)add(n-1);if(x<W-1)add(n+1);if(y)add(n-W);if(y<H-1)add(n+W);}
if(tail!==writes)throw Error('DETACHED_SOLIDS '+(writes-tail));
console.log(JSON.stringify({result:'SOURCE_STATIC_PASS',grid_sha256:hash(g),setup_sha256:hash(raw),rectangles:setup.edits.length,writes,exact_sites:receipt.sites.length,png_pixel_parity:Object.keys(windows).length,grounded_solids:tail,native:'NATIVE-UNTESTED'},null,2));
