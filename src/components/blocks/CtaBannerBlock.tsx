import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'

type CtaBannerBlockProps = {
  eyebrow?: string
  heading: string
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
}: CtaBannerBlockProps) {
  return (
    // SectionShell has no slot for content outside its own padded
    // content div, so the tone's background color moves from its
    // sectionClassName prop onto this wrapper instead — it still ends
    // up covering the exact same box (SectionShell's <section>,
    // padding included), just from the outside — freeing up a spot for
    // the background image to sit behind it via a plain sibling.
    <div className={`relative overflow-hidden ${SECTION_BG[tone]}`}>
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
      <SectionShell pad="both" className="relative z-10 flex justify-center">
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
          cta={
            <div className="flex flex-wrap items-center justify-center gap-medium-large">
              <Button href={ctaHref} variant={tone === 'inverse' ? 'filled-light' : 'filled-dark'}>
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
          }
        />
      </SectionShell>
    </div>
  )
}
