"use strict";
// Original fully deterministic 2048x1024 CyberSand sci-fi frontier world.
// Node 22+: node build.cjs --verify. No images or reference art used.
const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),path=require("path");
function generate(){
"use strict";
const W=2048,H=1024,SEED=20261119;
const M={A:0,B:100,T:49,O:101,C:58,S:62,U:63,V:64,G:66,P:68,F:120,Q:121,X:122,Y:128,Z:129,K:130,N:131,L:80,I:77,J:79,D:98};
const g=new Uint8Array(W*H);
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(p,m){for(let y=Math.max(0,Math.ceil(Math.min(...p.map(v=>v[1]))));y<=Math.min(H-1,Math.floor(Math.max(...p.map(v=>v[1]))));y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<=Math.min(H-1,Math.ceil(Math.max(y,Y)+r));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<=Math.min(W-1,Math.ceil(Math.max(x,X)+r));xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1&&d>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}
const sites={"Rover gate":[135,495],"Citadel porch":[289,402],"Upper xenology":[322,304],"Western assay":[317,577],"Archive lower":[265,750],"West rift dock":[650,496],"Helio skywalk":[792,264],"Phasewell top":[1020,284],"Phasewell central":[1020,494],"Phasewell undercroft":[1020,751],"East tram bridge":[1365,495],"Quarantine lock":[1558,496],"Cargo bay":[1812,495],"Eastern observatory":[1694,304],"Ion exchanger":[1815,748],"Deep mineral survey":[1305,748]};
for(let x=0;x<W;x++){let y=Math.round(895+20*Math.sin(x*.011)+16*Math.sin(x*.028)+24*Math.sin(x*.002));R(x,y,1,H-y,M.B);}
P([[0,1024],[0,465],[55,435],[121,444],[190,496],[242,561],[319,615],[435,668],[533,775],[651,1024]],M.B);
P([[2048,1024],[2048,436],[2009,399],[1969,426],[1914,484],[1855,526],[1800,605],[1732,665],[1613,750],[1513,1024]],M.B);
P([[0,0],[0,244],[44,272],[96,239],[151,260],[227,224],[295,244],[348,191],[409,207],[462,151],[508,0]],M.B);
P([[1535,0],[1581,190],[1616,170],[1673,235],[1730,209],[1809,254],[1877,215],[1957,177],[2048,204],[2048,0]],M.B);
for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.B){let b=(y+Math.floor(x*.06)+Math.round(10*Math.sin(x*.015)))%159;if(b<12)g[o+x]=M.O;else if(b<34)g[o+x]=M.T;}}
R(170,698,335,132,M.A);R(422,708,493,130,M.A);R(873,701,476,139,M.A);R(1329,706,526,132,M.A);
P([[479,676],[557,652],[625,731],[646,841],[557,886],[479,842]],M.O);P([[1400,838],[1468,687],[1532,662],[1619,798],[1537,900]],M.O);
R(497,709,123,120,M.A);R(1459,725,120,106,M.A);
P([[65,454],[83,337],[156,306],[227,321],[304,283],[378,304],[448,352],[464,551],[400,598],[87,581]],M.C);
P([[94,528],[97,382],[154,349],[248,347],[315,330],[381,356],[427,385],[430,529]],M.A);
L(91,355,178,330,10,M.S);L(178,330,304,318,10,M.S);L(304,318,423,378,12,M.S);
P([[139,310],[168,273],[224,282],[235,316]],M.Z);P([[283,310],[322,265],[373,294],[386,336]],M.Z);
R(136,372,100,8,M.U);R(278,372,94,8,M.U);
for(let x of [129,236,355,418]){R(x,397,9,72,M.P);R(x+1,398,6,9,M.I);}
R(118,539,335,11,M.S);R(136,550,300,8,M.G);
for(let x of [157,234,307,384]){L(x,560,x+28,626,8,M.S);R(x,554,27,7,M.J);}
P([[139,645],[190,602],[327,588],[444,637],[479,699],[135,701]],M.C);
P([[151,656],[192,628],[312,621],[418,662],[429,685],[152,685]],M.A);
R(177,706,280,12,M.S);R(187,717,258,7,M.U);
for(let x of [192,294,421]){R(x,721,11,90,M.P);R(x+2,763,8,6,M.I);}
R(203,815,220,12,M.C);
P([[23,480],[51,455],[95,474],[115,519],[113,616],[31,641],[10,596]],M.K);
P([[38,507],[75,496],[97,522],[91,594],[34,602]],M.A);
R(32,612,70,10,M.S);R(47,618,42,7,M.J);
L(456,554,781,555,13,M.S);L(1234,549,1545,558,15,M.S);
for(let x of [487,560,638,724]){L(x,560,x+32,621,7,M.P);L(x+32,621,x+63,559,7,M.K);}
for(let x of [1266,1354,1442]){L(x,558,x+33,620,8,M.P);L(x+33,620,x+65,562,7,M.K);}
R(557,542,81,9,M.U);R(1355,538,96,9,M.U);
ring(1013,452,215,190,17,M.S);ring(1013,452,187,161,9,M.U);
R(780,412,115,125,M.A);R(1133,410,117,132,M.A);
L(867,609,926,675,15,M.K);L(1164,610,1100,679,15,M.K);
L(926,675,922,870,18,M.C);L(1100,679,1101,874,18,M.C);
P([[1010,299],[1052,321],[1071,370],[1040,411],[988,397],[960,358],[987,317]],M.X);
P([[1012,321],[1033,342],[1041,370],[1014,386],[986,370],[988,343]],M.A);
R(993,397,41,9,M.J);
L(1014,297,1014,115,11,M.S);L(1014,140,943,98,8,M.P);L(1014,140,1109,76,8,M.P);
P([[897,119],[942,48],[989,81],[994,124]],M.Z);P([[1040,121],[1097,39],[1161,67],[1129,141]],M.Z);
R(974,106,22,6,M.J);R(1086,75,23,6,M.I);
L(478,235,769,248,9,M.S);L(763,249,902,270,9,M.S);L(1130,257,1422,238,9,M.S);L(1420,239,1554,296,9,M.S);
for(let x of [540,633,716]){L(x,246,x+28,290,6,M.K);L(x+28,290,x+60,248,6,M.P);}
for(let x of [1192,1306,1391]){L(x,251,x+30,298,6,M.P);L(x+30,298,x+58,246,5,M.K);}
R(565,231,99,6,M.U);R(1203,237,93,7,M.U);
P([[694,857],[734,803],[789,817],[835,874]],M.O);R(719,823,88,38,M.A);R(731,855,64,7,M.I);
P([[1237,866],[1309,805],[1387,843],[1416,891]],M.T);R(1291,826,105,45,M.A);R(1314,866,69,7,M.J);
P([[1500,361],[1557,319],[1613,326],[1657,274],[1722,291],[1808,257],[1887,285],[1979,273],[2048,334],[2048,672],[1965,690],[1856,658],[1772,670],[1670,652],[1560,666]],M.S);
P([[1522,399],[1577,360],[1656,358],[1697,334],[1766,348],[1836,328],[1958,355],[2014,411],[2014,611],[1941,626],[1832,624],[1711,626],[1591,615],[1532,568]],M.A);
L(1526,352,1636,305,12,M.K);L(1636,305,1745,311,12,M.K);L(1745,311,1855,283,12,M.K);L(1855,283,2027,347,12,M.K);
P([[1661,282],[1694,233],[1768,253],[1778,298]],M.Z);P([[1858,281],[1901,226],[1979,253],[1987,312]],M.Z);
for(let x of [1609,1715,1841,1956]){R(x,347,43,9,M.F);R(x+9,349,24,5,M.L);}
R(1588,387,376,13,M.U);R(1595,402,365,7,M.G);
for(let x of [1654,1754,1872,1935]){R(x,411,13,46,M.P);R(x,440,23,8,M.I);}
R(1734,416,105,9,M.F);R(1755,428,69,18,M.Q);R(1776,434,28,5,M.J);
P([[1585,606],[1616,576],[1670,566],[1736,584],[1757,619],[1616,628]],M.K);
R(1615,579,93,7,M.U);R(1666,590,32,16,M.Q);
P([[1843,603],[1889,579],[1958,572],[2005,600],[1982,630],[1862,628]],M.K);
R(1893,581,68,8,M.Q);R(1938,591,23,7,M.J);
R(1577,648,431,15,M.S);R(1600,669,372,10,M.G);
for(let x of [1604,1743,1894]){L(x,664,x+23,735,11,M.C);L(x+23,735,x+44,677,8,M.P);}
R(1618,779,275,13,M.N);R(1653,789,222,8,M.U);
for(let x of [1645,1747,1844]){R(x,798,33,8,M.F);R(x+12,805,9,7,M.I);}
L(1948,288,1948,136,10,M.P);L(1948,138,1864,110,8,M.P);L(1948,138,2002,104,8,M.P);
P([[1822,114],[1863,91],[1898,125],[1867,144]],M.Z);P([[1991,110],[2022,86],[2041,119],[2009,146]],M.Z);
R(80,462,1920,77,M.A);R(165,715,1715,80,M.A);
for(let x of [272,470,980,1490,1740])R(x,520,104,240,M.A);
for(let x of [300,767,976,1226,1648])R(x,244,100,246,M.A);
R(278,539,78,104,M.A);
R(95,552,323,10,M.S);R(112,566,299,7,M.U);
R(1593,554,398,13,M.S);R(1607,570,371,7,M.U);
for(let x of [131,218,360])R(x,554,15,25,M.P);
for(let x of [1614,1850,1958])R(x,561,15,28,M.P);
R(856,582,115,12,M.K);R(1070,583,125,12,M.K);
for(let x=600;x<1410;x+=84){R(x,870,32,7,M.O);R(x+6,877,8,8,M.T);}
R(286,565,64,71,M.A);
const start=sites["Rover gate"];
const rect=[],hist={},replay=new Uint8Array(g.length);let active=new Map(),area=0;
for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){const m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,idx=active.get(key);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(key,idx);}active=next;}
for(let [x,y,w,h,m] of rect){hist[m]=(hist[m]||0)+w*h;area+=w*h;for(let yy=y;yy<y+h;yy++)replay.fill(m,yy*W+x,yy*W+x+w);}
for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("replay mismatch "+i);
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+" "+area);
let ii=new Int32Array((W+1)*(H+1)),S=W+1;for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=g[o+x-1]?1:0;ii[y*S+x]=ii[(y-1)*S+x]+sum;}}
function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*S+c]-ii[d*S+a]-ii[b*S+c]+ii[b*S+a]===0;}
function bfs(w,h){let pass=new Uint8Array(g.length),seen=new Uint8Array(g.length),q=new Int32Array(g.length),head=0,tail=0;for(let y=(h>>1);y<H-(h>>1);y++)for(let x=(w>>1);x<W-(w>>1);x++)if(clear(x,y,w,h))pass[y*W+x]=1;let si=start[1]*W+start[0];if(!pass[si])return{size:[w,h],spawnBlocked:true};q[tail++]=si;seen[si]=1;while(head<tail){let a=q[head++],x=a%W,y=(a/W)|0;for(let j of [a-W,a+W,a-1,a+1])if(j>=0&&j<g.length&&!(Math.abs(a-j)===1&&((j/W)|0)!==y)&&pass[j]&&!seen[j]){seen[j]=1;q[tail++]=j;}}let bad=Object.entries(sites).filter(([n,[x,y]])=>!seen[y*W+x]).map(([n,p])=>({name:n,xy:p,clear:clear(...p,w,h)}));return{size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,airCentres:tail,bad};}
let routes=[[19,15],[23,19],[31,27]].map(x=>bfs(...x));if(routes.some(x=>x.spawnBlocked||x.bad?.length))throw Error("clearance "+JSON.stringify(routes));
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
let json=JSON.stringify(setup);if(json.length>1048576)throw Error("JSON "+json.length);
const rgb={0:[8,11,18],49:[70,83,99],100:[54,56,61],101:[24,19,32],58:[119,123,128],62:[126,141,153],63:[49,100,119],64:[109,125,134],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],80:[236,248,255],98:[226,223,216],120:[156,210,220],121:[190,216,225],122:[226,236,244],128:[62,122,180],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function crc(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
function chunk(t,d){let b=new Uint8Array(d.length+12);b.set(be(d.length),0);b.set(t.split("").map(x=>x.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b;}
// DEFLATE fixed canonical Huffman with distance-one RLE, lossless zlib stream.
function rev(v,n){let o=0;while(n--){o=(o<<1)|(v&1);v>>>=1;}return o;}
function zlib(raw){const out=[120,1];let bits=0,used=0;
function wr(v,n){bits|=v<<used;used+=n;while(used>=8){out.push(bits&255);bits>>>=8;used-=8;}}
function sym(s){let code,n;if(s<=143){code=48+s;n=8;}else if(s<=255){code=400+s-144;n=9;}else if(s<=279){code=s-256;n=7;}else{code=192+s-280;n=8;}wr(rev(code,n),n);}
const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
function run(n){let i=0;while(i<28&&lb[i+1]<=n)i++;sym(i+257);if(le[i])wr(n-lb[i],le[i]);wr(0,5);}
wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let n=1;while(i+n<raw.length&&n<258&&raw[i+n]===raw[i])n++;if(n>=4&&i>0&&raw[i-1]===raw[i]){run(n);i+=n;}else{sym(raw[i]);i++;}}sym(256);if(used)out.push(bits&255);
let s1=1,s2=0;for(let v of raw){s1=(s1+v)%65521;s2=(s2+s1)%65521;}out.push(...be(((s2<<16)|s1)>>>0));return new Uint8Array(out);}
function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);let pal=new Uint8Array(132*3);for(let id=0;id<132;id++)pal.set(rgb[id]||[128,128,128],id*3);let parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zlib(raw)),chunk("IEND",new Uint8Array())],out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0)),p=0;for(let a of parts){out.set(a,p);p+=a.length;}return out;}
const crops=[["01-west-citadel",45,245,510,470],["02-split-phasewell",770,46,500,590],["03-rift-geology",480,548,485,390],["04-east-cargo",1505,237,530,490],["05-deep-survey",1190,638,620,340]];
const imgs=[["overview",png(0,0,W,H)],...crops.map(([n,x,y,w,h])=>[n,png(x,y,w,h)])];
return {g,setup,json,rect,hist,area,sites,routes,crops,imgs,seed:SEED};
}
const a=generate();const p=__dirname;
const sha=d=>crypto.createHash("sha256").update(d).digest("hex");
fs.writeFileSync(path.join(p,"setup-morrow-array.json"),a.json);
for(const [name,bytes] of a.imgs){
 fs.writeFileSync(path.join(p,name+".png"),bytes);
 let chunks=[],n=8;while(n<bytes.length){const l=Buffer.from(bytes).readUInt32BE(n),t=Buffer.from(bytes.subarray(n+4,n+8)).toString("ascii");if(t==="IDAT")chunks.push(Buffer.from(bytes.subarray(n+8,n+8+l)));n+=12+l;}
 const raw=zlib.inflateSync(Buffer.concat(chunks));
 const crop=name==="overview"?[0,0,2048,1024]:a.crops.find(q=>q[0]===name).slice(1);
 const [x,y,w,h]=crop;if(raw.length!==(w+1)*h)throw Error("invalid PNG scanline length "+name);
 for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("unexpected PNG filter");for(let xx=0;xx<w;xx++){if(raw[yy*(w+1)+xx+1]!==a.g[(yy+y)*2048+x+xx])throw Error("cell-pixel mismatch "+name+":"+xx+","+yy);}}
}
const receipt={concept:"Morrow Array — The Split Phasewell",original:true,seed:a.seed,extent:[2048,1024],engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",midge_hull:[4,3],solid_material_histogram:a.hist,rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:Buffer.byteLength(a.json),material_plane_sha256:sha(a.g),setup_sha256:sha(a.json),images:a.imgs.map(([name,b])=>({name,bytes:b.length,sha256:sha(b)})),clearance:a.routes,exact_sites:a.sites,source_art:"none; independently invented",native_status:"NATIVE-UNTESTED",tests:["complete plane exact replay","supported ID statics","conservative 19x15 23x19 31x27 exact-site four-neighbour BFS","indexed PNG inflated-pixel parity"]};
fs.writeFileSync(path.join(p,"receipt.json"),JSON.stringify(receipt,null,2)+"\n");
if(process.argv.includes("--verify"))console.log(JSON.stringify({status:"STATIC-PASS",sha256:receipt.material_plane_sha256,rectangles:receipt.rectangles,sites:receipt.clearance,png_parity:"PASS"}));
