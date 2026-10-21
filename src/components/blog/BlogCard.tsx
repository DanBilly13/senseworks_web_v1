'use client'
import Link from 'next/link'
import { ArrowRightOutlined } from '@ant-design/icons'
import Image from 'next/image'
import { Media } from '@/components/ui/Media'
import { CardTags, type CardTagsSurface } from '@/components/ui/CardTags'
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

function Meta({ post, locale, surface }: { post: BlogPostSummary; locale: BlogLocale; surface: CardTagsSurface }) {
  return (
    <div className="flex flex-wrap items-center gap-small text-caption text-muted-foreground">
      <CardTags tags={[BLOG_TAGS[post.tag]?.[locale] ?? post.tag]} surface={surface} />
      <time dateTime={post.publishedAt}>{formatReleaseDate(post.publishedAt, locale)}</time>
    </div>
  )
}

// Every post on the blog's list (and the "More news" at the end of a
// post), the same way: a rule across the top,
// the cover on the left, the title large on the right with an arrow,
// and the tag and date at the foot of the text. On mobile the cover sits
// above the text. Long old titles wrap rather than cut off.
export function BlogRow({ post, locale }: { post: BlogPostSummary; locale: BlogLocale }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-medium border-t border-foreground/20 py-medium-large md:grid-cols-8 md:gap-large"
    >
      {/* 2 of the row's 8 columns; the text and arrow take the other 6. */}
      <BlogCover post={post} className="aspect-blog-thumb w-full overflow-hidden rounded-md md:col-span-2" />
      <div className="flex flex-col justify-between gap-medium md:col-span-6">
        <div className="flex items-start justify-between gap-large">
          {/* Capped at 85% of its space (the subtitle width) and balanced, so
              a long title wraps into even lines rather than running to the
              arrow and leaving a stub. */}
          <h3 className="max-w-subtitle text-h4 font-semibold text-balance text-foreground group-hover:underline">{post.title}</h3>
          <ArrowRightOutlined aria-hidden="true" className="shrink-0 text-h4 text-foreground transition-transform group-hover:translate-x-xs" />
        </div>
        <Meta post={post} locale={locale} surface="page" />
      </div>
    </Link>
  )
}
