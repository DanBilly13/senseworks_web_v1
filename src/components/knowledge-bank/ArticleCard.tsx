'use client'
import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import { AuthorAvatar } from './AuthorAvatar'
import type { ArticleSummary } from '@/lib/sanity/knowledgeBank'
import type { MediaField } from '@/lib/sanity/media'

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ArticleCard({ article, locale }: { article: ArticleSummary; locale: string }) {
  const cover: MediaField = article.coverImage ? { mediaType: 'image', image: article.coverImage } : null
  const authorPhoto: MediaField = article.author?.photo
    ? { mediaType: 'image', image: article.author.photo }
    : null

  return (
    <Link
      href={`/${locale}/knowledge-bank/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <Media media={cover} alt={article.title} className="aspect-article-cover w-full" />
      <div className="flex flex-1 flex-col gap-small-medium p-medium-large">
        {!!article.tags?.length && (
          <div className="flex flex-wrap gap-xs">
            {article.tags.map((t) => (
              <Tag key={t.slug}>{t.title}</Tag>
            ))}
          </div>
        )}
        <h3 className="text-h5 font-semibold text-balance text-foreground group-hover:underline">
          {article.title}
        </h3>
        {article.subtitle && <p className="text-body-sm text-muted-foreground">{article.subtitle}</p>}
        <div className="mt-auto flex items-center gap-small pt-small-medium">
          <AuthorAvatar
            media={authorPhoto}
            alt={article.author?.name ?? ''}
            className="size-large shrink-0 rounded-full"
            background="none"
          />
          <div className="flex flex-col">
            {article.author?.name && (
              <span className="text-body-sm font-medium text-foreground">{article.author.name}</span>
            )}
            <span className="text-caption text-muted-foreground">
              {formatDate(article.publishedAt, locale)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
