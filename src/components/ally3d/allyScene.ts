// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — ported as-is from the "Ally 3D" artifact (Ally 2), plain JS.
// Ally in 3D, built in the browser straight from her SVG artwork (no 3D
// file): every part's outline is "inflated" into a rounded volume and
// the SVG's own colours are projected onto it from the front, so the
// front view *is* the drawing. The artifact's model code is unchanged;
// only the page around it differs: no orbit/zoom controls or face
// buttons, the camera framed on Ally alone, and her head following the
// cursor anywhere on the page (or a slow look-around on touch screens).
import * as THREE from 'three'
import { SVG_TEXT } from './allySvgs'

export type AllyScene = { start: () => void; stop: () => void; dispose: () => void }

export function createAllyScene(container: HTMLElement, { reducedMotion = false } = {}): AllyScene {
const SVG_W = 328, SVG_H = 399;
const S = 4;                 // mask raster resolution, px per SVG unit
const GRID = 1.25;           // mesh grid spacing, SVG units
const TEX_S = 4;             // texture resolution, px per SVG unit
const toWorld = (sx, sy, z) => [(sx - SVG_W / 2) / 100, (SVG_H / 2 - sy) / 100, z / 100];

// Path indices in AllyWink.svg / AllyPrata.svg (same drawing order in both)
const P = { body: 0, visor: 1, belly: 2, armL: 3, armR: 4, neck: 5, chestShine: 6, earR: 7, earL: 8, seam: 9, headShine: 10, eyeL: 11, eyeR: 12, mouth: 13 };

// Per-part depth: zc = centre plane, hf/hb = front/back depth, r = edge rounding radius (SVG units)
const PARTS = {
  head:  { zc: 0,   hf: 80, hb: 80, r: 32, bottomRound: 45, screen: true }, // the face is a flat screen; only the frame around it rounds off
  bump:  { zc: 0,   hf: 42, hb: 42, r: 30 },
  earL:  { zc: 0,   hf: 26, hb: 26, r: 12 },
  earR:  { zc: 0,   hf: 26, hb: 26, r: 12 },
  neck:  { zc: -15, stem: true, intoHead: 60, depth: 0.7 }, // turned round, like a spinning top's stem; depth < 1 makes it oval, slimmer front to back
  torso: { zc: -15, hf: 80, hb: 80, r: 100 },
  armL:  { zc: -18, hf: 26, hb: 30, r: 30 },
  armR:  { zc: -18, hf: 26, hb: 30, r: 30 },
};


// ---------- SVG loading ----------
function loadSvg(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  return [...doc.querySelectorAll('path')].map(el => {
    const d = el.getAttribute('d');
    const nums = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
    return {
      path: new Path2D(d),
      fill: el.getAttribute('fill'),
      stroke: el.getAttribute('stroke'),
      strokeWidth: Number(el.getAttribute('stroke-width') || 0),
      bbox: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) },
    };
  });
}
const svgs = { smile: loadSvg(SVG_TEXT.smile), wink: loadSvg(SVG_TEXT.wink) };
const geoSvg = svgs.wink;

function drawPath(ctx, p, blink = 1, isEye = false) {
  ctx.save();
  if (isEye && blink !== 1) { // squash towards the eye's base
    const cx = (p.bbox.x0 + p.bbox.x1) / 2, by = p.bbox.y1;
    ctx.translate(cx, by); ctx.scale(1, blink); ctx.translate(-cx, -by);
  }
  if (p.stroke) {
    ctx.strokeStyle = p.stroke; ctx.lineWidth = p.strokeWidth; ctx.lineCap = 'round';
    ctx.stroke(p.path);
  } else if (p.fill && p.fill !== 'none') {
    ctx.fillStyle = p.fill; ctx.fill(p.path);
  }
  ctx.restore();
}

// The face screen (visor), made symmetric: in the artwork its bottom-left
// corner is a sharper, higher diagonal than the other three, so the right
// half is mirrored onto the left
const VISOR_CX = (geoSvg[P.visor].bbox.x0 + geoSvg[P.visor].bbox.x1) / 2;
function fillScreen(ctx) {
  for (const mirror of [false, true]) {
    ctx.save();
    ctx.beginPath();
    if (mirror) ctx.rect(-SVG_W, -SVG_H, SVG_W + VISOR_CX + 0.5, 3 * SVG_H); else ctx.rect(VISOR_CX, -SVG_H, 2 * SVG_W, 3 * SVG_H);
    ctx.clip();
    if (mirror) { ctx.translate(2 * VISOR_CX, 0); ctx.scale(-1, 1); }
    ctx.fill(geoSvg[P.visor].path);
    ctx.restore();
  }
}

