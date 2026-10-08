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

  it('draws an uploaded icon as a mask, ahead of the list icon', () => {
    const { container } = render(
      <FeatureGridBlock
        items={[
          {
            title: 'Uploaded',
            icon: 'lock',
            iconImage: { _type: 'image', asset: { _type: 'reference', _ref: 'image-0123456789abcdef0123456789abcdef01234567-24x24-svg' } },
          },
        ]}
      />,
    )
    expect(container.querySelector('img')).toBeNull()
    const masked = container.querySelector<HTMLElement>('span.bg-foreground')
    expect(masked?.style.maskImage || masked?.style.webkitMaskImage).toContain('mock.jpg')
  })

  it('renders nothing when there are no items', () => {
    const { container } = render(<FeatureGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
