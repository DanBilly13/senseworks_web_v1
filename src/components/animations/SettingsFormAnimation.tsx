'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import s from './SettingsFormAnimation.module.css'

/* Senseworks — settings form animation.
   A settings form filling itself in, on a fixed 700x500 artboard. Every
   position/size below is a literal px number in that space — no %, rem,
   breakpoints or self-scaling. Wrapped in ScaledCanvas (see Media.tsx) to
   fit a column. The root is transparent so the frame's gradient shows
   through. The card itself is 914px tall and scrolls via translateY,
   deliberately clipped by the canvas's own overflow: hidden. */

/* ── artboard geometry (literal px, card-relative unless noted) ───────── */
const CARD_X = 77
const CARD_Y = 40
const CARD_H = 914
const CANVAS_H = 500

const COL1 = 33
const COL2 = 287
const COL_W = 226
const FULL_W = 480

const Y = {
  title: 33,
  grundHead: 70,
  agareLabel: 107,
  agareField: 133,
  rowLabel: 185,
  rowField: 211,
  villkorHead: 271,
  typLabel: 314,
  typSeg: 308,
  lopLabel: 368,
  lopSeg: 362,
  forLabel: 422,
  forSeg: 416,
  jurLabel: 466,
  jurField: 491,
  inrLabel: 544,
  inrField: 570,
  regLabel: 622,
  regField: 648,
  forvLabel: 700,
  forvField: 726,
  giltigHead: 786,
  dateLabel: 823,
  dateField: 849,
} as const

const OPT_H = 28
const OPT_GAP = 2
const POP_PAD = 8
const popHeight = (n: number) => POP_PAD * 2 + n * OPT_H + (n - 1) * OPT_GAP
/** centre of option i, card-relative, for a select whose field top is fieldY */
const optCentre = (fieldY: number, i: number) => fieldY + 32 + 4 + POP_PAD + i * (OPT_H + OPT_GAP) + OPT_H / 2

/* scroll stops, chosen so each open menu clears the canvas edge */
const MAX_SCROLL = CARD_H + CARD_Y * 2 - CANVAS_H // 494
const SCROLL = { top: 0, villkor: 247, inriktning: 366, forvaltare: 422, bottom: MAX_SCROLL }

const FORMER = ['Aktiebolag', 'Bostadsrättsförening', 'Ekonomisk förening', 'Stiftelse']
const INRIKT = ['Detaljhandel', 'Bygg', 'Fastighet', 'Industri']
const REGELVERK = ['K2', 'K3', 'IFRS']
const FORV = ['Intern', 'Extern', 'Alla']

type SelectId = 'juridisk' | 'inriktning' | 'regelverk' | 'forvaltare'
type TextId = 'index' | 'namn' | 'fran' | 'till'

type Model = {
  scroll: number
  text: Record<TextId, string>
  focus: TextId | null
  seg: { typ: boolean; lopande: boolean; forsta: boolean }
  open: SelectId | null
  hover: number
  sel: Record<SelectId, string[]>
  cursor: { x: number; y: number } | null
  press: boolean
  clicks: number
}

const EMPTY: Model = {
  scroll: 0,
  text: { index: '', namn: '', fran: '', till: '' },
  focus: null,
  seg: { typ: false, lopande: false, forsta: false },
  open: null,
  hover: -1,
  sel: { juridisk: [], inriktning: [], regelverk: [], forvaltare: [] },
  cursor: null,
  press: false,
  clicks: 0,
}

