'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { buttonVariants } from '@/components/ui/Button'

type NewsletterFormProps = {
  heading?: string
  placeholder?: string
}

// Extracted out of FooterBlock so any future block needing the same
// signup form doesn't have to duplicate it. Fixed light styling (not
// a tone prop) since every current use sits on a dark (bg-foreground)
// surface.
export function NewsletterForm({ heading, placeholder }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // D10: v1 forms are UI-only — validate and show the success state,
    // no real backend yet. D9: replace the form inline, no navigation.
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-body text-background/80">Thanks — you&rsquo;re on the list.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-small-medium sm:flex-row">
      <input
        type="email"
        required
        placeholder={placeholder}
        aria-label={heading ?? 'Email address'}
        className="w-full rounded-md border border-background/30 bg-transparent px-medium py-small-medium text-body-sm text-background placeholder:text-background/50 sm:max-w-prose-xs"
      />
      <button type="submit" className={buttonVariants({ variant: 'filled-light', size: 'sm' })}>
        Subscribe
      </button>
    </form>
  )
}
