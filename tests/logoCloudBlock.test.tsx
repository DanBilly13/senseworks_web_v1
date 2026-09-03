import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoCloudBlock } from '@/components/blocks/LogoCloudBlock'

describe('LogoCloudBlock', () => {
  it('renders each logo twice — once for real, once aria-hidden for the seamless loop', () => {
    const { container } = render(
      <LogoCloudBlock logos={[{ name: 'Acme' }, { name: 'Globex' }]} />,
    )
    // aria-hidden copies are correctly excluded from the accessible-name query.
    expect(screen.getAllByRole('img', { name: 'Acme' })).toHaveLength(1)
    expect(screen.getAllByRole('img', { name: 'Globex' })).toHaveLength(1)

    expect(container.querySelectorAll('[aria-label="Acme"]')).toHaveLength(2)
    expect(container.querySelectorAll('[aria-hidden="true"][aria-label="Acme"]')).toHaveLength(1)
  })

  it('renders nothing when there are no logos', () => {
    const { container } = render(<LogoCloudBlock logos={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
