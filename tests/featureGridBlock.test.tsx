import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureGridBlock } from '@/components/blocks/FeatureGridBlock'

describe('FeatureGridBlock', () => {
  it('renders each item', () => {
    render(
      <FeatureGridBlock
        items={[
          { title: 'Agent activity', description: 'Track every agent action' },
          { title: 'Permissions', description: 'Define exactly what agents can access' },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Agent activity' })).toBeInTheDocument()
    expect(screen.getByText('Track every agent action')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Permissions' })).toBeInTheDocument()
  })

  it('renders nothing when there are no items', () => {
    const { container } = render(<FeatureGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
