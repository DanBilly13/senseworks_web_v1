'use client'
import { useEffect, useState, useSyncExternalStore } from 'react'

// Team mode: for the small team trying out page versions (page.ts's
// "Version of"). Open any page with ?team=1 and this browser remembers it
// (a cookie, for a year); ?team=0 turns it off. While on, the logo and
// any menu item with versions open a small menu of them (HeaderBlock).
// Everyone else sees the site exactly as normal.
const COOKIE = 'sw_team'
const EVENT = 'sw-team-change'

function readTeamCookie() {
  return document.cookie.split('; ').includes(`${COOKIE}=1`)
}

// Applies ?team=1 / ?team=0 from the address, if present.
function applyTeamParam() {
  const param = new URLSearchParams(window.location.search).get('team')
  if (param === '1') document.cookie = `${COOKIE}=1; path=/; max-age=31536000; samesite=lax`
  else if (param === '0') document.cookie = `${COOKIE}=; path=/; max-age=0; samesite=lax`
  else return
  // Drop ?team from the address, so a refresh (and any link copied from
  // here) is the page's ordinary address — an address with ?team=1 can be
  // served an older cached copy of the page.
  const url = new URL(window.location.href)
  url.searchParams.delete('team')
  window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(EVENT))
}

// The page versions, fetched once team mode is on (never cached, see
// api/versions); empty otherwise.
export function usePageVersions<T>(team: boolean, locale: string): T[] {
  const [versions, setVersions] = useState<T[]>([])
  useEffect(() => {
    if (!team) return
    let cancelled = false
    fetch(`/api/versions?locale=${locale}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((list: T[]) => {
        if (!cancelled) setVersions(list)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [team, locale])
  return team ? versions : []
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

// False on the server and on first paint (so the pre-built page and the
// browser agree), then the browser's real answer.
export function useTeamMode(): boolean {
  useEffect(applyTeamParam, [])
  return useSyncExternalStore(subscribe, readTeamCookie, () => false)
}
