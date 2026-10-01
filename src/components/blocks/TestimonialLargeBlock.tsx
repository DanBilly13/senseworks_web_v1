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
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function TestimonialLargeBlock({
  quote,
  authorName,
  authorRole,
  media,
  spacing = 'loose',
}: TestimonialLargeBlockProps) {
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
          the page behind it. */}
      <div className="bg-accent-gradient flex flex-col gap-2xl rounded-lg border border-border p-medium-large md:p-2xl">
        <p className="text-h4 text-balance text-foreground">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-medium">
          <Media
            media={media}
            alt={authorName}
            className="size-2xl shrink-0 rounded-full text-muted-foreground"
            fallback={<UserOutlined />}
          />
          <div className="flex flex-col">
            <span className="text-body-sm font-semibold text-foreground">{authorName}</span>
            {authorRole && <span className="text-caption text-muted-foreground">{authorRole}</span>}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
