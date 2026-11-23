"""Independent, read-only Goldmaps material replay and source identities.

This implementation does not import historical creators or validators. Empty
cells are explicit zeroes in a complete row-major uint8 plane. Replaying a map
is not running CyberSand, and geometry connectivity is not a flight result.
"""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path, PurePosixPath

import numpy as np
from PIL import Image
from scipy import ndimage

ENGINE = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
LEDGER = "5982fa553bc6356742cfea0911c848c372dcdb97"
RECOVERY = "6c4edd3d05476848cbebb800090080ae824ad208"
ROOT_KEYS = frozenset("version extent actors next_id selected edits response liquid_policy normalize rule_radius source material brush fire".split())
FOUR = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=bool)
ENVELOPES = ((19, 15), (23, 19), (31, 27))


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def git_blob(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()


def json_load(path: Path):
    def reject(value):
        raise ValueError(f"Non-finite JSON constant: {value}")
    return json.loads(path.read_text(encoding="utf-8"), parse_constant=reject)


def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def safe_relative(value: str) -> Path:
    if "\\" in value:
        raise ValueError("Backslash is not a portable corpus path")
    path = PurePosixPath(value)
    if path.is_absolute() or any(p in ("..", ".") for p in path.parts) or not path.parts or ":" in path.parts[0]:
        raise ValueError("Corpus paths must be safe relative paths")
    return Path(*path.parts)


def source_dir(root: Path, pr: int, head: str | None = None) -> Path:
    choices = sorted(root.glob(f"PR-{pr:04d}-*"))
    if head:
        choices = [p for p in choices if p.name == f"PR-{pr:04d}-{head[:12]}"]
    if len(choices) != 1:
        raise ValueError(f"Need one exact archived PR{pr} source, found {len(choices)}")
    return choices[0]


def int_value(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value != int(value):
        raise ValueError(f"Expected finite integer, got {value!r}")
    return int(value)


def decode_setup(path: Path, legal_ids=None):
    raw = path.read_bytes()
    if len(raw) > 1048576:
        raise ValueError("Setup exceeds the pinned 1 MiB input budget")
    setup = json_load(path)
    if not isinstance(setup, dict) or setup.get("version") != 2:
        raise ValueError("Expected a plain Setup-v2; no generated base may be invented")
    if set(setup) not in (ROOT_KEYS, ROOT_KEYS | {"equipment"}):
        raise ValueError("Setup-v2 root fields differ from pinned contract")
    extent = setup["extent"]
    if not isinstance(extent, list) or len(extent) != 2:
        raise ValueError("Invalid extent")
    width, height = map(int_value, extent)
    if any(n < 512 or n > 2048 or n % 64 for n in (width, height)):
        raise ValueError("Extent exceeds accepted side/multiple limits")
    edits = setup["edits"]
    if not isinstance(edits, list) or len(edits) > 32768:
        raise ValueError("Invalid stamp list or capacity")
    valid = set(legal_ids) if legal_ids is not None else set(range(132)) - {10}
    if setup["source"] != []:
        raise ValueError("Nonempty source array requires separate source semantics")
    actors = setup["actors"]
    if not isinstance(actors, list) or len(actors) > 8:
        raise ValueError("Actor count invalid")
    next_id = int_value(setup["next_id"])
    ids = set()
    for actor in actors:
        aid = int_value(actor["id"])
        if aid in ids or not 1 <= aid < next_id:
            raise ValueError("Actor identities invalid")
        ids.add(aid)
        spawn = actor["spawn"]
        if not isinstance(spawn, list) or len(spawn) != 2 or any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v) for v in spawn):
            raise ValueError("Actor spawn invalid")
        if actor["model"] == "midge" and not (2 <= spawn[0] <= width - 2 and 1.5 <= spawn[1] <= height - 1.5):
            raise ValueError("Midge continuous hull outside extent")
    if int_value(setup["selected"]) not in ids | {0}:
        raise ValueError("Selected actor absent")
    if setup["response"] not in ("LA-SELECTIVE", "LA", "LA-EVENT-OFF", "RFT"):
        raise ValueError("Invalid response")
    if any(not isinstance(setup[k], bool) for k in ("normalize", "fire")):
        raise ValueError("Invalid boolean option")
    if int_value(setup["rule_radius"]) not in (2, 3) or not 2 <= int_value(setup["brush"]) <= 24:
        raise ValueError("Invalid radius or brush")
    policy = setup["liquid_policy"]
    if not isinstance(policy, list) or not 1 <= len(policy) <= 4096 or any(not -2147483648 <= int_value(n) <= 2147483647 for n in policy):
        raise ValueError("Invalid liquid policy")
    plane = bytearray(width * height)
    visits = np.zeros((height, width), dtype=np.uint32)
    stamp_area = 0
    for number, edit in enumerate(edits):
        if not isinstance(edit, list) or len(edit) not in (4, 5):
            raise ValueError(f"Invalid stamp {number}")
        values = list(map(int_value, edit))
        x, y, material = values[0], values[1], values[-1]
        if material not in valid or not (0 <= x < width and 0 <= y < height):
            raise ValueError(f"Illegal material or origin at stamp {number}")
        if len(values) == 5:
            w, h = values[2:4]
            if w <= 0 or h <= 0 or x + w > width or y + h > height:
                raise ValueError(f"Invalid rectangle bounds at stamp {number}")
            fill = bytes([material]) * w
            for yy in range(y, y + h):
                plane[yy * width + x:yy * width + x + w] = fill
            visits[y:y+h, x:x+w] += 1
            stamp_area += w*h
        else:
            radius = values[2]
            if not 2 <= radius <= 24:
                raise ValueError(f"Invalid disc radius at stamp {number}")
            # Brute integer circle predicate is intentionally independent of
            # the historical validator's square-root/range implementations.
            for yy in range(max(0, y-radius), min(height, y+radius+1)):
                for xx in range(max(0, x-radius), min(width, x+radius+1)):
                    if (xx-x)**2 + (yy-y)**2 <= radius**2:
                        plane[yy*width+xx] = material
                        visits[yy,xx] += 1
                        stamp_area += 1
    grid = np.frombuffer(bytes(plane), dtype=np.uint8).reshape(height, width)
    rectangle_count = 0
    previous = set()
    for row in grid:
        ends = np.concatenate(([0], np.flatnonzero(row[1:] != row[:-1])+1, [width]))
        current = {(int(a),int(b-a),int(row[a])) for a,b in zip(ends[:-1],ends[1:]) if row[a]}
        rectangle_count += len(current-previous)
        previous = current
    if rectangle_count > 32768:
        raise ValueError("Coalesced rectangle capacity exceeded")
    values, counts = np.unique(grid, return_counts=True)
    report = {
        "setup_sha256": digest(raw), "git_blob_sha1": git_blob(raw),
        "setup_bytes": len(raw), "extent": [width, height],
        "full_plane_cells": width*height, "plane_sha256": digest(bytes(plane)),
        "stamp_count": len(edits), "stamp_area": stamp_area,
        "coalesced_rectangles": rectangle_count,
        "overlapped_cells": int(np.count_nonzero(visits > 1)),
        "maximum_write_visits": int(visits.max()),
        "unwritten_empty_cells": int(np.count_nonzero(visits == 0)),
        "occupied_cells": int(np.count_nonzero(grid)),
        "materials": {str(int(v)): int(n) for v,n in zip(values,counts)},
        "interpretation": "Complete source-static replay; overlapping writes follow ordered last-write-wins, not an automatic defect.",
    }
    return setup, grid, report


