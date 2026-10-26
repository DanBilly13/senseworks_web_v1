'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { ReleaseCard } from '@/components/ui/ReleaseCard'
import { releaseLocale, type Release } from '@/lib/releases'

type ReleaseCardsBlockProps = {
  columns?: '2' | '3' | '4'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  count?: number
  // 'pick': the releases chosen in Studio, all of them, in that order
  // (no "How many"); otherwise the newest in the chosen stages.
  source?: 'latest' | 'pick'
  // Release documents, resolved in the page query: the chosen ones, or
  // the newest in the block's stages (shipped only by default).
  releases?: Release[]
  // Hand-typed cards from before releases were documents — shown only
  // while no Release documents exist yet.
  cards?: Release[]
}

const COLS_CLASS: Record<'2' | '3' | '4', string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

// Releases as cards (see ReleaseCard): the newest in the chosen stages
// (shipped, rolling out, in development), or releases picked one by one.
// No intro of its own — pair it with a Section Headline block above. The
// full list is the Releases page's Releases Timeline.
export function ReleaseCardsBlock({
  columns = '2',
  spacing = 'loose',
  count = 4,
  source = 'latest',
  releases = [],
  cards = [],
}: ReleaseCardsBlockProps) {
  const locale = releaseLocale(usePathname())
  // A picked release that's since been deleted comes back empty: skip it.
  const list = (releases.length ? releases : cards).filter((release) => release?.title)
  const shown = source === 'pick' ? list : list.slice(0, count)

  // D7: a block with no content simply doesn't render.
  if (!shown.length) return null

  return (
    <SectionShell px="boxed" py={spacing}>
      <div className={`grid grid-cols-1 gap-small md:gap-large ${COLS_CLASS[columns]}`}>
        {shown.map((release, index) => (
          <ReleaseCard key={release._id ?? index} release={release} locale={locale} />
        ))}
      </div>
    </SectionShell>
  )
}
