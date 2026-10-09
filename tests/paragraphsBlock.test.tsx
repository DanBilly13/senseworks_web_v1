import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ParagraphsBlock } from '@/components/blocks/ParagraphsBlock'

describe('ParagraphsBlock', () => {
  it('renders each column title at the chosen level, and splits paragraphs on blank lines', () => {
    render(
      <ParagraphsBlock
        titleSize="h6"
        items={[{ _type: 'paragraph', title: 'Built in Sweden', text: 'First paragraph.\n\nSecond paragraph.' }]}
      />,
    )
    const heading = screen.getByRole('heading', { level: 6, name: 'Built in Sweden' })
    expect(heading).toHaveClass('text-h6')
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
  })

  it('keeps an empty column as a desktop-only spacer, in order', () => {
    const { container } = render(
      <ParagraphsBlock
        columns="3"
        items={[
          { _type: 'emptyColumn' },
          { _type: 'paragraph', text: 'One' },
          { _type: 'paragraph', text: 'Two' },
        ]}
      />,
    )
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('lg:grid-cols-3')
    expect(grid?.firstElementChild).toHaveClass('hidden', 'lg:block')
  })

  it('runs the title into the first paragraph when inline', () => {
    render(
      <ParagraphsBlock
        headingLayout="inline"
        items={[{ _type: 'paragraph', title: 'Fast.', text: 'Set up in a day.' }]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Fast. Set up in a day.' })).toBeInTheDocument()
  })

  it('renders nothing with only empty columns', () => {
    const { container } = render(<ParagraphsBlock items={[{ _type: 'emptyColumn' }]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
