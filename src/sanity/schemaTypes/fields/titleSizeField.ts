import { defineField } from 'sanity'

// Reused by blocks whose items pair a title with a description and
// currently render that title as an H4 (Steps, Feature Grid, Dark
// Banner) — see ItemHeading (src/components/ui/ItemHeading.tsx),
// which actually renders whichever level this resolves to. H4 is the
// default so every existing block keeps its current look; H3 is for
// a bigger, bolder sub-heading, H5 for a smaller, quieter one.
export const titleSizeField = defineField({
  name: 'titleSize',
  title: 'Title size',
  type: 'string',
  options: {
    list: [
      { title: 'H3', value: 'h3' },
      { title: 'H4 (default)', value: 'h4' },
      { title: 'H5', value: 'h5' },
    ],
    layout: 'radio',
  },
  initialValue: 'h4',
})
