import type { BlogTag } from '@/lib/sanity/blog'

export type BlogLocale = 'en' | 'sv'
export const blogLocale = (locale: string): BlogLocale => (locale === 'sv' ? 'sv' : 'en')

// The blog's own words, in both languages (the posts' text comes from
// Studio; these are the page's fixed labels).
export const BLOG_TEXT = {
  eyebrow: { en: 'Resources', sv: 'Resurser' },
  title: { en: 'Blog', sv: 'Blogg' },
  intro: { en: 'News and insights from Senseworks since 2022.', sv: 'Nyheter och insikter från Senseworks sedan 2022.' },
  all: { en: 'All', sv: 'Alla' },
  filter: { en: 'Filter posts', sv: 'Filtrera inlägg' },
  posts: { en: 'posts', sv: 'inlägg' },
  post: { en: 'post', sv: 'inlägg' },
  allPosts: { en: '← All posts', sv: '← Alla inlägg' },
  readStory: { en: 'Read the customer story', sv: 'Läs kundberättelsen' },
  customerStory: { en: 'Customer story', sv: 'Kundberättelse' },
  more: { news: { en: 'More news', sv: 'Fler nyheter' }, insights: { en: 'More insights', sv: 'Fler insikter' } },
  followHeading: { en: 'Follow along', sv: 'Följ med' },
  followBody: {
    en: 'Get new posts in our newsletter on LinkedIn, or see Senseworks for yourself in a walkthrough.',
    sv: 'Få nya inlägg i vårt nyhetsbrev på LinkedIn, eller se Senseworks själv i en genomgång.',
  },
  newsletter: { en: 'Newsletter on LinkedIn', sv: 'Nyhetsbrev på LinkedIn' },
  walkthrough: { en: 'Book a walkthrough', sv: 'Boka en genomgång' },
  noPosts: { en: 'No posts match this filter.', sv: 'Inga inlägg matchar filtret.' },
}

export const BLOG_TAGS: Record<BlogTag, Record<BlogLocale, string>> = {
  news: { en: 'News', sv: 'Nyheter' },
  insights: { en: 'Insights', sv: 'Insikter' },
}

export const NEWSLETTER_URL = 'https://www.linkedin.com/newsletters/senseworks-nyhetsbrev-7036293916433727488/'
