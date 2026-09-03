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
}: SectionIntroProps) {
  // A block with neither an eyebrow nor a heading has no intro to show
  // (e.g. Stats Band's intro is entirely optional).
  if (!eyebrow && !heading) return null

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
        <p className="text-caption font-semibold text-muted-foreground uppercase">{eyebrow}</p>
      )}
      {heading && (
        <Heading
          className={[
            HEADING_TEXT_CLASS[Heading],
            'font-semibold text-foreground',
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
      {body && <p className="text-body-lg text-muted-foreground">{body}</p>}
      {cta && <div>{cta}</div>}
    </div>
  )
}
