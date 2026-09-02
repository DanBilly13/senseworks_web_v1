type LogoCloudItem = { name: string }
type LogoCloudBlockProps = {
  heading?: string
  logos?: LogoCloudItem[]
}

export function LogoCloudBlock({ heading, logos = [] }: LogoCloudBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!logos.length) return null

  return (
    <section className="border-b border-border bg-muted py-large">
      <div className="mx-auto flex w-full max-w-page flex-col items-center gap-medium px-medium-large">
        {heading && (
          <p className="text-caption font-semibold text-muted-foreground uppercase">{heading}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-2xl gap-y-medium">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="h-xl w-3xl rounded-md bg-background"
              role="img"
              aria-label={logo.name}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