def clear_centres(blocked, width, height):
    """Exact conservative envelope using summed-area windows, exterior blocked."""
    if width % 2 != 1 or height % 2 != 1:
        raise ValueError("Conservative integer envelopes must have odd sizes")
    padded = np.pad(blocked.astype(np.int64), ((height//2, height//2), (width//2, width//2)), constant_values=1)
    integral = np.pad(padded, ((1,0),(1,0))).cumsum(0).cumsum(1)
    counts = integral[height:,width:] - integral[:-height,width:] - integral[height:,:-width] + integral[:-height,:-width]
    return counts == 0


def connectivity(grid, fixture, hard_ids):
    rows = []
    cases = [("normal-nonempty", grid != 0), ("normal-hard-surface", np.isin(grid,list(hard_ids)))]
    for obstruction in fixture.get("obstruction_cases", []):
        mask = grid != 0
        x,y,w,h = obstruction["rect"]
        mask[y:y+h,x:x+w] = True
        cases.append(("obstruction:" + obstruction["id"],mask))
    for name,mask in cases:
        for width,height in ENVELOPES:
            labels, _ = ndimage.label(clear_centres(mask,width,height), FOUR)
            sx,sy = fixture["spawn"]
            start = int(labels[sy,sx])
            reached, blocked = [], []
            for point in fixture["points"]:
                x,y = point["xy"]
                label = int(labels[y,x])
                if not label:
                    blocked.append(point["id"])
                if start and label == start:
                    reached.append(point["id"])
            pointmap = {p["id"]:p["xy"] for p in fixture["points"]}
            graph_results = []
            for graph, chain in fixture.get("original_route_graphs",{}).items():
                sequences = chain if chain and isinstance(chain[0],list) else [chain]
                for i, sequence in enumerate(sequences):
                    unresolved = sorted(set(sequence)-pointmap.keys())
                    leg_failures = []
                    for a,b in zip(sequence,sequence[1:]):
                        if a not in pointmap or b not in pointmap:
                            continue
                        ax,ay = pointmap[a]; bx,by = pointmap[b]
                        if not labels[ay,ax] or labels[ay,ax] != labels[by,bx]:
                            leg_failures.append([a,b])
                    graph_results.append({"graph":graph,"sequence":i,"unresolved_names":unresolved,"failed_legs":leg_failures})
            rows.append({"case":name,"envelope":[width,height],"spawn_clear":bool(start),"reachable":reached,"blocked_centres":blocked,"declared_graphs":graph_results})
    return rows


def support(grid, hard_ids, all_boundaries=False):
    labels,n = ndimage.label(np.isin(grid,list(hard_ids)), FOUR)
    roots = set(map(int,labels[-1]))-{0}
    if all_boundaries:
        for edge in (labels[0],labels[:,0],labels[:,-1]):
            roots.update(set(map(int,edge))-{0})
    unsupported = (labels != 0) & ~np.isin(labels,list(roots))
    return {"components":int(n),"unrooted_cells":int(unsupported.sum()),"anchor_policy":"four boundaries" if all_boundaries else "bottom boundary","caveat":"Composition witness only; anchored cells do not prove structural strength or machinery operation."}, unsupported


def image_parity(path, grid, index_map=None, palette=None):
    with Image.open(path) as image:
        result = {"file":path.name,"sha256":digest(path.read_bytes()),"mode":image.mode,"size":list(image.size)}
        if image.size != (grid.shape[1],grid.shape[0]):
            return result | {"status":"DIMENSION_MISMATCH"}
        if image.mode == "P":
            actual = np.asarray(image)
            if index_map is not None:
                used = set(map(int,np.unique(actual)))
                if used-set(index_map):
                    return result | {"status":"UNDECLARED_INDEX","indices":sorted(used-set(index_map))}
                lut = np.zeros(256,dtype=np.uint8)
                for index,material in index_map.items():
                    lut[index] = material
                actual = lut[actual]
            mismatch = int(np.count_nonzero(actual != grid))
            return result | {"status":"PASS" if mismatch==0 else "FAIL","mismatch_cells":mismatch,"method":"declared palette-index mapping" if index_map else "literal material IDs"}
        if palette is None:
            return result | {"status":"UNKNOWN_ENCODING","mismatch_cells":None}
        lut = np.zeros((256,4),dtype=np.uint8);lut[:,3]=255
        for material,colour in palette.items():
            lut[int(material),:len(colour)] = colour
        mismatch = int(np.count_nonzero(np.any(np.asarray(image.convert("RGBA")) != lut[grid],axis=2)))
        return result | {"status":"PASS" if mismatch==0 else "FAIL","mismatch_cells":mismatch,"method":"explicit RGBA palette"}
