type TagColor = 'purple' | 'green' | 'yellow'

const COLOR_CLASS: Record<TagColor, string> = {
  purple: 'bg-tag-purple text-tag-purple-text',
  green: 'bg-tag-green text-tag-green-text',
  yellow: 'bg-tag-yellow text-tag-yellow-text',
}

type TagProps = {
  children: string
  active?: boolean
  // A colored chip (square-ish corners) instead of the neutral pill —
  // for labels that carry a category, like a project card's tag.
  color?: TagColor
  as?: 'span' | 'button'
  onClick?: () => void
}

// A small pill used for article tags/categories — both as a static
// label (article cards) and as a toggle (the Knowledge Bank filter
// bar), so it takes an `active` state and can render as a <button>.
export function Tag({ children, active = false, color, as = 'span', onClick }: TagProps) {
  const className = color
    ? `rounded-md px-small-medium py-xs text-caption font-medium ${COLOR_CLASS[color]}`
    : [
        'rounded-full px-small-medium py-xs text-caption font-medium transition-colors',
        active ? 'bg-foreground text-background' : 'bg-muted text-foreground',
      ].join(' ')

  if (as === 'button') {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={className}>
        {children}
      </button>
    )
  }

  return <span className={className}>{children}</span>
}
