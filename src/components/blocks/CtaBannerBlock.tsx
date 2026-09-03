import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type CtaBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  tone?: 'default' | 'inverse'
}

export function CtaBannerBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  tone = 'inverse',
}: CtaBannerBlockProps) {
  return (
    <SectionShell
      sectionClassName={tone === 'inverse' ? 'bg-foreground' : 'bg-muted'}
      className="flex justify-center"
    >
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="sm"
        tone={tone}
        cta={
          <div className="flex flex-wrap items-center justify-center gap-medium-large">
            <Button href={ctaHref} variant={tone === 'inverse' ? 'inverse' : 'primary'}>
              {ctaLabel}
            </Button>
            {secondaryCtaLabel && secondaryCtaHref && (
              <a
                href={secondaryCtaHref}
                className={
                  tone === 'inverse'
                    ? 'text-body-sm font-medium text-background underline underline-offset-4'
                    : 'text-body-sm font-medium text-foreground underline underline-offset-4'
                }
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        }
      />
    </SectionShell>
  )
}
