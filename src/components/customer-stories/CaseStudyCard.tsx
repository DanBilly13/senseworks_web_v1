import type { Ref } from 'react'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

export type CaseStudyCardData = {
  companyName: string
  // Short facts line under the name (size, offices, what they switched
  // from) and which Senseworks products they use.
  facts?: string
  products?: string
  quote?: string
  personName?: string
  personRole?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
}
export type CaseStudyCardTone = 'default' | 'dark' | 'accent'

// Same three looks as Card Grid. dark: black card, light text. accent:
// accent-colored card, plain dark text (accent-foreground resolves to
// the foreground color).
const TONE_CARD_CLASS: Record<CaseStudyCardTone, string> = {
  default: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
  accent: 'bg-accent text-foreground',
}
const TONE_MUTED_CLASS: Record<CaseStudyCardTone, string> = {
  default: 'text-muted-foreground',
  dark: 'text-background/70',
  accent: 'text-foreground/70',
}

// One customer case study card — shared by the Case Study Carousel
// block and the Customer stories start page, so both read the same.
// `className` sets its width (fixed in the carousel, the grid column on
// the start page).
export function CaseStudyCard({
  item,
  tone = 'default',
  className,
  ref,
}: {
  item: CaseStudyCardData
  tone?: CaseStudyCardTone
  className?: string
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      className={[
        'flex flex-col gap-medium-large rounded-lg p-medium-large md:p-large',
        TONE_CARD_CLASS[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {item.media?.mediaType ? (
        <Media media={item.media} alt={`${item.companyName} logo`} className="h-xl w-3xl rounded-md" fit="contain" />
      ) : (
        <h3 className="text-h4 font-bold">{item.companyName}</h3>
      )}
      {(item.facts || item.products) && (
        <div className="flex flex-col gap-small">
          {item.facts && <p className={`text-body-sm ${TONE_MUTED_CLASS[tone]}`}>{item.facts}</p>}
          {item.products && <p className="text-body-sm font-semibold">{item.products}</p>}
        </div>
      )}
      <div className="flex flex-col gap-small-medium">
        {item.quote && <p className="text-body">&ldquo;{item.quote}&rdquo;</p>}
        {(item.personName || item.personRole) && (
          <div className="flex flex-col">
            {item.personName && <span className="text-body-sm font-semibold">{item.personName}</span>}
            {item.personRole && <span className={`text-caption ${TONE_MUTED_CLASS[tone]}`}>{item.personRole}</span>}
          </div>
        )}
      </div>
      {item.ctaLabel && item.ctaHref && (
        <a
          href={item.ctaHref}
          // On a dark card the link takes the page's accent color
          // (yellow, Audit purple, Analytics green).
          className={`mt-auto text-body-sm font-medium underline underline-offset-4 ${tone === 'dark' ? 'text-accent' : ''}`}
        >
          {item.ctaLabel} →
        </a>
      )}
    </div>
  )
}
