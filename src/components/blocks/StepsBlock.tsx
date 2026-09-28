'use client'
import { Fragment } from 'react'
import Image from 'next/image'
import { ArrowDownOutlined } from '@ant-design/icons'
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
          on desktop. On mobile, the connector (line + down arrow) is
          its own flex child between steps (see below). On desktop, the
          connector instead lives inside each step's own top row, next
          to its circle — a fixed-size circle box plus a growing box
          that fills the rest of that step's width, so the arrow's
          length adapts to however much room each step actually has. */}
      <div className="flex flex-col gap-medium-large md:flex-row md:items-start md:gap-2xl">
        {items.map((item, index) => (
          <Fragment key={index}>
            <div className="flex flex-1 flex-col gap-small-medium">
              <div className="flex items-center">
                <div className="flex size-xl shrink-0 items-center justify-center rounded-full bg-foreground md:size-2xl">
                  <span className="text-h4 font-bold text-accent md:text-h3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                {index < items.length - 1 && (
                  // Fixed-width arrow asset (267x26 source), right-
                  // aligned and shrink-0 inside an overflow-hidden,
                  // flex-1 box: it never scales/distorts, it just gets
                  // cropped from the left (tail first, arrowhead last)
                  // when a step's column is narrower than the asset.
                  <div
                    className="ml-small-medium hidden h-medium-large flex-1 items-center justify-end overflow-hidden md:flex"
                    aria-hidden="true"
                  >
                    <Image
                      src="/icons/steps_arrow.svg"
                      alt=""
                      width={267}
                      height={26}
                      className="h-full w-auto shrink-0"
                    />
                  </div>
                )}
              </div>
              <h4 className="mt-small-medium text-h4 font-semibold text-balance text-foreground">
                {item.title}
              </h4>
              {item.body && (
                <p className="mt-small-medium text-body text-muted-foreground">{item.body}</p>
              )}
            </div>
            {index < items.length - 1 && (
              // Fixed at the mobile circle's own width (size-xl) and
              // left-aligned like it (not centered on the full row), so
              // the line/arrow land directly under the circle instead
              // of under the row's horizontal center.
              <div className="flex w-xl flex-col items-center gap-small md:hidden" aria-hidden="true">
                <div className="h-2xl w-px bg-muted-foreground/40" />
                <ArrowDownOutlined className="text-body text-muted-foreground" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </SectionShell>
  )
}
