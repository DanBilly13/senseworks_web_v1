'use client'
import { useEffect, useRef } from 'react'

// Rendered inside a `sticky` element: sets its `top` so it pins when its
// bottom edge reaches the bottom of the screen, not its top edge the
// top. For an element taller than the screen (a hero with a long
// headline) that's the difference between showing its foot and never
// showing it. Re-measured whenever the element or the screen resizes.
export function StickToBottom() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const fit = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])
  return <span ref={ref} hidden />
}
