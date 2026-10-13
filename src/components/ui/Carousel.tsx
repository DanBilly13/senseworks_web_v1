'use client'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

// The card-carousel mechanics shared by Testimonial Carousel and Case
// Study Card Grid: a full-bleed, snap-scrolling row whose first card
// lines up with the page content (.carousel-inset), plus prev/next
// buttons that step one card at a time and disable at either end.
// `canScroll` is false when every card already fits on screen (a wide
// monitor, few cards) — callers hide the buttons then, rather than
// showing two permanently greyed-out ones that look broken.
export function useCarousel(itemCount: number) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [canScroll, setCanScroll] = useState(true)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    // A small tolerance, not an exact 0/max comparison: scroll-snap
    // combined with the scroller's own leading inset can settle a
    // couple of pixels off scrollLeft 0 depending on the browser.
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    setCanScroll(el.scrollWidth - el.clientWidth > 4)
  }

  // Re-check on resize too, not just on scroll: widening the window can
  // make every card fit (or stop fitting) without any scroll happening.
  useEffect(() => {
    updateEdges()
    const el = scrollerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => updateEdges())
    observer.observe(el)
    return () => observer.disconnect()
  }, [itemCount])

  // Steps to the next/previous card's resting position, worked out
  // exactly rather than "scroll by one card width": when the row is only
  // a little wider than the screen, a full card-width step overshoots
  // the end, and mandatory scroll-snap had no valid point to land on and
  // sprang back — the buttons looked dead. The end of the row is always
  // a stop (the last card also snaps to the end, see CarouselScroller).
  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    const card = firstCardRef.current
    if (!el || !card || !el.scrollTo) return
    const max = el.scrollWidth - el.clientWidth
    const stops = [
      ...new Set(
        Array.from(el.children as HTMLCollectionOf<HTMLElement>).map((child) =>
          Math.min(max, Math.max(0, child.offsetLeft - card.offsetLeft)),
        ),
      ),
      max,
    ].sort((a, b) => a - b)
    const current = el.scrollLeft
    const target =
      direction === 1
        ? (stops.find((stop) => stop > current + 4) ?? max)
        : ([...stops].reverse().find((stop) => stop < current - 4) ?? 0)
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  return { scrollerRef, firstCardRef, atStart, atEnd, canScroll, updateEdges, scrollByCard }
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
        // The last card snaps to the end edge (every other card to its
        // start), so the very end of the row is a valid resting point.
        'carousel-inset scrollbar-hide flex snap-x snap-mandatory gap-large overflow-x-auto scroll-smooth py-small [&>*:last-child]:snap-end',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
