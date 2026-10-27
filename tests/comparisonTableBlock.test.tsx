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

  it('renders the column labels, row labels, and cell values', () => {
    render(<ComparisonTableBlock columns={columns} rows={rows} />)
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
      <ComparisonTableBlock columns={[]} rows={rows} />,
    )
    expect(noColumns).toBeEmptyDOMElement()

    const { container: noRows } = render(
      <ComparisonTableBlock columns={columns} rows={[]} />,
    )
    expect(noRows).toBeEmptyDOMElement()
  })

  it('Open style: the highlighted column as a coloured panel with the logo, circle icons, centred columns', () => {
    const { container } = render(
      <ComparisonTableBlock
        style="open"
        columns={[{ label: 'Senseworks', highlighted: true }, { label: 'Others' }]}
        rows={[{ label: 'Row', cells: [{ type: 'check' }, { type: 'cross' }] }]}
      />,
    )
    expect(screen.getByRole('img', { name: 'Senseworks' })).toHaveAttribute('src', expect.stringContaining('senseworks-logo'))
    const yes = screen.getByRole('img', { name: 'Yes' }).className
    const no = screen.getByRole('img', { name: 'No' }).className
    expect(yes).toMatch(/rounded-full/)
    expect(yes).toMatch(/bg-foreground(\s|$)/)
    expect(no).toMatch(/rounded-full/)
    expect(no).toMatch(/bg-foreground\/20/)
    expect(container.querySelector('[role="columnheader"].bg-accent')).not.toBeNull()
    expect(container.querySelector('[role="cell"].text-center')).not.toBeNull()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Row' })).toBeInTheDocument()
  })

  it('Open style on Dark: the white logo and accent ticks', () => {
    render(
      <ComparisonTableBlock
        style="open"
        highlightColor="dark"
        columns={[{ label: 'Senseworks', highlighted: true }]}
        rows={[{ label: 'Row', cells: [{ type: 'check' }] }]}
      />,
    )
    expect(screen.getByRole('img', { name: 'Senseworks' })).toHaveAttribute('src', expect.stringContaining('logo-neg'))
    expect(screen.getByRole('img', { name: 'Yes' }).className).toMatch(/bg-accent/)
  })
})
