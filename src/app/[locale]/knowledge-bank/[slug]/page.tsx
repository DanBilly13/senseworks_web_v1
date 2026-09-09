import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getArticle } from '@/lib/sanity/knowledgeBank'
import { urlFor } from '@/lib/sanity/image'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import { AuthorAvatar } from '@/components/knowledge-bank/AuthorAvatar'
import type { MediaField } from '@/lib/sanity/media'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-medium text-body text-foreground">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-large mb-medium text-h3 font-bold text-foreground">{children}</h2>
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
    bullet: ({ children }) => <ul className="mb-medium list-disc pl-medium-large">{children}</ul>,
    number: ({ children }) => <ol className="mb-medium list-decimal pl-medium-large">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="underline underline-offset-4">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <span className="my-large block overflow-hidden rounded-lg">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt ?? ''}
          width={1200}
          height={800}
          sizes="100vw"
          className="h-auto w-full"
        />
      </span>
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

  const cover: MediaField = article.coverImage ? { mediaType: 'image', image: article.coverImage } : null
  const authorPhoto: MediaField = article.author?.photo
    ? { mediaType: 'image', image: article.author.photo }
    : null

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell py="section-edge" pad="both" maxWidth="prose-lg" className="flex flex-col gap-large">
        {!!article.tags?.length && (
          <div className="flex flex-wrap gap-xs">
            {article.tags.map((tag) => (
              <Tag key={tag.slug}>{tag.title}</Tag>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-medium">
          <h1 className="text-h1 font-bold text-balance text-foreground">{article.title}</h1>
          {article.subtitle && (
            <p className="text-body-lg text-muted-foreground">{article.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-small border-y border-border py-medium">
          <AuthorAvatar
            media={authorPhoto}
            alt={article.author?.name ?? ''}
            className="size-2xl shrink-0 rounded-full"
          />
          <div className="flex flex-col">
            {article.author?.name && (
              <span className="text-body-sm font-semibold text-foreground">
                Written by {article.author.name}
              </span>
            )}
            <span className="text-caption text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        {cover && <Media media={cover} alt={article.title} className="aspect-media w-full rounded-lg" />}
        {!!article.body?.length && (
          <div>
            <PortableText value={article.body} components={portableTextComponents} />
          </div>
        )}
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