// ---------- masks ----------
// Masks get a margin: the arms touch the SVG's edges, and a clipped mask would leave the mesh open
const M = 8;
const MW = (SVG_W + 2 * M) * S, MH = (SVG_H + 2 * M) * S;
const mIdx = (ux, uy) => Math.round((uy + M) * S) * MW + Math.round((ux + M) * S);
const maskCanvas = Object.assign(document.createElement('canvas'), { width: MW, height: MH });
const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });
function rasterMask(include, exclude = []) {
  return readMask(ctx => {
    for (const i of include) ctx.fill(geoSvg[i].path);
    ctx.globalCompositeOperation = 'destination-out';
    for (const i of exclude) ctx.fill(geoSvg[i].path);
  });
}
function readMask(draw) {
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.globalCompositeOperation = 'source-over';
  mctx.clearRect(0, 0, MW, MH);
  mctx.setTransform(S, 0, 0, S, M * S, M * S);
  mctx.fillStyle = '#000';
  draw(mctx);
  const data = mctx.getImageData(0, 0, MW, MH).data;
  const m = new Uint8Array(MW * MH);
  for (let i = 0; i < m.length; i++) m[i] = data[i * 4 + 3] > 127 ? 1 : 0;
  return m;
}
function component(mask, sx, sy) {
  const out = new Uint8Array(mask.length);
  const stack = [mIdx(sx, sy)];
  while (stack.length) {
    const i = stack.pop();
    if (!mask[i] || out[i]) continue;
    out[i] = 1;
    const x = i % MW;
    if (x > 0) stack.push(i - 1);
    if (x < MW - 1) stack.push(i + 1);
    if (i >= MW) stack.push(i - MW);
    if (i < mask.length - MW) stack.push(i + MW);
  }
  return out;
}
// Grow `part` horizontally into `into` by up to `units`, towards `dir` (+1 = right)
function extendInto(part, into, units, dir) {
  const out = part.slice(), reach = units * S;
  for (let y = 0; y < MH; y++) {
    let last = -Infinity;
    for (let k = 0; k < MW; k++) {
      const x = dir > 0 ? k : MW - 1 - k, i = y * MW + x;
      if (part[i]) last = k;
      else if (into[i] && k - last <= reach) out[i] = 1;
    }
  }
  return out;
}

const body = rasterMask([P.body], [P.armL, P.armR, P.neck, P.earL, P.earR]);
let headM = component(body, 164, 60);
const torsoM = component(body, 164, 330); // keeps a notch where the neck sits
const neckM = rasterMask([P.neck]);
const topAt = (m, x) => { const c = mIdx(x, -M); for (let y = 0; y < MH; y++) if (m[y * MW + c]) return y; return MH; }; // mask rows
// Split the top bump off the head so it gets its own, shallower depth
const shellTop = Math.min(topAt(headM, 112), topAt(headM, 216));
const bumpM = headM.map((v, i) => v && Math.floor(i / MW) < shellTop + 10 * S ? 1 : 0);
headM = headM.map((v, i) => v && !(Math.floor(i / MW) < shellTop && bumpM[i]) ? 1 : 0);
const masks = {
  head: headM,
  bump: bumpM,
  torso: torsoM,
  neck: neckM,
  earL: extendInto(rasterMask([P.earL]), headM, 14, +1),
  earR: extendInto(rasterMask([P.earR]), headM, 14, -1),
  armL: extendInto(rasterMask([P.armL]), torsoM, 5, +1), // tucked in just enough to hide the join; further, it pokes out under the arm
  armR: extendInto(rasterMask([P.armR]), torsoM, 5, -1),
};
const screenM = readMask(fillScreen);

// ---------- distance transform (Felzenszwalb) ----------
function edt1d(f, n, d, v, z) {
  let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s;
    do { const r = v[k]; s = ((f[q] + q * q) - (f[r] + r * r)) / (2 * q - 2 * r); } while (s <= z[k] && --k >= 0);
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; const r = v[k]; d[q] = (q - r) * (q - r) + f[r]; }
}
function edt(grid, w, h) { // grid: 0 = source, 1e20 = far; returns distances in place
  const n = Math.max(w, h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = Math.sqrt(d[x]);
  }
  return grid;
}

