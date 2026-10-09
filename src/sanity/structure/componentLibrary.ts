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
      'Page-top banner — headline, subtext, CTA, and media, in a side-by-side, 50/50, or full-bleed layout.',
  },
  {
    type: 'heroBackdropBlock',
    title: 'Hero — Backdrop (experimental)',
    description:
      'Flexible full-bleed backdrop (image, color, or gradient) behind text and a separate showcase image/video.',
  },
  {
    type: 'heroImageOverlayCardBlock',
    title: 'Hero — Image Overlay Card (experimental)',
    description:
      'Full-bleed pinned video with text in a card overlay. On desktop, scrolling carries the card away then morphs the video down to content width before releasing.',
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
    type: 'fiftyFiftyBannerBlock',
    title: '50/50 Banner',
    description:
      'Dark contained panel, fixed 500px tall on desktop (sized for a 700x500 image) — eyebrow/heading/body/button on one half, a full-bleed image on the other. Stacks on mobile.',
  },
  {
    type: 'stepsBlock',
    title: 'Steps',
    description:
      'Numbered sequence (01, 02, ... — numbered automatically from list order) with a title and body per step, arrow connectors between them on desktop. Stacks on mobile, no arrows. Carries its own optional eyebrow/heading/body lead-in.',
  },
  {
    type: 'paragraphsBlock',
    title: 'Paragraphs',
    description:
      'Text-only columns (3 or 4 on desktop), no boxes: an optional H4/H5/H6 title, stacked or inline, over body text. Add an "Empty column" item to leave a desktop column blank and push text across (e.g. text, text, empty); it disappears on mobile. No intro of its own; add a Section Headline above it.',
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
    type: 'horizontalScrollStackMediumBlock',
    title: 'Horizontal Scroll Stack Medium',
    description:
      'Desktop: pins in place and slides a row of Feature-Split-sized images with captions sideways as the page scrolls down, under a left-aligned H2/H3 title and optional text that stay put. Stacks vertically on mobile. Light or dark.',
  },
  {
    type: 'releaseCardsBlock',
    title: 'Release Cards',
    description:
      'Project-management-style cards for what has shipped: a colored category chip (Audit purple, Analysis green, Customer Service yellow), title, text, optional image, a progress bar (full for shipped) and the date. 2 or 3 columns. No intro of its own; add a Section Headline above it.',
  },
  {
    type: 'teamGridBlock',
    title: 'Team Grid',
    description:
      'The team roster: photo cards that open a dark bio card. Shows every Team member A–Z, or just the people you pick. No intro of its own; add a Section Headline above it.',
  },
  {
    type: 'mediaCarouselBlock',
    title: 'Media Carousel',
    description:
      'Slides that scroll sideways and run off the screen edge — an image or video the size of a Feature Split image, with a bold-lead caption under it. Light or dark. Optional left-aligned heading and text above the slides that stay put as they scroll.',
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
    description:
      'Single full-width image, video, Lottie, or curated React animation, 7:5 ratio. Optional eyebrow/headline/body/button overlay with left or center alignment.',
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
    title: 'Case Study Carousel',
    description: 'Horizontally scrolling carousel of case study cards (company logo or name, facts, quote, CTA), like Testimonial Carousel. Light, dark or accent. Optional heading beside the arrows.',
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
    type: 'fullWidthSingleBlock',
    title: 'Full Width Single',
    description:
      'Like CTA Banner, but with an image below the text — full-bleed tone background, text and image both capped at the normal page content width.',
  },
  {
    type: 'horizontalScrollStackBlock',
    title: 'Horizontal Scroll Stack',
    description:
      'Desktop: pins in place and scrolls horizontally through 2-6 full-bleed slides as the page scrolls down, one centered at a time, dimming as each is scrolled past. Stacks vertically on mobile.',
  },
  {
    type: 'footerBlock',
    title: 'Footer',
    description: 'Site footer with link columns and newsletter signup.',
  },
]
