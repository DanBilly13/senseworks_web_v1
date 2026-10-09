import { defineField } from 'sanity'

// Shared by every Hero block and Section Headline: the heading keeps
// its real level (h1/h2), this only changes how big it's drawn —
// Display is the biggest size on the site (see --text-display in
// globals.css, and SectionIntro's `display` prop). `standard` is the
// default option's stored value and label: Heroes always store 'h1'
// (their standard size), Section Headline's follows its Heading level.
export const headlineSizeField = (
  standard: { value: string; title: string } = { value: 'h1', title: 'H1 (default)' },
) =>
  defineField({
    name: 'headlineSize',
    title: 'Headline size',
    description: 'Display is the biggest size on the site: 144px on desktop, 94px on mobile.',
    type: 'string',
    options: {
      list: [standard, { title: 'Display', value: 'display' }],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: standard.value,
  })
