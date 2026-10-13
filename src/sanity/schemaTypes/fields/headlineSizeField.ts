import { defineField } from 'sanity'

// Shared by every Hero block: the headline stays the page's h1, this
// only changes how big it's drawn — Display is the biggest size on the
// site (see --text-display in globals.css, and SectionIntro's `display`
// prop). Section Headline has its own Size field (Display/H1/H2/H3).
export const headlineSizeField = () =>
  defineField({
    name: 'headlineSize',
    title: 'Headline size',
    description: 'Display is the biggest size on the site: 144px on desktop, 94px on mobile.',
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
