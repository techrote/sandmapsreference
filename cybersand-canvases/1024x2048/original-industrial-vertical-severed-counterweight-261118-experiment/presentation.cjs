// R8 presentation-only renderer. Pure function of the exact material grid built by build.cjs.
// It never edits the grid, the setup JSON, the edit list, the actor envelopes or any gate.
// Colours and per-material variation mirror CyberSand's presentation-only appearance atlas
// (godot/scripts/material_appearance_lut.gd, engine main 018bd09503d7f079ddac52e225c2f7daf8d678bf).
// Finish families approximate that atlas's flair classes (slate, concrete, metal plate, glass).
// Node built-ins only: zlib and crypto.
"use strict";
const zlib = require("zlib");
const crypto = require("crypto");

const RENDER_VERSION = "r8-presentation-1";
let W = 2048, H = 1024;
const SEED = 0x20261119;

// sRGB base colours and value variation for every material (materials-table.cjs, from the accepted engine LUT).
const TABLE = require("./materials-table.cjs");
const BASE = {}, VAR = {};
for (const [id, , rgb, v] of TABLE) { BASE[id] = rgb; VAR[id] = v; }
const AIR = [8, 11, 18];

// ---------- deterministic hashing / noise (integer only, identical on every platform) ----------
function h2(ix, iy, s) {
  let h = (Math.imul(ix | 0, 0x27d4eb2d) ^ Math.imul(iy | 0, 0x165667b1) ^ s) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, s, seed) {
  const xi = Math.floor(x / s), yi = Math.floor(y / s);
  const fx = x / s - xi, fy = y / s - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = h2(xi, yi, seed), b = h2(xi + 1, yi, seed), c = h2(xi, yi + 1, seed), d = h2(xi + 1, yi + 1, seed);
  const top = a + (b - a) * u, bot = c + (d - c) * u;
  return top + (bot - top) * v; // 0..1
}
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

// ---------- distance fields on the exact grid (4-neighbour, multi-source BFS) ----------
function bfs(g, isSource, cap) {
  const n = W * H, dist = new Uint8Array(n).fill(255), q = new Int32Array(n);
  let r = 0, w = 0;
  for (let i = 0; i < n; i++) if (isSource(g[i])) { dist[i] = 0; q[w++] = i; }
  while (r < w) {
    const v = q[r++], dv = dist[v];
    if (dv >= cap) continue;
    const x = v % W, y = (v - x) / W;
    if (x > 0 && dist[v - 1] === 255) { dist[v - 1] = dv + 1; q[w++] = v - 1; }
    if (x < W - 1 && dist[v + 1] === 255) { dist[v + 1] = dv + 1; q[w++] = v + 1; }
    if (y > 0 && dist[v - W] === 255) { dist[v - W] = dv + 1; q[w++] = v - W; }
    if (y < H - 1 && dist[v + W] === 255) { dist[v + W] = dv + 1; q[w++] = v + W; }
  }
  return dist;
}

