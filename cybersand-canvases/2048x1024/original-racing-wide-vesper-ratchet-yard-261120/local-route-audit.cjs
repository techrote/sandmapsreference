'use strict';
// Bounded 31x27 centreline proof for declared functional legs. Never snaps targets.
const fs=require('node:fs'), crypto=require('node:crypto');
const {freeMask,SITES,W,H,N}=require('./geometry.cjs');
const setup=JSON.parse(fs.readFileSync(__dirname+'/setup-vesper-ratchet-yard.json'));
const g=new Uint8Array(N);for(let [x,y,w,h,m] of setup.edits)for(let Y=y;Y<y+h;Y++)g.fill(m,Y*W+x,Y*W+x+w);
const ok=freeMask(g,31,27),pad=400;
const legs=[[0,1],[1,2],[2,3],[3,4],[4,5],[4,6],[5,7],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],
[1,18],[3,19],[5,20],[9,21],[12,22],[0,23],[3,24],[6,25],[8,26],[11,27]];
function leg(a,b){const A=SITES[a],B=SITES[b];const minX=Math.max(0,Math.min(A[1],B[1])-pad),maxX=Math.min(W-1,Math.max(A[1],B[1])+pad),minY=Math.max(0,Math.min(A[2],B[2])-pad),maxY=Math.min(H-1,Math.max(A[2],B[2])+pad);
const start=A[2]*W+A[1],end=B[2]*W+B[1];if(!ok[start]||!ok[end])throw Error('Blocked exact literal site: '+A[0]+' → '+B[0]);const q=new Int32Array(N),v=new Uint8Array(N);let h=0,t=1;q[0]=start;v[start]=1;while(h<t){let p=q[h++];if(p===end)return {a:A[0],b:B[0],ok:true,visited:t,bounds:[minX,minY,maxX,maxY]};const x=p%W,y=(p-x)/W;for(let [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){if(nx<minX||nx>maxX||ny<minY||ny>maxY)continue;const z=ny*W+nx;if(ok[z]&&!v[z]){v[z]=1;q[t++]=z;}}}return {a:A[0],b:B[0],ok:false,visited:t,bounds:[minX,minY,maxX,maxY]};}
const results=legs.map(([a,b])=>leg(a,b));const failed=results.filter(x=>!x.ok);const receipt={sha256:crypto.createHash('sha256').update(g).digest('hex'),envelope:[31,27],bbox_padding:pad,valid:failed.length===0,legs:results};fs.writeFileSync(__dirname+'/local-route-qualification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({ok:receipt.valid,passed:results.length-failed.length,total:results.length,failures:failed},null,2));if(failed.length)process.exitCode=1;
