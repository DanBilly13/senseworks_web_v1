import { notFound } from 'next/navigation'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getArticle } from '@/lib/sanity/knowledgeBank'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { Tag } from '@/components/ui/Tag'
import { AuthorByline } from '@/components/knowledge-bank/AuthorByline'
import { ArticleActions } from '@/components/knowledge-bank/ArticleActions'
import { LikeProvider } from '@/components/knowledge-bank/LikeProvider'
import { ArticleImage } from '@/components/knowledge-bank/ArticleImage'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-medium text-article-body text-foreground">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-large mb-medium text-h4 font-bold text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-large mb-medium text-h4 font-semibold text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-large mb-medium text-h5 font-semibold text-foreground">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-medium border-l-2 border-border pl-medium text-body-lg text-muted-foreground italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-medium list-disc pl-medium-large text-article-body text-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-medium list-decimal pl-medium-large text-article-body text-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="underline underline-offset-4">
        {children}
      </a>
    ),
  },
  types: {
    // Breaks out of the text column (article-grid-wide) — these are
    // dense product screenshots that need real width to stay legible,
    // not inline illustrations that should match the prose width.
    image: ({ value }) => (
      <div className="article-grid-wide my-large overflow-hidden rounded-lg">
        <ArticleImage image={value} alt={value.alt ?? ''} />
      </div>
    ),
  },
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [home, article] = await Promise.all([getPage('home', locale), getArticle(slug, locale)])

  if (!home || !article) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <LikeProvider articleSlug={slug}>
        <SectionShell py="section-edge" pad="both" maxWidth="page" className="article-grid">
          {!!article.tags?.length && (
            <div className="mb-large flex flex-wrap gap-xs">
              {article.tags.map((tag) => (
                <Tag key={tag.slug}>{tag.title}</Tag>
              ))}
            </div>
          )}
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
            <PortableText value={article.body} components={portableTextComponents} />
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
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
