import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'

type CardGridItem = {
  image?: SanityImageSource
  imageAlt?: string
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
  // Highlights each item's eyebrow leading word (e.g. "01") as a small
  // colored badge instead of plain text — off by default since not
  // every Card Grid is numbered.
  numberedEyebrow?: boolean
  // Adds an optional 7:5 image above each card's eyebrow — off by
  // default, and only shown on a card that actually has one uploaded.
  showImage?: boolean
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
  default: 'rounded-lg border border-border bg-background',
  dark: 'rounded-lg bg-foreground',
  accent: 'rounded-lg bg-accent',
}

// Mirrors SectionIntro's own HEADING_LINE_HEIGHT_GAP but without the
// "minus the container's base gap" adjustment — this is a standalone
// padding value, not stacking on top of any other gap, so it should
// equal the heading's full line-height exactly (matching the visual
// gap SectionIntro now produces between heading and body).
const CARD_PADDING_BOTTOM_VAR: Record<'h3' | 'h4', string> = {
  h3: 'var(--text-h3--full-line-height)',
  h4: 'var(--text-h4--full-line-height)',
}

// bg-foreground/text-accent for anything NOT dark (default's light
// background, accent's yellow background) — a solid accent-yellow
// badge on the dark card would put yellow text on a yellow badge and
// disappear, so dark gets the inverse pairing instead.
const NUMBER_BADGE_CLASS: Record<CardTone, string> = {
  default: 'rounded-xs bg-foreground px-xs text-accent',
  dark: 'rounded-xs bg-accent px-xs text-foreground',
  accent: 'rounded-xs bg-foreground px-xs text-accent',
}

// Splits only the first word off as "the number" — existing content is
// already written as one string ("01 TID"), so this avoids a separate
// schema field and any content migration. The badge only gets that
// first word's own classes (background/padding/radius/color); it
// inherits the eyebrow paragraph's font-size/weight/tracking as-is,
// so the number reads at the same size as the rest of the eyebrow.
function renderEyebrow(eyebrow: string, numbered: boolean, tone: CardTone) {
  if (!numbered) return eyebrow
  const [number, ...rest] = eyebrow.trim().split(' ')
  const restText = rest.join(' ')
  return (
    <>
      <span className={NUMBER_BADGE_CLASS[tone]}>{number}</span>
      {restText && ` ${restText}`}
    </>
  )
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function CardGridBlock({
  columns = '3',
  items = [],
  tone = 'default',
  headingLevel = 'h4',
  numberedEyebrow = false,
  showImage = false,
}: CardGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell px="boxed">
      {/* Grid's default align-items: stretch makes every card in a row
          match the tallest one, on desktop's multi-column row — no
          extra height/flex wiring needed for that. Single column on
          mobile just stacks them at their own natural heights instead.
          gap-small/md:gap-large pairs with SectionShell's px="boxed"
          (8px) and each card's own horizontal px-medium-large (24px):
          the card's TEXT lands 8+24=32px from the edge either way, same
          as every non-boxed section's direct 32px padding — only the
          box itself hugs closer to the edge on mobile. Desktop's
          horizontal padding (32px gap, 32px card padding) is unchanged.
          The card's own TOP padding is separate from this rhythm and
          responds to whether it has an image — see hasImage below. */}
      <div className={`grid grid-cols-1 gap-small md:gap-large ${GRID_COLS_CLASS[columns]}`}>
        {items.map((item, index) => {
          const hasImage = showImage && !!item.image
          return (
            <div key={index} className={`flex flex-col ${CARD_CLASS[tone]}`}>
              {/* Image (when present) is inset within the card's own
                  padding, like Bento Grid's media — not flush against
                  the card's edges. Top padding here is the card-edge-
                  to-image gap (24px); the image's own mb-large below
                  supplies the larger 32px gap down to the eyebrow. With
                  no image, this padding is the plain card-edge-to-
                  eyebrow gap instead, at the bigger 32px value. */}
              <div
                className={`flex flex-1 flex-col px-medium-large md:px-large ${hasImage ? 'pt-medium-large' : 'pt-large'}`}
                style={{ paddingBottom: CARD_PADDING_BOTTOM_VAR[headingLevel] }}
              >
                {hasImage && (
                  // bg-accent-gradient backdrop — same treatment
                  // Media.tsx gives every media slot by default (see
                  // Bento Grid). Temporary: Dan wants a different
                  // gradient behind dark-tone cards eventually, but is
                  // using the same yellow one everywhere for now.
                  <div className="bg-accent-gradient relative mb-large aspect-media w-full overflow-hidden rounded-md">
                    <Image
                      src={urlFor(item.image!).url()}
                      alt={item.imageAlt || ''}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <SectionIntro
                  as={headingLevel}
                  eyebrow={renderEyebrow(item.eyebrow, numberedEyebrow, tone)}
                  heading={item.heading}
                  body={item.body}
                  tone={tone === 'dark' ? 'inverse' : 'default'}
                  // On the dark card specifically, the kicker reads as an
                  // accent highlight rather than faded white — a look Dan
                  // asked for after seeing the plain white/70% version.
                  eyebrowColor={tone === 'dark' ? 'text-accent' : undefined}
                  // Card headings vary per instance (h3 or h4), so a single
                  // fixed gap would only ever suit one of them — see
                  // SectionIntro's own comment on this prop.
                  gapToLineHeight
                />
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
