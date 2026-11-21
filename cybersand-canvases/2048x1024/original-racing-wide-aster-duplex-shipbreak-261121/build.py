#!/usr/bin/env python3
"""Aster Duplex Shipbreak, original horizontal two-hull shipbreaking worksite.

Produces a deterministic 2048x1024 actual material grid, minimal lossless
five-integer rectangles, complete Workbench Setup-v2, indexed PNGs and receipt.
No reference-image, previous-map geometry, runtime screenshots or external map inputs.
"""
from pathlib import Path
import hashlib, json, random
import numpy as np
from PIL import Image

W,H=2048,1024
SEED=0xA57E2611
P=Path(__file__).resolve().parent
ENGINE_SHA='d5b0371501eb7ccd32c261f738b4a2612218fbc1'
MAP_BASE_SHA='99a166e7fcae45eb22be1740e9f33f62faccbcc7'
# Inert and solid, explicitly staged by current accepted Godot Workbench schema.
AIR,WALL,STONE,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ,GLASS=0,58,62,100,101,113,117,122,72
IDS=[AIR,WALL,STONE,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ,GLASS]
PALETTE=[(9,17,24),(62,80,88),(93,105,111),(34,49,65),(21,37,51),(150,165,169),(180,185,176),(209,211,175),(79,130,148)]
CROPS=[('overview.png',0,0,W,H),('01-west-breakers.png',34,350,390,520),('02-raised-hull.png',390,375,660,390),('03-suspended-interstice.png',1000,235,235,610),('04-lower-salvage-hull.png',1160,490,570,365),('05-eastern-slip-gate.png',1700,340,330,520),('06-bedrock-vaults.png',850,745,760,260)]
LIQUID_POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'

