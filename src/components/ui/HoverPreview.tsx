'use client'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// The preview's size: up to 56rem (896px) wide, never closer than 32px
// to the window's sides or top/bottom, in the thumbnail's own 7:5 shape.
const MAX_WIDTH = 896
const MARGIN = 32
const RATIO = 7 / 5
// How long the pointer rests on the thumbnail before the preview opens,
// so sweeping the mouse across a row of cards doesn't flash them all.
const OPEN_DELAY = 250

type Box = { left: number; top: number; width: number; height: number; originX: number; originY: number; from: number }

// A larger look at a small image on hover (Release Cards): the preview
// grows out of the thumbnail, centred on it and kept inside the window.
// It's pointer-events: none, so it lasts exactly as long as the mouse is
// on the thumbnail underneath, and closes on scroll. Mouse only — touch
// screens have no hover, so they just see the card as it is.
export function HoverPreview({ children, preview }: { children: ReactNode; preview: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [box, setBox] = useState<Box | null>(null)
  const [shown, setShown] = useState(false)

  const close = () => {
    clearTimeout(timer.current)
    setShown(false)
    setBox(null)
  }

  const open = () => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const width = Math.min(MAX_WIDTH, window.innerWidth - 2 * MARGIN, (window.innerHeight - 2 * MARGIN) * RATIO)
    // A thumbnail already about that big doesn't need a preview.
    if (width < r.width * 1.3) return
    const height = width / RATIO
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
    const left = clamp(r.left + r.width / 2 - width / 2, MARGIN, window.innerWidth - MARGIN - width)
    const top = clamp(r.top + r.height / 2 - height / 2, MARGIN, window.innerHeight - MARGIN - height)
    // Grow from the thumbnail's centre, wherever that sits in the preview.
    setBox({ left, top, width, height, originX: r.left + r.width / 2 - left, originY: r.top + r.height / 2 - top, from: r.width / width })
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
  }

  useEffect(() => {
    if (!box) return
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
    }
  }, [box])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        clearTimeout(timer.current)
        timer.current = setTimeout(open, OPEN_DELAY)
      }}
      onPointerLeave={close}
    >
      {children}
      {box &&
        createPortal(
          <div
            aria-hidden="true"
            data-shown={shown || undefined}
            className="hover-preview pointer-events-none fixed z-50 overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-foreground/20"
            style={{
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              transformOrigin: `${box.originX}px ${box.originY}px`,
              '--hover-preview-from': box.from,
            } as CSSProperties}
          >
            {preview}
          </div>,
          document.body,
        )}
    </div>
  )
}
