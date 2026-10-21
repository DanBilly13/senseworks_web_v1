// The tags on a card or at the top of a post — a Knowledge Bank
// article's topics, a blog post's News/Insights, a customer story's
// products — all in the one style: small rounded pills. `surface` is
// what they sit on, so the pill always stands off it: grey on a white
// card, white on the grey page, a light tint on a dark card.
// (Filter chips, which are buttons, are Tag with as="button".)
export type CardTagsSurface = 'card' | 'page' | 'dark'

const SURFACE_CLASS: Record<CardTagsSurface, string> = {
  card: 'bg-muted text-foreground',
  page: 'bg-background text-foreground',
  dark: 'bg-background/15 text-background',
}

export function CardTags({ tags, surface = 'card' }: { tags: string[]; surface?: CardTagsSurface }) {
  if (!tags.length) return null
  return (
    <ul className="flex flex-wrap gap-xs">
      {tags.map((tag) => (
        <li key={tag} className={`rounded-full px-small-medium py-xs text-caption font-medium ${SURFACE_CLASS[surface]}`}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
