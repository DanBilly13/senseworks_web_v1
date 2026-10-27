import { SectionShell } from '@/components/ui/SectionShell'

type FeatureListItem = {
  label: string
  body: string
}
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type BodySize = 'body' | 'h5' | 'h4'
type FeatureListBlockProps = {
  // The right-hand text's size: body copy, or the h5/h4 type size (same
  // weight and grey, just bigger).
  bodySize?: BodySize
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: FeatureListItem[]
}

const BODY_SIZE_CLASS: Record<BodySize, string> = {
  body: 'text-body',
  h5: 'text-h5',
  h4: 'text-h4',
}

export function FeatureListBlock({
  bodySize = 'body',
  spacing = 'loose',
  items = [],
}: FeatureListBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell py={spacing}>
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
                  <p key={pIndex} className={`${BODY_SIZE_CLASS[bodySize] ?? BODY_SIZE_CLASS.body} text-muted-foreground`}>
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
