import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'
import { hasImage } from '@/lib/sanity/media'

type ButtonVariant = 'filled-dark' | 'filled-accent' | 'filled-light' | 'ghost'
type Spacing = 'loose' | 'medium' | 'tight' | 'none'

type CtaBannerBlockProps = {
  eyebrow?: string
  headline?: string
  body?: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  // Small line of microcopy under the buttons.
  ctaNote?: string
  tone?: 'light' | 'dark' | 'accent'
  // 'full' (the original): the background runs edge to edge. 'content':
  // the banner sits inside the page margins (max-w-page, the boxed
  // 8px mobile edge) as a 16px-rounded panel, like a content-width Media.
  width?: 'full' | 'content'
  // The space inside the banner above and below its content, and the gap
  // after it (outside the colour) — the same fields as the other blocks.
  // Unset keeps the banner's original look: Tight inside, no gap after.
  paddingTop?: Spacing
  paddingBottom?: Spacing
  spacing?: Spacing
  // Optional — sits behind the centered text, filling the whole
  // section edge-to-edge. A transparent PNG is the intended use, so
  // the tone's own background color still shows through it.
  backgroundImage?: SanityImageSource
  // Overrides the button's color — leave unset to keep the previous
  // auto behavior (filled-accent on the inverse/dark tone, filled-dark
  // on every other tone, since filled-dark would be invisible there).
  buttonVariant?: ButtonVariant
}

const SECTION_BG: Record<NonNullable<CtaBannerBlockProps['tone']>, string> = {
  light: 'bg-muted',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

export function CtaBannerBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  ctaNote,
  tone = 'dark',
  width = 'full',
  paddingTop = 'tight',
  paddingBottom = 'tight',
  spacing = 'none',
  backgroundImage,
  buttonVariant,
}: CtaBannerBlockProps) {
  const resolvedButtonVariant = buttonVariant ?? (tone === 'dark' ? 'filled-accent' : 'filled-dark')
  const ctaButtons = (
    <div className="flex flex-col items-center gap-medium">
      {/* The secondary link sits under the button, not beside it. */}
      <div className="flex flex-col items-center gap-medium-large">
        <Button href={ctaHref} variant={resolvedButtonVariant} size="xl">
          {ctaLabel}
        </Button>
        {secondaryCtaLabel && secondaryCtaHref && (
          <a
            href={secondaryCtaHref}
            className={
              tone === 'dark'
                ? 'text-body-sm font-medium text-background underline underline-offset-4'
                : 'text-body-sm font-medium text-foreground underline underline-offset-4'
            }
          >
            {secondaryCtaLabel}
          </a>
        )}
      </div>
      {ctaNote && (
        <p
          className={`text-body-sm ${tone === 'dark' ? 'text-background/70' : 'text-muted-foreground'}`}
        >
          {ctaNote}
        </p>
      )}
    </div>
  )

  const contained = width === 'content'
  const banner = (
    // SectionShell has no slot for content outside its own padded
    // content div, so the tone's background color moves from its
    // sectionClassName prop onto this wrapper instead — it still ends
    // up covering the exact same box (SectionShell's <section>,
    // padding included), just from the outside — freeing up a spot for
    // the background image to sit behind it via a plain sibling.
    // min-h-cta-banner (50vh, or 75vh with a background image — see
    // globals.css) + flex centering makes the banner at least that
    // fraction of the viewport tall with its content vertically
    // centered — a min, not a fixed height, so longer content can
    // still grow it taller without clipping.
    <div
      className={`relative flex items-center overflow-hidden ${hasImage(backgroundImage) ? 'min-h-cta-banner-image' : 'min-h-cta-banner'} ${SECTION_BG[tone]} ${contained ? 'rounded-xl' : SECTION_GAP_MB_CLASS[spacing]}`}
    >
      {hasImage(backgroundImage) && (
        <Image
          src={urlFor(backgroundImage).url()}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* w-full: this <section> is now a flex child of the wrapper
          above (for vertical centering), and a block-level flex item
          shrink-wraps to its content width instead of filling the row
          unless told otherwise — same "flex child needs an explicit
          width" gotcha as mx-auto + max-w-* elsewhere in this repo. */}
      <SectionShell
        pt={paddingTop}
        pb={paddingBottom}
        // Content width: a boxed card's inner padding, the page margin
        // is already outside it (8 + 24 = the usual 32px on mobile).
        px={contained ? 'card' : 'default'}
        sectionClassName="w-full"
        className="relative z-10 flex justify-center"
      >
        {eyebrow || headline ? (
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={headline}
            body={body}
            align="center"
            maxWidth="sm"
            // Accent isn't dark enough to need inverse (light) text — the
            // regular dark text colors already read fine on it, same as
            // on the default muted background.
            tone={tone === 'dark' ? 'inverse' : 'default'}
            cta={ctaButtons}
          />
        ) : (
          // Both eyebrow and heading are optional now, and SectionIntro
          // itself renders nothing at all (not even body/cta) when
          // they're both absent — see its own early-return comment.
          // This branch keeps body/the button showing in that case
          // instead of the whole banner silently losing its CTA.
          <div className="flex flex-col items-center gap-medium-large text-center">
            {body && (
              <p className={`text-h5 font-medium ${tone === 'dark' ? 'text-background' : 'text-foreground'}`}>
                {body}
              </p>
            )}
            {ctaButtons}
          </div>
        )}
      </SectionShell>
    </div>
  )

  if (!contained) return banner
  // Content width: the page's own width cap and margin round the panel,
  // and the gap after it outside.
  return (
    <div className={`mx-auto w-full max-w-page px-small md:px-gutter ${SECTION_GAP_MB_CLASS[spacing]}`}>{banner}</div>
  )
}
