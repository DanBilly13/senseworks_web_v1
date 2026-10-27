'use client'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { CheckOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons'
import { SectionShell } from '@/components/ui/SectionShell'

type ComparisonCell = { type: 'check' | 'cross' | 'partial' | 'text'; lead?: string; text?: string }
type ComparisonColumn = { label: string; highlighted?: boolean }
type ComparisonRow = { labelLead?: string; label: string; cells?: ComparisonCell[] }
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type ComparisonTableBlockProps = {
  // Title for the first (row label) column — blank header cell if unset.
  rowHeader?: string
  columns?: ComparisonColumn[]
  rows?: ComparisonRow[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // 'open': no box, lines between rows, the highlighted column as a
  // rounded coloured panel, circle icons, centred columns (OpenTable).
  style?: 'table' | 'open'
  highlightColor?: HighlightColor
  // Open style: the Senseworks wordmark in place of the highlighted
  // column's label.
  showLogo?: boolean
  // Open style: the row labels' size.
  labelSize?: LabelSize
}

type HighlightColor = 'accent' | 'dark' | 'muted'
type LabelSize = 'body' | 'h5' | 'h4'


function Cell({ cell, highlighted }: { cell?: ComparisonCell; highlighted: boolean }) {
  if (!cell) return null
  if (cell.type === 'check') {
    return (
      <span
        role="img"
        aria-label="Yes"
        className={highlighted ? 'text-background' : 'text-foreground'}
      >
        <CheckOutlined />
      </span>
    )
  }
  if (cell.type === 'cross') {
    return (
      <span
        role="img"
        aria-label="No"
        className={highlighted ? 'text-background/40' : 'text-muted-foreground'}
      >
        <CloseOutlined />
      </span>
    )
  }
  if (cell.type === 'partial') {
    return (
      <span
        role="img"
        aria-label="Partial"
        className={highlighted ? 'text-background/40' : 'text-muted-foreground'}
      >
        ~
      </span>
    )
  }
  return (
    <span className={highlighted ? 'text-background/80' : 'text-muted-foreground'}>
      <Lead text={cell.lead} className={highlighted ? 'text-background' : 'text-foreground'} />
      {cell.text}
    </span>
  )
}

// Optional bold lead-in before a cell's text ("Rolls forward. Analyses
// carry over"), in the full-strength text color of its column.
function Lead({ text, className }: { text?: string; className: string }) {
  if (!text) return null
  return <strong className={`font-semibold ${className}`}>{text} </strong>
}

// The Open style's coloured panel, per highlight colour.
const PANEL_CLASS: Record<HighlightColor, string> = {
  accent: 'bg-accent',
  dark: 'bg-foreground',
  // A touch darker than the page's own light grey, so it still shows.
  muted: 'bg-foreground/5',
}

// The Open style's icons: in circles. On the highlighted column a tick is
// a solid dark circle with a white tick (an accent one with a dark tick
// on the Dark panel); everything else — crosses, partials, and ticks in
// the other columns — is a soft grey circle with a white icon.
function OpenCell({ cell, highlighted, color }: { cell?: ComparisonCell; highlighted: boolean; color: HighlightColor }) {
  if (!cell) return null
  if (cell.type === 'text') {
    const onDark = highlighted && color === 'dark'
    return (
      <span className={onDark ? 'text-background/80' : 'text-muted-foreground'}>
        <Lead text={cell.lead} className={onDark ? 'text-background' : 'text-foreground'} />
        {cell.text}
      </span>
    )
  }
  const strong = highlighted && cell.type === 'check'
  const circle = strong
    ? color === 'dark'
      ? 'bg-accent text-foreground'
      : 'bg-foreground text-background'
    : highlighted && color === 'dark'
      ? 'bg-background/25 text-foreground'
      : 'bg-foreground/20 text-background'
  const label = cell.type === 'check' ? 'Yes' : cell.type === 'cross' ? 'No' : 'Partial'
  return (
    <span role="img" aria-label={label} className={`inline-flex size-medium-large items-center justify-center rounded-full text-caption ${circle}`}>
      {cell.type === 'check' ? <CheckOutlined /> : cell.type === 'cross' ? <CloseOutlined /> : <MinusOutlined />}
    </span>
  )
}

// Open style row-label sizes.
const LABEL_SIZE_CLASS: Record<LabelSize, string> = {
  body: 'text-body',
  h5: 'text-h5',
  h4: 'text-h4',
}

// The Open style (Dan's reference): no box, a line under the header and
// each row, the first column left-aligned and the rest centred, and each
// highlighted column a rounded coloured panel running from just above
// its header to just below the last row (a spacer row holds its rounded
// bottom). Laid out as a grid (.compare-grid in globals.css), not a
// <table>, so the columns can share space the way Dan wanted:
// - from 1024px, full page width: the text column takes the left half
//   (the first comparison column starts at the halfway mark), and the
//   comparison columns plus an empty last column share the right half
//   equally, the lines running right across;
// - 768–1023px, the same without the empty column; phones, narrow
//   comparison columns (88px) beside the text, the wordmark scaled to
//   fit, no sideways scrolling.
// ARIA table roles keep it a table for screen readers.
function OpenTable({
  rowHeader,
  columns,
  rows,
  spacing,
  highlightColor,
  showLogo,
  labelSize,
}: {
  rowHeader?: string
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  spacing: 'loose' | 'medium' | 'tight' | 'none'
  highlightColor: HighlightColor
  showLogo: boolean
  labelSize: LabelSize
}) {
  const panel = PANEL_CLASS[highlightColor]
  const onDark = highlightColor === 'dark'
  const line = 'border-b border-foreground/20'
  // The empty last column, from 1024px only (see .compare-grid).
  const trailing = <div aria-hidden="true" className={`compare-trailing ${line}`} />
  return (
    <SectionShell py={spacing}>
      <div role="table" style={{ '--compare-cols': columns.length } as CSSProperties}>
        <div role="row" className="compare-grid">
          <div role="columnheader" className={`flex items-end pr-medium pb-medium-large text-body-lg font-semibold text-foreground md:pr-large ${line}`}>
            {rowHeader}
          </div>
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              role="columnheader"
              className={[
                'flex items-end justify-center px-xs pt-large pb-medium-large text-center text-caption font-medium md:px-medium md:text-body',
                line,
                column.highlighted ? `${panel} rounded-t-lg ${onDark ? 'text-background' : 'text-foreground'}` : 'text-foreground',
              ].join(' ')}
            >
              {column.highlighted && showLogo ? (
                <Image
                  src={onDark ? '/senseworks-logo-neg.svg' : '/senseworks-logo.svg'}
                  alt={column.label || 'Senseworks'}
                  width={240}
                  height={31}
                  // The column's width, capped at 176px, height following (the
                  // wordmark is wider than a narrow column's 24px-tall size).
                  className="h-auto w-full max-w-44"
                />
              ) : (
                column.label
              )}
            </div>
          ))}
          {trailing}
        </div>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="compare-grid">
            <div role="rowheader" className={`flex items-center py-medium-large pr-medium text-foreground md:pr-large ${LABEL_SIZE_CLASS[labelSize]} ${line}`}>
              <span>
                <Lead text={row.labelLead} className="text-foreground" />
                {row.label}
              </span>
            </div>
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                role="cell"
                className={['flex items-center justify-center px-small py-medium-large text-center text-body md:px-medium', line, column.highlighted ? panel : ''].join(' ')}
              >
                <OpenCell cell={row.cells?.[columnIndex]} highlighted={!!column.highlighted} color={highlightColor} />
              </div>
            ))}
            {trailing}
          </div>
        ))}
        {/* The panel's rounded bottom, a little below the last line. */}
        <div aria-hidden="true" className="compare-grid">
          <div />
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={`h-large ${column.highlighted ? `${panel} rounded-b-lg` : ''}`} />
          ))}
          <div className="compare-trailing" />
        </div>
      </div>
    </SectionShell>
  )
}

