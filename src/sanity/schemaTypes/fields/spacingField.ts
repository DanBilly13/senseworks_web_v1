import { defineField } from 'sanity'

const SPACING_OPTIONS = [
  { title: 'Loose (200px)', value: 'loose' },
  { title: 'Medium (120px)', value: 'medium' },
  { title: 'Tight (60px)', value: 'tight' },
  { title: 'None (0px)', value: 'none' },
]

// Reused by any block that routes through SectionShell and wants its
// own py="loose"|"medium"|"tight" exposed as an editor choice, rather
// than staying hardcoded at SectionShell's own 'loose' default.
export const spacingField = defineField({
  name: 'spacing',
  title: 'Section spacing',
  description: 'The gap below this block, before the next one. Loose unless a page needs tighter rhythm here.',
  type: 'string',
  options: { list: SPACING_OPTIONS, layout: 'radio' },
  initialValue: 'loose',
})

// Same four values as Section spacing above, but for a block's own
// internal top/bottom padding (e.g. Full Width Single, a single
// full-bleed panel) rather than the gap between two blocks — each
// edge independently settable instead of tied together.
export const paddingField = (edge: 'top' | 'bottom', defaultValue: 'loose' | 'medium' | 'tight' | 'none' = 'loose') =>
  defineField({
    name: edge === 'top' ? 'paddingTop' : 'paddingBottom',
    title: edge === 'top' ? 'Top padding' : 'Bottom padding',
    type: 'string',
    options: { list: SPACING_OPTIONS, layout: 'radio' },
    initialValue: defaultValue,
  })
