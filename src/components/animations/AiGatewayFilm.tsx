'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './AiGatewayFilm.module.css';

/*
 * Every AI request goes through one gateway. 700×500 native canvas, 8.37 s loop.
 * Every position is a literal px value in canvas space.
 *
 *   0.00  1 Bygg   cut build from 6 o'clock: the gateway card, then its rows; the four sources rise in and their
 *                  lines draw into the card (0.50); the lines out draw (0.62) and the three outputs rise in
 *   0.75  2 Flöde  one request at a time travels its line into the gateway (0.7 s) and out to an output (0.7 s).
 *                  The first shows the checks: 1.45 Godkända pops, 1.75 Styrd åtkomst pops. Each request writes its
 *                  own log entry — the last drops out, the new one rises in, its highlight wipes in behind it:
 *                  2.05 10:41 Fråga · 3.40 10:42 Fakturakontroll · 4.70 10:43 Protokollgranskning · 6.00 10:44 Bankavstämning
 *   8.37  loop     hard cut back to the build
 */

const SOURCES = ['Frågor till Ally', 'Fakturor', 'Protokoll', 'Huvudbok mot bank'];
const LOG: [string, string][] = [['10:41', 'Fråga'], ['10:42', 'Fakturakontroll'], ['10:43', 'Protokollgranskning'], ['10:44', 'Bankavstämning']];

/* The lines (canvas px). In: a source to the gateway's left edge. Out: its right edge to an output. */
const IN_Y = [164.06, 220.06, 276.06, 332.06];
const OUT_Y = [209.56, 249.81, 290.06];
const HUB_Y = 249.81;
const inPath = (y: number) => `M220.5 ${y} C253.75 ${y}, 253.75 ${HUB_Y}, 280 ${HUB_Y}`;
const outPath = (y: number) => `M533.75 ${HUB_Y} C553 ${HUB_Y}, 553 ${y}, 572.25 ${y}`;
const ROUTE = [0, 1, 2, 1]; // the output each source's request lands on

type Req = 0 | 1 | 2 | 3 | 4; // 0 waiting · 1 travelling in · 2 in the gateway · 3 travelling out · 4 landed
type Hl = 0 | 1 | 2; //           0 none · 1 wiped in · 2 faded

interface AnimState {
  reset: boolean;
  build: boolean;
  checkModel: boolean; // the first request's checks
  checkData: boolean;
  req: Req[];
  log: number; //       the entry in the log (-1: empty)
  logOut: boolean; //   it is dropping out for the next
  hl: Hl[];
}

const INITIAL: AnimState = { reset: true, build: false, checkModel: false, checkData: false, req: [0, 0, 0, 0], log: -1, logOut: false, hl: [0, 0, 0, 0] };
const FINAL: AnimState = { ...INITIAL, reset: false, build: true, log: 3 };

const setReq = (i: number, v: Req) => (s: AnimState): AnimState => ({ ...s, req: s.req.map((r, j) => (j === i ? v : r)) as Req[] });
const setHl = (i: number, v: Hl) => (s: AnimState): AnimState => ({ ...s, hl: s.hl.map((h, j) => (j === i ? v : h)) as Hl[] });

