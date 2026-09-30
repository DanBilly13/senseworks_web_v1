import { defineField } from 'sanity'

// Reused by any block whose items pair a title with a description
// (Steps, Feature Grid, Dark Banner, Bento Grid) — see ItemHeading
// (src/components/ui/ItemHeading.tsx), the shared component that
// actually renders either layout. Stacked is every block's existing
// look, unchanged; Inline is the new "one smooth paragraph, title in
// bold" option, for use sparingly where it fits.
export const headingLayoutField = defineField({
  name: 'headingLayout',
  title: 'Title style',
  description:
    'Stacked: title above description, as usual. Inline: title and description flow together as one line — title bold and dark, description regular and grey — instead of stacking on separate lines.',
  type: 'string',
  options: {
    list: [
      { title: 'Stacked (default)', value: 'stacked' },
      { title: 'Inline', value: 'inline' },
    ],
    layout: 'radio',
  },
  initialValue: 'stacked',
})
