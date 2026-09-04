export type ComponentLibraryEntry = {
  type: string
  title: string
  description: string
}

// Kept in sync by hand, not derived from the schema — a block's schema
// has no description field to pull from, and this list is meant to be
// a deliberate editor-facing reference, not a mirror of whatever's
// registered in code. Whenever a block is added to schemaTypes/index.ts
// and page.ts's `blocks` array, add an entry here too (see AGENTS.md).
export const COMPONENT_LIBRARY: ComponentLibraryEntry[] = [
  {
    type: 'headerBlock',
    title: 'Header',
    description: 'Site navigation bar with logo and links.',
  },
  {
    type: 'heroBlock',
    title: 'Hero',
    description:
      'Page-top banner — headline, subtext, CTA, and media, in a side-by-side or full-bleed layout.',
  },
  {
    type: 'featureSplitBlock',
    title: 'Feature Split',
    description:
      'Text and media side-by-side, mirrorable left or right, for a single feature callout.',
  },
  {
    type: 'featureGridBlock',
    title: 'Feature Grid',
    description: 'Grid of feature items, each with an icon, title, and description.',
  },
  {
    type: 'logoCloudBlock',
    title: 'Logo Cloud',
    description: 'Auto-scrolling ticker of partner or client logos.',
  },
  {
    type: 'testimonialCarouselBlock',
    title: 'Testimonial Carousel',
    description: 'Horizontally scrolling carousel of customer quotes.',
  },
  {
    type: 'statsBandBlock',
    title: 'Stats Band',
    description: 'Row of large numeric stats with labels.',
  },
  {
    type: 'pricingBlock',
    title: 'Pricing Cards',
    description: 'Pricing plan cards for comparing tiers.',
  },
  {
    type: 'bentoGridBlock',
    title: 'Bento Grid',
    description: 'Asymmetric grid of cards with mixed sizes, each with its own media.',
  },
  {
    type: 'faqAccordionBlock',
    title: 'FAQ Accordion',
    description: 'Expandable question and answer list.',
  },
  {
    type: 'comparisonTableBlock',
    title: 'Comparison Table',
    description: 'Feature comparison table across columns, e.g. plans or competitors.',
  },
  {
    type: 'caseStudyGridBlock',
    title: 'Case Study Card Grid',
    description: 'Grid of case study cards with a company logo, quote, and CTA.',
  },
  {
    type: 'ctaBannerBlock',
    title: 'CTA Banner',
    description: 'Full-width call-to-action banner with heading and button.',
  },
  {
    type: 'footerBlock',
    title: 'Footer',
    description: 'Site footer with link columns and newsletter signup.',
  },
]
