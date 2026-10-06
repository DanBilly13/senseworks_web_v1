import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

// Same "full line-height" gap SectionIntro's own gapToLineHeight uses
// (this block already opts into that below), for the heading size it
// actually renders at — always h3-sized, whatever headingLevel is.
const BRANDMARK_GAP = {
  h3: 'var(--text-h3--full-line-height)',
}

type FeatureSplitBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
  headingLevel?: 'h2' | 'h3'
  media?: MediaField
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
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
  spacing = 'loose',
}: FeatureSplitBlockProps) {
  // px-large/md:px-medium-large (32/24) — this is plain, non-boxed
  // content (an image + text row, no card around either), so it gets
  // the site's default 32px-from-edge mobile rhythm — same as
  // SectionShell's own px="default", hand-rolled here since this
  // block's mirrored row can't route through SectionShell itself.
  const rowClassName = [
    'mx-auto flex w-full max-w-page flex-col gap-large px-large md:items-center md:gap-2xl md:px-medium-large',
    imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
  ].join(' ')

  return (
    <section className={SECTION_GAP_PB_CLASS[spacing]}>
      <div className={rowClassName}>
        {/* Fills remaining space (not a 50/50 split) — matches the
            agreed Figma, where the text column is a fixed 460px and
            the image takes whatever's left, verified against the
            actual Figma node rather than approximated. Media falls
            back to a grey box when no asset is set. */}
        <Media
          media={media}
          alt={heading}
          className="aspect-media w-full rounded-lg border border-border md:flex-1"
        />
        <div className="w-full md:max-w-prose-xs md:shrink-0">
          <SectionIntro
            as={headingLevel}
            // Heading level here is only about the page outline — every
            // Feature Split looks like an h3 (size, weight, body style)
            // either way. Without this, picking h2 also switched the
            // body to SectionIntro's big "subtitle" treatment.
            styleAs="h3"
            eyebrow={eyebrow}
            heading={heading}
            body={body}
            // Matches the same line-height-based eyebrow/heading/body
            // gap the rest of the site uses (Card Grid, Hero mobile) —
            // this block had been missed when that convention landed.
            gapToLineHeight
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="ghost">
                  {ctaLabel}
                </Button>
              )
            }
          />
          {/* A small brand signature closing out each block's text
              column, like a footer — gap above it matches the heading's
              own full line-height, same rhythm gapToLineHeight already
              uses between eyebrow/heading/body/cta above. */}
          <Image
            src="/senseworks-brandmark-pos.svg"
            alt=""
            aria-hidden="true"
            width={61}
            height={18}
            className="h-medium w-auto"
            style={{ marginTop: BRANDMARK_GAP.h3 }}
          />
        </div>
      </div>
    </section>
  )
}
