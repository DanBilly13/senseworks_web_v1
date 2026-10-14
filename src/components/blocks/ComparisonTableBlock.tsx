'use client'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
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
}

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

export function ComparisonTableBlock({
  rowHeader,
  columns = [],
  rows = [],
  spacing = 'loose',
}: ComparisonTableBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!columns.length || !rows.length) return null

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
