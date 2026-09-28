'use client'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type DarkBannerItem = {
  title: string
  description?: string
}
type DarkBannerTone = 'dark' | 'gradient'
type DarkBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  tone?: DarkBannerTone
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

export function DarkBannerBlock({
  eyebrow,
  heading,
  body,
  tone = 'dark',
  items = [],
}: DarkBannerBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const isDark = tone === 'dark'

  return (
    // SectionShell's own page margin already keeps this off the
    // viewport edge — same "contained rounded panel" treatment as
    // Feature Split — Dark and Media, not a full-bleed background.
    // px="boxed" (8px) since this panel IS a box — its own padding
    // (p-medium-large, 24px on mobile) lands its text on the same
    // 32px-from-edge line as everywhere else. Desktop's p-2xl (64px)
    // is unchanged, that padding was already responsive before this.
    <SectionShell px="boxed">
      <div
        className={`grid grid-cols-1 gap-2xl rounded-lg ${PANEL_BG_CLASS[tone]} p-medium-large md:grid-cols-2 md:items-start md:p-2xl`}
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
              <CheckCircleOutlined
                className={`text-h4 ${isDark ? 'text-background/60' : 'text-foreground/60'}`}
              />
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
