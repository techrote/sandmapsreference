"use strict";
// EXPERIMENT (intentional materials). Occupancy is untouched: only solid IDs are reassigned by district and role.
// Water (3), air (0) and every sited cell keep their occupancy. The reaction guard uses the accepted native pair list.
const MATS = require("./materials-table.cjs");
const RPAIRS = new Set(require("./reactive-pairs.json"));
const NAME = Object.fromEntries(MATS.map((r) => [r[0], r[1]]));
module.exports = function experimentMaterials(a, W, H) {
  // Districts (canvas coordinates). "tissue" is the upper-left filament lattice; "lookout" the east basalt observation;
  // "pool" the gantry over the water; "shaft" everything else.
  const zone = (x, y) => {
    if (x < 430 && y < 960) return "tissue";
    if (x >= 640 && y >= 1150 && y < 1720) return "lookout";
    if (x >= 250 && x < 800 && y >= 1780) return "pool";
    return "shaft";
  };
  // Role table: original material -> material per district (identity where not listed).
  const ROLE = {
    99: { tissue: 92 },                                    // chalk lattice becomes woven wicker: a plaited, organic filament lattice
    62: { shaft: 63, lookout: 117, pool: 66 },             // steel: painted machinery in the shaft, bare iron railings, grating over the water
    122: { shaft: 123, lookout: 123, pool: 123 },          // quartz nodes glow as uranium glass outside the tissue
  };
  const stats = { changed: {}, guardFixes: 0 };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, m = a[i];
    if (m === 0 || m === 3 || !ROLE[m]) continue;
    const to = ROLE[m][zone(x, y)];
    if (to === undefined || to === m) continue;
    a[i] = to;
    const k = m + ">" + to;
    stats.changed[k] = (stats.changed[k] || 0) + 1;
  }
  // Reaction guard: a solid cell touching a conflicting material becomes ReinforcedConcrete (58). Water is never changed.
  const nb = (i) => { const x = i % W, y = (i - x) / W, o = []; if (x > 0) o.push(i - 1); if (x < W - 1) o.push(i + 1); if (y > 0) o.push(i - W); if (y < H - 1) o.push(i + W); return o; };
  for (let i = 0; i < W * H; i++) {
    if (!a[i] || a[i] === 3) continue;
    for (const n of nb(i)) {
      if (a[n] && RPAIRS.has([NAME[a[i]], NAME[a[n]]].sort().join("|"))) { a[i] = 58; stats.guardFixes++; break; }
    }
  }
  let left = 0;
  for (let i = 0; i < W * H; i++) for (const n of nb(i)) if (a[i] && a[n] && RPAIRS.has([NAME[a[i]], NAME[a[n]]].sort().join("|"))) left++;
  if (left) throw Error("EXPERIMENT_PAIRS_LEFT " + left);
  stats.pairsLeft = left;
  return stats;
};
