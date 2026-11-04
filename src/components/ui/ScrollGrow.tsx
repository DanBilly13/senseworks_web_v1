'use client'
import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from 'framer-motion'

// Media's "Grow on scroll": the frame zooms from half size, as its top
// comes up into the screen, to full size by the time it's centred on
// screen (like ninesixty.co.uk), during ordinary scrolling — the page
// doesn't get any longer. Pinned, it's full size well before it sticks.
// The scale is a transform, so the layout (and StickToBottom's
// measuring) never changes. Reduced motion: full size throughout.
// From tablet up the frame's 16px corners would shrink with it, so this
// box clips to 16px divided by the scale (.scroll-grow in globals.css):
// 16px on screen at every size. Phones' frame is square anyway.
const START_SCALE = 0.5
const clamp = (p: number) => Math.min(1, Math.max(0, p))

export function ScrollGrow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // A function, not a keyframe range: a plain range is handed to the
  // browser's own scroll animation, which can snap back past its end.
  const scale = useTransform(scrollYProgress, (p) => START_SCALE + (1 - START_SCALE) * clamp(p))
  return (
    <div ref={ref}>
      <motion.div className="scroll-grow" style={reduced ? undefined : ({ scale, '--scroll-grow-scale': scale } as MotionStyle)}>
        {children}
      </motion.div>
    </div>
  )
}
