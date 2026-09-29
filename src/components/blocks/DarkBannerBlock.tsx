'use client'
import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'

type DarkBannerItem = {
  icon?: SanityImageSource
  title: string
  description?: string
}
type DarkBannerTone = 'dark' | 'accent' | 'white'
type DarkBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  tone?: DarkBannerTone
  // Optional — sits behind the left column's text (a transparent PNG
  // is the intended use, so the panel's own background shows through
  // it), filling that column edge-to-edge rather than inset within
  // the panel's own padding like the text above it.
  leftImage?: SanityImageSource
  showIcons?: boolean
  items?: DarkBannerItem[]
}

// Panel background per tone — 'dark' keeps the original bg-foreground
// panel; 'accent'/'white' are both light panels with dark text, so
// they share every color decision below except the fill itself.
const PANEL_BG_CLASS: Record<DarkBannerTone, string> = {
  dark: 'bg-foreground',
  accent: 'bg-accent',
  white: 'bg-background',
}

// Icon color follows the panel style, not the default checkmark's own
// muted tone — accent on the dark panel (it's the one splash of color
// against black), dark foreground on the light panels (mirrors their
// heading color). Used both for the default AntD checkmark (text-*,
// relies on currentColor) and as a background-color for the masked
// custom-SVG icon below (mask techniques can't use currentColor).
const ICON_COLOR_CLASS: Record<DarkBannerTone, string> = {
  dark: 'text-accent',
  accent: 'text-foreground',
  white: 'text-foreground',
}
const ICON_MASK_BG_CLASS: Record<DarkBannerTone, string> = {
  dark: 'bg-accent',
  accent: 'bg-foreground',
  white: 'bg-foreground',
}

export function DarkBannerBlock({
  eyebrow,
  heading,
  body,
  tone = 'dark',
  leftImage,
  showIcons = true,
  items = [],
}: DarkBannerBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const isDark = tone === 'dark'

  return (
    // SectionShell's own page margin already keeps this off the
    // viewport edge — same "contained rounded panel" treatment as
    // Feature Split — Dark and Media, not a full-bleed background.
    // px="boxed" (8px) since this panel IS a box — its own horizontal
    // padding (px-medium-large, 24px on mobile) lands its text on the
    // same 32px-from-edge line as everywhere else. Vertical padding is
    // its own 32px on mobile (deliberately not the same token as the
    // horizontal 24px). Desktop's p-2xl (64px, all sides) is unchanged.
    <SectionShell px="boxed">
      {/* overflow-hidden clips leftImage (below) to these rounded
          corners. Padding used to live on this shared grid container —
          now it's split per column (see each column's own className)
          so the left column can go edge-to-edge for its background
          image while the right column keeps the exact same padding it
          always had. Each column only pads its OWN outer edges: the
          boundary between them (left column's right side / right
          column's left side on desktop, or the row gap on mobile) gets
          none, since gap-medium-large/gap-2xl already spaces that. */}
      <div
        className={`grid grid-cols-1 gap-medium-large overflow-hidden rounded-lg ${PANEL_BG_CLASS[tone]} md:grid-cols-2 md:items-stretch md:gap-2xl`}
      >
        <div className="relative pt-large px-medium-large md:p-2xl md:pr-0">
          {leftImage && (
            <Image
              src={urlFor(leftImage).url()}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
          <div className="relative z-10">
            <SectionIntro
              as="h2"
              eyebrow={eyebrow}
              heading={heading}
              body={body}
              tone={isDark ? 'inverse' : 'default'}
            />
          </div>
        </div>
        <div className="flex flex-col gap-large pb-large px-medium-large md:p-2xl md:pl-0">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-small-medium">
              {showIcons &&
                (item.icon ? (
                  // Custom-uploaded SVG, recolored via CSS mask so it
                  // follows the tone the same way the default checkmark
                  // does via currentColor — a mask uses the image only
                  // as an alpha shape, so the uploaded SVG's own fill
                  // colors don't matter.
                  <span
                    aria-hidden="true"
                    className={`size-medium-large shrink-0 md:size-large ${ICON_MASK_BG_CLASS[tone]}`}
                    style={{
                      maskImage: `url(${urlFor(item.icon).url()})`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskImage: `url(${urlFor(item.icon).url()})`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: 'contain',
                    }}
                  />
                ) : (
                  // Wrapped in a plain div rather than putting color/
                  // size classes on the AntD icon itself — Ant Design's
                  // .anticon base CSS (color: inherit, among other
                  // things) is injected after Tailwind's stylesheet, so
                  // at equal specificity it silently wins over a
                  // text-accent/text-foreground class applied directly
                  // to the icon (same root cause as the Steps block's
                  // `hidden` conflict). A wrapping element with no
                  // .anticon class sidesteps it, same as Feature Grid's
                  // default-checkmark treatment.
                  <div
                    className={`flex size-medium-large shrink-0 items-center justify-center md:size-large ${ICON_COLOR_CLASS[tone]}`}
                    aria-hidden="true"
                  >
                    <CheckCircleOutlined className="size-full [&>svg]:size-full" />
                  </div>
                ))}
              <h4
                className={`text-h4 font-semibold text-balance ${showIcons ? 'mt-small-medium' : ''} ${isDark ? 'text-background' : 'text-foreground'}`}
              >
                {item.title}
              </h4>
              {item.description && (
                <p
                  className={`mt-small-medium text-body ${isDark ? 'text-background/70' : 'text-muted-foreground'}`}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
