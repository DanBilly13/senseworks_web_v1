import { localizeSchemaTypes } from '../i18n/localizeSchema'
import { applyBlockConventions } from './blockConventions'
import { page } from './page'
import { media } from './objects/media'
import { blockContent } from './objects/blockContent'
import { teamMember } from './documents/teamMember'
import { customerStory } from './documents/customerStory'
import { tag } from './documents/tag'
import { article } from './documents/article'
import { testimonial } from './documents/testimonial'
import { client } from './documents/client'
import { bookMeetingSettings } from './documents/bookMeetingSettings'
import { webinarSettings } from './documents/webinarSettings'
import { tickerSettings } from './documents/tickerSettings'
import { siteNavigation } from './documents/siteNavigation'
import { headerBlock } from './blocks/headerBlock'
import { heroBlock } from './blocks/heroBlock'
import { heroBackdropBlock } from './blocks/heroBackdropBlock'
import { heroAllyBlock } from './blocks/heroAllyBlock'
import { heroScrollZoomBlock } from './blocks/heroScrollZoomBlock'
import { heroImageOverlayCardBlock } from './blocks/heroImageOverlayCardBlock'
import { heroTextBlock } from './blocks/heroTextBlock'
import { sectionHeadlineBlock } from './blocks/sectionHeadlineBlock'
import { faqAccordionBlock } from './blocks/faqAccordionBlock'
import { contactRowsBlock } from './blocks/contactRowsBlock'
import { featureSplitBlock } from './blocks/featureSplitBlock'
import { featureSplitDarkBlock } from './blocks/featureSplitDarkBlock'
import { fiftyFiftyBannerBlock } from './blocks/fiftyFiftyBannerBlock'
import { stepsBlock } from './blocks/stepsBlock'
import { featureGridBlock } from './blocks/featureGridBlock'
import { featureListBlock } from './blocks/featureListBlock'
import { cardGridBlock } from './blocks/cardGridBlock'
import { imageGridBlock } from './blocks/imageGridBlock'
import { statBarsBlock } from './blocks/statBarsBlock'
import { stackAnimationBlock } from './blocks/stackAnimationBlock'
import { statementBlock } from './blocks/statementBlock'
import { statementSplitBlock } from './blocks/statementSplitBlock'
import { stickySplitBlock } from './blocks/stickySplitBlock'
import { factsTableBlock } from './blocks/factsTableBlock'
import { bodyColumnsBlock } from './blocks/bodyColumnsBlock'
import { logoCloudBlock } from './blocks/logoCloudBlock'
import { testimonialCarouselBlock } from './blocks/testimonialCarouselBlock'
import { testimonialLargeBlock } from './blocks/testimonialLargeBlock'
import { statsBandBlock } from './blocks/statsBandBlock'
import { pricingBlock } from './blocks/pricingBlock'
import { bentoGridBlock } from './blocks/bentoGridBlock'
import { mediaBlock } from './blocks/mediaBlock'
import { footerBlock } from './blocks/footerBlock'
import { comparisonTableBlock } from './blocks/comparisonTableBlock'
import { ctaBannerBlock } from './blocks/ctaBannerBlock'
import { caseStudyGridBlock } from './blocks/caseStudyGridBlock'
import { darkBannerBlock } from './blocks/darkBannerBlock'
import { fullWidthSingleBlock } from './blocks/fullWidthSingleBlock'
import { horizontalScrollStackBlock } from './blocks/horizontalScrollStackBlock'
import { mediaCarouselBlock } from './blocks/mediaCarouselBlock'
import { releaseCardsBlock } from './blocks/releaseCardsBlock'
import { releaseTimelineBlock } from './blocks/releaseTimelineBlock'
import { blogPostsBlock } from './blocks/blogPostsBlock'
import { knowledgeBankBlock } from './blocks/knowledgeBankBlock'
import { customerStoriesListBlock } from './blocks/customerStoriesListBlock'
import { release } from './documents/release'
import { blogPost } from './documents/blogPost'
import { horizontalScrollStackMediumBlock } from './blocks/horizontalScrollStackMediumBlock'
import { teamGridBlock } from './blocks/teamGridBlock'
import { paragraphsBlock } from './blocks/paragraphsBlock'
import { richTextBlock } from './blocks/richTextBlock'

const allTypes = [
  page,
  media,
  blockContent,
  teamMember,
  tag,
  article,
  customerStory,
  testimonial,
  client,
  bookMeetingSettings,
  webinarSettings,
  tickerSettings,
  siteNavigation,
  release,
  blogPost,
  headerBlock,
  heroBlock,
  heroBackdropBlock,
  heroAllyBlock,
  heroScrollZoomBlock,
  heroImageOverlayCardBlock,
  heroTextBlock,
  sectionHeadlineBlock,
  faqAccordionBlock,
  contactRowsBlock,
  featureSplitBlock,
  featureSplitDarkBlock,
  fiftyFiftyBannerBlock,
  stepsBlock,
  featureGridBlock,
  featureListBlock,
  cardGridBlock,
  imageGridBlock,
  statBarsBlock,
  stackAnimationBlock,
  statementBlock,
  statementSplitBlock,
  stickySplitBlock,
  factsTableBlock,
  bodyColumnsBlock,
  logoCloudBlock,
  testimonialCarouselBlock,
  testimonialLargeBlock,
  statsBandBlock,
  pricingBlock,
  bentoGridBlock,
  mediaBlock,
  comparisonTableBlock,
  caseStudyGridBlock,
  ctaBannerBlock,
  darkBannerBlock,
  fullWidthSingleBlock,
  horizontalScrollStackBlock,
  mediaCarouselBlock,
  releaseCardsBlock,
  releaseTimelineBlock,
  blogPostsBlock,
  knowledgeBankBlock,
  customerStoriesListBlock,
  horizontalScrollStackMediumBlock,
  teamGridBlock,
  paragraphsBlock,
  richTextBlock,
  footerBlock,
]

// Pages, their blocks, the media object, customer stories and articles
// get English/Swedish pairs for every text field (see localizeSchema.ts).
const LOCALIZED_TYPES = new Set(['page', 'media', 'customerStory', 'article', 'release', 'blogPost', ...allTypes.map((type) => type.name).filter((name) => name.endsWith('Block'))])

// Every page block gets the Studio house rules (tabs, field order, text
// box sizes, labels — see blockConventions.ts). Not Header/Footer: they're
// edited inside Site navigation, not added to pages.
const NOT_PAGE_BLOCKS = new Set(['headerBlock', 'footerBlock'])
const conventionTypes = allTypes.map((type) =>
  type.name.endsWith('Block') && !NOT_PAGE_BLOCKS.has(type.name) ? applyBlockConventions(type) : type,
)

export const schemaTypes = localizeSchemaTypes(conventionTypes, LOCALIZED_TYPES)
