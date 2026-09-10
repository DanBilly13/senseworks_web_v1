import { HeaderBlock } from './HeaderBlock'
import { HeroBlock } from './HeroBlock'
import { HeroTextBlock } from './HeroTextBlock'
import { SectionHeadlineBlock } from './SectionHeadlineBlock'
import { FeatureSplitBlock } from './FeatureSplitBlock'
import { FeatureSplitDarkBlock } from './FeatureSplitDarkBlock'
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
import { FaqAccordionBlock } from './FaqAccordionBlock'
import { FooterBlock } from './FooterBlock'
import { ComparisonTableBlock } from './ComparisonTableBlock'
import { CaseStudyGridBlock } from './CaseStudyGridBlock'
import { CtaBannerBlock } from './CtaBannerBlock'
import type { PageBlock } from '@/lib/sanity/getPage'

const BLOCK_COMPONENTS = {
  headerBlock: HeaderBlock,
  heroBlock: HeroBlock,
  heroTextBlock: HeroTextBlock,
  sectionHeadlineBlock: SectionHeadlineBlock,
  featureSplitBlock: FeatureSplitBlock,
  featureSplitDarkBlock: FeatureSplitDarkBlock,
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
  faqAccordionBlock: FaqAccordionBlock,
  comparisonTableBlock: ComparisonTableBlock,
  caseStudyGridBlock: CaseStudyGridBlock,
  ctaBannerBlock: CtaBannerBlock,
  footerBlock: FooterBlock,
} as const

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS]
        // D7: an unrecognized or incomplete block type simply doesn't render.
        if (!Component) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block shape is validated by the Sanity schema, not statically knowable here
        return <Component key={block._key} {...(block as any)} />
      })}
    </>
  )
}
