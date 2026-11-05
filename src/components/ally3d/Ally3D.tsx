'use client'
import { useEffect, useRef, useState } from 'react'
import type { AllyScene } from './allyScene'

// Whether anything solid sits on top of Ally at this point of the screen:
// the first thing at that point with a background, picture or video of
// its own (a see-through wrapper doesn't count).
function coveredAt(x: number, y: number, canvas: HTMLElement) {
  for (const el of document.elementsFromPoint(x, y)) {
    // Reached Ally's own layer: her box, or one of the boxes she sits in
    // (her canvas takes no clicks, so it may not be listed itself).
    if (el === canvas || canvas.contains(el) || el.contains(canvas)) return false
    if (el instanceof HTMLVideoElement || el instanceof HTMLImageElement || el instanceof HTMLCanvasElement) return true
    const style = getComputedStyle(el)
    if (style.backgroundImage !== 'none') return true
    const bg = style.backgroundColor
    if (bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg)) return true
  }
  return false
}

// Ally in 3D (see allyScene.ts), filling this box. three.js and the model
// load only in the browser, after the page itself (so the hero's text is
// never held up), and fade in once built. Animates only while some of her
// can be seen: on screen, and not covered by the page scrolling over a
// pinned hero (drawing her unseen every frame made scrolling the rest of
// the page stutter). With reduced motion she's drawn once, still and
// facing front.
export function Ally3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let scene: AllyScene | undefined
    let observer: IntersectionObserver | undefined
    let onScreen = false
    let ticking = false
    let cancelled = false
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    // Visible when on screen and not covered at every one of a few points
    // across her (clipped to the screen).
    const update = () => {
      ticking = false
      if (!scene) return
      if (!onScreen) return scene.stop()
      const r = el.getBoundingClientRect()
      const top = Math.max(r.top, 0), bottom = Math.min(r.bottom, innerHeight)
      const left = Math.max(r.left, 0), right = Math.min(r.right, innerWidth)
      if (bottom <= top || right <= left) return scene.stop()
      const points: [number, number][] = [
        [0.5, 0.5],
        [0.5, 0.15],
        [0.3, 0.6],
        [0.7, 0.6],
        [0.5, 0.9],
      ]
      const seen = points.some(([fx, fy]) => !coveredAt(left + (right - left) * fx, top + (bottom - top) * fy, el))
      if (seen) scene.start()
      else scene.stop()
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    import('./allyScene').then(({ createAllyScene }) => {
      if (cancelled) return
      scene = createAllyScene(el, { reducedMotion })
      setReady(true)
      observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        update()
      })
      observer.observe(el)
      addEventListener('scroll', onScroll, { passive: true })
      addEventListener('resize', onScroll)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
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
