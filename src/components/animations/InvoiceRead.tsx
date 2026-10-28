'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './InvoiceRead.module.css';

/*
 * Läser fakturor åt dig — Ally reads the invoice. 700×500 native canvas, 5.05 s loop.
 * Every position is a literal px value in canvas space. The app page is laid out once
 * (the "world", 1400×999) and three hard-cut camera framings show parts of it.
 *
 *   0.00  1 Överst    top of the invoice; the page builds in from below
 *                     (panels 56 px, then the paper 28 px · 480 ms each · 160 ms per layer, 70 ms per item)
 *   0.75             highlight sweeps the supplier, 1.10 the invoice date (300 ms each)
 *   1.75  2 Summor    hard cut to the totals (no rebuild); 2.00 sweep on the VAT, 2.35 on the amount to pay
 *   2.75  3 Uppgifter hard cut to the top of Fakturauppgifter; the four rows rise in (14 px, 70 ms apart)
 *   3.44             "Läst av Ally" pops
 *   5.05             loop: hard cut back to 1, the page builds again
 */

type Hl = 'seller' | 'date' | 'moms' | 'pay';
interface Run { left?: number; right?: number; top: number; size: number; bold?: boolean; hl?: Hl; t: string }

/* The invoice's text runs, px inside the paper (612.5×866.25). Helvetica, like the PDF. */
const RUNS: Run[] = [
  { right: 49.68, top: 22.22, size: 8.23, t: 'Sida 1(1)' },
  { left: 49.39, top: 35.19, size: 16.46, bold: true, hl: 'seller', t: 'Kyliga Delar AB' },
  { left: 335.43, top: 35.19, size: 16.46, bold: true, t: 'Faktura' },
  { left: 443.47, top: 61.53, size: 9.26, t: 'Fakturadatum' },
  { left: 515.49, top: 61.53, size: 9.26, hl: 'date', t: '2022-01-31' },
  { left: 443.47, top: 74.91, size: 9.26, t: 'Fakturanr' },
  { left: 515.49, top: 74.91, size: 9.26, t: '3' },
  { left: 443.47, top: 88.28, size: 9.26, t: 'OCR' },
  { left: 515.49, top: 88.28, size: 9.26, t: '331' },
  { left: 335.43, top: 136.64, size: 9.26, bold: true, t: 'Freezing Services Ltd' },
  { left: 49.39, top: 225.13, size: 9.26, t: 'Kundnr' },
  { left: 132.73, top: 225.13, size: 9.26, t: '5' },
  { left: 335.43, top: 225.13, size: 9.26, t: 'Betalningsvillkor' },
  { left: 417.74, top: 225.13, size: 9.26, t: '30 dagar' },
  { left: 335.43, top: 238.51, size: 9.26, t: 'Förfallodatum' },
  { left: 417.74, top: 238.51, size: 9.26, t: '2022-03-02' },
  { left: 335.43, top: 251.88, size: 9.26, t: 'Dröjsmålsränta' },
  { left: 417.74, top: 251.88, size: 9.26, t: '8%' },
  { left: 49.39, top: 283.78, size: 9.26, t: 'Artnr' },
  { left: 128.62, top: 283.78, size: 9.26, t: 'Benämning' },
  { right: 334.69, top: 283.78, size: 9.26, t: 'Lev ant' },
  { left: 334.4, top: 283.78, size: 9.26, t: 'Enhet' },
  { right: 152.57, top: 283.78, size: 9.26, t: 'À-pris' },
  { right: 49.68, top: 283.78, size: 9.26, t: 'Summa' },
  { left: 49.39, top: 305.39, size: 9.26, t: '3' },
  { left: 128.62, top: 305.39, size: 9.26, t: 'Proffs set' },
  { right: 334.69, top: 305.39, size: 9.26, t: '2,00' },
  { left: 334.4, top: 305.39, size: 9.26, t: 'st' },
  { right: 152.57, top: 305.39, size: 9.26, t: '35 599,20' },
  { right: 49.68, top: 305.39, size: 9.26, t: '71 198,40' },
  { left: 49.39, top: 321.54, size: 9.26, t: '6' },
  { left: 128.62, top: 321.54, size: 9.26, t: 'Bas set' },
  { right: 334.69, top: 321.54, size: 9.26, t: '4,00' },
  { left: 334.4, top: 321.54, size: 9.26, t: 'st' },
  { right: 152.57, top: 321.54, size: 9.26, t: '26 799,20' },
  { right: 49.68, top: 321.54, size: 9.26, t: '107 196,80' },
  { left: 49.39, top: 337.69, size: 9.26, t: '9' },
  { left: 128.62, top: 337.69, size: 9.26, t: 'Liten set' },
  { right: 334.69, top: 337.69, size: 9.26, t: '2,00' },
  { left: 334.4, top: 337.69, size: 9.26, t: 'st' },
  { right: 152.57, top: 337.69, size: 9.26, t: '19 599,20' },
  { right: 49.68, top: 337.69, size: 9.26, t: '39 198,40' },
  { left: 128.62, top: 353.85, size: 9.26, t: 'Avtalad rabatt' },
  { right: 334.69, top: 353.85, size: 9.26, t: '1,00' },
  { left: 334.4, top: 353.85, size: 9.26, t: 'st' },
  { right: 152.57, top: 353.85, size: 9.26, t: '-2 175,94' },
  { right: 49.68, top: 353.85, size: 9.26, t: '-2 175,94' },
  { left: 49.39, top: 707.7, size: 9.26, t: 'Exkl. moms' },
  { left: 49.39, top: 724.16, size: 9.26, t: '215 417,66' },
  { left: 123.47, top: 707.7, size: 9.26, t: 'Moms 25 %' },
  { left: 123.47, top: 724.16, size: 9.26, hl: 'moms', t: '53 854,42' },
  { left: 197.55, top: 707.7, size: 9.26, t: 'Öresavr' },
  { left: 197.55, top: 724.16, size: 9.26, t: '-0,08' },
  { left: 328.23, top: 707.7, size: 9.26, t: 'Totalt' },
  { left: 328.23, top: 724.16, size: 9.26, t: '269 272,00' },
  { right: 49.68, top: 707.7, size: 9.26, bold: true, t: 'ATT BETALA' },
  { right: 49.68, top: 722.72, size: 12.35, bold: true, hl: 'pay', t: 'SEK 269 272,00' },
  { left: 49.39, top: 758.11, size: 9.26, t: 'Adress' },
  { left: 49.39, top: 771.49, size: 9.26, t: 'Kyliga Delar AB' },
  { left: 49.39, top: 784.87, size: 9.26, t: 'Demovägen 49' },
  { left: 49.39, top: 798.24, size: 9.26, t: '90729 Umeå' },
  { left: 49.39, top: 811.62, size: 9.26, t: 'Sverige' },
  { left: 234.6, top: 758.11, size: 9.26, t: 'Telefon' },
  { left: 234.6, top: 771.49, size: 9.26, t: '070-0000000' },
  { left: 234.6, top: 788.98, size: 9.26, t: 'E-post' },
  { left: 234.6, top: 802.36, size: 9.26, t: 'kyligadelar@exempel.com' },
  { left: 420.83, top: 758.11, size: 9.26, t: 'Clearingnr' },
  { left: 420.83, top: 771.49, size: 9.26, t: '0000' },
  { left: 420.83, top: 788.98, size: 9.26, t: 'Kontonr' },
  { left: 420.83, top: 802.36, size: 9.26, t: '00000000' },
  { left: 481.54, top: 758.11, size: 9.26, t: 'Organisationsnr' },
  { left: 481.54, top: 771.49, size: 9.26, t: '556588-2478' },
  { left: 481.54, top: 788.98, size: 9.26, t: 'Momsreg. nr' },
  { left: 481.54, top: 802.36, size: 9.26, t: 'SE000000' },
  { left: 481.54, top: 819.85, size: 9.26, t: 'Godkänd för F-skatt' },
];
/* Hairlines on the invoice: [left, top, width] */
const RULES: [number, number, number][] = [
  [335.43, 127.59, 227.39],
  [335.43, 201.67, 227.39],
  [49.39, 278.84, 513.43],
  [49.39, 296.33, 513.43],
  [49.39, 702.24, 513.43],
  [49.39, 738.77, 513.43],
];

