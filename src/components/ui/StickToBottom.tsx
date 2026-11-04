'use client'
import { useEffect, useRef } from 'react'

// Rendered inside a `sticky` element: sets its `top` so it pins when its
// bottom edge reaches the bottom of the screen, not its top edge the
// top. For an element taller than the screen (a hero with a long
// headline) that's the difference between showing its foot and never
// showing it; a shorter one (a Media block) pins as soon as it's fully
// on screen, so what follows starts sliding over it straight away, and
// never below its own place on the page (one in the first screen pins
// where it is). Re-measured whenever it, the page or the screen resizes.
export function StickToBottom() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const fit = () => {
      // Its place on the page, measured unpinned.
      el.style.top = ''
      const natural = el.getBoundingClientRect().top + window.scrollY
      el.style.top = `${Math.min(natural, window.innerHeight - el.offsetHeight)}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    observer.observe(document.body)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])
  return <span ref={ref} hidden />
}
