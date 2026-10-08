import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MediaCarouselBlock } from '@/components/blocks/MediaCarouselBlock'

describe('MediaCarouselBlock', () => {
  it('renders each slide with its bold title and body, and the two nav buttons', () => {
    render(
      <MediaCarouselBlock
        slides={[
          { title: 'Pro controls.', body: 'Put your settings first.', note: 'Limits apply.' },
          { title: 'Photographic styles.', body: 'Adjust tone and warmth.' },
        ]}
      />,
    )
    expect(screen.getByText('Pro controls.')).toBeInTheDocument()
    expect(screen.getByText(/Put your settings first/)).toBeInTheDocument()
    expect(screen.getByText('Limits apply.')).toBeInTheDocument()
    expect(screen.getByText('Photographic styles.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
  })

  it('shows the optional heading and text above the slides', () => {
    render(
      <MediaCarouselBlock
        eyebrow="Features"
        heading="Everything in one place"
        body="A short line of context."
        slides={[{ title: 'One.' }]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Everything in one place' })).toBeInTheDocument()
    expect(screen.getByText('A short line of context.')).toBeInTheDocument()
  })

  it('follows the title style and size, like Bento Grid', () => {
    const slides = [{ title: 'Pro controls.', body: 'Put your settings first.' }]
    const { container, rerender } = render(<MediaCarouselBlock slides={slides} />)
    // Inline (default): title and text flow together in one heading.
    expect(container.querySelector('h5')?.textContent).toContain('Put your settings first.')
    rerender(<MediaCarouselBlock headingLayout="stacked" titleSize="h3" slides={slides} />)
    expect(container.querySelector('h3')?.textContent).toBe('Pro controls.')
    expect(screen.getByText('Put your settings first.').tagName).toBe('P')
  })

  it('goes dark on a black band', () => {
    const { container } = render(
      <MediaCarouselBlock tone="dark" slides={[{ title: 'One.' }]} />,
    )
    expect(container.querySelector('section.bg-foreground')).not.toBeNull()
  })

  it('renders nothing when there are no slides', () => {
    const { container } = render(<MediaCarouselBlock slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
