#!/usr/bin/env python3
"""Ferric Pendulum: original high-low bypass roof-tether archipelago material-cell authoring."""
from pathlib import Path
from collections import Counter
from hashlib import sha256
import json, random
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT=Path(__file__).resolve().parent
W,H=2048,1024
SEED=202611202249
R=random.Random(SEED)
# Accepted cybersand MaterialState::Solid + RuleKernel::None subset, source checked 2026-11-20.
AIR,CONCRETE,STEEL,PAINTED,CORRUGATED,STEEL_PIPE,COPPER_PIPE,DARK_GLASS,CABLE,HAZARD,CYAN,MAGENTA,AMBER,LED,MARBLE,BASALT,BRASS=(0,58,62,63,64,68,69,72,74,76,77,78,79,80,98,100,119)
SOLIDS={CONCRETE,STEEL,PAINTED,CORRUGATED,STEEL_PIPE,COPPER_PIPE,DARK_GLASS,CABLE,HAZARD,CYAN,MAGENTA,AMBER,LED,MARBLE,BASALT,BRASS}
im=Image.new('L',(W,H),AIR); d=ImageDraw.Draw(im)

def box(x0,y0,x1,y1,m):
    if x0<x1 and y0<y1:d.rectangle((int(x0),int(y0),int(x1)-1,int(y1)-1),fill=m)
def line(xy,m,width=3): d.line(xy,fill=m,width=width,joint='curve')
def ellipse(bounds,m,width=2): d.ellipse(bounds,outline=m,width=width)
def poly(points,m):d.polygon(points,fill=m)
# Two opposed world anchors, rather than yet another solid panorama background.
box(0,0,W,49,BASALT);box(0,49,W,58,STEEL)
for x in range(0,2048,82):
    box(x,41,x+8,59,CONCRETE)
    box(x+10,49,x+50,53,PAINTED)
# Deep salvage bedrock has an irregular but genuinely traversable silhouette; never powder.
for x in range(W):
    height=945+int(7*np.sin(x/61)+4*np.sin(x/17))
    box(x,height,x+1,H,BASALT)
box(0,940,W,953,CONCRETE)
# Two roof-rooted cantilever docking gates and lower usable apron.
box(46,615,57,944,STEEL);box(55,626,68,642,CYAN)
box(48,646,144,655,STEEL);box(53,654,150,657,HAZARD)
box(1885,667,1897,944,STEEL);box(1834,720,1897,732,PAINTED)
box(1864,731,1892,737,AMBER)

# Different mechanically plausible pods: asymmetric, stepped, and vertically staggered.
PODS=[
 {'name':'Warden Exchange','x0':170,'x1':494,'y0':384,'y1':617,'metal':PAINTED,'accent':AMBER,'motif':'loading'},
 {'name':'Gallows Traction','x0':563,'x1':914,'y0':178,'y1':463,'metal':CORRUGATED,'accent':CYAN,'motif':'drivetrain'},
 {'name':'Crosswind Switch','x0':1012,'x1':1341,'y0':389,'y1':652,'metal':STEEL,'accent':MAGENTA,'motif':'switching'},
 {'name':'Frost Annex','x0':1468,'x1':1818,'y0':235,'y1':509,'metal':PAINTED,'accent':CYAN,'motif':'reclamation'}]

# Hanging trusses: each pair's roof connection is direct, load-bearing cardinal adjacency.
def tether(anchor_x,x,y,accent):
    line([(anchor_x,46),(anchor_x,113),(x,y)],STEEL,9)
    line([(anchor_x+6,48),(anchor_x+6,104),(x+5,y-3)],CABLE,3)
    for yy in range(100,int(y)-30,54):
        # diagonal lacing branches from tether into an adjacent roof-rooted rail, not scenery
        t=(yy-104)/max(1,(y-104)); xx=anchor_x+(x-anchor_x)*t
        line([(int(xx)-7,yy),(int(xx)+8,yy+9)],accent,3)

