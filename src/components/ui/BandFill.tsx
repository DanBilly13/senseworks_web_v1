import type { ReactNode } from 'react'
import { SECTION_GAP_MB_CLASS } from '@/components/ui/SectionShell'

// A block's optional full screen width background (Section Headline,
// Bento Grid): None sits on the page; Dark or Accent fills the width,
// with the block's own top/bottom padding inside the color and its
// Section spacing as the gap after it, outside (as on Full Width
// Single).
//
// Two of these blocks in a row with the same background join into one
// band (BlockRenderer passes joinAbove/joinBelow): the first block's
// Section spacing becomes the space inside the color between them, and
// neither pads the edge they share — so a Section Headline followed by
// a Bento Grid, both on Dark, reads as one dark section.
// accentDark (Bento Grid only): the dark accent gradient, white text
// like Dark. Never joins: each block would start its own gradient.
export type BandTone = 'none' | 'inverse' | 'accent' | 'accentDark'
export type BandSpacing = 'loose' | 'medium' | 'tight' | 'none'

export type BandProps = {
  tone?: BandTone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
  joinAbove?: boolean
  joinBelow?: boolean
}

// The block types that take part in joining (see BlockRenderer).
export const BAND_BLOCK_TYPES = new Set(['sectionHeadlineBlock', 'bentoGridBlock'])

const BAND_BG: Record<Exclude<BandTone, 'none'>, string> = {
  inverse: 'bg-foreground',
  accent: 'bg-accent',
  accentDark: 'bg-accent-gradient-dark',
}

// SectionShell's pt/pb for the block's content, given its band settings.
export function bandShellPadding({
  tone = 'none',
  paddingTop = 'medium',
  paddingBottom = 'medium',
  spacing = 'loose',
  joinAbove = false,
  joinBelow = false,
}: BandProps): { pt?: BandSpacing; pb: BandSpacing } {
  if (tone === 'none') return { pb: spacing }
  return {
    pt: joinAbove ? 'none' : paddingTop,
    pb: joinBelow ? spacing : paddingBottom,
  }
}

export function BandFill({ tone = 'none', spacing = 'loose', joinBelow = false, children }: BandProps & { children: ReactNode }) {
  if (tone === 'none') return <>{children}</>
  return <div className={`${BAND_BG[tone]} ${joinBelow ? '' : SECTION_GAP_MB_CLASS[spacing]}`}>{children}</div>
}
