'use client'
import { UserOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type TestimonialLargeBlockProps = {
  quote: string
  authorName: string
  authorRole?: string
  media?: MediaField
  // The accent gradient (fading to the light grey, dark text) or the
  // dark accent gradient (fading to black, white text).
  tone?: 'accent' | 'accentDark'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function TestimonialLargeBlock({
  quote,
  authorName,
  authorRole,
  media,
  tone = 'accent',
  spacing = 'loose',
}: TestimonialLargeBlockProps) {
  const dark = tone === 'accentDark'
  return (
    // px="boxed" (8px) since this is a boxed panel, same as Dark
    // Banner/50-50 Banner/Feature Split — Dark: its own p-medium-large
    // (24px on mobile) then lands the quote at the same 32px-from-edge
    // line as everywhere else, instead of the default 32px page margin
    // stacking with the card's own padding to 56px.
    <SectionShell px="boxed" py={spacing}>
      {/* border-border (light grey) — without it, the gradient's own
          end-stop grey now matches the page background exactly (see
          --color-surface), so the card's edge was disappearing into
          the page behind it. The dark one stands off the page on its own. */}
      <div
        className={`flex flex-col gap-2xl rounded-lg p-medium-large md:p-2xl ${
          dark ? 'bg-accent-gradient-dark' : 'bg-accent-gradient border border-border'
        }`}
      >
        <p className={`text-h4 text-balance ${dark ? 'text-background' : 'text-foreground'}`}>&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-medium">
          <Media
            media={media}
            alt={authorName}
            className={`size-2xl shrink-0 rounded-full ${dark ? 'text-background/70' : 'text-muted-foreground'}`}
            fallback={<UserOutlined />}
          />
          <div className="flex flex-col">
            <span className={`text-body-sm font-semibold ${dark ? 'text-background' : 'text-foreground'}`}>{authorName}</span>
            {authorRole && (
              <span className={`text-caption ${dark ? 'text-background/70' : 'text-muted-foreground'}`}>{authorRole}</span>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
