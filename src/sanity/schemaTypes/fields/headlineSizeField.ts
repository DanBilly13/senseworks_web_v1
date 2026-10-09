import { defineField } from 'sanity'

// Shared by every Hero block: the headline stays the page's h1, this
// only changes how big it's drawn — Display is one step above H1 (see
// --text-display in globals.css, and SectionIntro's `display` prop).
export const headlineSizeField = defineField({
  name: 'headlineSize',
  title: 'Headline size',
  description: 'Display is one step bigger than the standard H1 (72px vs 64px on desktop).',
  type: 'string',
  options: {
    list: [
      { title: 'H1 (default)', value: 'h1' },
      { title: 'Display', value: 'display' },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'h1',
})
