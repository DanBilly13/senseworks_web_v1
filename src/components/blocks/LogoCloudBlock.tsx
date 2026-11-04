'use client'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { BAND_BG, type BandSpacing } from '@/components/ui/BandFill'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type LogoCloudItem = { name: string; media?: MediaField }
type LogoCloudBlockProps = {
  logos?: LogoCloudItem[]
  spacing?: BandSpacing
  // A full screen width background, the logos in the page column on
  // top. There's no text in this block, so no colour switching beyond
  // the background itself. Light grey, as it has always been, unless set.
  tone?: 'none' | 'light' | 'dark' | 'accent' | 'accentGradient' | 'accentDark'
  // The space inside the background, above and below the logos (the
  // same rule as ui/BandFill): left unset, none without a background
  // and Medium with one. Section spacing is the gap after the block.
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
}

const SECTION_BG: Record<NonNullable<LogoCloudBlockProps['tone']>, string> = {
  none: '',
  light: 'bg-muted',
  ...BAND_BG,
}

const PIXELS_PER_SECOND = 42

export function LogoCloudBlock({ logos = [], spacing = 'loose', tone = 'light', paddingTop, paddingBottom }: LogoCloudBlockProps) {
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

  const unset: BandSpacing = tone === 'none' ? 'none' : 'medium'
  return (
    <SectionShell
      pt={paddingTop ?? unset}
      py={paddingBottom ?? unset}
      sectionClassName={`${SECTION_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}
    >
      <div ref={wrapperRef} className="overflow-hidden">
        <div
          // The animation class is only added once `setWidth` is measured
          // (not present at initial mount, when animation-duration would
          // still be unset/0s) — Safari has a long-standing bug where
          // updating animation-duration on an already-applied infinite
          // animation is silently ignored, so the marquee would mount,
          // "finish" its animation at 0s, and never pick up the real
          // duration once ResizeObserver measured it (reproduced on iOS
          // Safari; Chrome/Firefox pick up the update fine either way).
          // Applying the class only once the real duration is known
          // avoids ever updating a running animation in the first place.
          className={`flex w-max items-center ${setWidth ? 'logo-marquee-track' : ''}`}
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
                <div key={logoIndex} className="mr-large h-xl w-3xl shrink-0 p-small md:mr-2xl">
                  <Media
                    media={logo.media}
                    alt={logo.name}
                    className="size-full"
                    fit="contain"
                    background="none"
                    ariaHidden={copyIndex > 0}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
