'use client'
import { useCallback, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { Modal } from '@/components/ui/Modal'
import { buttonVariants } from '@/components/ui/Button'
import { BookWebinarContext } from '@/components/ui/bookWebinarContext'
import { useBookMeeting } from '@/components/ui/bookMeetingContext'
// The same fields as Book a meeting's form (underlined, small bold label).
import { FIELD_CLASS, Field } from '@/components/ui/BookMeetingModal'
import type { WebinarSettings } from '@/lib/sanity/webinar'

type Copy = {
  dateLabel: string
  heading: string
  intro: string
  points: string[]
  meetingLinkLabel: string
  seatsLabel: string
  seatsLeftOf: (left: number, total: number) => string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  firmLabel: string
  firmPlaceholder: string
  auditorsLabel: string
  submit: string
  finePrint: string
  thanksHeading: string
  thanksBody: string
}

// Fallback copy per locale (Dan's sketch) — anything filled in under
// "Book a webinar" in Studio wins. The form labels and the seats line
// stay here. Nothing is sent anywhere yet (same D10 stance as Book a
// meeting): validate, then show the thank-you.
const COPY: Record<'sv' | 'en', Copy> = {
  sv: {
    dateLabel: 'Livewebinar · [DATUM] kl. [TID] · 45 min',
    heading: 'Se Ally live. Boka din plats.',
    intro: 'Vi håller gruppen liten så att alla hinner ställa sina frågor till våra revisorer.',
    points: [
      'Livedemo av Ally i ett riktigt revisionsuppdrag',
      'Så bygger vi AI som håller vid en kvalitetskontroll',
      'Frågestund med revisorerna bakom Senseworks',
    ],
    meetingLinkLabel: 'Hellre en egen genomgång? Boka 30 minuter',
    seatsLabel: 'Platserna går fort',
    seatsLeftOf: (left, total) => `${left} av ${total} kvar`,
    nameLabel: 'Namn',
    namePlaceholder: 'Förnamn Efternamn',
    emailLabel: 'E-post i jobbet',
    emailPlaceholder: 'namn@byra.se',
    firmLabel: 'Byrå',
    firmPlaceholder: 'Byråns namn',
    auditorsLabel: 'Antal revisorer',
    submit: 'Säkra min plats',
    finePrint: 'Kostnadsfritt. Platserna fördelas i den ordning anmälningarna kommer in, och kalenderinbjudan skickas direkt.',
    thanksHeading: 'Din plats är bokad!',
    thanksBody: 'Kalenderinbjudan är på väg till din inkorg.',
  },
  en: {
    dateLabel: 'Live webinar · [DATE] at [TIME] · 45 min',
    heading: 'See Ally live. Book your seat.',
    intro: 'We keep the group small, so everyone has time to put their questions to our auditors.',
    points: [
      'A live demo of Ally on a real audit engagement',
      'How we build AI that holds up in a quality review',
      'Q&A with the auditors behind Senseworks',
    ],
    meetingLinkLabel: 'Rather have your own walkthrough? Book 30 minutes',
    seatsLabel: 'Seats are going fast',
    seatsLeftOf: (left, total) => `${left} of ${total} left`,
    nameLabel: 'Name',
    namePlaceholder: 'First name Last name',
    emailLabel: 'Work email',
    emailPlaceholder: 'name@firm.com',
    firmLabel: 'Firm',
    firmPlaceholder: 'Your firm’s name',
    auditorsLabel: 'Number of auditors',
    submit: 'Save my seat',
    finePrint: 'Free of charge. Seats go in the order sign-ups come in, and the calendar invite is sent straight away.',
    thanksHeading: 'Your seat is booked!',
    thanksBody: 'The calendar invite is on its way to your inbox.',
  },
}

const AUDITOR_OPTIONS = ['1–10', '11–50', '51–200', '200+']

function BookWebinarContent({
  copy,
  seatsTotal,
  seatsLeft,
  onBookMeeting,
}: {
  copy: Copy
  seatsTotal: number
  seatsLeft: number
  onBookMeeting: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }
  // The bar fills with the seats already taken.
  const taken = Math.min(100, Math.max(0, ((seatsTotal - seatsLeft) / seatsTotal) * 100))

  return (
    // Two halves edge to edge: the text on our light grey, the form on
    // white (stacked, grey first, on mobile).
    <div className="grid md:grid-cols-2">
      <div className="flex flex-col gap-large bg-muted p-large md:p-2xl">
        <span className="self-start rounded-full bg-background px-medium py-small text-body-sm font-medium text-foreground">
          {copy.dateLabel}
        </span>
        <h2 className="text-h2 font-bold text-balance text-foreground">{copy.heading}</h2>
        <p className="text-body-lg text-muted-foreground">{copy.intro}</p>
        {copy.points.length > 0 && (
          <ul className="flex flex-col gap-medium">
            {copy.points.map((point) => (
              // items-baseline + a cap-height circle: it sits on the text's
              // baseline and reaches exactly to the top of its capitals.
              <li key={point} className="flex items-baseline gap-small-medium text-body-lg text-foreground">
                <span className="check-cap relative shrink-0 rounded-full bg-foreground text-accent">
                  <CheckOutlined className="absolute inset-0 m-auto flex items-center justify-center" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onBookMeeting}
          // mt-auto: down at the bottom, level with the fine print opposite.
          className="mt-auto self-start text-left text-body-lg font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          {copy.meetingLinkLabel} →
        </button>
      </div>

      {/* justify-between: the seats line at the top, level with the
          date chip opposite, and the fine print at the bottom, level with
          the walkthrough link. */}
      <div className="flex flex-col justify-between gap-large bg-background p-large md:p-2xl">
        {submitted ? (
          <div className="flex flex-1 flex-col justify-center gap-small">
            <h3 className="text-h3 font-bold text-foreground">{copy.thanksHeading}</h3>
            <p className="text-body-lg text-muted-foreground">{copy.thanksBody}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-small">
              <div className="flex items-center justify-between gap-medium text-body-lg">
                <span className="flex items-center gap-small text-foreground">
                  <span aria-hidden="true" className="webinar-accent-bg size-small rounded-full" />
                  {copy.seatsLabel}
                </span>
                <span className="font-semibold whitespace-nowrap text-foreground">{copy.seatsLeftOf(seatsLeft, seatsTotal)}</span>
              </div>
              <div className="h-small w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <div className="webinar-accent-bg h-full rounded-full" style={{ width: `${taken}%` }} />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-large">
              <div className="flex flex-col gap-medium-large">
                <Field label={copy.nameLabel} htmlFor="webinar-name">
                  <input id="webinar-name" name="name" type="text" required autoComplete="name" placeholder={copy.namePlaceholder} className={FIELD_CLASS} />
                </Field>
                <Field label={copy.emailLabel} htmlFor="webinar-email">
                  <input id="webinar-email" name="email" type="email" required autoComplete="email" placeholder={copy.emailPlaceholder} className={FIELD_CLASS} />
                </Field>
                <Field label={copy.firmLabel} htmlFor="webinar-firm">
                  <input id="webinar-firm" name="firm" type="text" required autoComplete="organization" placeholder={copy.firmPlaceholder} className={FIELD_CLASS} />
                </Field>
                <Field label={copy.auditorsLabel} htmlFor="webinar-auditors">
                  <select id="webinar-auditors" name="auditors" className={FIELD_CLASS} defaultValue={AUDITOR_OPTIONS[0]}>
                    {AUDITOR_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <button type="submit" className={`${buttonVariants({ variant: 'filled-dark', size: 'md' })} w-full`}>
                {copy.submit}
              </button>
            </form>
            <p className="text-body-sm text-muted-foreground">{copy.finePrint}</p>
          </>
        )}
      </div>
    </div>
  )
}

// Mounted once for the whole site (see the locale layout), next to Book
// a meeting, so any Button with href="#book-webinar" can open it.
export function BookWebinarProvider({
  children,
  locale,
  settings,
}: {
  children: ReactNode
  locale: string
  settings: WebinarSettings
}) {
  const [isOpen, setIsOpen] = useState(false)
  // The modal sits outside the page's theme wrapper, so it takes the
  // theme of the page it was opened from (the seats bar and dot follow
  // it — see .webinar-accent-bg in globals.css).
  const [theme, setTheme] = useState('default')
  const open = useCallback(() => {
    setTheme(document.querySelector('[data-page-theme]:not([data-webinar])')?.getAttribute('data-page-theme') ?? 'default')
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const { open: openBookMeeting } = useBookMeeting()

  const fallback = COPY[locale === 'sv' ? 'sv' : 'en']
  const points = (settings?.points ?? []).map((point) => point.text).filter((text): text is string => !!text)
  const copy: Copy = {
    ...fallback,
    ...Object.fromEntries(
      (
        ['dateLabel', 'heading', 'intro', 'meetingLinkLabel', 'seatsLabel', 'finePrint', 'thanksHeading', 'thanksBody'] as const
      ).flatMap((key) => (settings?.[key] ? [[key, settings[key]]] : [])),
    ),
    ...(settings?.submitLabel ? { submit: settings.submitLabel } : {}),
    points: points.length ? points : fallback.points,
  }
  const seatsTotal = settings?.seatsTotal && settings.seatsTotal > 0 ? settings.seatsTotal : 100
  const seatsLeft = Math.min(seatsTotal, Math.max(0, settings?.seatsLeft ?? 23))

  return (
    <BookWebinarContext.Provider value={{ open }}>
      {children}
      <div className="contents" data-page-theme={theme} data-webinar="">
        {/* Closing unmounts the content, so reopening starts from a blank form. */}
        <Modal open={isOpen} onClose={close} title={copy.heading} size="xl" showTitle={false} padded={false}>
          <BookWebinarContent
            copy={copy}
            seatsTotal={seatsTotal}
            seatsLeft={seatsLeft}
            onBookMeeting={() => {
              close()
              openBookMeeting()
            }}
          />
        </Modal>
      </div>
    </BookWebinarContext.Provider>
  )
}
