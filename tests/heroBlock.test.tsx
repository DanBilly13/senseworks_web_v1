import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroBlock } from '@/components/blocks/HeroBlock'

describe('HeroBlock headline size', () => {
  it('draws the headline as a standard h1 by default', () => {
    render(<HeroBlock headline="Audit, faster" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-h1')
    expect(heading).not.toHaveClass('text-display')
  })

  it('draws the headline at the display size, still as the page h1', () => {
    render(<HeroBlock layout="splitEven" headline="Audit, faster" headlineSize="display" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-display')
    expect(heading).not.toHaveClass('text-h1')
  })

  it('turns a typed line break in the headline into a real one', () => {
    render(<HeroBlock headline={'More genius.\nLess grunt.'} />)
    expect(screen.getByRole('heading', { level: 1 }).querySelectorAll('br')).toHaveLength(1)
  })
})
