import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComparisonTableBlock } from '@/components/blocks/ComparisonTableBlock'

describe('ComparisonTableBlock', () => {
  const columns = [
    { label: 'Senseworks', highlighted: true },
    { label: 'Spreadsheets' },
  ]
  const rows = [
    {
      label: 'CMS-driven content',
      cells: [{ type: 'check' as const }, { type: 'cross' as const }],
    },
    {
      label: 'Setup time',
      cells: [{ type: 'text' as const, text: 'An afternoon' }, { type: 'text' as const, text: 'Weeks' }],
    },
  ]

  it('renders the heading, column labels, row labels, and cell values', () => {
    render(<ComparisonTableBlock heading="How we compare" columns={columns} rows={rows} />)
    expect(screen.getByRole('heading', { name: 'How we compare' })).toBeInTheDocument()
    expect(screen.getByText('Senseworks')).toBeInTheDocument()
    expect(screen.getByText('Spreadsheets')).toBeInTheDocument()
    expect(screen.getByText('CMS-driven content')).toBeInTheDocument()
    expect(screen.getByText('Setup time')).toBeInTheDocument()
    expect(screen.getByText('An afternoon')).toBeInTheDocument()
    expect(screen.getByText('Weeks')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Yes' })).toHaveLength(1)
    expect(screen.getAllByRole('img', { name: 'No' })).toHaveLength(1)
  })

  it('renders nothing when there are no columns or no rows', () => {
    const { container: noColumns } = render(
      <ComparisonTableBlock heading="Empty" columns={[]} rows={rows} />,
    )
    expect(noColumns).toBeEmptyDOMElement()

    const { container: noRows } = render(
      <ComparisonTableBlock heading="Empty" columns={columns} rows={[]} />,
    )
    expect(noRows).toBeEmptyDOMElement()
  })
})
