import type { ReactNode } from 'react'

// Splits only the first word off as "the number" — existing content
// is already written as one string ("01 TID"), so this avoids a
// separate schema field and any content migration. The badge only
// gets that first word's own classes (background/padding/radius/
// color); it inherits the eyebrow paragraph's font-size/weight/
// tracking as-is, so the number reads at the same size as the rest.
//
// bg-foreground/text-accent on a light surface; a solid accent-yellow
// badge on a dark surface would put yellow text on a yellow badge and
// disappear, so dark gets the inverse pairing instead — a plain
// isDark boolean rather than each caller's own multi-value tone type,
// since every tone ultimately reduces to one of these two pairings.
export function renderNumberedEyebrow(eyebrow: string, numbered: boolean, isDark: boolean): ReactNode {
  if (!numbered) return eyebrow
  const [number, ...rest] = eyebrow.trim().split(' ')
  const restText = rest.join(' ')
  const badgeClass = isDark
    ? 'rounded-xs bg-accent px-xs py-xs text-foreground'
    : 'rounded-xs bg-foreground px-xs py-xs text-accent'
  return (
    <>
      <span className={badgeClass}>{number}</span>
      {restText && ` ${restText}`}
    </>
  )
}
