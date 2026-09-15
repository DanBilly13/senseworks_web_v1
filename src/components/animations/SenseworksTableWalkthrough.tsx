'use client'
import { useEffect, useRef, useState } from 'react'
import s from './SenseworksTableWalkthrough.module.css'

/* Senseworks — Företag table walkthrough animation.
   Camera + scroll choreography over the Företag ("Mina uppdrag") table.
   22s seamless loop.

   RESOLUTION MODEL — read this before changing any number
   - Authored at 2x: a literal 1400x1000 px canvas, and every geometry
     number in this file and the CSS module is a literal px in that 2x
     space (body text is 28px, hairlines are 2px, and so on).
   - It then renders itself at scale(SELF_SCALE) = 0.5, so its public
     footprint is still exactly 700x500 px — same as every other
     animation, no ScaledCanvas registry change needed.
   - Why: at 100% browser zoom the net scale is 1.0, i.e. the component
     is being MINIFIED, and minification is always sharp — the GPU has
     more source pixels than it needs. At up to 2x zoom (camera or
     ScaledCanvas's own fit-scale) you land back at 1:1 against a raster
     with 2x the detail, instead of magnifying a 1x raster. This is the
     fix for the blur that showed up at the opening close-up in the
     original 700x500-authored version.
   - To change the authored resolution, change SELF_SCALE *and* every
     literal together — they're one system.

   Other port notes
   - The table world is 2944x2200 (authored) and is deliberately much
     larger than the canvas. The canvas's overflow: hidden is the frame.
     Nothing is "fixed" to fit.
   - One timeline owner: a single effect runs one rAF clock. Everything
     else is a pure function of T (seconds). A discrete [delay, fn] step
     queue can't express the eased camera tracks, so this is the
     legitimate exception — one clock + pure tracks, no other timers.
   - Layer promotion is motion-aware: will-change: transform is applied
     only while the camera (or the scroller) is actually moving, and
     dropped on hold frames so the browser re-rasterizes text at its
     true size exactly when the viewer has stopped to read it.
   - Avatars: pass `avatars` (key -> image url) for real photos. Without
     it the row falls back to initials discs — no dependency either way. */

/* ── resolution ───────────────────────────────────────────────────────────── */
/** authored at 2x and minified to the public 700x500 box — see header */
const SELF_SCALE = 0.5

/* ── timeline ─────────────────────────────────────────────────────────────── */
/* authored scene list, in order; cue = the scene's start time.
   A scene's duration is (move time + hold time). Every MOVE below keeps its
   original duration — only the HOLDS were cut roughly in half:
     Corner      2   -> 1     opening hold before the camera launches
     PanStatus   2.4 -> 1.8   dead lead between the pan landing and beat 1
     StatusFlip  2.4 -> 1.7   dead tail after the status flip settles
     RightSide   4.4 -> 3.7   dead tail after the avatar enters
   The small sub-second holds around the zoom and the scroll are transition
   breathing room, not pauses, and were left alone. */
const SCENES: Array<[name: string, dur: number]> = [
  ['Corner', 1],
  ['Track', 3.2],
  ['Left', 0.2],
  ['ZoomOut', 1.8],
  ['ScrollDown', 3.6],
  ['PanStatus', 1.8],
  ['StatusFlip', 1.7],
  ['RightSide', 3.7],
  ['PullBack', 3.2],
  ['LoopBack', 1.8],
]
const CUE = (() => {
  const out: Record<string, number> = {}
  let acc = 0
  for (const [name, dur] of SCENES) {
    out[name] = acc
    acc += dur
  }
  out.END = acc // 22
  return out
})()
const TOTAL = CUE.END
/* the frame held when the user prefers reduced motion: whole table, all beats landed */
const POSTER_T = CUE.PullBack + 2.4

/* ── easing ───────────────────────────────────────────────────────────────── */
/* launch: front-loaded ease-out — near-max speed out of the gate, hard brake in.
   creep:  a slow, gently accelerating roll used before a launch. */
const launch = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -13.5 * u))
const creep = (u: number) => Math.pow(u, 1.5)

type Key = [t: number, v: number, ease?: (u: number) => number]
function track(T: number, keys: Key[]): number {
  if (T <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t0, v0] = keys[i - 1]
    const [t1, v1, keyEase] = keys[i]
    if (T <= t1) {
      const u = (T - t0) / Math.max(1e-6, t1 - t0)
      return v0 + (v1 - v0) * (keyEase || launch)(u)
    }
  }
  return keys[keys.length - 1][1]
}

