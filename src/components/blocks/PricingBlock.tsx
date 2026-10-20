'use client'
import { usePathname } from 'next/navigation'
import { CheckOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { Tag } from '@/components/ui/Tag'
import { TAGS, releaseLocale } from '@/lib/releases'

type PricingPlan = {
  // Optional product chip, colored like Release cards' (Audit purple,
  // Analytics green).
  tag?: 'audit' | 'analysis'
  name: string
  description?: string
  price?: string
  pricePeriod?: string
  priceNote?: string
  features?: string[]
  ctaLabel?: string
  ctaHref?: string
  featured?: boolean
}
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it (whose Anchor is "pricing" on Home, so the
// menu's Pricing link lands on the heading, not below it).
type PricingBlockProps = {
  plans?: PricingPlan[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function PricingBlock({
  plans = [],
  spacing = 'loose',
}: PricingBlockProps) {
  const locale = releaseLocale(usePathname())

  // D7: a block with no content simply doesn't render.
  if (!plans.length) return null

  return (
    <SectionShell px="boxed" py={spacing}>
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
                {plan.tag && (
                  <div className="mb-small">
                    <Tag color={TAGS[plan.tag].color}>{TAGS[plan.tag].label[locale]}</Tag>
                  </div>
                )}
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
              {plan.price && (
                <div className="flex flex-col gap-xs">
                  <p className="flex flex-wrap items-baseline gap-x-small">
                    <span className="text-h2 font-bold">{plan.price}</span>
                    {plan.pricePeriod && (
                      <span className={featured ? 'text-body text-background/70' : 'text-body text-muted-foreground'}>
                        {plan.pricePeriod}
                      </span>
                    )}
                  </p>
                  {plan.priceNote && (
                    <p className={featured ? 'text-body-sm text-background/70' : 'text-body-sm text-muted-foreground'}>
                      {plan.priceNote}
                    </p>
                  )}
                </div>
              )}
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
