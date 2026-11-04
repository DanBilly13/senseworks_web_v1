import { groq } from 'next-sanity'
import { sanityClient } from './client'
import { storyWrittenIn } from './queries'

// Everything public, with the languages each item really exists in, for
// app/sitemap.ts. Same rules as the pages themselves: a page shows in
// both languages (Swedish falls back to English); a blog post or an
// article only where it has a title (or is written in that language); a
// customer story where it's written in that language. Page versions are
// team experiments and left out.
export const sitemapQuery = groq`{
  "pages": *[_type == "page" && !defined(versionOf) && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "blogPost" && defined(slug.current)]{
    "slug": slug.current, _updatedAt, "en": defined(title.en), "sv": defined(title.sv)
  },
  "articles": *[_type == "article" && defined(slug.current)]{
    "slug": slug.current, _updatedAt,
    "en": defined(title.en) || language == "en", "sv": defined(title.sv) || language == "sv"
  },
  "stories": *[_type == "customerStory" && defined(slug.current)]{
    "slug": slug.current, _updatedAt,
    "en": ${storyWrittenIn('"en"')} || language == "en", "sv": ${storyWrittenIn('"sv"')} || language == "sv"
  }
}`

type Entry = { slug: string; _updatedAt: string; en?: boolean; sv?: boolean }
export type SitemapContent = { pages: Entry[]; posts: Entry[]; articles: Entry[]; stories: Entry[] }

export async function getSitemapContent(): Promise<SitemapContent> {
  return sanityClient.fetch(sitemapQuery)
}
