'use client'
import { Fragment } from 'react'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { ItemHeading } from '@/components/ui/ItemHeading'
import { UploadedIcon } from '@/components/ui/UploadedIcon'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'

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
  // An uploaded icon wins over the curated `icon` below, which stays
  // so content set up before uploads existed keeps rendering.
  iconImage?: SanityImageSource
  icon?: FeatureGridIcon
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}
type IconSize = 'large' | 'small'
// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type FeatureGridBlockProps = BandProps & {
  columns?: '2' | '3' | '4'
  iconSize?: IconSize
  headingLayout?: 'stacked' | 'inline'
  // Where an item's link sits: its own line under the text, or as a
  // text link closing out the description itself.
  linkStyle?: 'below' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  items?: FeatureGridItem[]
}

// Shared "Large"/"Small" content-icon sizes — 56px at every size for
// Large (size-icon-lg, its dedicated token; was 64px on desktop until
// Dan asked for 56 throughout), 32/24 desktop/mobile for Small
// (both already-existing spacing rungs, same pair Dark Banner's icons
// use). Same two options as Dark Banner's own iconSize prop below.
const ICON_BOX_CLASS: Record<IconSize, string> = {
  large: 'size-icon-lg',
  small: 'size-medium-large md:size-large',
}

// Tablet stays a fixed 2-column layout regardless of this choice —
// only the desktop (lg) breakpoint's column count is configurable,
// e.g. so a 4-item grid can land as a clean 2x2, or a straight row of
// 4, instead of 3-then-1.
const LG_COLS_CLASS: Record<'2' | '3' | '4', string> = {
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function FeatureGridBlock({
  columns = '3',
  iconSize = 'large',
  headingLayout = 'stacked',
  linkStyle = 'below',
  titleSize = 'h4',
  items = [],
  tone = 'none',
  ...band
}: FeatureGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  // On Dark and the dark accent gradient: white text, light icons, and
  // the links in the accent color (as on every dark background).
  const dark = tone === 'inverse' || tone === 'accentDark'
  const linkColor = dark ? 'text-accent' : 'text-foreground'

  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className={`grid grid-cols-1 gap-2xl sm:grid-cols-2 ${LG_COLS_CLASS[columns]}`}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-small-medium">
              {/* No chip background/radius — just the icon itself. Both
                  icon types fill the same box via size-full so a default
                  checkmark and a custom SVG line up identically
                  regardless of which an item uses. */}
              <div
                className={`flex items-center justify-center ${dark ? 'text-background/70' : 'text-muted-foreground'} ${ICON_BOX_CLASS[iconSize]}`}
                aria-hidden="true"
              >
                {item.iconImage ? (
                  // Uploaded icon: black and white follow the card, its
                  // accent follows the page theme (see UploadedIcon).
                  <UploadedIcon
                    source={item.iconImage}
                    surface={dark ? 'dark' : tone === 'accent' ? 'accent' : 'light'}
                    className="size-full"
                  />
                ) : item.icon ? (
                  <Image
                    src={ICON_SRC[item.icon]}
                    alt=""
                    width={64}
                    height={64}
                    // The curated SVGs are drawn in our black: white on dark.
                    className={`size-full ${dark ? 'brightness-0 invert' : ''}`}
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
                  this) from 12px to 24px. Title-to-description below is
                  its own separate value (16px, gap="medium") — not tied
                  to this icon gap at all. */}
              <ItemHeading
                as={titleSize}
                title={
                  // Plain-text field, so a manual line break only
                  // survives as a literal "\n" in the source — HTML
                  // collapses those by default, same reasoning as
                  // FeatureListBlock's body paragraph splitting.
                  item.title.split('\n').map((line, i, lines) => (
                    <Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <br />}
                    </Fragment>
                  ))
                }
                description={
                  linkStyle === 'inline' && item.description && item.ctaLabel && item.ctaHref ? (
                    <>
                      {item.description}{' '}
                      <a
                        href={item.ctaHref}
                        className={`whitespace-nowrap underline underline-offset-4 ${linkColor}`}
                      >
                        {item.ctaLabel} →
                      </a>
                    </>
                  ) : (
                    item.description
                  )
                }
                layout={headingLayout}
                tone={dark ? 'inverse' : 'default'}
                gap="medium"
                className="mt-small-medium"
              />
              {/* Inline links live in the description above; this one is
                  the default, or the fallback for an item with no text. */}
              {item.ctaLabel && item.ctaHref && !(linkStyle === 'inline' && item.description) && (
                <a
                  href={item.ctaHref}
                  className={`mt-auto text-body-sm font-medium underline underline-offset-4 ${linkColor}`}
                >
                  {item.ctaLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </SectionShell>
    </BandFill>
  )
}
