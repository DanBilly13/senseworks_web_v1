import type { ReactNode } from 'react'

type SectionShellProps = {
  maxWidth?: 'page' | 'prose-lg' | 'prose-xl'
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
  px?: 'default' | 'boxed' | 'full'
  sectionClassName?: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}

const MAX_WIDTH_CLASS = {
  page: 'max-w-page',
  'prose-lg': 'max-w-prose-lg',
  'prose-xl': 'max-w-prose-xl',
}

const PX_CLASS = {
  default: 'px-large md:px-medium-large',
  boxed: 'px-small md:px-medium-large',
  full: 'md:px-medium-large',
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
  px = 'default',
  sectionClassName,
  className,
  ariaLabel,
  children,
}: SectionShellProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={[PB_CLASS[py], pad === 'both' ? PT_CLASS[py] : '', sectionClassName]
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