for k,p in enumerate(PODS):
    x0,x1,y0,y1=[p[z] for z in ('x0','x1','y0','y1')]
    a=p['accent']; m=p['metal']
    tether(x0+22+(k%2)*18,x0+45,y0+4,a)
    tether(x1-24,x1-42,y0+4,a)
    # Sloped side extensions and stepped load decks; upper roof is a fully 2D perpendicular beam.
    box(x0,y0,x1,y0+13,STEEL)
    box(x0+20,y0+13,x1-19,y0+17,a)
    box(x0+8,y1-17,x1-8,y1,CONCRETE)
    # Real inhabited chassis: two continuous top-to-sole load paths and a generous 61-cell inner portal.
    # This keeps fitted machinery physically attached without substituting decorative filled-in space.
    box(x0+55,y0+15,x0+64,y1-15,STEEL)
    box(x1-64,y0+15,x1-55,y1-15,STEEL)
    box(x0+55,y0+108,x0+64,y0+169,AIR)
    box(x0,y1-23,x0+32,y1-5,STEEL);box(x1-32,y1-23,x1,y1-5,STEEL)
    line([(x0,y1-13),(x0+36,y1+13),(x1-39,y1+13),(x1,y1-13)],m,8)
    box(x0+3,y0+15,x0+13,y0+87,STEEL)
    box(x1-13,y0+15,x1-3,y0+86,STEEL)
    box(x0+5,y0+87,x0+14,y0+115,a)
    box(x1-14,y0+86,x1-4,y0+114,a)
    # The two exterior 72-100 cell high portals let Midge enter from either side.
    box(x0+16,y0+38,x1-16,y0+43,m)
    for xx in (x0+76,x1-79):
        box(xx,y0+43,xx+7,y0+88,STEEL)
        box(xx,y0+43,xx+7,y0+57,a)
    # Interior half-height work decks and 1:1 readable equipment, deliberately NOT uniform stamps.
    box(x0+31,y1-66,x1-31,y1-62,m)
    box(x0+30,y1-64,x0+41,y1-17,STEEL)
    box(x1-41,y1-64,x1-30,y1-17,STEEL)
    if k==0: # public customs, clear lower freight staging and distinct hoist receiving
        box(x0+38,y1-52,x0+95,y1-37,BRASS);box(x0+45,y1-76,x0+89,y1-67,AMBER)
        box(x0+123,y1-61,x0+134,y1-18,STEEL)
        box(x0+134,y1-49,x0+221,y1-40,CONCRETE)
        box(x0+143,y1-39,x0+209,y1-30,HAZARD)
        line([(x0+253,y0+16),(x0+253,y1-80)],CABLE,5)
        box(x0+237,y1-86,x0+269,y1-78,STEEL)
    elif k==1: # radial traction, two large nonparallel gimbal hoops and slip rings
        cx=x0+172
        ellipse((cx-90,y0+65,cx+81,y0+196),STEEL,10)
        ellipse((cx-71,y0+84,cx+60,y0+175),a,5)
        line([(cx-84,y0+138),(cx+73,y0+138)],BRASS,8)
        line([(cx,y0+69),(cx,y0+196)],CABLE,6)
        line([(cx,y0+195),(cx,y1-14)],STEEL,9)
        # Deliberate 51x78 opened east service bite through the large annular traction rotor.
        box(cx+46,y0+106,cx+97,y0+184,AIR)
        box(x0+39,y1-60,x0+90,y1-45,BRASS)
        box(x1-91,y1-75,x1-51,y1-63,STEEL_PIPE)
        for j in range(4):box(x1-108+j*14,y1-57,x1-103+j*14,y1-37,CYAN)
    elif k==2: # huge switchboard with contrasting angled conductive bridges
        for i in range(3):
            xx=x0+63+i*79
            box(xx,y1-93,xx+14,y1-22,STEEL)
            box(xx-6,y1-98,xx+20,y1-89,a)
            line([(xx+7,y1-98),(xx+47,y0+55)],COPPER_PIPE,5)
        box(x0+97,y0+58,x1-59,y0+66,BRASS)
        for i in range(7):box(x0+104+i*23,y0+66,x0+111+i*23,y0+78,LED)
    else: # cryoseparation and nested filter tanks
        for i in range(3):
            xx=x0+61+i*83
            box(xx,y1-111,xx+48,y1-26,DARK_GLASS)
            box(xx+5,y1-102,xx+43,y1-95,CYAN)
            box(xx+10,y1-39,xx+39,y1-30,MARBLE)
            box(xx+18,y1-25,xx+24,y1-17,COPPER_PIPE)
        box(x0+61,y1-113,x1-61,y1-107,STEEL_PIPE)
    if k==1:
        # The upper traction rotor hangs from a real roof spindle; 60-cell *lower* passage
        # is an open interior Midge corridor rather than a sealed decorative gimbal.
        line([(cx,y0+14),(cx,y0+76)],STEEL,9)
        box(x0+14,y1-82,x1-70,y1-22,AIR)
    # Crosswind's 62-cell true full-hull operator corridor, interleaved between conductor banks.
    if k==2:
        box(x0+14,y0+108,x1-70,y0+169,AIR)
        # preserve readable service-workface below the traversable route
        box(x0+82,y1-67,x1-85,y1-63,BRASS)
    # Every hanging pod is structurally attached to a roof, not a faux floating PNG mass.

