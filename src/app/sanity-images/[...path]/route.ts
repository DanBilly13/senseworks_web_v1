import { svgLayer, type IconSlot } from '@/lib/svgLayer'

// Same-origin path to Sanity's image CDN, used for icons drawn as a CSS
// mask (Feature Grid, Dark Banner — see maskUrlFor in lib/sanity/image).
// Browsers fetch a mask-image in CORS mode and refuse a cross-origin one
// that comes without CORS headers; the CDN sends none, and answers a
// request that carries an Origin header (which the browser adds in CORS
// mode, even through a plain rewrite) with a 403. Fetching it here,
// server-side, with no Origin, sidesteps both.
const CDN_IMAGES = 'https://cdn.sanity.io/images/'

// For an SVG, ?layer=ink|paper|accent returns just that colour slot as
// a luminance mask (see svgLayer) — UploadedIcon stacks the three and
// paints each from CSS, so an icon follows its card and page theme.
const LAYERS: IconSlot[] = ['ink', 'paper', 'accent']

export async function GET(request: Request, ctx: RouteContext<'/sanity-images/[...path]'>) {
  const { path } = await ctx.params
  if (path.some((segment) => segment === '..' || segment === '.')) {
    return new Response('Not found', { status: 404 })
  }
  const upstream = await fetch(CDN_IMAGES + path.map(encodeURIComponent).join('/'))
  if (!upstream.ok) return new Response('Not found', { status: upstream.status === 404 ? 404 : 502 })
  const layer = new URL(request.url).searchParams.get('layer') as IconSlot | null
  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
  if (layer && LAYERS.includes(layer) && contentType.includes('svg')) {
    return new Response(svgLayer(await upstream.text(), layer), {
      headers: { 'content-type': contentType, 'cache-control': 'public, max-age=31536000, immutable' },
    })
  }
  return new Response(upstream.body, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
