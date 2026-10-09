import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamGridBlock } from '@/components/blocks/TeamGridBlock'

describe('TeamGridBlock', () => {
  it('renders a card per team member', () => {
    render(
      <TeamGridBlock
        members={[
          { _id: 'a', name: 'Anna Arnle', role: 'UI Designer' },
          { _id: 'b', name: 'Albin Frick', role: 'Software Engineer' },
        ]}
      />,
    )
    expect(screen.getByText('Anna Arnle')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('renders nothing when there are no team members', () => {
    const { container } = render(<TeamGridBlock members={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