// ---------- inflate a mask into a closed, rounded mesh ----------
function inflate(mask, { zc, hf, hb, r, bottomRound = 0, screen = null }) {
  let x0 = MW, y0 = MH, x1 = 0, y1 = 0;
  for (let i = 0; i < mask.length; i++) if (mask[i]) {
    const x = i % MW, y = (i / MW) | 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const pad = 4 * S;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(MW - 1, x1 + pad); y1 = Math.min(MH - 1, y1 + pad);
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const inG = new Float64Array(w * h), outG = new Float64Array(w * h), sub = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const m = mask[(y + y0) * MW + x + x0];
    sub[y * w + x] = m; inG[y * w + x] = m ? 1e20 : 0; outG[y * w + x] = m ? 0 : 1e20;
  }
  edt(inG, w, h); edt(outG, w, h);
  // screen: the front stays fully flat over this mask, and the rounding is
  // squeezed into the frame between it and the outline, so the screen never
  // wraps round the edge (that smeared it across the underside)
  let scrG = null;
  if (screen) {
    scrG = new Float64Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) scrG[y * w + x] = screen[(y + y0) * MW + x + x0] ? 0 : 1e20;
    edt(scrG, w, h);
  }
  const frontR = (ux, uy, D) => {
    if (!scrG) return r;
    const px = Math.min(w - 1, Math.max(0, Math.round((ux + M) * S - x0)));
    const py = Math.min(h - 1, Math.max(0, Math.round((uy + M) * S - y0)));
    return Math.max(0.5, Math.min(r, D + scrG[py * w + px] / S));
  };
  const sdf = (ux, uy) => {
    const px = Math.min(w - 1, Math.max(0, Math.round((ux + M) * S - x0)));
    const py = Math.min(h - 1, Math.max(0, Math.round((uy + M) * S - y0)));
    const i = py * w + px;
    return sub[i] ? (inG[i] - 0.5) / S : -(outG[i] - 0.5) / S;
  };

  const ux0 = x0 / S - M, uy0 = y0 / S - M;
  const nx = Math.ceil((w / S) / GRID) + 1, ny = Math.ceil((h / S) / GRID) + 1;
  const F = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) F[j * nx + i] = sdf(ux0 + i * GRID, uy0 + j * GRID);

  const pos = [], uvs = [], idx = [];
  const profile = (D, H, rr = r) => H * Math.sqrt(Math.max(0, 1 - (1 - Math.min(D, rr) / rr) ** 2));
  // bottomRound: extra rounding of the back half, measured straight up from the
  // part's bottom edge, so its underside rises towards the back (seen from the
  // side) without changing the front outline
  const bottomRow = new Float32Array(w).fill(-1);
  for (let x = 0; x < w; x++) for (let y = h - 1; y >= 0; y--) if (sub[y * w + x]) { bottomRow[x] = (y + y0) / S - M; break; }
  const underside = (sx, sy) => {
    if (!bottomRound) return 1;
    const bx = bottomRow[Math.min(w - 1, Math.max(0, Math.round((sx + M) * S - x0)))];
    if (bx < 0) return 1;
    const dy = Math.min(Math.max(bx - sy, 0), bottomRound) / bottomRound;
    return Math.sqrt(1 - (1 - dy) ** 2);
  };
  // Every vertex near the outline projects onto the same thin, antialiased
  // edge of the drawing, which then smears into a light streak where the
  // front and back halves meet (most visible under the body). So vertices
  // within UV_INSET of the outline take their colour from just inside it.
  const UV_INSET = 3;
  const uvAt = (sx, sy) => {
    const D = sdf(sx, sy);
    if (D >= UV_INSET) return [sx, sy];
    const gx = sdf(sx + 1, sy) - sdf(sx - 1, sy), gy = sdf(sx, sy + 1) - sdf(sx, sy - 1), g = Math.hypot(gx, gy) || 1;
    const k = UV_INSET - Math.max(D, 0);
    return [sx + gx / g * k, sy + gy / g * k];
  };
  const addV = (sx, sy, z) => {
    const [tx, ty] = uvAt(sx, sy);
    pos.push(...toWorld(sx, sy, z)); uvs.push(tx / SVG_W, 1 - ty / SVG_H);
    return pos.length / 3 - 1;
  };
  const front = new Int32Array(nx * ny).fill(-1), back = new Int32Array(nx * ny).fill(-1);
  const hEdge = new Int32Array(nx * ny).fill(-1), vEdge = new Int32Array(nx * ny).fill(-1);
  const corner = (k, isFront) => {
    const arr = isFront ? front : back;
    if (arr[k] < 0) {
      const i = k % nx, j = (k / nx) | 0, D = F[k];
      const sx = ux0 + i * GRID, sy = uy0 + j * GRID, u = underside(sx, sy);
      // only the back half domes up, so the front (and the front view) is untouched
      arr[k] = addV(sx, sy, isFront ? zc + profile(D, hf, frontR(sx, sy, D)) : zc - profile(D, hb) * u);
    }
    return arr[k];
  };
  const edgeV = (a, b) => {
    const horiz = Math.abs(a - b) === 1, lo = Math.min(a, b), arr = horiz ? hEdge : vEdge;
    if (arr[lo] < 0) {
      const t = F[a] / (F[a] - F[b]);
      const ai = a % nx, aj = (a / nx) | 0, bi = b % nx, bj = (b / nx) | 0;
      arr[lo] = addV(ux0 + (ai + (bi - ai) * t) * GRID, uy0 + (aj + (bj - aj) * t) * GRID, zc);
    }
    return arr[lo];
  };
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const c = [j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i];
    if (c.every(k => F[k] <= 0)) continue;
    const poly = [];
    for (let q = 0; q < 4; q++) {
      const a = c[q], b = c[(q + 1) % 4], ia = F[a] > 0, ib = F[b] > 0;
      if (ia) poly.push({ k: a });
      if (ia !== ib) poly.push({ e: edgeV(a, b) });
    }
    if (poly.length < 3) continue;
    const fId = p => p.e ?? corner(p.k, true), bId = p => p.e ?? corner(p.k, false);
    for (let q = 1; q < poly.length - 1; q++) {
      idx.push(fId(poly[0]), fId(poly[q + 1]), fId(poly[q]));   // faces +z
      idx.push(bId(poly[0]), bId(poly[q]), bId(poly[q + 1]));   // faces -z
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ---------- textures: the SVG's own colours, per part ----------
const TW = SVG_W * TEX_S, TH = SVG_H * TEX_S;
function makeTex(draw) {
  const canvas = Object.assign(document.createElement('canvas'), { width: TW, height: TH });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  tex.redraw = (...args) => {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, TW, TH);
    ctx.setTransform(TEX_S, 0, 0, TEX_S, 0, 0);
    draw(ctx, ...args);
    tex.needsUpdate = true;
  };
  tex.redraw();
  return tex;
}
const solid = hex => makeTex(ctx => { ctx.fillStyle = hex; ctx.fillRect(0, 0, SVG_W, SVG_H); });
const layered = (base, ids) => makeTex(ctx => {
  ctx.fillStyle = base; ctx.fillRect(0, 0, SVG_W, SVG_H);
  for (const i of ids) drawPath(ctx, geoSvg[i]);
});
const fillOf = i => geoSvg[i].fill;

