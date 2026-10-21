'use client'
import { useEffect, useSyncExternalStore } from 'react'

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
  window.dispatchEvent(new Event(EVENT))
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
