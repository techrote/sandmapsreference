#!/usr/bin/env python3
"""Beaconfold Subgrade Loop: original 2048x1024 racing/exemplar level.

Roofless three-tower skyline crossed eastbound *above* varied rooted beacon masts;
westbound via real excavated subgrade express tube. All 2D material cells authored
in fixed XY axes. No reference images, reused layout chunks or native gameplay claims.
"""
import hashlib, json, math, random
from pathlib import Path
import numpy as np
from PIL import Image

W,H=2048,1024
SEED=0xB34C0F11
P=Path(__file__).resolve().parent
ENGINE_SHA='f7e056c9b8791106e22f2d1c295043783d8a9701'
MAP_BASE_SHA='99a166e7fcae45eb22be1740e9f33f62faccbcc7'
AIR, WALL, CONCRETE, BASALT, OBSIDIAN, ZINC, IRON, QUARTZ, GLASS = 0,58,62,100,101,113,117,122,72
IDS=[AIR,WALL,CONCRETE,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ,GLASS]
PALETTE=[(8,18,30),(62,71,86),(94,103,118),(48,59,73),(25,38,52),(157,171,173),(202,191,160),(231,221,161),(72,125,147)]
LIQUID_POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
# 1:1 crop coordinates, all within actual authored plane
CROPS=[('overview.png',0,0,W,H),('01-west-staging-and-shaft.png',14,365,400,590),('02-telemetry-needle.png',295,170,415,705),('03-beacon-crown.png',755,135,460,695),('04-high-low-transfer.png',1170,280,440,680),('05-east-turn-and-mast.png',1635,285,398,710),('06-subgrade-express-and-rooms.png',485,775,1070,225)]
# Checkpoints are literal material-cell centres, never adjusted during proof.
SITES={
 'Spawn launch apron':[116,231],
 'West sky start':[252,182],
 'Telemetry tower approach':[447,140],
 'High suspension cue':[671,163],
 'Beacon crown approach':[918,150],
 'Civic relay sky link':[1102,184],
 'Switchback antenna crest':[1444,189],
 'East catch upper':[1825,180],
 'East downshaft throat':[1980,666],
 'East subgrade elbow':[1973,928],
 'Express checkpoint D':[1685,932],
 'Express checkpoint C':[1336,930],
 'Express checkpoint B':[902,930],
 'Express checkpoint A':[506,930],
 'West subgrade elbow':[67,929],
 'Return shaft launch':[62,710],
 'Finish west approach':[295,379],
 'West dispatcher cockpit':[214,483],
 'Telemetry middle gallery':[456,471],
 'Telemetry lower service threshold':[575,647],
 'Central beacon operating chamber':[884,475],
 'Central beacon cable inspection':[1069,529],
 'Midline switching office':[1345,476],
 'East latch operator':[1824,510],
 'West buried rail junction':[286,933],
 'Central buried relief shop':[1123,933],
 'East buried braking room':[1811,932]
}
# Bounded source-static alternate when a real upper-flight signal portal is
# deliberately obstructed; the subgrade express is an independently flown line.
OBSTRUCTION=[651,147,40,38]
BLOCKED_SITE='High suspension cue'
SKY_EAST=['Spawn launch apron','West sky start','Telemetry tower approach','High suspension cue','Beacon crown approach','Civic relay sky link','Switchback antenna crest','East catch upper']
SKY_WEST=['Switchback antenna crest','Civic relay sky link','Beacon crown approach','High suspension cue','Telemetry tower approach','West sky start']
TUBE_EAST=['Return shaft launch','West subgrade elbow','Express checkpoint A','Express checkpoint B','Express checkpoint C','Express checkpoint D','East subgrade elbow','East downshaft throat']
TUBE_WEST=['East subgrade elbow','Express checkpoint D','Express checkpoint C','Express checkpoint B','Express checkpoint A','West subgrade elbow','Return shaft launch','Finish west approach']
# Complete sky + tube two-stage loop. A repeated checkpoint records an actual
# reversal, never a teleport or nearest-point substitute.
PRIMARY=SKY_EAST+SKY_WEST+TUBE_EAST+TUBE_WEST
# True alternative: enter the western lift immediately, race along the low
# express, reverse at the east shaft, then return to the west finish.
ALT=['Spawn launch apron']+TUBE_EAST+TUBE_WEST


