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
  tone?: 'default' | 'inverse' | 'accent'
}

const SECTION_BG: Record<NonNullable<CtaBannerBlockProps['tone']>, string> = {
  default: 'bg-muted',
  inverse: 'bg-foreground',
  accent: 'bg-accent',
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
    <SectionShell pad="both" sectionClassName={SECTION_BG[tone]} className="flex justify-center">
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="sm"
        // Accent isn't dark enough to need inverse (light) text — the
        // regular dark text colors already read fine on it, same as
        // on the default muted background.
        tone={tone === 'inverse' ? 'inverse' : 'default'}
        cta={
          <div className="flex flex-wrap items-center justify-center gap-medium-large">
            <Button href={ctaHref} variant={tone === 'inverse' ? 'filled-light' : 'filled-dark'}>
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
