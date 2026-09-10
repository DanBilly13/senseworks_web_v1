'use client'
import { Fragment } from 'react'
import Image from 'next/image'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'

type FeatureGridIcon =
  | 'home_work'
  | 'event_busy'
  | 'lock'
  | 'work'
  | 'bolt_boost'
  | 'support_agent'
  | 'toggle_off'

// A curated exception to D16 (Ant Design icons everywhere else) — a
// small set of Material Symbols SVGs in public/icons/, for when an
// editor wants a specific pictogram rather than the generic checkmark
// default. Add new entries here (and to the schema's options list) as
// more get sourced; don't wire up an arbitrary icon-upload field.
const ICON_SRC: Record<FeatureGridIcon, string> = {
  home_work: '/icons/home_work.svg',
  event_busy: '/icons/event_busy.svg',
  lock: '/icons/lock.svg',
  work: '/icons/work.svg',
  bolt_boost: '/icons/bolt_boost.svg',
  support_agent: '/icons/support_agent.svg',
  toggle_off: '/icons/toggle_off.svg',
}

type FeatureGridItem = {
  icon?: FeatureGridIcon
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}
type FeatureGridBlockProps = {
  columns?: '2' | '3'
  items?: FeatureGridItem[]
}

// Tablet stays a fixed 2-column layout regardless of this choice —
// only the desktop (lg) breakpoint's column count is configurable,
// e.g. so a 4-item grid can land as a clean 2x2 instead of 3-then-1.
const LG_COLS_CLASS: Record<'2' | '3', string> = {
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function FeatureGridBlock({ columns = '3', items = [] }: FeatureGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell>
      <div className={`grid grid-cols-1 gap-2xl sm:grid-cols-2 ${LG_COLS_CLASS[columns]}`}>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-small-medium">
            {/* No chip background/radius — just the icon itself, sized
                up from 32px on mobile to the source SVGs' native 48px
                on desktop. Both icon types fill the same box via
                size-full so a default checkmark and a custom SVG line
                up identically regardless of which an item uses. */}
            <div
              className="flex size-large items-center justify-center text-muted-foreground md:size-xl"
              aria-hidden="true"
            >
              {item.icon ? (
                <Image
                  src={ICON_SRC[item.icon]}
                  alt=""
                  width={48}
                  height={48}
                  className="size-full"
                />
              ) : (
                // AntD icons pass className to the <span> wrapper, not
                // the inner <svg> — which sizes via its own
                // width/height="1em" attribute regardless of the
                // span's size. The span itself also has no size of
                // its own (it's flex-item content-sized, i.e. sized
                // by that same 1em svg — circular), so both levels
                // need size-full: the span against this definite box,
                // then the svg against the now-definite span.
                <CheckCircleOutlined className="size-full [&>svg]:size-full" />
              )}
            </div>
            {/* Doubles the icon-to-title gap (12px container gap +
                this) from 12px to 24px, same technique as the
                title-to-description doubling just below. */}
            <h4 className="mt-small-medium text-h4 font-semibold text-balance text-foreground">
              {/* Plain-text field, so a manual line break only
                  survives as a literal "\n" in the source — HTML
                  collapses those by default, same reasoning as
                  FeatureListBlock's body paragraph splitting. */}
              {item.title.split('\n').map((line, i, lines) => (
                <Fragment key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </Fragment>
              ))}
            </h4>
            {item.description && (
              // Doubles the title-to-description gap (12px container
              // gap + this) from 12px to 24px, matching the section
              // heading-to-body doubling in SectionIntro.
              <p className="mt-small-medium text-body text-muted-foreground">
                {item.description}
              </p>
            )}
            {item.ctaLabel && item.ctaHref && (
              <a
                href={item.ctaHref}
                className="mt-auto text-body-sm font-medium text-foreground underline underline-offset-4"
              >
                {item.ctaLabel} →
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
