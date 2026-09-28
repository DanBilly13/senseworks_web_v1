'use client'
import { ArrowRightOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type StepsItem = {
  title: string
  body?: string
}
type StepsBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: StepsItem[]
}

export function StepsBlock({ eyebrow, heading, body, items = [] }: StepsBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell className="flex flex-col gap-2xl">
      <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
      {/* Stacked on mobile (plain flex-col), a row of equal-width steps
          on desktop. The arrow connector is a trailing sibling INSIDE
          each step's own flex row rather than a separate element
          between steps — skipped on the last step, and hidden
          entirely on mobile (a stacked "flow" doesn't need a
          horizontal arrow, and a rotated one wasn't asked for). */}
      <div className="flex flex-col gap-2xl md:flex-row md:items-start">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-medium-large md:flex-1">
            <div className="flex flex-1 flex-col gap-small-medium">
              <span className="text-h1 font-bold text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4 className="mt-small-medium text-h4 font-semibold text-balance text-foreground">
                {item.title}
              </h4>
              {item.body && (
                <p className="mt-small-medium text-body text-muted-foreground">{item.body}</p>
              )}
            </div>
            {index < items.length - 1 && (
              // Wrapped in a plain span rather than hiding the AntD
              // icon's own span directly — Ant Design's .anticon base
              // CSS sets display:flex at the same specificity as (and
              // loaded after) Tailwind's `hidden` utility, so `hidden`
              // on the icon itself silently lost that fight and stayed
              // visible on mobile (confirmed by hand: computed display
              // was still "flex"). A wrapper with no .anticon class
              // sidesteps the conflict entirely.
              <span className="mt-small-medium hidden shrink-0 md:block">
                <ArrowRightOutlined className="text-h3 text-muted-foreground" aria-hidden="true" />
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
