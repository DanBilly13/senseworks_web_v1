'use client'
import { useState } from 'react'
import { ExpandAltOutlined } from '@ant-design/icons'
import { Modal } from '@/components/ui/Modal'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps, type BandTone } from '@/components/ui/BandFill'
import { ItemHeading } from '@/components/ui/ItemHeading'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type BentoItem = {
  heading: string
  body?: string
  size?: 'normal' | 'large' | 'tall'
  media?: MediaField
}
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it (left-aligned on the site so far).
// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type BentoGridBlockProps = BandProps & {
  columns?: '2' | '3'
  headingLayout?: 'stacked' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  // Off by default: each card gets an expand button that opens it in a
  // pop-up only when this is on.
  expandable?: boolean
  items?: BentoItem[]
}

// The cards stay outlined on a fill: a light outline and light text on
// Dark, a dark outline on Accent (the page's grey outline barely shows
// on the accent colors).
const CARD_BORDER_CLASS: Record<BandTone, string> = {
  none: 'border-border',
  inverse: 'border-background/20',
  accent: 'border-foreground/15',
  accentDark: 'border-background/20',
}

const GRID_COLS_CLASS: Record<'2' | '3', string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
}

export function BentoGridBlock({
  columns = '3',
  headingLayout = 'stacked',
  titleSize = 'h5',
  tone = 'none',
  expandable = false,
  items = [],
  ...band
}: BentoGridBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  // Dark and the dark accent gradient both take white text.
  const dark = tone === 'inverse' || tone === 'accentDark'
  const grid = (
    <SectionShell px="boxed" {...bandShellPadding({ tone, ...band })}>
      {/* gap-small/md:gap-large + each card's p-medium-large/md:p-large:
          same 8+24=32px-from-edge mobile rhythm as Card Grid — see its
          own comment for the full reasoning. Desktop unchanged. */}
      <div className={`grid grid-cols-1 gap-small md:gap-large ${GRID_COLS_CLASS[columns]}`}>
        {items.map((item, index) => {
          // Large (2 wide, 2 tall) and Tall (1 wide, 2 tall) both span two
          // grid rows, so they sit side by side at full height while the
          // Normal cards auto-place into the row below. Their image gets
          // the same taller fixed height regardless of the card's own
          // width — only row-span (not column-span) affects image height.
          const spansTwoRows = item.size === 'large' || item.size === 'tall'
          const cardSpanClass = item.size === 'large' ? 'md:col-span-2' : ''
          return (
            <div
              key={index}
              className={`relative flex flex-col rounded-lg border ${CARD_BORDER_CLASS[tone]} p-medium-large md:p-large ${cardSpanClass} ${spansTwoRows ? 'md:row-span-2' : ''}`}
            >
              {expandable && (
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Expand ${item.heading}`}
                  className={`absolute top-medium-large right-medium-large flex size-large items-center justify-center rounded-full border ${CARD_BORDER_CLASS[tone]} ${dark ? 'text-background hover:bg-background/10' : 'text-foreground hover:bg-background'}`}
                >
                  <ExpandAltOutlined />
                </button>
              )}
              {/* The right padding keeps the heading clear of the button. */}
              <div className={`flex flex-1 flex-col ${expandable ? 'pr-2xl' : ''}`}>
                <ItemHeading
                  as={titleSize}
                  tone={dark ? 'inverse' : 'default'}
                  title={item.heading}
                  description={item.body}
                  layout={headingLayout}
                  gap="medium"
                  descriptionClassName="line-clamp-2"
                />
              </div>
              <Media
                media={item.media}
                alt={item.heading}
                className={`mt-medium-large w-full shrink-0 rounded-md ${
                  columns === '2'
                    ? 'aspect-media'
                    : spansTwoRows
                      ? 'h-bento-media-lg'
                      : 'h-bento-media'
                }`}
              />
            </div>
          )
        })}
      </div>
    </SectionShell>
  )

  return (
    <>
      <BandFill tone={tone} {...band}>
        {grid}
      </BandFill>
      <Modal
        open={expandable && openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={openIndex !== null ? items[openIndex].heading : undefined}
      >
        {/* Content intentionally left blank for now — Dan wants to design this later. */}
      </Modal>
    </>
  )
}
