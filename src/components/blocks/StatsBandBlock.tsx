import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { HALF_HEADING_LINE_HEIGHT_GAP, SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type StatsBandTone = 'none' | 'muted' | 'dark' | 'accent' | 'image'
type StatItem = { value: string; label: string }
type StatsBandBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: StatItem[]
  // 'none' sits straight on the page, as it always did. The others put
  // the content in a panel: content width with rounded corners on
  // desktop, edge to edge on mobile, padded inside by paddingTop/
  // paddingBottom. 'image' fills it with backgroundImage under a dark
  // tint (same treatment as Hero — Backdrop).
  tone?: StatsBandTone
  backgroundImage?: MediaField
  paddingTop?: SpacingValue
  paddingBottom?: SpacingValue
  // Text-to-stats gap: 'standard' is the site-wide 64px intro-to-
  // content gap; the rest are the section spacing tiers.
  contentGap?: 'standard' | SpacingValue
  // Optional closing text and button, centred under the stats.
  closingText?: string
  ctaLabel?: string
  ctaHref?: string
  // The gap below the block, before the next one.
  spacing?: SpacingValue
}

const CONTENT_GAP_CLASS: Record<'standard' | SpacingValue, string> = {
  standard: 'mt-2xl',
  loose: 'mt-section-gap-loose',
  medium: 'mt-section-gap-medium',
  tight: 'mt-section-gap-tight',
  none: 'mt-none',
}

const PANEL_BG: Record<Exclude<StatsBandTone, 'none'>, string> = {
  muted: 'bg-muted',
  dark: 'bg-foreground',
  accent: 'bg-accent',
  image: 'bg-foreground',
}

// Light text on the dark and image panels, dark text everywhere else.
const isLight = (tone: StatsBandTone) => tone === 'dark' || tone === 'image'

export function StatsBandBlock({
  eyebrow,
  heading,
  body,
  items = [],
  tone = 'none',
  backgroundImage,
  paddingTop = 'medium',
  paddingBottom = 'medium',
  contentGap = 'standard',
  closingText,
  ctaLabel,
  ctaHref,
  spacing = 'loose',
}: StatsBandBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const light = isLight(tone)
  const hasIntro = Boolean(eyebrow || heading)
  const content = (
    <>
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="md"
        tone={light ? 'inverse' : 'default'}
      />
      {/* No column gap once the dividers show (lg): a divider sits on
          its column's left edge, so a gap on top made every divided
          section but the last 32px wider than its neighbour. The
          columns' own px-medium-large keeps text off the dividers. */}
      <div
        className={`grid grid-cols-2 gap-large lg:grid-cols-4 lg:gap-x-0 lg:divide-x ${hasIntro ? CONTENT_GAP_CLASS[contentGap] : ''} ${
          light ? 'lg:divide-background/20' : tone === 'accent' ? 'lg:divide-foreground/15' : 'lg:divide-border'
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-small px-medium-large text-center"
          >
            <span className={`font-heading text-h1 font-medium ${light ? 'text-background' : 'text-foreground'}`}>
              {item.value}
            </span>
            <span
              className={`text-body ${
                light ? 'text-background/70' : tone === 'accent' ? 'text-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {(closingText || (ctaLabel && ctaHref)) && (
        // Mirrors the intro above the stats: the same gap from the stats
        // as from the intro (contentGap), closing text styled like the
        // h2 intro's own body, and the same text-to-button gap
        // (half the h2's line-height).
        <div className={`flex flex-col items-center gap-medium text-center ${CONTENT_GAP_CLASS[contentGap]}`}>
          {closingText && (
            <p className={`text-h5 font-medium md:max-w-subtitle ${light ? 'text-background' : 'text-foreground'}`}>
              {closingText}
            </p>
          )}
          {ctaLabel && ctaHref && (
            // Yellow on the dark/image panels, dark everywhere else — same
            // rule as Full Width Single's button.
            <div style={closingText ? { marginTop: HALF_HEADING_LINE_HEIGHT_GAP.h2 } : undefined}>
              <Button href={ctaHref} variant={light ? 'filled-accent' : 'filled-dark'}>
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )

  if (tone === 'none') {
    return (
      <SectionShell py={spacing} className="flex flex-col">
        {content}
      </SectionShell>
    )
  }

  // px="full": no side padding on mobile, so the panel runs edge to
  // edge; the page gutter on desktop, so it lines up with the content
  // width and gets rounded corners. The inner SectionShell supplies the
  // panel's own padding — top/bottom from the section spacing tiers.
  return (
    <SectionShell px="full" py={spacing}>
      <div className={`relative overflow-hidden md:rounded-lg ${PANEL_BG[tone]}`}>
        {tone === 'image' && (
          <>
            <div className="absolute inset-0">
              <Media media={backgroundImage} alt="" className="size-full" />
            </div>
            <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
          </>
        )}
        <SectionShell
          pt={paddingTop}
          pb={paddingBottom}
          sectionClassName="relative"
          className="flex flex-col"
        >
          {content}
        </SectionShell>
      </div>
    </SectionShell>
  )
}
