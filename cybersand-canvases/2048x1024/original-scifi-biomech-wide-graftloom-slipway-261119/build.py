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
    info = {'concept': 'Graftloom Slipway', 'original': True, 'extent': [W, H], 'seed': SEED, 'engine_commit': '018bd09503d7f079ddac52e225c2f7daf8d678bf', 'engine_contract': {'setup_sha': '70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9', 'material_catalogue_sha': 'd7a47d60721598a16589daf177a6ff4401b84b43', 'midge_authoring_sha': '228399e38a0e0ab215b9f48698edce67a7a35799', 'midge_hull': [4, 3], 'source_rectangle_limit': 32768, 'json_byte_limit': 1048576, 'source_native_work_limit': 32000000}, 'material_laws': 'All occupied ID entries validated Solid, immovable, RuleKernel::None in accepted catalogue; no initial liquids, powders, fire or living simulation', 'site_coordinates': SITES, 'replay_mismatches': 0, 'overlaps': overlap, 'total_cells': W * H, 'painted_cells': work, 'rectangles': len(rect), 'setup_bytes': len(js), 'histogram': hist, 'grid_sha256': hashlib.sha256(A).hexdigest(), 'setup_sha256': hashlib.sha256(js).hexdigest(), 'clearance': clearance, 'alternate_route_stress': common, 'png_integrity_and_pixel_parity': imgs, 'native_status': 'NATIVE-UNTESTED'}
    (dest / 'qualification.json').write_text(json.dumps(info, indent=2) + '\n')
    (dest / 'seed.txt').write_text(str(SEED) + '\n')
    print(json.dumps({'rectangles': len(rect), 'setup_bytes': len(js), 'occupied': work, 'sites': len(SITES), 'alternate': common, 'gridsha': info['grid_sha256'], 'pngs': len(imgs)}, indent=2))
    return info
if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent)
