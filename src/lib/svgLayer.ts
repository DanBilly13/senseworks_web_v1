// Splits an uploaded icon SVG into one of three colour slots, so the
// site can paint each slot from CSS (see UploadedIcon) and an icon
// follows its page theme and card without an editor doing anything:
//
// - ink:    the black lines — dark on a light card, white on a dark one
// - paper:  white / cut-out parts — the card's own background colour
// - accent: any real colour — the page theme's accent (yellow, the
//           Audit purple, the Analysis green), whatever the file used
//
// The returned SVG is a luminance mask: the slot's parts are white,
// every other part black, so paint order is kept (a white dot drawn on
// a black shape still cuts a hole in the ink layer).

export type IconSlot = 'ink' | 'paper' | 'accent'

const PROPERTY = /\b(fill|stroke|stop-color|flood-color|color)(\s*[:=]\s*)(["']?)(\s*)(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|[a-zA-Z]+)/g

// Values that aren't a colour to classify — left exactly as they are.
const PASS_THROUGH = new Set(['none', 'transparent', 'inherit', 'initial', 'unset', 'url', 'context'])

function parse(value: string): { rgb: [number, number, number]; alpha: string | null } | null {
  const hex = value.match(/^#([0-9a-fA-F]{3,8})$/)
  if (hex) {
    let h = hex[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    return {
      rgb: [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)],
      alpha: h.length === 8 ? String(parseInt(h.slice(6, 8), 16) / 255) : null,
    }
  }
  const rgb = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+%?))?/)
  if (rgb) return { rgb: [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])], alpha: rgb[4] ?? null }
  return null
}

// Greys (no real hue) go to whichever of black/white they're nearer;
// anything with a clear hue — even a pale one like the Senseworks
// yellow — is the accent.
export function slotOf(value: string): IconSlot | null {
  const v = value.trim().toLowerCase()
  if (v === 'black' || v === 'currentcolor') return 'ink'
  if (v === 'white') return 'paper'
  if (PASS_THROUGH.has(v)) return null
  const parsed = parse(v)
  if (!parsed) return /^[a-z]+$/.test(v) ? 'accent' : null
  const [r, g, b] = parsed.rgb
  const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255
  if (chroma >= 0.15) return 'accent'
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5 ? 'ink' : 'paper'
}

export function svgLayer(svg: string, layer: IconSlot): string {
  const on = (slot: IconSlot) => (slot === layer ? '#ffffff' : '#000000')
  let out = svg.replace(PROPERTY, (match, prop, sep, quote, space, value: string) => {
    const slot = slotOf(value)
    if (!slot) return match
    const alpha = parse(value.trim().toLowerCase())?.alpha
    const color = alpha ? `rgba(${slot === layer ? '255,255,255' : '0,0,0'},${alpha})` : on(slot)
    return `${prop}${sep}${quote}${space}${color}`
  })
  // No fill declared on the root <svg>: the default (black) applies to
  // every shape that doesn't set its own — the ink slot.
  out = out.replace(/<svg\b([^>]*)>/i, (match, attrs: string) =>
    /\bfill\s*=/.test(attrs) ? match : `<svg${attrs} fill="${on('ink')}">`,
  )
  return out
}
