// The site's analytics and ad-measurement IDs, and the one conversion it
// reports. None of these are secret: they appear in any page's source
// once the tags load. The tags themselves only load after a visitor
// consents (components/ConsentManager.tsx).

// Google Analytics 4: account Senseworks, property senseworks.io, web
// stream "SW Website" (owned by dan@senseworks.io).
export const GA_MEASUREMENT_ID = 'G-1GXMN3EE4X'

// LinkedIn Insight Tag: ad account Senseworks.io (560516386).
export const LINKEDIN_PARTNER_ID = '11252713'

// A "Lead" conversion made in LinkedIn Campaign Manager (Measure →
// Conversion tracking, method "Event-specific"). Until it's set, form
// submissions are counted in GA4 only.
export const LINKEDIN_LEAD_CONVERSION_ID: number | null = null

type Gtag = (...args: unknown[]) => void
type Lintrk = (action: 'track', data: { conversion_id: number }) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
    lintrk?: Lintrk
  }
}

// A form sent successfully: a lead in GA4 (generate_lead, or sign_up for
// the newsletter) and, once its conversion exists, in LinkedIn. Does
// nothing for a visitor who hasn't accepted the tags.
export function trackLead(form: 'book_meeting' | 'book_webinar' | 'newsletter') {
  window.gtag?.('event', form === 'newsletter' ? 'sign_up' : 'generate_lead', { form_name: form })
  if (LINKEDIN_LEAD_CONVERSION_ID && form !== 'newsletter') {
    window.lintrk?.('track', { conversion_id: LINKEDIN_LEAD_CONVERSION_ID })
  }
}
