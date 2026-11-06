'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CheckOutlined } from '@ant-design/icons'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { LOCALES, pathInLocale, rememberLocale } from '@/lib/i18n/locales'
import type { Locale } from '@/lib/i18n/localize'

const GLOBE_MASK = {
  maskImage: 'url(/icons/language.svg)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskImage: 'url(/icons/language.svg)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
}

function Flag({ src }: { src: string }) {
  // A round flag, cropped from the middle of the rectangular one, with a
  // hairline edge so a light flag still reads on a white background.
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      className="size-5 shrink-0 rounded-full object-cover ring-1 ring-border"
    />
  )
}

// The header's language picker: a globe and the current language's code
// ("EN"/"SV"); clicking it opens a menu of every language (flag + name), each going to the
// same page in that language. The choice is remembered in a cookie, so
// the bare site address ("/") opens in it next time (see app/page.tsx).
export function LanguageSwitcher() {
  const pathname = usePathname()
  const current = LOCALES.find((locale) => locale.id === pathname.split('/')[1]) ?? LOCALES[0]
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const choose = (id: Locale) => {
    rememberLocale(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-xs text-body-sm text-foreground hover:opacity-70"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Language: ${current.name}`}
        onClick={() => setOpen((v) => !v)}
      >
        {/* The globe is a Material Symbols file (public/icons/, the same
            curated exception to Ant Design icons as Feature Grid's),
            drawn as a mask so it takes the text colour. */}
        <span aria-hidden="true" className="size-5 bg-current" style={GLOBE_MASK} />
        {current.code}
      </button>
      {open && (
        <Menu className="absolute top-full right-0 z-50 mt-small w-max border border-border shadow-lg">
          {LOCALES.map((locale) => (
            <MenuItem
              key={locale.id}
              href={pathInLocale(pathname, locale.id)}
              onClick={() => choose(locale.id)}
              trailingIcon={locale.id === current.id ? <CheckOutlined className="text-body" /> : undefined}
            >
              <span className="flex items-center gap-small" lang={locale.id}>
                <Flag src={locale.flag} />
                {locale.name}
              </span>
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}

// The phone menu's language row: every language side by side (flag and
// name), the current one outlined and ticked. Phones have no picker in
// the top bar; this is it.
export function LanguageOptions() {
  const pathname = usePathname()
  const current = LOCALES.find((locale) => locale.id === pathname.split('/')[1]) ?? LOCALES[0]
  return (
    <div className="flex flex-col gap-small-medium">
      <p className="text-caption font-bold tracking-wider text-muted-foreground uppercase">
        {current.id === 'sv' ? 'Språk' : 'Language'}
      </p>
      <div className="flex flex-wrap gap-small">
        {LOCALES.map((locale) => {
          const active = locale.id === current.id
          return (
            <a
              key={locale.id}
              href={pathInLocale(pathname, locale.id)}
              lang={locale.id}
              aria-current={active ? 'true' : undefined}
              onClick={() => rememberLocale(locale.id)}
              className={`flex items-center gap-small rounded-full border px-medium py-small text-body text-foreground ${active ? 'border-foreground' : 'border-border'}`}
            >
              <Flag src={locale.flag} />
              {locale.name}
              {active && <CheckOutlined aria-hidden="true" className="text-body-sm" />}
            </a>
          )
        })}
      </div>
    </div>
  )
}
