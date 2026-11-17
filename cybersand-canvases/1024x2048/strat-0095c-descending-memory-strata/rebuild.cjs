'use strict';
// Exact deterministic rebuild and source-matched self-test. Node 20+; no dependencies.
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const {generate}=require('./builder.cjs');
const out=generate();
const root=__dirname;
const files={'setup-descending-memory-strata.json':Buffer.from(out.json), 'descending-memory-strata-preview.png':Buffer.from(out.png),'evidence.json':Buffer.from(JSON.stringify(out.stats,null,2)+'\n')};
for(const [name,bytes] of Object.entries(out.crops))files[name]=Buffer.from(bytes);
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const verifyOnly=process.argv.includes('--verify');
for (const [name,bytes] of Object.entries(files)) {
  const file=path.join(root,name);
  if (verifyOnly) {
    if (!fs.existsSync(file)) throw Error('Missing '+name);
    const old=fs.readFileSync(file);
    if (!bytes.equals(old)) throw Error('Mismatch '+name);
  } else fs.writeFileSync(file,bytes);
  console.log(`${name}: ${bytes.length} B sha256 ${sha256(bytes)}`);
}
const setup=JSON.parse(out.json);if(setup.extent[0]!==1024||setup.extent[1]!==2048)throw Error('extent mismatch');
if(setup.edits.length>32768||out.json.length>1048576)throw Error('budget exceeded');
if(out.stats.waypoints.some(w=>!w.reachable||w.offset!==0))throw Error('destination unreachable');
console.log(`PASS: ${out.stats.waypoints.length}/${out.stats.waypoints.length} conservative Midge waypoints; ${out.stats.rectangles} rectangles; ${out.stats.material_cells_verified} exact cells`);
