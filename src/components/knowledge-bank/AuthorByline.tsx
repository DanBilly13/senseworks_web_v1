import { AuthorAvatar } from './AuthorAvatar'
import type { ArticleAuthor } from '@/lib/sanity/knowledgeBank'
import type { MediaField } from '@/lib/sanity/media'

// Used twice on the article page (top and bottom, per D-something —
// ending the article with the byline again gives readers a second
// chance to like/share once they've actually finished it) — extracted
// so both stay identical without copy-pasting the markup.
export function AuthorByline({
  author,
  publishedAt,
  locale,
}: {
  author?: ArticleAuthor
  publishedAt: string
  locale: string
}) {
  const photo: MediaField = author?.photo ? { mediaType: 'image', image: author.photo } : null

  return (
    <div className="flex items-center gap-small">
      <AuthorAvatar media={photo} alt={author?.name ?? ''} className="size-2xl shrink-0 rounded-full" />
      <div className="flex flex-col">
        {author?.name && (
          <span className="text-body-sm font-semibold text-foreground">
            Written by {author.name}
          </span>
        )}
        <span className="text-caption text-muted-foreground">
          {new Date(publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  )
}
