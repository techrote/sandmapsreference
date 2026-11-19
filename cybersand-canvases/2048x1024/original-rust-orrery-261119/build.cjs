"use strict";
// RUST ORRERY: an ORIGINAL dead clockwork sky, 2048 x 1024 cells (landscape).
// Fun first, realism second. Floating geometry is intended: the engine supplies a background layer.
// Deterministic builder, no reference art. Gates: site reachability at three hull sizes, reaction guard, exact replay, budget.
// Usage: node build.cjs   (writes setup-rust-orrery.json, stats.json and render/)
const fs = require("fs");
const crypto = require("crypto");
const MATS = require("./materials-table.cjs");
const RPAIRS = new Set(require("./reactive-pairs.json"));
const LIQUID_POLICY = require("./liquid-policy.json");
const W = 2048, H = 1024;
const ENGINE = "018bd09503d7f079ddac52e225c2f7daf8d678bf";
const MIDGE = "c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const SPAWN = [150, 552];
const SUN = [1024, 470], ORBIT = 340;
const NAME = Object.fromEntries(MATS.map((r) => [r[0], r[1]]));
const g = new Uint8Array(W * H);
const I = (x, y) => y * W + x;
const rad = (deg) => (deg * Math.PI) / 180;

// ---------- primitives ----------
function R(x, y, w, h, m) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  const x1 = Math.max(0, x), y1 = Math.max(0, y), x2 = Math.min(W, x + w), y2 = Math.min(H, y + h);
  for (let yy = y1; yy < y2; yy++) g.fill(m, yy * W + x1, yy * W + x2);
}
function disk(cx, cy, r, m) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
      if (x >= 0 && y >= 0 && x < W && y < H && (x - cx) ** 2 + (y - cy) ** 2 <= r * r) g[I(x, y)] = m;
}
function L(x0, y0, x1, y1, th, m) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
  for (let k = 0; k <= n; k++) { const t = k / n; disk(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, th / 2, m); }
}
function P(pts, m) {
  const ys = pts.map((p) => p[1]);
  const lo = Math.max(0, Math.ceil(Math.min(...ys))), hi = Math.min(H - 1, Math.floor(Math.max(...ys)));
  for (let y = lo; y <= hi; y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
    }
    xs.sort((p, q) => p - q);
    for (let j = 0; j + 1 < xs.length; j += 2) R(Math.ceil(xs[j]), y, Math.max(0, Math.floor(xs[j + 1]) - Math.ceil(xs[j]) + 1), 1, m);
  }
}
// A gate ring: an annulus of thickness th. The passage runs along the unit vector (tx, ty); the band is cut for points
// within 30 cells of that line, so a flyer passes straight through the ring's interior.
function gateRing(cx, cy, r, th, tx, ty, bandM, neonM) {
  const nx = -ty, ny = tx;
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
      if (d > r || d < r - th) continue;
      if (Math.abs(dx * nx + dy * ny) < 30) continue;
      g[I(x, y)] = d < r - th + 2 ? neonM : bandM;
    }
}
function chain(x, y0, y1, bead) { // gold chain with beads, from y0 to y1
  L(x, y0, x, y1, 3, 118);
  for (let y = Math.min(y0, y1) + 12; y < Math.max(y0, y1); y += 20) disk(x, y, 3, bead);
}

// ---------- ground: a scrap crust over basalt, obsidian at depth ----------
const groundTop = (x) => Math.round(900 + 6 * Math.sin(x * 0.01) + 4 * Math.sin(x * 0.037));
for (let x = 0; x < W; x++) {
  const top = groundTop(x);
  for (let y = top; y < H; y++) {
    const m = y < top + 18 ? 49 : y < 980 ? 100 : (x * 3 + y * 5) % 173 < 2 ? 101 : 100;
    g[I(x, y)] = m;
  }
}
R(0, 0, 6, H, 101); R(W - 6, 0, 6, H, 101); R(0, H - 6, W, 6, 101);

