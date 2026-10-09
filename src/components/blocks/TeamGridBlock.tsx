import { SectionShell } from '@/components/ui/SectionShell'
import { TeamGrid } from '@/components/team/TeamGrid'
import type { TeamMember } from '@/lib/sanity/team'

type TeamGridBlockProps = {
  // Resolved in the page query: the people picked in Studio, or every
  // Team member A–Z when none are picked.
  members?: TeamMember[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

// The team roster: photo cards that open a dark bio card. No intro of
// its own — pair it with a Section Headline block above.
export function TeamGridBlock({ members = [], spacing = 'loose' }: TeamGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!members.length) return null

  return (
    <SectionShell py={spacing}>
      <TeamGrid members={members} />
    </SectionShell>
  )
}
