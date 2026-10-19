'use client'
import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { buttonVariants } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { ReleaseCard } from '@/components/ui/ReleaseCard'
import { groupShippedByMonth, monthLabel, releaseLocale, TAGS, type Release, type ReleaseTag } from '@/lib/releases'

type ReleaseTimelineBlockProps = {
  rollingOutHeading?: string
  rollingOutBody?: string
  shippedHeading?: string
  shippedBody?: string
  developmentHeading?: string
  developmentBody?: string
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // Every Release document (resolved in the page query), newest first.
  releases?: Release[]
}

const LABELS = {
  all: { en: 'All', sv: 'Alla' },
  showEarlier: { en: 'Show earlier releases', sv: 'Visa tidigare släpp' },
  filter: { en: 'Filter releases', sv: 'Filtrera släpp' },
}

// Three across on desktop, two on a tablet, one per row on mobile.
const GRID_CLASS = 'grid grid-cols-1 gap-small md:grid-cols-2 md:gap-large lg:grid-cols-3'

function Section({ heading, body, children }: { heading?: string; body?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-xl">
      <SectionIntro as="h2" styleAs="h3" heading={heading} body={body} maxWidth="md" />
      {children}
    </section>
  )
}

// The Releases page: every release in three stacked sections, the same
// on desktop and mobile — Rolling out (the freshest news), Shipped
// (grouped by month, newest first: the month headings make the pace
// visible; the last six months, then "Show earlier releases"), and In
// development last, so the page leads with what customers can use today.
// The category chips at the top filter all three; an empty section is
// hidden rather than saying "nothing here".
export function ReleaseTimelineBlock({
  rollingOutHeading = 'Rolling out',
  rollingOutBody,
  shippedHeading = 'Shipped',
  shippedBody,
  developmentHeading = 'In development',
  developmentBody,
  spacing = 'loose',
  releases = [],
}: ReleaseTimelineBlockProps) {
  const locale = releaseLocale(usePathname())
  const [filter, setFilter] = useState<ReleaseTag | 'all'>('all')
  const [showEarlier, setShowEarlier] = useState(false)

  // D7: a block with no content simply doesn't render.
  if (!releases.length) return null

  // Only the categories some release actually has get a chip.
  const tags = (Object.keys(TAGS) as ReleaseTag[]).filter((tag) => releases.some((release) => release.tag === tag))
  const filtered = filter === 'all' ? releases : releases.filter((release) => release.tag === filter)
  const rollingOut = filtered.filter((release) => release.stage === 'rollingOut')
  const development = filtered.filter((release) => release.stage === 'development')
  const { recent, earlier } = groupShippedByMonth(
    filtered.filter((release) => (release.stage ?? 'shipped') === 'shipped'),
    new Date(),
  )
  const months = showEarlier ? [...recent, ...earlier] : recent

  const cards = (items: Release[]) => (
    <div className={GRID_CLASS}>
      {items.map((release, index) => (
        <ReleaseCard key={release._id ?? index} release={release} locale={locale} />
      ))}
    </div>
  )

  return (
    <SectionShell px="boxed" py={spacing} className="flex flex-col gap-2xl">
      {tags.length > 1 && (
        <div role="group" aria-label={LABELS.filter[locale]} className="flex flex-wrap gap-small">
          <Tag as="button" active={filter === 'all'} onClick={() => setFilter('all')}>
            {LABELS.all[locale]}
          </Tag>
          {tags.map((tag) => (
            <Tag key={tag} as="button" active={filter === tag} onClick={() => setFilter(tag)}>
              {TAGS[tag].label[locale]}
            </Tag>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3xl">
        {rollingOut.length > 0 && (
          <Section heading={rollingOutHeading} body={rollingOutBody}>
            {cards(rollingOut)}
          </Section>
        )}
        {(recent.length > 0 || earlier.length > 0) && (
          <Section heading={shippedHeading} body={shippedBody}>
            <div className="flex flex-col gap-xl">
              {months.map((month) => (
                <div key={month.key} className="flex flex-col gap-medium-large">
                  <h3 className="text-h5 font-bold text-foreground">{monthLabel(month.key, locale)}</h3>
                  {cards(month.releases)}
                </div>
              ))}
              {earlier.length > 0 && !showEarlier && (
                <div>
                  {/* Button's own component is for links; this one acts. */}
                  <button type="button" className={buttonVariants({ variant: 'ghost' })} onClick={() => setShowEarlier(true)}>
                    {LABELS.showEarlier[locale]}
                  </button>
                </div>
              )}
            </div>
          </Section>
        )}
        {development.length > 0 && (
          <Section heading={developmentHeading} body={developmentBody}>
            {cards(development)}
          </Section>
        )}
      </div>
    </SectionShell>
  )
}
