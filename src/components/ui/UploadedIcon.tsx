import type { SanityImageSource } from '@sanity/image-url'
import { iconUrlFor, maskUrlFor } from '@/lib/sanity/image'

// An icon an editor uploaded in Studio. `ink` is the colour for its
// black (a '#rrggbb' value) — dark on a light card, white on a dark one.
//
// An SVG keeps any other colours it has (an Audit-purple accent, say) and
// only its near-black parts follow `ink` (the route handler does the
// swap). A PNG has no separable colours, so it is drawn as a single-
// colour shape in `ink`.
export function UploadedIcon({
  source,
  ink,
  className,
}: {
  source: SanityImageSource
  ink: string
  className?: string
}) {
  const ref = (source as { asset?: { _ref?: string } })?.asset?._ref ?? ''
  if (ref.endsWith('-svg')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- an SVG needs no optimisation
      <img
        src={iconUrlFor(source, ink)}
        alt=""
        aria-hidden="true"
        className={['object-contain', className].filter(Boolean).join(' ')}
      />
    )
  }
  const url = maskUrlFor(source)
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: ink,
        maskImage: `url(${url})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskImage: `url(${url})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}
