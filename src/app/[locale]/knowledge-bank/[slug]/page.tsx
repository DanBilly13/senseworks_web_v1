import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/sanity/knowledgeBank'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { CardTags } from '@/components/ui/CardTags'
import { AuthorByline } from '@/components/knowledge-bank/AuthorByline'
import { ArticleActions } from '@/components/knowledge-bank/ArticleActions'
import { LikeProvider } from '@/components/knowledge-bank/LikeProvider'
import { ArticleImage } from '@/components/knowledge-bank/ArticleImage'
import { ArticleBody } from '@/components/ui/ArticleBody'
import { BackLink } from '@/components/ui/BackLink'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const article = await getArticle(slug, locale)

  if (!article) notFound()

  return (
    <>
      <SiteHeader locale={locale} path={`/${locale}/knowledge-bank/${slug}`} />
      <LikeProvider articleSlug={slug}>
        <SectionShell py="section-edge" pad="both" maxWidth="page" className="article-grid">
          {/* The way back (just the arrow), then the article's tags. */}
          <div className="mb-large flex flex-wrap items-center gap-medium">
            <BackLink to="knowledgeBank" locale={locale} iconOnly />
            <CardTags tags={(article.tags ?? []).map((tag) => tag.title)} surface="page" />
          </div>
          <div className="mb-large flex flex-col gap-medium">
            <h1 className="text-h1 font-bold text-balance text-foreground">{article.title}</h1>
            {article.subtitle && (
              <p className="text-body-lg text-muted-foreground">{article.subtitle}</p>
            )}
          </div>
          <div className="mb-large flex items-center justify-between gap-medium border-y border-border py-medium">
            <AuthorByline author={article.author} publishedAt={article.publishedAt} locale={locale} />
            <ArticleActions />
          </div>
          {article.coverImage && (
            <div className="article-grid-wide mb-large overflow-hidden rounded-lg">
              <ArticleImage image={article.coverImage} alt={article.title} />
            </div>
          )}
          {!!article.body?.length && (
            <ArticleBody value={article.body} />
          )}
          {/* Repeats the top byline+actions — a second chance to like/
              share once the reader has actually finished the article,
              not just skimmed the top. */}
          <div className="mt-large flex items-center justify-between gap-medium border-t border-border pt-medium">
            <AuthorByline author={article.author} publishedAt={article.publishedAt} locale={locale} />
            <ArticleActions />
          </div>
        </SectionShell>
      </LikeProvider>
      <SiteFooter locale={locale} />
    </>
  )
}
