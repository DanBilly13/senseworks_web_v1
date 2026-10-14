import type { SlugValidationContext } from 'sanity'

// Slug uniqueness per language, not across the whole type. The English
// and Swedish versions of a page, article or customer story share a slug
// on purpose — the URL carries the language (/en/… vs /sv/…) — so
// Sanity's default check ("Slug is already in use") blocked publishing
// the second language version. This only flags a clash with another
// document of the same type *in the same language*, ignoring the
// document's own draft/published pair.
export async function isUniqueInLanguage(slug: string, context: SlugValidationContext): Promise<boolean> {
  const { document, getClient } = context
  if (!document?._id) return true
  const id = document._id.replace(/^drafts\./, '')
  const language = (document as { language?: string }).language ?? null
  return getClient({ apiVersion: '2024-01-01' }).fetch<boolean>(
    `!defined(*[
      _type == $type && slug.current == $slug && language == $language &&
      !(_id in [$draft, $published])
    ][0]._id)`,
    { type: document._type, slug, language, draft: `drafts.${id}`, published: id },
  )
}