const CRUMBS = ['Uppdrag', 'Lagstadgad revision: 2025-12', 'Underlag', 'Faktura 3.pdf'];
const FIELDS: [string, string][] = [
  ['Leverantör', 'Kyliga Delar AB'],
  ['Fakturadatum', '2022-01-31'],
  ['Belopp', '269 272,00 SEK'],
  ['Moms', '53 854,42 SEK'],
];

/* Camera framings — the world's offset for each shot (hard cuts, never animated) */
const SHOTS = {
  1: 'translate(-278.25px, -43.31px)', //   top of the invoice
  2: 'translate(-278.25px, -432.69px)', //  the totals
  3: 'translate(-700px, -84px)', //         top of Fakturauppgifter
} as const;
type Shot = keyof typeof SHOTS;

interface AnimState {
  reset: boolean; //  transitions off (loop seam)
  shot: Shot;
  built: boolean; //  the page has built in
  hl: Record<Hl, boolean>;
  rows: boolean;
  tag: boolean;
}

const NO_HL = { seller: false, date: false, moms: false, pay: false };
const INITIAL: AnimState = { reset: true, shot: 1, built: false, hl: NO_HL, rows: false, tag: false };
const FINAL: AnimState = { reset: true, shot: 3, built: true, hl: { seller: true, date: true, moms: true, pay: true }, rows: true, tag: true };

