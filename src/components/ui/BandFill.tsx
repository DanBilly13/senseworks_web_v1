import type { ReactNode } from 'react'
import { SECTION_GAP_MB_CLASS } from '@/components/ui/SectionShell'

// A block's optional full screen width background (Section Headline,
// Bento Grid, Card Grid, Feature Grid), and its padding. No automatic
// rules (Dan's call): Top and Bottom padding are the space inside the
// block — inside its color, when it has one — exactly as set, and
// Section spacing is always the gap after it, outside the color. To make
// two blocks read as one band, give them the same background and set
// the padding/spacing between them by hand.
//
// Left unset, the padding is None without a background (as every block
// was before these fields) and Medium with one.
//
// accentDark (not on Section Headline): the dark accent gradient, white
// text like Dark.
export type BandTone = 'none' | 'inverse' | 'accent' | 'accentDark'
export type BandSpacing = 'loose' | 'medium' | 'tight' | 'none'

export type BandProps = {
  tone?: BandTone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
}

const BAND_BG: Record<Exclude<BandTone, 'none'>, string> = {
  inverse: 'bg-foreground',
  accent: 'bg-accent',
  accentDark: 'bg-accent-gradient-dark',
}

// SectionShell's pt/pb for the block's content.
export function bandShellPadding({ tone = 'none', paddingTop, paddingBottom }: BandProps): { pt: BandSpacing; pb: BandSpacing } {
  const unset: BandSpacing = tone === 'none' ? 'none' : 'medium'
  return { pt: paddingTop ?? unset, pb: paddingBottom ?? unset }
}

// width (the blocks with a Width option — Section Headline, Feature List,
// FAQ): the shape of the background. 'full' (and every block without the
// option, or with it unset) fills the full screen width; 'content' makes it a panel the
// width of the page column — edge to edge on phones, inside the page
// gutter from tablet up. Square corners, so two Content width blocks
// with the same background and no spacing between them join into one
// panel. Inside it, the content sits further in from the sides than the
// page gutter (.band-panel in globals.css), the same for every block, so
// joined blocks stay lined up.
export function BandFill({
  tone = 'none',
  spacing = 'loose',
  width = 'full',
  children,
}: BandProps & { width?: 'content' | 'full'; children: ReactNode }) {
  if (tone !== 'none' && width === 'content') {
    return (
      <div className={`mx-auto w-full max-w-page md:px-gutter ${SECTION_GAP_MB_CLASS[spacing]}`}>
        <div className={`band-panel ${BAND_BG[tone]}`}>{children}</div>
      </div>
    )
  }
  return <div className={`${tone === 'none' ? '' : BAND_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}>{children}</div>
}