// ---------- skyline: towers standing on the ground at the two edges, neon windows ----------
function tower(x, w, h, body, neon) {
  const top = 900 - h;
  R(x, top, w, h + 8, body);
  R(x - 3, top - 5, w + 6, 5, 128);
  for (let yy = top + 12; yy < 892; yy += 18) {
    R(x + 6, yy, 8, 8, 120);
    R(x + w - 14, yy + 9, 8, 8, neon);
  }
}
const LEFT_TOWERS = [[0, 58, 170, 64, 77], [70, 40, 236, 62, 77], [120, 58, 140, 64, 77], [190, 46, 224, 62, 77], [248, 62, 176, 64, 77], [322, 40, 250, 62, 77], [374, 70, 196, 64, 77], [456, 44, 240, 62, 77], [512, 30, 120, 64, 77]];
const RIGHT_TOWERS = [[1520, 60, 200, 62, 78], [1590, 46, 240, 64, 78], [1648, 70, 170, 62, 79], [1728, 44, 290, 64, 79], [1782, 62, 210, 62, 78], [1854, 48, 260, 64, 79], [1912, 70, 180, 62, 78], [1990, 58, 150, 64, 79]];
for (const t of [...LEFT_TOWERS, ...RIGHT_TOWERS]) tower(t[0], t[1], t[2], t[3], t[4]);

// ---------- the sun: a steel gear around a uranium core, with twelve teeth ----------
disk(SUN[0], SUN[1], 60, 62);
disk(SUN[0], SUN[1], 46, 63);
disk(SUN[0], SUN[1], 26, 123);
disk(SUN[0], SUN[1], 8, 80);
for (let k = 0; k < 12; k++) {
  const a = rad(k * 30);
  L(SUN[0] + 58 * Math.cos(a), SUN[1] + 58 * Math.sin(a), SUN[0] + 70 * Math.cos(a), SUN[1] + 70 * Math.sin(a), 9, 63);
}

// ---------- the orrery: six gate rings on one orbit around the sun, joined to the sun by spokes ----------
const RINGS = [
  { a: 180, r: 70, band: 123, neon: 77, name: "Ring 180" },
  { a: 240, r: 62, band: 118, neon: 78, name: "Ring 240" },
  { a: 300, r: 66, band: 123, neon: 79, name: "Ring 300" },
  { a: 0, r: 74, band: 118, neon: 77, name: "Ring 0" },
  { a: 60, r: 62, band: 123, neon: 78, name: "Ring 60" },
  { a: 120, r: 70, band: 118, neon: 79, name: "Ring 120" },
];
const ringCentre = (a) => [SUN[0] + ORBIT * Math.cos(rad(a)), SUN[1] + ORBIT * Math.sin(rad(a))];
for (const k of RINGS) {
  const [cx, cy] = ringCentre(k.a);
  const tx = -Math.sin(rad(k.a)), ty = Math.cos(rad(k.a)); // the orbit's tangent: gates open along the orbit
  // spoke from the sun to the ring's sun-facing edge
  const r0 = 72, r1 = ORBIT - k.r - 1;
  L(SUN[0] + r0 * Math.cos(rad(k.a)), SUN[1] + r0 * Math.sin(rad(k.a)), SUN[0] + r1 * Math.cos(rad(k.a)), SUN[1] + r1 * Math.sin(rad(k.a)), 8, 62);
  gateRing(cx, cy, k.r, 14, tx, ty, k.band, k.neon);
}

// ---------- moons on an outer orbit at radius 480 ----------
const moonAt = (a) => [SUN[0] + 480 * Math.cos(rad(a)), SUN[1] + 480 * Math.sin(rad(a))];
{ // heat-shield moon with an LED equator
  const [x, y] = moonAt(150);
  disk(x, y, 34, 131);
  for (let k = 0; k < 8; k++) disk(x + 28 * Math.cos(rad(k * 45)), y + 28 * Math.sin(rad(k * 45)), 2, 80);
}
{ // basalt moon with obsidian craters
  const [x, y] = moonAt(210);
  disk(x, y, 38, 100);
  disk(x - 11, y - 9, 10, 101);
  disk(x + 13, y + 8, 7, 101);
}
{ // polymer moon with a solar band
  const [x, y] = moonAt(330);
  disk(x, y, 32, 128);
  R(x - 26, y - 3, 52, 6, 129);
}

// ---------- gold chains: tethers from the ceiling and from the ground to the rings and moons ----------
chain(854, 0, 176 - 62, 118);
chain(1194, 0, 176 - 66, 118);
chain(608, 0, 230 - 38, 118);
chain(1440, 0, 230 - 32, 118);
chain(854, 764 + 70, 900, 118);
chain(1194, 764 + 62, 900, 118);

// ---------- launch island and its pad ----------
P([[70, 600], [120, 584], [190, 586], [228, 604], [212, 622], [160, 636], [96, 630]], 100);
R(96, 578, 140, 6, 62);
for (let k = 0; k < 5; k++) R(110 + k * 28, 572, 6, 4, 80);

