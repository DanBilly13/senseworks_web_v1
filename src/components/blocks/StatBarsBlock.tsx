'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps, type BandTone } from '@/components/ui/BandFill'

type StatBarsItem = { value: string; label?: string; share?: number }

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type StatBarsBlockProps = BandProps & {
  style?: 'bars' | 'dots'
  items?: StatBarsItem[]
  source?: string
}

// A stat's share (0–100) from its text when it isn't set: "4 av 5",
// "4 of 5", "4 in 5" or "4/5" → 80; "86%" or "20 %" → 86 / 20; a plain
// number up to 100 as a percentage. Anything else fills completely.
export function shareOf(item: StatBarsItem): number {
  if (typeof item.share === 'number') return Math.max(0, Math.min(100, item.share))
  const text = item.value.replace(',', '.')
  const ratio = text.match(/(\d+(?:\.\d+)?)\s*(?:av|of|in|\/)\s*(\d+(?:\.\d+)?)/i)
  if (ratio && Number(ratio[2]) > 0) return Math.min(100, (Number(ratio[1]) / Number(ratio[2])) * 100)
  const number = text.match(/(\d+(?:\.\d+)?)/)
  if (number && Number(number[1]) <= 100) return Number(number[1])
  return 100
}

// Colours per background: the track, the fill, and the text on each of
// them (the bars' text changes colour exactly where it crosses from the
// fill onto the track).
// Filled dots are the accent only on dark backgrounds — small yellow
// dots disappear on the light page.
const COLORS: Record<BandTone, { track: string; fill: string; onTrack: string; onFill: string; dot: string; muted: string }> = {
  none: { track: 'bg-foreground/5', fill: 'bg-accent', onTrack: 'text-foreground', onFill: 'text-foreground', dot: 'bg-foreground', muted: 'text-muted-foreground' },
  inverse: { track: 'bg-background/10', fill: 'bg-accent', onTrack: 'text-background', onFill: 'text-foreground', dot: 'bg-accent', muted: 'text-background/60' },
  accentDark: { track: 'bg-background/10', fill: 'bg-accent', onTrack: 'text-background', onFill: 'text-foreground', dot: 'bg-accent', muted: 'text-background/60' },
  accent: { track: 'bg-foreground/10', fill: 'bg-foreground', onTrack: 'text-foreground', onFill: 'text-background', dot: 'bg-foreground', muted: 'text-foreground/60' },
}

// Stats stacked as rows that show their size (an alternative to Stats
// Band's columns):
// - Bars: a full-width track filled to the stat's share, the big number
//   and its label on it. The text is drawn twice — once in the track's
//   text colour, and over it once in the fill's, clipped to the fill —
//   so it switches colour exactly at the fill's edge, legible however
//   short the fill is.
// - Dots: the number and label, then ten dots with the share of them
//   filled (rounded to the nearest dot).
// Bars grow and dots fill in, one row after another, when the block
// scrolls into view; with reduced motion they're simply filled.
export function StatBarsBlock({ style = 'bars', items = [], source, tone = 'none', ...band }: StatBarsBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stats = items.filter((item) => item?.value)
  // D7: a block with no content simply doesn't render.
  if (!stats.length) return null
  const c = COLORS[tone]

  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div ref={ref} data-shown={shown} data-style={style} className="stat-bars flex flex-col gap-small md:gap-x-large">
          {stats.map((item, index) => {
            const share = shareOf(item)
            const delay = { '--stat-delay': `${index * 150}ms`, '--stat-share': `${share}%` } as CSSProperties
            // Two layers in one grid cell: the text in the track's colour,
            // and over it the same text in the fill's, clipped to the fill.
            const content = (color: string, clip?: boolean) => (
              <div
                aria-hidden={clip || undefined}
                className={`stat-row relative col-start-1 row-start-1 flex flex-wrap items-center gap-x-large gap-y-xs px-medium-large py-medium ${clip ? 'stat-clip' : ''}`}
              >
                <span className={`font-heading text-h2 font-medium whitespace-nowrap tabular-nums ${color}`}>{item.value}</span>
                {item.label && <span className={`max-w-prose-xs text-body-lg ${color}`}>{item.label}</span>}
              </div>
            )
            if (style === 'dots') {
              const filled = Math.round(share / 10)
              return (
                <div
                  key={index}
                  style={delay}
                  className={`stat-row grid grid-cols-1 items-center gap-medium border-b py-medium-large ${tone === 'none' || tone === 'accent' ? 'border-foreground/15' : 'border-background/15'}`}
                >
                  <div className="flex flex-wrap items-center gap-x-large gap-y-xs md:contents">
                    <span className={`font-heading text-h2 font-medium whitespace-nowrap tabular-nums ${c.onTrack}`}>{item.value}</span>
                    {item.label && <span className={`max-w-prose-xs text-body-lg ${c.onTrack}`}>{item.label}</span>}
                  </div>
                  <div className="flex gap-small md:gap-medium" role="img" aria-label={`${filled} av 10`}>
                    {Array.from({ length: 10 }, (_, dot) => (
                      <span
                        key={dot}
                        className={`stat-dot size-medium-large rounded-full md:size-large ${dot < filled ? c.dot : c.track}`}
                        data-filled={dot < filled}
                        style={{ '--dot-delay': `${dot * 70}ms` } as CSSProperties}
                      />
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <div key={index} style={delay} className={`stat-row relative grid overflow-hidden ${c.track}`}>
                <div aria-hidden="true" className={`stat-fill absolute inset-y-0 left-0 ${c.fill}`} />
                {content(c.onTrack)}
                {content(c.onFill, true)}
              </div>
            )
          })}
          {source && <p className={`stat-source mt-small text-caption ${c.muted}`}>{source}</p>}
        </div>
      </SectionShell>
    </BandFill>
  )
}
