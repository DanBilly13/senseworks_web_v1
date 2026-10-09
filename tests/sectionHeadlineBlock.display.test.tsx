import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeadlineBlock } from '@/components/blocks/SectionHeadlineBlock'

describe('SectionHeadlineBlock headline size', () => {
  it('keeps the h2 level but draws it at the display size', () => {
    render(<SectionHeadlineBlock headline="Go ahead, audit us." headlineSize="display" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('text-display')
    expect(heading).not.toHaveClass('text-h2')
  })

  it('uses the heading level size by default', () => {
    render(<SectionHeadlineBlock headline="Go ahead, audit us." />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-h2')
  })

  it('turns a typed line break into a real one', () => {
    render(<SectionHeadlineBlock headline={'Go ahead,\naudit us.'} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.querySelectorAll('br')).toHaveLength(1)
    expect(heading).toHaveTextContent('Go ahead,audit us.')
  })
})
