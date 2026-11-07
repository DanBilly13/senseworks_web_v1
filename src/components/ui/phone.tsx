import type { ComponentProps } from 'react'
import { Media } from '@/components/ui/Media'
import { hasMedia, type MediaField } from '@/lib/sanity/media'
import { MD_SECTION_GAP_MB_CLASS, SECTION_GAP_MB_CLASS } from '@/components/ui/SectionShell'

// Helpers for blocks with a Mobile tab in Studio (Media, the heroes):
// each phone setting is "Same as desktop" ('inherit', or unset) or its
// own value.

type Gap = 'loose' | 'medium' | 'tight' | 'none'

// "Same as desktop" or the phone's own value.
export const phoneOr = <T,>(value: T | 'inherit' | undefined | null, desktop: T): T =>
  value === undefined || value === null || value === 'inherit' ? desktop : value

// The headline drawn at Display: on phones, and from tablet up.
export const phoneDisplay = (mobileHeadlineSize: string | undefined, desktop: boolean) =>
  mobileHeadlineSize === 'display' ? true : mobileHeadlineSize === 'h1' ? false : desktop

// The gap below a block as a bottom margin, with its own on phones.
export const gapMbClass = (desktop: Gap, phone: Gap) =>
  phone === desktop ? SECTION_GAP_MB_CLASS[desktop] : `${SECTION_GAP_MB_CLASS[phone]} ${MD_SECTION_GAP_MB_CLASS[desktop]}`

// Flex items alignment (left/center), with its own on phones.
export const itemsClass = (align: 'left' | 'center', phone: 'left' | 'center') =>
  phone === align
    ? align === 'center'
      ? 'items-center'
      : 'items-start'
    : phone === 'center'
      ? 'items-center md:items-start'
      : 'items-start md:items-center'

// The desktop media, or, with phone media set, each on its own screen.
export function ResponsiveMedia({ phone, className = '', ...props }: ComponentProps<typeof Media> & { phone?: MediaField }) {
  if (!hasMedia(phone)) return <Media className={className} {...props} />
  return (
    <>
      <Media {...props} media={phone} className={`${className} md:hidden`} />
      <Media {...props} className={`${className} max-md:hidden`} />
    </>
  )
}
