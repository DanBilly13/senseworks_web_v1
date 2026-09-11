'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './IntegrationCardStack.module.css'

/* Senseworks — integration card stack animation.
   Fixed 700×500 canvas (7:5). Every position, size and translate below is a
   literal px value in that space — no relative units, no breakpoints, no
   scale-to-fit math. Wrapped in ScaledCanvas (see Media.tsx) to place it at
   any container width. Pure React + one CSS Module; icons are inlined Ant
   Design Icon paths (MIT). */

const CANVAS_W = 700
const CANVAS_H = 500

type IconName = 'reload' | 'link' | 'setting' | 'check' | 'loading'

const ICONS: Record<IconName, string> = {
  reload:
    'M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z',
  link: 'M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z',
  setting:
    'M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z',
  check:
    'M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z',
  loading:
    'M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z',
}

function Icon({ name, size = 16, weight = 0 }: { name: IconName; size?: number; weight?: number }) {
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={ICONS[name]} fill="currentColor" stroke="currentColor" strokeWidth={weight} />
    </svg>
  )
}

export type IntegrationCardData = {
  id: string
  name: string
  logo: string
  logoHeight?: number
  dataTypes: string[]
}

export const DEFAULT_CARDS: IntegrationCardData[] = [
  {
    id: 'spiris',
    name: 'Spiris',
    logo: '/animations/integration-card-stack/spiris.svg',
    logoHeight: 25,
    dataTypes: ['Huvudbok', 'Verifikationer'],
  },
  {
    id: 'handelsbanken',
    name: 'Handelsbanken',
    logo: '/animations/integration-card-stack/handelsbanken.svg',
    logoHeight: 21,
    dataTypes: ['Banktransaktioner', 'Kontoutdrag'],
  },
  {
    id: 'bjornlunden',
    name: 'Björn Lundén',
    logo: '/animations/integration-card-stack/bjornlunden.png',
    logoHeight: 25,
    dataTypes: ['Huvudbok', 'Dokument och fakturor'],
  },
  {
    id: 'fortnox',
    name: 'Fortnox',
    logo: '/animations/integration-card-stack/fortnox.svg',
    logoHeight: 21,
    dataTypes: ['Huvudbok', 'Dokument och fakturor'],
  },
  {
    id: 'skatteverket',
    name: 'Skatteverket',
    logo: '/animations/integration-card-stack/skatteverket.png',
    logoHeight: 24,
    dataTypes: ['Skattekonto', 'Arbetsgivardeklaration', 'Momsdeklaration'],
  },
]

type CardState = 'available' | 'pending' | 'active'

type CardProps = IntegrationCardData & {
  state?: CardState
  note?: string
  badge?: string
  greenCount?: number | null
  syncing?: boolean
  pressed?: boolean
  actionLabel?: string
  actionVariant?: 'primary' | 'secondary' | 'success'
  actionIcon?: IconName
  spinNote?: boolean
}

const DEFAULTS: Record<CardState, { note: string; label: string; icon: IconName; variant: 'secondary' | 'success' }> = {
  available: { note: 'Tillgänglig för integration', label: 'Aktivera', icon: 'link', variant: 'secondary' },
  pending: { note: 'Väntar på godkännande', label: 'Aktiverar…', icon: 'link', variant: 'secondary' },
  active: { note: 'Integrationen löper tills vidare', label: 'Hantera', icon: 'setting', variant: 'success' },
}

