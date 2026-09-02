'use client'
import { CheckCircleOutlined } from '@ant-design/icons'

type FeatureGridItem = { title: string; description?: string }
type FeatureGridBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  items?: FeatureGridItem[]
}

export function FeatureGridBlock({ eyebrow, heading, body, items = [] }: FeatureGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <section className="py-3xl">
      <div className="mx-auto flex w-full max-w-page flex-col gap-2xl px-medium-large">
        <div className="mx-auto flex w-full max-w-prose-sm flex-col items-center gap-medium text-center">
          {eyebrow && (
            <p className="text-caption font-semibold text-muted-foreground uppercase">{eyebrow}</p>
          )}
          <h2 className="text-h2 font-semibold text-foreground">{heading}</h2>
          {body && <p className="text-body-lg text-muted-foreground">{body}</p>}
        </div>
        <div className="grid grid-cols-1 gap-2xl sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-small-medium">
              <div
                className="flex size-xl items-center justify-center rounded-md bg-muted text-h4 text-muted-foreground"
                aria-hidden="true"
              >
                <CheckCircleOutlined />
              </div>
              <h3 className="text-h4 font-semibold text-foreground">{item.title}</h3>
              {item.description && (
                <p className="text-body text-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
