import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField, paddingField } from '../fields/spacingField'

export const statsBandBlock = defineType({
  name: 'statsBandBlock',
  title: 'Stats Band',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'contentGap',
      title: 'Gap between text and stats',
      description:
        'Above and below the stats: between the heading and the stats, and between the stats and any text or button under them. Standard is the 64px every block uses between its intro text and its content.',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (64px, default)', value: 'standard' },
          { title: 'Loose (200px)', value: 'loose' },
          { title: 'Medium (120px)', value: 'medium' },
          { title: 'Tight (60px)', value: 'tight' },
          { title: 'None (0px)', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'closingText',
      title: 'Text under the stats',
      description: 'Optional, styled like the text under the heading. Sits above the button.',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'ctaLabel', title: 'Button label', description: 'Optional button under the stats.', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'tone',
      title: 'Background',
      description:
        'None sits straight on the page. Any other puts the stats in a panel (content width with rounded corners on desktop, edge to edge on mobile), with its own top and bottom padding below.',
      type: 'string',
      options: {
        list: [
          { title: 'None (default)', value: 'none' },
          { title: 'Muted (light grey background, dark text)', value: 'muted' },
          { title: 'Dark (dark background, light text)', value: 'dark' },
          { title: 'Accent (accent background, dark text)', value: 'accent' },
          { title: 'Image (photo under a dark tint, light text)', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'media',
      hidden: ({ parent }) => parent?.tone !== 'image',
    }),
    {
      ...paddingField('top', 'medium'),
      hidden: ({ parent }: { parent?: { tone?: string } }) => !parent?.tone || parent.tone === 'none',
    },
    {
      ...paddingField('bottom', 'medium'),
      hidden: ({ parent }: { parent?: { tone?: string } }) => !parent?.tone || parent.tone === 'none',
    },
    spacingField,
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Stat value',
              type: 'string',
              validation: (Rule) => Rule.required().max(20),
            }),
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Stats Band — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} stats`,
    }),
  },
})
