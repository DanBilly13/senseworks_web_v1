'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { SectionShell } from '@/components/ui/SectionShell'

const COPY = {
  en: {
    eyebrow: '404',
    headline: 'This page has moved, or never existed.',
    body: 'The address may be from our old website. Start from the home page, or get in touch and we’ll point you to the right place.',
    home: 'Go to the home page',
    contact: 'Contact us',
    contactHref: '/en/kontakta-oss',
  },
  sv: {
    eyebrow: '404',
    headline: 'Sidan har flyttat, eller har aldrig funnits.',
    body: 'Adressen kan vara från vår gamla webbplats. Börja från startsidan, eller hör av dig så hjälper vi dig rätt.',
    home: 'Till startsidan',
    contact: 'Kontakta oss',
    contactHref: '/sv/kontakta-oss',
  },
}

// The "page not found" page. A not-found page is told nothing about the
// request, so the language comes from the address: /sv/… in Swedish,
// everything else in English.
export function NotFoundContent() {
  const locale = usePathname()?.startsWith('/sv') ? 'sv' : 'en'
  const copy = COPY[locale]
  return (
    <main lang={locale} className="flex flex-1 flex-col">
      <SectionShell py="large" pad="both">
        <Link href={`/${locale}/home`} aria-label="Senseworks" className="self-start">
          <Image src="/senseworks-logo.svg" alt="Senseworks" width={160} height={32} className="h-large w-auto" priority />
        </Link>
      </SectionShell>
      <SectionShell py="section-edge" pad="both" className="flex flex-1 flex-col justify-center">
        <SectionIntro
          as="h1"
          eyebrow={copy.eyebrow}
          heading={copy.headline}
          body={copy.body}
          cta={
            <div className="flex flex-wrap gap-medium">
              <Button href={`/${locale}/home`} variant="filled-dark">
                {copy.home}
              </Button>
              <Button href={copy.contactHref} variant="ghost">
                {copy.contact}
              </Button>
            </div>
          }
        />
      </SectionShell>
    </main>
  )
}
