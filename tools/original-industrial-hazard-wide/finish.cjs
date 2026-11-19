'use strict';
// Wholly authored physical-cell finishing pass. No image input or retouched
// artwork. Exact conservative Midge routes are preserved before adding solids.
module.exports=function finish(g,index,spec,api) {
  const {W,H,MAT,legalCentres}=api, N=W*H, origin=spec.spawn[1]*W+spec.spawn[0];
  const lc=legalCentres(g,31,27).clear, parent=new Int32Array(N), q=new Int32Array(N);
  parent.fill(-2);let head=0,tail=0;
  if(!lc[origin])throw Error('31x27 spawn obstructed before finish');
  q[tail++]=origin;parent[origin]=-1;
  while(head<tail){
    const p=q[head++],x=p%W,y=(p/W)|0;
    for(const n of [x? p-1:-1,x+1<W?p+1:-1,y?p-W:-1,y+1<H?p+W:-1]){
      if(n<0||parent[n]!==-2||!lc[n])continue;
      parent[n]=p;q[tail++]=n;
    }
  }
  const protect=new Uint8Array(N);
  for(const [name,[x,y]] of spec.sites){
    let p=y*W+x;
    if(parent[p]===-2)throw Error('Pre-finish destination lost '+name);
    let steps=0;
    while(p>=0){
      const cx=p%W,cy=(p/W)|0;
      for(let yy=Math.max(0,cy-15);yy<=Math.min(H-1,cy+15);yy++)
        protect.fill(1,yy*W+Math.max(0,cx-18),yy*W+Math.min(W,cx+19));
      p=parent[p];if(++steps>N)throw Error('route cycle');
    }
  }
  const I=MAT.iron, B=MAT.basalt, O=MAT.obsidian;
  const S=62, U=63, C=68, K=131, F=104, A=79, G=77, P=76, T=70, X=128;
  let placed=0,clipped=0,inlaid=0;
  function ink(x,y,m,same){
    x=Math.round(x);y=Math.round(y);
    if(x<0||x>=W||y<0||y>=H)return;
    const p=y*W+x,old=g[p];
    if(same){if(same.includes(old)){g[p]=m;inlaid++;}}
    else if(!old){if(!protect[p]){g[p]=m;placed++;}else clipped++;}
  }
  function rect(x,y,w,h,m,same){
    x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
    for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)
      for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++)ink(xx,yy,m,same);
  }
  function stroke(x,y,u,v,t,m,same){
    const steps=Math.ceil(Math.hypot(u-x,v-y)*1.4);
    for(let i=0;i<=steps;i++){
      const a=i/Math.max(1,steps),xx=x+(u-x)*a,yy=y+(v-y)*a;
      rect(xx-t/2,yy-t/2,t,t,m,same);
    }
  }
  function coil(cx,cy,rx,ry,t,m,begin=-3.14,end=3.14){
    const n=Math.ceil((end-begin)*Math.max(rx,ry)/1.8);
    for(let j=0;j<=n;j++){const a=begin+(end-begin)*j/n;
      rect(cx+Math.cos(a)*rx-t/2,cy+Math.sin(a)*ry-t/2,t,t,m);}
  }
  // The eroded basalt has irregular tied laminations. Solid-to-solid inlays
  // preserve identical footprint and are safe under any flight clearance.
  for(let x=22;x<W-23;x+=17){
    const y=925+Math.round(12*Math.sin(x/67)+5*Math.sin(x/23));
    rect(x,y,9+(x%6),2,x%5===0?F:O,[B]);
    if(x%11<3)rect(x-4,y+27,21,3,O,[B]);
  }
  for(const [from,to] of [[85,341],[424,785],[834,1270],[1322,1712],[1740,2010]]){
    for(let x=from;x<to;x+=29){
      const yy=940+Math.round(4*Math.sin(x/41));
      rect(x,yy,11+(x%4)*3,3,F,[B,O]);
    }
  }
  // Nonperiodic safety markings identify *actual bearing steel* rather than
  // painting barriers across flyable rooms.
  for(const [x,y,w] of [[83,337,217],[433,504,330],[843,782,425],[1342,748,343],[1721,708,289]]){
    for(let k=0;k<Math.floor(w/47);k++){
      rect(x+k*47,y,10+(k%3)*3,3,k%4===0?P:U,[I,MAT.wall,S]);
    }
  }
  for(const [x,y] of [[115,540],[218,542],[493,582],[638,663],[749,597],
                       [943,613],[1138,620],[1375,608],[1612,605],[1855,704]]) {
    rect(x,y,22,5,U,[I,MAT.wall,S]);rect(x+8,y-1,3,6,A,[I,MAT.wall]);
  }
  if(index===0){
    // Pyrewater signature: nonconcentric containment gyres, genuine reactor
    // collars, coolant locks and asymmetrical fume-redirection sparwork.
    coil(1054,435,167,112,8,S);
    coil(1054,435,134,87,5,U,-2.83,2.84);
    coil(1054,435,100,66,4,C,-2.6,2.55);
    stroke(919,526,954,612,8,S);
    stroke(1185,524,1147,608,8,S);
    rect(1026,411,64,49,K,[I,MAT.wall,S,U,O]); // shielding on true solid where present
    rect(1046,438,14,12,MAT.glow);
    stroke(455,581,735,558,7,C);
    stroke(735,558,775,599,7,C);
    for(const [x,y] of [[925,359],[963,339],[1156,344],[1194,365]]){
      rect(x,y,13,18,K);rect(x+4,y+5,5,5,G,[K]);
    }
    for(const [x,y] of [[469,632],[604,661],[719,610],[1400,681],[1514,691]]){
      rect(x,y,23,5,K,[I,O,MAT.wall]);
      rect(x+5,y+2,4,2,A,[K]);
    }
    stroke(1787,386,1817,322,9,S);
    stroke(1817,322,1871,282,8,S);
    stroke(1891,378,1967,276,9,S);
    rect(1815,289,55,6,A,[S,I]);
    for(let k=0;k<7;k++)rect(1375+k*42,592,16,5,T,[I,MAT.wall]);
  } else {
    // Ashlight has diagonal counterflow scoops, and unequal separate
    // reactor collars; no reuse of the Pyrewater symmetric central gyre.
    coil(1142,469,132,81,8,S,-2.55,0.65);
    coil(1142,469,99,55,5,C,-2.5,0.50);
    stroke(1108,539,1154,617,8,S);
    stroke(1205,526,1223,610,7,S);
    coil(1430,452,73,92,7,K,-2.75,2.52);
    coil(1622,434,81,112,7,S,-2.7,2.18);
    coil(1622,434,52,70,4,C,-2.7,2.05);
    stroke(1421,551,1416,583,7,S);
    stroke(1635,540,1628,572,7,S);
    rect(1850,538,92,44,X,[I,O,MAT.wall,S]);
    rect(1879,542,43,9,A,[X,I]);
    for(let k=0;k<8;k++){
      const x=472+37*k;
      rect(x,356+(k%3)*4,16,4,G,[I,MAT.wall]);
      rect(x+7,496,6,12,T,[I,MAT.wall]);
    }
    stroke(749,341,855,276,8,S);
    stroke(855,276,935,352,8,S);
  }
  return {placed,clipped,inlaid,protected_centres:tail,sites:spec.sites.length};
};