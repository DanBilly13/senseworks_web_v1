'use client'
import { useState } from 'react'
import { ExpandAltOutlined } from '@ant-design/icons'
import { Modal } from '@/components/ui/Modal'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type BentoItem = { heading: string; body?: string; size?: 'normal' | 'large' }
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
          {items.map((item, index) => (
            <div
              key={index}
              className={
                item.size === 'large'
                  ? 'relative flex flex-col gap-medium-large rounded-lg border border-border bg-background p-large md:col-span-2'
                  : 'relative flex flex-col gap-medium-large rounded-lg border border-border bg-background p-large'
              }
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Expand ${item.heading}`}
                className="absolute top-medium-large right-medium-large flex size-large items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
              >
                <ExpandAltOutlined />
              </button>
              <div className="flex flex-col gap-small pr-2xl">
                <h3 className="text-h4 font-semibold text-foreground">{item.heading}</h3>
                {item.body && <p className="text-body text-muted-foreground">{item.body}</p>}
              </div>
              <div
                className="aspect-media w-full rounded-md bg-muted"
                role="img"
                aria-label="Placeholder image"
              />
            </div>
          ))}
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
