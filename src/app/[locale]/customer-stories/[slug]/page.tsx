import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getCustomerStory } from '@/lib/sanity/customerStories'
import { splitProducts } from '@/lib/customerStoryProducts'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { Tag } from '@/components/ui/Tag'
import { Media } from '@/components/ui/Media'
import { ArticleImage } from '@/components/knowledge-bank/ArticleImage'
import { ArticleBody } from '@/components/ui/ArticleBody'

// The customer story template — laid out like a Knowledge Bank article
// (same text column, cover image and body styles), with the company in
// the byline row where an article has its author, and the customer's
// own quote leading into the story.
export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [home, story] = await Promise.all([getPage('home', locale), getCustomerStory(slug, locale)])

  if (!home || !story) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')
  const products = splitProducts(story.products)

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell py="section-edge" pad="both" maxWidth="page" className="article-grid">
        {!!products.length && (
          <div className="mb-large flex flex-wrap gap-xs">
            {products.map((product) => (
              <Tag key={product}>{product}</Tag>
            ))}
          </div>
        )}
        <div className="mb-large flex flex-col gap-medium">
          <h1 className="text-h1 font-bold text-balance text-foreground">{story.title || story.companyName}</h1>
          {story.subtitle && <p className="text-body-lg text-muted-foreground">{story.subtitle}</p>}
        </div>
        <div className="mb-large flex items-center gap-medium border-y border-border py-medium">
          {story.media?.mediaType ? (
            <Media media={story.media} alt={`${story.companyName} logo`} className="h-xl w-3xl rounded-md" fit="contain" />
          ) : null}
          <div className="flex flex-col">
            <span className="text-body-sm font-semibold text-foreground">{story.companyName}</span>
            {story.facts && <span className="text-caption text-muted-foreground">{story.facts}</span>}
          </div>
        </div>
        {story.coverImage && (
          <div className="article-grid-wide mb-large overflow-hidden rounded-lg">
            <ArticleImage image={story.coverImage} alt={story.title || story.companyName} />
          </div>
        )}
        {story.quote && (
          <figure className="mb-large flex flex-col gap-medium">
            <blockquote className="text-h4 font-medium text-balance text-foreground">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
            {(story.personName || story.personRole) && (
              <figcaption className="flex flex-col">
                {story.personName && <span className="text-body-sm font-semibold text-foreground">{story.personName}</span>}
                {story.personRole && <span className="text-caption text-muted-foreground">{story.personRole}</span>}
              </figcaption>
            )}
          </figure>
        )}
        {!!story.body?.length && <ArticleBody value={story.body} />}
        <div className="mt-large border-t border-border pt-medium">
          <a href={`/${locale}/customer-stories`} className="text-body-sm font-medium underline underline-offset-4">
            ← All customer stories
          </a>
        </div>
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
