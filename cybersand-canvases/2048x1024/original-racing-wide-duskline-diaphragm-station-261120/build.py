#!/usr/bin/env python3
"""Duskline Diaphragm Station — original orthographic, deterministic 2048×1024 CyberSand material-cell environment.
No imported art or previous-map geometry. Python 3.10+ standard library only.
"""
from pathlib import Path
import hashlib, json, math, random, struct, zlib, collections
W,H=2048,1024
ROOT=Path(__file__).resolve().parent
SEED=0xD05C1120
RNG=random.Random(SEED)
AIR=0; HARD=58; STEEL=62; BASALT=100; OBSIDIAN=101; ZINC=113; IRON=117; QUARTZ=122
INERT={HARD,STEEL,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ}
ENGINE='de58bf1997ca75825cf3b29e046dc1c1022c45bf'
MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
PALETTE={0:(9,18,30),58:(98,117,129),62:(156,183,196),100:(41,59,77),101:(29,43,62),113:(197,149,110),117:(151,113,105),122:(193,215,190)}
SITES={
'Start / west ignition':(144,523), 'West braking fin':(308,521), 'Hoist crossing':(487,502),
'Pressure intake':(674,503), 'Upper diaphragm gate':(913,501), 'Upper transfer datum':(1041,500),
'East outlet gate':(1269,503), 'Condenser nose':(1527,520), 'Arrestor approach':(1760,525),
'East capture':(1903,538), 'East descent':(1898,651), 'East return':(1757,704),
'Undercondenser return':(1507,706), 'Return crossflow':(1260,702),
'Countershaft return':(1016,702), 'West service return':(682,705),
'West counterweight return':(403,704), 'West climb':(179,625), 'Finish':(145,522),
'Alternate split':(696,594), 'Lower bypass datum':(1019,619), 'Lower bypass exit':(1307,601),
'West operator room':(233,350), 'Damping control cell':(577,331),
'Diaphragm service interior':(1038,318), 'Cryogenic panel':(1448,330),
'Brake control cupola':(1841,355), 'West underworks vault':(217,864),
'Hoist maintenance shaft':(512,858), 'Central pump vault':(831,864),
'Motor clutch vault':(1134,861), 'Cryo manifold vault':(1488,866),
'East inspection vault':(1790,860)
}
PRIMARY=['Start / west ignition','West braking fin','Hoist crossing','Pressure intake','Upper diaphragm gate','Upper transfer datum','East outlet gate','Condenser nose','Arrestor approach','East capture','East descent','East return','Undercondenser return','Return crossflow','Countershaft return','West service return','West counterweight return','West climb','Finish']
ALTERNATE=['Pressure intake','Alternate split','Lower bypass datum','Lower bypass exit','Condenser nose']
BLOCK=[960,478,126,75]  # XYWH: physically occludes upper transfer datum, not bypass
CROPS=[('01-ignition-lock.png',0,260,470,470),('02-counterweight-hoists.png',360,130,480,470),('03-double-diaphragm.png',760,115,520,530),('04-cryogenic-bellows.png',1240,130,480,500),('05-eastern-arrestor.png',1570,300,478,500),('06-inhabited-service-vaults.png',620,645,730,379)]

def rect(g,x0,y0,x1,y1,m):
    x0=max(0,int(x0));y0=max(0,int(y0));x1=min(W,int(x1));y1=min(H,int(y1))
    if x1<=x0 or y1<=y0:return
    row=bytes([m])*(x1-x0)
    for y in range(y0,y1): g[y*W+x0:y*W+x1]=row

