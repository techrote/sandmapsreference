"use strict";
// Deterministic, dependency-free material-ID serialization. Node 22+.
// Rendered PNG indices are the actual CyberSand material IDs, not artistic screenshots.
const B=require("./build.cjs");
const {WIDTH:W,HEIGHT:H}=B;
const PALETTE={0:[6,11,20],49:[65,75,89],58:[75,85,98],62:[115,131,146],63:[143,154,153],66:[97,124,130],68:[84,120,128],77:[10,226,218],79:[246,152,66],80:[236,246,252],100:[52,59,78],101:[32,35,52],120:[79,198,205],121:[164,230,227],122:[116,201,242],129:[41,104,155],130:[53,74,97],131:[179,113,83]};
const PALETTE_BYTES=new Uint8Array(132*3);for(let i=0;i<132;i++)PALETTE_BYTES.set(PALETTE[i]||[127,127,127],i*3);
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]}
function crc(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0}
function chunk(t,d){const b=new Uint8Array(d.length+12);b.set(be(d.length),0);b.set(t.split("").map(x=>x.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b}
function rev(v,n){let r=0;while(n--){r=(r<<1)|(v&1);v>>>=1}return r}
function deflate(raw){
 const out=[120,1];let bits=0,used=0;
 function wr(v,n){bits|=v<<used;used+=n;while(used>=8){out.push(bits&255);bits>>>=8;used-=8}}
 function symbol(s){let code,n;if(s<=143){code=48+s;n=8}else if(s<=255){code=400+s-144;n=9}else if(s<=279){code=s-256;n=7}else{code=192+s-280;n=8}wr(rev(code,n),n)}
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 function run(n){let i=0;while(i<28&&lb[i+1]<=n)i++;symbol(i+257);if(le[i])wr(n-lb[i],le[i]);wr(0,5)}
 wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let n=1;while(i+n<raw.length&&n<258&&raw[i+n]===raw[i])n++;if(n>=4&&i>0&&raw[i-1]===raw[i]){run(n);i+=n}else{symbol(raw[i]);i++}}symbol(256);if(used)out.push(bits&255);
 let s1=1,s2=0;for(let v of raw){s1=(s1+v)%65521;s2=(s2+s1)%65521}out.push(...be(((s2<<16)|s1)>>>0));return new Uint8Array(out)
}
function png(g,x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
 const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",PALETTE_BYTES),chunk("IDAT",deflate(raw)),chunk("IEND",new Uint8Array())];
 const out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0));let p=0;for(let a of parts){out.set(a,p);p+=a.length}return out}
const CROPS=[["01-west-habitat",60,335,505,390],["02-horizon-harp",720,270,590,540],["03-east-spectrograph",1480,225,545,520],["04-subplate-vaults",610,735,805,265],["05-field-stations",104,590,580,330]];
const LIQUID_POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
function make(){
 const {grid,rooted,removed}=B.buildPlane();
 const rects=B.rectangles(grid),hist={},replay=new Uint8Array(W*H);let area=0;
 for(let [x,y,w,h,m] of rects){if(x<0||y<0||w<=0||h<=0||x+w>W||y+h>H||!PALETTE[m])throw Error("invalid rectangle "+[x,y,w,h,m]);hist[m]=(hist[m]||0)+w*h;area+=w*h;for(let yy=y;yy<y+h;yy++){let i=yy*W+x;for(let xx=0;xx<w;xx++){if(replay[i+xx]!==0)throw Error("overlap "+i);replay[i+xx]=m}}}
 for(let i=0;i<grid.length;i++)if(replay[i]!==grid[i])throw Error("pixel replay mismatch "+i);
 if(area!==rooted||rects.length>32768||area>32000000)throw Error("construction budget or unsupported solid");
 const checks=[[19,15],[23,19],[31,27]].map(([w,h])=>{let r=B.countReach(grid,w,h,B.SITES["West arrival"],B.SITES);if(r.bad.length)throw Error("Midge "+JSON.stringify(r.bad));return {hull:[w,h],sites_reached:r.reached,total:Object.keys(B.SITES).length,reachable_centres:r.centres}});
 const obstruct=new Uint8Array(grid);let changed=0;for(let y=775;y<823;y++)for(let x=865;x<929;x++){let i=y*W+x;if(obstruct[i]===0){changed++;obstruct[i]=58}}
 if(changed===0)throw Error("obstruction test does not modify air");
 const detour=B.countReach(obstruct,31,27,B.SITES["West arrival"],B.SITES);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:B.SITES["West arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:LIQUID_POLICY,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);
 if(json.length>1048576||detour.bad.length)throw Error("JSON capacity / obstruction route "+JSON.stringify(detour.bad));
 const images=[["overview",png(grid,0,0,W,H),[0,0,W,H]],...CROPS.map(([name,x,y,w,h])=>[name,png(grid,x,y,w,h),[x,y,w,h]])];
 return {grid,rects,rooted,removed,hist,area,sites:B.SITES,checks,detour:{obstruction:[865,775,64,48],air_converted_to_solid:changed,reached:detour.reached,total:Object.keys(B.SITES).length,centres:detour.centres,bad:detour.bad},setup,json,images};
}
module.exports={make,CROPS,PALETTE};
