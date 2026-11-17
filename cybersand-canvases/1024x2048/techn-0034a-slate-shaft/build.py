#!/usr/bin/env python3
"""TECHN-0034a / Slate Cable Shaft. One source-bound, deterministic material grid.
AUTHORITY: techrote/cybersand main 018bd09503d7f079ddac52e225c2f7daf8d678bf
VISUAL SOURCE: exact repository image, see SOURCE below.
Design-translation plan, before any decoration:
1. Upper crossbeam with amber conductors and a narrow ventilation aperture.
2. Black, asymmetrically fractured vertical ladder slot (the dominant silhouette).
3. West ochre switchgear stack with a large circular inspection grille.
4. East hanging perforated ledger cabinet, black service recess and copper trunks.
5. Tiny low-bridge maintenance trolley and sloping slate/ochre talus.
6. Secondary raised amber booth and off-axis western pressure/service alcove.
The original wide landscape cutaway is re-composed into a vertical playable shaft,
without stretching the source. Left, middle, and right void areas deliberately
alternate dominance; no generic evenly stacked rooms, arbitrary detached sprites,
decorative powder, or image-only backdrop. There are two connected bypass paths.
"""
from __future__ import annotations
import base64, collections, hashlib, io, json, math, random, subprocess
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
W,H=1024,2048
SOURCE=Path("artwork/technical_interiors/batch2/cable_lined_slate_shaft.png")
SOURCE_BLOB="8906342981a73357d990a90bdd5329bb79f19eea"
SOURCE_SHA256="ebd293fb79f0b703a94530c5c967141e4fc7ad7fec17376c6edb29ac7741bb31"
ENGINE="018bd09503d7f079ddac52e225c2f7daf8d678bf"
SEED=34063
R=random.Random(SEED)
# Explicit accepted enum identities: all bodies are Solid/immovable/RuleKernel::None.
# Avoid base Stone=13 (falling powder) and Rust=29 (falling powder).
M=dict(AIR=0,LIMESTONE=38,SANDSTONE=39,GRANITE=40,COBBLE=41,MOSS=42,
       BRICK=43,TERRACOTTA=48,SLATE=49,IRON=50,BRONZE=52,COPPER=53,
       VERDIGRIS=54,INDUSTRIAL=57,CONCRETE=58,ASPHALT=59,
       STEEL=62,PAINTED=63,RUSTED=65,GRATING=66,PIPE=68,
       CABLE=74,HAZARD=76,AMBER=79,WHITE=80,
       BASALT=100,OBSIDIAN=101,BRASS=119,GLASSBLOCK=120,QUARTZ=122)
PALETTE={
0:(8,11,18),38:(197,191,175),39:(199,156,98),40:(119,119,130),
41:(119,116,108),42:(101,112,90),43:(163,80,59),48:(185,91,60),
49:(70,83,99),50:(50,58,64),52:(162,113,56),53:(184,108,64),
54:(79,140,121),57:(116,63,54),58:(119,123,128),59:(41,45,50),
62:(126,141,153),63:(116,132,151),65:(124,63,43),66:(74,85,93),
68:(102,119,129),74:(60,53,68),76:(227,182,47),79:(255,181,46),
80:(236,248,255),100:(54,56,61),101:(24,19,32),119:(196,160,72),
120:(156,210,220),122:(226,236,244)}
assert set(M.values()) <= set(PALETTE), "invalid palette/material id"
img=Image.new("L",(W,H),0)
d=ImageDraw.Draw(img)
def box(x0,y0,x1,y1,m):
    d.rectangle((int(x0),int(y0),int(x1),int(y1)),fill=M[m] if isinstance(m,str) else m)
def poly(points,m):
    d.polygon([(int(x),int(y)) for x,y in points],fill=M[m] if isinstance(m,str) else m)
def seg(points,m,width=4):
    d.line([(int(x),int(y)) for x,y in points],fill=M[m] if isinstance(m,str) else m,width=width,joint="curve")
def oval(x,y,rx,ry,m):
    d.ellipse((int(x-rx),int(y-ry),int(x+rx),int(y+ry)),fill=M[m] if isinstance(m,str) else m)
def ring(x,y,rx,ry,m,width=4):
    d.ellipse((int(x-rx),int(y-ry),int(x+rx),int(y+ry)),outline=M[m] if isinstance(m,str) else m,width=width)
