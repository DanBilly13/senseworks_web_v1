'use client'
import { useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type FaqItem = { question: string; answer: string }
type FaqAccordionBlockProps = { heading?: string; items?: FaqItem[] }

export function FaqAccordionBlock({
  heading = 'Frequently asked questions',
  items = [],
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
    <SectionShell maxWidth="prose-xl" ariaLabel={heading}>
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
                  className="flex w-full items-center justify-between py-small text-left text-body-lg font-medium text-foreground"
                >
                  <span className="max-w-prose-lg">{item.question}</span>
                  <span aria-hidden="true">{isOpen ? <MinusOutlined /> : <PlusOutlined />}</span>
                </button>
              </dt>
              <dd
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="max-w-prose-lg pb-small text-body text-muted-foreground"
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