# Large striking *asymmetric* transmission funicular zigzag. Leave navigable voids below.
line([(0,122),(265,153),(625,112),(924,151),(1295,106),(1640,150),(2047,90)],STEEL,7)
line([(0,132),(265,163),(625,122),(924,161),(1295,116),(1640,160),(2047,100)],CABLE,3)
for x,y in ((265,153),(625,112),(924,151),(1295,106),(1640,150)):
    line([(x,y),(x,54)],STEEL,5)
    box(x-21,y-8,x+21,y+9,STEEL)
    box(x-12,y-5,x+12,y+6,AMBER)
# Incomplete counterweighted sky lift / capture hook at the unusual x-gap near 940.
line([(935,57),(945,375),(973,407)],STEEL,10)
line([(945,373),(949,425),(991,444)],BRASS,7)
box(943,405,967,432,HAZARD)

# Rooted below: five deliberately discontinuous salvage shelves with broad free 31x27 transfers.
for i,(left,right,level) in enumerate([(108,323,845),(412,590,823),(775,931,870),(1353,1499,855),(1680,1960,868)]):
    box(left,level,right,level+12,CONCRETE)
    for j in range(left+19,right-16,65):
        line([(j,level+9),(j+11,940)],STEEL,7)
    box(left+11,level-6,left+61,level,HAZARD)
# Distinct ground settlement/repair shop, occupiable with one west and one east doorway.
box(1480,781,1785,793,PAINTED);box(1480,905,1785,918,CONCRETE)
box(1490,793,1500,827,STEEL);box(1490,892,1500,918,STEEL)
box(1770,793,1781,826,STEEL);box(1770,894,1781,916,STEEL)
for x in (1538,1638,1729):
    box(x,793,x+8,817,STEEL)
    box(x+13,881,x+59,894,MARBLE)
    box(x+17,866,x+55,873,BRASS)
box(1575,895,1707,906,STEEL)
line([(1490,815),(1769,815)],CABLE,5)
# Bounded ballast column, broad empty field on both sides for editing and set-pieces.
box(100,859,137,939,STEEL)
box(104,859,133,867,AMBER)
box(1899,878,1935,938,STEEL)
box(1904,875,1931,883,CYAN)

# Helpful small distinct signals attached to real hulls rather than detached floating greebles.
for p in PODS:
    x0,x1,y0,y1=[p[z] for z in ('x0','x1','y0','y1')]
    for xx in range(x0+18,x1-17,27):
        box(xx,y0,xx+8,y0+4,LED if xx%2 else p['accent'])
    for xx in range(x0+46,x1-34,52):
        box(xx,y1-17,xx+20,y1-13,p['accent'])

