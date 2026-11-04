import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/layout/NotFoundContent'

// Any address the site doesn't have, and any page Studio doesn't have
// (notFound()). Next adds noindex to a 404 by itself.
export const metadata: Metadata = { title: 'Page not found — Senseworks' }

export default function NotFound() {
  return <NotFoundContent />
}
