'use client'
import { useEffect, useRef, useState } from 'react'
import type { AllyScene } from './allyScene'

// Ally in 3D (see allyScene.ts), filling this box. three.js and the model
// load only in the browser, after the page itself (so the hero's text is
// never held up), and fade in once built. Animates only while on screen;
// with reduced motion she's drawn once, still and facing front.
export function Ally3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let scene: AllyScene | undefined
    let observer: IntersectionObserver | undefined
    let cancelled = false
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    import('./allyScene').then(({ createAllyScene }) => {
      if (cancelled) return
      scene = createAllyScene(el, { reducedMotion })
      setReady(true)
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? scene?.start() : scene?.stop()))
      observer.observe(el)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      scene?.dispose()
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
    />
  )
}
