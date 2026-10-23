import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { FeatureGridBlock } from '@/components/blocks/FeatureGridBlock'

const items = [{ title: 'One', description: 'First' }, { title: 'Two', description: 'Second' }]

describe('FeatureGridBlock icons', () => {
  it('shows the checkmark by default (existing blocks keep their icons)', () => {
    const { container } = render(<FeatureGridBlock items={items} />)
    expect(container.querySelectorAll('.anticon-check-circle')).toHaveLength(2)
  })

  it('shows no icons at all with Show icons off', () => {
    const { container } = render(<FeatureGridBlock items={[...items, { title: 'Three', icon: 'lock' }]} showIcons={false} />)
    expect(container.querySelector('.anticon-check-circle')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })
})
