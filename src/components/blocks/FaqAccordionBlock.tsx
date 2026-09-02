'use client'
import { useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

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
    <section
      className="mx-auto w-full max-w-prose-lg px-medium-large py-3xl"
      aria-label={heading}
    >
      <h2 className="text-h2 font-semibold text-foreground">{heading}</h2>
      <dl className="mt-large divide-y divide-border">
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
                  <span>{item.question}</span>
                  <span aria-hidden="true">{isOpen ? <MinusOutlined /> : <PlusOutlined />}</span>
                </button>
              </dt>
              <dd
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-small text-body text-muted-foreground"
              >
                {item.answer}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
