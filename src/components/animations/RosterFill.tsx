'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './RosterFill.module.css'

/**
 * RosterFill — 700×500 fixed-canvas animation.
 *
 * Geometry is literal px in a 700×500 space. The card is 984×468 and is
 * positioned at left:-324 / top:40, so it deliberately overflows the canvas
 * on the left, right and bottom — the canvas's own overflow:hidden does the
 * cropping. That crop is the design; do not reposition to make it fit.
 *
 * The root canvas has no background (the host frame shows its own gradient).
 * Scaling for 100% / 50% / 33% containers is the host ScaledCanvas's job.
 */

export type RosterFillProps = {
  /** Portrait sources. Defaults assume the four PNGs sit in public/animations/roster. */
  images?: {
    redhead: string
    bearded: string
    blonde: string
    glasses: string
  }
  /** Loop the sequence (default true). */
  loop?: boolean
  className?: string
  paused?: boolean
}

const DEFAULT_IMAGES = {
  redhead: '/animations/roster/woman-04.png',
  bearded: '/animations/roster/man-04.png',
  blonde: '/animations/roster/woman-01.png',
  glasses: '/animations/roster/woman-02.png',
}

/* ---------- timing (ms, absolute on the sequence clock) ---------- */

const T = {
  card: 0,
  chrome: [100, 170, 240],
  seed: [420, 500, 580],
  seedFlag: [480, 560, 640],
  joins: [
    /* row, avatarIndex, at */
    [2, 1, 1900],
    [0, 1, 3000],
    [2, 2, 4100],
    [1, 1, 5200],
    [1, 2, 6300],
    [0, 2, 7400],
  ] as const,
  flagLag: 450,
  reset: 9200,
  resetStagger: [
    [0, 2, 150],
    [2, 2, 450],
    [0, 1, 450],
    [1, 2, 300],
    [1, 1, 600],
    [2, 1, 750],
  ] as const,
  wipe: 10180,
  total: 10600,
}

/** flag value per row after each event: [seed, after join 1, after join 2] */
const FLAGS: number[][] = [
  [5, 6, 5],
  [3, 2, 3],
  [1, 2, 1],
]

const ROW_PEOPLE: Array<Array<keyof typeof DEFAULT_IMAGES>> = [
  ['redhead', 'bearded', 'blonde'],
  ['bearded', 'blonde', 'glasses'],
  ['glasses', 'redhead', 'bearded'],
]

/* ---------- reduced motion ---------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])
  return reduced
}

/* ---------- state ---------- */

interface Digit {
  cur: number | null
  prev: number | null
  k: number
}

interface State {
  chrome: [boolean, boolean, boolean]
  /** avatar slot visibility, 3 rows × 3 slots */
  shown: boolean[][]
  digits: Digit[]
  wiped: boolean
}

const INITIAL: State = {
  chrome: [false, false, false],
  shown: [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ],
  digits: [
    { cur: null, prev: null, k: 0 },
    { cur: null, prev: null, k: 0 },
    { cur: null, prev: null, k: 0 },
  ],
  wiped: false,
}

const clone = (s: State): State => ({
  chrome: [...s.chrome] as State['chrome'],
  shown: s.shown.map((r) => [...r]),
  digits: s.digits.map((d) => ({ ...d })),
  wiped: s.wiped,
})

