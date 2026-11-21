#!/usr/bin/env python3
"""Author three deterministic CyberSand Setup-v2 sandbox-play levels.

No screenshots are used as map geometry: all construction is live material-cell data.
"""
from __future__ import annotations
import hashlib, json, math, zipfile, io
from pathlib import Path
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw, ImageFont
def font(size):
 try: return ImageFont.truetype('DejaVuSans-Bold.ttf',size)
 except OSError: return ImageFont.load_default()

OUT = Path(__file__).resolve().parent / '_generated'
OUT.mkdir(exist_ok=True)
W,H=2048,1024
C={'rock':100,'concrete':58,'steel':62,'blue':63,'rust':65,'grate':66,'pipe':68,
'copper':69,'glass':120,'darkglass':72,'frost':121,'cyan':77,'amber':79,
'yellow':76,'wood':81,'oak':46,'brick':57,'thermal':131,'firebrick':104,
'iron':117,'carbon':130,'polymer':128,'quartz':122,'water':3,'sand':2,
'lava':8,'ice':9,'acid':12,'plant':11,'seed':19,'coal':27,'slate':49,'obsidian':101}
RGBA={0:(8,13,24),100:(54,56,61),58:(119,123,128),62:(126,141,153),63:(49,100,119),65:(124,63,43),66:(74,85,93),68:(102,119,129),69:(165,92,54),120:(156,210,220),72:(37,60,76),121:(206,226,232),77:(55,243,228),79:(255,181,46),76:(227,182,47),81:(196,152,92),46:(111,69,40),57:(116,63,54),131:(26,26,29),104:(200,152,98),117:(90,94,100),130:(34,36,41),128:(62,122,180),122:(226,236,244),3:(47,127,210),2:(222,174,76),8:(241,78,31),9:(150,218,239),12:(200,228,48),11:(71,166,79),19:(231,144,191),27:(43,41,45),49:(70,83,99),101:(24,19,32)}
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
MIDGE_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
class Map:
 def __init__(self,name,slug,spawn):
  self.name,self.slug,self.spawn=name,slug,spawn
  self.a=np.zeros((H,W),dtype=np.uint8)
 def box(self,x,y,w,h,mat):
  x,y,w,h=map(round,(x,y,w,h));x1=max(0,x);x2=min(W,x+w);y1=max(0,y);y2=min(H,y+h)
  if x2>x1 and y2>y1: self.a[y1:y2,x1:x2]=mat
 def line(self,x,y,xx,yy,t,mat):
  n=max(1,math.ceil(math.hypot(xx-x,yy-y)/max(2,t*.42)))
  for i in range(n+1):
   k=i/n;self.box(x+(xx-x)*k-t/2,y+(yy-y)*k-t/2,t,t,mat)
 def arc(self,cx,cy,rx,ry,begin,end,t,mat):
  n=max(1,math.ceil(abs(end-begin)*max(rx,ry)/6));x=cx+rx*math.cos(begin);y=cy+ry*math.sin(begin)
  for i in range(1,n+1):
   ang=begin+(end-begin)*i/n;xx=cx+rx*math.cos(ang);yy=cy+ry*math.sin(ang)
   self.line(x,y,xx,yy,t,mat);x,y=xx,yy
 def deck(self,x,xx,y,mat=C['steel']):
  self.box(x,y,xx-x,14,mat);self.box(x,y-3,xx-x,3,C['grate'])
  for p in range(x+30,xx,72):self.box(p,y+12,7,8,C['rust'])
 def rail(self,x,xx,y):
  self.line(x,y-30,xx,y-30,3,C['iron'])
  for p in range(x,xx,55):self.box(p,y-28,4,28,C['iron'])
 def truss(self,x,xx,y,depth=42,mat=C['rust']):
  self.line(x,y,xx,y,7,mat);self.line(x,y+depth,xx,y+depth,7,mat)
  for p in range(x,xx,80):
   self.line(p,y,min(xx,p+80),y+depth,5,mat)
   self.line(min(xx,p+80),y,p,y+depth,4,mat)
 def tower(self,x,y,w,h,interval):
  self.box(x,y,12,h,C['steel']);self.box(x+w-12,y,12,h,C['steel'])
  self.box(x,y,w,15,C['steel']);self.box(x,y+h-13,w,13,C['concrete'])
  for yy in range(y+interval,y+h-26,interval):self.deck(x+12,x+w-12,yy,C['grate'])
  for xx in range(x+25,x+w-48,76):
   self.box(xx,y+29,51,40,C['darkglass']);self.box(xx+7,y+34,36,4,C['cyan'])
 def tank(self,x,y,w,h,liquid,portion):
  dh=math.floor((h-25)*portion)
  self.box(x+9,y+h-12-dh,w-18,dh,liquid)
  self.box(x,y,9,h,C['steel']);self.box(x+w-9,y,9,h,C['steel'])
  self.box(x,y,w,10,C['steel']);self.box(x,y+h-11,w,11,C['steel'])
  for xx in range(x+27,x+w-10,51):self.box(xx,y+4,7,8,C['cyan'])
 def ground(self,profile):
  for (x,y),(xx,yy) in zip(profile,profile[1:]):
   for p in range(x,xx,4):
    top=y+(yy-y)*(p-x)/(xx-x)
    self.box(p,top,4,H-top,C['rock'])
  self.box(0,992,W,32,C['concrete'])
 def cargo(self,x,y,w,h):
  self.box(x,y,w,h,C['rust']);self.box(x+9,y+9,w-18,h-17,C['brick'])
  self.line(x+8,y+9,x+w-10,y+h-8,4,C['steel']);self.line(x+w-10,y+9,x+8,y+h-8,3,C['steel'])
  self.box(x+11,y+10,16,4,C['yellow'])
 def spawn_bubble(self):
  x,y=self.spawn;self.box(x-29,y-29,58,58,0)


