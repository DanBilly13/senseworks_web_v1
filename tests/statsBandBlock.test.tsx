import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBandBlock } from '@/components/blocks/StatsBandBlock'

describe('StatsBandBlock', () => {
  it('renders each stat value and label', () => {
    render(
      <StatsBandBlock
        heading="By the numbers"
        items={[
          { value: '135+', label: 'currencies supported' },
          { value: '99.999%', label: 'historical uptime' },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'By the numbers' })).toBeInTheDocument()
    expect(screen.getByText('135+')).toBeInTheDocument()
    expect(screen.getByText('currencies supported')).toBeInTheDocument()
    expect(screen.getByText('99.999%')).toBeInTheDocument()
    expect(screen.getByText('historical uptime')).toBeInTheDocument()
  })

  it('renders nothing when there are no stats', () => {
    const { container } = render(<StatsBandBlock heading="Empty" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
