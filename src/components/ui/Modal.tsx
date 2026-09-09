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
}

export function Modal({ open, onClose, title, children, tone = 'default' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-medium-large"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={[
          'relative w-full max-w-prose-sm rounded-lg',
          tone === 'inverse' ? 'bg-foreground text-background' : 'bg-background text-foreground',
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
        <div className="flex flex-col gap-medium p-xl">
          {/* inverse callers (team member card) render their own name
              heading inline with the photo — `title` still sets the
              dialog's accessible name, it just isn't drawn twice. */}
          {title && tone !== 'inverse' && (
            <h4 className="pr-2xl text-h4 font-semibold text-balance">{title}</h4>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
