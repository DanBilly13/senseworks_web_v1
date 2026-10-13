import { afterEach, beforeEach } from 'vitest'

// jsdom does no layout, so every element reports scrollWidth/clientWidth
// of 0 and a carousel always looks like its cards fit (arrows hidden).
// Call inside a describe() to fake a row that overflows its scroller.
export function fakeOverflowingScroller() {
  const proto = HTMLElement.prototype
  const original = {
    scrollWidth: Object.getOwnPropertyDescriptor(proto, 'scrollWidth'),
    clientWidth: Object.getOwnPropertyDescriptor(proto, 'clientWidth'),
  }
  beforeEach(() => {
    Object.defineProperty(proto, 'scrollWidth', { configurable: true, get: () => 1200 })
    Object.defineProperty(proto, 'clientWidth', { configurable: true, get: () => 400 })
  })
  afterEach(() => {
    for (const [key, descriptor] of Object.entries(original)) {
      if (descriptor) Object.defineProperty(proto, key, descriptor)
      else delete (proto as unknown as Record<string, unknown>)[key]
    }
  })
}
