// Stored field names and values that were renamed to match what Studio
// shows (Studio phase 2, Nov 2026 — see STUDIO-CONVENTIONS.md): the
// heading under every block is `headline`, the text under a hero's is
// `body`, and a background value says what it is (`dark`, not `inverse`;
// `light` for the light grey fill, not `default`).
//
// One function, used twice: the migration script rewrote the dataset with
// it, and getPage still runs every block through it, so a block saved in
// the old shape (a Studio tab left open from before, an old revision
// restored from history) renders the same as ever instead of losing its
// heading or colour. A block already in the new shape passes through
// unchanged.

type Block = { _type: string; [key: string]: unknown }

// Old field name → new, per block type.
const RENAMED_FIELDS: Record<string, Record<string, string>> = {
  ctaBannerBlock: { heading: 'headline' },
  darkBannerBlock: { heading: 'headline' },
  fiftyFiftyBannerBlock: { heading: 'headline' },
  featureSplitBlock: { heading: 'headline', headingLevel: 'headlineSize' },
  featureSplitDarkBlock: { heading: 'headline' },
  fullWidthSingleBlock: { heading: 'headline' },
  horizontalScrollStackMediumBlock: { heading: 'headline', headingLevel: 'headlineSize' },
  mediaCarouselBlock: { heading: 'headline' },
  statsBandBlock: { heading: 'headline' },
  sectionHeadlineBlock: { size: 'headlineSize' },
  cardGridBlock: { headingLevel: 'titleSize' },
  heroBlock: { subhead: 'body' },
  heroTextBlock: { subhead: 'body' },
  heroAllyBlock: { subhead: 'body' },
  heroBackdropBlock: { subhead: 'body' },
  heroImageOverlayCardBlock: { subhead: 'body' },
  heroScrollZoomBlock: { subhead: 'body' },
}

// The shared full screen width background (bandFields).
const BAND = { inverse: 'dark' }

// Old value → new, per block type and (new) field name.
const RENAMED_VALUES: Record<string, Record<string, Record<string, string>>> = {
  bentoGridBlock: { tone: BAND },
  bodyColumnsBlock: { tone: BAND },
  cardGridBlock: { background: BAND, tone: { default: 'white' } },
  caseStudyGridBlock: { tone: { default: 'light' } },
  ctaBannerBlock: { tone: { inverse: 'dark', default: 'light' } },
  faqAccordionBlock: { tone: BAND },
  featureGridBlock: { tone: BAND },
  featureListBlock: { tone: BAND },
  fullWidthSingleBlock: { tone: { inverse: 'dark', default: 'light' } },
  heroBlock: { tone: BAND },
  heroBackdropBlock: { backgroundColor: { foreground: 'dark', surface: 'light' } },
  heroImageOverlayCardBlock: { tone: { inverse: 'dark', default: 'light', gradient: 'accentGradient' } },
  heroScrollZoomBlock: { tone: { inverse: 'dark' } },
  heroTextBlock: { tone: { inverse: 'dark', default: 'light' } },
  horizontalScrollStackMediumBlock: { tone: { default: 'none' } },
  imageGridBlock: { tone: BAND },
  logoCloudBlock: { tone: { inverse: 'dark', default: 'light' } },
  mediaCarouselBlock: { tone: { default: 'none' } },
  sectionHeadlineBlock: { tone: BAND },
  statBarsBlock: { tone: BAND },
  statementBlock: { tone: BAND },
  statementSplitBlock: { tone: BAND },
  statsBandBlock: { tone: { muted: 'light' } },
  testimonialLargeBlock: { tone: { accent: 'accentGradient' } },
}

export function upgradeBlock<T extends Block>(block: T): T {
  const fields = RENAMED_FIELDS[block._type]
  const values = RENAMED_VALUES[block._type]
  if (!fields && !values) return block
  const out: Record<string, unknown> = { ...block }
  for (const [from, to] of Object.entries(fields ?? {})) {
    if (from in out) {
      // The new name wins if both are somehow set.
      if (out[to] === undefined) out[to] = out[from]
      delete out[from]
    }
  }
  for (const [field, map] of Object.entries(values ?? {})) {
    const value = out[field]
    if (typeof value === 'string' && map[value]) out[field] = map[value]
  }
  return out as T
}

// Did upgradeBlock change anything? (The migration only writes blocks
// that need it.)
export function needsUpgrade(block: Block): boolean {
  return JSON.stringify(upgradeBlock(block)) !== JSON.stringify(block)
}
