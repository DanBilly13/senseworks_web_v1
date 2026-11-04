'use client'
import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { GA_MEASUREMENT_ID, LINKEDIN_PARTNER_ID } from '@/lib/analytics'

// The cookie banner, and the tags that wait for it. Nothing that tracks
// loads before a visitor says yes ("basic" Consent Mode: no requests to
// Google or LinkedIn at all until then):
// - Analytics → Google Analytics 4
// - Marketing → the LinkedIn Insight Tag (and Google's ad signals)
// Google is told the choice through Consent Mode v2. Turning a category
// off later clears its cookies and reloads, so its tag stops too. The
// choice is kept for six months in the cc_cookie cookie. A link to
// "#cookie-settings" (the footer's) opens the settings again.
// Styled to the site in globals.css (#cc-main).

type Locale = 'en' | 'sv'

const policy = (locale: Locale) => `/${locale}/kakpolicy`

const TRANSLATIONS: Record<Locale, CookieConsent.Translation> = {
  en: {
    consentModal: {
      title: 'We use cookies',
      description: `To see how the site is used and to measure our ads on LinkedIn and Google. They’re only set if you accept. <a href="${policy('en')}">Cookie policy</a>`,
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      showPreferencesBtn: 'Settings',
    },
    preferencesModal: {
      title: 'Cookie settings',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      savePreferencesBtn: 'Save my choices',
      closeIconLabel: 'Close',
      sections: [
        {
          title: 'Necessary',
          description: 'Needed for the site to work: they remember your language and this choice. Always on.',
          linkedCategory: 'necessary',
        },
        {
          title: 'Analytics',
          description: 'Google Analytics: which pages are read and where visitors come from, so we can improve the site.',
          linkedCategory: 'analytics',
        },
        {
          title: 'Marketing',
          description: 'LinkedIn and Google: which ads lead to a booked walkthrough, and showing our ads to people who have visited.',
          linkedCategory: 'marketing',
        },
        { description: `More about each cookie in our <a href="${policy('en')}">cookie policy</a>.` },
      ],
    },
  },
  sv: {
    consentModal: {
      title: 'Vi använder kakor',
      description: `För att se hur webbplatsen används och för att mäta våra annonser på LinkedIn och Google. De sätts bara om du godkänner. <a href="${policy('sv')}">Kakpolicy</a>`,
      acceptAllBtn: 'Godkänn alla',
      acceptNecessaryBtn: 'Avvisa alla',
      showPreferencesBtn: 'Inställningar',
    },
    preferencesModal: {
      title: 'Kakinställningar',
      acceptAllBtn: 'Godkänn alla',
      acceptNecessaryBtn: 'Avvisa alla',
      savePreferencesBtn: 'Spara mina val',
      closeIconLabel: 'Stäng',
      sections: [
        {
          title: 'Nödvändiga',
          description: 'Behövs för att webbplatsen ska fungera: de kommer ihåg ditt språk och det här valet. Alltid på.',
          linkedCategory: 'necessary',
        },
        {
          title: 'Analys',
          description: 'Google Analytics: vilka sidor som läses och var besökarna kommer ifrån, så att vi kan förbättra webbplatsen.',
          linkedCategory: 'analytics',
        },
        {
          title: 'Marknadsföring',
          description: 'LinkedIn och Google: vilka annonser som leder till en bokad genomgång, och att visa våra annonser för den som har besökt oss.',
          linkedCategory: 'marketing',
        },
        { description: `Mer om varje kaka i vår <a href="${policy('sv')}">kakpolicy</a>.` },
      ],
    },
  },
}

const loadScript = (src: string) => {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

let gaLoaded = false
let linkedInLoaded = false

// Consent Mode v2: the four signals Google reads, from the two categories.
function consentState() {
  const analytics = CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied'
  const marketing = CookieConsent.acceptedCategory('marketing') ? 'granted' : 'denied'
  return { analytics_storage: analytics, ad_storage: marketing, ad_user_data: marketing, ad_personalization: marketing }
}

function applyConsent() {
  const state = consentState()
  if (state.analytics_storage === 'granted' || state.ad_storage === 'granted') {
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || []
      // gtag's own stub: it must push `arguments`, not an array.
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments)
      }
      window.gtag('consent', 'default', { ...state, wait_for_update: 500 })
    } else {
      window.gtag('consent', 'update', state)
    }
    if (state.analytics_storage === 'granted' && !gaLoaded) {
      gaLoaded = true
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID)
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`)
    }
  } else if (window.gtag) {
    window.gtag('consent', 'update', state)
  }
  if (state.ad_storage === 'granted' && !linkedInLoaded) {
    linkedInLoaded = true
    const w = window as unknown as { _linkedin_partner_id: string; _linkedin_data_partner_ids: string[] }
    w._linkedin_partner_id = LINKEDIN_PARTNER_ID
    w._linkedin_data_partner_ids = [...(w._linkedin_data_partner_ids || []), LINKEDIN_PARTNER_ID]
    loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js')
  }
}

export function ConsentManager({ locale, tracking }: { locale: string; tracking: boolean }) {
  const lang: Locale = locale === 'sv' ? 'sv' : 'en'

  useEffect(() => {
    // Once per page load; a language switch only changes the text.
    if (document.documentElement.dataset.consentReady) {
      void CookieConsent.setLanguage(lang)
      return
    }
    document.documentElement.dataset.consentReady = 'true'
    void CookieConsent.run({
      cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
      guiOptions: {
        consentModal: { layout: 'box inline', position: 'bottom left', equalWeightButtons: true },
        preferencesModal: { layout: 'box', equalWeightButtons: true },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: { autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }], reloadPage: true } },
        marketing: { autoClear: { cookies: [{ name: /^li_/ }, { name: '_gcl_au' }], reloadPage: true } },
      },
      language: { default: lang, translations: TRANSLATIONS },
      // Local dev and preview deploys show the banner but never load
      // the tags, so testing doesn't count as visits.
      onConsent: () => tracking && applyConsent(),
      onChange: () => tracking && applyConsent(),
    })
  }, [lang, tracking])

  // "Cookie settings" anywhere on the page (the footer's legal links).
  useEffect(() => {
    const open = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href="#cookie-settings"]')
      if (!link) return
      event.preventDefault()
      CookieConsent.showPreferences()
    }
    document.addEventListener('click', open)
    return () => document.removeEventListener('click', open)
  }, [])

  return null
}
