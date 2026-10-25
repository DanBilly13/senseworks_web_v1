'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import styles from './SenseworksStack.module.css';

/*
 * Senseworks Stack — interactive, responsive. Fills its container's width up to 1400 px;
 * height steps with width: 500 px (≥ 900 wide, one row of six), 600 px (two rows of three),
 * 640 px under 520 px.
 *
 * Loop (autoplay):
 *   Closed   one big accent circle with the brandmark, pulsing           3.6 s
 *   Open     it shrinks back to a plain circle FIRST, then fans out into six
 *   Layers   each layer is active for 3.5 s — white fill, one gentle pulse, an accent
 *            progress ring drawing clockwise around it; caption crossfades
 *   Gather   after 06 the six outlines come together into one, hold         0.8 s
 *   Merge    then that one circle fills with the accent, grows and starts pulsing
 *
 * Interaction: click a circle / dot (or ← →) to jump straight to it — the old one fades
 * out, the new one fades in, no scrubbing through the ones between. Autoplay pauses and
 * resumes by itself after 8 s. Click the closed circle to open it. Space / Enter toggles play.
 * Reduced motion: opens straight to the six, no easing, no pulses, no autoplay.
 *
 * Drawing is one <canvas> driven by a single rAF loop reading refs (no re-render per frame).
 * React state only changes when the caption changes.
 *
 * Site integration (the Stack Animation block): the loop stops while the piece is off
 * screen and picks up where it was when it comes back; the language follows the page.
 */

type Lang = 'en' | 'sv';
interface Step { name: string; full: string; body: string }
interface Copy { intro: string; all: string; steps: Step[] }

const COPY: Record<Lang, Copy> = {
  "en": {
    "intro": "Anyone can have a good model. We have the whole context.",
    "all": "Six layers. One Senseworks.",
    "steps": [
      {
        "name": "AI",
        "full": "AI & Automation",
        "body": "Invoices read and checked, board minutes reviewed, and every import checked before you start. The work no auditor should have to do by hand."
      },
      {
        "name": "Data",
        "full": "Data & Integrations",
        "body": "Fortnox, Spiris, Björn Lundén, Skatteverket, Bolagsverket and the banks, fetched straight into the engagement."
      },
      {
        "name": "Methodology",
        "full": "Methodology & Context",
        "body": "ISA and ISA for LCE with your firm’s own adaptations, and last year’s engagement rolled forward."
      },
      {
        "name": "Analysis",
        "full": "Analysis & Evidence",
        "body": "Ledger analyses, VAT and payroll tax reconciled against what was filed, and every finding linked to its source."
      },
      {
        "name": "Workspace",
        "full": "Analytics, Audit & Ally",
        "body": "Where the work happens. Ally sits right beside the engagement, with answers on laws and standards and the source in every answer."
      },
      {
        "name": "Security",
        "full": "Security & Governance",
        "body": "Hosted in Sweden, separated per client, encrypted and backed up every day. You decide who sees what, and every access is logged."
      }
    ]
  },
  "sv": {
    "intro": "Vem som helst kan ha en bra modell. Vi har hela sammanhanget.",
    "all": "Sex lager. Ett Senseworks.",
    "steps": [
      {
        "name": "AI",
        "full": "AI & automatisering",
        "body": "Fakturor läses och kontrolleras, protokoll gås igenom och varje inläsning kontrolleras innan du börjar. Jobbet ingen revisor ska behöva göra för hand."
      },
      {
        "name": "Data",
        "full": "Data & integrationer",
        "body": "Fortnox, Spiris, Björn Lundén, Skatteverket, Bolagsverket och bankerna, hämtat rakt in i uppdraget."
      },
      {
        "name": "Metodik",
        "full": "Metodik & sammanhang",
        "body": "ISA och ISA för LCE med byråns egna anpassningar, och förra årets uppdrag framrullat."
      },
      {
        "name": "Analys",
        "full": "Analys & underlag",
        "body": "Analyser av huvudboken, moms och arbetsgivaravgifter avstämda mot det deklarerade, och varje iakttagelse kopplad till sin källa."
      },
      {
        "name": "Arbetsyta",
        "full": "Analys, Revision & Ally",
        "body": "Där arbetet görs. Ally finns precis bredvid uppdraget, med svar om lagar och standarder och källan i varje svar."
      },
      {
        "name": "Säkerhet",
        "full": "Säkerhet & styrning",
        "body": "Driftat i Sverige, separerat per klient, krypterat och säkerhetskopierat varje dag. Du bestämmer vem som ser vad, och varje åtkomst loggas."
      }
    ]
  }
};

