'use client'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type ScaledCanvasProps = {
  // The fixed pixel canvas an animation was authored at (its Claude
  // Design artboard size, e.g. 700x500) — every position/size inside
  // `children` is a literal px number in this space, including
  // anything that deliberately overflows the edges.
  canvasWidth: number
  canvasHeight: number
  children: ReactNode
}

// Scales a fixed-canvas animation uniformly to whatever width its
// container ends up being (100%/50%/33% media frames, any viewport),
// preserving every internal position and any intentional crop exactly
// — a CSS transform moves clipped content along with everything else,
// unlike relative units or reflow would. See the animation-export
// prompt this pairs with for the authoring rules on the canvas side.
export function ScaledCanvas({ canvasWidth, canvasHeight, children }: ScaledCanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => setScale(frame.getBoundingClientRect().width / canvasWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [canvasWidth])

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden" style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  )
}
