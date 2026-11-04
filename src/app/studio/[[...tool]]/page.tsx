import type { Metadata } from 'next'
import Studio from './Studio'

// The editors' Studio, never a search result.
export const metadata: Metadata = { title: 'Studio — Senseworks', robots: { index: false, follow: false } }

export const dynamic = 'force-static'

export default function StudioPage() {
  return <Studio />
}
