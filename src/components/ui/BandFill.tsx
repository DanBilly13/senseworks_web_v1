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
// accentDark: the dark accent gradient, white text like Dark.
// accentGradient: the light accent gradient (the heroes'), dark text like
// Accent.
export type BandTone = 'none' | 'inverse' | 'accent' | 'accentDark' | 'accentGradient'
export type BandSpacing = 'loose' | 'medium' | 'tight' | 'none'

export type BandProps = {
  tone?: BandTone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
  // Set by BlockRenderer (see bandPanelJoins): this block's Content width
  // panel runs straight on from the one above / into the one below, so
  // those corners stay square.
  joinTop?: boolean
  joinBottom?: boolean
}

const BAND_BG: Record<Exclude<BandTone, 'none'>, string> = {
  inverse: 'bg-foreground',
  accent: 'bg-accent',
  accentDark: 'bg-accent-gradient-dark',
  accentGradient: 'bg-accent-gradient',
}

// SectionShell's pt/pb for the block's content.
export function bandShellPadding({ tone = 'none', paddingTop, paddingBottom }: BandProps): { pt: BandSpacing; pb: BandSpacing } {
  const unset: BandSpacing = tone === 'none' ? 'none' : 'medium'
  return { pt: paddingTop ?? unset, pb: paddingBottom ?? unset }
}

// A Content width panel: a block with a background and Width set to
// Content (only the blocks with the option set it).
type PanelBlock = { width?: string; tone?: string; spacing?: string }
const isPanel = (block: PanelBlock) => block.width === 'content' && !!block.tone && block.tone !== 'none'

// Which shown blocks run straight on into the next one: both Content
// width panels with the same background, and Section spacing None on the
// upper one. Any number in a row read as one panel — the first keeps its
// top corners, the last its bottom ones, any in between have none.
export function bandPanelJoins(blocks: PanelBlock[]): boolean[] {
  return blocks.map((block, i) => {
    const next = blocks[i + 1]
    return !!next && isPanel(block) && isPanel(next) && block.tone === next.tone && block.spacing === 'none'
  })
}

// Full screen width blocks on the same accent gradient (dark or light)
// that run straight on into each other (Section spacing None on the upper
// one): each would
// draw its own copy of the gradient, restarting it with a visible line
// where they meet, so BlockRenderer wraps each run in one shared copy
// (.band-gradient-run in globals.css, which clears the blocks' own).
// Card Grid's background setting is called `background`.
type GradientBlock = PanelBlock & { background?: string }
const gradientOf = (block: GradientBlock) => {
  const tone = block.tone ?? block.background
  return (tone === 'accentDark' || tone === 'accentGradient') && block.width !== 'content' ? tone : undefined
}

// The runs: [first, last] indexes into the shown blocks (only runs of two
// or more), and the background class the run draws.
export function bandGradientRuns(blocks: GradientBlock[]): { first: number; last: number; bg: string }[] {
  const runs: { first: number; last: number; bg: string }[] = []
  let start = -1
  blocks.forEach((block, i) => {
    const tone = gradientOf(block)
    if (start < 0 && tone) start = i
    const next = blocks[i + 1]
    const continues = start >= 0 && block.spacing === 'none' && !!next && gradientOf(next) === gradientOf(blocks[start])
    if (start >= 0 && !continues) {
      if (i > start) runs.push({ first: start, last: i, bg: BAND_BG[gradientOf(blocks[start])!] })
      start = -1
    }
  })
  return runs
}

// width (the blocks with a Width option — Section Headline, Feature List,
// FAQ): the shape of the background. 'full' (and every block without the
// option, or with it unset) fills the full screen width; 'content' makes it a panel the
// width of the page column — edge to edge (and square) on phones, inside the page
// gutter with rounded corners from tablet up. Square corners, so two Content width blocks
// with the same background and no spacing between them join into one
// panel. Inside it, the content sits further in from the sides than the
// page gutter (.band-panel in globals.css), the same for every block, so
// joined blocks stay lined up.
export function BandFill({
  tone = 'none',
  spacing = 'loose',
  width = 'full',
  joinTop,
  joinBottom,
  children,
}: BandProps & { width?: 'content' | 'full'; children: ReactNode }) {
  if (tone !== 'none' && width === 'content') {
    const corners = ['md:rounded-lg', joinTop ? 'md:rounded-t-none' : '', joinBottom ? 'md:rounded-b-none' : '']
      .filter(Boolean)
      .join(' ')
    return (
      <div className={`mx-auto w-full max-w-page md:px-gutter ${SECTION_GAP_MB_CLASS[spacing]}`}>
        <div className={`band-panel overflow-hidden ${corners} ${BAND_BG[tone]}`}>{children}</div>
      </div>
    )
  }
  return <div className={`${tone === 'none' ? '' : BAND_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}>{children}</div>
}
