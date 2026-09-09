'use client'
import { UserOutlined } from '@ant-design/icons'
import { Media } from '@/components/ui/Media'
import type { TeamMember } from '@/lib/sanity/team'
import type { MediaField } from '@/lib/sanity/media'

export function TeamMemberCard({
  member,
  onSelect,
}: {
  member: TeamMember
  onSelect: () => void
}) {
  const photo: MediaField = member.photo ? { mediaType: 'image', image: member.photo } : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center gap-small-medium rounded-lg p-medium text-center"
    >
      <Media
        media={photo}
        alt={member.name}
        className="size-4xl shrink-0 rounded-full md:size-avatar-lg"
        fallback={<UserOutlined />}
      />
      <div className="flex flex-col">
        <span className="text-body-sm font-semibold text-foreground">{member.name}</span>
        {member.role && <span className="text-caption text-muted-foreground">{member.role}</span>}
      </div>
    </button>
  )
}