def switchyard():
 m=Map('Copperline Switchyard Trials','copperline-switchyard-trials',(385,607));b=m.box;l=m.line
 m.ground([(0,929),(240,920),(470,942),(680,951),(920,965),(1220,958),(1520,931),(1780,924),(2048,936)])
 for x in range(0,2048,158):b(x,974,68,4,C['carbon']);b(x+52,962,18,8,C['rust'])
 for x,xx,y in [(30,333,678),(561,855,783),(1055,1392,668),(1580,2010,727)]:m.deck(x,xx,y);m.rail(x+5,xx-5,y)
 for x,y,xx,yy in [(333,682,562,786),(854,784,1058,669),(1403,668,1583,728)]:
  l(x,y,xx,yy,17,C['steel']);l(x,y-12,xx,yy-12,3,C['yellow'])
 for x,y in [(80,678),(264,678),(650,783),(810,783),(1115,668),(1304,668),(1625,727),(1920,727)]:
  b(x,y+18,14,929-y-18,C['rust']);b(x-24,918,55,9,C['concrete']);l(x+14,y+30,x+77,918,5,C['carbon'])
 m.truss(566,853,802,40);m.truss(1065,1390,686,48,C['steel']);m.truss(1588,2007,744,50)
 for x,y,w,h,t in [(70,400,244,278,89),(1100,381,241,286,91),(1720,419,247,309,97)]:m.tower(x,y,w,h,t)
 l(455,296,1220,296,19,C['steel']);m.truss(455,1214,306,30)
 for x in range(530,1130,88):l(x,296,x+79,335,5,C['carbon']);b(x+12,293,5,42,C['iron'])
 b(833,283,81,64,C['yellow']);b(846,293,52,8,C['carbon'])
 l(849,346,849,598,4,C['iron']);l(897,346,897,598,4,C['iron'])
 b(832,597,80,18,C['rust']);b(856,618,25,50,C['iron']);b(872,661,46,9,C['amber'])
 for x,y,w,h in [(74,621,66,50),(163,623,83,47),(625,732,72,45),(731,728,46,49),(1164,609,73,49),(1764,663,60,56),(1860,667,88,53)]:m.cargo(x,y,w,h)
 m.tank(1381,823,148,108,C['water'],.37);m.tank(1543,830,122,98,C['sand'],.16)
 b(200,870,135,30,C['sand']);b(326,875,69,20,C['sand']);b(1165,886,69,27,C['coal'])
 for x in range(45,1980,77):b(x,941+(x//110%3)*3,19,3,C['slate'])
 for x in range(1600,2011,72):b(x,813,19,20,C['iron']);b(x+6,817,7,5,C['amber'])
 m.spawn_bubble();return m


def spillway():
 m=Map('Tidelock Hydraulic Spillway','tidelock-hydraulic-spillway',(381,622));b=m.box;l=m.line
 m.ground([(0,929),(320,939),(650,941),(1050,963),(1400,962),(1740,947),(2048,928)])
 b(0,872,2048,11,C['concrete'])
 for x in range(35,2000,170):b(x,884,13,95,C['steel']);b(x-12,879,42,7,C['carbon'])
 for x,xx,y in [(32,500,665),(529,1010,711),(1026,1402,667),(1433,2008,706)]:m.deck(x,xx,y);m.rail(x+6,xx-9,y)
 for x,y in [(106,665),(413,665),(605,711),(938,711),(1120,667),(1346,667),(1545,706),(1910,706)]:
  b(x,y+13,16,872-y-13,C['rust']);l(x+15,y+28,x+75,864,6,C['carbon'])
 m.truss(530,1006,729,42);m.truss(1440,2008,725,45)
 m.tower(58,394,270,271,88);m.tower(1060,398,286,269,90)
 m.tank(94,312,285,236,C['water'],.64)
 b(200,547,26,31,C['wood']);b(197,570,58,5,C['yellow']);b(211,575,15,80,C['pipe'])
 m.tank(414,530,170,136,C['water'],.28)
 l(370,523,433,579,8,C['copper'])
 b(628,357,347,18,C['steel']);b(652,376,16,280,C['rust']);b(953,376,16,278,C['rust'])
 for x in range(695,945,54):l(x,378,x+37,648,4,C['rust']);b(x+10,414,13,23,C['glass'])
 m.tank(692,460,220,195,C['water'],.58)
 b(911,477,16,167,C['wood']);b(917,500,8,15,C['amber'])
 m.tank(1162,413,179,243,C['sand'],.31)
 for x in range(1200,1330,40):b(x,409,12,5,C['amber'])
 b(1382,560,20,103,C['carbon'])
 for y in range(582,652,17):b(1383,y,15,7,C['yellow'])
 b(1473,731,13,140,C['steel']);b(1813,731,14,140,C['steel']);b(1473,861,353,12,C['steel'])
 b(1490,796,318,64,C['water']);b(1510,782,62,4,C['cyan'])
 b(1601,722,23,72,C['wood']);b(1625,741,30,12,C['wood']);b(1739,746,14,119,C['steel']);l(1755,739,1755,870,7,C['pipe'])
 b(983,813,65,56,C['lava']);b(980,870,71,7,C['thermal'])
 b(878,815,82,55,C['water']);b(876,868,84,9,C['concrete']);b(958,810,22,62,C['steel'])
 b(55,795,130,42,C['sand']);b(285,837,83,33,C['sand']);b(1150,796,173,64,C['coal'])
 l(1790,421,2012,421,18,C['steel']);m.truss(1790,2012,439,38)
 l(1910,453,1910,682,4,C['iron']);b(1884,681,52,19,C['rust'])
 for x in range(1870,2010,28):b(x,812,13,47,C['brick']);b(x,811,17,3,C['yellow'])
 m.spawn_bubble();return m


def conservatory():
 m=Map('Bloomglass Ruin Conservatory','bloomglass-ruin-conservatory',(120,662));b=m.box;l=m.line
 m.ground([(0,927),(230,923),(452,932),(674,955),(1024,966),(1288,957),(1510,940),(1830,935),(2048,926)])
 for x in range(54,2010,90):b(x,960,39,9,C['carbon']);b(x+10,975,28,4,C['rust'])
 for cx,rx,ry,y in [(352,287,335,716),(1048,330,391,720),(1721,267,316,715)]:
  m.arc(cx,y,rx,ry,math.pi,math.pi*2,9,C['steel']);m.arc(cx,y,rx-20,ry-19,math.pi,math.pi*2,4,C['glass'])
  for i in range(7):
   f=-.78+i*.26;xx=cx+rx*f;yy=y-ry*math.sqrt(1-f*f)
   l(xx,yy,xx,y,4,C['steel']);b(xx-3,yy+20,6,9,C['cyan'])
  b(cx-rx,y-9,18,10,C['rust']);b(cx+rx-19,y-9,19,10,C['rust'])
 for x,xx,y,mat in [(45,641,718,C['iron']),(743,1374,725,C['steel']),(1446,2010,713,C['rust'])]:
  m.deck(x,xx,y,mat);m.rail(x+5,xx-15,y);m.truss(x+7,xx-8,y+19,42)
 for x,y in [(95,718),(515,718),(771,725),(1284,725),(1470,713),(1960,713)]:
  b(x,y+12,17,919-y-12,C['steel']);l(x+17,y+58,x+75,907,5,C['carbon'])
 for x,y,w in [(163,608,187),(408,604,166),(862,619,207),(1120,611,162),(1560,603,173),(1770,605,158)]:
  b(x,y,w,18,C['polymer']);b(x+9,y+18,w-18,9,C['wood'])
  for i in range(7):
   xx=x+10+i*(w-26)/7;b(xx,y-8,15,8,C['plant']);b(xx+4,y-21-(i%3)*6,9,14,C['plant'])
 for x,y,w,h,f in [(88,840,219,88,.50),(357,833,181,93,.35),(1413,826,214,99,.43),(1710,832,195,96,.30)]:m.tank(x,y,w,h,C['water'],f)
 for a,xx,y in [(128,300,805),(385,546,800),(848,1067,820),(1126,1327,824),(1490,1670,811),(1781,1950,813)]:
  b(a,y,xx-a,12,C['rock'])
  for x in range(a+8,xx-10,25):
   b(x,y-8,16,8,C['plant']);b(x+7,y-19-(x%17),9,14,C['plant'])
   if x%3==0:b(x+2,y-20,4,5,C['seed'])
 m.tower(891,530,111,195,72);m.tower(1175,557,113,167,70)
 for x in [78,557,744,1340,1470,1994]:
  l(x,675,x,917,5,C['pipe']);l(x,691,x+30,691,5,C['copper'])
  for y in range(709,894,27):b(x,y,5,7,C['cyan'])
 for x in range(660,733,17):b(x,751,11,46,C['wood'])
 for x in range(1384,1433,13):b(x,755,9,55,C['wood'])
 for cx,cy,rx,ry in [(422,902,80,51),(1005,900,100,57),(1670,900,79,58)]:
  m.arc(cx,cy,rx,ry,math.pi,math.pi*2,7,C['carbon'])
  m.arc(cx,cy,rx-18,ry-10,math.pi,math.pi*2,3,C['amber'])
 for x in range(775,1332,38):b(x,865,16,35,C['plant']);b(x+6,852,9,15,C['plant'])
 for x in range(846,1260,91):b(x,838,18,28,C['quartz'])
 b(1080,881,81,14,C['polymer'])
 for x in range(200,380,22):b(x,541,12,43,C['glass']);b(x+5,545,3,29,C['cyan'])
 for x in range(1539,1750,24):b(x,520,14,49,C['darkglass']);b(x+5,526,5,25,C['amber'])
 m.spawn_bubble();return m

FOCUS={
'copperline-switchyard-trials':'Layered ramps, steel gantries, suspended hoist, cargo piles and two edit-friendly material tanks. Ground and flying traversal.',
'tidelock-hydraulic-spillway':'Elevated water tanks, breakable wooden outlets, a sand hopper, isolated lava-vs-water test bay and lower catchment channels.',
'bloomglass-ruin-conservatory':'Three glasshouse domes, breakable glazing, plant growth beds, lower cisterns and crystalline rootworks. Atmospheric exploration.'}

# Strict compressed source: one material-id value per cell, then row runs coalesced across equal adjacent rows.
def rle(grid):
 runs=[];active={}
 for y in range(H):
  row=grid[y];diff=np.flatnonzero(np.diff(row.astype(np.int16))!=0)+1
  boundaries=[0,*diff,W];next_active={}
  for start,end in zip(boundaries,boundaries[1:]):
   mat=int(row[start]);width=int(end-start)
   if mat==0:continue
   key=(int(start),width,mat)
   if key in active:
    idx=active[key];runs[idx][3]+=1
   else:
    idx=len(runs);runs.append([int(start),y,width,1,mat])
   next_active[key]=idx
  active=next_active
 return runs

def export(m):
 runs=rle(m.a)
 occupied=int(np.count_nonzero(m.a));recovered=sum(w*h for x,y,w,h,mat in runs)
 assert occupied==recovered, (m.slug,occupied,recovered)
 assert len(runs)<=32768, (m.slug,len(runs))
 assert all(x>=0 and y>=0 and w>0 and h>0 and x+w<=W and y+h<=H and mat in RGBA and mat!=10 for x,y,w,h,mat in runs)
 sx,sy=m.spawn
 assert np.count_nonzero(m.a[sy-20:sy+21,sx-20:sx+21])==0, m.slug
 actor=dict(id=1,model='midge',hash=MIDGE_HASH,spawn=list(m.spawn),options=dict(budget=20,mass_multiplier=1,inertia_multiplier=1,thrust_multiplier=1,torque_multiplier=1,boost_multiplier=2))
 setup=dict(version=2,extent=[W,H],actors=[actor],next_id=2,selected=1,edits=runs,response='LA-SELECTIVE',liquid_policy=POLICY,normalize=False,rule_radius=2,source=[],material=2,brush=8,fire=False)
 raw=json.dumps(setup,separators=(',',':'),ensure_ascii=False).encode()
 assert len(raw)<=1024*1024,(m.slug,len(raw))
 (OUT/f'setup-{m.slug}.json').write_bytes(raw)
 palette=np.zeros((256,3),dtype=np.uint8)
 for mat,color in RGBA.items():palette[mat]=color
 rgb=palette[m.a]
 preview=Image.fromarray(rgb).resize((1024,512),Image.Resampling.NEAREST)
 pen=ImageDraw.Draw(preview);pen.ellipse(((sx-23)//2,(sy-23)//2,(sx+23)//2,(sy+23)//2),outline='white',width=2)
 preview.save(OUT/f'preview-{m.slug}.png',optimize=True)
 unique,count=np.unique(m.a,return_counts=True)
 stat=dict(name=m.name,slug=m.slug,width=W,height=H,source_rectangles=len(runs),occupied_cells=occupied,empty_fraction=round((W*H-occupied)/(W*H),4),source_bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest(),material_ids={str(int(x)):int(n) for x,n in zip(unique,count) if x},spawn=[sx,sy],focus=FOCUS[m.slug])
 print(m.name, 'rects',len(runs),'bytes',len(raw),'empty',stat['empty_fraction'])
 return preview,stat

scenes=[switchyard(),spillway(),conservatory()]
views=[];stats=[]
for scene in scenes:
 v,s=export(scene);views.append(v);stats.append(s)
assert len({s['sha256'] for s in stats})==3
art=Image.new('RGB',(1060,1700),(11,20,31));pen=ImageDraw.Draw(art)
pen.text((20,13),'CYBERSAND  /  EX-PLAY-001',fill=(225,234,244),font=font(26))
pen.text((20,51),'Three authored side-elevation material-cell sandbox starts (2048 x 1024)',fill=(139,166,187))
for i,(v,s) in enumerate(zip(views,stats)):
 y=88+i*530;pen.rectangle((10,y,1050,y+520),outline=(39,67,85),width=2)
 pen.text((22,y+9),f'{i+1:02d}  {s["name"].upper()}',fill=(234,240,249),font=font(17))
 art.paste(v,(18,y+40));pen.text((22,y+505),f'{s["source_rectangles"]:,} native records  |  {int(100*s["empty_fraction"])}% open air  |  {s["slug"]}',fill=(159,183,197))
art.save(OUT/'CONTACT-SHEET.png',optimize=True)
receipt=dict(schema_version=1,format='cybersand-setup-v2',qualification='source-layout-only; no actual host/native/GPU acceptance',maps=stats)
(OUT/'qualification.json').write_text(json.dumps(receipt,indent=2)+'\n')
readme='''# CyberSand — EX-PLAY-001 / Three Playable Starting Maps\n\nThese are original **native 2048 × 1024 material-cell starting maps** for the standard CyberSand Shared Workbench (Setup-v2 format), not PNG backgrounds. Each starts with one Midge pilot, broad negative-space traversal routes and real simulated materials.\n\n## First-time installation (Windows)\n\n1. Extract this entire ZIP.\n2. Double-click **INSTALL-EXEMPLARS.cmd**. It places the three source JSON maps in the normal Godot user-data Workbench folder; it does not touch game code or prior saved starts.\n3. Launch CyberSand using **Open CyberSand.cmd**, then choose **Development workbench**.\n4. Type one of the three names below in the starting-map name box and click **Load start**. Resume with **Play**.\n5. Back up your authored starting map before experimenting; these are starting states, not snapshots of evolved physics.\n\n## Map names\n\n- `copperline-switchyard-trials` — Traversal, cranes, cargo, ramps and two material tanks.\n- `tidelock-hydraulic-spillway` — Dams, fluid pressure, removable wooden outlets and water/lava experiments.\n- `bloomglass-ruin-conservatory` — Glass domes, plant growth, fragile bridges, flooded cisterns.\n\nEach map has a matching `preview-*.png` for visual inspection.\n\n## Scope and validation\n\n- All source rectangles are axis-aligned, in bounds, non-overlapping and cover the intended material grid exactly.\n- Each JSON is within the 1 MiB authoring file limit; each record count is within the 32,768 Workbench limit.\n- All materials use existing native IDs; reserved invalid material 10 is never used.\n- Every Midge spawn includes a clear region.\n- These source checks **do not prove** successful Godot/Windows native import, Save/Reopen, physical traversability or GPU performance. Treat the maps as experimental until tested in the actual Windows playtest.\n- Do not merge into any accepted Gold corpus until actual host acceptance.\n\n## Windows game-data location\n\nThe installer uses `%APPDATA%\\Godot\\app_userdata\\Cyber Sand Reference Sandbox\\workbench\\`, the default path for the current Godot project name. The installer refuses to replace existing setup files. If your Godot user-data root was customised, install manually into its actual `user://workbench` folder.\n'''
(OUT/'README.md').write_text(readme)
installer='''@echo off\r\nsetlocal\r\nPowerShell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL-EXEMPLARS.ps1"\r\nif errorlevel 1 pause\r\n'''
(OUT/'INSTALL-EXEMPLARS.cmd').write_bytes(installer.encode('ascii'))
powershell=r'''$ErrorActionPreference = 'Stop'
$target = Join-Path $env:APPDATA 'Godot\app_userdata\Cyber Sand Reference Sandbox\workbench'
if (-not $env:APPDATA -or -not (Test-Path (Join-Path $PSScriptRoot 'qualification.json'))) { throw 'Invalid installer environment or incomplete map package.' }
$names = @('copperline-switchyard-trials','tidelock-hydraulic-spillway','bloomglass-ruin-conservatory')
$receipt = Get-Content (Join-Path $PSScriptRoot 'qualification.json') -Raw | ConvertFrom-Json
foreach ($name in $names) {
    $source = Join-Path $PSScriptRoot ('setup-' + $name + '.json')
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Missing map file: $source" }
    $expected = @($receipt.maps | Where-Object slug -eq $name)
    if ($expected.Count -ne 1) { throw "Invalid map qualification manifest for $name" }
    $actual = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $expected[0].sha256) { throw "Map was corrupted or modified: $name" }
    $data = Get-Content -LiteralPath $source -Raw | ConvertFrom-Json
    if ($data.version -ne 2 -or $data.extent[0] -ne 2048 -or $data.extent[1] -ne 1024) { throw "Not a recognised Setup-v2 map: $name" }
}
New-Item -ItemType Directory -Force -Path $target | Out-Null
foreach ($name in $names) {
    $source = Join-Path $PSScriptRoot ('setup-' + $name + '.json')
    $destination = Join-Path $target ('setup-' + $name + '.json')
    if (Test-Path -LiteralPath $destination) {
        Write-Warning "Preserving existing map $name (not overwriting)."
        continue
    }
    Copy-Item -LiteralPath $source -Destination $destination -ErrorAction Stop
    Write-Host "Installed: $name"
}
Write-Host "Open CyberSand > Development workbench > type a map name > Load start."
Write-Host "Location: $target"
'''
(OUT/'INSTALL-EXEMPLARS.ps1').write_text(powershell)
archive=OUT.parent/'CyberSand-EXPLAY-001-Sandbox-Canvases.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for file in sorted(OUT.iterdir()):z.write(file,arcname=file.name)
print('ZIP',archive,archive.stat().st_size,'bytes')
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert len(z.namelist())==3*2+5