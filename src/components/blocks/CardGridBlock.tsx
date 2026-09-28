import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type CardGridItem = {
  eyebrow: string
  heading: string
  body?: string
}
type CardTone = 'default' | 'dark' | 'accent'
type CardGridBlockProps = {
  columns?: '1' | '2' | '3' | '4'
  items?: CardGridItem[]
  tone?: CardTone
  headingLevel?: 'h3' | 'h4'
}

const GRID_COLS_CLASS: Record<'1' | '2' | '3' | '4', string> = {
  '1': '',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

// dark: black bg, white text (border dropped — bg-foreground already
// contrasts against the page). accent: our accent-yellow bg, plain
// black text — same default SectionIntro tone as the light card,
// since --color-accent-foreground already resolves to --color-foreground.
const CARD_CLASS: Record<CardTone, string> = {
  default: 'rounded-lg border border-border bg-background p-medium-large md:p-large',
  dark: 'rounded-lg bg-foreground p-medium-large md:p-large',
  accent: 'rounded-lg bg-accent p-medium-large md:p-large',
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function CardGridBlock({ columns = '3', items = [], tone = 'default', headingLevel = 'h4' }: CardGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell px="boxed">
      {/* Grid's default align-items: stretch makes every card in a row
          match the tallest one, on desktop's multi-column row — no
          extra height/flex wiring needed for that. Single column on
          mobile just stacks them at their own natural heights instead.
          gap-small/md:gap-large pairs with SectionShell's px="boxed"
          (8px) and each card's own p-medium-large (24px): the card's
          TEXT lands 8+24=32px from the edge either way, same as every
          non-boxed section's direct 32px padding — only the box itself
          hugs closer to the edge on mobile. Desktop (32px gap, 32px
          card padding) is unchanged from before. */}
      <div className={`grid grid-cols-1 gap-small md:gap-large ${GRID_COLS_CLASS[columns]}`}>
        {items.map((item, index) => (
          <div key={index} className={`flex flex-col ${CARD_CLASS[tone]}`}>
            <SectionIntro
              as={headingLevel}
              eyebrow={item.eyebrow}
              heading={item.heading}
              body={item.body}
              tone={tone === 'dark' ? 'inverse' : 'default'}
              // On the dark card specifically, the kicker reads as an
              // accent highlight rather than faded white — a look Dan
              // asked for after seeing the plain white/70% version.
              eyebrowColor={tone === 'dark' ? 'text-accent' : undefined}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
