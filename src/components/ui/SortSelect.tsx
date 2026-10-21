'use client'
import { DownOutlined } from '@ant-design/icons'

export type SortOrder = 'newest' | 'oldest'

const LABELS = {
  sort: { en: 'Sort', sv: 'Sortera' },
  newest: { en: 'Newest first', sv: 'Nyast först' },
  oldest: { en: 'Oldest first', sv: 'Äldst först' },
}

// The "Newest first / Oldest first" control next to the filter chips on
// the Knowledge Bank and Customer stories pages: a white pill matching
// the chips, with its own arrow (the browser's default one sat cramped
// against the text). Still a native <select>, so it works with the
// keyboard and opens the phone's own picker.
export function SortSelect({ value, onChange, locale }: { value: SortOrder; onChange: (value: SortOrder) => void; locale: string }) {
  const lang = locale === 'sv' ? 'sv' : 'en'
  return (
    <label className="flex items-center gap-small text-caption font-medium text-muted-foreground">
      {LABELS.sort[lang]}
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOrder)}
          className="cursor-pointer appearance-none rounded-full bg-background py-xs pr-large pl-small-medium text-caption font-medium text-foreground hover:ring-1 hover:ring-border"
        >
          <option value="newest">{LABELS.newest[lang]}</option>
          <option value="oldest">{LABELS.oldest[lang]}</option>
        </select>
        <DownOutlined aria-hidden="true" className="pointer-events-none absolute right-small-medium text-caption text-foreground" />
      </span>
    </label>
  )
}