const expression = 'smile'; let blink = 1;
const glow = 0.35; // face glow strength, 0-1
const GLOW_BLUR = 7; // SVG units
const headFront = makeTex(ctx => {
  const svg = svgs[expression];
  ctx.fillStyle = fillOf(P.body); ctx.fillRect(0, 0, SVG_W, SVG_H);
  for (const i of [P.body, P.visor, P.headShine, P.eyeL, P.eyeR, P.mouth]) {
    if (i === P.visor) { ctx.fillStyle = svg[i].fill; fillScreen(ctx); continue; }
    const isEye = i === P.eyeL || (i === P.eyeR && !svg[i].stroke);
    if (glow > 0 && (i === P.eyeL || i === P.eyeR || i === P.mouth)) {
      // soft halo in the feature's own colour, like light from the screen;
      // shadowBlur is in canvas pixels, so scale it by the texture resolution
      ctx.save();
      ctx.shadowColor = (svg[i].stroke || svg[i].fill) + Math.round(glow * 255).toString(16).padStart(2, '0');
      ctx.shadowBlur = GLOW_BLUR * TEX_S;
      drawPath(ctx, svg[i], blink, isEye);
      ctx.restore();
    }
    drawPath(ctx, svg[i], blink, isEye);
  }
});
const TEX = {
  head:  [headFront, solid(fillOf(P.body))],
  bump:  [headFront, solid(fillOf(P.body))],
  torso: [layered(fillOf(P.body), [P.body, P.belly, P.seam, P.chestShine]), layered(fillOf(P.body), [P.body, P.belly, P.seam])],
  neck:  [solid(fillOf(P.neck)), solid(fillOf(P.neck))],
  earL:  [solid(fillOf(P.earL)), solid(fillOf(P.earL))],
  earR:  [solid(fillOf(P.earR)), solid(fillOf(P.earR))],
  armL:  [solid(fillOf(P.armL)), solid(fillOf(P.armL))],
  armR:  [solid(fillOf(P.armR)), solid(fillOf(P.armR))],
};

