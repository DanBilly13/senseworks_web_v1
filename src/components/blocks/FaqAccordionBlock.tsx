'use client'
import { useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type FaqItem = { question: string; answer: string }
type FaqAccordionBlockProps = {
  heading?: string
  items?: FaqItem[]
  spacing?: 'loose' | 'medium' | 'tight'
}

export function FaqAccordionBlock({
  heading = 'Frequently asked questions',
  items = [],
  spacing = 'loose',
}: FaqAccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    // prose-xl (960px, "10 columns") — wider than the question/answer
    // text itself (prose-lg, 768px, "8 columns"), so the +/− toggle has
    // room to sit right-aligned in the leftover 2 columns instead of
    // hugging the question text. The divider (divide-y below) and each
    // item's own row span this full prose-xl width automatically.
    <SectionShell maxWidth="prose-xl" py={spacing} ariaLabel={heading}>
      <SectionIntro as="h2" heading={heading} maxWidth="lg" />
      <dl className="mt-2xl divide-y divide-border">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `faq-panel-${index}`
          const buttonId = `faq-button-${index}`
          return (
            <div key={buttonId}>
              <dt>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-medium py-small text-left text-body-lg font-medium text-foreground"
                >
                  {/* Mobile: flex-1 + min-w-0 so the question fills the
                      full row width and wraps normally. Desktop: reverts
                      to the fixed prose-lg cap, leaving room for
                      justify-between to push the icon's own column out
                      to the wider container's right edge (see maxWidth
                      note on SectionShell below). The icon sits in a
                      fixed-width column (shrink-0) at both breakpoints,
                      rather than just an inline sibling sized to its own
                      content. */}
                  <span className="min-w-0 flex-1 md:max-w-prose-lg md:flex-none">
                    {item.question}
                  </span>
                  <span className="flex w-large shrink-0 justify-end" aria-hidden="true">
                    {isOpen ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                </button>
              </dt>
              <dd
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="max-w-prose-lg pb-small text-body font-medium text-muted-foreground md:font-normal"
              >
                {item.answer}
              </dd>
            </div>
          )
        })}
      </dl>
    </SectionShell>
  )
}
