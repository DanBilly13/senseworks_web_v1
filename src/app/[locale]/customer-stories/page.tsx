import { getCustomerStories } from '@/lib/sanity/customerStories'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
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
  const stories = await getCustomerStories(locale)

  return (
    <>
      <SiteHeader locale={locale} />
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
      <SiteFooter locale={locale} />
    </>
  )
}
