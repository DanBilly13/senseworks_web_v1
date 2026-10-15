import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LOCALE_COOKIE, preferredLocale } from '@/lib/i18n/locales'

// The bare site address picks a language: the visitor's last choice in
// the language switcher, else their browser's, else English (D12). Only
// here — a link straight to /en/… or /sv/… is always honoured as is.
export default async function RootPage() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()])
  redirect(`/${preferredLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerList.get('accept-language'))}/home`)
}
