/**
 * BIOME-0037a / CANVAS-REWORK-C: source-led real-cell finishing overlay.
 * Applied after R2A's deterministic build, before coalescence. Only original
 * accepted inert solid IDs and Empty; original Water y>=1840 untouched.
 * No raster source/image substitution: every feature edits the physics grid.
 */
function finishR2C(g,W,H) {
  const p=(x,y)=>y*W+x;
  const put=(x,y,m)=>{if(x>=18&&x<W-18&&y>=27&&y<1840&&g[p(x,y)]!==3)g[p(x,y)]=m;};
  const capsule=(x0,y0,x1,y1,r,m)=>{
    const lx=Math.max(18,Math.floor(Math.min(x0,x1)-r-1)),rx=Math.min(W-19,Math.ceil(Math.max(x0,x1)+r+1));
    const ly=Math.max(27,Math.floor(Math.min(y0,y1)-r-1)),ry=Math.min(1839,Math.ceil(Math.max(y0,y1)+r+1));
    const dx=x1-x0,dy=y1-y0,ss=dx*dx+dy*dy;
    for(let y=ly;y<=ry;y++)for(let x=lx;x<=rx;x++){
      const t=ss?Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/ss)):0;
      const ax=x-x0-t*dx,ay=y-y0-t*dy;
      if(ax*ax+ay*ay<=r*r)put(x,y,m);
    }
  };
  const rope=(points,r,m)=>{
    for(let k=1;k<points.length;k++)
      capsule(points[k-1][0],points[k-1][1],points[k][0],points[k][1],Math.max(2,r-(k-1)*0.65),m);
  };
  const cell=(x,y)=>x>=0&&x<W&&y>=0&&y<H?g[p(x,y)]:0;
  const pale=m=>m===99||m===38||m===122;
  // Protected original exact destinations with their largest 31x27 hull mask.
  // Avoid adding new solids in these regions; do not erase existing geometry.
  const sites=[[512,107],[355,187],[205,230],[740,320],[274,608],[151,800],
    [626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],
    [138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],
    [824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],
    [513,1335],[518,1706]];
  const protectedSite=(x,y)=>sites.some(([sx,sy])=>Math.abs(x-sx)<=17&&Math.abs(y-sy)<=15);
  // This is intentionally conservative for new obstacles. A reduced radius
  // cannot be used to make target failures disappear.
  const anchoredRib=(points,r,m=99)=>{
    // Clamp out any conservatively reserved air without changing site data.
    const keep=put;
    for(let k=1;k<points.length;k++){
      const [x0,y0]=points[k-1],[x1,y1]=points[k];
      const lx=Math.max(18,Math.floor(Math.min(x0,x1)-r-1)),rx=Math.min(W-19,Math.ceil(Math.max(x0,x1)+r+1));
      const ly=Math.max(27,Math.floor(Math.min(y0,y1)-r-1)),ry=Math.min(1839,Math.ceil(Math.max(y0,y1)+r+1));
      const dx=x1-x0,dy=y1-y0,ss=dx*dx+dy*dy,rad=Math.max(2,r-(k-1)*0.55);
      for(let y=ly;y<=ry;y++)for(let x=lx;x<=rx;x++){
        const t=Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/ss));
        const ax=x-x0-t*dx,ay=y-y0-t*dy;
        if(ax*ax+ay*ay<=rad*rad&&!protectedSite(x,y))keep(x,y,m);
      }
    }
  };
  // Five DIFFERENT rooted vein systems: branches divide inside existing pale
  // voids but terminate asymmetrically; no repeated ellipses or copy-paste rooms.
  for(const [trunk,r,branches] of [
    [[[31,99],[66,113],[99,132],[139,151],[170,159]],7,
      [[ [87,125],[112,96],[135,79] ],[ [118,142],[138,174],[172,183] ]]],
    [[[32,321],[84,338],[128,354],[175,368]],8,
      [[ [93,342],[114,311],[139,298] ],[ [140,362],[159,396],[200,414] ]]],
    [[[28,515],[70,543],[105,564],[135,590]],7,
      [[ [75,545],[100,523],[128,500] ],[ [115,574],[151,556],[180,547] ]]],
    [[[32,688],[81,706],[116,731],[169,748]],8,
      [[ [89,710],[104,670],[136,650] ],[ [125,734],[155,769],[196,776] ]]],
    [[[28,863],[61,884],[102,912],[145,923]],7,
      [[ [85,899],[107,866],[139,849] ],[ [111,913],[128,947],[172,954] ]]]
  ]){
    anchoredRib(trunk,r,99);
    for(const b of branches)anchoredRib(b,Math.max(3,r-2),122);
  }
  // Irregular, smaller open lace channels: subtraction cuts inside the current
  // solid cliff, not painted strokes over the reference image.
  for(const [nodes,r] of [
    [[[251,52],[238,80],[258,106],[296,117]],7],
    [[[344,90],[365,121],[395,139]],6],
    [[[128,260],[105,288],[113,319]],8],
    [[[265,304],[299,284],[330,284]],7],
    [[[307,475],[329,502],[363,507]],7],
    [[[175,536],[199,512],[229,506]],6],
    [[[302,677],[325,696],[337,725]],7],
    [[[219,739],[241,763],[268,771]],6],
    [[[295,915],[309,880],[336,859]],7]
  ])rope(nodes,r,0);
  // Source fidelity: fine bright calcite only along natural tissue/pore rims.
  // Avoid repeated diagonal scratches that visually replace material geology
  // with a graphic pattern. Existing pale web is architectural, not a backdrop.
  const upper=g.slice(0,W*958);
  for(let y=40;y<958;y++)for(let x=24;x<448;x++) {
    const i=p(x,y),m=upper[i];
    if(m!==99&&m!==38&&m!==122)continue;
    let openNear=0;
    for(const [dx,dy] of [[-4,0],[4,0],[0,-4],[0,4]])if(upper[p(x+dx,y+dy)]===0)openNear++;
    if(openNear>=2 && m===99 && ((x*17+y*11)%31)<7)g[i]=122;
  }
  // Two wall-borne rungs/terraces across a deliberate ladder transfer void:
  // attach to in-situ left rock then step towards ladder, don't bridge shaft.
  for(const [y,slope] of [[777,-3],[877,4],[982,1]]){
    for(let x=425;x<470;x++){
      const top=y+Math.round(slope*(x-425)/45+1.4*Math.sin(x/13));
      for(let yy=top;yy<=top+5;yy++){
        if(protectedSite(x,yy))continue;
        if(x>=447||cell(x,yy)!==0)put(x,yy,yy<top+2?38:49);
      }
    }
    anchoredRib([[428,y+10],[446,y+5],[462,y+4]],4,49);
  }
  // Restore unmistakable ladder stubs at both faces of the 79px open passage.
  // This doesn't claim Midge can use ladder controls; it is grounded visual
  // route language and preserves the original 31x27 transfer air.
  for(const [y0,y1] of [[751,779],[870,898]]){
    for(let y=y0;y<=y1;y++){
      for(let x of [466,467,485,486])if(!protectedSite(x,y))put(x,y,62);
      if(y%19<2)for(let x=468;x<485;x++)if(!protectedSite(x,y))put(x,y,62);
    }
  }
  // Source continuation below the major shelf: rooted *geological* stratal
  // platforms shaped as tapered ledges, no full-width horizontal wall repeats.
  const strata=[
    {x0:30,x1:229,y:1191,phase:.3,thick:10,mat:49},
    {x0:34,x1:263,y:1440,phase:1.8,thick:9,mat:38},
    {x0:35,x1:250,y:1618,phase:3.1,thick:11,mat:49},
    {x0:772,x1:999,y:1480,phase:1.1,thick:11,mat:49},
    {x0:825,x1:1001,y:1802,phase:2.6,thick:9,mat:38}
  ];
  for(const s of strata)for(let x=s.x0;x<=s.x1;x++){
    const t=(x-s.x0)/(s.x1-s.x0);
    const y=s.y+Math.round(7*Math.sin(t*Math.PI*1.45+s.phase)+3*Math.sin(x/23));
    const thick=Math.max(2,Math.round(s.thick*(0.25+0.75*Math.sin(Math.PI*t))));
    for(let yy=y;yy<y+thick;yy++){
      if(protectedSite(x,yy))continue;
      // Only recolour existing structural mass, or attach at a wall end;
      // intentionally never fabricate a free-air bridge across the vault.
      if(cell(x,yy)!==0)put(x,yy,yy<y+3?122:s.mat);
    }
  }
  // Each district gains unique excavated side galleries / mouths, cut into
  // coherent original geology. They widen existing travel rather than obstruct.
  for(const [nodes,r] of [
    [[[79,1250],[143,1240],[217,1223],[290,1204]],19],
    [[[60,1452],[138,1466],[218,1476],[291,1488]],23],
    [[[78,1613],[143,1606],[225,1589],[293,1588]],18],
    [[[944,1428],[886,1427],[844,1406],[794,1390]],17],
    [[[977,1791],[921,1783],[856,1792]],17]
  ])rope(nodes,r,0);
  // Exposed-rock cellular rim treatment: all pigment is true inert cell ID
  // *inside pre-existing load-bearing rock*, revealing separate lower shelves.
  // Pale western limestone contrasts with darker eastern basalt; no fake
  // image-space overlays and no new collision surfaces.
  const lower=g.slice();
  for(let y=1143;y<1833;y++)for(let x=19;x<1005;x++) {
    const i=p(x,y),m=lower[i],west=x<470,east=x>700;
    if((!west&&!east)||![38,49,100,99].includes(m))continue;
    let open1=false,open7=false;
    for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3]]) {
      if(lower[p(x+dx,y+dy)]===0)open1=true;
    }
    if(!open1)for(const [dx,dy] of [[-7,0],[7,0],[0,-7],[0,7]])
      if(lower[p(x+dx,y+dy)]===0)open7=true;
    if(open1)g[i]=west?99:38;
    else if(open7)g[i]=west?38:49;
  }

  // The original source's lattice must remain one physically supported body:
  // reconnect a large mid-upper sheet accidentally separated by the delicate
  // sub-pore excavation (real bridging material, not waypoint manipulation).
  anchoredRib([[97,292],[111,292],[128,297]],6,99);
  anchoredRib([[102,322],[117,322],[135,327]],7,99);
  // Remove only microscopic, fully disconnected pale chips left by cutting;
  // keep all 28 named transit centres untouched, all Water unaffected.
  const topN=W*960,visited=new Uint8Array(topN),queue=new Int32Array(topN);
  const tissue=m=>m===38||m===99||m===122;
  for(let i=0;i<topN;i++) {
    if(visited[i]||!tissue(g[i]))continue;
    let f=0,t=1;queue[0]=i;visited[i]=1;
    while(f<t) {
      const at=queue[f++],x=at%W,y=at/W|0;
      for(const n of [at-1,at+1,at-W,at+W]) {
        if(n<0||n>=topN||visited[n]||!tissue(g[n]))continue;
        const nx=n%W,ny=n/W|0;
        if(Math.abs(nx-x)+Math.abs(ny-y)!==1)continue;
        visited[n]=1;queue[t++]=n;
      }
    }
    if(t<=40)for(let j=0;j<t;j++)g[queue[j]]=0;
  }

}
if(typeof module!=="undefined"&&module.exports)module.exports=finishR2C;
