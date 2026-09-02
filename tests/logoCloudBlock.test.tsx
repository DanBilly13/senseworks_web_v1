import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoCloudBlock } from '@/components/blocks/LogoCloudBlock'

describe('LogoCloudBlock', () => {
  it('renders the heading and a placeholder per logo', () => {
    render(
      <LogoCloudBlock heading="Trusted by teams at" logos={[{ name: 'Acme' }, { name: 'Globex' }]} />,
    )
    expect(screen.getByText('Trusted by teams at')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Acme' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Globex' })).toBeInTheDocument()
  })

  it('renders nothing when there are no logos', () => {
    const { container } = render(<LogoCloudBlock heading="Empty" logos={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
