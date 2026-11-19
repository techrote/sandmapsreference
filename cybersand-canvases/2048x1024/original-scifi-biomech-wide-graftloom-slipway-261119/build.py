"""ORIGINAL-NO-SOURCE: The Graftloom Slipway, deterministic true material-cell constructor.
Run python3 build.py [output-dir]. Pure Python 3 standard library; no external imagery.
"""
import collections, hashlib, json, math, os, pathlib, random, struct, sys, zlib
W, H = (2048, 1024)
SEED = 19112647
R = random.Random(SEED)
M = {0: (8, 11, 18), 49: (70, 83, 99), 58: (119, 123, 128), 62: (126, 141, 153), 100: (54, 56, 61), 101: (24, 19, 32), 113: (152, 162, 168), 117: (90, 94, 100), 120: (156, 210, 220), 122: (226, 236, 244), 123: (152, 232, 94), 128: (62, 122, 180)}
ID = {'slate': 49, 'concrete': 58, 'steel': 62, 'basalt': 100, 'obsidian': 101, 'zinc': 113, 'iron': 117, 'glass': 120, 'quartz': 122, 'bio-glass': 123, 'polymer': 128}
A = bytearray(W * H)

def box(x0, y0, x1, y1, m):
    x0 = max(0, int(x0))
    y0 = max(0, int(y0))
    x1 = min(W, int(x1))
    y1 = min(H, int(y1))
    if x0 >= x1 or y0 >= y1:
        return
    fill = bytes([m]) * (x1 - x0)
    for y in range(y0, y1):
        A[y * W + x0:y * W + x1] = fill

def poly(pts, m):
    y0 = max(0, math.floor(min((p[1] for p in pts))))
    y1 = min(H, math.ceil(max((p[1] for p in pts))))
    for y in range(y0, y1):
        xs = []
        yy = y + 0.5
        for (x1, z1), (x2, z2) in zip(pts, pts[1:] + pts[:1]):
            if z1 <= yy < z2 or z2 <= yy < z1:
                xs.append(x1 + (yy - z1) * (x2 - x1) / (z2 - z1))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]):
            box(math.ceil(a), y, math.ceil(b), y + 1, m)

def ellipse(cx, cy, rx, ry, m):
    for dy in range(-int(ry), int(ry) + 1):
        z = cy + dy
        if z < 0 or z >= H:
            continue
        f = max(0.0, 1 - (dy / ry) ** 2)
        dx = int(rx * math.sqrt(f))
        box(cx - dx, z, cx + dx + 1, z + 1, m)

def ring(cx, cy, rx, ry, thick, mat):
    ellipse(cx, cy, rx, ry, mat)
    ellipse(cx, cy, rx - thick, ry - thick, 0)

