import { HeaderBlock } from './HeaderBlock'
import { HeroBlock } from './HeroBlock'
import { HeroBackdropBlock } from './HeroBackdropBlock'
import { HeroImageOverlayCardBlock } from './HeroImageOverlayCardBlock'
import { HeroTextBlock } from './HeroTextBlock'
import { SectionHeadlineBlock } from './SectionHeadlineBlock'
import { FeatureSplitBlock } from './FeatureSplitBlock'
import { FeatureSplitDarkBlock } from './FeatureSplitDarkBlock'
import { FiftyFiftyBannerBlock } from './FiftyFiftyBannerBlock'
import { StepsBlock } from './StepsBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { FeatureListBlock } from './FeatureListBlock'
import { CardGridBlock } from './CardGridBlock'
import { LogoCloudBlock } from './LogoCloudBlock'
import { TestimonialCarouselBlock } from './TestimonialCarouselBlock'
import { TestimonialLargeBlock } from './TestimonialLargeBlock'
import { StatsBandBlock } from './StatsBandBlock'
import { PricingBlock } from './PricingBlock'
import { BentoGridBlock } from './BentoGridBlock'
import { MediaBlock } from './MediaBlock'
import { MediaCarouselBlock } from './MediaCarouselBlock'
import { ReleaseCardsBlock } from './ReleaseCardsBlock'
import { ReleaseTimelineBlock } from './ReleaseTimelineBlock'
import { BlogPostsBlock } from './BlogPostsBlock'
import { KnowledgeBankBlock } from './KnowledgeBankBlock'
import { CustomerStoriesListBlock } from './CustomerStoriesListBlock'
import { HorizontalScrollStackMediumBlock } from './HorizontalScrollStackMediumBlock'
import { FaqAccordionBlock } from './FaqAccordionBlock'
import { FooterBlock } from './FooterBlock'
import { ComparisonTableBlock } from './ComparisonTableBlock'
import { CaseStudyGridBlock } from './CaseStudyGridBlock'
import { CtaBannerBlock } from './CtaBannerBlock'
import { DarkBannerBlock } from './DarkBannerBlock'
import { FullWidthSingleBlock } from './FullWidthSingleBlock'
import { HorizontalScrollStackBlock } from './HorizontalScrollStackBlock'
import { TeamGridBlock } from './TeamGridBlock'
import { ParagraphsBlock } from './ParagraphsBlock'
import type { PageBlock } from '@/lib/sanity/getPage'

import { BAND_BLOCK_TYPES } from '@/components/ui/BandFill'
const BLOCK_COMPONENTS = {
  headerBlock: HeaderBlock,
  heroBlock: HeroBlock,
  heroBackdropBlock: HeroBackdropBlock,
  heroImageOverlayCardBlock: HeroImageOverlayCardBlock,
  heroTextBlock: HeroTextBlock,
  sectionHeadlineBlock: SectionHeadlineBlock,
  featureSplitBlock: FeatureSplitBlock,
  featureSplitDarkBlock: FeatureSplitDarkBlock,
  fiftyFiftyBannerBlock: FiftyFiftyBannerBlock,
  stepsBlock: StepsBlock,
  featureGridBlock: FeatureGridBlock,
  featureListBlock: FeatureListBlock,
  cardGridBlock: CardGridBlock,
  logoCloudBlock: LogoCloudBlock,
  testimonialCarouselBlock: TestimonialCarouselBlock,
  testimonialLargeBlock: TestimonialLargeBlock,
  statsBandBlock: StatsBandBlock,
  pricingBlock: PricingBlock,
  bentoGridBlock: BentoGridBlock,
  mediaBlock: MediaBlock,
  mediaCarouselBlock: MediaCarouselBlock,
  releaseCardsBlock: ReleaseCardsBlock,
  releaseTimelineBlock: ReleaseTimelineBlock,
  blogPostsBlock: BlogPostsBlock,
  knowledgeBankBlock: KnowledgeBankBlock,
  customerStoriesListBlock: CustomerStoriesListBlock,
  horizontalScrollStackMediumBlock: HorizontalScrollStackMediumBlock,
  faqAccordionBlock: FaqAccordionBlock,
  comparisonTableBlock: ComparisonTableBlock,
  caseStudyGridBlock: CaseStudyGridBlock,
  ctaBannerBlock: CtaBannerBlock,
  darkBannerBlock: DarkBannerBlock,
  fullWidthSingleBlock: FullWidthSingleBlock,
  horizontalScrollStackBlock: HorizontalScrollStackBlock,
  teamGridBlock: TeamGridBlock,
  paragraphsBlock: ParagraphsBlock,
  footerBlock: FooterBlock,
} as const

// A Section Headline or Bento Grid's background (ui/BandFill), when it
// has one, else null.
function bandTone(block: PageBlock | undefined): string | null {
  if (!block || !BAND_BLOCK_TYPES.has(block._type)) return null
  const tone = (block as { tone?: string }).tone
  return tone && tone !== 'none' && tone !== 'accentDark' ? tone : null
}

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  // D7: an unrecognized or incomplete block type simply doesn't render.
  // Editor-facing "Hidden" toggle (most block schemas) — lets a
  // block stay in the page's content array, fully configured,
  // while an editor iterates on something else without deleting
  // and later re-authoring it. Not on Header/Footer (D19: those
  // are structural chrome, not optional content).
  const shown = blocks.filter((block) => block._type in BLOCK_COMPONENTS && block.hidden !== true)
  return (
    <>
      {shown.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS]
        // Neighbours with the same background join into one band.
        const tone = bandTone(block)
        const join = tone ? { joinAbove: bandTone(shown[index - 1]) === tone, joinBelow: bandTone(shown[index + 1]) === tone } : {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block shape is validated by the Sanity schema, not statically knowable here
        return <Component key={block._key} {...(block as any)} {...join} />
      })}
    </>
  )
}