export function RosterFill({ images = DEFAULT_IMAGES, loop = true, className, paused = false }: RosterFillProps) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = useState<State>(INITIAL)
  const [cycle, setCycle] = useState(0)
  const [runId, setRunId] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // A ref, not a dependency of the timeline effect below — toggling it
  // shouldn't tear down and reset the whole state machine, just stop
  // the queue from advancing to its next step until it's false again.
  const pausedRef = useRef(paused)
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  const pumpRef = useRef<() => void>(() => {})

  const replay = useCallback(() => setRunId((r) => r + 1), [])

  /** the whole timeline as one ordered queue of [absoluteMs, mutation] steps */
  const steps = useMemo(() => {
    const q: Array<[number, (s: State) => void]> = []

    T.chrome.forEach((at, i) => q.push([at, (s) => (s.chrome[i] = true)]))
    T.seed.forEach((at, i) => q.push([at, (s) => (s.shown[i][0] = true)]))
    T.seedFlag.forEach((at, i) =>
      q.push([
        at,
        (s) => {
          s.digits[i] = { cur: FLAGS[i][0], prev: null, k: s.digits[i].k + 1 }
        },
      ]),
    )

    const joinCount = [0, 0, 0]
    T.joins.forEach(([row, slot, at]) => {
      q.push([at, (s) => (s.shown[row][slot] = true)])
      joinCount[row] += 1
      const step = joinCount[row]
      q.push([
        at + T.flagLag,
        (s) => {
          s.digits[row] = { cur: FLAGS[row][step], prev: s.digits[row].cur, k: s.digits[row].k + 1 }
        },
      ])
    })

    T.resetStagger.forEach(([row, slot, offset]) =>
      q.push([T.reset + offset, (s) => (s.shown[row][slot] = false)]),
    )
    q.push([T.wipe, (s) => (s.wiped = true)])

    return q.sort((a, b) => a[0] - b[0])
  }, [])

  // One state machine: the absolute-time steps above are converted into a
  // queue of *relative* [wait, fn] pairs (delta from the previous step) and
  // drained one at a time by pump() — guarded so it's a no-op whenever a
  // step is already pending or paused, which is what lets the separate
  // "resume" effect below just call it again once unpaused without ever
  // risking two steps firing in parallel, and lets a pause hold the
  // sequence exactly where it was instead of losing or replaying time.
  useEffect(() => {
    let alive = true
    const queue: Array<[number, () => void]> = []
    let lastAt = 0
    steps.forEach(([at, mutate]) => {
      const wait = reduced ? 0 : Math.max(0, at - lastAt)
      lastAt = at
      queue.push([
        wait,
        () =>
          setState((s) => {
            const next = clone(s)
            mutate(next)
            return next
          }),
      ])
    })
    if (loop) {
      queue.push([reduced ? 6000 : Math.max(0, T.total - lastAt), replay])
    }

    const pump = () => {
      if (!alive || !queue.length || timer.current || pausedRef.current) return
      const [wait, fn] = queue.shift()!
      timer.current = setTimeout(() => {
        timer.current = null
        if (!alive) return
        fn()
        pump()
      }, wait)
    }
    pumpRef.current = pump

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset for this run, mirrors IntegrationCardStack's own timeline-effect reset
    setState(INITIAL)
    setCycle((c) => c + 1) // remounts the card so its build-in replays each loop

    pump()

    return () => {
      alive = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [runId, steps, loop, reduced, replay])

  // Resumes the queue right where it stopped once unpaused — pump() itself
  // is a no-op if a step is already scheduled, so this can't double up with
  // the timeline effect's own kickoff above.
  useEffect(() => {
    if (!paused) pumpRef.current()
  }, [paused])

  const noMotion = reduced ? { transition: 'none', animation: 'none' } : undefined

  return (
    <div className={[styles.canvas, className].filter(Boolean).join(' ')} data-roster-fill="">
      <div key={cycle} className={styles.card} data-wiped={state.wiped} style={noMotion}>
        {[0, 1, 2].map((i) => {
          const top = 156 * i
          const inView = state.chrome[i]
          const digit = state.digits[i]
          return (
            <div key={i} className={styles.row} style={{ top }}>
              <div className={styles.divider} data-in={inView} style={noMotion} />

              <div className={styles.field} data-in={inView} style={{ ...noMotion, left: 48 }}>
                0%
              </div>
              <div className={styles.field} data-in={inView} style={{ ...noMotion, left: 228 }}>
                0%
              </div>

              <div className={styles.tag} data-in={inView} style={noMotion}>
                <svg className={styles.tagIcon} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z"
                  />
                </svg>
                <span className={styles.digitBox}>
                  {digit.prev !== null ? (
                    <span key={`p${digit.k}`} className={styles.digitOut} style={noMotion}>
                      {digit.prev}
                    </span>
                  ) : null}
                  {digit.cur !== null ? (
                    <span key={`c${digit.k}`} className={styles.digitIn} style={noMotion}>
                      {digit.cur}
                    </span>
                  ) : null}
                </span>
              </div>

              {ROW_PEOPLE[i].map((who, n) => (
                <div
                  key={n}
                  className={styles.avatar}
                  data-shown={state.shown[i][n]}
                  style={{ ...noMotion, left: 684 + 78 * n, zIndex: 20 - n }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- fixed small portrait inside a self-contained animation, not a page image */}
                  <img src={images[who]} alt="" draggable={false} />
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
