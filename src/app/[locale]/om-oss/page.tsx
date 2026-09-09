import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getTeam } from '@/lib/sanity/team'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { TeamGrid } from '@/components/team/TeamGrid'

export default async function OmOssPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Team roster isn't per-locale content (D-team-roster) — same
  // people regardless of which site locale you're viewing.
  const [home, team] = await Promise.all([getPage('home', locale), getTeam()])

  if (!home) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell py="section-edge" pad="both" className="flex flex-col gap-2xl">
        <SectionIntro as="h1" eyebrow="Om oss" heading="Möt teamet" maxWidth="md" />
        <TeamGrid members={team} />
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
