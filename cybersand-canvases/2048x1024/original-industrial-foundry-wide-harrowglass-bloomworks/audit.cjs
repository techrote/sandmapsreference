'use strict';
// 4-neighbour exhaustive geometry analysis; targets never shifted or nearest-centre snapped.
const INERT=new Set([57,58,62,63,65,66,68,69,72,76,77,79,80,100,104,117,131]);
const LIQUID=new Set([3,8]);
function analysis(g,W,H,sites){
if(W!==2048||H!==1024||g.length!==W*H)throw Error('wrong physical extent');
const hist={};let fluid_faces=0,solids=0;
for(let i=0;i<g.length;i++){let m=g[i];hist[m]=(hist[m]||0)+1;if(m===0)continue;
if(INERT.has(m))solids++;else if(LIQUID.has(m)){let x=i%W;if((x>0&&g[i-1]===0)||(x+1<W&&g[i+1]===0)||(i>=W&&g[i-W]===0)||(i+W<g.length&&g[i+W]===0))fluid_faces++}
else throw Error('unsupported ID '+m)}
const ground=new Uint8Array(g.length),Q=new Int32Array(g.length);let tail=0;
for(let i=0;i<g.length;i++)if(INERT.has(g[i]))ground[i]=1;
for(let x=0;x<W;x++)for(const i of [x,(H-1)*W+x])if(ground[i]===1){ground[i]=2;Q[tail++]=i}
for(let y=0;y<H;y++)for(const i of [y*W,y*W+W-1])if(ground[i]===1){ground[i]=2;Q[tail++]=i}
for(let hd=0;hd<tail;hd++){const i=Q[hd],x=i%W;for(const j of [x>0?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0&&ground[j]===1){ground[j]=2;Q[tail++]=j}}
const ground_result={total:solids,rooted:tail,detached:solids-tail};
function flight(ew,eh,block){
const I=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let line=0;for(let x=1;x<=W;x++){const X=x-1,Y=y-1,z=g[Y*W+X];const filled=z!==0||(block&&X>=block[0]&&X<block[0]+block[2]&&Y>=block[1]&&Y<block[1]+block[3]);line+=filled?1:0;I[y*(W+1)+x]=I[(y-1)*(W+1)+x]+line}}
const P=new Uint8Array(g.length),rx=ew>>1,ry=eh>>1;let centres=0;
for(let y=ry;y<=H-eh+ry;y++)for(let x=rx;x<=W-ew+rx;x++){const x0=x-rx,y0=y-ry,x1=x0+ew,y1=y0+eh;
if(I[y1*(W+1)+x1]-I[y1*(W+1)+x0]-I[y0*(W+1)+x1]+I[y0*(W+1)+x0]===0){P[y*W+x]=1;centres++}}
const seen=new Uint8Array(g.length),queue=new Int32Array(g.length),st=sites[0][2]*W+sites[0][1];let hd=0,tl=0;
if(P[st]){queue[tl++]=st;seen[st]=1;while(hd<tl){const k=queue[hd++],x=k%W;for(const j of [x?k-1:-1,x<W-1?k+1:-1,k>=W?k-W:-1,k+W<g.length?k+W:-1])if(j>=0&&P[j]&&!seen[j]){seen[j]=1;queue[tl++]=j}}}
return {envelope:[ew,eh],free_centres:centres,connected_centres:tl,sites:sites.map(([name,x,y])=>({name,x,y,free:!!P[y*W+x],reachable:!!seen[y*W+x]}))}}
const flight_result=[[19,15],[23,19],[31,27]].map(z=>flight(...z));
const block=[1230,208,68,70],alternative=flight(31,27,block);
return {histogram:hist,ground:ground_result,fluid_air_faces:fluid_faces,flight:flight_result,alternate:{block,...alternative}}}
function assertQualified(a){
if(a.ground.detached)throw Error('detached inert solids '+a.ground.detached);
if(a.fluid_air_faces)throw Error('unsealed reactive fluid faces '+a.fluid_air_faces);
for(const flight of [...a.flight,a.alternate])for(const s of flight.sites)if(!s.free||!s.reachable)throw Error('unreachable exact site '+s.name+' hull '+flight.envelope);
return true}
function replay(obj){if(obj.version!==2||obj.extent[0]!==2048||obj.extent[1]!==1024)throw Error('Setup-v2 wrong extent');
const [W,H]=obj.extent,out=new Uint8Array(W*H),seen=new Uint8Array(W*H);let work=0;
if(!Array.isArray(obj.edits)||obj.edits.length>32768)throw Error('edit cap');
for(const e of obj.edits){if(e.length!==5||!e.every(Number.isInteger))throw Error('invalid edit');const [x,y,w,h,m]=e;
if(x<0||y<0||w<=0||h<=0||x+w>W||y+h>H||(!INERT.has(m)&&!LIQUID.has(m)))throw Error('illegal physical edit '+e);
work+=w*h;if(work>32000000)throw Error('construction work budget');
for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const k=yy*W+xx;if(seen[k])throw Error('overlapping edits at '+xx+','+yy);seen[k]=1;out[k]=m}}
return {grid:out,work,rectangles:obj.edits.length}}
if(typeof module!=='undefined')module.exports={INERT,LIQUID,analysis,assertQualified,replay};
