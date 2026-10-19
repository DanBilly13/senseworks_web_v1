'use client'
import { CalendarOutlined, CheckCircleFilled, UserOutlined } from '@ant-design/icons'
import { Media } from '@/components/ui/Media'
import { Tag } from '@/components/ui/Tag'
import { formatReleaseDate, STAGES, TAGS, type Release, type ReleaseLocale } from '@/lib/releases'

const MAX_TEAM = 6

// One release as a project-management-style card: a colored category
// chip, the team's photos, title, text, an optional image, a three-step
// stage bar (In development → Rolling out → Shipped — a stage, never a
// percentage, so nothing reads as a promised date) and, once shipped,
// the date. Shared by Release Cards (Home) and Releases Timeline.
export function ReleaseCard({ release, locale }: { release: Release; locale: ReleaseLocale }) {
  const tag = release.tag ? TAGS[release.tag] : undefined
  const stageIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === (release.stage ?? 'shipped')))
  const stage = STAGES[stageIndex]
  const shipped = stage.id === 'shipped'

  return (
    <div className="flex flex-col rounded-lg border border-border bg-background">
      <div className="flex flex-1 flex-col gap-medium-large p-medium-large md:p-large">
        {(tag || release.team?.length) && (
          <div className="flex items-center justify-between gap-medium">
            {tag ? <Tag color={tag.color}>{tag.label[locale]}</Tag> : <span />}
            {release.team && release.team.length > 0 && (
              // 32px round photos, each overlapping the one before by 4px.
              // The ring in the card's own color keeps the edges apart
              // where they overlap.
              <ul className="flex items-center" aria-label="Team">
                {release.team.slice(0, MAX_TEAM).map((person, i) => (
                  <li key={i} className={`size-large shrink-0 rounded-full ring-2 ring-background ${i > 0 ? '-ml-xs' : ''}`}>
                    <Media
                      media={person.photo ? { mediaType: 'image', image: person.photo } : undefined}
                      alt={person.name ?? ''}
                      className="size-full rounded-full text-muted-foreground"
                      fallback={<UserOutlined />}
                      background="none"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex flex-col gap-medium-large">
          <h3 className="text-h5 font-bold text-balance text-foreground">{release.title}</h3>
          {release.description && <p className="text-body text-muted-foreground">{release.description}</p>}
        </div>
        {release.media && (
          <Media media={release.media} alt={release.title} className="aspect-media w-full rounded-md border border-border" />
        )}
      </div>
      <div className="flex flex-col gap-medium border-t border-border p-medium-large md:px-large md:py-medium-large">
        <div className="flex flex-col gap-small">
          <span className="flex items-center gap-small text-body-sm font-medium text-foreground">
            {shipped && <CheckCircleFilled aria-hidden="true" />}
            {stage.label[locale]}
          </span>
          {/* Three equal segments, filled up to the current stage. */}
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={STAGES.length}
            aria-valuenow={stageIndex + 1}
            aria-valuetext={stage.label[locale]}
            aria-label={release.title}
            className="grid w-full grid-cols-3 gap-xs"
          >
            {STAGES.map((step, i) => (
              <div key={step.id} className={`h-small rounded-full ${i <= stageIndex ? 'bg-foreground' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
        {/* Only a shipped release has a date: nothing rolling out or in
            development shows one, so nothing reads as a promise. */}
        {shipped && release.date && (
          <div className="flex items-center gap-small text-body-sm text-muted-foreground">
            <CalendarOutlined aria-hidden="true" />
            <span>{formatReleaseDate(release.date, locale)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
