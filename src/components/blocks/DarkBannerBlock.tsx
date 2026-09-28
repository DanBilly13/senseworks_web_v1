'use client'
import type { SanityImageSource } from '@sanity/image-url'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { urlFor } from '@/lib/sanity/image'

type DarkBannerItem = {
  icon?: SanityImageSource
  title: string
  description?: string
}
type DarkBannerTone = 'dark' | 'gradient'
type DarkBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  tone?: DarkBannerTone
  showIcons?: boolean
  items?: DarkBannerItem[]
}

// Panel background per tone — 'dark' keeps the original bg-foreground
// panel, 'gradient' swaps in the shared accent gradient (same one used
// elsewhere, see globals.css --gradient-accent) with dark text instead
// of light.
const PANEL_BG_CLASS: Record<DarkBannerTone, string> = {
  dark: 'bg-foreground',
  gradient: 'bg-accent-gradient',
}

// Icon color follows the panel style, not the default checkmark's own
// muted tone — accent on the dark panel (it's the one splash of color
// against black), dark foreground on the gradient panel (mirrors its
// heading color). Used both for the default AntD checkmark (text-*,
// relies on currentColor) and as a background-color for the masked
// custom-SVG icon below (mask techniques can't use currentColor).
const ICON_COLOR_CLASS: Record<DarkBannerTone, string> = {
  dark: 'text-accent',
  gradient: 'text-foreground',
}
const ICON_MASK_BG_CLASS: Record<DarkBannerTone, string> = {
  dark: 'bg-accent',
  gradient: 'bg-foreground',
}

export function DarkBannerBlock({
  eyebrow,
  heading,
  body,
  tone = 'dark',
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
      <div
        className={`grid grid-cols-1 gap-medium-large rounded-lg ${PANEL_BG_CLASS[tone]} px-medium-large py-large md:grid-cols-2 md:items-start md:gap-2xl md:p-2xl`}
      >
        <SectionIntro
          as="h2"
          eyebrow={eyebrow}
          heading={heading}
          body={body}
          tone={isDark ? 'inverse' : 'default'}
        />
        <div className="flex flex-col gap-large">
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
                className={`mt-small-medium text-h4 font-semibold text-balance ${isDark ? 'text-background' : 'text-foreground'}`}
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
