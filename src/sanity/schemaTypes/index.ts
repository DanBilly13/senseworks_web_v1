import { localizeSchemaTypes } from '../i18n/localizeSchema'
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
import { siteNavigation } from './documents/siteNavigation'
import { headerBlock } from './blocks/headerBlock'
import { heroBlock } from './blocks/heroBlock'
import { heroBackdropBlock } from './blocks/heroBackdropBlock'
import { heroImageOverlayCardBlock } from './blocks/heroImageOverlayCardBlock'
import { heroTextBlock } from './blocks/heroTextBlock'
import { sectionHeadlineBlock } from './blocks/sectionHeadlineBlock'
import { faqAccordionBlock } from './blocks/faqAccordionBlock'
import { featureSplitBlock } from './blocks/featureSplitBlock'
import { featureSplitDarkBlock } from './blocks/featureSplitDarkBlock'
import { fiftyFiftyBannerBlock } from './blocks/fiftyFiftyBannerBlock'
import { stepsBlock } from './blocks/stepsBlock'
import { featureGridBlock } from './blocks/featureGridBlock'
import { featureListBlock } from './blocks/featureListBlock'
import { cardGridBlock } from './blocks/cardGridBlock'
import { imageGridBlock } from './blocks/imageGridBlock'
import { stackAnimationBlock } from './blocks/stackAnimationBlock'
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
  siteNavigation,
  release,
  blogPost,
  headerBlock,
  heroBlock,
  heroBackdropBlock,
  heroImageOverlayCardBlock,
  heroTextBlock,
  sectionHeadlineBlock,
  faqAccordionBlock,
  featureSplitBlock,
  featureSplitDarkBlock,
  fiftyFiftyBannerBlock,
  stepsBlock,
  featureGridBlock,
  featureListBlock,
  cardGridBlock,
  imageGridBlock,
  stackAnimationBlock,
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
  footerBlock,
]

// Pages, their blocks, the media object, customer stories and articles
// get English/Swedish pairs for every text field (see localizeSchema.ts).
const LOCALIZED_TYPES = new Set(['page', 'media', 'customerStory', 'article', 'release', 'blogPost', ...allTypes.map((type) => type.name).filter((name) => name.endsWith('Block'))])

export const schemaTypes = localizeSchemaTypes(allTypes, LOCALIZED_TYPES)
