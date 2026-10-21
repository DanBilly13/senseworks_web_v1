import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getBlogPost } from '@/lib/sanity/blog'
import { BLOG_TAGS, BLOG_TEXT, blogLocale } from '@/lib/blog'
import { formatReleaseDate } from '@/lib/releases'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { Media } from '@/components/ui/Media'
import { ArticleBody } from '@/components/ui/ArticleBody'
import { AuthorByline } from '@/components/knowledge-bank/AuthorByline'
import { ArticleActions } from '@/components/knowledge-bank/ArticleActions'
import { LikeProvider } from '@/components/knowledge-bank/LikeProvider'
import { BlogCardLarge, BlogCover } from '@/components/blog/BlogCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)
  if (!post?.inLocale) return {}
  return { title: `${post.title} | Senseworks`, ...(post.excerpt ? { description: post.excerpt } : {}) }
}

// A blog post, in the same family as a Knowledge Bank article and a
// customer story: the 8-column text column (.article-grid), the same
// body styles (plus the interview Question style and image captions).
// Top: tag and date (always shown, however old), title, standfirst,
// the author with photo and role, the cover. A post with a full
// customer story links to it; the end has three more posts with the
// same tag, the way back to the blog, and "Book a walkthrough".
export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = blogLocale(rawLocale)
  const post = await getBlogPost(slug, locale)

  if (!post) notFound()
  // Only in the other language (most posts are Swedish only): the
  // language switch lands on this language's blog, not on an error.
  if (!post.inLocale) redirect(`/${locale}/blog`)

  return (
    <>
      <SiteHeader locale={locale} />
      <LikeProvider articleSlug={`blog-${slug}`}>
        <SectionShell py="section-edge" pad="both" maxWidth="page" className="article-grid">
          <div className="mb-large flex flex-wrap items-center gap-small text-body-sm text-muted-foreground">
            <Tag>{BLOG_TAGS[post.tag]?.[locale] ?? post.tag}</Tag>
            <time dateTime={post.publishedAt}>{formatReleaseDate(post.publishedAt, locale)}</time>
          </div>
          <div className="mb-large flex flex-col gap-medium">
            <h1 className="text-h1 font-bold text-pretty text-foreground">{post.title}</h1>
            {post.standfirst && <p className="text-body-lg text-muted-foreground">{post.standfirst}</p>}
          </div>
          <div className="mb-large flex items-center justify-between gap-medium border-y border-border py-medium">
            <AuthorByline author={post.author} publishedAt={post.publishedAt} locale={locale} label={locale === 'sv' ? 'Av' : 'By'} showRole />
            <ArticleActions />
          </div>
          <div className="article-grid-wide mb-large overflow-hidden rounded-lg">
            <BlogCover post={post} className="aspect-blog-cover w-full" />
          </div>
          {!!post.body?.length && (
            <ArticleBody
              value={post.body}
              extraTypes={{
                // An inline image keeps the article's wide break-out, with
                // its caption underneath when it has one.
                image: ({ value }) => (
                  <figure className="article-grid-wide my-large flex flex-col gap-small">
                    <Media media={{ mediaType: 'image', image: value }} alt={value.alt ?? ''} className="aspect-media w-full overflow-hidden rounded-lg" />
                    {value.caption && <figcaption className="text-body-sm text-muted-foreground">{value.caption}</figcaption>}
                  </figure>
                ),
              }}
            />
          )}
          {post.customerStory && (
            <Link
              href={`/${locale}/customer-stories/${post.customerStory.slug}`}
              className="group my-large flex items-center gap-medium-large rounded-lg bg-foreground p-medium-large text-background md:p-large"
            >
              <Media
                media={post.customerStory.coverImage ? { mediaType: 'image', image: post.customerStory.coverImage } : null}
                alt=""
                className="hidden size-4xl shrink-0 overflow-hidden rounded-md sm:block"
              />
              <div className="flex flex-col gap-xs">
                <span className="text-caption font-bold tracking-wider text-background/70 uppercase">{BLOG_TEXT.customerStory[locale]}</span>
                <span className="text-h5 font-bold text-balance">{post.customerStory.title || post.customerStory.companyName}</span>
                <span className="text-body-sm font-medium underline underline-offset-4 group-hover:no-underline">{BLOG_TEXT.readStory[locale]} →</span>
              </div>
            </Link>
          )}
          <div className="mt-large flex items-center justify-between gap-medium border-t border-border pt-medium">
            <AuthorByline author={post.author} publishedAt={post.publishedAt} locale={locale} label={locale === 'sv' ? 'Av' : 'By'} showRole />
            <ArticleActions />
          </div>
        </SectionShell>
      </LikeProvider>
      {post.related.length > 0 && (
        <SectionShell py="loose" className="flex flex-col gap-xl">
          <h2 className="text-h3 font-bold text-foreground">{BLOG_TEXT.more[post.tag]?.[locale]}</h2>
          <div className="grid grid-cols-1 gap-large md:grid-cols-3">
            {post.related.map((related) => (
              <BlogCardLarge key={related.slug} post={related} locale={locale} />
            ))}
          </div>
        </SectionShell>
      )}
      <SectionShell py="loose" className="flex flex-wrap items-center justify-between gap-medium">
        <Link href={`/${locale}/blog`} className="text-body-sm font-medium underline underline-offset-4">
          {BLOG_TEXT.allPosts[locale]}
        </Link>
        <Button href="#book-meeting">{BLOG_TEXT.walkthrough[locale]}</Button>
      </SectionShell>
      <SiteFooter locale={locale} />
    </>
  )
}
