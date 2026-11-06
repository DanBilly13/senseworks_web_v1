'use client'
import { useEffect, useRef } from 'react'

// Rendered inside a `sticky` element: sets its `top` so one taller than
// the screen (a hero with a long headline, a tall Media block) pins when
// its bottom edge reaches the bottom of the screen, not its top edge the
// top — the difference between showing its foot and never showing it.
// One that fits the screen pins at the very top (the header hides as you
// scroll down), or, given `belowHeader` (px), that far below where the
// nav bar sits, as far as the screen has room: if it doesn't, it pins
// with its bottom at the bottom of the screen. Re-measured whenever it or
// the screen resizes.
export function StickToBottom({ belowHeader }: { belowHeader?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const fit = () => {
      const room = window.innerHeight - el.offsetHeight
      if (belowHeader === undefined || room < 0) {
        el.style.top = `${Math.min(0, room)}px`
        return
      }
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
      el.style.top = `${Math.min(header + belowHeader, room)}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [belowHeader])
  return <span ref={ref} hidden />
}
