'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './AllyCitation.module.css';

/*
 * Ally — citation source popover. 800×800 native canvas, 6.2 s loop.
 * Every position is a literal px value in canvas space.
 *
 *   0.00  Write  the answer writes in word by word (60 ms stagger); the
 *                BFNAR 2012:1 chip pops in after paragraph one
 *   2.80  Point  pointer fades in close to the chip (cursorIn: 24 px, 220 ms),
 *                lands 100 ms before the click
 *   3.40  Open   tap — the source popover rises off the chip, answer text dims
 *   3.90  Hold
 *   5.70  Out    everything fades for the loop
 */

const P1 = [
  'Goodwill redovisas som en immateriell',
  'tillgång och skrivs av systematiskt över',
  'sin nyttjandeperiod. Om perioden inte kan',
  'fastställas tillförlitligt antas den vara',
  'högst tio år.',
];
const P2 = ['Nedskrivningsbehovet prövas när det finns', 'en indikation på att värdet har minskat.'];
const N1 = P1.join(' ').split(' ').length;
const N2 = P2.join(' ').split(' ').length;

interface AnimState {
  reset: boolean;
  words: number; //   words revealed, across both paragraphs
  chip: boolean;
  pointer: boolean;
  hover: boolean;
  pressed: boolean;
  open: boolean;
  out: boolean;
}

const INITIAL: AnimState = { reset: true, words: 0, chip: false, pointer: false, hover: false, pressed: false, open: false, out: false };
const FINAL: AnimState = { reset: true, words: N1 + N2, chip: true, pointer: false, hover: false, pressed: false, open: true, out: false };

/* The whole timeline: [delay after the previous step (ms), state transition]. */
type Step = [number, (s: AnimState) => AnimState];
const WORD_MS = 60;
const word: Step = [WORD_MS, (s) => ({ ...s, words: s.words + 1 })];
const STEPS: Step[] = [
  [0, () => INITIAL], //                                                0.000 reset (transitions off)
  [40, (s) => ({ ...s, reset: false, words: 1 })], //                   0.040 first word
  ...Array.from({ length: N1 - 1 }, () => word), //                     → 1.480
  [120, (s) => ({ ...s, chip: true })], //                              1.600 chip pops
  [200, (s) => ({ ...s, words: s.words + 1 })], //                      1.800 paragraph two
  ...Array.from({ length: N2 - 1 }, () => word), //                     → 2.520
  [560, (s) => ({ ...s, pointer: true })], //                           3.080 cursorIn
  [220, (s) => ({ ...s, hover: true })], //                             3.300 lands (cursorSettle 100 ms)
  [20, (s) => ({ ...s, pressed: true })], //                            3.320 press
  [80, (s) => ({ ...s, open: true })], //                               3.400 popover opens
  [60, (s) => ({ ...s, pressed: false })], //                           3.460 release
  [2240, (s) => ({ ...s, out: true })], //                              5.700 fade out
  [500, (s) => s], //                                                   hold to 6.200
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

function Words({ lines, offset, shown }: { lines: string[]; offset: number; shown: number }) {
  let k = offset;
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className={styles.line}>
          {line.split(' ').map((w, i) => {
            const on = k++ < shown;
            return <span key={i} className={styles.word} data-on={on || undefined}>{w}</span>;
          })}
        </span>
      ))}
    </>
  );
}

/*
 * Site integration: `paused` (Media sets it while the frame is off screen)
 * holds the timeline where it is, so the animation resumes from the same
 * moment rather than restarting. Reduced motion shows the finished frame.
 * The 800×800 canvas is shown as 800×572 (the site's 7:5 media frame),
 * shifted up 108px to centre its content — see animations/index.tsx.
 */
export function AllyCitationAnimation({ className, paused = false }: { className?: string; paused?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [state, setS] = useState<AnimState>(INITIAL);
  const s = reduced ? FINAL : state;
  const pausedRef = useRef(paused);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let waiting = false;
    const run = () => {
      timer = undefined;
      // Paused: hold the next step until unpaused.
      if (pausedRef.current) { waiting = true; return; }
      const [, fn] = STEPS[i];
      setS((prev) => fn(prev));
      i = (i + 1) % STEPS.length;
      timer = setTimeout(run, STEPS[i][0]);
    };
    resumeRef.current = () => {
      if (waiting && !timer) { waiting = false; run(); }
    };
    timer = setTimeout(run, 0);
    return () => { if (timer) clearTimeout(timer); resumeRef.current = null; };
  }, [reduced]);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resumeRef.current?.();
  }, [paused]);

  const still = reduced || s.reset;
  const t = (v: string) => (still ? 'none' : v);

  const scene: CSSProperties = { opacity: s.out ? 0 : 1, transition: t('opacity 450ms cubic-bezier(.37, 0, .63, 1)') };
  const chip: CSSProperties = {
    opacity: s.chip ? 1 : 0,
    transform: `scale(${s.chip ? (s.pressed ? 0.94 : 1) : 0.6})`,
    transition: s.pressed ? t('transform 80ms ease-out, background-color 120ms ease')
      : t('opacity 200ms cubic-bezier(.25, 1, .5, 1), transform 350ms cubic-bezier(.34, 1.56, .64, 1), background-color 120ms ease'),
  };
  const pointer: CSSProperties = {
    opacity: s.pointer ? 1 : 0,
    transform: `translate(${s.pointer ? 0 : 14}px, ${s.pointer ? 0 : 20}px) scale(${s.pressed ? 0.94 : 1})`,
    transition: s.pressed ? t('transform 80ms ease-out') : t('opacity 220ms cubic-bezier(.16, 1, .3, 1), transform 220ms cubic-bezier(.16, 1, .3, 1)'),
  };
  const popover: CSSProperties = {
    opacity: s.open ? 1 : 0,
    transform: s.open ? 'translateY(0px) scale(1)' : 'translateY(8px) scale(0.94)',
    transition: s.open ? t('opacity 300ms cubic-bezier(.25, 1, .5, 1), transform 400ms cubic-bezier(.34, 1.56, .64, 1)') : 'none',
  };

  return (
    <div className={[styles.canvas, className].filter(Boolean).join(' ')} data-still={still || undefined} data-open={s.open || undefined} aria-hidden="true">
      <div className={styles.scene} style={scene}>
        <p className={styles.p1}><Words lines={P1} offset={0} shown={s.words} /></p>

        <div className={styles.chipWrap}>
          <div className={styles.chip} data-hover={s.hover || undefined} style={chip}>BFNAR 2012:1</div>

          <div className={styles.popover} style={popover}>
            <div className={styles.title}>BFNAR 2012:1 Årsredovisning och koncernredovisning (K3)</div>
            <div className={styles.meta}>BFNAR 2021:3</div>
            <div className={styles.page}>s. 1666</div>
            <div className={styles.caret}></div>
          </div>

          <div className={styles.pointer} style={pointer}>
            <svg viewBox="0 0 24 24" width={36} height={36}>
              <path d="M5 2 L5 19 L9.6 14.6 L12.4 21.4 L15.6 20 L12.8 13.4 L19 13.4 Z" fill="var(--acl-ink)" stroke="var(--acl-paper)" strokeWidth={1.4} strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p className={styles.p2}><Words lines={P2} offset={N1} shown={s.words} /></p>
      </div>
    </div>
  );
}

export default AllyCitationAnimation;
