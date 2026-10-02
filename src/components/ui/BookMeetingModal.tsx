'use client'
import { useCallback, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { buttonVariants } from '@/components/ui/Button'
import { BookMeetingContext } from '@/components/ui/bookMeetingContext'

type Copy = {
  heading: string
  intro: string
  contactTitle: string
  contactBody: string
  contactEmail: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  thanksHeading: string
  thanksBody: string
}

// Hardcoded per locale for now — design-only pass, nothing is wired to a
// backend or to Sanity yet (same D10 stance as NewsletterForm). Swedish is
// the real copy from the existing site's contact form.
const COPY: Record<'sv' | 'en', Copy> = {
  sv: {
    heading: 'Boka en tid',
    intro: 'Kontakta oss direkt eller skicka ett meddelande så hör vi av oss.',
    contactTitle: 'Kontakta Ian',
    contactBody: 'Jag finns här för att hjälpa dig med alla frågor!',
    contactEmail: 'ian@senseworks.io',
    nameLabel: 'Ditt namn',
    namePlaceholder: 'Förnamn Efternamn',
    emailLabel: 'Epost',
    emailPlaceholder: 'epost@epost.se',
    phoneLabel: 'Telefon (valfri)',
    phonePlaceholder: '07x-xxxxxxx',
    messageLabel: 'Meddelande',
    messagePlaceholder: 'Dela gärna något som kan vara bra att veta inför att vi bokar in ett möte.',
    submit: 'Skicka',
    thanksHeading: 'Tack!',
    thanksBody: 'Vi hör av oss så snart vi kan.',
  },
  en: {
    heading: 'Book a meeting',
    intro: 'Get in touch directly or send us a message and we’ll get back to you.',
    contactTitle: 'Contact Ian',
    contactBody: 'I’m here to help you with any questions!',
    contactEmail: 'ian@senseworks.io',
    nameLabel: 'Your name',
    namePlaceholder: 'First name Last name',
    emailLabel: 'Email',
    emailPlaceholder: 'email@email.com',
    phoneLabel: 'Phone (optional)',
    phonePlaceholder: '+46 70 000 00 00',
    messageLabel: 'Message',
    messagePlaceholder: 'Share anything that would be good to know before we book a meeting.',
    submit: 'Send',
    thanksHeading: 'Thank you!',
    thanksBody: 'We’ll be in touch as soon as we can.',
  },
}

// Underline-only fields (the reference layout's look) rather than the
// boxed inputs on the old purple form — a bottom border in the
// foreground color at 30%, firming up to full on focus.
const FIELD_CLASS =
  'w-full rounded-none border-b border-foreground/30 bg-transparent py-small-medium text-body text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none'

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={htmlFor} className="text-caption font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function BookMeetingContent({ copy }: { copy: Copy }) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // D10: UI-only for now — validate (native `required`/`type=email`)
    // and show the success state; nothing is sent anywhere yet.
    setSubmitted(true)
  }

  return (
    <div className="grid gap-large md:grid-cols-2 md:gap-2xl">
      <div className="flex flex-col gap-large md:pr-large">
        <div className="flex flex-col gap-medium">
          <h2 className="text-h2 font-bold text-balance text-foreground">{copy.heading}</h2>
          <p className="text-body-lg text-muted-foreground">{copy.intro}</p>
        </div>
        <div className="flex flex-col gap-small">
          <h3 className="text-h5 font-bold text-foreground">{copy.contactTitle}</h3>
          <p className="text-body text-muted-foreground">{copy.contactBody}</p>
          <a
            href={`mailto:${copy.contactEmail}`}
            className="text-body font-medium text-foreground underline underline-offset-4"
          >
            {copy.contactEmail}
          </a>
        </div>
      </div>

      {submitted ? (
        <div className="flex flex-col justify-center gap-small">
          <h3 className="text-h3 font-bold text-foreground">{copy.thanksHeading}</h3>
          <p className="text-body-lg text-muted-foreground">{copy.thanksBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-medium-large">
          <Field label={copy.nameLabel} htmlFor="book-meeting-name">
            <input
              id="book-meeting-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label={copy.emailLabel} htmlFor="book-meeting-email">
            <input
              id="book-meeting-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label={copy.phoneLabel} htmlFor="book-meeting-phone">
            <input
              id="book-meeting-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={copy.phonePlaceholder}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label={copy.messageLabel} htmlFor="book-meeting-message">
            <textarea
              id="book-meeting-message"
              name="message"
              rows={3}
              placeholder={copy.messagePlaceholder}
              className={`${FIELD_CLASS} resize-none`}
            />
          </Field>
          <button type="submit" className={`${buttonVariants({ variant: 'filled-dark', size: 'md' })} self-start`}>
            {copy.submit}
          </button>
        </form>
      )}
    </div>
  )
}

// Mounted once for the whole site (see the locale layout) so any Button
// with href="#book-meeting" can open it, wherever it sits.
export function BookMeetingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  // Every route lives under a locale segment, same as HeaderBlock reads it.
  const pathname = usePathname()
  const locale = pathname.split('/')[1] === 'sv' ? 'sv' : 'en'
  const copy = COPY[locale]

  return (
    <BookMeetingContext.Provider value={{ open }}>
      {children}
      {/* Closing unmounts the content, so reopening starts from a blank
          form rather than the previous "thank you" state. */}
      <Modal open={isOpen} onClose={close} title={copy.heading} size="lg" showTitle={false}>
        <BookMeetingContent copy={copy} />
      </Modal>
    </BookMeetingContext.Provider>
  )
}
