import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureGridBlock } from '@/components/blocks/FeatureGridBlock'

describe('FeatureGridBlock', () => {
  it('renders the heading and each item', () => {
    render(
      <FeatureGridBlock
        heading="Why teams choose us"
        items={[
          { title: 'Agent activity', description: 'Track every agent action' },
          { title: 'Permissions', description: 'Define exactly what agents can access' },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Why teams choose us' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agent activity' })).toBeInTheDocument()
    expect(screen.getByText('Track every agent action')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Permissions' })).toBeInTheDocument()
  })

  it('renders nothing when there are no items', () => {
    const { container } = render(<FeatureGridBlock heading="Empty" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
