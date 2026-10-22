import type { Ref } from 'react'
import type { SanityImageSource } from '@sanity/image-url'
import { Media } from '@/components/ui/Media'
import { productLabels } from '@/lib/customerStoryProducts'
import { CardTags } from '@/components/ui/CardTags'

export type StoryCardData = {
  companyName: string
  slug: string
  summary?: string
  products?: string[]
  coverImage?: SanityImageSource
}
export type StoryCardTone = 'default' | 'dark'

const TONE_CLASS: Record<StoryCardTone, string> = {
  default: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
}

// A customer story card — image-led, like a Knowledge Bank article
// card: the story's photo, its products as tags (CardTags), the company in our
// heading face, the one-line outcome (summary), and a link into the
// story. The whole card is the link. Shared by the Customer stories
// start page and the Case Study Carousel block. `className` sets its
// width (fixed in the carousel, the grid column on the start page).
export function StoryCard({
  story,
  locale,
  tone = 'default',
  className,
  ref,
}: {
  story: StoryCardData
  locale: string
  tone?: StoryCardTone
  className?: string
  ref?: Ref<HTMLAnchorElement>
}) {
  const products = productLabels(story.products, locale)
  return (
    <a
      ref={ref}
      href={`/${locale}/customer-stories/${story.slug}`}
      className={['group flex flex-col overflow-hidden rounded-lg', TONE_CLASS[tone], className].filter(Boolean).join(' ')}
    >
      {/* The gradient placeholder until a cover image is set. */}
      <Media
        media={story.coverImage ? { mediaType: 'image', image: story.coverImage } : null}
        alt=""
        className="aspect-4/3 w-full"
      />
      <div className="flex flex-1 flex-col gap-small-medium p-medium-large md:p-large">
        {/* 24px down to the title (the 12px gap + 12), as on every card with chips. */}
        <CardTags tags={products} surface={tone === 'dark' ? 'dark' : 'card'} className="mb-small-medium" />
        <h3 className="text-h4 font-bold text-balance">{story.companyName}</h3>
        {story.summary && <p className="text-body">{story.summary}</p>}
        <span
          className={`mt-auto pt-small text-body-sm font-medium underline underline-offset-4 ${tone === 'dark' ? 'text-accent' : ''}`}
        >
          {locale === 'sv' ? 'Läs berättelsen →' : 'Read their story →'}
        </span>
      </div>
    </a>
  )
}
