import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type CaseStudyItem = {
  companyName: string
  quote?: string
  personName?: string
  personRole?: string
  ctaLabel?: string
  ctaHref?: string
}
type CaseStudyGridBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  items?: CaseStudyItem[]
}

export function CaseStudyGridBlock({
  eyebrow,
  heading,
  body,
  items = [],
}: CaseStudyGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell className="flex flex-col gap-2xl">
      <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
      <div className="grid grid-cols-1 gap-large sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-medium-large rounded-lg border border-border bg-background p-large"
          >
            <div
              className="h-xl w-3xl rounded-md bg-muted"
              role="img"
              aria-label={`${item.companyName} logo`}
            />
            <div className="flex flex-col gap-small-medium">
              {item.quote && <p className="text-body text-foreground">&ldquo;{item.quote}&rdquo;</p>}
              {(item.personName || item.personRole) && (
                <div className="flex flex-col">
                  {item.personName && (
                    <span className="text-body-sm font-semibold text-foreground">
                      {item.personName}
                    </span>
                  )}
                  {item.personRole && (
                    <span className="text-caption text-muted-foreground">{item.personRole}</span>
                  )}
                </div>
              )}
            </div>
            {item.ctaLabel && item.ctaHref && (
              <a
                href={item.ctaHref}
                className="mt-auto text-body-sm font-medium text-foreground underline underline-offset-4"
              >
                {item.ctaLabel} →
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
