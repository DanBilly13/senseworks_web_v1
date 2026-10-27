'use client'
import Image from 'next/image'
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
}

type HighlightColor = 'accent' | 'dark' | 'muted'


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

// The Open style (Dan's reference): no box, a line under the header and
// each row, the first column left-aligned and the rest centred, and each
// highlighted column a rounded coloured panel running from just above
// its header to just below the last row (a spacer row holds its rounded
// bottom). Capped at 960px and centred. Below that it scrolls sideways
// with the first column pinned, like the Table style.
function OpenTable({
  rowHeader,
  columns,
  rows,
  spacing,
  highlightColor,
  showLogo,
}: {
  rowHeader?: string
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  spacing: 'loose' | 'medium' | 'tight' | 'none'
  highlightColor: HighlightColor
  showLogo: boolean
}) {
  const panel = PANEL_CLASS[highlightColor]
  const onDark = highlightColor === 'dark'
  const line = 'border-b border-foreground/20'
  return (
    <SectionShell py={spacing} maxWidth="prose-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className={`sticky left-0 z-10 min-w-48 bg-muted pr-large pb-medium-large align-bottom text-body-lg font-semibold text-foreground ${line}`}>
                {rowHeader}
              </th>
              {columns.map((column, columnIndex) => (
                <th
                  key={columnIndex}
                  className={[
                    'w-48 min-w-48 px-medium pt-large pb-medium-large text-center align-bottom text-body font-medium',
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
                      className="mx-auto h-medium-large w-auto"
                    />
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className={`sticky left-0 z-10 bg-muted py-medium-large pr-large text-body text-foreground ${line}`}>
                  <Lead text={row.labelLead} className="text-foreground" />
                  {row.label}
                </td>
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={['px-medium py-medium-large text-center align-middle text-body', line, column.highlighted ? panel : ''].join(' ')}
                  >
                    <OpenCell cell={row.cells?.[columnIndex]} highlighted={!!column.highlighted} color={highlightColor} />
                  </td>
                ))}
              </tr>
            ))}
            {/* The panel's rounded bottom, a little below the last line. */}
            <tr aria-hidden="true">
              <td className="sticky left-0 bg-muted" />
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} className={`h-large ${column.highlighted ? `${panel} rounded-b-lg` : ''}`} />
              ))}
            </tr>
          </tbody>
        </table>
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