function IntegrationCard({
  name,
  logo,
  logoHeight = 24,
  state = 'active',
  note,
  badge,
  dataTypes = [],
  greenCount = null,
  syncing = false,
  pressed = false,
  actionLabel,
  actionVariant,
  actionIcon,
  spinNote = false,
}: CardProps) {
  const d = DEFAULTS[state]
  const markIsGreen = (i: number) => (greenCount === null ? state === 'active' : i < greenCount)

  return (
    <div className={styles.card} data-state={state}>
      <div className={styles.head}>
        <div className={styles.logo} style={{ ['--isc-logo-h' as string]: `${logoHeight}px` }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed small logo mark inside a self-contained animation, not a page image */}
          <img src={logo} alt={name} />
        </div>
        <button
          type="button"
          className={styles.sync}
          data-syncing={syncing ? 'true' : undefined}
          aria-label="Synkronisera"
          title="Synkronisera"
        >
          <Icon name="reload" size={12} weight={40} />
        </button>
      </div>

      <div className={styles.body}>
        {badge ? (
          <span className={styles.badge}>{badge}</span>
        ) : (
          <div className={styles.note} data-plain={state === 'available' ? 'true' : undefined} data-spin={spinNote ? 'true' : undefined}>
            {state === 'pending' ? <Icon name="loading" size={14} weight={40} /> : null}
            <span>{note ?? d.note}</span>
          </div>
        )}

        <div className={styles.types}>
          {dataTypes.map((label, i) => (
            <div className={styles.type} key={label}>
              <span
                className={styles.mark}
                data-tone={markIsGreen(i) ? undefined : 'muted'}
                data-pop={greenCount !== null && markIsGreen(i) ? 'true' : undefined}
                aria-hidden="true"
              >
                <Icon name="check" size={9} weight={80} />
              </span>
              <span title={label}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <button type="button" className={styles.btn} data-variant={actionVariant ?? d.variant} data-pressed={pressed ? 'true' : undefined}>
          {actionLabel ?? d.label}
          <span className={styles.keyline}>
            <Icon name={actionIcon ?? d.icon} size={14} />
          </span>
        </button>
      </div>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])
  return reduced
}

type IntegrationCardStackProps = {
  cards?: IntegrationCardData[]
  landDuration?: number
  beat?: number
  checkStep?: number
  exitPause?: number
  dropLand?: number
  dropDuration?: number
  exitStagger?: number
  enterScale?: number
  stackOffset?: number
  stackShrink?: number
  loop?: boolean
  className?: string
}

export function IntegrationCardStack({
  cards = DEFAULT_CARDS,
  landDuration = 420,
  beat = 380,
  checkStep = 620,
  exitPause = 900,
  dropLand = 240,
  dropDuration = 300,
  exitStagger = 190,
  enterScale = 1.45,
  stackOffset = 13,
  stackShrink = 0.045,
  loop = true,
  className,
}: IntegrationCardStackProps) {
  const n = cards.length
  const last = n - 1
  const reduced = usePrefersReducedMotion()

  const [phase, setPhase] = useState<'build' | 'press' | 'pending' | 'badge' | 'active'>('build')
  const [step, setStep] = useState(-1) // index of the card that has landed
  const [green, setGreen] = useState(0) // green marks on the final card
  const [exit, setExit] = useState(0) // cards that have dropped away
  const [arming, setArming] = useState(false) // one un-transitioned frame before a land
  const [warp, setWarp] = useState(false) // un-transitioned reset at loop
  const [runId, setRunId] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const replay = useCallback(() => setRunId((r) => r + 1), [])

  // One state machine: a queue of [delay, fn] steps drives the whole timeline.
  useEffect(() => {
    let alive = true
    const queue: Array<[number, () => void]> = []
    const at = (wait: number, fn: () => void) => queue.push([wait, fn])
    const pump = () => {
      if (!alive || !queue.length) return
      const [wait, fn] = queue.shift()!
      timer.current = setTimeout(() => {
        if (!alive) return
        fn()
        pump()
      }, wait)
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase('build')
    setStep(-1)
    setGreen(0)
    setExit(0)
    setWarp(true)

    const land = (i: number) => {
      setStep(i)
      setArming(true)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (alive) setArming(false)
        }),
      )
    }

    for (let i = 0; i < n; i++) at(i === 0 ? 360 : landDuration + beat, () => land(i))
    at(landDuration + beat, () => setPhase('press'))
    at(280, () => {
      setPhase('pending')
      setGreen(0)
    })
    const marks = cards[last].dataTypes.length
    at(1250, () => setGreen(1))
    for (let k = 2; k <= marks; k++) at(checkStep, () => setGreen(k))
    at(700, () => setPhase('badge'))
    at(260, () => setPhase('active'))
    at(exitPause, () => setExit(1))
    for (let k = 1; k <= last; k++) at(dropLand + exitStagger, () => setExit(k + 1))
    if (loop) at(900, replay)

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (alive) {
          setWarp(false)
          pump()
        }
      }),
    )

    return () => {
      alive = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [runId, n, last, cards, landDuration, beat, checkStep, exitPause, dropLand, exitStagger, loop, replay])

  const TR_LAND = `transform ${landDuration}ms var(--isc-ease-snap), opacity var(--isc-dur-fade) linear`
  const TR_PROMOTE = 'transform var(--isc-dur-promote) var(--isc-ease-snap)'
  const TR_DROP = `transform ${dropDuration}ms var(--isc-ease-exit)`
  const ENTER = `translate3d(0,18px,0) scale(${enterScale})`

  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ width: CANVAS_W, height: CANVAS_H }}
      onClick={replay}
      title="Click to replay"
    >
      {cards.map((card, i) => {
        const isLast = i === last
        const d = step - exit - i
        const dropped = i >= n - exit
        const still = warp || (arming && d === 0)
        const snap = still || (exit > 0 && d === 0)

        let transform: string
        let opacity: number
        let transition: string
        if (dropped) {
          // Literal px: 470 carries the card clear of the 500px canvas edge.
          transform = 'translate3d(0,470px,0) scale(.96)'
          opacity = 1
          transition = TR_DROP
        } else if (d < 0 || still) {
          transform = ENTER
          opacity = 0
          transition = snap ? 'none' : TR_LAND
        } else {
          transform = `translate3d(0,${-d * stackOffset}px,0) scale(${(1 - d * stackShrink).toFixed(3)})`
          opacity = 1 - d * 0.06
          transition = snap ? 'none' : exit > 0 ? TR_PROMOTE : TR_LAND
        }

        // The final card carries the activation states; the rest stay live.
        let props: CardProps = { ...card, state: 'active' }
        if (isLast) {
          if (phase === 'build' || phase === 'press') {
            props = { ...card, state: 'available', pressed: phase === 'press' }
          } else if (phase === 'pending') {
            props = {
              ...card,
              state: 'pending',
              syncing: true,
              spinNote: true,
              greenCount: green,
              note: green >= card.dataTypes.length ? 'Kopplar datakällor' : undefined,
            }
          } else if (phase === 'badge') {
            props = {
              ...card,
              state: 'active',
              badge: 'Synkar automatiskt',
              syncing: true,
              actionLabel: 'Aktiverar…',
              actionVariant: 'secondary',
              actionIcon: 'link',
            }
          } else {
            props = { ...card, state: 'active', badge: 'Synkar automatiskt' }
          }
        }

        return (
          <div
            key={card.id}
            className={styles.slot}
            data-front={d === 0 ? 'true' : undefined}
            style={{ transform, opacity, transition: reduced ? 'none' : transition, zIndex: 10 - Math.max(d, 0) }}
          >
            <IntegrationCard {...props} />
          </div>
        )
      })}
    </div>
  )
}
