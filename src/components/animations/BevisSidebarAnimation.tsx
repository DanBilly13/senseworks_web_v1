'use client'
import { useEffect, useState, type CSSProperties } from 'react'
import s from './BevisSidebarAnimation.module.css'

/* Senseworks — Bevis sidebar animation.
   Self-contained replay of the Bevis side-panel interaction. Fixed 700x500
   canvas — every number below is a literal px in that space. Elements that
   run past the canvas edge (the panel is 520px tall, the browse popover is
   420px tall starting at y=161) are meant to be clipped by the canvas's own
   overflow: hidden — deliberate, not a bug.
   Wrapped in ScaledCanvas (see Media.tsx) to place it at any width. */

/* ─── geometry (px, 700x500 space) ──────────────────────────────────────── */

const SCROLL_Y = 308 // bevis list flicked down to the avklipp cards
const ADDED_H = 89 // one-row card (81) + its 8px stack gap

/* ─── icons: raw Ant Design outlined path data, 1024 viewBox ────────────── */

const P = {
  lineChart:
    'M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 00-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 00-11.3 0L266.3 586.7a8.03 8.03 0 000 11.3l39.5 39.7z',
  filePdf:
    'M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.6 0 30.1-12.8 33.3-20.5 5.6-13.5 2.9-30.5-6.2-39.6-13.2-13-45.3-16.4-95.3-10.2-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7 6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4-4.9-19.9-5.6-48.1-2.7-51.4.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2-21.6 4.9-41.3 13-58.9 20.2-4.2 1.7-8.3 3.4-12.3 5 13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6 40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
  search:
    'M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z',
  upload:
    'M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z',
  down: 'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z',
  export:
    'M880 912H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32h360c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H184v656h656V520c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v360c0 17.7-14.3 32-32 32zM770.87 199.13l-52.2-52.2a8.01 8.01 0 014.7-13.6l179.4-21c5.1-.6 9.5 3.7 8.9 8.9l-21 179.4c-.8 6.6-8.9 9.4-13.6 4.7l-52.4-52.4-256.2 256.2a8.03 8.03 0 01-11.3 0l-42.4-42.4a8.03 8.03 0 010-11.3l256.1-256.3z',
  eye: 'M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 8.3-17.6 8.3-38 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z',
  comment:
    'M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 634 140.3 574.1 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.5 99.6-39.5 192.9-110.1 262.7z',
}

