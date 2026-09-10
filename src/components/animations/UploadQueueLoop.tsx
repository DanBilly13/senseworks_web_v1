'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './UploadQueueLoop.module.css'

/*
  UploadQueueLoop — a self-contained, looping illustration of the Senseworks
  upload queue: a file is dropped, its card slides in under the dropzone, and
  the queue uploads one file at a time. Pure React + CSS, no dependencies.

  EXPERIMENTAL (see src/app/[locale]/[...slug]/page.tsx) — ported from a
  standalone handoff (web-bits/claude animations), ratio: Aeonik-only font
  swapped for our own --font-sans (D18: Aeonik is headings-only), and most
  inlined hex colors swapped for our real design tokens in the CSS module.
  --uq-info/--uq-link/--uq-success are left as their original blue/green —
  we have no brand equivalent for a "this is in progress" info color, and
  forcing our pale accent yellow into a progress bar/link text would hurt
  legibility more than it'd gain brand consistency.

    <UploadQueueLoop />

  Notes
  - The whole loop is 19s and is a pure function of one clock, so nothing can
    drift. It only runs while scrolled into view, and freezes on the settled
    frame for users who ask for reduced motion.
  - Motion: everything enters on cubic-bezier(.16,1,.3,1) (front-loaded — near
    max speed out of the gate, braking on landing); state flips and shadows use
    cubic-bezier(.05,.7,.1,1). Progress fills close to linearly so it reads as
    a transfer rate.
*/

const ICON: Record<string, string> = {
  holder:
    'M300 276.5a56 56 0 1056-97 56 56 0 00-56 97zm0 284a56 56 0 1056-97 56 56 0 00-56 97zM640 228a56 56 0 10112 0 56 56 0 00-112 0zm0 284a56 56 0 10112 0 56 56 0 00-112 0zM300 844.5a56 56 0 1056-97 56 56 0 00-56 97zM640 796a56 56 0 10112 0 56 56 0 00-112 0z',
  file: 'M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
  'file-pdf':
    'M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.6 0 30.1-12.8 33.3-20.5 5.6-13.5 2.9-30.5-6.2-39.6-13.2-13-45.3-16.4-95.3-10.2-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7 6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4-4.9-19.9-5.6-48.1-2.7-51.4.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2-21.6 4.9-41.3 13-58.9 20.2-4.2 1.7-8.3 3.4-12.3 5 13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6 40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
  'file-word':
    'M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM528.1 472h-32.2c-5.5 0-10.3 3.7-11.6 9.1L434.6 680l-46.1-198.7c-1.3-5.4-6.1-9.3-11.7-9.3h-35.4a12.02 12.02 0 00-11.6 15.1l74.2 276c1.4 5.2 6.2 8.9 11.6 8.9h32c5.4 0 10.2-3.6 11.6-8.9l52.8-197 52.8 197c1.4 5.2 6.2 8.9 11.6 8.9h31.8c5.4 0 10.2-3.6 11.6-8.9l74.4-276a12.04 12.04 0 00-11.6-15.1H647c-5.6 0-10.4 3.9-11.7 9.3l-45.8 199.1-49.8-199.3c-1.3-5.4-6.1-9.1-11.6-9.1z',
  'file-image':
    'M553.1 509.1l-77.8 99.2-41.1-52.4a8 8 0 00-12.6 0l-99.8 127.2a7.98 7.98 0 006.3 12.9H696c6.7 0 10.4-7.7 6.3-12.9l-136.5-174a8.1 8.1 0 00-12.7 0zM360 442a40 40 0 1080 0 40 40 0 10-80 0zm494.6-153.4L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
  upload:
    'M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z',
  delete:
    'M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z',
  close:
    'M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z',
}

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={ICON[name]} />
    </svg>
  )
}

/* ---- timing ------------------------------------------------------------- */

const DURATION = 19
const SLOT = 98 // vertical pitch of one card slot
const CARD_TOP = 12
const CLEAR_AT = 17.85

