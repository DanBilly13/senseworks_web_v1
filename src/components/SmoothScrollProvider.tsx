'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

// Site-wide smooth/eased scroll (the "floaty" feel Dan wanted, seen
// around the web) — Lenis smooths the REAL scroll position (native
// window.scrollY, not a transformed wrapper), which is why position:
// sticky (ScrollRevealStage, HeroImageOverlayCard's pin) and
// IntersectionObserver (useInView) keep working unmodified — both
// just react to whatever the current real scroll position is, however
// it got there.
//
// Framer Motion's useScroll (HeroImageOverlayCard's morph) and our
// own PlayOnScrollMedia are a different story: both listen for the
// native `scroll` event specifically, and confirmed by hand — Lenis
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
  useEffect(() => {
    const lenis = new Lenis()
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
      lenis.destroy()
    }
  }, [])

  return null
}
