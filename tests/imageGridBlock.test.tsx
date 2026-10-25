import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageGridBlock } from '@/components/blocks/ImageGridBlock'

const items = [
  { eyebrow: 'One', title: 'First item', description: 'First body', ctaLabel: 'Read more', ctaHref: '/en/one' },
  { title: 'Second\nitem', description: 'Second body' },
]

describe('ImageGridBlock', () => {
  it('renders each item: an image above its eyebrow, title, description and link', () => {
    const { container } = render(<ImageGridBlock items={items} />)
    expect(screen.getByRole('heading', { name: 'First item' })).toBeInTheDocument()
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('First body')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read more →' })).toHaveAttribute('href', '/en/one')
    // The image comes first in each item, in the 7:5 rounded frame.
    const firstItem = container.querySelector('.grid')!.firstElementChild!
    expect(firstItem.firstElementChild?.className).toMatch(/aspect-media/)
    expect(firstItem.firstElementChild?.className).toMatch(/rounded-lg/)
  })

  it('turns a typed line break in a title into a real one', () => {
    render(<ImageGridBlock items={items} />)
    expect(screen.getByRole('heading', { name: 'Seconditem' }).querySelector('br')).not.toBeNull()
  })

  it('puts the text in white with accent links on a dark background', () => {
    render(<ImageGridBlock items={items} tone="inverse" />)
    expect(screen.getByRole('link', { name: 'Read more →' }).className).toMatch(/text-accent/)
    expect(screen.getByText('One').className).toMatch(/text-accent/)
  })

  it('renders nothing without items', () => {
    const { container } = render(<ImageGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
