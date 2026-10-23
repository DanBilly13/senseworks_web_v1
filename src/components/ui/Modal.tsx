'use client'
import { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  // 'inverse' for a dark card (e.g. the team member modal) — mirrors
  // Button/SectionIntro's own tone prop rather than inventing a new
  // naming convention for the same light/dark idea.
  tone?: 'default' | 'inverse'
  // 'lg' is the wide, two-column form-style modal (Book a meeting) —
  // page-width-ish card with responsive padding. 'sm' is the original
  // narrow card (team member, Bento Grid).
  // 'xl' is wider still (1200px), for two full columns side by side —
  // Book a webinar's text and its form card.
  size?: 'sm' | 'lg' | 'xl'
  // The dialog's own accessible name still comes from `title`; this
  // only controls whether it's also drawn as a heading. A caller that
  // renders its own, bigger heading inside (Book a meeting) turns it off.
  showTitle?: boolean
  // 'muted': the page's light grey instead of white. Ignored with tone
  // inverse.
  surface?: 'default' | 'muted'
  // false: no inner padding, for content that runs edge to edge and
  // pads itself (Book a webinar's grey and white halves).
  padded?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  children,
  tone = 'default',
  size = 'sm',
  showTitle = true,
  surface = 'default',
  padded = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    // Stops the page behind from scrolling under the dialog (Lenis
    // drives the real window scroll, so this is on <html>, not just
    // <body>).
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    // data-lenis-prevent: lets the dialog's own content scroll natively
    // when it's taller than the viewport, instead of Lenis eating the
    // wheel events for the (now locked) page behind it.
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-medium-large"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={[
          'relative flex max-h-full w-full flex-col overflow-hidden rounded-lg',
          size === 'xl' ? 'max-w-modal-xl' : size === 'lg' ? 'max-w-prose-xl' : 'max-w-prose-sm',
          tone === 'inverse'
            ? 'bg-foreground text-background'
            : surface === 'muted'
              ? 'bg-muted text-foreground'
              : 'bg-background text-foreground',
        ].join(' ')}
      >
        {/* Absolutely positioned against this outer, unpadded box
            (matches the Figma source) — 16px from the true edge,
            independent of the padded content div below. Nesting the
            button inside that padded div instead would measure its
            offset from the padding edge, not the card's actual
            corner. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={[
            'absolute top-medium right-medium flex size-large items-center justify-center rounded-full',
            tone === 'inverse' ? 'hover:bg-background/10' : 'hover:bg-muted',
          ].join(' ')}
        >
          <CloseOutlined />
        </button>
        <div
          className={[
            'flex flex-col gap-medium overflow-y-auto overscroll-contain',
            !padded ? '' : size === 'lg' || size === 'xl' ? 'p-large md:p-2xl' : 'p-xl',
          ].join(' ')}
        >
          {/* inverse callers (team member card) render their own name
              heading inline with the photo — `title` still sets the
              dialog's accessible name, it just isn't drawn twice. */}
          {title && showTitle && tone !== 'inverse' && (
            <h4 className="pr-2xl text-h4 font-bold text-balance">{title}</h4>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
