import { useEffect, useRef, useState } from 'react'

// Tracks whether a ref'd element is at least `threshold` visible —
// used to pause (not unmount) a reactAnimation once it drops back
// below that, or a video once it's covered/off-screen, so playback
// stops right where it was and picks back up from there rather than
// restarting or wasting cycles decoding something nobody can see.
//
// `initialInView` is what to assume before the observer's first
// callback has actually fired (there's always a brief window right
// after mount where that's true) — default false matches most
// callers ("assume not visible until proven otherwise"), but a
// caller deriving an INVERTED value from this (e.g. "revealed" as
// !inView) needs the opposite starting assumption, or that derived
// value has the wrong polarity for exactly that same brief window.
export function useInView<T extends HTMLElement>(threshold = 0.5, initialInView = false) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(initialInView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}