/* ── reduced motion ───────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

/* ── icons (inlined Ant Design outlined paths, 1024 viewBox) ──────────── */
const Glyph = ({ d, size = 14 }: { d: string | string[]; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
    {(Array.isArray(d) ? d : [d]).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
)
const P_DOWN =
  'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'
const P_CHECK =
  'M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z'
const P_CLOSE =
  'M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z'
const P_CALENDAR =
  'M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z'
const P_INFO = [
  'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z',
  'M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z',
]

/* ── the one timeline: a queue of [delayMs, mutate] steps ─────────────── */
type Step = [number, (m: Model) => Model]

function buildTimeline(): Step[] {
  const steps: Step[] = []
  const add = (delay: number, fn: (m: Model) => Model) => steps.push([delay, fn])
  const move = (delay: number, x: number, y: number) => add(delay, (m) => ({ ...m, cursor: { x, y } }))
  const click = (delay: number, fn: (m: Model) => Model) => {
    add(delay, (m) => ({ ...m, press: true, clicks: m.clicks + 1 }))
    add(90, (m) => ({ ...fn(m), press: false }))
  }
  const type = (id: TextId, text: string, first: number, per: number) => {
    for (let i = 0; i < text.length; i++) {
      add(i === 0 ? first : per, (m) => ({ ...m, text: { ...m.text, [id]: text.slice(0, i + 1) } }))
    }
  }

  /* Grundinformation */
  move(700, CARD_X + COL1 + 60, CARD_Y + Y.rowField + 16)
  click(750, (m) => ({ ...m, focus: 'index' as TextId }))
  type('index', 'REV-2026-88', 420, 95)

  move(650, CARD_X + COL2 + 40, CARD_Y + Y.rowField + 16)
  click(120, (m) => ({ ...m, focus: 'namn' as TextId }))
  type('namn', 'Årsredovisning & Deklaration', 420, 82)

  /* scroll to the rules block */
  add(650, (m) => ({ ...m, focus: null, scroll: SCROLL.villkor }))

  /* Villkor & regelverk — segmented */
  move(500, CARD_X + COL2 + 57, CARD_Y + Y.typSeg + 17 - SCROLL.villkor)
  click(600, (m) => ({ ...m, seg: { ...m.seg, typ: true } }))
  move(500, CARD_X + COL2 + 57, CARD_Y + Y.lopSeg + 17 - SCROLL.villkor)
  click(500, (m) => ({ ...m, seg: { ...m.seg, lopande: true } }))
  move(500, CARD_X + COL2 + 167, CARD_Y + Y.forSeg + 17 - SCROLL.villkor)
  click(500, (m) => ({ ...m, seg: { ...m.seg, forsta: true } }))

  /* Juridisk form */
  move(450, CARD_X + COL1 + 240, CARD_Y + Y.jurField + 16 - SCROLL.villkor)
  click(400, (m) => ({ ...m, open: 'juridisk' as SelectId, hover: -1 }))
  move(420, CARD_X + COL1 + 60, CARD_Y + optCentre(Y.jurField, 1) - SCROLL.villkor)
  add(240, (m) => ({ ...m, hover: 1 }))
  click(120, (m) => ({ ...m, sel: { ...m.sel, juridisk: ['Bostadsrättsförening'] } }))
  add(420, (m) => ({ ...m, open: null, hover: -1 }))

  /* scroll on to the remaining rule fields */
  add(300, (m) => ({ ...m, scroll: SCROLL.inriktning }))

  /* Inriktning — two picks */
  move(500, CARD_X + COL1 + 240, CARD_Y + Y.inrField + 16 - SCROLL.inriktning)
  click(420, (m) => ({ ...m, open: 'inriktning' as SelectId, hover: -1 }))
  move(380, CARD_X + COL1 + 60, CARD_Y + optCentre(Y.inrField, 2) - SCROLL.inriktning)
  add(240, (m) => ({ ...m, hover: 2 }))
  click(120, (m) => ({ ...m, sel: { ...m.sel, inriktning: ['Fastighet'] } }))
  move(420, CARD_X + COL1 + 60, CARD_Y + optCentre(Y.inrField, 1) - SCROLL.inriktning)
  add(220, (m) => ({ ...m, hover: 1 }))
  click(120, (m) => ({ ...m, sel: { ...m.sel, inriktning: ['Fastighet', 'Bygg'] } }))
  add(460, (m) => ({ ...m, open: null, hover: -1 }))

  /* Årsredovisningsregelverk */
  move(320, CARD_X + COL1 + 240, CARD_Y + Y.regField + 16 - SCROLL.inriktning)
  click(380, (m) => ({ ...m, open: 'regelverk' as SelectId, hover: -1 }))
  move(380, CARD_X + COL1 + 60, CARD_Y + optCentre(Y.regField, 1) - SCROLL.inriktning)
  add(240, (m) => ({ ...m, hover: 1 }))
  click(120, (m) => ({ ...m, sel: { ...m.sel, regelverk: ['K3'] } }))
  add(420, (m) => ({ ...m, open: null, hover: -1 }))

  /* Förvaltare — nudge down first so its menu clears the frame */
  add(240, (m) => ({ ...m, scroll: SCROLL.forvaltare }))
  move(420, CARD_X + COL1 + 240, CARD_Y + Y.forvField + 16 - SCROLL.forvaltare)
  click(380, (m) => ({ ...m, open: 'forvaltare' as SelectId, hover: -1 }))
  move(380, CARD_X + COL1 + 60, CARD_Y + optCentre(Y.forvField, 0) - SCROLL.forvaltare)
  add(240, (m) => ({ ...m, hover: 0 }))
  click(120, (m) => ({ ...m, sel: { ...m.sel, forvaltare: ['Intern'] } }))
  add(420, (m) => ({ ...m, open: null, hover: -1 }))

  /* Giltighetstid */
  add(300, (m) => ({ ...m, scroll: SCROLL.bottom }))
  move(500, CARD_X + COL1 + 40, CARD_Y + Y.dateField + 16 - SCROLL.bottom)
  click(420, (m) => ({ ...m, focus: 'fran' as TextId }))
  type('fran', '2026-01-01', 380, 90)
  move(600, CARD_X + COL2 + 40, CARD_Y + Y.dateField + 16 - SCROLL.bottom)
  click(140, (m) => ({ ...m, focus: 'till' as TextId }))
  type('till', '2026-12-31', 380, 90)

  /* hold the finished form, then reset for the loop */
  add(900, (m) => ({ ...m, focus: null }))
  add(1400, (m) => ({ ...m, cursor: null }))
  add(500, (m) => ({ ...m, scroll: SCROLL.top }))
  add(900, () => ({ ...EMPTY }))
  add(700, (m) => m)

  return steps
}

export function SettingsFormAnimation() {
  const reduced = usePrefersReducedMotion()
  const [m, setM] = useState<Model>(EMPTY)
  const timers = useRef<number[]>([])
  const steps = useMemo(() => buildTimeline(), [])

  /* one effect owns the whole sequence */
  useEffect(() => {
    let cancelled = false
    const run = () => {
      let t = 0
      steps.forEach(([delay, fn]) => {
        t += reduced ? Math.min(delay, 60) : delay
        timers.current.push(
          window.setTimeout(() => {
            if (!cancelled) setM((prev) => fn(prev))
          }, t),
        )
      })
      timers.current.push(
        window.setTimeout(() => {
          if (cancelled) return
          setM({ ...EMPTY })
          run()
        }, t + 120),
      )
    }
    run()
    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [steps, reduced])

  const noMotion = reduced ? ({ transition: 'none' } as const) : undefined

  const select = (id: SelectId, label: string, top: number, options: string[]) => {
    const open = m.open === id
    const sel = m.sel[id]
    return (
      <>
        <div className={s.label} style={{ left: COL1, top: top - 26, width: FULL_W }}>
          {label}
        </div>
        <div className={`${s.field} ${open ? s.fieldActive : ''}`} style={{ left: COL1, top, width: FULL_W, ...noMotion }}>
          <div className={s.chips}>
            {sel.length === 0 ? <span className={`${s.value} ${s.placeholder}`}>Välj</span> : null}
            {sel.map((v) => (
              <span key={v} className={s.tag} style={noMotion}>
                {v}
                <span className={s.tagX}>
                  <Glyph d={P_CLOSE} size={9} />
                </span>
              </span>
            ))}
          </div>
          <span className={s.chevron}>
            <Glyph d={P_DOWN} size={12} />
          </span>
        </div>
        <div
          className={`${s.pop} ${open ? s.popOpen : ''}`}
          style={{ left: COL1, top: top + 36, height: popHeight(options.length), ...noMotion }}
        >
          {options.map((o, i) => {
            const on = sel.includes(o)
            return (
              <div
                key={o}
                className={`${s.option} ${open && m.hover === i ? s.optionHover : ''} ${on ? s.optionSelected : ''}`}
                style={noMotion}
              >
                <span className={`${s.checkbox} ${on ? s.checkboxOn : ''}`} style={noMotion}>
                  {on ? <Glyph d={P_CHECK} size={10} /> : null}
                </span>
                <span>{o}</span>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const segmented = (top: number, options: [string, string], on: boolean, selected: 0 | 1) => (
    <div className={s.segmented} style={{ left: COL2, top }}>
      <div className={s.segGroup}>
        <div className={`${s.segThumb} ${on ? s.segThumbOn : ''}`} style={{ transform: `translateX(${selected * 110}px)`, ...noMotion }} />
        {options.map((o, i) => (
          <span key={o} className={`${s.segItem} ${on && i === selected ? s.segItemOn : ''}`} style={noMotion}>
            {o}
          </span>
        ))}
      </div>
    </div>
  )

  const textRow = (id: TextId, label: string, left: number, top: number, width: number, placeholder?: string, calendar?: boolean) => {
    const v = m.text[id]
    const active = m.focus === id
    return (
      <>
        <div className={`${s.label} ${s.labelInk}`} style={{ left, top: top - 26, width }}>
          {label}
        </div>
        <div className={`${s.field} ${active ? s.fieldActive : ''}`} style={{ left, top, width, ...noMotion }}>
          <span className={s.value} style={{ flex: '1 1 auto', overflow: 'hidden' }}>
            {v ? v : placeholder ? <span className={s.placeholder}>{placeholder}</span> : null}
            {active && !reduced ? <span className={s.caret} /> : null}
          </span>
          {calendar ? (
            <span className={s.calendar}>
              <Glyph d={P_CALENDAR} size={14} />
            </span>
          ) : null}
        </div>
      </>
    )
  }

  return (
    <div className={s.canvas}>
      <div className={s.card} style={{ transform: `translateY(${-m.scroll}px)`, ...noMotion }}>
        <div className={s.title}>Inställningar</div>

        <div className={s.sectionHead} style={{ top: Y.grundHead }}>
          Grundinformation
        </div>
        <div className={s.label} style={{ left: COL1, top: Y.agareLabel, width: FULL_W }}>
          Ägare
        </div>
        <div className={s.field} style={{ left: COL1, top: Y.agareField, width: FULL_W }}>
          <div className={s.chips}>
            <span className={s.value}>Kickster Fastigheter AB</span>
          </div>
          <span className={s.chevron}>
            <Glyph d={P_DOWN} size={12} />
          </span>
        </div>

        {textRow('index', 'Index', COL1, Y.rowField, COL_W)}
        {textRow('namn', 'Åtgärdens namn', COL2, Y.rowField, COL_W)}

        <div className={s.sectionHead} style={{ top: Y.villkorHead }}>
          Villkor &amp; regelverk
        </div>

        <div className={s.label} style={{ left: COL1, top: Y.typLabel, width: COL_W }}>
          Typ
          <span className={s.hint}>
            <Glyph d={P_INFO} size={14} />
          </span>
        </div>
        {segmented(Y.typSeg, ['Obligatorisk', 'Frivillig'], m.seg.typ, 0)}

        <div className={s.label} style={{ left: COL1, top: Y.lopLabel, width: COL_W }}>
          Löpande
          <span className={s.hint}>
            <Glyph d={P_INFO} size={14} />
          </span>
        </div>
        {segmented(Y.lopSeg, ['Ja', 'Nej'], m.seg.lopande, 0)}

        <div className={s.label} style={{ left: COL1, top: Y.forLabel, width: COL_W }}>
          Förstagångsrevision
        </div>
        {segmented(Y.forSeg, ['Ja', 'Nej'], m.seg.forsta, 1)}

        {select('juridisk', 'Juridisk form', Y.jurField, FORMER)}
        {select('inriktning', 'Inriktning', Y.inrField, INRIKT)}
        {select('regelverk', 'Årsredovisningsregelverk', Y.regField, REGELVERK)}
        {select('forvaltare', 'Förvaltare', Y.forvField, FORV)}

        <div className={s.sectionHead} style={{ top: Y.giltigHead }}>
          Giltighetstid
        </div>
        {textRow('fran', 'Giltig från', COL1, Y.dateField, COL_W, 'ÅÅÅÅ-MM-DD (valfritt)', true)}
        {textRow('till', 'Giltig till', COL2, Y.dateField, COL_W, 'ÅÅÅÅ-MM-DD (valfritt)', true)}
      </div>

      {m.cursor ? (
        <>
          <span key={m.clicks} className={s.ripple} style={{ left: m.cursor.x, top: m.cursor.y }} />
          <svg
            className={s.cursor}
            width="22"
            height="28"
            viewBox="0 0 22 28"
            aria-hidden="true"
            style={{
              transform: `translate(${m.cursor.x}px, ${m.cursor.y}px) scale(${m.press ? 0.86 : 1})`,
              ...noMotion,
            }}
          >
            <path
              d="M2 1.6 L2 20.6 L6.9 16.2 L10 23.6 L13.3 22.1 L10.3 14.9 L17 14.6 Z"
              fill="var(--isc-ink)"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </>
      ) : null}
    </div>
  )
}
