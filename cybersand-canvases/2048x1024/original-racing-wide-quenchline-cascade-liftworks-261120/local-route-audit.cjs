'use strict';
// Independent local-corridor tests on the committed Setup grid; route segments are not inferred from global reachability.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {freeMask,W,H,N,SITES}=require('./geometry.cjs');
const setup=JSON.parse(fs.readFileSync(__dirname+'/setup-quenchline-cascade-liftworks.json'));
const grid=new Uint8Array(N);for(const [x,y,w,h,m] of setup.edits)for(let iy=y;iy<y+h;iy++)grid.fill(m,iy*W+x,iy*W+x+w);
const ok=freeMask(grid,31,27),q=new Int32Array(N),visited=new Uint32Array(N);let version=0;
const course=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
const extras=[[17,0],[18,4],[19,7],[20,14],[21,12],[22,11],[23,10],[24,5],[25,13]];
function between(a,b,pad){let [name,x,y]=SITES[a],[,tx,ty]=SITES[b];let minX=Math.max(16,Math.min(x,tx)-pad),maxX=Math.min(W-17,Math.max(x,tx)+pad),minY=Math.max(14,Math.min(y,ty)-pad),maxY=Math.min(H-15,Math.max(y,ty)+pad),start=y*W+x,end=ty*W+tx,head=0,tail=1,found=false;assert(ok[start]&&ok[end],'endpoint body clearance');version++;visited[start]=version;q[0]=start;
while(head<tail){let p=q[head++];if(p===end){found=true;break;}let cx=p%W,cy=(p-cx)/W;for(let n of [cx>minX?p-1:-1,cx<maxX?p+1:-1,cy>minY?p-W:-1,cy<maxY?p+W:-1])if(n>=0&&ok[n]&&visited[n]!==version){visited[n]=version;q[tail++]=n;}}
return {from:name,to:SITES[b][0],search_band:pad,connected:found,reachable_centres:tail};}
let tests=[];for(let i=0;i<course.length-1;i++)tests.push(between(course[i],course[i+1],175));for(let [a,b]of extras)tests.push(between(a,b,225));let failures=tests.filter(x=>!x.connected);console.log(JSON.stringify({status:failures.length?'LOCAL-CORRIDOR-FAIL':'LOCAL-CORRIDOR-PASS',course_segments:course.length-1,interior_segments:extras.length,failures,tests},null,2));if(failures.length)process.exitCode=1;