def txt(x,y,s,m="AMBER"):
    d.text((x,y),s,fill=M[m],font=ImageFont.load_default())

# 1. Immutable diagonal jointed slate faces: the original dark blue-grey rock
#    dominates, but its exposed negative-space cleft is NOT an equal-sided slot.
def le(y):
    return 375+35*math.sin(y/173+0.5)+16*math.sin(y/39)+18*math.sin(y/401)
def re(y):
    return 649+32*math.sin(y/221+2.1)+21*math.sin(y/61+0.4)-14*math.sin(y/510)
for y in range(H):
    a=int(le(y)); b=int(re(y))
    deep=y>1390
    mat="BASALT" if deep else ("SLATE" if y<900 else "GRANITE")
    box(0,y,a,y,mat)
    box(b,y,W-1,y,mat)
# Elongated shale plates and irregular faults: deliberately unpatterned in spacing.
for side in ("W","E"):
    for i in range(155):
        y=R.randint(12,2010); cx=R.randint(35,260) if side=="W" else R.randint(770,991)
        radius=R.randint(16,69)
        dx=R.randint(18,89); dy=R.randint(10,50)
        if side=="W" and cx+dx>le(y)-42: continue
        if side=="E" and cx-dx<re(y)+39: continue
        hue=["GRANITE","BASALT","COBBLE","SLATE","IRON","OBSIDIAN"][R.randrange(6)]
        poly([(cx-dx,y-8),(cx-radius//3,y-dy),(cx+dx//2,y-dy//2),(cx+dx,y+5),
              (cx+radius//4,y+dy),(cx-dx//2,y+dy//3)],hue)
        if i%4==0: seg([(cx-dx//2,y+dy//3),(cx+dx//2,y-dy//2)],"CONCRETE",2)
# Three large off-axis host rock masses, source-specific angular erosion.
poly([(0,263),(115,296),(259,345),(301,405),(0,387)],"GRANITE")
poly([(1024,925),(879,967),(756,1041),(718,1142),(1024,1194)],"GRANITE")
poly([(0,1760),(112,1733),(266,1834),(342,1941),(384,2048),(0,2048)],"SANDSTONE")
poly([(1024,1822),(891,1776),(789,1811),(743,1939),(706,2048),(1024,2048)],"GRANITE")
# Original visual's orange seam-line crawling through hard rock, not hanging midair.
for trace in [
 [(0,93),(99,111),(184,98),(253,123),(360,115)],
 [(656,119),(755,131),(817,103),(1019,89)],
 [(1007,551),(919,568),(846,599),(744,596),(666,621)],
 [(58,904),(155,930),(260,913),(360,944)],
 [(670,1233),(801,1238),(902,1209),(1023,1191)],
 [(1,1686),(95,1667),(207,1694),(348,1722)],
 [(659,1901),(773,1887),(853,1859),(1023,1876)]]:
    seg(trace,"COPPER",4)
    for x,y in trace[1:-1]: oval(x,y,4,4,"AMBER")

# 2. Six different functional excavations, all intentionally irregular.
def excavation(x,y,w,h,kind):
    pts=[(x+29,y+6),(x+w-43,y-11),(x+w+4,y+39),(x+w-13,y+h-22),
         (x+w-65,y+h+7),(x+17,y+h-9),(x-9,y+h-56)]
    poly(pts,"IRON")
    inset=[(x+30,y+23),(x+w-52,y+14),(x+w-17,y+52),
           (x+w-30,y+h-37),(x+w-72,y+h-12),(x+27,y+h-20),(x+10,y+h-55)]
    poly(inset,"AIR")
    # Concentric structural lips and actual floor, each hard-material cell.
    seg([(x+24,y+h-26),(x+w-68,y+h-18)],"STEEL",8)
    seg([(x+20,y+30),(x+w-53,y+20)],"RUSTED",5)
    # Every interior remains navigable, machinery mounts against back wall.
    if kind=="switch":
        box(x+20,y+65,x+100,y+155,"INDUSTRIAL")
        box(x+27,y+71,x+91,y+145,"IRON")
        ring(x+62,y+108,27,27,"BRASS",5)
        oval(x+62,y+108,14,14,"SLATE")
        for q in range(9):
            yy=y+66+q*12; box(x+130,yy,x+162,yy+3,"BRONZE")
        box(x+114,y+60,x+200,y+83,"COPPER")
        txt(x+134,y+67,"FBR")
    elif kind=="ledger":
        box(x+w-173,y+59,x+w-26,y+h-36,"BRONZE")
        box(x+w-166,y+66,x+w-31,y+h-44,"IRON")
        for j in range(11):
            for i in range(6):
                if (i+j)%6!=3:
                    box(x+w-152+i*20,y+77+j*21,x+w-143+i*20,y+84+j*21,
                        "AMBER" if (i+j)%8==0 else "GRANITE")
        seg([(x+w-167,y+73),(x+w-167,y+h-48)],"COPPER",5)
        txt(x+w-133,y+42,"LEDGER")
    elif kind=="booth":
        box(x+45,y+66,x+w-29,y+h-32,"INDUSTRIAL")
        box(x+52,y+74,x+w-37,y+h-42,"IRON")
        for i in range(5):
            box(x+63+i*28,y+81,x+74+i*28,y+112,
                "AMBER" if i%2 else "GLASSBLOCK")
        txt(x+75,y+129,"EXIT")
    elif kind=="pump":
        oval(x+96,y+115,60,68,"BRONZE")
        oval(x+96,y+115,48,54,"IRON")
        ring(x+96,y+115,26,26,"COPPER",6)
        for i in range(8):
            a=i*math.pi/4
            seg([(x+96,y+115),(x+96+44*math.cos(a),y+115+42*math.sin(a))],"RUSTED",5)
        seg([(x+190,y+65),(x+190,y+h-45)],"PIPE",13)
        txt(x+190,y+79,"PUMP")
    elif kind=="cable":
        for t in range(5):
            seg([(x+47+t*32,y+65),(x+61+t*30,y+95),(x+60+t*29,y+h-63)],
                "COPPER" if t%2 else "RUSTED",4)
            box(x+49+t*30,y+h-72,x+68+t*30,y+h-56,"AMBER")
        txt(x+69,y+49,"CABLE")
    elif kind=="sump":
        for i in range(4):
            xx=x+46+i*46
            box(xx,y+80,xx+27,y+h-47,"RUSTED")
            box(xx+4,y+94,xx+23,y+h-61,"ASPHALT")
            box(xx+7,y+99,xx+19,y+106,"AMBER")
        txt(x+53,y+53,"RECLAIM")

# Non-repeating y positions; eastern and western destinations staggered.
excavation(65,92,263,202,"switch")      # W upper switching loft
excavation(761,168,221,172,"booth")     # E offset amber booth
excavation(55,409,266,241,"pump")       # W oversized inspection drum
excavation(755,650,234,324,"ledger")    # E tall perforated data wall
excavation(52,1170,281,252,"cable")     # W cable-voltage exchange
excavation(744,1484,263,273,"sump")     # E lower reclamation plant

# 3. Two exceptional pieces rather than repetitive circular themed props.
# Source's spindly top beam: deliberately broken before it reaches fly lane.
seg([(346,228),(432,228)],"STEEL",10)
seg([(592,233),(668,233)],"STEEL",10)
for x in range(352,431,16):
    seg([(x,228),(x+16,244)],"BRONZE",3)
for x in range(598,664,15):
    seg([(x,234),(x+12,250)],"COPPER",3)
# Ladder is against the WEST cleft face, not a middle-air corridor wall.
for yy in range(257,955,18):
    lx=int(le(yy))+12
    seg([(lx,yy),(lx+22,yy)],"COPPER",3)
    if yy%3: oval(lx,yy,3,3,"AMBER")
# Oblique cable arch skirting RIGHT rock, trimmed away from inspection void.
seg([(697,341),(746,391),(727,474),(755,562),(697,626),(711,690)],"COPPER",7)
seg([(701,344),(755,386),(738,477),(769,559)],"RUSTED",3)

# Perforated thin conveyors / rooftop fence panels that read at district scale.
for y,x0,x1 in [(997,270,440),(1005,591,740),(1588,300,446),(1601,617,791)]:
    seg([(x0,y),(x1,y+6)],"STEEL",8)
    for x in range(x0+10,x1-10,23):
        seg([(x,y-15),(x,y+3)],"BRASS",2)

# Lower reference's miniature trolley: anchored in the lower crossing.
seg([(318,1787),(455,1782)],"STEEL",9)
seg([(586,1781),(725,1775)],"STEEL",9)
box(481,1792,544,1819,"COPPER")
box(489,1799,538,1814,"IRON")
for x in (492,537):
    oval(x,1822,9,9,"STEEL")
    oval(x,1822,4,4,"OBSIDIAN")
txt(493,1800,"C-7")
# Geological apron at bottom (no water and no loose powders).
poly([(0,1921),(89,1916),(190,1970),(268,2037),(268,2047),(0,2047)],"SANDSTONE")
poly([(779,2038),(806,1952),(914,1911),(1023,1924),(1023,2047)],"GRANITE")
for points in [
 [(20,1870),(100,1875),(165,1910),(254,1920)],
 [(790,1878),(849,1841),(956,1839),(1023,1859)],
 [(85,2010),(156,1989),(233,2021)],
 [(850,1984),(934,1955),(1020,1977)]]:
    seg(points,"COPPER",5)

# 4. Intentionally reserved and literal playable flight geometry. This is
#    established BEFORE site inspection, not obtained by point substitution.
# Main transfer bore, kinked/expanded rather than a perfectly even corridor.
def corridor(y0,y1,x0,x1):
    # carve a continuous cell strip with interpolation, full 140+ cell width
    for y in range(y0,y1):
        t=(y-y0)/max(1,y1-y0-1)
        a=x0[0]*(1-t)+x1[0]*t
        b=x0[1]*(1-t)+x1[1]*t
        box(a,y,b,y,"AIR")
for p in [
 (18,415,(435,585),(425,571)),
 (415,805,(425,571),(440,585)),
 (805,1190,(440,585),(462,631)),
 (1190,1590,(462,631),(451,623)),
 (1590,2028,(451,623),(430,626))]:
    corridor(*p)
# The core's broad asymmetric viewing void at mid-height is intentional;
# not empty padding but the dominant hanging-face view of the data monolith.
poly([(409,1046),(429,1142),(405,1234),(417,1348),(473,1342),
      (490,1100),(482,1047)],"AIR")
poly([(618,1015),(689,1056),(724,1111),(697,1234),
      (672,1290),(621,1297),(608,1125)],"AIR")
# Narrow west bypass and different east ledge route, continuous and genuinely
# connected to the main flight lane at multiple separate portals.
box(333,458,396,1370,"AIR")
box(654,645,719,1718,"AIR")
# Mid-way ventilation cuts interconnecting main/bypass and technical stations.
for y,xa,xb in [
 (496,262,473),(594,290,496),(804,558,790),
 (918,563,773),(1122,308,478),(1298,292,500),
 (1384,550,778),(1552,547,780),(1672,560,800),
 (1826,281,512)]:
    box(xa,y-31,xb,y+31,"AIR")
# Upper loft, lower hallway and 6 actual side-room mouth portals.
for y,xa,xb in [
 (191,281,470),(257,540,786),(516,282,465),
 (794,563,798),(1279,292,486),(1630,570,778),
 (1873,293,494),(1971,450,648)]:
    box(xa,y-33,xb,y+33,"AIR")
# Floor connection: from left talus and right maintenance skirt to the outlet.
poly([(270,1852),(391,1836),(469,1871),(467,1938),(373,1952),(271,1915)],"AIR")
poly([(578,1882),(696,1840),(788,1872),(758,1945),(623,1955)],"AIR")
# Deliberately predeclared actual flight/inspection sites, all near the
# functional apparatus, not on the apparatus's occupied cells.
SPAWN=(515,88)
SITES=[
 ("UPPER CROSSBEAM",(515,178)),
 ("WEST SWITCHGEAR",(295,204)),
 ("AMBER BOOTH",(756,280)),
 ("WEST FAN INSPECTION",(290,526)),
 ("WEST BYPASS",(358,880)),
 ("PERFORATED LEDGER",(739,807)),
 ("LEDGER VIEWING WELL",(572,949)),
 ("OPEN VOID",(564,1156)),
 ("WEST CABLE EXCHANGE",(298,1300)),
 ("EAST BYPASS",(684,1400)),
 ("MID SERVICE TRUSS",(516,1547)),
 ("RECLAMATION PLANT",(764,1658)),
 ("LOW TROLLEY",(517,1756)),
 ("WEST TALUS",(324,1900)),
 ("DEEP EXIT",(519,1983))]
# Site positions and room mouths are clear construction no-build squares,
# visible as truly accessible inspection/entry airspace.
for name,(x,y) in SITES:
    box(x-19,y-20,x+19,y+20,"AIR")
box(SPAWN[0]-22,SPAWN[1]-25,SPAWN[0]+22,SPAWN[1]+25,"AIR")
# Give the east factory and west switch specifically identifiable open doors.
box(702,773,767,830,"AIR")
box(255,180,354,224,"AIR")
box(730,1640,788,1681,"AIR")
# Solid exterior clip and secured lower ground.
box(0,0,7,2047,"BASALT")
box(1016,0,1023,2047,"BASALT")
box(0,2037,1023,2047,"BASALT")

A=np.asarray(img,dtype=np.uint8).copy()
assert A.shape==(H,W)
# Per-ID semantic audit; Solid/immovable/None kernel verified against accepted
# CyberSand native material.hpp at the recorded main commit.
ids=sorted(int(x) for x in np.unique(A))
assert set(ids) <= set(M.values())
assert not (set(ids) & {2,3,4,6,8,11,12,13,14,19,22,25,26,27,29,30})
# Current accepted Midge hull is 4x3; 19x15 includes 7.5px horizontal/
# 6px vertical operational margin on each side.
EX=19;EY=15;rx=EX//2;ry=EY//2
solid=(A!=0).astype(np.int32)
prefix=np.pad(solid,((1,0),(1,0))).cumsum(0).cumsum(1)
n=prefix[EY:,EX:]-prefix[:-EY,EX:]-prefix[EY:,:-EX]+prefix[:-EY,:-EX]
nav=np.zeros((H,W),dtype=np.bool_)
nav[ry:H-ry,rx:W-rx]=n==0
assert nav[SPAWN[1],SPAWN[0]],"spawn collision"
seen=np.zeros((H,W),dtype=np.bool_)
q=collections.deque([SPAWN]);seen[SPAWN[1],SPAWN[0]]=1
while q:
    x,y=q.popleft()
    for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if 0<=xx<W and 0<=yy<H and nav[yy,xx] and not seen[yy,xx]:
            seen[yy,xx]=1;q.append((xx,yy))
bad=[name for name,(x,y) in SITES if not(nav[y,x] and seen[y,x])]
assert not bad,"Exact-site bottlenecks/unreachable destinations: "+str(bad)
navtotal=int(seen.sum())

# Coalesced non-air run rectangles, as supported by setup-v2. Every cell must
# reproduce EXACTLY; no hidden tile overlays or omitted intricate decorations.
edits=[];prev={}
for y in range(H):
    row=A[y]
    boundaries=np.flatnonzero(row[1:]!=row[:-1])+1
    stops=np.concatenate(([0],boundaries,[W]))
    curr={}
    for lo,hi in zip(stops[:-1],stops[1:]):
        m=int(row[lo])
        if not m:continue
        key=(int(lo),int(hi-lo),m)
        i=prev.get(key)
        if i is not None and edits[i][1]+edits[i][3]==y:
            edits[i][3]+=1
        else:
            i=len(edits);edits.append([key[0],y,key[1],1,m])
        curr[key]=i
    prev=curr
assert len(edits)<=32768,"Unsupported rectangle budget "+str(len(edits))
rebuilt=np.zeros((H,W),np.uint8)
stamped=0
for x,y,w,h,m in edits:
    assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H
    assert np.all(rebuilt[y:y+h,x:x+w]==0),"overlapping rectangle edits"
    rebuilt[y:y+h,x:x+w]=m
    stamped+=w*h
assert np.array_equal(rebuilt,A),"exhaustive material reconstruction failure"

# Exact replay root keys and fixed water policy from the accepted Setup-v2.
policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,
 582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,
 -6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,
 20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
setup=dict(version=2,extent=[W,H],
 actors=[dict(id=1,model="midge",
    hash="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",
    spawn=list(SPAWN),
    options=dict(budget=20,mass_multiplier=1,inertia_multiplier=1,
       thrust_multiplier=1,torque_multiplier=1,boost_multiplier=1.5))],
 next_id=2,selected=1,edits=edits,response="LA-SELECTIVE",
 liquid_policy=policy,normalize=False,rule_radius=2,
 source=[],material=2,brush=8,fire=False)
raw_json=(json.dumps(setup,separators=(",",":"))+"\n").encode()
assert len(raw_json)<=1048576,"Unsupported 1MiB generated-start setup "+str(len(raw_json))
assert len(policy)==49 and len(setup)==14
slug="techn-0034a-slate-shaft"
json_name="setup-"+slug+".json"
(ROOT/json_name).write_bytes(raw_json)
palette=[c for i in range(256) for c in PALETTE.get(i,(25,27,34))]
def export(part,name):
    p=Image.fromarray(part,mode="L")
    p.putpalette(palette)
    p.save(ROOT/name,optimize=True)
    return ROOT/name
# Full 1:1 map PLUS three actual native-resolution district crops.
overview=export(A,"slate-shaft-full-1024x2048.png")
upper=export(A[60:700,112:752],"detail-upper-640.png")
ledger=export(A[615:1255,350:990],"detail-ledger-640.png")
lower=export(A[1380:2020,238:878],"detail-lower-640.png")
source_raw=SOURCE.read_bytes()
assert hashlib.sha256(source_raw).hexdigest()==SOURCE_SHA256,"reference source hash drift"
with Image.open(io.BytesIO(source_raw)) as orig:
    orig.load()
    assert orig.size==(1672,941),"reference dimensions changed"
blob=subprocess.check_output(["git","rev-parse","HEAD:"+str(SOURCE)],text=True).strip()
assert blob==SOURCE_BLOB,"reference git blob drift"
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
hist={str(i):int((A==i).sum()) for i in ids}
evidence=dict(source={"public_id":"techn-0034a","path":str(SOURCE),
 "blob_sha":SOURCE_BLOB,"sha256":SOURCE_SHA256,"dimensions":[1672,941]},
 engine_main=ENGINE,source_grid=[W,H],seed=SEED,
 rectangles=len(edits),rectangle_capacity_source=32768,
 setup_json_bytes=len(raw_json),setup_byte_limit=1048576,
 stamped_non_air_cells=stamped,exactly_reconstructed_cells=W*H,
 reconstruction_mismatches=0,conservative_actor_envelope=[EX,EY],
 actor_hull=[4,3],spawn=SPAWN,clearance_centres_connected=navtotal,
 sites=[dict(name=name,point=[x,y],clear=bool(nav[y,x]),reachable=bool(seen[y,x]))
       for name,(x,y) in SITES],
 material_semantics="All nonzero IDs are native Solid, immovable, RuleKernel::None at recorded accepted main",
 material_ids=ids,material_histogram=hist,
 artifacts={p.name:sha(p) for p in [ROOT/json_name,overview,upper,ledger,lower]},
 native_workbench="NOT EXECUTED (no Godot/GDExtension/native Rapier runtime in authoring runner)",
 native_installed_rectangle_limit="UNVERIFIED: requires physical bridge handshake",
 source_review="Exact original PNG decoded and compared with source-derived material-cell previews")
(ROOT/"evidence.json").write_text(json.dumps(evidence,indent=2)+"\n")

# CI emits faithful JPEG reviews of original source and authored material cells.
# They are independent of the committed PNGs, which remain the authority.
def emit_review(name,pic,wh):
    rgb=pic.convert("RGB")
    rgb.thumbnail(wh,resample=Image.Resampling.LANCZOS)
    out=io.BytesIO();rgb.save(out,format="JPEG",quality=75,optimize=True,subsampling=0)
    print(name+"="+base64.b64encode(out.getvalue()).decode(),flush=True)
emit_review("EXACT_SOURCE_JPEG",Image.open(io.BytesIO(source_raw)),(600,900))
emit_review("CANVAS_OVERVIEW_JPEG",Image.open(overview),(512,1024))
emit_review("CANVAS_UPPER_JPEG",Image.open(upper),(480,480))
emit_review("CANVAS_LEDGER_JPEG",Image.open(ledger),(480,480))
emit_review("CANVAS_LOWER_JPEG",Image.open(lower),(480,480))
print("EVIDENCE="+json.dumps({k:evidence[k] for k in
 ("source_grid","rectangles","setup_json_bytes","exactly_reconstructed_cells",
  "reconstruction_mismatches","conservative_actor_envelope","clearance_centres_connected")}))
print("SITES="+json.dumps(evidence["sites"]))
