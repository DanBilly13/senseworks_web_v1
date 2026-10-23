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

export function BandFill({ tone = 'none', spacing = 'loose', children }: BandProps & { children: ReactNode }) {
  return <div className={`${tone === 'none' ? '' : BAND_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}>{children}</div>
}
