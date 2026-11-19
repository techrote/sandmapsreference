"use strict";
// RELAY VERGE: an ORIGINAL cyber metal wasteland landscape, 2048 x 1024 cells.
// Deterministic builder: no reference art, no source images. Every structure is placed by the coordinates below.
// Usage: node build.cjs   (writes setup-relay-verge.json, stats.json and render/)
const fs = require("fs");
const crypto = require("crypto");
const MATS = require("./materials-table.cjs");
const RPAIRS = new Set(require("./reactive-pairs.json"));
const LIQUID_POLICY = require("./liquid-policy.json");
const W = 2048, H = 1024;
const ENGINE = "018bd09503d7f079ddac52e225c2f7daf8d678bf";
const MIDGE = "c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const SPAWN = [150, 445];
const NAME = Object.fromEntries(MATS.map((r) => [r[0], r[1]]));
const g = new Uint8Array(W * H);
const I = (x, y) => y * W + x;

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
function dome(cx, cy, rx, ry, m) { // upper half-ellipse sitting on y = cy
  for (let y = Math.floor(cy - ry); y <= cy; y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
      if (x >= 0 && x < W && y >= 0 && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) g[I(x, y)] = m;
}

// ---------- terrain ----------
// Ground surface: low dunes of scrap and ash.
const gy = (x) => Math.round(628 + 14 * Math.sin(x * 0.006) + 8 * Math.sin(x * 0.019 + 2) + 6 * Math.sin(x * 0.051 + 0.7));
for (let x = 0; x < W; x++) {
  const top = gy(x);
  for (let y = top; y < H; y++) {
    const r = y - top;
    let m;
    if (r < 22) { // gabion crust: staggered 44 x 11 cages of rubble with packed-earth mortar
      const off = r < 11 ? 0 : 22;
      m = ((x + off) % 44 === 0 || r % 11 === 0) ? 56 : 112;
    } else if (y < 880) m = 56;               // packed earth
    else if (y < 930) m = 49;                 // slate stratum
    else m = (y > 950 && (x * 5 + y * 3) % 211 < 2) ? 101 : 100; // basalt bedrock with obsidian veins
    g[I(x, y)] = m;
  }
}
// Ash-road crust: the top of the soil is dark asphalt; the deeper soil stays packed earth.
for (let x = 0; x < W; x++) {
  const top = gy(x);
  for (let y = top + 22; y < top + 58 && y < 880; y++) if (g[I(x, y)] === 56) g[I(x, y)] = 59;
}
R(0, 0, 6, H, 101); R(W - 6, 0, 6, H, 101); R(0, H - 6, W, 6, 101); // obsidian world edges

// ---------- culvert and west shaft (carved, then lined) ----------
R(150, 760, 1450, 40, 0);                 // culvert: 40 cells high, x 150..1599
R(556, 600, 40, 200, 0);                  // west shaft from the flats down into the culvert
R(150, 756, 406, 4, 64);                  // corrugated ceiling, west of the shaft
R(596, 756, 1004, 4, 64);                 // corrugated ceiling, east of the shaft
R(150, 800, 1450, 6, 58);                 // reinforced-concrete floor
R(552, 600, 4, 156, 68); R(596, 600, 4, 156, 68); // steel pipe rails above the culvert

// ---------- ground barriers below the flight band: tops stay under y 500, so the band (hull rows 432..458) is never cut ----------
const BARRIERS = [
  { x: 430, w: 30, top: 500, neon: 77 },
  { x: 520, w: 20, top: 492, neon: 77 },
  { x: 620, w: 30, top: 470, neon: 78 },
  { x: 1840, w: 20, top: 500, neon: 79 },
  { x: 1985, w: 20, top: 500, neon: 79 },
];
for (const b of BARRIERS) {
  R(b.x, b.top, b.w, 660 - b.top, 62);   // steel plate frame, sunk into the ground
  R(b.x, b.top, b.w, 10, 64);            // corrugated cap
  R(b.x, 532, b.w, 128, 65);             // rust climbs the lower barrier
  R(b.x, b.top + 10, b.w, 2, b.neon);    // neon strip under the cap
}

// ---------- overhead rig: pendants hang from the world ceiling (y = 0) and stop above y 330, so the flight band stays open ----------
// Relay gantry: a pendant column carries a heat-shield bridge; a relay bowl hangs beneath the bridge.
R(760, 0, 16, 230, 62);
R(700, 230, 140, 26, 131);
R(706, 256, 128, 2, 77);
for (let y = 256; y <= 278; y++) for (let x = 730; x <= 810; x++)
  if (((x - 770) / 40) ** 2 + ((y - 256) / 22) ** 2 <= 1) g[I(x, y)] = 114;
disk(770, 258, 4, 123);
// Beacon pendant: a column to y 300 carrying a uranium beacon and LED lamps.
R(1920, 0, 16, 300, 62);
disk(1928, 309, 9, 123);
R(1920, 302, 16, 3, 80);

// ---------- coolant basin: heat-shield tank with water, low enough to fly over ----------
R(1010, 600, 280, 50, 0);                 // pit into the ground
R(1000, 600, 10, 60, 131); R(1290, 600, 10, 60, 131); // heat-shield tank walls
R(1000, 650, 300, 10, 63);                // painted-steel tank floor
R(1010, 630, 280, 19, 3);                 // coolant water

// ---------- terraces: stepped solar banks with phosphor fronts ----------
const TERRACES = [[1310, 588, 170], [1330, 548, 140], [1350, 510, 110]];
for (const [x, top, w] of TERRACES) { R(x, top, w, 660 - top, 62); R(x + 6, top - 8, w - 12, 8, 129); }
R(1310, 620, 170, 4, 127);

// ---------- ash flats: sheds, a launch pad, a wreck and obsidian shards ----------
const SHEDS = [[200, 80, 70], [300, 56, 50], [380, 70, 78]];
for (const [x, w, h] of SHEDS) {
  const base = gy(x + w / 2) + 4, top = base - h;
  R(x, top, w, h, 64);
  R(x, base - Math.round(h / 3), w, Math.round(h / 3), 65);
  R(x - 4, top - 6, w + 8, 6, 128);
  R(x + 8, top + 12, 14, 10, 120);
}
R(80, gy(120) - 4, 120, 6, 62);           // launch pad
for (let k = 0; k < 4; k++) R(92 + k * 30, gy(120) - 12, 4, 8, 80);
P([[506, 612], [524, 572], [540, 580], [520, 618]], 64); // wreck
P([[250, 640], [262, 612], [274, 640]], 101);           // obsidian shards
P([[1060, 650], [1070, 626], [1080, 650]], 101);

// ---------- derelict scrap-walkers: legged robots left in the ash, legs sunk into the ground ----------
function walker(x, s) {
  const gb = gy(x);
  for (const [x0, x1] of [[x - 8 * s, x - 16 * s], [x + 8 * s, x + 16 * s]]) L(x0, gb - 30 * s, x1, gb + 4, 4 * s, 62);
  R(x - 12 * s, gb - 44 * s, 24 * s, 18 * s, 64);   // corrugated torso
  R(x - 6 * s, gb - 54 * s, 12 * s, 10 * s, 62);    // head block
  R(x - 3 * s, gb - 50 * s, 6 * s, 3 * s, 80);      // lamp
  L(x + 10 * s, gb - 40 * s, x + 30 * s, gb - 22 * s, 3 * s, 62); // arm
  disk(x + 31 * s, gb - 21 * s, 3 * s, 113);        // gripper
}
walker(960, 1.0);
walker(1620, 1.1);
walker(1750, 1.0);

// Fallen relay tower lying on the ash, top kept below y 570.
P([[690, 632], [700, 632], [744, 566], [754, 574], [706, 640], [690, 640]], 65);

// Ceiling pendants: short hung lamps and machines, all ending above y 330.
R(470, 0, 10, 170, 62); R(466, 166, 18, 6, 80);
R(1300, 0, 8, 210, 62); R(1288, 210, 32, 26, 128); disk(1304, 240, 5, 80);
R(1640, 0, 8, 130, 62); R(1632, 130, 24, 14, 129);

// ---------- wasteland dressing on the ash: rubble heaps, a half-buried car, a pylon stump ----------
function heap(x, rx, ry) {
  const gb = gy(x);
  for (let y = Math.floor(gb - ry); y <= gb; y++)
    for (let xx = Math.floor(x - rx); xx <= Math.ceil(x + rx); xx++)
      if (((xx - x) / rx) ** 2 + ((y - gb) / ry) ** 2 <= 1) g[I(xx, y)] = 112;
}
heap(500, 16, 9);
heap(905, 22, 11);
heap(1700, 26, 12);
function car(x) {
  const gb = gy(x);
  R(x, gb - 18, 40, 14, 64);              // corrugated body
  R(x + 10, gb - 26, 18, 9, 62);          // cabin frame
  disk(x + 9, gb - 2, 7, 73);             // rubber wheels, sunk into the ash
  disk(x + 31, gb - 2, 7, 73);
}
car(1520);
R(846, gy(850) - 40, 10, 44, 62);         // pylon stump
R(846, gy(850) - 42, 10, 3, 80);

// Ceiling cables carrying aluminium pods; each cable reaches the ceiling and each pod sits above y 265.
L(560, 0, 560, 236, 3, 74); disk(560, 250, 14, 114);
L(1020, 0, 1020, 190, 3, 74); disk(1020, 202, 12, 114);
L(1450, 0, 1450, 150, 3, 74); disk(1450, 160, 10, 114);

// ---------- sites and gates ----------
const SITES = [
  ["Launch pad", 150, 445],
  ["Ash gap", 560, 445],
  ["Upper sky lane", 300, 110],
  ["Relay approach", 770, 360],
  ["Basin pass", 1140, 445],
  ["Terrace gap", 1595, 445],
  ["Culvert junction", 700, 780],
  ["Culvert east", 1480, 780],
  ["Beacon finish", 1930, 445],
];

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
  return { spawnOk: !!pass[start], reach: SITES.map((s) => [s[0], !!seen[s[2] * W + s[1]]]), count: w };
}
const FLOODS = [[19, 15], [23, 19], [31, 27]].map(([fw, fh]) => ({ hull: [fw, fh], ...flood(fw, fh) }));
for (const f of FLOODS) {
  if (!f.spawnOk) throw Error("SPAWN_BLOCKED " + f.hull);
  const miss = f.reach.filter((s) => !s[1]).map((s) => s[0]);
  if (miss.length) throw Error("UNREACHABLE " + f.hull + " " + miss.join(", "));
}

