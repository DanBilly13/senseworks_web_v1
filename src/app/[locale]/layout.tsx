import type { ReactNode } from 'react'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }]
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
