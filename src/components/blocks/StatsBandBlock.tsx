import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type StatsBandTone = 'none' | 'muted' | 'dark' | 'accent' | 'image'
type StatItem = { value: string; label: string }
type StatsBandBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: StatItem[]
  // 'none' sits straight on the page, as it always did. The others put
  // the content in a panel: content width with rounded corners on
  // desktop, edge to edge on mobile, padded inside by paddingTop/
  // paddingBottom. 'image' fills it with backgroundImage under a dark
  // tint (same treatment as Hero — Backdrop).
  tone?: StatsBandTone
  backgroundImage?: MediaField
  paddingTop?: SpacingValue
  paddingBottom?: SpacingValue
  // The gap below the block, before the next one.
  spacing?: SpacingValue
}

const PANEL_BG: Record<Exclude<StatsBandTone, 'none'>, string> = {
  muted: 'bg-muted',
  dark: 'bg-foreground',
  accent: 'bg-accent',
  image: 'bg-foreground',
}

// Light text on the dark and image panels, dark text everywhere else.
const isLight = (tone: StatsBandTone) => tone === 'dark' || tone === 'image'

export function StatsBandBlock({
  eyebrow,
  heading,
  body,
  items = [],
  tone = 'none',
  backgroundImage,
  paddingTop = 'medium',
  paddingBottom = 'medium',
  spacing = 'loose',
}: StatsBandBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const light = isLight(tone)
  const content = (
    <>
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="md"
        tone={light ? 'inverse' : 'default'}
      />
      <div
        className={`grid grid-cols-2 gap-large lg:grid-cols-4 lg:divide-x ${
          light ? 'lg:divide-background/20' : tone === 'accent' ? 'lg:divide-foreground/15' : 'lg:divide-border'
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-small px-medium-large text-center"
          >
            <span className={`font-heading text-h1 font-medium ${light ? 'text-background' : 'text-foreground'}`}>
              {item.value}
            </span>
            <span
              className={`text-body ${
                light ? 'text-background/70' : tone === 'accent' ? 'text-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
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

  // px="full": no side padding on mobile, so the panel runs edge to
  // edge; the page gutter on desktop, so it lines up with the content
  // width and gets rounded corners. The inner SectionShell supplies the
  // panel's own padding — top/bottom from the section spacing tiers.
  return (
    <SectionShell px="full" py={spacing}>
      <div className={`relative overflow-hidden md:rounded-lg ${PANEL_BG[tone]}`}>
        {tone === 'image' && (
          <>
            <div className="absolute inset-0">
              <Media media={backgroundImage} alt="" className="size-full" />
            </div>
            <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
          </>
        )}
        <SectionShell
          pt={paddingTop}
          pb={paddingBottom}
          sectionClassName="relative"
          className="flex flex-col gap-2xl"
        >
          {content}
        </SectionShell>
      </div>
    </SectionShell>
  )
}
