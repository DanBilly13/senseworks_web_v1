import { HeaderBlock } from './HeaderBlock'
import { HeroBlock } from './HeroBlock'
import { FeatureSplitBlock } from './FeatureSplitBlock'
import { FaqAccordionBlock } from './FaqAccordionBlock'
import type { PageBlock } from '@/lib/sanity/getPage'

const BLOCK_COMPONENTS = {
  headerBlock: HeaderBlock,
  heroBlock: HeroBlock,
  featureSplitBlock: FeatureSplitBlock,
  faqAccordionBlock: FaqAccordionBlock,
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
