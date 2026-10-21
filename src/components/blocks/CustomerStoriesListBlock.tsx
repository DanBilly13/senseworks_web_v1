'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { CustomerStoriesGrid } from '@/components/customer-stories/CustomerStoriesGrid'
import type { CustomerStorySummary } from '@/lib/sanity/customerStories'

type Spacing = 'loose' | 'medium' | 'tight' | 'none'

// The Customer stories grid as a block, for the Customer stories page.
// The stories are resolved in the page query: the page's language, with
// English as the fallback.
export function CustomerStoriesListBlock({ stories = [], spacing = 'loose' }: { stories?: CustomerStorySummary[]; spacing?: Spacing }) {
  const locale = usePathname().split('/')[1] || 'en'
  if (!stories.length) return null
  return (
    <SectionShell py={spacing}>
      <CustomerStoriesGrid stories={stories} locale={locale} />
    </SectionShell>
  )
}