def generate():
    g=np.zeros((H,W),np.uint8);rng=random.Random(SEED)
    def rect(x,y,w,h,mat):
        x,y,w,h=map(lambda k:int(round(k)),(x,y,w,h));a=max(0,x);b=min(W,x+w);c=max(0,y);d=min(H,y+h)
        if a<b and c<d:g[c:d,a:b]=mat
    def beam(x0,y0,x1,y1,rad,mat):
        dx=abs(x1-x0);dy=-abs(y1-y0);sx=1 if x0<x1 else -1;sy=1 if y0<y1 else -1;err=dx+dy
        while True:
            rect(x0-rad,y0-rad,rad*2+1,rad*2+1,mat)
            if x0==x1 and y0==y1:break
            e=2*err
            if e>=dy:err+=dy;x0+=sx
            if e<=dx:err+=dx;y0+=sy
    def ship(x0,x1,top,belly,holes,deck_hatches,keel_hatches):
        center=(x0+x1)/2;radius=(x1-x0)/2
        for x in range(x0,x1+1):
            u=abs((x-center)/radius)
            roof=round(top+25*u**2)
            keel=round(belly-(belly-top-38)*u**2)
            rect(x,roof,1,max(0,keel-roof),BASALT)
            rect(x,roof,1,6,ZINC)
            rect(x,keel-8,1,8,OBSIDIAN)
        # Profile is an actual side-elevation horizontal hull; box bays are enterable.
        for (a,b) in holes:
            rect(a,top+39,b-a,69,AIR)
        # A clear 49-pixel-high longitudinal cargo/service gangway remains across bays.
        rect(x0+66,top+58,x1-x0-132,49,AIR)
        for h in deck_hatches:rect(h,top-6,55,top+66-(top-6),AIR)
        for h in keel_hatches:rect(h,top+99,62,belly-top-92,AIR)
        # Bilge form: stepped transverse ribs, attached to hull liner.
        for bx in range(x0+80,x1-55,111):
            rect(bx,top+24,8,14,IRON)
            rect(bx+4,top+25,15,6,ZINC)
        # Rooted leading/trailing cutter nose caps, purely material-cell geometry.
        beam(x0+24,top+26,x0+65,top-7,2,IRON)
        beam(x1-24,top+26,x1-65,top-7,2,IRON)
    # Roof load collector and bottom planted bedrock deliberately form two structural roots.
    rect(0,0,W,25,WALL);rect(0,0,18,H,WALL);rect(W-18,0,18,H,WALL)
    for x in range(W):
        floor=870+round(17*np.sin(x/160.0))
        rect(x,floor,1,H-floor,BASALT);rect(x,floor,1,10,OBSIDIAN)
    rect(0,1012,W,12,WALL)
    # West operator district: solid platforms, honest columns to bedrock, open launch face.
    for y,span in [(455,280),(565,300),(674,315)]:rect(56,y,span,13,STONE)
    for x in [70,331]:rect(x,455,13,419,IRON)
    for x in [118,279]:rect(x,567,12,307,IRON)
    rect(67,407,291,14,ZINC);rect(78,420,14,36,IRON);rect(335,418,13,38,IRON)
    for x in [112,172,230,294]:
        rect(x,433,27,21,GLASS);rect(x+7,438,13,11,QUARTZ)
    # Weston-sided angled cutter control signal, not a race-obstructing scenic sail.
    beam(349,446,390,375,3,IRON);beam(390,375,413,409,3,IRON)
    rect(390,371,13,15,QUARTZ)
    # Two distinct roof-rooted heavy shipbreaking gantry rails, offset in altitude.
    for x,drop in [(594,437),(863,437),(1285,547),(1570,547)]:
        rect(x-8,25,17,drop-25,IRON)
        rect(x-22,drop-20,44,11,ZINC)
        beam(x-9,105,x-54,55,3,IRON);beam(x+9,105,x+54,55,3,IRON)
    # A double vessel grammar, not a generic annulus: staged hulls at different heights.
    ship(418,1019,419,587,[(476,578),(592,707),(721,832),(845,965)],[506,909],[745])
    ship(1176,1698,525,733,[(1233,1340),(1358,1462),(1483,1640)],[1246,1568],[1397])
    # First hull engines/rudders: distinctive triangular upper receiver with no platform tops.
    beam(460,407,514,353,3,ZINC);beam(514,353,578,412,3,ZINC)
    rect(500,345,31,12,IRON)
    rect(995,437,27,18,IRON)
    # First hull 3 compartments, each a recoverable / editable vessel room.
    for x in (500,636,874):
        rect(x,532,48,8,ZINC);rect(x+4,526,11,7,IRON)
    # Twin-fork disposal crane in the inter-vessel gap, purposefully leaving an open low lane.
    rect(1080,25,31,312,STONE)
    beam(1093,338,1020,414,4,IRON);beam(1093,338,1164,453,4,IRON)
    rect(1065,347,61,13,ZINC);rect(1087,359,7,86,IRON)
    rect(1053,439,86,39,STONE);rect(1059,445,74,27,GLASS)
    beam(1057,480,1116,507,3,IRON)
    # Lower vessel holds; preserved incomplete/decommissioned bay at the stern.
    for bx in [1275,1420,1530]:
        rect(bx,650,55,9,ZINC);rect(bx+6,644,11,7,IRON)
    # Welded shore conveyors: floor-rooted, but their columns stop below the flight lane.
    for x in [485,925,1282,1590]:
        rect(x-18,846,36,24,STONE);rect(x-5,805,11,41,IRON)
        rect(x-23,799,48,9,ZINC)
    # East compression-gate district and V-shaped salvage catcher, attached to right boundary.
    beam(2015,279,1888,392,6,STONE);beam(2015,279,2019,398,6,STONE)
    rect(1863,381,114,13,ZINC);rect(1883,396,13,63,IRON)
    beam(1893,541,1950,629,5,IRON);beam(1995,542,1950,629,5,IRON)
    rect(1939,624,25,16,QUARTZ)
    beam(1949,635,1949,736,5,IRON)
    rect(1764,490,75,13,STONE);rect(1804,503,12,150,IRON)
    rect(1757,663,94,12,ZINC)
    # Suspended vertical shear-gate signal is side-on with legible wide portal below.
    beam(1744,391,1827,328,4,IRON);beam(1827,328,1858,391,4,IRON)
    rect(1816,321,24,13,QUARTZ)
    # Enclosed and passable excavated basal workrooms, with shafts / usable expansion seams.
    # Carved openings leave 20-40px load-bearing basalt bedrock beneath them.
    for x,y,w,h in [(97,899,240,87),(950,903,237,85),(1371,907,210,81),(1758,899,221,89)]:
        rect(x,y,w,h,AIR)
    for x,y,w,h in [(304,804,61,113),(1088,806,74,125),(1547,808,65,125),(1918,804,71,123)]:
        rect(x,y,w,h,AIR)
    # Deliberate manufacturing stations anchored inside chambers (small footprint).
    for x,y in [(137,946),(1033,944),(1445,945),(1808,944)]:
        rect(x,y,51,8,STONE);rect(x+4,y+8,10,24,IRON);rect(x+38,y+8,10,24,IRON)
        rect(x+12,y-15,24,14,ZINC)
    # Floor-rooted future docking anchors, partly unused (authoring affordances).
    for x in [406,1185,1727]:
        rect(x,845,31,23,STONE);rect(x+8,836,15,9,ZINC)
    # Fine structural identity, never freestanding: racks attached to load-bearing ribs.
    for x,y in [(583,395),(851,396),(1273,493),(1557,504),(1084,332),(1941,625)]:
        rect(x,y,13,7,QUARTZ)
    # STRUCTURAL CONTINUITY: load-bearing ties and bolted feet, not free-floating components.
    # The back-rail bow/stern suspension ties carry separated salvage extremities.
    beam(594,120,444,451,3,IRON);beam(863,120,984,468,3,IRON)
    beam(1285,120,1208,558,3,IRON);beam(1570,120,1670,590,3,IRON)
    # Real vertical section ribs connect the cutter's lower buoyancy compartments to its spine.
    rect(553,448,9,119,IRON);rect(911,444,9,132,IRON)
    rect(1268,550,9,168,IRON);rect(1519,550,9,172,IRON)
    # Floor feet extended into the actual variable bedrock elevation.
    for x in [70,118,279,331]:rect(x,845,12,79,IRON)
    for x in [419,1199,1741]:rect(x,851,10,65,IRON)
    rect(1279,856,12,65,IRON)
    # East gate is shoulder-anchored and the docking shelf is braced to it.
    beam(1995,543,2019,383,4,STONE)
    rect(1801,25,12,515,IRON)
    rect(1806,644,10,32,IRON)
    # The original windows are inset-but-bolted; they must not float across a 1px gap.
    for x in [112,172,230,294]:rect(x+10,451,7,5,IRON)
    # Vault tables and equipment are pinned to chamber basalt below, not left hovering.
    for x in [137,1033,1445,1808]:
        rect(x+4,954,10,50,IRON);rect(x+38,954,10,50,IRON)
        rect(x+16,929,8,20,IRON)
    # Connected upper west signal and bow lifting triangle.
    beam(390,375,347,431,3,IRON)
    beam(514,353,590,423,3,IRON)

    # Controlled, bounded under-hull clearance for west->east + east->west; no decorative-only route.
    # These exact cell voids are deliberately continuous between the vessels.
    rect(382,697,775,81,AIR)
    rect(1158,748,575,76,AIR)
    # 2 high-to-low crossovers, retaining readable solid hull apertures.
    rect(940,515,103,151,AIR)
    rect(1136,590,118,112,AIR)
    # Lower east capture exit into return lane beneath second ship.
    rect(1700,683,314,120,AIR)
    # Entrances to decommissioned cutter are at least 49px across all-body envelopes.
    rect(470,451,62,72,AIR)
    rect(899,452,62,73,AIR)
    # Lower vessel service corridor continuous through its final rooms.
    rect(1237,588,399,49,AIR)
    # Ensure a top hatch and lower plate egress in vessel 2 genuinely lead into air.
    rect(1250,520,54,87,AIR)
    rect(1585,518,55,88,AIR)
    # Small shipbreaking floor tooling anchored at bedrock and never impeding the return racing lane.
    for x in range(540,919,95):
        d=rng.randrange(8,19)
        rect(x,865-d,17,d,BASALT)
    # Final continuity fasteners deliberately installed after cutter-access drilling.
    # They are narrow actual solids, not a display-only decal.
    rect(840,442,11,126,IRON)    # attached ship #1 bilge segment
    rect(1316,543,11,163,IRON)   # upper load rails to ship #2 lower chamber
    rect(1533,546,11,180,IRON)
    rect(911,445,9,118,IRON)
    rect(940,418,24,36,AIR)    # open, not floating, cutter debris seam
    # Explicit accessible Midge-body portals; both hulls remain legible from the side.
    # West shore launch is not a painted fake gate: it opens into the main air basin.
    rect(347,344,132,245,AIR)
    rect(859,515,54,120,AIR)     # aft cutter hold's independent keel escape
    rect(1548,560,91,167,AIR)    # lower hull's optional aft recovery hatch
    rect(1378,514,69,117,AIR)    # entered midship hatch for the third cargo service hold
    # Entered bedrock bays with generous 31x27 full-body turning footprints.
    rect(85,896,288,91,AIR);rect(296,787,114,167,AIR)
    rect(1371,897,244,91,AIR);rect(1510,792,130,168,AIR)
    rect(1758,893,233,96,AIR);rect(1884,788,121,174,AIR)
    # Two exact 1px detached cutter slag specks have no support; don't author them.
    rect(1630,515,10,5,AIR);rect(1635,632,4,4,AIR)
    # A deliberately angled added hoist carries the independently cut forward hold.
    beam(1285,112,1340,551,3,IRON)
    # Midship service aperture reaches both the upper cargo room and lower chase route.
    rect(1390,616,71,130,AIR)
    # Two suspended cutter tips were explicitly scrapped to avoid unstable chips.
    rect(478,406,41,49,AIR);rect(910,442,16,136,AIR)
    return g

