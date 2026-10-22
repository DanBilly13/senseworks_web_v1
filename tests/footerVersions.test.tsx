import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FooterBlock } from '@/components/blocks/FooterBlock'

vi.mock('next/navigation', () => ({ usePathname: () => '/en/home' }))

const versions = [
  { slug: 'lp/001', title: 'LP001', of: 'lp/v3' },
  { slug: 'lp/002', title: 'LP002', of: 'lp/v3' },
]
const fetchMock = vi.fn(async () => ({ ok: true, json: async () => versions }))
vi.stubGlobal('fetch', fetchMock)

const linkColumns = [{ title: 'Admin', links: [{ label: 'LP V3', href: '/sv/lp/v3' }] }]

afterEach(() => {
  document.cookie = 'sw_team=; path=/; max-age=0'
  fetchMock.mockClear()
})

describe('FooterBlock versions (team mode)', () => {
  it('shows only the link without team mode', () => {
    render(<FooterBlock linkColumns={linkColumns} />)
    expect(screen.getByRole('link', { name: 'LP V3' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'LP001' })).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("lists a page's versions under its link, in the link's language", async () => {
    document.cookie = 'sw_team=1; path=/'
    render(<FooterBlock linkColumns={linkColumns} />)
    expect(await screen.findByRole('link', { name: 'LP001' })).toHaveAttribute('href', '/sv/lp/001')
    expect(screen.getByRole('link', { name: 'LP002' })).toHaveAttribute('href', '/sv/lp/002')
  })
})
