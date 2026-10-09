import { defineField } from 'sanity'

// Shared by every Hero block: the headline stays the page's h1, this
// only changes how big it's drawn — Display is one step above H1 (see
// --text-display in globals.css, and SectionIntro's `display` prop).
export const headlineSizeField = defineField({
  name: 'headlineSize',
  title: 'Headline size',
  description: 'Display is much bigger than the standard H1: 144px vs 64px on desktop, 94px vs 38px on mobile.',
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
