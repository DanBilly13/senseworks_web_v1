type StatItem = { value: string; label: string }
type StatsBandBlockProps = {
  eyebrow?: string
  heading?: string
  items?: StatItem[]
}

export function StatsBandBlock({ eyebrow, heading, items = [] }: StatsBandBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <section className="border-y border-border bg-muted py-3xl">
      <div className="mx-auto flex w-full max-w-page flex-col gap-2xl px-medium-large">
        {(eyebrow || heading) && (
          <div className="flex flex-col items-center gap-medium text-center">
            {eyebrow && (
              <p className="text-caption font-semibold text-muted-foreground uppercase">
                {eyebrow}
              </p>
            )}
            {heading && <h2 className="text-h2 font-semibold text-foreground">{heading}</h2>}
          </div>
        )}
        <div className="grid grid-cols-1 gap-large sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-small px-medium-large text-center"
            >
              <span className="text-h1 font-semibold text-foreground">{item.value}</span>
              <span className="text-body text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