/* The whole timeline: [delay after the previous step (ms), state transition]. */
type Step = [number, (s: AnimState) => AnimState];
const hl = (k: Hl): Step[1] => (s) => ({ ...s, hl: { ...s.hl, [k]: true } });
const STEPS: Step[] = [
  [0, () => INITIAL], //                                  0.000 reset (transitions off)
  [40, (s) => ({ ...s, reset: false, built: true })], //   0.040 the page builds
  [710, hl('seller')], //                                 0.750 sweep: supplier
  [350, hl('date')], //                                   1.100 sweep: invoice date
  [650, (s) => ({ ...s, shot: 2 })], //                   1.750 cut: totals
  [250, hl('moms')], //                                   2.000 sweep: VAT
  [350, hl('pay')], //                                    2.350 sweep: amount to pay
  [400, (s) => ({ ...s, shot: 3, rows: true })], //       2.750 cut: fields; rows rise
  [690, (s) => ({ ...s, tag: true })], //                 3.440 Läst av Ally pops
  [1610, (s) => s], //                                    hold to 5.050
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/* Ally, small: a simplified mark for the 10 px tag icon */
function AllyGlyph() {
  return (
    <svg viewBox="0 0 12 12" width={11} height={11} aria-hidden="true">
      <rect x="1.5" y="1" width="9" height="7" rx="3" fill="#c9d8e3" />
      <rect x="2.75" y="2.5" width="6.5" height="4" rx="2" fill="#0d1f33" />
      <circle cx="4.75" cy="4.4" r="0.8" fill="#5fe3c8" />
      <circle cx="7.25" cy="4.4" r="0.8" fill="#5fe3c8" />
      <path d="M3.5 11c0-1.6 1.1-2.6 2.5-2.6s2.5 1 2.5 2.6z" fill="#a9bfcf" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" width={10.5} height={10.5} aria-hidden="true">
      <path d="M4.25 2.5 7.75 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/*
 * Site integration: `paused` (Media sets it while the frame is off screen)
 * stops the timeline where it is; it carries on from the same step when
 * the frame comes back. Reduced motion shows the final frame, still.
 */
export function InvoiceReadAnimation({ className, paused = false }: { className?: string; paused?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [s, setS] = useState<AnimState>(INITIAL);
  /* the next step to run — kept across pauses */
  const stepRef = useRef(0);

  useEffect(() => {
    if (reduced || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      const [, fn] = STEPS[stepRef.current];
      setS((prev) => fn(prev));
      stepRef.current = (stepRef.current + 1) % STEPS.length;
      timer = setTimeout(run, STEPS[stepRef.current][0]);
    };
    timer = setTimeout(run, STEPS[stepRef.current][0]);
    return () => clearTimeout(timer);
  }, [reduced, paused]);

  const frame = reduced ? FINAL : s;
  const still = reduced || s.reset;
  /* build-in delay for one element (ms), as a custom property the CSS transition reads */
  const d = (ms: number) => ({ '--ira-d': `${ms}ms` }) as CSSProperties;

  return (
    <div
      className={[styles.canvas, className].filter(Boolean).join(' ')}
      data-still={still || undefined}
      data-built={frame.built || undefined}
      data-rows={frame.rows || undefined}
      aria-hidden="true"
    >
      <div className={styles.world} style={{ transform: SHOTS[frame.shot] }}>
        <div className={styles.page}>
          <div className={styles.header} />
        </div>

        {/* breadcrumb bar — structure layer, item 0 */}
        <div className={`${styles.crumbs} ${styles.buildPanel}`} style={d(0)}>
          {CRUMBS.map((c, i) => (
            <span key={c} className={styles.crumb} data-last={i === CRUMBS.length - 1 || undefined}>
              {c}
              {i < CRUMBS.length - 1 ? <span className={styles.sep}><Chevron /></span> : null}
            </span>
          ))}
        </div>

        {/* document well — structure layer, item 1; the paper — metrics layer, item 0 */}
        <div className={`${styles.docwell} ${styles.buildPanel}`} style={d(70)}>
          <div className={`${styles.paper} ${styles.buildMetric}`} style={d(160)}>
            {RULES.map(([x, y, w], i) => <div key={i} className={styles.rule} style={{ left: x, top: y, width: w }} />)}
            {RUNS.map((r, i) => (
              <div
                key={i}
                className={styles.run}
                data-bold={r.bold || undefined}
                style={{ ...(r.right != null ? { right: r.right } : { left: r.left }), top: r.top, fontSize: r.size }}
              >
                {r.hl ? <span className={styles.hl} data-on={frame.hl[r.hl] || undefined} /> : null}
                {r.t}
              </div>
            ))}
          </div>
        </div>

        {/* Fakturauppgifter — structure layer, item 2 */}
        <div className={`${styles.panel} ${styles.buildPanel}`} style={d(140)}>
          <div className={`${styles.ptitle} ${styles.buildMetric}`} style={d(230)}>Fakturauppgifter</div>
          <div className={styles.tag} data-on={frame.tag || undefined}>
            <AllyGlyph />
            Läst av Ally
          </div>
          <div className={`${styles.lede} ${styles.buildMetric}`} style={d(300)}>Hämtat direkt ur dokumentet.</div>
          {FIELDS.map(([l, v], i) => (
            <div key={l} className={styles.field} style={{ top: 68.25 + i * 40.25, ...d(i * 70) }}>
              <span className={styles.fieldL}>{l}</span>
              <span className={styles.fieldV}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InvoiceReadAnimation;
