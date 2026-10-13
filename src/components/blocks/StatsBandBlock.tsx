import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type StatsBandTone = 'none' | 'muted' | 'dark' | 'accent'
type StatItem = { value: string; label: string }
type StatsBandBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: StatItem[]
  // 'none' sits straight on the page, as it always did. The others fill
  // a full-screen-width band (same fills as Full Width Single / CTA
  // Banner), padded inside by paddingTop/paddingBottom.
  tone?: StatsBandTone
  paddingTop?: SpacingValue
  paddingBottom?: SpacingValue
  // The gap below the block, before the next one.
  spacing?: SpacingValue
}

const BAND_BG: Record<Exclude<StatsBandTone, 'none'>, string> = {
  muted: 'bg-muted',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// Value / label / column-divider colors per background.
const VALUE_CLASS: Record<StatsBandTone, string> = {
  none: 'text-foreground',
  muted: 'text-foreground',
  dark: 'text-background',
  accent: 'text-foreground',
}
const LABEL_CLASS: Record<StatsBandTone, string> = {
  none: 'text-muted-foreground',
  muted: 'text-muted-foreground',
  dark: 'text-background/70',
  accent: 'text-foreground/70',
}
const DIVIDER_CLASS: Record<StatsBandTone, string> = {
  none: 'lg:divide-border',
  muted: 'lg:divide-border',
  dark: 'lg:divide-background/20',
  accent: 'lg:divide-foreground/15',
}

export function StatsBandBlock({
  eyebrow,
  heading,
  body,
  items = [],
  tone = 'none',
  paddingTop = 'medium',
  paddingBottom = 'medium',
  spacing = 'loose',
}: StatsBandBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const content = (
    <>
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="md"
        tone={tone === 'dark' ? 'inverse' : 'default'}
      />
      <div className={`grid grid-cols-2 gap-large lg:grid-cols-4 lg:divide-x ${DIVIDER_CLASS[tone]}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-small px-medium-large text-center"
          >
            <span className={`font-heading text-h1 font-medium ${VALUE_CLASS[tone]}`}>{item.value}</span>
            <span className={`text-body ${LABEL_CLASS[tone]}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  )

  if (tone === 'none') {
    return (
      <SectionShell py={spacing} className="flex flex-col gap-2xl">
        {content}
      </SectionShell>
    )
  }

  // Full-bleed band: the fill is the section, so its padding is its own
  // (paddingTop/paddingBottom, the section spacing tiers) and the gap
  // to the next block is a margin outside it — same as Full Width Single.
  return (
    <div className={`${BAND_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}>
      <SectionShell pt={paddingTop} pb={paddingBottom} className="flex flex-col gap-2xl">
        {content}
      </SectionShell>
    </div>
  )
}
