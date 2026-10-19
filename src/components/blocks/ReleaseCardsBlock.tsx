'use client'
import { CalendarOutlined, CheckCircleFilled, UserOutlined } from '@ant-design/icons'
import type { SanityImageSource } from '@sanity/image-url'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import type { MediaField } from '@/lib/sanity/media'

type ReleaseTag = 'audit' | 'analysis' | 'customerService'

type Stage = 'development' | 'rollingOut' | 'shipped'

// The three steps of the bar, in order, with their labels per language.
const STAGES: { id: Stage; label: Record<'en' | 'sv', string> }[] = [
  { id: 'development', label: { en: 'In development', sv: 'Under utveckling' } },
  { id: 'rollingOut', label: { en: 'Rolling out', sv: 'Rullas ut' } },
  { id: 'shipped', label: { en: 'Shipped', sv: 'Lanserad' } },
]

type TeamMember = { name?: string; photo?: SanityImageSource }

type ReleaseCard = {
  tag?: ReleaseTag
  title: string
  description?: string
  media?: MediaField
  stage?: Stage
  date?: string
  // Up to 6 people who worked on it, shown as overlapping round photos.
  team?: TeamMember[]
}

type ReleaseCardsBlockProps = {
  columns?: '2' | '3' | '4'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  cards?: ReleaseCard[]
}

// Audit and Analytics take the same colors as their page themes (purple,
// green); Support takes yellow. The stored values (analysis,
// customerService) are the original names, kept so existing cards
// don't need re-saving; only the labels changed.
const TAG: Record<ReleaseTag, { label: string; color: 'purple' | 'green' | 'yellow' }> = {
  audit: { label: 'Audit', color: 'purple' },
  analysis: { label: 'Analytics', color: 'green' },
  customerService: { label: 'Support', color: 'yellow' },
}

const COLS_CLASS: Record<'2' | '3' | '4', string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

const MAX_TEAM = 6

// Project-management-style cards for what's been released: a colored
// category chip, title, text, an optional image, a three-step stage bar
// (In development → Rolling out → Shipped — a stage, never a percentage,
// so nothing reads as a promised date), and the date. No intro of its own — pair it
// with a Section Headline block above.
export function ReleaseCardsBlock({
  columns = '2',
  spacing = 'loose',
  cards = [],
}: ReleaseCardsBlockProps) {
  // Every route lives under a locale segment, so the first path segment
  // is "en"/"sv" — the stage names follow the page's language.
  const locale = usePathname().split('/')[1] === 'sv' ? 'sv' : 'en'

  // D7: a block with no content simply doesn't render.
  if (!cards.length) return null

  return (
    <SectionShell px="boxed" py={spacing}>
      <div className={`grid grid-cols-1 gap-small md:gap-large ${COLS_CLASS[columns]}`}>
        {cards.map((card, index) => {
          const tag = card.tag ? TAG[card.tag] : undefined
          const stageIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === (card.stage ?? 'shipped')))
          const stage = STAGES[stageIndex]
          const shipped = stage.id === 'shipped'
          return (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-border bg-background"
            >
              <div className="flex flex-1 flex-col gap-medium-large p-medium-large md:p-large">
                {(tag || card.team?.length) && (
                  <div className="flex items-center justify-between gap-medium">
                    {tag ? <Tag color={tag.color}>{tag.label}</Tag> : <span />}
                    {card.team && card.team.length > 0 && (
                      // 32px round photos, each overlapping the one before
                      // by 4px. The ring in the card's own color keeps the
                      // edges apart where they overlap.
                      <ul className="flex items-center" aria-label="Team">
                        {card.team.slice(0, MAX_TEAM).map((person, i) => (
                          <li
                            key={i}
                            className={`size-large shrink-0 rounded-full ring-2 ring-background ${i > 0 ? '-ml-xs' : ''}`}
                          >
                            <Media
                              media={person.photo ? { mediaType: 'image', image: person.photo } : undefined}
                              alt={person.name ?? ''}
                              className="size-full rounded-full text-muted-foreground"
                              fallback={<UserOutlined />}
                              background="none"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-medium-large">
                  <h3 className="text-h5 font-bold text-balance text-foreground">{card.title}</h3>
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
                  <span className="flex items-center gap-small text-body-sm font-medium text-foreground">
                    {shipped && <CheckCircleFilled aria-hidden="true" />}
                    {stage.label[locale]}
                  </span>
                  {/* Three equal segments, filled up to the current stage. */}
                  <div
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={STAGES.length}
                    aria-valuenow={stageIndex + 1}
                    aria-valuetext={stage.label[locale]}
                    aria-label={card.title}
                    className="grid w-full grid-cols-3 gap-xs"
                  >
                    {STAGES.map((step, i) => (
                      <div key={step.id} className={`h-small rounded-full ${i <= stageIndex ? 'bg-foreground' : 'bg-muted'}`} />
                    ))}
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
