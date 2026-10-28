'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// Site-wide smooth/eased scroll (the "floaty" feel Dan wanted, seen
// around the web) — Lenis smooths the REAL scroll position (native
// window.scrollY, not a transformed wrapper), which is why position:
// sticky (ScrollRevealStage, HeroImageOverlayCard's pin) and
// IntersectionObserver (useInView) keep working unmodified — both
// just react to whatever the current real scroll position is, however
// it got there.
//
// Framer Motion's useScroll (HeroImageOverlayCard's morph) is a
// different story: it listens for the native `scroll` event
// specifically, and confirmed by hand — Lenis
// updates window.scrollY correctly but never fires that event on its
// own (0 fired across a 0→500px scroll in testing). Re-dispatching a
// real scroll event from Lenis's own `scroll` callback is the
// standard fix for this — EXCEPT Lenis also listens for the native
// scroll event itself (to reconcile its own state), so a naive
// dispatch re-enters Lenis's own handler, which re-emits its `scroll`
// event, which re-triggers this callback, forever — confirmed the
// hard way as an actual "Maximum call stack size exceeded" crash, not
// a hypothetical. isDispatching guards against exactly that re-entry:
// Lenis's own re-triggered call happens synchronously inside the
// dispatchEvent call below, so the guard is already true by the time
// it loops back here, and the recursive call is a no-op.
export function SmoothScrollProvider() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  // Set by a Back/Forward press, which should land where you were on
  // that page, not at the top.
  const isPopState = useRef(false)

  useEffect(() => {
    // Measure and observe <body>, not the default <html>: the root
    // layout gives <html> h-full, so its own box never grows as content
    // loads in below it. Lenis only re-measures the page when that
    // observed box resizes, so it kept the limit it first saw and the
    // wheel went dead at that point on a long page ("stops scrolling").
    // <body> is min-h-full, so it grows with the content.
    const lenis = new Lenis({ content: document.body })
    lenisRef.current = lenis
    const onPopState = () => {
      isPopState.current = true
    }
    window.addEventListener('popstate', onPopState)
    let isDispatching = false
    lenis.on('scroll', () => {
      if (isDispatching) return
      isDispatching = true
      window.dispatchEvent(new Event('scroll'))
      isDispatching = false
    })

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('popstate', onPopState)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // A new page starts at the top. Next.js scrolls the window there on a
  // client-side navigation, but Lenis keeps its own copy of the scroll
  // position and eased the page straight back to where the last page
  // was left. Jumping Lenis to the top (immediately, no easing) on each
  // route change fixes that. Skipped for Back/Forward (the browser
  // restores the old position) and for a link to a #section.
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (isPopState.current) {
      isPopState.current = false
      return
    }
    if (window.location.hash) return
    lenis.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
