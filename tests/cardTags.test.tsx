import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardTags } from '@/components/ui/CardTags'

describe('CardTags', () => {
  it('draws each tag as the same pill, standing off whatever it sits on', () => {
    const { rerender } = render(<CardTags tags={['Revision', 'Analys']} />)
    expect(screen.getByText('Revision')).toHaveClass('rounded-full', 'bg-muted')
    rerender(<CardTags tags={['Nyheter']} surface="page" />)
    expect(screen.getByText('Nyheter')).toHaveClass('bg-background')
    rerender(<CardTags tags={['Audit']} surface="dark" />)
    expect(screen.getByText('Audit')).toHaveClass('bg-background/15', 'text-background')
  })

  it('renders nothing without tags', () => {
    const { container } = render(<CardTags tags={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
