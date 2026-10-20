// Generates the topographic contour texture once: /public/textures/topo.svg.
// Seeded fractal noise -> d3-contour isolines -> simplified SVG paths.
// The SVG is drawn at full strength; components apply the 5-6% opacity.
//
// Usage: node scripts/make-topo.mjs [seed]

import { contours } from "d3-contour";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const W = 1600;
const H = 1000;
const STEP = 8; // grid resolution in px
const LEVELS = 16;
const seed = Number(process.argv[2] ?? 7);

// Small seeded PRNG (mulberry32).
function rng(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth value noise on a lattice, summed over octaves.
const rand = rng(seed);
const LAT = 64;
const lattice = Array.from({ length: LAT * LAT }, () => rand());
const fade = (t) => t * t * (3 - 2 * t);
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  const v = (i, j) => lattice[((((yi + j) % LAT) + LAT) % LAT) * LAT + ((((xi + i) % LAT) + LAT) % LAT)];
  const a = v(0, 0) + (v(1, 0) - v(0, 0)) * xf;
  const b = v(0, 1) + (v(1, 1) - v(0, 1)) * xf;
  return a + (b - a) * yf;
}
function fbm(x, y) {
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let o = 0; o < 4; o++) {
    sum += amp * valueNoise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

const gw = Math.ceil(W / STEP) + 1;
const gh = Math.ceil(H / STEP) + 1;
const values = new Float64Array(gw * gh);
for (let j = 0; j < gh; j++) {
  for (let i = 0; i < gw; i++) {
    // Slight domain warp so the lines read as terrain, not blobs.
    const x = i * 0.018, y = j * 0.018;
    const wx = x + 0.6 * fbm(x + 3.1, y + 1.7);
    const wy = y + 0.6 * fbm(x + 8.3, y + 2.9);
    values[j * gw + i] = fbm(wx, wy);
  }
}

let min = Infinity, max = -Infinity;
for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
const thresholds = Array.from({ length: LEVELS }, (_, k) => min + ((k + 1) * (max - min)) / (LEVELS + 1));

const generator = contours().size([gw, gh]).thresholds(thresholds);
const onBorder = ([x, y]) => x <= 0.5 || y <= 0.5 || x >= gw - 1.5 || y >= gh - 1.5;
const fmt = (n) => Math.round(n * 10) / 10;

const paths = [];
for (const c of generator(values)) {
  let d = "";
  for (const polygon of c.coordinates) {
    for (const ring of polygon) {
      // Break rings where they run along the grid edge so the frame is not drawn.
      let pen = false, lastX = 0, lastY = 0;
      for (const pt of ring) {
        if (onBorder(pt)) { pen = false; continue; }
        const x = fmt(pt[0] * STEP), y = fmt(pt[1] * STEP);
        if (!pen) {
          d += `M${x} ${y}`;
          pen = true;
        } else if (Math.hypot(x - lastX, y - lastY) >= 4) {
          d += `L${x} ${y}`;
        } else continue;
        lastX = x; lastY = y;
      }
    }
  }
  if (d) paths.push(`<path d="${d}"/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#F3EFE8" stroke-width="1" stroke-linejoin="round" stroke-linecap="round">${paths.join("")}</g></svg>\n`;
const out = path.resolve(import.meta.dirname, "../public/textures/topo.svg");
await writeFile(out, svg);
console.log(`topo.svg: ${paths.length} levels, ${(svg.length / 1024).toFixed(1)} KB`);
