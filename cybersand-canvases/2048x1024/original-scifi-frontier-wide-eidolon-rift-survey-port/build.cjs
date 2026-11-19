(function(){
'use strict';
/* Eidolon Rift Survey Port — original cells, no reference/tracing.
 * Rebuild: node build.cjs; compare complete files: node build.cjs --verify
 * Indexed PNG pixel index is the actual CyberSand material ID. */
const W=2048,H=1024,SEED=2611190120;
let repairReceipt=null;
const M={SLATE:49,CONCRETE:58,STEEL:62,BASALT:100,ADOBE:102,ALUMINIUM:114,GOLD:118,FROST:121,SOLAR:129};
const palette={0:[9,14,25],49:[66,80,99],58:[112,121,133],62:[144,161,176],100:[30,36,50],102:[178,115,81],114:[207,218,228],118:[239,186,83],121:[108,193,203],129:[45,75,131]};
const sites=[
['Landing Exchange',[272,571]],['Solar Mast Control',[242,332]],
['Geology Receiving Hall',[514,590]],['Xenolith Analysis Chamber',[700,594]],
['Rift Sky Tram',[995,570]],['Fault Descent',[1002,824]],
['Glass Meridian Observatory',[1390,510]],['Spectral Sample Gallery',[1434,665]],
['Eastern Cargo Customs',[1696,620]],['Foundry Sorting Hall',[1843,652]],['Deep Silicate Archive',[1107,942]]];
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const min=(a,b)=>a<b?a:b,max=(a,b)=>a>b?a:b,cl=(a,l,h)=>min(h,max(l,a));
function surface(x){let z=815+15*Math.sin(x/65)+8*Math.sin(x/23);
 if(x>=670&&x<900)z+=(x-670)/230*115;
 if(x>=900&&x<=1210)z+=115+12*Math.sin(x/61);
 if(x>1210&&x<1440)z+=(1440-x)/230*115;
 if(x>=1440)z=793+22*Math.sin(x/83)+7*Math.sin(x/26);
 return cl(Math.floor(z),760,975)}
function plane(){const a=new Uint8Array(W*H);
 function R(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);const l=cl(x,0,W),r=cl(x+w,0,W),u=cl(y,0,H),d=cl(y+h,0,H);for(let yy=u;yy<d;yy++)a.fill(id,yy*W+l,yy*W+r)}
 function L(x,y,xx,yy,t,id){const n=max(1,Math.ceil(max(Math.abs(xx-x),Math.abs(yy-y))/3));for(let k=0;k<=n;k++){const q=k/n;R(Math.round(x+(xx-x)*q)-Math.floor(t/2),Math.round(y+(yy-y)*q)-Math.floor(t/2),t,t,id)}}
 function A(cx,cy,rx,ry,start,end,t,id){const n=Math.ceil((end-start)*max(rx,ry)/3);let x=cx+rx*Math.cos(start),y=cy+ry*Math.sin(start);for(let k=1;k<=n;k++){const v=start+(end-start)*k/n,xx=cx+rx*Math.cos(v),yy=cy+ry*Math.sin(v);L(x,y,xx,yy,t,id);x=xx;y=yy}}
 // Every geological stratum is founded on the planetary lower boundary.
 for(let x=0;x<W;x++){const top=surface(x);for(let y=top;y<H;y++){let id=M.BASALT;
 if(y>top+19&&y<H-18&&((y+Math.floor(8*Math.sin(x/59)))%92)<7)id=M.SLATE;
 if(y>top+64&&y<H-25&&((Math.floor(x/131)+Math.floor(y/53))%11===0)&&y%17<3)id=M.ADOBE;a[y*W+x]=id}}
 R(0,0,10,H,M.BASALT);R(W-10,0,10,H,M.BASALT);R(0,H-14,W,14,M.BASALT);
 // Real excavated planetary cavities and paired approaches
 R(868,927,452,65,0);R(924,909,342,42,0);R(965,827,57,154,0);R(1230,835,59,142,0);
 R(656,810,66,118,0);R(1658,772,57,153,0);R(1690,866,190,68,0);R(1810,840,58,81,0);
 for(let x=60;x<810;x+=48){const y=surface(x);R(x,y+22,24,4,M.SLATE);R(x+5,y+41,10,3,M.ADOBE)}
 for(let x=1290;x<2000;x+=51){const y=surface(x);R(x,y+26,19,4,M.SLATE)}
 // 1. Landed civic shuttle exchange: nonuniform silhouette, solar mast and full interior
 R(54,656,350,12,M.STEEL);R(74,665,18,175,M.CONCRETE);R(378,665,18,176,M.CONCRETE);
 R(76,433,297,9,M.ALUMINIUM);R(76,433,10,225,M.STEEL);R(363,433,10,223,M.STEEL);
 R(98,616,266,8,M.STEEL);R(110,474,7,139,M.STEEL);R(328,474,8,139,M.STEEL);
 R(125,508,177,6,M.ALUMINIUM);R(125,541,148,5,M.STEEL);
 for(let x of [128,186,245])R(x,476,48,8,M.FROST);
 R(303,484,13,55,M.SOLAR);R(280,514,8,89,M.STEEL);
 for(let x=116;x<320;x+=38){R(x,586,16,5,M.GOLD);R(x+10,579,4,7,M.ALUMINIUM)}
 L(82,630,54,666,7,M.STEEL);L(362,626,403,665,8,M.STEEL);
 L(121,429,196,397,9,M.STEEL);L(196,397,334,413,9,M.STEEL);L(334,413,371,434,9,M.STEEL);
 R(184,205,13,230,M.STEEL);R(171,198,39,11,M.ALUMINIUM);
 L(190,226,107,268,7,M.SOLAR);L(190,226,272,268,7,M.SOLAR);
 L(190,271,135,299,5,M.ALUMINIUM);L(190,271,240,299,5,M.ALUMINIUM);
 R(120,292,138,7,M.STEEL);R(118,285,10,19,M.GOLD);R(250,285,9,19,M.GOLD);
 R(190,436,9,180,M.STEEL);R(190,619,9,48,M.STEEL);
 // 2. Geological research: two lab storeys, discrete portals, sample consoles, real buttresses
 R(416,770,388,12,M.CONCRETE);R(431,780,14,67,M.STEEL);R(785,780,13,57,M.STEEL);
 R(423,485,12,286,M.STEEL);R(789,485,12,286,M.STEEL);R(423,484,374,10,M.ALUMINIUM);
 R(441,562,348,9,M.CONCRETE);R(441,667,348,10,M.CONCRETE);
 R(499,485,50,10,0);R(714,485,52,10,0);R(423,595,12,50,0);R(789,595,12,48,0);
 R(555,568,13,96,M.STEEL);R(555,597,13,44,0);R(663,568,10,96,M.STEEL);R(663,592,10,60,0);
 R(479,676,12,88,M.STEEL);R(479,712,12,37,0);
 R(698,676,12,88,M.STEEL);R(698,708,12,39,0);
 R(562,649,45,23,0);R(724,649,42,23,0);R(508,551,43,24,0);
 for(let x of [466,607,740]){R(x,519,31,15,M.FROST);R(x+5,535,22,4,M.SOLAR);R(x+8,687,24,12,M.GOLD);R(x+3,705,5,24,M.STEEL)}
 L(432,486,510,420,11,M.STEEL);L(510,420,642,407,10,M.STEEL);L(642,407,795,485,12,M.STEEL);
 R(624,396,17,30,M.SOLAR);R(627,385,11,12,M.GOLD);
 R(371,612,56,9,M.STEEL);L(384,623,427,666,5,M.STEEL);
 // 3. Grand void and high/low transit: distinct overpass, freight bridge and deep supports
 R(796,618,487,12,M.STEEL);R(805,620,16,312,M.CONCRETE);R(1255,620,15,313,M.CONCRETE);
 for(let x of [849,944,1062,1177]){R(x,619,9,18,M.GOLD);L(x,637,x+31,672,5,M.STEEL);L(x+31,672,x+62,629,5,M.STEEL)}
 R(834,450,432,9,M.ALUMINIUM);R(830,447,12,78,M.STEEL);R(1250,448,11,82,M.STEEL);
 L(839,454,929,403,7,M.STEEL);L(929,403,1088,388,7,M.STEEL);L(1088,388,1255,449,7,M.STEEL);
 for(let x of [914,1000,1096,1197]){R(x,451,7,55,M.STEEL);R(x-9,497,25,7,M.GOLD)}
 L(820,630,886,756,9,M.STEEL);L(886,756,928,916,9,M.STEEL);
 L(1259,630,1190,770,9,M.STEEL);L(1190,770,1235,922,9,M.STEEL);
 R(939,728,34,8,M.ALUMINIUM);R(1131,749,34,8,M.ALUMINIUM);
 R(1052,457,10,79,M.STEEL);L(1057,531,1019,557,6,M.GOLD);L(1057,531,1092,557,6,M.GOLD);
 // 4. Glass Meridian: observatory dome, spectral iris, lower dry instrument gallery
 R(1290,736,300,12,M.CONCRETE);R(1310,740,14,151,M.STEEL);R(1562,741,13,76,M.STEEL);
 R(1320,578,242,11,M.STEEL);R(1332,691,219,9,M.STEEL);
 R(1324,504,11,234,M.STEEL);R(1550,504,11,233,M.STEEL);
 A(1440,514,118,170,Math.PI,2*Math.PI,9,M.ALUMINIUM);
 A(1440,516,97,148,Math.PI*1.08,Math.PI*1.9,5,M.FROST);
 R(1412,346,56,9,M.GOLD);R(1440,316,12,33,M.STEEL);R(1434,305,23,13,M.SOLAR);
 R(1370,553,146,7,M.ALUMINIUM);R(1400,542,27,12,M.GOLD);R(1450,536,10,16,M.STEEL);
 L(1453,534,1515,464,7,M.STEEL);R(1514,460,27,12,M.FROST);
 R(1340,623,50,11,M.SOLAR);R(1490,621,46,10,M.SOLAR);R(1371,705,25,16,M.GOLD);R(1467,707,41,11,M.FROST);
 R(1574,700,70,12,M.STEEL);L(1578,699,1629,749,8,M.STEEL);
 // 5. Eastern cargo and refinery: varied sawtooth skyline, stacks and sorting machinery
 R(1616,760,353,13,M.CONCRETE);R(1628,769,12,42,M.STEEL);R(1941,768,15,48,M.STEEL);
 R(1622,542,333,10,M.STEEL);R(1622,680,333,11,M.STEEL);
 R(1622,440,12,322,M.STEEL);R(1944,452,11,309,M.STEEL);
 L(1625,440,1701,398,10,M.ALUMINIUM);L(1701,398,1763,439,9,M.ALUMINIUM);
 L(1763,439,1822,377,10,M.ALUMINIUM);L(1822,377,1894,431,9,M.ALUMINIUM);L(1894,431,1951,451,9,M.ALUMINIUM);
 for(let x of [1657,1772,1872]){R(x,550,10,129,M.STEEL);R(x,577,10,60,0);R(x+17,592,37,9,M.GOLD)}
 R(1648,578,79,12,M.FROST);R(1825,565,99,13,M.SOLAR);
 R(1809,269,22,109,M.STEEL);R(1801,260,38,10,M.ALUMINIUM);R(1789,266,10,32,M.GOLD);
 R(1862,302,17,123,M.STEEL);R(1854,296,34,9,M.ALUMINIUM);
 L(1821,377,1812,520,6,M.STEEL);
 R(1661,473,232,6,M.STEEL);for(let x=1675;x<=1870;x+=42)L(x,477,x+21,536,4,M.SLATE);
 R(1693,717,70,10,M.GOLD);R(1700,706,13,11,M.STEEL);R(1733,705,15,12,M.ALUMINIUM);
 R(1837,716,91,8,M.ALUMINIUM);L(1841,714,1884,697,6,M.STEEL);R(1882,692,36,8,M.GOLD);
 // 6. Deep Silicate Archive, connected by two excavated aerial/vertical access throats
 R(917,982,383,11,M.CONCRETE);R(935,918,343,8,M.STEEL);
 R(946,925,10,57,M.ALUMINIUM);R(1266,925,10,57,M.ALUMINIUM);
 R(1054,937,9,44,M.STEEL);R(1054,944,9,36,0);
 R(1167,937,9,43,M.STEEL);R(1167,941,9,37,0);
 for(let x of [972,1020,1088,1199]){R(x,965,37,7,M.GOLD);R(x+8,952,21,12,M.FROST)}
 R(964,899,59,39,0);R(1225,901,61,39,0);
 R(790,799,92,7,M.STEEL);R(1271,792,74,8,M.STEEL);
 for(let x of [105,350,730,1370,1585,1995]){const y=surface(x);R(x,y-19,13,19,M.STEEL);R(x-7,y-24,26,6,M.GOLD)}
 repairReceipt=require("./repair-admission.cjs")(a,W,H,M,sites);
 return a}
function pack(a){const edits=[];let open=new Map(),painted=0;for(let y=0;y<H;y++){const next=new Map();for(let x=0;x<W;){const x0=x,id=a[y*W+x];while(x<W&&a[y*W+x]===id)x++;if(!id)continue;const len=x-x0,key=x0+':'+len+':'+id,p=open.get(key);if(p&&p[1]+p[3]===y){p[3]++;next.set(key,p)}else{const r=[x0,y,len,1,id];edits.push(r);next.set(key,r)}painted+=len}open=next}return {edits,painted}}
function legal(a,hx,hy){const S=W+1,p=new Uint32Array(S*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=a[y*W+x]?1:0;p[(y+1)*S+x+1]=p[y*S+x+1]+row}}
 const r=new Uint8Array(W*H);for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){const a0=(y-hy)*S+x-hx,b0=(y-hy)*S+x+hx+1,a1=(y+hy+1)*S+x-hx,b1=(y+hy+1)*S+x+hx+1;
 if(p[b1]-p[b0]-p[a1]+p[a0]===0)r[y*W+x]=1}return r}
