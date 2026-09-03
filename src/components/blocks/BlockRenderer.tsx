import { HeaderBlock } from './HeaderBlock'
import { HeroBlock } from './HeroBlock'
import { FeatureSplitBlock } from './FeatureSplitBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { LogoCloudBlock } from './LogoCloudBlock'
import { TestimonialCarouselBlock } from './TestimonialCarouselBlock'
import { StatsBandBlock } from './StatsBandBlock'
import { PricingBlock } from './PricingBlock'
import { BentoGridBlock } from './BentoGridBlock'
import { FaqAccordionBlock } from './FaqAccordionBlock'
import { FooterBlock } from './FooterBlock'
import type { PageBlock } from '@/lib/sanity/getPage'

const BLOCK_COMPONENTS = {
  headerBlock: HeaderBlock,
  heroBlock: HeroBlock,
  featureSplitBlock: FeatureSplitBlock,
  featureGridBlock: FeatureGridBlock,
  logoCloudBlock: LogoCloudBlock,
  testimonialCarouselBlock: TestimonialCarouselBlock,
  statsBandBlock: StatsBandBlock,
  pricingBlock: PricingBlock,
  bentoGridBlock: BentoGridBlock,
  faqAccordionBlock: FaqAccordionBlock,
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
