import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type FeatureSplitBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
  headingLevel?: 'h2' | 'h3'
  media?: MediaField
}

export function FeatureSplitBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'left',
  headingLevel = 'h3',
  media,
}: FeatureSplitBlockProps) {
  const rowClassName = [
    'mx-auto flex w-full max-w-page flex-col gap-large px-medium-large md:items-center md:gap-2xl',
    imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
  ].join(' ')

  return (
    <section className="pb-section-gap">
      <div className={rowClassName}>
        {/* Fills remaining space (not a 50/50 split) — matches the
            agreed Figma, where the text column is a fixed 460px and
            the image takes whatever's left, verified against the
            actual Figma node rather than approximated. Media falls
            back to a grey box when no asset is set. */}
        <Media
          media={media}
          alt={heading}
          className="aspect-media w-full rounded-lg md:flex-1"
        />
        <div className="w-full md:max-w-prose-xs md:shrink-0">
          <SectionIntro
            as={headingLevel}
            eyebrow={eyebrow}
            heading={heading}
            body={body}
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="ghost">
                  {ctaLabel}
                </Button>
              )
            }
          />
        </div>
      </div>
    </section>
  )
}
