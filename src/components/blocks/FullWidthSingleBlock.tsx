import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import type { MediaField } from '@/lib/sanity/media'

type ButtonVariant = 'filled-dark' | 'filled-accent' | 'filled-light' | 'ghost'
type FullWidthSingleBlockTone = 'default' | 'inverse' | 'accent'
type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type FullWidthSingleBlockProps = {
  eyebrow?: string
  // Highlights the eyebrow's leading word (e.g. "01") as a small
  // colored badge instead of plain text — same treatment as Card
  // Grid's numbered eyebrow.
  numberedEyebrow?: boolean
  heading?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  tone?: FullWidthSingleBlockTone
  align?: 'left' | 'center'
  // Overrides the button's color — leave unset to keep the same auto
  // behavior CTA Banner uses (filled-light on the inverse/dark tone,
  // filled-dark on every other tone, since filled-dark would be
  // invisible there).
  buttonVariant?: ButtonVariant
  media?: MediaField
  // Independent top/bottom internal padding — same four tiers/values
  // as the shared Section spacing field, just settable per edge since
  // this panel has no neighboring section to supply the other half.
  paddingTop?: SpacingValue
  paddingBottom?: SpacingValue
}

// Same three tones as CTA Banner, same reasoning.
const SECTION_BG: Record<FullWidthSingleBlockTone, string> = {
  default: 'bg-muted',
  inverse: 'bg-foreground',
  accent: 'bg-accent',
}

// Like CTA Banner, but the background is the only thing that's full
// screen width — the text AND the image both stay within the normal
// page content width, stacked (image below the text), not a 50/50
// split like Feature Split/Dark Banner.
export function FullWidthSingleBlock({
  eyebrow,
  numberedEyebrow = false,
  heading,
  body,
  ctaLabel,
  ctaHref,
  tone = 'default',
  align = 'center',
  buttonVariant,
  media,
  paddingTop = 'loose',
  paddingBottom = 'loose',
}: FullWidthSingleBlockProps) {
  const resolvedButtonVariant = buttonVariant ?? (tone === 'inverse' ? 'filled-light' : 'filled-dark')

  return (
    <div className={SECTION_BG[tone]}>
      {/* pt/pb independently, not py/pad="both" — this section has no
          neighboring section to supply the other half of a gap (its
          own tone fill IS the section, same reasoning as CTA Banner/
          Dark Banner's own pad="both"), but unlike those, each edge is
          its own editor choice here. */}
      <SectionShell pt={paddingTop} pb={paddingBottom} className="flex flex-col gap-2xl">
        <SectionIntro
          as="h2"
          eyebrow={eyebrow && renderNumberedEyebrow(eyebrow, numberedEyebrow, tone === 'inverse')}
          // Numbered eyebrows go full-strength instead of the usual
          // muted/70% — next to a bold number badge, the faded default
          // read washed out (same call Card Grid made).
          eyebrowColor={numberedEyebrow ? (tone === 'inverse' ? 'text-background' : 'text-foreground') : undefined}
          heading={heading}
          body={body}
          align={align}
          maxWidth="md"
          tone={tone === 'inverse' ? 'inverse' : 'default'}
          cta={
            ctaLabel &&
            ctaHref && (
              <Button href={ctaHref} variant={resolvedButtonVariant}>
                {ctaLabel}
              </Button>
            )
          }
        />
        <Media media={media} alt={heading ?? ''} className="aspect-media w-full rounded-lg" />
      </SectionShell>
    </div>
  )
}
