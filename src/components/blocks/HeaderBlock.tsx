'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CloseOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'
import { Menu, MenuItem } from '@/components/ui/Menu'
import styles from './HeaderBlock.module.css'

type NavSubLink = { label: string; href?: string }
type NavLink = { label: string; href?: string; links?: NavSubLink[] }
type HeaderBlockProps = {
  logoText: string
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}

// Desktop-only dropdown trigger — a plain nav link renders as a bare
// <a>, this is only used for an item that has Sub links configured in
// Studio. Click-to-open (not hover) so it behaves the same on trackpad
// and touch, and closes on an outside click.
function NavDropdown({ label, links }: { label: string; links: NavSubLink[] }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-xs text-body-sm text-muted-foreground"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <DownOutlined
          className={`text-caption transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <Menu className="absolute top-full left-0 mt-small w-max border border-border shadow-lg">
          {links.map((link) =>
            link.href ? (
              <MenuItem key={link.label} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </MenuItem>
            ) : (
              <MenuItem key={link.label} disabled>
                {link.label}
              </MenuItem>
            ),
          )}
        </Menu>
      )}
    </div>
  )
}

export function HeaderBlock({ logoText, navLinks = [], ctaLabel, ctaHref }: HeaderBlockProps) {
  const [open, setOpen] = useState(false)
  // Every route lives under a locale segment (D12), so the first path
  // segment is always "en"/"sv" — the logo goes to that locale's home
  // page regardless of which page/LP it's clicked from.
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const homeHref = `/${locale}/home`

  // The header is fixed (floats over the page instead of sitting in
  // flow), so this bar's own height is measured and re-applied in two
  // places: a same-height spacer right below it (keeps every other
  // block exactly where it was) and a `--header-height` custom
  // property on the root (read by the full-bleed Hero, which pulls
  // itself up by this amount to sit truly edge-to-edge under the bar
  // instead of getting pushed down by it). Measures only the top row,
  // not the mobile drawer below it — the drawer is meant to overlay
  // page content when open, not shift it down.
  const barRef = useRef<HTMLDivElement>(null)
  const [barHeight, setBarHeight] = useState(0)

  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return
    const update = () => {
      const height = el.getBoundingClientRect().height
      setBarHeight(height)
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Hides on scroll-down, reveals on scroll-up, from anywhere on the
  // page — only once scrolled past the bar's own height, so it never
  // half-disappears while still near the top. Forced visible whenever
  // the mobile drawer is open.
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setHidden(y > lastY.current && y > barHeight)
        lastY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [barHeight])

  // Locks the page's own scroll while the mobile drawer is open, so
  // scrolling inside it doesn't also scroll the page underneath.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-border bg-background transition-transform duration-300 ${
          open || !hidden ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          ref={barRef}
          className="mx-auto flex w-full max-w-page items-center justify-between px-medium-large py-small-medium"
        >
          <a href={homeHref} aria-label="Go to homepage" className="shrink-0">
            <Image src="/senseworks-logo.svg" alt={logoText} width={240} height={31} className="h-medium-large w-auto" priority />
          </a>
          <nav className="hidden items-center gap-medium-large md:flex">
            {navLinks.map((link) =>
              link.links?.length ? (
                <NavDropdown key={link.label} label={link.label} links={link.links} />
              ) : (
                <a key={link.label} href={link.href} className="text-body-sm text-muted-foreground">
                  {link.label}
                </a>
              ),
            )}
            {ctaLabel && ctaHref && (
              <Button href={ctaHref} size="sm">
                {ctaLabel}
              </Button>
            )}
          </nav>
          <button
            type="button"
            className="flex md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-nav-drawer"
            className="flex flex-col overflow-y-auto border-t border-border px-medium-large py-small-medium md:hidden"
            // The bar above (logo/close button) stays fixed in place —
            // only this list scrolls, capped to whatever viewport
            // height is left below the bar, so a long link list never
            // extends past the bottom of the screen (body scroll is
            // locked while open, so that content would otherwise be
            // unreachable). dvh, not vh — vh is the *largest* possible
            // viewport on mobile browsers (ignores the address bar/
            // bottom toolbar), so it let this list run out past the
            // bottom of the actually-visible screen; dvh tracks the
            // real visible viewport as that browser chrome shows/hides.
            style={{ maxHeight: 'calc(100dvh - var(--header-height, 0px))' }}
          >
            {navLinks.map((link) =>
              link.links?.length ? (
                <div key={link.label} className="border-b border-border">
                  <div className={`text-h5 font-normal text-muted-foreground ${styles.navRow}`}>
                    {link.label}
                  </div>
                  <div className="flex flex-col">
                    {link.links.map((sub) =>
                      sub.href ? (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className={`text-h5 font-semibold text-foreground ${styles.navRow}`}
                        >
                          {sub.label}
                        </a>
                      ) : (
                        <span
                          key={sub.label}
                          className={`text-h5 font-semibold text-foreground/60 ${styles.navRow}`}
                        >
                          {sub.label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`border-b border-border text-h5 font-semibold text-foreground ${styles.navRow}`}
                >
                  {link.label}
                </a>
              ),
            )}
            {ctaLabel && ctaHref && (
              <Button href={ctaHref} size="lg">
                {ctaLabel}
              </Button>
            )}
          </nav>
        )}
      </header>
      <div style={{ height: barHeight }} aria-hidden="true" />
    </>
  )
}
