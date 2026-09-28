import type { ReactNode } from 'react'

type SectionShellProps = {
  maxWidth?: 'page' | 'prose-lg' | 'prose-xl'
  // 'loose'/'medium'/'tight' are the three section-to-section rhythm
  // tiers (200/120/60px desktop — see globals.css); every block stays
  // on 'loose' for now, this just makes the other two selectable.
  py?: '3xl' | 'large' | 'section-edge' | 'loose' | 'medium' | 'tight'
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
  px?: 'default' | 'boxed'
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
}

const PB_CLASS = {
  '3xl': 'pb-3xl',
  large: 'pb-large',
  'section-edge': 'pb-section-edge',
  loose: 'pb-section-gap-loose',
  medium: 'pb-section-gap-medium',
  tight: 'pb-section-gap-tight',
}

const PT_CLASS = {
  '3xl': 'pt-3xl',
  large: 'pt-large',
  'section-edge': 'pt-section-edge',
  loose: 'pt-section-gap-loose',
  medium: 'pt-section-gap-medium',
  tight: 'pt-section-gap-tight',
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
