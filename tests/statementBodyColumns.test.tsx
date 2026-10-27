import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatementBlock } from '@/components/blocks/StatementBlock'
import { BodyColumnsBlock } from '@/components/blocks/BodyColumnsBlock'

describe('StatementBlock', () => {
  it('draws the statement as a big paragraph (not a heading), keeping line breaks', () => {
    const { container } = render(<StatementBlock text={'First line\nSecond line'} />)
    const p = container.querySelector('p')!
    expect(p.className).toMatch(/text-statement/)
    expect(p.querySelector('br')).not.toBeNull()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('goes white on Dark, in a full-width fill', () => {
    const { container } = render(<StatementBlock text="Hello" tone="inverse" />)
    expect(container.querySelector('div.bg-foreground')).not.toBeNull()
    expect(container.querySelector('p')!.className).toMatch(/text-background/)
  })

  it('renders nothing without text', () => {
    const { container } = render(<StatementBlock />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('BodyColumnsBlock', () => {
  it('puts each text in its own column, splitting paragraphs, with the wide gutter', () => {
    const { container } = render(<BodyColumnsBlock items={[{ text: 'One\nTwo' }, { text: 'Three' }]} />)
    const grid = container.querySelector('.grid')!
    expect(grid.className).toMatch(/lg:grid-cols-2/)
    expect(grid.className).toMatch(/lg:gap-x-editorial/)
    expect(grid.children).toHaveLength(2)
    expect(grid.children[0].querySelectorAll('p')).toHaveLength(2)
  })

  it('uses the chosen column count and skips empty columns', () => {
    const { container } = render(<BodyColumnsBlock columns="3" items={[{ text: 'A' }, { text: '' }, { text: 'B' }]} />)
    const grid = container.querySelector('.grid')!
    expect(grid.className).toMatch(/lg:grid-cols-3/)
    expect(grid.children).toHaveLength(2)
  })

  it('renders nothing without text', () => {
    const { container } = render(<BodyColumnsBlock items={[{ text: ' ' }]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows an optional title stacked above the text as a heading', () => {
    render(<BodyColumnsBlock items={[{ title: 'Title', text: 'Body' }, { text: 'No title' }]} />)
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('runs an inline title into the start of the first paragraph, in bold', () => {
    const { container } = render(<BodyColumnsBlock headingLayout="inline" items={[{ title: 'Title.', text: 'First\nSecond' }]} />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs[0].textContent).toBe('Title. First')
    expect(paragraphs[0].querySelector('strong')?.textContent).toBe('Title.')
    expect(paragraphs[1].querySelector('strong')).toBeNull()
    expect(screen.queryByRole('heading')).toBeNull()
  })
})