function flood(ok,start){const seen=new Uint8Array(W*H),q=new Uint32Array(W*H);let b=0,n=0,at=start[1]*W+start[0];if(!ok[at])return {seen,count:0};seen[at]=1;q[n++]=at;while(b<n){const p=q[b++],x=p%W;for(const [v,test] of [[p-1,x>0],[p+1,x<W-1],[p-W,p>=W],[p+W,p<W*(H-1)]])if(test&&ok[v]&&!seen[v]){seen[v]=1;q[n++]=v}}return {seen,count:n}}
function assess(a,edits,painted){const rep=new Uint8Array(W*H),used=new Uint8Array(W*H),hist={},bad=[],checks={};let overlaps=0,diffs=0;
 for(const v of a)hist[v]=(hist[v]||0)+1;
 for(const [x,y,w,h,id] of edits){if(x<0||y<0||x+w>W||y+h>H||w<1||h<1||!(id in palette))bad.push([x,y,w,h,id]);
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const p=yy*W+xx;if(used[p])overlaps++;used[p]=1;rep[p]=id}}
 for(let i=0;i<a.length;i++)if(a[i]!==rep[i])diffs++;
 for(const [hx,hy] of [[9,7],[11,9],[15,13]]){const ok=legal(a,hx,hy),visit=flood(ok,sites[0][1]),title=(hx*2+1)+'x'+(hy*2+1);
 checks[title]={centres:visit.count,sites:sites.map(([name,xy])=>({name,xy,free:!!ok[xy[1]*W+xy[0]],reachable:!!visit.seen[xy[1]*W+xy[0]]}))}}
 return {hist,bad,overlaps,diffs,checks,edit_count:edits.length,painted}}
