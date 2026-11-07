import { defineField } from 'sanity'

// Shared by every Hero block: the headline stays the page's h1, this
// only changes how big it's drawn — Display is the biggest size on the
// site (see --text-display in globals.css, and SectionIntro's `display`
// prop). Section Headline has its own Size field (Display/Headline/Title).
export const headlineSizeField = () =>
  defineField({
    name: 'headlineSize',
    title: 'Headline size',
    description: 'Headline is our section-heading size (56px desktop, 36px phones). Display is the biggest size on the site (144px desktop, 56px phones).',
    type: 'string',
    options: {
      list: [
        { title: 'Headline', value: 'h1' },
        { title: 'Display', value: 'display' },
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'h1',
  })
