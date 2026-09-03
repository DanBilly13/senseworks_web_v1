import { groq } from 'next-sanity'

// D12: requested locale first, fall back to English (default locale)
// when no translation exists yet — a missing translation is absence,
// not an error. Both language versions of a demo page use the same
// literal slug (e.g. "home") for v1 — a documented simplification;
// production content with per-locale slugs would need to resolve the
// fallback through translation.metadata instead.
export const pageBySlugAndLocaleQuery = groq`
  coalesce(
    *[_type == "page" && slug.current == $slug && language == $locale][0],
    *[_type == "page" && slug.current == $slug && language == "en"][0]
  ){
    title,
    language,
    "slug": slug.current,
    blocks[]{
      ...
    }
  }
`
