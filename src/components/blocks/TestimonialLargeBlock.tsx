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
}

export function TestimonialLargeBlock({
  quote,
  authorName,
  authorRole,
  media,
}: TestimonialLargeBlockProps) {
  return (
    <SectionShell>
      <div className="bg-accent-gradient flex flex-col gap-2xl rounded-lg p-medium md:p-2xl">
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
