'use client'
import { CheckOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type PricingPlan = {
  name: string
  description?: string
  features?: string[]
  ctaLabel?: string
  ctaHref?: string
  featured?: boolean
}
type PricingBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  plans?: PricingPlan[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function PricingBlock({
  eyebrow,
  heading,
  body,
  plans = [],
  spacing = 'loose',
}: PricingBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!plans.length) return null

  return (
    <SectionShell id="pricing" px="boxed" py={spacing} className="flex flex-col gap-2xl">
      <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
      {/* Same 8+24=32px-from-edge mobile rhythm as Card Grid — see its
          own comment. Desktop unchanged. */}
      <div
        className={[
          'grid grid-cols-1 gap-small md:gap-large',
          plans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
        ].join(' ')}
      >
        {plans.map((plan, index) => {
          const featured = !!plan.featured
          return (
            <div
              key={index}
              className={
                featured
                  ? 'flex flex-col gap-medium-large rounded-lg bg-foreground p-medium-large text-background md:p-large'
                  : 'flex flex-col gap-medium-large rounded-lg border border-border bg-background p-medium-large md:p-large'
              }
            >
              <div className="flex flex-col gap-small">
                <h3 className="text-h3 font-bold text-balance">{plan.name}</h3>
                {plan.description && (
                  <p
                    className={
                      featured
                        ? 'mt-small text-body text-background/70'
                        : 'mt-small text-body text-muted-foreground'
                    }
                  >
                    {plan.description}
                  </p>
                )}
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="flex flex-col gap-small">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-small-medium text-body">
                      <CheckOutlined />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.ctaLabel && plan.ctaHref && (
                <div className="mt-auto">
                  <Button href={plan.ctaHref} variant={featured ? 'filled-accent' : 'filled-dark'}>
                    {plan.ctaLabel}
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