const U=n=>[n>>>24&255,n>>>16&255,n>>>8&255,n&255],T=(()=>{const t=new Uint32Array(256);for(let i=0;i<256;i++){let v=i;for(let j=0;j<8;j++)v=v&1?0xedb88320^(v>>>1):v>>>1;t[i]=v>>>0}return t})();
function crc(a){let c=0xffffffff;for(const b of a)c=T[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function adler(b){let a=1,c=0;for(const v of b){a=(a+v)%65521;c=(c+a)%65521}return ((c<<16)|a)>>>0}
function rev(n,k){let v=0;for(let i=0;i<k;i++){v=v<<1|n&1;n>>>=1}return v}
function zlib(data){const o=[0x78,0x01];let b=0,n=0;function bits(v,k){b|=v<<n;n+=k;while(n>=8){o.push(b&255);b>>>=8;n-=8}}
 function sym(c){let v,k;if(c<=143){v=c+48;k=8}else if(c<=255){v=c+256;k=9}else if(c<=279){v=c-256;k=7}else{v=c-88;k=8}bits(rev(v,k),k)}
 const B=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],E=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 function match(len){let i=0;while(i<28&&len>=B[i+1])i++;sym(257+i);bits(len-B[i],E[i]);bits(0,5)}
 bits(1,1);bits(1,2);for(let i=0;i<data.length;){let run=1;while(i+run<data.length&&data[i+run]===data[i]&&run<4096)run++;
 if(run>=4){sym(data[i++]);run--;while(run>=3){const k=min(run,258);match(k);i+=k;run-=k}while(run) {sym(data[i++]);run--}}
 else sym(data[i++])}sym(256);if(n)o.push(b&255);o.push(...U(adler(data)));return Uint8Array.from(o)}
function chunk(name,data){const n=[...name].map(s=>s.charCodeAt(0)),body=Uint8Array.from([...n,...data]);return Uint8Array.from([...U(data.length),...body,...U(crc(body))])}
function png(a,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let j=0;j<h;j++)raw.set(a.subarray((y+j)*W+x,(y+j)*W+x+w),j*(w+1)+1);
 const pal=new Uint8Array(768);for(let i=0;i<256;i++)pal.set(palette[i]||[30,34,43],i*3);
 const parts=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(w),...U(h),8,3,0,0,0])),chunk('PLTE',pal),chunk('IDAT',zlib(raw)),chunk('IEND',new Uint8Array())];
 const o=new Uint8Array(parts.reduce((n,v)=>n+v.length,0));let p=0;for(const v of parts){o.set(v,p);p+=v.length}return o}