// ---------- coolant bowl: a floating heat-shield dish with water ----------
R(1345, 800, 8, 50, 131); R(1487, 800, 8, 50, 131); R(1345, 842, 150, 8, 63);
R(1353, 812, 134, 30, 3);

// ---------- finish: a gate ring open to the left and right, with a beacon ----------
gateRing(1930, 450, 64, 14, 1, 0, 118, 79);
disk(1930, 378, 8, 123);
disk(1930, 378, 3, 80);

// ---------- scenery: a tilted dish wreck and a crystal rock ----------
P([[258, 196], [336, 164], [350, 182], [270, 214]], 114);
L(300, 214, 292, 236, 4, 62);
P([[280, 226], [312, 222], [318, 244], [286, 252]], 100);
P([[1560, 140], [1600, 118], [1640, 128], [1650, 156], [1600, 170], [1566, 160]], 100);
disk(1606, 146, 6, 122);

// ---------- sites: spawn, ring gates, the inner sky, the pool and the finish ----------
const SITES = [
  ["Launch pad", 150, 552],
  ["Ring 180 gate", 684, 470],
  ["Ring 240 gate", 854, 176],
  ["Ring 300 gate", 1194, 176],
  ["Ring 0 gate", 1364, 470],
  ["Ring 60 gate", 1194, 764],
  ["Ring 120 gate", 854, 764],
  ["Inner sky", 1024, 300],
  ["Pool skim", 1420, 760],
  ["Finish", 1930, 450],
];

// ---------- gates ----------
function flood(fw, fh) {
  const hw = Math.floor(fw / 2), hh = Math.floor(fh / 2), sw = W + 1;
  const sat = new Uint32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let s = 0; for (let x = 0; x < W; x++) { s += g[y * W + x] !== 0 ? 1 : 0; sat[(y + 1) * sw + x + 1] = sat[y * sw + x + 1] + s; } }
  const pass = new Uint8Array(W * H);
  for (let y = hh; y < H - hh; y++) for (let x = hw; x < W - hw; x++) {
    const a = x - hw, b = x + hw, c = y - hh, d = y + hh;
    if (sat[(d + 1) * sw + b + 1] - sat[c * sw + b + 1] - sat[(d + 1) * sw + a] + sat[c * sw + a] === 0) pass[y * W + x] = 1;
  }
  const start = SPAWN[1] * W + SPAWN[0];
  const seen = new Uint8Array(W * H), q = new Int32Array(W * H);
  let r = 0, w = 0;
  if (pass[start]) { q[w++] = start; seen[start] = 1; }
  while (r < w) {
    const v = q[r++], x = v % W, y = (v - x) / W;
    for (const n of [x > 0 ? v - 1 : -1, x < W - 1 ? v + 1 : -1, y > 0 ? v - W : -1, y < H - 1 ? v + W : -1])
      if (n >= 0 && pass[n] && !seen[n]) { seen[n] = 1; q[w++] = n; }
  }
  return { spawnOk: !!pass[start], reach: SITES.map((s) => [s[0], !!seen[s[2] * W + s[1]]]) };
}
const FLOODS = [[19, 15], [23, 19], [31, 27]].map(([fw, fh]) => ({ hull: [fw, fh], ...flood(fw, fh) }));
for (const f of FLOODS) {
  if (!f.spawnOk) throw Error("SPAWN_BLOCKED " + f.hull);
  const miss = f.reach.filter((s) => !s[1]).map((s) => s[0]);
  if (miss.length) throw Error("UNREACHABLE " + f.hull + " " + miss.join(", "));
}

// Floating components are allowed by design (background layer). Count them for the record only.
function floatingComponents() {
  const seen = new Uint8Array(W * H), q = new Int32Array(W * H);
  let comps = 0, cells = 0;
  for (let s = 0; s < W * H; s++) {
    if (!g[s] || seen[s]) continue;
    let r = 0, w = 0, touches = false;
    q[w++] = s; seen[s] = 1;
    while (r < w) {
      const v = q[r++], x = v % W, y = (v - x) / W;
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touches = true;
      for (const n of [x > 0 ? v - 1 : -1, x < W - 1 ? v + 1 : -1, y > 0 ? v - W : -1, y < H - 1 ? v + W : -1])
        if (n >= 0 && g[n] && !seen[n]) { seen[n] = 1; q[w++] = n; }
    }
    if (!touches) { comps++; cells += w; }
  }
  return { components: comps, cells };
}
const floating = floatingComponents();

