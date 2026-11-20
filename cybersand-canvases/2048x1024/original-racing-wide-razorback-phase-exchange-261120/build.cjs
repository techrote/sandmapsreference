'use strict';
// Razorback Phase Exchange, 2048 x 1024, entirely original inert material-cell racecourse.
// Source authority: techrote/cybersand @ de109d0131641d6adc8d25bb9ced7ca3d4991105.
// Node 22: node build.cjs; node verify-independent.cjs
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const W=2048,H=1024,SEED=0x5A71E206;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,G:120,Q:122,U:123,P:128};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const PALETTE={0:[8,11,18,255],49:[70,83,99,255],58:[119,123,128,255],62:[126,141,153,255],100:[54,56,61,255],101:[24,19,32,255],113:[152,162,168,255],117:[90,94,100,255],120:[172,203,214,220],122:[226,236,244,224],123:[152,232,94,210],128:[62,122,180,255]};
const SITES=[['West Start',139,414],['West Departure',290,413],['Bellows Approach',512,411],['Stator Divide',748,411],['Phase Transfer Upper',1016,408],['Ion Scrubber Upper',1444,406],['East Speed Brake',1760,412],['East Pivot',1912,537],['East Lower',1878,658],['Scrubber Return',1510,656],['Exchange Return',1102,660],['Bellows Return',686,658],['West Return',284,655],['West Ascent',155,535],['Finish',190,414],['Departure Control',307,169],['Bellows Service',567,886],['Exchange Test Cell',1027,896],['Scrubber Service',1507,894],['Midfield Breakout',1082,534]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), bell=(x,p,r)=>Math.exp(-(((x-p)/r)**2));
function generate(){
 const g=new Uint8Array(W*H),top=new Int16Array(W),bottom=new Int16Array(W);
 function rect(x,y,w,h,m,ink=false){let l=clamp(Math.round(x),0,W),r=clamp(Math.round(x+w),0,W),t=clamp(Math.round(y),0,H),b=clamp(Math.round(y+h),0,H);for(let j=t;j<b;j++){let a=j*W;for(let i=l;i<r;i++){let k=a+i;if(!ink||g[k])g[k]=m;}}}
 function ellipse(x,y,rx,ry,m,ink=false){for(let yy=Math.max(0,Math.floor(y-ry));yy<Math.min(H,Math.ceil(y+ry));yy++){let half=rx*Math.sqrt(Math.max(0,1-(yy-y)**2/(ry*ry)));rect(x-half,yy,2*half+1,1,m,ink);}}
 function beam(x0,y0,x1,y1,r,m,ink=false){let dx=x1-x0,dy=y1-y0,den=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/(den||1),0,1);if((x-x0-t*dx)**2+(y-y0-t*dy)**2<=r*r){let k=y*W+x;if(!ink||g[k])g[k]=m;}}}
 function polygon(points,m){let lo=Math.max(0,Math.ceil(Math.min(...points.map(p=>p[1])))),hi=Math.min(H-1,Math.floor(Math.max(...points.map(p=>p[1]))));for(let y=lo;y<=hi;y++){let xs=[];for(let i=0;i<points.length;i++){let a=points[i],b=points[(i+1)%points.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)rect(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
 // Fractured asymmetric roof, stratified geological floor. No copied reference art.
 for(let x=0;x<W;x++){let ramps=[330,668,1132,1518,1885],ratchet=ramps.reduce((a,p,k)=>a+(k%2?30:45)*bell(x,p,67+14*k),0);top[x]=clamp(Math.round(182+16*Math.sin(x*.0064)+8*Math.sin(x*.024)+ratchet),170,286);bottom[x]=clamp(Math.round(836+11*Math.sin(x*.0051)-13*Math.sin(x*.017)-62*bell(x,468,92)-55*bell(x,970,112)-40*bell(x,1550,105)),741,860);for(let y=0;y<top[x];y++){g[y*W+x]=y>top[x]-13?M.T:y>top[x]-33?M.C:y<24&&Math.floor(x/107)%5===0?M.S:M.B;}for(let y=bottom[x];y<H;y++){g[y*W+x]=y<bottom[x]+19?M.C:y>957&&Math.floor(x/131)%7===0?M.O:M.B;}}
 // District 1: magnetic dispatch and usable control loft with open Midge lift shaft.
 rect(169,78,260,158,0);rect(265,210,103,224,0);rect(164,79,24,149,M.T);rect(169,78,253,13,M.Z);
 rect(169,228,89,13,M.C);rect(369,228,60,13,M.C);rect(188,183,74,12,M.T);rect(186,195,19,40,M.I);rect(204,174,14,28,M.Q);rect(229,174,14,28,M.G);
 beam(332,top[332]-21,352,330,13,M.T);beam(352,330,379,307,8,M.P);
 beam(397,top[397]-15,426,327,12,M.T);beam(426,327,446,317,6,M.Q);
 rect(121,829,256,127,0);rect(179,679,102,182,0);rect(129,943,219,17,M.C);rect(133,904,28,40,M.T);
 beam(141,910,204,942,11,M.I);rect(151,898,83,11,M.Z);rect(293,905,51,11,M.I);rect(300,875,11,30,M.Z);
 // District 2: roof-suspended pressure folds, two different wide service mouths.
 for(const [x,reach,side] of [[506,320,1],[649,307,-1],[788,319,1]]){beam(x,top[x]-13,x+side*38,reach,15,M.T);beam(x+side*38,reach,x+side*76,reach-14,7,M.Z);rect(x+side*32-10,reach-7,24,11,M.Q,true);}
 for(let x=442;x<849;x++){let rise=Math.max(0,Math.round(24+28*bell(x,589,58)+34*bell(x,771,42))),lip=bottom[x]-rise;rect(x,lip,1,bottom[x]-lip+13,M.C);}
 for(let x=460;x<820;x+=47)rect(x,bottom[x]+14,23,8,x%2?M.I:M.Z,true);
 rect(466,850,296,112,0);rect(519,683,98,194,0);rect(678,691,76,202,0);
 rect(471,946,286,14,M.C);rect(480,915,20,32,M.T);beam(484,914,537,944,12,M.I);rect(510,916,111,9,M.Z);rect(621,921,25,25,M.T);rect(643,884,65,11,M.Q);rect(672,890,17,54,M.I);
 polygon([[515,934],[540,900],[566,916],[606,934]],M.I);for(let j=0;j<5;j++)beam(543+j*12,924,548+j*12,936,4,j%2?M.Z:M.Q);
 // District 3: overhead split induction crown and accessible underground test cell.
 beam(903,top[903]-14,986,316,15,M.T);beam(1148,top[1148]-12,1065,310,15,M.T);
 beam(986,316,1027,324,9,M.Z);beam(1065,310,1027,324,9,M.I);
 beam(936,top[936]-18,993,303,5,M.P);beam(1127,top[1127]-18,1063,302,6,M.Q);
 rect(894,846,332,121,0);rect(990,694,102,192,0);
 polygon([[845,975],[891,779],[911,797],[930,975]],M.T);
 polygon([[1216,974],[1190,769],[1170,783],[1139,974]],M.T);
 rect(904,941,52,16,M.C);rect(915,909,16,36,M.I);rect(958,934,50,12,M.Z);rect(1110,938,89,14,M.C);
 beam(1147,948,1160,890,10,M.I);rect(1130,887,41,10,M.Q);rect(1162,909,17,30,M.Z);
 for(let j=0;j<7;j++){let x=852+j*53;rect(x,top[x]-5,17,7,j%2?M.P:M.Q,true);rect(x,bottom[x]+2,19,8,j%2?M.Z:M.I,true);}
 // District 4: V-shaped grounded ion scrubber finbank and dual-entrance service lab.
 for(let j=0;j<5;j++){let x=1280+j*61,h=287+((j*19)%28);beam(x,top[x]-15,x+29,h,8,M.T);beam(x+29,h,x+49,top[x+49]-8,5,M.Z);rect(x+26,h-8,8,16,M.P,true);}
 rect(1306,853,323,108,0);rect(1374,698,95,197,0);rect(1538,691,78,200,0);rect(1319,941,300,17,M.C);
 for(let i=0;i<4;i++){let x=1330+i*69;rect(x,906,13,38,M.T);polygon([[x+12,932],[x+42,i===2?925:887-(i%2)*14],[x+55,932]],M.I);rect(x+17,929,38,8,i%2?M.P:M.Z,true);}
 rect(1403,885,65,9,M.Q);rect(1502,896,17,44,M.I);
 // District 5: east capture/return gate and grounded counterphase actuator.
 beam(1718,top[1718]-13,1787,314,14,M.T);beam(1787,314,1828,293,9,M.Q);beam(1981,top[1981]-11,1932,318,13,M.T);beam(1932,318,1889,301,7,M.P);
 for(let j=0;j<5;j++){let x=1727+j*49;rect(x,bottom[x]+4,27,9,M.Z,true);}
 rect(1706,847,236,112,0);rect(1813,686,94,180,0);rect(1713,944,220,15,M.C);
 rect(1722,899,22,44,M.T);rect(1738,898,80,12,M.I);polygon([[1754,898],[1790,868],[1815,898]],M.Z);beam(1844,928,1887,899,9,M.I);rect(1853,891,59,9,M.Q);
 for(let x=173;x<1960;x+=61)rect(x,top[x]-6,24,6,x<840?M.Q:x<1300?M.Z:M.P,true);
 for(let x=1842;x>188;x-=67)rect(x,bottom[x]+4,26,8,x>1200?M.P:x>760?M.Z:M.Q,true);
 beam(56,top[56]-12,65,349,11,M.T);beam(65,349,87,332,7,M.Q);
 beam(1988,top[1988]-12,1988,353,10,M.T);beam(1988,353,1969,339,8,M.Q);
 beam(75,bottom[75]+14,75,718,10,M.T);beam(75,718,100,734,7,M.P);
 beam(1981,bottom[1981]+12,1981,715,12,M.T);beam(1981,715,1959,735,7,M.P);
 for(const [x,bias] of [[250,25],[465,-30],[826,30],[1290,-20],[1600,28]]){let y=bottom[x]+20;beam(x-17,y+68,x+bias,y+10,7,M.I,true);}
 // Functional rooftop instrument lofts, not falsely drawn inaccessible scenic windows.
 rect(620,73,241,143,0);rect(720,208,93,191,0);rect(622,74,231,14,M.Z);rect(628,201,85,14,M.C);rect(812,202,44,14,M.C);rect(623,74,13,128,M.T);rect(645,176,60,11,M.T);rect(645,186,13,25,M.I);
 for(let k=0;k<5;k++){let x=650+26*k;rect(x,87,9,39+(k%3)*7,k%2?M.Z:M.I);rect(x+8,101,10,9,M.Q,true);}
 rect(1244,82,223,134,0);rect(1299,205,88,189,0);rect(1244,81,220,15,M.T);rect(1244,82,13,126,M.Z);rect(1248,200,47,12,M.C);rect(1386,200,78,12,M.C);rect(1401,119,15,83,M.I);rect(1410,117,49,12,M.Q);
 for(let j=0;j<5;j++){rect(1259+j*25,106,11,35+j%2*14,M.P);rect(1259+j*25,107,11,4,M.Q,true);}
 // Mechanically connected material-cell canisters, inlets and rooted baffles.
 for(const [cx,cy,rx,ry,base] of [[503,916,35,33,950],[694,915,39,31,952],[936,906,40,34,946],[1177,907,40,37,950]]){
  ellipse(cx,cy,rx,ry,M.I);ellipse(cx,cy,rx-9,ry-9,0);beam(cx-rx+6,cy+ry-4,cx+rx-6,base,8,M.T);
  rect(cx-5,cy+ry-6,10,Math.max(0,base-(cy+ry-6)),M.Z);beam(cx,cy+10,cx,base,5,M.Q);
 }
 for(const [cx,r] of [[1368,38],[1605,43]]){ellipse(cx,907,r,36,M.T);ellipse(cx,905,r-11,24,0);rect(cx-11,937,22,15,M.C);rect(cx-r+6,911,10,30,M.I);rect(cx+r-16,911,10,30,M.I);beam(cx-15,936,cx+12,936,6,M.Z);}
 for(const [cx,rise] of [[432,77],[1155,94],[1657,84]]){let by=bottom[cx]+30;beam(cx-41,by+28,cx,by-rise,13,M.T);beam(cx,by-rise,cx+47,by+17,8,M.I);beam(cx,by-rise+8,cx+17,by-rise+21,5,M.P);rect(cx-19,by-7,39,12,M.Z,true);}
 for(let cx of [450,960,1480])for(let j=0;j<6;j++){let x=cx+24*j,yy=bottom[x]+23;rect(x,yy,14,11,j%2?M.I:M.T,true);rect(x+4,yy+17,10,23,M.Z,true);}
 for(const [a,b,y] of [[188,249,213],[654,705,191],[1280,1296,196]]){rect(a,y,b-a,8,M.I,true);rect(a+7,y-2,8,5,M.Q,true);}
 // Physical rooting audit: remove every immovable material island disconnected from any border-grounded structure.
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let head=0,tail=0,removed=0;
 function add(i){if(g[i]&&!seen[i]){seen[i]=1;q[tail++]=i;}}
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(head<tail){let i=q[head++],x=i%W,y=(i-x)/W;if(x)add(i-1);if(x<W-1)add(i+1);if(y)add(i-W);if(y<H-1)add(i+W);}
 for(let i=0;i<g.length;i++)if(g[i]&&!seen[i]){g[i]=0;removed++;}
 return {g,removed,grounded:tail};
}
function encodeRects(g){
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){const next=new Map(),off=y*W;let x=0;
  while(x<W){let v=g[off+x],s=x;while(x<W&&g[off+x]===v)x++;if(!v)continue;
   let k=s+','+(x-s)+','+v,r=active.get(k);if(r)r[3]++;else{r=[s,y,x-s,1,v];edits.push(r);}next.set(k,r);visits+=x-s;
  }active.clear();for(const [k,v]of next)active.set(k,v);
 }return {edits,visits};
}
function setupFrom(edits){return {version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:[139,414],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};}
function legal(g,w,h){
 const s=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let count=0,a=y*(W+1),b=(y-1)*(W+1);for(let x=1;x<=W;x++){count+=g[(y-1)*W+x-1]?1:0;s[a+x]=count+s[b+x];}}
 const ok=new Uint8Array(g.length),left=w>>1,right=w-1-left,top=h>>1,bot=h-1-top;
 for(let y=top;y<H-bot;y++){let a=(y-top)*(W+1),b=(y+bot+1)*(W+1);for(let x=left;x<W-right;x++){let x1=x-left,x2=x+right+1;if(s[b+x2]-s[a+x2]-s[b+x1]+s[a+x1]===0)ok[y*W+x]=1;}}
 return ok;
}
function reach(g,w,h,spawn=[139,414]){
 const ok=legal(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),start=spawn[1]*W+spawn[0];
 if(!ok[start])throw Error('BLOCKED_ACTUAL_SPAWN');let head=0,tail=1;q[0]=start;seen[start]=1;
 while(head<tail){let i=q[head++],x=i%W,y=(i-x)/W,t=i-1;if(x&&ok[t]&&!seen[t]){seen[t]=1;q[tail++]=t;}t=i+1;if(x<W-1&&ok[t]&&!seen[t]){seen[t]=1;q[tail++]=t;}t=i-W;if(y&&ok[t]&&!seen[t]){seen[t]=1;q[tail++]=t;}t=i+W;if(y<H-1&&ok[t]&&!seen[t]){seen[t]=1;q[tail++]=t;}}
 return {connected:tail,missing:SITES.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0])};
}
function pngIndexed(g,x0,y0,w,h){
 const raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){let d=y*(w+1),s=(y0+y)*W+x0;for(let x=0;x<w;x++)raw[d+1+x]=g[s+x];}
 const plte=Buffer.alloc(132*3),trans=Buffer.alloc(132,255);for(const [id,p]of Object.entries(PALETTE)){let i=+id;plte[i*3]=p[0];plte[i*3+1]=p[1];plte[i*3+2]=p[2];trans[i]=p[3];}
 const tab=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;tab[n]=c>>>0;}
 function chunk(n,d){let name=Buffer.from(n),len=Buffer.alloc(4),check=Buffer.alloc(4),c=0xffffffff;len.writeUInt32BE(d.length);for(let b of name)c=tab[(c^b)&255]^(c>>>8);for(let b of d)c=tab[(c^b)&255]^(c>>>8);check.writeUInt32BE((c^0xffffffff)>>>0);return Buffer.concat([len,name,d,check]);}
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=3;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('PLTE',plte),chunk('tRNS',trans),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
const CROPS=[['overview.png',0,0,W,H],['01-west-dispatch.png',0,20,480,512],['02-bellows-run.png',397,243,478,590],['03-phase-exchange.png',806,200,504,620],['04-ion-scrubber.png',1265,230,453,630],['05-east-return.png',1600,245,448,615],['06-lower-service.png',836,690,512,334]];
function produce(){
 const {g,removed,grounded}=generate(),{edits,visits}=encodeRects(g),json=JSON.stringify(setupFrom(edits)),jsonBytes=Buffer.byteLength(json);
 if(edits.length>32768||jsonBytes>1048576||visits>32000000)throw Error('SOURCE_LIMITS');
 const replica=new Uint8Array(g.length);let replays=0;for(const [x,y,w,h,m]of edits){if(x<0||y<0||w<=0||h<=0||x+w>W||y+h>H||!PALETTE[m]||m===0)throw Error('BAD_RECT');for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let at=yy*W+xx;if(replica[at])throw Error('OVERLAP');replica[at]=m;replays++;}}
 for(let i=0;i<g.length;i++)if(g[i]!==replica[i])throw Error('GRID_REPLAY_MISMATCH');
 if(replays!==visits)throw Error('WORK_VISIT_MISMATCH');
 const histogram={};for(let m of g)histogram[m]=(histogram[m]||0)+1;
 const clearances={};for(let [w,h]of [[19,15],[23,19],[31,27]]){let r=reach(g,w,h);if(r.missing.length)throw Error('BLOCKED_SITE '+w+' '+r.missing.join(','));clearances[w+'x'+h]={reached:SITES.length,connected:r.connected};}
 const obs=Uint8Array.from(g);for(let y=365;y<450;y++)for(let x=949;x<1091;x++)obs[y*W+x]=M.C;
 const blocked=reach(obs,31,27);if(blocked.missing.join(',')!=='Phase Transfer Upper')throw Error('BAD_ALTERNATE '+blocked.missing);
 const image_checks={};for(let [name,x,y,w,h]of CROPS){let bytes=pngIndexed(g,x,y,w,h);fs.writeFileSync(path.join(__dirname,name),bytes);image_checks[name]={x,y,w,h,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
 const receipt={kind:'RAZORBACK_PHASE_EXCHANGE_ORIGINAL_RACING_WIDE',seed:'0x'+SEED.toString(16),engine_main_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[W,H],material_cells:g.length,rectangles:edits.length,setup_json_bytes:jsonBytes,work_visits:visits,source_limits:{rectangles:32768,bytes:1048576,work:32000000},histogram,grounded_solids:grounded,discarded_unanchored_solid_cells:removed,remaining_detached:0,material_laws:'All occupied IDs 49,58,62,100,101,113,117,120,122,123,128 are immovable inert Solid / RuleKernel::None',midge:{authored_hull:[4,3],hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:[139,414]},sites:SITES.map(([name,x,y])=>({name,x,y})),clearances,physical_obstruction:{xywh:[949,365,142,85],remaining:SITES.length-blocked.missing.length,missing:blocked.missing},grid_sha256:crypto.createHash('sha256').update(g).digest('hex'),setup_sha256:crypto.createHash('sha256').update(json).digest('hex'),pngs:image_checks,native:'NATIVE-UNTESTED'};
 fs.writeFileSync(path.join(__dirname,'setup-razorback-phase-exchange.json'),json);
 fs.writeFileSync(path.join(__dirname,'qualification.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({rectangles:edits.length,bytes:jsonBytes,grid:receipt.grid_sha256,sites:SITES.length,clearances,blocked:receipt.physical_obstruction,images:CROPS.length},null,2));
 return receipt;
}
if(require.main===module)produce();
module.exports={generate,encodeRects,setupFrom,reach,produce,CROPS,PALETTE,SITES,W,H};