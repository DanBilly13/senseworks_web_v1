import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fakeOverflowingScroller } from './helpers/overflow'
import { TestimonialCarouselBlock } from '@/components/blocks/TestimonialCarouselBlock'

describe('TestimonialCarouselBlock', () => {
  it('renders the heading and each testimonial', () => {
    render(
      <TestimonialCarouselBlock
        heading="What customers say"
        items={[
          { quote: 'This saved us weeks of work.', authorName: 'Jane Doe', authorRole: 'Acme' },
          { quote: 'Rock solid and fast to ship with.', authorName: 'John Smith' },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'What customers say' })).toBeInTheDocument()
    expect(screen.getByText(/This saved us weeks of work/)).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText(/Rock solid and fast to ship with/)).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })


  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<TestimonialCarouselBlock heading="Empty" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('TestimonialCarouselBlock arrows', () => {
  describe('when the cards overflow', () => {
    fakeOverflowingScroller()

    it('shows prev/next controls', () => {
      render(
        <TestimonialCarouselBlock
        heading="What customers say"
        items={[{ quote: 'Great product.', authorName: 'A' }]}
      />
      )
      expect(screen.getByRole('button', { name: 'Previous testimonials' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next testimonials' })).toBeInTheDocument()
    })
  })

  it('hides them when every card already fits', () => {
    render(
      <TestimonialCarouselBlock
        heading="What customers say"
        items={[{ quote: 'Great product.', authorName: 'A' }]}
      />
    )
    expect(screen.queryByRole('button', { name: 'Next testimonials' })).toBeNull()
  })
})
