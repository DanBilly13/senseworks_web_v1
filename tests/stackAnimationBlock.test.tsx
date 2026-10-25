import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StackAnimationBlock } from '@/components/blocks/StackAnimationBlock'

vi.mock('next/navigation', () => ({ usePathname: () => '/sv/home' }))

// jsdom has neither; the animation measures and observes itself.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver
window.matchMedia ??= (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia

describe('StackAnimationBlock', () => {
  it("shows the page's language and a dot per layer", () => {
    render(<StackAnimationBlock />)
    expect(screen.getByText('Vem som helst kan ha en bra modell. Vi har hela sammanhanget.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Layer \d$/ })).toHaveLength(6)
  })
})
