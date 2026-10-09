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

  it('draws an uploaded SVG icon as three colour layers, ahead of the list icon', () => {
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
    const layers = [...container.querySelectorAll<HTMLElement>('[data-slot]')]
    expect(layers.map((l) => l.dataset.slot)).toEqual(['accent', 'paper', 'ink'])
    expect(layers[0].style.backgroundColor).toBe('var(--color-icon-accent)')
  })

  it('draws an uploaded PNG icon as a single-colour mask', () => {
    const { container } = render(
      <FeatureGridBlock
        items={[
          {
            title: 'Uploaded',
            iconImage: { _type: 'image', asset: { _type: 'reference', _ref: 'image-0123456789abcdef0123456789abcdef01234567-24x24-png' } },
          },
        ]}
      />,
    )
    expect(container.querySelector('img')).toBeNull()
    const masked = container.querySelector<HTMLElement>('span[style*="mask"]')
    expect(masked?.style.maskImage || masked?.style.webkitMaskImage).toContain('mock.jpg')
  })

  it('renders nothing when there are no items', () => {
    const { container } = render(<FeatureGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
