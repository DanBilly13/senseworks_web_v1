import { Select } from '@sanity/ui'
import { set, unset, type StringInputProps } from 'sanity'

export type IconPreset = { title: string; value: string }

// A dropdown for Feature Grid's "Icon (from the list)". It reads its
// choices from `options.presets` rather than Sanity's own
// `options.list`, because a string with `options.list` is a hard error
// for any value not on it — and Home v3 kept coming back with icon
// names from elsewhere ("description", "search"…), which blocked
// publishing even though its uploaded icons win anyway. Here an
// unknown value shows as such, can be cleared, and only warns (see the
// field's validation); the site ignores it.
export function IconPresetInput(props: StringInputProps) {
  const { value, onChange, elementProps, schemaType } = props
  const presets = ((schemaType.options as { presets?: IconPreset[] } | undefined)?.presets ?? [])
  const known = !value || presets.some((p) => p.value === value)

  return (
    <Select
      {...elementProps}
      value={value ?? ''}
      onChange={(e) => onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())}
    >
      <option value="">None (the checkmark)</option>
      {!known && <option value={value}>{`“${value}” — not on the list, ignored`}</option>}
      {presets.map((p) => (
        <option key={p.value} value={p.value}>
          {p.title}
        </option>
      ))}
    </Select>
  )
}
