'use client'
import { useId, useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps, type BandTone } from '@/components/ui/BandFill'

type FaqItem = { question: string; answer: string }
// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type FaqAccordionBlockProps = BandProps & {
  items?: FaqItem[]
  // Content width (the page column) or the full screen width.
  width?: 'content' | 'full'
}

// Question, answer, divider and icon colours per background: white text
// on Dark and the dark gradient, the usual dark text on the page and Accent.
const TONE_CLASS: Record<BandTone, { question: string; answer: string; divide: string }> = {
  none: { question: 'text-foreground', answer: 'text-muted-foreground', divide: 'divide-border' },
  accent: { question: 'text-foreground', answer: 'text-foreground/70', divide: 'divide-foreground/15' },
  inverse: { question: 'text-background', answer: 'text-background/70', divide: 'divide-background/20' },
  accentDark: { question: 'text-background', answer: 'text-background/70', divide: 'divide-background/20' },
}

// The questions only — no heading of its own: pair it with a Section
// Headline above. The rows and their dividers span the full content
// width, the +/− at the far right; the question text is capped at 80%
// and the answer at 60% (each with a rem cap) so lines stay readable.
export function FaqAccordionBlock({ items = [], width = 'content', tone = 'none', ...band }: FaqAccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Unique per block, so two FAQs on one page don't share ids.
  const id = useId()

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null
  const t = TONE_CLASS[tone]

  return (
    <BandFill tone={tone} {...band}>
      <SectionShell maxWidth={width === 'full' ? 'full' : 'page'} {...bandShellPadding({ tone, ...band })}>
        <dl className={`divide-y ${t.divide}`}>
          {items.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `${id}-panel-${index}`
            const buttonId = `${id}-button-${index}`
            return (
              <div key={buttonId}>
                <dt>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`flex w-full items-center justify-between gap-medium py-medium text-left text-body-lg font-medium ${t.question}`}
                  >
                    <span className="min-w-0 flex-1 md:max-w-four-fifths">{item.question}</span>
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
                  className={`pb-medium text-body font-medium md:max-w-three-fifths md:font-normal ${t.answer}`}
                >
                  {item.answer}
                </dd>
              </div>
            )
          })}
        </dl>
      </SectionShell>
    </BandFill>
  )
}
