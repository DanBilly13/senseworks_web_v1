import type { ReactNode } from 'react'
import Link from 'next/link'

type MenuProps = {
  children: ReactNode
  className?: string
}

// A dropdown/popover menu shell: 4px padding, 4px gap between rows, 4px
// corners, 188px minimum width. Pairs with MenuItem — each item fills
// the shell's width so its hover highlight spans the full row, not
// just the label's own width.
export function Menu({ children, className }: MenuProps) {
  return (
    <div role="menu" className={`flex min-w-47 flex-col gap-xs rounded-sm bg-background p-xs ${className ?? ''}`.trim()}>
      {children}
    </div>
  )
}

type MenuItemProps = {
  children: ReactNode
  // An already-built icon element (e.g. `<FilePdfOutlined className="text-body" />`)
  // — same convention as IconButton: this file doesn't construct antd
  // icons itself, so it doesn't need 'use client' for D16's reasoning.
  // Each slot is a fixed 20px box; size the icon itself via `text-body`
  // (16px) per IconButton's own note on antd icon sizing.
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  className?: string
  onClick?: () => void
  // Renders as a real link (navigation, new-tab, screen readers) instead
  // of a button. Omit both this and `disabled` for a plain action item.
  href?: string
  // A row with no href yet (e.g. a "coming soon" item) — dimmed, inert.
  disabled?: boolean
}

export function MenuItem({ children, leadingIcon, trailingIcon, className, onClick, href, disabled }: MenuItemProps) {
  const rowClassName = [
    'flex w-full items-center gap-xs rounded-sm p-xs text-body-sm text-left transition-colors',
    disabled ? 'cursor-default text-muted-foreground' : 'text-foreground hover:bg-muted',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {leadingIcon && <span className="flex size-5 shrink-0 items-center justify-center">{leadingIcon}</span>}
      <span className="flex-1 truncate text-left">{children}</span>
      {trailingIcon && <span className="flex size-5 shrink-0 items-center justify-center">{trailingIcon}</span>}
    </>
  )

  if (disabled) {
    return (
      <div role="menuitem" aria-disabled="true" className={rowClassName}>
        {content}
      </div>
    )
  }

  if (href) {
    return (
      <Link href={href} role="menuitem" onClick={onClick} className={rowClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" role="menuitem" onClick={onClick} className={rowClassName}>
      {content}
    </button>
  )
}
