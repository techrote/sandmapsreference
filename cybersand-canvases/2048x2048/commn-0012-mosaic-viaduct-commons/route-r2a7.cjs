"use strict";
/* R2A7 full 31x27 Midge collision-hull inserted-material obstruction qualification.
 * Every obstacle cell, not merely its centre, is treated as a solid before
 * constructing the legal-centre mask and performing cardinal BFS. */
module.exports=function fullHullRoute(g,W,H,from,to,obstacle,limits){
 const S=W+1,hx=15,hy=13,p=new Int32Array((H+1)*S),free=new Uint8Array(W*H);
 for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){
  sum+=(g[(y-1)*W+x-1]!==0||(obstacle&&x-1>=obstacle[0]&&x-1<=obstacle[2]&&y-1>=obstacle[1]&&y-1<=obstacle[3]))?1:0;
  p[y*S+x]=p[(y-1)*S+x]+sum
 }}
 for(let y=hy;y<H-hy;y++){let t=(y-hy)*S,b=(y+hy+1)*S;
  for(let x=hx;x<W-hx;x++)if(p[b+x+hx+1]-p[t+x+hx+1]-p[b+x-hx]+p[t+x-hx]===0)free[y*W+x]=1
 }
 const src=from[1]*W+from[0],dst=to[1]*W+to[0],seen=new Uint8Array(W*H),dist=new Int32Array(W*H),q=new Int32Array(W*H);
 if(!free[src]||!free[dst])return -1;let a=0,b=1;seen[src]=1;q[0]=src;
 while(a<b){let z=q[a++],x=z%W,y=z/W|0;if(z===dst)return dist[z];
  for(let v of [x?z-1:-1,x<W-1?z+1:-1,y?z-W:-1,y<H-1?z+W:-1])
   if(v>=0&&free[v]&&!seen[v]){let xx=v%W,yy=v/W|0;
    if(limits&&(xx<limits[0]||xx>limits[1]||yy<limits[2]||yy>limits[3]))continue;
    seen[v]=1;dist[v]=dist[z]+1;q[b++]=v
   }
 }return -1
};
