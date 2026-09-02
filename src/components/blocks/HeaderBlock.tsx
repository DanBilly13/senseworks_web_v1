'use client'
import { useState } from 'react'
import Image from 'next/image'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'

type NavLink = { label: string; href: string }
type HeaderBlockProps = {
  logoText: string
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}

export function HeaderBlock({ logoText, navLinks = [], ctaLabel, ctaHref }: HeaderBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-page items-center justify-between px-medium-large py-small-medium">
        <Image src="/senseworks-logo.svg" alt={logoText} width={240} height={31} className="h-medium-large w-auto" priority />
        <nav className="hidden items-center gap-medium-large md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-body-sm text-muted-foreground">
              {link.label}
            </a>
          ))}
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
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="border-b border-border py-small text-body">
              {link.label}
            </a>
          ))}
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