def line(x0, y0, x1, y1, width, mat):
    dx = x1 - x0
    dy = y1 - y0
    length = math.hypot(dx, dy)
    steps = max(1, math.ceil(length / max(1, width / 3)))
    for i in range(steps + 1):
        t = i / steps
        ellipse(round(x0 + dx * t), round(y0 + dy * t), max(1, width // 2), max(1, width // 2), mat)

def hatch(x, y, w, h, period, mat):
    for q in range(x + period, x + w - period, period):
        box(q, y, q + 2, y + h, mat)

def portal(x, y, w, h):
    box(x, y, x + w, y + h, 0)
box(0, 0, W, 26, 100)
box(0, 0, 12, H, 101)
box(W - 12, 0, W, H, 101)
box(0, 986, W, H, 100)
poly([(12, 986), (12, 806), (130, 846), (250, 886), (388, 906), (515, 916), (610, 882), (720, 936), (860, 919), (989, 903), (1130, 897), (1220, 862), (1380, 918), (1550, 909), (1690, 870), (1850, 904), (2036, 827), (2036, 986)], 100)
poly([(12, 986), (12, 907), (194, 929), (344, 952), (497, 934), (645, 961), (800, 956), (940, 951), (1100, 936), (1270, 927), (1403, 959), (1648, 954), (1812, 935), (2036, 909), (2036, 986)], 101)
poly([(86, 830), (192, 837), (306, 822), (444, 838), (580, 815), (717, 825), (856, 821), (1007, 802), (1193, 825), (1352, 839), (1477, 829), (1599, 813), (1760, 821), (1910, 825), (1990, 814), (1990, 877), (1760, 877), (1600, 868), (1450, 887), (1230, 884), (1100, 876), (945, 876), (790, 874), (636, 885), (470, 890), (334, 878), (175, 886), (86, 875)], 0)
for x, hh, ww in [(40, 43, 26), (215, 25, 34), (400, 51, 25), (538, 27, 36), (692, 65, 30), (846, 22, 34), (1100, 36, 30), (1268, 57, 32), (1406, 26, 41), (1588, 47, 28), (1781, 24, 37), (1950, 65, 28)]:
    box(x, 925 - hh, x + ww, 989, 49)
    box(x + 4, 926 - hh, x + ww - 4, 935 - hh, 113)
for x in range(92, 1980, 184):
    line(x, 25, x + 51, 93, 10, 62)
    line(x + 51, 93, x + 105, 26, 9, 117)
    box(x + 45, 82, x + 57, 109, 113)
box(22, 30, 2026, 40, 49)
poly([(12, 108), (100, 110), (183, 129), (238, 196), (269, 290), (269, 344), (248, 345), (215, 257), (162, 209), (88, 195), (12, 195)], 49)
poly([(12, 128), (94, 130), (173, 149), (215, 203), (229, 240), (203, 238), (145, 189), (80, 178), (12, 179)], 62)
poly([(12, 720), (80, 698), (155, 672), (238, 610), (320, 592), (347, 619), (240, 678), (146, 745), (12, 783)], 49)
poly([(12, 732), (93, 722), (175, 685), (254, 637), (309, 626), (331, 636), (245, 680), (170, 758), (12, 797)], 62)
for y, end in [(260, 313), (392, 375), (577, 327), (750, 257)]:
    box(12, y, end, y + 14, 62)
    box(12, y + 14, end - 18, y + 19, 49)
    for x in range(55, end - 36, 64):
        box(x, y + 4, x + 36, y + 9, 113)
box(12, 438, 356, 446, 113)
box(12, 510, 320, 525, 117)
box(16, 448, 55, 501, 58)
box(55, 450, 120, 461, 120)
box(55, 492, 120, 504, 120)
line(12, 780, 357, 626, 13, 62)
for x in range(94, 355, 50):
    y = int(744 - (x - 94) * 0.39)
    line(x, y, x, y + 44, 6, 117)
poly([(327, 986), (342, 716), (366, 646), (393, 619), (416, 633), (406, 720), (397, 986)], 58)
poly([(342, 986), (355, 741), (371, 674), (387, 660), (390, 715), (381, 986)], 117)
for y in range(710, 976, 33):
    box(359, y, 367, y + 12, 113)
box(110, 291, 277, 304, 128)
box(112, 304, 118, 342, 58)
box(267, 304, 277, 338, 58)
box(51, 546, 271, 556, 128)
box(54, 556, 62, 592, 62)
box(261, 556, 271, 589, 62)
box(59, 582, 151, 591, 120)
box(157, 582, 217, 591, 120)
poly([(340, 135), (450, 91), (588, 118), (647, 172), (631, 198), (572, 157), (466, 128), (356, 167)], 62)
poly([(350, 147), (461, 110), (580, 137), (611, 161), (586, 155), (468, 125), (352, 157)], 113)
for x, y in [(442, 132), (520, 136), (592, 160)]:
    line(x, y, x + 28, y + 145, 8, 62)
    line(x + 28, y + 145, x + 64, y + 194, 6, 117)
    ellipse(x + 28, y + 145, 9, 9, 113)
ring(920, 471, 297, 265, 31, 49)
ring(920, 471, 254, 223, 13, 62)
for a in range(0, 360, 18):
    t = math.radians(a)
    innerx = 920 + 231 * math.cos(t)
    innery = 471 + 200 * math.sin(t)
    outerx = 920 + 249 * math.cos(t + 0.06)
    outery = 471 + 216 * math.sin(t + 0.06)
    line(innerx, innery, outerx, outery, 7, 113)
portal(606, 415, 105, 112)
portal(1155, 409, 97, 126)
portal(852, 182, 140, 88)
portal(830, 682, 168, 105)
line(728, 665, 654, 918, 22, 58)
line(1052, 665, 1178, 889, 25, 58)
line(782, 272, 732, 26, 13, 62)
line(1086, 277, 1149, 28, 13, 62)
line(718, 694, 680, 887, 7, 113)
line(1078, 691, 1132, 872, 7, 113)
ellipse(914, 466, 161, 86, 58)
ellipse(914, 466, 143, 67, 101)
ellipse(914, 466, 125, 54, 128)
ellipse(914, 466, 108, 44, 0)
ring(918, 465, 67, 39, 13, 123)
ring(918, 465, 35, 22, 8, 120)
line(766, 466, 849, 466, 14, 62)
line(989, 466, 1075, 466, 14, 62)
for x in (786, 1041):
    box(x, 441, x + 15, 489, 113)
    box(x + 2, 452, x + 13, 477, 120)
box(806, 615, 1045, 632, 62)
box(818, 632, 1035, 638, 113)
for x in range(829, 1033, 34):
    box(x, 609, x + 21, 615, 120)
line(778, 700, 736, 916, 11, 117)
line(1080, 687, 1188, 907, 12, 117)
line(1212, 265, 1362, 193, 16, 62)
line(1357, 194, 1511, 230, 16, 62)
box(1213, 263, 1262, 275, 113)
box(1370, 198, 1518, 210, 113)
for x, y in [(1264, 241), (1332, 213), (1410, 206), (1484, 225)]:
    line(x, y, x, y + 76, 7, 117)
box(1202, 366, 1705, 382, 58)
box(1232, 382, 1670, 387, 113)
for x in (1244, 1441, 1652):
    box(x, 388, x + 15, 421, 62)
    box(x + 3, 393, x + 12, 414, 120)
poly([(1328, 905), (1303, 722), (1285, 548), (1306, 400), (1343, 287), (1411, 230), (1546, 228), (1643, 292), (1683, 403), (1700, 548), (1684, 730), (1719, 895)], 49)
poly([(1349, 902), (1333, 723), (1322, 558), (1336, 411), (1365, 314), (1430, 267), (1531, 264), (1617, 313), (1653, 414), (1665, 541), (1658, 706), (1687, 898)], 62)
poly([(1370, 888), (1357, 731), (1348, 553), (1362, 426), (1393, 348), (1447, 305), (1514, 303), (1592, 345), (1625, 425), (1637, 542), (1630, 719), (1664, 888)], 101)
for x, y, w, h in [(1347, 345, 145, 107), (1483, 329, 150, 138), (1363, 489, 250, 125), (1390, 641, 225, 129)]:
    portal(x, y, w, h)
box(1327, 465, 1649, 479, 62)
box(1336, 623, 1652, 638, 62)
box(1351, 780, 1670, 796, 62)
for x0, x1, y in [(1348, 1393, 470), (1442, 1524, 470), (1574, 1643, 470), (1355, 1415, 628), (1464, 1543, 628), (1595, 1640, 628)]:
    box(x0, y - 5, x1, y, 113)
for yy in (478, 638, 789):
    portal(1280, yy + 14, 130, 48)
    portal(1614, yy + 16, 129, 55)
for x in (1390, 1435, 1500, 1550, 1605):
    ellipse(x, 324, 18, 10, 120)
    ellipse(x, 324, 8, 4, 123)
for cx, cy, rx, ry in [(1401, 554, 33, 31), (1513, 557, 64, 29), (1594, 719, 44, 43)]:
    ring(cx, cy, rx, ry, 8, 120)
    line(cx, cy - ry, cx, cy - ry - 19, 5, 113)
    box(cx - 7, cy - 5, cx + 7, cy + 5, 123)
for cx, cy, rx, ry in [(1457, 415, 36, 19), (1555, 413, 27, 27), (1448, 707, 32, 48)]:
    ring(cx, cy, rx, ry, 5, 123)
    portal(cx - rx - 3, cy - 19, 18, 38)
for x in (1375, 1470, 1570, 1642):
    line(x, 793, x + 17, 930, 11, 117)
    line(x + 3, 808, x + 13, 915, 3, 113)
box(1706, 355, 1830, 372, 62)
box(1736, 372, 1748, 557, 117)
box(1705, 563, 1882, 580, 62)
box(1741, 580, 1754, 813, 117)
line(1742, 810, 1837, 937, 16, 58)
poly([(1788, 126), (1834, 117), (1929, 143), (2036, 207), (2036, 263), (1946, 220), (1867, 201), (1775, 208)], 62)
poly([(1782, 137), (1836, 130), (1924, 161), (2036, 226), (2036, 245), (1944, 206), (1855, 183), (1780, 188)], 113)
poly([(1804, 912), (1833, 750), (1903, 681), (1993, 630), (2036, 610), (2036, 775), (1911, 806), (1875, 933)], 49)
poly([(1820, 916), (1842, 776), (1914, 708), (2002, 667), (2036, 656), (2036, 682), (1934, 741), (1863, 813), (1844, 937)], 62)
box(1976, 309, 2036, 326, 62)
box(1976, 326, 1988, 435, 62)
box(1871, 446, 2036, 463, 62)
box(1871, 463, 1884, 502, 117)
box(1847, 565, 2036, 584, 62)
box(1847, 584, 1860, 615, 117)
box(1904, 746, 2036, 760, 62)
box(2000, 70, 2014, 355, 117)
box(2000, 675, 2014, 990, 117)
for y in (175, 225, 290, 340, 742, 792, 838):
    box(1995, y, 2021, y + 8, 113)
box(1899, 494, 2002, 505, 120)
box(1910, 506, 1920, 535, 62)
box(1891, 622, 1997, 634, 120)
box(1891, 635, 1901, 663, 62)
line(391, 329, 504, 296, 8, 62)
line(504, 296, 606, 326, 8, 62)
line(1259, 301, 1324, 281, 10, 62)
for x in range(38, 304, 44):
    for y in (273, 404, 590):
        if x + 15 < 320:
            box(x, y, x + 14, y + 3, 113)
for x in range(1363, 1661, 51):
    for y in (465, 628, 783):
        box(x, y, x + 20, y + 3, 113)
for i in range(95):
    x = R.randrange(28, 2021)
    y = R.randrange(933, 985)
    if A[y * W + x] in (100, 101, 49):
        box(x, y, x + R.randrange(4, 16), y + 2, R.choice([49, 117, 113]))
portal(630, 300, 606, 86)
portal(885, 484, 74, 107)
portal(1480, 557, 68, 54)
portal(1372, 674, 124, 84)
portal(620, 776, 151, 90)
portal(1062, 770, 153, 96)
portal(1249, 370, 164, 78)
portal(1253, 508, 171, 98)
portal(1248, 671, 170, 98)
portal(1599, 371, 183, 77)
portal(1601, 514, 183, 99)
portal(1598, 673, 184, 99)
portal(1704, 419, 191, 112)
portal(1783, 780, 238, 103)
SITES = {'spawn_receiving_dock': (122, 483), 'upper_hull_shunt': (384, 224), 'west_filter_service': (291, 480), 'spinal_gate_west': (570, 470), 'memory_engine_north': (925, 145), 'memory_engine_core': (921, 468), 'memory_engine_south': (914, 809), 'spinal_gate_east': (1240, 480), 'refinery_high_bay': (1470, 404), 'refinery_middle_filter': (1510, 544), 'refinery_lower_sump': (1500, 704), 'aft_drydock': (1801, 480), 'final_recovery_rail': (1940, 848)}
for name, (x, y) in SITES.items():
    box(x - 17, y - 15, x + 18, y + 16, 0)
line(1693, 493, 1784, 563, 10, 62)
line(16, 448, 16, 445, 7, 117)
line(789, 280, 785, 277, 7, 117)
line(995, 258, 997, 247, 7, 117)
line(1594, 762, 1594, 770, 8, 117)
line(1899, 494, 1899, 462, 7, 117)
line(1753, 613, 1784, 579, 7, 117)
line(1660, 622, 1690, 910, 12, 117)
# Narrow aft-dock stirrup: tested against exact 31x27 sites AND both constrained
# upper/lower cross-map routes. This binds the lower salvage bracket to keel stone.
box(1779, 875, 1784, 890, 62)



# Structural R1: preserve the rooted geology/hull, remove unsupported islands
# that earlier direct-strap investigations proved would close BOTH narrow
# alternates, and replace them with deliberately *grounded* split infrastructure.
# The two sky and keel transit bands are kept open between the new structures.
def anchored_only(a, remove):
    rooted = bytearray(W*H)
    q = collections.deque()
    def seed(i):
        if a[i] and not rooted[i]:
            rooted[i] = 1
            q.append(i)
    for x in range(W):
        seed(x)
        seed((H-1)*W+x)
    for y in range(H):
        seed(y*W)
        seed(y*W+W-1)
    while q:
        i=q.popleft()
        x=i%W
        y=i//W
        for j in (i-1 if x else -1, i+1 if x<W-1 else -1,
                  i-W if y else -1, i+W if y<H-1 else -1):
            if j>=0 and a[j] and not rooted[j]:
                rooted[j]=1
                q.append(j)
    detached=sum(bool(a[i]) and not rooted[i] for i in range(W*H))
    if remove:
        for i in range(W*H):
            if a[i] and not rooted[i]: a[i]=0
    return detached

REPLACED_UNSUPPORTED_CELLS=anchored_only(A, True)
assert REPLACED_UNSUPPORTED_CELLS>=100000, REPLACED_UNSUPPORTED_CELLS

# Graftloom upper receiving scissors: roof-fixed, short hanging gantries.
# Their lowest tips stay above Midge's upper transit and work platforms.
box(465,25,479,172,62)
line(471,169,532,205,13,117)
line(532,205,612,180,12,62)
box(602,25,616,184,62)
for xx,yy in [(509,186),(558,196),(589,187)]:
    line(xx,yy,xx+8,yy+12,6,113)

# Split mnemonic xenoreactor: overhead synaptic crown / low underkeel cradle.
# IMPORTANT: two anchored open HALF-assemblies, not a closed obstructive wheel.
# The north-shunt route can pass under the crown at y ~310-375.
box(744,25,758,211,62)
line(750,210,825,242,16,62)
line(825,242,1018,242,13,117)
line(1018,242,1095,211,16,62)
box(1088,25,1103,217,62)
for cx,cy,rx,ry in [(840,241,27,21),(940,242,40,19),(1008,241,24,17)]:
    ring(cx,cy,rx,ry,7,120)
    box(cx-3,cy-3,cx+4,cy+4,113)
# Bottom open keel arms tie to in-situ bedrock, not to the roof arch.
box(730,894,752,986,58)
line(740,900,783,837,18,58)
line(782,839,824,833,10,62)
box(1095,891,1118,986,58)
line(1106,897,1072,844,18,58)
line(1072,845,1029,835,10,62)
# A shallow U-shaped process gutter remains below the South objective.
line(740,944,858,931,14,117)
line(858,931,958,936,14,117)
line(958,936,1107,945,14,117)

# Three-tier dry biorefinery reconstructed as a roof-suspended bifurcated
# xenografting rake. It deliberately DOES NOT form a full-height wall.
box(1321,25,1337,194,62)
line(1329,192,1419,262,16,62)
line(1419,262,1606,216,13,62)
box(1598,25,1614,222,62)
for cx,cy,rx,ry in [(1397,247,20,19),(1478,247,40,23),(1563,226,26,24)]:
    ring(cx,cy,rx,ry,7,120)
    box(cx+rx-8,cy-3,cx+rx+7,cy+4,113)
# Sublevel industrial dike: low grounded roots and an open inspection arch.
box(1280,907,1300,987,58)
line(1290,910,1333,833,14,58)
line(1333,833,1380,816,10,117)
box(1620,904,1640,987,58)
line(1630,913,1585,836,14,58)
line(1585,837,1540,822,10,117)

# Stern salvage mandibles, clearly supported from the perimeter.
box(1921,25,1937,170,62)
line(1929,169,1845,219,15,62)
line(1845,219,1814,272,11,117)
box(1890,914,1912,989,58)
line(1901,921,1865,862,15,58)

# Recolour *existing solid geology* with manufactured ore-sorting grooves:
# changes material vocabulary without introducing free-floating detail stamps.
for xa,xb,ya,yb,dx,dy,mat in [
    (120,328,873,980,25,14,113),
    (680,1175,895,980,34,16,117),
    (1260,1670,900,982,29,13,113),
    (1800,1990,915,982,23,17,117)]:
    for xx in range(xa,xb,dx):
        for yy in range(ya,yb,dy):
            for x in range(xx,min(xx+11,xb)):
                for y in range(yy,min(yy+3,yb)):
                    i=y*W+x
                    if A[i]: A[i]=mat


# SHEPHERD R2 — asymmetrical, rooted bio-industrial apparatus rather than
# repeating sky rings / identical refinery shelves. This is *actual cell art*:
# all constructions below occur on the unique material-ID plane before
# rectangle compression, exact centre clearance tests and PNG generation.
# Every macroscopic object must touch the perimeter-rooted roof, rock, bed,
# existing supported gantry or a continuously joined structural arm.
PRE_R2 = A[:]

def lumen(cx, cy, rx, ry, t, shell, glass=120):
    """Open capsule with continuous perimeter and a keyed optical ferrule."""
    ellipse(cx, cy, rx, ry, shell)
    ellipse(cx, cy, rx-t, ry-t, 0)
    box(cx-rx+1, cy-3, cx-rx+t+5, cy+4, glass)
    box(cx+rx-t-4, cy-3, cx+rx, cy+4, 113)

# A: receiving ferrule works — asymmetric incoming cargo and inspection bays.
# Cantilevered service spine is tied to the original western mass and y260
# rooted deck; it no longer reads as an arbitrary empty cliff opening.
poly([(20, 190), (84, 190), (153, 234), (183, 267),
      (172, 286), (100, 243), (20, 240)], 117)
line(157, 215, 206, 288, 13, 62)
line(203, 288, 301, 319, 11, 62)
box(255, 258, 269, 335, 62)
box(206, 316, 322, 326, 62)
box(220, 325, 310, 331, 113)
for x in (232, 278):
    box(x, 330, x+9, 351, 117)
line(16, 404, 72, 386, 14, 62)
line(72, 386, 180, 398, 12, 62)
line(180, 398, 204, 424, 10, 117)
lumen(87, 391, 29, 18, 7, 62)
# Receiving-side instrument panels are fixed to the rooted ledge.
box(40, 432, 116, 443, 62)
for x in (50, 68, 91):
    box(x, 425, x+9, 432, 120)
# A unique, clear-to-read landing-fork silhouette.
poly([(18, 616), (90, 610), (166, 599), (222, 560),
      (243, 561), (193, 627), (99, 649), (18, 649)], 62)
box(20, 644, 105, 654, 113)

# B: receiving-to-shunt freight anatomy: a lifting shoulder, not repeated V's.
# The shunt equipment is joined to the roof mast at x465-615.
line(471, 158, 509, 219, 16, 62)
lumen(529, 215, 41, 25, 9, 117)
line(559, 209, 608, 189, 15, 62)
box(582, 172, 613, 185, 113)
line(603, 177, 702, 205, 9, 62)
line(692, 201, 745, 210, 9, 62)
# Side-specific articulated sorting claw at lower altitude.
line(472, 225, 497, 284, 8, 117)
line(497, 284, 551, 321, 9, 62)
line(497, 284, 465, 318, 8, 62)
box(540, 315, 558, 324, 113)

# C: the split mnemonic thalamus. Left and right independently rooted
# asymmetric neural vessels; neither is a floating wheel. Leave the North
# objective's x910..940/y132..158 hull entirely empty, and keep the upper
# transit under the lobes genuinely navigable.
line(750, 178, 795, 216, 21, 62)
line(795, 216, 817, 270, 18, 117)
lumen(823, 252, 54, 32, 11, 62)
line(779, 263, 761, 299, 9, 117)
line(847, 280, 853, 296, 8, 113)
line(1095, 181, 1064, 218, 24, 62)
line(1064, 218, 1032, 267, 20, 117)
lumen(1019, 258, 68, 35, 10, 62)
line(1071, 268, 1099, 290, 11, 117)
# Distinct optical ribs inside each lobe, not texture stamps.
for x0,y0,x1,y1 in [(793,248,823,226),(813,269,841,242),
                    (990,270,1004,240),(1020,278,1050,250)]:
    line(x0,y0,x1,y1,4,120)
# Left service gantry has a sloped arm and grasping tines; right interface
# uses a split descending scalpel. All connect back into the rooted lobes.
line(817, 274, 778, 300, 11, 117)
line(778, 300, 766, 322, 6, 113)
line(778, 300, 793, 322, 6, 113)
line(1037, 284, 1090, 303, 11, 117)
line(1090, 303, 1104, 326, 7, 113)
line(1090, 303, 1076, 330, 7, 113)
# Contrasting left/right side-wall examination consoles anchored to
# rooted underside without forming a mid-air separator.
line(752, 172, 727, 268, 9, 117)
box(705, 268, 765, 279, 62)
box(712, 279, 748, 284, 120)
line(1094, 172, 1129, 258, 9, 117)
box(1103, 258, 1167, 273, 62)
box(1117, 273, 1152, 279, 120)

# Basal mnemonic vessel is the *different* process return, with solid
# keel-anchored arcs at x730/1095 and no closure through the South site.
line(740, 933, 779, 817, 25, 58)
line(779, 817, 829, 785, 16, 62)
lumen(818, 809, 42, 30, 10, 62)
line(1107, 936, 1066, 817, 25, 58)
line(1066, 817, 1017, 790, 17, 62)
lumen(1029, 816, 49, 29, 10, 117)
line(768, 893, 830, 878, 12, 117)
line(1062, 895, 1000, 882, 12, 117)
# Recolour only grounded pre-existing geology into an optically readable,
# asymmetrical return-pump footprint (no unsupported sprinkle).
for x0,x1,y0,y1,m in [(758,835,925,964,117),(1005,1081,929,966,113),
                       (846,967,951,969,62)]:
    for yy in range(y0,y1,8):
        for xx in range(x0,x1,21):
            for y in range(yy,min(yy+5,y1)):
                i=y*W+xx
                if A[i]: A[i]=m

# Key otherwise-isolated internal optical vanes to the right crown shell.
line(1004, 240, 1073, 240, 5, 117)  # rightward: north portal removes x868..982
line(1020, 278, 1083, 278, 5, 117)

# D: three genuinely different biorefinery operations.
# HIGH — roof-supported paired receiver-bells, intentionally NOT three decks.
line(1419, 260, 1410, 302, 15, 62)
lumen(1405, 319, 49, 33, 10, 62)
line(1606, 217, 1583, 292, 19, 62)
lumen(1563, 318, 46, 37, 11, 117)
line(1383, 344, 1371, 372, 7, 113)
line(1587, 345, 1603, 372, 7, 113)
line(1371, 366, 1371, 384, 10, 117)
box(1353, 377, 1430, 389, 62)
box(1565, 376, 1641, 389, 62)
# High-bay x1470,y404 retains a >31x27 open envelope.
# MID — the original broad transparent refinery inspection bay is intentionally
# left open between roof-feed receivers and lower grounded fractionation drums.
# A dense membrane diaphragm was tested and rejected after it isolated exact
# Midge routes; this is an accessible processing/inspection gallery instead.
# LOW — coarse dry fractionation drum anchored to the floor/bedrock,
# separated from high and middle mechanisms by substantial open air.
box(1360, 849, 1382, 987, 58)
line(1371, 850, 1417, 811, 17, 62)
lumen(1431, 814, 49, 31, 9, 117)
box(1618, 848, 1640, 989, 58)
line(1628, 849, 1593, 801, 17, 62)
lumen(1575, 805, 38, 25, 8, 62)
line(1381, 896, 1422, 873, 9, 113)
line(1627, 895, 1595, 876, 9, 113)
# Underfloor extraction grilles are recolours of already-solid bedrock.
for x0,x1,yy in [(1330,1450,925),(1547,1655,925)]:
    for xx in range(x0,x1,18):
        for y in range(yy,yy+5):
            i=y*W+xx
            if A[i]: A[i]=113
# Keep the exact three refinery destinations unobstructed at every margin.

# E: recognizable aft salvage machinery and real return freight transfer.
# The upper gantry terminates in a keyed, industrial mouth, not sky scenery.
line(1929, 155, 1885, 223, 19, 62)
line(1885, 223, 1828, 266, 14, 117)
lumen(1840, 279, 49, 26, 8, 62)
line(1811, 293, 1792, 340, 9, 117)
line(1854, 303, 1875, 341, 9, 117)
box(1784, 337, 1820, 348, 113)
box(1855, 339, 1884, 347, 113)
# Aft palette clamp is split: the roof-rooted recovery pawl never closes
# the lower arrival passage to the exact (1940,848) extraction coordinate.
line(2033, 688, 2009, 729, 13, 62)
line(2009, 729, 1991, 745, 10, 117)
lumen(1992, 750, 27, 19, 7, 62)
# Basal handling cradles are rooted independently, with broad air between.
line(1847, 932, 1838, 880, 12, 58)
box(1810, 902, 1862, 915, 62)
box(1991, 925, 2025, 940, 62)
# Recovery rail x1940,y848 is open above and to both sides at full hull.

# A single legible return pipe follows the underkeel, with diverse junctions,
# all welded into existing floor geology rather than hovering in the airway.
for xa,xb,yy in [(608,728,944),(746,875,955),(965,1112,950),
                  (1120,1251,945),(1259,1380,954)]:
    box(xa,yy,xb,yy+10,62)
    box(xa+12,yy+10,xb-12,yy+14,113)
for cx,cy,rx in [(688,939,19),(1180,943,26)]:
    ellipse(cx,cy,rx,15,117)
    ellipse(cx,cy,rx-8,6,120)



# SHEPHERD R3 — inhabited, legible workspaces, not more identical glyphs.
# Shipyard functional process: intake cradle -> mnemonic examination -> lamellar
# sorting/expulsion -> underkeel service -> aft extraction. All structural
# additions must weld to an already boundary-rooted roof, cliff or bedrock.
# Non-overlapping conservative Midge hulls are verified *after* this passage.
PRE_R3 = A[:]

# 1. Receiving: asymmetrical cradled graft intake, bolted into west shoulder.
# Its opening is beneath the old sky shunt; the exact receiving spawn remains
# open at (122,483), with 31x27 collision clearance on all four approaches.
line(52, 403, 110, 419, 13, 62)
poly([(105,419),(165,418),(186,402),(209,411),
      (193,438),(165,450),(121,446)], 117)
poly([(116,419),(140,396),(188,390),(197,399),
      (170,407),(158,421)], 62)
box(135,440,162,448,113)
line(163,422,198,431,7,120)
box(45,410,75,419,113)

# 2. Mnemonic examination gantry: genuinely roof-grounded structure.
# A mid-void suspended dock at y416 severed either the upper or lower
# mandated 31x27 route; its unsupported alternative exceeded 14k cells.
# Rebuild as ONE asymmetric, rooted dry examination capsule UNDER the paired
# thalamus lobes. The entire new assembly ends at y355, leaving a
# >=20-cell clearance above the upper route centre's 31x27 hull at y389.
# Its central observation tool is accessible from the main open airway.
line(817,273,826,316,11,62)
line(1030,272,1042,312,13,117)
poly([(808,316),(851,306),(903,312),(947,308),
      (1001,299),(1051,310),(1074,321),(1036,336),
      (958,333),(902,342),(842,342)],62)
poly([(837,319),(871,315),(914,323),(969,316),
      (1024,312),(1041,321),(1001,325),(945,325),
      (891,332),(844,331)],113)
# A single lamellar reading cassette, not another circular ring.
poly([(874,311),(896,296),(940,301),(968,309),
      (950,322),(908,325),(885,319)],117)
box(903,309,942,318,120)
box(854,332,891,342,120)
box(982,326,1028,336,120)
for xx,top,bot in [(852,334,349),(866,336,351),
                    (886,335,348),(999,334,353),(1015,333,346)]:
    box(xx,top,xx+4,bot,113)
# A shaped lateral workface and keyed scanning tooth remain part of
# the rooted gantry, without creating an east-west flight divider.
line(826,326,802,345,7,117)
line(1031,326,1059,345,7,117)
box(926,332,945,340,128)
box(935,339,942,349,120)
# North observation is a REAL through-aperture, not a sealed scenic eye.
# This extends the x868..982 / y216..308 crown breach below the new
# workface to keep the exact (925,145) objective freely accessible.
portal(886,308,80,61)

# 3. Refinery HIGH: retain R2's verified paired high-bell geometry.
# An extra R3 press at this restrictive x1570..1640 throat violated the
# conservative 31x27 route to High Bay and Aft Drydock; rejected entirely.

# Refinery MIDDLE (reopened): R3 separator trial blocked actual site approach.
# Retain the previously verified y465/y623 rack and full open flights here;
# a shallow, anchored assay console is now mounted on the west fixed deck.
box(1344,462,1353,499,62)
box(1351,491,1388,500,113)
line(1351,494,1390,508,5,120)
# No closed diaphragm, vertical barrier or long cross-corridor wall.

# Refinery LOWER: floor-attached tapered waste auger / dry extrusion face.
# It faces left toward exact (1500,704) while the service exit faces right.
line(1628,846,1621,764,16,62)
box(1608,742,1641,767,62)
poly([(1609,743),(1560,740),(1545,759),
      (1559,768),(1609,773)],117)
box(1574,728,1594,744,113)
box(1611,703,1621,752,120)
line(1627,760,1690,741,10,62)
poly([(1640,748),(1688,735),(1704,741),
      (1694,757),(1660,773),(1640,769)],101)
line(1646,762,1647,822,10,117)
# Give one original rotary lower vessel a non-circular working tooth casing.
poly([(1395,797),(1421,784),(1480,797),(1472,811),
      (1436,825),(1410,819)],117)

# 4. Underkeel: preserve the accepted R2 narrow lower flyway.
# A raised sampling enclosure at x870..954/y890..956 obscured part of its
# already-constrained service throat. The R3 room trial is rejected rather
# than weakening the exact 31x27 lower-route acceptance gate.
# Retain existing grounded freight piping, varied underfloor pumps and bays.

# 5. Aft recovery inspection: right-anchored jaw and extraction interface.
# The earlier deep left prong occluded the Final Recovery approach. Its tip
# is deliberately absent pending native gameplay; this local right bracket
# is a solid grounded terminus, not a floating stage prop.
box(2001,893,2014,937,62)
line(2008,897,1987,904,8,117)
box(1983,906,2013,916,113)
# Keep exact Final Recovery Rail (1940,848) plus 31x27 approaches clear.

R3_CHANGED_CELLS = sum(u != v for u,v in zip(PRE_R3,A))
assert R3_CHANGED_CELLS >= 3000, ('R3 physical rework missing',R3_CHANGED_CELLS)

# A 112-cell-wide deliberate breach in the north mnemonic crown preserves
# direct access to the fixed Memory Engine North coordinate (925,145).
# Left and right crown halves retain independent boundary-rooted hangers.
portal(868, 216, 114, 92)
REBUILD_DETAIL_TRIM=anchored_only(A, True)
assert REBUILD_DETAIL_TRIM < 1000, ('unexpected orphaned replacement details', REBUILD_DETAIL_TRIM)
FINAL_DETACHED=anchored_only(A, False)
assert FINAL_DETACHED==0, ('post-reconstruction unsupported structure', FINAL_DETACHED)
R2_CHANGED_CELLS = sum(before != after for before, after in zip(PRE_R2, A))
assert R2_CHANGED_CELLS > 14000, ('substantive grid change missing', R2_CHANGED_CELLS)



# R4 SHEPHERD RESPONSE — a physically enterable diagnostic exchange and three
# intelligibly different dry refinery mechanisms. Never trace reference art.
# Preserve BOTH 31x27 altitude-stress routes: the long support arms route
# OUTSIDE the narrow central x650..1200 transit corridor below y390.
# Inspect these actual built cells in overview + district crops, not concept art.
PRE_R4 = A[:]

# MEMORIAL ANALYSER — two unequal perimeter-rooted sampling platforms framing
# the exact Memory Core (921,468), not a hollow "destination" in featureless air.
# West: a long roof-bearing counterweight folds OUT toward the western socket
# before returning as a keyed, accessible optical sample shelf.
line(727,268,619,371,13,117)
line(619,371,644,476,17,62)
line(644,476,696,508,16,117)
box(690,506,817,519,62)
poly([(709,504),(732,488),(770,489),(783,505)],117)
box(730,497,775,504,120)
box(799,490,815,510,113)
line(807,490,807,459,8,117)
box(797,451,818,461,120)
# East: a longer counter-hung surgical dock, lower than west and equipped
# with sequential lamellar read heads. Its nearest working surface is
# x970+, leaving the conservative exact-centre Midge core unobstructed.
line(1094,258,1222,368,14,62)
line(1222,368,1211,477,18,117)
line(1211,477,1115,511,13,62)
box(973,506,1123,521,62)
poly([(997,506),(1018,487),(1056,477),(1078,483),
      (1091,506)],117)
box(1017,492,1059,504,120)
for xx, top in [(985,480),(1006,466),(1084,472)]:
    box(xx,top,xx+7,508,113)
    box(xx+1,top-8,xx+6,top,120)
# Staggered loading shoes below the two benches, reachable on both sides.
for xx, y0 in [(718,519),(763,519),(999,521),(1095,521)]:
    box(xx,y0,xx+13,y0+12,117)
    box(xx+3,y0+12,xx+10,y0+17,113)

# REFINERY MID — unlike roof-suspended high receiver bells and deep grounded
# low extrusion drums, the intermediate level is a bolted dry sorting / assay
# plant, entered above its table through a generous unobstructed air gallery.
# The actual inspection centre (1510,544) remains well above the hardware.
box(1393,596,1410,628,62)
poly([(1400,596),(1418,577),(1458,573),(1472,590),
      (1462,601),(1425,604)],117)
box(1415,584,1454,592,120)
box(1450,605,1578,617,62)
box(1465,617,1477,630,117)
box(1556,617,1568,630,117)
# Distinct three-step precision separator supported directly from middle deck.
for xx, yy, ww in [(1476,585,43),(1520,578,34),(1558,592,24)]:
    box(xx,yy,xx+ww,yy+7,113)
    box(xx+8,yy+7,xx+15,607,62)
    box(xx+4,yy-4,xx+ww-4,yy,120)
# Eastern waste-metering jaws are vertically rooted in the same middle deck,
# not a membrane across the upper/middle free-flying passage.
box(1615,587,1627,637,62)
poly([(1620,583),(1597,562),(1571,564),(1583,577),
      (1606,596),(1620,598)],117)
box(1590,558,1611,565,113)
line(1614,609,1582,619,8,117)
# Short under-bench rail identifies real dry-material transfer; neither this
# nor the optical cassette is a decorative floating loop.
box(1410,623,1590,629,113)

# AFT TRANSFER — a compact cantilever receives the assay cassette, firmly
# fixed to the eastern salvager's roof-rooted mandible, not the open Midge bay.
line(1841,278,1864,361,11,117)
line(1864,361,1919,397,14,62)
box(1905,392,1965,407,62)
box(1919,381,1949,391,113)
box(1924,374,1943,382,120)

R4_CHANGED_CELLS = sum(before != after for before, after in zip(PRE_R4, A))
assert R4_CHANGED_CELLS > 1500, ('missing R4 physical apparatus', R4_CHANGED_CELLS)
R4_DETACHED=anchored_only(A, False)
assert R4_DETACHED==0, ('R4 unsupported apparatus', R4_DETACHED)

# The former direct welds are superseded by grounded split architecture; retain exact route audits.

def rectangles(a):
    rect = []
    open_runs = {}
    for y in range(H):
        new = {}
        start = 0
        row = a[y * W:(y + 1) * W]
        x = 0
        while x < W:
            m = row[x]
            x0 = x
            x += 1
            while x < W and row[x] == m:
                x += 1
            if m == 0:
                continue
            key = (x0, x - x0, m)
            prev = open_runs.get(key)
            if prev is not None and rect[prev][1] + rect[prev][3] == y:
                rect[prev][3] += 1
                new[key] = prev
            else:
                new[key] = len(rect)
                rect.append([x0, y, x - x0, 1, m])
        open_runs = new
    return rect

def legal_centres(a, sx, sy):
    import array
    stride = W + 1
    integ = array.array('I', [0]) * ((W + 1) * (H + 1))
    for y in range(H):
        v = 0
        rr = y * W
        ii = (y + 1) * stride
        up = y * stride
        for x in range(W):
            v += bool(a[rr + x])
            integ[ii + x + 1] = integ[up + x + 1] + v
    halfx = sx // 2
    halfy = sy // 2
    legal = bytearray(W * H)
    for y in range(halfy, H - halfy):
        ya = y - halfy
        yb = y + halfy + 1
        for x in range(halfx, W - halfx):
            xa = x - halfx
            xb = x + halfx + 1
            n = integ[yb * stride + xb] - integ[ya * stride + xb] - integ[yb * stride + xa] + integ[ya * stride + xa]
            if n == 0:
                legal[y * W + x] = 1
    return legal

def flood(legal, src, banned=None):
    start = src[1] * W + src[0]
    assert legal[start], ('source has collision', src)
    seen = bytearray(W * H)
    seen[start] = 1
    q = collections.deque([start])
    tot = 1
    while q:
        i = q.popleft()
        x = i % W
        y = i // W
        for j in (i - 1 if x > 0 else -1, i + 1 if x < W - 1 else -1, i - W if y > 0 else -1, i + W if y < H - 1 else -1):
            if j < 0 or seen[j] or (not legal[j]):
                continue
            if banned is not None and banned(j % W, j // W):
                continue
            seen[j] = 1
            tot += 1
            q.append(j)
    return (seen, tot)

def chunk(t, body):
    return struct.pack('>I', len(body)) + t + body + struct.pack('>I', zlib.crc32(t + body) & 4294967295)

def png_rgb(a, x, y, w, h, path, step=1):
    out = bytearray()
    for yy in range(y, y + h, step):
        out.append(0)
        for xx in range(x, x + w, step):
            out.extend(M[a[yy * W + xx]])
    ww = (w + step - 1) // step
    hh = (h + step - 1) // step
    header = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', ww, hh, 8, 2, 0, 0, 0))
    dat = header + chunk(b'IDAT', zlib.compress(bytes(out), 9)) + chunk(b'IEND', b'')
    pathlib.Path(path).write_bytes(dat)
    return {'png': os.path.basename(path), 'pixels': [ww, hh], 'bytes': len(dat), 'sha256': hashlib.sha256(dat).hexdigest()}

def png_verify(path, a, x, y, w, h, step=1):
    b = pathlib.Path(path).read_bytes()
    assert b.startswith(b'\x89PNG\r\n\x1a\n')
    p = 8
    raw = b''
    dims = None
    while p < len(b):
        n = struct.unpack('>I', b[p:p + 4])[0]
        typ = b[p + 4:p + 8]
        body = b[p + 8:p + 8 + n]
        crc = struct.unpack('>I', b[p + 8 + n:p + 12 + n])[0]
        assert zlib.crc32(typ + body) & 4294967295 == crc
        if typ == b'IHDR':
            dims = struct.unpack('>IIBBBBB', body)
        if typ == b'IDAT':
            raw += body
        p += 12 + n
        if typ == b'IEND':
            break
    assert p == len(b) and dims[:2] == ((w + step - 1) // step, (h + step - 1) // step)
    pixels = zlib.decompress(raw)
    q = 0
    for yy in range(y, y + h, step):
        assert pixels[q] == 0
        q += 1
        for xx in range(x, x + w, step):
            assert pixels[q:q + 3] == bytes(M[a[yy * W + xx]])
            q += 3
    assert q == len(pixels)
    return True

def run(dest):
    dest = pathlib.Path(dest)
    dest.mkdir(parents=True, exist_ok=True)
    rect = rectangles(A)
    assert len(rect) <= 32768, len(rect)
    replay = bytearray(W * H)
    overlap = 0
    work = 0
    for x, y, w, h, m in rect:
        assert m in M and m != 0 and (x >= 0) and (y >= 0) and (x + w <= W) and (y + h <= H)
        work += w * h
        for yy in range(y, y + h):
            i = yy * W + x
            overlap += sum((1 for z in replay[i:i + w] if z))
            replay[i:i + w] = bytes([m]) * w
    assert A == replay and overlap == 0
    assert work < 32000000
    policy = [1279479895, 1, 1, -2102023270, 1854385793, 1886533889, 84225930, 1522979054, 582168604, -646713377, -939672877, 868616440, 1977866421, 1930370363, -2119873090, -6981196, 870342995, 1443932351, -1569267145, 11, 3, 1, 0, 8, 2, 0, 12, 2, 0, 16, 2, 0, 20, 2, 0, 21, 2, 0, 24, 2, 0, 30, 2, 0, 32, 2, 0, 33, 2, 0, 36, 2, 0, 0, 0]
    setup = {'version': 2, 'extent': [W, H], 'actors': [{'id': 1, 'model': 'midge', 'hash': 'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96', 'spawn': list(SITES['spawn_receiving_dock']), 'options': {'budget': 20, 'mass_multiplier': 1, 'inertia_multiplier': 1, 'thrust_multiplier': 1, 'torque_multiplier': 1, 'boost_multiplier': 1.8}}], 'next_id': 2, 'selected': 1, 'edits': rect, 'response': 'LA-SELECTIVE', 'liquid_policy': policy, 'normalize': False, 'rule_radius': 2, 'source': [], 'material': 58, 'brush': 8, 'fire': False}
    js = json.dumps(setup, separators=(',', ':')).encode()
    assert len(js) < 1048576, len(js)
    (dest / 'setup-graftloom-slipway.json').write_bytes(js)
    clearance = {}
    common = {}
    for sx, sy in [(19, 15), (23, 19), (31, 27)]:
        legal = legal_centres(A, sx, sy)
        for n, (x, y) in SITES.items():
            assert legal[y * W + x], ('site not clear', sx, sy, n, (x, y))
        visited, total = flood(legal, SITES['spawn_receiving_dock'])
        reachable = {n: bool(visited[y * W + x]) for n, (x, y) in SITES.items()}
        assert all(reachable.values()), ('unreachable sites', sx, sy, reachable)
        local = {n: sum((legal[(y + dy) * W + x + dx] and visited[(y + dy) * W + x + dx] for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)])) for n, (x, y) in SITES.items()}
        assert min(local.values()) >= 3
        clearance[f'{sx}x{sy}'] = {'reachability': reachable, 'connected_legal_centres': total, 'minimum_local_approaches': min(local.values()), 'local_approaches': local}
        if sx == 31:
            for name, ban in [('upper_via_roof', lambda x, y: 650 <= x <= 1200 and y >= 390), ('lower_via_sump', lambda x, y: 650 <= x <= 1200 and y <= 650)]:
                start = (570, 470)
                end = (1240, 480)
                s, t = flood(legal, start, ban)
                common[name] = {'destination_gate_reached': bool(s[end[1] * W + end[0]]), 'legal_centres': t}
                assert common[name]['destination_gate_reached'], ('alternate route failed', name)
    hist = {str(i): A.count(i) for i in sorted(M) if A.count(i)}
    imgs = []
    specs = [('overview.png', 0, 0, W, H, 1), ('review-half.png', 0, 0, W, H, 2), ('01-receiving-slip.png', 0, 160, 512, 650, 1), ('02-crane-and-entry.png', 320, 85, 470, 610, 1), ('03-memory-engine.png', 657, 235, 510, 545, 1), ('04-refinery-filter.png', 1290, 255, 430, 605, 1), ('05-aft-dock.png', 1710, 135, 330, 750, 1), ('06-lower-return.png', 650, 705, 770, 250, 1)]
    for f, x, y, w, h, step in specs:
        imgs.append(png_rgb(A, x, y, w, h, dest / f, step))
        assert png_verify(dest / f, A, x, y, w, h, step)
    info = {'concept': 'Graftloom Slipway', 'original': True, 'extent': [W, H], 'seed': SEED, 'engine_commit': 'de109d0131641d6adc8d25bb9ced7ca3d4991105', 'engine_contract': {'setup_sha': '70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9', 'material_catalogue_sha': 'd7a47d60721598a16589daf177a6ff4401b84b43', 'midge_authoring_sha': '228399e38a0e0ab215b9f48698edce67a7a35799', 'midge_hull': [4, 3], 'source_rectangle_limit': 32768, 'json_byte_limit': 1048576, 'source_native_work_limit': 32000000}, 'shepherd_rework_r2': {'changed_cells_final': R2_CHANGED_CELLS, 'objective': 'Mnemonic thalamus, differentiated refinery mechanisms, receiving freight chain, aft salvage and underkeel return'}, 'shepherd_rework_r3': {'changed_cells_final': R3_CHANGED_CELLS, 'objective': 'Rooted twin-lobe examination gantry with preserved north aperture, improved receiving cradle and lower dry extrusion, west assay console and aft extraction; rejected route-sealing enclosed workrooms'}, 'shepherd_rework_r4': {'changed_cells_final': R4_CHANGED_CELLS, 'objective': 'Two side-rooted mnemonic sample docks, enterable dry precision assay/fractionation, anchored aft transfer. Conservative Midge and structural audits mandatory'}, 'structural_reconstruction': {'replaced_unsupported_legacy_cells': REPLACED_UNSUPPORTED_CELLS, 'small_detached_finish_cells_trimmed': REBUILD_DETAIL_TRIM, 'detached_final_cells': FINAL_DETACHED}, 'material_laws': 'All occupied ID entries validated Solid, immovable, RuleKernel::None in accepted catalogue; no initial liquids, powders, fire or living simulation', 'site_coordinates': SITES, 'replay_mismatches': 0, 'overlaps': overlap, 'total_cells': W * H, 'painted_cells': work, 'rectangles': len(rect), 'setup_bytes': len(js), 'histogram': hist, 'grid_sha256': hashlib.sha256(A).hexdigest(), 'setup_sha256': hashlib.sha256(js).hexdigest(), 'clearance': clearance, 'alternate_route_stress': common, 'png_integrity_and_pixel_parity': imgs, 'native_status': 'NATIVE-UNTESTED'}
    (dest / 'qualification.json').write_text(json.dumps(info, indent=2) + '\n')
    (dest / 'seed.txt').write_text(str(SEED) + '\n')
    print(json.dumps({'rectangles': len(rect), 'setup_bytes': len(js), 'occupied': work, 'sites': len(SITES), 'alternate': common, 'gridsha': info['grid_sha256'], 'pngs': len(imgs)}, indent=2))
    return info
if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent)
