'use client'
import { useEffect, useRef, useState } from 'react'

// Rendered inside a pinned block's `sticky` element: keeps the header
// (nav bar and ticker tape) on screen while scrolling down, until the
// panel that scrolls over the pinned block (BlockRenderer: the sticky
// element's next sibling) has covered it completely. It hands the header
// that scroll position through the `data-keep-nav-visible-until` marker
// HeaderBlock already reads (the image hero uses it too). The marker must
// be laid out (not display:none), so it's a 1px, visually hidden span.
export function KeepNavUntilCovered() {
  const ref = useRef<HTMLSpanElement>(null)
  const [until, setUntil] = useState<number>()
  useEffect(() => {
    const sticky = ref.current?.parentElement
    const panel = sticky?.nextElementSibling
    if (!sticky || !panel) return
    const measure = () => {
      // Phones don't pin, so the nav hides on scroll as usual there.
      if (!matchMedia('(min-width: 48rem)').matches) return setUntil(undefined)
      // Covered once the panel's top edge reaches where the block sticks.
      const stuckAt = parseFloat(sticky.style.top) || 0
      setUntil(Math.round(panel.getBoundingClientRect().top + window.scrollY - stuckAt))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])
  return <span ref={ref} className="sr-only" aria-hidden data-keep-nav-visible-until={until} />
}