/* ── geometry (literal px, 2x authored space) ─────────────────────────────── */
const STAGE_W = 1400
const PAGE_PAD = 80
const TABLE_W = 2784
const TABLE_RIGHT = PAGE_PAD + TABLE_W
const ROW_H = 120
const RULE = 2 // hairline width in authored 2x space (lands as 1px)
const ROW_PITCH = ROW_H + RULE // rows after the first carry a border-top
const EDGE = 80 // canvas px the table sits in from the corner
const ZOOM_A = 4 // opening close-up
const ZOOM_B = 1.25 // the working zoom, held through the pans
const ZOOM_C = 1240 / TABLE_W // closing frame: whole table 1240 authored px wide
const CORNER_B = PAGE_PAD - EDGE / ZOOM_B
const FOCUS_ROW = 8 // Granelunds Skogsförvaltning AB
const TOP_ROW = FOCUS_ROW - 1 // TechNordic sits flush under the sticky block
const BEAT_ROW = FOCUS_ROW + 2 // Brf Parkgläntan — the 90% -> 100% pair
const NOTE_ROW = 7
/* snapped so the topmost row is never clipped: its top meets the header exactly.
   + RULE because the row's own border-top must tuck UNDER the header's
   border-bottom — without it the two hairlines stack into a double line. */
const SCROLL_TO = ROW_H + (TOP_ROW - 1) * ROW_PITCH + RULE

/* ── value beats ──────────────────────────────────────────────────────────── */
const POP_DUR = 0.34
const POP_GROW = 1.5
const STAGGER = 0.25
const AT_KPI = CUE.Track + 0.68 // 57 -> 58 as the camera zips past the KPI block
const AT_P1 = CUE.StatusFlip + 0.35 // stop 1: planering 0% -> 15%, then the status chip
const AT_P2 = AT_P1 + STAGGER
const AT_STATUS = AT_P2 + STAGGER
const AT_S1 = CUE.RightSide + 1.9 // stop 2: slutsats 90% -> 100%, notis, new team-mate
const AT_S2 = AT_S1 + STAGGER
const AT_NOTE = AT_S2 + STAGGER * 1.6
const AT_AV = AT_NOTE + STAGGER * 1.4

/* ── camera (pure function of T, so we can sample the previous frame too) ─── */
function camera(T: number) {
  /* the scale changes exactly once, in ZoomOut, and never during a pan */
  const scale = track(T, [
    [0, ZOOM_A],
    [CUE.ZoomOut + 0.05, ZOOM_A],
    [CUE.ScrollDown - 0.2, ZOOM_B],
    [CUE.PullBack + 0.2, ZOOM_B],
    [CUE.PullBack + 1.3, ZOOM_C],
    [CUE.LoopBack + 0.25, ZOOM_C],
    [CUE.END, ZOOM_A],
  ])
  const camX = track(T, [
    [0, 2534],
    [CUE.Track + 0.15, 2534],
    [CUE.Track + 1.9, 1580, creep], // still crossing the KPI block
    [CUE.Left - 0.15, 60, launch], // clear of it — launch and brake
    [CUE.ZoomOut + 0.05, 60],
    [CUE.ScrollDown - 0.2, CORNER_B],
    [CUE.PanStatus + 0.15, CORNER_B],
    [CUE.PanStatus + 1.5, 926],
    [CUE.RightSide + 0.15, 926],
    [CUE.RightSide + 1.6, 1808],
    [CUE.END, 1808],
  ])
  const camY = track(T, [
    [0, 60],
    [CUE.ZoomOut + 0.05, 60],
    [CUE.ScrollDown - 0.2, CORNER_B],
    [CUE.END, CORNER_B],
  ])
  /* through the zoom, pin the table's top-left corner 80 authored px in so the
     corner does not drift while the scale changes; the closing pull-back pins
     the top-RIGHT corner the same way */
  const anchored = T >= CUE.ZoomOut && T <= CUE.ScrollDown
  const pulling = T >= CUE.PullBack
  const anchor = PAGE_PAD - EDGE / scale
  const anchorR = TABLE_RIGHT + (EDGE - STAGE_W) / scale
  return {
    scale,
    tx: -(pulling ? anchorR : anchored ? anchor : camX),
    ty: -(pulling || anchored ? anchor : camY),
  }
}

