#!/usr/bin/env node
// Advisory metadata integrity only: no native/crop byte-parity or independent review claims.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const d=dirname(fileURLToPath(import.meta.url));
const read=(p)=>JSON.parse(readFileSync(resolve(d,p),'utf8'));
const raw=readFileSync(resolve(d,'states.v1.jsonl'),'utf8');
const rows=raw.trimEnd().split(/\r?\n/).map(s=>JSON.parse(s));
const lock=read('baseline.lock.v1.json');
const prefix=raw.trimEnd().split(/\r?\n/).slice(0,lock.locked_first_lines).join('\n')+'\n';
const blob=createHash('sha1').update('blob '+Buffer.byteLength(prefix)+'\0').update(prefix).digest('hex');
if(blob!==lock.git_blob_sha1||rows.length<lock.locked_first_lines)throw Error('Immutable baseline prefix mismatch');
const states=new Map(rows.map(r=>[r.state_id,r]));
const add=read('evidence-addenda.v1.json');
const queue=read('repair-candidates.v1.json');
const sha40=/^[a-f0-9]{40}$/, sha64=/^[a-f0-9]{64}$/;
function ok(x,m){if(!x)throw Error(m)}
function bbox(x){ok(Array.isArray(x)&&x.length===4&&x.every(Number.isInteger),'bad rect');
 const [a,b,w,h]=x;ok(a>=0&&b>=0&&w>0&&h>0&&a+w<=1024&&b+h<=2048,'crop out of bounds')}
function anchor(s,crop){
 const p=s.provenance,base='https://raw.githubusercontent.com/techrote/sandmapsreference/'+p.portrait_head+'/'+p.map_folder;
 ok(crop.url===base+crop.file,'crop URL not pinned to state HEAD');
 ok(sha64.test(crop.sha256),'bad crop SHA-256');bbox(crop.xywh);
}
ok(add.schema_version===1&&queue.schema_version===1,'wrong version');
const seenAdd=new Set();
for(const a of add.entries){
 ok(!seenAdd.has(a.addendum_id),'duplicate locality addendum');seenAdd.add(a.addendum_id);
 const s=states.get(a.state_id);
 ok(s&&s.stage!=='POST_REPAIR','addendum missing baseline/control state');
 ok(a.portrait_pr===s.provenance.portrait_pr&&a.portrait_head===s.provenance.portrait_head,'addendum identity mismatch');
 ok(a.independent_review_url===s.evidence.reviewer_url,'review not same original head');
 ok(a.locality_review_url.startsWith('https://github.com/techrote/sandmapsreference/issues/200#issuecomment-'),'locality auditor missing');
 ok(['MULTI_WINDOW_RELATIONSHIP','WAYPOINT_CLAIM_CAVEAT'].includes(a.kind),'bad locality kind');
 ok(Array.isArray(a.supplementary_crops)&&Array.isArray(a.site_points),'missing supplement');
 ok(a.scope.length>40&&a.limits.length>25,'poor caveat');
 for(const c of a.supplementary_crops)anchor(s,c);
 for(const p of a.site_points)ok(typeof p.name==='string'&&Array.isArray(p.xy)&&p.xy.length===2&&p.xy.every(Number.isInteger)&&p.xy[0]>=0&&p.xy[0]<1024&&p.xy[1]>=0&&p.xy[1]<2048,'bad waypoint');
}
const seenStates=new Set(),childHeads=new Map(), parents=new Set();
for(const q of queue.records){
 ok(q.stage==='POST_REPAIR_CANDIDATE_ONLY'&&q.review_status==='AWAITING_INDEPENDENT_ART_AND_TECHNICAL'&&q.native_status==='NATIVE-UNTESTED','candidate incorrectly marked accepted');
 ok(q.classification===null&&q.independent_art_review_url===null&&q.independent_technical_review_url===null,'candidate incorrectly self-reviewed');
 ok(!seenStates.has(q.provisional_state_id)&&!states.has(q.provisional_state_id),'duplicate state ID');
 seenStates.add(q.provisional_state_id);
 const old=states.get(q.baseline_state_id);
 ok(old&&old.stage==='BASELINE','unmatched original baseline state');
 ok(old.feature_id===q.feature_id&&old.provenance.portrait_head===q.baseline_head,'bad lineage');
 ok(old.provenance.portrait_pr===q.portrait_pr&&sha40.test(q.material_head)&&q.material_head!==q.baseline_head,'bad PR/head lineage');
 ok(q.provisional_state_id===q.feature_id+'@'+q.material_head,'bad provisional ID');
 ok(Number.isInteger(q.material_pr)&&q.material_pr>0,'bad repair PR');
 ok(q.creator_evidence_url.startsWith('https://github.com/techrote/sandmapsreference/issues/200#issuecomment-'),'missing candidate source');
 ok(q.source_kind==='CREATOR_REPAIR_EVIDENCE_NOT_INDEPENDENT_VERDICT','source type overclaim');
 const before=childHeads.get(q.material_pr);
 ok(!before||before===q.material_head,'same child PR given multiple HEADs');
 childHeads.set(q.material_pr,q.material_head);parents.add(q.portrait_pr);
}
ok(parents.size===7&&childHeads.size===7,'missing original seven repair lanes');
console.log('FEATURE-ATLAS SIDECARS PASS: '+add.entries.length+' locality addenda, '+queue.records.length+' UNREVIEWED candidate state IDs, '+parents.size+' repair lanes; immutable baseline '+lock.locked_first_lines+' unchanged');
