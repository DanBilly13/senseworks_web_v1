'use client'
import { createContext, useContext } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ArrowRightOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

// Lets a page turn on the animated hover treatment for every Button
// underneath it (v1/v2) without threading an `animated` prop through
// every block component that renders one. An explicit `animated` prop
// on a given Button always wins over this default.
const AnimatedButtonContext = createContext(false)
export const AnimatedButtonProvider = AnimatedButtonContext.Provider

export const buttonVariants = cva(
  'group inline-flex items-center justify-center rounded-full text-body-sm font-medium transition-colors',
  {
    variants: {
      // Named by shape + color, not role (primary/secondary) — any
      // of the three filled colors can be the dominant CTA on a
      // given background, so a hierarchy name would just describe
      // which one happened to ship first, not what it actually is.
      variant: {
        'filled-dark': 'bg-foreground text-background hover:opacity-90',
        'filled-accent': 'bg-accent text-accent-foreground hover:opacity-90',
        // For use on a dark/foreground-colored surface (e.g. a
        // featured pricing card) where filled-dark would be invisible
        // against the same-colored background.
        'filled-light': 'bg-background text-foreground hover:opacity-90',
        ghost: 'border border-border text-foreground hover:bg-muted',
      },
      size: {
        sm: 'px-medium py-small',
        md: 'px-medium-large py-small-medium',
      },
    },
    defaultVariants: { variant: 'filled-dark', size: 'md' },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  href: string
  children: ReactNode
  // Reveals a bordered right-arrow circle on hover with a springy
  // expand (Figma "Frame 29458" -> "Frame 29460"). Composes with every
  // color variant above. Defaults to the page-level AnimatedButtonProvider
  // value when not set explicitly.
  animated?: boolean
}

export function Button({ href, variant, size, children, animated }: ButtonProps) {
  const contextAnimated = useContext(AnimatedButtonContext)
  const isAnimated = animated ?? contextAnimated

  return (
    <Link
      href={href}
      className={[
        buttonVariants({ variant, size }),
        isAnimated && 'transition-all duration-300 ease-spring hover:pr-small',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {isAnimated && (
        // Staggered both ways, in reverse order of each other. In: the
        // wrapper grows immediately (delay-0), the icon fades in 100ms
        // later. Out: the icon fades out immediately (delay-0), and the
        // wrapper only starts shrinking once that fade finishes (its own
        // rest-state delay-150 matches the icon's fade-out duration) —
        // "the arrow leaves, then the space closes" instead of the
        // reverse. The transition-delay values live on each state (base
        // vs group-hover) rather than one shared class, since a CSS
        // transition always takes its delay/duration from the rule that
        // applies *after* the change, so enter and exit can differ.
        <span className="ml-0 flex max-w-0 items-center justify-center overflow-hidden delay-150 transition-all duration-300 ease-spring group-hover:ml-small group-hover:max-w-large group-hover:delay-0">
          <span className="flex size-large shrink-0 items-center justify-center rounded-full border border-current opacity-0 transition-opacity delay-0 duration-150 group-hover:opacity-100 group-hover:delay-100 group-hover:duration-200">
            <ArrowRightOutlined />
          </span>
        </span>
      )}
    </Link>
  )
}
