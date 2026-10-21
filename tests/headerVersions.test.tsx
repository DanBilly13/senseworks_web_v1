import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { HeaderBlock } from '@/components/blocks/HeaderBlock'

vi.mock('next/navigation', () => ({ usePathname: () => '/sv/home' }))

// The header measures itself and watches the breakpoint; jsdom has neither.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver
window.matchMedia ??= (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia

const versions = [
  { slug: 'home/bold-hero', title: 'Home: bold hero', of: 'home' },
  { slug: 'produkter/revision/short', title: 'Audit: short', of: 'produkter/revision' },
]
const navLinks = [
  { label: 'Revision', href: '/sv/produkter/revision' },
  { label: 'Priser', href: '/sv/pris' },
]

// The header fetches the versions (api/versions) in team mode.
const fetchMock = vi.fn(async () => ({ ok: true, json: async () => versions }))
vi.stubGlobal('fetch', fetchMock)

afterEach(() => {
  document.cookie = 'sw_team=; path=/; max-age=0'
  fetchMock.mockClear()
})

describe('HeaderBlock versions (team mode)', () => {
  it('looks exactly as normal without team mode: the logo and items are plain links', () => {
    render(<HeaderBlock logoText="Senseworks" navLinks={navLinks} currentPath="/sv/home" />)
    expect(screen.getByRole('link', { name: 'Go to homepage' })).toHaveAttribute('href', '/sv/home')
    expect(screen.getByRole('link', { name: 'Revision' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Home versions' })).toBeNull()
    // Nothing is fetched for visitors.
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('in team mode, the logo and an item with versions open their versions', async () => {
    document.cookie = 'sw_team=1; path=/'
    render(<HeaderBlock logoText="Senseworks" navLinks={navLinks} currentPath="/sv/home" />)
    fireEvent.click(await screen.findByRole('button', { name: 'Home versions' }))
    expect(fetchMock).toHaveBeenCalledWith('/api/versions?locale=sv')
    expect(screen.getAllByRole('menuitem').map((item) => [item.textContent, item.getAttribute('href')])).toEqual([
      ['Live', '/sv/home'],
      ['Home: bold hero', '/sv/home/bold-hero'],
    ])
    fireEvent.click(screen.getByRole('button', { name: 'Revision versions' }))
    expect(screen.getByRole('menuitem', { name: 'Audit: short' })).toHaveAttribute('href', '/sv/produkter/revision/short')
    // An item without versions stays a link.
    expect(screen.getByRole('link', { name: 'Priser' })).toBeInTheDocument()
  })

  it('on a version, its page\'s menu item shows as the current one', async () => {
    document.cookie = 'sw_team=1; path=/'
    render(<HeaderBlock logoText="Senseworks" navLinks={navLinks} currentPath="/sv/produkter/revision/short" />)
    expect(await screen.findByRole('button', { name: 'Revision versions' })).toHaveClass('after:bg-foreground')
  })
})