// ---------- surface finish: approximates the engine atlas flair families per material ----------
function finish(m, x, y, lo, tn) {
  // returns [multiplier delta, tintR, tintG, tintB] in 0..255 units (tint is additive)
  const i = x + y * W;
  switch (m) {
    case 49: { // slate: bedding strata with irregular cleft joints
      const row = (y + ((h2(x >> 6, y >> 3, SEED + 5) * 3) | 0)) % 7;
      return [(row === 0 ? -0.07 : 0) + (h2(x >> 3, y, SEED + 6) > 0.975 ? -0.05 : 0), 0, 0, 0];
    }
    case 58: // reinforced concrete: mottling, pits, faint pour joints
      return [(lo - 0.5) * 0.10 + (h2(x, y, SEED + 8) > 0.986 ? -0.12 : 0) + (y % 48 === 0 ? -0.035 : 0), 0, 0, 0];
    case 62: { // steel plate: brushed streaks, panel seams, rivets
      const streak = (h2(0, y, SEED + 7) - 0.5) * 0.08;
      const rivet = (x % 24 === 12 && y % 24 === 12) ? 0.14 : 0;
      return [streak + (x % 96 === 0 ? -0.09 : 0) + rivet, 0, 0, 0];
    }
    case 100: { // basalt columns: vertical facets with jointing
      const col = h2(x / 10 | 0, 0, SEED + 9) * 2 - 1;
      return [col * 0.08 + (y % 37 === 0 ? -0.05 : 0) + (h2(x, y, SEED + 10) > 0.996 ? -0.15 : 0), 0, 0, 0];
    }
    case 101: { // obsidian: conchoidal ripples and glints
      const rip = Math.sin(x * 0.11 + y * 0.07 + 3 * lo) * 0.05;
      return [rip + ((x + 2 * y) % 53 < 2 ? 0.16 : 0), 0, 0, 0];
    }
    case 113: { // galvanised zinc: corrugation with spangle noise
      const c = (x + y) % 8;
      return [(c < 3 ? 0.06 : c > 5 ? -0.06 : 0) + (lo - 0.5) * 0.06, 0, 0, 0];
    }
    case 117: { // bare iron: warm rust bloom
      const rust = clamp((vnoise(x, y, 21, SEED + 11) - 0.45) * 3, 0, 1);
      return [(lo - 0.5) * 0.06, 30 * rust, 8 * rust, -6 * rust];
    }
    case 120: { // glass block: mortar courses with bevelled units
      const bx = x % 10, by = y % 10;
      return [(bx === 0 || by === 0 ? -0.10 : 0) + (bx === 1 || by === 1 ? 0.08 : 0), 0, 6, 10];
    }
    case 122: // quartz: crystalline facets and sparkle
      return [((x * 5 + y * 3) % 31 < 2 ? 0.06 : 0) + (h2(x, y, SEED + 12) > 0.994 ? 0.25 : 0), 0, 0, 0];
    case 123: // uranium glass: self-lit core with sparkle
      return [0.10 + (h2(x, y, SEED + 13) > 0.97 ? 0.20 : 0), 0, 0, 0];
    case 128: { // polymer panel: seams and inset lip
      const seam = (x % 16 === 0 || y % 16 === 0) ? -0.10 : (x % 16 === 1 || y % 16 === 1) ? 0.05 : 0;
      return [seam, 0, 0, 0];
    }
    case 35: // glass: diagonal sheen
      return [((x + y) % 90 < 6 ? 0.12 : 0) + 0.04, 0, 0, 0];
    case 98: // marble: thin veins
      return [Math.abs(Math.sin(x * 0.03 + y * 0.012 + 4 * lo)) < 0.04 ? -0.08 : 0, 0, 0, 0];
    default: // any other material: plain per-cell value variation (engine VALUE_VARIATION applies in tt)
      return [(lo - 0.5) * 0.05 + (i % 7 === 0 ? 0.02 : 0), 0, 0, 0];
  }
}

// ---------- PNG (RGB, 8-bit) with a verifiable decode ----------
const CRC_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodeRGB(rgb, w, h) {
  const stride = w * 3, raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(rgb.buffer, rgb.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([SIG, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
function decodeRGB(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) throw Error("PNG_SIG");
  let pos = 8, w = 0, h = 0, colour = -1, depth = -1;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    const crc = buf.readUInt32BE(pos + 8 + len);
    if (crc32(buf.subarray(pos + 4, pos + 8 + len)) !== crc) throw Error("PNG_CRC " + type);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; colour = data[9]; }
    if (type === "IDAT") idat.push(data);
    pos += 12 + len;
    if (type === "IEND") break;
  }
  if (depth !== 8 || colour !== 2) throw Error("PNG_FORMAT");
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * 3;
  if (raw.length !== (stride + 1) * h) throw Error("PNG_LENGTH");
  const pix = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    if (raw[y * (stride + 1)] !== 0) throw Error("PNG_FILTER_UNSUPPORTED");
    raw.copy(pix, y * stride, y * (stride + 1) + 1, (y + 1) * (stride + 1));
  }
  return { w, h, pixels: pix };
}
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

