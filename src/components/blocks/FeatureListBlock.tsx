import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type FeatureListItem = {
  label: string
  body: string
}
type FeatureListBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: FeatureListItem[]
}

export function FeatureListBlock({ eyebrow, heading, body, items = [] }: FeatureListBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell className="flex flex-col gap-2xl">
      <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
      <div className="flex flex-col divide-y divide-border">
        {items.map((item, index) => {
          // Plain-text field, so paragraph breaks only survive as literal
          // "\n"s in the source — HTML collapses those by default, which
          // read as one run-on paragraph even when the copy has several.
          const paragraphs = item.body.split('\n').filter(Boolean)
          return (
            <div
              key={index}
              className="grid grid-cols-1 gap-small-medium py-large first:pt-0 last:pb-0 md:grid-cols-2 md:gap-2xl"
            >
              <h3 className="text-h4 text-balance font-semibold text-foreground md:w-3/4">
                {item.label}
              </h3>
              <div className="flex flex-col gap-medium md:max-w-body">
                {paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-body text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
