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
import { StickySplitBlock } from './StickySplitBlock'
import { FactsTableBlock } from './FactsTableBlock'
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
import { RichTextBlock } from './RichTextBlock'
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
  stickySplitBlock: StickySplitBlock,
  factsTableBlock: FactsTableBlock,
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
  richTextBlock: RichTextBlock,
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

// The blocks whose Section spacing becomes the space at the top of the
// panel that scrolls over them when pinned, with their default spacing.
const PANEL_TOP_FROM_SPACING = new Map<string, BandSpacing>([
  ['heroAllyBlock', 'medium'],
  ['mediaBlock', 'loose'],
])
// That space.
const PANEL_TOP: Record<BandSpacing, string> = {
  loose: 'pt-section-gap-loose',
  medium: 'pt-section-gap-medium',
  tight: 'pt-section-gap-tight',
  none: 'pt-none',
}

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
  // Media's Width is the media's own; its background always runs the
  // full screen width, so that's how these read it.
  const bands = shown.map((b) => (b._type === 'mediaBlock' ? { ...b, width: 'full' } : b))
  const joins = bandPanelJoins(bands as Parameters<typeof bandPanelJoins>[0])
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
  const runs = bandGradientRuns(bands as Parameters<typeof bandGradientRuns>[0])
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
  // Hero — Ally 3D and Media do the same; their Section spacing becomes
  // the space at the top of the panel.
  // Every pinned block gets its own panel, nested inside the one before
  // it: a pinned Media further down would otherwise sit inside the
  // hero's panel with nothing opaque to cover it, and show through
  // every block after it that has no background of its own.
  const isPinned = ({ start }: { start: number }) => {
    const b = shown[start] as { _type: string; layout?: string; pinned?: boolean }
    return b.pinned === true && ((b._type === 'heroBlock' && b.layout === 'imageOverlay') || PANEL_TOP_FROM_SPACING.has(b._type))
  }
  const curtain = (pieces: typeof out): React.ReactNode => {
    const pin = pieces.findIndex(isPinned)
    if (pin === -1 || pin === pieces.length - 1) return pieces.map((o) => o.el)
    const pinned = shown[pieces[pin].start] as { _type: string; _key: string; spacing?: BandSpacing }
    const panelTop = PANEL_TOP_FROM_SPACING.has(pinned._type)
      ? PANEL_TOP[pinned.spacing ?? PANEL_TOP_FROM_SPACING.get(pinned._type)!]
      : 'pt-section-edge'
    // The panel is see-through when the first thing on it is a pinned
    // content-width Media with no background of its own: the block behind
    // (e.g. the Ally hero) then shows on either side of the video. That
    // Media gets its own opaque panel for everything after it, so nothing
    // later shows through.
    const next = pieces[pin + 1] && (shown[pieces[pin + 1].start] as { _type: string; pinned?: boolean; tone?: string; width?: string })
    const clear =
      !!next && next._type === 'mediaBlock' && next.pinned === true && (next.tone ?? 'none') === 'none' && next.width !== 'full' && pin + 1 < pieces.length - 1
    return (
      <>
        {pieces.slice(0, pin).map((o) => o.el)}
        <div key={`pin-${pinned._key}`} className="w-full">
          {pieces[pin].el}
          <div className={`relative z-10 flow-root w-full ${clear ? '' : 'bg-surface'} ${panelTop}`}>{curtain(pieces.slice(pin + 1))}</div>
        </div>
      </>
    )
  }
  return <>{curtain(out)}</>
}