function scrollAt(T: number) {
  return track(T, [
    [0, 0],
    [CUE.ScrollDown + 0.15, 0],
    [CUE.PanStatus - 0.3, SCROLL_TO],
    [CUE.PullBack + 1.5, SCROLL_TO],
    [CUE.LoopBack - 0.2, 0],
  ])
}

/* ── data ─────────────────────────────────────────────────────────────────── */
type PersonKey = 'ML' | 'EB' | 'JH' | 'AS' | 'RW'
const PEOPLE: Record<PersonKey, string> = {
  ML: 'Mia Lind',
  EB: 'Erik Berg',
  JH: 'Jon Holm',
  AS: 'Anna Sjö',
  RW: 'Rut Wall',
}
// Stock photos for this table's own fictional team — same footing as
// PEOPLE/RAW above, baked into the file rather than passed as a prop,
// since nothing else about this demo table is Sanity-configurable either.
const DEFAULT_AVATARS: Record<PersonKey, string> = {
  ML: '/animations/foretag-table/ml.png',
  EB: '/animations/foretag-table/eb.png',
  JH: '/animations/foretag-table/jh.png',
  AS: '/animations/foretag-table/as.png',
  RW: '/animations/foretag-table/rw.png',
}
type Status = 'NotStarted' | 'Started' | 'AlmostDone' | 'Done'
const STATUS_LABEL: Record<Status, string> = {
  NotStarted: 'Ej påbörjad',
  Started: 'Påbörjad',
  AlmostDone: 'Slutfas',
  Done: 'Kvalitetssäkrad',
}

const FILTERS = ['Period', 'Juridisk form', 'Roll', 'Medarbetare', 'Grupper', 'Inriktning']
const KPIS: Array<[string, string]> = [
  ['145', 'Uppdrag'],
  ['23', 'Ej påbörjade'],
  ['57', 'Påbörjade'],
  ['20', 'Slutfas'],
  ['45', 'Klara'],
]

