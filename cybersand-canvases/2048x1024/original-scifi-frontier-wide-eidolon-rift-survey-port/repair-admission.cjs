"use strict";
// Original Eidolon frontier: authored access aprons and sparse anchored service ribs.
// A weighted shortest-excavation service-path recovery is deterministic and operates
// ONLY on the actual material plane. It does not relocate spawn or named objectives.
// Residual isolated decoration is discarded, never admitted as unsupported floating solid.
module.exports = function repair(g,W,H,M,sites){
 const R=(x,y,w,h,v)=>{const lx=Math.max(0,x),rx=Math.min(W,x+w);if(rx<=lx)return;for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)g.fill(v,yy*W+lx,yy*W+rx)};
 // Planned 40–120 cell person-scale airlocks, freight throats, high/low rift
 // relief shafts and two separate high-to-low flight returns.
 const ports=[[248,543,65,70],[289,559,210,66],[777,563,95,70],
 [1294,479,70,79],[1396,563,80,120],[1532,579,120,90],
 [858,608,70,49],[1170,607,80,48],
 [977,903,81,47],[1073,909,69,56],[998,924,162,44],
 [803,476,70,113]];
 for(const v of ports)R(...v,0);
 // Grounding ribs are individually placed at exterior wall returns or
 // non-objective service offsets; no sand or mobile kernel supports a structure.
 const beams=[[752,562,9,355,62],[1251,503,9,150,62],
 [1255,885,10,139,58],[1534,475,9,420,62],
 [1448,350,7,39,62],[1153,641,8,383,62],
 [1370,551,8,290,62],[1759,685,8,180,62],
 [1878,682,8,187,62],[121,473,8,380,62]];
 for(const v of beams)R(...v);
 const step=8,N=251,NY=123,xx=i=>24+8*(i%N),yy=i=>24+8*Math.floor(i/N),QSIZE=W*H;
 function flight(){
   const S=W+1,P=new Int32Array(S*(H+1));
   for(let y=0;y<H;y++){let sum=0,o=y*W,row=(y+1)*S,up=y*S;for(let x=0;x<W;x++){sum+=g[o+x]?1:0;P[row+x+1]=P[up+x+1]+sum}}
   const solid=(x,y,hx=15,hy=13)=>{
     if(x<hx||y<hy||x+hx>=W||y+hy>=H)return 99999;
     const x1=x-hx,x2=x+hx+1,y1=y-hy,y2=y+hy+1;
     return P[y2*S+x2]-P[y1*S+x2]-P[y2*S+x1]+P[y1*S+x1]};
   const good=new Uint8Array(QSIZE);
   for(let y=13;y<H-13;y++)for(let x=15;x<W-15;x++)if(!solid(x,y))good[y*W+x]=1;
   const seen=new Uint8Array(QSIZE),q=new Uint32Array(QSIZE);
   const spawn=sites[0][1],start=spawn[1]*W+spawn[0];
   if(!good[start])throw Error("Eidolon spawn blocked at exact full 31x27");
   let h=0,t=1;q[0]=start;seen[start]=1;
   while(h<t){const i=q[h++],x=i%W;
     for(const [j,valid] of [[i-1,x>0],[i+1,x<W-1],[i-W,i>=W],[i+W,i<(H-1)*W]])
       if(valid&&good[j]&&!seen[j]){seen[j]=1;q[t++]=j}}
   return {seen,solid,centres:t};
 }
 const heap=[];
 function push(d,n){let i=heap.length;heap.push([d,n]);while(i){let p=(i-1)>>1;if(heap[p][0]<=d)break;heap[i]=heap[p];i=p}heap[i]=[d,n]}
 function pop(){let r=heap[0],u=heap.pop();if(heap.length){let i=0;while(2*i+1<heap.length){let c=2*i+1;if(c+1<heap.length&&heap[c+1][0]<heap[c][0])c++;if(heap[c][0]>=u[0])break;heap[i]=heap[c];i=c}heap[i]=u}return r}
 const paths=[];
 for(const [name,p] of sites){
   const before=flight(),at=p[1]*W+p[0];if(before.seen[at]){paths.push({name,method:"existing 31x27 flight graph"});continue}
   const n=N*NY,dist=new Float64Array(n),prev=new Int32Array(n);
   dist.fill(Infinity);prev.fill(-1);heap.length=0;
   const sx=Math.max(0,Math.min(N-1,Math.round((p[0]-24)/step)));
   const sy=Math.max(0,Math.min(NY-1,Math.round((p[1]-24)/step)));
   const start=sy*N+sx;let goal=-1,explored=0;
   dist[start]=0;push(0,start);
   while(heap.length){
     const [d,k]=pop();if(d!==dist[k])continue;explored++;
     const x=xx(k),y=yy(k);if(before.seen[y*W+x]){goal=k;break}
     const i=k%N,j=Math.floor(k/N);
     for(const v of [i>0?k-1:-1,i<N-1?k+1:-1,j>0?k-N:-1,j<NY-1?k+N:-1]){
       if(v<0)continue;const cell=before.solid(xx(v),yy(v),20,18);
       const nd=d+1+cell/42;if(nd<dist[v]){dist[v]=nd;prev[v]=k;push(nd,v)}
     }
   }
   if(goal<0)throw Error("No source-grid connector for "+name);
   const nodes=[];for(let k=goal;k!==-1;k=prev[k])nodes.push([xx(k),yy(k)]);
   nodes.reverse();
   for(const [x,y] of nodes)R(x-20,y-18,41,37,0);
   R(p[0]-20,p[1]-18,41,37,0);
   if(!flight().seen[at])throw Error("Exact 31x27 connector does not reach "+name);
   paths.push({name,method:"minimal occupancy weighted service passage",nodes:nodes.length,explored});
 }
 // Unsupported decorative pieces are not simulated as if connected to the
 // planet: enumerate 4-neighbour solid components and erase non-grounded ones.
 let removed=0,isolated=0,groups=0;const seen=new Uint8Array(QSIZE),q=new Uint32Array(QSIZE);
 for(let i=0;i<QSIZE;i++)if(g[i]&&!seen[i]){
   let h=0,t=1,rooted=false;q[0]=i;seen[i]=1;groups++;
   while(h<t){const k=q[h++],x=k%W,y=Math.floor(k/W);
     if(!x||x===W-1||y===H-1)rooted=true;
     for(const v of [k-1,k+1,k-W,k+W])
       if(v>=0&&v<QSIZE&&!(Math.abs(v-k)===1&&Math.floor(v/W)!==y)&&g[v]&&!seen[v]){seen[v]=1;q[t++]=v}}
   if(!rooted){isolated++;removed+=t;for(let j=0;j<t;j++)g[q[j]]=0}
 }
 return {ports,beams,paths,solid_groups_before:groups,unsupported_components_culled:isolated,unsupported_cells_culled:removed};
};
