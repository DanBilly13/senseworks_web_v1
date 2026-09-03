import type { ReactNode } from 'react'

type SectionShellProps = {
  maxWidth?: 'page' | 'prose-lg'
  py?: '3xl' | 'large'
  sectionClassName?: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}

const MAX_WIDTH_CLASS = {
  page: 'max-w-page',
  'prose-lg': 'max-w-prose-lg',
}

const PY_CLASS = {
  '3xl': 'py-3xl',
  large: 'py-large',
}

export function SectionShell({
  maxWidth = 'page',
  py = '3xl',
  sectionClassName,
  className,
  ariaLabel,
  children,
}: SectionShellProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={[PY_CLASS[py], sectionClassName].filter(Boolean).join(' ')}
    >
      <div
        className={['mx-auto w-full px-medium-large', MAX_WIDTH_CLASS[maxWidth], className]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  )
}