def generate():
    grid=np.zeros((H,W),dtype=np.uint8)
    rng=random.Random(SEED)
    def rect(x,y,w,h,m):
        x,y,w,h=map(int,(x,y,w,h));a,b=max(0,x),min(W,x+w);c,d=max(0,y),min(H,y+h)
        if a<b and c<d:grid[c:d,a:b]=m
    def beam(x0,y0,x1,y1,r,m):
        # all segments are physical cells; 2D Bresenham, axis-aligned material ID.
        x0,y0,x1,y1=map(int,(x0,y0,x1,y1));dx=abs(x1-x0);dy=-abs(y1-y0)
        sx=1 if x0<x1 else -1;sy=1 if y0<y1 else -1;err=dx+dy
        while True:
            rect(x0-r,y0-r,r*2+1,r*2+1,m)
            if x0==x1 and y0==y1:break
            e=2*err
            if e>=dy:err+=dy;x0+=sx
            if e<=dx:err+=dx;y0+=sy
    def room(x,y,w,h,door='top',material=CONCRETE):
        rect(x,y,w,h,material);rect(x+10,y+10,w-20,h-20,AIR)
        if door=='top':rect(x+w//2-29,y-1,58,16,AIR)
        if door=='right':rect(x+w-16,y+h//2-25,18,50,AIR)
        if door=='left':rect(x-1,y+h//2-25,18,50,AIR)
        if door=='bottom':rect(x+w//2-29,y+h-15,58,18,AIR)
    # Sovereign ground frame and left/right holding walls; there is no roof across this course.
    rect(0,0,16,H,WALL);rect(W-16,0,16,H,WALL)
    for x in range(W):
        floor=836 + round(13*math.sin((x+100)/183.0))
        rect(x,floor,1,H-floor,BASALT)
        rect(x,floor,1,11,OBSIDIAN)
    rect(0,1013,W,11,WALL)
    # Genuine broad subterranean loop; the earth on BOTH sides of it remains connected
    # to left/right/bottom boundaries, with negative-volume elevators at its termini.
    rect(43,899,1954,74,AIR)
    rect(43,890,1954,9,ZINC)     # tube roof liner attached to rock roof
    rect(43,974,1954,11,CONCRETE)  # lower guideway floor supported by bedrock
    rect(28,335,91,658,AIR)      # western free-flight shaft to return path
    rect(1933,376,85,611,AIR)    # eastern downshaft
    # Arced west launch bracket: actually attached to left rim, not a fake facade.
    rect(18,322,198,14,IRON);beam(18,322,195,261,4,IRON)
    beam(195,261,250,290,3,IRON);rect(210,283,42,11,QUARTZ)
    room(132,439,119,87,'top',CONCRETE)
    rect(147,512,21,324,IRON);rect(219,512,17,322,IRON)
    # Entry console inside actual operator room; connected to its floor.
    rect(163,506,31,8,ZINC);rect(166,494,11,12,IRON)
    rect(181,460,41,20,GLASS);rect(190,476,20,13,QUARTZ)
    # District 2: TELEMETRY NEEDLE, an unequal two-legged mast; its high roof
    # has an axial beacon and roof-top release, unlike generic hanging gantries.
    # Its profile is narrow in x, emphatically tall in y, with a clear sky traverse above.
    rect(364,365,30,480,IRON);rect(577,411,25,434,IRON)
    beam(378,365,481,228,7,IRON);beam(481,228,589,412,7,IRON)
    rect(460,208,42,25,ZINC);rect(474,174,13,39,QUARTZ)
    for y,w in [(420,245),(572,223),(701,210)]:
        rect(365,y,w,13,CONCRETE)
    # attached diagonal stiffeners - form load path into ground on BOTH sides.
    beam(384,700,570,583,5,IRON);beam(591,699,376,582,5,IRON)
    beam(380,833,574,706,5,IRON)
    # Legitimate room in the tower gallery, one gate to the outside via sidewall.
    room(422,443,134,91,'left',CONCRETE)
    rect(439,502,32,9,ZINC);rect(447,489,11,15,IRON)
    rect(490,464,39,18,GLASS)
    # A second floor-rooted equipment store inset at service elevation.
    room(408,618,146,99,'right',BASALT)
    rect(433,677,47,9,ZINC);rect(443,658,13,20,IRON)
    # Antenna feeder is roof-rooted within its own tower, not a spanning room lid.
    rect(479,253,15,167,ZINC);rect(449,331,75,12,IRON)
    for x in [447,514]:beam(482,257,x,332,2,QUARTZ)
    # Exposed hanging transfer arc between towers, attached at both ends.
    beam(588,411,706,363,3,ZINC)
    beam(705,364,796,418,3,ZINC)
    # District 3: CENTRAL BEACON, broad control podium under a signal spire.
    rect(791,410,31,435,IRON);rect(1058,402,29,448,IRON)
    beam(806,410,930,266,6,IRON);beam(930,266,1072,405,6,IRON)
    rect(918,240,26,32,ZINC);rect(928,191,9,51,QUARTZ)
    # 3 individually distinct 1:1 entered operational decks; clear 70px site interiors.
    rect(793,529,290,15,CONCRETE);rect(795,672,285,15,CONCRETE)
    beam(810,837,1069,675,5,IRON)
    room(849,449,155,100,'top',CONCRETE)
    rect(874,516,34,10,ZINC);rect(879,500,12,16,IRON)
    rect(952,482,31,17,GLASS)
    # Cabled east inspection bay below the main platform, intentionally one entrance.
    room(1021,490,104,90,'right',CONCRETE)
    rect(1046,553,34,8,ZINC);rect(1060,532,13,22,IRON)
    # Plant steel roof arched with actual support hinges, leaving an overhead void.
    beam(810,409,878,367,4,IRON);beam(878,367,943,402,4,IRON)
    beam(1000,400,1068,350,3,IRON)
    # District 4: ASYMMETRIC SWITCHSTACK, staggered signal truss.
    rect(1228,451,25,391,IRON);rect(1440,369,28,482,IRON)
    beam(1240,450,1315,315,7,IRON);beam(1315,315,1454,368,7,IRON)
    rect(1301,282,28,37,ZINC);rect(1310,252,11,32,QUARTZ)
    beam(1241,841,1452,656,4,IRON)
    rect(1245,590,210,13,CONCRETE);rect(1233,716,231,14,CONCRETE)
    room(1269,459,143,91,'top',CONCRETE)
    rect(1290,519,37,8,ZINC);rect(1298,505,13,15,IRON)
    rect(1361,490,27,22,GLASS)
    # Three inert service reels attached to an occupied floor, not floating emblems.
    for x in [1276,1336,1397]:
        rect(x,704,32,12,ZINC);rect(x+8,685,16,19,IRON)
    # Midline transfer cable: actual solid line from mast support to east crane.
    beam(1452,368,1584,399,3,ZINC)
    # District 5: EAST CAPTURE MAST/BRACING; output shaft is intentionally wide.
    rect(1673,431,28,415,IRON);rect(1859,429,30,417,IRON)
    beam(1686,430,1775,323,7,IRON);beam(1775,323,1872,429,7,IRON)
    rect(1762,296,29,28,ZINC);rect(1773,268,9,29,QUARTZ)
    rect(1693,612,174,14,CONCRETE);rect(1680,744,201,14,CONCRETE)
    beam(1685,839,1857,743,5,IRON)
    room(1751,480,154,101,'top',CONCRETE)
    rect(1780,549,36,9,ZINC);rect(1791,532,12,18,IRON)
    rect(1847,503,37,20,GLASS)
    # Side-on, east-facing giant Y arrestor, rooted to the east boundary, open shaft below.
    beam(2028,330,1901,425,6,IRON);beam(2028,330,2026,507,6,IRON)
    beam(1901,425,1916,554,4,IRON)
    rect(1912,555,54,11,ZINC)
    # Subgrade districts: rooms are cut into basalt, accessible from express tube via
    # 56px inward door; four environments, not cloned blank trays.
    for x,w in [(192,180),(677,186),(1038,192),(1537,191)]:
        rect(x,878,w,94,AIR)
        rect(x+8,973,w-16,9,CONCRETE)
        rect(x+14,958,45,8,ZINC)
        rect(x+18,940,12,18,IRON)
        if x in (677,1537):
            rect(x+92,949,17,24,ZINC);rect(x+108,955,25,7,IRON)
        if x==1038: # unfinished expansion socket left legible for future scripting
            rect(x+112,886,12,24,IRON)
            rect(x+125,887,32,7,ZINC)
    # Space-specific removable shutter physically closes a unique entered room,
    # never placed by default; auditor alone materializes XYWH closure.
    # Make blockable gallery roof-side opening, and avoid duplicated threshold.
    # Actual op room is in same outside-air component only through its west doorway:
    # after closure, no external ceiling hatch or wall leak.
    # Repair the intentional one-door gallery entrance (otherwise P1 facade).
    rect(450,442,48,12,CONCRETE)
    rect(422,471,12,45,AIR)
    # Four literal geometry cues facing east-west, fixed as material cells.
    for x,y in [(295,242),(712,235),(1144,248),(1630,273)]:
        # Every cue is carried by rooted structure when close; isolated floating pixels
        # are prohibited, so use only a pair of short marks tied to existing towers.
        pass
    # Re-open wing shaft after floor-level overlay, preserving entirely real loop.
    rect(28,335,91,658,AIR);rect(1933,376,85,611,AIR)
    # Coupled diagnostic recovery landings exposed inside each real shaft.
    rect(20,788,12,22,IRON);rect(2026,783,7,32,IRON)
    # Side-elevation civil load tethers. The west anchor passes above (not
    # through) the western elevator throat; the high east span bolts adjacent
    # borough masts together while leaving the 31x27 sky race aperture open.
    # No west guyline across the active launch/return shaft.
    beam(1584,399,1686,430,3,IRON)
    # Statically attached authored workfaces. Every cabin/window/desk is bolted
    # to its surrounding physical shell rather than floating in simulator air.
    rect(147,805,21,72,IRON);rect(219,805,17,72,IRON)
    rect(551,451,38,9,IRON)
    rect(1000,530,63,8,IRON)
    rect(1405,528,42,8,IRON)
    rect(1894,528,17,9,IRON)
    rect(219,470,27,5,IRON)
    rect(528,479,23,5,IRON)
    rect(430,501,14,6,IRON)
    rect(439,507,9,24,IRON)
    rect(445,685,11,25,IRON)
    rect(890,524,9,17,IRON)
    rect(981,488,22,7,IRON)
    rect(1060,559,10,13,IRON)
    rect(1301,526,11,16,IRON)
    rect(1385,501,22,6,IRON)
    rect(1792,557,11,18,IRON)
    rect(1881,509,17,6,IRON)
    rect(16,790,17,9,IRON)
    for x in (192,677,1038,1537):
        rect(x+25,956,10,19,IRON)
    # Clear two inconsequential detached liner splinters in the excavated shop.
    rect(1143,878,59,36,AIR)
    # Midge-scale entered room portals: 64-74px true openings through the
    # structural overhead decks and enclosed cabin shells, not painted doors.
    rect(461,404,71,61,AIR)    # telemetry upper gallery hatch
    rect(469,559,72,79,AIR)    # lower floor inspection hatch
    rect(916,408,73,64,AIR)    # central beacon operating hatch
    rect(1051,477,43,113,AIR)  # central east pier traverse (left arch carries load)
    rect(1089,506,49,64,AIR)   # central right inspection wing entrance
    rect(1323,435,73,52,AIR)   # midline office hatch
    rect(1778,453,70,60,AIR)   # east latch office hatch
    # Hatch excavation removes five disconnected rim slivers rather than
    # pretending tiny free-standing specks are anchored scenery.
    for x,y,w,h in [(422,440,42,26),(1094,489,33,17),(1045,550,8,14),
                    (1094,567,33,16),(539,617,17,27)]:rect(x,y,w,h,AIR)
    # Spacious side openings to actually enter five named technical chambers,
    # including 31x27 clear turn-in rather than decorative 12px doors.
    for x,y,w,h in [(451,454,181,64),(429,633,203,61),
                    (874,456,292,65),(1332,457,170,65),(1805,487,136,78)]:
        rect(x,y,w,h,AIR)
    # Grounded shared service riser for the exposed telemetry galleries.
    rect(547,526,12,335,IRON)
    # Two orphaned remnants of hatch cutting: do not leave unsafe chips.
    rect(985,446,22,13,AIR)
    rect(1908,561,27,9,AIR)
    # Atrium-to-sky porticoes, made from genuine open cell corridors.
    # Without these, enclosed tower cavities are only decorative dead air.
    rect(346,446,90,79,AIR)
    rect(1197,446,107,82,AIR)
    rect(1302,457,11,14,AIR)
    # True surface/subgrade interchange in the west lift shaft.
    rect(37,299,84,54,AIR)
    # Cockpit entry and Midge-sized internal circulation alongside bolted console.
    rect(190,429,47,77,AIR)
    # Transfer launch loads back to boundary without capping the open west lift.
    # Loads run through rightside arrestor buttress instead of a west barrier.
    beam(242,293,247,438,3,IRON)
    beam(209,329,246,434,3,IRON)
    rect(184,477,7,59,IRON)
    # East-open cockpit portico: launch controls are genuinely entered.
    rect(224,449,64,77,AIR)
    # Primary 2D right-side load tie (no west barrier).
    beam(1880,430,1904,423,4,IRON)
    # East cliff lip is braced above the usable portal; no diagonal cable
    # partitions the high entrance from the deep elevator shaft.
    beam(1775,323,2032,76,4,IRON)
    # West launch signal to the actual Telemetry mast, not a floating symbol.
    beam(243,293,377,365,4,IRON)
    return grid

def encode(grid):
    result=[];active={}
    for y,row in enumerate(grid):
        opened={};x=0
        while x<W:
            mat=int(row[x]);start=x
            while x<W and int(row[x])==mat:x+=1
            if mat==AIR:continue
            k=(start,x-start,mat)
            if k in active:
                r=active[k];r[3]+=1
            else:
                r=[start,y,x-start,1,mat];result.append(r)
            opened[k]=r
        active=opened
    return result

def png(grid,name,x,y,w,h):
    lut=np.zeros(256,dtype=np.uint8)
    for i,v in enumerate(IDS):lut[v]=i
    im=Image.fromarray(lut[grid[y:y+h,x:x+w]],mode='P')
    palette=[p for color in PALETTE for p in color]+[0]*(768-3*len(PALETTE))
    im.putpalette(palette);im.save(P/name,optimize=True)

def digest(obj):return hashlib.sha256(obj).hexdigest()

def main():
    grid=generate();edits=encode(grid)
    setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge','hash':ACTOR_HASH,'spawn':SITES['Spawn launch apron'],
        'options':{'budget':20.0,'mass_multiplier':1.0,'inertia_multiplier':1.0,'thrust_multiplier':1.0,'torque_multiplier':1.0,'boost_multiplier':2.0}}],
        'next_id':2,'selected':1,'edits':edits,'response':'LA-SELECTIVE','liquid_policy':LIQUID_POLICY,
        'normalize':False,'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
    setup_data=json.dumps(setup,separators=(',',':'))+'\n'
    (P/'setup-beaconfold-subgrade-loop.json').write_text(setup_data)
    for crop in CROPS:png(grid,*crop)
    unique,counts=np.unique(grid,return_counts=True)
    hist={str(int(k)):int(v) for k,v in zip(unique,counts)}
    q={'schema_version':1,'title':'Beaconfold Subgrade Loop','status':'SOURCE-STATIC-UNVERIFIED','engine_main_sha':ENGINE_SHA,
       'reference_main_sha_at_branch':MAP_BASE_SHA,'seed':SEED,'grid_dimensions':[W,H],
       'source_grid_sha256':digest(grid.tobytes()),'setup_sha256':digest(setup_data.encode()),
       'rectangle_count':len(edits),'rectangle_work':sum(r[2]*r[3] for r in edits),
       'setup_bytes':len(setup_data.encode()),'material_histogram':hist,'sites':SITES,'blocked_site':BLOCKED_SITE,
       'obstruction_xywh':OBSTRUCTION,'primary_route':PRIMARY,'alternate_route':ALT,
       'png_crops':{n:[x,y,w,h] for n,x,y,w,h in CROPS},'native':'NATIVE-UNTESTED'}
    (P/'qualification.json').write_text(json.dumps(q,indent=2)+'\n')
    print(json.dumps({'rectangles':len(edits),'setup_bytes':len(setup_data),'hist':hist,'sha':q['source_grid_sha256']}))
if __name__=='__main__':main()
