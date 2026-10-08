// Swaps the near-black parts of an SVG for `ink` and leaves every other
// colour alone — so an uploaded two-colour icon (black + the purple of
// Audit, say) keeps its purple while its black follows the card it sits
// on: dark ink on a light card, white on a dark one.
//
// "Near-black" is anything darker than about a quarter brightness, plus
// the keywords black/currentColor, plus an SVG with no fill at all (an
// SVG's default fill is black).

const PROPERTY = /\b(fill|stroke|stop-color|flood-color|color)(\s*[:=]\s*)(["']?)(\s*)(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|[a-zA-Z]+)/g

function channelsOf(value: string): [number, number, number] | null {
  const hex = value.match(/^#([0-9a-fA-F]{3,8})$/)
  if (hex) {
    let h = hex[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const rgb = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

function isNearBlack(value: string): boolean {
  const v = value.trim().toLowerCase()
  if (v === 'black' || v === 'currentcolor') return true
  const channels = channelsOf(v)
  if (!channels) return false
  const [r, g, b] = channels
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.25
}

export function recolorSvg(svg: string, ink: string): string {
  let out = svg.replace(PROPERTY, (match, prop, sep, quote, space, value) =>
    isNearBlack(value) ? `${prop}${sep}${quote}${space}${ink}` : match,
  )
  // No fill declared on the root <svg>: the default (black) applies to
  // every shape that doesn't set its own, so set the ink there.
  out = out.replace(/<svg\b([^>]*)>/i, (match, attrs: string) =>
    /\bfill\s*=/.test(attrs) ? match : `<svg${attrs} fill="${ink}">`,
  )
  return out
}
