import { Fragment } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { ItemHeading } from '@/components/ui/ItemHeading'
import { Media } from '@/components/ui/Media'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'
import type { MediaField } from '@/lib/sanity/media'

type ImageGridItem = {
  media?: MediaField
  eyebrow?: string
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type ImageGridBlockProps = BandProps & {
  columns?: '2' | '3' | '4'
  headingLayout?: 'stacked' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  items?: ImageGridItem[]
}

// Tablet is always 2 across; desktop (lg) is the editor's choice.
const LG_COLS_CLASS: Record<'2' | '3' | '4', string> = {
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
}

// Like Card Grid, but each item is a rounded 7:5 image with its text
// underneath, straight on the page — no card around the text, so it
// takes the plain-content edge padding (32px on mobile), not the boxed
// one. No intro of its own: pair it with a Section Headline above.
export function ImageGridBlock({
  columns = '3',
  headingLayout = 'stacked',
  titleSize = 'h4',
  items = [],
  tone = 'none',
  ...band
}: ImageGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  // On Dark and the dark accent gradient: white text, accent eyebrows and
  // links (as on every dark background).
  const dark = tone === 'inverse' || tone === 'accentDark'

  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className={`grid grid-cols-1 gap-x-large gap-y-2xl sm:grid-cols-2 ${LG_COLS_CLASS[columns]}`}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-medium-large">
              <Media media={item.media} alt={item.title} className="aspect-media w-full overflow-hidden rounded-lg" />
              <div className="flex flex-1 flex-col gap-small-medium">
                {item.eyebrow && (
                  <p
                    className={`text-caption font-bold tracking-wider uppercase ${dark ? 'text-accent' : 'text-muted-foreground'}`}
                  >
                    {item.eyebrow}
                  </p>
                )}
                <ItemHeading
                  as={titleSize}
                  // A line break typed in the title is a literal "\n";
                  // HTML would collapse it, so it becomes a real <br>.
                  title={item.title.split('\n').map((line, i, lines) => (
                    <Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <br />}
                    </Fragment>
                  ))}
                  description={item.description}
                  layout={headingLayout}
                  tone={dark ? 'inverse' : 'default'}
                  gap="medium"
                />
                {item.ctaLabel && item.ctaHref && (
                  <a
                    href={item.ctaHref}
                    className={`mt-auto pt-small text-body-sm font-medium underline underline-offset-4 ${dark ? 'text-accent' : 'text-foreground'}`}
                  >
                    {item.ctaLabel} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </BandFill>
  )
}
