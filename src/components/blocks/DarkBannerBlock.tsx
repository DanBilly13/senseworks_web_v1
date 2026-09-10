'use client'
import { CheckCircleOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type DarkBannerItem = {
  title: string
  description?: string
}
type DarkBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  items?: DarkBannerItem[]
}

export function DarkBannerBlock({ eyebrow, heading, body, items = [] }: DarkBannerBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    // SectionShell's own page margin already keeps this off the
    // viewport edge — same "contained rounded panel" treatment as
    // Feature Split — Dark and Media, not a full-bleed background.
    <SectionShell>
      <div className="grid grid-cols-1 gap-2xl rounded-lg bg-foreground p-large md:grid-cols-2 md:items-center md:p-2xl">
        <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} tone="inverse" />
        <div className="flex flex-col gap-large">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-small-medium">
              <CheckCircleOutlined className="text-h4 text-background/60" />
              <h4 className="mt-small-medium text-h4 font-semibold text-balance text-background">
                {item.title}
              </h4>
              {item.description && (
                <p className="mt-small-medium text-body text-background/70">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
