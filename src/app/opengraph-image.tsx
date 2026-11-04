import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// The picture LinkedIn, Slack and the rest show when someone shares a
// link to any page (none sets its own yet): the dark brand screen, the
// headline in the accent, the logo top left and the mark bottom right,
// like the Scroll Zoom hero. Drawn once at build time.
export const alt = 'Senseworks — the world’s first AI fluent in audit'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const file = (path: string) => readFile(join(process.cwd(), path))
const svgData = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

export default async function Image() {
  const [aeonikBold, logo, mark] = await Promise.all([
    file('src/app/fonts/Aeonik-Bold.otf'),
    file('public/senseworks-logo-neg.svg'),
    file('public/senseworks-brandmark-pos.svg'),
  ])
  // The mark is drawn in the dark ink; white on the dark screen.
  const whiteMark = mark.toString().replace(/fill="(?!none)[^"]*"/g, 'fill="#ffffff"')
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#101829',
          fontFamily: 'Aeonik',
        }}
      >
        <img src={svgData(logo.toString())} alt="" width={341} height={44} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: -2.5, color: '#fbfeac', maxWidth: 860 }}>
            The world’s first AI fluent in audit.
          </div>
          <img src={svgData(whiteMark)} alt="" width={122} height={36} />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Aeonik', data: aeonikBold, style: 'normal', weight: 700 }] },
  )
}
