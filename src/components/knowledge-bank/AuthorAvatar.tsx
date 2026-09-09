'use client'
import { UserOutlined } from '@ant-design/icons'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

// A tiny client-boundary wrapper so the async (Server Component)
// article detail page never constructs an antd icon element itself —
// antd icons need a client-side React context (D16), which breaks
// ("createContext is not a function") if the importing file has no
// 'use client' boundary above it.
export function AuthorAvatar({
  media,
  alt,
  className,
  background,
}: {
  media: MediaField
  alt: string
  className: string
  background?: 'gradient' | 'none'
}) {
  return (
    <Media media={media} alt={alt} className={className} fallback={<UserOutlined />} background={background} />
  )
}
