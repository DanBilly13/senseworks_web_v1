import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getCustomerStories } from '@/lib/sanity/customerStories'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { CustomerStoriesGrid } from '@/components/customer-stories/CustomerStoriesGrid'

// The Customer stories start page — same structure as the Knowledge
// Bank's (header and footer borrowed from Home, an intro, then a
// filterable grid), with case study cards instead of article cards.
export default async function CustomerStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [home, stories] = await Promise.all([getPage('home', locale), getCustomerStories(locale)])

  if (!home) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell py="section-edge" pad="both" className="flex flex-col gap-2xl">
        <SectionIntro
          as="h1"
          eyebrow="Resources"
          heading="Customer stories"
          body="How audit firms work with Senseworks, in their own words."
          maxWidth="md"
        />
        <CustomerStoriesGrid stories={stories} locale={locale} />
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
