'use client'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type LogoCloudItem = { name: string; media?: MediaField }
type LogoCloudBlockProps = {
  logos?: LogoCloudItem[]
}

const PIXELS_PER_SECOND = 40

export function LogoCloudBlock({ logos = [] }: LogoCloudBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(2)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const wrapper = wrapperRef.current
    const set = setRef.current
    if (!wrapper || !set) return

    const measure = () => {
      const measuredSetWidth = set.getBoundingClientRect().width
      const wrapperWidth = wrapper.getBoundingClientRect().width
      if (measuredSetWidth === 0) return
      setSetWidth(measuredSetWidth)
      // A fixed 2 copies breaks on a wide/ultrawide monitor (D15) once
      // the visible track is wider than one loop of logos — the strip
      // runs out of content and scrolls to blank. Always render enough
      // copies to keep the track at least 2x the wrapper's width, so
      // there's never a gap between one loop ending and the next
      // beginning.
      setCopies(Math.max(2, Math.ceil((wrapperWidth * 2) / measuredSetWidth)))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [logos.length])

  // D7: a block with no content simply doesn't render.
  if (!logos.length) return null

  return (
    <SectionShell py="large">
      <div ref={wrapperRef} className="overflow-hidden">
        <div
          className="logo-marquee-track flex w-max items-center"
          style={{
            // Shift by exactly one measured set's pixel width, not a
            // percentage of the whole track — percentages plus flex
            // `gap` don't divide evenly once there's more than one
            // extra copy (the last item in each copy contributes a
            // trailing gap the percentage math doesn't account for),
            // which showed up as a visible jump at the loop point.
            '--marquee-set-width': `${setWidth}px`,
            animationDuration: setWidth ? `${setWidth / PIXELS_PER_SECOND}s` : undefined,
          } as CSSProperties}
        >
          {Array.from({ length: copies }).map((_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? setRef : undefined}
              className="flex shrink-0 items-center"
            >
              {logos.map((logo, logoIndex) => (
                <Media
                  key={logoIndex}
                  media={logo.media}
                  alt={logo.name}
                  className="mr-2xl h-xl w-3xl shrink-0 rounded-md"
                  fit="contain"
                  ariaHidden={copyIndex > 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