def encode(g):
    # Deterministic row runs + vertical coalescing, ordered nonoverlapping XYWH material IDs.
    out=[];active={}
    for y in range(H):
        new={};row=g[y];x=0
        while x<W:
            m=int(row[x]);
            if m==AIR:x+=1;continue
            e=x+1
            while e<W and int(row[e])==m:e+=1
            key=(x,e-x,m)
            if key in active:
                rect=active[key];rect[3]+=1
            else:
                rect=[x,y,e-x,1,m];out.append(rect)
            new[key]=rect;x=e
        active=new
    return out

def png(g,name,x,y,w,h):
    # True single-pixel material-ID indexed PNG, with deterministic fixed palette.
    lut=np.zeros(256,np.uint8)
    for i,v in enumerate(IDS):lut[v]=i
    im=Image.fromarray(lut[g[y:y+h,x:x+w]],'P')
    pal=[v for triple in PALETTE for v in triple]+[0]*(768-3*len(PALETTE))
    im.putpalette(pal)
    im.save(P/name,optimize=True)

def sha(b):return hashlib.sha256(b).hexdigest()
def main():
    g=generate();rects=encode(g)
    setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge','hash':ACTOR_HASH,'spawn':[162,351],
        'options':{'budget':20.0,'mass_multiplier':1.0,'inertia_multiplier':1.0,'thrust_multiplier':1.0,'torque_multiplier':1.0,'boost_multiplier':1.8}}],
        'next_id':2,'selected':1,'edits':rects,'response':'LA-SELECTIVE','liquid_policy':LIQUID_POLICY,
        'normalize':False,'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
    js=json.dumps(setup,separators=(',',':')).encode('utf-8')
    filename='setup-aster-duplex-shipbreak.json';(P/filename).write_bytes(js)
    for a in CROPS:png(g,*a)
    ids,counts=np.unique(g,return_counts=True)
    receipt={'schema_version':1,'map':'Aster Duplex Shipbreak','seed':SEED,'dimensions':[W,H],
        'engine_sha':ENGINE_SHA,'reference_base_sha':MAP_BASE_SHA,'grid_sha256':sha(g.tobytes()),
        'setup_sha256':sha(js),'setup_bytes':len(js),'rectangles':len(rects),
        'construction_work':sum(r[2]*r[3] for r in rects),
        'histogram':{str(int(a)):int(b) for a,b in zip(ids,counts)},
        'total_cells':int(g.size),'source_pngs':[a[0] for a in CROPS],'native_qualification':'NATIVE-UNTESTED'}
    (P/'qualification.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps(receipt,indent=2))
if __name__=='__main__':main()
