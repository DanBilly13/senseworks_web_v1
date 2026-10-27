import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type SectionHeadlineBlockProps = BandProps & {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  align?: 'left' | 'center'
  // Content width (the page column) or the full screen width.
  width?: 'content' | 'full'
  // How big the headline is drawn, named after the type styles. Purely
  // visual: it's always an h2 on the page, since every page starts
  // with a Hero and the Hero is the page's one h1.
  size?: 'display' | 'h1' | 'h2' | 'h3'
  // Optional id, so a "#anchor" link (e.g. the menu's Pricing link)
  // lands on this headline.
  anchor?: string
}

export function SectionHeadlineBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'center',
  width = 'content',
  size = 'h2',
  anchor,
  tone = 'none',
  ...band
}: SectionHeadlineBlockProps) {
  // On Dark, the eyebrow and button take the accent color, as on Hero Text.
  const dark = tone === 'inverse'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell maxWidth={width === 'full' ? 'full' : 'page'} {...bandShellPadding({ tone, ...band })} id={anchor}>
        <SectionIntro
          as="h2"
          // Display draws at the display size; styleAs h1 gives it the
          // h1-size body underneath (the h5 subtitle style).
          styleAs={size === 'display' ? 'h1' : size}
          display={size === 'display'}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          align={align}
          maxWidth="lg"
          // Left-aligned: on desktop the headline is 80% of the row and
          // the body 60% (as on Horizontal Scroll Stack Medium and Hero
          // Text). Centered keeps the narrower prose width.
          headingMaxWidth={align === 'left' ? 'fourFifths' : undefined}
          bodyMaxWidth={align === 'left' ? 'threeFifths' : undefined}
          tone={dark ? 'inverse' : 'default'}
          eyebrowColor={dark ? 'text-accent' : undefined}
          cta={ctaLabel && ctaHref && <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>{ctaLabel}</Button>}
        />
      </SectionShell>
    </BandFill>
  )
}
