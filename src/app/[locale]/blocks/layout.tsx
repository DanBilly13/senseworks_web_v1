import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// The blocks gallery (and its gradient and rules pages) is an internal
// reference for the team, never a search result.
export const metadata: Metadata = {
  title: 'Blocks — Senseworks',
  robots: { index: false, follow: false },
}

export default function BlocksLayout({ children }: { children: ReactNode }) {
  return children
}
