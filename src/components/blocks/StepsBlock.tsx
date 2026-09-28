'use client'
import { Fragment } from 'react'
import { ArrowDownOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'

type StepsItem = {
  title: string
  body?: string
}
type StepsBlockProps = {
  items?: StepsItem[]
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function StepsBlock({ items = [] }: StepsBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell>
      {/* Stacked on mobile (plain flex-col), a row of equal-width steps
          on desktop. The arrow connector between steps is its own flex
          child (not nested inside the step it follows) so it can swap
          orientation with the container: a down arrow while stacked on
          mobile, a right arrow once the row goes horizontal on desktop —
          each hidden on the breakpoint the other owns. */}
      <div className="flex flex-col gap-medium-large md:flex-row md:items-start md:gap-2xl">
        {items.map((item, index) => (
          <Fragment key={index}>
            <div className="flex flex-1 flex-col gap-small-medium">
              <div className="flex size-2xl items-center justify-center rounded-full bg-foreground md:size-3xl">
                <span className="text-h3 font-bold text-accent md:text-h2">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h4 className="mt-small-medium text-h4 font-semibold text-balance text-foreground">
                {item.title}
              </h4>
              {item.body && (
                <p className="mt-small-medium text-body text-muted-foreground">{item.body}</p>
              )}
            </div>
            {index < items.length - 1 && (
              <>
                {/* Fixed at the mobile circle's own width (size-2xl) and
                    left-aligned like it (not centered on the full row),
                    so the line/arrow land directly under the circle
                    instead of under the row's horizontal center. */}
                <div className="flex w-2xl flex-col items-center gap-small md:hidden" aria-hidden="true">
                  <div className="h-2xl w-px bg-muted-foreground/40" />
                  <ArrowDownOutlined className="text-body text-muted-foreground" />
                </div>
                {/* Wrapped in a plain div rather than putting size/color
                    classes on the AntD icon itself — Ant Design's
                    .anticon base CSS is injected after Tailwind's
                    stylesheet, so at equal specificity it can silently
                    win over classes applied directly to the icon (e.g.
                    `hidden` losing to .anticon's `display: flex`). A
                    wrapping element with no .anticon class sidesteps it. */}
                <div className="hidden shrink-0 self-center md:flex" aria-hidden="true">
                  <ArrowRightOutlined className="text-h3 text-muted-foreground" />
                </div>
              </>
            )}
          </Fragment>
        ))}
      </div>
    </SectionShell>
  )
}