export function ComparisonTableBlock({
  rowHeader,
  columns = [],
  rows = [],
  spacing = 'loose',
  style = 'table',
  highlightColor = 'accent',
  showLogo = true,
  labelSize = 'body',
}: ComparisonTableBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!columns.length || !rows.length) return null

  if (style === 'open') {
    return (
      <OpenTable
        rowHeader={rowHeader}
        columns={columns}
        rows={rows}
        spacing={spacing}
        highlightColor={highlightColor}
        showLogo={showLogo}
        labelSize={labelSize}
      />
    )
  }

  return (
    <SectionShell py={spacing}>
      <div className="w-full overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted">
                <th className="sticky left-0 z-10 w-56 min-w-56 bg-muted p-medium-large text-body-lg font-semibold text-foreground">
                  {rowHeader}
                </th>
                {columns.map((column, columnIndex) => {
                  // Sticky is structural — always the first data column,
                  // regardless of which column content marks as
                  // highlighted. Background/text color follows the
                  // authored highlighted flag instead, independently.
                  const sticky = columnIndex === 0
                  return (
                    <th
                      key={columnIndex}
                      className={[
                        'w-56 min-w-56 p-medium-large text-body-lg font-semibold',
                        sticky ? 'sticky left-56 z-10' : '',
                        column.highlighted
                          ? 'bg-foreground text-background'
                          : 'text-foreground',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {column.label}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="sticky left-0 z-10 w-56 min-w-56 bg-background p-medium-large text-body text-foreground">
                    <Lead text={row.labelLead} className="text-foreground" />
                    {row.label}
                  </td>
                  {columns.map((column, columnIndex) => {
                    const sticky = columnIndex === 0
                    return (
                      <td
                        key={columnIndex}
                        className={[
                          'w-56 min-w-56 p-medium-large text-body',
                          sticky ? 'sticky left-56 z-10' : '',
                          column.highlighted ? 'bg-foreground' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <Cell cell={row.cells?.[columnIndex]} highlighted={!!column.highlighted} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionShell>
  )
}
