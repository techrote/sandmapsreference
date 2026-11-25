#!/usr/bin/env python3
"""Freeze conservative original-map paths for paired real Midge route probes.

Planning uses every nonzero material as blocked and a six-cell margin; this is
only a waypoint proposal, never native reachability evidence. Exact named-site
destinations and authored spawn are retained. Candidates receive the identical
original-derived path, so their own geometry cannot steer the comparison.
Generation requires numpy/scipy; execution of the saved JSON does not.
"""
import argparse
import hashlib
import heapq
import json
import math
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter

SPECS = {
    "B1": [("receiver", ["West arrival booth", "First component switch", "Reclaim crossways", "Machine transit", "Press receiver"])],
    "B2": [("apparatus", ["spawn_quarantine", "quarantine_gate", "specimen_desk", "west_tower", "rotor_west_gate", "central_inspection"])],
    "B3": [("north", ["West ignition nest", "West pressure latch", "West bearing", "Vault one crown", "Vault one switch", "North tri-vault throat", "Triple vault skylane"]),
           ("south", ["West ignition nest", "West pressure latch", "West bearing", "Vault one crown", "Vault one switch", "South tri-vault bypass", "Central bypass wicket"])],
    "D1": [("gallery", ["Upper fault spawn", "Upper bridge landing", "Mid fault exchange", "East drill bypass upper", "East drill bypass middle", "East drill bypass lower"])],
    "D2": [("press", ["Arrival Mooring", "Entered Salvage Hold", "Lift Seam", "Press Threshold", "Press Chamber"])],
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def plane(recipe):
    width, height = recipe["extent"]
    grid = np.zeros((height, width), dtype=np.uint8)
    for x, y, w, h, material in recipe["edits"]:
        grid[y:y+h, x:x+w] = material
    return grid


def clear_line(a, b, blocked):
    steps = max(abs(a[0]-b[0]), abs(a[1]-b[1]))
    for i in range(int(steps)+1):
        t = i/max(1, steps)
        x, y = round(a[0]+(b[0]-a[0])*t), round(a[1]+(b[1]-a[1])*t)
        if blocked[y, x]:
            return False
    return True


def leg(start, goal, blocked):
    step = 4
    rows, cols = blocked.shape
    if blocked[start[1], start[0]] or blocked[goal[1], goal[0]]:
        raise ValueError("Exact named endpoint fails conservative six-cell margin")
    s, t = tuple(round(x/step) for x in start), tuple(round(x/step) for x in goal)
    if not clear_line(start, (s[0]*step, s[1]*step), blocked) or not clear_line((t[0]*step, t[1]*step), goal, blocked):
        raise ValueError("Exact named endpoint cannot connect to conservative planner grid")
    queue = [(0.0, s)]
    cost = {s: 0.0}
    prev = {}
    reached = False
    while queue:
        _, p = heapq.heappop(queue)
        if p == t:
            reached = True
            break
        for dx, dy in ((-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)):
            q = (p[0]+dx, p[1]+dy)
            x, y = q[0]*step, q[1]*step
            if x < 0 or y < 0 or x >= cols or y >= rows or blocked[y, x]:
                continue
            if not clear_line((p[0]*step,p[1]*step),(x,y),blocked):
                continue
            new = cost[p]+math.hypot(dx,dy)
            if new < cost.get(q, float("inf")):
                cost[q] = new
                prev[q] = p
                heapq.heappush(queue,(new+math.hypot(q[0]-t[0],q[1]-t[1]),q))
    if not reached:
        raise ValueError("No conservative original-plane path to exact named site")
    rev = [t]
    while rev[-1] != s:
        rev.append(prev[rev[-1]])
    raw = [tuple(start)] + [(p[0]*step,p[1]*step) for p in reversed(rev)] + [tuple(goal)]
    # Greedy line of sight simplification, capped at 160 cells, maintains the
    # same static clearance and lets the real pilot achieve useful speeds.
    points = [raw[0]]
    i = 0
    while i < len(raw)-1:
        j = i+1
        while j+1 < len(raw) and math.dist(raw[i],raw[j+1]) <= 160 and clear_line(raw[i],raw[j+1],blocked):
            j += 1
        if raw[j] != points[-1]:
            points.append(raw[j])
        i = j
    return points


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--package", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    if args.out.exists():
        raise ValueError("Refuse replacing a frozen route proposal")
    routes, refusals = [], []
    for arm, specs in SPECS.items():
        base = args.package/"maps"/arm
        fixture = json.loads((base/"fixture.json").read_text())
        original = base/"original/setup.json"
        recipe = json.loads(original.read_text())
        blocked = maximum_filter(plane(recipe) != 0, size=13, mode="constant", cval=1)
        named = {p["id"]:p["xy"] for p in fixture["points"]}
        for name, via in specs:
            try:
                points = [tuple(recipe["actors"][0]["spawn"])]
                if list(points[0]) != named[via[0]]:
                    raise ValueError("Named route does not begin at authored spawn")
                for destination in via[1:]:
                    points += leg(points[-1], tuple(named[destination]), blocked)[1:]
            except ValueError as exc:
                refusals.append({"arm":arm,"name":name,"reason":str(exc),"via":via,
                                 "status":"planner_refusal_not_native_failure","original_sha256":sha(original)})
                continue
            variants = ["original", "candidate"] + (["reference"] if (base/"reference/setup.json").exists() else [])
            for variant in variants:
                setup = base/variant/"setup.json"
                routes.append({"id":f"{arm.lower()}-{name}-{variant}","setup_id":f"trial-{arm}-{variant}",
                               "setup_sha256":sha(setup),"planner_source_sha256":sha(original),
                               "route_fixture_sha256":sha(base/"fixture.json"),"named_sites":via,
                               "waypoints":points,"waypoint_radius":7.0,"speed_limit":55.0 if arm=="B3" else 40.0,
                               "max_ticks":9000,"max_wall_ms":240000,"stuck_ticks":900,
                               "scope":"Same frozen original-derived path for all variants; actual route result must come from native probe."})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"schema":"goldmaps.native-routes.v1","planner":"A* four-cell grid, six-cell all-nonzero margin, line-of-sight simplification",
                                    "routes":routes,"planner_refusals":refusals},indent=2)+"\n")
    print(json.dumps({"routes":len(routes),"planner_refusals":refusals,"output_sha256":sha(args.out)}))


if __name__ == "__main__":
    main()
