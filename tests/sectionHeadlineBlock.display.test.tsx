import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeadlineBlock } from '@/components/blocks/SectionHeadlineBlock'

describe('SectionHeadlineBlock size', () => {
  it('is H2-sized by default', () => {
    render(<SectionHeadlineBlock headline="Go ahead, audit us." />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-h2')
  })

  it('is always an h2 on the page, whatever size it is drawn at', () => {
    for (const [size, cls] of [
      ['display', 'text-display'],
      ['h1', 'text-h1'],
      ['h3', 'text-h3'],
    ] as const) {
      const { unmount } = render(<SectionHeadlineBlock headline="Go ahead, audit us." size={size} />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveClass(cls)
      expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
      unmount()
    }
  })

  it('uses the subtitle body under Display/H1/H2 and plain body under H3', () => {
    const { rerender } = render(<SectionHeadlineBlock headline="Title" body="Body text" size="display" />)
    expect(screen.getByText('Body text')).toHaveClass('text-h5')
    rerender(<SectionHeadlineBlock headline="Title" body="Body text" size="h3" />)
    expect(screen.getByText('Body text')).not.toHaveClass('text-h5')
  })

  it('turns a typed line break into a real one', () => {
    render(<SectionHeadlineBlock headline={'Go ahead,\naudit us.'} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.querySelectorAll('br')).toHaveLength(1)
    expect(heading).toHaveTextContent('Go ahead,audit us.')
  })
})