/* The whole timeline: [delay after the previous step (ms), state transition]. */
type Step = [number, (s: AnimState) => AnimState];
const STEPS: Step[] = [
  [0, () => INITIAL],                                               // 0.000 reset (transitions off)
  [40, (s) => ({ ...s, reset: false, build: true })],               // 0.040 the build (its own delays in the CSS)
  [710, setReq(0, 1)],                                              // 0.750 request 1 sets off
  [700, (s) => ({ ...setReq(0, 2)(s), checkModel: true })],         // 1.450 in the gateway; Godkända pops
  [300, (s) => ({ ...s, checkData: true })],                        // 1.750 Styrd åtkomst pops
  [300, (s) => ({ ...s, log: 0 })],                                 // 2.050 10:41 rises in
  [120, setHl(0, 1)],                                               // 2.170 its highlight wipes in
  [350, setReq(0, 3)],                                              // 2.520 out to an output
  [130, setReq(1, 1)],                                              // 2.650 request 2 sets off
  [520, setHl(0, 2)],                                               // 3.170 the highlight fades
  [30, (s) => ({ ...s, logOut: true })],                            // 3.200 10:41 drops out
  [20, setReq(0, 4)],                                               // 3.220 request 1 lands
  [130, setReq(1, 2)],                                              // 3.350 request 2 in the gateway
  [50, (s) => ({ ...s, log: 1, logOut: false })],                   // 3.400 10:42 rises in
  [120, setHl(1, 1)],                                               // 3.520 
  [350, setReq(1, 3)],                                              // 3.870 
  [80, setReq(2, 1)],                                               // 3.950 request 3 sets off
  [550, (s) => ({ ...s, logOut: true })],                           // 4.500 10:42 drops out
  [20, setHl(1, 2)],                                                // 4.520 
  [50, setReq(1, 4)],                                               // 4.570 request 2 lands
  [80, setReq(2, 2)],                                               // 4.650 
  [50, (s) => ({ ...s, log: 2, logOut: false })],                   // 4.700 10:43 rises in
  [120, setHl(2, 1)],                                               // 4.820 
  [350, setReq(2, 3)],                                              // 5.170 
  [80, setReq(3, 1)],                                               // 5.250 request 4 sets off
  [550, (s) => ({ ...s, logOut: true })],                           // 5.800 10:43 drops out
  [20, setHl(2, 2)],                                                // 5.820 
  [50, setReq(2, 4)],                                               // 5.870 request 3 lands
  [80, setReq(3, 2)],                                               // 5.950 
  [50, (s) => ({ ...s, log: 3, logOut: false })],                   // 6.000 10:44 rises in
  [120, setHl(3, 1)],                                               // 6.120 
  [350, setReq(3, 3)],                                              // 6.470 
  [650, setHl(3, 2)],                                               // 7.120 
  [50, setReq(3, 4)],                                               // 7.170 request 4 lands
  [1200, (s) => s],                                                 // 8.370 hold to the loop
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

const d = (ms: number) => ({ '--gw-d': ms + 'ms' }) as CSSProperties;

export function AiGatewayFilm({ className, paused = false }: { className?: string; paused?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [state, setS] = useState<AnimState>(INITIAL);
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

  const s = reduced ? FINAL : state;
  const still = reduced || state.reset;
  const on = s.build || undefined;

  return (
    <div className={[styles.canvas, className].filter(Boolean).join(' ')} data-still={still || undefined} aria-hidden="true">
      <div className={styles.wash} />

      {/* the lines — drawn, not built */}
      <svg className={styles.lines} viewBox="0 0 700 500" fill="none" aria-hidden="true">
        {IN_Y.map((y, i) => <path key={'i' + i} className={styles.line} data-on={on} style={d(460 + i * 70)} d={inPath(y)} pathLength={1} />)}
        {OUT_Y.map((y, j) => <path key={'o' + j} className={styles.lineOut} data-on={on} style={d(580 + j * 70)} d={outPath(y)} pathLength={1} />)}
      </svg>

      {/* the sources */}
      <div className={styles.sources}>
        {SOURCES.map((label, i) => (
          <div key={label} className={styles.source} data-on={on} style={d(280 + i * 70)}>
            <span className={styles.bullet} />{label}
          </div>
        ))}
      </div>

      {/* the outputs */}
      <div className={styles.outputs}>
        {OUT_Y.map((_, j) => (
          <div key={j} className={styles.output} data-on={on} style={d(804 + j * 70)}>
            <span className={styles.outputDot} />
            <span className={styles.outputBar} />
          </div>
        ))}
      </div>

      {/* the requests in flight — they pass under the gateway */}
      {SOURCES.map((_, i) => (
        <span key={'pi' + i} className={styles.packetIn} data-go={s.req[i] === 1 || undefined} data-gone={s.req[i] >= 2 || undefined}
          style={{ offsetPath: `path('${inPath(IN_Y[i])}')` }} />
      ))}
      {SOURCES.map((_, i) => (
        <span key={'po' + i} className={styles.packetOut} data-go={s.req[i] >= 3 || undefined} data-gone={s.req[i] === 4 || undefined}
          style={{ offsetPath: `path('${outPath(OUT_Y[ROUTE[i]])}')` }} />
      ))}

      {/* the gateway */}
      <div className={styles.card} data-on={on}>
        <div className={styles.head} data-on={on} style={d(120)}>
          <span className={styles.title}>AI-gateway</span>
          <span className={styles.status}><span className={styles.statusDot} />Aktiv</span>
        </div>
        <div className={styles.row} data-on={on} style={d(190)}>
          <span className={styles.label}>Modeller</span>
          <span className={`${styles.chip} ${styles.chipGreen}`} data-pop={s.checkModel || undefined}>Godkända</span>
        </div>
        <div className={styles.row} data-on={on} style={d(260)}>
          <span className={styles.label}>Data</span>
          <span className={`${styles.chip} ${styles.chipViolet}`} data-pop={s.checkData || undefined}>Styrd åtkomst</span>
        </div>
        <div className={styles.trace} data-on={on} style={d(330)}>
          <div className={styles.label}>Spårbarhet</div>
          <div className={styles.well}>
            {LOG.map((_, i) => (
              <span key={'h' + i} className={styles.hl} data-on={s.hl[i] >= 1 || undefined} data-gone={s.hl[i] === 2 || s.log !== i || undefined} />
            ))}
            {LOG.map(([time, what], i) => (
              <span key={time} className={styles.entry}
                data-state={s.log === i ? (s.logOut ? 'out' : 'in') : s.log > i ? 'out' : undefined}>
                {time} · Ally · {what} · <span className={styles.muted}>loggad</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiGatewayFilm;
