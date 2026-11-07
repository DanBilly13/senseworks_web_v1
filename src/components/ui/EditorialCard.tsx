import Image from 'next/image'
import Link from 'next/link'

// PREVIEW (lab only, not wired to Sanity yet): the "editorial" card Dan
// liked — a hairline across the top, a small label (and an optional mark)
// on a row under it, a big breath, an all-caps title, the body, then a
// button or link. The same anatomy boxed (a filled card) or with no fill
// at all (the line is the only frame). Gaps shrink as you go down:
// 24 → 64 (48 on phones) → 24 → 32.

export type EditorialSurface = 'none' | 'white' | 'dark' | 'accent'

type Props = {
  label?: string
  mark?: 'dot' | 'wave'
  title: string
  body?: string
  cta?: { label: string; href: string; kind?: 'button' | 'link' }
  surface?: EditorialSurface
  // For a 'none' card on a dark background.
  onDark?: boolean
  image?: { src: string; alt: string }
  titleSize?: 'h4' | 'h5'
}

const SURFACE: Record<Exclude<EditorialSurface, 'none'>, string> = {
  white: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
  accent: 'bg-accent text-foreground',
}

const WAVE_MASK = {
  maskImage: 'url(/senseworks-brandmark-pos.svg)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskImage: 'url(/senseworks-brandmark-pos.svg)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
}

export function EditorialCard({ label, mark, title, body, cta, surface = 'none', onDark, image, titleSize = 'h5' }: Props) {
  const boxed = surface !== 'none'
  const light = surface === 'dark' || (!boxed && onDark)
  const muted = light ? 'text-background/70' : 'text-muted-foreground'
  // A plain picture (src + alt), not a Sanity image, so no hasImage().
  const picture = image?.src ? image : undefined
  return (
    <article
      className={`flex flex-col ${boxed ? `overflow-hidden rounded-lg ${SURFACE[surface]}` : light ? 'text-background' : 'text-foreground'}`}
    >
      {picture && (
        <div className="relative aspect-media w-full">
          <Image src={picture.src} alt={picture.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className={`flex flex-1 flex-col ${boxed ? 'px-medium-large pt-card-top pb-large md:px-large md:pt-large' : ''}`}>
        <div className="flex items-start justify-between gap-medium border-t border-current pt-medium-large">
          {label && <p className="text-eyebrow leading-snug font-bold tracking-wider whitespace-pre-line uppercase">{label}</p>}
          {mark === 'dot' && <span aria-hidden className="mt-xs size-2.5 shrink-0 rounded-full bg-current" />}
          {mark === 'wave' && <span aria-hidden className="mt-xs h-3 w-10 shrink-0 bg-current" style={WAVE_MASK} />}
        </div>
        <h3
          className={`mt-stack font-bold tracking-tight text-balance uppercase ${titleSize === 'h4' ? 'text-h4' : 'text-h5'}`}
        >
          {title}
        </h3>
        {body && <p className={`mt-medium-large text-body-lg text-pretty ${muted}`}>{body}</p>}
        {cta &&
          (cta.kind === 'link' ? (
            <Link href={cta.href} className={`mt-large self-start text-body-sm font-medium underline underline-offset-4 ${light ? 'text-accent' : ''}`}>
              {cta.label}
            </Link>
          ) : (
            <Link
              href={cta.href}
              className="mt-large self-start rounded-full border border-current px-medium-large py-small-medium text-body-sm font-bold tracking-wide uppercase"
            >
              {cta.label}
            </Link>
          ))}
      </div>
    </article>
  )
}