const FILES = [
  { name: 'Uppdragsbrev.pdf', meta: '2026-09-04 av Alexander Ögren', icon: 'file-pdf' },
  { name: 'Uttalande.docx', meta: '2026-09-04 av Alexander Ögren', icon: 'file-word' },
  { name: 'Kontoutdrag Q2.pdf', meta: '2026-09-03 av Per Strömgren', icon: 'file-pdf' },
  { name: 'Skärmbild 2026-09-02.png', meta: '2026-09-02 av Alexander Ögren', icon: 'file-image' },
]

/* enter = the card slides in; up = [upload starts, upload ends] */
const SCHEDULE = [
  { enter: 0.9, up: [2.0, 5.7] },
  { enter: 3.35, up: [6.75, 8.85] },
  { enter: 4.15, up: [9.7, 11.7] },
  { enter: 4.95, up: [12.5, 14.5] },
]

/* ---- easing ------------------------------------------------------------- */

function bez(x1: number, y1: number, x2: number, y2: number) {
  const curve = (t: number, a: number, b: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t
  return (p: number) => {
    if (p <= 0) return 0
    if (p >= 1) return 1
    let t = p
    for (let i = 0; i < 6; i++) {
      const x = curve(t, x1, x2) - p
      const d = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2)
      if (Math.abs(d) < 1e-6) break
      t = Math.min(1, Math.max(0, t - x / d))
    }
    return curve(t, y1, y2)
  }
}

const SNAP = bez(0.16, 1, 0.3, 1) // entrances
const RUSH = bez(0.05, 0.7, 0.1, 1) // state flips
const FLOW = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2) // progress

const tween =
  (from: number, to: number, start: number, end: number, ease: (p: number) => number) =>
  (t: number) =>
    t <= start ? from : t >= end ? to : from + (to - from) * ease((t - start) / (end - start))

/* ---- one card ----------------------------------------------------------- */