// Flat, illustration-style shading: exact SVG colour where the surface faces
// the viewer, gently darker towards the silhouette for a sense of volume.
const shadeK = { value: 0.15 }; // shared by every part; 0 = flat illustration
const makeMaterial = ([frontMap, backMap]) => new THREE.ShaderMaterial({
  uniforms: { frontMap: { value: frontMap }, backMap: { value: backMap }, shadeK },
  vertexShader: `
    varying vec2 vUv; varying vec3 vN; varying vec3 vVN;
    void main() {
      vUv = uv; vN = normal; vVN = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D frontMap, backMap; uniform float shadeK;
    varying vec2 vUv; varying vec3 vN; varying vec3 vVN;
    void main() {
      vec3 f = texture2D(frontMap, vUv).rgb, b = texture2D(backMap, vUv).rgb;
      vec3 c = mix(b, f, smoothstep(-0.25, 0.15, vN.z));
      vec3 n = normalize(vVN);
      float edge = 1.0 - max(n.z, 0.0); // 0 where the surface faces the viewer
      float s = 1.0 - shadeK * edge * edge + shadeK * 0.3 * edge * dot(n.xy, vec2(-0.45, 0.55));
      gl_FragColor = vec4(c * s, 1.0);
      #include <colorspace_fragment>
    }`,
});

// ---------- scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.domElement.style.display = 'block'
renderer.domElement.style.width = '100%'
renderer.domElement.style.height = '100%'
container.appendChild(renderer.domElement)
const scene = new THREE.Scene()

// Framed on Ally alone (she's about 3.3 x 4 units), with room around her
// for the head to turn and the gentle bob.
const HALF_H = 2.25
const camera = new THREE.OrthographicCamera(-1, 1, HALF_H, -HALF_H, -50, 50)
camera.position.set(0, 0, 10)

const ally = new THREE.Group(); ally.name = 'Ally'; scene.add(ally)
const NECK_TOP = toWorld(164, 189, 0)
const headPivot = new THREE.Group(); headPivot.name = 'HeadPivot'
headPivot.position.set(0, NECK_TOP[1], 0)
ally.add(headPivot)
// SVG outline at that height, so the front outline is unchanged but it's round
// from every side. Extends `intoHead` units up past its top, hidden in the head.
function stem(mask, { zc, intoHead = 0, depth = 1 }) {
  const rows = [];
  for (let y = 0; y < MH; y += S / 2) {
    let l = -1, r = -1;
    for (let x = 0; x < MW; x++) if (mask[y * MW + x]) { if (l < 0) l = x; r = x; }
    if (l >= 0) rows.push({ y: y / S - M, l: l / S - M, r: (r + 1) / S - M });
  }
  const cx = rows.reduce((s, q) => s + (q.l + q.r) / 2, 0) / rows.length;
  // skip the antialiased sliver rows at the very top, or the part that runs up
  // into the head takes their width and comes out as a thin spike
  const widest = Math.max(...rows.map(q => q.r - q.l));
  while (rows.length && rows[0].r - rows[0].l < widest / 2) rows.shift();
  const top = rows[0], bottom = rows[rows.length - 1];
  const pts = [new THREE.Vector2(0, toWorld(0, bottom.y + 0.5, 0)[1])];
  for (let k = rows.length - 1; k >= 0; k--) {
    pts.push(new THREE.Vector2((rows[k].r - rows[k].l) / 2 / 100, toWorld(0, rows[k].y, 0)[1]));
  }
  const rTop = (top.r - top.l) / 2 / 100;
  pts.push(new THREE.Vector2(rTop, toWorld(0, top.y - intoHead, 0)[1]));
  pts.push(new THREE.Vector2(0, toWorld(0, top.y - intoHead, 0)[1]));
  const geo = new THREE.LatheGeometry(pts, 96);
  geo.scale(1, 1, depth); // front-to-back only, so the front view keeps its width
  geo.translate(toWorld(cx, 0, 0)[0], 0, zc / 100);
  return geo;
}

