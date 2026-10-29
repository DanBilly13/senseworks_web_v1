'use client'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
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
  // Each row's title on an accent highlight that wipes in with the
  // scroll, one row after another (see HighlightTitle).
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
  accentGradient: { label: 'text-foreground', body: 'text-foreground/70', divide: 'divide-foreground/15', highlight: 'bg-foreground text-background' },
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
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null
  const t = TONE_CLASS[tone]

  return (
    <BandFill tone={tone} width={width} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className={`flex flex-col divide-y ${t.divide}`}>
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
                  <HighlightTitle label={item.label} labelClass={t.label} highlightClass={t.highlight} />
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

// A title on a highlight that's drawn by the scroll itself: it wipes
// open left to right as the title travels from the bottom of the
// window (85% down) to just past the middle (55%), and back again on
// the way up — so the rows highlight one after another simply because
// they reach that band one after another. Two copies of the title in
// one grid cell: the plain one underneath, and over it the highlighted
// one, clipped. Both carry the same padding, pulled back by -ml-small,
// so the text still lines up with the column and the highlight reaches
// a little past it. Reduced motion: the highlight is simply there.
function HighlightTitle({ label, labelClass, highlightClass }: { label: string; labelClass: string; highlightClass: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 55%'] })
  // The clip's top and bottom reach past the box so the highlight's
  // vertical padding isn't cut off.
  const clipPath = useTransform(scrollYProgress, (p) => `inset(-0.5rem ${(1 - p) * 100}% -0.5rem 0)`)

  return (
    <h3 ref={ref} className={`-ml-small grid text-h4 text-balance font-semibold md:w-3/4 ${labelClass}`}>
      <span className="col-start-1 row-start-1">
        <span className="box-decoration-clone px-small">{label}</span>
      </span>
      <motion.span aria-hidden="true" className="col-start-1 row-start-1" style={reduced ? undefined : { clipPath }}>
        <span className={`box-decoration-clone px-small py-xs ${highlightClass}`}>{label}</span>
      </motion.span>
    </h3>
  )
}
