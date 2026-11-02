import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'
import { typingHeadlineField } from '../fields/typingHeadlineField'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Side-by-side (headline left, subtext right)', value: 'split' },
          { title: '50/50 split (text left, image right)', value: 'splitEven' },
          { title: 'Full-bleed image, text overlay bottom-left', value: 'imageOverlay' },
          {
            title: 'Scroll reveal — yellow block over fixed image/video (experimental)',
            value: 'scrollReveal',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    headlineSizeField(),
    typingHeadlineField(),
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    // Side-by-side's image (its own fields, not mediaWidth below: that
    // one's hidden default already stored "full" on existing heroes).
    defineField({
      name: 'imageWidth',
      title: 'Image width',
      description: 'Content width: inside the page column, rounded corners. Full screen width: edge to edge.',
      type: 'string',
      options: {
        list: [
          { title: 'Content width', value: 'content' },
          { title: 'Full screen width', value: 'full' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'content',
      hidden: ({ parent }) => (parent?.layout ?? 'split') !== 'split',
    }),
    defineField({
      name: 'splitImage',
      title: 'Image',
      description:
        'In the column: beside the text, rounded, in the ratio below. Half the screen: fills the right half of the screen from tablet up, edge to edge, top to bottom; the hero is at least 80% of the screen tall.',
      type: 'string',
      options: {
        list: [
          { title: 'In the column', value: 'column' },
          { title: 'Half the screen', value: 'half' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'column',
      hidden: ({ parent }) => parent?.layout !== 'splitEven',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'Behind the text half (and the text on phones). Dark and the dark gradient turn the text white.',
      type: 'string',
      options: {
        list: [
          { title: 'None (the page background)', value: 'none' },
          { title: 'Dark', value: 'inverse' },
          { title: 'Accent', value: 'accent' },
          { title: 'Dark accent gradient (the accent fading to black)', value: 'accentDark' },
          { title: 'Accent gradient (the accent fading to light grey, as on the heroes)', value: 'accentGradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      hidden: ({ parent }) => parent?.layout !== 'splitEven' || parent?.splitImage !== 'half',
    }),
    defineField({
      name: 'imageRatio',
      title: 'Image ratio',
      type: 'string',
      options: {
        list: [
          { title: '7:5', value: '7:5' },
          { title: '7:4 (wider)', value: '7:4' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '7:5',
      hidden: ({ parent }) =>
        !['split', 'splitEven', undefined].includes(parent?.layout) ||
        (parent?.layout === 'splitEven' && parent?.splitImage === 'half'),
    }),
    defineField({
      name: 'mediaWidth',
      title: 'Media width',
      description: '"Scroll Reveal" layout only.',
      type: 'string',
      options: {
        list: [
          { title: 'Full screen width', value: 'full' },
          { title: 'Content width (capped, centered)', value: 'content' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      hidden: ({ parent }) => parent?.layout !== 'scrollReveal',
    }),
  ],
  preview: {
    select: { title: 'headline', layout: 'layout' },
    prepare: ({ title, layout }) => ({
      title: `Hero — ${title || 'Untitled'}`,
      subtitle:
        layout === 'imageOverlay'
          ? 'Full-bleed image overlay'
          : layout === 'scrollReveal'
            ? 'Scroll reveal, yellow over fixed media'
            : layout === 'splitEven'
              ? '50/50 split'
              : 'Side-by-side',
    }),
  },
})
