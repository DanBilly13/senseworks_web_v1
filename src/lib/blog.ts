import type { BlogTag } from '@/lib/sanity/blog'

export type BlogLocale = 'en' | 'sv'
export const blogLocale = (locale: string): BlogLocale => (locale === 'sv' ? 'sv' : 'en')

// The blog's fixed labels, in both languages — the page's heading,
// intro and closing banner are in Studio (the Blog page), the posts'
// text in each Blog post.
export const BLOG_TEXT = {
  all: { en: 'All', sv: 'Alla' },
  filter: { en: 'Filter posts', sv: 'Filtrera inlägg' },
  posts: { en: 'posts', sv: 'inlägg' },
  post: { en: 'post', sv: 'inlägg' },
  allPosts: { en: '← All posts', sv: '← Alla inlägg' },
  readStory: { en: 'Read the customer story', sv: 'Läs kundberättelsen' },
  customerStory: { en: 'Customer story', sv: 'Kundberättelse' },
  more: { news: { en: 'More news', sv: 'Fler nyheter' }, insights: { en: 'More insights', sv: 'Fler insikter' } },
  walkthrough: { en: 'Book a walkthrough', sv: 'Boka en genomgång' },
  noPosts: { en: 'No posts match this filter.', sv: 'Inga inlägg matchar filtret.' },
}

export const BLOG_TAGS: Record<BlogTag, Record<BlogLocale, string>> = {
  news: { en: 'News', sv: 'Nyheter' },
  insights: { en: 'Insights', sv: 'Insikter' },
}
