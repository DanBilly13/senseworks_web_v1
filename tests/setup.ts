import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Without `test.globals: true` in vitest.config.ts, Testing Library's
// automatic cleanup-after-each-test never registers (it only patches
// a global `afterEach`), so unmounted renders pile up in the DOM
// across tests in the same file — surfaced by a carousel test whose
// two cases both query for identically-labeled buttons.
afterEach(() => {
  cleanup()
})
