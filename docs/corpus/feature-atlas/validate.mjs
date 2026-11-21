#!/usr/bin/env node
// FEATURE-ATLAS-001: zero-dependency structural, provenance and identity checker.
// Run: node docs/corpus/feature-atlas/validate.mjs
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url));
const data=readFileSync(resolve(dir,'states.v1.jsonl'),'utf8');
const rows=data.split(/\r?\n/).filter(Boolean);
const baseline=JSON.parse(readFileSync(resolve(dir,'baseline.lock.v1.json'),'utf8'));
const lockedText=rows.slice(0,baseline.locked_first_lines).join('\n')+'\n';
const gitBlob=createHash('sha1').update('blob '+Buffer.byteLength(lockedText)+'\0').update(lockedText).digest('hex');
if(rows.length<baseline.locked_first_lines||gitBlob!==baseline.git_blob_sha1)throw Error('Immutable initial feature-state prefix modified or deleted');
const manifest=JSON.parse(readFileSync(resolve(dir,'manifest.v1.json'),'utf8'));
const schema=JSON.parse(readFileSync(resolve(dir,'schema.v1.json'),'utf8'));
if(schema.properties.schema_version.const!==1) throw Error('Wrong schema');
const sha=/^[a-f0-9]{40}$/, hash=/^[a-f0-9]{64}$/;
const seen=new Set(), known=new Map(), counts={}, byPR={};
function assert(cond,msg){if(!cond)throw Error(msg)}
function region(a,which){if(a===null)return;assert(Array.isArray(a)&&a.length===4&&a.every(Number.isInteger),'bad '+which);assert(a[0]>=0&&a[1]>=0&&a[2]>a[0]&&a[3]>a[1]&&a[2]<=1024&&a[3]<=2048,'out-of-bounds '+which)}
for(let i=0;i<rows.length;i++){
 let s;try{s=JSON.parse(rows[i])}catch(e){throw Error('JSONL line '+(i+1)+': '+e)}
 const prefix='line '+(i+1)+' '+s.state_id+': ';
 for(const field of schema.required)assert(Object.hasOwn(s,field),prefix+'missing '+field);
 assert(s.schema_version===1,prefix+'bad version');
 assert(/^P\d+-[A-Z0-9-]+$/.test(s.feature_id),prefix+'bad feature id');
 assert(s.state_id===s.feature_id+'@'+s.provenance.portrait_head,prefix+'state/head mismatch');
 assert(!seen.has(s.state_id),prefix+'duplicate state');
 seen.add(s.state_id);
 const p=s.provenance,e=s.evidence,l=s.location;
 assert(p.repository==='techrote/sandmapsreference'&&sha.test(p.portrait_head)&&sha.test(p.donor_head),prefix+'provenance');
 assert(p.portrait_pr>0&&p.donor_pr>0&&s.feature_id.startsWith('P'+p.portrait_pr+'-'),prefix+'PR identity');
 assert(p.dimensions[0]===1024&&p.dimensions[1]===2048,prefix+'extent');
 assert(/^cybersand-canvases\/1024x2048\/[a-z0-9-]+\/$/.test(p.map_folder),prefix+'folder');
 assert(p.setup_sha256===null||hash.test(p.setup_sha256),prefix+'setup hash');
 assert(e.reviewed_head===p.portrait_head,prefix+'review/head mismatch');
 assert(['BASELINE','CONTROL','POST_REPAIR'].includes(s.stage),prefix+'stage');
 assert(['GOOD','WEAK','INTENTIONAL','PENDING'].includes(s.classification),prefix+'class');
 assert(['HIGH','MEDIUM','LOW'].includes(s.confidence),prefix+'confidence');
 assert(['INDEPENDENT_TRANSFER_PASS','INDEPENDENT_TRANSFER_REWORK','AWAITING_INDEPENDENT_REVIEW','DISPUTED'].includes(s.review_status),prefix+'review status');
 assert(s.native_status==='NATIVE-UNTESTED',prefix+'native evidence must be separately qualified');
 assert(typeof e.reviewer_url==='string'&&e.reviewer_url.includes('/pull/'+(s.stage==='POST_REPAIR'?p.material_pr:p.portrait_pr)+'#'),prefix+'review URL');
 if(s.stage==='POST_REPAIR')assert(Number.isInteger(p.material_pr)&&p.material_pr>0&&sha.test(p.parent_portrait_head)&&p.parent_portrait_head!==p.portrait_head,prefix+'child/parent identity');
 assert(e.overview_url.includes('/'+p.portrait_head+'/'+p.map_folder+'overview.png'),prefix+'overview not exact head');
 assert(e.crop_name&&e.crop_url?.includes('/'+p.portrait_head+'/'+p.map_folder+e.crop_name),prefix+'crop not exact head');
 assert(hash.test(e.crop_sha256),prefix+'missing receipt crop SHA');
 region(l.feature_bbox_xyxy,'feature bbox');region(l.evidence_window_xyxy,'window');
 assert(l.precision==='EVIDENCE_WINDOW_ONLY'||l.precision==='EXACT_FEATURE'||l.precision==='UNVERIFIED',prefix+'precision');
 if(l.precision==='EVIDENCE_WINDOW_ONLY')assert(l.feature_bbox_xyxy===null&&l.evidence_window_xyxy!==null,prefix+'window not falsely tight');
 if(e.crop_rect_xywh!==null){const [x,y,w,h]=e.crop_rect_xywh;assert(w>0&&h>0&&x>=0&&y>=0&&x+w<=1024&&y+h<=2048,prefix+'crop geometry');assert(JSON.stringify(l.evidence_window_xyxy)===JSON.stringify([x,y,x+w,y+h]),prefix+'crop bbox mismatch')}
 for(const k of ['must_preserve_relations','safe_to_change','do_not_fill'])assert(Array.isArray(s.constraints[k]),prefix+k);
 assert(['DO-PRESERVE','DO-REPAIR','DO-NOT-FILL','DO-NOT-ASSERT'].includes(s.recommendation.astra_treatment),prefix+'Astra');
 assert(s.lineage.after_state_id===null,prefix+'forward link must not rewrite baseline');
 if(s.stage!=='POST_REPAIR')assert(s.lineage.previous_state_id===null&&s.lineage.before_state_id===null,prefix+'baseline ancestry');
 else assert(s.lineage.previous_state_id&&s.lineage.before_state_id,prefix+'post repair ancestry missing');
 counts[s.classification]=(counts[s.classification]||0)+1;
 byPR[p.portrait_pr]=(byPR[p.portrait_pr]||0)+1;
 known.set(s.state_id,s);
}
for(const s of known.values())if(s.stage==='POST_REPAIR'){
 assert(known.has(s.lineage.previous_state_id),s.state_id+' missing previous state');
 assert(known.has(s.lineage.before_state_id),s.state_id+' missing baseline');
 const old=known.get(s.lineage.previous_state_id),base=known.get(s.lineage.before_state_id);
 assert(old.feature_id===s.feature_id&&base.feature_id===s.feature_id,s.state_id+' lineage feature drift');
 assert(base.stage==='BASELINE',s.state_id+' wrong baseline');
}
assert(Object.keys(byPR).length===manifest.portraits.length,'manifest portrait count mismatch');
for(const x of manifest.portraits){assert(byPR[x.pr]===x.records,'manifest count '+x.pr);const r=[...known.values()].find(s=>s.provenance.portrait_pr===x.pr&&s.stage!=='POST_REPAIR');assert(r.provenance.portrait_head===x.head&&r.provenance.donor_head===x.donor_head,'manifest head '+x.pr)}
assert(rows.length===manifest.state_count,'manifest state count');
console.log('FEATURE-ATLAS v1 PASS: '+rows.length+' immutable states, '+known.size+' unique IDs, '+Object.keys(byPR).length+' portraits; '+JSON.stringify(counts));
