import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureSplitBlock } from '@/components/blocks/FeatureSplitBlock'
import { FeatureSplitDarkBlock } from '@/components/blocks/FeatureSplitDarkBlock'

describe('Feature Split headings', () => {
  it('turn a typed line break into a real one', () => {
    render(<FeatureSplitBlock heading={'First line\nsecond line'} />)
    expect(screen.getByRole('heading', { name: /First line/ }).querySelectorAll('br')).toHaveLength(1)
  })

  it('do the same in the dark version', () => {
    render(<FeatureSplitDarkBlock heading={'First line\nsecond line'} />)
    expect(screen.getByRole('heading', { name: /First line/ }).querySelectorAll('br')).toHaveLength(1)
  })
})
