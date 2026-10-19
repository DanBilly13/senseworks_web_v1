'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { ReleaseCard } from '@/components/ui/ReleaseCard'
import { releaseLocale, type Release } from '@/lib/releases'

type ReleaseCardsBlockProps = {
  columns?: '2' | '3' | '4'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  count?: number
  // The newest shipped Release documents (resolved in the page query).
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

// The newest shipped releases as cards (see ReleaseCard). No intro of its
// own — pair it with a Section Headline block above. The full list,
// including what's rolling out and in development, is the Releases
// page's Releases Timeline.
export function ReleaseCardsBlock({ columns = '2', spacing = 'loose', count = 4, releases = [], cards = [] }: ReleaseCardsBlockProps) {
  const locale = releaseLocale(usePathname())
  const shown = (releases.length ? releases : cards).slice(0, count)

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
