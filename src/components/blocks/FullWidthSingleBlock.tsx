import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type ButtonVariant = 'filled-dark' | 'filled-accent' | 'filled-light' | 'ghost'
type FullWidthSingleBlockTone = 'default' | 'inverse' | 'accent'
type FullWidthSingleBlockProps = {
  eyebrow?: string
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
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
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
  heading,
  body,
  ctaLabel,
  ctaHref,
  tone = 'default',
  align = 'center',
  buttonVariant,
  media,
  spacing = 'loose',
}: FullWidthSingleBlockProps) {
  const resolvedButtonVariant = buttonVariant ?? (tone === 'inverse' ? 'filled-light' : 'filled-dark')

  return (
    <div className={SECTION_BG[tone]}>
      {/* pad="both": this section has no neighboring section to supply
          the other half of the gap (its own tone fill IS the section),
          same reasoning as CTA Banner/Dark Banner's own pad="both". */}
      <SectionShell pad="both" py={spacing} className="flex flex-col gap-2xl">
        <SectionIntro
          as="h2"
          eyebrow={eyebrow}
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