function Glyph({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg className={s.glyph} viewBox="0 0 1024 1024" width={size} height={size} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/* ─── content ───────────────────────────────────────────────────────────── */

type Kind = 'moment' | 'analysis' | 'document'
interface RowDef {
  label: string
  kind: Kind
  chip?: boolean
}
interface CardDef {
  title: string
  kind: Kind
  chip?: boolean
  rows: RowDef[]
  comments?: number
}

const NETTO = '30. Nettoomsättning'
const KOST = '50. Övriga externa kostnader mm'
const an = (label: string): RowDef => ({ label, kind: 'analysis', chip: true })
const doc = (label: string): RowDef => ({ label, kind: 'document' })
const mo = (label: string): RowDef => ({ label, kind: 'moment' })

const MOMENT_CARDS: CardDef[] = [
  { title: '16 Övriga kortfristiga fordringar', kind: 'moment', rows: [doc('16 TRANSKAT Skattekonto 2026.pdf')] },
  { title: '19 Kassa och bank', kind: 'moment', rows: [doc('19 Engagemangsbesked 2026.pdf')] },
  { title: '24A Leverantörsskulder', kind: 'moment', rows: [an('Utbet efterföljande period')] },
  { title: '26 Momsskuld/momsfordran', kind: 'moment', rows: [doc('26 Momssammanställning 2026.pdf')] },
  { title: '30 Nettoomsättning', kind: 'moment', rows: [an('5 största intäkter'), an('Slump 3 intäkter')] },
]

const BEVIS_CARDS: CardDef[] = [
  { title: '5 största intäkter', kind: 'analysis', chip: true, rows: [mo(NETTO)] },
  { title: 'Slump 3 intäkter', kind: 'analysis', chip: true, rows: [mo(NETTO)] },
  { title: 'Debetbokning', kind: 'analysis', chip: true, rows: [mo(NETTO)], comments: 2 },
  { title: 'Kundfordringar avklipp (debet)', kind: 'analysis', chip: true, rows: [mo(NETTO)] },
  { title: 'Kreditnotor avklipp (kredit)', kind: 'analysis', chip: true, rows: [mo(NETTO)] },
  { title: 'Kreditnotor avklipp kostnader', kind: 'analysis', chip: true, rows: [mo(KOST)] },
  { title: 'Kostnader avklipp', kind: 'analysis', chip: true, rows: [mo(NETTO), mo(KOST)] },
]

const L2_CARDS: CardDef[] = [
  { title: 'Kreditnotor avklipp kostnader', kind: 'analysis', chip: true, rows: [mo(KOST)], comments: 2 },
  { title: 'Kostnader avklipp', kind: 'analysis', chip: true, rows: [mo(NETTO), mo(KOST)] },
]
const ADDED_CARD: CardDef = { title: 'Resultatanalys', kind: 'analysis', chip: true, rows: [mo(KOST)] }

interface TreeDef {
  label: string
  level: number
  group?: boolean
  kind?: Kind
  chip?: boolean
}
const TREE: TreeDef[] = [
  { label: 'Revision 2025 (Detta uppdrag)', level: 0, group: true },
  { label: 'Planering', level: 1, group: true },
  { label: 'Acceptera uppdraget', level: 2, group: true },
  { label: 'Resultatanalys', level: 3, kind: 'analysis', chip: true },
  { label: 'Oberoende & team', level: 2, group: true },
  { label: 'Oberoendeanalys_2025', level: 3, kind: 'document' },
  { label: 'Förstå verksamheten', level: 2, group: true },
  { label: 'hejdu.xlsx', level: 3, kind: 'document' },
  { label: 'Riskbedömning', level: 2, group: true },
  { label: 'ISRS4400_Arbetspapper_2025.pdf', level: 3, kind: 'document' },
  { label: 'Granskning', level: 1, group: true },
  { label: 'Intäkter', level: 2, group: true },
]
const PICK_ROW = 3

const KIND_GLYPH: Record<Kind, string | null> = { moment: null, analysis: P.lineChart, document: P.filePdf }
const KIND_ACTION: Record<Kind, string> = { moment: P.export, analysis: P.export, document: P.eye }

/* ─── reduced motion ────────────────────────────────────────────────────── */

function usePrefersReducedMotion(): boolean {
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

/* ─── state ─────────────────────────────────────────────────────────────── */

interface State {
  cycle: number
  panel: boolean // panel is on stage
  view: 'moment' | 'bevis'
  scrolled: boolean
  level: 1 | 2
  tree: boolean // browse popover open
  added: boolean
  ticked: boolean // count has gone 2 -> 3
  hot: string | null // hovered row key, "<stack>:<card>:<row>" (-1 = header)
  pop: number // hovered tree row index, -1 for none
  cursor: { x: number; y: number; on: boolean }
  press: boolean
}

const INITIAL: State = {
  cycle: 0,
  panel: false,
  view: 'moment',
  scrolled: false,
  level: 1,
  tree: false,
  added: false,
  ticked: false,
  hot: null,
  pop: -1,
  cursor: { x: 648, y: 376, on: false },
  press: false,
}

type Step = [number, Partial<State> | ((prev: State) => Partial<State>)]

// One queue, one effect. Delays are gaps between steps, in ms.
const SEQ: Step[] = [
  [0, { panel: true }],
  [1100, { cursor: { x: 424, y: 141, on: true } }],
  [340, { press: true }],
  [90, { press: false, view: 'bevis' }],
  [1420, { cursor: { x: 424, y: 152, on: true } }],
  [110, { scrolled: true }],
  [300, { cursor: { x: 352, y: 296, on: true }, hot: 'b:3:-1' }],
  [1000, { level: 2, hot: 'c:0:-1' }],
  [900, { cursor: { x: 352, y: 314, on: true }, hot: 'c:0:0' }],
  [900, { cursor: { x: 330, y: 141, on: true }, hot: null }],
  [840, { press: true }],
  [70, { press: false, tree: true }],
  [1500, { cursor: { x: 352, y: 277, on: true }, pop: PICK_ROW }],
  [1540, { press: true }],
  [60, { press: false }],
  [80, (p) => ({ press: false, tree: false, added: true, pop: -1, cursor: { ...p.cursor, on: false } })],
  [140, { ticked: true }],
  [1460, { panel: false }],
  [600, (p) => ({ ...INITIAL, cycle: p.cycle + 1 })],
]

/* ─── pieces ────────────────────────────────────────────────────────────── */

function Chip() {
  return (
    <span className={s.chip}>
      <span className={s.chipDot}>
        <Glyph d={P.lineChart} size={6} />
      </span>
      Live
    </span>
  )
}

function Row(props: { label: string; kind: Kind; chip?: boolean; bold?: boolean; hot?: boolean; indent?: number; group?: boolean }) {
  const { label, kind, chip, bold, hot, indent = 0, group } = props
  const glyph = KIND_GLYPH[kind]
  return (
    <div className={s.row} data-hot={hot || undefined}>
      {Array.from({ length: indent }, (_, i) => (
        <span key={i} className={s.slot} />
      ))}
      {group ? (
        <span className={s.slot}>
          <Glyph d={P.down} size={12} />
        </span>
      ) : null}
      {glyph ? (
        <span className={s.slot}>
          <Glyph d={glyph} size={16} />
        </span>
      ) : null}
      <span className={s.label} data-bold={bold || undefined}>
        {label}
      </span>
      {chip && !hot ? <Chip /> : null}
      {hot ? (
        <span className={s.act}>
          <Glyph d={KIND_ACTION[kind]} size={14} />
        </span>
      ) : null}
    </div>
  )
}

function Card(props: { card: CardDef; hot: number | null }) {
  const { card, hot } = props
  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <Row label={card.title} kind={card.kind} chip={card.chip} bold hot={hot === -1} />
      </div>
      <div className={s.cardBody}>
        {card.rows.map((r, i) => (
          <Row key={r.label + i} label={r.label} kind={r.kind} chip={r.chip} hot={hot === i} />
        ))}
      </div>
      {card.comments != null ? (
        <div className={s.cardFoot}>
          <Glyph d={P.comment} size={16} />
          <span className={s.footCount}>{card.comments}</span>
          <span className={s.footChevron}>
            <Glyph d={P.down} size={14} />
          </span>
        </div>
      ) : null}
    </div>
  )
}

function Stack(props: { id: string; cards: CardDef[]; hot: string | null; stagger: number; style?: CSSProperties; cycle: number }) {
  const { id, cards, hot, stagger, style, cycle } = props
  return (
    <div className={s.stack} style={style}>
      {cards.map((c, i) => {
        const key = hot && hot.startsWith(id + ':' + i + ':') ? Number(hot.split(':')[2]) : null
        return (
          <div key={id + c.title + i + '#' + cycle} className={s.cardSlot} style={{ animationDelay: `${i * stagger}ms` }}>
            <Card card={c} hot={key} />
          </div>
        )
      })}
    </div>
  )
}

/* ─── component ─────────────────────────────────────────────────────────── */

export function BevisSidebarAnimation() {
  const reduced = usePrefersReducedMotion()
  const [st, setSt] = useState<State>(INITIAL)

  useEffect(() => {
    let i = 0
    let timer = 0
    const tick = () => {
      const [delay, patch] = SEQ[i]
      timer = window.setTimeout(() => {
        setSt((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
        i = (i + 1) % SEQ.length
        tick()
      }, delay)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])

  // JS-driven transitions are gated on the hook; CSS-only ones live behind
  // @media (prefers-reduced-motion: no-preference) in the stylesheet.
  const tr = (value: string) => (reduced ? 'none' : value)

  const l2 = st.level === 2
  const addedH = st.added ? ADDED_H : 0

  return (
    <div className={s.canvas}>
      <div
        className={s.panel}
        style={{
          opacity: st.panel ? 1 : 0,
          transform: `translateX(${st.panel ? 0 : 44}px)`,
          transition: tr('transform 360ms var(--isc-snap), opacity 260ms var(--isc-snap)'),
        }}
      >
        <div className={s.head}>
          <p className={s.title}>
            Bevis{' '}
            <span className={s.countBox}>
              <span className={s.countVal} style={{ opacity: l2 ? 0 : 1, transition: tr('opacity 180ms linear') }}>
                (14)
              </span>
              <span className={s.countVal} style={{ opacity: l2 && !st.ticked ? 1 : 0, transition: tr('opacity 180ms linear') }}>
                2
              </span>
              <span className={s.countVal} style={{ opacity: st.ticked ? 1 : 0, transition: tr('opacity 180ms linear') }}>
                3
              </span>
            </span>
          </p>
          <p className={s.summary}>
            <span className={s.summaryVal} style={{ opacity: l2 ? 0 : 1, transition: tr('opacity 180ms linear') }}>
              9 analyser och 5 dokument
            </span>
            <span className={s.summaryVal} style={{ opacity: l2 && !st.ticked ? 1 : 0, transition: tr('opacity 180ms linear') }}>
              2 analyser
            </span>
            <span className={s.summaryVal} style={{ opacity: st.ticked ? 1 : 0, transition: tr('opacity 180ms linear') }}>
              3 analyser
            </span>
          </p>

          <div className={s.control}>
            <div className={s.segmented} style={{ opacity: l2 ? 0 : 1, transition: tr('opacity 180ms var(--isc-snap)') }}>
              <span
                className={s.segThumb}
                style={{
                  transform: `translateX(${st.view === 'bevis' ? 148 : 0}px)`,
                  transition: tr('transform 240ms var(--isc-pop)'),
                }}
              />
              <span className={s.segItem} data-on={st.view === 'moment' || undefined}>
                Per Moment
              </span>
              <span className={s.segItem} data-on={st.view === 'bevis' || undefined}>
                Per Bevis
              </span>
            </div>

            <div
              className={s.field}
              style={{
                opacity: l2 ? 1 : 0,
                transform: `translateY(${l2 ? 0 : 6}px)`,
                transition: tr('transform 220ms var(--isc-snap), opacity 200ms var(--isc-snap) 60ms'),
              }}
            >
              <span className={s.fieldText}>Sök eller lägg till bevis…</span>
              <Glyph d={P.search} size={16} />
            </div>
          </div>
        </div>

        <div className={s.body}>
          {/* per moment */}
          <div
            className={s.layer}
            style={{
              opacity: st.view === 'moment' ? 1 : 0,
              transform: `translateY(${st.view === 'moment' ? 0 : -14}px)`,
              transition: tr('transform 200ms var(--isc-snap), opacity 160ms linear'),
            }}
          >
            <Stack id="a" cards={MOMENT_CARDS} hot={st.hot} stagger={55} cycle={st.cycle} />
          </div>

          {/* per bevis */}
          <div
            className={s.layer}
            style={{
              opacity: st.view === 'bevis' && !l2 ? 1 : 0,
              transform: `translateY(${(st.scrolled ? -SCROLL_Y : 0) + (st.view === 'bevis' ? 0 : 16)}px)`,
              transition: tr('transform 440ms var(--isc-out), opacity 180ms linear'),
            }}
          >
            <Stack id="b" cards={BEVIS_CARDS} hot={st.hot} stagger={35} cycle={st.cycle} />
          </div>

          {/* drilled into one moment */}
          <div className={s.layer} style={{ opacity: l2 ? 1 : 0, transition: tr('opacity 200ms linear') }}>
            <div className={s.stack}>
              <div className={s.dropzone}>
                <Glyph d={P.upload} size={18} />
                <span className={s.dropText}>
                  Dra in filer för att ladda upp som bevis <span className={s.dropLink}>välj en fil</span>
                </span>
              </div>

              <div
                className={s.grow}
                style={{
                  height: addedH,
                  opacity: st.added ? 1 : 0,
                  transform: `scale(${st.added ? 1 : 0.96})`,
                  transition: tr('height 300ms var(--isc-pop), transform 300ms var(--isc-pop), opacity 160ms linear'),
                }}
              >
                <Card card={ADDED_CARD} hot={null} />
              </div>

              {L2_CARDS.map((c, i) => {
                const hot = st.hot && st.hot.startsWith('c:' + i + ':') ? Number(st.hot.split(':')[2]) : null
                return (
                  <div key={c.title} className={s.cardSlot} style={{ animationDelay: `${60 + i * 60}ms` }}>
                    <Card card={c} hot={hot} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* browse popover — sits outside the panel and runs off the canvas bottom */}
      <div
        className={s.popover}
        style={{
          opacity: st.tree ? 1 : 0,
          transform: `translateY(${st.tree ? 0 : -10}px) scaleY(${st.tree ? 1 : 0.94})`,
          visibility: st.tree ? 'visible' : 'hidden',
          transition: tr('transform 220ms var(--isc-pop), opacity 160ms linear, visibility 0s linear ' + (st.tree ? '0s' : '220ms')),
        }}
      >
        {TREE.map((r, i) => (
          <Row
            key={r.label}
            label={r.label}
            kind={r.kind || 'moment'}
            chip={r.chip}
            bold={r.group}
            group={r.group}
            indent={r.level}
            hot={st.pop === i}
          />
        ))}
      </div>

      {/* cursor */}
      <div
        className={s.cursor}
        style={{
          transform: `translate(${st.cursor.x - 3}px, ${st.cursor.y - 2}px) scale(${st.press ? 0.84 : 1})`,
          opacity: st.cursor.on ? 1 : 0,
          transition: tr('transform 320ms var(--isc-out), opacity 140ms linear'),
        }}
      >
        <svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true">
          <path
            d="M2 1.6 L2 22.4 L7.3 17.4 L10.7 25.9 L14.4 24.3 L11 16 L18.3 15.4 Z"
            fill="var(--isc-ink)"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