// ---------- main render ----------
function renderFull(g) {
  const dAir = bfs(g, (m) => m === 0, 12);     // solid cells: steps from the nearest air cell (surface depth)
  const dSolid = bfs(g, (m) => m !== 0, 8);    // air cells: steps from the nearest solid (contact shadow)
  const dGlow = bfs(g, (m) => m === 123, 12);  // uranium glass glow reach
  const out = new Uint8Array(W * H * 3);
  for (let y = 0; y < H; y++) {
    const yt = y / (H - 1);
    for (let x = 0; x < W; x++) {
      const i = y * W + x, o = i * 3, m = g[i];
      if (m === 0) {
        // Air: a restrained backdrop, contact shadow beside solids and faint uranium glow.
        const vx = (x / (W - 1)) - 0.5, vy = yt - 0.5;
        const vig = 1 - 0.22 * (vx * vx + vy * vy) * 2;
        const ds = dSolid[i];
        const ao = ds <= 6 ? 1 - 0.32 * Math.pow(Math.max(0, 1 - (ds - 1) / 5), 1.5) : 1;
        const gl = dGlow[i] <= 12 ? Math.pow(1 - dGlow[i] / 12, 2) * 0.22 : 0;
        const dust = h2(x, y, SEED + 21) > 0.9993 ? 1 : 0;
        const base = [7 + 9 * yt, 9 + 12 * yt, 15 + 18 * yt];
        for (let c = 0; c < 3; c++) {
          let v = base[c] * vig * ao;
          v += [152, 232, 94][c] * gl;
          v += dust * 26;
          out[o + c] = clamp(Math.round(v), 0, 255);
        }
        continue;
      }
      if (!BASE[m]) throw Error("UNKNOWN_MATERIAL " + m);
      const lo = vnoise(x, y, 26, SEED + 1);
      const t = h2(x, y, SEED) * 2 - 1;
      const tn = Math.sign(t) * Math.pow(Math.abs(t), 0.82);
      const tt = clamp(0.6 * tn + 0.4 * (lo * 2 - 1), -1, 1);
      const [fd, tr, tg, tb] = finish(m, x, y, lo, tn);
      const up = y > 0 && g[i - W] === 0, dn = y < H - 1 && g[i + W] === 0;
      const lf = x > 0 && g[i - 1] === 0, rt = x < W - 1 && g[i + 1] === 0;
      const dA = Math.min(dAir[i], 12);
      // Depth: surfaces near air read lighter; deep interior falls off gently.
      const depth = 1 - 0.14 * Math.min(1, Math.max(0, dA - 1) / 9);
      // Top-left key light: upward faces brighten, downward faces darken.
      const rim = (up ? 0.10 : 0) + (lf ? 0.035 : 0) - (dn ? 0.11 : 0) - (rt ? 0.045 : 0) + (up && dA === 1 ? 0.04 : 0);
      const k = (1 + tt * VAR[m] * 1.18 + fd) * depth * (1 + rim);
      const b = BASE[m];
      const chans = [b[0] * k + tr, b[1] * k + tg, b[2] * k + tb];
      for (let c = 0; c < 3; c++) out[o + c] = clamp(Math.round(chans[c]), 0, 255);
    }
  }
  return out;
}

