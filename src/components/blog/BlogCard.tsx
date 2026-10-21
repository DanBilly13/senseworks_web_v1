import Link from 'next/link'
import Image from 'next/image'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import { formatReleaseDate } from '@/lib/releases'
import { BLOG_TAGS, type BlogLocale } from '@/lib/blog'
import type { BlogPostSummary } from '@/lib/sanity/blog'

// The generated cover: the tag's colour with the Senseworks mark — for a
// post with no cover image, or one set to "Use the generated cover" (an
// old, low-quality or awkward photo), so old and new posts look alike.
function GeneratedCover({ tag, className }: { tag: BlogPostSummary['tag']; className: string }) {
  return (
    <div className={`flex items-center justify-center ${tag === 'news' ? 'bg-tag-yellow' : 'bg-tag-purple'} ${className}`}>
      <Image src="/senseworks-brandmark-pos.svg" alt="" width={96} height={40} className="h-large w-auto opacity-80" />
    </div>
  )
}

export function BlogCover({ post, className }: { post: BlogPostSummary; className: string }) {
  if (!post.coverImage || post.generatedCover) return <GeneratedCover tag={post.tag} className={className} />
  return <Media media={{ mediaType: 'image', image: post.coverImage }} alt="" className={className} />
}

function Meta({ post, locale }: { post: BlogPostSummary; locale: BlogLocale }) {
  return (
    <div className="flex flex-wrap items-center gap-small text-caption text-muted-foreground">
      <Tag>{BLOG_TAGS[post.tag]?.[locale] ?? post.tag}</Tag>
      <time dateTime={post.publishedAt}>{formatReleaseDate(post.publishedAt, locale)}</time>
    </div>
  )
}

// Large: the newest posts — cover, tag, date, title, excerpt.
export function BlogCardLarge({ post, locale }: { post: BlogPostSummary; locale: BlogLocale }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <BlogCover post={post} className="aspect-blog-cover w-full" />
      <div className="flex flex-1 flex-col gap-small-medium p-medium-large">
        <Meta post={post} locale={locale} />
        <h3 className="line-clamp-3 text-h5 font-semibold text-balance text-foreground group-hover:underline">{post.title}</h3>
        {post.excerpt && <p className="line-clamp-3 text-body-sm text-muted-foreground">{post.excerpt}</p>}
      </div>
    </Link>
  )
}

// Compact: the archive — one row per post: date and tag, title, and a
// small cover on wider screens. Long old titles wrap rather than cut off.
export function BlogCardCompact({ post, locale }: { post: BlogPostSummary; locale: BlogLocale }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex items-center gap-medium-large border-b border-border py-medium-large first:border-t"
    >
      <div className="flex flex-1 flex-col gap-small">
        <Meta post={post} locale={locale} />
        <h3 className="text-body-lg font-semibold text-pretty text-foreground group-hover:underline">{post.title}</h3>
      </div>
      <BlogCover post={post} className="hidden aspect-blog-cover w-40 shrink-0 overflow-hidden rounded-md sm:flex" />
    </Link>
  )
}
