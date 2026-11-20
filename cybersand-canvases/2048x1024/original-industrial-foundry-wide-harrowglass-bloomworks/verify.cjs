'use strict';
// Independent committed-artifact verification: replay Setup edits, ground and
// cardinal centre connectivity, CRC/zlib/IEND, indexed material pixel equality.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {build}=require('./build.cjs'),{CROPS,sha256,bytes,crc}=require('./format.cjs');
const {analysis,assertQualified,replay}=require('./audit.cjs');
const root=__dirname,txt=fs.readFileSync(path.join(root,'setup.json'));
if(txt.length>1048576)throw Error('Setup-v2 exceeds one MiB');
const setup=JSON.parse(txt.toString('utf8'));
const receipt=JSON.parse(fs.readFileSync(path.join(root,'receipt.json'),'utf8'));
const {grid,work,rectangles}=replay(setup),orig=build();
if(grid.length!==orig.g.length)throw Error('plane size mismatch');
for(let i=0;i<grid.length;i++)if(grid[i]!==orig.g[i])throw Error('material replay disagrees with builder '+i);
const report=analysis(grid,2048,1024,orig.sites);assertQualified(report);
if(work!==receipt.construction_work||rectangles!==receipt.rectangle_count||txt.length!==receipt.json_bytes)throw Error('construction receipt mismatch');
if(sha256(txt)!==receipt.setup_sha256||sha256(grid)!==receipt.material_plane_sha256)throw Error('material/setup SHA mismatch');
const nodeHash=crypto.createHash('sha256').update(grid).digest('hex');
if(nodeHash!==receipt.material_plane_sha256)throw Error('Node crypto independent digest mismatch');
if(JSON.stringify(report.histogram)!==JSON.stringify(receipt.materials))throw Error('histogram mismatch');
if(report.ground.rooted!==receipt.ground.rooted||report.ground.detached!==0||report.fluid_air_faces!==0)throw Error('support/fluid mismatch');
for(const f of [...report.flight,report.alternate])if(f.sites.some(s=>!s.reachable||!s.free))throw Error('exact site unreachable');
function verifyPNG(filename,x,y,w,h){
const png=fs.readFileSync(path.join(root,filename));if(png.length<57||!png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('bad PNG signature');
let off=8,ihdr=null,palette=false,idats=[],end=false;
while(off<png.length){if(off+12>png.length)throw Error('truncated PNG chunk');
const n=png.readUInt32BE(off),name=png.subarray(off+4,off+8).toString('ascii'),payload=png.subarray(off+8,off+8+n);
if(off+12+n>png.length)throw Error('truncated chunk payload');
const got=png.readUInt32BE(off+n+8),expected=crc(bytes(name),payload);if(got!==expected)throw Error('CRC mismatch '+filename+':'+name);
off+=n+12;
if(name==='IHDR'){if(ihdr)throw Error('multiple IHDR');ihdr=payload;if(ihdr.readUInt32BE(0)!==w||ihdr.readUInt32BE(4)!==h||ihdr[8]!==8||ihdr[9]!==3)throw Error('not exact 8-bit indexed material PNG')}
if(name==='PLTE'){palette=true;if(n!==768)throw Error('palette size')}
if(name==='IDAT')idats.push(payload);
if(name==='IEND'){if(n!==0||off!==png.length)throw Error('bad IEND/trailing bytes');end=true;break}
}
if(!end||!palette||!ihdr||idats.length===0)throw Error('incomplete PNG');
const decoded=zlib.inflateSync(Buffer.concat(idats));if(decoded.length!==h*(w+1))throw Error('decompression length');
for(let row=0;row<h;row++){const pos=row*(w+1);if(decoded[pos]!==0)throw Error('nonzero filter');for(let col=0;col<w;col++)if(decoded[pos+1+col]!==grid[(y+row)*2048+x+col])throw Error('PNG material pixel parity at '+filename+':'+col+','+row)}
const p=receipt.pngs[filename];if(!p||p.bytes!==png.length||p.sha256!==sha256(png)||JSON.stringify(p.viewport)!==JSON.stringify([x,y,w,h]))throw Error('image receipt mismatch');
return {file:filename,bytes:png.length,crc_zlib_iend:true,pixel_parity:true}}
const pngs=CROPS.map(z=>verifyPNG(...z));
console.log(JSON.stringify({status:'STATIC-PASS',native:'NATIVE-UNTESTED',cell_count:grid.length,rectangles,work,json_bytes:txt.length,rooted:report.ground.rooted,detached:report.ground.detached,fluid_air_faces:report.fluid_air_faces,site_reachability:report.flight.map(f=>f.sites.filter(z=>z.reachable).length),blocked_alternative:report.alternate.sites.filter(z=>z.reachable).length,pngs},null,2));