original=np.array(im,dtype=np.uint8)
# Unattached insignia and crossbars are strictly removed: one connected solid component from roof/floor.
labels,count=ndimage.label(original!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8))
bound=set(int(v) for v in np.unique(np.r_[labels[0],labels[-1],labels[:,0],labels[:,-1]]) if v)
mask=(labels>0)&(~np.isin(labels,list(bound)))
removed=int(mask.sum())
final=original.copy();final[mask]=0
assert final.size==2097152 and set(np.unique(final)).issubset(SOLIDS|{0})
# Re-validate boundary connection after prune.
ll,nn=ndimage.label(final!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8))
assert all(int(v) in set(np.unique(np.r_[ll[0],ll[-1],ll[:,0],ll[:,-1]])) for v in np.unique(ll) if v)

# Canonical row-run/vertical coalescing. This directly encodes the *final* plane, not painter edits.
rects=[];live={}
for y in range(H):
    row=final[y,:]
    edges=np.r_[0,np.flatnonzero(row[1:]!=row[:-1])+1,W]
    now={}
    for u,v in zip(edges[:-1],edges[1:]):
        mat=int(row[u]); x=int(u);wid=int(v-u)
        if mat==0:continue
        key=(x,wid,mat)
        if key in live:
            ix=live[key]; rects[ix][3]+=1;now[key]=ix
        else:
            now[key]=len(rects);rects.append([x,y,wid,1,mat])
    live=now
rects.sort(key=lambda r:(r[1],r[0],r[4]))
assert len(rects)<32768
replay=np.zeros_like(final); touched=np.zeros_like(final,dtype=bool)
for x,y,w,h,m in rects:
    assert not touched[y:y+h,x:x+w].any()
    touched[y:y+h,x:x+w]=True;replay[y:y+h,x:x+w]=m
assert np.array_equal(replay,final)

# Real full-hull central validity and four-neighbour component membership, no snapping.
SITES={
    'Warden west entry':[113,717],'Warden exchange':[314,524],'Warden east hatch':[468,516],
    'Ascending transfer':[551,544],'Traction west access':[585,350],'Traction core':[737,410],
    'Traction east access':[947,543],'Central suspended passage':[955,710],
    'Switch west entry':[1107,527],'Switch operator':[1202,527],'Switch east hatch':[1313,551],
    'Frost west entry':[1586,355],'Frost valves':[1650,355],'Frost east hatch':[1797,384],
    'Western salvage return':[230,779],'Eastern salvage approach':[1417,765],
    'Repair settlement interior':[1632,845],'Southern return':[1098,796],
    'Eastern terminal':[1849,762]}
SPAWN=SITES['Warden west entry']
# Integral image occupancy query: complete 31x27,23x19,19x15 rectangle clearance everywhere.
def free_centres(plane,fw,fh):
    px=fw//2;py=fh//2
    integ=np.pad((plane!=0).astype(np.uint32),((1,0),(1,0))).cumsum(axis=0).cumsum(axis=1)
    good=np.zeros((H,W),dtype=bool)
    counts=integ[fh:,fw:]-integ[:-fh,fw:]-integ[fh:,:-fw]+integ[:-fh,:-fw]
    good[py:H-(fh-py-1),px:W-(fw-px-1)]=(counts==0)
    return good

def routes(plane,fw,fh):
    safe=free_centres(plane,fw,fh)
    sy,sx=SPAWN[1],SPAWN[0]
    assert safe[sy,sx],('spawn',fw,fh)
    groups,n=ndimage.label(safe,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8))
    comp=int(groups[sy,sx])
    problems=[name for name,(x,y) in SITES.items() if not (safe[y,x] and int(groups[y,x])==comp)]
    return {'hull':[fw,fh],'reachable':len(SITES)-len(problems),'total':len(SITES),'errors':problems,'component_centres':int(np.count_nonzero(groups==comp))}
checks=[routes(final,*hull) for hull in ((19,15),(23,19),(31,27))]
assert all(c['reachable']==len(SITES) for c in checks),checks
# Solid central closure alters actual 31x27 navigable space and must retain all named sites.
blocked=final.copy();obstruction=[914,625,156,154];x,y,w,h=obstruction
blocked[y:y+h,x:x+w]=STEEL
blocked_routes=[routes(blocked,*hull) for hull in ((19,15),(23,19),(31,27))]
assert all(c['reachable']==len(SITES)-1 and c['errors']==['Central suspended passage'] for c in blocked_routes),blocked_routes
# Confirm physically obstructed route geometry shrinks component and does not make fake bypass claim.
assert all(a['component_centres']>b['component_centres'] for a,b in zip(checks,blocked_routes))

