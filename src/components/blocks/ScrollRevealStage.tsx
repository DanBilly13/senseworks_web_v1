'use client'
import type { ReactNode } from 'react'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'
import { useInView } from '@/lib/useInView'

type ScrollRevealStageProps = {
  media?: MediaField
  alt: string
  mediaWidth: 'full' | 'content'
  children: ReactNode
}

// The interactive half of HeroBlock's scrollReveal layout — isolated
// into its own 'use client' component so the rest of HeroBlock.tsx
// (every other Hero layout) can stay a plain Server Component.
//
// Watches the yellow cover block itself (threshold 0 — "in view"
// means even a sliver of it is still on screen) rather than the
// media: the sticky media box is geometrically in the viewport for
// its entire stuck range, including while the yellow block is still
// covering it, so observing the media directly would report "visible"
// immediately and never reflect whether it's actually revealed.
// Watching the thing that has to fully leave first is what actually
// tracks "revealed."
export function ScrollRevealStage({ media, alt, mediaWidth, children }: ScrollRevealStageProps) {
  // initialInView: true — before the observer's first callback,
  // assume the yellow block IS covering the media (it visually is,
  // at scroll position 0), so `revealed` starts false and the video
  // doesn't get a moment of `autoPlay` before this corrects.
  const [yellowRef, yellowInView] = useInView<HTMLElement>(0, true)
  const revealed = !yellowInView

  return (
    <>
      {/* The reveal: media in a sticky box. This outer box stays
          h-screen/w-full regardless of mediaWidth — that's what the
          stuck-range math and the yellow block's overlap both depend
          on. mediaWidth only changes what's INSIDE it. */}
      <div className="sticky top-0 h-screen w-full">
        {mediaWidth === 'content' ? (
          <div className="mx-auto flex size-full max-w-page items-center px-medium-large">
            {/* aspect-media (7:5) — this video is being re-exported at
                1600x1142 to match, replacing the earlier 1600x1200
                (4:3) cut. Same token every other Media placement on
                the site already uses (Hero split, Feature Split,
                Bento Grid, Media block), not the fixed-canvas one
                (that's for the unrelated 4:3 product-walkthrough
                asset on Hero Backdrop). */}
            <div className="aspect-media w-full">
              <Media
                media={media}
                alt={alt}
                // border/shadow so the content-width box reads as a
                // card against the page background, same treatment
                // as other framed cards on the site (Header's dropdown
                // menu, Knowledge Bank article cards).
                className="size-full rounded-lg border border-border shadow-lg"
                fit="contain"
                paused={!revealed}
              />
            </div>
          </div>
        ) : (
          <Media media={media} alt={alt} className="size-full" paused={!revealed} />
        )}
      </div>
      {/* The cover: yellow block, pulled up by its own full height so
          it starts out exactly overlapping the sticky media above —
          normal document flow, no z-index tricks needed, later-in-
          DOM already wins. Always full width/height regardless of
          mediaWidth — it only needs to be at least as big as the
          media to cover it, and content-width media is always
          smaller/centered within the same space this already covers.
          As the user scrolls, this scrolls away like any other
          content while the sticky media stays put, uncovering it —
          and its own visibility is what drives `revealed` above. */}
      <section
        ref={yellowRef}
        className="relative flex h-screen w-full flex-col items-center justify-center bg-accent px-medium-large py-section-edge"
        style={{ marginTop: '-100vh' }}
      >
        {children}
      </section>
      {/* The dwell: extra, empty scroll room so the media stays stuck
          — genuinely revealed, not a single-frame flash — for a
          while after the yellow block clears. Sized 50vh, not a full
          screen: the sticky box is stuck for (this wrapper's total
          height − the sticky box's own height) of scrolling, stuck
          from the very top of the wrapper — so this spacer is the
          ONLY thing standing between "zero reveal time" and "some."
          The dwell that quietly comes STILL last another full screen
          after this content ends — see the note below. */}
      <div className="w-full" style={{ height: '50vh' }} aria-hidden="true" />
      {/* The unavoidable tail: position: sticky's own release
          mechanics always cost exactly one screen's worth of "dead"
          scroll after it unsticks — the moment it releases, it snaps
          to its natural (already-long-scrolled-past) document
          position and vanishes, and the wrapper needs that much more
          height regardless of how much (or how little) dwell time is
          configured above. This isn't tunable away without a
          different technique entirely (e.g. a JS scroll-driven
          reveal instead of pure CSS sticky) — flagging it here rather
          than pretending it's a spacer size to fiddle with. */}
      <div className="h-screen w-full" aria-hidden="true" />
    </>
  )
}
