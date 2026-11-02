import { bandGradientRuns, bandPanelJoins, type BandSpacing } from '@/components/ui/BandFill'
import { SECTION_GAP_MB_CLASS } from '@/components/ui/SectionShell'
import { HeaderBlock } from './HeaderBlock'
import { HeroBlock } from './HeroBlock'
import { HeroBackdropBlock } from './HeroBackdropBlock'
import { HeroAllyBlock } from './HeroAllyBlock'
import { HeroScrollZoomBlock } from './HeroScrollZoomBlock'
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
import { ImageGridBlock } from './ImageGridBlock'
import { StatBarsBlock } from './StatBarsBlock'
import { StackAnimationBlock } from './StackAnimationBlock'
import { StatementBlock } from './StatementBlock'
import { StatementSplitBlock } from './StatementSplitBlock'
import { BodyColumnsBlock } from './BodyColumnsBlock'
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
import { ContactRowsBlock } from './ContactRowsBlock'
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

const BLOCK_COMPONENTS = {
  headerBlock: HeaderBlock,
  heroBlock: HeroBlock,
  heroBackdropBlock: HeroBackdropBlock,
  heroAllyBlock: HeroAllyBlock,
  heroScrollZoomBlock: HeroScrollZoomBlock,
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
  imageGridBlock: ImageGridBlock,
  statBarsBlock: StatBarsBlock,
  stackAnimationBlock: StackAnimationBlock,
  statementBlock: StatementBlock,
  statementSplitBlock: StatementSplitBlock,
  bodyColumnsBlock: BodyColumnsBlock,
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
  contactRowsBlock: ContactRowsBlock,
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

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  // D7: an unrecognized or incomplete block type simply doesn't render.
  // Editor-facing "Hidden" toggle (most block schemas) — lets a
  // block stay in the page's content array, fully configured,
  // while an editor iterates on something else without deleting
  // and later re-authoring it. Not on Header/Footer (D19: those
  // are structural chrome, not optional content).
  const shown = blocks.filter((block) => block._type in BLOCK_COMPONENTS && block.hidden !== true)
  // Content width background panels that touch read as one: square
  // corners where they meet (see ui/BandFill).
  const joins = bandPanelJoins(shown as Parameters<typeof bandPanelJoins>[0])
  const render = (block: PageBlock, i: number) => {
    const Component = BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS]
    // Only passed to a block that joins, so no other block sees them.
    const joinTop = i > 0 && joins[i - 1]
    const joinProps = joinTop || joins[i] ? { joinTop, joinBottom: joins[i] } : {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block shape is validated by the Sanity schema, not statically knowable here
    return <Component key={block._key} {...(block as any)} {...joinProps} />
  }
  // Full width blocks on the same accent gradient that run on into each
  // other share one copy of it, so it doesn't restart between them.
  const runs = bandGradientRuns(shown as Parameters<typeof bandGradientRuns>[0])
  // Each rendered piece, keyed by the index of the first block in it.
  const out: { start: number; el: React.ReactNode }[] = []
  for (let i = 0; i < shown.length; i++) {
    const run = runs.find((r) => r.first === i)
    if (run) {
      // The last block's Section spacing (the gap after it) moves out to
      // here, below the shared gradient instead of inside it.
      const spacing = ((shown[run.last] as { spacing?: BandSpacing }).spacing ?? 'loose') as BandSpacing
      out.push({
        start: i,
        el: (
          <div key={`gradient-${shown[i]._key}`} className={`band-gradient-run ${run.bg} ${SECTION_GAP_MB_CLASS[spacing]}`}>
            {shown.slice(run.first, run.last + 1).map((block, k) => render(block, run.first + k))}
          </div>
        ),
      })
      i = run.last
    } else {
      out.push({ start: i, el: render(shown[i], i) })
    }
  }
  // A Full-bleed image hero set to "Content scrolls over it" stays
  // put (sticky, see HeroImageOverlay) while everything after it
  // scrolls up over it on the page's own background. Both share one
  // wrapper, so the hero lets go where the blocks end — before the
  // footer. flow-root keeps the last block's bottom margin inside the
  // panel, or it's a see-through strip at its foot.
  const pin = out.findIndex(({ start }) => {
    const b = shown[start] as { _type: string; layout?: string; pinned?: boolean }
    return b._type === 'heroBlock' && b.layout === 'imageOverlay' && b.pinned === true
  })
  if (pin === -1 || pin === out.length - 1) return <>{out.map((o) => o.el)}</>
  return (
    <>
      {out.slice(0, pin).map((o) => o.el)}
      <div className="w-full">
        {out[pin].el}
        <div className="relative z-10 flow-root w-full bg-surface pt-section-edge">{out.slice(pin + 1).map((o) => o.el)}</div>
      </div>
    </>
  )
}
