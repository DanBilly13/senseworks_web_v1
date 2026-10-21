'use client'
import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'

const LABELS = {
  blog: { en: 'All posts', sv: 'Alla inlägg' },
  customerStories: { en: 'All customer stories', sv: 'Alla kundberättelser' },
  knowledgeBank: { en: 'Knowledge Bank', sv: 'Kunskapsbank' },
}
const PATHS = { blog: 'blog', customerStories: 'customer-stories', knowledgeBank: 'knowledge-bank' }

// The way back to a blog post's, customer story's or Knowledge Bank
// article's list, in the page's language. At the top of the page it's
// just the arrow (`iconOnly`; screen readers still hear "All posts");
// at the end of a page it's "← All customer stories" in full.
export function BackLink({ to, locale, iconOnly = false }: { to: keyof typeof LABELS; locale: string; iconOnly?: boolean }) {
  const lang = locale === 'sv' ? 'sv' : 'en'
  return (
    <Link
      href={`/${lang}/${PATHS[to]}`}
      aria-label={iconOnly ? LABELS[to][lang] : undefined}
      className="group inline-flex items-center gap-small text-body-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeftOutlined aria-hidden="true" className={`transition-transform group-hover:-translate-x-xs ${iconOnly ? 'text-h5' : ''}`} />
      {!iconOnly && LABELS[to][lang]}
    </Link>
  )
}
