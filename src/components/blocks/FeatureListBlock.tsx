'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps, type BandTone } from '@/components/ui/BandFill'

type FeatureListItem = {
  label: string
  body: string
}
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type BodySize = 'body' | 'h5' | 'h4'
// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type FeatureListBlockProps = BandProps & {
  // The background's shape: a page-column panel, or the full screen
  // width (see BandFill). The content always sits in the page column.
  // Unset (blocks from before the option): full screen width, as they were.
  width?: 'content' | 'full'
  // The right-hand text's size: body copy, or the h5/h4 type size (same
  // weight and grey, just bigger).
  bodySize?: BodySize
  // Each row's title on an accent highlight that wipes in, one row
  // after another, when the list scrolls into view.
  highlightLabels?: boolean
  items?: FeatureListItem[]
}

// Label, body text and divider colours per background: white text on
// Dark and the dark gradient, the usual dark text on the page and Accent.
// The highlight is the accent with dark text, except on Accent itself,
// where it's dark with light text.
const TONE_CLASS: Record<BandTone, { label: string; body: string; divide: string; highlight: string }> = {
  none: { label: 'text-foreground', body: 'text-muted-foreground', divide: 'divide-border', highlight: 'bg-accent text-foreground' },
  accent: { label: 'text-foreground', body: 'text-foreground/70', divide: 'divide-foreground/15', highlight: 'bg-foreground text-background' },
  inverse: { label: 'text-background', body: 'text-background/70', divide: 'divide-background/20', highlight: 'bg-accent text-foreground' },
  accentDark: { label: 'text-background', body: 'text-background/70', divide: 'divide-background/20', highlight: 'bg-accent text-foreground' },
}

const BODY_SIZE_CLASS: Record<BodySize, string> = {
  body: 'text-body',
  h5: 'text-h5',
  h4: 'text-h4',
}

export function FeatureListBlock({
  bodySize = 'body',
  highlightLabels = false,
  items = [],
  width,
  tone = 'none',
  ...band
}: FeatureListBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !highlightLabels || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [highlightLabels])

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null
  const t = TONE_CLASS[tone]

  return (
    <BandFill tone={tone} width={width} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div ref={ref} data-shown={shown} className={`feature-list flex flex-col divide-y ${t.divide}`}>
          {items.map((item, index) => {
            // Plain-text field, so paragraph breaks only survive as literal
            // "\n"s in the source — HTML collapses those by default, which
            // read as one run-on paragraph even when the copy has several.
            const paragraphs = item.body.split('\n').filter(Boolean)
            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-small-medium py-large first:pt-0 last:pb-0 md:grid-cols-2 md:gap-2xl"
              >
                {highlightLabels ? (
                  // Two copies of the title in one grid cell: the plain one
                  // underneath, and over it the highlighted one, clipped
                  // and wiped open left to right (see .feature-highlight in
                  // globals.css). Both carry the same padding, pulled back
                  // by -ml-small, so the text still lines up with the
                  // column and the highlight reaches a little past it.
                  <h3
                    className={`-ml-small grid text-h4 text-balance font-semibold md:w-3/4 ${t.label}`}
                    style={{ '--highlight-delay': `${index * 200}ms` } as CSSProperties}
                  >
                    <span className="col-start-1 row-start-1">
                      <span className="box-decoration-clone px-small">{item.label}</span>
                    </span>
                    <span aria-hidden="true" className="feature-highlight col-start-1 row-start-1">
                      <span className={`rounded-sm box-decoration-clone px-small py-xs ${t.highlight}`}>{item.label}</span>
                    </span>
                  </h3>
                ) : (
                  <h3 className={`text-h4 text-balance font-semibold md:w-3/4 ${t.label}`}>
                    {item.label}
                  </h3>
                )}
                <div className="flex flex-col gap-medium md:max-w-body">
                  {paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className={`${BODY_SIZE_CLASS[bodySize] ?? BODY_SIZE_CLASS.body} ${t.body}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </SectionShell>
    </BandFill>
  )
}
