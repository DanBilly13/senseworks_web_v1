import { NextResponse, type NextRequest } from 'next/server'
import { getPageVersions } from '@/lib/sanity/siteNavigation'

// The page versions (page.ts's "Version of"), for the team's versions
// menus — fetched by the header in team mode when a page loads, rather
// than baked into the cached pages: a version shows up as soon as it's
// published, whatever page copies are still cached.
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') === 'sv' ? 'sv' : 'en'
  return NextResponse.json(await getPageVersions(locale), { headers: { 'Cache-Control': 'no-store' } })
}
