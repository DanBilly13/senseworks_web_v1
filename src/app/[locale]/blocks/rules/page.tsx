import type { CSSProperties } from 'react'

// Dev-only lab for the overlay card hero's headline rules — dotted
// variants side by side on the dark card, not real page content. A CSS
// `border-style: dotted` leaves the dot spacing to the browser, so every
// variant but the first is drawn instead: a strip the dot's height, filled
// with a repeating dot (or dash), which gives full control of size, gap
// and shape.
const ACCENT = 'var(--color-accent)'

type Variant = { name: string; note: string; rule: CSSProperties }

// A round dot of `size` px every `size + gap` px.
const round = (size: number, gap: number): CSSProperties => ({
  height: size,
  backgroundImage: `radial-gradient(circle, ${ACCENT} ${size / 2 - 0.25}px, transparent ${size / 2 + 0.25}px)`,
  backgroundSize: `${size + gap}px ${size}px`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'left center',
})

// A square dot (or a dash, when `length` is longer than `size`) every
// `length + gap` px.
const bar = (size: number, length: number, gap: number): CSSProperties => ({
  height: size,
  backgroundImage: `linear-gradient(to right, ${ACCENT} ${length}px, transparent ${length}px)`,
  backgroundSize: `${length + gap}px ${size}px`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'left center',
})

const VARIANTS: Variant[] = [
  {
    name: '1 · Today: CSS dotted, 2px',
    note: 'The browser picks the spacing (about a dot-width gap in Chrome)',
    rule: { height: 0, borderTop: `2px dotted ${ACCENT}` },
  },
  { name: '2 · Round 2px, 4px gap', note: 'A touch more open than today', rule: round(2, 4) },
  { name: '3 · Round 2px, 8px gap', note: 'Airy, reads as a row of dots', rule: round(2, 8) },
  { name: '4 · Round 2px, 12px gap', note: 'Very open, more a texture than a line', rule: round(2, 12) },
  { name: '5 · Round 3px, 6px gap', note: 'Bolder dots, same rhythm as #2', rule: round(3, 6) },
  { name: '6 · Round 4px, 8px gap', note: 'Big, chunky dots', rule: round(4, 8) },
  { name: '7 · Square 2px, 2px gap', note: 'Tight pixel dots, crisp', rule: bar(2, 2, 2) },
  { name: '8 · Square 2px, 6px gap', note: 'Open pixel dots', rule: bar(2, 2, 6) },
  { name: '9 · Dashes 6px, 4px gap', note: 'Short dashes', rule: bar(2, 6, 4) },
  { name: '10 · Dashes 12px, 6px gap', note: 'Longer dashes', rule: bar(2, 12, 6) },
]

export default function RuleLab() {
  return (
    <main className="mx-auto w-full max-w-page px-medium-large py-2xl md:px-gutter">
      <h1 className="text-h3 font-bold text-foreground">Headline rule lab</h1>
      <p className="mt-small text-body text-muted-foreground">
        Dotted variants for the overlay card hero&rsquo;s rules, on the dark card. Dev-only.
      </p>
      <div className="mt-large grid gap-large md:grid-cols-2">
        {VARIANTS.map((v) => (
          <div key={v.name} className="flex flex-col gap-small">
            <div className="text-body-sm font-semibold text-foreground">{v.name}</div>
            <div className="text-caption text-muted-foreground">{v.note}</div>
            <div className="flex flex-col gap-large rounded-lg bg-foreground p-2xl">
              <p className="text-caption font-bold tracking-wider text-accent uppercase">Power to the auditor</p>
              <div style={v.rule} />
              <h2 className="text-h2 font-bold text-background">More genius. Less grunt.</h2>
              <div style={v.rule} />
              <p className="text-body-lg text-background/80">Your entire audit and analytics workflow in one system.</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
