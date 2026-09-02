import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FaqAccordionBlock } from '@/components/blocks/FaqAccordionBlock'

describe('FaqAccordionBlock (FR-005, NFR-005)', () => {
  const items = [{ question: 'Is this real?', answer: 'Yes.' }]

  it('starts collapsed and expands on click, updating aria-expanded', () => {
    render(<FaqAccordionBlock items={items} />)
    const button = screen.getByRole('button', { name: /Is this real\?/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Yes.')).toBeVisible()
  })

  it('renders nothing when there are no items (D7)', () => {
    const { container } = render(<FaqAccordionBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
