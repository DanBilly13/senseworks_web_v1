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
}

export function PricingBlock({ eyebrow, heading, body, plans = [] }: PricingBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!plans.length) return null

  return (
    <SectionShell className="flex flex-col gap-2xl">
      <SectionIntro as="h2" eyebrow={eyebrow} heading={heading} body={body} maxWidth="md" />
      <div className="grid grid-cols-1 gap-large md:grid-cols-2">
        {plans.map((plan, index) => {
          const featured = !!plan.featured
          return (
            <div
              key={index}
              className={
                featured
                  ? 'flex flex-col gap-medium-large rounded-lg bg-foreground p-large text-background'
                  : 'flex flex-col gap-medium-large rounded-lg border border-border bg-background p-large'
              }
            >
              <div className="flex flex-col gap-small">
                <h3 className="text-h3 font-semibold">{plan.name}</h3>
                {plan.description && (
                  <p
                    className={
                      featured ? 'text-body text-background/70' : 'text-body text-muted-foreground'
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
                  <Button href={plan.ctaHref} variant={featured ? 'inverse' : 'primary'}>
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
