import type { ReactNode } from 'react'

type ItemHeadingLevel = 'h3' | 'h4' | 'h5'
type ItemHeadingLayout = 'stacked' | 'inline'
type ItemHeadingTone = 'default' | 'inverse'
type ItemHeadingGap = 'none' | 'small' | 'medium' | 'medium-large'
type ItemHeadingDescriptionSize = 'body' | 'match'

type ItemHeadingProps = {
  as: ItemHeadingLevel
  title: ReactNode
  description?: ReactNode
  // 'inline' merges title+description into one flowing line (title
  // bold/dark, description regular/grey) instead of stacking them —
  // same idea as Steps' "one smooth paragraph" fix, just applied on
  // purpose: one element, one text flow, so there's no boundary to
  // reconcile at all. Always sizes both segments the same (the
  // title's own size) since a font-size jump mid-line would break the
  // "one sentence" read that's the entire point of this layout.
  layout?: ItemHeadingLayout
  tone?: ItemHeadingTone
  // Stacked only — title-to-description spacing.
  gap?: ItemHeadingGap
  // Stacked only — 'body' (default) sizes the description at the
  // standard text-body size; 'match' sizes it the same as the title
  // (Steps' large description text).
  descriptionSize?: ItemHeadingDescriptionSize
  // Escape hatch for a caller's own description styling (e.g. Bento
  // Grid's line-clamp-2) — stacked only.
  descriptionClassName?: string
  // Merged onto the outer wrapper in stacked mode, or directly onto
  // the heading tag in inline mode (there's no separate wrapper then)
  // — e.g. a caller's own icon-to-title margin.
  className?: string
}

const HEADING_TEXT_CLASS: Record<ItemHeadingLevel, string> = {
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
}

// h3 is bold everywhere else on the site (SectionIntro); h4/h5 stay
// semibold, matching every existing item-heading usage.
const HEADING_WEIGHT_CLASS: Record<ItemHeadingLevel, string> = {
  h3: 'font-bold',
  h4: 'font-semibold',
  h5: 'font-semibold',
}

const GAP_CLASS: Record<ItemHeadingGap, string> = {
  none: '',
  small: 'mt-small',
  medium: 'mt-medium',
  'medium-large': 'mt-medium-large',
}

const TITLE_COLOR_CLASS: Record<ItemHeadingTone, string> = {
  default: 'text-foreground',
  inverse: 'text-background',
}
const DESCRIPTION_COLOR_CLASS: Record<ItemHeadingTone, string> = {
  default: 'text-muted-foreground',
  inverse: 'text-background/70',
}

// Only the zero-margin "smooth paragraph" gap needs this (see Steps'
// original fix). The description is a <p>, never touched by
// globals.css's headings-only text-box trim, so its top always keeps
// natural leading. Trimming the title's bottom too (the global
// default) would remove the counterpart leading it needs to pair
// with, reading as an uneven gap instead of a normal line-to-line
// one. trim-start keeps the title flush against whatever sits above
// it but leaves its own bottom leading intact to match.
const ZERO_GAP_TITLE_STYLE = { textBox: 'trim-start cap alphabetic' }

export function ItemHeading({
  as,
  title,
  description,
  layout = 'stacked',
  tone = 'default',
  gap = 'medium-large',
  descriptionSize = 'body',
  descriptionClassName,
  className,
}: ItemHeadingProps) {
  const Tag = as
  const titleColor = TITLE_COLOR_CLASS[tone]
  const descriptionColor = DESCRIPTION_COLOR_CLASS[tone]

  if (layout === 'inline') {
    return (
      <Tag
        className={[
          'text-balance',
          HEADING_TEXT_CLASS[as],
          HEADING_WEIGHT_CLASS[as],
          titleColor,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {title}
        {description && (
          <>
            {' '}
            <span className={`font-normal ${descriptionColor}`}>{description}</span>
          </>
        )}
      </Tag>
    )
  }

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <Tag
        className={[
          'text-balance',
          HEADING_TEXT_CLASS[as],
          HEADING_WEIGHT_CLASS[as],
          titleColor,
        ].join(' ')}
        style={gap === 'none' ? ZERO_GAP_TITLE_STYLE : undefined}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={[
            GAP_CLASS[gap],
            descriptionSize === 'match' ? HEADING_TEXT_CLASS[as] : 'text-body',
            descriptionColor,
            descriptionClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {description}
        </p>
      )}
    </div>
  )
}
