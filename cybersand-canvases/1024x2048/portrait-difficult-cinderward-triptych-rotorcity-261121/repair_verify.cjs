'use strict';
/* R5 source-static entered-workfront proof; runnable: node repair_verify.cjs
   This is NOT an independent reviewer verdict or a native simulator test. */
const {world,encode,audit,build}=require('./build.cjs');
const expected={
 grid:'a1bc1fcf7216b5ca60d4b551a5524c8779ca1cfacc1de821489bfe046255e073',
 setup:'2af2c569df0ece15b594b74ad48b0ed6abe7692230364495afeeabb8a8699c7c'
};
const groups={
 ore:[[393,218],[366,218],[341,218],[290,215]],
 guild:[[753,795],[753,819],[752,846],[751,872]],
 freight:[[865,1590],[865,1630],[865,1670],[865,1715]]
};
function check(c,msg){if(!c)throw Error('R5 proof: '+msg);}
function verifyRepair(){
 const made=build(),w=world(),{g,W,H}=w,S=W+1;
 check(W===1024&&H===2048&&g.length===2097152,'dimensions');
 check(made.receipt.source_grid_sha256===expected.grid,'source grid hash');
 check(made.receipt.setup_sha256===expected.setup,'Setup hash');
 check(made.receipt.rectangles===1320,'rectangle count');
 // Literal 31x27 whole-hull clearance: exact 2D summed occupancy.
 const integral=new Int32Array((W+1)*(H+1));
 for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){
   row+=g[(y-1)*W+x-1]?1:0;
   integral[y*S+x]=integral[(y-1)*S+x]+row;
 }}
 const free=new Uint8Array(g.length);
 for(let y=13;y<H-13;y++)for(let x=15;x<W-15;x++){
  const l=x-15,t=y-13,r=x+16,b=y+14;
  if(integral[b*S+r]-integral[t*S+r]-integral[b*S+l]+integral[t*S+l]===0)free[y*W+x]=1;
 }
 // Exact-centre four-neighbour BFS, never nearest-site substitution.
 function leg(from,to){
  const st=from[1]*W+from[0],goal=to[1]*W+to[0];
  check(!!free[st]&&!!free[goal],'blocked literal waypoint');
  const seen=new Uint8Array(g.length),q=new Int32Array(g.length);
  let front=0,tail=0,dist=0;q[tail++]=st;seen[st]=1;
  while(front<tail){
   let count=tail-front;
   while(count--){let i=q[front++];if(i===goal)return dist;let x=i%W;
    for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])
     if(j>=0&&free[j]&&!seen[j]){seen[j]=1;q[tail++]=j;}
   }
   dist++;
  }return -1;
 }
 const proof={};
 for(const [name,sites]of Object.entries(groups)){
  const legs=[];for(let i=1;i<sites.length;i++){const distance=leg(sites[i-1],sites[i]);check(distance>=0,name+' disconnected');legs.push(distance);}
  proof[name]={waypoints:sites,legs,steps:legs.reduce((a,b)=>a+b,0)};
 }
 w.sites.push(...Object.entries(groups).flatMap(([name,p])=>p.map(([x,y],i)=>({name:name+'-'+i,x,y}))));
 const auditResult=audit(w,encode(w.g,w.W,w.H));
 check(auditResult.detached===0&&auditResult.airfaces===0&&auditResult.direct===0,'ground/fluid');
 check(auditResult.flight.every(f=>f.passed===w.sites.length),'original sites or new waypoints');
 check(auditResult.blocked.passed===w.sites.length,'real obstruction reachability');
 return {status:'SOURCE-STATIC-CANDIDATE; NATIVE-UNTESTED',parent_sites:19,additional_exact_sites:12,all_hulls: auditResult.flight.map(f=>({hull:f.hull,passed:f.passed})),blocked_passed:auditResult.blocked.passed,rectangles:made.receipt.rectangles,source_grid_sha256:expected.grid,ordered_routes:proof};
}
if(typeof require!=='undefined'&&require.main===module)console.log(JSON.stringify(verifyRepair(),null,2));
module.exports={verifyRepair};
