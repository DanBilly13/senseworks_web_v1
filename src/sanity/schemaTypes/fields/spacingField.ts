import { defineField } from 'sanity'

// Reused by any block that routes through SectionShell and wants its
// own py="loose"|"medium"|"tight" exposed as an editor choice, rather
// than staying hardcoded at SectionShell's own 'loose' default.
export const spacingField = defineField({
  name: 'spacing',
  title: 'Section spacing',
  description: 'The gap below this block, before the next one. Loose unless a page needs tighter rhythm here.',
  type: 'string',
  options: {
    list: [
      { title: 'Loose (200px)', value: 'loose' },
      { title: 'Medium (120px)', value: 'medium' },
      { title: 'Tight (60px)', value: 'tight' },
    ],
    layout: 'radio',
  },
  initialValue: 'loose',
})
