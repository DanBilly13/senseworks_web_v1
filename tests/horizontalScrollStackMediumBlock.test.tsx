import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HorizontalScrollStackMediumBlock } from '@/components/blocks/HorizontalScrollStackMediumBlock'

// jsdom has no ResizeObserver.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const slides = [
  { title: 'Pro controls.', body: 'Put your settings first.' },
  { title: 'Photographic styles.', body: 'Adjust tone and warmth.', note: 'Limits apply.' },
]

describe('HorizontalScrollStackMediumBlock', () => {
  it('shows the title and text above the slides, and every slide', () => {
    render(
      <HorizontalScrollStackMediumBlock
        eyebrow="Features"
        heading="Everything in one place"
        body="A short line of context."
        slides={slides}
      />,
    )
    // Desktop and mobile layouts both render (one is hidden with CSS).
    expect(screen.getAllByRole('heading', { level: 2, name: 'Everything in one place' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('A short line of context.').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Pro controls\./).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Limits apply.').length).toBeGreaterThan(0)
  })

  it('uses an h3 when asked', () => {
    render(<HorizontalScrollStackMediumBlock heading="Smaller title" headingLevel="h3" slides={slides} />)
    expect(screen.getAllByRole('heading', { level: 3, name: 'Smaller title' }).length).toBeGreaterThan(0)
  })

  it('renders nothing when there are no slides', () => {
    const { container } = render(<HorizontalScrollStackMediumBlock heading="Empty" slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
