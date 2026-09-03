import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '@/lib/sanity/client'
import { getPage, type PageDoc } from '@/lib/sanity/getPage'

// The real sanityClient.fetch has a complex overloaded signature (it
// infers types from a GROQ query string). For this unit test we only
// care about the args it's called with and the value it resolves to,
// so we cast the mock to a simple, honest shape instead of fighting
// the overload resolution.
const fetchMock = vi.mocked(sanityClient.fetch) as unknown as {
  mockResolvedValueOnce: (value: PageDoc) => void
}

describe('getPage locale fallback (D12)', () => {
  it('passes both the requested locale and slug to the coalesce query', async () => {
    fetchMock.mockResolvedValueOnce({ title: 'Home', language: 'en', slug: 'home', blocks: [] })

    await getPage('home', 'sv')

    expect(sanityClient.fetch).toHaveBeenCalledWith(expect.stringContaining('coalesce'), {
      slug: 'home',
      locale: 'sv',
    })
  })

  it('does not throw when the query resolves to the English fallback document', async () => {
    fetchMock.mockResolvedValueOnce({ title: 'Home', language: 'en', slug: 'home', blocks: [] })

    const result = await getPage('home', 'sv')

    expect(result?.language).toBe('en')
  })
})
