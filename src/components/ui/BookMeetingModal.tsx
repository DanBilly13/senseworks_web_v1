'use client'
import { useCallback, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Media } from '@/components/ui/Media'
import { buttonVariants } from '@/components/ui/Button'
import { BookMeetingContext } from '@/components/ui/bookMeetingContext'
import type { BookMeetingSettings } from '@/lib/sanity/bookMeeting'

type Copy = {
  heading: string
  intro: string
  contactTitle: string
  contactBody: string
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

// Fallback copy per locale — used for anything not filled in under
// "Book a meeting" in Studio (heading, intro, contact text, button and
// thank-you text come from there when set), and for the form field
// labels/placeholders, which stay here. Nothing is sent anywhere yet
// (same D10 stance as NewsletterForm).
const COPY: Record<'sv' | 'en', Copy> = {
  sv: {
    heading: 'Boka en genomgång',
    intro: 'Fyll i dina uppgifter så hör vi av oss för att boka en tid som passar er.',
    contactTitle: 'Kontakta Ian direkt',
    contactBody: 'Jag finns här för att svara på frågor eller boka in dig direkt!',
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
    heading: 'Book a walkthrough',
    intro: 'Fill in your details and we’ll get in touch to book a time that suits you.',
    contactTitle: 'Contact Ian directly',
    contactBody: 'I’m here to answer questions or book you in directly!',
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

function BookMeetingContent({
  copy,
  contact,
  showContact,
}: {
  copy: Copy
  contact: NonNullable<BookMeetingSettings>['contact']
  showContact: boolean
}) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // D10: UI-only for now — validate (native `required`/`type=email`)
    // and show the success state; nothing is sent anywhere yet.
    setSubmitted(true)
  }

  return (
    <div className="grid gap-large md:grid-cols-2 md:gap-2xl">
      {/* justify-between: on desktop this column is as tall as the form
          beside it, so the contact block sits at the bottom, level with
          the Send button, rather than floating right under the intro. */}
      <div className="flex flex-col gap-large md:justify-between md:pr-large">
        <div className="flex flex-col gap-large">
          <h2 className="text-h2 font-bold text-balance text-foreground">{copy.heading}</h2>
          <p className="text-body-lg text-muted-foreground">{copy.intro}</p>
        </div>
        {showContact && (
          <div className="flex flex-col gap-medium">
            {contact?.photo && (
              <Media
                media={{ mediaType: 'image', image: contact.photo }}
                alt={contact.name ?? ''}
                className="size-2xl shrink-0 rounded-full"
                background="none"
              />
            )}
            <div className="flex flex-col gap-small">
              <h3 className="text-body-lg font-bold text-foreground">{copy.contactTitle}</h3>
              <p className="text-body text-muted-foreground">{copy.contactBody}</p>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-body font-medium text-foreground underline underline-offset-4"
                >
                  {contact.email}
                </a>
              )}
            </div>
          </div>
        )}
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
export function BookMeetingProvider({
  children,
  locale,
  settings,
}: {
  children: ReactNode
  locale: string
  settings: BookMeetingSettings
}) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Studio's text wins where it's filled in; anything blank falls back
  // to the hardcoded copy for that locale.
  const copy: Copy = { ...COPY[locale === 'sv' ? 'sv' : 'en'] }
  for (const key of ['heading', 'intro', 'contactTitle', 'contactBody', 'submit', 'thanksHeading', 'thanksBody'] as const) {
    const fromStudio = key === 'submit' ? settings?.submitLabel : settings?.[key]
    if (fromStudio) copy[key] = fromStudio
  }

  return (
    <BookMeetingContext.Provider value={{ open }}>
      {children}
      {/* Closing unmounts the content, so reopening starts from a blank
          form rather than the previous "thank you" state. */}
      <Modal open={isOpen} onClose={close} title={copy.heading} size="lg" showTitle={false}>
        <BookMeetingContent
          copy={copy}
          contact={settings?.contact}
          // Unset (an older document, or no document at all) counts as on.
          showContact={settings?.showContact !== false}
        />
      </Modal>
    </BookMeetingContext.Provider>
  )
}
