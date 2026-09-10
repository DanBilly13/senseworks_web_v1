import { sanityClient } from './client'
import { clientLogosQuery } from './queries'
import type { MediaField } from './media'

export type ClientLogo = { name: string; media: MediaField }

export function getClientLogos(): Promise<ClientLogo[]> {
  return sanityClient.fetch(clientLogosQuery)
}
