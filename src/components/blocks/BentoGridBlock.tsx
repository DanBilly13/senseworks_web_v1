'use client'
import { useState } from 'react'
import { ExpandAltOutlined } from '@ant-design/icons'
import { Modal } from '@/components/ui/Modal'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type BentoItem = { heading: string; body?: string; size?: 'normal' | 'large' | 'tall' }
type BentoGridBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  items?: BentoItem[]
}

export function BentoGridBlock({ eyebrow, heading, body, items = [] }: BentoGridBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <>
      <SectionShell className="flex flex-col gap-2xl">
        <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
        <div className="grid grid-cols-1 gap-large md:grid-cols-3">
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
                className={`relative flex flex-col rounded-lg border border-border bg-background p-large ${cardSpanClass} ${spansTwoRows ? 'md:row-span-2' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Expand ${item.heading}`}
                  className="absolute top-medium-large right-medium-large flex size-large items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                >
                  <ExpandAltOutlined />
                </button>
                <div className="flex flex-1 flex-col gap-small pr-2xl">
                  <h3 className="text-h4 font-semibold text-foreground">{item.heading}</h3>
                  {item.body && (
                    <p className="line-clamp-2 text-body text-muted-foreground">{item.body}</p>
                  )}
                </div>
                <div
                  className={`mt-medium-large w-full shrink-0 rounded-md bg-muted ${spansTwoRows ? 'h-bento-media-lg' : 'h-bento-media'}`}
                  role="img"
                  aria-label="Placeholder image"
                />
              </div>
            )
          })}
        </div>
      </SectionShell>
      <Modal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={openIndex !== null ? items[openIndex].heading : undefined}
      >
        {/* Content intentionally left blank for now — Dan wants to design this later. */}
      </Modal>
    </>
  )
}