function sha256(a){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
 0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
 0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
 0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
 0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
 0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
 0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
 0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 const n=a.length,padded=new Uint8Array(Math.ceil((n+9)/64)*64);padded.set(a);padded[n]=128;
 const bits=n*8;for(let i=0;i<8;i++)padded[padded.length-1-i]=Math.floor(bits/2**(8*i))&255;
 const rot=(v,k)=>(v>>>k)|(v<<(32-k)),w=new Uint32Array(64);
 for(let off=0;off<padded.length;off+=64){
 for(let j=0;j<16;j++){let q=off+j*4;w[j]=(padded[q]<<24)|(padded[q+1]<<16)|(padded[q+2]<<8)|padded[q+3]}
 for(let j=16;j<64;j++){let a=w[j-15],b=w[j-2],s0=rot(a,7)^rot(a,18)^(a>>>3),s1=rot(b,17)^rot(b,19)^(b>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0}
 let [a,b,c,d,e,f,g,v]=h;
 for(let j=0;j<64;j++){let S1=rot(e,6)^rot(e,11)^rot(e,25),ch=(e&f)^((~e)&g),t1=(v+S1+ch+K[j]+w[j])>>>0;
 let S0=rot(a,2)^rot(a,13)^rot(a,22),maj=(a&b)^(a&c)^(b&c),t2=(S0+maj)>>>0;
 v=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}
 for(let j=0;j<8;j++)h[j]=(h[j]+[a,b,c,d,e,f,g,v][j])>>>0;
 }return h.map(v=>v.toString(16).padStart(8,'0')).join('')
}

function fnv(a){let h=2166136261;for(const v of a){h^=v;h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
const crops=[['01-west-landing.png',58,188,370,595],['02-regolith-labs.png',402,371,411,450],['03-rift-transit.png',810,365,474,504],['04-meridian-observatory.png',1287,298,310,535],['05-eastern-freight.png',1601,245,370,580],['06-deep-archive.png',892,808,453,204]];
function build(){const a=plane(),{edits,painted}=pack(a),q=assess(a,edits,painted);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:sites[0][1],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup)+'\n';
 const receipt={schema:1,title:'Eidolon Rift Survey Port',mode:'ORIGINAL / NO REFERENCE',seed:SEED,extent:[W,H],accepted_engine:'de109d0131641d6adc8d25bb9ced7ca3d4991105',setup_loader_blob:'70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9',material_catalogue_blob:'dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3',midge_blob:'228399e38a0e0ab215b9f48698edce67a7a35799',grid_fnv32:fnv(a),grid_sha256:sha256(a),setup_sha256:sha256(Uint8Array.from([...json].map(c=>c.charCodeAt(0)))),repair:repairReceipt,histogram:q.hist,edits:q.edit_count,max_edits:32768,json_bytes:json.length,max_json_bytes:1048576,construction_cell_work:q.painted,max_work_cells:32000000,overlaps:q.overlaps,replay_diffs:q.diffs,invalid_rectangles:q.bad,conservative_midge_clearance:q.checks,sites,native:'NATIVE-UNTESTED',native_bridge_source_rectangles:32768,old_unavailable_bridge_fallback_rectangles:4096};
 const files=[['setup-eidolon-rift.json',json],['qualification.json',JSON.stringify(receipt,null,2)+'\n'],['overview.png',png(a,0,0,W,H)]];for(const [name,x,y,w,h] of crops)files.push([name,png(a,x,y,w,h)]);
 return {a,receipt,files,setup}}
const api={build,plane,pack,legal,flood,assess,crops,png,sites,fnv,W,H,SEED};
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');const output=build(),verify=process.argv.includes('--verify');
 function pngParity(buf,x,y,w,h,plane){let pos=8,dat=[];let ww=0,hh=0,pal=false;
 while(pos<buf.length){const len=buf.readUInt32BE(pos),tag=buf.toString('ascii',pos+4,pos+8),bytes=buf.subarray(pos+8,pos+8+len);
 if(crc(Uint8Array.from([...buf.subarray(pos+4,pos+8),...bytes]))!==buf.readUInt32BE(pos+8+len))throw Error('CRC '+tag);
 if(tag==='IHDR'){ww=bytes.readUInt32BE(0);hh=bytes.readUInt32BE(4);if(bytes[8]!==8||bytes[9]!==3)throw Error('Not indexed 8-bit PNG')}
 if(tag==='PLTE')pal=true;if(tag==='IDAT')dat.push(bytes);pos+=len+12;if(tag==='IEND')break}
 if(ww!==w||hh!==h||!pal)throw Error('PNG dimensions/PLTE');const r=zlib.inflateSync(Buffer.concat(dat));if(r.length!==(w+1)*h)throw Error('PNG inflation size');
 for(let yy=0;yy<h;yy++){if(r[yy*(w+1)])throw Error('Unexpected filter');for(let xx=0;xx<w;xx++)if(r[yy*(w+1)+1+xx]!==plane[(y+yy)*W+x+xx])throw Error('Exact pixel material-ID mismatch')}}
 for(const [name,val] of output.files){const p=path.join(__dirname,name),raw=Buffer.from(val);
 if(verify){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(raw))throw Error('Deterministic mismatch '+name)}
 else fs.writeFileSync(p,raw);
 if(name.endsWith('.png'))pngParity(raw,...(name==='overview.png'?[0,0,W,H]:crops.find(c=>c[0]===name).slice(1)),output.a)}
 const r=output.receipt;
 if(r.edits>32768||r.json_bytes>1048576||r.overlaps||r.replay_diffs||r.invalid_rectangles.length||Object.values(r.conservative_midge_clearance).some(v=>v.sites.some(s=>!s.free||!s.reachable)))throw Error('STATIC-FAIL: see qualification.json');
 console.log(JSON.stringify({status:'STATIC-PASS',verify,edits:r.edits,json_bytes:r.json_bytes,exact_sites:r.conservative_midge_clearance['31x27'].sites.length,pngs:1+crops.length,grid_fnv32:r.grid_fnv32},null,2));
}
return api})()
