import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// The real urlFor() builds on the Sanity client, which needs a real
// projectId/dataset — not set in the test environment. Every block
// that can render media imports it transitively via <Media>, so this
// is mocked globally rather than per test file.
vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({ url: () => 'https://cdn.sanity.io/images/mock-project/production/mock.jpg' }),
}))

// Without `test.globals: true` in vitest.config.ts, Testing Library's
// automatic cleanup-after-each-test never registers (it only patches
// a global `afterEach`), so unmounted renders pile up in the DOM
// across tests in the same file — surfaced by a carousel test whose
// two cases both query for identically-labeled buttons.
afterEach(() => {
  cleanup()
})