// Reaction guard: a solid cell touching a conflicting material becomes ReinforcedConcrete (58). Water is never changed.
const nb = (i) => { const x = i % W, y = (i - x) / W, o = []; if (x > 0) o.push(i - 1); if (x < W - 1) o.push(i + 1); if (y > 0) o.push(i - W); if (y < H - 1) o.push(i + W); return o; };
const pk = {}; let pairFixes = 0;
for (let i = 0; i < W * H; i++) {
  if (!g[i] || g[i] === 3) continue;
  for (const n of nb(i)) {
    const key = g[n] ? [NAME[g[i]], NAME[g[n]]].sort().join("|") : null;
    if (key && RPAIRS.has(key)) { pk[key] = (pk[key] || 0) + 1; g[i] = 58; pairFixes++; break; }
  }
}
let pairsLeft = 0;
for (let i = 0; i < W * H; i++) {
  if (!g[i]) continue;
  for (const n of nb(i)) if (g[n] && RPAIRS.has([NAME[g[i]], NAME[g[n]]].sort().join("|"))) pairsLeft++;
}
if (pairsLeft) throw Error("PAIRS_LEFT " + pairsLeft);

// ---------- exact edit list (vertically coalesced runs, lossless) ----------
function compress() {
  const boxes = [], prev = new Map(); let last = prev;
  for (let y = 0; y < H; y++) {
    const next = new Map(), row = y * W; let x = 0;
    while (x < W) {
      const start = x, m = g[row + x]; while (x < W && g[row + x] === m) x++;
      if (m === 0) continue;
      const key = start + "|" + (x - start) + "|" + m, old = last.get(key);
      if (old !== undefined) { boxes[old][3]++; next.set(key, old); }
      else { const idx = boxes.length; boxes.push([start, y, x - start, 1, m]); next.set(key, idx); }
    }
    last = next;
  }
  return boxes;
}
const edits = compress();
const replay = new Uint8Array(W * H);
for (const [x, y, w, h, m] of edits) for (let yy = y; yy < y + h; yy++) replay.fill(m, yy * W + x, yy * W + x + w);
let mismatches = 0; for (let i = 0; i < W * H; i++) if (replay[i] !== g[i]) mismatches++;
if (mismatches) throw Error("REPLAY_MISMATCH " + mismatches);
if (edits.length > 32768) throw Error("RECT_BUDGET " + edits.length);

const setup = {
  version: 2, extent: [W, H],
  actors: [{ id: 1, model: "midge", hash: MIDGE, spawn: SPAWN, options: { budget: 20, mass_multiplier: 1, inertia_multiplier: 1, thrust_multiplier: 1, torque_multiplier: 1, boost_multiplier: 1.8 } }],
  next_id: 2, selected: 1, edits, response: "LA-SELECTIVE", liquid_policy: LIQUID_POLICY, normalize: false, rule_radius: 2, source: [], material: 58, brush: 8, fire: false,
};
const json = JSON.stringify(setup);
if (json.length > 1048576) throw Error("JSON_BUDGET " + json.length);

// ---------- histogram, render and stats ----------
const hist = {};
for (const m of g) hist[m] = (hist[m] || 0) + 1;
const DISTRICTS = [
  ["01-launch-skyline", 0, 420, 512, 384],
  ["02-west-ring", 560, 60, 512, 384],
  ["03-sun-and-spokes", 768, 240, 512, 384],
  ["04-east-ring", 1200, 200, 512, 384],
  ["05-pool-and-finish", 1536, 330, 512, 384],
];
const PRES = require("./presentation.cjs").buildPresentation(g, W, H, SITES, SPAWN, DISTRICTS);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
fs.writeFileSync("setup-rust-orrery.json", json);
fs.mkdirSync("render", { recursive: true });
for (const f of PRES.files) fs.writeFileSync(f.path, f.bytes);
fs.writeFileSync("render/manifest.json", JSON.stringify(PRES.manifest, null, 2) + "\n");
const stats = {
  engine_main: ENGINE, extent: [W, H],
  grid_sha256: sha(Buffer.from(g.buffer)), setup_sha256: sha(Buffer.from(json, "utf8")), setup_bytes: json.length,
  rectangles: edits.length, replay_mismatches: mismatches,
  floating_components: floating, reaction: { fixes: pairFixes, pairs: pk, pairsLeft },
  flood: FLOODS.map((f) => ({ hull: f.hull, reach: f.reach })),
  histogram: hist, sites: SITES,
};
fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2) + "\n");
console.log(JSON.stringify({ rectangles: edits.length, setupBytes: json.length, pairFixes, floating, allReachable: FLOODS.map((f) => f.reach.every((s) => s[1])) }));
