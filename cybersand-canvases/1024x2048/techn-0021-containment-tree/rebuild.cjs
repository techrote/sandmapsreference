'use strict';
const fs=require('fs');
const crypto=require('crypto');
const {generate}=require('./builder.cjs');
const r=generate();
const outputs={
 'setup-containment-tree.json':Buffer.from(r.json,'utf8'),
 'containment-tree-preview.png':Buffer.from(r.png),
 'containment-tree-detail-upper.png':Buffer.from(r.details.upper),
 'containment-tree-detail-middle.png':Buffer.from(r.details.middle),
 'containment-tree-detail-lower.png':Buffer.from(r.details.lower),
 'evidence.json':Buffer.from(JSON.stringify(r.evidence,null,2)+'\n','utf8'),
};
let bad=0;
for(const [name,bytes] of Object.entries(outputs)){
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 if(process.argv.includes('--verify')){
   if(!fs.existsSync(name)||!fs.readFileSync(name).equals(bytes)){console.error('FAIL '+name);bad++;}
   else console.log('PASS '+name+' '+hash);
 }else{
   fs.writeFileSync(name,bytes);
   console.log('WRITE '+name+' '+bytes.length+' bytes SHA-256 '+hash);
 }
}
if(bad)process.exit(1);
