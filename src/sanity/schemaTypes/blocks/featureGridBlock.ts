import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'

// Deliberately no top-level eyebrow/heading/body — same reasoning as
// Card Grid: pair this with a separate intro block (e.g. Section
// Headline) above it when one's needed, rather than baking one in.
export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Tablet stays 2-column regardless — this only controls the desktop breakpoint.',
      type: 'string',
      options: {
        list: [
          { title: '2', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
    defineField({
      name: 'iconSize',
      title: 'Icon size',
      description: 'Large: 64px desktop / 56px mobile. Small: 32px desktop / 24px mobile.',
      type: 'string',
      options: {
        list: [
          { title: 'Large (default)', value: 'large' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),
    headingLayoutField,
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              description:
                'Optional — a curated set of Material Symbols SVGs (public/icons/), not the site\'s default Ant Design icon set (D16). Leave unset to keep the default checkmark.',
              type: 'string',
              options: {
                list: [
                  { title: 'Home / work', value: 'home_work' },
                  { title: 'Event busy', value: 'event_busy' },
                  { title: 'Lock', value: 'lock' },
                  { title: 'Work', value: 'work' },
                  { title: 'Bolt / boost', value: 'bolt_boost' },
                  { title: 'Support agent', value: 'support_agent' },
                  { title: 'Toggle off', value: 'toggle_off' },
                ],
              },
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(600),
            }),
            defineField({ name: 'ctaLabel', title: 'Link label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Link href', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Feature Grid',
      subtitle: `${items?.length ?? 0} items`,
    }),
  },
})