def line(g,x0,y0,x1,y1,thick,mat):
    n=max(abs(x1-x0),abs(y1-y0),1)
    for i in range(n+1):
        x=x0+(x1-x0)*i//n;y=y0+(y1-y0)*i//n
        rect(g,x-thick//2,y-thick//2,x+(thick+1)//2,y+(thick+1)//2,mat)

def frame(g,x,y,w,h,t,mat):
    rect(g,x,y,x+w,y+t,mat);rect(g,x,y+h-t,x+w,y+h,mat)
    rect(g,x,y,x+t,y+h,mat);rect(g,x+w-t,y,x+w,y+h,mat)

def ground(g):
    rect(g,0,784,W,H,BASALT)
    # Severed geological shelves, varied vertical excavations; all are traversable voids at full real-cell scale.
    for x,width,ybottom in [(145,138,952),(448,144,954),(759,147,963),(1054,145,954),(1411,150,962),(1718,153,959)]:
        rect(g,x,743,x+width,ybottom,AIR)
    # Ledge lips, instrumentation and excavated sidewalls, no closed floor slab over the entrances.
    for x,width,_ in [(145,138,952),(448,144,954),(759,147,963),(1054,145,954),(1411,150,962),(1718,153,959)]:
        rect(g,x-14,783,x-4,947,STEEL);rect(g,x+width+4,783,x+width+14,941,STEEL)
        rect(g,x+12,944,x+width-12,951,IRON)
        # Machine-side inspection racks that are actual inert solid cells, not scenery.
        rect(g,x+12,913,x+35,932,ZINC);rect(g,x+width-43,903,x+width-24,931,IRON)
        rect(g,x+36,917,x+width-49,922,QUARTZ)
        for sx in (x+39,x+58,x+77):rect(g,sx,924,sx+5,934,STEEL)
    # Grounded rectangular equipment plinths plus unique supported heads, leave large negative-space voids above.
    for k,(x,w,h) in enumerate([(320,67,34),(615,41,26),(930,62,38),(1260,58,23),(1600,79,31)]):
        rect(g,x,784-h,x+w,795,HARD if k%2 else STEEL)
        rect(g,x+10,770-h,x+w-10,784-h,IRON)
        for dx in range(x+16,x+w-8,19):rect(g,dx,764-h,dx+5,771-h,QUARTZ)
    # Two long, lower pressure-conduit spines in the solid, never obstruct the y690 return.
    for x0,x1 in [(0,740),(1310,2048)]:
        rect(g,x0,975,x1,985,OBSIDIAN)
        for x in range(x0+25,x1-20,67):rect(g,x,975,x+11,991,IRON)

def crown(g):
    rect(g,0,30,W,45,STEEL)
    rect(g,0,43,W,50,IRON)
    # Roof pressure bus, offset double structural rail and riveted conductor mounts.
    rect(g,18,91,2010,99,HARD)
    for x in range(24,2048,112):
        rect(g,x,45,x+10,106,IRON)
        rect(g,x+9,80,x+31,87,ZINC)
    # Four distinct hanging real-machinery modules at different heights and widths.
    modules=[(170,226,278,360,72),(416,179,327,359,64),(1345,212,1574,410,52),(1691,187,1910,437,63)]
    for j,(a,b,c,d,slot) in enumerate(modules):
        for cx in (a+23,c-22): rect(g,cx,98,cx+9,b+17,IRON)
        frame(g,a,b,c-a,d-b,11,STEEL)
        # Main body recessed so that the true entry mouth is >=75 px in width.
        rect(g,a+24,b+19,c-24,b+36,IRON)
        for sx in range(a+37,c-29,32):
            rect(g,sx,b+38,sx+9,b+59,ZINC if j%2 else QUARTZ)
        # Actual through mouth in floor connected to outside main flight chamber.
        mouth=(a+c)//2
        rect(g,mouth-slot//2,d-13,mouth+slot//2,d+1,AIR)
        # Two diagonal load paths to visible shell, neither is a fake 3D top face.
        line(g,a+15,b+18,(a+c)//2,b-18,7,IRON)
        line(g,(a+c)//2,b-18,c-15,b+18,7,IRON)
    # The unique west launch / finish radiator and stern thrust-relief cusp.
    line(g,25,305,124,404,12,STEEL);line(g,124,404,296,404,8,IRON)
    rect(g,62,298,95,314,ZINC)
    for k in range(4):
        rect(g,87+k*25,377,96+k*25,407,QUARTZ)
    # Counterweight angled diaphragms and pulleys in Hoist district.
    line(g,386,182,485,385,17,STEEL)
    line(g,704,193,614,379,14,STEEL)
    line(g,485,385,614,379,7,IRON)
    for cx,cy,r in [(465,311,26),(646,302,33)]:
        for dy in range(-r,r+1):
            outer=int(math.sqrt(max(0,r*r-dy*dy)))
            inner=int(math.sqrt(max(0,(r-10)*(r-10)-dy*dy))) if abs(dy)<=r-10 else 0
            rect(g,cx-outer,cy+dy,cx-inner,cy+dy+1,IRON)
            rect(g,cx+inner,cy+dy,cx+outer+1,cy+dy+1,IRON)
    # Industrial route-choice marks physically supported by central overhead bus shell.
    for x in (694,735):
        rect(g,x,96,x+7,399,IRON)
        rect(g,x-18,385,x+23,395,QUARTZ)
    # Central paired offset pressure diaphragms: hollow rectangular machinery, not a scenic 3D graphic.
    for (x,y,w,h,t) in [(807,208,211,218,16),(1008,169,206,248,17)]:
        for cx in (x+32,x+w-32):rect(g,cx,98,cx+11,y+16,IRON)
        frame(g,x,y,w,h,t,STEEL)
        # Pressure plate / real gasket grids; openings in the lower rim make chambers fly-enterable.
        rect(g,x+26,y+35,x+w-26,y+48,IRON)
        for q in range(x+40,x+w-28,34):
            rect(g,q,y+61,q+7,y+90,QUARTZ)
            rect(g,q+5,y+95,q+9,y+119,ZINC)
        rect(g,x+w//2-39,y+h-19,x+w//2+39,y+h+1,AIR)
    # This overhead bridge's two offset transverse bars define the interlocking functional silhouette.
    line(g,850,235,1183,201,9,IRON)
    line(g,843,359,1162,328,7,ZINC)
    for x in range(861,1165,57):line(g,x,221,x+12,336,4,QUARTZ)
    # Main central service room coordinate 1038,318 is inside the right frame;
    # provide an unambiguous 76-cell exterior mouth under its bottom edge.
    rect(g,1004,396,1080,432,AIR)
    # Main high-speed overhead collision-safe corridor remains below all d=430 machinery.
    # Distinctive east lateral pressure baffles / conduit (not repeated trays).
    line(g,1300,200,1369,433,12,STEEL)
    line(g,1597,202,1538,428,12,STEEL)
    line(g,1370,400,1538,400,11,IRON)
    rect(g,1417,341,1473,388,OBSIDIAN)
    rect(g,1428,350,1461,382,QUARTZ)
    rect(g,1439,382,1450,400,ZINC)
    # Eastern braking crescent formed by a sided V collar and founded safety pylons.
    line(g,1748,305,1849,448,13,STEEL)
    line(g,1849,448,1989,288,13,STEEL)
    rect(g,1840,429,1859,454,IRON)
    for x in [1781,1867,1950]:
        rect(g,x,99,x+8,289,IRON)
        rect(g,x-12,281,x+19,292,ZINC)
    # Keep a deliberate 180-pixel vertical capture corridor x1820-1940 at y500..730.
    rect(g,1810,749,1978,767,HARD)
    for x in [1828,1957]:rect(g,x,749,x+12,785,STEEL)
    # Functional grounded release head visible near eastern lower return.
    rect(g,1911,769,1940,791,IRON)
    rect(g,1918,763,1934,773,QUARTZ)

def build_cells():
    g=bytearray(W*H)
    ground(g);crown(g)
    rect(g,0,0,9,H,HARD);rect(g,2039,0,W,H,HARD)
    # Equidistant routing beacons are attached to actual roofs or plinths, not floating background sprites.
    for j,x in enumerate((345,783,1282,1699)):
        rect(g,x,96,x+8,364+(j%2)*30,IRON)
        rect(g,x-18,350+(j%2)*30,x+24,364+(j%2)*30,QUARTZ)
        rect(g,x-11,356+(j%2)*30,x+12,361+(j%2)*30,ZINC)
    # The operator chambers exist at the full material-cell scale, rather than as decorative labels.
    # Cut mouths into hanging shells at specified work-station X; a broad leading shelf gives clearance.
    for x0,x1,y in [(190,277,347),(540,619,327),(1398,1494,325),(1801,1883,354)]:
        rect(g,x0,y-15,x1,y+23,AIR)
    # Reinstall small grounded instruments on walls well outside the conservative Midge envelopes.
    for x,y in [(165,342),(420,305),(1315,341),(1731,329)]:
        rect(g,x,y,x+15,y+17,QUARTZ)
    # Preserve authored route geometry; clear only the intended one-cell-radius traffic centreline plus
    # a 17-24-cell hull margin. Mechanical teeth and real shells survive outside the corridors.
    guide=[(144,523),(308,521),(487,502),(674,503),(913,501),(1041,500),(1269,503),(1527,520),(1760,525),(1903,538),(1898,651),(1757,704),(1507,706),(1260,702),(1016,702),(682,705),(403,704),(179,625),(145,522)]
    alternate=[(674,503),(696,594),(1019,619),(1307,601),(1527,520)]
    for path in (guide,alternate):
        for (x0,y0),(x1,y1) in zip(path,path[1:]):
            n=max(abs(x1-x0),abs(y1-y0),1)
            for s in range(n+1):
                x=x0+(x1-x0)*s//n;y=y0+(y1-y0)*s//n
                rect(g,x-19,y-17,x+20,y+18,AIR)
    # Restore collision-free service access from air in the main void through genuine gates.
    for name in ('West operator room','Damping control cell','Diaphragm service interior','Cryogenic panel','Brake control cupola'):
        x,y=SITES[name]
        # Service access from below: 37px minimum physical passage width (conservative hull 31px).
        rect(g,x-20,y-20,x+21,487,AIR)
    for name in ('West underworks vault','Hoist maintenance shaft','Central pump vault','Motor clutch vault','Cryo manifold vault','East inspection vault'):
        x,y=SITES[name]
        rect(g,x-21,741,x+22,y+20,AIR)
    # Ground / roof support law: retain only solids connected orthogonally to a canvas boundary.
    active=bytearray(W*H); q=collections.deque()
    for x in range(W):
        for y in (0,H-1):
            i=y*W+x
            if g[i] and not active[i]:active[i]=1;q.append(i)
    for y in range(H):
        for x in (0,W-1):
            i=y*W+x
            if g[i] and not active[i]:active[i]=1;q.append(i)
    while q:
        i=q.popleft();x=i%W
        for j in (i-W if i>=W else -1,i+W if i<W*(H-1) else -1,i-1 if x else -1,i+1 if x<W-1 else -1):
            if j>=0 and g[j] and not active[j]:active[j]=1;q.append(j)
    pruned=0
    for i,v in enumerate(g):
        if v and not active[i]:g[i]=0;pruned+=1
    return g,pruned

def encode(g):
    edits=[];active={}
    for y in range(H):
        x=0;new={}
        while x<W:
            v=g[y*W+x];s=x
            while x<W and g[y*W+x]==v:x+=1
            if not v:continue
            key=(s,x-s,v)
            if key in active:
                idx=active[key];edits[idx][3]+=1
            else:
                idx=len(edits);edits.append([s,y,x-s,1,v])
            new[key]=idx
        active=new
    return edits

def replay(edits):
    out=bytearray(W*H); overlaps=0
    for x,y,w,h,m in edits:
        assert m in INERT and w>0 and h>0 and 0<=x<x+w<=W and 0<=y<y+h<=H
        for yy in range(y,y+h):
            off=yy*W+x;chunk=out[off:off+w]
            overlaps+=sum(v!=0 for v in chunk)
            out[off:off+w]=bytes([m])*w
    return out,overlaps

def png_bytes(g,x,y,w,h):
    raw=b''.join(b'\0'+g[(y+j)*W+x:(y+j)*W+x+w] for j in range(h))
    pal=bytearray(256*3)
    for mid,rgb in PALETTE.items():pal[mid*3:mid*3+3]=bytes(rgb)
    def chunk(tag,data):return struct.pack('>I',len(data))+tag+data+struct.pack('>I',zlib.crc32(tag+data)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,3,0,0,0))+chunk(b'PLTE',pal)+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')

def main():
    g,pruned=build_cells();edits=encode(g)
    full,overlap=replay(edits)
    assert full==g and overlap==0
    hist={str(mid):g.count(mid) for mid in sorted(set(g))}
    assert set(g)<=({0}|INERT)
    source_sha=hashlib.sha256(g).hexdigest()
    setup={'version':2,'extent':[W,H],
         'actors':[{'id':1,'model':'midge','hash':MODEL_HASH,'spawn':list(SITES['Start / west ignition']),
                    'options':{'budget':20.0,'mass_multiplier':1.0,'inertia_multiplier':1.0,'thrust_multiplier':1.0,'torque_multiplier':1.0,'boost_multiplier':1.8}}],
         'next_id':2,'selected':1,'edits':edits,'response':'LA-SELECTIVE','liquid_policy':POLICY,'normalize':False,'rule_radius':2,'source':[], 'material':2,'brush':8,'fire':False}
    blob=json.dumps(setup,ensure_ascii=True,separators=(',',':')).encode()
    assert len(edits)<=32768 and len(blob)<=1024*1024 and sum(w*h for _,_,w,h,_ in edits)<=32000000
    (ROOT/'setup-duskline-diaphragm-station.json').write_bytes(blob)
    pngs=[('overview.png',0,0,W,H)]+CROPS
    png_manifest={}
    for filename,x,y,w,h in pngs:
        b=png_bytes(g,x,y,w,h)
        (ROOT/filename).write_bytes(b)
        png_manifest[filename]={'source_box':[x,y,w,h],'sha256':hashlib.sha256(b).hexdigest(),'width':w,'height':h,'pixel_count':w*h}
    result={'schema':'original-landscape-racing-wide-source-static-v1','title':'Duskline Diaphragm Station','seed':SEED,
            'engine_authority_sha':ENGINE,'map_parent_main_sha':'99a166e7fcae45eb22be1740e9f33f62faccbcc7',
            'extent':[W,H], 'total_cells':len(g),'grid_sha256':source_sha,'setup_sha256':hashlib.sha256(blob).hexdigest(),
            'setup_bytes':len(blob),'rectangle_count':len(edits),'construction_work_cells':sum(w*h for _,_,w,h,_ in edits),
            'overlaps':overlap,'replay_mismatches':sum(a!=b for a,b in zip(g,full)),
            'histogram':hist,'detached_design_candidates_pruned':pruned,'detached_final_solids':0,
            'inert_materials':sorted(INERT),'uncontained_liquid_count':0,'falling_mobile_reactive_count':0,
            'sites':{k:list(v) for k,v in SITES.items()},'primary_route':PRIMARY,'alternate_route':ALTERNATE,
            'obstruction_xywh':BLOCK,'pngs':png_manifest,'native_status':'NATIVE-UNTESTED','review_status':'independent Art/Tech/Shepherd pending'}
    (ROOT/'qualification.json').write_text(json.dumps(result,indent=2)+'\n')
    print('GRID',source_sha,'RECTANGLES',len(edits),'JSON',len(blob),'PRUNED',pruned,'HIST',hist)
if __name__=='__main__':main()