/* Canvas colours — mirror the --ssa-* vars in the CSS module (canvas can't read them per frame cheaply). */
const C = { line: '#FFFFFF', fill: '#FFFFFF', ink: '#101829', accent: '#DCEB6A', markInk: '#101829' };
const T = {
  hold: 3.5, //        s per layer
  closedHold: 3.6, //  s as the big circle
  gatherHold: 0.8, //  s after the outlines meet, before the merge
  pulseSec: 1.8, //    closed-circle breathing period
  resumeMs: 8000, //   autoplay resumes this long after a pick
  rate: 3.2, //        open / merge easing rate (per s)
  hiRate: 7, //        active crossfade rate (per s)
};
const SPREAD = 2.3; //  centre-to-centre gap, in radii
const BIG = 2; //       closed circle radius, in layer radii (capped at 26% of height)
const MARK_W = 120; //  brandmark box width before scaling

const BRANDMARK_PATHS: string[] = ["M49.2514 4.02592C50.3559 4.02592 51.2488 3.1305 51.2456 2.02593C51.2423 0.921367 50.3443 0.0259399 49.2397 0.0259399C48.1352 0.0259399 47.2423 0.921367 47.2456 2.02593C47.2488 3.1305 48.1468 4.02592 49.2514 4.02592Z", "M44.3383 10.9275C45.4428 10.9275 46.3357 10.0321 46.3325 8.92751C46.3293 7.82295 45.4312 6.92752 44.3267 6.92752C43.2221 6.92752 42.3293 7.82295 42.3325 8.92751C42.3357 10.0321 43.2337 10.9275 44.3383 10.9275Z", "M40.1391 17.7849C41.2292 17.6065 41.9656 16.5786 41.784 15.489C41.6024 14.3995 40.5715 13.6609 39.4814 13.8394C38.3914 14.0178 37.6549 15.0457 37.8365 16.1353C38.0181 17.2248 39.049 17.9634 40.1391 17.7849Z", "M54.242 10.884C55.3465 10.884 56.2394 9.98856 56.2362 8.88399C56.2329 7.77943 55.3349 6.884 54.2303 6.884C53.1258 6.884 52.2329 7.77943 52.2362 8.88399C52.2394 9.98856 53.1374 10.884 54.242 10.884Z", "M58.7489 17.7414C59.8535 17.7414 60.7463 16.846 60.7431 15.7414C60.7399 14.6369 59.8419 13.7414 58.7373 13.7414C57.6327 13.7414 56.7399 14.6369 56.7431 15.7414C56.7463 16.846 57.6444 17.7414 58.7489 17.7414Z", "M30.3801 4.02592C31.4847 4.02592 32.3775 3.1305 32.3743 2.02593C32.3711 0.921367 31.4731 0.0259399 30.3685 0.0259399C29.264 0.0259399 28.3711 0.921367 28.3743 2.02593C28.3775 3.1305 29.2756 4.02592 30.3801 4.02592Z", "M25.4656 10.9277C26.5702 10.9277 27.463 10.0323 27.4598 8.92773C27.4566 7.82316 26.5585 6.92773 25.454 6.92773C24.3494 6.92773 23.4566 7.82316 23.4598 8.92773C23.463 10.0323 24.361 10.9277 25.4656 10.9277Z", "M20.96 17.7863C22.0646 17.7863 22.9574 16.8908 22.9542 15.7863C22.951 14.6817 22.0529 13.7863 20.9484 13.7863C19.8438 13.7863 18.951 14.6817 18.9542 15.7863C18.9574 16.8908 19.8554 17.7863 20.96 17.7863Z", "M35.3706 10.8837C36.4752 10.8837 37.368 9.98828 37.3648 8.88372C37.3616 7.77915 36.4636 6.88373 35.359 6.88373C34.2544 6.88373 33.3616 7.77915 33.3648 8.88372C33.368 9.98828 34.2661 10.8837 35.3706 10.8837Z", "M11.426 4.0258C12.5306 4.0258 13.4234 3.13037 13.4202 2.02581C13.417 0.921245 12.519 0.0258179 11.4144 0.0258179C10.3099 0.0258179 9.41703 0.921245 9.42024 2.02581C9.42345 3.13037 10.3215 4.0258 11.426 4.0258Z", "M6.5115 10.9277C7.61607 10.9277 8.5089 10.0322 8.50569 8.92766C8.50248 7.8231 7.60445 6.92767 6.49988 6.92767C5.39531 6.92767 4.50248 7.8231 4.50569 8.92766C4.5089 10.0322 5.40693 10.9277 6.5115 10.9277Z", "M2.00588 17.7877C3.11045 17.7877 4.00328 16.8922 4.00007 15.7877C3.99686 14.6831 3.09883 13.7877 1.99426 13.7877C0.889693 13.7877 -0.00313623 14.6831 7.23695e-05 15.7877C0.00328097 16.8922 0.901313 17.7877 2.00588 17.7877Z", "M16.4166 10.8838C17.5212 10.8838 18.414 9.98841 18.4108 8.88384C18.4076 7.77928 17.5096 6.88385 16.405 6.88385C15.3005 6.88385 14.4076 7.77928 14.4108 8.88384C14.414 9.98841 15.3121 10.8838 16.4166 10.8838Z"];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const mix = (a: string, b: string, t: number) => {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const m = (s: number) => Math.round(((x >> s) & 255) + (((y >> s) & 255) - ((x >> s) & 255)) * t);
  return '#' + ((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1);
};
const rgba = (h: string, a: number) => {
  const n = parseInt(h.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface Sim {
  open: number; openT: number; m: number; mT: number; sel: number; h: number[];
  timer: number; playing: boolean; pendingOpen: boolean; phase: 'open' | 'close';
  resumeAt: number; pulseAt: number; lastPk: number; prog: number; closedR: number;
}
interface Hit { x: number; y: number; r: number; i: number }
interface Caption { isOpen: boolean; sel: number; phase: 'open' | 'close' }

export interface SenseworksStackAnimationProps {
  language?: Lang;
  className?: string;
}

export function SenseworksStackAnimation({ language = 'en', className }: SenseworksStackAnimationProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<Lang>(language);
  useEffect(() => {
    langRef.current = language;
  }, [language]);

  const [size, setSize] = useState({ W: 1400, H: 500 });
  const [cap, setCap] = useState<Caption>({ isOpen: false, sel: 0, phase: 'open' });
  const [capVisible, setCapVisible] = useState(true);

  const reduce = useRef(false);
  const sim = useRef<Sim>({
    open: 0, openT: 0, m: 1, mT: 1, sel: 0, h: [1, 0, 0, 0, 0, 0], timer: 0.4, playing: true,
    pendingOpen: false, phase: 'open', resumeAt: 0, pulseAt: 0, lastPk: -1, prog: 0, closedR: 0,
  });
  const geo = useRef({ W: 1400, H: 500, dpr: 1, font: 'sans-serif', hits: [] as Hit[] });
  const fadeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const syncCaption = useCallback(() => {
    const s = sim.current;
    const next: Caption = { isOpen: s.openT === 1, sel: s.sel, phase: s.phase };
    if (reduce.current) { setCap(next); return; }
    setCapVisible(false);
    clearTimeout(fadeT.current);
    fadeT.current = setTimeout(() => { setCap(next); setCapVisible(true); }, 180);
  }, []);

  const layout = useCallback(() => {
    const { W, H } = geo.current, ox = W / 2, wide = W >= 900, pos: [number, number][] = [];
    const R = wide ? Math.min((W * 0.9) / (2 + 5 * SPREAD), H * 0.17) : Math.min((W * 0.9) / (2 + 2 * SPREAD), H * 0.12);
    const g = R * SPREAD, big = Math.min(R * BIG, H * 0.26);
    const blockH = Math.max(wide ? 2 * R : 2 * R + g, 2 * big * 1.05);
    const capEl = captionRef.current, capH = capEl ? capEl.offsetHeight : 100, gap = wide ? 28 : 36;
    // caption sits 20px above the dots; the dots sit 20px above the bottom edge
    const capTop = H - 49 - capH, top = Math.max(16, capTop - gap - blockH), oy = top + blockH / 2;
    if (capEl) capEl.style.top = Math.round(capTop) + 'px';
    if (wide) for (let i = 0; i < 6; i++) pos.push([ox + (i - 2.5) * g, oy]);
    else for (let i = 0; i < 6; i++) pos.push([ox + ((i % 3) - 1) * g, oy + (Math.floor(i / 3) - 0.5) * g]);
    return { R, ox, oy, pos, big };
  }, []);

  const activePulse = (now: number) => {
    const s = sim.current;
    if (reduce.current || !s.pulseAt) return 1;
    const t = (now - s.pulseAt) / 900;
    return t >= 1 ? 1 : 1 + 0.06 * Math.sin(Math.PI * t) * (1 - t * 0.3);
  };

  const select = useCallback((i: number) => {
    const s = sim.current;
    if (s.openT < 1 && !reduce.current) s.pendingOpen = true; else s.openT = 1;
    s.mT = 0; s.sel = (i + 6) % 6; s.timer = 0; s.phase = 'open';
    syncCaption();
  }, [syncCaption]);

  const pick = useCallback((i: number) => {
    const s = sim.current;
    s.playing = false;
    select(i);
    s.resumeAt = reduce.current ? 0 : performance.now() + T.resumeMs;
  }, [select]);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    if (reduce.current) { s.playing = false; s.open = s.openT = 1; s.m = s.mT = 0; setCap({ isOpen: true, sel: 0, phase: 'open' }); }

    const stage = stageRef.current!, cv = canvasRef.current!, ctx = cv.getContext('2d');
    // No 2D canvas (e.g. a test environment): leave the static caption and dots.
    if (!ctx) return;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      const H = r.width < 900 ? (r.width < 520 ? 640 : 600) : 500;
      setSize((p) => (p.W === Math.round(r.width) && p.H === H ? p : { W: Math.round(r.width), H }));
      const g = geo.current;
      g.dpr = Math.min(2, window.devicePixelRatio || 1); g.W = r.width; g.H = r.height;
      cv.width = Math.round(g.W * g.dpr); cv.height = Math.round(g.H * g.dpr);
      g.font = getComputedStyle(stage).getPropertyValue('--font-sans').trim() || 'sans-serif';
    };
    const ro = new ResizeObserver(resize);
    ro.observe(stage); resize();

    const fitText = (t: string, x: number, y: number, max: number) => {
      if (ctx.measureText(t).width <= max) { ctx.fillText(t, x, y); return; }
      let a = '', b = '';
      for (const w of t.split(' ')) { if (!b && ctx.measureText((a + ' ' + w).trim()).width <= max) a = (a + ' ' + w).trim(); else b = (b + ' ' + w).trim(); }
      const lh = parseInt(ctx.font.match(/(\d+)px/)![1], 10) * 1.2;
      ctx.fillText(a, x, y - lh / 2); ctx.fillText(b, x, y + lh / 2);
    };

    const draw = (now: number) => {
      const g = geo.current, { W, H } = g;
      ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const L = layout(), R = Math.max(8, L.R), op = ease(clamp(s.open, 0, 1)), ap = activePulse(now);
      const c = L.pos.map(([x, y], i) => ({ x: L.ox + (x - L.ox) * op, y: L.oy + (y - L.oy) * op, i, near: s.h[i] }));
      g.hits = c.map((k) => ({ x: k.x, y: k.y, r: R, i: k.i }));
      const dimOn = op > 0.98;
      // circles: outline at rest, white fill when active
      for (const k of c) {
        const fa = ease(k.near) * op, r = R * (k.i === s.sel ? ap : 1);
        ctx.globalAlpha = dimOn ? 0.6 + 0.4 * k.near : 1;
        ctx.beginPath(); ctx.arc(k.x, k.y, r - 0.75, 0, Math.PI * 2);
        if (fa > 0.001) { ctx.fillStyle = rgba(C.fill, fa); ctx.fill(); }
        ctx.lineWidth = 1.5; ctx.strokeStyle = C.line; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // progress ring on the active circle
      if (op > 0.98 && s.prog > 0) {
        const k = c[s.sel];
        ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = C.accent;
        ctx.beginPath(); ctx.arc(k.x, k.y, R * ap + 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.prog); ctx.stroke();
      }
      // accent where circles overlap — only while coming apart from the merged state
      if (s.m > 0.01) for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) {
        const A = c[i], B = c[j];
        if (Math.hypot(A.x - B.x, A.y - B.y) >= 2 * R) continue;
        ctx.save(); ctx.beginPath(); ctx.arc(A.x, A.y, R, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = rgba(C.accent, Math.min(1, s.m * 1.5)); ctx.beginPath(); ctx.arc(B.x, B.y, R + 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      // labels
      const la = clamp((op - 0.55) / 0.4, 0, 1), steps = COPY[langRef.current].steps;
      if (la > 0) for (const k of c) {
        const ink = mix(C.line, C.ink, ease(k.near) * op), a = la * (dimOn ? 0.6 + 0.4 * k.near : 1);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = rgba(ink, 0.95 * a); ctx.font = `500 ${Math.round(R * 0.42)}px ${g.font}`;
        ctx.fillText(String(k.i + 1).padStart(2, '0'), k.x, k.y - R * 0.1);
        const ls = Math.max(12, Math.round(R * 0.17));
        ctx.fillStyle = rgba(ink, 0.85 * a); ctx.font = `700 ${ls}px ${g.font}`;
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = (ls * 0.04).toFixed(2) + 'px';
        fitText(steps[k.i].name, k.x, k.y + R * 0.3, R * 1.6);
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '0px';
      }
      // closed: one outline that fills with the accent, grows and breathes
      const closed = 1 - op, mk = markRef.current;
      if (closed > 0.001) {
        const pulse = reduce.current ? 1 : 1 + Math.sin((now / 1000) * Math.PI * 2 / T.pulseSec) * 0.045 * ease(closed);
        const gm = ease(s.m), rad = (R + (L.big - R) * gm) * (1 + (pulse - 1) * gm), vis = Math.min(1, closed * 1.4);
        ctx.beginPath(); ctx.arc(L.ox, L.oy, rad - 0.75, 0, Math.PI * 2);
        ctx.fillStyle = rgba(C.accent, vis * gm); ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = rgba(C.line, vis * (1 - gm)); ctx.stroke();
        s.closedR = rad;
        if (mk) {
          mk.style.opacity = String(Math.min(1, closed * 1.6, s.m * 1.6));
          mk.style.transform = `translate(${L.ox - MARK_W / 2}px, ${L.oy - mk.offsetHeight / 2}px) scale(${(rad * 1.1) / MARK_W})`;
        }
      } else if (mk) mk.style.opacity = '0';
    };

    let last = performance.now(), raf = 0, onScreen = true;
    const tick = (now: number) => {
      raf = 0;
      // Off screen: stop the loop (the observer below restarts it).
      if (!onScreen) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!s.playing && s.resumeAt && now > s.resumeAt) { s.resumeAt = 0; s.timer = T.hold * 0.6; s.playing = true; }
      if (s.playing) {
        s.timer += dt;
        const wait = s.pendingOpen ? Infinity : s.openT < 1 ? (s.mT < 1 ? T.gatherHold : T.closedHold) : T.hold;
        if (s.timer > wait) {
          s.timer = 0;
          if (s.openT < 1 && s.mT < 1) s.mT = 1; //                                   gathered → merge
          else if (s.openT < 1) { s.mT = 0; s.pendingOpen = true; s.phase = 'open'; s.sel = 0; } // un-merge, then open
          else if (s.sel < 5) s.sel++;
          else { s.openT = 0; s.mT = 0; s.phase = 'close'; } //                         gather
          syncCaption();
        }
      }
      if (reduce.current) { s.open = s.openT; s.m = s.mT; s.h = s.h.map((_, i) => (i === s.sel ? 1 : 0)); }
      if (s.pendingOpen && s.m < 0.08) { s.pendingOpen = false; s.openT = 1; syncCaption(); }
      const pk = s.openT === 1 ? s.sel : -1;
      if (pk !== s.lastPk) { s.lastPk = pk; if (pk >= 0) s.pulseAt = now; }
      const k = Math.min(1, dt * T.rate);
      s.m += (s.mT - s.m) * k; if (Math.abs(s.mT - s.m) < 0.001) s.m = s.mT;
      s.open += (s.openT - s.open) * k; if (Math.abs(s.openT - s.open) < 0.001) s.open = s.openT;
      const hr = Math.min(1, dt * T.hiRate);
      s.h = s.h.map((v, i) => { const t = i === s.sel ? 1 : 0, n = v + (t - v) * hr; return Math.abs(t - n) < 0.001 ? t : n; });
      s.prog = s.playing && s.openT === 1 && !s.pendingOpen ? clamp(s.timer / T.hold, 0, 1) : 0;
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    });
    io.observe(stage);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); clearTimeout(fadeT.current); };
  }, [layout, syncCaption]);

  const hitAt = (e: MouseEvent<HTMLCanvasElement>): number | 'closed' | null => {
    const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, s = sim.current;
    if (s.openT < 1 || s.open < 0.9) { const L = layout(); return Math.hypot(x - L.ox, y - L.oy) <= Math.max(L.R, s.closedR) ? 'closed' : null; }
    for (const h of geo.current.hits) if (Math.hypot(x - h.x, y - h.y) <= h.r) return h.i;
    return null;
  };

  const T_ = COPY[language];
  const k = cap.isOpen ? `${String(cap.sel + 1).padStart(2, '0')} · ${T_.steps[cap.sel].full}` : 'Senseworks';
  const body = cap.isOpen ? T_.steps[cap.sel].body : cap.phase === 'close' ? T_.all : T_.intro;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <div ref={stageRef} className={styles.stage} style={{ height: size.H }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          tabIndex={0}
          aria-label="Six circles, one per platform layer. Use the left and right arrow keys to move between them."
          onClick={(e) => { const h = hitAt(e); if (h === null) return; if (h === 'closed') select(0); else pick(h); }}
          onMouseMove={(e) => { e.currentTarget.style.cursor = hitAt(e) !== null ? 'pointer' : 'default'; }}
          onKeyDown={(e) => {
            const s = sim.current;
            if (e.key === 'ArrowRight') { e.preventDefault(); pick(s.openT < 1 ? 0 : s.sel + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); pick(s.openT < 1 ? 5 : s.sel - 1); }
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); s.resumeAt = 0; s.playing = !s.playing; }
          }}
        />
        <div ref={markRef} className={styles.mark} aria-hidden="true">
          <svg viewBox="0 0 61 18" width={MARK_W} xmlns="http://www.w3.org/2000/svg">
            {BRANDMARK_PATHS.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
          </svg>
        </div>
        <div ref={captionRef} className={styles.caption} aria-live="polite">
          <div className={styles.captionInner} data-visible={capVisible}>
            <p className={styles.kicker}>{k}</p>
            <p className={styles.body} data-narrow={size.W < 900}>{body}</p>
          </div>
        </div>
        <div className={styles.dotsRow}>
          <div className={styles.dots} role="group" aria-label="Steps">
            {T_.steps.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.dot}
                aria-label={`Layer ${i + 1}`}
                aria-current={cap.isOpen && cap.sel === i ? 'true' : undefined}
                onClick={() => pick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SenseworksStackAnimation;
