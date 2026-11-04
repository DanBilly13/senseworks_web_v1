'use client'
import { useEffect, useRef } from 'react'

// Rendered inside a `sticky` element: sets its `top` so one taller than
// the screen (a hero with a long headline, a tall Media block) pins when
// its bottom edge reaches the bottom of the screen, not its top edge the
// top — the difference between showing its foot and never showing it.
// One that fits the screen pins at the very top (the header hides as you
// scroll down). Re-measured whenever it or the screen resizes.
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
