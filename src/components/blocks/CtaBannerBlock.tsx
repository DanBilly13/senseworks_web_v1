import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'

type ButtonVariant = 'filled-dark' | 'filled-accent' | 'filled-light' | 'ghost'
type CtaBannerBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  tone?: 'default' | 'inverse' | 'accent'
  // Optional — sits behind the centered text, filling the whole
  // section edge-to-edge. A transparent PNG is the intended use, so
  // the tone's own background color still shows through it.
  backgroundImage?: SanityImageSource
  // Overrides the button's color — leave unset to keep the previous
  // auto behavior (filled-light on the inverse/dark tone, filled-dark
  // on every other tone, since filled-dark would be invisible there).
  buttonVariant?: ButtonVariant
}

const SECTION_BG: Record<NonNullable<CtaBannerBlockProps['tone']>, string> = {
  default: 'bg-muted',
  inverse: 'bg-foreground',
  accent: 'bg-accent',
}

export function CtaBannerBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  tone = 'inverse',
  backgroundImage,
  buttonVariant,
}: CtaBannerBlockProps) {
  const resolvedButtonVariant = buttonVariant ?? (tone === 'inverse' ? 'filled-light' : 'filled-dark')
  const ctaButtons = (
    <div className="flex flex-wrap items-center justify-center gap-medium-large">
      <Button href={ctaHref} variant={resolvedButtonVariant} size="xl">
        {ctaLabel}
      </Button>
      {secondaryCtaLabel && secondaryCtaHref && (
        <a
          href={secondaryCtaHref}
          className={
            tone === 'inverse'
              ? 'text-body-sm font-medium text-background underline underline-offset-4'
              : 'text-body-sm font-medium text-foreground underline underline-offset-4'
          }
        >
          {secondaryCtaLabel}
        </a>
      )}
    </div>
  )

  return (
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
      className={`relative flex items-center overflow-hidden ${backgroundImage ? 'min-h-cta-banner-image' : 'min-h-cta-banner'} ${SECTION_BG[tone]}`}
    >
      {backgroundImage && (
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
        pad="both"
        py="tight"
        sectionClassName="w-full"
        className="relative z-10 flex justify-center"
      >
        {eyebrow || heading ? (
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={heading}
            body={body}
            align="center"
            maxWidth="sm"
            // Accent isn't dark enough to need inverse (light) text — the
            // regular dark text colors already read fine on it, same as
            // on the default muted background.
            tone={tone === 'inverse' ? 'inverse' : 'default'}
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
              <p className={`text-h5 font-medium ${tone === 'inverse' ? 'text-background' : 'text-foreground'}`}>
                {body}
              </p>
            )}
            {ctaButtons}
          </div>
        )}
      </SectionShell>
    </div>
  )
}
