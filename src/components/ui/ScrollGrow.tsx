'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from 'framer-motion'

// Media's "Grow on scroll": the frame zooms from half size, as its top
// comes up into the screen, to full size once its middle reaches the
// middle of the screen, during ordinary scrolling — the page doesn't get
// any longer. ninesixty.co.uk's settings exactly (their GSAP: from scale
// .5, start "top bottom", end "center center", default ease power1.out,
// scrub with no lag): quick at first, slowing as it nears full size,
// and locked to the scroll. The glide comes from the page's own smooth
// scroll (Lenis here, ScrollSmoother there); smoothing the size on top
// of that made it drift out of step with the page. Pinned, it's full
// size before it sticks.
// The scale is a transform, so the layout (and StickToBottom's
// measuring) never changes. It grows from the top edge, so the space
// above it (Top padding, the block before) stays as set and the space
// below takes up the difference. Reduced motion: full size throughout.
// From tablet up the frame's 16px corners would shrink with it, so this
// box clips to 16px divided by the scale (.scroll-grow in globals.css):
// 16px on screen at every size. Phones' frame is square anyway.
const START_SCALE = 0.5
const clamp = (p: number) => Math.min(1, Math.max(0, p))
// GSAP's power1.out.
const easeOut = (p: number) => 1 - (1 - p) ** 2

// `phone` / `desktop`: whether it grows on that screen size (Media's
// Mobile tab can switch it off on one); off, it stays full size.
export function ScrollGrow({ children, phone = true, desktop = true }: { children: ReactNode; phone?: boolean; desktop?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = matchMedia('(min-width: 48rem)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const reduced = reducedMotion || !(isDesktop ? desktop : phone)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // A function, not a keyframe range: a plain range is handed to the
  // browser's own scroll animation, which can snap back past its end.
  const scale = useTransform(scrollYProgress, (p) => START_SCALE + (1 - START_SCALE) * easeOut(clamp(p)))
  return (
    <div ref={ref}>
      <motion.div className="scroll-grow origin-top" style={reduced ? undefined : ({ scale, '--scroll-grow-scale': scale } as MotionStyle)}>
        {children}
      </motion.div>
    </div>
  )
}
