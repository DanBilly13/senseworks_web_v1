import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { BentoGridBlock } from '@/components/blocks/BentoGridBlock'

describe('BentoGridBlock', () => {
  const items = [
    { heading: 'Card one', body: 'First card body', size: 'large' as const },
    { heading: 'Card two', body: 'Second card body' },
  ]

  it('renders each card and marks large cards for a 2-column span', () => {
    render(<BentoGridBlock items={items} />)
    expect(screen.getByRole('heading', { name: 'Card one' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Card two' })).toBeInTheDocument()

    const largeCard = screen.getByRole('heading', { name: 'Card one' }).closest('div.md\\:col-span-2')
    expect(largeCard).not.toBeNull()
  })

  it('has no expand buttons unless "Cards open a pop-up" is on', () => {
    render(<BentoGridBlock items={items} />)
    expect(screen.queryByRole('button', { name: /^Expand/ })).not.toBeInTheDocument()
  })

  it('opens a modal with the card title when its expand button is clicked, and closes on request', () => {
    render(<BentoGridBlock items={items} expandable />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Expand Card two' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Card two' })).toBeInTheDocument()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders nothing when there are no cards', () => {
    const { container } = render(<BentoGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
