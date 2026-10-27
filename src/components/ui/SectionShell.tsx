import type { ReactNode } from 'react'

type SectionShellProps = {
  // 'full': no cap — the content runs the full screen width, still inside
  // the side padding (a block's "Full screen width" option).
  maxWidth?: 'page' | 'full' | 'prose-lg' | 'prose-xl'
  // 'loose'/'medium'/'tight' are the three section-to-section rhythm
  // tiers (200/120/60px desktop — see globals.css); every block stays
  // on 'loose' for now, this just makes the other two selectable.
  // 'none' is a flat 0 — two blocks meant to sit flush against each
  // other with no gap at all.
  py?: '3xl' | 'large' | 'section-edge' | 'loose' | 'medium' | 'tight' | 'none'
  // Most sections only need bottom padding — two adjacent sections
  // each contributing their own top+bottom padding doubled the visual
  // gap between them. Page boundaries (Hero, Footer) and sections with
  // a filled/contained background (CTA Banner's tone fill) still want
  // both, since there's no neighboring section to supply the other
  // half of the gap instead.
  pad?: 'bottom' | 'both'
  // Independent overrides for pt/pb's own tier, for a caller that
  // needs its top and bottom padding set separately (e.g. Full Width
  // Single) rather than tied together via py/pad. Either one left
  // unset falls back to the py/pad-derived value above.
  pt?: '3xl' | 'large' | 'section-edge' | 'loose' | 'medium' | 'tight' | 'none'
  pb?: '3xl' | 'large' | 'section-edge' | 'loose' | 'medium' | 'tight' | 'none'
  // Mobile rhythm rule (desktop is identical either way, 24px):
  // 'default' for plain content — the text itself sits 32px from the
  // screen edge. 'boxed' for a section whose content is one or more
  // visually boxed cards (a border/background/shadow around each
  // item) — the section only pads 8px, and pairing that with the
  // card's own ~24px internal padding lands the card's TEXT at the
  // same 32px line as 'default' content, while letting the box itself
  // hug closer to the edge. Callers with boxed content are expected to
  // also give their card grid a matching mobile gap (gap-small) and
  // their cards matching internal padding (p-medium-large) — this
  // prop only handles the section's own edge, not those.
  // 'full' is 0 on mobile (edge-to-edge) — for a single boxed panel
  // that itself goes full screen width there, not a grid of several
  // separately-boxed cards (that's 'boxed') — same md:px-medium-large
  // as 'boxed' at desktop.
  // 'panel' is for a SectionShell nested INSIDE a boxed panel (Stats
  // Band's): the panel's own inner padding, 32px mobile / 24px desktop,
  // not the page gutter — that's the outer SectionShell's job.
  px?: 'default' | 'boxed' | 'full' | 'panel'
  sectionClassName?: string
  className?: string
  ariaLabel?: string
  // Anchor target for in-page links (e.g. a nav item pointing at #pricing).
  id?: string
  children: ReactNode
}

const MAX_WIDTH_CLASS = {
  page: 'max-w-page',
  full: 'max-w-none',
  'prose-lg': 'max-w-prose-lg',
  'prose-xl': 'max-w-prose-xl',
}

const PX_CLASS = {
  default: 'px-large md:px-gutter',
  boxed: 'px-small md:px-gutter',
  full: 'md:px-gutter',
  panel: 'px-large md:px-medium-large',
}

// Exported so the couple of blocks that can't route through
// SectionShell itself (a full-bleed carousel scroller, a mirrored row
// that needs its own markup — see Testimonial Carousel/Feature Split's
// own comments) can still offer the same loose/medium/tight choice on
// their own hand-rolled <section>, without duplicating these values.
export const SECTION_GAP_PB_CLASS: Record<'loose' | 'medium' | 'tight' | 'none', string> = {
  loose: 'pb-section-gap-loose',
  medium: 'pb-section-gap-medium',
  tight: 'pb-section-gap-tight',
  none: 'pb-none',
}

// The same four gaps as a bottom MARGIN — for a block whose own
// full-bleed background fill is the section (Full Width Single, a
// Stats Band with a background): the fill ends at the block's edge and
// the gap to the next block sits outside it, while SectionShell's own
// padding is spent on the block's internal top/bottom padding.
export const SECTION_GAP_MB_CLASS: Record<'loose' | 'medium' | 'tight' | 'none', string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

const PB_CLASS = {
  '3xl': 'pb-3xl',
  large: 'pb-large',
  'section-edge': 'pb-section-edge',
  ...SECTION_GAP_PB_CLASS,
}

const PT_CLASS = {
  '3xl': 'pt-3xl',
  large: 'pt-large',
  'section-edge': 'pt-section-edge',
  loose: 'pt-section-gap-loose',
  medium: 'pt-section-gap-medium',
  tight: 'pt-section-gap-tight',
  none: 'pt-none',
}

export function SectionShell({
  maxWidth = 'page',
  py = 'loose',
  pad = 'bottom',
  pt,
  pb,
  px = 'default',
  sectionClassName,
  className,
  ariaLabel,
  id,
  children,
}: SectionShellProps) {
  const resolvedPb = pb ?? py
  const resolvedPt = pt ?? (pad === 'both' ? py : undefined)
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={[
        PB_CLASS[resolvedPb],
        resolvedPt ? PT_CLASS[resolvedPt] : '',
        sectionClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={['mx-auto w-full', PX_CLASS[px], MAX_WIDTH_CLASS[maxWidth], className]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  )
}
