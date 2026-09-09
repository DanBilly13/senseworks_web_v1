'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { LinkedinOutlined, UserOutlined, XOutlined } from '@ant-design/icons'
import { Modal } from '@/components/ui/Modal'
import { Media } from '@/components/ui/Media'
import { TeamMemberCard } from './TeamMemberCard'
import type { TeamMember } from '@/lib/sanity/team'
import type { MediaField } from '@/lib/sanity/media'

// The small yellow squares under the photo (LinkedIn/X) — a look
// specific to this dark card, not the site's general circular
// IconButton, so it's kept local rather than forcing that component
// to grow a shape variant it has no other use for yet.
function SocialBadge({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-xl items-center justify-center rounded-md bg-accent text-accent-foreground hover:opacity-90"
    >
      {children}
    </a>
  )
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const photo: MediaField = selected?.photo ? { mediaType: 'image', image: selected.photo } : null
  const bioParagraphs = selected?.bio?.split('\n\n').filter(Boolean) ?? []
  // First word on its own line, everything else on the second — holds
  // up for a middle name or a two-word surname ("Simon Lilliesköld
  // Jonsson"), not just a strict two-token name.
  const [firstName, ...restNameParts] = selected?.name.split(' ') ?? []
  const restName = restNameParts.join(' ')

  return (
    <>
      <div className="grid grid-cols-2 gap-medium sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <TeamMemberCard key={member._id} member={member} onSelect={() => setSelected(member)} />
        ))}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} tone="inverse">
        {selected && (
          // One row: photo (fixed left column) + everything else
          // (name, role, bio, icons) stacked in the right column next
          // to it — not full-card-width blocks below the photo. The
          // photo can end well before the text column does; that gap
          // is exactly why the "No Bio" and "With Bio" Figma frames
          // are such different heights despite the same photo size.
          <div className="flex items-start gap-xl">
            <Media
              media={photo}
              alt={selected.name}
              className="size-avatar-lg shrink-0 rounded-full"
              fallback={<UserOutlined />}
            />
            <div className="flex flex-col gap-small-medium pt-small">
              <h4 className="text-h4 font-medium text-balance">
                {firstName}
                <br />
                {restName}
              </h4>
              {selected.role && <span className="text-body font-semibold text-accent">{selected.role}</span>}
              {bioParagraphs.length > 0 && (
                <div className="mt-small flex flex-col gap-medium">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-body text-background/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {(selected.linkedinUrl || selected.xUrl) && (
                <div className="mt-small flex gap-small">
                  {selected.xUrl && (
                    <SocialBadge href={selected.xUrl} label={`${selected.name} on X`}>
                      <XOutlined />
                    </SocialBadge>
                  )}
                  {selected.linkedinUrl && (
                    <SocialBadge href={selected.linkedinUrl} label={`${selected.name} on LinkedIn`}>
                      <LinkedinOutlined />
                    </SocialBadge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