type Raw = [
  title: string,
  type: string,
  date: string,
  status: Status,
  planering: [number, number],
  granskning: [number, number],
  slutsats: [number, number],
  notes: number,
  team: PersonKey[],
]
const RAW: Raw[] = [
  ['Nordic Logistics AB', 'Lagstadgad revision', '2026-09-12', 'Started', [100, 100], [65, 50], [0, 0], 3, ['ML', 'EB', 'JH']],
  ['Brf Stjärnhuset 1', 'Lagstadgad revision', '2026-09-10', 'AlmostDone', [100, 100], [100, 100], [80, 75], 1, ['AS', 'RW']],
  ['Svenska Byggkoncept AB', 'Årsbokslut 2025', '2026-09-08', 'Done', [100, 100], [100, 100], [100, 100], 0, ['ML', 'JH']],
  ['Kyl & Värmeteknik i Väst AB', 'Inkomstdeklaration', '2026-09-05', 'NotStarted', [0, 0], [0, 0], [0, 0], 5, ['EB']],
  ['Bageri Surdegen HB', 'ISRS 4400', '2026-09-03', 'Started', [100, 80], [20, 0], [0, 0], 2, ['AS', 'ML', 'JH']],
  ['Mälardalens Fastighets AB', 'Lagstadgad revision', '2026-08-30', 'AlmostDone', [100, 100], [100, 90], [50, 40], 8, ['RW', 'EB']],
  ['Brf Solhöjden', 'Årsredovisning', '2026-08-28', 'Started', [100, 100], [40, 30], [0, 0], 0, ['JH', 'AS']],
  ['TechNordic Solutions AB', 'Delårsrapport', '2026-08-25', 'Done', [100, 100], [100, 100], [100, 100], 0, ['ML', 'EB', 'RW']],
  ['Granelunds Skogsförvaltning AB', 'Lagstadgad revision', '2026-08-22', 'NotStarted', [0, 0], [0, 0], [0, 0], 4, ['ML']],
  ['Västkustens Fiskeri & Rökeri AB', 'Inkomstdeklaration', '2026-08-20', 'Started', [100, 50], [10, 0], [0, 0], 1, ['AS', 'JH']],
  ['Brf Parkgläntan 4', 'Lagstadgad revision', '2026-08-18', 'Started', [100, 100], [75, 70], [10, 0], 2, ['RW', 'ML']],
  ['Kafferostrarna i Skåne AB', 'ISRS 4400', '2026-08-15', 'AlmostDone', [100, 100], [100, 100], [90, 90], 6, ['EB', 'AS', 'JH']],
  ['Elektro-Montage i Örebro AB', 'Årsbokslut 2025', '2026-08-12', 'NotStarted', [0, 0], [0, 0], [0, 0], 0, ['JH']],
  ['Bergström & Partners Advokatbyrå', 'Analys', '2026-08-10', 'Started', [80, 60], [0, 0], [0, 0], 3, ['ML', 'RW']],
  ['Brf Björken 12', 'Lagstadgad revision', '2026-08-08', 'Done', [100, 100], [100, 100], [100, 100], 0, ['AS']],
  ['Svensk Fastighetsutveckling AB', 'Lagstadgad revision', '2026-08-05', 'Started', [100, 100], [30, 25], [0, 0], 12, ['ML', 'EB', 'JH']],
  ['Möbeldesign i Småland AB', 'Inkomstdeklaration', '2026-08-02', 'NotStarted', [0, 0], [0, 0], [0, 0], 1, ['EB']],
  ['Brf Sjöutsikten Vaxholm', 'Årsredovisning', '2026-07-30', 'Started', [100, 90], [15, 0], [0, 0], 2, ['JH', 'RW']],
  ['AeroParts Nordic AB', 'ISRS 4400', '2026-07-27', 'AlmostDone', [100, 100], [100, 85], [60, 50], 4, ['ML', 'AS']],
  ['Friskvårdscenter i Malmö AB', 'Årsbokslut 2025', '2026-07-25', 'Started', [100, 100], [50, 40], [0, 0], 0, ['EB', 'JH']],
  ['Brf Kvarnen i Uppsala', 'Lagstadgad revision', '2026-07-21', 'Done', [100, 100], [100, 100], [100, 100], 1, ['RW', 'AS']],
  ['Tryckeri Profiltryck AB', 'Delårsrapport', '2026-07-18', 'NotStarted', [0, 0], [0, 0], [0, 0], 0, ['ML']],
  ['Österlen Charkuteri AB', 'Inkomstdeklaration', '2026-07-15', 'Started', [100, 100], [85, 80], [20, 0], 5, ['EB', 'JH', 'RW']],
  ['Brf Lindallen 8', 'Lagstadgad revision', '2026-07-11', 'AlmostDone', [100, 100], [100, 100], [95, 90], 3, ['AS']],
  ['IT-Konsulterna i Bergslagen AB', 'Analys', '2026-07-08', 'Started', [100, 40], [0, 0], [0, 0], 1, ['ML', 'EB']],
]

const COLUMNS = ['', 'Företag', 'Status', 'Planering', 'Granskning', 'Slutsats', 'Notiser', 'Team']

/* ── icons (inline paths, 24px grid — viewBox scales, so no 2x edit needed) ── */
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M9 3h6l-1 5 3 3v2H7v-2l3-3-1-5Z" strokeLinejoin="round" />
    <path d="M12 13v8" strokeLinecap="round" />
  </svg>
)
const FlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 3h1.6v18H6V3Zm2.8 1.2h9.6l-1.9 3.9 1.9 3.9H8.8V4.2Z" />
  </svg>
)
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 9.5 12 15l6-5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── reduced motion ──────────────────────────────────────────────────────── */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

/* ── leaf pieces ─────────────────────────────────────────────────────────── */
type PhaseState = 'na' | 'not-started' | 'in-progress' | 'done' | 'overdue'
function phaseState(x: number, n: number): PhaseState {
  if (!n) return 'na'
  if (x > n) return 'overdue'
  if (x === n) return 'done'
  if (x === 0) return 'not-started'
  return 'in-progress'
}

function ProgressTag({ x, pop = 1, pinned = false }: { x: number; pop?: number; pinned?: boolean }) {
  return (
    <span className={`${s.ptag} ${pinned ? s.ptagPinned : ''}`} data-state={phaseState(x, 100)}>
      <span className={s.glyph} style={{ transform: `scale(${pop})` }}>
        {Math.round(x)}%
      </span>
    </span>
  )
}

function StatusChip({ status }: { status: Status }) {
  return (
    <span className={s.chip} data-status={status}>
      <span className={s.chipDot} />
      {STATUS_LABEL[status]}
    </span>
  )
}