# Exact canonical Workbench Setup-v2 accepted current main, including opaque versioned policy vector.
policy=[1279479895, 1, 1, -2102023270, 1854385793, 1886533889, 84225930, 1522979054, 582168604, -646713377, -939672877, 868616440, 1977866421, 1930370363, -2119873090, -6981196, 870342995, 1443932351, -1569267145, 11, 3, 1, 0, 8, 2, 0, 12, 2, 0, 16, 2, 0, 20, 2, 0, 21, 2, 0, 24, 2, 0, 30, 2, 0, 32, 2, 0, 33, 2, 0, 36, 2, 0, 0, 0]
setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge','hash':'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96','spawn':SPAWN,'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':1.8}}], 'next_id':2,'selected':1,'edits':rects,'response':'LA-SELECTIVE','liquid_policy':policy,'normalize':False,'rule_radius':2,'source':[],'material':58,'brush':8,'fire':False}
setup_bytes=json.dumps(setup,separators=(',',':')).encode()
assert len(setup_bytes)<=1048576
(ROOT/'setup.json').write_bytes(setup_bytes)

# Preview palette (colorized for legibility); PNG palette indexes are exact accepted material IDs.
COLORS={0:(8,11,18),58:(101,111,123),62:(130,150,165),63:(96,125,148),64:(92,110,127),68:(90,108,123),69:(182,114,66),72:(52,86,115),74:(58,62,81),76:(228,177,54),77:(41,219,226),78:(238,68,193),79:(255,187,59),80:(234,244,248),98:(209,209,207),100:(71,71,83),119:(212,177,109)}
pal=[0]*768
for mid,rgb in COLORS.items():pal[3*mid:3*mid+3]=list(rgb)
CROPS={
 '01-warden-exchange.png':[134,350,530,656],
 '02-gallows-traction.png':[530,155,945,504],
 '03-crosswind-switch.png':[966,350,1390,696],
 '04-frost-annex.png':[1414,204,1852,546],
 '05-salvage-repair.png':[1445,748,1830,952]
}
def png(path,plane):
    pic=Image.fromarray(plane,'P');pic.putpalette(pal);pic.save(ROOT/path,optimize=False,compress_level=9)
png('overview.png',final)
for filename,(l,t,r,b) in CROPS.items():png(filename,final[t:b,l:r])

hist={str(i):int(c) for i,c in enumerate(np.bincount(final.ravel(),minlength=256)) if c}
file_sha={name:sha256((ROOT/name).read_bytes()).hexdigest() for name in ['setup.json','overview.png']+list(CROPS)}
receipt={'builder_seed':SEED,'extent':[W,H],'cells':int(final.size),'grid_sha256':sha256(final.tobytes()).hexdigest(),'setup_sha256':sha256(setup_bytes).hexdigest(),'setup_bytes':len(setup_bytes),'rectangles':len(rects),'work_cells':int(np.count_nonzero(final)),'histogram':hist,'grounded_solids':int(np.count_nonzero(final)),'detached_retained':0,'removed_unconnected_during_build':removed,'sites':SITES,'spawn':SPAWN,'clearances':checks,'physical_obstruction_xywh':obstruction,'obstructed_routes':blocked_routes,'gallery_crops_xyxy':CROPS,'file_sha256':file_sha,'source_contract':{'repo':'techrote/cybersand','main':'de58bf1997ca75825cf3b29e046dc1c1022c45bf','setup_source_blob':'70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9','material_source_blob':'dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3','native_test':'NATIVE-UNTESTED'}}
(ROOT/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'rectangles':len(rects),'json_bytes':len(setup_bytes),'solids':int(np.count_nonzero(final)),'pruned':removed,'route':checks,'obstruction':blocked_routes,'grid_sha':receipt['grid_sha256']},indent=2))
