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
 ok(['MULTI_WINDOW_RELATIONSHIP','WAYPOINT_CLAIM_CAVEAT','OVERLAPPING_EVIDENCE_EDIT_BOUNDARY'].includes(a.kind),'bad locality kind');
 if(a.kind==='OVERLAPPING_EVIDENCE_EDIT_BOUNDARY'){
   const p=states.get(a.protected_state_id);
   ok(p&&p.stage!=='POST_REPAIR'&&p.provenance.portrait_pr===s.provenance.portrait_pr&&p.provenance.portrait_head===s.provenance.portrait_head,'protected feature missing or wrong HEAD');
   const u=s.location.evidence_window_xyxy,v=p.location.evidence_window_xyxy;
   const overlap=[Math.max(u[0],v[0]),Math.max(u[1],v[1]),Math.min(u[2],v[2]),Math.min(u[3],v[3])];
   ok(JSON.stringify(overlap)===JSON.stringify(a.overlap_evidence_xyxy)&&overlap[2]>overlap[0]&&overlap[3]>overlap[1],'evidence window overlap mismatch');
   ok(typeof a.safe_edit_interpretation==='string'&&a.safe_edit_interpretation.length>40,'missing safe edit boundary');
 }
 ok(Array.isArray(a.supplementary_crops)&&Array.isArray(a.site_points),'missing supplement');
 ok(a.scope.length>40&&a.limits.length>25,'poor caveat');
 for(const c of a.supplementary_crops)anchor(s,c);
 for(const p of a.site_points)ok(typeof p.name==='string'&&Array.isArray(p.xy)&&p.xy.length===2&&p.xy.every(Number.isInteger)&&p.xy[0]>=0&&p.xy[0]<1024&&p.xy[1]>=0&&p.xy[1]<2048,'bad waypoint');
}
const technical=read('technical-after.v1.json');
ok(technical.schema_version===1&&technical.records.length>=0,'technical receipt version');
const technicalPRs=new Set();
for(const t of technical.records){
 ok(t.technical_verdict==='SOURCE_STATIC_PASS'&&t.native_status==='NATIVE-UNTESTED','bad independent technical classification');
 ok(sha40.test(t.head)&&Number.isInteger(t.pr)&&t.pr>0&&t.url.startsWith('https://github.com/techrote/sandmapsreference/pull/'+t.pr+'#issuecomment-'),'bad technical source identity');
 ok(!technicalPRs.has(t.pr),'duplicate technical PR receipt');technicalPRs.add(t.pr);
 ok(Array.isArray(t.reviewed_feature_states)&&t.reviewed_feature_states.length>0,'missing linked feature observations');
 for(const id of t.reviewed_feature_states){const s=states.get(id);ok(s&&s.stage==='POST_REPAIR'&&s.provenance.material_pr===t.pr&&s.provenance.portrait_head===t.head,'wrong technical source SHA/feature link');}
}
const seenStates=new Set(),childHeads=new Map(), parents=new Set();
for(const q of queue.records){
 ok(q.stage==='POST_REPAIR_CANDIDATE_ONLY'&&q.review_status==='AWAITING_INDEPENDENT_ART_AND_TECHNICAL'&&q.native_status==='NATIVE-UNTESTED','candidate incorrectly marked accepted');
 ok(q.classification===null&&q.independent_art_review_url===null&&q.independent_technical_review_url===null,'candidate incorrectly self-reviewed');
 ok(!seenStates.has(q.provisional_state_id),'duplicate historical candidate ID');
 const promoted=states.get(q.provisional_state_id);
 if(promoted)ok(promoted.stage==='POST_REPAIR'&&promoted.provenance.material_pr===q.material_pr&&promoted.provenance.portrait_head===q.material_head&&promoted.lineage.before_state_id===q.baseline_state_id,'candidate vs reviewed state lineage drift');
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
const promotedCount=queue.records.filter(q=>states.has(q.provisional_state_id)).length;
console.log('FEATURE-ATLAS SIDECARS PASS: '+add.entries.length+' locality addenda, '+queue.records.length+' historical candidate IDs ('+promotedCount+' now Art-reviewed exact-HEAD canonical states), '+parents.size+' repair lanes; immutable baseline '+lock.locked_first_lines+' unchanged');
