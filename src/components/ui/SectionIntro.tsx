import type { ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3'

type SectionIntroProps = {
  as: HeadingLevel
  eyebrow?: string
  heading?: string
  body?: string
  cta?: ReactNode
  align?: 'left' | 'center'
  maxWidth?: 'sm' | 'md' | 'none'
  // 'inverse' for light text on a dark/foreground-colored surface
  // (e.g. an image-overlay hero) — mirrors Button's inverse variant.
  tone?: 'default' | 'inverse'
}

const HEADING_TEXT_CLASS: Record<HeadingLevel, string> = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
}

const MAX_WIDTH_CLASS = {
  sm: 'max-w-prose-sm',
  md: 'max-w-prose-md',
  none: '',
}

export function SectionIntro({
  as: Heading,
  eyebrow,
  heading,
  body,
  cta,
  align = 'left',
  maxWidth = 'none',
  tone = 'default',
}: SectionIntroProps) {
  // A block with neither an eyebrow nor a heading has no intro to show
  // (e.g. Stats Band's intro is entirely optional).
  if (!eyebrow && !heading) return null

  const eyebrowColor = tone === 'inverse' ? 'text-background/70' : 'text-muted-foreground'
  const headingColor = tone === 'inverse' ? 'text-background' : 'text-foreground'
  const bodyColor = tone === 'inverse' ? 'text-background/80' : 'text-muted-foreground'

  return (
    <div
      className={[
        'flex flex-col gap-medium',
        MAX_WIDTH_CLASS[maxWidth],
        // mx-auto + max-w-* needs an explicit w-full alongside it in a
        // flex context, or the box shrink-wraps to content instead of
        // reliably being max-w-* wide (see AGENTS.md) — this bit the
        // FAQ accordion once already.
        align === 'center' ? 'mx-auto w-full items-center text-center' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow && (
        <p className={`text-caption font-semibold uppercase ${eyebrowColor}`}>{eyebrow}</p>
      )}
      {heading && (
        <Heading
          className={[
            HEADING_TEXT_CLASS[Heading],
            'font-semibold',
            headingColor,
            // Extra bump on top of the container's gap-medium, eyebrow
            // to heading only — text-box-trim (globals.css) tightened
            // every heading's own box, which made this specific gap
            // read tighter than the rest of the block's rhythm once
            // there was an eyebrow above it to compare against.
            eyebrow ? 'mt-small' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {heading}
        </Heading>
      )}
      {body && (
        <p
          className={[
            'text-body-lg',
            bodyColor,
            // Same reasoning as the heading's mt-small above, mirrored
            // on the other side of it: trimming the heading's own box
            // also tightened its bottom edge, so the gap to the body
            // text below it read loose next to the rest of the block's
            // rhythm.
            heading ? 'mt-small' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {body}
        </p>
      )}
      {cta && <div>{cta}</div>}
    </div>
  )
}
