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
    type: 'heroTextBlock',
    title: 'Hero — Text Only',
    description: 'Left-aligned text-only hero — eyebrow, headline, subhead, and CTA, no media.',
  },
  {
    type: 'sectionHeadlineBlock',
    title: 'Section Headline',
    description:
      'Centered h2 headline for dividing sections mid-page — eyebrow, body, and CTA all optional.',
  },
  {
    type: 'featureSplitBlock',
    title: 'Feature Split',
    description:
      'Text and media side-by-side, mirrorable left or right, for a single feature callout.',
  },
  {
    type: 'featureSplitDarkBlock',
    title: 'Feature Split — Dark',
    description:
      'Dark contained panel, capped at page width — header, sub text, body, and button on one side, media on the other.',
  },
  {
    type: 'featureGridBlock',
    title: 'Feature Grid',
    description:
      'Grid of feature items, each with an icon, title, and description. Desktop columns (2 or 3) are editor\'s choice — e.g. a 2x2 layout for exactly 4 items. No intro of its own; pair with Section Headline above it if one\'s needed.',
  },
  {
    type: 'featureListBlock',
    title: 'Feature List',
    description: 'Left label / right body text rows, stacked — a lighter alternative to Feature Grid.',
  },
  {
    type: 'cardGridBlock',
    title: 'Card Grid',
    description:
      'Equal-height cards in a row (1-4 columns, editor\'s choice), each an eyebrow/heading/body — content-agnostic, not tied to any one use case. No intro of its own; pair with Section Headline above it if one\'s needed.',
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
    type: 'testimonialLargeBlock',
    title: 'Testimonial — Large',
    description: 'Single large standalone quote with avatar, name, and role — no carousel.',
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
    type: 'mediaBlock',
    title: 'Media',
    description: 'Single full-width image or video, 7:5 ratio, no text.',
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
    type: 'darkBannerBlock',
    title: 'Dark Banner',
    description:
      'Contained rounded dark panel (page-margined, not full-bleed — same treatment as Media/Feature Split Dark), 50/50 split — heading/body on the left, a short checkmark list on the right.',
  },
  {
    type: 'footerBlock',
    title: 'Footer',
    description: 'Site footer with link columns and newsletter signup.',
  },
]
