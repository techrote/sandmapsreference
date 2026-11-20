"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),zlib=require("node:zlib"),assert=require("node:assert/strict");
const {level,DEFAULT_POLICY}=require("./build.cjs");
const H=1024,W=2048,SHA=x=>crypto.createHash("sha256").update(x).digest("hex");
const J=fs.readFileSync(__dirname+"/setup-catenary-skyhook-shipyard.json");
const R=JSON.parse(fs.readFileSync(__dirname+"/qualification.json","utf8"));
const setup=JSON.parse(J.toString("utf8"));
// Source-mirror of accepted workbench_setup.gd ROOT_KEYS and native policy defaults.
const ROOT_KEYS=["version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"];
assert.deepEqual(Object.keys(setup).sort(),ROOT_KEYS.slice().sort(),"Unsupported starting setup format");
assert.deepEqual(setup.liquid_policy,DEFAULT_POLICY);
assert.equal(setup.liquid_policy.length,55);
assert.equal(setup.liquid_policy[0],0x4C435057);
assert.equal(setup.liquid_policy[19],11);
assert.equal(setup.response,"LA-SELECTIVE");
assert.equal(setup.normalize,false);assert.equal(setup.rule_radius,2);
assert.deepEqual(setup.source,[]);assert.equal(setup.material,2);
assert.equal(setup.brush,8);assert.equal(setup.fire,false);
assert.equal(setup.next_id,2);assert.equal(setup.selected,1);
assert.equal(setup.version,2);assert.deepEqual(setup.extent,[W,H]);
assert.deepEqual(setup.actors.map(a=>[a.model,a.spawn]),[["midge",[124,366]]]);
assert.ok(setup.edits.length<=32768&&J.length<=1048576);
const grid=new Uint8Array(W*H),mask=new Uint8Array(W*H);let visits=0;
for(const [x,y,w,h,m] of setup.edits){
 assert.ok(Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(w)&&Number.isInteger(h)&&Number.isInteger(m));
 assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=W&&y+h<=H);
 assert.ok(m>=0&&m<=255&&m!==10);
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  const k=yy*W+xx;assert.equal(mask[k],0,"overlap "+xx+","+yy);mask[k]=1;grid[k]=m;
 }
 visits+=w*h;
}
assert.ok(visits<=32000000);
assert.equal(setup.edits.length,R.rectangles);
assert.equal(J.length,R.setup_json_bytes);
assert.equal(visits,R.cell_visits);
assert.equal(SHA(J),R.setup_json_sha256);
assert.equal(SHA(grid),R.grid_sha256);
const hist={};for(const m of grid)hist[m]=(hist[m]||0)+1;assert.deepEqual(hist,R.histogram);
const fresh=level();assert.deepEqual(fresh.grid,grid);assert.equal(fresh.json,J.toString("utf8"));
for(const [key,value] of Object.entries(fresh.report.clearances)){
 assert.deepEqual(value,R.clearances[key]);
 assert.equal(value.reached,R.sites.length);
}
const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=(c>>>1)^(c&1?0xedb88320:0);return c>>>0});
const crc=b=>{let c=0xffffffff;for(let v of b)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0};
let total=0;
for(const entry of R.images){
 const file=fs.readFileSync(__dirname+"/"+entry.name),[x0,y0,w,h]=entry.rect;
 assert.equal(SHA(file),entry.sha256);
 assert.equal(file.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 let off=8,ended=false,ihdr=null,palette=null,idats=[];
 while(off<file.length){
  const n=file.readUInt32BE(off),tag=file.toString("ascii",off+4,off+8),end=off+n+12;
  assert.ok(end<=file.length);assert.equal(crc(file.subarray(off+4,off+8+n)),file.readUInt32BE(off+8+n),tag+" CRC");
  const payload=file.subarray(off+8,off+8+n);
  if(tag==="IHDR")ihdr=payload;
  if(tag==="PLTE")palette=payload;
  if(tag==="IDAT")idats.push(payload);
  if(tag==="IEND"){assert.equal(n,0);assert.equal(end,file.length);ended=true}
  off=end;
 }
 assert.ok(ended&&ihdr&&palette&&idats.length);
 assert.equal(ihdr.readUInt32BE(0),w);assert.equal(ihdr.readUInt32BE(4),h);
 assert.equal(ihdr[8],8);assert.equal(ihdr[9],3);assert.equal(palette.length,768);
 const raw=zlib.inflateSync(Buffer.concat(idats));assert.equal(raw.length,(w+1)*h);
 for(let y=0;y<h;y++){
  const row=y*(w+1);assert.equal(raw[row],0,"PNG filter");
  for(let x=0;x<w;x++)assert.equal(raw[row+x+1],grid[(y0+y)*W+x0+x],"PNG index mismatch "+entry.name+" "+x+","+y);
 }
 total+=w*h;
}
console.log(JSON.stringify({status:"STATIC-SELF-VERIFY-PASS",world:[W,H],material_cells:grid.length,rectangle_edits:setup.edits.length,setup_bytes:J.length,visit_work:visits,sha256:R.grid_sha256,images:R.images.length,parity_pixels:total,clearances:R.clearances,native:"NATIVE-UNTESTED"},null,2));
