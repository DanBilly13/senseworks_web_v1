import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// A generic icon action button (Like, Share, Bookmark, ...) — not
// wired to antd itself (the caller passes whatever icon element it
// needs via `icon`), so this file doesn't need 'use client' for D16's
// reasoning; only the icon element itself has to be constructed
// inside a client-boundary file (see AuthorAvatar for why).
export const iconButtonVariants = cva(
  // shrink-0 matters here specifically: a flex row that's short on
  // space (e.g. a long author name next to these on mobile) will
  // otherwise compress the button's width below its fixed h-xl
  // height — flex-shrink only fights the main-axis (width) dimension
  // in a row, not height — turning the circle into a vertical
  // capsule. text-body (16px), not text-body-sm (14px): antd icons
  // size themselves off font-size, and render poorly under 16px.
  'inline-flex h-xl shrink-0 items-center justify-center gap-xs rounded-full text-body font-medium transition-colors disabled:opacity-50',
  {
    variants: {
      variant: {
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        outline: 'border border-border text-foreground hover:bg-muted',
      },
      active: {
        true: 'text-foreground',
        false: '',
      },
    },
    defaultVariants: { variant: 'ghost', active: false },
  },
)

type IconButtonProps = VariantProps<typeof iconButtonVariants> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    icon: ReactNode
    // Omitting this renders a plain circular icon-only button (e.g.
    // Like with no visible count); passing one turns it into a pill
    // with trailing text (e.g. Share's "Copied!" confirmation).
    label?: ReactNode
    className?: string
  }

export function IconButton({
  icon,
  label,
  variant,
  active,
  className,
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={[
        iconButtonVariants({ variant, active }),
        label == null ? 'w-xl' : 'px-medium',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...buttonProps}
    >
      {icon}
      {label != null && <span>{label}</span>}
    </button>
  )
}