function QueueCard({ i, t }: { i: number; t: number }) {
  const sc = SCHEDULE[i]
  const file = FILES[i]
  const [upStart, upEnd] = sc.up

  const slide = tween(-(SLOT + 8), 0, sc.enter, sc.enter + 0.72, SNAP)(t)
  const fade = tween(0, 1, sc.enter, sc.enter + 0.16, RUSH)(t)

  const out = CLEAR_AT + i * 0.07
  const outY = tween(0, -(SLOT + 8), out, out + 0.55, RUSH)(t)
  const outOp = tween(1, 0, out + 0.15, out + 0.5, RUSH)(t)

  /* queued cards sit back, the uploading one comes forward */
  const wake = tween(0.74, 1, upStart - 0.2, upStart + 0.3, RUSH)(t)
  const bump =
    tween(0, 1, upStart - 0.2, upStart + 0.35, RUSH)(t) - tween(0, 1, upEnd, upEnd + 0.5, RUSH)(t)

  const status = t < upStart ? 'waiting' : t < upEnd ? 'uploading' : 'done'
  const pct = tween(0, 100, upStart, upEnd - 0.45, FLOW)(t)

  /* the grip only exists once the file is stored: it wipes open and the row
     shifts right by its 16px slot + 12px gap */
  const grip = tween(0, 1, upEnd + 0.1, upEnd + 0.7, SNAP)(t)
  const settled = t > sc.enter + 0.75 && t < out

  return (
    <div
      className={styles.uqSlot}
      style={{ top: i * SLOT, height: SLOT, zIndex: FILES.length - i, overflow: settled ? 'visible' : 'hidden' }}
    >
      <div
        className={styles.uqCardwrap}
        style={{
          top: CARD_TOP,
          opacity: fade * outOp * wake,
          transform: `translateY(${slide + outY}px)`,
        }}
      >
        <div
          className={styles.uqCard}
          data-status={status}
          style={{
            boxShadow: `0 ${8 * bump}px ${22 * bump}px rgba(16,24,41,${0.12 * bump})`,
            borderColor: bump > 0.5 ? 'rgba(16,24,41,.18)' : undefined,
          }}
        >
          <div className={styles.uqRow}>
            <span
              className={styles.uqGrip}
              style={{ width: 16 * grip, marginRight: -12 * (1 - grip), opacity: grip, transform: `translateX(${-8 * (1 - grip)}px)` }}
            >
              <Icon name="holder" size={16} />
            </span>
            <span className={styles.uqIcon}>
              <Icon name={file.icon} size={22} />
            </span>
            <div className={styles.uqBody}>
              <span className={styles.uqTitle}>{file.name}</span>
              <span className={styles.uqMeta}>{file.meta}</span>
            </div>
            <span className={styles.uqAction} aria-hidden="true">
              <Icon name={status === 'done' ? 'delete' : 'close'} size={16} />
            </span>
          </div>
          <div className={styles.uqFooter} style={{ paddingLeft: 44 + 28 * grip }}>
            {status === 'uploading' ? (
              <div className={styles.uqProgress}>
                <div className={styles.uqTrack}>
                  <div className={styles.uqFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.uqPct}>{Math.round(pct)}%</span>
              </div>
            ) : status === 'waiting' ? (
              <div className={styles.uqProgress} data-waiting="true">
                <div className={styles.uqTrack} />
                <span className={styles.uqPct}>Väntar…</span>
              </div>
            ) : (
              <span className={styles.uqDone}>Klar</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- the piece ---------------------------------------------------------- */

export function UploadQueueLoop({ className = '' }: { className?: string }) {
  const [t, setT] = useState(0)
  const host = useRef<HTMLDivElement>(null)
  const seen = useRef(true)

  useEffect(() => {
    // Deliberately an effect, not lazy useState init: this renders
    // server-side (no window.matchMedia), so the initial paint must be
    // the same t=0 frame on both server and client to avoid a hydration
    // mismatch — the real reduced-motion check only runs client-side,
    // synced in right after mount.
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setT(16.5) // the settled 4/4 frame
      return
    }
    const io = new IntersectionObserver(([e]) => (seen.current = e.isIntersecting), { threshold: 0.2 })
    if (host.current) io.observe(host.current)

    let raf: number
    let last: number | null = null
    let acc = 0
    const tick = (now: number) => {
      if (last !== null && seen.current) acc = (acc + (now - last) / 1000) % DURATION
      last = now
      setT(acc)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  /* the drop lands on the dropzone first — a fill and a bolder ring */
  const hot = SCHEDULE.reduce((h, sc) => {
    const at = sc.enter - 0.42
    return Math.max(h, tween(0, 1, at, at + 0.14, RUSH)(t) - tween(0, 1, at + 0.2, at + 0.62, RUSH)(t))
  }, 0)

  /* the list grows as cards land, and collapses again for the loop */
  const grow = SCHEDULE.reduce(
    (h, sc, i) =>
      h +
      tween(0, SLOT, sc.enter, sc.enter + 0.72, SNAP)(t) *
        (1 - tween(0, 1, CLEAR_AT + i * 0.07, CLEAR_AT + i * 0.07 + 0.55, RUSH)(t)),
    0,
  )

  const entered = SCHEDULE.filter((s, i) => t >= s.enter + 0.3 && t < CLEAR_AT + i * 0.07 + 0.25).length
  const done = SCHEDULE.filter((s) => t >= s.up[1] && t < CLEAR_AT).length
  const active = SCHEDULE.findIndex((s) => t >= s.up[0] && t < s.up[1])
  const queued = Math.max(0, entered - done - (active >= 0 ? 1 : 0))
  const statusLine =
    entered === 0 || t >= CLEAR_AT
      ? 'Väntar på källor'
      : done === FILES.length
        ? '4 av 4 · klart'
        : [`${done}/4 klara`, active >= 0 ? '1 laddas upp' : null, queued > 0 ? `${queued} i kö` : null]
            .filter(Boolean)
            .join(' · ')

  return (
    <div className={`${styles.uq} ${className}`} ref={host}>
      <div className={styles.uqPanel}>
        <div className={styles.uqStatus}>{statusLine}</div>
        <div className={styles.uqDropwrap}>
          <div className={styles.uqHit} style={{ opacity: hot, boxShadow: `inset 0 0 0 ${2 * hot}px var(--uq-info)` }} />
          <div className={styles.uqDrop}>
            <Icon name="upload" size={20} />
            <span>
              Dra in filer eller <span className={styles.uqLink}>välj en fil</span>
            </span>
          </div>
        </div>
        <div className={styles.uqList} style={{ height: Math.max(0, grow) }}>
          {FILES.map((f, i) => (
            <QueueCard key={f.name} i={i} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
