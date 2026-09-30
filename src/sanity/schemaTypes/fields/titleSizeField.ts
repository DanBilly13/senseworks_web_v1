import { defineField } from 'sanity'

// Reused by blocks whose items pair a title with a description and
// currently render that title as an H4 (Steps, Feature Grid, Dark
// Banner) — see ItemHeading (src/components/ui/ItemHeading.tsx),
// which actually renders whichever level this resolves to. H4 is the
// default so every existing block keeps its current look; H3 is for
// when an item title should read as a bigger, bolder sub-heading.
export const titleSizeField = defineField({
  name: 'titleSize',
  title: 'Title size',
  type: 'string',
  options: {
    list: [
      { title: 'H4 (default)', value: 'h4' },
      { title: 'H3', value: 'h3' },
    ],
    layout: 'radio',
  },
  initialValue: 'h4',
})
