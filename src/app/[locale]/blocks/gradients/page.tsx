// Dev-only lab for trying accent-gradient variants side by side —
// not real page content. See the page themes in globals.css.
const GREY: [number, number, number] = [242, 242, 243] // #f2f2f3
const PURPLE: [number, number, number] = [206, 178, 244] // #ceb2f4
const YELLOW: [number, number, number] = [251, 254, 172] // #fbfeac

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function mix(a: number[], b: number[], w: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * w))
}
const hex = (c: number[]) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')

// A gradient from `from` (held until `start`%) fading to GREY (reached at
// `end`%), with the in-between colors placed along an easing curve
// instead of one straight ramp — so there's no visible "knee" where the
// flat color starts to change (that edge is what reads as a band).
function eased(opts: {
  from: number[]
  start: number
  end: number
  steps: number
  ease: (t: number) => number
  oklab?: boolean
  angle?: number
}) {
  const { from, start, end, steps, ease, oklab = true, angle = 208 } = opts
  const stops = [`${hex(from)} ${start}%`]
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    stops.push(`${hex(mix(from, GREY, ease(t)))} ${(start + (end - start) * t).toFixed(2)}%`)
  }
  stops.push(`${hex(GREY)} ${end}%`)
  return `linear-gradient(${angle}deg${oklab ? ' in oklab' : ''}, ${stops.join(', ')})`
}

// Neutral dither: grayscale noise centered on mid-grey (0.5), layered
// over the gradient with soft-light — soft-light with 50% grey changes
// nothing, so it only nudges pixels by about a level either way (enough
// to break up 8-bit banding) without shifting the overall tone, which a
// plain black/white noise layer would.
const noise = (amp: number) => {
  const a = (amp / 3).toFixed(4)
  const b = (0.5 - 0.5 * amp).toFixed(4)
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='${a} ${a} ${a} 0 ${b} ${a} ${a} ${a} 0 ${b} ${a} ${a} ${a} 0 ${b} 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
}

const VARIANTS: { name: string; note: string; background: string; blend?: string }[] = [
  {
    name: '1 · Yellow (reference)',
    note: 'The current default — falls nicely to grey',
    background: 'linear-gradient(208deg, #fbfeac 38.9423%, #f2f2f3 62.0192%)',
  },
  {
    name: '2 · Purple, current',
    note: 'Same stops as yellow, straight sRGB ramp',
    background: 'linear-gradient(208deg, #ceb2f4 38.9423%, #f2f2f3 62.0192%)',
  },
  {
    name: '3 · Eased 15→85, OKLab',
    note: 'Smoothstep, 10 stops',
    background: eased({ from: PURPLE, start: 15, end: 85, steps: 10, ease: smoothstep }),
  },
  {
    name: '4 · Ease-out 8→85, OKLab',
    note: 'Leaves purple fast, long soft tail',
    background: eased({ from: PURPLE, start: 8, end: 85, steps: 12, ease: easeOutQuad }),
  },
  {
    name: '5 · Ease-out cubic 0→90, OKLab',
    note: 'Lightest feel — purple only in the corner',
    background: eased({ from: PURPLE, start: 0, end: 90, steps: 14, ease: easeOutCubic }),
  },
  {
    name: '6 · #3 + neutral dither (light)',
    note: 'Soft-light grey noise, amplitude 0.12',
    background: `${noise(0.12)}, ${eased({ from: PURPLE, start: 15, end: 85, steps: 10, ease: smoothstep })}`,
    blend: 'soft-light, normal',
  },
  {
    name: '7 · #3 + neutral dither (stronger)',
    note: 'Soft-light grey noise, amplitude 0.3',
    background: `${noise(0.3)}, ${eased({ from: PURPLE, start: 15, end: 85, steps: 10, ease: smoothstep })}`,
    blend: 'soft-light, normal',
  },
  {
    name: '8 · Yellow eased (for comparison)',
    note: 'Same easing as #3, on the yellow',
    background: eased({ from: YELLOW, start: 15, end: 85, steps: 10, ease: smoothstep }),
  },
]

export default function GradientLab() {
  return (
    <main className="mx-auto w-full max-w-page px-medium-large py-2xl">
      <h1 className="text-h3 font-bold text-foreground">Gradient lab</h1>
      <p className="mt-small text-body text-muted-foreground">
        Accent-gradient variants on the page grey. Dev-only.
      </p>
      <div className="mt-large grid gap-large md:grid-cols-2">
        {VARIANTS.map((v) => (
          <div key={v.name} className="flex flex-col gap-small">
            <div className="text-body-sm font-semibold text-foreground">{v.name}</div>
            <div className="text-caption text-muted-foreground">{v.note}</div>
            <div
              className="aspect-media w-full rounded-lg border border-border"
              style={{ backgroundImage: v.background, backgroundBlendMode: v.blend }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
