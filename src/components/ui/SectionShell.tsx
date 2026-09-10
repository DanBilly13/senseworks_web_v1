import type { ReactNode } from 'react'

type SectionShellProps = {
  maxWidth?: 'page' | 'prose-lg'
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
  sectionClassName?: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}

const MAX_WIDTH_CLASS = {
  page: 'max-w-page',
  'prose-lg': 'max-w-prose-lg',
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
        className={['mx-auto w-full px-medium-large', MAX_WIDTH_CLASS[maxWidth], className]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  )
}