// Grounding: every solid cell must connect to a world edge through solids.
function ungrounded() {
  const gr = new Uint8Array(W * H), q = new Int32Array(W * H);
  let r = 0, w = 0;
  const push = (i) => { if (g[i] && !gr[i]) { gr[i] = 1; q[w++] = i; } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (r < w) {
    const v = q[r++], x = v % W, y = (v - x) / W;
    if (x > 0) push(v - 1); if (x < W - 1) push(v + 1); if (y > 0) push(v - W); if (y < H - 1) push(v + W);
  }
  let n = 0; for (let i = 0; i < W * H; i++) if (g[i] && !gr[i]) n++;
  return n;
}
const floating = ungrounded();
if (floating) throw Error("UNGROUNDED_SOLIDS " + floating);

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
  ["01-ash-flats", 0, 380, 512, 384],
  ["02-relay-gantry", 560, 40, 512, 384],
  ["03-coolant-basin", 960, 420, 512, 384],
  ["04-terrace-run", 1280, 380, 512, 384],
  ["05-beacon-finish", 1536, 190, 512, 384],
];
const PRES = require("./presentation.cjs").buildPresentation(g, W, H, SITES, SPAWN, DISTRICTS);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
fs.writeFileSync("setup-relay-verge.json", json);
fs.mkdirSync("render", { recursive: true });
for (const f of PRES.files) fs.writeFileSync(f.path, f.bytes);
fs.writeFileSync("render/manifest.json", JSON.stringify(PRES.manifest, null, 2) + "\n");
const stats = {
  engine_main: ENGINE, extent: [W, H],
  grid_sha256: sha(Buffer.from(g.buffer)), setup_sha256: sha(Buffer.from(json, "utf8")), setup_bytes: json.length,
  rectangles: edits.length, replay_mismatches: mismatches, ungrounded_solids: floating,
  reaction: { fixes: pairFixes, pairs: pk, pairsLeft },
  flood: FLOODS.map((f) => ({ hull: f.hull, reach: f.reach })),
  histogram: hist, sites: SITES,
};
fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2) + "\n");
console.log(JSON.stringify({ rectangles: edits.length, setupBytes: json.length, pairFixes, ungrounded: floating, allReachable: FLOODS.map((f) => f.reach.every((s) => s[1])) }));
