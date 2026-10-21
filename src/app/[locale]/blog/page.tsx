import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/sanity/blog'
import { BLOG_TEXT, NEWSLETTER_URL, blogLocale } from '@/lib/blog'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'
import { BlogIndex } from '@/components/blog/BlogIndex'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = blogLocale((await params).locale)
  return { title: `${BLOG_TEXT.title[locale]} | Senseworks`, description: BLOG_TEXT.intro[locale] }
}

// The blog: every News and Insights post since 2022 (see BlogIndex),
// under Resources next to the Knowledge Bank and Customer stories.
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = blogLocale(rawLocale)
  const posts = await getBlogPosts(locale)

  return (
    <>
      <SiteHeader locale={locale} />
      <SectionShell py="section-edge" pad="both" className="flex flex-col gap-2xl">
        <SectionIntro as="h1" eyebrow={BLOG_TEXT.eyebrow[locale]} heading={BLOG_TEXT.title[locale]} body={BLOG_TEXT.intro[locale]} maxWidth="md" />
        <BlogIndex posts={posts} locale={locale} />
      </SectionShell>
      {/* The closing call to action: follow along, or book a walkthrough. */}
      <SectionShell py="loose" className="flex flex-col gap-large border-t border-border pt-2xl">
        <SectionIntro as="h2" styleAs="h3" heading={BLOG_TEXT.followHeading[locale]} body={BLOG_TEXT.followBody[locale]} maxWidth="md" />
        <div className="flex flex-wrap gap-small-medium">
          <Button href="#book-meeting">{BLOG_TEXT.walkthrough[locale]}</Button>
          <Button href={NEWSLETTER_URL} variant="ghost">
            {BLOG_TEXT.newsletter[locale]}
          </Button>
        </div>
      </SectionShell>
      <SiteFooter locale={locale} />
    </>
  )
}
