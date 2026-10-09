'use client'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

// The card-carousel mechanics shared by Testimonial Carousel and Case
// Study Card Grid: a full-bleed, snap-scrolling row whose first card
// lines up with the page content (.carousel-inset), plus prev/next
// buttons that step one card at a time and disable at either end.
export function useCarousel(itemCount: number) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    // A small tolerance, not an exact 0/max comparison: scroll-snap
    // combined with the scroller's own leading inset can settle a
    // couple of pixels off scrollLeft 0 depending on the browser.
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEdges()
  }, [itemCount])

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    const card = firstCardRef.current
    if (!el || !card || !el.scrollBy) return
    const gap = parseFloat(getComputedStyle(el).columnGap || '0')
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  return { scrollerRef, firstCardRef, atStart, atEnd, updateEdges, scrollByCard }
}

export function CarouselNav({
  label,
  atStart,
  atEnd,
  onStep,
}: {
  // Plural noun for the button labels: "Previous <label>" / "Next <label>".
  label: string
  atStart: boolean
  atEnd: boolean
  onStep: (direction: 1 | -1) => void
}) {
  return (
    <div className="flex shrink-0 gap-small">
      <button
        type="button"
        onClick={() => onStep(-1)}
        disabled={atStart}
        aria-label={`Previous ${label}`}
        className="flex size-xl items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30"
      >
        <LeftOutlined />
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        disabled={atEnd}
        aria-label={`Next ${label}`}
        className="flex size-xl items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30"
      >
        <RightOutlined />
      </button>
    </div>
  )
}

export function CarouselScroller({
  scrollerRef,
  onScroll,
  className,
  children,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>
  onScroll: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className={[
        'carousel-inset scrollbar-hide flex snap-x snap-mandatory gap-large overflow-x-auto scroll-smooth py-small',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
