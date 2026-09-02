import { redirect } from 'next/navigation'

export default function RootPage() {
  // D12: English is the default locale.
  redirect('/en/home')
}
