import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type CaseStudyItem = {
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
type CardTone = 'default' | 'dark' | 'accent'
type CaseStudyGridBlockProps = {
  // The section title lives in its own Section Headline block above —
  // this block is just the grid.
  tone?: CardTone
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: CaseStudyItem[]
}

// Same three looks as Card Grid. dark: black card, light text. accent:
// accent-colored card, plain dark text (accent-foreground resolves to
// the foreground color).
const TONE_CARD_CLASS: Record<CardTone, string> = {
  default: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
  accent: 'bg-accent text-foreground',
}
const TONE_MUTED_CLASS: Record<CardTone, string> = {
  default: 'text-muted-foreground',
  dark: 'text-background/70',
  accent: 'text-foreground/70',
}

export function CaseStudyGridBlock({
  tone = 'default',
  spacing = 'loose',
  items = [],
}: CaseStudyGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell px="boxed" py={spacing}>
      {/* Same 8+24=32px-from-edge mobile rhythm as Card Grid — see its
          own comment. Desktop unchanged. */}
      <div className="grid grid-cols-1 gap-small sm:grid-cols-2 md:gap-large lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-medium-large rounded-lg p-medium-large md:p-large ${TONE_CARD_CLASS[tone]}`}
          >
            {item.media?.mediaType ? (
              <Media
                media={item.media}
                alt={`${item.companyName} logo`}
                className="h-xl w-3xl rounded-md"
                fit="contain"
              />
            ) : (
              <h3 className="text-h4 font-bold">{item.companyName}</h3>
            )}
            {(item.facts || item.products) && (
              <div className="flex flex-col gap-small">
                {item.facts && <p className={`text-body-sm ${TONE_MUTED_CLASS[tone]}`}>{item.facts}</p>}
                {item.products && (
                  <p className="text-body-sm font-semibold">{item.products}</p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-small-medium">
              {item.quote && <p className="text-body">&ldquo;{item.quote}&rdquo;</p>}
              {(item.personName || item.personRole) && (
                <div className="flex flex-col">
                  {item.personName && (
                    <span className="text-body-sm font-semibold">
                      {item.personName}
                    </span>
                  )}
                  {item.personRole && (
                    <span className={`text-caption ${TONE_MUTED_CLASS[tone]}`}>{item.personRole}</span>
                  )}
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
        ))}
      </div>
    </SectionShell>
  )
}
