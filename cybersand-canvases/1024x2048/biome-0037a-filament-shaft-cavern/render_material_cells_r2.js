#!/usr/bin/env node
/** Exact material-index PNG renderer (8-bit indexed, lossless); no alternate concept art. */
function replayR2(setup) {
  const [w,h]=setup.extent;
  if(w!==1024||h!==2048)throw Error("Canvas extent mismatch");
  const grid=new Uint8Array(w*h);
  for(const e of setup.edits) {
    const [x,y,dx,dy,m]=e;
    if(e.length!==5||x<0||y<0||dx<=0||dy<=0||x+dx>w||y+dy>h||m<0||m>255)throw Error("Invalid rectangle");
    for(let yy=y;yy<y+dy;yy++)grid.fill(m,yy*w+x,yy*w+x+dx);
  }
  return grid;
}
function pngR2(grid, palette, sx,sy,width,height,step) {
  const W=1024,w=width/step,h=height/step,raw=new Uint8Array((w+1)*h);let k=0;
  for(let y=0;y<h;y++) {
    raw[k++]=0;
    for(let x=0;x<w;x++)raw[k++]=grid[(sy+y*step+(step>>1))*W+sx+x*step+(step>>1)];
  }
  let s1=1,s2=0;for(const m of raw){s1=(s1+m)%65521;s2=(s2+s1)%65521;}
  const blocks=[];for(let i=0;i<raw.length;i+=65535){
    const len=Math.min(65535,raw.length-i),b=new Uint8Array(len+5);
    b.set([i+len===raw.length?1:0,len&255,len>>>8,(~len)&255,(~(len>>>8))&255],0);
    b.set(raw.subarray(i,i+len),5);blocks.push(b);
  }
  const z=new Uint8Array(6+blocks.reduce((sum,b)=>sum+b.length,0));
  z[0]=0x78;z[1]=1;let at=2;for(const b of blocks){z.set(b,at);at+=b.length;}
  z.set([s2>>>8,s2&255,s1>>>8,s1&255],at);
  const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
  const tab=Array.from({length:256},(_,i)=>{
    let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;
  });
  function chunk(type,data){
    const b=new Uint8Array(data.length+12);b.set(be(data.length),0);
    for(let i=0;i<4;i++)b[4+i]=type.charCodeAt(i);b.set(data,8);
    let crc=0xffffffff;for(let i=4;i<8+data.length;i++)crc=tab[(crc^b[i])&255]^(crc>>>8);
    b.set(be((crc^0xffffffff)>>>0),data.length+8);return b;
  }
  const plte=new Uint8Array(768);
  for(let id=0;id<256;id++)plte.set(palette[String(id)]||[0,0,0],id*3);
  const chunks=[new Uint8Array([137,80,78,71,13,10,26,10]),
   chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",plte),
   chunk("IDAT",z),chunk("IEND",new Uint8Array())];
  const total=chunks.reduce((sum,b)=>sum+b.length,0),png=new Uint8Array(total);
  at=0;for(const b of chunks){png.set(b,at);at+=b.length;}return png;
}
const CROP_R2=[
 ["filament-shaft-cavern-material-1024x2048.png",0,0,1024,2048,1],
 ["filament-shaft-cavern-preview.png",0,0,1024,2048,2],
 ["filament-shaft-cavern-detail-upper.png",0,35,512,512,1],
 ["filament-shaft-cavern-detail-lamina.png",0,482,512,512,1],
 ["filament-shaft-cavern-detail-shaft.png",320,568,512,512,1],
 ["filament-shaft-cavern-detail-lower.png",360,922,512,512,1],
 ["filament-shaft-cavern-detail-deep.png",0,1320,512,512,1],
 ["filament-shaft-cavern-detail-right.png",512,1300,512,512,1]
];
function renderR2(setup,palette){
  const grid=replayR2(setup);
  return CROP_R2.map(([name,x,y,w,h,step])=>({name,png:pngR2(grid,palette,x,y,w,h,step),bounds:[x,y,w,h],step}));
}
if(typeof process!=="undefined"&&typeof require!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),here=__dirname;
 const setup=JSON.parse(fs.readFileSync(path.join(here,"setup-filament-shaft-cavern.json"),"utf8"));
 const palette=JSON.parse(fs.readFileSync(path.join(here,"palette.json"),"utf8"));
 for(const out of renderR2(setup,palette)){fs.writeFileSync(path.join(here,out.name),Buffer.from(out.png));console.log(out.name,out.png.length,out.bounds,out.step);}
}
