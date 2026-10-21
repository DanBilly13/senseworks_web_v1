'use client'
import Link from 'next/link'
import { ArrowRightOutlined } from '@ant-design/icons'
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

// Every post on the blog's list, the same way: a rule across the top,
// the cover on the left, the title large on the right with an arrow,
// and the tag and date at the foot of the text. On mobile the cover sits
// above the text. Long old titles wrap rather than cut off.
export function BlogRow({ post, locale }: { post: BlogPostSummary; locale: BlogLocale }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-medium border-t border-foreground/20 py-medium-large md:grid-cols-12 md:gap-large"
    >
      <BlogCover post={post} className="aspect-blog-cover w-full overflow-hidden rounded-md md:col-span-4" />
      <div className="flex flex-col justify-between gap-medium md:col-span-8">
        <div className="flex items-start justify-between gap-large">
          <h3 className="text-h4 font-semibold text-pretty text-foreground group-hover:underline">{post.title}</h3>
          <ArrowRightOutlined aria-hidden="true" className="shrink-0 text-h4 text-foreground transition-transform group-hover:translate-x-xs" />
        </div>
        <Meta post={post} locale={locale} />
      </div>
    </Link>
  )
}
