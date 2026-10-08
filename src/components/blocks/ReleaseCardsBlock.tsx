'use client'
import { CalendarOutlined, CheckCircleFilled } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import type { MediaField } from '@/lib/sanity/media'

type ReleaseTag = 'audit' | 'analysis' | 'customerService'

type ReleaseCard = {
  tag?: ReleaseTag
  title: string
  description?: string
  media?: MediaField
  // Where in the product it landed, e.g. "Integrations".
  area?: string
  status?: string
  progress?: number
  date?: string
}

type ReleaseCardsBlockProps = {
  columns?: '2' | '3'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  cards?: ReleaseCard[]
}

// Audit and Analysis take the same colors as their page themes (purple,
// green); Customer Service takes yellow.
const TAG: Record<ReleaseTag, { label: string; color: 'purple' | 'green' | 'yellow'; bar: string }> = {
  audit: { label: 'Audit', color: 'purple', bar: 'bg-tag-purple-bar' },
  analysis: { label: 'Analysis', color: 'green', bar: 'bg-tag-green-bar' },
  customerService: { label: 'Customer Service', color: 'yellow', bar: 'bg-tag-yellow-bar' },
}

const COLS_CLASS: Record<'2' | '3', string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
}

// Project-management-style cards for what's been released: a colored
// category chip, title, text, an optional image, a progress bar (full,
// for something shipped), and the date. No intro of its own — pair it
// with a Section Headline block above.
export function ReleaseCardsBlock({
  columns = '2',
  spacing = 'loose',
  cards = [],
}: ReleaseCardsBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!cards.length) return null

  return (
    <SectionShell px="boxed" py={spacing}>
      <div className={`grid grid-cols-1 gap-small md:gap-large ${COLS_CLASS[columns]}`}>
        {cards.map((card, index) => {
          const tag = card.tag ? TAG[card.tag] : undefined
          const progress = Math.min(100, Math.max(0, card.progress ?? 100))
          const status = card.status ?? 'Shipped'
          return (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-border bg-background"
            >
              <div className="flex flex-1 flex-col gap-medium p-medium-large md:p-large">
                {(tag || card.area) && (
                  <div className="flex items-center justify-between gap-medium">
                    {tag ? (
                      <Tag color={tag.color}>{tag.label}</Tag>
                    ) : (
                      <span />
                    )}
                    {card.area && (
                      <span className="text-caption font-medium tracking-wider text-muted-foreground uppercase">
                        {card.area}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-small">
                  <h3 className="text-h4 font-bold text-balance text-foreground">{card.title}</h3>
                  {card.description && (
                    <p className="text-body text-muted-foreground">{card.description}</p>
                  )}
                </div>
                {card.media && (
                  <Media
                    media={card.media}
                    alt={card.title}
                    className="aspect-media w-full rounded-md border border-border"
                  />
                )}
              </div>
              <div className="flex flex-col gap-medium border-t border-border p-medium-large md:px-large md:py-medium-large">
                <div className="flex flex-col gap-small">
                  <div className="flex items-center justify-between text-body-sm font-medium text-foreground">
                    <span className="flex items-center gap-small">
                      {progress === 100 && <CheckCircleFilled aria-hidden="true" />}
                      {status}
                    </span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-label={`${card.title}: ${status}`}
                    className="h-small w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={`h-full rounded-full ${tag ? tag.bar : 'bg-foreground'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {card.date && (
                  <div className="flex items-center gap-small text-body-sm text-muted-foreground">
                    <CalendarOutlined aria-hidden="true" />
                    <span>{card.date}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
