import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-body-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:opacity-90',
        secondary: 'border border-border text-foreground hover:bg-muted',
      },
      size: {
        sm: 'px-medium py-small',
        md: 'px-medium-large py-small-medium',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  href: string
  children: ReactNode
}

export function Button({ href, variant, size, children }: ButtonProps) {
  return (
    <Link href={href} className={buttonVariants({ variant, size })}>
      {children}
    </Link>
  )
}
