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
const technicalKeys=new Set();
for(const t of technical.records){
 ok(t.technical_verdict==='SOURCE_STATIC_PASS'&&t.native_status==='NATIVE-UNTESTED','bad independent technical classification');
 ok(sha40.test(t.head)&&Number.isInteger(t.pr)&&t.pr>0&&t.url.startsWith('https://github.com/techrote/sandmapsreference/pull/'+t.pr+'#issuecomment-'),'bad technical source identity');
 const key=t.pr+'@'+t.head;ok(!technicalKeys.has(key),'duplicate technical PR/HEAD receipt');technicalKeys.add(key);
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
// Check current-only advisory export against the immutable state log and latest child-head register.
// This is metadata/SHA-binding validation, not independent review or native gameplay.
{
 const register=read('repair-head-register.v1.json');
 const latest=read('astra-current.v1.json');
 ok(latest.schema_version===1&&latest.not_authorized_for_execution===true&&latest.current_child_count===7,'current-only nonexecuting authority');
 const contract=latest.spatial_safety_contract;
 ok(contract&&contract.version===1&&contract.authorized_geometry_edits===false&&contract.evidence_windows_are_edit_masks===false&&contract.primary_treatment_labels_are_exhaustive_protection===false&&contract.protected_voids_are_counted_as_distinct_regions===false,'current advisory spatial authority overclaim');
 const protectedRecordCount=latest.records.filter(x=>Array.isArray(x.do_not_fill)&&x.do_not_fill.length>0).length;
 const verifiedTightCount=latest.records.filter(x=>x.feature_bbox_xyxy!==null).length;
 ok(contract.records_with_nonempty_do_not_fill===protectedRecordCount&&contract.records_with_tight_verified_feature_bbox===verifiedTightCount,'current spatial-safety aggregate count drift');
 ok(latest.records.every(x=>Array.isArray(x.do_not_fill)&&Array.isArray(x.must_preserve)&&Array.isArray(x.safe_to_change)),'current feature missing protected-relations arrays');
 const childByPr=new Map(register.children.map(c=>[c.repair_pr,c]));
 ok(childByPr.size===7,'duplicate child register');
 const expected=rows.filter(s=>s.stage==='POST_REPAIR'&&childByPr.get(s.provenance.material_pr)?.exact_current_head===s.provenance.portrait_head);
 ok(latest.feature_state_count===expected.length&&latest.records.length===expected.length,'current-only record count');
 const seenCurrent=new Set();
 for(const item of latest.records){
  const s=states.get(item.state_id), c=childByPr.get(item.child_pr);
  ok(s&&s.stage==='POST_REPAIR'&&c&&item.child_head===c.exact_current_head,'historical HEAD leaked into current advice');
  ok(s.provenance.material_pr===item.child_pr&&s.provenance.portrait_head===item.child_head&&s.feature_id===item.feature_id,'current feature provenance drift');
  ok(item.classification===s.classification&&item.treatment===s.recommendation.astra_treatment,'current treatment drift');
  ok(item.review_url===s.evidence.reviewer_url&&item.crop_url===s.evidence.crop_url,'current review/crop SHA binding drift');
  ok(JSON.stringify(item.crop_rect_xywh)===JSON.stringify(s.evidence.crop_rect_xywh)&&JSON.stringify(item.feature_bbox_xyxy)===JSON.stringify(s.location.feature_bbox_xyxy),'current coordinate drift');
  ok(JSON.stringify(item.must_preserve)===JSON.stringify(s.constraints.must_preserve_relations)&&JSON.stringify(item.safe_to_change)===JSON.stringify(s.constraints.safe_to_change)&&JSON.stringify(item.do_not_fill)===JSON.stringify(s.constraints.do_not_fill),'current protected-zone drift');
  ok(item.technical_current_head===c.technical_current_head&&item.technical_review_url===(c.technical_review_url||null),'current technical gate drift');
  // PENDING may describe an unsupported FUNCTIONAL claim; it must not falsely say that
  // independent exact-HEAD Technical tests are outstanding after a Technical PASS.
  if(item.technical_current_head==='SOURCE_STATIC_PASS')
   ok(!/\b(?:independent\s+)?Technical[^.]{0,140}\b(?:pending|unreviewed|awaiting)\b/i.test(item.observed||''),'current observation has stale Technical-pending narrative: '+item.state_id);
  ok(item.native==='NATIVE-UNTESTED','unjustified native status');
  ok(!seenCurrent.has(item.state_id),'duplicate current state');seenCurrent.add(item.state_id);
 }
 ok(expected.every(s=>seenCurrent.has(s.state_id)),'missing current-only feature record');
 console.log('FEATURE-ATLAS CURRENT-HEAD ADVISORY PASS: '+latest.records.length+' exact-child review states');
}
console.log('FEATURE-ATLAS SIDECARS PASS: '+add.entries.length+' locality addenda, '+queue.records.length+' historical candidate IDs ('+promotedCount+' now Art-reviewed exact-HEAD canonical states), '+parents.size+' repair lanes; immutable baseline '+lock.locked_first_lines+' unchanged');