function NotesTag({ notes, pop = 1 }: { notes: number; pop?: number }) {
  return (
    <span className={s.tag}>
      <span className={s.tagIco}>
        <FlagIcon />
      </span>
      <span className={s.glyph} style={{ transform: `scale(${pop})` }}>
        {notes}
      </span>
    </span>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
}

function Team({
  team,
  avatars,
  entering,
}: {
  team: PersonKey[]
  avatars?: Partial<Record<PersonKey, string>>
  entering?: number // scale for the last member (the one that animates in)
}) {
  return (
    <span className={s.avatars}>
      {team.map((k, i) => {
        const src = avatars?.[k]
        const last = i === team.length - 1
        return (
          <span key={k} className={s.avatar} style={entering != null && last ? { transform: `scale(${entering})` } : undefined}>
            <span className={s.avatarInner} data-tint={i % 4}>
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed small avatar mark inside a self-contained animation, not a page image */}
              {src ? <img src={src} alt={PEOPLE[k]} /> : initials(PEOPLE[k])}
            </span>
          </span>
        )
      })}
    </span>
  )
}

type RowPops = {
  planering?: [number, number]
  slutsats?: [number, number]
  slutsatsPinned?: boolean
  notes?: number
  avatar?: number
}

function Row({
  raw,
  status,
  planering,
  slutsats,
  notes,
  team,
  pops,
  avatars,
}: {
  raw: Raw
  status: Status
  planering: [number, number]
  slutsats: [number, number]
  notes: number
  team: PersonKey[]
  pops?: RowPops
  avatars?: Partial<Record<PersonKey, string>>
}) {
  const [title, type, date, , , granskning] = raw
  return (
    <div className={s.row}>
      <span className={s.pin}>
        <PinIcon />
      </span>
      <div className={s.cell}>
        <div className={s.title}>
          <span className={s.titleMain}>{title}</span>
          <span className={s.titleSub}>
            {type}
            <span className={s.titleDot} />
            {date}
          </span>
        </div>
      </div>
      <div className={s.cell}>
        <StatusChip status={status} />
      </div>
      <div className={`${s.cell} ${s.phase}`}>
        {planering.map((x, i) => (
          <ProgressTag key={i} x={x} pop={pops?.planering?.[i]} />
        ))}
      </div>
      <div className={`${s.cell} ${s.phase}`}>
        {granskning.map((x, i) => (
          <ProgressTag key={i} x={x} />
        ))}
      </div>
      <div className={`${s.cell} ${s.phase}`}>
        {slutsats.map((x, i) => (
          <ProgressTag key={i} x={x} pop={pops?.slutsats?.[i]} pinned={pops?.slutsatsPinned} />
        ))}
      </div>
      <div className={s.cell}>
        <NotesTag notes={notes} pop={pops?.notes} />
      </div>
      <div className={s.cell}>
        <Team team={team} avatars={avatars} entering={pops?.avatar} />
      </div>
    </div>
  )
}

/* ── component ───────────────────────────────────────────────────────────── */
type SenseworksTableWalkthroughProps = {
  /** overrides the built-in stock photos, keyed by person: { ML: '/img/mia.jpg', … } */
  avatars?: Partial<Record<PersonKey, string>>
  className?: string
}

