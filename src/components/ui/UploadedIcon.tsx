import type { CSSProperties } from 'react'
import type { SanityImageSource } from '@sanity/image-url'
import { iconLayerUrlFor, maskUrlFor } from '@/lib/sanity/image'

// What the icon sits on: a light card, a dark one, or an accent-filled
// panel (Dark Banner's accent tone).
export type IconSurface = 'light' | 'dark' | 'accent'
type Slot = 'ink' | 'paper' | 'accent'

// Colour per slot (see lib/svgLayer) on each surface — all CSS
// variables, so the page theme's accent reaches the icon with no prop:
// yellow by default, purple on Audit pages, green on Analysis.
const SLOT_COLOR: Record<IconSurface, Record<Slot, string>> = {
  light: { ink: 'var(--color-foreground)', paper: 'var(--color-background)', accent: 'var(--color-accent)' },
  dark: { ink: 'var(--color-background)', paper: 'var(--color-foreground)', accent: 'var(--color-accent)' },
  // The accent would vanish into an accent panel, so it goes white there.
  accent: { ink: 'var(--color-foreground)', paper: 'var(--color-accent)', accent: 'var(--color-background)' },
}

function maskStyle(url: string, color: string, mode: 'alpha' | 'luminance'): CSSProperties {
  return {
    backgroundColor: color,
    maskImage: `url(${url})`,
    maskMode: mode,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskImage: `url(${url})`,
    WebkitMaskSourceType: mode,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'contain',
  } as CSSProperties
}

// An icon an editor uploaded in Studio.
//
// An SVG is split into three colour slots — its black lines, its white
// parts and its accent (any real colour) — each drawn as a mask in the
// colour that slot takes on this surface and page theme. An editor just
// uploads the file; whichever accent it was drawn in is swapped for the
// page's own. A PNG has no separable colours, so it is drawn as a single-
// colour shape in the ink colour.
export function UploadedIcon({
  source,
  surface = 'light',
  className,
}: {
  source: SanityImageSource
  surface?: IconSurface
  className?: string
}) {
  const ref = (source as { asset?: { _ref?: string } })?.asset?._ref ?? ''
  const colors = SLOT_COLOR[surface]
  if (ref.endsWith('-svg')) {
    return (
      <span aria-hidden="true" className={['relative block', className].filter(Boolean).join(' ')}>
        {(['accent', 'paper', 'ink'] as const).map((slot) => (
          <span
            key={slot}
            data-slot={slot}
            className="absolute inset-0"
            style={maskStyle(iconLayerUrlFor(source, slot), colors[slot], 'luminance')}
          />
        ))}
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={['block', className].filter(Boolean).join(' ')}
      style={maskStyle(maskUrlFor(source), colors.ink, 'alpha')}
    />
  )
}
