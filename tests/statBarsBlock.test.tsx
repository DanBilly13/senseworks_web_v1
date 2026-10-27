import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatBarsBlock, shareOf } from '@/components/blocks/StatBarsBlock'

describe('shareOf', () => {
  it('works the share out from the number', () => {
    expect(shareOf({ value: '4 av 5' })).toBe(80)
    expect(shareOf({ value: '3 of 4' })).toBe(75)
    expect(shareOf({ value: '1/2' })).toBe(50)
    expect(shareOf({ value: '20 %' })).toBe(20)
    expect(shareOf({ value: '86%' })).toBe(86)
    expect(shareOf({ value: '12,5 %' })).toBe(12.5)
    expect(shareOf({ value: '500+' })).toBe(100)
  })

  it('lets a set share override the number, kept within 0–100', () => {
    expect(shareOf({ value: '4 av 5', share: 40 })).toBe(40)
    expect(shareOf({ value: 'x', share: 140 })).toBe(100)
  })
})

describe('StatBarsBlock', () => {
  const items = [
    { value: '4 av 5', label: 'Lorem ipsum' },
    { value: '20 %', label: 'Dolor sit' },
  ]

  it('renders a bar per stat, filled to its share', () => {
    const { container } = render(<StatBarsBlock items={items} source="Källa: test" />)
    const rows = container.querySelectorAll<HTMLElement>('.stat-bars > [style]')
    expect(rows).toHaveLength(2)
    expect(rows[0].style.getPropertyValue('--stat-share')).toBe('80%')
    expect(rows[1].style.getPropertyValue('--stat-share')).toBe('20%')
    // Shown once to readers; the coloured copy over the fill is hidden from them.
    expect(screen.getAllByText('4 av 5')).toHaveLength(2)
    expect(screen.getByText('Källa: test')).toBeInTheDocument()
  })

  it('fills the share of ten dots in the dots style', () => {
    const { container } = render(<StatBarsBlock style="dots" items={items} />)
    expect(screen.getByRole('img', { name: '8 av 10' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '2 av 10' })).toBeInTheDocument()
    expect(container.querySelectorAll('.stat-dot')).toHaveLength(20)
    expect(container.querySelectorAll('.stat-dot[data-filled="true"]')).toHaveLength(10)
  })

  it('renders nothing without stats', () => {
    const { container } = render(<StatBarsBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