// Route overlay drawn from the design coordinates in README (presentation aid only, not gameplay).
const ROUTES_DISABLED = {
  main: { colour: [240, 244, 248], dash: [10, 6], pts: [[116, 445], [841, 445], [1037, 448], [1323, 454], [1506, 453], [1826, 449], [1943, 446]] },
  high: { colour: [120, 220, 255], dash: null, pts: [[203, 329], [617, 356], [844, 307], [1033, 297], [1194, 308], [1323, 454]] },
  low: { colour: [255, 176, 64], dash: null, pts: [[443, 612], [614, 752], [728, 776], [854, 721], [1072, 753], [1338, 772], [1520, 742], [1614, 753]] },
  ascent: { colour: [255, 176, 64], dash: null, pts: [[1614, 753], [1760, 573], [1883, 767]] },
};
function stamp(rgb, cx, cy, r, col) {
  for (let yy = Math.floor(cy - r); yy <= Math.ceil(cy + r); yy++) {
    for (let xx = Math.floor(cx - r); xx <= Math.ceil(cx + r); xx++) {
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      if ((xx - cx) ** 2 + (yy - cy) ** 2 <= r * r) {
        const o = (yy * W + xx) * 3;
        rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2];
      }
    }
  }
}
function drawRoutes(base, sites) {
  const rgb = Uint8Array.from(base);
  for (const key of []) {
    const { colour, dash, pts } = ROUTES[key];
    let run = 0;
    for (let p = 0; p + 1 < pts.length; p++) {
      const [x0, y0] = pts[p], [x1, y1] = pts[p + 1];
      const len = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
      for (let s = 0; s <= len; s++) {
        const t = s / Math.max(1, len);
        const on = !dash || (run % (dash[0] + dash[1])) < dash[0];
        run++;
        if (on) stamp(rgb, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 1.6, colour);
      }
    }
  }
  for (const [name, x, y] of sites) {
    for (let yy = y - 4; yy <= y + 4; yy++) for (let xx = x - 4; xx <= x + 4; xx++) {
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const edge = xx === x - 4 || xx === x + 4 || yy === y - 4 || yy === y + 4;
      const o = (yy * W + xx) * 3;
      const c = edge ? [8, 11, 18] : [255, 255, 255];
      rgb[o] = c[0]; rgb[o + 1] = c[1]; rgb[o + 2] = c[2];
    }
  }
  stamp(rgb, SPAWN[0], SPAWN[1], 9, [152, 232, 94]);  // Midge spawn ring
  stamp(rgb, SPAWN[0], SPAWN[1], 4, [8, 11, 18]);
  return rgb;
}
function crop2x(rgb, x0, y0, w, h) {
  const out = new Uint8Array(w * 2 * h * 2 * 3);
  for (let y = 0; y < h * 2; y++) for (let x = 0; x < w * 2; x++) {
    const si = ((y0 + (y >> 1)) * W + (x0 + (x >> 1))) * 3, di = (y * w * 2 + x) * 3;
    out[di] = rgb[si]; out[di + 1] = rgb[si + 1]; out[di + 2] = rgb[si + 2];
  }
  return out;
}
function review(rgb) { // exact 2x2 box average to 1024x512
  const out = new Uint8Array((W / 2) * (H / 2) * 3);
  for (let y = 0; y < H / 2; y++) for (let x = 0; x < W / 2; x++) for (let c = 0; c < 3; c++) {
    let s = 0;
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) s += rgb[((2 * y + dy) * W + 2 * x + dx) * 3 + c];
    out[(y * (W / 2) + x) * 3 + c] = Math.round(s / 4);
  }
  return out;
}

const SPAWN = [520, 145];
const DISTRICTS = [];
const _UNUSED = [
  ["01-launch-cradle", 0, 160, 512, 384],
  ["02-drift-canyon", 384, 140, 512, 384],
  ["03-split-current-iris", 760, 164, 512, 384],
  ["04-glassstorm-viaduct", 1240, 232, 512, 384],
  ["05-catch-recovery", 1536, 540, 512, 384],
  ["06-lower-s-turn-west", 580, 640, 512, 384],
  ["07-lower-s-turn-east", 1150, 640, 512, 384],
];

// Returns { files: [{ path, bytes, width, height, rgbSha256 }], manifest }.
// Pixel hashes are the verification key; PNG bytes may vary with the zlib build.
function buildPresentation(grid, width, height, sites) {
  W = width; H = height;
  const gridSha = sha256(Buffer.from(grid.buffer, grid.byteOffset, grid.byteLength));
  const full = renderFull(grid);
  const routed = drawRoutes(full, sites);
  const items = [
    ["render/overview.png", full, W, H],
    ["render/overview-review.png", review(full), W / 2, H / 2],
    ["render/overview-routes.png", routed, W, H],
  ];
  for (const [name, x0, y0, w, h] of DISTRICTS) items.push(["render/" + name + "@2x.png", crop2x(full, x0, y0, w, h), w * 2, h * 2]);
  const files = items.map(([path, rgb, w, h]) => {
    const buf = Buffer.from(rgb.buffer, rgb.byteOffset, rgb.byteLength);
    return { path, bytes: encodeRGB(rgb, w, h), width: w, height: h, rgbSha256: sha256(buf) };
  });
  const manifest = {
    renderer: RENDER_VERSION,
    presentation_only: true,
    grid_sha256: gridSha,
    note: "Preview renders of the exact material grid. Physical truth remains the indexed PNGs and setup JSON at the top level.",
    colour_source: "godot/scripts/material_appearance_lut.gd @ 018bd09503d7f079ddac52e225c2f7daf8d678bf",
    files: files.map((f) => ({ path: f.path, width: f.width, height: f.height, rgb_sha256: f.rgbSha256 })),
  };
  return { files, manifest, decodePNG: decodeRGB };
}

module.exports = { buildPresentation, decodeRGB, RENDER_VERSION };
