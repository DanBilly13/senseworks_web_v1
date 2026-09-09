type TagProps = {
  children: string
  active?: boolean
  as?: 'span' | 'button'
  onClick?: () => void
}

// A small pill used for article tags/categories — both as a static
// label (article cards) and as a toggle (the Knowledge Bank filter
// bar), so it takes an `active` state and can render as a <button>.
export function Tag({ children, active = false, as = 'span', onClick }: TagProps) {
  const className = [
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
