import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Every page is statically generated with no revalidate interval (see
// [locale]/[...slug]/page.tsx's own comment) — once built, Vercel just
// keeps serving that same HTML forever, regardless of what changes
// afterward in Sanity. This is the other half: a webhook (configured
// in Sanity, POSTing here on every publish) that tells Vercel to
// throw the cached HTML away so the next visit rebuilds it with fresh
// content.
//
// Every route ultimately reads through a handful of Sanity document
// types (page, testimonial, client, teamMember, article, tag) with no
// reverse-index of which page depends on which document — for this
// site's small page count, busting every path on any publish is
// simpler and safer than maintaining that mapping, and the cost is
// negligible.
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; _id?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }
    if (!body?._type) {
      return NextResponse.json({ message: 'Missing _type in payload' }, { status: 400 })
    }

    revalidatePath('/', 'layout')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
      id: body._id,
    })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
