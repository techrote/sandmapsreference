"use strict";
// node generate.cjs --verify (default): independent full-cell, PNG decode and byte parity.
// node generate.cjs --write: deterministically rebuild images/Setup and receipt in this folder.
const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),assert=require("assert").strict;
const {make}=require("./serialize.cjs"),{WIDTH,HEIGHT,SEED}=require("./build.cjs");
const hash=a=>crypto.createHash("sha256").update(a).digest("hex");
const built=make(),mode=process.argv[2]||"--verify",receiptPath="receipt.json";
if(!["--write","--verify"].includes(mode))throw Error("use --write or --verify");
const files=[["setup.json",Buffer.from(built.json)],...built.images.map(([name,bytes])=>[name+".png",Buffer.from(bytes)])];
const receipt=JSON.parse(fs.readFileSync(receiptPath,"utf8"));
assert.equal(built.grid.length,WIDTH*HEIGHT);
assert.equal(hash(built.grid),receipt.material_plane_sha256);
assert.equal(hash(built.json),receipt.setup_json_sha256);
assert.equal(built.rects.length,receipt.rectangle_edits);
assert.equal(Buffer.byteLength(built.json),receipt.json_bytes);
assert.equal(built.area,receipt.solid_cells);
assert.equal(built.rooted,receipt.boundary_grounded_solid_cells);
assert.equal(built.removed,receipt.discarded_during_authoring);
assert.deepEqual(built.hist,receipt.source_material_histogram);
assert.deepEqual(built.sites,receipt.exact_sites);
assert.deepEqual(built.checks,receipt.conservative_free_centre_bfs);
assert.deepEqual(built.detour,receipt.physical_obstruction_detour);
assert.equal(receipt.seed,SEED);
assert.equal(receipt.native,"NATIVE-UNTESTED");
function u32(b,i){return b.readUInt32BE(i)}
function crc(bytes){let c=0xffffffff;for(let v of bytes){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1))}return(c^0xffffffff)>>>0}
function inspectPNG(blob,box,grid){let p=8;assert.equal(blob.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 let iw=0,ih=0,plte=false,seenEnd=false,idat=[];
 while(p<blob.length){let n=u32(blob,p),t=blob.toString("ascii",p+4,p+8),data=blob.subarray(p+8,p+8+n),stored=u32(blob,p+8+n);
  assert.equal(crc(blob.subarray(p+4,p+8+n)),stored,"chunk CRC "+t);p+=12+n;
  if(t==="IHDR"){iw=u32(data,0);ih=u32(data,4);assert.equal(data[8],8);assert.equal(data[9],3)}
  if(t==="PLTE")plte=true;if(t==="IDAT")idat.push(data);if(t==="IEND"){seenEnd=true;break}
 }
 assert.equal(p,blob.length);assert.ok(plte&&seenEnd);assert.equal(iw,box[2]);assert.equal(ih,box[3]);
 const raw=zlib.inflateSync(Buffer.concat(idat));assert.equal(raw.length,(iw+1)*ih);
 for(let y=0;y<ih;y++){assert.equal(raw[y*(iw+1)],0);for(let x=0;x<iw;x++){let expected=grid[(y+box[1])*WIDTH+x+box[0]],actual=raw[y*(iw+1)+x+1];if(expected!==actual)throw Error("PNG parity at "+(x+box[0])+","+(y+box[1]))}}
 return {decoded_material_pixels:iw*ih,full_exact_cell_parity:true}
}
for(let [name,blob] of files){let prior=fs.existsSync(name)?fs.readFileSync(name):null;
 if(mode==="--verify"){assert.ok(prior,name+" missing");assert.ok(prior.equals(blob),name+" not deterministic");}
 else fs.writeFileSync(name,blob);
}
for(let [name,bytes,box] of built.images){let entry=receipt.images.find(x=>x.name===name);
 assert.ok(entry);assert.deepEqual(entry.box,box);assert.equal(entry.bytes,bytes.length);assert.equal(entry.sha256,hash(bytes));
 inspectPNG(Buffer.from(bytes),box,built.grid);
}
if(mode==="--write")fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+"\n");
console.log(JSON.stringify({result:"PASS",mode,seed:SEED,plane_cells:built.grid.length,rooted_solids:built.rooted,discarded:built.removed,rectangles:built.rects.length,json_bytes:built.json.length,sites:built.checks,obstruction:built.detour,images:built.images.map(([name,bytes])=>[name,bytes.length]),native:"NATIVE-UNTESTED"},null,2));
