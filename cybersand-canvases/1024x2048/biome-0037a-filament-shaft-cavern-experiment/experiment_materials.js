"use strict";
// EXPERIMENT v2 (intentional materials). Occupancy is untouched: only solid IDs are reassigned.
// Water (3), air (0) and every occupied cell keep their occupancy. Each rule is structural (neighbour counts or
// surface runs), so every marked pattern can be explained by the geometry it marks.
const JUNCTION_MIN_DEPTH = 8;
const MATS = require("./materials-table.cjs");
const RPAIRS = new Set(require("./reactive-pairs.json"));
const NAME = Object.fromEntries(MATS.map((r) => [r[0], r[1]]));
module.exports = function experimentMaterials(a, W, H) {
  const I = (x, y) => y * W + x;
  // Districts (canvas coordinates): "tissue" is the upper-left filament lattice; "lookout" the east basalt observation;
  // "pool" the gantry over the water; "shaft" everything else.
  const zone = (x, y) => {
    if (x < 430 && y < 960) return "tissue";
    if (x >= 640 && y >= 1150 && y < 1720) return "lookout";
    if (x >= 250 && x < 800 && y >= 1780) return "pool";
    return "shaft";
  };
  const stats = { role: {}, rules: {}, guardFixes: 0 };
  const bump = (bucket, k) => { stats[bucket][k] = (stats[bucket][k] || 0) + 1; };
  const set = (i, to, bucket, label) => { a[i] = to; bump(bucket, label); };
  const nb = (x, y) => { const o = []; if (x > 0) o.push(I(x - 1, y)); if (x < W - 1) o.push(I(x + 1, y)); if (y > 0) o.push(I(x, y - 1)); if (y < H - 1) o.push(I(x, y + 1)); return o; };

  // Phase A: district role table. Water and air are never touched.
  const ROLE = {
    99: { tissue: 92 },                          // chalk lattice becomes woven wicker: a plaited, organic filament lattice
    62: { shaft: 63, lookout: 117, pool: 66 },   // steel: painted machinery in the shaft, grating over the water
    122: { shaft: 123, lookout: 123, pool: 123 },// quartz nodes glow as uranium glass outside the tissue
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = I(x, y), m = a[i];
    if (m === 0 || m === 3 || !ROLE[m]) continue;
    const to = ROLE[m][zone(x, y)];
    if (to === undefined || to === m) continue;
    set(i, to, "role", m + ">" + to);
  }

  // Phase B1: strand junctions. The wicker mask is thinned to a one-cell skeleton (Zhang-Suen). Skeleton pixels with three or
  // more skeleton neighbours are real strand crossings; each crossing gets a 2x2 uranium-glass node. Counts are reported.
  const wmask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) wmask[i] = a[i] === 92 ? 1 : 0;
  const N8 = (i) => { const x = i % W, y = (i - x) / W; return [i - W, i - W + 1, i + 1, i + W + 1, i + W, i + W - 1, i - 1, i - W - 1].map((v, k) => {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1][k], dy = [-1, -1, 0, 1, 1, 1, 0, -1][k];
    return x + dx >= 0 && x + dx < W && y + dy >= 0 && y + dy < H ? v : -1; }); };
  const thin = () => {
    let changed = true, rounds = 0;
    while (changed) {
      changed = false; rounds++;
      for (let step = 0; step < 2; step++) {
        const kill = [];
        for (let i = 0; i < W * H; i++) {
          if (!wmask[i]) continue;
          const nn = N8(i);
          const p = nn.map((n) => (n >= 0 ? wmask[n] : 0)); // p[0]=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
          const B = p.reduce((s, v) => s + v, 0);
          if (B < 2 || B > 6) continue;
          let A = 0; for (let k = 0; k < 8; k++) if (p[k] === 0 && p[(k + 1) % 8] === 1) A++;
          if (A !== 1) continue;
          if (step === 0) { if (p[0] * p[2] * p[4] !== 0 || p[2] * p[4] * p[6] !== 0) continue; }
          else { if (p[0] * p[2] * p[6] !== 0 || p[0] * p[4] * p[6] !== 0) continue; }
          kill.push(i);
        }
        for (const i of kill) wmask[i] = 0;
        if (kill.length) changed = true;
      }
    }
    return rounds;
  };
  const thinRounds = thin();
  const junctions = [];
  // Depth: distance from the wicker surface. Only thick hubs count; thin skeleton spurs are not junctions.
  const depth = new Int32Array(W * H).fill(-1); const dq = new Int32Array(W * H); let dr = 0, dw = 0;
  for (let i = 0; i < W * H; i++) if (a[i] !== 92) { depth[i] = 0; dq[dw++] = i; }
  while (dr < dw) { const v = dq[dr++], vx = v % W, vy = (v - vx) / W; for (const n of nb(vx, vy)) if (depth[n] < 0) { depth[n] = depth[v] + 1; dq[dw++] = n; } }
  for (let i = 0; i < W * H; i++) {
    if (!wmask[i]) continue;
    if (N8(i).reduce((s, n) => s + (n >= 0 ? wmask[n] : 0), 0) >= 3 && depth[i] >= JUNCTION_MIN_DEPTH) junctions.push(i);
  }
  for (const j of junctions) {
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const x = j % W + dx, y = Math.floor(j / W) + dy;
      if (x < W && y < H && a[I(x, y)] === 92) set(I(x, y), 123, "rules", "strand junction node (92>123)");
    }
  }
  stats.thinRounds = thinRounds;
  stats.junctions = junctions.length;

  // Phase B2: tissue rind. Remaining wicker cells that touch air are wrapped in a pale limestone skin.
  const rind = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (a[I(x, y)] !== 92) continue;
    if (nb(x, y).some((n) => a[n] === 0)) rind.push(I(x, y));
  }
  for (const i of rind) set(i, 38, "rules", "tissue rind (92>38)");

  // Phase B3: lookout walkways. In the lookout, a horizontal run of slate or basalt at least 40 cells long with open air
  // directly above is a walkway deck; that top row is plated in zinc sheet.
  const deck = (m) => m === 49 || m === 100;
  for (let y = 1151; y < 1720; y++) {
    let x = 640;
    while (x < 1024) {
      const ok = (xx) => deck(a[I(xx, y)]) && a[I(xx, y - 1)] === 0 && zone(xx, y) === "lookout";
      if (!ok(x)) { x++; continue; }
      let x2 = x;
      while (x2 < 1024 && ok(x2)) x2++;
      if (x2 - x >= 12) for (let k = x; k < x2; k++) set(I(k, y), 113, "rules", "lookout walkway (slate/basalt>113)");
      x = x2;
    }
  }

  // Phase B4: shaft landings. A run of painted steel at least 4 cells long with open air above is a landing edge, marked with hazard stripe.
  for (let y = 1; y < H; y++) {
    let x = 0;
    while (x < W) {
      const ok = (xx) => a[I(xx, y)] === 63 && zone(xx, y) === "shaft" && a[I(xx, y - 1)] === 0;
      if (!ok(x)) { x++; continue; }
      let x2 = x;
      while (x2 < W && ok(x2)) x2++;
      if (x2 - x >= 4) for (let k = x; k < x2; k++) set(I(k, y), 76, "rules", "shaft landing hazard (63>76)");
      x = x2;
    }
  }

  // Phase B5: pool coping. Solid rock or gantry in the pool district that touches the water is capped with painted steel, the
  // metal edge a wet gantry would need. Bare iron is avoided here: it reacts with water. Water is never changed.
  const coping = [];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = I(x, y);
    if (zone(x, y) !== "pool" || !a[i] || a[i] === 3 || a[i] === 0) continue;
    if (nb(x, y).some((n) => a[n] === 3)) coping.push(i);
  }
  for (const i of coping) set(i, 63, "rules", "pool coping (touching water>63)");

  // Reaction guard: a solid cell touching a conflicting material becomes ReinforcedConcrete (58). Water is never changed.
  for (let i = 0; i < W * H; i++) {
    if (!a[i] || a[i] === 3) continue;
    const x = i % W, y = (i - x) / W;
    for (const n of nb(x, y)) {
      if (a[n] && RPAIRS.has([NAME[a[i]], NAME[a[n]]].sort().join("|"))) { a[i] = 58; stats.guardFixes++; break; }
    }
  }
  let left = 0;
  for (let i = 0; i < W * H; i++) {
    if (!a[i]) continue;
    const x = i % W, y = (i - x) / W;
    for (const n of nb(x, y)) if (a[n] && RPAIRS.has([NAME[a[i]], NAME[a[n]]].sort().join("|"))) left++;
  }
  if (left) throw Error("EXPERIMENT_PAIRS_LEFT " + left);
  stats.pairsLeft = left;
  return stats;
};