export function SenseworksTableWalkthrough({ avatars = DEFAULT_AVATARS, className }: SenseworksTableWalkthroughProps) {
  const reduced = usePrefersReducedMotion()
  const [T, setT] = useState(0)
  const rafRef = useRef(0)

  /* one timeline owner: a single rAF clock; every value below derives from T */
  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setT(POSTER_T)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      setT(((now - start) / 1000) % TOTAL)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduced])

  const { scale, tx, ty } = camera(T)
  const scrollY = scrollAt(T)

  /* motion-aware layer promotion: sample the camera one frame back and promote
     only while something is actually moving. On hold frames the layer is
     demoted, which makes the browser re-rasterize text at its true size —
     exactly the frames where the viewer has stopped to read it. */
  const back = Math.max(0, T - 1 / 30)
  const prev = camera(back)
  const camMoving = Math.abs(scale - prev.scale) > 1e-4 || Math.abs(tx - prev.tx) > 0.01 || Math.abs(ty - prev.ty) > 0.01
  const scrollMoving = Math.abs(scrollY - scrollAt(back)) > 0.01

  /* value beats — pop() is the shared curve: the glyph grows to POP_GROW, its
     value swaps at the peak, and it settles back */
  const pop = (at: number) => {
    const u = (T - at) / POP_DUR
    return u < 0 || u > 1 ? 1 : 1 + (POP_GROW - 1) * Math.sin(Math.PI * u)
  }
  /* the loop-back zoom resets every value so the last frame matches the first */
  const reset = T >= CUE.LoopBack && scale >= 3.5
  const landed = (at: number) => !reset && T >= at + POP_DUR / 2
  /* entrance variant: absent -> overshoot -> rest */
  const enter = (at: number) => {
    if (reset) return 0
    const u = (T - at) / POP_DUR
    if (u <= 0) return 0
    if (u >= 1) return 1
    if (u < 0.5) return POP_GROW * Math.sin((Math.PI / 2) * (u / 0.5))
    return POP_GROW - (POP_GROW - 1) * ((u - 0.5) * 2)
  }

  /* each slutsats chip turns green only once its own number is back to true size */
  const slutVal = (at: number) => (landed(at + POP_DUR) ? 100 : landed(at) ? 99.6 : 90)
  const plan: [number, number] = [landed(AT_P1) ? 15 : 0, landed(AT_P2) ? 15 : 0]
  const slut: [number, number] = [slutVal(AT_S1), slutVal(AT_S2)]
  const kpis = KPIS.map(([v, l], i): [string, string] => [i === 2 && landed(AT_KPI) ? '58' : v, l])

  return (
    /* .frame is the public 700x500 box; .canvas is the 2x authored surface */
    <div className={`${s.frame} ${className ?? ''}`}>
      {/* .canvasScale carries only the static minify transform; .canvas only
          clips (overflow: hidden) — kept on separate elements because Safari
          has a history of bugs when the same element both transforms itself
          and is the overflow-clip boundary for its children. */}
      <div className={s.canvasScale} style={{ transform: `scale(${SELF_SCALE})` }}>
        <div className={s.canvas}>
        <div
          className={s.world}
          style={{
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
            willChange: camMoving ? 'transform' : 'auto',
            transition: reduced ? 'none' : undefined,
          }}
        >
          <div className={s.card}>
            <div className={s.clip}>
              {/* rows pass under the sticky block */}
              <div
                className={s.scroller}
                style={{
                  transform: `translateY(${-scrollY}px)`,
                  willChange: scrollMoving ? 'transform' : 'auto',
                  transition: reduced ? 'none' : undefined,
                }}
              >
                <div className={s.table}>
                  <div className={s.head}>
                    {COLUMNS.map((c, i) => (
                      <div key={i} className={s.h}>
                        {c}
                      </div>
                    ))}
                  </div>
                  {RAW.map((raw, i) => {
                    const focus = i === FOCUS_ROW
                    const beat = i === BEAT_ROW
                    const note = i === NOTE_ROW
                    return (
                      <Row
                        key={raw[0]}
                        raw={raw}
                        status={focus && landed(AT_STATUS) ? 'Started' : raw[3]}
                        planering={focus ? plan : raw[4]}
                        slutsats={beat ? slut : raw[6]}
                        notes={note ? (landed(AT_NOTE) ? 1 : 0) : raw[7]}
                        team={focus ? ['ML', 'EB'] : raw[8]}
                        avatars={avatars}
                        pops={
                          focus
                            ? { planering: [pop(AT_P1), pop(AT_P2)], avatar: enter(AT_AV) }
                            : beat
                              ? { slutsats: [pop(AT_S1), pop(AT_S2)], slutsatsPinned: true }
                              : note
                                ? { notes: pop(AT_NOTE) }
                                : undefined
                        }
                      />
                    )
                  })}
                </div>
              </div>

              {/* filter bar + column header are one sticky block */}
              <div className={s.sticky}>
                <div className={s.bar}>
                  <div className={s.filters}>
                    {FILTERS.map((label) => (
                      <span key={label} className={s.fsel}>
                        {label}
                        <span className={s.fselChev}>
                          <ChevronIcon />
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className={s.kpis}>
                    {kpis.map(([value, label], i) => (
                      <div key={label} className={s.kpi}>
                        <span className={s.kpiNum} style={i === 2 ? { transform: `scale(${pop(AT_KPI)})` } : undefined}>
                          {value}
                        </span>
                        <span className={s.kpiLabel}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={s.table}>
                  <div className={s.head}>
                    {COLUMNS.map((c, i) => (
                      <div key={i} className={s.h}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
