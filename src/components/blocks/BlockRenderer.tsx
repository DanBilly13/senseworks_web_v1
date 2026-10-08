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
import { HorizontalScrollStackMediumBlock } from './HorizontalScrollStackMediumBlock'
import { FaqAccordionBlock } from './FaqAccordionBlock'
import { FooterBlock } from './FooterBlock'
import { ComparisonTableBlock } from './ComparisonTableBlock'
import { CaseStudyGridBlock } from './CaseStudyGridBlock'
import { CtaBannerBlock } from './CtaBannerBlock'
import { DarkBannerBlock } from './DarkBannerBlock'
import { FullWidthSingleBlock } from './FullWidthSingleBlock'
import { HorizontalScrollStackBlock } from './HorizontalScrollStackBlock'
import type { PageBlock } from '@/lib/sanity/getPage'

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
  horizontalScrollStackMediumBlock: HorizontalScrollStackMediumBlock,
  faqAccordionBlock: FaqAccordionBlock,
  comparisonTableBlock: ComparisonTableBlock,
  caseStudyGridBlock: CaseStudyGridBlock,
  ctaBannerBlock: CtaBannerBlock,
  darkBannerBlock: DarkBannerBlock,
  fullWidthSingleBlock: FullWidthSingleBlock,
  horizontalScrollStackBlock: HorizontalScrollStackBlock,
  footerBlock: FooterBlock,
} as const

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS]
        // D7: an unrecognized or incomplete block type simply doesn't render.
        if (!Component) return null
        // Editor-facing "Hidden" toggle (most block schemas) — lets a
        // block stay in the page's content array, fully configured,
        // while an editor iterates on something else without deleting
        // and later re-authoring it. Not on Header/Footer (D19: those
        // are structural chrome, not optional content).
        if (block.hidden === true) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block shape is validated by the Sanity schema, not statically knowable here
        return <Component key={block._key} {...(block as any)} />
      })}
    </>
  )
}
