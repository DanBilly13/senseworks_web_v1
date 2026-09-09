'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CloseOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'

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
        <div className="absolute top-full left-0 mt-small flex flex-col gap-small-medium rounded-lg border border-border bg-background p-medium whitespace-nowrap shadow-lg">
          {links.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                className="text-body-sm text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <span key={link.label} className="text-body-sm text-muted-foreground/60">
                {link.label}
              </span>
            ),
          )}
        </div>
      )}
    </div>
  )
}

export function HeaderBlock({ logoText, navLinks = [], ctaLabel, ctaHref }: HeaderBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-page items-center justify-between px-medium-large py-small-medium">
        <Image src="/senseworks-logo.svg" alt={logoText} width={240} height={31} className="h-medium-large w-auto" priority />
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
          className="flex flex-col border-t border-border px-medium-large py-small-medium md:hidden"
        >
          {navLinks.map((link) =>
            link.links?.length ? (
              <div key={link.label} className="border-b border-border py-small">
                <span className="text-body font-semibold text-foreground">{link.label}</span>
                <div className="mt-small flex flex-col gap-small pl-medium">
                  {link.links.map((sub) =>
                    sub.href ? (
                      <a key={sub.label} href={sub.href} className="text-body-sm text-muted-foreground">
                        {sub.label}
                      </a>
                    ) : (
                      <span key={sub.label} className="text-body-sm text-muted-foreground/60">
                        {sub.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <a key={link.label} href={link.href} className="border-b border-border py-small text-body">
                {link.label}
              </a>
            ),
          )}
          {ctaLabel && ctaHref && (
            <Button href={ctaHref} size="md">
              {ctaLabel}
            </Button>
          )}
        </nav>
      )}
    </header>
  )
}