const meshes = {};
for (const [name, opts] of Object.entries(PARTS)) {
  const geo = opts.stem ? stem(masks[name], opts) : inflate(masks[name], { ...opts, screen: opts.screen ? screenM : null });
  const m = new THREE.Mesh(geo, makeMaterial(TEX[name]));
  m.name = name; meshes[name] = m;
  if (name === 'head' || name === 'bump' || name.startsWith('ear')) { m.position.y = -NECK_TOP[1]; headPivot.add(m); }
  else ally.add(m);
}
// ---------- screen curve ----------
// The face bends back evenly, like a curved display: a smooth bowl centred on
// the screen, stronger side to side than top to bottom. It only moves the
// front surface in depth, so the front view (and the outline) is unchanged.
const headGeo = meshes.head.geometry, headBase = headGeo.attributes.position.array.slice();
const vb = geoSvg[P.visor].bbox;
const SC = { x: toWorld(VISOR_CX, 0, 0)[0], y: toWorld(0, (vb.y0 + vb.y1) / 2, 0)[1], a: (vb.x1 - vb.x0) / 200, b: (vb.y1 - vb.y0) / 200 };
function setScreenCurve(units) {
  const p = headGeo.attributes.position.array, zc = PARTS.head.zc / 100, hf = PARTS.head.hf / 100, c = units / 100;
  for (let i = 0; i < p.length; i += 3) {
    const z = headBase[i + 2];
    if (z <= zc) { p[i + 2] = z; continue; }
    const dx = (headBase[i] - SC.x) / SC.a, dy = (headBase[i + 1] - SC.y) / SC.b;
    p[i + 2] = zc + (z - zc) * Math.max(0, 1 - c * (dx * dx + 0.35 * dy * dy) / hf); // scaled, so the outline edge stays put
  }
  headGeo.attributes.position.needsUpdate = true;
  headGeo.computeVertexNormals();
}
const SCREEN_CURVE = 14; // how far the screen edges bend back, SVG units

// ---------- view ----------
function resize() {
  const w = container.clientWidth || 1, h = container.clientHeight || 1
  const a = w / h
  camera.left = -HALF_H * a; camera.right = HALF_H * a; camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
  renderer.render(scene, camera)
}
const resizeObserver = new ResizeObserver(resize)
resizeObserver.observe(container)

// The head follows the cursor anywhere in the window. Touch screens have
// no cursor, so there she slowly looks around on her own.
const pointer = new THREE.Vector2()
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches
const onPointerMove = e => pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
if (canHover) addEventListener('pointermove', onPointerMove)

// ---------- animation ----------
const clock = new THREE.Clock()
let nextBlink = 2.5, blinkT = -1, lastT = 0, frame = 0
function animate() {
  const t = clock.getElapsedTime(), dt = t - lastT; lastT = t
  if (!canHover) pointer.set(Math.sin(t * 0.45) * 0.7, Math.sin(t * 0.31 + 1) * 0.4)
  ally.position.y = Math.sin(t * 1.4) * 0.03
  headPivot.rotation.y += (pointer.x * 0.3 - headPivot.rotation.y) * 0.06
  headPivot.rotation.x += (-pointer.y * 0.12 - headPivot.rotation.x) * 0.06
  headPivot.rotation.z = Math.sin(t * 0.9) * 0.02
  if (t > nextBlink && blinkT < 0) blinkT = 0
  if (blinkT >= 0) {
    blinkT += dt
    blink = Math.max(0.08, Math.abs(1 - blinkT / 0.08))
    if (blinkT > 0.16) { blinkT = -1; blink = 1; nextBlink = t + 2.5 + Math.random() * 3 }
    headFront.redraw()
  }
  renderer.render(scene, camera)
  frame = requestAnimationFrame(animate)
}
resize()

// Reduced motion: a still Ally facing front, drawn once (by resize).
return {
  start() {
    if (reducedMotion || frame) return
    clock.start(); lastT = 0
    frame = requestAnimationFrame(animate)
  },
  stop() {
    cancelAnimationFrame(frame); frame = 0
  },
  dispose() {
    cancelAnimationFrame(frame); frame = 0
    resizeObserver.disconnect()
    removeEventListener('pointermove', onPointerMove)
    scene.traverse(o => {
      if (o.isMesh) {
        o.geometry.dispose()
        for (const tex of [o.material.uniforms.frontMap.value, o.material.uniforms.backMap.value]) tex.dispose()
        o.material.dispose()
      }
    })
    renderer.dispose()
    renderer.domElement.remove()
  },
}
}
